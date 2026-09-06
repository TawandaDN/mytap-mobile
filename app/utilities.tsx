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
import { Confetti } from '../src/components/animations/Confetti';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { utilities } from '../src/data/mock';
import { formatPula } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function UtilitiesScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [selected, setSelected] = useState(utilities[0]);
  const [account, setAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [stage, setStage] = useState<'idle' | 'processing' | 'success'>('idle');
  const [receipt, setReceipt] = useState<any>(null);
  const pay = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { show('Enter a valid amount', 'error'); return; }
    if (!account) { show(`Enter your ${selected.accountLabel.toLowerCase()}`, 'error'); return; }
    setStage('processing'); haptics.processing();
    setTimeout(() => {
      dispatch({ type: 'PAY', cardId: 'wallet', amount: amt, merchant: selected.name, category: selected.category, icon: selected.icon, color: selected.color, method: 'MyTap Wallet' });
      const r = { id: `r-${Date.now()}`, merchant: selected.name, category: selected.category, amount: amt, date: new Date().toISOString(), ref: `MT-${Math.floor(100000 + Math.random() * 900000)}`, method: 'MyTap Wallet', status: 'completed' as const, icon: selected.icon, color: selected.color };
      dispatch({ type: 'ADD_RECEIPT', receipt: r }); setReceipt(r); setStage('success'); haptics.paymentSuccess();
    }, 800);
  };
  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}><Ionicons name="chevron-back" size={22} color={theme.text} /></PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>Pay bills</Text>
        </View>
      </StaggeredItem>
      <StaggeredItem index={1}>
        <View style={styles.grid}>
          {utilities.map((u) => (
            <PressableScale key={u.id} style={[styles.utilCard, { backgroundColor: theme.surface, borderColor: selected.id === u.id ? theme.accent : theme.border }]} onPress={() => { setSelected(u); setAccount(u.savedAccount || ''); haptics.selection(); }}>
              <View style={[styles.utilIcon, { backgroundColor: u.color + '22' }]}><Text style={styles.utilEmoji}>{u.icon}</Text></View>
              <Text style={[styles.utilName, { color: theme.text }]}>{u.name}</Text>
              <Text style={[styles.utilCat, { color: theme.textMuted }]}>{u.category}</Text>
            </PressableScale>
          ))}
        </View>
      </StaggeredItem>
      <StaggeredItem index={2}>
        <GlassCard bubble={false}>
          <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>{selected.accountLabel}</Text>
          <View style={[styles.inputWrap, { borderColor: theme.border }]}><TextInput value={account} onChangeText={setAccount} keyboardType="number-pad" placeholder={selected.accountPlaceholder} placeholderTextColor={theme.textMuted} style={[styles.input, { color: theme.text }]} /></View>
          <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Amount</Text>
          <View style={[styles.inputWrap, { borderColor: theme.border }]}><Text style={[styles.inputPrefix, { color: theme.textMuted }]}>P</Text><TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor={theme.textMuted} style={[styles.input, { color: theme.text }]} /></View>
          <Button title={`Pay ${selected.name}`} onPress={pay} style={styles.payBtn} />
        </GlassCard>
      </StaggeredItem>
      <SlideUpModal visible={stage === 'processing'} onClose={() => {}}><View style={styles.center}><Ionicons name="sync" size={40} color={theme.accent} /><Text style={[styles.centerText, { color: theme.text }]}>Processing payment…</Text></View></SlideUpModal>
      <SlideUpModal visible={stage === 'success'} onClose={() => setStage('idle')}>
        <Confetti active={stage === 'success'} />
        <View style={styles.center}>
          <View style={[styles.successCircle, { backgroundColor: '#2ECC71' }]}><Ionicons name="checkmark" size={36} color="#fff" /></View>
          <Text style={[styles.successTitle, { color: theme.text }]}>Payment successful!</Text>
          <Text style={[styles.successAmount, { color: theme.text }]}>{receipt ? formatPula(receipt.amount) : ''}</Text>
          <Text style={[styles.successTo, { color: theme.textMuted }]}>to {receipt?.merchant}</Text>
        </View>
        <Button title="Done" onPress={() => setStage('idle')} style={styles.payBtn} />
      </SlideUpModal>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 24, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  utilCard: { width: '47%', borderRadius: radius.lg, borderWidth: 1, padding: spacing.lg, alignItems: 'center', gap: 6 },
  utilIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  utilEmoji: { fontSize: 22 },
  utilName: { fontSize: 15, fontWeight: '600' },
  utilCat: { fontSize: 12 },
  fieldLabel: { fontSize: 13, marginBottom: spacing.sm },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: radius.lg, paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  inputPrefix: { fontSize: 20, fontWeight: '600', marginRight: spacing.sm },
  input: { flex: 1, fontSize: 18, fontWeight: '500', paddingVertical: spacing.lg },
  payBtn: { marginTop: spacing.sm },
  center: { alignItems: 'center', paddingVertical: spacing.xl },
  centerText: { fontSize: 17, fontWeight: '600', marginTop: spacing.lg },
  successCircle: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  successTitle: { fontSize: 22, fontWeight: '700' },
  successAmount: { fontSize: 32, fontWeight: '700', marginTop: spacing.sm },
  successTo: { fontSize: 15, marginTop: 4 },
});