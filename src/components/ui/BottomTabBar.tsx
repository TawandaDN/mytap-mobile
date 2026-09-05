import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { radius, shadows, spacing, type } from '../../theme';
import { haptics } from '../../utils/haptics';

export type TabKey = 'home' | 'cards' | 'pay' | 'tariff' | 'more' | 'sticker';

const TABS: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'cards', label: 'Cards', icon: 'card-outline', activeIcon: 'card' },
  { key: 'pay', label: 'Pay', icon: 'scan-outline', activeIcon: 'scan' },
  { key: 'tariff', label: 'Tariff', icon: 'cellular-outline', activeIcon: 'cellular' },
  { key: 'more', label: 'More', icon: 'ellipsis-horizontal-circle-outline', activeIcon: 'ellipsis-horizontal-circle' },
];

/**
 * Floating glassmorphism bottom tab bar with crossfade + scale active state.
 */
export function BottomTabBar({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  const { theme } = useTheme();

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <BlurView intensity={40} tint="light" style={styles.bar}>
        {TABS.map((tab) => (
          <TabItem
            key={tab.key}
            tab={tab}
            active={active === tab.key}
            onPress={() => onChange(tab.key)}
            theme={theme}
          />
        ))}
      </BlurView>
    </View>
  );
}

function TabItem({
  tab,
  active,
  onPress,
  theme,
}: {
  tab: (typeof TABS)[number];
  active: boolean;
  onPress: () => void;
  theme: any;
}) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(active ? 1 : 0.6);

  useEffect(() => {
    scale.value = withTiming(active ? 1.08 : 1, { duration: 300, easing: Easing.out(Easing.cubic) });
    opacity.value = withTiming(active ? 1 : 0.6, { duration: 300, easing: Easing.out(Easing.cubic) });
  }, [active, scale, opacity]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable
      style={styles.item}
      onPress={() => {
        haptics.selection();
        onPress();
      }}
    >
      <Animated.View
        style={[
          styles.iconWrap,
          active && { backgroundColor: theme.accent + '22' },
          style,
        ]}
      >
        <Ionicons
          name={active ? tab.activeIcon : tab.icon}
          size={22}
          color={active ? theme.accent : theme.textMuted}
        />
      </Animated.View>
      <Text
        style={[
          styles.label,
          { color: active ? theme.accent : theme.textMuted },
        ]}
      >
        {tab.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  bar: {
    flexDirection: 'row',
    borderRadius: radius.xxl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    ...shadows.medium,
    overflow: 'hidden',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  iconWrap: {
    padding: 6,
    borderRadius: 12,
  },
  label: {
    ...type.small,
    fontWeight: '500',
  },
});