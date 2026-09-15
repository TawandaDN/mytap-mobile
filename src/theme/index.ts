import { Platform, TextStyle } from 'react-native';

/**
 * MyTap Design System
 *
 * Layered backgrounds (deep gradient at the top bleeding into content, cards
 * floating above with soft shadows), a rounded card system (16-20px radius,
 * light cards on gradient, consistent 16px inner padding), strong typography
 * hierarchy, horizontal scroll shortcut cards, dismissible amber banners and
 * a clean bottom navigation.
 *
 * Motion philosophy: zero bounciness. Smooth glass, fluid water, confident
 * slide — never spring, bounce, elastic, overshoot or rubber-band.
 */

/* ============ COLOR ============ */

export const palette = {
  // Primary gradient — deep navy
  navyA: '#0F1729',
  navyB: '#1E3A5F',
  navyC: '#2D3B6B',

  // Accents
  coral: '#FF6B4A',
  gold: '#F5A623',
  emerald: '#2ECC71',
  purple: '#6B3A8A',

  // Surfaces
  background: '#F5F7FA',
  surface: '#FFFFFF',

  // Glass
  glassBg: 'rgba(255,255,255,0.06)',
  glassBorder: 'rgba(255,255,255,0.08)',

  // Card gradients — MyTap Wallet
  walletA: '#1A2A4A',
  walletB: '#2D3B6B',
  walletC: '#FF6B4A',
  // Mastercard
  mastercardA: '#2D3B6B',
  mastercardB: '#4A6A8A',
  mastercardC: '#F5A623',
  // MyZaka
  myzakaA: '#1A2A4A',
  myzakaB: '#3D2B6B',
  myzakaC: '#8A4A9A',
  // Premium
  premiumA: '#0F1729',
  premiumB: '#1E3A5F',
  premiumC: '#2D3B6B',

  // Text
  textPrimary: '#101828',
  textSecondary: '#344054',
  textMuted: '#7A8699',
  textOnDark: 'rgba(255,255,255,0.92)',
  textOnDarkMuted: 'rgba(255,255,255,0.62)',

  // Status
  danger: '#D92D20',
  success: '#2ECC71',
  warning: '#F5A623',
  info: '#1E3A5F',
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
  /** Faint 1px border so white containers pop cleanly off the warm canvas. */
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
  /** Polished metallic matte gold — never dull mud-yellow. */
  gold: string;
  /** Crisp indicator for data visualisations. */
  indicator: string;
  /** Soft rail behind the indicator on dual-tone data tracks. */
  indicatorTrack: string;
  glassShadow: string;
  danger: string;
  /** Strict card corner radius. */
  cardRadius: number;
  gradient: readonly [string, string, string];
  /** Deep navy header gradient (top ~30% of Home). */
  headerGradient: readonly [string, string, string];
  accentGradient: readonly [string, string, string];
  goldGradient: readonly [string, string, string];
  /** Water bubble tint. */
  bubble: string;
  /** Amber notification banner. */
  bannerBg: string;
  bannerBorder: string;
}

/* ============ THEMES ============ */

export type ThemeId = 'cream' | 'purple' | 'violet' | 'fuchsia' | 'midnight';

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
  background: palette.background,
  surface: palette.surface,
  surfaceAlt: '#EDF1F7',
  text: palette.textPrimary,
  textSecondary: palette.textSecondary,
  textMuted: palette.textMuted,
  border: 'rgba(16,24,40,0.08)',
  hairline: 'rgba(16,24,40,0.055)',
  glassBg: 'rgba(255,255,255,0.72)',
  glassBorder: 'rgba(255,255,255,0.85)',
  glassBgLight: 'rgba(255,255,255,0.82)',
  glassBorderLight: 'rgba(255,255,255,0.95)',
  primary: '#0B6B4F',
  primaryDeep: '#07553E',
  gold: '#B8892B',
  /** Crisp violet indicator for data-visualisation tracks. */
  indicator: '#6B4FE0',
  indicatorTrack: 'rgba(16,24,40,0.055)',
  glassShadow: 'rgba(16,24,40,0.08)',
  danger: palette.danger,
  cardRadius: 18,
  bannerBg: 'rgba(245,166,35,0.12)',
  bannerBorder: 'rgba(245,166,35,0.28)',
};

const baseDark: Omit<
  Theme,
  'accent' | 'accent2' | 'gradient' | 'headerGradient' | 'accentGradient' | 'goldGradient' | 'bubble'
> = {
  mode: 'dark',
  background: '#0B0E14',
  surface: '#141922',
  surfaceAlt: '#1C2330',
  text: 'rgba(255,255,255,0.94)',
  textSecondary: 'rgba(255,255,255,0.76)',
  textMuted: 'rgba(255,255,255,0.52)',
  border: 'rgba(255,255,255,0.1)',
  hairline: 'rgba(255,255,255,0.07)',
  glassBg: palette.glassBg,
  glassBorder: palette.glassBorder,
  glassBgLight: 'rgba(255,255,255,0.1)',
  glassBorderLight: 'rgba(255,255,255,0.16)',
  primary: '#12A673',
  primaryDeep: '#0B6B4F',
  gold: '#E6C463',
  indicator: '#9D8CFF',
  indicatorTrack: 'rgba(255,255,255,0.08)',
  glassShadow: 'rgba(0,0,0,0.5)',
  danger: '#FF6B5E',
  cardRadius: 18,
  bannerBg: 'rgba(245,166,35,0.14)',
  bannerBorder: 'rgba(245,166,35,0.3)',
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
  return {
    ...base,
    mode,
    accent,
    accent2,
    gradient,
    headerGradient,
    accentGradient,
    goldGradient,
    bubble,
  };
}

const GOLD_GRAD = ['#E6C463', '#D2A63C', '#9E7A1E'] as const;
const GREEN_GRAD = ['#12A673', '#0B6B4F', '#07553E'] as const;

export const THEMES: Record<ThemeId, ThemeDef> = {
  cream: {
    id: 'cream',
    name: 'Cream',
    emoji: '🍦',
    light: makeTheme(
      'light',
      '#FF6B4A',
      '#F5A623',
      ['#0F1729', '#1E3A5F', '#2D3B6B'],
      ['#0F1729', '#1E3A5F', '#2D3B6B'],
      [...GREEN_GRAD],
      [...GOLD_GRAD],
      'rgba(255,107,74,0.1)'
    ),
    dark: makeTheme(
      'dark',
      '#FF8A6B',
      '#FFC46B',
      ['#0B1018', '#17233B', '#2A3B5E'],
      ['#0B1018', '#17233B', '#2A3B5E'],
      ['#12A673', '#0E8A5F', '#0B6B4F'],
      [...GOLD_GRAD],
      'rgba(255,138,107,0.1)'
    ),
  },
  purple: {
    id: 'purple',
    name: 'Purple',
    emoji: '🟣',
    light: makeTheme(
      'light',
      '#6B3A8A',
      '#FF6B4A',
      ['#241547', '#3D2B6B', '#6B3A8A'],
      ['#1E1240', '#3D2B6B', '#6B3A8A'],
      [...GREEN_GRAD],
      [...GOLD_GRAD],
      'rgba(107,58,138,0.1)'
    ),
    dark: makeTheme(
      'dark',
      '#B98CD8',
      '#FF8A6B',
      ['#160C29', '#2A1745', '#4A2A70'],
      ['#160C29', '#2A1745', '#4A2A70'],
      ['#12A673', '#0E8A5F', '#0B6B4F'],
      [...GOLD_GRAD],
      'rgba(185,140,216,0.1)'
    ),
  },
  violet: {
    id: 'violet',
    name: 'Violet',
    emoji: '💜',
    light: makeTheme(
      'light',
      '#5B3BC4',
      '#8B7BF0',
      ['#1E1240', '#3A2385', '#6B4FE0'],
      ['#1E1240', '#3A2385', '#5B3BC4'],
      [...GREEN_GRAD],
      [...GOLD_GRAD],
      'rgba(91,59,196,0.1)'
    ),
    dark: makeTheme(
      'dark',
      '#9D8CFF',
      '#C4B8FF',
      ['#100826', '#251556', '#3A2385'],
      ['#100826', '#251556', '#3A2385'],
      ['#12A673', '#0E8A5F', '#0B6B4F'],
      [...GOLD_GRAD],
      'rgba(157,140,255,0.1)'
    ),
  },
  fuchsia: {
    id: 'fuchsia',
    name: 'Fuchsia',
    emoji: '🌸',
    light: makeTheme(
      'light',
      '#C2318F',
      '#FF6B4A',
      ['#3A0F35', '#7A2168', '#C2318F'],
      ['#3A0F35', '#7A2168', '#C2318F'],
      [...GREEN_GRAD],
      [...GOLD_GRAD],
      'rgba(194,49,143,0.1)'
    ),
    dark: makeTheme(
      'dark',
      '#E87CC0',
      '#FF8A6B',
      ['#22061F', '#4A0F42', '#8A2470'],
      ['#22061F', '#4A0F42', '#8A2470'],
      ['#12A673', '#0E8A5F', '#0B6B4F'],
      [...GOLD_GRAD],
      'rgba(232,124,192,0.1)'
    ),
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    emoji: '🌙',
    light: makeTheme(
      'light',
      '#1E3A5F',
      '#6B3A8A',
      ['#0F1729', '#1E3A5F', '#2D3B6B'],
      ['#0F1729', '#1E3A5F', '#2D3B6B'],
      [...GREEN_GRAD],
      [...GOLD_GRAD],
      'rgba(30,58,95,0.1)'
    ),
    dark: makeTheme(
      'dark',
      '#5B8DEF',
      '#B98CD8',
      ['#05080F', '#0F1729', '#1E3A5F'],
      ['#05080F', '#0F1729', '#1E3A5F'],
      ['#12A673', '#0E8A5F', '#0B6B4F'],
      [...GOLD_GRAD],
      'rgba(255,255,255,0.07)'
    ),
  },
};

export const THEME_LIST: ThemeDef[] = Object.values(THEMES);

export const lightTheme: Theme = THEMES.midnight.light;
export const darkTheme: Theme = THEMES.midnight.dark;

/* ============ TYPOGRAPHY ============ */

/** Inter — crisp high-end geometric sans, SF Pro proportions. */
export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  light: 'Inter_300Light',
} as const;

/** Identity helper — pins each entry to a concrete TextStyle so spreads
 * inside StyleSheet.create keep their literal width. */
const t = (s: TextStyle): TextStyle => s;

/**
 * Inter type scale. Hero is a Light (300) 40pt face; titles are medium-bold
 * (never heavy black) with letter-spacing + generous line-height so text
 * blocks breathe and never feel squished.
 */
export const type = {
  /** Hero balance — 40pt Light, leading 1.0 */
  hero: t({ fontSize: 40, lineHeight: 44, fontWeight: '300', fontFamily: fonts.light, letterSpacing: -0.8 }),
  /** Large title — 28pt Bold, leading 1.1 */
  largeTitle: t({ fontSize: 28, lineHeight: 33, fontWeight: '700', fontFamily: fonts.bold, letterSpacing: -0.4 }),
  /** Title — 22pt SemiBold, leading 1.2 */
  title: t({ fontSize: 22, lineHeight: 28, fontWeight: '600', fontFamily: fonts.semibold, letterSpacing: -0.2 }),
  /** Heading — 18pt SemiBold, leading 1.3 */
  heading: t({ fontSize: 18, lineHeight: 24, fontWeight: '600', fontFamily: fonts.semibold, letterSpacing: -0.1 }),
  /** Subheading / medium label — 16pt Medium, leading 1.4 */
  subheading: t({ fontSize: 16, lineHeight: 22, fontWeight: '500', fontFamily: fonts.medium, letterSpacing: 0 }),
  /** Body — 15pt Regular, leading 1.5 */
  body: t({ fontSize: 15, lineHeight: 23, fontWeight: '400', fontFamily: fonts.regular, letterSpacing: 0.05 }),
  /** Caption — 13pt Regular, leading 1.4 */
  caption: t({ fontSize: 13, lineHeight: 18, fontWeight: '400', fontFamily: fonts.regular, letterSpacing: 0.05 }),
  /** Label — 11pt Medium, leading 1.3 */
  label: t({ fontSize: 11, lineHeight: 14, fontWeight: '500', fontFamily: fonts.medium, letterSpacing: 0.6 }),
  /** Micro — 10pt */
  small: t({ fontSize: 10, lineHeight: 13, fontWeight: '400', fontFamily: fonts.regular, letterSpacing: 0.2 }),

  display: t({ fontSize: 34, lineHeight: 40, fontWeight: '700', fontFamily: fonts.bold, letterSpacing: -0.6 }),

  /** Tabular-nums money — decimals align perfectly when stacked. */
  money: t({
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
    fontFamily: fonts.semibold,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'],
  }),
  moneyLarge: t({
    fontSize: 30,
    lineHeight: 38,
    fontWeight: '700',
    fontFamily: fonts.bold,
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
  }),
};

/* ============ SPACING & RADIUS ============ */

/** 4px grid. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  giant: 48,
} as const;

/** Corner radii — cards strictly 18px, surfaces 16-20px. */
export const radius = {
  sm: 12,
  md: 16,
  lg: 18,
  card: 18,
  xl: 20,
  xxl: 24,
  pill: 999,
} as const;

export const CARD_RADIUS = 18;

/** Consistent 16px inner card padding. */
export const CARD_PADDING = 16;

/* ============ SHADOWS ============ */

/** Layered drop shadows — cards float above the gradient canvas. */
export const shadows = {
  subtle: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  standard: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  elevated: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 48,
    elevation: 8,
  },
  premium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.16,
    shadowRadius: 64,
    elevation: 12,
  },
  /* Legacy aliases — older surfaces reference these names. */
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 48,
    elevation: 8,
  },
  hero: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.16,
    shadowRadius: 64,
    elevation: 12,
  },
} as const;

/** Back-compat aliases used by older surfaces. */
export const shadowAliases = {
  soft: shadows.standard,
  medium: shadows.elevated,
  hero: shadows.premium,
} as const;

/* ============ MOTION ============ */

/**
 * Motion — refined ease-out; zero bounciness.
 * Springs are reserved strictly for drag/gesture physics.
 */
export const spring = { damping: 0.9, stiffness: 200, mass: 1 } as const;

export const springConfig = {
  damping: 0.9,
  stiffness: 200,
  mass: 1,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
} as const;

/** Canonical durations (ms) + easing per the motion spec. */
export const motion = {
  fade: { duration: 300, easing: 'out' as const },
  slide: { duration: 400, easing: 'inOut' as const },
  scale: { duration: 400, easing: 'out' as const },
  count: { duration: 500, easing: 'out' as const },
  stroke: { duration: 1500, easing: 'out' as const },
  shimmer: { duration: 6000, easing: 'linear' as const },
  /** Card hover — 2px vertical lift + shadow intensification. */
  hover: { duration: 300, easing: 'out' as const },
  /** Screen transition — crossfade + scale 0.98 → 1.0. */
  transition: { duration: 300, easing: 'out' as const },
  /** Balance update — lands precisely, never overshoots. */
  balance: { duration: 400, easing: 'out' as const },
  /** Progress ring — steady stroke 0% → target. */
  ring: { duration: 1500, easing: 'out' as const },
  /** Payment success — green glow + checkmark draw + soft haptic. */
  success: { duration: 800, easing: 'out' as const },
} as const;

/** Touch-following water droplet highlight. */
export const WATER_BUBBLE = {
  /** Highlight centre offset within the element. */
  offsetX: 0.3,
  offsetY: -0.2,
  /** Highlight radius as a fraction of the element's larger side. */
  radius: 0.6,
  /** Peak opacity of the white highlight at the surface. */
  opacity: 0.12,
} as const;

/* ============ TEXTURE SKINS ============ */

export type SkinId = 'ceramic' | 'frosted' | 'quartz' | 'velvet';

export interface Skin {
  id: SkinId;
  name: string;
  emoji: string;
  glassBg: string;
  glassBorder: string;
  /** Subtle repeating texture overlay (rgba). */
  texture: string;
  material: string;
  /** Shadow depth multiplier (0.6 soft → 1.4 deep). */
  shadowDepth: number;
  /** Top inner highlight for embossed depth. */
  highlight: string;
  /** Inset shade for inset/embossed elements. */
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
    material: 'Ceramic body, brushed alloy sheen',
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
