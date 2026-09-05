import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { springConfig } from '../../theme';
import { haptics } from '../../utils/haptics';

export function TiltCard({ children, style, maxTilt = 5, onPress }: { children: React.ReactNode; style?: object; maxTilt?: number; onPress?: () => void }) {
  const rx = useSharedValue(0);
  const ry = useSharedValue(0);
  const hx = useSharedValue(0.5);
  const hy = useSharedValue(0.3);
  const width = useRef(1);
  const pan = Gesture.Pan()
    .onBegin(() => { haptics.tilt(); })
    .onUpdate((e) => {
      const nx = e.x / width.current;
      const ny = e.y / 200;
      ry.value = interpolate(nx, [0, 1], [-maxTilt, maxTilt]);
      rx.value = interpolate(ny, [0, 1], [maxTilt, -maxTilt]);
      hx.value = nx;
      hy.value = ny;
    })
    .onEnd(() => { rx.value = withSpring(0, springConfig); ry.value = withSpring(0, springConfig); });
  const tap = Gesture.Tap().onEnd(() => { onPress?.(); });
  const composed = Gesture.Simultaneous(pan, tap);
  const cardStyle = useAnimatedStyle(() => ({ transform: [{ perspective: 1000 }, { rotateX: `${rx.value}deg` }, { rotateY: `${ry.value}deg` }] }));
  const highlightStyle = useAnimatedStyle(() => ({ transform: [{ translateX: (hx.value - 0.5) * 120 }, { translateY: (hy.value - 0.5) * 120 }], opacity: 0.5 }));
  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[styles.wrap, cardStyle, style]} onLayout={(e) => { width.current = e.nativeEvent.layout.width; }}>
        {children}
        <Animated.View pointerEvents="none" style={[styles.highlight, highlightStyle]} />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  highlight: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.18)', top: -40, left: -40 },
});