import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { GlassCard } from '../../src/components/cards/GlassCard';
import { HomeCard } from '../../src/components/cards/HomeCard';
import { QuickActionsGrid, QuickAction } from '../../src/components/ui/QuickActionsGrid';
import { StaggeredItem } from '../../src/components/animations/Staggered';
import { Typewriter } from '../../src/components/animations/Typewriter';
import { CountUp } from '../../src/components/animations/CountUp';
import { Sparkline } from '../../src/components/charts/Sparkline';
import { useApp } from '../../src/store/AppStore';
import { greetingForHour, formatPx, shortDate, guardrailProfile } from '../../src/utils/format';
import { buildInsights } from '../../src/utils/insights';
import { spacing } from '../../src/theme';
import { haptics } from '../../src/utils/haptics';
import { PressableScale } from '../../src/components/ui/PressableScale';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { state } = useApp();
  const router = useRouter();
  const greeting = greetingForHour(new Date().getHours());
  const primaryCard = state.cards[0];
  const insights = buildInsights(state.transactions);
  const topInsight = insights[0];

  const quickActions: QuickAction[] = [
    { icon: 'send', label: 'Send', color: '#2ECC71', route: '/send' },
    { icon: 'card', label: 'Pay', color: '#3498DB', route: '/pay' },
    { icon: 'radio', label: 'Tap to Pay', color: '#6B3A8A', route: '/pay' },
    { icon: 'add', label: 'Top up', color: '#F5A623', route: '/cards' },
    { icon: 'phone-portrait', label: 'Airtime', color: '#E67E22', route: '/airtime' },
    { icon: 'cellular', label: 'Data', color: '#2ECC71', route: '/data-bundles' },
    { icon: 'flash', label: 'Bills', color: '#FF6B4A', route: '/utilities' },
    { icon: 'qr-code', label: 'QR', color: '#8A4A9A', route: '/qr' },
  ];

  const go = (route: string) => {
    haptics.medium();
    router.push(route as any);
  };

  // Ledger sparkline data from recent transactions (cumulative balance)
  const sparkData = state.transactions
    .slice(0, 8)
    .reverse()
    .reduce<number[]>((acc, tx) => {
      const last = acc.length ? acc[acc.length - 1] : primaryCard.balance;
      acc.push(Math.max(0, last + tx.amount));
      return acc;
    }, []);

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
            <PressableScale style={styles.iconBtn} onPress={() => { haptics.light(); router.push('/notifications'); }}>
              <Ionicons name="notifications-outline" size={20} color={theme.text} />
            </PressableScale>
            <PressableScale style={styles.iconBtn} onPress={() => { haptics.light(); router.push('/settings'); }}>
              <Ionicons name="settings-outline" size={20} color={theme.text} />
            </PressableScale>
          </View>
        </View>
      </StaggeredItem>

      {/* Hero balance + primary card (Framer Motion) */}
      <StaggeredItem index={1}>
        <View style={styles.hero}>
          <Text style={[styles.heroLabel, { color: theme.textMuted }]}>Total balance</Text>
          <CountUp value={primaryCard.balance} format={(v) => `P${v.toLocaleString('en-BW', { minimumFractionDigits: 2 })}`} glow="emerald" style={[styles.heroBalance, { color: theme.text }]} />
        </View>
        <HomeCard card={primaryCard} sparkData={sparkData} onPress={() => go('/cards')} />
      </StaggeredItem>

      {/* Quick actions grid */}
      <StaggeredItem index={2}>
        <QuickActionsGrid actions={quickActions} onPress={go} />
      </StaggeredItem>

      {/* Live insights snapshot */}
      <StaggeredItem index={3}>
        <PressableScale onPress={() => go('/insights')}>
          <GlassCard bubbleColor={`${theme.accent}22`} style={styles.insightCard}>
            <View style={styles.insightRow}>
              <View style={[styles.insightIcon, { backgroundColor: (topInsight?.color || theme.accent) + '22' }]}>
                <Ionicons name={topInsight?.icon as any || 'sparkles'} size={20} color={topInsight?.color || theme.accent} />
              </View>
              <View style={styles.insightInfo}>
                <Text style={[styles.insightTitle, { color: theme.text }]}>{topInsight?.title || 'Your insights'}</Text>
                <Text style={[styles.insightSub, { color: theme.textMuted }]} numberOfLines={1}>
                  {topInsight?.body || 'Tap to see your personalized insights'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </View>
          </GlassCard>
        </PressableScale>
      </StaggeredItem>

      {/* Recent transactions with animated sparkline */}
      <StaggeredItem index={4}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent transactions</Text>
          <PressableScale onPress={() => go('/transactions')}>
            <Text style={[styles.seeAll, { color: theme.accent }]}>See all</Text>
          </PressableScale>
        </View>
        <GlassCard bubble={false}>
          <View style={styles.spending}>
            <Text style={[styles.sparkTitle, { color: theme.textMuted }]}>Spending trend</Text>
            <Sparkline data={sparkData} width={140} height={36} color={theme.accent} />
          </View>
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
  hero: {
    marginBottom: spacing.lg,
  },
  heroLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  heroBalance: {
    fontSize: 40,
    fontWeight: '700',
  },
  insightCard: {
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightInfo: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  insightSub: {
    fontSize: 13,
    marginTop: 2,
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
  spending: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sparkTitle: {
    fontSize: 13,
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