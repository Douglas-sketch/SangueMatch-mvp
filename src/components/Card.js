import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, shadow } from '../constants/theme';
import { useApp } from '../context/AppContext';

export default function Card({ children, style }) {
  const { accessibility } = useApp();
  return <View style={[styles.card, accessibility.highContrast && styles.highContrast, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.line,
    padding: 18,
    ...shadow,
  },
  highContrast: {
    backgroundColor: colors.highContrastCard,
    borderColor: '#fff',
  },
});
