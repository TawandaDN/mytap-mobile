import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
import { radius, spacing, springConfig } from '../../theme';
import { haptics } from '../../utils/haptics';
import { Confetti } from '../animations/Confetti';
import { ReceiptView } from '../receipts/ReceiptView';
import { SlideUpModal } from '../ui/SlideUpModal';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { formatPula } from '../../utils/format';

type Stage = 'idle' | 'holding' | 'processing' | 'success';

/**
 * Tap to Pay — a hold-to-pay NFC-style experience.
 * Hold the card against the terminal, watch the contactless ripple,
 * then a success burst with confetti + haptic + digital receipt.
 */
export function TapToPay({
  amount,
  merchant,
  onDone,
}: {
  amount: number;
  merchant: string;
  onDone?: () => void;
}) {
  const { theme } = useTheme();
  const { dispatch } = useApp();
  const { show } = useToast();
  const [stage, setStage] = useState<Stage>('idle');
  const [receipt, setReceipt] = useState<any>(null);
  const holdProgress = useSharedValue(0);
  const ripple = useSharedValue(0);
  const holdTimer = useRef<any>(null);

  useEffect(() => {
    if (stage === 'holding') {
      holdProgress.value = withTiming(1, { duration: 1600, easing: Easing.out(Easing.cubic) });
      ripple.value = withRepeat(withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }), -1, false);
      holdTimer.current = setTimeout(() => {
        setStage('processing');
        haptics.processing();
        setTimeout(() => {
          const ref = `MT-${Math.floor(100000 + Math.random() * 900000)}`;
          dispatch({
            type: 'PAY',
            cardId: 'wallet',
            amount,
            merchant,
            category: 'Tap to Pay',
            icon: '📱',
            color: theme.accent,
            method: 'NFC Sticker',
          });
          const r = {
            id: `r-${Date.now()}`,
            merchant,
            category: 'Tap to Pay',
            amount,
            date: new Date().toISOString(),
            ref,
            method: 'NFC Sticker',
            status: 'completed' as const,
            icon: '📡',
            color: theme.accent,
          };
          dispatch({ type: 'ADD_RECEIPT', receipt: r });
          setReceipt(r);
          setStage('success');
          haptics.paymentSuccess();
        }, 1400);
      }, 1600);
    }
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
  }, [stage]);

  const holdStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + holdProgress.value * 0.05 }],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + ripple.value * 1.6 }],
    opacity: 1 - ripple.value,
  }));

  const rippleStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + ripple.value * 2.4 }],
    opacity: (1 - ripple.value) * 0.6,
  }));

  const startHold = () => {
    if (stage !== 'idle') return;
    haptics.medium();
    setStage('holding');
  };

  const cancelHold = () => {
    if (stage === 'holding') {
      holdProgress.value = withTiming(0, { duration: 200 });
      setStage('idle');
      haptics.light();
    }
  };

  const close = () => {
    setStage('idle');
    setReceipt(null);
    onDone?.();
  };

  return (
    <View style={styles.container}>
      {/* Terminal */}
      <View style={styles.terminalWrap}>
        <Animated.View style={[styles.ripple, { borderColor: theme.accent }, rippleStyle]} />
        <Animated.View style={[styles.ripple, { borderColor: theme.accent }, rippleStyle2]} />
        <Animated.View style={[styles.terminal, holdStyle]}>
          <LinearGradient
            colors={[theme.gradient[0], theme.gradient[1], theme.gradient[2]]}
            style={styles.terminalGradient}
          >
            <Ionicons name="radio" size={40} color="#fff" />
            <Text style={styles.terminalText}>
              {stage === 'holding' ? 'Hold to pay…' : 'Tap to pay'}
            </Text>
            <Text style={styles.terminalSub}>
              {merchant} · {formatPula(amount)}
            </Text>
          </LinearGradient>
        </Animated.View>
      </View>

      {/* Hold button */}
      <Pressable
        onPressIn={startHold}
        onPressOut={cancelHold}
        style={[styles.holdBtn, { backgroundColor: theme.accent }]}
      >
        <Ionicons name="finger-print" size={24} color="#fff" />
        <Text style={styles.holdText}>Hold to pay</Text>
      </Pressable>
      <Text style={[styles.hint, { color: theme.textMuted }]}>
        Hold the button against the terminal to pay
      </Text>

      {/* Processing */}
      <SlideUpModal visible={stage === 'processing'} onClose={() => {}}>
        <View style={styles.processingWrap}>
          <PulseSpinner color={theme.accent} />
          <Text style={[styles.processingText, { color: theme.text }]}>Contactless payment…</Text>
        </View>
      </SlideUpModal>

      {/* Success */}
      <SlideUpModal visible={stage === 'success'} onClose={close}>
        <Confetti active={stage === 'success'} />
        <View style={styles.successWrap}>
          <View style={[styles.successCircle, { backgroundColor: '#2ECC71' }]}>
            <Ionicons name="checkmark" size={40} color="#fff" />
          </View>
          <Text style={[styles.successTitle, { color: theme.text }]}>Payment successful!</Text>
          <Text style={[styles.successAmount, { color: theme.text }]}>
            {receipt ? formatPula(receipt.amount) : ''}
          </Text>
          <Text style={[styles.successTo, { color: theme.textMuted }]}>to {merchant}</Text>
        </View>
        {receipt && <ReceiptView receipt={receipt} />}
        <Button title="Done" onPress={close} style={styles.doneBtn} />
      </SlideUpModal>
    </View>
  );
}

function PulseSpinner({ color }: { color: string }) {
  const pulse = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1, { duration: 800, easing: Easing.inOut(Easing.sin) }), -1, true);
    rotate.value = withRepeat(withTiming(360, { duration: 1000, easing: Easing.linear }), -1, false);
  }, [pulse, rotate]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + pulse.value * 0.2 }],
    opacity: 1 - pulse.value * 0.3,
  }));

  const rotStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <View style={styles.spinnerWrap}>
      <Animated.View style={[styles.spinnerRing, { borderColor: 'rgba(255,255,255,0.2)', borderTopColor: color }, rotStyle]} />
      <Animated.View style={[styles.spinnerPulse, { backgroundColor: color + '33' }, pulseStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  terminalWrap: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxxl,
  },
  ripple: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
  },
  terminal: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  terminalGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  terminalText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  terminalSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
  },
  holdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.xxl,
    paddingVertical: 16,
    borderRadius: radius.pill,
  },
  holdText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    fontSize: 13,
    marginTop: spacing.md,
  },
  processingWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  spinnerWrap: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  spinnerRing: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
  },
  spinnerPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  processingText: {
    fontSize: 17,
    fontWeight: '600',
  },
  successWrap: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  successAmount: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  successTo: {
    fontSize: 15,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  doneBtn: {
    marginTop: spacing.lg,
  },
});