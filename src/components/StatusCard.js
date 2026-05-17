import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import Card from './Card';

export default function StatusCard({ status }) {
  const eligible = status?.eligible;
  return (
    <Card style={[styles.card, { borderColor: eligible ? 'rgba(76,175,133,0.4)' : 'rgba(224,82,82,0.35)' }]}>
      <View style={[styles.icon, { backgroundColor: eligible ? colors.success : colors.primary }]}>
        <Text style={styles.iconText}>{eligible ? '✓' : '⏳'}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.kicker}>Status de doação</Text>
        <Text style={styles.title}>{status.label}</Text>
        <Text style={styles.body}>{eligible ? 'Você já pode buscar um hemocentro próximo.' : 'Respeitar o intervalo protege sua saúde.'}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  icon: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: '#fff', fontFamily: fonts.bold, fontSize: 24 },
  kicker: { fontFamily: fonts.semi, color: colors.muted, fontSize: 12, textTransform: 'uppercase' },
  title: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 22, marginTop: 2 },
  body: { fontFamily: fonts.regular, color: colors.muted, marginTop: 4 },
});
