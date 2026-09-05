import { Platform } from 'react-native';

/**
 * MyTap design system — colors, typography, spacing, radius, shadows.
 */

export const colors = {
  // Signature gradient
  navy: '#0F1729',
  navyLight: '#1E3A5F',

  // Card gradients
  wallet: ['#1A2A4A', '#2D3B6B', '#FF6B4A'] as const,
  mastercard: ['#2D3B6B', '#4A6A8A', '#F5A623'] as const,
  myzaka: ['#1A2A4A', '#3D2B6B', '#8A4A9A'] as const,

  // Accents
  coral: '#FF6B4A',
  gold: '#F5A623',
  deepPurple: '#6B3A8A',
  emerald: '#2ECC71',

  // Glass
  glassBg: 'rgba(255,255,255,0.08)',
  glassBorder: 'rgba(255,255,255,0.12)',

  // Backgrounds
  bgLight: '#F5F7FA',
  bgWhite: '#FFFFFF',
  bgDark: '#0F1729',

  // Text
  textPrimary: '#0F1729',
  textSecondary: '#1E3A5F',
  textMuted: '#6B7A8A',
  textOnDark: 'rgba(255,255,255,0.85)',
};

export const type = {
  hero: { fontSize: 48, fontWeight: '300' as const },
  largeTitle: { fontSize: 32, fontWeight: '600' as const },
  title: { fontSize: 24, fontWeight: '700' as const },
  heading: { fontSize: 20, fontWeight: '600' as const },
  subheading: { fontSize: 17, fontWeight: '500' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
  label: { fontSize: 11, fontWeight: '500' as const },
  small: { fontSize: 10, fontWeight: '400' as const },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  pill: 999,
};

export const shadows = {
  subtle: {
    shadowColor: '#0F1729',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  medium: {
    shadowColor: '#0F1729',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  hero: {
    shadowColor: '#0F1729',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 12,
  },
};

export const fonts = {
  light: 'Inter_300Light',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const spring = {
  damping: 0.8,
  stiffness: 100,
  mass: 0.8,
};

export const isWeb = Platform.OS === 'web';
