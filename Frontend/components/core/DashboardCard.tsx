import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

interface CardProps {
  value: string;
  subtitle: string;
  percentage?: string;
  comparison?: string;
  type?: 'success' | 'danger' | 'warning'; // Define a cor do badge e do gráfico
  style?: ViewStyle;
}

export const DashboardCard = ({ value, subtitle, percentage, comparison, type = 'success', style }: CardProps) => {
  // Cores baseadas no status (Figma)
  const colors = {
    success: '#00C566',
    danger: '#FF4D4D',
    warning: '#FFB800',
  };

  const statusColor = colors[type];

  return (
    <LinearGradient colors={['#162641', '#0A1428']} style={[styles.card, style]}>
      {/* Topo: Valor e Gráfico */}
      <View style={styles.topRow}>
        <Text style={styles.value}>{value}</Text>
        <View style={styles.chartContainer}>
          <Svg height="20" width="45" viewBox="0 0 100 40">
            <Path
              d="M0 30 Q 25 10, 50 25 T 100 15"
              fill="none"
              stroke={statusColor} // O gráfico assume a cor do status
              strokeWidth="8"
              strokeLinecap="round"
            />
          </Svg>
        </View>
      </View>

      <Text style={styles.label}>Total de vendas</Text>

      {/* Meio: Nome da Categoria e Badge */}
      <View style={styles.middleRow}>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {percentage && (
          <View style={[styles.badge, { backgroundColor: statusColor }]}>
            <Text style={styles.badgeText}>{percentage}</Text>
          </View>
        )}
      </View>

      {/* Rodapé: Comparação */}
      {comparison && (
        <Text style={styles.comparisonText}>
          <Text style={{ color: statusColor }}>{comparison}</Text> comparado a semana anterior
        </Text>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E2F4D',
    width: '48%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  value: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  chartContainer: {
    opacity: 0.8,
  },
  label: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 8,
  },
  middleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 10,
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
  },
  comparisonText: {
    color: '#64748B',
    fontSize: 8,
    fontWeight: '600',
  },
  timeCardCustom: {
    width: '48%',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E2F4D',
    backgroundColor: '#0F172A', // Fundo escuro para combinar com os outros
    justifyContent: 'center',
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  timeLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  
  // Garanta que o row tenha o wrap para os cards não quebrarem o layout
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    flexWrap: 'wrap',
    width: '100%' 
  },
});