import React from 'react';
<<<<<<< HEAD
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { QUESTIONS } from './questions';
import { useThemeMode } from '../context/ThemeContext';
import { fonts } from '../constants/theme';
import { useFontScale } from '../hooks/useFontScale';

const ENEMIES = ['Vírus', 'Trombo', 'Anticorpo incorreto'];
=======
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSpring } from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { useThemeMode } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { QUESTIONS } from './questions';
import Button from '../components/Button';
import { colors, fonts } from '../constants/theme';
import { useFontScale } from '../hooks/useFontScale';

const ENEMY_NAMES = ['Vírus', 'Trombo', 'Anticorpo incorreto', 'Bactéria', 'Desafio sanguíneo'];
>>>>>>> 78fb240 (Correções)

export default function QuestMissionScreen({ navigation }) {
  const { theme } = useThemeMode();
  const scale = useFontScale();
<<<<<<< HEAD
=======
  const { user, stats } = useApp();
>>>>>>> 78fb240 (Correções)
  const [phase, setPhase] = React.useState('playing');
  const [currentQ, setCurrentQ] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [lives, setLives] = React.useState(3);
<<<<<<< HEAD
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
=======
  const [selectedAnswer, setSelectedAnswer] = React.useState(null);
  const [feedback, setFeedback] = React.useState('');
  const [answerState, setAnswerState] = React.useState(null);
  const enemyPulse = useSharedValue(1);
  const waveOpacity = useSharedValue(0.35);

  React.useEffect(() => {
    enemyPulse.value = withRepeat(withTiming(1.08, { duration: 900 }), -1, true);
    waveOpacity.value = withRepeat(withTiming(0.65, { duration: 1400 }), -1, true);
  }, [enemyPulse, waveOpacity]);

  const enemyAnimated = useAnimatedStyle(() => ({
    transform: [{ scale: enemyPulse.value }],
  }));

  const waveStyle = useAnimatedStyle(() => ({
    opacity: waveOpacity.value,
  }));

  const question = QUESTIONS[currentQ];
  const enemyName = ENEMY_NAMES[currentQ % ENEMY_NAMES.length];
  const maxQuestions = QUESTIONS.length;

  function resetGame() {
    setPhase('playing');
    setCurrentQ(0);
    setScore(0);
    setLives(3);
    setSelectedAnswer(null);
    setFeedback('');
    setAnswerState(null);
  }

  function advanceStage() {
    if (lives <= 0) {
      setPhase('defeat');
      return;
    }
    if (currentQ + 1 >= maxQuestions) {
      setPhase('victory');
      return;
    }
    setCurrentQ((value) => value + 1);
    setPhase('playing');
    setSelectedAnswer(null);
    setAnswerState(null);
    setFeedback('');
  }

  function handleAnswer(index) {
    if (phase !== 'playing' || selectedAnswer !== null) return;
    const isCorrect = index === question.answer;
    setSelectedAnswer(index);
    setAnswerState(isCorrect ? 'correct' : 'wrong');
    setPhase('answered');

    if (isCorrect) {
      setScore((current) => current + 50);
      setFeedback('+50 XP');
    } else {
      setLives((current) => Math.max(0, current - 1));
      setFeedback(question.explanation);
    }

    setTimeout(() => {
      advanceStage();
    }, 1200);
  }

  function renderPlaying() {
    return (
      <View>
        <Animated.View style={[styles.enemyCard, enemyAnimated, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <View style={[styles.enemyCircle, { backgroundColor: theme.primary }]}>
            <Svg width={32} height={32} viewBox="0 0 24 24">
              <Circle cx="12" cy="12" r="6" fill="#fff" />
              <Path d="M4 12h16M12 4v16M6.5 6.5l11 11M6.5 17.5l11-11" stroke="#E05252" strokeWidth="1.5" />
            </Svg>
          </View>
          <Text style={[styles.enemyName, { color: theme.secondary, fontSize: 20 * scale }]}>{enemyName}</Text>
          <Text style={[styles.enemyHint, { color: theme.muted, fontSize: 14 * scale }]}>Derrote este oponente com conhecimento de doação.</Text>
        </Animated.View>

        <Text style={[styles.questionText, { color: theme.text, fontSize: 24 * scale }]}>{question.question}</Text>

        <View style={styles.answerGrid}>
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = answerState === 'correct' && index === question.answer;
            const isWrong = answerState === 'wrong' && isSelected;
            return (
              <Pressable
                key={option}
                onPress={() => handleAnswer(index)}
                accessibilityRole="button"
                accessibilityLabel={`Resposta ${String.fromCharCode(65 + index)}: ${option}`}
                style={({ pressed }) => [
                  styles.answerButton,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  isCorrect && { backgroundColor: colors.success, borderColor: colors.success },
                  isWrong && { backgroundColor: colors.danger, borderColor: colors.danger },
                  pressed && styles.pressed,
                ]}
              >
                <Text style={[styles.answerLetter, { color: theme.primary, fontSize: 16 * scale }]}>{String.fromCharCode(65 + index)}</Text>
                <Text style={[styles.answerText, { color: theme.text, fontSize: 16 * scale }]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  function renderAnswered() {
    return (
      <View style={styles.feedbackCard}>
        <Text style={[styles.feedbackText, { color: answerState === 'correct' ? colors.success : colors.danger, fontSize: 20 * scale }]}>
          {feedback}
        </Text>
      </View>
    );
  }

  function renderVictory() {
    return (
      <View style={styles.endCard}>
        <Text style={[styles.endTitle, { color: theme.primary, fontSize: 32 * scale }]}>Vitória!</Text>
        <Text style={[styles.endSubtitle, { color: theme.text, fontSize: 18 * scale }]}>Você venceu a missão e ganhou {score} XP.</Text>
        <Text style={[styles.endMessage, { color: theme.muted, fontSize: 15 * scale }]}>Agora doe sangue para converter o XP em nível real!</Text>
        <Button title="Agendar doação" onPress={() => navigation.navigate('Schedule')} style={styles.endButton} />
        <Button title="Voltar ao BloodQuest" variant="ghost" onPress={() => navigation.navigate('Quest')} />
      </View>
    );
  }

  function renderDefeat() {
    return (
      <View style={[styles.endCard, { backgroundColor: '#121B24' }]}> 
        <Text style={[styles.endTitle, { color: '#F7A541', fontSize: 32 * scale }]}>Derrota</Text>
        <Text style={[styles.endSubtitle, { color: '#F0EAE8', fontSize: 18 * scale }]}>Você perdeu suas vidas, mas pode tentar novamente.</Text>
        <Text style={[styles.endMessage, { color: '#A9B5C0', fontSize: 15 * scale }]}>Use o conhecimento que já ganhou e volte mais forte.</Text>
        <Button title="Tentar novamente" onPress={resetGame} style={styles.endButton} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}> 
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.View style={[styles.waveBackground, waveStyle, { backgroundColor: theme.primary }]} />

        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerScore, { color: theme.secondary, fontSize: 16 * scale }]}>Score: {score}</Text>
            <View style={styles.lifeRow} accessibilityRole="text" accessibilityLabel={`Vidas restantes ${lives}`}>
              {Array.from({ length: 3 }).map((_, index) => (
                <View key={index} style={[styles.lifeIcon, { opacity: index < lives ? 1 : 0.25, backgroundColor: theme.primary }]} />
              ))}
            </View>
          </View>
          <Text style={[styles.headerLabel, { color: theme.muted, fontSize: 14 * scale }]}>Pergunta {currentQ + 1} de {maxQuestions}</Text>
        </View>

        {phase === 'playing' && renderPlaying()}
        {phase === 'answered' && renderAnswered()}
        {phase === 'victory' && renderVictory()}
        {phase === 'defeat' && renderDefeat()}
      </ScrollView>
    </SafeAreaView>
>>>>>>> 78fb240 (Correções)
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
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
=======
  safeArea: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerScore: { fontFamily: fonts.bold },
  lifeRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  lifeIcon: { width: 14, height: 14, borderRadius: 8 },
  headerLabel: { fontFamily: fonts.regular },
  waveBackground: { position: 'absolute', left: -80, right: -80, top: 0, height: 180, borderRadius: 180, opacity: 0.2 },
  enemyCard: { padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 22, alignItems: 'center' },
  enemyCircle: { width: 72, height: 72, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  enemyName: { fontFamily: fonts.displayBold },
  enemyHint: { fontFamily: fonts.regular, textAlign: 'center', lineHeight: 20 },
  questionText: { fontFamily: fonts.displayBold, marginBottom: 22, lineHeight: 34 },
  answerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  answerButton: { width: '48%', borderRadius: 18, borderWidth: 1, padding: 16, minHeight: 110, justifyContent: 'space-between' },
  answerLetter: { fontFamily: fonts.displayBold },
  answerText: { fontFamily: fonts.regular, marginTop: 8, lineHeight: 20 },
  feedbackCard: { padding: 24, borderRadius: 24, marginTop: 16, alignItems: 'center', backgroundColor: '#fff', borderColor: '#E5DCDB', borderWidth: 1 },
  feedbackText: { fontFamily: fonts.bold, textAlign: 'center' },
  endCard: { padding: 28, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  endTitle: { fontFamily: fonts.displayBold, marginBottom: 14 },
  endSubtitle: { fontFamily: fonts.bold, marginBottom: 12, textAlign: 'center' },
  endMessage: { fontFamily: fonts.regular, textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  endButton: { width: '100%' },
  pressed: { opacity: 0.88 },
>>>>>>> 78fb240 (Correções)
});
