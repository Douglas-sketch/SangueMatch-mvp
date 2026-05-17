import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { colors, fonts, radius } from '../constants/theme';

export default function BadgeItem({ badge, unlocked }) {
  const glow = useSharedValue(0.3);

  useEffect(() => {
    if (unlocked) {
      glow.value = withRepeat(withSequence(withTiming(1, { duration: 900 }), withTiming(0.35, { duration: 900 })), -1, true);
    }
  }, [glow, unlocked]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: unlocked ? 1 : 0.45,
    transform: [{ scale: unlocked ? 1 : 0.96 }],
    shadowOpacity: unlocked ? glow.value * 0.22 : 0,
  }));

  return (
    <Animated.View style={[styles.card, unlocked && styles.unlocked, animatedStyle]} accessibilityRole="image" accessibilityLabel={`${badge.title}, ${unlocked ? 'desbloqueada' : 'bloqueada'}`}>
      <Text style={[styles.emoji, !unlocked && styles.lockedEmoji]}>{unlocked ? badge.emoji : '🔒'}</Text>
      <Text style={styles.title}>{badge.title}</Text>
      <Text style={styles.description}>{badge.description}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 138,
    borderRadius: radius.lg,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: colors.line,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 18,
    elevation: 2,
  },
  unlocked: { borderColor: 'rgba(224,82,82,0.38)' },
  emoji: { fontSize: 34, marginBottom: 8 },
  lockedEmoji: { opacity: 0.7 },
  title: { fontFamily: fonts.bold, color: colors.secondary, textAlign: 'center', fontSize: 15 },
  description: { fontFamily: fonts.regular, color: colors.muted, textAlign: 'center', marginTop: 4, fontSize: 12 },
});
