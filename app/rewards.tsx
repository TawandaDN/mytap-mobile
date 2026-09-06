import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { CountUp } from '../src/components/animations/CountUp';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { shortDate } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function RewardsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}><Ionicons name="chevron-back" size={22} color={theme.text} /></PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>Rewards</Text>
        </View>
      </StaggeredItem>
      <StaggeredItem index={1}>
        <GlassCard bubbleColor="rgba(245,166,35,0.2)">
          <Text style={[styles.pointsLabel, { color: theme.textMuted }]}>MyTap Points</Text>
          <CountUp value={state.totalPoints} format={(v) => v.toLocaleString()} glow="gold" style={[styles.pointsValue, { color: theme.text }]} />
          <Text style={[styles.pointsSub, { color: theme.textMuted }]}>≈ P{Math.round(state.totalPoints / 10)} in rewards</Text>
        </GlassCard>
      </StaggeredItem>
      <StaggeredItem index={2}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Available rewards</Text>
        <GlassCard bubble={false}>
          {state.rewards.map((r, i) => (
            <PressableScale key={r.id} style={[styles.rewardRow, i > 0 && styles.rewardDivider]} onPress={() => { haptics.medium(); dispatch({ type: 'REDEEM_POINTS', points: r.points }); show(`Redeemed ${r.points} points for ${r.title}`); }}>
              <View style={[styles.rewardIcon, { backgroundColor: r.color + '22' }]}><Text style={styles.rewardEmoji}>{r.icon}</Text></View>
              <View style={styles.rewardInfo}><Text style={[styles.rewardName, { color: theme.text }]}>{r.title}</Text><Text style={[styles.rewardExpiry, { color: theme.textMuted }]}>Expires {shortDate(r.expires)}</Text></View>
              <View style={[styles.pointsPill, { backgroundColor: r.color + '22' }]}><Text style={[styles.pointsText, { color: r.color }]}>{r.points} pts</Text></View>
            </PressableScale>
          ))}
        </GlassCard>
      </StaggeredItem>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 24, fontWeight: '700' },
  pointsLabel: { fontSize: 14 },
  pointsValue: { fontSize: 44, fontWeight: '700', marginTop: spacing.sm },
  pointsSub: { fontSize: 13, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: spacing.xl, marginBottom: spacing.md },
  rewardRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md },
  rewardDivider: { borderTopWidth: 1, borderTopColor: 'rgba(15,23,41,0.06)' },
  rewardIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rewardEmoji: { fontSize: 18 },
  rewardInfo: { flex: 1 },
  rewardName: { fontSize: 15, fontWeight: '600' },
  rewardExpiry: { fontSize: 12, marginTop: 2 },
  pointsPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  pointsText: { fontSize: 12, fontWeight: '700' },
});