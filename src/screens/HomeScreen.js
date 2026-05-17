import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import AnimatedView from '../components/AnimatedView';
import Card from '../components/Card';
import HemocenterCard from '../components/HemocenterCard';
import SectionTitle from '../components/SectionTitle';
import StatusCard from '../components/StatusCard';
import Button from '../components/Button';
import { colors, fonts } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { useHemocenters } from '../hooks/useHemocenters';
import { getGreeting } from '../utils/date';

export default function HomeScreen({ navigation }) {
  const { user, stats, urgencies } = useApp();
  const { centers, loading, reload, usingFallback } = useHemocenters(true);
  const nearest = centers[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={loading} onRefresh={reload} tintColor={colors.primary} />}>
      <AnimatedView>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.name}>{user?.name?.split(' ')[0] || 'doador'}</Text>
          </View>
          <View style={styles.bloodBadge} accessibilityRole="text" accessibilityLabel={`Tipo sanguíneo ${user?.bloodType || 'não informado'}`}>
            <Text style={styles.bloodText}>{user?.bloodType || '?'}</Text>
          </View>
        </View>
      </AnimatedView>

      <AnimatedView delay={80}>
        <StatusCard status={stats.donationStatus} />
      </AnimatedView>

      <View style={styles.statsGrid}>
        <AnimatedView delay={120} style={{ flex: 1 }}>
          <Card style={styles.statBox}>
            <MaterialCommunityIcons name="water" color={colors.primary} size={28} />
            <Text style={styles.statNumber}>{stats.donations}</Text>
            <Text style={styles.statLabel}>doações</Text>
          </Card>
        </AnimatedView>
        <AnimatedView delay={160} style={{ flex: 1 }}>
          <Card style={styles.statBox}>
            <MaterialCommunityIcons name="heart-pulse" color={colors.success} size={28} />
            <Text style={styles.statNumber}>{stats.lives}</Text>
            <Text style={styles.statLabel}>vidas salvas</Text>
          </Card>
        </AnimatedView>
      </View>

      <AnimatedView delay={200}>
        <SectionTitle title="Hemocentro mais próximo" subtitle={usingFallback ? 'Usando fallback de Recife/PE porque a API não retornou resultados.' : 'Calculado com sua localização atual.'} />
        {loading && !nearest ? <ActivityIndicator color={colors.primary} /> : null}
        {nearest ? <HemocenterCard center={nearest} compact onSchedule={(center) => navigation.navigate('Schedule', { center })} /> : null}
        {nearest ? <Button title="Agendar uma doação" onPress={() => navigation.navigate('Schedule', { center: nearest })} /> : null}
      </AnimatedView>

      <AnimatedView delay={240}>
        <SectionTitle title="Urgências de hoje" subtitle="Simulação dinâmica para demonstração do MVP." />
        <View style={styles.urgencyGrid}>
          {urgencies.map((item) => (
            <LinearGradient key={item.id} colors={item.level === 'crítico' ? [colors.primary, colors.primaryDark] : ['#fff', '#fff']} style={styles.urgencyPill}>
              <Text style={[styles.urgencyType, item.level === 'crítico' && styles.whiteText]}>{item.type}</Text>
              <Text style={[styles.urgencyLevel, item.level === 'crítico' && styles.whiteText]}>{item.level}</Text>
            </LinearGradient>
          ))}
        </View>
      </AnimatedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 58, paddingBottom: 110 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  greeting: { fontFamily: fonts.medium, color: colors.muted, fontSize: 18 },
  name: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 38, marginTop: -2 },
  bloodBadge: { backgroundColor: colors.primary, borderRadius: 22, paddingHorizontal: 18, paddingVertical: 12 },
  bloodText: { color: '#fff', fontFamily: fonts.displayBold, fontSize: 24 },
  statsGrid: { flexDirection: 'row', gap: 12, marginVertical: 14 },
  statBox: { minHeight: 134, justifyContent: 'center' },
  statNumber: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 34, marginTop: 10 },
  statLabel: { fontFamily: fonts.medium, color: colors.muted },
  urgencyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  urgencyPill: { minWidth: '47%', borderRadius: 22, padding: 16, borderWidth: 0.5, borderColor: colors.line },
  urgencyType: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 26 },
  urgencyLevel: { fontFamily: fonts.bold, color: colors.muted, textTransform: 'uppercase', fontSize: 12, marginTop: 4 },
  whiteText: { color: '#fff' },
});
