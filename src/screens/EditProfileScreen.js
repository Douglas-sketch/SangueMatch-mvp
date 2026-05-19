import React, { useMemo, useState } from 'react';
<<<<<<< HEAD
import { Alert, ScrollView, Text, View } from 'react-native';
import Input from '../components/Input';
import BloodTypeSelector from '../components/BloodTypeSelector';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { useThemeMode } from '../context/ThemeContext';

export default function EditProfileScreen({ navigation }) {
  const { user, updateUser } = useApp();
  const { theme } = useThemeMode();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', birthDate: user?.birthDate || '', bloodType: user?.bloodType || '' });
  const errors = useMemo(() => {
    const e = {};
    if (form.name.trim().split(' ').length < 2) e.name = 'Informe nome e sobrenome.';
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'E-mail inválido.';
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.birthDate)) e.birthDate = 'Use DD/MM/AAAA.';
    if (!form.bloodType) e.bloodType = 'Selecione um tipo sanguíneo.';
    return e;
  }, [form]);

  const save = async () => {
    if (Object.keys(errors).length) return;
    await updateUser(form);
    Alert.alert('Perfil atualizado', 'Alterações salvas com sucesso.');
    navigation.goBack();
  };

  return <ScrollView style={{ flex: 1, backgroundColor: theme.background, padding: 20 }}><Input label="Nome completo" value={form.name} onChangeText={(name) => setForm((s) => ({ ...s, name }))} error={errors.name} /><Input label="E-mail" value={form.email} onChangeText={(email) => setForm((s) => ({ ...s, email }))} error={errors.email} /><Input label="Data de nascimento" value={form.birthDate} onChangeText={(birthDate) => setForm((s) => ({ ...s, birthDate }))} error={errors.birthDate} /><Text style={{ color: theme.text, marginBottom: 8 }}>Tipo sanguíneo</Text><BloodTypeSelector value={form.bloodType} onChange={(bloodType) => setForm((s) => ({ ...s, bloodType }))} includeUnknown /><View style={{ marginTop: 16 }}><Button title="Salvar alterações" onPress={save} /></View></ScrollView>;
}
=======
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Button from '../components/Button';
import Input from '../components/Input';
import BloodTypeSelector from '../components/BloodTypeSelector';
import Card from '../components/Card';
import { useApp } from '../context/AppContext';
import { colors, fonts } from '../constants/theme';
import { useFontScale } from '../hooks/useFontScale';

function validate(values) {
  const errors = {};
  if (values.name.trim().split(' ').length < 2) errors.name = 'Informe nome e sobrenome.';
  if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'E-mail inválido.';
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(values.birthDate)) errors.birthDate = 'Use o formato DD/MM/AAAA.';
  if (!values.bloodType) errors.bloodType = 'Selecione seu tipo sanguíneo.';
  return errors;
}

export default function EditProfileScreen({ navigation }) {
  const { user, updateUser } = useApp();
  const scale = useFontScale();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    birthDate: user?.birthDate || '',
    bloodType: user?.bloodType || '',
  });
  const [loading, setLoading] = useState(false);
  const errors = useMemo(() => validate(form), [form]);
  const canSave = Object.keys(errors).length === 0;

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function save() {
    if (!canSave) return;
    setLoading(true);
    try {
      await updateUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        birthDate: form.birthDate,
        bloodType: form.bloodType,
      });
      Alert.alert('Perfil atualizado', 'Suas informações foram salvas com sucesso.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Falha ao salvar', 'Tente novamente em alguns segundos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.heading, { fontSize: 28 * scale }]}>Editar perfil</Text>
        <Text style={[styles.description, { fontSize: 16 * scale }]}>Atualize seu nome, e-mail, data de nascimento e tipo sanguíneo.</Text>

        <Card style={styles.formCard}>
          <Input label="Nome completo" value={form.name} onChangeText={(value) => update('name', value)} error={errors.name} autoCapitalize="words" />
          <Input label="E-mail" value={form.email} onChangeText={(value) => update('email', value)} error={errors.email} keyboardType="email-address" autoCapitalize="none" />
          <Input label="Data de nascimento" value={form.birthDate} onChangeText={(value) => update('birthDate', value)} error={errors.birthDate} placeholder="DD/MM/AAAA" keyboardType="numbers-and-punctuation" />
          <Text style={[styles.label, { fontSize: 14 * scale }]}>Tipo sanguíneo</Text>
          <BloodTypeSelector value={form.bloodType} onChange={(value) => update('bloodType', value)} />
          {errors.bloodType ? <Text style={styles.error}>{errors.bloodType}</Text> : null}
        </Card>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Salvar alterações" onPress={save} disabled={!canSave} loading={loading} accessibilityHint="Salva as alterações do perfil." />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 32, paddingBottom: 24 },
  heading: { fontFamily: fonts.displayBold, color: colors.secondary, marginBottom: 8 },
  description: { fontFamily: fonts.regular, color: colors.muted, marginBottom: 22, lineHeight: 22 },
  formCard: { padding: 20 },
  label: { fontFamily: fonts.semi, color: colors.secondary, marginBottom: 12 },
  error: { color: colors.danger, fontFamily: fonts.medium, marginTop: 10 },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.line },
});
>>>>>>> 78fb240 (Correções)
