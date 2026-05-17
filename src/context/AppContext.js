import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

import { STORAGE_KEYS } from '../constants/storageKeys';
import { createSessionUrgencies, DEMO_DONATIONS, FALLBACK_USER_LOCATION } from '../constants/mockData';
import { calculateNextDonationStatus, daysBetween } from '../utils/date';

const AppContext = createContext(null);

const defaultAccessibility = {
  highContrast: false,
  screenReader: false,
  colorBlind: false,
  fontScale: 'normal',
};

export function AppProvider({ children }) {
  const [booting, setBooting] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [user, setUser] = useState(null);
  const [donations, setDonations] = useState([]);
  const [appointment, setAppointment] = useState(null);
  const [accessibility, setAccessibility] = useState(defaultAccessibility);
  const [urgencies, setUrgencies] = useState([]);
  const [location, setLocation] = useState(FALLBACK_USER_LOCATION);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const entries = await AsyncStorage.multiGet([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.ONBOARDING,
        STORAGE_KEYS.DONATIONS,
        STORAGE_KEYS.APPOINTMENT,
        STORAGE_KEYS.ACCESSIBILITY,
        STORAGE_KEYS.URGENCY,
      ]);
      const data = Object.fromEntries(entries);
      const storedUser = data[STORAGE_KEYS.USER] ? JSON.parse(data[STORAGE_KEYS.USER]) : null;
      const storedDonations = data[STORAGE_KEYS.DONATIONS] ? JSON.parse(data[STORAGE_KEYS.DONATIONS]) : DEMO_DONATIONS;
      const storedUrgencies = data[STORAGE_KEYS.URGENCY] ? JSON.parse(data[STORAGE_KEYS.URGENCY]) : createSessionUrgencies();

      if (!data[STORAGE_KEYS.DONATIONS]) {
        await AsyncStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(DEMO_DONATIONS));
      }
      if (!data[STORAGE_KEYS.URGENCY]) {
        await AsyncStorage.setItem(STORAGE_KEYS.URGENCY, JSON.stringify(storedUrgencies));
      }

      setUser(storedUser);
      setOnboardingComplete(data[STORAGE_KEYS.ONBOARDING] === 'true');
      setDonations(storedDonations);
      setAppointment(data[STORAGE_KEYS.APPOINTMENT] ? JSON.parse(data[STORAGE_KEYS.APPOINTMENT]) : null);
      setAccessibility(data[STORAGE_KEYS.ACCESSIBILITY] ? JSON.parse(data[STORAGE_KEYS.ACCESSIBILITY]) : defaultAccessibility);
      setUrgencies(storedUrgencies);
    } catch (error) {
      setDonations(DEMO_DONATIONS);
      setUrgencies(createSessionUrgencies());
    } finally {
      setBooting(false);
    }
  }

  async function completeOnboarding() {
    setOnboardingComplete(true);
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
  }

  async function saveUser(nextUser) {
    const hydrated = {
      ...nextUser,
      bloodType: nextUser.bloodType || 'Não sei',
      createdAt: nextUser.createdAt || new Date().toISOString(),
      referrals: nextUser.referrals ?? 1,
    };
    setUser(hydrated);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(hydrated));
    await completeOnboarding();
  }

  async function updateUser(partial) {
    const next = { ...user, ...partial };
    setUser(next);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(next));
  }

  async function requestAndStoreLocation() {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') return { granted: false, location };
      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const nextLocation = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      };
      setLocation(nextLocation);
      return { granted: true, location: nextLocation };
    } catch (error) {
      return { granted: false, location };
    }
  }

  async function addDonation(donation) {
    const next = [{ ...donation, id: donation.id || `don-${Date.now()}` }, ...donations];
    setDonations(next);
    await AsyncStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(next));
  }

  async function saveAppointment(nextAppointment) {
    setAppointment(nextAppointment);
    await AsyncStorage.setItem(STORAGE_KEYS.APPOINTMENT, JSON.stringify(nextAppointment));
  }

  async function updateAccessibility(partial) {
    const next = { ...accessibility, ...partial };
    setAccessibility(next);
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESSIBILITY, JSON.stringify(next));
  }

  async function logout() {
    await AsyncStorage.multiRemove([STORAGE_KEYS.USER, STORAGE_KEYS.ONBOARDING, STORAGE_KEYS.APPOINTMENT]);
    setUser(null);
    setOnboardingComplete(false);
    setAppointment(null);
  }

  const stats = useMemo(() => {
    const donationsCount = donations.length;
    const lives = donationsCount * 4;
    const firstDonation = donations.length ? [...donations].sort((a, b) => new Date(a.date) - new Date(b.date))[0] : null;
    const firstDonationDays = firstDonation ? daysBetween(firstDonation.date, new Date()) : 0;
    const streak = donationsCount >= 2 ? 2 : donationsCount;
    const xp = Math.min(100, donationsCount * 18 + (user?.referrals ?? 0) * 8);
    const level = donationsCount >= 5 ? 'Lenda Solidária' : donationsCount >= 3 ? 'Guardião' : donationsCount >= 1 ? 'Doador Ativo' : 'Iniciante';
    return {
      donations: donationsCount,
      lives,
      firstDonationDays,
      streak,
      xp,
      level,
      donationStatus: calculateNextDonationStatus(donations),
    };
  }, [donations, user]);

  const value = {
    booting,
    onboardingComplete,
    user,
    donations,
    appointment,
    accessibility,
    urgencies,
    location,
    stats,
    completeOnboarding,
    saveUser,
    updateUser,
    requestAndStoreLocation,
    addDonation,
    saveAppointment,
    updateAccessibility,
    logout,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp precisa estar dentro de AppProvider');
  return context;
}
