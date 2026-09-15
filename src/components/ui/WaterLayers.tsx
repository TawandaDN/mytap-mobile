import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { radii } from '../../theme/tokens';

/**
 * The three-layer water bubble.
 *
 * Applied to every interactive surface so glass feels wet, not flat:
 *   1. a radial highlight that follows the touch — a droplet on glass
 *   2. an endless 6s shimmer sweeping the surface
 *   3. a 1px white border highlight catching the light on the top edge
 *
 * Kept deliberately faint. If it reads as a visible effect, it is too strong.
 */

/** Falloff rings approximating a radial gradient on the UI thread. */
const RINGS = 10;

function Droplet({ size, strength }: { size: number; strength: number }) {
  const rings: React.ReactNode[] = [];
  for (let i = 0; i < RINGS; i += 1) {
    const t = i / RINGS;
    const diameter = size * (1 - t * 0.9);
    const opacity = strength * 0.1 * (1 - t) * (1 - t);
    rings.push(
      <View
        key={i}
        style={[
          styles.ring,
          {
            width: diameter,
            height: diameter,
            borderRadius: diameter / 2,
            backgroundColor: `rgba(255,255,255,${opacity.toFixed(4)})`,
          },
        ]}
      />
    );
  }
  return <>{rings}</>;
}

/**
 * Touch-following droplet. `x`/`y` are shared values in surface coordinates;
 * `active` is 0..1. Falls back to the resting offset (0.3, -0.2) when idle.
 */
export function TouchDroplet({
  x,
  y,
  active,
  size,
  radius = radii.card,
  strength = 1,
}: {
  x: SharedValue<number>;
  y: SharedValue<number>;
  active: SharedValue<number>;
  size: number;
  radius?: number;
  strength?: number;
}) {
  const style = useAnimatedStyle(() => ({
    opacity: active.value * strength,
    transform: [
      { translateX: x.value - size / 2 },
      { translateY: y.value - size / 2 },
    ],
  }));

  return (
    <View style={[styles.clip, { borderRadius: radius }]} pointerEvents="none">
      <Animated.View style={[styles.droplet, { width: size, height: size }, style]}>
        <Droplet size={size} strength={strength} />
      </Animated.View>
    </View>
  );
}

/** Layer 2 — the 6s linear shimmer sweep. */
export function ShimmerLayer({ radius = radii.card }: { radius?: number }) {
  const travel = useSharedValue(0);

  useEffect(() => {
    travel.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );
  }, [travel]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: -260 + travel.value * 520 }],
  }));

  return (
    <View style={[styles.clip, { borderRadius: radius }]} pointerEvents="none">
      <Animated.View style={[styles.shimmer, style]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.03)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

/** Layer 3 — the 1px white border highlight. */
export function BorderHighlight({ radius = radii.card }: { radius?: number }) {
  return (
    <View
      style={[styles.border, { borderRadius: radius }]}
      pointerEvents="none"
    />
  );
}

const FILL = { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 } as const;

const styles = StyleSheet.create({
  clip: {
    ...FILL,
    overflow: 'hidden',
  },
  droplet: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
  },
  shimmer: {
    position: 'absolute',
    top: -80,
    bottom: -80,
    width: 200,
  },
  border: {
    ...FILL,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
});
