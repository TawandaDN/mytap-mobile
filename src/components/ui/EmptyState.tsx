import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Button } from './Button';
import { StaggeredItem } from '../animations/Staggered';
import { Illustration, IllustrationKey } from '../../assets/illustrations';
import { inter, space, radii, elevation } from '../../theme/tokens';

/**
 * Empty state.
 *
 * One shape everywhere: a softly lit 3D illustration, an 18pt SemiBold title,
 * a 15pt Regular muted subtitle and a single primary-colour call to action.
 * The illustration carries the material weight so the panel itself can stay
 * perfectly plain — no borders, no ornament.
 */
export function EmptyState({
  illustration,
  title,
  subtitle,
  actionLabel,
  onAction,
  illustrationSize = 168,
  style,
}: {
  illustration: IllustrationKey;
  title: string;
  subtitle: string;
  actionLabel: string;
  onAction: () => void;
  illustrationSize?: number;
  style?: ViewStyle | ViewStyle[];
}) {
  const { theme } = useTheme();

  return (
    <StaggeredItem index={0}>
      <View style={[styles.wrap, { backgroundColor: theme.surface }, style]}>
        <View style={styles.art}>
          <Illustration name={illustration} size={illustrationSize} />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text>
        <Button
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          fullWidth
          style={styles.cta}
        />
      </View>
    </StaggeredItem>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.elevated,
    paddingVertical: space.xxl,
    paddingHorizontal: space.lg,
    alignItems: 'center',
    ...elevation.standard,
  },
  art: {
    marginBottom: space.md,
  },
  title: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: inter.semibold,
    fontWeight: '600',
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: inter.regular,
    fontWeight: '400',
    letterSpacing: 0.05,
    textAlign: 'center',
    marginTop: space.xxs,
    paddingHorizontal: space.sm,
  },
  cta: {
    marginTop: space.lg,
  },
});
