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
import { WaterBubble } from '../animations/WaterBubble';
import { haptics } from '../../utils/haptics';

/**
 * Glassmorphism surface — translucent frosted panel with a hairline border
 * that makes white containers pop cleanly off the warm cream canvas.
 * Strict 18px radius, layered drop shadow, skin texture + sheen for depth.
 */
export function GlassCard({
  children,
  style,
  blur = 26,
  bubble = true,
  bubbleColor = 'rgba(255,255,255,0.16)',
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
  onLayout?: (e: any) => void;
  onPress?: () => void;
  pressable?: boolean;
  /** Solid surface (no blur) — for dense, highly scannable lists. */
  solid?: boolean;
}) {
  const { theme } = useTheme();
  const { skin } = useSkin();
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const content = (
    <>
      {solid ? (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.surface }]} />
      ) : (
        <BlurView intensity={blur} tint="light" style={StyleSheet.absoluteFill} />
      )}
      {/* Skin material: texture + brushed sheen + top inner highlight */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: solid ? 'transparent' : skin.texture }]} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: solid ? 'transparent' : skin.sheen }]} />
      <View style={[styles.topHighlight, { backgroundColor: solid ? 'rgba(255,255,255,0.0)' : skin.highlight }]} />
      {bubble && <WaterBubble color={bubbleColor} />}
      <View style={styles.content}>{children}</View>
    </>
  );

  const depth = skin.shadowDepth;
  const cardStyle = [
    styles.card,
    {
      borderRadius: theme.cardRadius,
      backgroundColor: solid ? theme.surface : theme.glassBg,
      borderColor: theme.hairline,
      shadowColor: theme.glassShadow,
      shadowOpacity: 0.09 * depth,
      shadowRadius: 15 * depth,
      shadowOffset: { width: 0, height: 6 * depth },
      elevation: 3 * depth,
    },
    style,
  ];

  if (pressable) {
    return (
      <Pressable
        onLayout={onLayout}
        onPressIn={() => {
          scale.value = withTiming(0.985, { duration: 300, easing: Easing.out(Easing.cubic) });
          haptics.pressIn();
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
          haptics.pressOut();
        }}
        onPress={onPress}
        style={cardStyle}
      >
        <Animated.View style={[StyleSheet.absoluteFill, pressStyle]}>{content}</Animated.View>
      </Pressable>
    );
  }

  return (
    <View onLayout={onLayout} style={cardStyle}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.soft,
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
