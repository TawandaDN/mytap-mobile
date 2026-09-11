import { Platform, TextStyle } from 'react-native';

/**
 * MyTap Design System — Theme (premium iOS fintech)
 *
 * Colors, typography, spacing, radii, shadows, motion.
 * Deep purple→blue header gradient → soft warm-white canvas.
 * Rich solid brand green for primary interactive · metallic matte gold accents.
 * Strict 18px card radii · hairline 1px borders · tabular-nums for money.
 */

export const palette = {
  // Signature header gradient (deep purple → blue)
  headerA: '#3B2560',
  headerB: '#2A3A86',
  headerC: '#1E4FA8',

  // Card gradients
  walletA: '#241C4E',
  walletB: '#2E3A78',
  walletC: '#1E4FA8',
  mastercardA: '#1C2450',
  mastercardB: '#33427E',
  mastercardC: '#B8892B',
  myzakaA: '#2A1C4E',
  myzakaB: '#4A2E7A',
  myzakaC: '#7C5CFF',

  // Brand
  green: '#0B6B4F',
  greenDeep: '#07553E',
  greenBright: '#0E8A5F',
  gold: '#B8892B',
  goldLight: '#D4AF37',
  violet: '#6D5AE6',
  coral: '#E5604A',
  deepPurple: '#3B2560',
  emerald: '#0E8A5F',

  // Backgrounds
  bgLight: '#FAF8F4',
  bgWhite: '#FFFFFF',
  bgDark: '#0B0E14',

  // Text
  textPrimary: '#101828',
  textSecondary: '#344054',
  textMuted: '#7A8699',
  textOnDark: 'rgba(255,255,255,0.88)',
  textOnDarkMuted: 'rgba(255,255,255,0.62)',

  // Glass
  glassBg: 'rgba(255,255,255,0.08)',
  glassBorder: 'rgba(255,255,255,0.12)',
  glassBgLight: 'rgba(255,255,255,0.7)',
  glassBorderLight: 'rgba(255,255,255,0.8)',

  // Status
  danger: '#D92D20',
  success: '#0E8A5F',
  warning: '#B8892B',
  info: '#1E4FA8',
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
  /** Faint 1px border that makes white containers pop off the cream canvas. */
  hairline: string;
  glassBg: string;
  glassBorder: string;
  glassBgLight: string;
  glassBorderLight: string;
  accent: string;
  accent2: string;
  /** Rich solid brand green — primary interactive buttons + success. */
  primary: string;
  primaryDeep: string;
  /** Polished metallic matte gold. */
  gold: string;
  /** Crisp violet indicator for data visualisations. */
  indicator: string;
  glassShadow: string;
  /** Error / danger tone. */
  danger: string;
  /** Strict card corner radius. */
  cardRadius: number;
  /** Signature gradient (background orbs / hero). */
  gradient: readonly [string, string, string];
  /** Deep purple→blue header gradient. */
  headerGradient: readonly [string, string, string];
  /** Accent gradient for buttons / highlights. */
  accentGradient: readonly [string, string, string];
  /** Polished metallic matte gold gradient (with depth, not muddy). */
  goldGradient: readonly [string, string, string];
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

const baseLight: Omit<
  Theme,
  'accent' | 'accent2' | 'gradient' | 'headerGradient' | 'accentGradient' | 'goldGradient' | 'bubble'
> = {
  mode: 'light',
  background: palette.bgLight,
  surface: palette.bgWhite,
  surfaceAlt: '#F2EFE9',
  text: palette.textPrimary,
  textSecondary: palette.textSecondary,
  textMuted: palette.textMuted,
  border: 'rgba(16,24,40,0.08)',
  hairline: 'rgba(16,24,40,0.055)',
  glassBg: 'rgba(255,255,255,0.72)',
  glassBorder: 'rgba(255,255,255,0.85)',
  glassBgLight: 'rgba(255,255,255,0.82)',
  glassBorderLight: 'rgba(255,255,255,0.95)',
  primary: palette.green,
  primaryDeep: palette.greenDeep,
  gold: palette.gold,
  indicator: palette.violet,
  glassShadow: 'rgba(16,24,40,0.08)',
  danger: palette.danger,
  cardRadius: 18,
};

const baseDark: Omit<
  Theme,
  'accent' | 'accent2' | 'gradient' | 'headerGradient' | 'accentGradient' | 'goldGradient' | 'bubble'
> = {
  mode: 'dark',
  background: palette.bgDark,
  surface: '#141922',
  surfaceAlt: '#1C2330',
  text: 'rgba(255,255,255,0.94)',
  textSecondary: 'rgba(255,255,255,0.76)',
  textMuted: 'rgba(255,255,255,0.5)',
  border: 'rgba(255,255,255,0.1)',
  hairline: 'rgba(255,255,255,0.07)',
  glassBg: 'rgba(255,255,255,0.06)',
  glassBorder: 'rgba(255,255,255,0.12)',
  glassBgLight: 'rgba(255,255,255,0.1)',
  glassBorderLight: 'rgba(255,255,255,0.16)',
  primary: palette.greenBright,
  primaryDeep: palette.green,
  gold: palette.goldLight,
  indicator: '#9D8CFF',
  glassShadow: 'rgba(0,0,0,0.45)',
  danger: '#FF6B5E',
  cardRadius: 18,
};

function makeTheme(
  mode: ThemeMode,
  accent: string,
  accent2: string,
  gradient: readonly [string, string, string],
  headerGradient: readonly [string, string, string],
  accentGradient: readonly [string, string, string],
  goldGradient: readonly [string, string, string],
  bubble: string
): Theme {
  const base = mode === 'light' ? baseLight : baseDark;
  return { ...base, mode, accent, accent2, gradient, headerGradient, accentGradient, goldGradient, bubble };
}

const GOLD_GRAD = ['#D9B44A', '#C29A2E', '#9E7A1E'] as const;

export const THEMES: Record<ThemeId, ThemeDef> = {
  midnight: {
    id: 'midnight',
    name: 'Midnight Navy',
    emoji: '🌌',
    light: makeTheme(
      'light',
      '#1E4FA8',
      '#6D5AE6',
      ['#3B2560', '#2A3A86', '#1E4FA8'],
      ['#3B2560', '#2A3A86', '#1E4FA8'],
      ['#0B6B4F', '#0E7A5C', '#12946E'],
      [...GOLD_GRAD],
      'rgba(30,79,168,0.1)'
    ),
    dark: makeTheme(
      'dark',
      '#5B8DEF',
      '#9D8CFF',
      ['#12162A', '#1E2A55', '#2A3A86'],
      ['#241C46', '#2A3A86', '#1E4FA8'],
      ['#0E8A5F', '#12A673', '#17C48A'],
      [...GOLD_GRAD],
      'rgba(255,255,255,0.08)'
    ),
  },
  indigo: {
    id: 'indigo',
    name: 'Royal Indigo',
    emoji: '💜',
    light: makeTheme(
      'light',
      '#5B3BC4',
      '#8B7BF0',
      ['#2E1B6B', '#4A2FA8', '#7C5CFF'],
      ['#2E1B6B', '#4A2FA8', '#5B3BC4'],
      ['#0B6B4F', '#0E7A5C', '#12946E'],
      [...GOLD_GRAD],
      'rgba(91,59,196,0.1)'
    ),
    dark: makeTheme(
      'dark',
      '#9D8CFF',
      '#C4B8FF',
      ['#150C33', '#2E1B6B', '#4A2FA8'],
      ['#21134F', '#3A2385', '#5B3BC4'],
      ['#0E8A5F', '#12A673', '#17C48A'],
      [...GOLD_GRAD],
      'rgba(157,140,255,0.1)'
    ),
  },
  coral: {
    id: 'coral',
    name: 'Sunset Coral',
    emoji: '🌅',
    light: makeTheme(
      'light',
      '#E5604A',
      '#B8892B',
      ['#7A2E3E', '#C2453F', '#E5604A'],
      ['#5C2440', '#9E3B44', '#E5604A'],
      ['#0B6B4F', '#0E7A5C', '#12946E'],
      [...GOLD_GRAD],
      'rgba(229,96,74,0.1)'
    ),
    dark: makeTheme(
      'dark',
      '#FF8A6B',
      '#FFC46B',
      ['#2A1018', '#7A2E3E', '#E5604A'],
      ['#3A1420', '#9E3B44', '#E5604A'],
      ['#0E8A5F', '#12A673', '#17C48A'],
      ['#E6C463', '#D9B44A', '#B8912E'],
      'rgba(255,138,107,0.1)'
    ),
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald',
    emoji: '💚',
    light: makeTheme(
      'light',
      '#0B6B4F',
      '#12946E',
      ['#08382B', '#0B6B4F', '#12946E'],
      ['#0A3A2E', '#0B5B45', '#0E7A5C'],
      ['#0B6B4F', '#12946E', '#17C48A'],
      [...GOLD_GRAD],
      'rgba(11,107,79,0.1)'
    ),
    dark: makeTheme(
      'dark',
      '#17C48A',
      '#7BE0B8',
      ['#04211A', '#0B6B4F', '#12946E'],
      ['#062A21', '#0B5B45', '#12946E'],
      ['#0E8A5F', '#12A673', '#17C48A'],
      [...GOLD_GRAD],
      'rgba(23,196,138,0.1)'
    ),
  },
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian',
    emoji: '🖤',
    light: makeTheme(
      'light',
      '#2B3A4F',
      '#6D5AE6',
      ['#161B22', '#2B3A4F', '#1E4FA8'],
      ['#161B22', '#242B36', '#1E4FA8'],
      ['#0B6B4F', '#0E7A5C', '#12946E'],
      [...GOLD_GRAD],
      'rgba(43,58,79,0.1)'
    ),
    dark: makeTheme(
      'dark',
      '#8A9BB5',
      '#9D8CFF',
      ['#05070A', '#161B22', '#2B3A4F'],
      ['#05070A', '#12161C', '#1E3A6B'],
      ['#0E8A5F', '#12A673', '#17C48A'],
      ['#D9B44A', '#C29A2E', '#9E7A1E'],
      'rgba(255,255,255,0.07)'
    ),
  },
  rosegold: {
    id: 'rosegold',
    name: 'Rose Gold',
    emoji: '🌹',
    light: makeTheme(
      'light',
      '#B76E79',
      '#C9A24A',
      ['#6E3A46', '#A85A66', '#D9A0A8'],
      ['#5C2E3C', '#96606E', '#C98F98'],
      ['#0B6B4F', '#0E7A5C', '#12946E'],
      [...GOLD_GRAD],
      'rgba(183,110,121,0.1)'
    ),
    dark: makeTheme(
      'dark',
      '#E8A0A8',
      '#E6C463',
      ['#2E141C', '#7A3A46', '#C98F98'],
      ['#3A1A24', '#8A4652', '#C98F98'],
      ['#0E8A5F', '#12A673', '#17C48A'],
      ['#E6C463', '#D9B44A', '#B8912E'],
      'rgba(232,160,168,0.1)'
    ),
  },
};

export const THEME_LIST: ThemeDef[] = Object.values(THEMES);

export const lightTheme: Theme = THEMES.midnight.light;
export const darkTheme: Theme = THEMES.midnight.dark;

/**
 * Font family — Inter (crisp high-end geometric sans) loaded via expo-font.
 * Mirrors SF Pro proportions for the iOS fintech feel.
 */
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extrabold: 'Inter_800ExtraBold',
  light: 'Inter_300Light',
  thin: 'Inter_200ExtraLight',
} as const;

/**
 * Full Inter type scale (pt).
 * Medium-bold weights (never heavy black) with letter-spacing + generous
 * line-height so text blocks breathe and never feel squished.
 */
/** Identity helper — pins each scale entry to a concrete TextStyle so
 * `...type.body` can be spread inside StyleSheet.create without TS widening
 * the surrounding style to the ViewStyle | ImageStyle | TextStyle union. */
const t = (s: TextStyle): TextStyle => s;

export const type = {
  hero: t({ fontSize: 40, lineHeight: 48, fontWeight: '600', fontFamily: fonts.semibold, letterSpacing: -0.8 }),
  display: t({ fontSize: 34, lineHeight: 42, fontWeight: '700', fontFamily: fonts.bold, letterSpacing: -0.6 }),
  largeTitle: t({ fontSize: 27, lineHeight: 35, fontWeight: '600', fontFamily: fonts.semibold, letterSpacing: -0.4 }),
  title: t({ fontSize: 22, lineHeight: 30, fontWeight: '600', fontFamily: fonts.semibold, letterSpacing: -0.2 }),
  heading: t({ fontSize: 18, lineHeight: 26, fontWeight: '600', fontFamily: fonts.semibold, letterSpacing: -0.1 }),
  subheading: t({ fontSize: 16, lineHeight: 24, fontWeight: '500', fontFamily: fonts.medium, letterSpacing: 0 }),
  body: t({ fontSize: 15, lineHeight: 23, fontWeight: '400', fontFamily: fonts.regular, letterSpacing: 0.05 }),
  caption: t({ fontSize: 13, lineHeight: 19, fontWeight: '400', fontFamily: fonts.regular, letterSpacing: 0.05 }),
  label: t({ fontSize: 11, lineHeight: 16, fontWeight: '500', fontFamily: fonts.medium, letterSpacing: 0.6 }),
  small: t({ fontSize: 10, lineHeight: 14, fontWeight: '400', fontFamily: fonts.regular, letterSpacing: 0.1 }),
  /** Tabular-nums money style — decimals align perfectly when stacked. */
  money: t({
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'],
  }),
  moneyLarge: t({
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    fontFamily: fonts.bold,
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  }),
};

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

/** Corner radii — cards strictly 18px. */
export const radius = {
  sm: 12,
  md: 16,
  lg: 18,
  card: 18,
  xl: 22,
  xxl: 26,
  pill: 999,
} as const;

/** Strict card radius helper. */
export const CARD_RADIUS = 18;

/** Shadow system: subtle → hero (layered, clean bank-card drop shadows). */
export const shadows = {
  subtle: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  soft: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  medium: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 22,
    elevation: 5,
  },
  hero: {
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 34,
    elevation: 10,
  },
} as const;

/** Motion — refined ease-out; springs reserved for drag/gesture only. */
export const spring = {
  damping: 0.85,
  stiffness: 220,
  mass: 0.9,
} as const;

export const springConfig = {
  damping: 0.85,
  stiffness: 220,
  mass: 0.9,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
} as const;

/** Canonical motion durations (ms) + easing, per the refined spec. */
export const motion = {
  hover: { duration: 300, easing: 'out' as const },
  transition: { duration: 300, easing: 'out' as const },
  balance: { duration: 400, easing: 'out' as const },
  ring: { duration: 1500, easing: 'out' as const },
  shimmer: { duration: 6000, easing: 'linear' as const },
  success: { duration: 800, easing: 'out' as const },
} as const;

/* ============ TEXTURE SKINS ============ */

export type SkinId = 'ceramic' | 'frosted' | 'quartz' | 'velvet';

export interface Skin {
  id: SkinId;
  name: string;
  emoji: string;
  /** Glass surface tint. */
  glassBg: string;
  glassBorder: string;
  /** Subtle repeating texture overlay (rgba). */
  texture: string;
  /** Material feel label. */
  material: string;
  /** Shadow depth multiplier (0.6 soft → 1.4 deep). */
  shadowDepth: number;
  /** Top inner highlight for embossed depth. */
  highlight: string;
  /** Inset shadow for inset/embossed elements. */
  inset: string;
  /** Brushed-metal sheen overlay (rgba). */
  sheen: string;
}

export const SKINS: Record<SkinId, Skin> = {
  ceramic: {
    id: 'ceramic',
    name: 'Obsidian Ceramic & Brushed Alloy',
    emoji: '🖤',
    glassBg: 'rgba(24,26,34,0.74)',
    glassBorder: 'rgba(255,255,255,0.14)',
    texture: 'rgba(255,255,255,0.025)',
    material: 'Ceramic body with brushed alloy sheen',
    shadowDepth: 1.3,
    highlight: 'rgba(255,255,255,0.16)',
    inset: 'rgba(0,0,0,0.42)',
    sheen: 'rgba(255,255,255,0.09)',
  },
  frosted: {
    id: 'frosted',
    name: 'Frosted Glass',
    emoji: '🧊',
    glassBg: 'rgba(255,255,255,0.66)',
    glassBorder: 'rgba(255,255,255,0.85)',
    texture: 'rgba(255,255,255,0.02)',
    material: 'Translucent frosted glass',
    shadowDepth: 1,
    highlight: 'rgba(255,255,255,0.6)',
    inset: 'rgba(16,24,40,0.05)',
    sheen: 'rgba(255,255,255,0.1)',
  },
  quartz: {
    id: 'quartz',
    name: 'Rose Quartz',
    emoji: '🌸',
    glassBg: 'rgba(255,226,232,0.6)',
    glassBorder: 'rgba(255,255,255,0.88)',
    texture: 'rgba(255,255,255,0.03)',
    material: 'Soft rose quartz glass',
    shadowDepth: 0.9,
    highlight: 'rgba(255,255,255,0.45)',
    inset: 'rgba(183,110,121,0.1)',
    sheen: 'rgba(255,255,255,0.14)',
  },
  velvet: {
    id: 'velvet',
    name: 'Midnight Velvet',
    emoji: '🌌',
    glassBg: 'rgba(24,18,52,0.72)',
    glassBorder: 'rgba(160,130,255,0.2)',
    texture: 'rgba(160,130,255,0.035)',
    material: 'Deep matte velvet',
    shadowDepth: 1.15,
    highlight: 'rgba(180,155,255,0.16)',
    inset: 'rgba(0,0,0,0.36)',
    sheen: 'rgba(160,130,255,0.08)',
  },
};

export const SKIN_LIST: Skin[] = Object.values(SKINS);

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
