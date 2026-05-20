import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useConfig } from '@/context/ConfigContext';
import Colors from '../../constants/Colors';

const BACKEND_IP = "localhost"; 
const API_URL = `http://${BACKEND_IP}:8080/api/mensagens`;

interface Mensagem {
  id: string;
  texto: string;
  souEu: boolean;
}

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const { theme } = useConfig();
  const currentColors = Colors[theme as keyof typeof Colors] || Colors.dark;

  const meuUsuario = (params.usuario as string) || 'admin';
  const destinatario = meuUsuario === 'admin' ? 'admin2' : 'admin';

  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [textoInput, setTextoInput] = useState('');

  useEffect(() => {
    async function registrarDispositivo() {
      try {
        console.log(`[Chat] Tentando registrar token para: ${meuUsuario}`);
        await fetch(`${API_URL}/registrar-token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: meuUsuario,
            token: `ExponentPushToken[MOCK_TOKEN_${meuUsuario.toUpperCase()}]`
          })
        });
        console.log('[Chat] Token registrado com sucesso no backend!');
      } catch (error) {
        console.log('[Chat] Erro ao registrar dispositivo no backend:', error);
      }
    }
    registrarDispositivo();
  }, [meuUsuario]);

  const enviarMensagem = async () => {
    if (textoInput.trim() === '') return;

    const novaMensagem: Mensagem = {
      id: Date.now().toString(),
      texto: textoInput,
      souEu: true
    };

    setMensagens(prev => [...prev, novaMensagem]);
    const mensagemParaEnviar = textoInput;
    setTextoInput('');

    try {
      await fetch(`${API_URL}/enviar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remetente: meuUsuario,
          destinatario: destinatario,
          mensagem: mensagemParaEnviar
        })
      });
    } catch (error) {
      console.log('[Chat] Erro ao trafegar mensagem para o servidor:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={[styles.container, { backgroundColor: currentColors.background }]}
    >
      {/* Cabeçalho do Chat */}
      <View style={styles.header}>
        <Ionicons name="chatbubbles-outline" size={28} color="#00D1FF" />
        <View style={styles.headerInfo}>
          <Text style={[styles.headerTitle, { color: currentColors.text }]}>
            Conversa com {destinatario === 'admin' ? 'Leandro (admin)' : 'João Paulo (admin2)'}
          </Text>
          <Text style={styles.headerSubtitle}>Logado como: {meuUsuario}</Text>
        </View>
      </View>

      {/* Lista de mensagens enviadas */}
      <FlatList
        data={mensagens}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.balaoContainer, 
            item.souEu ? styles.minhaMensagemContainer : styles.outraMensagemContainer
          ]}>
            <View style={[
              styles.balao, 
              item.souEu ? styles.minhaMensagem : styles.outraMensagem
            ]}>
              <Text style={styles.mensagemTexto}>{item.texto}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listaMensagens}
      />

      {/* Barra inferior para digitação de texto */}
      <View style={[styles.inputBar, { borderTopColor: theme === 'dark' ? '#1E2F4D' : '#CBD5E1' }]}>
        <TextInput
          style={[styles.input, { color: currentColors.text }]}
          placeholder="Escreva sua mensagem..."
          placeholderTextColor="#4E5D78"
          value={textoInput}
          onChangeText={setTextoInput}
        />
        <TouchableOpacity style={styles.sendButton} onPress={enviarMensagem}>
          <Ionicons name="send" size={22} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingTop: 50, 
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2F4D'
  },
  headerInfo: { marginLeft: 15 },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  headerSubtitle: { color: '#94A3B8', fontSize: 12, marginTop: 2 },
  listaMensagens: { padding: 20, paddingBottom: 10 },
  balaoContainer: { flexDirection: 'row', marginBottom: 15, width: '100%' },
  minhaMensagemContainer: { justifyContent: 'flex-end' },
  outraMensagemContainer: { justifyContent: 'flex-start' },
  balao: { padding: 12, borderRadius: 18, maxWidth: '80%' },
  minhaMensagem: { backgroundColor: '#007AFF', borderBottomRightRadius: 2 },
  outraMensagem: { backgroundColor: '#1E2F4D', borderBottomLeftRadius: 2 },
  mensagemTexto: { color: '#FFF', fontSize: 15 },
  inputBar: { 
    flexDirection: 'row', 
    padding: 15, 
    alignItems: 'center',
    borderTopWidth: 1,
  },
  input: { flex: 1, height: 45, fontSize: 15, paddingHorizontal: 10 },
  sendButton: { 
    backgroundColor: '#007AFF', 
    width: 45, 
    height: 45, 
    borderRadius: 22.5, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: 10
  }
});