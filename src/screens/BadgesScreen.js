import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import AnimatedView from '../components/AnimatedView';
import BadgeItem from '../components/BadgeItem';
import Card from '../components/Card';
import { BADGES } from '../constants/mockData';
import { colors, fonts } from '../constants/theme';
import { useApp } from '../context/AppContext';

function Particle({ index }) {
  const progress = useSharedValue(0);
  React.useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1800 + index * 120, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [index, progress]);
  const style = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    transform: [{ translateY: -progress.value * (30 + index * 4) }, { translateX: Math.sin(index) * progress.value * 16 }],
  }));
  return <Animated.Text style={[styles.particle, { left: 34 + index * 22 }, style]}>✦</Animated.Text>;
}

export default function BadgesScreen() {
  const { user, stats } = useApp();
  const unlockedMap = useMemo(() => {
    const payload = { ...stats, bloodType: user?.bloodType, referrals: user?.referrals ?? 1 };
    return Object.fromEntries(BADGES.map((badge) => [badge.id, badge.rule(payload)]));
  }, [stats, user]);
  const unlockedCount = Object.values(unlockedMap).filter(Boolean).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AnimatedView>
        <LinearGradient colors={[colors.secondary, '#1F2D3C']} style={styles.header}>
          {Array.from({ length: unlockedCount ? 5 : 0 }).map((_, index) => <Particle key={index} index={index} />)}
          <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'S'}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user?.name || 'Doador SangueMatch'}</Text>
            <Text style={styles.level}>{stats.level}</Text>
            <View style={styles.xpBar} accessibilityRole="progressbar" accessibilityLabel={`XP ${stats.xp} por cento`}>
              <View style={[styles.xpFill, { width: `${stats.xp}%` }]} />
            </View>
          </View>
        </LinearGradient>
      </AnimatedView>

      <AnimatedView delay={80}>
        <Card style={styles.livesCard}>
          <Text style={styles.livesNumber}>{stats.lives}</Text>
          <Text style={styles.livesTitle}>vidas impactadas</Text>
          <Text style={styles.livesText}>Cada doação pode ajudar até quatro pessoas. Seu histórico já conta uma história bonita.</Text>
        </Card>
      </AnimatedView>

      <AnimatedView delay={140}>
        <View style={styles.streakRow}>
          <Text style={styles.sectionTitle}>Conquistas</Text>
          <Text style={styles.streak}>🔥 {stats.streak} meses</Text>
        </View>
        <View style={styles.badgeGrid}>
          {BADGES.map((badge) => <BadgeItem key={badge.id} badge={badge} unlocked={Boolean(unlockedMap[badge.id])} />)}
        </View>
      </AnimatedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 58, paddingBottom: 110 },
  header: { borderRadius: 28, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16, overflow: 'hidden' },
  avatar: { width: 70, height: 70, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontFamily: fonts.displayBold, fontSize: 32 },
  name: { color: '#fff', fontFamily: fonts.displayBold, fontSize: 24 },
  level: { color: 'rgba(255,255,255,0.78)', fontFamily: fonts.medium, marginTop: 2 },
  xpBar: { height: 10, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.16)', marginTop: 12, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 999 },
  particle: { position: 'absolute', bottom: 34, color: '#fff', fontSize: 18 },
  livesCard: { alignItems: 'center', marginVertical: 18 },
  livesNumber: { fontFamily: fonts.displayBold, color: colors.primary, fontSize: 58 },
  livesTitle: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 24, marginTop: -4 },
  livesText: { fontFamily: fonts.regular, color: colors.muted, textAlign: 'center', lineHeight: 22, marginTop: 8 },
  streakRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 26 },
  streak: { fontFamily: fonts.bold, color: colors.primary, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 99, overflow: 'hidden' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
});
