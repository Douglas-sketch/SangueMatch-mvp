<<<<<<< HEAD
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
=======
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
	Animated as RNAnimated,
	FlatList,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	SafeAreaView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { useThemeMode } from '../context/ThemeContext';
import { useFontScale } from '../hooks/useFontScale';
import { colors, fonts } from '../constants/theme';

const STORAGE_KEY = '@chat:eligibility';

const SYSTEM_PROMPT = `Você é um assistente educativo especializado em doação de sangue no Brasil. Use os critérios da RDC ANVISA 34/2014. Responda de forma clara, empática e em português brasileiro. Sempre termine recomendando confirmar com o hemocentro. Nunca faça diagnósticos médicos. Máximo 3 parágrafos por resposta.`;

export default function EligibilityAssistantScreen() {
	const { theme } = useThemeMode();
	const scale = useFontScale();
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);
	const listRef = useRef(null);
	const typingOpacity = useSharedValue(0);
	const dotOne = useSharedValue(0);
	const dotTwo = useSharedValue(0);
	const dotThree = useSharedValue(0);

	useEffect(() => {
		AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
			if (stored) setMessages(JSON.parse(stored));
		});
	}, []);

	useEffect(() => {
		if (loading) {
			typingOpacity.value = withRepeat(withTiming(1, { duration: 600 }), -1, true);
			dotOne.value = withRepeat(withSequence(withTiming(1, { duration: 400 }), withTiming(0.3, { duration: 400 })), -1, true);
			dotTwo.value = withRepeat(withSequence(withTiming(1, { duration: 400, delay: 200 }), withTiming(0.3, { duration: 400 })), -1, true);
			dotThree.value = withRepeat(withSequence(withTiming(1, { duration: 400, delay: 400 }), withTiming(0.3, { duration: 400 })), -1, true);
		} else {
			typingOpacity.value = 0;
			dotOne.value = 0;
			dotTwo.value = 0;
			dotThree.value = 0;
		}
	}, [loading, typingOpacity, dotOne, dotTwo, dotThree]);

	useEffect(() => {
		if (messages.length) {
			setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
		}
	}, [messages]);

	const typingOne = useAnimatedStyle(() => ({ opacity: dotOne.value }));
	const typingTwo = useAnimatedStyle(() => ({ opacity: dotTwo.value }));
	const typingThree = useAnimatedStyle(() => ({ opacity: dotThree.value }));

	async function saveMessages(next) {
		setMessages(next);
		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	}

	async function handleSend() {
		if (!input.trim()) return;
		const userMessage = { id: `${Date.now()}-user`, role: 'user', text: input.trim() };
		const nextMessages = [...messages, userMessage];
		setInput('');
		setLoading(true);
		await saveMessages(nextMessages);
		try {
			const response = await fetch('https://api.anthropic.com/v1/messages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'x-api-key': process.env.EXPO_PUBLIC_ANTHROPIC_KEY,
					'anthropic-version': '2023-06-01',
				},
				body: JSON.stringify({
					model: 'claude-sonnet-4-20250514',
					max_tokens_to_sample: 300,
					temperature: 0.7,
					messages: [
						{ role: 'system', content: SYSTEM_PROMPT },
						{ role: 'user', content: input.trim() },
					],
				}),
			});
			const data = await response.json();
			const assistantText = data?.completion || data?.response || 'Não consegui responder agora. Tente novamente.';
			const assistantMessage = { id: `${Date.now()}-assistant`, role: 'assistant', text: assistantText };
			await saveMessages([...nextMessages, assistantMessage]);
		} catch (error) {
			const errorMessage = { id: `${Date.now()}-assistant-error`, role: 'assistant', text: 'Não consegui responder agora. Tente novamente.' };
			await saveMessages([...nextMessages, errorMessage]);
		} finally {
			setLoading(false);
		}
	}

	const renderMessage = ({ item }) => {
		const isUser = item.role === 'user';
		return (
			<View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble, { alignSelf: isUser ? 'flex-end' : 'flex-start', backgroundColor: isUser ? colors.primary : theme.card }]}> 
				<Text style={[styles.messageText, { color: isUser ? '#fff' : theme.text, fontSize: 16 * scale }]}>{item.text}</Text>
			</View>
		);
	};

	return (
		<SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}> 
			<KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
				<View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}> 
					<Text style={[styles.title, { color: theme.secondary, fontSize: 24 * scale }]}>Posso Doar?</Text>
					<Text style={[styles.subtitle, { color: theme.muted, fontSize: 14 * scale }]}>Assistente educativo — não substitui orientação médica</Text>
				</View>
				<View style={[styles.warningCard, { backgroundColor: colors.warning }]}> 
					<Text style={[styles.warningText, { color: '#1B1A02', fontSize: 14 * scale }]}>⚠️ Este assistente é educativo. Sempre confirme com o hemocentro antes de doar.</Text>
				</View>
				<FlatList
					ref={listRef}
					data={messages}
					keyExtractor={(item) => item.id}
					renderItem={renderMessage}
					contentContainerStyle={styles.messages}
					ListEmptyComponent={<Text style={[styles.empty, { fontSize: 16 * scale }]}>Pergunte sobre elegibilidade...</Text>}
				/>
				{loading ? (
					<View style={[styles.typingBubble, { backgroundColor: theme.card, borderColor: theme.border }]}> 
						<Animated.View style={[styles.typingDot, typingOne, { backgroundColor: theme.primary }]} />
						<Animated.View style={[styles.typingDot, typingTwo, { backgroundColor: theme.primary }]} />
						<Animated.View style={[styles.typingDot, typingThree, { backgroundColor: theme.primary }]} />
					</View>
				) : null}
				<View style={[styles.inputRow, { backgroundColor: theme.card, borderColor: theme.border }]}> 
					<TextInput
						value={input}
						onChangeText={setInput}
						placeholder="Pergunte sobre elegibilidade..."
						placeholderTextColor={theme.muted}
						accessibilityLabel="Campo de pergunta"
						style={[styles.input, { color: theme.text, fontSize: 16 * scale }]}
					/>
					<Pressable
						onPress={handleSend}
						accessibilityRole="button"
						accessibilityLabel="Enviar pergunta"
						accessibilityHint="Envia sua pergunta para o assistente"
						style={({ pressed }) => [styles.sendButton, pressed && styles.pressed]}
					>
						<Text style={styles.sendText}>{loading ? '...' : 'Enviar'}</Text>
					</Pressable>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: { flex: 1 },
	keyboard: { flex: 1 },
	header: { padding: 20, borderBottomWidth: 1 },
	title: { fontFamily: fonts.displayBold },
	subtitle: { fontFamily: fonts.regular, marginTop: 6 },
	warningCard: { padding: 16, borderRadius: 20, margin: 20 },
	warningText: { fontFamily: fonts.medium },
	messages: { paddingHorizontal: 20, paddingBottom: 16 },
	messageBubble: { maxWidth: '80%', borderRadius: 18, padding: 14, marginBottom: 12 },
	userBubble: { backgroundColor: colors.primary },
	assistantBubble: { backgroundColor: '#F0F0F3' },
	messageText: { fontFamily: fonts.regular, lineHeight: 22 },
	empty: { padding: 20, textAlign: 'center', color: colors.muted },
	typingBubble: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 18, marginHorizontal: 20, marginBottom: 12, borderWidth: 1 },
	typingDot: { width: 10, height: 10, borderRadius: 6, marginHorizontal: 4 },
	inputRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
	input: { flex: 1, minHeight: 48, paddingVertical: 10 },
	sendButton: { backgroundColor: colors.primary, borderRadius: 16, paddingHorizontal: 18, paddingVertical: 14, marginLeft: 10 },
	sendText: { color: '#fff', fontFamily: fonts.bold },
	pressed: { opacity: 0.8 },
});
>>>>>>> 78fb240 (Correções)
