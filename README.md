# SangueMatch

MVP mobile em **React Native + Expo** para incentivar jovens de 18 a 25 anos a doar sangue, com mapa de hemocentros, compatibilidade sanguínea, agendamento local, notificações, badges e acessibilidade.

## Stack

- Expo SDK 55 + React Native 0.83 + React 19.2
- React Navigation: Stack + Bottom Tabs
- Expo Location
- react-native-maps
- Google Places API via `EXPO_PUBLIC_GOOGLE_PLACES_KEY`
- AsyncStorage
- Expo Notifications
- React Native Reanimated
- Expo Linear Gradient
- Fontes Google: Fraunces e DM Sans

## Como rodar

```bash
npm install
npx expo install --fix
cp .env.example .env
npm start
```

Abra no Expo Go pelo QR Code ou use:

```bash
npm run android
npm run ios
```

## Variáveis e chaves

Para buscar hemocentros reais pelo Google Places:

```env
EXPO_PUBLIC_GOOGLE_PLACES_KEY=sua_chave
```

Para builds standalone com `react-native-maps`, coloque as chaves nativas em `app.json`:

```json
"android": { "config": { "googleMaps": { "apiKey": "SUA_KEY" } } }
"ios": { "config": { "googleMapsApiKey": "SUA_KEY" } }
```

Sem chave do Google Places, o app cai automaticamente para fallback realista de Recife/PE:

- HEMOPE Recife / Boa Vista-Graças
- HEMOPE Casa Amarela
- Hospital das Clínicas UFPE

## O que já vem pronto

- Splash com logo animada e progress bar
- Onboarding em 3 slides com swipe
- Cadastro em 3 etapas com validação em tempo real
- Persistência completa no AsyncStorage
- Dashboard com saudação, status de aptidão, vidas salvas, urgências e hemocentro próximo
- Mapa com pins, lista por distância, filtro de urgência e rotas no Google Maps
- Compatibilidade ABO + Rh com lógica real
- Agendamento com calendário, horários, modal e notificação local para o dia anterior às 18h
- Gamificação com XP, badges, glow e partículas simuladas no desbloqueio
- Perfil com histórico e menu de acessibilidade
- Acessibilidade com alto contraste, leitor de tela, modo daltônico e tamanho de fonte

## Observações importantes

- Este é um MVP local, sem backend.
- A busca por hemocentros reais depende da Google Places API. Quando ela falha, o app usa fallback local.
- Os status de urgência são mockados dinamicamente por sessão.
- Os dados de doações são pré-populados na primeira execução para facilitar demonstração.
- Para produção, mova chaves sensíveis para um backend/proxy, valide agendamentos em servidor e integre com hemocentros oficiais.

## Estrutura

```txt
SangueMatch/
├── App.js
├── app.json
├── babel.config.js
├── package.json
├── .env.example
├── README.md
├── scripts/
│   └── reset-data.js
└── src/
    ├── assets/
    ├── components/
    ├── constants/
    ├── context/
    ├── hooks/
    ├── navigation/
    ├── screens/
    └── utils/
```

## Caso o Expo avise sobre versões

O projeto foi montado para Expo SDK 55. Como o SDK 55 usa o novo esquema de versionamento dos pacotes Expo, rode sempre:

```bash
npx expo install --fix
npx expo-doctor@latest
```

Isso ajusta versões compatíveis no seu ambiente se algum pacote mudar de patch.
