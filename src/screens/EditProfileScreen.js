import React, { useMemo, useState } from 'react';
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
