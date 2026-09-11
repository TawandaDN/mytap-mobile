import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { Button } from '../src/components/ui/Button';
import { SlideUpModal } from '../src/components/ui/SlideUpModal';
import { ShimmerLoader } from '../src/components/ui/ShimmerLoader';
import { SuccessCheck } from '../src/components/ui/SuccessCheck';
import { QrCode } from '../src/components/ui/QrCode';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { formatPula } from '../src/utils/format';
import { spacing, type, radius, shadows } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

type Mode = 'scan' | 'pay' | 'receive';

const MASKED_PHONE = '+267 71 ••• ••67';

/**
 * QR Pay sheet — pill segmented control (Scan · Pay · Receive), a sharp
 * centred square frame holding either the camera reticle or a rendered
 * vector QR, an information feed with data fields, and a full-width
 * solid green pill anchored to the bottom reading "Share QR Code".
 */
export default function QrScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { dispatch } = useApp();
  const { show } = useToast();
  const [mode, setMode] = useState<Mode>('scan');
  const [amount, setAmount] = useState('');
  const [stage, setStage] = useState<'idle' | 'processing' | 'success'>('idle');
  const [receipt, setReceipt] = useState<any>(null);

  const segments: { key: Mode; label: string }[] = [
    { key: 'scan', label: 'Scan' },
    { key: 'pay', label: 'Pay' },
    { key: 'receive', label: 'Receive' },
  ];

  const pay = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      show('Enter a valid amount', 'error');
      return;
    }
    setStage('processing');
    haptics.processing();
    setTimeout(() => {
      dispatch({
        type: 'PAY',
        cardId: 'wallet',
        amount: amt,
        merchant: 'QR Merchant',
        category: 'QR Payment',
        icon: '📱',
        color: '#3B2560',
        method: 'MyTap Wallet',
      });
      const r = {
        id: `r-${Date.now()}`,
        merchant: 'QR Merchant',
        category: 'QR Payment',
        amount: amt,
        date: new Date().toISOString(),
        ref: `MT-${Math.floor(100000 + Math.random() * 900000)}`,
        method: 'MyTap Wallet',
        status: 'completed' as const,
        icon: '📱',
        color: '#3B2560',
      };
      dispatch({ type: 'ADD_RECEIPT', receipt: r });
      setReceipt(r);
      setStage('success');
      haptics.paymentSuccess();
    }, 800);
  };

  const primaryLabel = mode === 'receive' ? 'Share QR Code' : mode === 'scan' ? 'Scan to Pay' : 'Pay Now';

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScreenContainer>
        {/* Header */}
        <StaggeredItem index={0}>
          <View style={styles.header}>
            <PressableScale
              style={[styles.backBtn, { backgroundColor: theme.surface, borderColor: theme.hairline }]}
              onPress={() => {
                haptics.light();
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={21} color={theme.text} />
            </PressableScale>
            <Text style={[styles.title, { color: theme.text }]}>QR Pay</Text>
          </View>
        </StaggeredItem>

        {/* Segmented control */}
        <StaggeredItem index={1}>
          <View style={[styles.segment, { backgroundColor: theme.surface, borderColor: theme.hairline }]}>
            {segments.map((s) => {
              const active = mode === s.key;
              return (
                <PressableScale
                  key={s.key}
                  style={[styles.segmentBtn, active && { backgroundColor: theme.primary }]}
                  scaleTo={0.97}
                  onPress={() => {
                    setMode(s.key);
                    haptics.selection();
                  }}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      { color: active ? '#fff' : theme.textSecondary },
                    ]}
                  >
                    {s.label}
                  </Text>
                </PressableScale>
              );
            })}
          </View>
        </StaggeredItem>

        {/* Main action area — sharp centred square frame */}
        <StaggeredItem index={2}>
          <View style={styles.actionArea}>
            <View
              style={[
                styles.qrFrame,
                { borderColor: theme.hairline, backgroundColor: '#FFFFFF' },
              ]}
            >
              {mode === 'scan' ? (
                <View style={styles.scanInner}>
                  <Ionicons name="scan-outline" size={104} color="#101828" />
                  {/* Corner reticle marks */}
                  <View style={[styles.corner, styles.cornerTL, { borderColor: theme.primary }]} />
                  <View style={[styles.corner, styles.cornerTR, { borderColor: theme.primary }]} />
                  <View style={[styles.corner, styles.cornerBL, { borderColor: theme.primary }]} />
                  <View style={[styles.corner, styles.cornerBR, { borderColor: theme.primary }]} />
                </View>
              ) : (
                <QrCode size={180} color="#101828" />
              )}
            </View>
            <Text style={[styles.qrHint, { color: theme.textMuted }]}>
              {mode === 'scan'
                ? 'Point your camera at a merchant QR code'
                : mode === 'pay'
                ? 'Enter an amount to generate a payment QR'
                : 'Show this code to receive a payment'}
            </Text>
          </View>
        </StaggeredItem>

        {/* Information feed */}
        <StaggeredItem index={3}>
          <GlassCard solid bubble={false}>
            {mode === 'pay' ? (
              <>
                <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Amount</Text>
                <View style={[styles.inputWrap, { borderColor: theme.hairline }]}>
                  <Text style={[styles.inputPrefix, { color: theme.textMuted }]}>P</Text>
                  <TextInput
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor={theme.textMuted}
                    style={[styles.input, { color: theme.text }]}
                  />
                </View>
              </>
            ) : (
              <InfoField
                label={mode === 'receive' ? 'Receiving account' : 'Paying from'}
                value={maskedPhone()}
                theme={theme}
              />
            )}
            <InfoField label="Linked number" value={MASKED_PHONE} theme={theme} chevron />
          </GlassCard>
        </StaggeredItem>
      </ScreenContainer>

      {/* Bottom full-width green pill */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + spacing.md }]} pointerEvents="box-none">
        <Button
          title={primaryLabel}
          onPress={() => {
            if (mode === 'pay') pay();
            else if (mode === 'receive') {
              haptics.success();
              show('QR code shared');
            } else {
              haptics.success();
              show('Scanning…');
            }
          }}
          fullWidth
        />
      </View>

      <SlideUpModal visible={stage === 'processing'} onClose={() => {}}>
        <View style={styles.center}>
          <ShimmerLoader />
          <Text style={[styles.centerText, { color: theme.text }]}>Processing…</Text>
        </View>
      </SlideUpModal>

      <SlideUpModal visible={stage === 'success'} onClose={() => setStage('idle')}>
        <View style={styles.center}>
          <SuccessCheck size={72} />
          <Text style={[styles.successTitle, { color: theme.text }]}>Payment successful</Text>
          <Text style={[styles.successAmount, { color: theme.text }]}>
            {receipt ? formatPula(receipt.amount) : ''}
          </Text>
          <Text style={[styles.successRef, { color: theme.textMuted }]}>
            {receipt ? `Ref ${receipt.ref}` : ''}
          </Text>
        </View>
        <Button title="Done" onPress={() => setStage('idle')} fullWidth />
      </SlideUpModal>
    </View>
  );
}

function InfoField({
  label,
  value,
  theme,
  chevron,
}: {
  label: string;
  value: string;
  theme: any;
  chevron?: boolean;
}) {
  return (
    <View style={[styles.infoRow, { borderTopColor: theme.hairline }]}>
      <Text style={[styles.infoLabel, { color: theme.textMuted }]}>{label}</Text>
      <View style={styles.infoValueWrap}>
        <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
        {chevron && <Ionicons name="chevron-down" size={15} color={theme.textMuted} />}
      </View>
    </View>
  );
}

function maskedPhone() {
  return '+267 71 ••• ••67';
}

const FRAME = 244;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...type.title,
  },
  segment: {
    flexDirection: 'row',
    borderRadius: radius.pill,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    ...type.caption,
    fontWeight: '600',
  },
  actionArea: {
    alignItems: 'center',
    marginVertical: spacing.xxl,
  },
  qrFrame: {
    width: FRAME,
    height: FRAME,
    borderRadius: radius.card,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  scanInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderWidth: 2.5,
  },
  cornerTL: {
    top: -FRAME / 2 + 20,
    left: -FRAME / 2 + 20,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: -FRAME / 2 + 20,
    right: -FRAME / 2 + 20,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: -FRAME / 2 + 20,
    left: -FRAME / 2 + 20,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: -FRAME / 2 + 20,
    right: -FRAME / 2 + 20,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  qrHint: {
    ...type.caption,
    textAlign: 'center',
    marginTop: spacing.lg,
    maxWidth: 260,
  },
  fieldLabel: {
    ...type.caption,
    marginBottom: spacing.sm,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  inputPrefix: {
    ...type.title,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...type.title,
    paddingVertical: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
  },
  infoLabel: {
    ...type.caption,
  },
  infoValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoValue: {
    ...type.body,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  center: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  centerText: {
    ...type.subheading,
    fontWeight: '600',
    marginTop: spacing.lg,
  },
  successTitle: {
    ...type.heading,
    fontWeight: '600',
    marginTop: spacing.lg,
  },
  successAmount: {
    ...type.display,
    marginTop: spacing.xs,
  },
  successRef: {
    ...type.caption,
    marginTop: 2,
  },
});
