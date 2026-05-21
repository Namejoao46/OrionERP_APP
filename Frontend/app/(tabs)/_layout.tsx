import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useConfig } from '@/context/ConfigContext';
import Colors from '@/constants/Colors';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { theme } = useConfig();
  const currentColors = Colors[theme as keyof typeof Colors] || Colors.dark;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: currentColors.tint,
        tabBarInactiveTintColor: '#8A97AD',
        tabBarStyle: {
          backgroundColor: currentColors.background,
          borderTopColor: theme === 'dark' ? '#1B2B48' : '#CBD5E1',
          height: 60,
          paddingBottom: 8
        },
        headerShown: false,
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="two"
        options={{
          title: 'Mensagens',
          tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />,
        }}
      />
    </Tabs>
  );
}