import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Image, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DashboardCard } from '../../components/core/DashboardCard';
import { SideMenu } from '../../components/SideMenu';
import { ActivityItem } from '../../components/ActivityItem';
import { useConfig } from '../../context/ConfigContext';
import Colors from '../../constants/Colors';
import { BASE_URL } from '../login';

interface Colaborador {
  id: number;
  nome: string;
  sobrenome: string;
  cargo: string;
  foto?: string; 
}

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const { theme } = useConfig();
  const currentColors = Colors[theme as keyof typeof Colors] || Colors.dark;

  const [nomeUsuario, setNomeUsuario] = useState('');
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [equipe, setEquipe] = useState<Colaborador[]>([]);
  const [carregandoEquipe, setCarregandoEquipe] = useState(true);

  useEffect(() => {
    const carregarUsuario = async () => {
      const nome      = await AsyncStorage.getItem('@UserName')      ?? '';
      const sobrenome = await AsyncStorage.getItem('@UserSobrenome') ?? '';
      const userId    = await AsyncStorage.getItem('@UserId');
      const fotoB64   = await AsyncStorage.getItem('@UserFotoBase64');

      setNomeUsuario(`${nome} ${sobrenome}`.trim());

      if (fotoB64) {
        setFotoUri(`data:image/jpeg;base64,${fotoB64}`);
      } else if (userId) {
        setFotoUri(`${BASE_URL}/api/colaboradores/${userId}/foto`);
      }
    };
    carregarUsuario();
  }, []);

  const carregarEquipe = useCallback(async () => {
    setCarregandoEquipe(true);
    try {
      const token = await AsyncStorage.getItem('@OrionToken');
      const resp = await fetch(`${BASE_URL}/api/colaboradores/equipe`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        const dados: Colaborador[] = await resp.json();
        setEquipe(dados);
      }
    } catch (e) {
      console.log('[Home] Erro ao carregar equipe:', e);
    } finally {
      setCarregandoEquipe(false);
    }
  }, []);

  useEffect(() => {
    carregarEquipe();
  }, [carregarEquipe]);

  return (
    <View style={{ flex: 1, backgroundColor: currentColors.background }}>
      <SafeAreaView style={styles.container} edges={['top']}>

        <SideMenu visible={menuVisible} onClose={() => setMenuVisible(false)} />

        <View style={styles.header}>
          <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
            <Ionicons name="menu" size={24} color="white" />
          </TouchableOpacity>
          <Image
            source={require('../../assets/images/orion.png')}
            style={styles.logoHeader}
            resizeMode="contain"
          />
          <View style={styles.avatarBorder}>
            {fotoUri ? (
              <Image source={{ uri: fotoUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: '#1B2B48', justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="person" size={16} color="#4E5D78" />
              </View>
            )}
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Saudação */}
          {nomeUsuario ? (
            <Text style={styles.greeting}>Olá, {nomeUsuario.split(' ')[0]} 👋</Text>
          ) : null}

          <Text style={styles.sectionTitle}>PAINEL DE VENDAS</Text>
          <View style={styles.row}>
            <DashboardCard value="38" subtitle="Finalizadas"   percentage="↗ 4,48%" comparison="+14" type="success" />
            <DashboardCard value="9"  subtitle="Atrasadas"     percentage="↘ 2,30%" comparison="+1"  type="danger"  />
            <DashboardCard value="22" subtitle="Em Andamento"  percentage="↗ 2,30%" comparison="-5"  type="warning" />
            <View style={styles.timeCardCustom}>
              <Text style={styles.timeText}>14:34:<Text style={{ color: '#007AFF' }}>36</Text></Text>
              <Text style={styles.timeText}>05:34:<Text style={{ color: '#007AFF' }}>36</Text></Text>
              <Text style={styles.timeLabel}>Tempo trabalhado</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>FINANCEIRO</Text>
          <View style={styles.row}>
            <DashboardCard value="R$32.350,00" subtitle="RECEITA TOTAL"   />
            <DashboardCard value="R$62.389,00" subtitle="LUCRO PREVISTO"  />
            <DashboardCard value="R$6.000,00"  subtitle="DESPESAS"        />
            <DashboardCard value="R$54.034,00" subtitle="A RECEBER"       />
          </View>

          <Text style={styles.sectionTitle}>ATIVIDADE POR PESSOA</Text>
          <View style={styles.activityBox}>
            <View style={styles.tabsInline}>
              <Text style={styles.tabActive}>PERFIL</Text>
              <Text style={styles.tabInactive}>META</Text>
              <Text style={styles.tabInactive}>GRÁFICO</Text>
            </View>

            {carregandoEquipe ? (
              <ActivityIndicator color="#007AFF" style={{ marginVertical: 20 }} />
            ) : equipe.length === 0 ? (
              <Text style={{ color: '#4E5D78', textAlign: 'center', marginVertical: 20 }}>
                Nenhum colaborador encontrado.
              </Text>
            ) : (
              equipe.map((colaborador) => (
                <ActivityItem
                  key={colaborador.id}
                  name={`${colaborador.nome} ${colaborador.sobrenome ?? ''}`.trim()}
                  role={colaborador.cargo ?? ''}
                  progress={0.7}
                  percentage="—"
                  isActive={true}
                  image={`${BASE_URL}/api/colaboradores/${colaborador.id}/foto`}
                />
              ))
            )}
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1 },
  header:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, height: 60 },
  menuBtn:         { backgroundColor: '#007AFF', padding: 6, borderRadius: 8 },
  logoHeader:      { width: 90, height: 25 },
  avatarBorder:    { padding: 2, borderRadius: 20, borderWidth: 1, borderColor: '#007AFF' },
  avatar:          { width: 30, height: 30, borderRadius: 15 },
  scrollContent:   { padding: 16 },
  greeting:        { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginBottom: 8, marginTop: 4 },
  sectionTitle:    { color: '#94A3B8', fontSize: 11, fontWeight: '800', marginBottom: 12, marginTop: 20, textTransform: 'uppercase', letterSpacing: 1 },
  row:             { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  timeCardCustom:  { width: '48%', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#1E2F4D', backgroundColor: '#0A1428', justifyContent: 'center' },
  timeText:        { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  timeLabel:       { color: '#94A3B8', fontSize: 10, fontWeight: '600', marginTop: 4 },
  activityBox:     { backgroundColor: '#0F172A', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E293B' },
  tabsInline:      { flexDirection: 'row', marginBottom: 20 },
  tabActive:       { color: '#FFF', fontSize: 12, fontWeight: 'bold', marginRight: 15, borderBottomWidth: 2, borderBottomColor: '#007AFF', paddingBottom: 4 },
  tabInactive:     { color: '#475569', fontSize: 12, marginRight: 15 },
});