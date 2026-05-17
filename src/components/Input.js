import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fonts, radius } from '../constants/theme';

export default function Input({ label, error, style, ...props }) {
  return (
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#A79FA0"
        accessibilityLabel={label}
        style={[styles.input, error && styles.inputError]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: { fontFamily: fonts.semi, color: colors.secondary, marginBottom: 8, fontSize: 14 },
  input: {
    minHeight: 52,
    backgroundColor: '#fff',
    borderRadius: radius.md,
    borderWidth: 0.5,
    borderColor: colors.line,
    paddingHorizontal: 16,
    fontFamily: fonts.regular,
    color: colors.secondary,
    fontSize: 16,
  },
  inputError: { borderColor: colors.primary },
  error: { marginTop: 6, color: colors.primary, fontFamily: fonts.medium, fontSize: 12 },
});
