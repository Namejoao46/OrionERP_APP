import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import { i18n } from '@/constants/Languages';
import { useConfig } from '@/context/ConfigContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, setTheme, language, setLanguage } = useConfig();

  const currentColors = Colors[theme as keyof typeof Colors] || Colors.dark;
  const texts = i18n[language as keyof typeof i18n] || i18n.pt;

  const toggleTheme = () => {
    const themes: Array<'dark' | 'light' | 'lightBlue'> = ['dark', 'light', 'lightBlue'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => router.replace('/login'),
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: currentColors.background }}>
      <SafeAreaView style={styles.container}>

        <View style={styles.profileHeader}>
          <Image source={{ uri: 'https://github.com/Namejoao46.png' }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={[styles.userName, { color: currentColors.text }]}>João Paulo</Text>
            <Text style={styles.userRole}>Desenvolvedor FullStack</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme === 'dark' ? '#1E2F4D' : '#CBD5E1' }]} />

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.sectionTitle, { color: currentColors.text }]}>
            {texts?.settings?.toUpperCase() || "CONFIGURAÇÕES"}
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

          {/* Logout com função real */}
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
  container: { flex: 1, padding: 20 },
  profileHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  avatar: { width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: '#00D1FF' },
  profileInfo: { flex: 1, marginLeft: 15 },
  userName: { fontSize: 20, fontWeight: 'bold' },
  userRole: { color: '#94A3B8', fontSize: 14 },
  divider: { height: 1, marginVertical: 20 },
  content: { flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 25, letterSpacing: 1 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemText: { fontSize: 18, marginLeft: 15 },
  footer: { marginTop: 'auto' },
  backButton: { flexDirection: 'row', alignItems: 'center', paddingBottom: 20 },
  backText: { fontSize: 22, fontWeight: 'bold', marginLeft: 10 }
});