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
import { formatPula } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function QrScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [amount, setAmount] = useState('');
  const [stage, setStage] = useState<'idle' | 'processing' | 'success'>('idle');
  const [receipt, setReceipt] = useState<any>(null);
  const pay = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { show('Enter a valid amount', 'error'); return; }
    setStage('processing'); haptics.processing();
    setTimeout(() => {
      dispatch({ type: 'PAY', cardId: 'wallet', amount: amt, merchant: 'QR Merchant', category: 'QR pay', icon: '📱', color: '#6B3A8A', method: 'MyTap Wallet' });
      const r = { id: `r-${Date.now()}`, merchant: 'QR Merchant', category: 'QR pay', amount: amt, date: new Date().toISOString(), ref: `MT-${Math.floor(100000 + Math.random() * 900000)}`, method: 'MyTap Wallet', status: 'completed' as const, icon: '📱', color: '#6B3A8A' };
      dispatch({ type: 'ADD_RECEIPT', receipt: r }); setReceipt(r); setStage('success'); haptics.paymentSuccess();
    }, 800);
  };
  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}><Ionicons name="chevron-back" size={22} color={theme.text} /></PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>QR pay</Text>
        </View>
      </StaggeredItem>
      <StaggeredItem index={1}>
        <GlassCard bubbleColor="rgba(107,58,138,0.15)">
          <View style={styles.qrWrap}>
            <View style={[styles.qrBox, { borderColor: theme.border }]}>
              <View style={styles.qrGrid}>
                {Array.from({ length: 49 }).map((_, i) => (
                  <View key={i} style={[styles.qrCell, { backgroundColor: i % 3 === 0 || i % 5 === 0 ? theme.text : 'transparent' }]} />
                ))}
              </View>
            </View>
            <Text style={[styles.qrLabel, { color: theme.textMuted }]}>Scan to pay · MyTap Merchant</Text>
          </View>
        </GlassCard>
      </StaggeredItem>
      <StaggeredItem index={2}>
        <GlassCard bubble={false}>
          <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Amount</Text>
          <View style={[styles.inputWrap, { borderColor: theme.border }]}><Text style={[styles.inputPrefix, { color: theme.textMuted }]}>P</Text><TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor={theme.textMuted} style={[styles.input, { color: theme.text }]} /></View>
          <Button title="Pay" onPress={pay} style={styles.payBtn} />
        </GlassCard>
      </StaggeredItem>
      <SlideUpModal visible={stage === 'processing'} onClose={() => {}}><View style={styles.center}><Ionicons name="sync" size={40} color={theme.accent} /><Text style={[styles.centerText, { color: theme.text }]}>Processing…</Text></View></SlideUpModal>
      <SlideUpModal visible={stage === 'success'} onClose={() => setStage('idle')}>
        <Confetti active={stage === 'success'} />
        <View style={styles.center}><View style={[styles.successCircle, { backgroundColor: '#2ECC71' }]}><Ionicons name="checkmark" size={36} color="#fff" /></View><Text style={[styles.successTitle, { color: theme.text }]}>Payment successful!</Text><Text style={[styles.successAmount, { color: theme.text }]}>{receipt ? formatPula(receipt.amount) : ''}</Text></View>
        <Button title="Done" onPress={() => setStage('idle')} style={styles.payBtn} />
      </SlideUpModal>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 24, fontWeight: '700' },
  qrWrap: { alignItems: 'center', paddingVertical: spacing.xl },
  qrBox: { width: 200, height: 200, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  qrGrid: { flexDirection: 'row', flexWrap: 'wrap', width: '100%', height: '100%' },
  qrCell: { width: '14.28%', height: '14.28%' },
  qrLabel: { fontSize: 13 },
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
});