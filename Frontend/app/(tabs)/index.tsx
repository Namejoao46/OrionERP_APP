import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { DashboardCard } from '../../components/core/DashboardCard';
import { SideMenu } from '../../components/SideMenu';
import { ActivityItem } from '../../components/ActivityItem';

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: '#020817' }}>
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

          <Text style={styles.sectionTitle}>ATIVIDADE POR PESSOA</Text>
          <View style={styles.activityBox}>
            <ActivityItem name="João Paulo" role="Dev Fullstack" progress={0.9} percentage="4,48%" isActive={true} image="https://github.com/Namejoao46.png"/>
            <ActivityItem name="Jenifer" role="Designer" progress={0.4} percentage="3,20%" isActive={false} image="https://github.com/jenifer3105.png"/>
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
  timeCardCustom: { width: '48%', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#1E2F4D', backgroundColor: '#0A1428', justifyContent: 'center' },
  timeText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  timeLabel: { color: '#94A3B8', fontSize: 10, fontWeight: '600', marginTop: 4 },
  activityBox: { backgroundColor: '#0F172A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E293B' },
});