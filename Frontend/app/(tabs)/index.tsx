import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// CAMINHOS CORRIGIDOS AQUI:
import { DashboardCard } from '../../components/core/DashboardCard';
import { SideMenu } from '../../components/SideMenu';
import { ActivityItem } from '../../components/ActivityItem';

// IMPORT DO TEMA PARA A HOME
import { useConfig } from '../../context/ConfigContext';
import Colors from '../../constants/Colors';

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const { theme } = useConfig();
  const currentColors = Colors[theme as keyof typeof Colors] || Colors.dark;

  return (
    <View style={{ flex: 1, backgroundColor: currentColors.background }}>
      <SafeAreaView style={styles.container} edges={['top']}>
        
        <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />

        <View style={styles.header}>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
          <Image source={require('../../assets/images/orion.png')} style={styles.logoHeader} resizeMode="contain" />
          <View style={styles.avatarBorder}>
            <Image source={{ uri: 'https://github.com/Namejoao46.png' }} style={styles.avatar} />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>PAINEL DE VENDAS</Text>
          <View style={styles.row}>
            <DashboardCard value="38" subtitle="Finalizadas" percentage="↗ 4,48%" comparison="+14" type="success" />
            <DashboardCard value="9" subtitle="Atrasadas" percentage="↘ 2,30%" comparison="+1" type="danger" />
            <DashboardCard value="22" subtitle="Em Andamento" percentage="↗ 2,30%" comparison="-5" type="warning" />
            <View style={styles.timeCardCustom}>
              <Text style={styles.timeText}>14:34:<Text style={{color:'#007AFF'}}>36</Text></Text>
              <Text style={styles.timeText}>05:34:<Text style={{color:'#007AFF'}}>36</Text></Text>
              <Text style={styles.timeLabel}>Tempo trabalhado</Text>
            </View>
          </View>
          <Text style={styles.sectionTitle}>FINANCIAS</Text>
          <View style={styles.row}>
            <DashboardCard value="R$32.350,00" subtitle="RECEITA TOTAL" />
            <DashboardCard value="3/4" subtitle="PESSOAL ATIVO" />
            <DashboardCard value="R$62.389,00" subtitle="LUCRO PREVISTO" />
            <DashboardCard value="31" subtitle="TOTAL PROJETOS" />
            <DashboardCard value="R$6.000,00" subtitle="DESPESAS" />
            <DashboardCard value="R$54.034,00" subtitle="A RECEBER" />
          </View>

          <Text style={styles.sectionTitle}>ATIVIDADE POR PESSOA</Text>
          <View style={styles.activityBox}>
            <View style={styles.tabsInline}>
              <Text style={styles.tabActive}>PERFIL</Text>
              <Text style={styles.tabInactive}>META</Text>
              <Text style={styles.tabInactive}>GRÁFICO</Text>
            </View>
            <ActivityItem name="João Paulo" role="Dev Fullstack" progress={0.9} percentage="4,48%" isActive={true} image="https://github.com/Namejoao46.png"/>
            <ActivityItem name="Jenifer" role="Designer" progress={0.4} percentage="3,20%" isActive={false} image="https://github.com/jenifer3105.png"/>
            <ActivityItem name="Leandro" role="Dev Backend" progress={0.6} percentage="5,10%" isActive={true} image="https://github.com/Brittoexe.png"/>
            <ActivityItem name="Jessica" role="Analista" progress={0.8} percentage="2,50%" isActive={true} image="https://github.com/Jessicarocha7.png"/>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// Estilos da página permanecem aqui (ou podem ir para um arquivo styles.ts separado)
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, height: 60 },
  menuBtn: { backgroundColor: '#007AFF', padding: 6, borderRadius: 8 },
  logoHeader: { width: 90, height: 25 },
  avatarBorder: { padding: 2, borderRadius: 20, borderWidth: 1, borderColor: '#007AFF' },
  avatar: { width: 30, height: 30, borderRadius: 15 },
  scrollContent: { padding: 16 },
  sectionTitle: { color: '#94A3B8', fontSize: 11, fontWeight: '800', marginBottom: 12, marginTop: 20, textTransform: 'uppercase', letterSpacing: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  
  timeCardCustom: {
    width: '48%',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E2F4D',
    backgroundColor: '#0A1428',
    justifyContent: 'center',
  },
  timeText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  timeLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '600', marginTop: 4 },

  // --- ESTILOS DO MENU LATERAL (ESQUERDA) ---
  menuOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    flexDirection: 'row' // Alinha o menu e a área de fechar lado a lado
  },
  overlayClose: { 
    flex: 1 // Ocupa o restante da tela na direita
  },
  sideMenu: { 
    width: '75%', 
    backgroundColor: '#020817', 
    borderRightWidth: 1, 
    borderRightColor: '#1E2F4D', 
    padding: 20, 
    paddingTop: 50 
  },
  menuHeaderSide: { marginBottom: 40, alignItems: 'flex-start' },
  menuSectionTitle: { color: '#94A3B8', fontSize: 12, fontWeight: '800', marginBottom: 20, letterSpacing: 1 },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginLeft: 15 },
  settingsBtn: { position: 'absolute', bottom: 40, left: 20, flexDirection: 'row', alignItems: 'center' },
  settingsText: { color: '#FFFFFF', fontSize: 16, fontWeight: '500', marginLeft: 10 },

  // --- ESTILOS ATIVIDADES ---
  activityBox: { backgroundColor: '#0F172A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E293B' },
  tabsInline: { flexDirection: 'row', marginBottom: 20 },
  tabActive: { color: '#FFF', fontSize: 12, fontWeight: 'bold', marginRight: 15, borderBottomWidth: 2, borderBottomColor: '#007AFF', paddingBottom: 4 },
  tabInactive: { color: '#475569', fontSize: 12, marginRight: 15 },
  userRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  miniAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1B2B48' },
  statusDot: { width: 10, height: 10, borderRadius: 5, position: 'absolute', bottom: 0, right: 0, borderWidth: 2, borderColor: '#0F172A' },
  userName: { color: '#F1F5F9', fontSize: 14, fontWeight: '600' },
  userRole: { color: '#64748B', fontSize: 10, marginTop: 4 },
  progressBg: { height: 4, backgroundColor: '#1E293B', borderRadius: 2, width: '70%', marginTop: 4 },
  progressFill: { height: 4, backgroundColor: '#007AFF', borderRadius: 2 },
  badge: { backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#10B981' },
  badgeText: { color: '#10B981', fontSize: 10, fontWeight: '700' }
});