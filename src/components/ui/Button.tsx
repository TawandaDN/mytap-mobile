import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { radius, shadows, spacing, type } from '../../theme';
import { haptics } from '../../utils/haptics';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';

/**
 * MyTap button.
 * `primary` — rich deep forest green with modern layered depth.
 * `gold`    — polished metallic matte gold (not mud-yellow).
 * Full-width pill by default, anchored comfortably to the bottom.
 */
export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  icon,
  fullWidth = false,
}: {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const pressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (disabled || loading) return;
    haptics.medium();
    onPress?.();
  };

  /** Rich, solid brand tones with subtle modern depth. */
  const gradientColors: Record<Variant, readonly [string, string, string]> = {
    // deep forest green → deeper green (primary interactive + success)
    primary: ['#12946E', theme.primary, theme.primaryDeep],
    secondary: [...theme.accentGradient],
    // polished metallic matte gold
    gold: [...theme.goldGradient],
    danger: ['#E5604A', '#D92D20', '#9B1C16'],
    ghost: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.04)'],
  };

  const textColor =
    variant === 'ghost' ? theme.text : variant === 'gold' ? '#3A2A06' : '#FFFFFF';

  return (
    <Animated.View
      style={[styles.wrap, fullWidth && styles.fullWidth, disabled && styles.disabled, style, pressStyle]}
    >
      <Pressable
        onPressIn={() => {
          if (disabled || loading) return;
          scale.value = withTiming(0.975, { duration: 300, easing: Easing.out(Easing.cubic) });
          haptics.pressIn();
        }}
        onPressOut={() => {
          scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
          haptics.pressOut();
        }}
        onPress={handlePress}
        disabled={disabled || loading}
      >
        <LinearGradient
          colors={gradientColors[variant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={styles.gradient}
        >
          {/* Modern depth: soft top highlight + bottom inner shade */}
          <View style={styles.topSheen} pointerEvents="none" />
          <View style={styles.bottomShade} pointerEvents="none" />
          {loading ? (
            <ActivityIndicator color={textColor} />
          ) : (
            <>
              {icon}
              <Text style={[styles.label, { color: textColor }]}>{title}</Text>
            </>
          )}
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.pill,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    ...shadows.soft,
  },
  fullWidth: {
    alignSelf: 'stretch',
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
  topSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  bottomShade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  label: {
    ...type.subheading,
    fontWeight: '600',
  },
});
