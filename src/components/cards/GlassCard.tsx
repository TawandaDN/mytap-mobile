import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '../../theme/ThemeContext';
import { useSkin } from '../../theme/SkinContext';
import { shadows } from '../../theme';
import { WaterBubble } from '../animations/WaterBubble';

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
  solid = false,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  blur?: number;
  bubble?: boolean;
  bubbleColor?: string;
  bubbleStrength?: number;
  onLayout?: (e: any) => void;
  /** Opaque surface — for dense, highly scannable lists. */
  solid?: boolean;
}) {
  const { theme } = useTheme();
  const { skin } = useSkin();

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