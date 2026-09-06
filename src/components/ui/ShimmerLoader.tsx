import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
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
 * Restrained loading indicator — a soft gradient shimmer sweeping across the surface.
 * No spinning spinners, no jumping dots. 6000ms linear.
 */
export function ShimmerLoader({
  size = 120,
  style,
}: {
  size?: number;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();
  const x = useSharedValue(-1);

  useEffect(() => {
    x.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );
  }, [x]);

  const shimmer = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value * size * 2 }],
  }));

  return (
    <View
      style={[
        styles.loader,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.surfaceAlt,
        },
        style,
      ]}
    >
      <Animated.View style={[StyleSheet.absoluteFill, shimmer]}>
        <LinearGradient
          colors={['transparent', `${theme.accent}33`, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    overflow: 'hidden',
  },
});