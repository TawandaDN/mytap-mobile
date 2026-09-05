import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { CardCarousel } from '../../src/components/cards/CardCarousel';
import { GlassCard } from '../../src/components/cards/GlassCard';
import { StaggeredItem } from '../../src/components/animations/Staggered';
import { Typewriter } from '../../src/components/animations/Typewriter';
import { CountUp } from '../../src/components/animations/CountUp';
import { useApp } from '../../src/store/AppStore';
import { greetingForHour, formatPx, shortDate, guardrailProfile } from '../../src/utils/format';
import { spacing } from '../../src/theme';
import { haptics } from '../../src/utils/haptics';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { state } = useApp();
  const greeting = greetingForHour(new Date().getHours());

  const quickActions = [
    { icon: 'send', label: 'Send', color: '#2ECC71' },
    { icon: 'scan', label: 'Scan', color: '#3498DB' },
    { icon: 'add', label: 'Add', color: '#F5A623' },
    { icon: 'arrow-up-circle', label: 'Top-up', color: '#FF6B4A' },
  ];

  return (
    <ScreenContainer>
      {/* Header */}
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textMuted }]}>
              <Typewriter text={`${greeting},`} speed={30} />
            </Text>
            <Text style={[styles.name, { color: theme.text }]}>Tawanda</Text>
          </View>
          <View style={styles.headerIcons}>
            <Pressable style={styles.iconBtn} onPress={() => haptics.light()}>
              <Ionicons name="notifications-outline" size={20} color={theme.text} />
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={() => haptics.light()}>
              <Ionicons name="settings-outline" size={20} color={theme.text} />
            </Pressable>
          </View>
        </View>
      </StaggeredItem>

      {/* Wallet cards carousel */}
      <StaggeredItem index={1}>
        <CardCarousel cards={state.cards} />
      </StaggeredItem>

      {/* Quick actions */}
      <StaggeredItem index={2}>
        <View style={styles.quickRow}>
          {quickActions.map((a) => (
            <Pressable key={a.label} style={styles.quickItem} onPress={() => haptics.medium()}>
              <View style={[styles.quickIcon, { backgroundColor: a.color + '22' }]}>
                <Ionicons name={a.icon as any} size={22} color={a.color} />
              </View>
              <Text style={[styles.quickLabel, { color: theme.textSecondary }]}>{a.label}</Text>
            </Pressable>
          ))}
        </View>
      </StaggeredItem>

      {/* MyTap Day card */}
      <StaggeredItem index={3}>
        <GlassCard style={styles.dayCard} bubbleColor="rgba(245,166,35,0.2)">
          <View style={styles.dayHeader}>
            <View>
              <Text style={[styles.dayTitle, { color: theme.text }]}>MyTap Day</Text>
              <Text style={[styles.daySub, { color: theme.textMuted }]}>Your daily reward is ready</Text>
            </View>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>Ready</Text>
            </View>
          </View>
          <View style={styles.dayReward}>
            <Text style={[styles.dayRewardLabel, { color: theme.textMuted }]}>Today's reward</Text>
            <CountUp value={12.5} format={(v) => `P${v.toFixed(2)}`} glow="gold" style={[styles.dayRewardValue, { color: theme.text }]} />
          </View>
        </GlassCard>
      </StaggeredItem>

      {/* Recent transactions */}
      <StaggeredItem index={4}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent transactions</Text>
          <Text style={[styles.seeAll, { color: theme.accent }]}>See all</Text>
        </View>
        <GlassCard bubble={false}>
          {state.transactions.slice(0, 3).map((tx, i) => (
            <View key={tx.id} style={[styles.txRow, i > 0 && styles.txDivider]}>
              <View style={[styles.txIcon, { backgroundColor: tx.color + '22' }]}>
                <Text style={styles.txEmoji}>{tx.icon}</Text>
              </View>
              <View style={styles.txInfo}>
                <Text style={[styles.txMerchant, { color: theme.text }]}>{tx.merchant}</Text>
                <Text style={[styles.txCategory, { color: theme.textMuted }]}>{tx.category} · {shortDate(tx.date)}</Text>
              </View>
              <Text style={[styles.txAmount, { color: '#E74C3C' }]}>{formatPx(tx.amount)}</Text>
            </View>
          ))}
        </GlassCard>
      </StaggeredItem>

      {/* Guardrail preview */}
      <StaggeredItem index={5}>
        <GlassCard bubble={false}>
          <View style={styles.guardrailHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>MyTap Guardrail</Text>
            <Text style={[styles.guardrailPct, { color: theme.accent }]}>{guardrailProfile.pct}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${guardrailProfile.pct}%`, backgroundColor: theme.accent }]} />
          </View>
          <Text style={[styles.guardrailText, { color: theme.textMuted }]}>
            P{guardrailProfile.used.toLocaleString()} used of P{guardrailProfile.monthlyLimit.toLocaleString()}
          </Text>
        </GlassCard>
      </StaggeredItem>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: 15,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  quickItem: {
    alignItems: 'center',
    gap: 6,
  },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  dayCard: {
    marginBottom: spacing.xl,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  daySub: {
    fontSize: 13,
    marginTop: 2,
  },
  dayBadge: {
    backgroundColor: '#2ECC71',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  dayBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  dayReward: {
    marginTop: spacing.lg,
  },
  dayRewardLabel: {
    fontSize: 13,
  },
  dayRewardValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  txDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,23,41,0.06)',
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  txEmoji: {
    fontSize: 18,
  },
  txInfo: {
    flex: 1,
  },
  txMerchant: {
    fontSize: 15,
    fontWeight: '600',
  },
  txCategory: {
    fontSize: 12,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '600',
  },
  guardrailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  guardrailPct: {
    fontSize: 20,
    fontWeight: '700',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(15,23,41,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  guardrailText: {
    fontSize: 13,
    marginTop: spacing.sm,
  },
});