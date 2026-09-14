import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { useSkin } from '../../theme/SkinContext';
import { shadows } from '../../theme';
import { WaterBubble, WaterBubbleLayer, useWaterBubble } from '../animations/WaterBubble';
import { haptics } from '../../utils/haptics';

/**
 * Glassmorphism surface.
 *
 * Translucent frosted panel (BlurView) floating on the layered gradient
 * canvas with a faint 1px hairline border, layered drop shadow, skin texture
 * and a touch-following water droplet. Strict 18px radius, 16px padding.
 */
export function GlassCard({
  children,
  style,
  blur = 26,
  bubble = true,
  bubbleColor = 'rgba(255,255,255,0.12)',
  /** Scales the water droplet's opacity — use < 1 on large surfaces. */
  bubbleStrength = 1,
  onLayout,
  onPress,
  pressable = false,
  solid = false,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  blur?: number;
  bubble?: boolean;
  bubbleColor?: string;
  bubbleStrength?: number;
  onLayout?: (e: any) => void;
  onPress?: () => void;
  pressable?: boolean;
  /** Opaque surface — for dense, highly scannable lists. */
  solid?: boolean;
}) {
  const { theme } = useTheme();
  const { skin } = useSkin();
  const scale = useSharedValue(1);
  const droplet = useWaterBubble();

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const depth = skin.shadowDepth;

  const material = (
    <>
      {solid ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.surface }]} />
      ) : (
        <BlurView intensity={blur} tint="light" style={StyleSheet.absoluteFill} />
      )}
      {/* Skin material: texture + brushed sheen + top inner highlight */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: solid ? 'transparent' : skin.texture }]} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: solid ? 'transparent' : skin.sheen }]} />
      <View style={[styles.topHighlight, { backgroundColor: solid ? 'transparent' : skin.highlight }]} />
      {bubble && <WaterBubble color={bubbleColor} />}
      {pressable && (
        <WaterBubbleLayer
          x={droplet.x}
          y={droplet.y}
          active={droplet.active}
          width={droplet.width}
          height={droplet.height}
          strength={bubbleStrength}
        />
      )}
    </>
  );

  const cardStyle = [
    styles.card,
    {
      borderRadius: theme.cardRadius,
      backgroundColor: solid ? theme.surface : theme.glassBg,
      borderColor: theme.hairline,
      shadowColor: theme.glassShadow,
      shadowOpacity: 0.09 * depth,
      shadowRadius: 18 * depth,
      shadowOffset: { width: 0, height: 8 * depth },
      elevation: Math.round(4 * depth),
    },
    style,
  ];

  if (pressable) {
    return (
      <Animated.View
        onLayout={(e) => {
          droplet.onLayout(e);
          onLayout?.(e);
        }}
        style={cardStyle}
      >
        <Pressable
          onPressIn={(e) => {
            scale.value = withTiming(0.985, { duration: 300, easing: Easing.out(Easing.cubic) });
            droplet.onPressIn(e);
            haptics.pressIn();
          }}
          onPressOut={() => {
            scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
            droplet.onPressOut();
            haptics.pressOut();
          }}
          onPress={onPress}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={[StyleSheet.absoluteFill, pressStyle]} pointerEvents="none">
          {material}
        </Animated.View>
        <View style={styles.content} pointerEvents="none">
          {children}
        </View>
      </Animated.View>
    );
  }

  return (
    <View onLayout={onLayout} style={cardStyle}>
      {material}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.subtle,
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  content: {
    padding: 16,
  },
});
