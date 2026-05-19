import React from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import { useThemeMode } from '../context/ThemeContext';
import { useFontScale } from '../hooks/useFontScale';

const KEY = '@chat:eligibility';
const SYSTEM_PROMPT = 'Você é um assistente educativo especializado em doação de sangue no Brasil. Use os critérios da RDC ANVISA 34/2014. Responda de forma clara, empática e em português brasileiro. Sempre termine recomendando confirmar com o hemocentro. Nunca faça diagnósticos médicos. Máximo 3 parágrafos por resposta.';

export default function EligibilityAssistantScreen() {
  const { theme } = useThemeMode();
  const scale = useFontScale();
  const [messages, setMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const listRef = React.useRef(null);
  const p = useSharedValue(1);
  React.useEffect(() => { AsyncStorage.getItem(KEY).then((v) => v && setMessages(JSON.parse(v))); p.value = withRepeat(withSequence(withTiming(0.2, { duration: 300 }), withTiming(1, { duration: 300 })), -1); }, [p]);
  React.useEffect(() => { listRef.current?.scrollToEnd({ animated: true }); }, [messages, loading]);
  const dotStyle = useAnimatedStyle(() => ({ opacity: p.value }));

  const send = async () => {
    if (!input.trim() || loading) return;
    const next = [...messages, { role: 'user', text: input.trim() }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.EXPO_PUBLIC_ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 350, system: SYSTEM_PROMPT, messages: [{ role: 'user', content: input.trim() }] }),
      });
      const data = await response.json();
      const text = data?.content?.[0]?.text || 'Não consegui responder agora. Tente novamente.';
      const final = [...next, { role: 'assistant', text }];
      setMessages(final);
      await AsyncStorage.setItem(KEY, JSON.stringify(final));
    } catch {
      const final = [...next, { role: 'assistant', text: 'Não consegui responder agora. Tente novamente.' }];
      setMessages(final);
      await AsyncStorage.setItem(KEY, JSON.stringify(final));
    } finally { setLoading(false); }
  };

  return <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><View style={{ padding: 16 }}><Text style={{ color: theme.text, fontSize: 26 * scale, fontWeight: '700' }}>Posso Doar?</Text><Text style={{ color: theme.muted, fontSize: 13 * scale }}>Assistente educativo — não substitui orientação médica</Text><View style={{ backgroundColor: '#F7A541', borderRadius: 12, padding: 10, marginTop: 10, flexDirection: 'row', gap: 8 }}><MaterialCommunityIcons name='alert' size={18} color='#0F1923' /><Text style={{ flex: 1, color: '#0F1923' }}>Este assistente é educativo. Sempre confirme com o hemocentro antes de doar.</Text></View></View><FlatList ref={listRef} data={messages} keyExtractor={(_, i) => String(i)} contentContainerStyle={{ padding: 16 }} renderItem={({ item }) => <View style={{ alignSelf: item.role === 'user' ? 'flex-end' : 'flex-start', backgroundColor: item.role === 'user' ? '#E05252' : theme.card, borderRadius: 12, padding: 10, marginBottom: 8, maxWidth: '84%' }}><Text style={{ color: item.role === 'user' ? '#fff' : theme.text }}>{item.text}</Text></View>} ListEmptyComponent={<Text style={{ color: theme.muted, textAlign: 'center' }}>Pergunte sobre elegibilidade...</Text>} />{loading ? <View style={{ backgroundColor: theme.card, padding: 10, borderRadius: 12, marginLeft: 16, alignSelf: 'flex-start', marginBottom: 8 }}><Animated.Text style={[{ color: theme.text }, dotStyle]}>•••</Animated.Text></View> : null}<View style={{ flexDirection: 'row', gap: 8, padding: 12 }}><TextInput accessibilityLabel='Pergunta' value={input} onChangeText={setInput} placeholder='Pergunte sobre elegibilidade...' placeholderTextColor={theme.muted} style={{ flex: 1, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card, borderRadius: 12, paddingHorizontal: 12, color: theme.text }} /><Pressable accessibilityRole='button' accessibilityLabel='Enviar pergunta' accessibilityHint='Envia sua pergunta para o assistente' onPress={send} style={{ width: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primary }}><MaterialCommunityIcons name='send' color='#fff' size={18} /></Pressable></View></KeyboardAvoidingView></SafeAreaView>;
}
