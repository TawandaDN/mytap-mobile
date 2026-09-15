import React from 'react';
import { LayoutChangeEvent, Pressable, PressableProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { haptics } from '../../utils/haptics';
import { radii } from '../../theme/tokens';
import { BorderHighlight, ShimmerLayer, TouchDroplet } from './WaterLayers';

/**
 * MyTap pressable surface — every tappable element in the app.
 *
 * Carries all three water-bubble layers plus the canonical press physics:
 * scale to 0.98 over 100ms ease-out on press-in, back to 1.0 over 200ms on
 * release. A light haptic confirms the touch. No ripple, no spring.
 */
export function PressableScale({
  children,
  style,
  onPressIn,
  onPressOut,
  onPress,
  onLongPress,
  scaleTo = 0.98,
  pressInDuration = 100,
  pressOutDuration = 200,
  haptic = 'pressIn',
  bubble = true,
  bubbleStrength = 1,
  shimmer = false,
  border = false,
  disabled = false,
  radius = radii.card,
  ...rest
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onPress?: () => void;
  onLongPress?: () => void;
  scaleTo?: number;
  pressInDuration?: number;
  pressOutDuration?: number;
  haptic?: 'pressIn' | 'light' | 'medium' | 'heavy' | 'none';
  /** Touch-following droplet (layer 1). */
  bubble?: boolean;
  bubbleStrength?: number;
  /** Endless shimmer sweep (layer 2). */
  shimmer?: boolean;
  /** 1px border highlight (layer 3). */
  border?: boolean;
  radius?: number;
} & Omit<PressableProps, 'style' | 'onPressIn' | 'onPressOut' | 'onPress' | 'onLongPress' | 'children'>) {
  const scale = useSharedValue(1);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const active = useSharedValue(0);
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  const box = React.useRef({ w: 0, h: 0 });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    box.current = { w: width, h: height };
    setSize((prev) => (prev.w === width && prev.h === height ? prev : { w: width, h: height }));
    if (active.value === 0) {
      // Rest at the droplet's highlight offset (0.3, -0.2).
      x.value = width * 0.8;
      y.value = height * 0.3;
    }
  };

  const dropletSize = Math.max(size.w, size.h) * 1.2;

  return (
    <Animated.View style={[animStyle, style]} onLayout={bubble || shimmer ? onLayout : undefined}>
      <Pressable
        {...rest}
        disabled={disabled}
        onPressIn={(e) => {
          // eslint-disable-next-line react-hooks/immutability
          scale.value = withTiming(scaleTo, {
            duration: pressInDuration,
            easing: Easing.out(Easing.cubic),
          });
          if (haptic === 'pressIn') haptics.pressIn();
          else if (haptic === 'light') haptics.light();
          else if (haptic === 'medium') haptics.medium();
          else if (haptic === 'heavy') haptics.heavy();

          if (bubble) {
            const { locationX, locationY } = e.nativeEvent;
            x.value = typeof locationX === 'number' ? locationX : box.current.w * 0.8;
            y.value = typeof locationY === 'number' ? locationY : box.current.h * 0.3;
            active.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
          }
          onPressIn?.();
        }}
        onPressOut={() => {
          // eslint-disable-next-line react-hooks/immutability
          scale.value = withTiming(1, {
            duration: pressOutDuration,
            easing: Easing.out(Easing.cubic),
          });
          haptics.pressOut();
          if (bubble) {
            active.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
          }
          onPressOut?.();
        }}
        onPress={onPress}
        onLongPress={onLongPress}
      >
        {bubble && dropletSize > 0 && (
          <TouchDroplet
            x={x}
            y={y}
            active={active}
            size={dropletSize}
            radius={radius}
            strength={bubbleStrength}
          />
        )}
        {shimmer && <ShimmerLayer radius={radius} />}
        {border && <BorderHighlight radius={radius} />}
        {children}
      </Pressable>
    </Animated.View>
  );
}

export const styles = StyleSheet.create({});

/** Kept for callers that import the old name. */
export { PressableScale as PressableSurface };

/** Absolutely-filled helper for layering content above water effects. */
export function ContentLayer({ children }: { children: React.ReactNode }) {
  return <View style={StyleSheet.absoluteFill}>{children}</View>;
}
