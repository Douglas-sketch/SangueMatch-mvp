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
