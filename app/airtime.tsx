import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { Button } from '../src/components/ui/Button';
import { SlideUpModal } from '../src/components/ui/SlideUpModal';
import { ShimmerLoader } from '../src/components/ui/ShimmerLoader';
import { SuccessCheck } from '../src/components/ui/SuccessCheck';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { airtimeNetworks } from '../src/data/mock';
import { formatPula } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function AirtimeScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [network, setNetwork] = useState(airtimeNetworks[0]);
  const [phone, setPhone] = useState('+267 71 234 567');
  const [amount, setAmount] = useState('');
  const [stage, setStage] = useState<'idle' | 'processing' | 'success'>('idle');
  const [receipt, setReceipt] = useState<any>(null);

  const buy = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      show('Enter a valid amount', 'error');
      return;
    }
    setStage('processing');
    haptics.processing();
    setTimeout(() => {
      dispatch({ type: 'PAY', cardId: 'wallet', amount: amt, merchant: `${network.name} Airtime`, category: 'Airtime', icon: network.icon, color: network.color, method: 'MyTap Wallet' });
      const r = {
        id: `r-${Date.now()}`,
        merchant: `${network.name} Airtime`,
        category: 'Airtime',
        amount: amt,
        date: new Date().toISOString(),
        ref: `MT-${Math.floor(100000 + Math.random() * 900000)}`,
        method: 'MyTap Wallet',
        status: 'completed' as const,
        icon: network.icon,
        color: network.color,
      };
      dispatch({ type: 'ADD_RECEIPT', receipt: r });
      setReceipt(r);
      setStage('success');
      haptics.paymentSuccess();
    }, 800);
  };

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}>
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>Buy airtime</Text>
        </View>
      </StaggeredItem>

      <StaggeredItem index={1}>
        <View style={styles.grid}>
          {airtimeNetworks.map((n) => (
            <PressableScale
              key={n.id}
              style={[styles.netCard, { backgroundColor: theme.surface, borderColor: network.id === n.id ? theme.accent : theme.border }]}
              onPress={() => { setNetwork(n); haptics.selection(); }}
            >
              <View style={[styles.netIcon, { backgroundColor: n.color + '22' }]}>
                <Text style={styles.netEmoji}>{n.icon}</Text>
              </View>
              <Text style={[styles.netName, { color: theme.text }]}>{n.name}</Text>
            </PressableScale>
          ))}
        </View>
      </StaggeredItem>

      <StaggeredItem index={2}>
        <GlassCard bubble={false}>
          <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Phone number</Text>
          <View style={[styles.inputWrap, { borderColor: theme.border }]}>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+267 7X XXX XXX"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.text }]}
            />
          </View>
          <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Amount</Text>
          <View style={styles.quickAmounts}>
            {[10, 20, 30, 50, 100].map((a) => (
              <PressableScale key={a} style={[styles.quickAmount, { backgroundColor: theme.surfaceAlt }]} onPress={() => { setAmount(String(a)); haptics.light(); }}>
                <Text style={[styles.quickAmountText, { color: theme.textSecondary }]}>P{a}</Text>
              </PressableScale>
            ))}
          </View>
          <View style={[styles.inputWrap, { borderColor: theme.border }]}>
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
          <Button title={`Buy ${network.name} airtime`} onPress={buy} style={styles.payBtn} />
        </GlassCard>
      </StaggeredItem>

      <SlideUpModal visible={stage === 'processing'} onClose={() => {}}>
        <View style={styles.center}>
          <ShimmerLoader />
          <Text style={[styles.centerText, { color: theme.text }]}>Processing…</Text>
        </View>
      </SlideUpModal>

      <SlideUpModal visible={stage === 'success'} onClose={() => setStage('idle')}>
        <View style={styles.center}>
          <SuccessCheck size={72} />
          <Text style={[styles.successTitle, { color: theme.text }]}>Airtime sent!</Text>
          <Text style={[styles.successAmount, { color: theme.text }]}>{receipt ? formatPula(receipt.amount) : ''}</Text>
          <Text style={[styles.successTo, { color: theme.textMuted }]}>to {phone}</Text>
        </View>
        <Button title="Done" onPress={() => setStage('idle')} style={styles.payBtn} />
      </SlideUpModal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  netCard: {
    width: '47%',
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 6,
  },
  netIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  netEmoji: {
    fontSize: 22,
  },
  netName: {
    fontSize: 15,
    fontWeight: '600',
  },
  fieldLabel: {
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  inputPrefix: {
    fontSize: 20,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    paddingVertical: spacing.lg,
  },
  quickAmounts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
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
  center: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  centerText: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: spacing.lg,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
  },
});