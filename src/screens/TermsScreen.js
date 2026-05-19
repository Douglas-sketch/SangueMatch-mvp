import React from 'react';
<<<<<<< HEAD
import { ScrollView, Text } from 'react-native';
import { useThemeMode } from '../context/ThemeContext';

export default function TermsScreen() {
  const { theme } = useThemeMode();
  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background, padding: 20 }}>
      <Text style={{ color: theme.text, fontWeight: '700' }}>Seção 1 — Sobre o SangueMatch</Text>
      <Text style={{ color: theme.text }}>O SangueMatch é um projeto acadêmico desenvolvido por estudantes do curso de Desenvolvimento de Sistemas do SENAC-PE, com fins educacionais e de impacto social. Este é um MVP (Produto Mínimo Viável) e não representa um serviço médico oficial.</Text>
      <Text style={{ color: theme.text, fontWeight: '700', marginTop: 14 }}>Seção 2 — Dados coletados</Text><Text style={{ color: theme.text }}>nome completo, e-mail, data de nascimento, tipo sanguíneo, localização aproximada. Finalidade: personalizar a experiência de doação de sangue.</Text>
      <Text style={{ color: theme.text, fontWeight: '700', marginTop: 14 }}>Seção 3 — Armazenamento</Text><Text style={{ color: theme.text }}>Todos os seus dados são armazenados exclusivamente no seu dispositivo usando AsyncStorage. Não enviamos seus dados para servidores externos, exceto consultas ao assistente de IA (sem dados pessoais identificáveis).</Text>
      <Text style={{ color: theme.text, fontWeight: '700', marginTop: 14 }}>Seção 4 — LGPD</Text><Text style={{ color: theme.text }}>Direitos: acesso, correção e exclusão. Para exercer, use o botão "Sair" que remove dados locais. Contato do responsável: equipe acadêmica SangueMatch/SENAC-PE.</Text>
      <Text style={{ color: theme.text, fontWeight: '700', marginTop: 14 }}>Seção 5 — Isenção de responsabilidade médica</Text><Text style={{ color: theme.text }}>O SangueMatch não substitui orientação médica. As informações sobre elegibilidade para doação são educativas. Sempre consulte o hemocentro antes de doar.</Text>
      <Text style={{ color: theme.text, fontWeight: '700', marginTop: 14 }}>Seção 6 — Assistente de IA</Text><Text style={{ color: theme.text, marginBottom: 40 }}>A funcionalidade 'Posso Doar?' usa inteligência artificial para responder dúvidas gerais. As respostas não constituem aconselhamento médico e podem conter erros. Sempre confirme com o profissional do hemocentro.</Text>
    </ScrollView>
  );
}
=======
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useThemeMode } from '../context/ThemeContext';
import { colors, fonts } from '../constants/theme';

export default function TermsScreen() {
  const { theme } = useThemeMode();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.sectionTitle, { color: theme.secondary }]}>Seção 1 — Sobre o SangueMatch</Text>
      <Text style={[styles.paragraph, { color: theme.text }]}>O SangueMatch é um projeto acadêmico desenvolvido por estudantes do curso de Desenvolvimento de Sistemas do SENAC-PE, com fins educacionais e de impacto social. Este é um MVP (Produto Mínimo Viável) e não representa um serviço médico oficial.</Text>

      <Text style={[styles.sectionTitle, { color: theme.secondary }]}>Seção 2 — Dados coletados</Text>
      <Text style={[styles.paragraph, { color: theme.text }]}>Coletamos nome completo, e-mail, data de nascimento, tipo sanguíneo e localização aproximada. A finalidade é personalizar a experiência de doação de sangue, indicar hemocentros próximos e melhorar a apresentação das informações no app.</Text>

      <Text style={[styles.sectionTitle, { color: theme.secondary }]}>Seção 3 — Armazenamento</Text>
      <Text style={[styles.paragraph, { color: theme.text }]}>Todos os seus dados são armazenados exclusivamente no seu dispositivo usando AsyncStorage. Não enviamos seus dados para servidores externos, exceto consultas ao assistente de IA (sem dados pessoais identificáveis).</Text>

      <Text style={[styles.sectionTitle, { color: theme.secondary }]}>Seção 4 — LGPD</Text>
      <Text style={[styles.paragraph, { color: theme.text }]}>Você tem os direitos de acesso, correção e exclusão dos seus dados. Para exercer esses direitos, utilize o botão "Sair" no app, que remove todos os dados locais. Em caso de dúvida, entre em contato com o responsável pelo projeto no e-mail de suporte disponível no app.</Text>

      <Text style={[styles.sectionTitle, { color: theme.secondary }]}>Seção 5 — Isenção de responsabilidade médica</Text>
      <Text style={[styles.paragraph, { color: theme.text }]}>O SangueMatch não substitui orientação médica. As informações sobre elegibilidade para doação são educativas. Sempre consulte o hemocentro antes de doar.</Text>

      <Text style={[styles.sectionTitle, { color: theme.secondary }]}>Seção 6 — Assistente de IA</Text>
      <Text style={[styles.paragraph, { color: theme.text }]}>A funcionalidade "Posso Doar?" usa inteligência artificial para responder dúvidas gerais. As respostas não constituem aconselhamento médico e podem conter erros. Sempre confirme com o profissional do hemocentro.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontFamily: fonts.displayBold, fontSize: 20, marginBottom: 10 },
  paragraph: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24, marginBottom: 20 },
});
>>>>>>> 78fb240 (Correções)
