import React from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import Card from '../components/Card';
import SectionTitle from '../components/SectionTitle';
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
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  return (
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  avatarWrap: { marginBottom: 12 },
  avatar: { width: 86, height: 86, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 40, fontFamily: fonts.displayBold },
  cameraBadge: { position: 'absolute', right: -2, bottom: -2, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1 },
});
