import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

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
        />

        <Text style={styles.label}>SENHA:</Text>
        <TextInput 
          style={styles.input} 
          placeholder="DIGITE SUA SENHA"
          placeholderTextColor="#4E5D78"
          secureTextEntry
        />

        <View style={styles.checkboxContainer}>
          <View style={styles.checkbox} />
          <Text style={styles.checkboxText}>
            eu concordo com os <Text style={{fontWeight: 'bold'}}>termos e condições</Text>
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.replace('/(tabs)')} 
        >
          <Text style={styles.buttonText}>ENTRAR</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center' },
  logo: { width: 220, height: 120, alignSelf: 'center', marginBottom: 50 },
  form: { width: '100%' },
  label: { color: '#FFF', fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#1B2B48',
    color: '#FFF',
    paddingVertical: 8,
    marginBottom: 30,
    fontSize: 14
  },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  checkbox: { width: 18, height: 18, backgroundColor: '#FFF', marginRight: 10, borderRadius: 2 },
  checkboxText: { color: '#FFF', fontSize: 11 },
  button: {
    backgroundColor: '#007AFF',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#007AFF",
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});