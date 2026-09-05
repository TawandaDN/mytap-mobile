import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const COLORS = ['#FF6B4A', '#F5A623', '#2ECC71', '#3498DB', '#8A4A9A'];

/**
 * Confetti burst — a set of colored pieces that fly out and fall.
 */
export function Confetti({ active }: { active: boolean }) {
  const pieces = Array.from({ length: 24 });

  return (
    <View pointerEvents="none" style={styles.wrap}>
      {active && pieces.map((_, i) => <Piece key={i} index={i} />)}
    </View>
  );
}

function Piece({ index }: { index: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      index * 20,
      withTiming(1, { duration: 1200, easing: Easing.out(Easing.cubic) })
    );
  }, [index, progress]);

  const angle = (index / 24) * Math.PI * 2;
  const dist = 90 + (index % 5) * 20;
  const x = Math.cos(angle) * dist;
  const y = Math.sin(angle) * dist - 40;
  const color = COLORS[index % COLORS.length];

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x * progress.value },
      { translateY: y * progress.value },
      { rotate: `${progress.value * 360}deg` },
    ],
    opacity: progress.value < 0.7 ? 1 : 1 - (progress.value - 0.7) / 0.3,
  }));

  return (
    <Animated.View
      style={[
        styles.piece,
        { backgroundColor: color, left: '50%', top: '40%' },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  wrap: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  piece: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 2,
  },
});