import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { DashboardCard } from '../../components/core/DashboardCard';

export default function HomeScreen() {
  return (
    <LinearGradient colors={['#041433', '#010817']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container} edges={['top']}>
        
        {/* HEADER CUSTOMIZADO (OrionERP + Avatar) */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuBtn}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
          <Image source={require('../../assets/images/orion.png')} style={styles.logoHeader} resizeMode="contain" />
          <Image source={{ uri: 'https://github.com/joaopaulo.png' }} style={styles.avatar} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* SEÇÃO VENDAS */}
          <Text style={styles.sectionTitle}>PAINEL DE VENDAS</Text>
          <View style={styles.row}>
            <DashboardCard title="Finalizadas" value="38" subtitle="+14 vs semana anterior" style={{width: '48%'}} />
            <DashboardCard title="Atrasadas" value="9" subtitle="+1 vs semana anterior" style={{width: '48%'}} />
          </View>
          <DashboardCard title="Vendas em Andamento" value="22" subtitle="+8 vs semana anterior" />

          {/* SEÇÃO FINANCIAS (Grid de Cards) */}
          <Text style={styles.sectionTitle}>FINANCIAS</Text>
          <View style={styles.row}>
            <DashboardCard value="R$32.350,00" subtitle="RECEITA TOTAL" isSmall />
            <DashboardCard value="3/4" subtitle="PESSOAL ATIVO" isSmall />
            <DashboardCard value="R$62.389,00" subtitle="LUCRO PREVISTO" isSmall />
            <DashboardCard value="31" subtitle="TOTAL PROJETOS" isSmall />
            <DashboardCard value="R$6.000,00" subtitle="DESPESAS" isSmall />
            <DashboardCard value="R$54.034,00" subtitle="A RECEBER" isSmall />
          </View>

          {/* ATIVIDADE POR PESSOA */}
          <Text style={styles.sectionTitle}>ATIVIDADE POR PESSOA</Text>
          <View style={styles.activityContainer}>
            <View style={styles.tabButtons}>
              <Text style={styles.tabActive}>PERFIL</Text>
              <Text style={styles.tabInactive}>META</Text>
              <Text style={styles.tabInactive}>GRAFICO</Text>
            </View>

            {['João Paulo', 'Jenifer', 'Leandro'].map((user, i) => (
              <View key={i} style={styles.userRow}>
                <View style={styles.userAvatarPlaceholder} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.userName}>{user}</Text>
                  <Text style={styles.userRole}>Especialista Orion</Text>
                </View>
                <View style={styles.badgeSuccess}>
                  <Text style={styles.badgeText}>4,48%</Text>
                </View>
              </View>
            ))}
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(56, 189, 248, 0.1)'
  },
  menuBtn: { backgroundColor: '#007AFF', padding: 8, borderRadius: 10 },
  logoHeader: { width: 120, height: 35 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#38BDF8' },
  scrollContent: { padding: 20 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 15, marginTop: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  activityContainer: { marginTop: 10 },
  tabButtons: { flexDirection: 'row', marginBottom: 15 },
  tabActive: { color: '#FFF', marginRight: 15, borderBottomWidth: 2, borderBottomColor: '#007AFF', paddingBottom: 4 },
  tabInactive: { color: '#8A97AD', marginRight: 15 },
  userRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    padding: 12, 
    borderRadius: 15, 
    marginBottom: 10 
  },
  userAvatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1B2B48' },
  userName: { color: '#FFF', fontWeight: 'bold' },
  userRole: { color: '#8A97AD', fontSize: 12 },
  badgeSuccess: { backgroundColor: '#00C566', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: 'bold' }
});