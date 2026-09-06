import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { radius, shadows } from '../../theme';
import { WaterBubble } from '../animations/WaterBubble';
import { haptics } from '../../utils/haptics';

/**
 * Glassmorphism card — translucent frosted surface with a soft border,
 * water bubble highlight, a subtle shadow, and spring press feedback.
 */
export function GlassCard({
  children,
  style,
  blur = 20,
  bubble = true,
  bubbleColor = 'rgba(255,255,255,0.16)',
  onLayout,
  onPress,
  pressable = false,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  blur?: number;
  bubble?: boolean;
  bubbleColor?: string;
  onLayout?: (e: any) => void;
  onPress?: () => void;
  pressable?: boolean;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!pressable) return;
    scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
  }, [pressable, scale]);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const content = (
    <>
      <BlurView intensity={blur} tint="light" style={StyleSheet.absoluteFill} />
      {bubble && <WaterBubble color={bubbleColor} />}
      <View style={styles.content}>{children}</View>
    </>
  );

  const cardStyle = [
    styles.card,
    {
      backgroundColor: theme.glassBg,
      borderColor: theme.glassBorder,
      shadowColor: theme.glassShadow,
    },
    style,
  ];

  if (pressable) {
    return (
      <Pressable
        onLayout={onLayout}
        onPressIn={() => {
          scale.value = withTiming(0.97, { duration: 300, easing: Easing.out(Easing.cubic) });
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
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.soft,
  },
  content: {
    padding: 16,
  },
});