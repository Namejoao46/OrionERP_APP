import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

// Helper para os ícones das abas
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Cores baseadas no tema dark do OrionERP
        tabBarActiveTintColor: '#38BDF8', 
        tabBarInactiveTintColor: '#8A97AD',
        tabBarStyle: { 
          backgroundColor: '#010817', 
          borderTopColor: '#1B2B48',
          height: 60,
          paddingBottom: 8
        },
        headerShown: false, // Escondemos o header padrão para usar o personalizado da Home
      }}>
      
      <Tabs.Screen
        name="index" // Deve ser "index" se o arquivo for app/(tabs)/index.tsx
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="two"
        options={{
          title: 'Gráficos',
          tabBarIcon: ({ color }) => <TabBarIcon name="bar-chart" color={color} />,
        }}
      />
    </Tabs>
  );
}