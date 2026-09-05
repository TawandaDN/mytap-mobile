import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from './index';

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  border: string;
  glassBg: string;
  glassBorder: string;
}

const lightTheme: Theme = {
  mode: 'light',
  background: colors.bgLight,
  surface: colors.bgWhite,
  surfaceAlt: '#EEF1F6',
  text: colors.textPrimary,
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,
  accent: colors.coral,
  border: 'rgba(15,23,41,0.1)',
  glassBg: 'rgba(255,255,255,0.6)',
  glassBorder: 'rgba(15,23,41,0.08)',
};

const darkTheme: Theme = {
  mode: 'dark',
  background: colors.bgDark,
  surface: '#16233B',
  surfaceAlt: '#1E3A5F',
  text: 'rgba(255,255,255,0.92)',
  textSecondary: 'rgba(255,255,255,0.75)',
  textMuted: 'rgba(255,255,255,0.5)',
  accent: colors.coral,
  border: 'rgba(255,255,255,0.12)',
  glassBg: 'rgba(255,255,255,0.08)',
  glassBorder: 'rgba(255,255,255,0.12)',
};

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: lightTheme,
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    AsyncStorage.getItem('mytap.theme').then((saved) => {
      if (saved === 'dark' || saved === 'light') setMode(saved);
      else setMode(system === 'dark' ? 'dark' : 'light');
    });
  }, [system]);

  const toggle = () => {
    setMode((m) => {
      const next = m === 'light' ? 'dark' : 'light';
      AsyncStorage.setItem('mytap.theme', next);
      return next;
    });
  };

  const value = useMemo(
    () => ({ theme: mode === 'dark' ? darkTheme : lightTheme, toggle }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
