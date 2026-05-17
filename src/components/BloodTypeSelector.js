import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BLOOD_TYPES } from '../constants/mockData';
import { colors, fonts, radius } from '../constants/theme';

export default function BloodTypeSelector({ value, onChange, includeUnknown = true }) {
  return (
    <View accessible accessibilityLabel="Seleção de tipo sanguíneo">
      <View style={styles.grid}>
        {BLOOD_TYPES.map((type) => {
          const active = value === type;
          return (
            <Pressable
              key={type}
              onPress={() => onChange(type)}
              accessibilityRole="button"
              accessibilityLabel={`Tipo sanguíneo ${type}`}
              style={({ pressed }) => [styles.item, active && styles.active, pressed && styles.pressed]}
            >
              <Text style={[styles.text, active && styles.activeText]}>{type}</Text>
            </Pressable>
          );
        })}
      </View>
      {includeUnknown ? (
        <Pressable
          onPress={() => onChange('Não sei')}
          accessibilityRole="button"
          accessibilityLabel="Não sei meu tipo sanguíneo, descobrir depois"
          style={({ pressed }) => [styles.unknown, value === 'Não sei' && styles.unknownActive, pressed && styles.pressed]}
        >
          <Text style={[styles.unknownText, value === 'Não sei' && styles.activeText]}>Não sei, descobrir depois</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  item: {
    width: '22%',
    minHeight: 62,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.line,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { fontFamily: fonts.displayBold, fontSize: 24, color: colors.secondary },
  activeText: { color: '#fff' },
  unknown: {
    marginTop: 12,
    minHeight: 54,
    borderRadius: radius.lg,
    borderWidth: 0.5,
    borderColor: colors.line,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unknownActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  unknownText: { fontFamily: fonts.semi, color: colors.secondary, fontSize: 15 },
  pressed: { opacity: 0.8 },
});
