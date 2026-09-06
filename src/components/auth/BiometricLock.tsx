import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppStore';
import { radius, spacing, type, springConfig } from '../../theme';
import { haptics } from '../../utils/haptics';
import { WaterBubble } from '../animations/WaterBubble';

/**
 * Biometric lock screen — gates the app behind Face ID / fingerprint
 * (expo-local-authentication) with a PIN fallback. Appears on launch
 * and when the app returns from background.
 */
export function BiometricLock({ onUnlock }: { onUnlock: () => void }) {
  const { theme } = useTheme();
  const { state, dispatch } = useApp();
  const [supported, setSupported] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [usePin, setUsePin] = useState(false);
  const [checking, setChecking] = useState(true);
  const appState = useRef(AppState.currentState);
  const pulse = useSharedValue(0);
  const shimmerX = useSharedValue(-1);
  const unlockScale = useSharedValue(1);
  const unlockOpacity = useSharedValue(1);
  const showLock = supported && enrolled && state.biometricEnabled && !usePin;

  useEffect(() => {
    shimmerX.value = withRepeat(
      withTiming(1.5, { duration: 2200, easing: Easing.inOut(Easing.sin) }),
      -1,
      false
    );
  }, [shimmerX]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerX.value * 300 }],
    opacity: 0.4 + shimmerX.value * 0.2,
  }));

  const unlockStyle = useAnimatedStyle(() => ({
    transform: [{ scale: unlockScale.value }],
    opacity: unlockOpacity.value,
  }));

  const doUnlock = () => {
    haptics.paymentSuccess();
    unlockScale.value = withSpring(1.06, springConfig);
    unlockOpacity.value = withTiming(0, { duration: 350, easing: Easing.out(Easing.cubic) });
    setTimeout(onUnlock, 320);
  };

  useEffect(() => {
    (async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      setSupported(hasHardware);
      setEnrolled(isEnrolled);
      setChecking(false);
      if (hasHardware && isEnrolled && state.biometricEnabled) {
        authenticate();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.08 }],
    opacity: 0.5 + pulse.value * 0.3,
  }));

  const authenticate = useCallback(async () => {
    haptics.medium();
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock MyTap',
        cancelLabel: 'Use PIN',
        fallbackLabel: 'Use PIN',
        disableDeviceFallback: true,
      });
      if (result.success) {
        doUnlock();
      } else {
        setUsePin(true);
      }
    } catch {
      setUsePin(true);
    }
  }, [onUnlock]);

  const submitPin = () => {
    if (pin === state.pin) {
      doUnlock();
    } else {
      haptics.shake();
      setError('Incorrect PIN. Try again.');
      setPin('');
    }
  };

  const pressDigit = (d: string) => {
    haptics.light();
    if (pin.length < 4) {
      const next = pin + d;
      setPin(next);
      setError('');
      if (next.length === 4) {
        setTimeout(submitPin, 120);
      }
    }
  };

  const handleAppState = useCallback(
    (next: any) => {
      if (appState.current.match(/inactive|background/) && next === 'active') {
        if (state.biometricEnabled) {
          setUsePin(false);
          setPin('');
          authenticate();
        }
      }
      appState.current = next;
    },
    [authenticate, state.biometricEnabled]
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', handleAppState);
    return () => sub.remove();
  }, [handleAppState]);

  const showBiometric = supported && enrolled && state.biometricEnabled && !usePin;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={['#0F1729', '#16233B', '#1E3A5F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <WaterBubble color="rgba(255,255,255,0.1)" size={300} />

      <Animated.View style={[styles.content, unlockStyle]}>
        <Animated.View
          style={[
            styles.shimmer,
            { backgroundColor: 'rgba(255,255,255,0.05)' },
            shimmerStyle,
          ]}
        />
        <Animated.View style={[styles.logoWrap, pulseStyle]}>
          <LinearGradient
            colors={['#1E3A5F', '#2D3B6B', '#FF6B4A']}
            style={styles.logo}
          >
            <Ionicons name="wallet" size={40} color="#fff" />
          </LinearGradient>
        </Animated.View>

        <Text style={styles.title}>MyTap</Text>
        <Text style={styles.subtitle}>Your money, protected</Text>

        {checking ? (
          <Text style={styles.hint}>Checking security…</Text>
        ) : showLock ? (
          <View style={styles.bioWrap}>
            <Pressable
              style={[styles.bioBtn, { borderColor: theme.glassBorder }]}
              onPress={authenticate}
            >
              <Ionicons name="finger-print" size={56} color="#fff" />
            </Pressable>
            <Text style={styles.bioText}>Tap to unlock with Face ID / fingerprint</Text>
            <Pressable onPress={() => { setUsePin(true); haptics.light(); }}>
              <Text style={styles.pinLink}>Use PIN instead</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.pinWrap}>
            <Text style={styles.pinTitle}>Enter your PIN</Text>
            <View style={styles.dots}>
              {[0, 1, 2, 3].map((i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    { backgroundColor: i < pin.length ? '#fff' : 'rgba(255,255,255,0.25)' },
                  ]}
                />
              ))}
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : <View style={styles.errorSpace} />}
            <View style={styles.keypad}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((k, i) => (
                <Pressable
                  key={i}
                  style={styles.key}
                  onPress={() => {
                    if (k === 'del') {
                      haptics.light();
                      setPin(pin.slice(0, -1));
                    } else if (k) {
                      pressDigit(k);
                    }
                  }}
                >
                  {k === 'del' ? (
                    <Ionicons name="backspace-outline" size={24} color="#fff" />
                  ) : (
                    <Text style={styles.keyText}>{k}</Text>
                  )}
                </Pressable>
              ))}
            </View>
            {supported && enrolled && state.biometricEnabled && (
              <Pressable onPress={() => { setUsePin(false); authenticate(); }}>
                <Text style={styles.pinLink}>Use Face ID / fingerprint</Text>
              </Pressable>
            )}
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
    transform: [{ rotate: '20deg' }],
  },
  logoWrap: {
    marginBottom: spacing.xl,
  },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...springConfig,
  },
  title: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 1,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 15,
    marginTop: 4,
    marginBottom: spacing.xxxl,
  },
  hint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  bioWrap: {
    alignItems: 'center',
  },
  bioBtn: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: spacing.xl,
  },
  bioText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  pinLink: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
    marginTop: spacing.md,
  },
  pinTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: spacing.xl,
  },
  pinWrap: {
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  error: {
    color: '#FF6B4A',
    fontSize: 13,
    marginBottom: spacing.lg,
    minHeight: 18,
  },
  errorSpace: {
    height: 18,
    marginBottom: spacing.lg,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 280,
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  key: {
    width: 80,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '500',
  },
});