import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import LogoMark from '../components/LogoMark';
import { colors, fonts } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function SplashScreen({ navigation }) {
  const { onboardingComplete, user } = useApp();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1600 });
    const timer = setTimeout(() => {
      navigation.replace(user && onboardingComplete ? 'Main' : 'Onboarding');
    }, 1850);
    return () => clearTimeout(timer);
  }, [navigation, onboardingComplete, progress, user]);

  const barStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));

  return (
    <LinearGradient colors={[colors.background, '#FBE7E3']} style={styles.container}>
      <LogoMark animated label />
      <Text style={styles.tagline}>Doe sangue. Salve vidas.</Text>
      <View style={styles.progressOuter} accessibilityRole="progressbar" accessibilityLabel="Carregando SangueMatch">
        <Animated.View style={[styles.progressInner, barStyle]} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  tagline: { fontFamily: fonts.medium, color: colors.muted, fontSize: 17, marginTop: 8, marginBottom: 42 },
  progressOuter: { width: '72%', height: 10, borderRadius: 99, backgroundColor: 'rgba(224,82,82,0.18)', overflow: 'hidden' },
  progressInner: { height: '100%', backgroundColor: colors.primary, borderRadius: 99 },
});
