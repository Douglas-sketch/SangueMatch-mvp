import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { QUESTIONS } from './questions';
import { useThemeMode } from '../context/ThemeContext';
import { fonts } from '../constants/theme';
import { useFontScale } from '../hooks/useFontScale';

const ENEMIES = ['Vírus', 'Trombo', 'Anticorpo incorreto'];

export default function QuestMissionScreen({ navigation }) {
  const { theme } = useThemeMode();
  const scale = useFontScale();
  const [phase, setPhase] = React.useState('playing');
  const [currentQ, setCurrentQ] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [lives, setLives] = React.useState(3);
  const [selected, setSelected] = React.useState(null);

  const wave = useSharedValue(0.7);
  const enemyScale = useSharedValue(1);
  React.useEffect(() => {
    wave.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
    enemyScale.value = withRepeat(withTiming(1.08, { duration: 700 }), -1, true);
  }, [enemyScale, wave]);

  const bgStyle = useAnimatedStyle(() => ({ opacity: wave.value }));
  const enemyStyle = useAnimatedStyle(() => ({ transform: [{ scale: enemyScale.value }] }));
  const q = QUESTIONS[currentQ];

  const goNext = () => {
    if (currentQ === QUESTIONS.length - 1) {
      setPhase(lives > 0 ? 'victory' : 'defeat');
      return;
    }
    setCurrentQ((v) => v + 1);
    setSelected(null);
    setPhase('playing');
    enemyScale.value = withRepeat(withTiming(1.08, { duration: 700 }), -1, true);
  };

  const onAnswer = (index) => {
    if (phase !== 'playing') return;
    setSelected(index);
    setPhase('answered');
    if (index === q.answer) {
      setScore((s) => s + 50);
      enemyScale.value = withTiming(0, { duration: 450 });
    } else {
      const nextLives = lives - 1;
      setLives(nextLives);
      if (nextLives <= 0) {
        setTimeout(() => setPhase('defeat'), 800);
        return;
      }
    }
    setTimeout(goNext, 1200);
  };

  if (phase === 'victory') {
    return <View style={[styles.center, { backgroundColor: theme.background }]}><Text style={[styles.title, { color: theme.text, fontSize: 30 * scale }]}>Vitória!</Text><Text style={{ color: theme.text, fontSize: 18 * scale }}>Pontuação: {score} XP</Text><Text style={{ color: theme.muted, textAlign: 'center', marginVertical: 12 }}>Agora doe sangue para converter o XP em nível real!</Text><Pressable style={[styles.btn, { backgroundColor: theme.primary }]} onPress={() => navigation.navigate('Schedule')}><Text style={styles.btnText}>Agendar doação</Text></Pressable><Pressable style={[styles.btn, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]} onPress={() => navigation.goBack()}><Text style={[styles.btnText, { color: theme.text }]}>Voltar ao BloodQuest</Text></Pressable></View>;
  }

  if (phase === 'defeat') {
    return <View style={[styles.center, { backgroundColor: theme.background }]}><Text style={[styles.title, { color: theme.text, fontSize: 28 * scale }]}>Derrota</Text><Text style={{ color: theme.muted }}>Não desista: revise e tente novamente.</Text><Pressable style={[styles.btn, { backgroundColor: theme.primary }]} onPress={() => { setPhase('playing'); setCurrentQ(0); setScore(0); setLives(3); setSelected(null); }}><Text style={styles.btnText}>Tentar novamente</Text></Pressable></View>;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.wave, bgStyle, { backgroundColor: theme.primary }]} />
      <View style={styles.header}><Text style={{ color: theme.text }}>Vidas: {'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}</Text><Text style={{ color: theme.text }}>Score: {score}</Text></View>
      <Animated.View style={[styles.enemyCard, enemyStyle, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <MaterialCommunityIcons name="virus" size={44} color={theme.primary} />
        <Text style={{ color: theme.text, fontFamily: fonts.bold }}>{ENEMIES[currentQ % ENEMIES.length]}</Text>
      </Animated.View>
      <Text style={[styles.question, { color: theme.text, fontSize: 20 * scale }]}>{q.question}</Text>
      <View style={styles.grid}>
        {q.options.map((option, idx) => {
          const letter = ['A', 'B', 'C', 'D'][idx];
          const isRight = idx === q.answer;
          const isWrongSelected = selected === idx && !isRight;
          return (
            <Pressable key={`${q.id}-${idx}`} style={[styles.option, { backgroundColor: theme.card, borderColor: theme.border }, phase === 'answered' && selected === idx && isRight && { backgroundColor: '#4CAF85' }, phase === 'answered' && isWrongSelected && { backgroundColor: '#D64045' }]} onPress={() => onAnswer(idx)}>
              <Text style={{ color: theme.text, fontFamily: fonts.bold }}>{letter}) {option}</Text>
            </Pressable>
          );
        })}
      </View>
      {phase === 'answered' && selected === q.answer ? <Text style={{ color: '#4CAF85', fontFamily: fonts.bold }}>+50 XP</Text> : null}
      {phase === 'answered' && selected !== q.answer ? <View style={[styles.expl, { backgroundColor: theme.card, borderColor: theme.border }]}><Text style={{ color: theme.text }}>{q.explanation}</Text></View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  wave: { ...StyleSheet.absoluteFillObject },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40 },
  enemyCard: { alignItems: 'center', padding: 16, borderWidth: 1, borderRadius: 16, marginTop: 14 },
  question: { marginVertical: 16, fontFamily: fonts.displayBold },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  option: { width: '48%', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  expl: { borderWidth: 1, borderRadius: 12, padding: 12, marginTop: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontFamily: fonts.displayBold, marginBottom: 12 },
  btn: { minHeight: 48, borderRadius: 12, paddingHorizontal: 18, justifyContent: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontFamily: fonts.bold },
});
