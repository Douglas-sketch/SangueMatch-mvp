import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, fonts, radius } from '../constants/theme';
import { getNextAvailableDays } from '../utils/date';

export default function CalendarStrip({ selectedDate, onSelectDate }) {
  const days = getNextAvailableDays(14);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {days.map((day) => {
        const selected = selectedDate === day.id;
        return (
          <Pressable
            key={day.id}
            disabled={!day.available}
            onPress={() => onSelectDate(day.id)}
            accessibilityRole="button"
            accessibilityLabel={`${day.label}, ${day.available ? 'disponível' : 'indisponível'}`}
            style={({ pressed }) => [styles.day, selected && styles.selected, !day.available && styles.disabled, pressed && styles.pressed]}
          >
            <Text style={[styles.dayText, selected && styles.selectedText]}>{day.label}</Text>
            <Text style={[styles.sub, selected && styles.selectedText]}>{day.available ? 'Disponível' : 'Fim de semana'}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { gap: 10, paddingRight: 18 },
  day: {
    width: 112,
    minHeight: 82,
    borderRadius: radius.lg,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  disabled: { opacity: 0.35 },
  dayText: { fontFamily: fonts.bold, color: colors.secondary, textTransform: 'capitalize' },
  sub: { fontFamily: fonts.regular, color: colors.muted, marginTop: 4, fontSize: 12, textAlign: 'center' },
  selectedText: { color: '#fff' },
  pressed: { opacity: 0.85 },
});
