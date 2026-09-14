import React from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { haptics } from '../../utils/haptics';
import { useWaterBubble, WaterBubbleLayer } from '../animations/WaterBubble';

/**
 * MyTap pressable surface.
 *
 * Every tappable element gets:
 *  · a subtle press-scale (ease-out, zero bounce)
 *  · a touch-following water droplet highlight
 *  · a ripple-free haptic on press-in
 *
 * Drop-in replacement for Pressable.
 */
export function PressableScale({
  children,
  style,
  onPressIn,
  onPressOut,
  onPress,
  scaleTo = 0.94,
  haptic = 'pressIn',
  bubble = true,
  bubbleStrength = 1,
  disabled = false,
  ...rest
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onPress?: () => void;
  scaleTo?: number;
  haptic?: 'pressIn' | 'light' | 'medium' | 'none';
  /** Touch-following water droplet highlight. */
  bubble?: boolean;
  bubbleStrength?: number;
} & Omit<PressableProps, 'style' | 'onPressIn' | 'onPressOut' | 'onPress' | 'children'>) {
  const scale = useSharedValue(1);
  const droplet = useWaterBubble();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} onLayout={bubble ? droplet.onLayout : undefined}>
      <Pressable
        {...rest}
        disabled={disabled}
        onPressIn={(e) => {
          // eslint-disable-next-line react-hooks/immutability
          scale.value = withTiming(scaleTo, { duration: 300, easing: Easing.out(Easing.cubic) });
          if (haptic === 'pressIn') haptics.pressIn();
          else if (haptic === 'light') haptics.light();
          else if (haptic === 'medium') haptics.medium();
          if (bubble) droplet.onPressIn(e);
          onPressIn?.();
        }}
        onPressOut={() => {
          // eslint-disable-next-line react-hooks/immutability
          scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
          haptics.pressOut();
          if (bubble) droplet.onPressOut();
          onPressOut?.();
        }}
        onPress={onPress}
      >
        {bubble && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <WaterBubbleLayer
              x={droplet.x}
              y={droplet.y}
              active={droplet.active}
              width={droplet.width}
              height={droplet.height}
              strength={bubbleStrength}
            />
          </View>
        )}
        {children}
      </Pressable>
    </Animated.View>
  );
}

export const styles = StyleSheet.create({});