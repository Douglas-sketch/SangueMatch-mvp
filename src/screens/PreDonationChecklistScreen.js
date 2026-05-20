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
];

export default function PreDonationChecklistScreen({ navigation }) {
  const { theme } = useThemeMode();
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
