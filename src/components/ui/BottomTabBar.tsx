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
import { useSkin } from '../../theme/SkinContext';
import { radius, shadows, spacing, type } from '../../theme';
import { haptics } from '../../utils/haptics';

export type TabKey = 'home' | 'savings' | 'assistant' | 'pay' | 'history';

const TABS: {
  key: TabKey;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { key: 'savings', label: 'Savings', icon: 'trending-up-outline', activeIcon: 'trending-up' },
  { key: 'assistant', label: 'Assistant', icon: 'sparkles-outline', activeIcon: 'sparkles' },
  { key: 'pay', label: 'Payments', icon: 'card-outline', activeIcon: 'card' },
  { key: 'history', label: 'History', icon: 'time-outline', activeIcon: 'time' },
];

/**
 * Sticky white bottom tab bar — 5 distinct icons with text labels, a sliding
 * indicator, icon morphing, and a light haptic on switch.
 */
export function BottomTabBar({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  const { theme } = useTheme();
  const { skin } = useSkin();
  const activeIndex = Math.max(0, TABS.findIndex((t) => t.key === active));
  const indicatorX = useSharedValue(activeIndex * (100 / TABS.length));

  useEffect(() => {
    indicatorX.value = withTiming(activeIndex * (100 / TABS.length), {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeIndex, indicatorX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${indicatorX.value}%` }],
  }));

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <BlurView intensity={60} tint="light" style={[styles.bar, { borderColor: theme.hairline }]}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.surface, opacity: 0.86 }]} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: skin.sheen }]} />
        {/* Sliding active indicator */}
        <Animated.View
          style={[styles.indicator, { backgroundColor: theme.indicator + '14' }, indicatorStyle]}
        />
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
  const iconScale = useSharedValue(active ? 1 : 0.88);
  const opacity = useSharedValue(active ? 1 : 0.55);

  useEffect(() => {
    iconScale.value = withTiming(active ? 1.04 : 0.88, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
    opacity.value = withTiming(active ? 1 : 0.55, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  }, [active, iconScale, opacity]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable
      style={styles.item}
      onPress={() => {
        haptics.tab();
        onPress();
      }}
    >
      <Animated.View style={iconStyle}>
        <Ionicons
          name={active ? tab.activeIcon : tab.icon}
          size={21}
          color={active ? theme.indicator : theme.textMuted}
        />
      </Animated.View>
      <Text
        style={[styles.label, { color: active ? theme.indicator : theme.textMuted }]}
        numberOfLines={1}
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
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  bar: {
    flexDirection: 'row',
    borderRadius: radius.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderWidth: 1,
    ...shadows.medium,
    overflow: 'hidden',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: spacing.sm,
    bottom: spacing.sm,
    width: `${100 / TABS.length}%`,
    borderRadius: radius.md,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
    zIndex: 1,
  },
  label: {
    ...type.small,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
});
