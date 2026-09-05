import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { WaterBubble } from '../animations/WaterBubble';
import { radius, shadows } from '../../theme';

/**
 * Glassmorphism card — frosted translucent surface with a water bubble highlight.
 */
export function GlassCard({
  children,
  style,
  bubble = true,
  bubbleColor = 'rgba(255,255,255,0.18)',
  gradient,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  bubble?: boolean;
  bubbleColor?: string;
  gradient?: readonly [string, string, string];
}) {
  const inner = (
    <View style={[styles.card, style]}>
      {bubble && <WaterBubble color={bubbleColor} />}
      {children}
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.card, style]}>
        {bubble && <WaterBubble color={bubbleColor} />}
        {children}
      </LinearGradient>
    );
  }

  return inner;
}

const styles = StyleSheet.create({
  content: {
    borderRadius: radius.xxl,
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(15,23,41,0.08)',
    overflow: 'hidden',
    ...shadows.subtle,
  },
  gradient: {
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadows.medium,
  },
});