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
import { Confetti } from '../src/components/animations/Confetti';
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
  const [provider, setProvider] = useState('Mascom');
  const [selected, setSelected] = useState<any>(null);
  const [stage, setStage] = useState<'idle' | 'processing' | 'success'>('idle');
  const providers = ['Mascom', 'BTC', 'Orange'];
  const bundles = dataBundles.filter((b) => b.provider === provider);
  const buy = () => {
    setStage('processing'); haptics.processing();
    setTimeout(() => {
      dispatch({ type: 'BUY_DATA', bundle: { gb: selected.gb, price: selected.price, name: selected.name, provider: selected.provider } });
      dispatch({ type: 'PAY', cardId: 'wallet', amount: selected.price, merchant: `${selected.provider} Data`, category: 'Data', icon: '📶', color: selected.color, method: 'MyTap Wallet' });
      setStage('success'); haptics.paymentSuccess();
    }, 800);
  };
  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}><Ionicons name="chevron-back" size={22} color={theme.text} /></PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>Data bundles</Text>
        </View>
      </StaggeredItem>
      <StaggeredItem index={1}>
        <View style={styles.providers}>
          {providers.map((p) => (
            <PressableScale key={p} style={[styles.providerChip, { backgroundColor: provider === p ? theme.accent : theme.surface, borderColor: theme.border }]} onPress={() => { setProvider(p); haptics.selection(); }}><Text style={[styles.providerText, { color: provider === p ? '#fff' : theme.textSecondary }]}>{p}</Text></PressableScale>
          ))}
        </View>
      </StaggeredItem>
      <StaggeredItem index={2}>
        <GlassCard bubble={false}>
          {bundles.map((b, i) => (
            <PressableScale key={b.id} style={[styles.bundleRow, i > 0 && styles.divider]} onPress={() => { setSelected(b); haptics.selection(); }}>
              <View style={[styles.bundleIcon, { backgroundColor: b.color + '22' }]}><Ionicons name="cellular" size={18} color={b.color} /></View>
              <View style={styles.bundleInfo}><Text style={[styles.bundleName, { color: theme.text }]}>{b.name}</Text><Text style={[styles.bundleValidity, { color: theme.textMuted }]}>{b.validity}</Text></View>
              <Text style={[styles.bundlePrice, { color: theme.text }]}>{formatPula(b.price)}</Text>
            </PressableScale>
          ))}
        </GlassCard>
      </StaggeredItem>
      <StaggeredItem index={3}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Purchase history</Text>
        <GlassCard bubble={false}>
          {state.dataHistory.map((h, i) => (
            <View key={h.id} style={[styles.historyRow, i > 0 && styles.divider]}>
              <View style={[styles.bundleIcon, { backgroundColor: h.status === 'active' ? '#2ECC71' + '22' : 'rgba(15,23,41,0.08)' }]}><Ionicons name="checkmark" size={16} color={h.status === 'active' ? '#2ECC71' : theme.textMuted} /></View>
              <View style={styles.bundleInfo}><Text style={[styles.bundleName, { color: theme.text }]}>{h.bundle}</Text><Text style={[styles.bundleValidity, { color: theme.textMuted }]}>{shortDate(h.date)} · {h.gb}GB</Text></View>
              <Text style={[styles.bundlePrice, { color: theme.text }]}>{formatPula(h.price)}</Text>
            </View>
          ))}
        </GlassCard>
      </StaggeredItem>
      <SlideUpModal visible={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Buy {selected.name}</Text>
            <Text style={[styles.modalSub, { color: theme.textMuted }]}>{selected.provider} · {selected.validity}</Text>
            <View style={[styles.confirmAmount, { borderColor: theme.border }]}><Text style={[styles.confirmLabel, { color: theme.textMuted }]}>Price</Text><Text style={[styles.confirmValue, { color: theme.text }]}>{formatPula(selected.price)}</Text></View>
            <Button title="Buy now" onPress={buy} style={styles.modalBtn} />
          </>
        )}
      </SlideUpModal>
      <SlideUpModal visible={stage === 'processing'} onClose={() => {}}><View style={styles.center}><Ionicons name="sync" size={40} color={theme.accent} /><Text style={[styles.centerText, { color: theme.text }]}>Purchasing…</Text></View></SlideUpModal>
      <SlideUpModal visible={stage === 'success'} onClose={() => setStage('idle')}>
        <Confetti active={stage === 'success'} />
        <View style={styles.center}><View style={[styles.successCircle, { backgroundColor: '#2ECC71' }]}><Ionicons name="checkmark" size={36} color="#fff" /></View><Text style={[styles.successTitle, { color: theme.text }]}>Bundle added!</Text><Text style={[styles.successSub, { color: theme.textMuted }]}>{selected?.name} is now active</Text></View>
        <Button title="Done" onPress={() => setStage('idle')} style={styles.modalBtn} />
      </SlideUpModal>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 24, fontWeight: '700' },
  providers: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  providerChip: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: radius.pill, borderWidth: 1 },
  providerText: { fontSize: 14, fontWeight: '600' },
  bundleRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md },
  divider: { borderTopWidth: 1, borderTopColor: 'rgba(15,23,41,0.06)' },
  bundleIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  bundleInfo: { flex: 1 },
  bundleName: { fontSize: 15, fontWeight: '600' },
  bundleValidity: { fontSize: 12, marginTop: 2 },
  bundlePrice: { fontSize: 15, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: spacing.xl, marginBottom: spacing.md },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  modalSub: { fontSize: 14, marginBottom: spacing.xl },
  confirmAmount: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  confirmLabel: { fontSize: 14 },
  confirmValue: { fontSize: 20, fontWeight: '700' },
  modalBtn: { marginTop: spacing.sm },
  center: { alignItems: 'center', paddingVertical: spacing.xl },
  centerText: { fontSize: 17, fontWeight: '600', marginTop: spacing.lg },
  successCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  successTitle: { fontSize: 22, fontWeight: '700' },
  successSub: { fontSize: 15, marginTop: 4 },
});