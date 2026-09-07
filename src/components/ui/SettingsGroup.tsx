import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeContext';
import { GlassCard } from '../cards/GlassCard';
import { PressableScale } from './PressableScale';
import { spacing, type } from '../../theme';

export interface SettingsItem {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
}

/**
 * Grouped settings section — a titled glass card with icon rows.
 * Used to restructure Settings into clear, grouped sections.
 */
export function SettingsGroup({
  title,
  icon,
  items,
  style,
}: {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  items: SettingsItem[];
  style?: ViewStyle;
}) {
  const { theme } = useTheme();

  return (
    <View style={[styles.group, style]}>
      <View style={styles.header}>
        {icon && <Ionicons name={icon} size={16} color={theme.textMuted} />}
        <Text style={[styles.title, { color: theme.textMuted }]}>{title}</Text>
      </View>
      <GlassCard bubble={false}>
        {items.map((item, i) => (
          <PressableScale
            key={item.label}
            style={[styles.row, i > 0 && styles.divider]}
            onPress={item.onPress}
            disabled={!item.onPress}
          >
            <View style={[styles.rowIcon, { backgroundColor: item.iconColor + '22' }]}>
              <Ionicons name={item.icon} size={18} color={item.iconColor} />
            </View>
            <Text style={[styles.rowLabel, { color: theme.text }]}>{item.label}</Text>
            <View style={styles.rowRight}>
              {item.right ?? <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />}
            </View>
          </PressableScale>
        ))}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
    paddingHorizontal: 4,
  },
  title: {
    ...type.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,23,41,0.06)',
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  rowRight: {
    alignItems: 'flex-end',
  },
});