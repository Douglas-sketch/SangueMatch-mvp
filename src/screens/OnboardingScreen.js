import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import AnimatedView from '../components/AnimatedView';
import Button from '../components/Button';
import ProgressDots from '../components/ProgressDots';
import { colors, fonts } from '../constants/theme';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

const slides = [
  {
    icon: 'water',
    title: 'Cada doação salva até 4 vidas',
    body: 'O sangue doado é separado em componentes e pode ajudar pessoas em tratamentos, cirurgias e emergências.',
    stat: '2% da população brasileira doa sangue regularmente.',
  },
  {
    icon: 'map-marker-radius',
    title: 'Encontre o hemocentro mais próximo de você',
    body: 'Use sua localização para ver locais de doação, distância e rota pelo mapa.',
    stat: 'Recife/PE já vem com hemocentros de fallback para testes.',
  },
  {
    icon: 'trophy-award',
    title: 'Doe, conquiste badges e inspire outros',
    body: 'Acompanhe suas doações, vidas salvas, XP, conquistas e sequência de meses.',
    stat: 'Gamificação feita para jovens de 18 a 25 anos.',
  },
];

export default function OnboardingScreen({ navigation }) {
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);
  const { completeOnboarding } = useApp();

  function goNext() {
    if (index < slides.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    } else {
      completeOnboarding();
      navigation.replace('Register');
    }
  }

  async function skip() {
    await completeOnboarding();
    navigation.replace('Register');
  }

  return (
    <LinearGradient colors={[colors.background, '#F9E3DF']} style={styles.container}>
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        onMomentumScrollEnd={(event) => setIndex(Math.round(event.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <AnimatedView style={styles.iconWrap}>
              <MaterialCommunityIcons name={item.icon} color="#fff" size={72} accessibilityLabel={item.title} />
            </AnimatedView>
            <AnimatedView delay={80}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.body}>{item.body}</Text>
              <View style={styles.statCard}>
                <Text style={styles.stat}>{item.stat}</Text>
              </View>
            </AnimatedView>
          </View>
        )}
      />
      <View style={styles.footer}>
        <ProgressDots total={slides.length} index={index} />
        <Button title={index === slides.length - 1 ? 'Começar agora' : 'Próximo'} onPress={goNext} />
        <Button title="Pular" variant="ghost" onPress={skip} />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: { width, padding: 28, alignItems: 'center', justifyContent: 'center' },
  iconWrap: { width: 142, height: 142, borderRadius: 44, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 34 },
  title: { fontFamily: fonts.displayBold, color: colors.secondary, textAlign: 'center', fontSize: 36, lineHeight: 40 },
  body: { fontFamily: fonts.regular, color: colors.muted, textAlign: 'center', fontSize: 16, lineHeight: 24, marginTop: 14 },
  statCard: { marginTop: 22, borderRadius: 22, backgroundColor: '#fff', padding: 16, borderWidth: 0.5, borderColor: colors.line },
  stat: { fontFamily: fonts.bold, color: colors.primary, textAlign: 'center' },
  footer: { paddingHorizontal: 28, paddingBottom: 28, gap: 16 },
});
