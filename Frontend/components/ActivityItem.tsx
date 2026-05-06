import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface ActivityProps {
  name: string;
  role: string;
  progress: number;
  percentage: string;
  isActive: boolean;
  image: string;
}

export const ActivityItem = ({ name, role, progress, percentage, isActive, image }: ActivityProps) => (
  <View style={styles.userRow}>
    <View style={styles.userInfo}>
      <View>
        <Image source={{ uri: image }} style={styles.miniAvatar} />
        <View style={[styles.statusDot, { backgroundColor: isActive ? '#00C566' : '#64748B' }]} />
      </View>
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={styles.userName}>{name}</Text>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.userRole}>{role}</Text>
      </View>
    </View>
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{percentage}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
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