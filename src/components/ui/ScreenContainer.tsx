import React, { useCallback, useRef, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { spacing } from '../../theme';
import { GlassSpinner } from './GlassSpinner';
import { AnimatedBackground } from '../animations/AnimatedBackground';

/**
 * Screen container with safe area, themed background, staggered entry,
 * and a custom glassmorphism pull-to-refresh spinner.
 */
export function ScreenContainer({
  children,
  scroll = true,
  onRefresh,
  refreshing = false,
  style,
  contentContainerStyle,
  edges = ['top', 'bottom'],
}: {
  children: React.ReactNode;
  scroll?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}) {
  const { theme } = useTheme();
  const entry = useSharedValue(0);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    entry.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [entry]);

  const entryStyle = useAnimatedStyle(() => ({
    opacity: entry.value,
    transform: [{ scale: 0.98 + entry.value * 0.02 }],
  }));

  const refreshControl = onRefresh ? (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor="transparent"
      colors={['transparent']}
      progressBackgroundColor="transparent"
      title=""
    />
  ) : undefined;

  const content = (
    <Animated.View style={[styles.content, entryStyle, contentContainerStyle]}>
      {children}
    </Animated.View>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.safe, { backgroundColor: theme.background }, style]}
    >
      <AnimatedBackground />
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={refreshControl}
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.flex}>{content}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});