import React from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { WATER_BUBBLE } from '../../theme';

/**
 * Water bubble — the signature interaction.
 *
 * A soft radial highlight that rests at ~(0.3, -0.2) of the surface and
 * FOLLOWS THE TOUCH POSITION as the finger moves: the feeling of a water
 * droplet sliding across glass. Organic, alive, premium.
 *
 * The falloff is composed from concentric circles, so the highlight is pure
 * translate + opacity (GPU only) — no per-frame React render.
 */

/** Concentric rings used to approximate the radial gradient. */
const STEPS = 12;
/** Peak white opacity at the centre of the droplet. */
const PEAK = WATER_BUBBLE.opacity * 1.6;
/** Resting highlight position, as a fraction of the surface. */
const REST_X = 0.3;
const REST_Y = -0.2;

function rings(diameter: number) {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < STEPS; i += 1) {
    const t = i / STEPS;
    const size = diameter * (1 - t * 0.92);
    // Quadratic falloff from the centre outward reads as a true radial ramp.
    const opacity = PEAK * (1 - t) * (1 - t);
    out.push(
      <View
        key={i}
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: `rgba(255,255,255,${opacity.toFixed(4)})`,
          },
        ]}
      />
    );
  }
  return out;
}

/** The droplet layer, absolutely-filled inside a pressable surface. */
export function WaterBubbleLayer({
  x,
  y,
  active,
  width,
  height,
  strength = 1,
}: {
  x: SharedValue<number>;
  y: SharedValue<number>;
  active: SharedValue<number>;
  width: number;
  height: number;
  /** Scales the droplet opacity — use < 1 for large surfaces. */
  strength?: number;
}) {
  const diameter = Math.max(width, height) * WATER_BUBBLE.radius * 2;

  const style = useAnimatedStyle(() => ({
    opacity: active.value * strength,
    transform: [{ translateX: x.value - diameter / 2 }, { translateY: y.value - diameter / 2 }],
  }));

  if (diameter <= 0) return null;

  return (
    <Animated.View pointerEvents="none" style={[styles.layer, { width: diameter, height: diameter }, style]}>
      {rings(diameter)}
    </Animated.View>
  );
}

/**
 * Drop-in hook for any pressable surface.
 *
 * Wire `onLayout` and the touch handlers onto the surface, render
 * `<WaterBubbleLayer {...bubble} />` inside an absolutely-filled child, and
 * the droplet rests at the standard highlight offset and follows the finger.
 */
export function useWaterBubble() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const active = useSharedValue(0);
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  const box = React.useRef({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    box.current = { width, height };
    setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
    if (active.value === 0) {
      x.value = width * (0.5 + REST_X);
      y.value = height * (0.5 + REST_Y);
    }
  };

  const onPressIn = (e?: any) => {
    const { locationX, locationY } = e?.nativeEvent ?? {};
    const { width, height } = box.current;
    x.value = typeof locationX === 'number' ? locationX : width * (0.5 + REST_X);
    y.value = typeof locationY === 'number' ? locationY : height * (0.5 + REST_Y);
    // Fluid water — a calm ease-out swell, never a bounce.
    active.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
  };

  const onPressOut = () => {
    active.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
  };

  return { x, y, active, width: size.width, height: size.height, onLayout, onPressIn, onPressOut };
}

export type WaterBubbleState = ReturnType<typeof useWaterBubble>;

/**
 * Ambient water sheen — a calm, slowly drifting highlight for glass panels
 * where there is no touch to follow. Linear drift, never springy.
 */
export function WaterBubble({
  size = 220,
  color = 'rgba(255,255,255,0.1)',
  duration = 6000,
  style,
}: {
  size?: number;
  color?: string;
  duration?: number;
  style?: object;
}) {
  const drift = useSharedValue(0);

  React.useEffect(() => {
    drift.value = withTiming(1, { duration, easing: Easing.linear });
  }, [duration, drift]);

  const shellStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -60 + drift.value * 120 }, { translateY: -20 + drift.value * 40 }],
  }));

  return (
    <View style={[StyleSheet.absoluteFill, styles.clip, style]} pointerEvents="none">
      <Animated.View
        style={[
          styles.ambient,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
          shellStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
  clip: {
    overflow: 'hidden',
  },
  ambient: {
    position: 'absolute',
    top: -30,
    left: -30,
  },
});
