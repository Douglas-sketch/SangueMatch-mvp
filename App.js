import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Fraunces_600SemiBold, Fraunces_700Bold } from '@expo-google-fonts/fraunces';
import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import * as Notifications from 'expo-notifications';
import { AppProvider } from './src/context/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/constants/theme';
import { ThemeProvider, useThemeMode } from './src/context/ThemeContext';

Notifications.setNotificationHandler({ handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: true, shouldSetBadge: false }) });

function Shell() {
  const { mode, theme } = useThemeMode();
  const navigationTheme = {
    ...DefaultTheme,
    dark: mode === 'dark',
    colors: { ...DefaultTheme.colors, background: theme.background, primary: theme.primary, card: theme.card, text: theme.text, border: theme.border },
  };
  return (<NavigationContainer theme={navigationTheme}><StatusBar style={mode === 'dark' ? 'light' : 'dark'} /><AppNavigator /></NavigationContainer>);
}

export default function App() {
  const [fontsLoaded] = useFonts({ Fraunces_600SemiBold, Fraunces_700Bold, DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold, DMSans_700Bold });
  if (!fontsLoaded) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}><ActivityIndicator color={colors.primary} /></View>;
  return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><ThemeProvider><AppProvider><Shell /></AppProvider></ThemeProvider></SafeAreaProvider></GestureHandlerRootView>;
}
