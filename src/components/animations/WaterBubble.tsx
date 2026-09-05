import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

/**
 * Water bubble effect — a radial highlight that shimmers on a 6s loop.
 * Used on cards and buttons for the signature MyTap look.
 */
export function WaterBubble({
  color = 'rgba(255,255,255,0.18)',
  size = 220,
  top = -60,
  left = -40,
  duration = 6000,
}: {
  color?: string;
  size?: number;
  top?: number;
  left?: number;
  duration?: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration }),
      -1,
      false
    );
  }, [progress, duration]);

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      transform: [
        { translateX: Math.sin(p * Math.PI * 2) * 14 },
        { translateY: Math.cos(p * Math.PI * 2) * 10 },
        { scale: 1 + Math.sin(p * Math.PI * 2) * 0.08 },
      ],
      opacity: 0.5 + Math.sin(p * Math.PI * 2) * 0.3,
    };
  });

  return (
    <View pointerEvents="none" style={[styles.wrap, { top, left }]}>
      <Animated.View
        style={[
          styles.bubble,
          { width: size, height: size, backgroundColor: color },
          style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
  },
  bubble: {
    borderRadius: 999,
  },
});
