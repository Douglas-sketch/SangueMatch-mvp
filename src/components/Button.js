import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radius } from '../constants/theme';

export default function Button({ title, onPress, variant = 'primary', disabled = false, loading = false, style, accessibilityLabel }) {
  const content = loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.text, variant === 'ghost' && styles.ghostText]}>{title}</Text>;

  if (variant === 'ghost') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        style={({ pressed }) => [styles.base, styles.ghost, disabled && styles.disabled, pressed && styles.pressed, style]}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      style={({ pressed }) => [styles.base, disabled && styles.disabled, pressed && styles.pressed, style]}
    >
      <LinearGradient
        colors={variant === 'dark' ? [colors.secondary, '#1F2D3C'] : [colors.primary, colors.primaryDark]}
        style={styles.gradient}
      >
        {content}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radius.lg, overflow: 'hidden' },
  gradient: { minHeight: 54, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  text: { color: '#fff', fontFamily: fonts.bold, fontSize: 16 },
  ghost: { minHeight: 48, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  ghostText: { color: colors.secondary },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.88, transform: [{ scale: 0.99 }] },
});
