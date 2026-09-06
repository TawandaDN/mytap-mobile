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
      {state.insurance.map((p, i) => (
        <StaggeredItem key={p.id} index={i + 1}>
          <GlassCard bubbleColor={p.color + '22'}>
            <View style={styles.policyHeader}>
              <View style={[styles.policyIcon, { backgroundColor: p.color + '22' }]}><Text style={styles.policyEmoji}>{p.icon}</Text></View>
              <View style={styles.policyInfo}><Text style={[styles.policyName, { color: theme.text }]}>{p.name}</Text><Text style={[styles.policyType, { color: theme.textMuted }]}>{p.type} cover</Text></View>
              <View style={[styles.statusPill, { backgroundColor: p.status === 'active' ? '#2ECC71' : '#3498DB' }]}><Text style={styles.statusText}>{p.status === 'active' ? 'Active' : 'Eligible'}</Text></View>
            </View>
            <View style={styles.policyStats}>
              <View style={styles.stat}><Text style={[styles.statLabel, { color: theme.textMuted }]}>Coverage</Text><Text style={[styles.statValue, { color: theme.text }]}>{formatPula(p.coverage)}</Text></View>
              <View style={styles.statDivider} />
              <View style={styles.stat}><Text style={[styles.statLabel, { color: theme.textMuted }]}>Premium</Text><Text style={[styles.statValue, { color: theme.text }]}>{p.premium > 0 ? `${formatPula(p.premium)}/mo` : 'Free'}</Text></View>
            </View>
            {p.status === 'eligible' && <Button title="Get cover" variant="secondary" style={styles.getBtn} onPress={() => { haptics.success(); show('Cover activated (demo)'); }} />}
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
  policyHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  policyIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  policyEmoji: { fontSize: 20 },
  policyInfo: { flex: 1 },
  policyName: { fontSize: 16, fontWeight: '600' },
  policyType: { fontSize: 12, marginTop: 2 },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  policyStats: { flexDirection: 'row', marginTop: spacing.lg },
  stat: { flex: 1 },
  statLabel: { fontSize: 12 },
  statValue: { fontSize: 20, fontWeight: '700', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(15,23,41,0.08)' },
  getBtn: { marginTop: spacing.lg },
});