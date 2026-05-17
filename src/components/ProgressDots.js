import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../constants/theme';

export default function ProgressDots({ total, index }) {
  return (
    <View style={styles.row} accessibilityRole="progressbar" accessibilityLabel={`Slide ${index + 1} de ${total}`}>
      {Array.from({ length: total }).map((_, itemIndex) => (
        <View key={itemIndex} style={[styles.dot, itemIndex === index && styles.active]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 8, backgroundColor: 'rgba(224,82,82,0.25)' },
  active: { width: 28, backgroundColor: colors.primary },
});
