import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { Button } from '../src/components/ui/Button';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { formatPula } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function LoansScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state } = useApp();
  const { show } = useToast();
  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}><Ionicons name="chevron-back" size={22} color={theme.text} /></PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>Loans</Text>
        </View>
      </StaggeredItem>
      <StaggeredItem index={1}>
        <GlassCard bubbleColor="rgba(107,58,138,0.15)">
          <Text style={[styles.eligLabel, { color: theme.textMuted }]}>You're eligible for</Text>
          <Text style={[styles.eligValue, { color: theme.text }]}>P15,000</Text>
          <Text style={[styles.eligSub, { color: theme.textMuted }]}>Instant approval · low interest</Text>
        </GlassCard>
      </StaggeredItem>
      {state.loans.map((loan, i) => {
        const pct = Math.round((loan.paid / loan.amount) * 100);
        return (
          <StaggeredItem key={loan.id} index={i + 2}>
            <GlassCard bubble={false}>
              <View style={styles.loanHeader}>
                <View style={[styles.loanIcon, { backgroundColor: loan.color + '22' }]}><Ionicons name="card" size={20} color={loan.color} /></View>
                <View style={styles.loanInfo}>
                  <Text style={[styles.loanName, { color: theme.text }]}>{loan.name}</Text>
                  <Text style={[styles.loanMeta, { color: theme.textMuted }]}>{loan.interest}% interest · {loan.termMonths} months</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: loan.status === 'active' ? '#2ECC71' : '#3498DB' }]}><Text style={styles.statusText}>{loan.status === 'active' ? 'Active' : 'Eligible'}</Text></View>
              </View>
              <View style={styles.loanAmounts}>
                <View><Text style={[styles.loanLabel, { color: theme.textMuted }]}>Amount</Text><Text style={[styles.loanValue, { color: theme.text }]}>{formatPula(loan.amount)}</Text></View>
                <View style={styles.amountRight}><Text style={[styles.loanLabel, { color: theme.textMuted }]}>Paid</Text><Text style={[styles.loanValue, { color: theme.text }]}>{formatPula(loan.paid)}</Text></View>
              </View>
              <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: loan.color }]} /></View>
              <Text style={[styles.nextPayment, { color: theme.textMuted }]}>Next payment: {new Date(loan.nextPayment).toLocaleDateString('en-BW', { day: 'numeric', month: 'short' })}</Text>
              {loan.status === 'eligible' && <Button title="Apply now" variant="secondary" style={styles.applyBtn} onPress={() => { haptics.success(); show('Application submitted (demo)'); }} />}
            </GlassCard>
          </StaggeredItem>
        );
      })}
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 24, fontWeight: '700' },
  eligLabel: { fontSize: 14 },
  eligValue: { fontSize: 40, fontWeight: '700', marginTop: spacing.sm },
  eligSub: { fontSize: 13, marginTop: 4 },
  loanHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  loanIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  loanInfo: { flex: 1 },
  loanName: { fontSize: 16, fontWeight: '600' },
  loanMeta: { fontSize: 12, marginTop: 2 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  loanAmounts: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg, marginBottom: spacing.md },
  amountRight: { alignItems: 'flex-end' },
  loanLabel: { fontSize: 12 },
  loanValue: { fontSize: 20, fontWeight: '700', marginTop: 2 },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: 'rgba(15,23,41,0.08)', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  nextPayment: { fontSize: 12, marginTop: spacing.sm },
  applyBtn: { marginTop: spacing.lg },
});