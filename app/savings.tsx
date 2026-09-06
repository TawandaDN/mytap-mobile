import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { ProgressRing } from '../src/components/ui/ProgressRing';
import { Button } from '../src/components/ui/Button';
import { SlideUpModal } from '../src/components/ui/SlideUpModal';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { formatPula } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function SavingsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [contribGoal, setContribGoal] = useState<any>(null);
  const [amount, setAmount] = useState('');
  const contribute = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { show('Enter a valid amount', 'error'); return; }
    dispatch({ type: 'CONTRIBUTE_GOAL', goalId: contribGoal.id, amount: amt });
    dispatch({ type: 'PAY', cardId: 'wallet', amount: amt, merchant: contribGoal.name, category: 'Savings', icon: contribGoal.icon, color: contribGoal.color });
    setContribGoal(null); setAmount(''); haptics.success(); show(`Added ${formatPula(amt)} to ${contribGoal.name}`);
  };
  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}><Ionicons name="chevron-back" size={22} color={theme.text} /></PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>Savings Goals</Text>
        </View>
      </StaggeredItem>
      <StaggeredItem index={1}>
        <GlassCard bubbleColor="rgba(46,204,113,0.15)">
          <Text style={[styles.totalLabel, { color: theme.textMuted }]}>Total saved</Text>
          <Text style={[styles.totalValue, { color: theme.text }]}>{formatPula(state.savingsGoals.reduce((s, g) => s + g.saved, 0))}</Text>
          <Text style={[styles.totalSub, { color: theme.textMuted }]}>across {state.savingsGoals.length} goals</Text>
        </GlassCard>
      </StaggeredItem>
      {state.savingsGoals.map((g, i) => {
        const pct = Math.round((g.saved / g.target) * 100);
        return (
          <StaggeredItem key={g.id} index={i + 2}>
            <GlassCard bubble={false}>
              <View style={styles.goalRow}>
                <ProgressRing size={72} strokeWidth={7} progress={pct / 100} gradient={[g.color, g.color, g.color]}><Text style={[styles.goalPct, { color: theme.text }]}>{pct}%</Text></ProgressRing>
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalName, { color: theme.text }]}>{g.icon} {g.name}</Text>
                  <Text style={[styles.goalAmount, { color: theme.text }]}>{formatPula(g.saved)} <Text style={[styles.goalTarget, { color: theme.textMuted }]}>of {formatPula(g.target)}</Text></Text>
                  <Text style={[styles.goalMeta, { color: theme.textMuted }]}>P{g.monthly}/mo · by {new Date(g.deadline).toLocaleDateString('en-BW', { month: 'short', year: 'numeric' })}</Text>
                </View>
              </View>
              <PressableScale style={[styles.contributeBtn, { backgroundColor: g.color }]} onPress={() => { setContribGoal(g); setAmount(''); haptics.medium(); }}><Ionicons name="add" size={16} color="#fff" /><Text style={styles.contributeText}>Contribute</Text></PressableScale>
            </GlassCard>
          </StaggeredItem>
        );
      })}
      <SlideUpModal visible={!!contribGoal} onClose={() => setContribGoal(null)}>
        {contribGoal && (
          <>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Contribute to {contribGoal.name}</Text>
            <Text style={[styles.modalSub, { color: theme.textMuted }]}>{formatPula(contribGoal.saved)} of {formatPula(contribGoal.target)} saved</Text>
            <View style={[styles.inputWrap, { borderColor: theme.border }]}><Text style={[styles.inputPrefix, { color: theme.textMuted }]}>P</Text><TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor={theme.textMuted} style={[styles.input, { color: theme.text }]} /></View>
            <Button title="Add to goal" onPress={contribute} style={styles.modalBtn} />
          </>
        )}
      </SlideUpModal>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 24, fontWeight: '700' },
  totalLabel: { fontSize: 14 },
  totalValue: { fontSize: 40, fontWeight: '700', marginTop: spacing.sm },
  totalSub: { fontSize: 13, marginTop: 4 },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  goalPct: { fontSize: 16, fontWeight: '700' },
  goalInfo: { flex: 1 },
  goalName: { fontSize: 17, fontWeight: '700' },
  goalAmount: { fontSize: 18, fontWeight: '600', marginTop: 4 },
  goalTarget: { fontSize: 14, fontWeight: '400' },
  goalMeta: { fontSize: 12, marginTop: 4 },
  contributeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: radius.pill, marginTop: spacing.lg },
  contributeText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  modalSub: { fontSize: 14, marginBottom: spacing.xl },
  inputWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: radius.lg, paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
  inputPrefix: { fontSize: 24, fontWeight: '600', marginRight: spacing.sm },
  input: { flex: 1, fontSize: 24, fontWeight: '600', paddingVertical: spacing.lg },
  modalBtn: { marginTop: spacing.sm },
});