import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export function WaterBubble({ size = 220, color = 'rgba(255,255,255,0.18)', duration = 6000, style }: { size?: number; color?: string; duration?: number; style?: object }) {
  const x = useSharedValue(-0.4);
  const y = useSharedValue(-0.3);
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0.5);
  const hue = useSharedValue(0);
  useEffect(() => {
    x.value = withRepeat(withTiming(1.4, { duration, easing: Easing.inOut(Easing.sin) }), -1, false);
    y.value = withRepeat(withTiming(1.2, { duration: duration * 1.3, easing: Easing.inOut(Easing.sin) }), -1, true);
    scale.value = withRepeat(withTiming(1.15, { duration: duration / 2, easing: Easing.inOut(Easing.sin) }), -1, true);
    opacity.value = withRepeat(withTiming(0.85, { duration: duration / 2, easing: Easing.inOut(Easing.sin) }), -1, true);
    hue.value = withRepeat(withTiming(1, { duration: duration, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [duration, x, y, scale, opacity, hue]);
  const glowStyle = useAnimatedStyle(() => ({ transform: [{ translateX: x.value * 300 }, { translateY: y.value * 200 }, { scale: scale.value }], opacity: opacity.value }));
  const shimmerStyle = useAnimatedStyle(() => ({ transform: [{ translateX: hue.value * 60 }], opacity: 0.3 + hue.value * 0.3 }));
  return (
    <View style={[StyleSheet.absoluteFill, styles.container, style]} pointerEvents="none">
      <Animated.View style={[styles.bubble, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }, glowStyle]} />
      <Animated.View style={[styles.shimmer, { width: size * 0.6, height: size * 0.4 }, shimmerStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
  bubble: { position: 'absolute', top: -40, left: -40 },
  shimmer: { position: 'absolute', top: '20%', left: '10%', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.12)', transform: [{ rotate: '-20deg' }] },
});