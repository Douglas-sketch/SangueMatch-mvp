import React from 'react';
<<<<<<< HEAD
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
=======
import { Alert, Image, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';
>>>>>>> 78fb240 (Correções)
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
<<<<<<< HEAD
import { useApp } from '../context/AppContext';
import { useThemeMode } from '../context/ThemeContext';
import { fonts } from '../constants/theme';
import { useFontScale } from '../hooks/useFontScale';

function MenuItem({ icon, title, onPress, hint, theme, scale }) {
  return <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={title} accessibilityHint={hint} style={[styles.menuItem, { borderBottomColor: theme.border }]}><MaterialCommunityIcons name={icon} size={22} color={theme.primary} /><Text style={{ flex: 1, color: theme.text, fontFamily: fonts.bold, fontSize: 16 * scale }}>{title}</Text><MaterialCommunityIcons name="chevron-right" size={22} color={theme.muted} /></Pressable>;
}

export default function ProfileScreen({ navigation }) {
  const { user, stats, donations, updateAvatar, logout } = useApp();
  const { theme } = useThemeMode();
  const scale = useFontScale();

  const pickAvatar = () => {
    Alert.alert('Foto de perfil', 'Escolha uma opção', [
      { text: 'Tirar foto', onPress: async () => { const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 }); if (!result.canceled) updateAvatar(result.assets[0].uri); } },
      { text: 'Escolher da galeria', onPress: async () => { const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.7 }); if (!result.canceled) updateAvatar(result.assets[0].uri); } },
=======
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
>>>>>>> 78fb240 (Correções)
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  async function shareApp() {
    await Share.share({ message: 'Conheça o SangueMatch: doe sangue, atualize seu perfil e encontre hemocentros próximos.' });
  }

  return (
<<<<<<< HEAD
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }} contentContainerStyle={{ padding: 20, paddingTop: 58, paddingBottom: 120 }}>
      <Card style={{ alignItems: 'center', backgroundColor: theme.card, borderColor: theme.border }}>
        <Pressable onPress={pickAvatar} accessibilityRole="button" accessibilityLabel="Trocar foto" accessibilityHint="Toca para trocar sua foto de perfil" style={styles.avatarWrap}>
          {user?.avatar ? <Image source={{ uri: user.avatar }} style={styles.avatar} /> : <View style={[styles.avatar, { backgroundColor: theme.primary }]}><Text style={styles.avatarText}>{user?.name?.[0]?.toUpperCase() || 'S'}</Text></View>}
          <View style={[styles.cameraBadge, { backgroundColor: theme.primary }]}><MaterialCommunityIcons name="camera" color="#fff" size={14} /></View>
        </Pressable>
        <Text style={{ fontFamily: fonts.displayBold, color: theme.text, fontSize: 28 * scale }}>{user?.name}</Text>
        <Text style={{ fontFamily: fonts.medium, color: theme.muted, fontSize: 14 * scale }}>{user?.bloodType} • {stats.level}</Text>
      </Card>

      <SectionTitle title="Histórico" />
      {donations.length === 0 ? <Card style={{ backgroundColor: theme.card, borderColor: theme.border }}><Text style={{ color: theme.muted }}>Nenhuma doação registrada ainda.</Text></Card> : donations.map((d) => <Card key={d.id} style={{ backgroundColor: theme.card, borderColor: theme.border, marginBottom: 8 }}><Text style={{ color: theme.text, fontFamily: fonts.bold }}>{d.local}</Text><Text style={{ color: theme.muted }}>{d.status}</Text></Card>)}

      <SectionTitle title="Menu" />
      <Card style={{ backgroundColor: theme.card, borderColor: theme.border, padding: 0 }}>
        <MenuItem icon="account-edit" title="Editar perfil" onPress={() => navigation.navigate('EditProfile')} hint="Abre formulário para atualizar seus dados" theme={theme} scale={scale} />
        <MenuItem icon="qrcode" title="Meu QR Code" onPress={() => navigation.navigate('QRCode')} hint="Abre seu QR Code de doador" theme={theme} scale={scale} />
        <MenuItem icon="shield-account" title="Termos e Privacidade" onPress={() => navigation.navigate('Terms')} hint="Mostra os termos de uso e privacidade" theme={theme} scale={scale} />
        <MenuItem icon="accessibility" title="Acessibilidade" onPress={() => navigation.navigate('Accessibility')} hint="Abre ajustes de acessibilidade" theme={theme} scale={scale} />
        <MenuItem icon="logout" title="Sair" onPress={logout} hint="Remove seus dados deste dispositivo" theme={theme} scale={scale} />
      </Card>
=======
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
>>>>>>> 78fb240 (Correções)
    </ScrollView>
  );
}

const styles = StyleSheet.create({
<<<<<<< HEAD
  avatarWrap: { marginBottom: 12 },
  avatar: { width: 86, height: 86, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 40, fontFamily: fonts.displayBold },
  cameraBadge: { position: 'absolute', right: -2, bottom: -2, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1 },
=======
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
>>>>>>> 78fb240 (Correções)
});
