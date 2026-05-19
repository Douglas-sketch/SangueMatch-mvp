# SangueMatch MVP

## Configuração do ambiente
1. Instale dependências: `npm install`.
2. Crie `.env` a partir de `.env.example`.
3. Preencha as chaves necessárias.
4. Execute: `npm run start`.

## APIs necessárias
### Google Places API
- Crie no Google Cloud Console: APIs & Services > Library > Places API.
- Gere chave em APIs & Services > Credentials.
- Restrinja por plataforma (Android package + SHA1 / iOS bundle id).

### Anthropic API
- Crie a chave em https://console.anthropic.com.
- Usada na tela **Posso Doar?** para respostas educativas.
- Segurança MVP: chave no bundle; produção deve usar proxy backend.

## Funcionalidades implementadas
- Onboarding e cadastro com aceite de termos.
- Home com status e agendamento.
- BloodQuest (aba Quest): personagem, classes por tipo sanguíneo, quiz de 20 perguntas.
- Perfil com foto via câmera/galeria, edição de perfil, menu LGPD.
- Tela de termos e privacidade.
- Assistente IA de elegibilidade.
- QR Code de doador com compartilhamento.
- Checklist pré-doação com persistência diária.

## Notas de segurança
- Este MVP usa variáveis públicas (`EXPO_PUBLIC_*`) no app cliente.
- Não armazene segredos sensíveis no app em produção.

## LGPD
- Dados são armazenados localmente em AsyncStorage.
- Usuário pode remover dados no botão **Sair**.
- Assistente IA é educativo e não substitui orientação médica.
