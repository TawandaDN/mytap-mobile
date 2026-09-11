import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { PressableScale } from './PressableScale';
import { spacing, type, shadows } from '../../theme';
import { haptics } from '../../utils/haptics';

export interface QuickAction {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  route: string;
}

/**
 * Quick actions grid — a clean, dense 4-column grid of primary actions.
 * Crisp white tiles with a hairline border, coloured icon chips, and
 * press-scale + haptic on every tap.
 */
export function QuickActionsGrid({
  actions,
  onPress,
}: {
  actions: QuickAction[];
  onPress: (route: string) => void;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.grid}>
      {actions.map((a) => (
        <PressableScale
          key={a.label}
          style={[styles.tile, { backgroundColor: theme.surface, borderColor: theme.hairline }]}
          onPress={() => {
            haptics.medium();
            onPress(a.route);
          }}
        >
          <View style={[styles.iconWrap, { backgroundColor: a.color + '14' }]}>
            <Ionicons name={a.icon} size={21} color={a.color} />
          </View>
          <Text style={[styles.label, { color: theme.textSecondary }]} numberOfLines={1}>
            {a.label}
          </Text>
        </PressableScale>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tile: {
    width: '23%',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 7,
    ...shadows.subtle,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...type.small,
    fontSize: 10.5,
    fontWeight: '600',
    textAlign: 'center',
  },
});
