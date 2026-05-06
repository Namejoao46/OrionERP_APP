import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

export const SideMenu = ({ visible, onClose }: SideMenuProps) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.menuOverlay}>
        <View style={styles.sideMenu}>
          <View style={styles.menuHeaderSide}>
            <Image source={require('../../assets/images/orion.png')} style={styles.logo} resizeMode="contain" />
          </View>

          <Text style={styles.menuSectionTitle}>GESTÃO</Text>
          
          <MenuItem icon={<Ionicons name="person-circle" size={22} color="#007AFF" />} label="Usuários" />
          <MenuItem icon={<MaterialCommunityIcons name="chart-pie" size={22} color="#007AFF" />} label="Setores" />
          <MenuItem icon={<Ionicons name="document-text" size={22} color="#007AFF" />} label="Relatórios" />

          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={24} color="#00D1FF" />
            <Text style={styles.settingsText}>configurações</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.overlayClose} activeOpacity={1} onPress={onClose} />
      </View>
    </Modal>
  );
};

const MenuItem = ({ icon, label }: { icon: any; label: string }) => (
  <TouchableOpacity style={styles.menuItem}>
    <View style={styles.menuItemLeft}>
      {icon}
      <Text style={styles.menuItemText}>{label}</Text>
    </View>
    <Ionicons name="add-circle" size={22} color="#00D1FF" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  menuOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', flexDirection: 'row' },
  overlayClose: { flex: 1 },
  sideMenu: { width: '75%', backgroundColor: '#020817', borderRightWidth: 1, borderRightColor: '#1E2F4D', padding: 20, paddingTop: 50 },
  logo: { width: 90, height: 25 },
  menuHeaderSide: { marginBottom: 40, alignItems: 'flex-start' },
  menuSectionTitle: { color: '#94A3B8', fontSize: 12, fontWeight: '800', marginBottom: 20, letterSpacing: 1 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginLeft: 15 },
  settingsBtn: { position: 'absolute', bottom: 40, left: 20, flexDirection: 'row', alignItems: 'center' },
  settingsText: { color: '#FFFFFF', fontSize: 16, fontWeight: '500', marginLeft: 10 },
});