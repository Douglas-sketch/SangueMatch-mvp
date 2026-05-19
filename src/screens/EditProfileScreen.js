import React, { useMemo, useState } from 'react';
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
