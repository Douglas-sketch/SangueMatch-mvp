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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
});
