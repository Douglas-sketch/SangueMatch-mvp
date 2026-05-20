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
import EditProfileScreen from '../screens/EditProfileScreen';
import TermsScreen from '../screens/TermsScreen';
import QRCodeScreen from '../screens/QRCodeScreen';
import PreDonationChecklistScreen from '../screens/PreDonationChecklistScreen';
import { colors, fonts } from '../constants/theme';
import { useApp } from '../context/AppContext';
import BloodQuestScreen from '../game/BloodQuestScreen';
import QuestMissionScreen from '../game/QuestMissionScreen';
import EligibilityAssistantScreen from '../ai/EligibilityAssistantScreen';
import GroupsScreen from '../social/GroupsScreen';
import BenefitsScreen from '../business/BenefitsScreen';
import BusinessScreen from '../business/BusinessScreen';
const Stack = createNativeStackNavigator(); const Tab = createBottomTabNavigator();
const TabIcon = ({ name, color, size }) => <MaterialCommunityIcons name={name} color={color} size={size} />;
function MainTabs(){return <Tab.Navigator screenOptions={{headerShown:false,tabBarActiveTintColor:colors.primary,tabBarInactiveTintColor:'#8F8586',tabBarStyle:{backgroundColor:'#fff',minHeight:72,paddingTop:8,paddingBottom:10},tabBarLabelStyle:{fontFamily:fonts.bold,fontSize:12}}}>
<Tab.Screen name='Home' component={HomeScreen} options={{title:'Home',tabBarIcon:(p)=><TabIcon name='home-heart' {...p}/>}}/>
<Tab.Screen name='Mapa' component={MapScreen} options={{title:'Mapa',tabBarIcon:(p)=><TabIcon name='map-marker-radius' {...p}/>}}/>
<Tab.Screen name='Quest' component={BloodQuestScreen} options={{title:'Quest',tabBarIcon:(p)=><TabIcon name='sword-cross' {...p}/>}}/>
<Tab.Screen name='Tipo' component={CompatibilityScreen} options={{title:'Tipo',tabBarIcon:(p)=><TabIcon name='water' {...p}/>}}/>
<Tab.Screen name='Perfil' component={ProfileScreen} options={{title:'Perfil',tabBarIcon:(p)=><TabIcon name='account-circle' {...p}/>}}/>
</Tab.Navigator>}
export default function AppNavigator(){ const {booting}=useApp(); if(booting) return null; return <Stack.Navigator initialRouteName='Splash' screenOptions={{headerShadowVisible:false,headerTitleStyle:{fontFamily:fonts.displayBold,color:colors.secondary},headerTintColor:colors.secondary,contentStyle:{backgroundColor:colors.background}}}>
<Stack.Screen name='Splash' component={SplashScreen} options={{headerShown:false}}/>
<Stack.Screen name='Onboarding' component={OnboardingScreen} options={{headerShown:false}}/>
<Stack.Screen name='Register' component={RegisterScreen} options={{headerShown:false}}/>
<Stack.Screen name='Main' component={MainTabs} options={{headerShown:false}}/>
<Stack.Screen name='Schedule' component={ScheduleScreen} options={{title:'Agendamento'}}/>
<Stack.Screen name='Accessibility' component={AccessibilityScreen} options={{title:'Acessibilidade'}}/>
<Stack.Screen name='QuestMission' component={QuestMissionScreen} options={{title:'BloodQuest'}}/>
<Stack.Screen name='EligibilityAI' component={EligibilityAssistantScreen} options={{title:'Posso Doar?'}}/>
<Stack.Screen name='EditProfile' component={EditProfileScreen} options={{title:'Editar perfil'}}/>
<Stack.Screen name='Terms' component={TermsScreen} options={{title:'Termos e Privacidade'}}/>
<Stack.Screen name='QRCode' component={QRCodeScreen} options={{title:'Meu QR Code'}}/>
<Stack.Screen name='PreDonationChecklist' component={PreDonationChecklistScreen} options={{title:'Checklist pré-doação'}}/>
<Stack.Screen name='Groups' component={GroupsScreen} options={{title:'Grupos'}}/>
<Stack.Screen name='Benefits' component={BenefitsScreen} options={{title:'Benefícios'}}/>
<Stack.Screen name='Business' component={BusinessScreen} options={{title:'Para Empresas'}}/>
</Stack.Navigator> }
