import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface CardProps {
  title?: string;
  value: string;
  subtitle?: string;
  style?: ViewStyle;
  isSmall?: boolean;
}

export const DashboardCard = ({ title, value, subtitle, style, isSmall }: CardProps) => (
  <LinearGradient 
    colors={['rgba(27, 61, 121, 0.8)', 'rgba(10, 25, 53, 0.9)']} 
    style={[styles.card, isSmall ? styles.smallCard : styles.largeCard, style]}
  >
    {title && <Text style={styles.title}>{title}</Text>}
    <Text style={isSmall ? styles.smallValue : styles.value}>{value}</Text>
    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
  </LinearGradient>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    justifyContent: 'center',
  },
  smallCard: { width: '48%', marginBottom: 15, height: 100 },
  largeCard: { width: '100%', marginBottom: 15 },
  title: { color: '#8A97AD', fontSize: 12, marginBottom: 5, textTransform: 'uppercase' },
  value: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  smallValue: { color: '#FFF', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { color: '#8A97AD', fontSize: 10, marginTop: 5, textAlign: 'center' },
});