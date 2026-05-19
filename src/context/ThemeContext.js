import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/storageKeys';

const ThemeContext = createContext(null);

export const lightTheme = { dark: false, background: '#F7F0EF', card: '#FFFFFF', text: '#0F1923', muted: '#6D6465', primary: '#E05252', border: '#E5DCDB' };
export const darkTheme = { dark: true, background: '#0A0F14', card: '#141D26', text: '#F0EAE8', muted: '#A9B5C0', primary: '#E05252', border: '#22303D' };

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');
  useEffect(() => { AsyncStorage.getItem(STORAGE_KEYS.THEME).then((v) => v && setMode(v)); }, []);
  const toggleTheme = async (next) => { const val = next || (mode === 'light' ? 'dark' : 'light'); setMode(val); await AsyncStorage.setItem(STORAGE_KEYS.THEME, val); };
  const theme = mode === 'dark' ? darkTheme : lightTheme;
  const value = useMemo(() => ({ mode, theme, toggleTheme }), [mode]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useThemeMode = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be inside ThemeProvider');
  return ctx;
};
