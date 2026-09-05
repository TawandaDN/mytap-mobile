import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import { radius, shadows, spacing, type } from '../../theme';
import { haptics } from '../../utils/haptics';
import { WaterBubble } from '../animations/WaterBubble';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';

/**
 * MyTap button with water bubble effect and spring press feedback.
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  icon,
}: {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}) {
  const { theme } = useTheme();

  const handlePress = () => {
    if (disabled || loading) return;
    haptics.medium();
    onPress?.();
  };

  const gradientColors: Record<Variant, readonly [string, string, string]> = {
    primary: ['#1E3A5F', '#2D3B6B', '#FF6B4A'],
    secondary: ['#2D3B6B', '#4A6A8A', '#F5A623'],
    gold: ['#F5A623', '#FFB84D', '#FF6B4A'],
    danger: ['#E74C3C', '#C0392B', '#8E44AD'],
    ghost: ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.1)'],
  };

  const textColor = variant === 'ghost' ? theme.text : '#FFFFFF';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[styles.wrap, disabled && styles.disabled, style]}
    >
      <LinearGradient
        colors={gradientColors[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <WaterBubble color="rgba(255,255,255,0.14)" size={120} />
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            {icon}
            <Text style={[styles.label, { color: textColor }]}>{title}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.pill,
    overflow: 'hidden',
    ...shadows.medium,
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    paddingVertical: 16,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    overflow: 'hidden',
  },
  label: {
    ...type.subheading,
    fontWeight: '600',
  },
});