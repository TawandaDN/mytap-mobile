import React, { useEffect } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * Animated number count-up / count-down (400ms ease-out).
 * Optionally glows emerald or coral while animating.
 */
export function CountUp({
  value,
  format = (v: number) => String(Math.round(v)),
  duration = 400,
  glow,
  style,
}: {
  value: number;
  format?: (v: number) => string;
  duration?: number;
  glow?: 'emerald' | 'coral' | 'gold';
  style?: TextStyle;
}) {
  const progress = useSharedValue(0);
  const [display, setDisplay] = React.useState(0);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration, easing: Easing.out(Easing.cubic) });
    const id = setInterval(() => {
      setDisplay(value * progress.value);
    }, 16);
    return () => clearInterval(id);
  }, [value, duration, progress]);

  const glowColor =
    glow === 'emerald' ? '#2ECC71' : glow === 'coral' ? '#FF6B4A' : glow === 'gold' ? '#F5A623' : 'transparent';

  const glowStyle = useAnimatedStyle(() => ({
    textShadowColor: glowColor,
    textShadowRadius: progress.value * 12,
    textShadowOffset: { width: 0, height: 0 },
  }));

  return (
    <Animated.Text style={[styles.text, style, glowStyle]}>
      {format(display)}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontVariant: ['tabular-nums'],
  },
});