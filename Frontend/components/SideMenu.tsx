import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router'; 

// Importações para o Tema e Idioma
import { useConfig } from '../context/ConfigContext'; 
import Colors from '../constants/Colors'; 
import { i18n } from '../constants/Languages'; 

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

export const SideMenu = ({ visible, onClose }: SideMenuProps) => {
  // Consumindo o contexto global
  const { theme, language } = useConfig();
  
  // Proteção contra valores undefined (evita o erro 'background of undefined')
  const currentColors = Colors[theme as keyof typeof Colors] || Colors.dark;
  const texts = i18n[language as keyof typeof i18n] || i18n.pt;

  const handleGoToSettings = () => {
    onClose(); 
    router.push('/settings'); 
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.menuOverlay}>
        {/* Fundo dinâmico baseado no tema */}
        <View style={[styles.sideMenu, { backgroundColor: currentColors.background }]}>
          <View style={styles.menuHeaderSide}>
            {/* Caminho corrigido da imagem */}
            <Image source={require('../assets/images/orion.png')} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Tradução dinâmica da seção */}
          <Text style={[styles.menuSectionTitle, { color: currentColors.text + '80' }]}>GESTÃO</Text>
          
          <MenuItem 
            icon={<Ionicons name="person-circle" size={22} color={currentColors.tint} />} 
            label="Usuários" 
            textColor={currentColors.text}
          />
          <MenuItem 
            icon={<MaterialCommunityIcons name="chart-pie" size={22} color={currentColors.tint} />} 
            label="Setores" 
            textColor={currentColors.text}
          />
          <MenuItem 
            icon={<Ionicons name="document-text" size={22} color={currentColors.tint} />} 
            label="Relatórios" 
            textColor={currentColors.text}
          />

          {/* Botão de Configurações traduzido e colorido */}
          <TouchableOpacity style={styles.settingsBtn} onPress={handleGoToSettings}>
              <Ionicons name="settings-outline" size={28} color={currentColors.tint} />
              <Text style={[styles.settingsText, { color: currentColors.text }]}>
                {texts.settings.toLowerCase()}
              </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.overlayClose} activeOpacity={1} onPress={onClose} />
      </View>
    </Modal>
  );
};

// Componente MenuItem atualizado para aceitar cor de texto dinâmica
const MenuItem = ({ icon, label, textColor }: { icon: any; label: string; textColor: string }) => (
  <TouchableOpacity style={styles.menuItem}>
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
    paddingTop: 50 
  },
  logo: { width: 90, height: 25 },
  menuHeaderSide: { marginBottom: 40, alignItems: 'flex-start' },
  menuSectionTitle: { fontSize: 12, fontWeight: '800', marginBottom: 20, letterSpacing: 1 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemText: { fontSize: 16, fontWeight: '600', marginLeft: 15 },
  settingsBtn: { position: 'absolute', bottom: 40, left: 20, flexDirection: 'row', alignItems: 'center' },
  settingsText: { fontSize: 16, fontWeight: '500', marginLeft: 10 },
});