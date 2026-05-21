import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ConfigProvider } from '@/context/ConfigContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ConfigProvider>
      <Stack>
        {/* Tela inicial (splash) */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Login */}
        <Stack.Screen name="login" options={{ headerShown: false }} />

        {/* Área logada */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Esconde da tab bar de dev mas mantém acessível */}
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </ConfigProvider>
  );
}