import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

/**
 * Staggered entry animation — fades + slides up each child in sequence.
 */
export function StaggeredItem({
  index = 0,
  children,
  style,
}: {
  index?: number;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * 80,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
    );
  }, [index, progress]);

  const styleAnim = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 20 }],
  }));

  return (
    <Animated.View style={[styles.item, style, styleAnim]}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    width: '100%',
  },
});