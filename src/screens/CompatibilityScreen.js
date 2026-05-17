import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

import AnimatedView from '../components/AnimatedView';
import Card from '../components/Card';
import BloodTypeSelector from '../components/BloodTypeSelector';
import SectionTitle from '../components/SectionTitle';
import { colors, fonts } from '../constants/theme';
import { useApp } from '../context/AppContext';
import { getCompatibility, splitBloodType } from '../utils/bloodCompatibility';

function Chip({ type, danger = false }) {
  return <Text accessibilityRole="text" accessibilityLabel={`Tipo ${type}`} style={[styles.chip, danger && styles.dangerChip]}>{type}</Text>;
}

export default function CompatibilityScreen() {
  const { user, updateUser, urgencies } = useApp();
  const type = user?.bloodType || 'Não sei';
  const { receiveFrom, donateTo } = getCompatibility(type);
  const parsed = splitBloodType(type);
  const critical = urgencies.find((item) => item.level === 'crítico');
  const pulse = useSharedValue(1);

  React.useEffect(() => {
    pulse.value = withRepeat(withSequence(withTiming(1.03, { duration: 700 }), withTiming(1, { duration: 700 })), -1, true);
  }, [pulse]);

  const alertStyle = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AnimatedView>
        <View style={styles.hero}>
          <Text style={styles.heroKicker}>Meu tipo sanguíneo</Text>
          <Text style={styles.heroType}>{type}</Text>
          <Text style={styles.heroText}>Sistema {parsed.abo} • Rh {parsed.rh}</Text>
        </View>
      </AnimatedView>

      <AnimatedView delay={80}>
        <SectionTitle title="Atualizar tipo" subtitle="A lógica de compatibilidade abaixo usa ABO + fator Rh." />
        <BloodTypeSelector value={type} onChange={(bloodType) => updateUser({ bloodType })} includeUnknown />
      </AnimatedView>

      <AnimatedView delay={120}>
        <Card style={styles.block}>
          <Text style={styles.blockTitle}>Posso receber de</Text>
          <View style={styles.chips}>{receiveFrom.length ? receiveFrom.map((item) => <Chip key={item} type={item} />) : <Text style={styles.empty}>Informe seu tipo sanguíneo.</Text>}</View>
        </Card>
      </AnimatedView>

      <AnimatedView delay={160}>
        <Card style={styles.block}>
          <Text style={styles.blockTitle}>Posso doar para</Text>
          <View style={styles.chips}>{donateTo.length ? donateTo.map((item) => <Chip key={item} type={item} danger={item === critical?.type} />) : <Text style={styles.empty}>Informe seu tipo sanguíneo.</Text>}</View>
        </Card>
      </AnimatedView>

      {critical ? (
        <Animated.View style={[styles.alert, alertStyle]} accessibilityRole="alert" accessibilityLabel={`Alerta: tipo ${critical.type} em falta crítica`}>
          <Text style={styles.alertTitle}>⚠️ {critical.type} em falta crítica</Text>
          <Text style={styles.alertText}>Se você pode doar para esse tipo, sua ajuda é ainda mais importante hoje.</Text>
        </Animated.View>
      ) : null}

      <AnimatedView delay={220}>
        <SectionTitle title="Como funciona?" />
        <Card>
          <Text style={styles.education}>
            O sistema ABO classifica o sangue em A, B, AB e O. O tipo O não possui antígenos A ou B nas hemácias, por isso O− é conhecido como doador universal de hemácias. Já AB+ pode receber de todos os tipos por ter antígenos A e B e fator Rh positivo. O fator Rh indica se o sangue é positivo ou negativo: em regra, pessoas Rh negativas devem receber sangue Rh negativo, enquanto Rh positivas podem receber positivo ou negativo, respeitando o ABO.
          </Text>
        </Card>
      </AnimatedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingTop: 58, paddingBottom: 110 },
  hero: { backgroundColor: colors.primary, borderRadius: 28, padding: 24, alignItems: 'center', marginBottom: 22 },
  heroKicker: { fontFamily: fonts.bold, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: 1 },
  heroType: { fontFamily: fonts.displayBold, color: '#fff', fontSize: 52, marginVertical: 6 },
  heroText: { fontFamily: fonts.medium, color: '#fff' },
  block: { marginTop: 16 },
  blockTitle: { fontFamily: fonts.displayBold, color: colors.secondary, fontSize: 22, marginBottom: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { backgroundColor: '#F5E8E6', color: colors.secondary, fontFamily: fonts.displayBold, fontSize: 22, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, overflow: 'hidden' },
  dangerChip: { backgroundColor: colors.primary, color: '#fff' },
  empty: { fontFamily: fonts.regular, color: colors.muted },
  alert: { marginTop: 18, backgroundColor: colors.secondary, borderRadius: 24, padding: 18, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)' },
  alertTitle: { fontFamily: fonts.displayBold, color: '#fff', fontSize: 22 },
  alertText: { fontFamily: fonts.regular, color: 'rgba(255,255,255,0.78)', marginTop: 6, lineHeight: 22 },
  education: { fontFamily: fonts.regular, color: colors.muted, lineHeight: 24, fontSize: 15 },
});
