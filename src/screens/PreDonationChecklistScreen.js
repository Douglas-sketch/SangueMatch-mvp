import React from 'react';
import { Pressable, Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { useThemeMode } from '../context/ThemeContext';

const KEY = '@checklist:predonation';
const ITEMS = [
  'Bebi pelo menos 2 copos de água hoje',
  'Não estou em jejum (comi algo leve)',
  'Dormi pelo menos 6 horas ontem',
  'Não tomei antibiótico nos últimos 7 dias',
  'Não fiz tatuagem nos últimos 6 meses',
  'Estou me sentindo bem de saúde hoje',
  'Não consumi bebida alcoólica nas últimas 12 horas',
  'Peso acima de 50 kg',
];

export default function PreDonationChecklistScreen({ navigation }) {
  const { theme } = useThemeMode();
  const [checked, setChecked] = React.useState({});
  const anim = useSharedValue(1);
  React.useEffect(() => { AsyncStorage.getItem(KEY).then((v) => { if (v) { const data = JSON.parse(v); const today = new Date().toDateString(); if (data.day === today) setChecked(data.checked); else AsyncStorage.removeItem(KEY); } }); }, []);
  const toggle = async (i) => {
    anim.value = withSpring(1.2, {}, () => { anim.value = withSpring(1); });
    const next = { ...checked, [i]: !checked[i] };
    setChecked(next);
    await AsyncStorage.setItem(KEY, JSON.stringify({ day: new Date().toDateString(), checked: next }));
  };
  const count = Object.values(checked).filter(Boolean).length;
  const done = count === ITEMS.length;

  return <View style={{ flex: 1, backgroundColor: theme.background, padding: 20 }}><Text style={{ color: theme.text, fontWeight: '700', fontSize: 24 }}>Checklist pré-doação</Text><Text style={{ color: theme.muted }}>Verifique antes de ir ao hemocentro</Text><View style={{ height: 10, backgroundColor: theme.border, borderRadius: 999, marginVertical: 14 }}><View style={{ width: `${(count / ITEMS.length) * 100}%`, height: 10, backgroundColor: theme.primary, borderRadius: 999 }} /></View>{ITEMS.map((item, i) => <Pressable key={item} onPress={() => toggle(i)} style={{ backgroundColor: theme.card, borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}><MaterialCommunityIcons name={checked[i] ? 'check-circle' : 'circle-outline'} color={checked[i] ? '#4CAF85' : theme.muted} size={20} /><Text style={{ color: theme.text, flex: 1 }}>{item}</Text></Pressable>)}{done ? <View style={{ marginTop: 10 }}><Text style={{ color: '#4CAF85', fontWeight: '700' }}>Tudo certo! Você está preparado para doar.</Text><Pressable onPress={() => navigation.navigate('Schedule')} style={{ backgroundColor: theme.primary, padding: 12, borderRadius: 12, marginTop: 10 }}><Text style={{ color: '#fff' }}>Ir para agendamento</Text></Pressable></View> : null}</View>;
}
