import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { useSkin } from '../../theme/SkinContext';
import { PressableScale } from './PressableScale';
import { spacing, type } from '../../theme';
import { haptics } from '../../utils/haptics';

export interface QuickAction {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  route: string;
}

/**
 * Quick actions grid — a 4-column glass grid of primary actions surfaced
 * on the Home screen. Each tile has press-scale + haptic.
 */
export function QuickActionsGrid({
  actions,
  onPress,
}: {
  actions: QuickAction[];
  onPress: (route: string) => void;
}) {
  const { theme } = useTheme();
  const { skin } = useSkin();

  return (
    <View style={styles.grid}>
      {actions.map((a) => (
        <PressableScale
          key={a.label}
          style={[styles.tile, { backgroundColor: theme.glassBg, borderColor: skin.glassBorder }]}
          onPress={() => {
            haptics.medium();
            onPress(a.route);
          }}
        >
          <View style={[styles.iconWrap, { backgroundColor: a.color + '22' }]}>
            <Ionicons name={a.icon} size={22} color={a.color} />
          </View>
          <Text style={[styles.label, { color: theme.textSecondary }]}>{a.label}</Text>
        </PressableScale>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  tile: {
    width: '22%',
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...type.caption,
    fontWeight: '600',
    textAlign: 'center',
  },
});