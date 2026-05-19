<<<<<<< HEAD
import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { useApp } from '../context/AppContext';
import { useThemeMode } from '../context/ThemeContext';
import { fonts } from '../constants/theme';
import { BLOOD_CLASSES } from './questions';
import { useFontScale } from '../hooks/useFontScale';

function getLevel(xp) {
  if (xp >= 6000) return { name: 'Lenda', min: 6000, max: 8000 };
  if (xp >= 3000) return { name: 'Herói', min: 3000, max: 6000 };
  if (xp >= 1500) return { name: 'Guardião', min: 1500, max: 3000 };
  if (xp >= 500) return { name: 'Protetor', min: 500, max: 1500 };
  return { name: 'Iniciante', min: 0, max: 500 };
}

export default function BloodQuestScreen({ navigation }) {
  const { user, stats } = useApp();
  const { theme } = useThemeMode();
  const scale = useFontScale();
  const xp = (stats?.donations || 0) * 500;
  const currentClass = BLOOD_CLASSES[user?.bloodType] || { name: 'Aventureiro', skill: 'Vontade de ajudar', icon: 'heart' };
  const level = getLevel(xp);
  const progress = Math.min(1, (xp - level.min) / (level.max - level.min));

  const pulse = useSharedValue(1);
  const bar = useSharedValue(0);
  React.useEffect(() => {
    pulse.value = withRepeat(withTiming(1.12, { duration: 900 }), -1, true);
    bar.value = withTiming(progress, { duration: 700 });
  }, [bar, progress, pulse]);

  const charStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }], opacity: 0.82 + ((pulse.value - 1) / 0.12) * 0.18 }));
  const barStyle = useAnimatedStyle(() => ({ width: `${bar.value * 100}%` }));

  const ranking = useMemo(() => {
    const me = { name: user?.name || 'Você', xp, isMe: true };
    return [
      { name: 'Ana Beatriz', xp: 7200 },
      { name: 'João Pedro', xp: 5400 },
      me,
      { name: 'Camila Souza', xp: 1700 },
      { name: 'Rafael Lima', xp: 1200 },
    ].sort((a, b) => b.xp - a.xp).slice(0, 5);
  }, [user?.name, xp]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}> 
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, { color: theme.text, fontSize: 28 * scale }]} accessibilityRole="header">{user?.name || 'Herói'} • {currentClass.name}</Text>
        <Text style={[styles.subtitle, { color: theme.muted, fontSize: 14 * scale }]}>Tipo sanguíneo: {user?.bloodType || 'Não informado'}</Text>
        <Animated.View style={[styles.character, charStyle, { backgroundColor: theme.primary }]}>
          {user?.avatar ? <Image source={{ uri: user.avatar }} style={styles.avatar} /> : <Text style={[styles.charInitial, { fontSize: 30 * scale }]}>{(user?.name || 'S').charAt(0).toUpperCase()}</Text>}
        </Animated.View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text, fontSize: 18 * scale }]}>Nível atual: {level.name}</Text>
          <Text style={{ color: theme.muted, fontSize: 13 * scale }}>XP total: {xp}</Text>
          <View style={[styles.xpTrack, { backgroundColor: theme.border }]}><Animated.View style={[styles.xpFill, barStyle, { backgroundColor: theme.primary }]} /></View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text, fontSize: 17 * scale }]}>Habilidade</Text>
          <View style={styles.row}><MaterialCommunityIcons name={currentClass.icon} color={theme.primary} size={22} /><Text style={[styles.skill, { color: theme.text, fontSize: 14 * scale }]}>{currentClass.skill}</Text></View>
        </View>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text, fontSize: 17 * scale }]}>Próxima recompensa</Text>
          <Text style={{ color: theme.muted, fontSize: 14 * scale }}>{level.name === 'Lenda' ? 'Você desbloqueou todas as skins do BloodQuest.' : `Complete missão + doação para subir de ${level.name}.`}</Text>
        </View>

        <Pressable accessibilityRole="button" accessibilityLabel="Iniciar missão" accessibilityHint="Inicia o quiz educativo sobre doação de sangue" style={[styles.button, { backgroundColor: theme.primary }]} onPress={() => navigation.navigate('QuestMission')}>
          <Text style={[styles.buttonText, { fontSize: 16 * scale }]}>Iniciar missão</Text>
        </Pressable>

        <Text style={[styles.rankTitle, { color: theme.text, fontSize: 20 * scale }]}>Ranking BloodQuest</Text>
        {ranking.map((item, index) => (
          <View key={`${item.name}-${index}`} style={[styles.rankItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={{ color: theme.text, fontFamily: fonts.bold, fontSize: 14 * scale }}>{index + 1}º {item.name}{item.isMe ? ' (Você)' : ''}</Text>
            <Text style={{ color: theme.primary, fontFamily: fonts.bold, fontSize: 14 * scale }}>{item.xp} XP</Text>
          </View>
        ))}
=======
import React from 'react';
import { ScrollView, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useThemeMode } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { BLOOD_CLASSES } from './questions';
import Button from '../components/Button';
import Card from '../components/Card';
import { colors, fonts } from '../constants/theme';
import { useFontScale } from '../hooks/useFontScale';

const LEVELS = [
  { label: 'Iniciante', min: 0, max: 499 },
  { label: 'Protetor', min: 500, max: 1499 },
  { label: 'Guardião', min: 1500, max: 2999 },
  { label: 'Herói', min: 3000, max: 5999 },
  { label: 'Lenda', min: 6000, max: Infinity },
];

const RANKING = [
  { name: 'Ana Souza', xp: 5200 },
  { name: 'Bruno Silva', xp: 3820 },
  { name: 'Camila Rocha', xp: 2710 },
  { name: 'Diego Alves', xp: 1940 },
  { name: 'Eduarda Lima', xp: 1180 },
];

function getLevelLabel(xp) {
  return LEVELS.find((item) => xp >= item.min && xp <= item.max)?.label || 'Iniciante';
}

export default function BloodQuestScreen({ navigation }) {
  const { theme } = useThemeMode();
  const { user, stats } = useApp();
  const scale = useFontScale();
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    pulse.value = withRepeat(withTiming(1.12, { duration: 900 }), -1, true);
  }, [pulse]);

  const animatedCircle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.88 + (pulse.value - 1) * 0.5,
  }));

  const totalXP = stats.donations * 500;
  const currentLevel = getLevelLabel(totalXP);
  const bloodClass = BLOOD_CLASSES[user?.bloodType] || { name: 'Aventureiro', skill: 'Resiliência' };
  const progress = Math.min(1, totalXP / 6000);

  const nextMessage = {
    Iniciante: 'Seu próximo desafio está mais próximo do que você imagina. Comece agora!',
    Protetor: 'Continue treinando para se tornar um guardião da doação.',
    Guardião: 'A cada missão, você fica mais perto de legendas solidárias.',
    Herói: 'Quase lá: seu próximo nível ajuda ainda mais pessoas.',
    Lenda: 'Você já é uma Lenda. Doe e inspire mais pessoas.',
  }[currentLevel];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}> 
      <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Tela BloodQuest" accessibilityRole="scrollbar">
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: theme.text, fontSize: 28 * scale }]}>Olá, {user?.name?.split(' ')[0] || 'Herói'}</Text>
            <Text style={[styles.subtitle, { color: theme.muted, fontSize: 16 * scale }]}>Classe {bloodClass.name}</Text>
            <Text style={[styles.subtitle, { color: theme.primary, fontSize: 15 * scale }]}>Tipo sanguíneo {user?.bloodType || 'não informado'}</Text>
          </View>
          <Animated.View style={[styles.character, animatedCircle, { backgroundColor: theme.primary }]}> 
            <Text style={styles.characterText}>{user?.name?.[0]?.toUpperCase() || 'S'}</Text>
          </Animated.View>
        </View>

        <Card style={styles.statusCard}>
          <Text style={[styles.cardTitle, { color: theme.secondary, fontSize: 20 * scale }]}>Status do personagem</Text>
          <Text style={[styles.cardHeading, { color: theme.text, fontSize: 32 * scale }]}>{currentLevel}</Text>
          <View style={styles.progressBar} accessibilityRole="progressbar" accessibilityLabel={`XP total ${totalXP}`}>
            <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%`, backgroundColor: theme.primary }]} />
          </View>
          <Text style={[styles.cardMeta, { color: theme.muted, fontSize: 14 * scale }]}>XP acumulado em missões: {totalXP}</Text>
        </Card>

        <Card style={styles.skillCard}>
          <View style={styles.skillHeader}>
            <View style={[styles.skillIcon, { backgroundColor: theme.primary }]}>
              <Text style={styles.skillIconText}>★</Text>
            </View>
            <Text style={[styles.cardTitle, { color: theme.secondary, fontSize: 20 * scale }]}>Habilidade da classe</Text>
          </View>
          <Text style={[styles.skillText, { color: theme.text, fontSize: 16 * scale }]}>{bloodClass.skill}</Text>
        </Card>

        <Card style={styles.rewardCard}>
          <Text style={[styles.cardTitle, { color: theme.secondary, fontSize: 20 * scale }]}>Próxima recompensa</Text>
          <Text style={[styles.rewardText, { color: theme.primary, fontSize: 16 * scale }]}>{nextMessage}</Text>
        </Card>

        <Button
          title="Iniciar missão"
          onPress={() => navigation.navigate('QuestMission')}
          accessibilityHint="Inicia o quiz educativo sobre doação de sangue"
          style={styles.startButton}
        />

        <Card style={styles.rankingCard}>
          <Text style={[styles.cardTitle, { color: theme.secondary, fontSize: 20 * scale }]}>Ranking Solidário</Text>
          {RANKING.map((item, index) => (
            <View key={item.name} style={styles.rankingRow}>
              <Text style={[styles.rankingPosition, { color: theme.primary, fontSize: 16 * scale }]}>{index + 1}</Text>
              <View style={styles.rankingInfo}>
                <Text style={[styles.rankingName, { color: theme.text, fontSize: 16 * scale }]}>{item.name}</Text>
                <Text style={[styles.rankingXp, { color: theme.muted, fontSize: 14 * scale }]}>{item.xp} XP</Text>
              </View>
              <View style={item.name === user?.name ? styles.currentBadge : styles.rankingEmpty}>
                <Text style={[styles.currentBadgeText, { fontSize: 12 * scale }]}>{item.name === user?.name ? 'Você' : ''}</Text>
              </View>
            </View>
          ))}
        </Card>
>>>>>>> 78fb240 (Correções)
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 120 },
  title: { fontFamily: fonts.displayBold },
  subtitle: { marginTop: 6, fontFamily: fonts.medium },
  character: { width: 102, height: 102, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginVertical: 16 },
  avatar: { width: 86, height: 86, borderRadius: 28 },
  charInitial: { color: '#fff', fontFamily: fonts.displayBold },
  card: { borderWidth: 1, borderRadius: 20, padding: 16, marginBottom: 12 },
  cardTitle: { fontFamily: fonts.displayBold, marginBottom: 6 },
  xpTrack: { height: 10, borderRadius: 999, marginTop: 10, overflow: 'hidden' },
  xpFill: { height: 10, borderRadius: 999 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  skill: { fontFamily: fonts.medium, flex: 1 },
  button: { minHeight: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontFamily: fonts.bold },
  rankTitle: { fontFamily: fonts.displayBold, marginTop: 20, marginBottom: 10 },
  rankItem: { borderWidth: 1, borderRadius: 14, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between' },
=======
  safeArea: { flex: 1 },
  container: { padding: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 },
  title: { fontFamily: fonts.displayBold },
  subtitle: { fontFamily: fonts.medium, marginTop: 6 },
  character: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.18, shadowRadius: 14, shadowOffset: { width: 0, height: 8 } },
  characterText: { fontFamily: fonts.displayBold, color: '#fff', fontSize: 38 },
  statusCard: { marginBottom: 18, paddingVertical: 22 },
  cardTitle: { fontFamily: fonts.bold, marginBottom: 6 },
  cardHeading: { fontFamily: fonts.displayBold },
  progressBar: { height: 12, borderRadius: 999, backgroundColor: '#EDE7E5', overflow: 'hidden', marginTop: 14 },
  progressFill: { height: '100%' },
  cardMeta: { marginTop: 10 },
  skillCard: { marginBottom: 18, paddingVertical: 18 },
  skillHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  skillIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  skillIconText: { color: '#fff', fontSize: 22 },
  skillText: { lineHeight: 22 },
  rewardCard: { marginBottom: 18, paddingVertical: 18 },
  rewardText: { lineHeight: 22 },
  startButton: { marginBottom: 18 },
  rankingCard: { paddingVertical: 18 },
  rankingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0E9E7' },
  rankingPosition: { fontFamily: fonts.displayBold, width: 24 },
  rankingInfo: { flex: 1, marginLeft: 10 },
  rankingName: { fontFamily: fonts.bold },
  rankingXp: { fontFamily: fonts.regular },
  currentBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: '#E8F5E9' },
  currentBadgeText: { color: '#2E7D32', fontFamily: fonts.semi },
  rankingEmpty: { width: 70 },
>>>>>>> 78fb240 (Correções)
});
