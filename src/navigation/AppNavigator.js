import React from 'react';
import { Text } from 'react-native';
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
import { colors, fonts } from '../constants/theme';
import { useApp } from '../context/AppContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ name, color, size }) {
  return <MaterialCommunityIcons name={name} color={color} size={size} />;
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#8F8586',
        tabBarStyle: {
          backgroundColor: '#fff',
          minHeight: 72,
          paddingTop: 8,
          paddingBottom: 10,
          borderTopWidth: 0.5,
          borderTopColor: colors.line,
        },
        tabBarLabelStyle: { fontFamily: fonts.bold, fontSize: 12 },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home', tabBarIcon: (props) => <TabIcon name="home-heart" {...props} /> }} />
      <Tab.Screen name="Mapa" component={MapScreen} options={{ title: 'Mapa', tabBarIcon: (props) => <TabIcon name="map-marker-radius" {...props} /> }} />
      <Tab.Screen name="Tipo" component={CompatibilityScreen} options={{ title: 'Tipo', tabBarIcon: (props) => <TabIcon name="water" {...props} /> }} />
      <Tab.Screen name="Badges" component={BadgesScreen} options={{ title: 'Badges', tabBarIcon: (props) => <TabIcon name="trophy-award" {...props} /> }} />
      <Tab.Screen name="Perfil" component={ProfileScreen} options={{ title: 'Perfil', tabBarIcon: (props) => <TabIcon name="account-circle" {...props} /> }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { booting } = useApp();
  if (booting) return null;

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: fonts.displayBold, color: colors.secondary },
        headerBackTitleVisible: false,
        headerTintColor: colors.secondary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'Agendamento' }} />
      <Stack.Screen name="Accessibility" component={AccessibilityScreen} options={{ title: 'Acessibilidade' }} />
    </Stack.Navigator>
  );
}
