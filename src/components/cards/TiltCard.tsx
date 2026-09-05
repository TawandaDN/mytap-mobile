import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { spring } from '../../theme';

/**
 * 3D card tilt on touch — rotates 3-5deg and moves a water bubble highlight
 * to follow the touch point.
 */
export function TiltCard({
  children,
  style,
  maxTilt = 4,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  maxTilt?: number;
}) {
  const rx = useSharedValue(0);
  const ry = useSharedValue(0);
  const hx = useSharedValue(50);
  const hy = useSharedValue(50);

  const onGesture = (e: PanGestureHandlerGestureEvent) => {
    const { x, y, width, height } = e.nativeEvent;
    const px = x / width;
    const py = y / height;
    ry.value = (px - 0.5) * 2 * maxTilt;
    rx.value = (0.5 - py) * 2 * maxTilt;
    hx.value = px * 100;
    hy.value = py * 100;
  };

  const onEnd = () => {
    rx.value = withSpring(0, spring);
    ry.value = withSpring(0, spring);
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateX: `${rx.value}deg` },
      { rotateY: `${ry.value}deg` },
    ],
  }));

  const highlightStyle = useAnimatedStyle(() => ({
    left: `${hx.value}%`,
    top: `${hy.value}%`,
  }));

  return (
    <PanGestureHandler onGestureEvent={onGesture} onEnded={onEnd}>
      <Animated.View style={[styles.wrap, style, cardStyle]}>
        {children}
        <Animated.View pointerEvents="none" style={[styles.highlight, highlightStyle]} />
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  highlight: {
    position: 'absolute',
    width: 120,
    height: 120,
    marginLeft: -60,
    marginTop: -60,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
});