import React from 'react';
import { Alert, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AnimatedView from '../components/AnimatedView';
import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import { colors, fonts } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { formatDate } from '../utils/date';

function MenuItem({ icon, title, onPress }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={title} style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}>
      <MaterialCommunityIcons name={icon} color={colors.primary} size={24} />
      <Text style={styles.menuText}>{title}</Text>
      <MaterialCommunityIcons name="chevron-right" color={colors.muted} size={24} />
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }) {
  const { user, stats, donations, logout, appointment } = useApp();

  async function shareApp() {
    await Share.share({ message: 'Conheça o SangueMatch: doe sangue, encontre hemocentros e salve vidas. 🩸' });
  }

  function confirmLogout() {
    Alert.alert('Sair do SangueMatch?', 'Seus dados locais de perfil serão removidos deste dispositivo.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AnimatedView>
        <Card style={styles.profileCard}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'S'}</Text></View>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.meta}>{user?.bloodType || 'Tipo não informado'} • {stats.level}</Text>
        </Card>
      </AnimatedView>

      {appointment ? (
        <AnimatedView delay={70}>
          <Card style={styles.nextCard}>
            <Text style={styles.nextTitle}>Próximo agendamento</Text>
            <Text style={styles.nextText}>{appointment.center.name}</Text>
            <Text style={styles.meta}>{formatDate(`${appointment.date}T00:00:00`)} às {appointment.time}</Text>
          </Card>
        </AnimatedView>
      ) : null}

      <AnimatedView delay={120}>
        <SectionTitle title="Histórico de doações" />
        {donations.map((donation) => (
          <Card key={donation.id} style={styles.historyCard}>
            <View style={styles.historyIcon}><MaterialCommunityIcons name="check" color="#fff" size={18} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyLocal}>{donation.local}</Text>
              <Text style={styles.historyDate}>{formatDate(donation.date)} • {donation.status}</Text>
            </View>
          </Card>
        ))}
      </AnimatedView>

      <AnimatedView delay={180}>
        <SectionTitle title="Menu" />
        <Card style={styles.menuCard}>
          <MenuItem icon="accessibility" title="Acessibilidade" onPress={() => navigation.navigate('Accessibility')} />
          <MenuItem icon="bell-outline" title="Notificações" onPress={() => Alert.alert('Notificações', 'Os lembretes são configurados no agendamento.')} />
          <MenuItem icon="share-variant" title="Compartilhar app" onPress={shareApp} />
          <MenuItem icon="logout" title="Sair" onPress={confirmLogout} />
        </Card>
      </AnimatedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 58, paddingBottom: 110 },
  profileCard: { alignItems: 'center' },
  avatar: { width: 86, height: 86, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { color: '#fff', fontFamily: fonts.displayBold, fontSize: 40 },
  name: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 28, textAlign: 'center' },
  meta: { fontFamily: fonts.medium, color: colors.muted, marginTop: 4 },
  nextCard: { marginTop: 14, borderColor: 'rgba(76,175,133,0.45)' },
  nextTitle: { fontFamily: fonts.bold, color: colors.success, textTransform: 'uppercase', fontSize: 12 },
  nextText: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 22, marginTop: 4 },
  historyCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10, padding: 14 },
  historyIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  historyLocal: { fontFamily: fonts.bold, color: colors.secondary },
  historyDate: { fontFamily: fonts.regular, color: colors.muted, marginTop: 2 },
  menuCard: { padding: 0, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, borderBottomWidth: 0.5, borderBottomColor: colors.line },
  menuText: { flex: 1, fontFamily: fonts.bold, color: colors.secondary, fontSize: 16 },
  pressed: { opacity: 0.7 },
});
