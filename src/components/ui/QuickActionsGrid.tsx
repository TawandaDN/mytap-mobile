import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { PressableScale } from './PressableScale';
import { TileIcon } from './IconSystem';
import { radii, space, text } from '../../theme/tokens';
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
          style={[styles.tile, { backgroundColor: theme.surface }]}
          radius={radii.card}
          shimmer
          haptic="medium"
          onPress={() => {
            haptics.medium();
            onPress(a.route);
          }}
        >
          <TileIcon icon={a.icon} color={a.color} variant="solid" />
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
    gap: space.xs,
  },
  tile: {
    width: '23%',
    borderRadius: radii.card,
    paddingVertical: space.sm,
    alignItems: 'center',
    gap: 7,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  label: {
    ...text.label,
    fontSize: 10.5,
    fontWeight: '600',
    textAlign: 'center',
  },
});
