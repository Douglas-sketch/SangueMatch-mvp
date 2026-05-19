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
