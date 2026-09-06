import React, { useEffect } from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { haptics } from '../../utils/haptics';

/**
 * Pressable with spring scale-down feedback and haptic on press-in.
 * Drop-in replacement for Pressable to give every tap a premium feel.
 */
export function PressableScale({
  children,
  style,
  onPressIn,
  onPressOut,
  onPress,
  scaleTo = 0.94,
  haptic = 'pressIn',
  ...rest
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onPress?: () => void;
  scaleTo?: number;
  haptic?: 'pressIn' | 'light' | 'medium' | 'none';
} & Omit<PressableProps, 'style' | 'onPressIn' | 'onPressOut' | 'onPress'>) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        {...rest}
        onPressIn={() => {
          scale.value = withTiming(scaleTo, { duration: 300, easing: Easing.out(Easing.cubic) });
          if (haptic === 'pressIn') haptics.pressIn();
          else if (haptic === 'light') haptics.light();
          else if (haptic === 'medium') haptics.medium();
          onPressIn?.();
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
          haptics.pressOut();
          onPressOut?.();
        }}
        onPress={onPress}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}

export const styles = StyleSheet.create({});