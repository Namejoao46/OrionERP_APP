import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  ScrollView, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../constants/Colors';
import { i18n } from '@/constants/Languages';
import { useConfig } from '@/context/ConfigContext';
import { BASE_URL } from './login';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, setTheme, language, setLanguage } = useConfig();

  const currentColors = Colors[theme as keyof typeof Colors] || Colors.dark;
  const texts = i18n[language as keyof typeof i18n] || i18n.pt;

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cargo, setCargo] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  useEffect(() => {
    const carregarPerfil = async () => {
      const nome      = await AsyncStorage.getItem('@UserName')      ?? '';
      const sobrenome = await AsyncStorage.getItem('@UserSobrenome') ?? '';
      const cargoSalvo = await AsyncStorage.getItem('@UserCargo')    ?? '';
      const userId    = await AsyncStorage.getItem('@UserId');
      const fotoB64   = await AsyncStorage.getItem('@UserFotoBase64');

      setNomeCompleto(`${nome} ${sobrenome}`.trim());
      setCargo(cargoSalvo);

      if (fotoB64) {
        setFotoUri(`data:image/jpeg;base64,${fotoB64}`);
      } else if (userId) {
        setFotoUri(`${BASE_URL}/api/colaboradores/${userId}/foto`);
      }
    };

    carregarPerfil();
  }, []);

  const toggleTheme = () => {
    const themes: Array<'dark' | 'light' | 'lightBlue'> = ['dark', 'light', 'lightBlue'];
    const next = (themes.indexOf(theme) + 1) % themes.length;
    setTheme(themes[next]);
  };

  const handleLogout = async () => {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          router.replace('/login');
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: currentColors.background }}>
      <SafeAreaView style={styles.container}>

        <View style={styles.profileHeader}>
          {fotoUri ? (
            <Image source={{ uri: fotoUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Ionicons name="person" size={36} color="#4E5D78" />
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: currentColors.text }]}>
              {nomeCompleto || 'Carregando...'}
            </Text>
            <Text style={styles.userRole}>{cargo}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme === 'dark' ? '#1E2F4D' : '#CBD5E1' }]} />

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            {texts?.settings?.toUpperCase() ?? 'CONFIGURAÇÕES'}
          </Text>

          <SettingItem
            icon="brush-outline"
            label={`${texts.theme}: ${theme.toUpperCase()}`}
            color={currentColors.tint}
            textColor={currentColors.text}
            onPress={toggleTheme}
          />

          <SettingItem
            icon="language-outline"
            label={`${texts.language}: ${language.toUpperCase()}`}
            color={currentColors.tint}
            textColor={currentColors.text}
            onPress={() => setLanguage(language === 'pt' ? 'en' : 'pt')}
          />

          <SettingItem
            icon="exit-outline"
            label={texts.exit}
            color="#FF4B4B"
            textColor={currentColors.text}
            onPress={handleLogout}
          />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back-circle-outline" size={40} color={currentColors.tint} />
            <Text style={[styles.backText, { color: currentColors.text }]}>{texts.back}</Text>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </View>
  );
}

const SettingItem = ({ icon, label, color, textColor, onPress }: any) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.itemLeft}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.itemText, { color: textColor }]}>{label}</Text>
    </View>
    <Ionicons name="arrow-forward-circle" size={24} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container:        { flex: 1, padding: 20 },
  profileHeader:    { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar:           { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: '#00D1FF' },
  avatarPlaceholder:{ backgroundColor: '#1B2B48', justifyContent: 'center', alignItems: 'center' },
  profileInfo:      { flex: 1, marginLeft: 15 },
  userName:         { fontSize: 20, fontWeight: 'bold' },
  userRole:         { color: '#94A3B8', fontSize: 14 },
  divider:          { height: 1, marginVertical: 20 },
  content:          { flexGrow: 1 },
  sectionTitle:     { fontSize: 16, fontWeight: 'bold', marginBottom: 25, letterSpacing: 1 },
  item:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  itemLeft:         { flexDirection: 'row', alignItems: 'center' },
  itemText:         { fontSize: 18, marginLeft: 15 },
  footer:           { marginTop: 'auto' },
  backButton:       { flexDirection: 'row', alignItems: 'center', paddingBottom: 20 },
  backText:         { fontSize: 22, fontWeight: 'bold', marginLeft: 10 },
});