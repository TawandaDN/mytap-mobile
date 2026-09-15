import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { iconColors, iconTile, space, text } from '../../theme/tokens';

/**
 * The icon system.
 *
 * Every icon sits in a 44×44 rounded-square container with a 12px radius and
 * a solid tinted ground, drawn white or tinted at 20px with a consistent
 * stroke weight. Circular grounds belong to avatars only.
 */

export type IconCategory = keyof typeof iconColors;

/** Resolve the canonical tint for a category. */
export function catColor(c: IconCategory): string {
  return iconColors[c];
}

/** Rounded-square icon container. */
export function TileIcon({
  icon,
  color,
  size = iconTile.size,
  radius = iconTile.radius,
  glyph = iconTile.glyph,
  variant = 'tint',
  style,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
  radius?: number;
  glyph?: number;
  /** `tint` = soft ground + coloured glyph; `solid` = solid ground + white glyph. */
  variant?: 'tint' | 'solid';
  style?: ViewStyle | ViewStyle[];
}) {
  const solid = variant === 'solid';
  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: solid ? color : `${color}1F`,
        },
        style,
      ]}
    >
      {solid && <View style={styles.innerLight} pointerEvents="none" />}
      <Ionicons name={icon} size={glyph} color={solid ? '#FFFFFF' : color} />
    </View>
  );
}

/** Chevron used at the trailing edge of list rows — always 16px, muted. */
export function Chevron({ color }: { color?: string }) {
  const { theme } = useTheme();
  return <Ionicons name="chevron-forward" size={16} color={color ?? theme.textMuted} />;
}

/** 1px divider, indented to match where row text begins. */
export function Divider({ indent = 0 }: { indent?: number }) {
  const { theme } = useTheme();
  return (
    <View
      style={[styles.divider, { backgroundColor: theme.hairline, marginLeft: indent }]}
      pointerEvents="none"
    />
  );
}

/** Section header — bold title, muted subtitle, optional trailing action. */
export function SectionHeader({
  title,
  subtitle,
  uppercased = false,
  style,
}: {
  title: string;
  subtitle?: string;
  uppercased?: boolean;
  style?: ViewStyle | ViewStyle[];
}) {
  const { theme } = useTheme();
  return (
    <View style={[styles.sectionHead, style]}>
      <Text style={[text.sectionHeader, { color: theme.text }]}>
        {uppercased ? title.toUpperCase() : title}
      </Text>
      {!!subtitle && (
        <Text style={[text.caption, { color: theme.textMuted, marginTop: space.xxs }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  innerLight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  sectionHead: {
    width: '100%',
  },
});
