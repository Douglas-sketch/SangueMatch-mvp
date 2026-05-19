import React, { useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Button from '../components/Button';
import Input from '../components/Input';
import BloodTypeSelector from '../components/BloodTypeSelector';
import LogoMark from '../components/LogoMark';
import AnimatedView from '../components/AnimatedView';
import { colors, fonts } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { requestNotificationPermission } from '../utils/notifications';

const initialForm = {
  name: '',
  email: '',
  password: '',
  birthDate: '',
  bloodType: '',
};

function validateStep(step, form) {
  const errors = {};
  if (step === 0) {
    if (form.name.trim().split(' ').length < 2) errors.name = 'Informe nome e sobrenome.';
    if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'E-mail inválido.';
    if (form.password.length < 6) errors.password = 'A senha precisa ter pelo menos 6 caracteres.';
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.birthDate)) errors.birthDate = 'Use o formato DD/MM/AAAA.';
  }
  if (step === 1 && !form.bloodType) errors.bloodType = 'Selecione um tipo sanguíneo ou marque que não sabe.';
  return errors;
}

export default function RegisterScreen({ navigation }) {
  const { saveUser, requestAndStoreLocation } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const errors = useMemo(() => validateStep(step, form), [step, form]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const canContinue = Object.keys(errors).length === 0 && (step !== 2 || termsAccepted);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function next() {
    if (!canContinue) return;
    if (step < 2) {
      setStep((current) => current + 1);
      return;
    }

    setLoading(true);
    try {
      const locationResult = await requestAndStoreLocation();
      const notificationsGranted = await requestNotificationPermission();
      await saveUser({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        birthDate: form.birthDate,
        bloodType: form.bloodType || 'Não sei',
        termsAcceptedAt: new Date().toISOString(),
        permissions: {
          location: locationResult.granted,
          notifications: notificationsGranted,
        },
      });
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Não foi possível concluir', 'Tente novamente em alguns segundos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <LogoMark size={64} />
        <Text style={styles.kicker}>Cadastro • etapa {step + 1} de 3</Text>
        <Text style={styles.title}>{step === 0 ? 'Vamos criar seu perfil' : step === 1 ? 'Qual seu tipo sanguíneo?' : 'Permissões essenciais'}</Text>
        <View style={styles.progress} accessibilityRole="progressbar" accessibilityLabel={`Etapa ${step + 1} de 3`}>
          {[0, 1, 2].map((item) => <View key={item} style={[styles.progressItem, item <= step && styles.progressActive]} />)}
        </View>

        {step === 0 ? (
          <AnimatedView>
            <Input label="Nome completo" value={form.name} onChangeText={(v) => update('name', v)} error={errors.name} autoCapitalize="words" />
            <Input label="E-mail" value={form.email} onChangeText={(v) => update('email', v)} error={errors.email} keyboardType="email-address" autoCapitalize="none" />
            <Input label="Senha" value={form.password} onChangeText={(v) => update('password', v)} error={errors.password} secureTextEntry />
            <Input label="Data de nascimento" value={form.birthDate} onChangeText={(v) => update('birthDate', v)} error={errors.birthDate} placeholder="DD/MM/AAAA" keyboardType="numbers-and-punctuation" />

            <Pressable onPress={() => setTermsAccepted((v) => !v)} style={styles.termsRow}>
              <MaterialCommunityIcons name={termsAccepted ? 'checkbox-marked' : 'checkbox-blank-outline'} color={colors.primary} size={22} />
              <Text style={styles.permissionBody}>Li e aceito os </Text>
              <Pressable onPress={() => navigation.navigate('Terms')}><Text style={[styles.permissionBody, { color: colors.primary }]}>Termos de Uso e Política de Privacidade</Text></Pressable>
            </Pressable>
          </AnimatedView>
        ) : null}

        {step === 1 ? (
          <AnimatedView>
            <BloodTypeSelector value={form.bloodType} onChange={(value) => update('bloodType', value)} />
            {errors.bloodType ? <Text style={styles.error}>{errors.bloodType}</Text> : null}
          </AnimatedView>
        ) : null}

        {step === 2 ? (
          <AnimatedView>
            <View style={styles.permissionCard}>
              <MaterialCommunityIcons name="map-marker-radius" color={colors.primary} size={32} />
              <View style={{ flex: 1 }}>
                <Text style={styles.permissionTitle}>Localização</Text>
                <Text style={styles.permissionBody}>Usada para encontrar hemocentros próximos e calcular distâncias reais.</Text>
              </View>
            </View>
            <View style={styles.permissionCard}>
              <MaterialCommunityIcons name="bell-ring" color={colors.primary} size={32} />
              <View style={{ flex: 1 }}>
                <Text style={styles.permissionTitle}>Notificações</Text>
                <Text style={styles.permissionBody}>Usadas para lembrar você um dia antes do agendamento.</Text>
              </View>
            </View>
            <View style={styles.termsRow}>
              <Pressable
                onPress={() => setTermsAccepted((current) => !current)}
                accessibilityRole="checkbox"
                accessibilityLabel="Aceito os termos de uso e política de privacidade"
                accessibilityState={{ checked: termsAccepted }}
                style={styles.checkbox}
              >
                <View style={[styles.checkboxBox, termsAccepted && styles.checkboxActive]}>
                  {termsAccepted ? <MaterialCommunityIcons name="check" color="#fff" size={16} /> : null}
                </View>
                <Text style={styles.checkboxLabel}>
                  Li e aceito os{' '}
                  <Text style={styles.link} onPress={() => navigation.navigate('Terms')}>
                    Termos de Uso e a Política de Privacidade
                  </Text>
                </Text>
              </Pressable>
            </View>
          </AnimatedView>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        {step > 0 ? <Button title="Voltar" variant="ghost" onPress={() => setStep((current) => current - 1)} /> : null}
        <Button title={step === 2 ? 'Finalizar cadastro' : 'Continuar'} onPress={next} disabled={!canContinue || (step === 2 && !termsAccepted)} loading={loading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, paddingTop: 62 },
  kicker: { fontFamily: fonts.bold, color: colors.primary, marginTop: 20, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 36, lineHeight: 40, marginTop: 6 },
  progress: { flexDirection: 'row', gap: 8, marginVertical: 22 },
  progressItem: { flex: 1, height: 8, borderRadius: 999, backgroundColor: 'rgba(224,82,82,0.18)' },
  progressActive: { backgroundColor: colors.primary },
  footer: { padding: 24, gap: 12, backgroundColor: colors.background },
  error: { color: colors.primary, fontFamily: fonts.semi, marginTop: 10 },
  termsRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 8 },
  permissionCard: { backgroundColor: '#fff', borderRadius: 22, padding: 18, borderWidth: 0.5, borderColor: colors.line, flexDirection: 'row', gap: 14, marginBottom: 14 },
  permissionTitle: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 20 },
  permissionBody: { fontFamily: fonts.regular, color: colors.muted, lineHeight: 21, marginTop: 4 },
  termsRow: { marginTop: 20 },
  checkbox: { flexDirection: 'row', alignItems: 'center' },
  checkboxBox: { width: 24, height: 24, borderWidth: 1, borderColor: colors.primary, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: colors.primary },
  checkboxLabel: { marginLeft: 8, fontFamily: fonts.regular, color: colors.secondary },
  link: { color: colors.primary, textDecorationLine: 'underline' },
});
