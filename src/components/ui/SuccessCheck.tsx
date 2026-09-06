import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { haptics } from '../../utils/haptics';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * Payment success — a subtle green glow, a smooth checkmark draw, and a soft
 * haptic. No confetti, no fireworks. 800ms ease-out.
 */
export function SuccessCheck({ size = 80 }: { size?: number }) {
  const progress = useSharedValue(0);
  const r = size / 2;
  const circ = 2 * Math.PI * (r - 4);
  const checkLen = 44;

  useEffect(() => {
    progress.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });
    haptics.soft();
  }, [progress]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.12 + progress.value * 0.3,
    transform: [{ scale: 0.9 + progress.value * 0.1 }],
  }));

  const circleProps = useAnimatedProps(() => ({
    strokeDashoffset: circ * (1 - progress.value),
  }));

  const checkProps = useAnimatedProps(() => ({
    strokeDashoffset: checkLen * (1 - progress.value),
  }));

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Subtle green glow */}
      <Animated.View
        style={[
          styles.glow,
          { width: size, height: size, borderRadius: r, backgroundColor: '#2ECC71' },
          glowStyle,
        ]}
      />
      <Svg width={size} height={size}>
        <AnimatedCircle
          cx={r}
          cy={r}
          r={r - 4}
          stroke="#2ECC71"
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circ}
          animatedProps={circleProps}
          transform={`rotate(-90 ${r} ${r})`}
        />
        <AnimatedPath
          d="M 26 42 L 36 52 L 56 30"
          stroke="#2ECC71"
          strokeWidth={5}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={checkLen}
          animatedProps={checkProps}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
  },
});