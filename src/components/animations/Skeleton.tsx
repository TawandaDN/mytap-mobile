import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle, DimensionValue } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';

/**
 * Skeleton loading block with a 2s shimmer sweep.
 */
export function Skeleton({
  width = '100%',
  height = 16,
  radius = 12,
  style,
}: {
  width?: DimensionValue;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();
  const x = useSharedValue(-1);

  useEffect(() => {
    x.value = withRepeat(
      withTiming(1.5, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );
  }, [x]);

  const shimmer = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value * 200 }],
  }));

  return (
    <View
      style={[
        styles.base,
        { width, height, borderRadius: radius, backgroundColor: theme.surfaceAlt },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, shimmer]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.5)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});