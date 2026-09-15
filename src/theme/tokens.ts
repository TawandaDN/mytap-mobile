import { TextStyle } from 'react-native';
import { Theme, ThemeId, ThemeMode } from './index';

/**
 * MTS-grade design tokens.
 *
 * The single source of truth for the premium fintech layer: exact palette,
 * gradient recipes, an 8px spacing grid, the card/icon/shadow systems and the
 * Inter type scale. Screens read from here so spacing, radii and weights never
 * drift between surfaces.
 */

/* ============ COLOUR ============ */

export const mts = {
  navy: '#0F1729',
  navyMid: '#1E3A5F',
  navySoft: '#2D3B6B',

  coral: '#FF6B4A',
  gold: '#F5A623',
  emerald: '#2ECC71',
  purple: '#6B3A8A',

  background: '#F5F7FA',
  surface: '#FFFFFF',

  glassBg: 'rgba(255,255,255,0.06)',
  glassBorder: 'rgba(255,255,255,0.08)',

  textPrimary: '#0F1729',
  textBody: '#4A5A7A',
  textMuted: '#8A9AAA',
  textLabel: '#8A9AAA',
  chevron: '#8A9AAA',

  danger: '#E74C3C',
  divider: 'rgba(0,0,0,0.05)',
} as const;

/* ============ WALLET / CARD GRADIENTS ============ */

export const cardGradients = {
  mytapWallet: ['#1A2A4A', '#2D3B6B', '#FF6B4A'],
  mastercard: ['#2D3B6B', '#4A6A8A', '#F5A623'],
  myzaka: ['#1A2A4A', '#3D2B6B', '#8A4A9A'],
  premium: ['#0F1729', '#1E3A5F', '#2D3B6B'],
} as const;

/** Header gradient per screen — always bleeding into the content canvas. */
export const headerGradients = {
  home: { colors: ['#0F1729', '#1E3A5F', '#2D3B6B', 'transparent'], locations: [0, 0.4, 0.7, 1] },
  cards: { colors: ['#1A2A4A', '#2D3B6B', 'transparent'], locations: [0, 0.5, 1] },
  payments: { colors: ['#0F1729', '#1E3A5F', 'transparent'], locations: [0, 0.5, 1] },
  generic: { colors: ['#0F1729', '#1E3A5F', '#2D3B6B', 'transparent'], locations: [0, 0.35, 0.65, 1] },
} as const;

export type HeaderKind = keyof typeof headerGradients;

/* ============ ICON SYSTEM ============ */

/** Category tints for the 44×44 rounded-square icon containers. */
export const iconColors = {
  payments: '#FF6B4A',
  bills: '#F5A623',
  transport: '#2ECC71',
  airtime: '#6B3A8A',
  savings: '#1E3A5F',
  history: '#6B7A8A',
  data: '#2ECC71',
  cards: '#1E3A5F',
  security: '#6B3A8A',
  rewards: '#F5A623',
} as const;

export const iconTile = {
  size: 44,
  radius: 12,
  glyph: 20,
} as const;

/* ============ SPACING (8px grid) ============ */

export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
} as const;

/** Fixed layout rhythm. */
export const layout = {
  screenH: 16,
  screenTop: 8,
  screenBottom: 100,
  sectionGap: 24,
  headerGap: 12,
  cardGap: 12,
  iconToText: 12,
  titleToSubtitle: 4,
  contentToButton: 16,
  headerToBody: 8,
  bodyToCaption: 4,
} as const;

/* ============ RADII ============ */

export const radii = {
  icon: 12,
  card: 20,
  elevated: 24,
  search: 20,
  avatar: 999,
  pill: 999,
} as const;

/* ============ SHADOWS ============ */

type Shadow = {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
};

const sh = (
  height: number,
  radius: number,
  opacity: number,
  elevation: number,
  color = '#000000'
): Shadow => ({
  shadowColor: color,
  shadowOffset: { width: 0, height },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

export const elevation = {
  subtle: sh(2, 8, 0.04, 1),
  standard: sh(4, 16, 0.06, 3),
  elevated: sh(8, 32, 0.08, 6),
  premium: sh(12, 40, 0.12, 9),
  hero: sh(16, 48, 0.15, 12),
  darkCard: sh(12, 40, 0.3, 9, '#0F1729'),
} as const satisfies Record<string, Shadow>;

/* ============ TYPOGRAPHY (Inter) ============ */

export const inter = {
  light: 'Inter_300Light',
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

const ts = (s: TextStyle): TextStyle => s;

export const text = {
  /** Hero balance — 40pt Light, white on gradient, leading 1.0. */
  hero: ts({
    fontSize: 40,
    lineHeight: 42,
    fontFamily: inter.light,
    fontWeight: '300',
    letterSpacing: -0.5,
  }),
  /** Screen title — 28pt Bold. */
  screenTitle: ts({
    fontSize: 28,
    lineHeight: 32,
    fontFamily: inter.bold,
    fontWeight: '700',
    letterSpacing: -0.4,
  }),
  /** Section header — 18pt SemiBold. */
  sectionHeader: ts({
    fontSize: 18,
    lineHeight: 23,
    fontFamily: inter.semibold,
    fontWeight: '600',
    letterSpacing: -0.1,
  }),
  /** Card title — 16pt SemiBold. */
  cardTitle: ts({
    fontSize: 16,
    lineHeight: 22,
    fontFamily: inter.semibold,
    fontWeight: '600',
    letterSpacing: -0.1,
  }),
  /** Card balance — 22pt Bold. */
  cardBalance: ts({
    fontSize: 22,
    lineHeight: 27,
    fontFamily: inter.bold,
    fontWeight: '700',
    letterSpacing: -0.3,
  }),
  /** Body — 15pt Regular. */
  body: ts({
    fontSize: 15,
    lineHeight: 22,
    fontFamily: inter.regular,
    fontWeight: '400',
    letterSpacing: 0.05,
  }),
  /** Caption — 13pt Regular. */
  caption: ts({
    fontSize: 13,
    lineHeight: 18,
    fontFamily: inter.regular,
    fontWeight: '400',
    letterSpacing: 0.1,
  }),
  /** Label — 11pt Medium, letter-spacing 0.5. */
  label: ts({
    fontSize: 11,
    lineHeight: 15,
    fontFamily: inter.medium,
    fontWeight: '500',
    letterSpacing: 0.5,
  }),
  /** Section label (coral) — 13pt SemiBold, letter-spacing 1.0. */
  sectionLabel: ts({
    fontSize: 13,
    lineHeight: 17,
    fontFamily: inter.semibold,
    fontWeight: '600',
    letterSpacing: 1.0,
  }),
  /** Tabular money — decimals align when stacked. */
  moneyTabular: ts({
    fontSize: 15,
    lineHeight: 21,
    fontFamily: inter.semibold,
    fontWeight: '600',
    letterSpacing: 0,
    fontVariant: ['tabular-nums'],
  }),
} as const;

/* ============ MOTION ============ */

/** Press physics — scale down fast, release slower. Never a spring. */
export const press = {
  in: { scale: 0.98, duration: 100 },
  out: { scale: 1, duration: 200 },
  /** Hover lift for pointer devices / highlight states. */
  hover: { lift: -2, duration: 300 },
} as const;

/* ============ THEME PALETTES ============ */

interface PaletteSpec {
  background: string;
  surface: string;
  text: string;
  accent: string;
}

/**
 * Exact per-theme palettes. Applied on top of the shared theme skeleton so a
 * theme switch re-tints background, surface, text and accent together.
 */
export const THEME_PALETTES: Record<ThemeId, { light: PaletteSpec; dark: PaletteSpec }> = {
  cream: {
    light: { background: '#F5F7FA', surface: '#FFFFFF', text: '#0F1729', accent: '#FF6B4A' },
    dark: { background: '#0B1018', surface: '#151C28', text: '#FFFFFF', accent: '#FF8A6B' },
  },
  purple: {
    light: { background: '#F5F0FF', surface: '#FFFFFF', text: '#1A0A2E', accent: '#8A4A9A' },
    dark: { background: '#150C24', surface: '#221338', text: '#FFFFFF', accent: '#B98CD8' },
  },
  violet: {
    light: { background: '#F0F0FF', surface: '#FFFFFF', text: '#0A0A2E', accent: '#6B3A8A' },
    dark: { background: '#0C0C22', surface: '#181834', text: '#FFFFFF', accent: '#9D8CFF' },
  },
  fuchsia: {
    light: { background: '#FFF0F8', surface: '#FFFFFF', text: '#2E0A1A', accent: '#D44A8A' },
    dark: { background: '#1E0714', surface: '#2E0F20', text: '#FFFFFF', accent: '#E87CC0' },
  },
  midnight: {
    light: { background: '#F5F7FA', surface: '#FFFFFF', text: '#0F1729', accent: '#FF6B4A' },
    dark: { background: '#0F1729', surface: '#1A2A4A', text: '#FFFFFF', accent: '#FF6B4A' },
  },
};

/** Apply the theme's exact palette (and its accent-derived tints). */
export function withPalette(theme: Theme, id: ThemeId, mode: ThemeMode): Theme {
  const p = THEME_PALETTES[id][mode === 'dark' ? 'dark' : 'light'];
  return {
    ...theme,
    background: p.background,
    surface: p.surface,
    text: p.text,
    accent: p.accent,
    textSecondary: mode === 'dark' ? 'rgba(255,255,255,0.76)' : mts.textBody,
    textMuted: mode === 'dark' ? 'rgba(255,255,255,0.52)' : mts.textMuted,
    hairline: mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    border: mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
    bubble: `${p.accent}1A`,
  };
}
