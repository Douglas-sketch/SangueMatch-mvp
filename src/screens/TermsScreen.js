import React from 'react';
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
