import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEMES, Theme, ThemeId, ThemeMode } from './index';

interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  themeId: ThemeId;
  adaptive: boolean;
  toggleMode: () => void;
  setMode: (m: ThemeMode) => void;
  setThemeId: (id: ThemeId) => void;
  setAdaptive: (a: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEMES.midnight.light,
  mode: 'light',
  themeId: 'midnight',
  adaptive: false,
  toggleMode: () => {},
  setMode: () => {},
  setThemeId: () => {},
  setAdaptive: () => {},
});

const THEME_KEY = 'mytap.theme.id';
const MODE_KEY = 'mytap.theme.mode';
const ADAPTIVE_KEY = 'mytap.theme.adaptive';

/** Resolve the effective mode: explicit override, or time-of-day when adaptive. */
function resolveMode(adaptive: boolean, override: ThemeMode | null, system: 'light' | 'dark' | null | undefined): ThemeMode {
  if (adaptive) {
    const h = new Date().getHours();
    // morning (5-11) brighter/warmer, afternoon (12-17) neutral, evening/night deeper
    if (h >= 5 && h < 12) return 'light';
    if (h >= 12 && h < 18) return system === 'dark' ? 'dark' : 'light';
    return 'dark';
  }
  return override ?? (system === 'dark' ? 'dark' : 'light');
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [themeId, setThemeIdState] = useState<ThemeId>('midnight');
  const [override, setOverride] = useState<ThemeMode | null>(null);
  const [adaptive, setAdaptiveState] = useState(false);
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [tick, setTick] = useState(0);

  // Load persisted prefs
  useEffect(() => {
    (async () => {
      const [tid, m, ad] = await Promise.all([
        AsyncStorage.getItem(THEME_KEY),
        AsyncStorage.getItem(MODE_KEY),
        AsyncStorage.getItem(ADAPTIVE_KEY),
      ]);
      if (tid && tid in THEMES) setThemeIdState(tid as ThemeId);
      if (m === 'light' || m === 'dark') setOverride(m);
      if (ad === 'true') setAdaptiveState(true);
    })();
  }, []);

  // Recompute mode when adaptive / override / system / hour changes
  useEffect(() => {
    const compute = () => {
      setModeState(resolveMode(adaptive, override, system as 'light' | 'dark' | null | undefined));
    };
    compute();
    if (adaptive) {
      // Re-evaluate on the hour boundary so the palette shifts smoothly
      const now = new Date();
      const msToNextHour = (60 - now.getMinutes()) * 60 * 1000 - now.getSeconds() * 1000;
      const t = setTimeout(compute, msToNextHour + 1000);
      return () => clearTimeout(t);
    }
  }, [adaptive, override, system, tick]);

  const setThemeId = (id: ThemeId) => {
    setThemeIdState(id);
    AsyncStorage.setItem(THEME_KEY, id).catch(() => {});
    hapticTick();
  };

  const setMode = (m: ThemeMode) => {
    setOverride(m);
    setAdaptiveState(false);
    AsyncStorage.setItem(MODE_KEY, m).catch(() => {});
    AsyncStorage.setItem(ADAPTIVE_KEY, 'false').catch(() => {});
    hapticTick();
  };

  const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light');

  const setAdaptive = (a: boolean) => {
    setAdaptiveState(a);
    AsyncStorage.setItem(ADAPTIVE_KEY, String(a)).catch(() => {});
    if (a) setTick((t) => t + 1);
    hapticTick();
  };

  const theme = useMemo(() => {
    const def = THEMES[themeId];
    return mode === 'dark' ? def.dark : def.light;
  }, [themeId, mode]);

  const value = useMemo(
    () => ({ theme, mode, themeId, adaptive, toggleMode, setMode, setThemeId, setAdaptive }),
    [theme, mode, themeId, adaptive, toggleMode, setMode, setThemeId, setAdaptive]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

function hapticTick() {
  // Light haptic on theme change (imported lazily to avoid circular dep)
  try {
    const Haptics = require('expo-haptics');
    Haptics.selectionAsync().catch(() => {});
  } catch {
    /* noop */
  }
}

export function useTheme() {
  return useContext(ThemeContext);
}