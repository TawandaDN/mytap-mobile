import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { haptics } from '../../utils/haptics';

/**
 * Card hover — a subtle 2px vertical lift with a slight shadow intensification.
 * No tilting, no spin, no 3D rotation. 300ms ease-out.
 */
export function TiltCard({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: object;
  onPress?: () => void;
}) {
  const lift = useSharedValue(0);
  const shadow = useSharedValue(0);
  const width = useRef(1);

  const pan = Gesture.Pan()
    .onBegin(() => {
      haptics.soft();
      lift.value = withTiming(-2, { duration: 300, easing: Easing.out(Easing.cubic) });
      shadow.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
    })
    .onEnd(() => {
      lift.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
      shadow.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    });

  const tap = Gesture.Tap().onEnd(() => {
    onPress?.();
  });

  const composed = Gesture.Simultaneous(pan, tap);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value }],
    shadowOpacity: 0.1 + shadow.value * 0.12,
    shadowRadius: 16 + shadow.value * 8,
    elevation: 4 + shadow.value * 4,
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View
        style={[styles.wrap, cardStyle, style]}
        onLayout={(e) => {
          width.current = e.nativeEvent.layout.width;
        }}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    shadowColor: '#0F1729',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
});