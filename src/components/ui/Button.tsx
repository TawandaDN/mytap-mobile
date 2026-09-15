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
import { elevation, inter, radii, space } from '../../theme/tokens';
import { haptics } from '../../utils/haptics';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold' | 'dark';

/**
 * MyTap button.
 *
 * `primary` is the app's single interactive verb — a rich, solid deep green
 * (never a flat yellow), with modern layered depth. `gold` is a polished
 * metallic matte gold. Full-width pill by default.
 *
 * Press physics: 0.98 over 100ms ease-out, release to 1.0 over 200ms.
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
  size = 'lg',
}: {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
  icon?: React.ReactNode;
  fullWidth?: boolean;
  size?: 'lg' | 'md' | 'sm';
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

  /** Solid, confident brand tones — subtle depth, never mud. */
  const gradients: Record<Variant, readonly [string, string, string]> = {
    primary: ['#12946E', theme.primary, theme.primaryDeep],
    secondary: [...theme.accentGradient],
    gold: [...theme.goldGradient],
    danger: ['#E5604A', '#D92D20', '#9B1C16'],
    ghost: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.06)', 'rgba(255,255,255,0.04)'],
    dark: ['#1E3A5F', '#16294A', '#0F1729'],
  };

  const textColor =
    variant === 'ghost' ? theme.text : variant === 'gold' ? '#3A2A06' : '#FFFFFF';

  const pad =
    size === 'sm'
      ? { paddingVertical: 11, paddingHorizontal: space.lg }
      : size === 'md'
        ? { paddingVertical: 14, paddingHorizontal: space.xl }
        : { paddingVertical: 17, paddingHorizontal: space.xl };

  return (
    <Animated.View
      style={[styles.wrap, fullWidth && styles.fullWidth, disabled && styles.disabled, style, pressStyle]}
    >
      <Pressable
        onPressIn={() => {
          if (disabled || loading) return;
          // eslint-disable-next-line react-hooks/immutability
          scale.value = withTiming(0.98, { duration: 100, easing: Easing.out(Easing.cubic) });
          haptics.pressIn();
        }}
        onPressOut={() => {
          // eslint-disable-next-line react-hooks/immutability
          scale.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.cubic) });
          haptics.pressOut();
        }}
        onPress={handlePress}
        disabled={disabled || loading}
      >
        <LinearGradient
          colors={gradients[variant]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.55, y: 1 }}
          style={[styles.gradient, pad]}
        >
          {/* Modern depth: top sheen + bottom inner shade */}
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
    borderRadius: radii.pill,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    ...elevation.standard,
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: space.xs,
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
    backgroundColor: 'rgba(0,0,0,0.14)',
  },
  label: {
    fontSize: 16,
    lineHeight: 21,
    fontFamily: inter.semibold,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});
