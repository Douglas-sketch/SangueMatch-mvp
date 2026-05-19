<<<<<<< HEAD
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

import { useApp } from '../context/AppContext';
import { useThemeMode } from '../context/ThemeContext';

export default function QRCodeScreen() {
  const { user, stats } = useApp();
  const { theme } = useThemeMode();
  const ref = React.useRef(null);
  const payload = JSON.stringify({ name: user?.name, bloodType: user?.bloodType, totalDonations: stats.donations, generatedAt: new Date().toISOString(), app: 'SangueMatch' });
  const shareQr = async () => {
    const uri = await captureRef(ref, { format: 'png', quality: 0.9 });
    await Sharing.shareAsync(uri);
  };

  return <View style={{ flex: 1, backgroundColor: theme.background, alignItems: 'center', justifyContent: 'center', padding: 20 }}><View ref={ref} collapsable={false} style={{ backgroundColor: theme.card, borderRadius: 18, padding: 18, alignItems: 'center' }}><QRCode value={payload} size={220} /><Text style={{ color: theme.text, marginTop: 12, fontWeight: '700' }}>{user?.name}</Text><View style={{ backgroundColor: theme.primary, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, marginTop: 6 }}><Text style={{ color: '#fff' }}>{user?.bloodType}</Text></View><Text style={{ color: theme.muted, marginTop: 10, textAlign: 'center' }}>Apresente este código no hemocentro para agilizar seu atendimento</Text></View><Pressable onPress={shareQr} style={{ backgroundColor: theme.primary, marginTop: 18, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 }}><Text style={{ color: '#fff' }}>Compartilhar QR</Text></Pressable></View>;
}
=======
import React, { useRef, useState } from 'react';
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing';
import { useThemeMode } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';
import { colors, fonts } from '../constants/theme';
import Button from '../components/Button';

export default function QRCodeScreen() {
  const { theme } = useThemeMode();
  const { user, stats } = useApp();
  const [sharing, setSharing] = useState(false);
  const qrRef = useRef(null);

  const value = JSON.stringify({
    name: user?.name || '',
    bloodType: user?.bloodType || '',
    totalDonations: stats.donations,
    generatedAt: new Date().toISOString(),
    app: 'SangueMatch',
  });

  async function shareQRCode() {
    try {
      setSharing(true);
      const uri = await captureRef(qrRef, { format: 'png', quality: 0.9 });
      if (uri) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png' });
      }
    } catch (error) {
      Alert.alert('Falha ao compartilhar', 'Não foi possível gerar o QR Code.');
    } finally {
      setSharing(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.dark ? '#0F1923' : theme.background }]}> 
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.heading, { color: theme.primary }]}>Meu QR Code</Text>
        <Text style={[styles.subtitle, { color: theme.muted }]}>Apresente este código no hemocentro para agilizar seu atendimento.</Text>

        <View style={[styles.card, { backgroundColor: theme.card }]}> 
          <View ref={qrRef} collapsable={false} style={styles.qrWrapper}>
            <QRCode value={value} size={220} logoMargin={8} logoSize={48} logo={{ uri: 'https://raw.githubusercontent.com/facebook/react-native/main/docs/assets/favicon.png' }} />
          </View>
          <Text style={[styles.name, { color: theme.secondary }]}>{user?.name}</Text>
          <View style={[styles.badge, { backgroundColor: theme.primary }]}> 
            <Text style={styles.badgeText}>{user?.bloodType || 'Tipo não informado'}</Text>
          </View>
          <Text style={[styles.hint, { color: theme.muted }]}>Apresente este código no hemocentro para agilizar seu atendimento.</Text>
        </View>

        <Button title="Compartilhar QR" onPress={shareQRCode} loading={sharing} accessibilityHint="Compartilha o código QR do doador." />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { padding: 20, paddingTop: 36, paddingBottom: 40, alignItems: 'center' },
  heading: { fontFamily: fonts.displayBold, fontSize: 32, marginBottom: 8 },
  subtitle: { fontFamily: fonts.regular, fontSize: 16, marginBottom: 24, textAlign: 'center', maxWidth: 320 },
  card: { width: '100%', borderRadius: 28, padding: 24, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  qrWrapper: { padding: 12, backgroundColor: '#fff', borderRadius: 28, marginBottom: 18 },
  name: { fontFamily: fonts.displayBold, fontSize: 24, marginTop: 12 },
  badge: { borderRadius: 999, paddingHorizontal: 18, paddingVertical: 10, marginTop: 10 },
  badgeText: { fontFamily: fonts.bold, color: '#fff', fontSize: 15 },
  hint: { fontFamily: fonts.regular, fontSize: 14, textAlign: 'center', marginTop: 18, lineHeight: 20 },
});
>>>>>>> 78fb240 (Correções)
