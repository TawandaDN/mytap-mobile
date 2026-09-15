import React, { useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { easeOut, ENTER_SCALE, timing } from './motion';

/**
 * Staggered entry — a calm crossfade + 0.98 → 1.0 scale, ease-out.
 * No bounce, no overshoot: content simply arrives.
 */
export function StaggeredItem({
  index = 0,
  children,
  style,
  delay,
}: {
  index?: number;
  children: React.ReactNode;
  style?: ViewStyle;
  /** Override the computed stagger delay (ms). */
  delay?: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay ?? index * 100,
      withTiming(1, timing.fade)
    );
  }, [index, delay, progress]);

  const styleAnim = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: ENTER_SCALE + progress.value * (1 - ENTER_SCALE) }],
  }));

  return <Animated.View style={[styles.item, style, styleAnim]}>{children}</Animated.View>;
}

/**
 * Fade-in wrapper for a single element (no stagger, no movement).
 * 300ms ease-out per the entry/exit spec.
 */
export function FadeIn({
  children,
  style,
  delay = 0,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(delay, withTiming(1, { duration: 300, easing: easeOut }));
  }, [delay, progress]);

  const anim = useAnimatedStyle(() => ({ opacity: progress.value }));

  return <Animated.View style={[style, anim]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  item: {
    width: '100%',
  },
});
