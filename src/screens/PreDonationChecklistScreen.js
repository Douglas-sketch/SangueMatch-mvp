<<<<<<< HEAD
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useThemeMode } from '../context/ThemeContext';

const KEY = '@checklist:predonation';
const ITEMS = [
  'Bebi pelo menos 2 copos de água hoje',
  'Não estou em jejum (comi algo leve)',
  'Dormi pelo menos 6 horas ontem',
  'Não tomei antibiótico nos últimos 7 dias',
  'Não fiz tatuagem nos últimos 6 meses',
  'Estou me sentindo bem de saúde hoje',
  'Não consumi bebida alcoólica nas últimas 12 horas',
  'Peso acima de 50 kg',
=======
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeMode } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { colors, fonts } from '../constants/theme';
import Button from '../components/Button';
import Card from '../components/Card';
import { useFontScale } from '../hooks/useFontScale';

const STORAGE_KEY = '@checklist:predonation';

const ITEMS = [
  { key: 'water', label: 'Bebi pelo menos 2 copos de água hoje' },
  { key: 'notFasting', label: 'Não estou em jejum (comi algo leve)' },
  { key: 'sleep', label: 'Dormi pelo menos 6 horas ontem' },
  { key: 'noAntibiotic', label: 'Não tomei antibiótico nos últimos 7 dias' },
  { key: 'noTattoo', label: 'Não fiz tatuagem nos últimos 6 meses' },
  { key: 'healthy', label: 'Estou me sentindo bem de saúde hoje' },
  { key: 'noAlcohol', label: 'Não consumi bebida alcoólica nas últimas 12 horas' },
  { key: 'weight', label: 'Peso acima de 50 kg' },
>>>>>>> 78fb240 (Correções)
];

export default function PreDonationChecklistScreen({ navigation }) {
  const { theme } = useThemeMode();
<<<<<<< HEAD
  const [checked, setChecked] = React.useState({});
  const anim = useSharedValue(1);
  React.useEffect(() => { AsyncStorage.getItem(KEY).then((v) => { if (v) { const data = JSON.parse(v); const today = new Date().toDateString(); if (data.day === today) setChecked(data.checked); else AsyncStorage.removeItem(KEY); } }); }, []);
  const toggle = async (i) => {
    anim.value = withSpring(1.2, {}, () => { anim.value = withSpring(1); });
    const next = { ...checked, [i]: !checked[i] };
    setChecked(next);
    await AsyncStorage.setItem(KEY, JSON.stringify({ day: new Date().toDateString(), checked: next }));
  };
  const count = Object.values(checked).filter(Boolean).length;
  const done = count === ITEMS.length;

  return <View style={{ flex: 1, backgroundColor: theme.background, padding: 20 }}><Text style={{ color: theme.text, fontWeight: '700', fontSize: 24 }}>Checklist pré-doação</Text><Text style={{ color: theme.muted }}>Verifique antes de ir ao hemocentro</Text><View style={{ height: 10, backgroundColor: theme.border, borderRadius: 999, marginVertical: 14 }}><View style={{ width: `${(count / ITEMS.length) * 100}%`, height: 10, backgroundColor: theme.primary, borderRadius: 999 }} /></View>{ITEMS.map((item, i) => <Pressable key={item} onPress={() => toggle(i)} style={{ backgroundColor: theme.card, borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}><MaterialCommunityIcons name={checked[i] ? 'check-circle' : 'circle-outline'} color={checked[i] ? '#4CAF85' : theme.muted} size={20} /><Text style={{ color: theme.text, flex: 1 }}>{item}</Text></Pressable>)}{done ? <View style={{ marginTop: 10 }}><Text style={{ color: '#4CAF85', fontWeight: '700' }}>Tudo certo! Você está preparado para doar.</Text><Pressable onPress={() => navigation.navigate('Schedule')} style={{ backgroundColor: theme.primary, padding: 12, borderRadius: 12, marginTop: 10 }}><Text style={{ color: '#fff' }}>Ir para agendamento</Text></Pressable></View> : null}</View>;
}
=======
  const scale = useFontScale();
  const [state, setState] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [celebration, setCelebration] = useState(false);

  useEffect(() => {
    loadChecklist();
  }, []);

  async function loadChecklist() {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setLoaded(true);
        return;
      }
      const parsed = JSON.parse(stored);
      const sameDay = parsed?.date === new Date().toISOString().slice(0, 10);
      setState(sameDay ? parsed.items : {});
    } catch (error) {
      setState({});
    } finally {
      setLoaded(true);
    }
  }

  function toggleItem(key) {
    const next = { ...state, [key]: !state[key] };
    setState(next);
    if (Object.values(next).every(Boolean)) {
      setCelebration(true);
    } else {
      setCelebration(false);
    }
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ date: new Date().toISOString().slice(0, 10), items: next }));
  }

  const completedCount = useMemo(() => Object.values(state).filter(Boolean).length, [state]);
  const allCompleted = completedCount === ITEMS.length;

  const progress = (completedCount / ITEMS.length) * 100;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.heading, { color: theme.secondary, fontSize: 28 * scale }]}>Checklist pré-doação</Text>
      <Text style={[styles.subtitle, { color: theme.muted, fontSize: 16 * scale }]}>Verifique antes de ir ao hemocentro.</Text>

      <Card style={styles.progressCard}>
        <Text style={[styles.progressLabel, { color: theme.secondary, fontSize: 16 * scale }]}>{completedCount} de {ITEMS.length} itens prontos</Text>
        <View style={styles.progressBar} accessibilityRole="progressbar" accessibilityLabel={`Progresso ${Math.round(progress)} por cento`}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: theme.primary }]} />
        </View>
      </Card>

      {ITEMS.map((item) => {
        const checked = Boolean(state[item.key]);
        const scaleValue = useSharedValue(1);
        const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scaleValue.value }] }));

        function handlePress() {
          scaleValue.value = withSpring(1.1);
          setTimeout(() => { scaleValue.value = withSpring(1); }, 150);
          toggleItem(item.key);
        }

        return (
          <Pressable
            key={item.key}
            onPress={handlePress}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            accessibilityHint={checked ? 'Desmarca este item' : 'Marca este item como conferido'}
            style={({ pressed }) => [styles.checkItem, pressed && styles.pressed]}
          >
            <Animated.View style={[styles.checkIcon, animatedStyle, { backgroundColor: checked ? theme.primary : theme.card, borderColor: theme.border }]}> 
              <Text style={[styles.checkMark, { color: checked ? '#fff' : theme.muted }]}>{checked ? '✓' : ''}</Text>
            </Animated.View>
            <Text style={[styles.checkText, { color: theme.text, fontSize: 16 * scale }]}>{item.label}</Text>
          </Pressable>
        );
      })}

      {allCompleted ? (
        <Card style={[styles.successCard, { borderColor: colors.success }]}> 
          <Text style={[styles.successTitle, { fontSize: 22 * scale }]}>Tudo certo!</Text>
          <Text style={[styles.successText, { fontSize: 16 * scale }]}>Você está preparado para doar.</Text>
        </Card>
      ) : null}

      <Button
        title="Ir para agendamento"
        onPress={() => navigation.navigate('Schedule')}
        disabled={!allCompleted}
        accessibilityHint="Abre a tela de agendamento após completar o checklist."        
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  heading: { fontFamily: fonts.displayBold, marginBottom: 6 },
  subtitle: { fontFamily: fonts.regular, marginBottom: 22, lineHeight: 22 },
  progressCard: { padding: 18, marginBottom: 18 },
  progressLabel: { fontFamily: fonts.bold, marginBottom: 10 },
  progressBar: { height: 12, borderRadius: 999, backgroundColor: '#EDE7E5', overflow: 'hidden' },
  progressFill: { height: '100%' },
  checkItem: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: 18, backgroundColor: '#fff', marginBottom: 12, borderWidth: 1, borderColor: '#E7E2E0' },
  checkIcon: { width: 32, height: 32, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  checkMark: { fontFamily: fonts.displayBold, fontSize: 18 },
  checkText: { flex: 1, fontFamily: fonts.regular },
  successCard: { padding: 18, borderWidth: 1, borderRadius: 20, marginVertical: 18 },
  successTitle: { fontFamily: fonts.displayBold, marginBottom: 8, color: colors.success },
  successText: { fontFamily: fonts.regular, color: colors.muted },
  pressed: { opacity: 0.88 },
});
>>>>>>> 78fb240 (Correções)
