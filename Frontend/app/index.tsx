import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  withSequence
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  const router = useRouter();
  const scale = useSharedValue(0.3);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  useEffect(() => {
    // Efeito de pulso e entrada
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withSequence(
      withTiming(1.2, { duration: 600, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 400 })
    );

    const timer = setTimeout(() => {
      router.replace('/login'); // Vai para a tela de login
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#041433', '#010817']} style={styles.container}>
      <Animated.View style={animatedStyle}>
        {/* Substitua pelo nome real da sua imagem em assets */}
        <Animated.Image 
          source={require('../assets/images/orion.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 250, height: 250 },
});