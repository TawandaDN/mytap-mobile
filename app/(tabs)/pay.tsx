import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../src/theme/ThemeContext';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { GlassCard } from '../../src/components/cards/GlassCard';
import { StaggeredItem } from '../../src/components/animations/Staggered';
import { Button } from '../../src/components/ui/Button';
import { SlideUpModal } from '../../src/components/ui/SlideUpModal';
import { ShimmerLoader } from '../../src/components/ui/ShimmerLoader';
import { SuccessCheck } from '../../src/components/ui/SuccessCheck';
import { TapToPay } from '../../src/components/pay/TapToPay';
import { useToast } from '../../src/components/ui/Toast';
import { useApp } from '../../src/store/AppStore';
import { merchants } from '../../src/data/mock';
import { formatPula } from '../../src/utils/format';
import { spacing, type, radius } from '../../src/theme';
import { haptics } from '../../src/utils/haptics';
import { PressableScale } from '../../src/components/ui/PressableScale';

type PayStage = 'idle' | 'confirm' | 'processing' | 'success';
type PayMode = 'pay' | 'tap';

export default function PayScreen() {
  const { theme } = useTheme();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [selected, setSelected] = useState(merchants[0]);
  const [amount, setAmount] = useState('');
  const [stage, setStage] = useState<PayStage>('idle');
  const [receipt, setReceipt] = useState<any>(null);
  const [mode, setMode] = useState<PayMode>('pay');

  const startPayment = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      show('Enter a valid amount', 'error');
      return;
    }
    setStage('confirm');
    haptics.medium();
  };

  const confirmPayment = () => {
    setStage('processing');
    haptics.processing();
    setTimeout(() => {
      const amt = parseFloat(amount);
      dispatch({
        type: 'PAY',
        cardId: 'wallet',
        amount: amt,
        merchant: selected.name,
        category: selected.category,
        icon: selected.icon,
        color: selected.color,
      });
      setReceipt({
        merchant: selected.name,
        amount: amt,
        date: new Date().toISOString(),
        ref: `MT-${Math.floor(100000 + Math.random() * 900000)}`,
      });
      dispatch({
        type: 'ADD_RECEIPT',
        receipt: {
          id: `r-${Date.now()}`,
          merchant: selected.name,
          category: selected.category,
          amount: amt,
          date: new Date().toISOString(),
          ref: `MT-${Math.floor(100000 + Math.random() * 900000)}`,
          method: 'MyTap Wallet',
          status: 'completed',
          icon: selected.icon,
          color: selected.color,
        },
      });
      setStage('success');
      haptics.paymentSuccess();
    }, 800);
  };

  const closeSuccess = () => {
    setStage('idle');
    setAmount('');
    setReceipt(null);
  };

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <Text style={[styles.title, { color: theme.text }]}>What are you paying for?</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>MyTap Market</Text>
        {/* Mode toggle */}
        <View style={styles.modeToggle}>
          <PressableScale
            style={[styles.modeChip, mode === 'pay' && { backgroundColor: theme.accent }]}
            onPress={() => { setMode('pay'); haptics.selection(); }}
          >
            <Ionicons name="card" size={16} color={mode === 'pay' ? '#fff' : theme.textMuted} />
            <Text style={[styles.modeChipText, { color: mode === 'pay' ? '#fff' : theme.textMuted }]}>Pay</Text>
          </PressableScale>
          <PressableScale
            style={[styles.modeChip, mode === 'tap' && { backgroundColor: theme.accent }]}
            onPress={() => { setMode('tap'); haptics.selection(); }}
          >
            <Ionicons name="radio" size={16} color={mode === 'tap' ? '#fff' : theme.textMuted} />
            <Text style={[styles.modeChipText, { color: mode === 'tap' ? '#fff' : theme.textMuted }]}>Tap to Pay</Text>
          </PressableScale>
        </View>
      </StaggeredItem>

      {mode === 'tap' ? (
        <StaggeredItem index={1}>
          <GlassCard bubbleColor={`${theme.accent}22`} style={styles.tapCard}>
            <TapToPay
              amount={parseFloat(amount) || 50}
              merchant={selected.name}
              onDone={() => setAmount('')}
            />
          </GlassCard>
        </StaggeredItem>
      ) : (
        <>
      {/* Merchant grid */}
      <StaggeredItem index={1}>
        <View style={styles.grid}>
          {merchants.map((m) => (
            <PressableScale
              key={m.id}
              style={[
                styles.merchantCard,
                { backgroundColor: theme.surface, borderColor: theme.border },
                selected.id === m.id && { borderColor: theme.accent, borderWidth: 2 },
              ]}
              onPress={() => {
                setSelected(m);
                haptics.selection();
              }}
            >
              <View style={[styles.merchantIcon, { backgroundColor: m.color + '22' }]}>
                <Text style={styles.merchantEmoji}>{m.icon}</Text>
              </View>
              <Text style={[styles.merchantName, { color: theme.text }]}>{m.name}</Text>
              <Text style={[styles.merchantCat, { color: theme.textMuted }]}>{m.category}</Text>
            </PressableScale>
          ))}
        </View>
      </StaggeredItem>

      {/* Amount input */}
      <StaggeredItem index={2}>
        <GlassCard bubble={false} style={styles.amountCard}>
          <Text style={[styles.amountLabel, { color: theme.textMuted }]}>Amount</Text>
          <View style={styles.amountRow}>
            <Text style={[styles.amountPrefix, { color: theme.text }]}>P</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={theme.textMuted}
              style={[styles.amountInput, { color: theme.text }]}
            />
          </View>
          <View style={styles.quickAmounts}>
            {[50, 100, 200, 500].map((a) => (
              <PressableScale
                key={a}
                style={[styles.quickAmount, { backgroundColor: theme.surfaceAlt }]}
                onPress={() => {
                  setAmount(String(a));
                  haptics.light();
                }}
              >
                <Text style={[styles.quickAmountText, { color: theme.textSecondary }]}>P{a}</Text>
              </PressableScale>
            ))}
          </View>
          <Button title="Pay now" onPress={startPayment} style={styles.payBtn} />
        </GlassCard>
      </StaggeredItem>
        </>
      )}

      {/* Confirmation modal */}
      <SlideUpModal visible={stage === 'confirm'} onClose={() => setStage('idle')}>
        <Text style={[styles.modalTitle, { color: theme.text }]}>Confirm payment</Text>
        <View style={styles.confirmRow}>
          <View style={[styles.confirmIcon, { backgroundColor: selected.color + '22' }]}>
            <Text style={styles.confirmEmoji}>{selected.icon}</Text>
          </View>
          <View style={styles.confirmInfo}>
            <Text style={[styles.confirmMerchant, { color: theme.text }]}>{selected.name}</Text>
            <Text style={[styles.confirmCat, { color: theme.textMuted }]}>{selected.category}</Text>
          </View>
        </View>
        <View style={[styles.confirmAmount, { borderColor: theme.border }]}>
          <Text style={[styles.confirmAmountLabel, { color: theme.textMuted }]}>Amount</Text>
          <Text style={[styles.confirmAmountValue, { color: theme.text }]}>
            {formatPula(parseFloat(amount) || 0)}
          </Text>
        </View>
        <Button title="Confirm & pay" onPress={confirmPayment} style={styles.modalBtn} />
      </SlideModal>

      {/* Processing modal */}
      <SlideModal visible={stage === 'processing'} onClose={() => {}}>
        <View style={styles.processingWrap}>
          <ShimmerLoader />
          <Text style={[styles.processingText, { color: theme.text }]}>Processing payment…</Text>
        </View>
      </SlideModal>

      {/* Success modal */}
      <SlideModal visible={stage === 'success'} onClose={closeSuccess}>
        <View style={styles.successWrap}>
          <SuccessCheck />
          <Text style={[styles.successTitle, { color: theme.text }]}>Payment successful!</Text>
          <Text style={[styles.successAmount, { color: theme.text }]}>
            {receipt ? formatPula(receipt.amount) : ''}
          </Text>
          <Text style={[styles.successTo, { color: theme.textMuted }]}>
            to {receipt?.merchant}
          </Text>
        </View>
        {receipt && (
          <GlassCard bubble={false} style={styles.receipt}>
            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: theme.textMuted }]}>Reference</Text>
              <Text style={[styles.receiptValue, { color: theme.text }]}>{receipt.ref}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: theme.textMuted }]}>Date</Text>
              <Text style={[styles.receiptValue, { color: theme.text }]}>
                {new Date(receipt.date).toLocaleString()}
              </Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={[styles.receiptLabel, { color: theme.textMuted }]}>Status</Text>
              <Text style={[styles.receiptValue, { color: '#2ECC71' }]}>Completed</Text>
            </View>
          </GlassCard>
        )}
        <Button title="Done" onPress={closeSuccess} style={styles.modalBtn} />
      </SlideModal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: '#6B3A8A',
    marginBottom: spacing.lg,
  },
  modeToggle: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(15,23,41,0.06)',
  },
  modeChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tapCard: {
    marginBottom: spacing.xl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  merchantCard: {
    width: '31%',
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    alignItems: 'center',
    gap: 6,
  },
  merchantIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  merchantEmoji: {
    fontSize: 20,
  },
  merchantName: {
    fontSize: 14,
    fontWeight: '600',
  },
  merchantCat: {
    fontSize: 11,
    textAlign: 'center',
  },
  amountCard: {
    marginBottom: spacing.xl,
  },
  amountLabel: {
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountPrefix: {
    fontSize: 32,
    fontWeight: '700',
    marginRight: spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: 32,
    fontWeight: '700',
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  quickAmount: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
  },
  payBtn: {
    marginTop: spacing.sm,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  confirmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  confirmIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmEmoji: {
    fontSize: 22,
  },
  confirmInfo: {
    flex: 1,
  },
  confirmMerchant: {
    fontSize: 17,
    fontWeight: '600',
  },
  confirmCat: {
    fontSize: 13,
  },
  confirmAmount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  confirmAmountLabel: {
    fontSize: 14,
  },
  confirmAmountValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  modalBtn: {
    marginTop: spacing.sm,
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
    backgroundColor: '#2ECC71',
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
  receipt: {
    marginBottom: spacing.lg,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  receiptLabel: {
    fontSize: 14,
  },
  receiptValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});