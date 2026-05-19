import React from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import { colors, fonts, radius } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useThemeMode } from '../context/ThemeContext';

function ToggleRow({ title, subtitle, value, onValueChange }) {
  return (
    <View style={styles.toggleRow} accessible accessibilityLabel={`${title}. ${value ? 'ativado' : 'desativado'}`}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ true: colors.primary, false: '#DDD' }} thumbColor="#fff" />
    </View>
  );
}

export default function AccessibilityScreen() {
  const { accessibility, updateAccessibility } = useApp();
  const { mode, toggleTheme } = useThemeMode();
  const levels = [
    { id: 'small', label: 'Pequena' },
    { id: 'normal', label: 'Normal' },
    { id: 'large', label: 'Grande' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionTitle title="Acessibilidade" subtitle="Ajustes locais para melhorar leitura, contraste e navegação por leitor de tela." />
      <Card>
        <ToggleRow title="Modo escuro" subtitle="Ative o tema escuro global" value={mode === 'dark'} onValueChange={(value) => toggleTheme(value ? 'dark' : 'light')} />
        <ToggleRow title="Alto contraste" subtitle="Aumenta contraste visual nos cards." value={accessibility.highContrast} onValueChange={(value) => updateAccessibility({ highContrast: value })} />
        <ToggleRow title="Leitor de tela" subtitle="Mantém foco em labels claros e botões descritivos." value={accessibility.screenReader} onValueChange={(value) => updateAccessibility({ screenReader: value })} />
        <ToggleRow title="Modo daltônico" subtitle="Troca reforços visuais de cor por estados e textos." value={accessibility.colorBlind} onValueChange={(value) => updateAccessibility({ colorBlind: value })} />
      </Card>

      <Text style={styles.section}>Tamanho da fonte</Text>
      <View style={styles.fontRow}>
        {levels.map((level) => {
          const active = accessibility.fontScale === level.id;
          return (
            <Pressable key={level.id} onPress={() => updateAccessibility({ fontScale: level.id })} accessibilityRole="button" accessibilityLabel={`Fonte ${level.label}`} style={[styles.fontButton, active && styles.fontButtonActive]}>
              <Text style={[styles.fontText, active && styles.fontTextActive]}>{level.label}</Text>
            </Pressable>
          );
        })}
      </View>
      <Card style={styles.preview}>
        <Text style={[styles.previewTitle, accessibility.fontScale === 'large' && styles.large, accessibility.fontScale === 'small' && styles.small]}>Prévia de leitura</Text>
        <Text style={[styles.previewBody, accessibility.fontScale === 'large' && styles.largeBody, accessibility.fontScale === 'small' && styles.smallBody]}>Doe sangue, salve vidas e acompanhe sua jornada de impacto social pelo SangueMatch.</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 110 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: colors.line },
  rowTitle: { fontFamily: fonts.bold, color: colors.secondary, fontSize: 16 },
  rowSubtitle: { fontFamily: fonts.regular, color: colors.muted, marginTop: 3, lineHeight: 19 },
  section: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 24, marginTop: 24, marginBottom: 12 },
  fontRow: { flexDirection: 'row', gap: 10 },
  fontButton: { flex: 1, minHeight: 54, borderRadius: radius.lg, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: colors.line },
  fontButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  fontText: { fontFamily: fonts.bold, color: colors.secondary },
  fontTextActive: { color: '#fff' },
  preview: { marginTop: 16 },
  previewTitle: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 24 },
  previewBody: { fontFamily: fonts.regular, color: colors.muted, marginTop: 8, lineHeight: 22, fontSize: 15 },
  large: { fontSize: 30 },
  small: { fontSize: 20 },
  largeBody: { fontSize: 18, lineHeight: 27 },
  smallBody: { fontSize: 13, lineHeight: 19 },
});
