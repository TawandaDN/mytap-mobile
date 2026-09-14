import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../theme/ThemeContext';
import { useApp } from '../../store/AppStore';
import { radius, spacing, type } from '../../theme';
import { haptics } from '../../utils/haptics';
import { ReceiptView } from '../receipts/ReceiptView';
import { SlideUpModal } from '../ui/SlideUpModal';
import { Button } from '../ui/Button';
import { ShimmerLoader } from '../ui/ShimmerLoader';
import { SuccessCheck } from '../ui/SuccessCheck';
import { formatPula } from '../../utils/format';

type Stage = 'idle' | 'holding' | 'processing' | 'success';

/**
 * Tap to Pay — the hold-to-pay NFC experience.
 *
 * Hold the card against the terminal, watch the contactless ripple expand,
 * then a calm success: green glow + checkmark draw + soft haptic, plus the
 * digital receipt. No confetti, no spinning — everything ease-out.
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
  const [stage, setStage] = useState<Stage>('idle');
  const [receipt, setReceipt] = useState<any>(null);
  const holdProgress = useSharedValue(0);
  const ripple = useSharedValue(0);
  const holdTimer = useRef<any>(null);

  useEffect(() => {
    if (stage === 'holding') {
      holdProgress.value = withTiming(1, { duration: 1600, easing: Easing.out(Easing.cubic) });
      ripple.value = withRepeat(
        withTiming(1, { duration: 1800, easing: Easing.out(Easing.cubic) }),
        -1,
        false
      );
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
            icon: '📡',
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
        }, 900);
      }, 1600);
    }
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const holdStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + holdProgress.value * 0.05 }],
  }));

  const rippleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + ripple.value * 1.6 }],
    opacity: 0.6 * (1 - ripple.value),
  }));

  const rippleStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + ripple.value * 2.4 }],
    opacity: 0.3 * (1 - ripple.value),
  }));

  const startHold = () => {
    if (stage !== 'idle') return;
    haptics.medium();
    setStage('holding');
  };

  const cancelHold = () => {
    if (stage === 'holding') {
      holdProgress.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
      ripple.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
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
            <Ionicons name="radio" size={38} color="#fff" />
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
        style={[styles.holdBtn, { backgroundColor: theme.primary }]}
      >
        <Ionicons name="finger-print" size={22} color="#fff" />
        <Text style={styles.holdText}>Hold to pay</Text>
      </Pressable>
      <Text style={[styles.hint, { color: theme.textMuted }]}>
        Hold the button against the terminal to pay
      </Text>

      {/* Processing — shimmer across the surface, never a spinner */}
      <SlideUpModal visible={stage === 'processing'} onClose={() => {}}>
        <View style={styles.processingWrap}>
          <ShimmerLoader size={110} />
          <Text style={[styles.processingText, { color: theme.text }]}>Contactless payment…</Text>
        </View>
      </SlideUpModal>

      {/* Success — green glow + checkmark draw + soft haptic */}
      <SlideUpModal visible={stage === 'success'} onClose={close}>
        <View style={styles.successWrap}>
          <SuccessCheck size={88} />
          <Text style={[styles.successTitle, { color: theme.text }]}>Payment successful</Text>
          <Text style={[styles.successAmount, { color: theme.text }]}>
            {receipt ? formatPula(receipt.amount) : ''}
          </Text>
          <Text style={[styles.successTo, { color: theme.textMuted }]}>to {merchant}</Text>
        </View>
        {receipt && <ReceiptView receipt={receipt} />}
        <Button title="Done" onPress={close} fullWidth style={styles.doneBtn} />
      </SlideUpModal>
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
    gap: 4,
  },
  terminalText: {
    color: '#fff',
    ...type.caption,
    fontWeight: '600',
  },
  terminalSub: {
    color: 'rgba(255,255,255,0.7)',
    ...type.small,
  },
  holdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: spacing.xxl,
    paddingVertical: 15,
    borderRadius: radius.pill,
  },
  holdText: {
    color: '#fff',
    ...type.subheading,
    fontWeight: '600',
  },
  hint: {
    ...type.caption,
    marginTop: spacing.md,
  },
  processingWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  processingText: {
    ...type.subheading,
    fontWeight: '600',
    marginTop: spacing.xl,
  },
  successWrap: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  successTitle: {
    ...type.title,
    marginTop: spacing.md,
  },
  successAmount: {
    ...type.moneyLarge,
    marginTop: spacing.sm,
  },
  successTo: {
    ...type.body,
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  doneBtn: {
    marginTop: spacing.lg,
  },
});