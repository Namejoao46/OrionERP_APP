import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Alert, Platform, ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Trocar pelo IP da máquina ao rodar  
// Em emulador Android use 10.0.2.2; em simulador iOS e web use localhost
export const BASE_URL = 'http://localhost:8080';

export default function LoginScreen() {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const mostrarAlerta = (titulo: string, mensagem: string) => {
    if (Platform.OS === 'web') {
      alert(`${titulo}: ${mensagem}`);
    } else {
      Alert.alert(titulo, mensagem);
    }
  };

  const efetuarLogin = async () => {
    if (!login || !senha) {
      mostrarAlerta('Erro', 'Preencha todos os campos!');
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, senha }),
      });

      if (resposta.ok) {
        const dados = await resposta.json();

        await AsyncStorage.multiSet([
          ['@OrionToken',    dados.token                         ?? ''],
          ['@UserId',        String(dados.id ?? '')                   ],
          ['@UserLogin',     dados.login                         ?? ''],
          ['@UserName',      dados.nome                          ?? ''],
          ['@UserSobrenome', dados.sobrenome                     ?? ''],
          ['@UserRole',      dados.role                          ?? ''],
          ['@UserCargo',     dados.cargo                         ?? ''],
          ['@UserCpf',       dados.cpf                           ?? ''],
          ['@UserMatricula', dados.matricula                     ?? ''],
          ['@UserEndereco',  dados.endereco                      ?? ''],
          ['@EmpresaId',     String(dados.empresaId ?? '')            ],
          ['@UserFotoBase64',dados.foto                          ?? ''],
        ]);

        router.replace('/(tabs)');
      } else {
        mostrarAlerta('Erro', 'Usuário ou senha incorretos.');
      }
    } catch (err) {
      console.error('[Login] Erro:', err);
      mostrarAlerta('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <LinearGradient colors={['#041433', '#010817']} style={styles.container}>
      <Image
        source={require('../assets/images/orion.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={styles.form}>
        <Text style={styles.label}>USUÁRIO:</Text>
        <TextInput
          style={styles.input}
          placeholder="DIGITE SEU USUÁRIO OU MATRÍCULA"
          placeholderTextColor="#4E5D78"
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
        />

        <Text style={styles.label}>SENHA:</Text>
        <TextInput
          style={styles.input}
          placeholder="DIGITE SUA SENHA"
          placeholderTextColor="#4E5D78"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          style={[styles.button, carregando && styles.buttonDisabled]}
          onPress={efetuarLogin}
          disabled={carregando}
        >
          {carregando
            ? <ActivityIndicator color="#FFF" />
            : <Text style={styles.buttonText}>ENTRAR</Text>
          }
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, padding: 30, justifyContent: 'center' },
  logo:           { width: 220, height: 120, alignSelf: 'center', marginBottom: 50 },
  form:           { width: '100%' },
  label:          { color: '#FFF', fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  input:          { borderBottomWidth: 1, borderBottomColor: '#1B2B48', color: '#FFF', paddingVertical: 8, marginBottom: 30, fontSize: 14 },
  button:         { backgroundColor: '#007AFF', height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  buttonDisabled: { backgroundColor: '#1B2B48' },
  buttonText:     { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});