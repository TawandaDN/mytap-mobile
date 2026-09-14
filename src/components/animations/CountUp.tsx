import React, { useEffect, useRef, useState } from 'react';
import { StyleProp, StyleSheet, TextStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { easeOut } from './motion';

/**
 * Animated number transition.
 *
 * A smooth number transition that LANDS PRECISELY — it never overshoots and
 * never spins past the target. Driven by a shared value so the interpolation
 * runs on the UI thread, with a throttled text commit for legibility.
 *
 * Default 400ms ease-out (the balance spec).
 */
export function CountUp({
  value,
  format = (v: number) => String(Math.round(v)),
  duration = 400,
  glow,
  style,
  /** Commit the rendered text at most this often (ms). */
  step = 16,
}: {
  value: number;
  format?: (v: number) => string;
  duration?: number;
  glow?: 'emerald' | 'coral' | 'gold' | 'none';
  style?: StyleProp<TextStyle>;
  step?: number;
}) {
  const progress = useSharedValue(0);
  const [display, setDisplay] = useState(value);
  const mounted = useRef(false);
  const frame = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    progress.value = 0;
    progress.value = withTiming(1, { duration, easing: easeOut });

    // Interpolate from the previous value so updates read as a transition,
    // not a jump. The curve is ease-out, so it settles exactly on target.
    const from = mounted.current ? display : 0;
    mounted.current = true;

    if (frame.current) clearInterval(frame.current);
    frame.current = setInterval(() => {
      const p = progress.value;
      setDisplay(from + (value - from) * p);
    }, step);

    return () => {
      if (frame.current) clearInterval(frame.current);
    };
    // `display` is intentionally excluded — it is the interpolation source.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration, progress, step]);

  const glowColor =
    glow === 'emerald'
      ? '#2ECC71'
      : glow === 'coral'
      ? '#FF6B4A'
      : glow === 'gold'
      ? '#F5A623'
      : 'transparent';

  const glowStyle = useAnimatedStyle(() => ({
    textShadowColor: glowColor,
    textShadowRadius: progress.value * 10,
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
