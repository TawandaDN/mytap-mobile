import { Platform } from 'react-native';

/**
 * MyTap Design System — Theme
 * Colors, typography, spacing, radii, shadows, motion.
 * Supports multiple premium color themes + adaptive time-of-day mode.
 */

export const palette = {
  // Signature gradient
  navyDeep: '#0F1729',
  navy: '#1E3A5F',

  // Card gradients
  walletA: '#1A2A4A',
  walletB: '#2D3B6B',
  walletC: '#FF6B4A',
  mastercardA: '#2D3B6B',
  mastercardB: '#4A6A8A',
  mastercardC: '#F5A623',
  myzakaA: '#1A2A4A',
  myzakaB: '#3D2B6B',
  myzakaC: '#8A4A9A',

  // Accents
  coral: '#FF6B4A',
  gold: '#F5A623',
  deepPurple: '#6B3A8A',
  emerald: '#2ECC71',

  // Backgrounds
  bgLight: '#F5F7FA',
  bgWhite: '#FFFFFF',
  bgDark: '#0F1729',

  // Text
  textPrimary: '#0F1729',
  textSecondary: '#1E3A5F',
  textMuted: '#6B7A8A',
  textOnDark: 'rgba(255,255,255,0.85)',
  textOnDarkMuted: 'rgba(255,255,255,0.6)',

  // Glass
  glassBg: 'rgba(255,255,255,0.08)',
  glassBorder: 'rgba(255,255,255,0.12)',
  glassBgLight: 'rgba(255,255,255,0.55)',
  glassBorderLight: 'rgba(255,255,255,0.7)',

  // Status
  danger: '#E74C3C',
  success: '#2ECC71',
  warning: '#F5A623',
  info: '#3498DB',
} as const;

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  glassBg: string;
  glassBorder: string;
  glassBgLight: string;
  glassBorderLight: string;
  accent: string;
  accent2: string;
  glassShadow: string;
  /** Signature gradient (background orbs / hero). */
  gradient: readonly [string, string, string];
  /** Accent gradient for buttons / highlights. */
  accentGradient: readonly [string, string, string];
  /** Water bubble tint. */
  bubble: string;
}

/* ============ THEME DEFINITIONS ============ */

export type ThemeId =
  | 'midnight'
  | 'indigo'
  | 'coral'
  | 'emerald'
  | 'obsidian'
  | 'rosegold';

export interface ThemeDef {
  id: ThemeId;
  name: string;
  emoji: string;
  light: Theme;
  dark: Theme;
}

const baseLight: Omit<Theme, 'accent' | 'accent2' | 'gradient' | 'accentGradient' | 'bubble'> = {
  mode: 'light',
  background: palette.bgLight,
  surface: palette.bgWhite,
  surfaceAlt: '#EEF1F6',
  text: palette.textPrimary,
  textSecondary: palette.textSecondary,
  textMuted: palette.textMuted,
  border: 'rgba(15,23,41,0.08)',
  glassBg: palette.glassBgLight,
  glassBorder: palette.glassBorderLight,
  glassBgLight: 'rgba(255,255,255,0.7)',
  glassBorderLight: 'rgba(255,255,255,0.9)',
  glassShadow: 'rgba(15,23,41,0.08)',
};

const baseDark: Omit<Theme, 'accent' | 'accent2' | 'gradient' | 'accentGradient' | 'bubble'> = {
  mode: 'dark',
  background: palette.bgDark,
  surface: '#16233B',
  surfaceAlt: '#1E3A5F',
  text: 'rgba(255,255,255,0.92)',
  textSecondary: 'rgba(255,255,255,0.75)',
  textMuted: 'rgba(255,255,255,0.5)',
  border: 'rgba(255,255,255,0.1)',
  glassBg: palette.glassBg,
  glassBorder: palette.glassBorder,
  glassBgLight: 'rgba(255,255,255,0.12)',
  glassBorderLight: 'rgba(255,255,255,0.18)',
  glassShadow: 'rgba(0,0,0,0.4)',
};

function makeTheme(
  mode: ThemeMode,
  accent: string,
  accent2: string,
  gradient: readonly [string, string, string],
  accentGradient: readonly [string, string, string],
  bubble: string
): Theme {
  const base = mode === 'light' ? baseLight : baseDark;
  return { ...base, mode, accent, accent2, gradient, accentGradient, bubble };
}

export const THEMES: Record<ThemeId, ThemeDef> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Navy',
    emoji: '🌌',
    light: makeTheme('light', '#1E3A5F', '#FF6B4A', ['#0F1729', '#1E3A5F', '#FF6B4A'], ['#1E3A5F', '#2D3B6B', '#FF6B4A'], 'rgba(30,58,95,0.12)'),
    dark: makeTheme('dark', '#8A4A9A', '#FF6B4A', ['#0F1729', '#1E3A5F', '#FF6B4A'], ['#1E3A5F', '#2D3B6B', '#FF6B4A'], 'rgba(255,255,255,0.1)'),
  },
  indigo: {
    id: 'indigo',
    name: 'Royal Indigo',
    emoji: '💜',
    light: makeTheme('light', '#6B3A8A', '#FF6B4A', ['#2D1B4E', '#6B3A8A', '#FF6B4A'], ['#4A2B6B', '#6B3A8A', '#FF6B4A'], 'rgba(107,58,138,0.12)'),
    dark: makeTheme('dark', '#A06BD0', '#FF8A6B', ['#1A0F2E', '#3D2B6B', '#8A4A9A'], ['#4A2B6B', '#6B3A8A', '#FF6B4A'], 'rgba(160,107,208,0.12)'),
  },
  coral: {
    id: 'coral',
    name: 'Sunset Coral',
    emoji: '🌅',
    light: makeTheme('light', '#FF6B4A', '#F5A623', ['#FF6B4A', '#FF8A6B', '#F5A623'], ['#FF6B4A', '#FF8A6B', '#F5A623'], 'rgba(255,107,74,0.12)'),
    dark: makeTheme('dark', '#FF8A6B', '#F5A623', ['#3A1A10', '#FF6B4A', '#F5A623'], ['#FF6B4A', '#FF8A6B', '#F5A623'], 'rgba(255,138,107,0.12)'),
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    emoji: '💚',
    light: makeTheme('light', '#0E8A5F', '#2ECC71', ['#0B3D2E', '#0E8A5F', '#2ECC71'], ['#0E8A5F', '#2ECC71', '#7BE0A8'], 'rgba(14,138,95,0.12)'),
    dark: makeTheme('dark', '#2ECC71', '#7BE0A8', ['#06231A', '#0E8A5F', '#2ECC71'], ['#0E8A5F', '#2ECC71', '#7BE0A8'], 'rgba(46,204,113,0.12)'),
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian',
    emoji: '🖤',
    light: makeTheme('light', '#2B2B33', '#FF6B4A', ['#1A1A20', '#2B2B33', '#FF6B4A'], ['#2B2B33', '#3A3A44', '#FF6B4A'], 'rgba(43,43,51,0.12)'),
    dark: makeTheme('dark', '#8A8A99', '#FF6B4A', ['#0A0A0D', '#1A1A20', '#FF6B4A'], ['#2B2B33', '#3A3A44', '#FF6B4A'], 'rgba(255,255,255,0.08)'),
  },
  rosegold: {
    id: 'rosegold',
    name: 'Rose Gold',
    emoji: '🌹',
    light: makeTheme('light', '#B76E79', '#E8A0A8', ['#8A4A5A', '#B76E79', '#F5C6C6'], ['#B76E79', '#D98A94', '#F5C6C6'], 'rgba(183,110,121,0.12)'),
    dark: makeTheme('dark', '#E8A0A8', '#F5C6C6', ['#3A1A22', '#B76E79', '#F5C6C6'], ['#B76E79', '#D98A94', '#F5C6C6'], 'rgba(232,160,168,0.12)'),
  },
};

export const THEME_LIST: ThemeDef[] = Object.values(THEMES);

export const lightTheme: Theme = THEMES.midnight.light;
export const darkTheme: Theme = THEMES.midnight.dark;

/** Full Inter type scale (pt). */
export const type = {
  hero: { fontSize: 48, lineHeight: 56, fontWeight: '300' as const },
  largeTitle: { fontSize: 32, lineHeight: 40, fontWeight: '600' as const },
  title: { fontSize: 24, lineHeight: 32, fontWeight: '700' as const },
  heading: { fontSize: 20, lineHeight: 28, fontWeight: '600' as const },
  subheading: { fontSize: 17, lineHeight: 24, fontWeight: '500' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  label: { fontSize: 11, lineHeight: 16, fontWeight: '500' as const },
  small: { fontSize: 10, lineHeight: 14, fontWeight: '400' as const },
} as const;

/** 4px grid spacing. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

/** Corner radii. */
export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 28,
  pill: 999,
} as const;

/** Shadow system: Subtle → Hero. */
export const shadows = {
  subtle: {
    shadowColor: '#0F1729',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  soft: {
    shadowColor: '#0F1729',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  medium: {
    shadowColor: '#0F1729',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 6,
  },
  hero: {
    shadowColor: '#0F1729',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 12,
  },
} as const;

/** Spring physics (damping 0.8, stiffness 100, mass 0.8). */
export const spring = {
  damping: 0.8,
  stiffness: 100,
  mass: 0.8,
} as const;

export const springConfig = {
  damping: 0.8,
  stiffness: 100,
  mass: 0.8,
  overshootClamping: false,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
} as const;

/** Font family — Inter loaded via expo-font. */
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  light: 'Inter_300Light',
} as const;

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';