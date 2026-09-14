import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
import { spacing } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function InsuranceScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state } = useApp();
  const { show } = useToast();
  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}><Ionicons name="chevron-back" size={22} color={theme.text} /></PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>Insurance</Text>
        </View>
      </StaggeredItem>
      <StaggeredItem index={1}>
        <GlassCard bubbleColor="rgba(52,152,219,0.15)">
          <Text style={[styles.coverLabel, { color: theme.textMuted }]}>Total cover</Text>
          <Text style={[styles.coverValue, { color: theme.text }]}>{formatPula(state.insurance.reduce((s, p) => s + p.coverage, 0))}</Text>
          <Text style={[styles.coverSub, { color: theme.textMuted }]}>across {state.insurance.length} policies</Text>
        </GlassCard>
      </StaggeredItem>
      {state.insurance.map((p, i) => (
        <StaggeredItem key={p.id} index={i + 2}>
          <GlassCard bubble={false}>
            <View style={styles.policyHeader}>
              <View style={[styles.policyIcon, { backgroundColor: p.color + '22' }]}><Ionicons name="shield-checkmark" size={20} color={p.color} /></View>
              <View style={styles.policyInfo}><Text style={[styles.policyName, { color: theme.text }]}>{p.name}</Text><Text style={[styles.policyCover, { color: theme.textMuted }]}>Cover: {formatPula(p.coverage)}</Text></View>
              <View style={[styles.statusPill, { backgroundColor: p.status === 'active' ? '#2ECC71' : '#F5A623' }]}><Text style={styles.statusText}>{p.status === 'active' ? 'Active' : 'Pending'}</Text></View>
            </View>
            <View style={styles.policyFooter}>
              <Text style={[styles.premium, { color: theme.textMuted }]}>Premium {formatPula(p.premium)}/mo</Text>
              <Button title="Manage" variant="ghost" onPress={() => { haptics.light(); show(`${p.name} management (demo)`); }} />
            </View>
          </GlassCard>
        </StaggeredItem>
      ))}
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 24, fontWeight: '700' },
  coverLabel: { fontSize: 14 },
  coverValue: { fontSize: 40, fontWeight: '700', marginTop: spacing.sm },
  coverSub: { fontSize: 13, marginTop: 4 },
  policyHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  policyIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  policyInfo: { flex: 1 },
  policyName: { fontSize: 16, fontWeight: '600' },
  policyCover: { fontSize: 12, marginTop: 2 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  policyFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.lg },
  premium: { fontSize: 13 },
});