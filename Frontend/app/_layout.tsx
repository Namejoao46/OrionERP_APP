import { ConfigProvider } from '@/context/ConfigContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <ConfigProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" />
      </Stack>
    </ConfigProvider>
  );
}