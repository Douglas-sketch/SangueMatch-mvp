import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen';
import CompatibilityScreen from '../screens/CompatibilityScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import BadgesScreen from '../screens/BadgesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AccessibilityScreen from '../screens/AccessibilityScreen';
import TermsScreen from '../screens/TermsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import QRCodeScreen from '../screens/QRCodeScreen';
import PreDonationChecklistScreen from '../screens/PreDonationChecklistScreen';
import BloodQuestScreen from '../game/BloodQuestScreen';
import QuestMissionScreen from '../game/QuestMissionScreen';
import EligibilityAssistantScreen from '../ai/EligibilityAssistantScreen';
import { colors, fonts } from '../constants/theme';
import { useApp } from '../context/AppContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarLabelStyle: { fontFamily: fonts.bold } }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: (p) => <MaterialCommunityIcons name="home-heart" {...p} /> }} />
      <Tab.Screen name="Mapa" component={MapScreen} options={{ tabBarIcon: (p) => <MaterialCommunityIcons name="map-marker-radius" {...p} /> }} />
      <Tab.Screen name="Quest" component={BloodQuestScreen} options={{ tabBarIcon: (p) => <MaterialCommunityIcons name="sword-cross" {...p} /> }} />
      <Tab.Screen name="Tipo" component={CompatibilityScreen} options={{ tabBarIcon: (p) => <MaterialCommunityIcons name="water" {...p} /> }} />
      <Tab.Screen name="Badges" component={BadgesScreen} options={{ tabBarIcon: (p) => <MaterialCommunityIcons name="trophy-award" {...p} /> }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ tabBarIcon: (p) => <MaterialCommunityIcons name="account-circle" {...p} /> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { booting } = useApp();
  if (booting) return null;

  return (
    <Stack.Navigator screenOptions={{ headerTitleStyle: { fontFamily: fonts.displayBold, color: colors.secondary } }}>
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Terms" component={TermsScreen} options={{ title: 'Termos de Uso e Privacidade' }} />
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'Agendamento' }} />
      <Stack.Screen name="Accessibility" component={AccessibilityScreen} options={{ title: 'Acessibilidade' }} />
      <Stack.Screen name="QuestMission" component={QuestMissionScreen} options={{ title: 'Missão BloodQuest' }} />
      <Stack.Screen name="EligibilityAI" component={EligibilityAssistantScreen} options={{ title: 'Posso Doar?' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar perfil' }} />
      <Stack.Screen name="QRCode" component={QRCodeScreen} options={{ title: 'Meu QR Code' }} />
      <Stack.Screen name="PreDonationChecklist" component={PreDonationChecklistScreen} options={{ title: 'Checklist pré-doação' }} />
    </Stack.Navigator>
  );
}
