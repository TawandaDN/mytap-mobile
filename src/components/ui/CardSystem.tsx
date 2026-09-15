import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import { elevation, iconTile as iconSpec, radii, space, text } from '../../theme/tokens';

/**
 * The MyTap card system.
 *
 * Four material grades, each with a fixed radius, padding and shadow so
 * cards never drift:
 *   Standard   20px · 16px pad · white · soft standard shadow
 *   Elevated   24px · 20px pad · white · deeper shadow
 *   Dark       24px · 20px pad · navy gradient · white text
 *   Gradient   24px · 20px pad · per-instrument gradient
 */

/* ============ STANDARD ============ */

export function Card({
  children,
  style,
  padded = true,
  noBorder = true,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padded?: boolean;
  noBorder?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.standard,
        {
          backgroundColor: theme.surface,
          borderWidth: noBorder ? 0 : 1,
          borderColor: theme.hairline,
        },
        padded && { padding: space.md },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/* ============ ELEVATED ============ */

export function ElevatedCard({
  children,
  style,
  padded = true,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padded?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.elevated,
        { backgroundColor: theme.surface },
        padded && { padding: space.lg },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/* ============ DARK (data / tariff) ============ */

export function DarkCard({
  children,
  style,
  padded = true,
  colors,
}: {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padded?: boolean;
  colors?: readonly [string, string];
}) {
  return (
    <LinearGradient
      colors={colors ?? ['#0F1729', '#1E3A5F']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.dark, padded && { padding: space.lg }, style]}
    >
      <View style={styles.darkSheen} pointerEvents="none" />
      {children}
    </LinearGradient>
  );
}

/* ============ GRADIENT (wallets / instruments) ============ */

export function GradientCard({
  children,
  colors,
  style,
  padded = true,
}: {
  children: React.ReactNode;
  colors: readonly [string, string, string];
  style?: ViewStyle | ViewStyle[];
  padded?: boolean;
}) {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, padded && { padding: space.lg }, style]}
    >
      <View style={styles.gradientSheen} pointerEvents="none" />
      {children}
    </LinearGradient>
  );
}

/* ============ ICON TILE ============ */

/**
 * Rounded-square icon container — 44×44, 12px radius, solid tinted ground,
 * 20px glyph. Never circular (avatars are the sole exception), never an
 * icon without a container.
 */
export function IconTile({
  color,
  size = iconSpec.size,
  radius = iconSpec.radius,
  children,
  style,
}: {
  color: string;
  size?: number;
  radius?: number;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}) {
  return (
    <View
      style={[
        styles.iconTile,
        { width: size, height: size, borderRadius: radius, backgroundColor: `${color}1F` },
        style,
      ]}
    >
      {children}
    </View>
  );
}

/** Filled variant — solid colour ground with a white glyph. */
export function IconTileSolid({
  color,
  size = iconSpec.size,
  radius = iconSpec.radius,
  children,
  style,
}: {
  color: string;
  size?: number;
  radius?: number;
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}) {
  return (
    <View
      style={[
        styles.iconTile,
        { width: size, height: size, borderRadius: radius, backgroundColor: color },
        style,
      ]}
    >
      <View style={styles.iconInnerLight} pointerEvents="none" />
      {children}
    </View>
  );
}

/* ============ SECTION LABEL (coral) ============ */

export function SectionLabel({ children, style }: { children: string; style?: TextStyle }) {
  const { theme } = useTheme();
  return (
    <Text style={[text.sectionLabel, { color: theme.accent }, style]}>{children.toUpperCase()}</Text>
  );
}

const styles = StyleSheet.create({
  standard: {
    borderRadius: radii.card,
    ...elevation.standard,
  },
  elevated: {
    borderRadius: radii.elevated,
    ...elevation.elevated,
  },
  dark: {
    borderRadius: radii.elevated,
    overflow: 'hidden',
    ...elevation.darkCard,
  },
  darkSheen: {
    position: 'absolute',
    top: -60,
    right: -50,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  gradient: {
    borderRadius: radii.elevated,
    overflow: 'hidden',
    ...elevation.premium,
  },
  gradientSheen: {
    position: 'absolute',
    top: -70,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  iconTile: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconInnerLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
});
