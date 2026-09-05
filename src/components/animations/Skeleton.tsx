import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/**
 * Skeleton loading block with a 2s shimmer sweep.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  radius = 8,
  style,
}: {
  width?: number | string;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [progress]);

  const shimmer = useAnimatedStyle(() => ({
    transform: [{ translateX: -200 + progress.value * 400 }],
  }));

  return (
    <View style={[styles.base, { width, height, borderRadius: radius }, style]}>
      <Animated.View style={[styles.sweep, shimmer]} />
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'rgba(15,23,41,0.08)',
    overflow: 'hidden',
  },
  sweep: {
    width: 200,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});