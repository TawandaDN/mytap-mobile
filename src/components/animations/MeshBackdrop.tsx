import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DeviceMotion } from 'expo-sensors';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { useSkin } from '../../theme/SkinContext';

/**
 * Multi-layered shifting gradient/mesh backdrop with device-tilt parallax.
 * Drifting gradient orbs + a subtle mesh grid, all reacting to device
 * orientation (expo-sensors DeviceMotion) and a slow continuous drift.
 * Gives every screen a living, depth-rich backdrop (never static).
 */
export function MeshBackdrop({
  children,
  intensity = 1,
}: {
  children?: React.ReactNode;
  intensity?: number;
}) {
  const { theme } = useTheme();
  const { skin } = useSkin();
  const drift = useSharedValue(0);
  const drift2 = useSharedValue(0);
  const drift3 = useSharedValue(0);
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);

  useEffect(() => {
    drift.value = withRepeat(withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.sin) }), -1, true);
    drift2.value = withRepeat(withTiming(1, { duration: 16000, easing: Easing.inOut(Easing.sin) }), -1, true);
    drift3.value = withRepeat(withTiming(1, { duration: 20000, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [drift, drift2, drift3]);

  // Device tilt parallax
  useEffect(() => {
    let sub: { remove: () => void } | null = null;
    DeviceMotion.isAvailableAsync()
      .then((avail) => {
        if (!avail) return;
        DeviceMotion.setUpdateInterval(100);
        sub = DeviceMotion.addListener((data) => {
          const { gamma, beta } = data.rotation || { gamma: 0, beta: 0 };
          tiltX.value = withTiming((gamma || 0) * 0.4, { duration: 200, easing: Easing.out(Easing.cubic) });
          tiltY.value = withTiming((beta || 0) * 0.4, { duration: 200, easing: Easing.out(Easing.cubic) });
        });
      })
      .catch(() => {});
    return () => {
      if (sub) sub.remove();
    };
  }, [tiltX, tiltY]);

  const orb1 = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift.value * 60 + tiltX.value * 20 },
      { translateY: drift.value * -40 + tiltY.value * 20 },
      { scale: 1 + drift.value * 0.15 },
    ],
  }));
  const orb2 = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift2.value * -50 - tiltX.value * 16 },
      { translateY: drift2.value * 50 - tiltY.value * 16 },
      { scale: 1 + drift2.value * 0.2 },
    ],
  }));
  const orb3 = useAnimatedStyle(() => ({
    transform: [
      { translateX: drift3.value * 40 + tiltX.value * 12 },
      { translateY: drift3.value * -30 + tiltY.value * 12 },
      { scale: 1 + drift3.value * 0.12 },
    ],
  }));

  const isDark = theme.mode === 'dark';
  const [g0, g1, g2] = theme.gradient;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={isDark ? [g0, g1, g2] : ['#F5F7FA', '#EEF1F6', '#E8ECF4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Drifting glow orbs */}
      <Animated.View style={[styles.orb, styles.orb1, orb1]}>
        <LinearGradient
          colors={isDark ? [`${theme.accent}55`, `${theme.accent2}22`] : [`${theme.accent}22`, `${theme.accent2}0D`]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View style={[styles.orb, styles.orb2, orb2]}>
        <LinearGradient
          colors={isDark ? ['rgba(46,204,113,0.18)', 'rgba(52,152,219,0.1)'] : ['rgba(46,204,113,0.1)', 'rgba(52,152,219,0.05)']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      <Animated.View style={[styles.orb, styles.orb3, orb3]}>
        <LinearGradient
          colors={isDark ? ['rgba(245,166,35,0.15)', 'rgba(255,107,74,0.08)'] : ['rgba(245,166,35,0.08)', 'rgba(255,107,74,0.04)']}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
      {/* Skin texture overlay */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: skin.texture }]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orb1: { width: 320, height: 320, top: -80, left: -60 },
  orb2: { width: 260, height: 260, bottom: 40, right: -60 },
  orb3: { width: 200, height: 200, top: '40%', left: '30%' },
});