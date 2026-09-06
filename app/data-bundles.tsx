import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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
import { dataBundles } from '../src/data/mock';
import { formatPula, shortDate } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function DataBundlesScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [selected, setSelected] = useState<any>(null);
  const [stage, setStage] = useState<'idle' | 'processing' | 'success'>('idle');

  const buy = () => {
    setStage('processing');
    haptics.processing();
    setTimeout(() => {
      dispatch({ type: 'BUY_DATA', bundle: { gb: selected.gb, price: selected.price, name: selected.name, provider: selected.provider } });
      dispatch({ type: 'PAY', cardId: 'wallet', amount: selected.price, merchant: `${selected.provider} Data`, category: 'Data', icon: '📶', color: selected.color, method: 'MyTap Wallet' });
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
          <Text style={[styles.title, { color: theme.text }]}>Data bundles</Text>
        </View>
      </StaggeredItem>

      <StaggeredItem index={1}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Mascom</Text>
        <GlassCard bubble={false}>
          {dataBundles.filter((b) => b.provider === 'Mascom').map((b, i) => (
            <PressableScale key={b.id} style={[styles.bundleRow, i > 0 && styles.divider]} onPress={() => { setSelected(b); haptics.selection(); }}>
              <View style={[styles.bundleIcon, { backgroundColor: b.color + '22' }]}>
                <Ionicons name="cellular" size={18} color={b.color} />
              </View>
              <View style={styles.bundleInfo}>
                <Text style={[styles.bundleName, { color: theme.text }]}>{b.name}</Text>
                <Text style={[styles.bundleValidity, { color: theme.textMuted }]}>{b.validity}</Text>
              </View>
              <Text style={[styles.bundlePrice, { color: theme.text }]}>{formatPula(b.price)}</Text>
            </PressableScale>
          ))}
        </GlassCard>
      </StaggeredItem>

      <StaggeredItem index={2}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Other networks</Text>
        <GlassCard bubble={false}>
          {dataBundles.filter((b) => b.provider !== 'Mascom').map((b, i) => (
            <PressableScale key={b.id} style={[styles.bundleRow, i > 0 && styles.divider]} onPress={() => { setSelected(b); haptics.selection(); }}>
              <View style={[styles.bundleIcon, { backgroundColor: b.color + '22' }]}>
                <Ionicons name="cellular" size={18} color={b.color} />
              </View>
              <View style={styles.bundleInfo}>
                <Text style={[styles.bundleName, { color: theme.text }]}>{b.provider} · {b.name}</Text>
                <Text style={[styles.bundleValidity, { color: theme.textMuted }]}>{b.validity}</Text>
              </View>
              <Text style={[styles.bundlePrice, { color: theme.text }]}>{formatPula(b.price)}</Text>
            </PressableScale>
          ))}
        </GlassCard>
      </StaggeredItem>

      <StaggeredItem index={3}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>History</Text>
        <GlassCard bubble={false}>
          {state.dataHistory.map((h, i) => (
            <View key={h.id} style={[styles.historyRow, i > 0 && styles.divider]}>
              <View style={[styles.bundleIcon, { backgroundColor: '#2ECC71' + '22' }]}>
                <Ionicons name="checkmark" size={16} color="#2ECC71" />
              </View>
              <View style={styles.bundleInfo}>
                <Text style={[styles.bundleName, { color: theme.text }]}>{h.bundle}</Text>
                <Text style={[styles.bundleValidity, { color: theme.textMuted }]}>{shortDate(h.date)}</Text>
              </View>
              <Text style={[styles.bundlePrice, { color: theme.text }]}>{formatPula(h.price)}</Text>
            </View>
          ))}
        </GlassCard>
      </StaggeredItem>

      <SlideUpModal visible={stage === 'processing'} onClose={() => {}}>
        <View style={styles.center}>
          <ShimmerLoader />
          <Text style={[styles.centerText, { color: theme.text }]}>Purchasing bundle…</Text>
        </View>
      </SlideUpModal>

      <SlideUpModal visible={stage === 'success'} onClose={() => setStage('idle')}>
        <View style={styles.center}>
          <SuccessCheck size={72} />
          <Text style={[styles.successTitle, { color: theme.text }]}>Bundle added!</Text>
          <Text style={[styles.successAmount, { color: theme.text }]}>{selected?.name}</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  bundleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,23,41,0.06)',
  },
  bundleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bundleInfo: {
    flex: 1,
  },
  bundleName: {
    fontSize: 15,
    fontWeight: '600',
  },
  bundleValidity: {
    fontSize: 12,
    marginTop: 2,
  },
  bundlePrice: {
    fontSize: 15,
    fontWeight: '600',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
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
    fontSize: 20,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  payBtn: {
    marginTop: spacing.sm,
  },
});