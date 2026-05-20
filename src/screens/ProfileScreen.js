import React from 'react';
import { Alert, Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
import AvatarPicker from '../components/AvatarPicker';
import { useApp } from '../context/AppContext';
import { colors, fonts } from '../constants/theme';
import { formatDate } from '../utils/date';

function MenuItem({ icon, title, onPress, hint }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={hint}
      style={({ pressed }) => [styles.menuItem, pressed && styles.pressed]}
    >
      <MaterialCommunityIcons name={icon} color={colors.primary} size={24} />
      <Text style={styles.menuText}>{title}</Text>
      <MaterialCommunityIcons name="chevron-right" color={colors.muted} size={24} />
    </Pressable>
  );
}

export default function ProfileScreen({ navigation }) {
  const { user, stats, donations, appointment, logout } = useApp();
  const initials = user?.name?.[0]?.toUpperCase() || 'S';
  const avatarSource = user?.avatar ? { uri: user.avatar } : null;

  function confirmLogout() {
    Alert.alert('Sair do SangueMatch?', 'Seus dados locais de perfil serão removidos deste dispositivo.', [
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  async function shareApp() {
    await Share.share({ message: 'Conheça o SangueMatch: doe sangue, atualize seu perfil e encontre hemocentros próximos.' });
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AnimatedView>
        <Card style={styles.profileCard}>
          <AvatarPicker />
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.meta}>{user?.bloodType || 'Tipo não informado'} • {stats.level}</Text>
        </Card>
      </AnimatedView>

      {appointment ? (
        <AnimatedView delay={60}>
          <Card style={styles.nextCard}>
            <Text style={styles.nextTitle}>Próximo agendamento</Text>
            <Text style={styles.nextText}>{appointment.center.name}</Text>
            <Text style={styles.meta}>{formatDate(`${appointment.date}T00:00:00`)} às {appointment.time}</Text>
          </Card>
        </AnimatedView>
      ) : null}

      <AnimatedView delay={120}>
        <SectionTitle title="Histórico de doações" />
        {donations.length ? (
          donations.map((donation) => (
            <Card key={donation.id} style={styles.historyCard}>
              <View style={styles.historyIcon}>
                <MaterialCommunityIcons name="check" color="#fff" size={18} />
              </View>
              <View style={styles.historyBody}>
                <Text style={styles.historyLocal}>{donation.local}</Text>
                <Text style={styles.historyDate}>{formatDate(donation.date)} • {donation.status}</Text>
              </View>
            </Card>
          ))
        ) : (
          <Text style={styles.emptyState}>Nenhum registro de doações ainda.</Text>
        )}
      </AnimatedView>

      <AnimatedView delay={180}>
        <SectionTitle title="Menu" />
        <Card style={styles.menuCard}>
          <MenuItem icon="account-edit" title="Editar perfil" onPress={() => navigation.navigate('EditProfile')} hint="Abre a tela de edição de perfil." />
          <MenuItem icon="qrcode" title="Meu QR Code" onPress={() => navigation.navigate('QRCode')} hint="Exibe seu código de doador para mostrar no hemocentro." />
          <MenuItem icon="file-document" title="Termos e Privacidade" onPress={() => navigation.navigate('Terms')} hint="Mostra os termos de uso e política de privacidade." />
          <MenuItem icon="share-variant" title="Compartilhar app" onPress={shareApp} hint="Compartilha o app com amigos." />
          <MenuItem icon="logout" title="Sair" onPress={confirmLogout} hint="Remove seus dados locais deste dispositivo." />
        </Card>
      </AnimatedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 58, paddingBottom: 110 },
  profileCard: { alignItems: 'center', paddingBottom: 32 },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  avatarImage: { width: 86, height: 86, borderRadius: 28, borderWidth: 2, borderColor: colors.primary },
  avatarPlaceholder: { width: 86, height: 86, borderRadius: 28, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontFamily: fonts.displayBold, fontSize: 40 },
  cameraBadge: {
    position: 'absolute', right: -2, bottom: -2, width: 34, height: 34, borderRadius: 18, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.card,
  },
  name: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 28, textAlign: 'center' },
  meta: { fontFamily: fonts.medium, color: colors.muted, marginTop: 4 },
  nextCard: { marginTop: 14, borderColor: 'rgba(76,175,133,0.45)' },
  nextTitle: { fontFamily: fonts.bold, color: colors.success, textTransform: 'uppercase', fontSize: 12 },
  nextText: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 22, marginTop: 4 },
  historyCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10, padding: 14 },
  historyIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  historyBody: { flex: 1 },
  historyLocal: { fontFamily: fonts.bold, color: colors.secondary },
  historyDate: { fontFamily: fonts.regular, color: colors.muted, marginTop: 2 },
  emptyState: { fontFamily: fonts.regular, color: colors.muted, textAlign: 'center', marginTop: 10 },
  menuCard: { padding: 0, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, borderBottomWidth: 0.5, borderBottomColor: colors.line },
  menuText: { flex: 1, fontFamily: fonts.bold, color: colors.secondary, fontSize: 16 },
  pressed: { opacity: 0.7 },
});
