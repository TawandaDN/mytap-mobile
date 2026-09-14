import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { PressableScale } from './PressableScale';
import { spacing, type } from '../../theme';
import { haptics } from '../../utils/haptics';

/**
 * Section header — a bold title with an optional "See all" link, matching
 * the reference: strong title, muted subtitle, action on the right.
 */
export function ScreenHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
        {!!subtitle && (
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text>
        )}
      </View>
      {!!actionLabel && (
        <PressableScale
          onPress={() => {
            haptics.light();
            onAction?.();
          }}
          bubble={false}
          scaleTo={0.95}
        >
          <Text style={[styles.action, { color: theme.accent }]}>{actionLabel}</Text>
        </PressableScale>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  text: {
    flex: 1,
  },
  title: {
    ...type.heading,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  subtitle: {
    ...type.caption,
    marginTop: 2,
  },
  action: {
    ...type.caption,
    fontWeight: '600',
  },
});
