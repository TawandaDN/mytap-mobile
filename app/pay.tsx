import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { ScreenHeader } from '../src/components/ui/ScreenHeader';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { Button } from '../src/components/ui/Button';
import { SlideUpModal } from '../src/components/ui/SlideUpModal';
import { ShimmerLoader } from '../src/components/ui/ShimmerLoader';
import { SuccessCheck } from '../src/components/ui/SuccessCheck';
import { QrCode } from '../src/components/ui/QrCode';
import { TapToPay } from '../src/components/pay/TapToPay';
import { ReceiptView } from '../src/components/receipts/ReceiptView';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { merchants, recentPayees, myzakaContacts, userProfile } from '../src/data/mock';
import { formatPula, formatPx } from '../src/utils/format';
import { playTapticPayment } from '../src/utils/tapticSound';
import { spacing, type, radius, shadows } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

type PayStage = 'idle' | 'confirm' | 'processing' | 'success';
type Segment = 'scan' | 'pay' | 'receive';

/**
 * Payments — the QR / payment action sheet.
 *
 * A pill-shaped Scan · Pay · Receive segmented control over a centred action
 * area: a square scanner frame, the tap-pay flow, or a crisp vector QR code
 * with a masked phone number and the full-width green "Share QR Code" CTA.
 */
export default function PayScreen() {
  const { theme } = useTheme();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [segment, setSegment] = useState<Segment>('scan');
  const [selected, setSelected] = useState(merchants[0]);
  const [amount, setAmount] = useState('');
  const [stage, setStage] = useState<PayStage>('idle');
  const [receipt, setReceipt] = useState<any>(null);
  const [phone, setPhone] = useState(userProfile.phone);
  const [tapMode, setTapMode] = useState(false);

  const startPayment = (amt?: number) => {
    const value = amt ?? parseFloat(amount);
    if (!value || value <= 0) {
      show('Enter a valid amount', 'error');
      return;
    }
    setStage('confirm');
    haptics.medium();
  };

  const confirmPayment = () => {
    setStage('processing');
    haptics.processing();
    // Acoustic taptic double-pop — the physical transaction sound.
    playTapticPayment();
    setTimeout(() => {
      const amt = parseFloat(amount) || 0;
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
      const r = {
        id: `r-${Date.now()}`,
        merchant: selected.name,
        category: selected.category,
        amount: amt,
        date: new Date().toISOString(),
        ref,
        method: 'MyTap Wallet',
        status: 'completed' as const,
        icon: selected.icon,
        color: selected.color,
      };
      dispatch({ type: 'ADD_RECEIPT', receipt: r });
      setReceipt(r);
      setStage('success');
      haptics.paymentSuccess();
    }, 800);
  };

  const closeSuccess = () => {
    setStage('idle');
    setAmount('');
    setReceipt(null);
  };

  const segments: { key: Segment; label: string }[] = [
    { key: 'scan', label: 'Scan' },
    { key: 'pay', label: 'Pay' },
    { key: 'receive', label: 'Receive' },
  ];

  return (
    <ScreenContainer>
      {/* PAY / Send money in seconds. — coral accent */}
      <StaggeredItem index={0}>
        <Text style={[styles.kicker, { color: theme.accent }]}>PAY</Text>
        <Text style={[styles.title, { color: theme.text }]}>Send money in seconds.</Text>
      </StaggeredItem>

      {/* Pill-shaped segmented control */}
      <StaggeredItem index={1}>
        <View style={[styles.segment, { backgroundColor: theme.surfaceAlt }]}>
          {segments.map((s) => {
            const active = segment === s.key;
            return (
              <PressableScale
                key={s.key}
                scaleTo={0.97}
                bubble={false}
                style={[
                  styles.segmentItem,
                  active && { backgroundColor: theme.surface, ...shadows.subtle },
                ]}
                onPress={() => {
                  setSegment(s.key);
                  haptics.selection();
                }}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: active ? theme.text : theme.textMuted },
                  ]}
                >
                  {s.label}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      </StaggeredItem>

      {/* ---------- SCAN ---------- */}
      {segment === 'scan' && (
        <>
          <StaggeredItem index={2}>
            <View style={styles.actionArea}>
              <View style={[styles.scannerFrame, { borderColor: theme.hairline }]}>
                <View style={[styles.corner, styles.cornerTL, { borderColor: theme.accent }]} />
                <View style={[styles.corner, styles.cornerTR, { borderColor: theme.accent }]} />
                <View style={[styles.corner, styles.cornerBL, { borderColor: theme.accent }]} />
                <View style={[styles.corner, styles.cornerBR, { borderColor: theme.accent }]} />
                <View style={styles.scanInner}>
                  <Ionicons name="qr-code-outline" size={54} color={theme.textMuted} />
                  <Text style={[styles.scanHint, { color: theme.textMuted }]}>
                    Point at a MyTap QR code
                  </Text>
                </View>
              </View>
            </View>
          </StaggeredItem>

          <StaggeredItem index={3}>
            <GlassCard solid style={styles.fieldCard}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Paying</Text>
              <View style={styles.fieldRow}>
                <Text style={[styles.fieldValue, { color: theme.text }]}>
                  {maskPhone(phone)}
                </Text>
                <Ionicons name="chevron-down" size={16} color={theme.textMuted} />
              </View>
            </GlassCard>
          </StaggeredItem>

          <StaggeredItem index={4}>
            <Button
              title="Open scanner"
              variant="primary"
              fullWidth
              onPress={() => {
                haptics.medium();
                show('Camera scanner ready (demo)', 'info');
              }}
              style={styles.cta}
            />
          </StaggeredItem>
        </>
      )}

      {/* ---------- PAY ---------- */}
      {segment === 'pay' && (
        <>
          <StaggeredItem index={2}>
            <View style={styles.quickGrid}>
              {[
                { icon: 'qr-code-outline', label: 'QR Scan', color: '#1E3A5F' },
                { icon: 'radio-outline', label: 'Tap Pay', color: '#FF6B4A' },
                { icon: 'download-outline', label: 'Receive QR', color: '#2ECC71' },
                { icon: 'person-outline', label: 'Person', color: '#6B3A8A' },
              ].map((q) => (
                <PressableScale
                  key={q.label}
                  style={[styles.quickItem, { backgroundColor: theme.surface, borderColor: theme.hairline }]}
                  onPress={() => {
                    if (q.label === 'Tap Pay') {
                      setTapMode(true);
                    } else if (q.label === 'Receive QR') {
                      setSegment('receive');
                    } else {
                      show(`${q.label} ready`, 'info');
                    }
                  }}
                >
                  <View style={[styles.quickIcon, { backgroundColor: q.color + '14' }]}>
                    <Ionicons name={q.icon as any} size={20} color={q.color} />
                  </View>
                  <Text style={[styles.quickLabel, { color: theme.textSecondary }]}>{q.label}</Text>
                </PressableScale>
              ))}
            </View>
          </StaggeredItem>

          <StaggeredItem index={3}>
            <ScreenHeader
              title="Recent payees"
              subtitle="Pick up where you left off."
            />
          </StaggeredItem>

          <StaggeredItem index={4}>
            <View style={styles.payeeGrid}>
              {recentPayees.map((p) => (
                <PressableScale
                  key={p.id}
                  style={[styles.payeeCard, { backgroundColor: theme.surface, borderColor: theme.hairline }]}
                  onPress={() => {
                    const match = merchants.find((m) => m.name === p.name) ?? merchants[0];
                    setSelected(match);
                    setAmount(String(p.lastAmount));
                    haptics.medium();
                    setStage('confirm');
                  }}
                >
                  <View style={[styles.payeeIcon, { backgroundColor: p.color + '14' }]}>
                    <Text style={styles.payeeEmoji}>{p.icon}</Text>
                  </View>
                  <View style={styles.payeeInfo}>
                    <Text style={[styles.payeeName, { color: theme.text }]} numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text style={[styles.payeeSub, { color: theme.textMuted }]} numberOfLines={1}>
                      {p.category}
                    </Text>
                  </View>
                  <Text style={[styles.payeeAmount, { color: theme.text }]}>
                    {formatPx(p.lastAmount)}
                  </Text>
                </PressableScale>
              ))}
            </View>
          </StaggeredItem>

          <StaggeredItem index={5}>
            <ScreenHeader title="MyZaka contacts" subtitle="Send to anyone on MyZaka." />
          </StaggeredItem>

          <StaggeredItem index={6}>
            <GlassCard solid style={styles.contactsCard}>
              {myzakaContacts.map((c, i) => (
                <PressableScale
                  key={c.id}
                  style={[styles.contactRow, i > 0 && { borderTopWidth: 1, borderTopColor: theme.hairline }]}
                  onPress={() => {
                    haptics.light();
                    show(`Send money to ${c.name}`, 'info');
                  }}
                >
                  <View style={[styles.contactAvatar, { backgroundColor: c.avatarColor }]}>
                    <Text style={styles.contactInitial}>{c.name[0]}</Text>
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={[styles.contactName, { color: theme.text }]}>{c.name}</Text>
                    <Text style={[styles.contactPhone, { color: theme.textMuted }]}>{c.phone}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
                </PressableScale>
              ))}
            </GlassCard>
          </StaggeredItem>

          <StaggeredItem index={7}>
            <GlassCard solid style={styles.amountCard}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Amount</Text>
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
                    <Text style={[styles.quickAmountText, { color: theme.textSecondary }]}>
                      P{a}
                    </Text>
                  </PressableScale>
                ))}
              </View>
              <Button title="Pay now" onPress={() => startPayment()} fullWidth />
            </GlassCard>
          </StaggeredItem>
        </>
      )}

      {/* ---------- RECEIVE ---------- */}
      {segment === 'receive' && (
        <>
          <StaggeredItem index={2}>
            <View style={styles.actionArea}>
              <View style={[styles.qrFrame, { borderColor: theme.hairline, backgroundColor: theme.surface }]}>
                <QrCode value={`https://mytap.bw/pay/${userProfile.phone}`} size={196} color={theme.text} />
              </View>
            </View>
          </StaggeredItem>

          <StaggeredItem index={3}>
            <GlassCard solid style={styles.fieldCard}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>
                Your MyTap number
              </Text>
              <PressableScale
                style={styles.fieldRow}
                bubble={false}
                onPress={() => {
                  haptics.light();
                  show('Switch receiving number', 'info');
                }}
              >
                <Text style={[styles.fieldValue, { color: theme.text }]}>
                  {maskPhone(phone)}
                </Text>
                <Ionicons name="chevron-down" size={16} color={theme.textMuted} />
              </PressableScale>
            </GlassCard>
          </StaggeredItem>

          <StaggeredItem index={4}>
            <Button
              title="Share QR Code"
              variant="primary"
              fullWidth
              onPress={() => {
                haptics.medium();
                show('QR code shared', 'success');
              }}
              style={styles.cta}
            />
          </StaggeredItem>
        </>
      )}

      {/* Confirmation */}
      <SlideUpModal visible={stage === 'confirm'} onClose={() => setStage('idle')}>
        <Text style={[styles.modalTitle, { color: theme.text }]}>Confirm payment</Text>
        <View style={styles.confirmRow}>
          <View style={[styles.confirmIcon, { backgroundColor: selected.color + '1f' }]}>
            <Text style={styles.confirmEmoji}>{selected.icon}</Text>
          </View>
          <View style={styles.confirmInfo}>
            <Text style={[styles.confirmMerchant, { color: theme.text }]}>{selected.name}</Text>
            <Text style={[styles.confirmCat, { color: theme.textMuted }]}>
              {selected.category}
            </Text>
          </View>
        </View>
        <View style={[styles.confirmAmount, { borderColor: theme.hairline }]}>
          <Text style={[styles.confirmAmountLabel, { color: theme.textMuted }]}>Amount</Text>
          <Text style={[styles.confirmAmountValue, { color: theme.text }]}>
            {formatPula(parseFloat(amount) || 0)}
          </Text>
        </View>
        <Button title="Confirm & pay" onPress={confirmPayment} fullWidth />
      </SlideUpModal>

      {/* Processing — shimmer across the surface, never a spinner */}
      <SlideUpModal visible={stage === 'processing'} onClose={() => {}}>
        <View style={styles.processingWrap}>
          <ShimmerLoader size={110} />
          <Text style={[styles.processingText, { color: theme.text }]}>Processing payment…</Text>
        </View>
      </SlideUpModal>

      {/* Success — green glow + checkmark draw + soft haptic */}
      <SlideUpModal visible={stage === 'success'} onClose={closeSuccess}>
        <View style={styles.successWrap}>
          <SuccessCheck size={88} />
          <Text style={[styles.successTitle, { color: theme.text }]}>Payment successful</Text>
          <Text style={[styles.successAmount, { color: theme.text }]}>
            {receipt ? formatPula(receipt.amount) : ''}
          </Text>
          <Text style={[styles.successTo, { color: theme.textMuted }]}>to {receipt?.merchant}</Text>
        </View>
        {receipt && <ReceiptView receipt={receipt} />}
        <Button title="Done" onPress={closeSuccess} fullWidth style={styles.modalBtn} />
      </SlideUpModal>

      {/* Tap to Pay */}
      <SlideUpModal
        visible={tapMode}
        onClose={() => {
          setTapMode(false);
          setAmount('');
        }}
      >
        <TapToPay
          amount={parseFloat(amount) || 50}
          merchant={selected.name}
          onDone={() => {
            setTapMode(false);
            setAmount('');
          }}
        />
      </SlideUpModal>
    </ScreenContainer>
  );
}

/** Masks a phone number for display: +267 71 772 370 → +267 71 ••• ••70 */
function maskPhone(p: string) {
  const digits = p.replace(/\D/g, '');
  if (digits.length < 6) return p;
  return `${p.slice(0, p.length - 6)}••• ${p.slice(-2)}`;
}

const styles = StyleSheet.create({
  kicker: {
    ...type.label,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  title: {
    ...type.largeTitle,
    marginTop: 2,
    marginBottom: spacing.lg,
  },

  segment: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    padding: 4,
    gap: 4,
    marginBottom: spacing.xl,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  segmentText: {
    ...type.caption,
    fontWeight: '600',
  },

  actionArea: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  scannerFrame: {
    width: 236,
    height: 236,
    borderRadius: radius.xxl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(16,24,40,0.02)',
  },
  scanInner: {
    alignItems: 'center',
    gap: spacing.md,
  },
  scanHint: {
    ...type.caption,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderWidth: 3,
  },
  cornerTL: {
    top: -1,
    left: -1,
    borderTopLeftRadius: radius.xxl,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  cornerTR: {
    top: -1,
    right: -1,
    borderTopRightRadius: radius.xxl,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  cornerBL: {
    bottom: -1,
    left: -1,
    borderBottomLeftRadius: radius.xxl,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  cornerBR: {
    bottom: -1,
    right: -1,
    borderBottomRightRadius: radius.xxl,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  qrFrame: {
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    ...shadows.standard,
  },

  fieldCard: {
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    ...type.caption,
    marginBottom: 4,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldValue: {
    ...type.subheading,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  cta: {
    marginTop: spacing.sm,
  },

  quickGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  quickItem: {
    flex: 1,
    borderRadius: radius.card,
    borderWidth: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: 7,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    ...type.small,
    fontSize: 10.5,
    fontWeight: '600',
    textAlign: 'center',
  },

  payeeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  payeeCard: {
    width: '48%',
    flexGrow: 1,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  payeeIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payeeEmoji: {
    fontSize: 17,
  },
  payeeInfo: {},
  payeeName: {
    ...type.body,
    fontSize: 14,
    fontWeight: '600',
  },
  payeeSub: {
    ...type.small,
    marginTop: 1,
  },
  payeeAmount: {
    ...type.money,
    marginTop: 2,
  },

  contactsCard: {
    padding: 0,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: spacing.md,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInitial: {
    color: '#fff',
    ...type.subheading,
    fontWeight: '600',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    ...type.body,
    fontWeight: '600',
  },
  contactPhone: {
    ...type.caption,
    fontSize: 12,
    marginTop: 1,
  },

  amountCard: {
    marginTop: spacing.lg,
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
    padding: 0,
  },
  quickAmounts: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
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
    marginTop: spacing.lg,
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
});
