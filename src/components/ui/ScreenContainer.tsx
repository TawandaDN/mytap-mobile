import React from 'react';
import { RefreshControl, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { spacing } from '../../theme';
import { MeshBackdrop } from '../animations/MeshBackdrop';
import { ENTER_SCALE, timing } from '../animations/motion';

/**
 * Screen container.
 *
 * Safe area + layered animated backdrop + the canonical screen transition:
 * a crossfade with scale 0.98 → 1.0 over 300ms ease-out. No pop, no bounce,
 * no slide-from-bottom.
 */
export function ScreenContainer({
  children,
  scroll = true,
  onRefresh,
  refreshing = false,
  style,
  contentContainerStyle,
  edges = ['top', 'bottom'],
  /** Renders the layered gradient backdrop behind the content. */
  backdrop = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  backdrop?: boolean;
}) {
  const { theme } = useTheme();
  const entry = useSharedValue(0);

  React.useEffect(() => {
    entry.value = withTiming(1, timing.fade);
  }, [entry]);

  const entryStyle = useAnimatedStyle(() => ({
    opacity: entry.value,
    transform: [{ scale: ENTER_SCALE + entry.value * (1 - ENTER_SCALE) }],
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
    <Animated.View style={[styles.content, entryStyle, contentContainerStyle]}>{children}</Animated.View>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.safe, { backgroundColor: theme.background }, style]}
    >
      {backdrop && <MeshBackdrop />}
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
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
    paddingBottom: 132,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});
