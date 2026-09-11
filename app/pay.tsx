import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { Button } from '../src/components/ui/Button';
import { SlideUpModal } from '../src/components/ui/SlideUpModal';
import { ShimmerLoader } from '../src/components/ui/ShimmerLoader';
import { SuccessCheck } from '../src/components/ui/SuccessCheck';
import { TapToPay } from '../src/components/pay/TapToPay';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { merchants } from '../src/data/mock';
import { formatPula } from '../src/utils/format';
import { playTapticPayment } from '../src/utils/tapticSound';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

type PayStage = 'idle' | 'confirm' | 'processing' | 'success';
type PayMode = 'pay' | 'tap';

/**
 * Payments (tab) — merchant selection → amount → method → processing →
 * SUCCESS with a digital receipt. Includes the Tap to Pay contactless flow.
 */
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
    // Acoustic taptic double-pop (Apple-Pay-style physical transaction sound)
    playTapticPayment();
    setTimeout(() => {
      const amt = parseFloat(amount);
      const ref = `MT-${Math.floor(100000 + Math.random() * 900000)}`;
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
        ref,
      });
      dispatch({
        type: 'ADD_RECEIPT',
        receipt: {
          id: `r-${Date.now()}`,
          merchant: selected.name,
          category: selected.category,
          amount: amt,
          date: new Date().toISOString(),
          ref,
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
        <Text style={[styles.subtitle, { color: theme.primary }]}>MyTap Market</Text>
        {/* Mode toggle */}
        <View style={styles.modeToggle}>
          <PressableScale
            style={[styles.modeChip, { backgroundColor: theme.surface, borderColor: theme.hairline }, mode === 'pay' && { backgroundColor: theme.primary, borderColor: theme.primary }]}
            onPress={() => { setMode('pay'); haptics.selection(); }}
          >
            <Ionicons name="card" size={16} color={mode === 'pay' ? '#fff' : theme.textMuted} />
            <Text style={[styles.modeChipText, { color: mode === 'pay' ? '#fff' : theme.textMuted }]}>Pay</Text>
          </PressableScale>
          <PressableScale
            style={[styles.modeChip, { backgroundColor: theme.surface, borderColor: theme.hairline }, mode === 'tap' && { backgroundColor: theme.primary, borderColor: theme.primary }]}
            onPress={() => { setMode('tap'); haptics.selection(); }}
          >
            <Ionicons name="radio" size={16} color={mode === 'tap' ? '#fff' : theme.textMuted} />
            <Text style={[styles.modeChipText, { color: mode === 'tap' ? '#fff' : theme.textMuted }]}>Tap to Pay</Text>
          </PressableScale>
        </View>
      </StaggeredItem>

      {mode === 'tap' ? (
        <StaggeredItem index={1}>
          <GlassCard bubbleColor={`${theme.indicator}22`} style={styles.tapCard}>
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
                    { backgroundColor: theme.surface, borderColor: theme.hairline },
                    selected.id === m.id && { borderColor: theme.primary, borderWidth: 2 },
                  ]}
                  onPress={() => {
                    setSelected(m);
                    haptics.selection();
                  }}
                >
                  <View style={[styles.merchantIcon, { backgroundColor: m.color + '1f' }]}>
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
            <GlassCard solid bubble={false} style={styles.amountCard}>
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
              <Button title="Pay now" onPress={startPayment} fullWidth style={styles.payBtn} />
            </GlassCard>
          </StaggeredItem>
        </>
      )}

      {/* Confirmation modal */}
      <SlideUpModal visible={stage === 'confirm'} onClose={() => setStage('idle')}>
        <Text style={[styles.modalTitle, { color: theme.text }]}>Confirm payment</Text>
        <View style={styles.confirmRow}>
          <View style={[styles.confirmIcon, { backgroundColor: selected.color + '1f' }]}>
            <Text style={styles.confirmEmoji}>{selected.icon}</Text>
          </View>
          <View style={styles.confirmInfo}>
            <Text style={[styles.confirmMerchant, { color: theme.text }]}>{selected.name}</Text>
            <Text style={[styles.confirmCat, { color: theme.textMuted }]}>{selected.category}</Text>
          </View>
        </View>
        <View style={[styles.confirmAmount, { borderColor: theme.hairline }]}>
          <Text style={[styles.confirmAmountLabel, { color: theme.textMuted }]}>Amount</Text>
          <Text style={[styles.confirmAmountValue, { color: theme.text }]}>
            {formatPula(parseFloat(amount) || 0)}
          </Text>
        </View>
        <Button title="Confirm & pay" onPress={confirmPayment} fullWidth style={styles.modalBtn} />
      </SlideUpModal>

      {/* Processing modal — shimmer (no spinner) */}
      <SlideUpModal visible={stage === 'processing'} onClose={() => {}}>
        <View style={styles.processingWrap}>
          <ShimmerLoader />
          <Text style={[styles.processingText, { color: theme.text }]}>Processing payment…</Text>
        </View>
      </SlideUpModal>

      {/* Success modal — green glow + checkmark draw + soft haptic */}
      <SlideUpModal visible={stage === 'success'} onClose={closeSuccess}>
        <View style={styles.successWrap}>
          <SuccessCheck />
          <Text style={[styles.successTitle, { color: theme.text }]}>Payment successful</Text>
          <Text style={[styles.successAmount, { color: theme.text }]}>
            {receipt ? formatPula(receipt.amount) : ''}
          </Text>
          <Text style={[styles.successTo, { color: theme.textMuted }]}>to {receipt?.merchant}</Text>
        </View>
        {receipt && (
          <GlassCard solid bubble={false} style={styles.receipt}>
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
              <Text style={[styles.receiptValue, { color: theme.primary }]}>Completed</Text>
            </View>
          </GlassCard>
        )}
        <Button title="Done" onPress={closeSuccess} fullWidth style={styles.modalBtn} />
      </SlideUpModal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...type.title,
    marginBottom: 4,
  },
  subtitle: {
    ...type.label,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
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
    borderWidth: 1,
  },
  modeChipText: {
    ...type.caption,
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
    borderRadius: radius.card,
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
    ...type.caption,
    fontSize: 13.5,
    fontWeight: '600',
  },
  merchantCat: {
    ...type.small,
    fontSize: 11,
    textAlign: 'center',
  },
  amountCard: {
    marginBottom: spacing.xl,
  },
  amountLabel: {
    ...type.caption,
    marginBottom: spacing.sm,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountPrefix: {
    ...type.moneyLarge,
    marginRight: spacing.sm,
  },
  amountInput: {
    flex: 1,
    ...type.moneyLarge,
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
    ...type.caption,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  payBtn: {
    marginTop: spacing.sm,
  },
  modalTitle: {
    ...type.title,
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
    ...type.subheading,
    fontWeight: '600',
  },
  confirmCat: {
    ...type.caption,
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
    ...type.caption,
  },
  confirmAmountValue: {
    ...type.heading,
    fontVariant: ['tabular-nums'],
  },
  modalBtn: {
    marginTop: spacing.sm,
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
    paddingVertical: spacing.lg,
  },
  successTitle: {
    ...type.title,
    marginTop: spacing.sm,
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
  receipt: {
    marginBottom: spacing.lg,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  receiptLabel: {
    ...type.caption,
  },
  receiptValue: {
    ...type.caption,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
});
