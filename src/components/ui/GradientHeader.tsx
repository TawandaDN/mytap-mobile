import React from 'react';
import { View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { headerGradients, HeaderKind, space } from '../../theme/tokens';

/**
 * Bleeding gradient header.
 *
 * A rich gradient that occupies the top of the screen and dissolves into the
 * content canvas — no hard cut-off, no boxed panel. The final stop is fully
 * transparent, so cards float on top of the colour as it fades to the
 * background beneath.
 */
export function GradientHeader({
  children,
  kind = 'generic',
  minHeight,
  style,
}: {
  children?: React.ReactNode;
  kind?: HeaderKind;
  minHeight?: number;
  style?: ViewStyle | ViewStyle[];
}) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const preset = headerGradients[kind];

  // Midnight (dark) swaps in the theme's own gradient so the header stays
  // coherent with the active palette.
  const colors =
    theme.mode === 'dark'
      ? ([...theme.headerGradient, 'transparent'] as const)
      : (preset.colors as unknown as readonly [string, string, string, ...string[]]);

  const locations =
    theme.mode === 'dark'
      ? ([0, 0.4, 0.75, 1] as const)
      : (preset.locations as unknown as readonly [number, number, ...number[]]);

  return (
    <View style={[styles.wrap, minHeight ? { minHeight } : { paddingBottom: space.xxl }, style]}>
      <LinearGradient
        colors={colors}
        locations={locations}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.fill}
      />
      {/* Layered glows give the gradient depth rather than a flat wash. */}
      <View style={styles.glowA} pointerEvents="none" />
      <View style={styles.glowB} pointerEvents="none" />
      <View style={{ paddingTop: insets.top + space.xs, paddingHorizontal: space.md }}>
        {children}
      </View>
    </View>
  );
}

const styles = {
  wrap: {
    overflow: 'hidden',
  },
  fill: {
    ...({ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as const),
  },
  glowA: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  glowB: {
    position: 'absolute',
    bottom: -100,
    left: -70,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
} as const;
