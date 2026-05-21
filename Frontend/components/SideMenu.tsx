import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useConfig } from '../context/ConfigContext';
import Colors from '../constants/Colors';
import { i18n } from '../constants/Languages';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

export const SideMenu = ({ visible, onClose }: SideMenuProps) => {
  const { theme, language } = useConfig();

  const currentColors = Colors[theme as keyof typeof Colors] || Colors.dark;
  const texts = i18n[language as keyof typeof i18n] || i18n.pt;

  const handleGoToSettings = () => {
    onClose();
    router.push('/settings');
  };

  const handleLogout = () => {
    onClose();
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
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.menuOverlay}>
        <View style={[styles.sideMenu, { backgroundColor: currentColors.background }]}>

          <View style={styles.menuHeaderSide}>
            <Image source={require('../assets/images/orion.png')} style={styles.logo} resizeMode="contain" />
          </View>

          <Text style={[styles.menuSectionTitle, { color: currentColors.text + '80' }]}>GESTÃO</Text>

          <MenuItem
            icon={<Ionicons name="person-circle" size={22} color={currentColors.tint} />}
            label="Usuários"
            textColor={currentColors.text}
            onPress={() => { onClose(); router.push('/(tabs)'); }}
          />
          <MenuItem
            icon={<MaterialCommunityIcons name="chart-pie" size={22} color={currentColors.tint} />}
            label="Setores"
            textColor={currentColors.text}
            onPress={() => { onClose(); alert('Módulo de Setores em desenvolvimento'); }}
          />
          <MenuItem
            icon={<Ionicons name="document-text" size={22} color={currentColors.tint} />}
            label="Relatórios"
            textColor={currentColors.text}
            onPress={() => { onClose(); alert('Módulo de Relatórios em desenvolvimento'); }}
          />

          {/* Configurações */}
          <TouchableOpacity style={styles.settingsBtn} onPress={handleGoToSettings}>
            <Ionicons name="settings-outline" size={26} color={currentColors.tint} />
            <Text style={[styles.settingsText, { color: currentColors.text }]}>
              {texts.settings.toLowerCase()}
            </Text>
          </TouchableOpacity>

          {/* Botão Sair */}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={26} color="#FF4D4D" />
            <Text style={styles.logoutText}>Sair</Text>
          </TouchableOpacity>

        </View>
        <TouchableOpacity style={styles.overlayClose} activeOpacity={1} onPress={onClose} />
      </View>
    </Modal>
  );
};

const MenuItem = ({ icon, label, textColor, onPress }: {
  icon: any;
  label: string;
  textColor: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} disabled={!onPress}>
    <View style={styles.menuItemLeft}>
      {icon}
      <Text style={[styles.menuItemText, { color: textColor }]}>{label}</Text>
    </View>
    <Ionicons name="add-circle" size={22} color="#00D1FF" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', flexDirection: 'row' },
  overlayClose: { flex: 1 },
  sideMenu: {
    width: '75%',
    borderRightWidth: 1,
    borderRightColor: '#1E2F4D',
    padding: 20,
    paddingTop: 50,
  },
  logo: { width: 90, height: 25 },
  menuHeaderSide: { marginBottom: 40, alignItems: 'flex-start' },
  menuSectionTitle: { fontSize: 12, fontWeight: '800', marginBottom: 20, letterSpacing: 1 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemText: { fontSize: 16, fontWeight: '600', marginLeft: 15 },
  settingsBtn: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsText: { fontSize: 16, fontWeight: '500', marginLeft: 10 },
  logoutBtn: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
    color: '#FF4D4D',
  },
});