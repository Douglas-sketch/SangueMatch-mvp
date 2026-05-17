import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

export default function SectionTitle({ title, subtitle }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 12, marginTop: 4 },
  title: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 24 },
  subtitle: { fontFamily: fonts.regular, color: colors.muted, marginTop: 3, lineHeight: 20 },
});
