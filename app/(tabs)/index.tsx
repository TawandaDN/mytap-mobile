import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { GlassCard } from '../../src/components/cards/GlassCard';
import { HomeCard } from '../../src/components/cards/HomeCard';
import { HubHeader } from '../../src/components/ui/HubHeader';
import { QuickActionsGrid, QuickAction } from '../../src/components/ui/QuickActionsGrid';
import { ContactsCarousel } from '../../src/components/ui/ContactsCarousel';
import { StaggeredItem } from '../../src/components/animations/Staggered';
import { CountUp } from '../../src/components/animations/CountUp';
import { Sparkline } from '../../src/components/charts/Sparkline';
import { useApp } from '../../src/store/AppStore';
import { userProfile } from '../../src/data/mock';
import { greetingForHour, formatPx, formatPula, shortDate } from '../../src/utils/format';
import { buildInsights } from '../../src/utils/insights';
import { spacing, type, radius, shadows } from '../../src/theme';
import { haptics } from '../../src/utils/haptics';
import { PressableScale } from '../../src/components/ui/PressableScale';
import { useState } from 'react';

/**
 * Home dashboard — premium banking layout.
 * Deep purple→blue gradient header → soft warm-white canvas.
 * Account grid · quick-transfer contacts · quick actions · live insights ·
 * recent transactions with an animated ledger sparkline · guardrail preview.
 */
export default function HomeScreen() {
  const { theme } = useTheme();
  const { state } = useApp();
  const router = useRouter();
  const [search, setSearch] = useState('');

  const greeting = greetingForHour(new Date().getHours());
  const primaryCard = state.cards[0];
  const totalBalance = state.cards.reduce((sum, c) => sum + c.balance, 0);
  const insights = buildInsights(state.transactions);
  const topInsight = insights[0];
  const unread = state.notifications.filter((n) => !n.read).length;
  const g = state.guardrail;

  const quickActions: QuickAction[] = [
    { icon: 'send', label: 'Send', color: '#0E8A5F', route: '/send' },
    { icon: 'card', label: 'Pay', color: '#1E4FA8', route: '/pay' },
    { icon: 'radio', label: 'Tap to Pay', color: '#6D5AE6', route: '/pay' },
    { icon: 'add', label: 'Top up', color: '#B8892B', route: '/cards' },
    { icon: 'phone-portrait', label: 'Airtime', color: '#E5604A', route: '/airtime' },
    { icon: 'cellular', label: 'Data', color: '#0E8A5F', route: '/data-bundles' },
    { icon: 'flash', label: 'Bills', color: '#B8892B', route: '/utilities' },
    { icon: 'qr-code', label: 'QR', color: '#3B2560', route: '/qr' },
  ];

  const go = (route: string) => {
    haptics.medium();
    router.push(route as any);
  };

  // Ledger sparkline — real-time cumulative balance from recent activity.
  const sparkData = state.transactions
    .slice(0, 8)
    .reverse()
    .reduce<number[]>((acc, tx) => {
      const last = acc.length ? acc[acc.length - 1] : primaryCard.balance;
      acc.push(Math.max(0, last + tx.amount));
      return acc;
    }, []);

  const hasSpark = sparkData.length >= 2;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        stickyHeaderIndices={undefined}
      >
        {/* Gradient header block */}
        <HubHeader
          greeting={greeting}
          name={userProfile.name}
          initial={userProfile.name[0]}
          balance={totalBalance}
          searchValue={search}
          onSearchChange={setSearch}
          onAvatarPress={() => go('/profile')}
          onCartPress={() => go('/utilities')}
          onBellPress={() => go('/notifications')}
          unreadCount={unread}
        />

        <View style={styles.body}>
          {/* Primary card */}
          <StaggeredItem index={0} style={styles.cardWrap}>
            <HomeCard card={primaryCard} sparkData={hasSpark ? sparkData : [1, 1]} onPress={() => go('/cards')} />
          </StaggeredItem>

          {/* Account grid — 2 columns */}
          <StaggeredItem index={1}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Your accounts</Text>
              <PressableScale onPress={() => go('/cards')}>
                <Text style={[styles.seeAll, { color: theme.primary }]}>See all</Text>
              </PressableScale>
            </View>
            <View style={styles.grid}>
              {state.cards.map((c) => (
                <PressableScale
                  key={c.id}
                  style={[styles.acctTile, { backgroundColor: theme.surface, borderColor: theme.hairline }]}
                  onPress={() => {
                    haptics.medium();
                    router.push('/cards' as any);
                  }}
                >
                  <View style={styles.acctTop}>
                    <View style={[styles.acctIcon, { backgroundColor: c.gradient[1] + '16' }]}>
                      <Ionicons name="card" size={15} color={c.gradient[1]} />
                    </View>
                    <Text style={[styles.acctLast4, { color: theme.textMuted }]}>••{c.last4.slice(-2)}</Text>
                  </View>
                  <Text style={[styles.acctName, { color: theme.textMuted }]} numberOfLines={1}>
                    {c.name}
                  </Text>
                  <Text style={[styles.acctBalance, { color: theme.text }]} numberOfLines={1}>
                    {formatPula(c.balance)}
                  </Text>
                  {c.frozen && (
                    <Text style={[styles.acctFrozen, { color: theme.danger }]}>Frozen</Text>
                  )}
                </PressableScale>
              ))}
              {/* Reward points tile */}
              <PressableScale
                style={[styles.acctTile, { backgroundColor: theme.surface, borderColor: theme.hairline }]}
                onPress={() => {
                  haptics.medium();
                  go('/rewards');
                }}
              >
                <View style={styles.acctTop}>
                  <View style={[styles.acctIcon, { backgroundColor: theme.gold + '16' }]}>
                    <Ionicons name="gift" size={15} color={theme.gold} />
                  </View>
                  <Ionicons name="chevron-forward" size={13} color={theme.textMuted} />
                </View>
                <Text style={[styles.acctName, { color: theme.textMuted }]}>Reward points</Text>
                <CountUp
                  value={state.totalPoints}
                  format={(v) => `${Math.round(v).toLocaleString('en-BW')} pts`}
                  duration={400}
                  glow="none"
                  style={[styles.acctBalance, { color: theme.text }]}
                />
              </PressableScale>
            </View>
          </StaggeredItem>

          {/* Quick-transfer contacts */}
          <StaggeredItem index={2}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Send to</Text>
              <PressableScale onPress={() => go('/send')}>
                <Text style={[styles.seeAll, { color: theme.primary }]}>See all</Text>
              </PressableScale>
            </View>
            <ContactsCarousel onPress={() => go('/send')} />
          </StaggeredItem>

          {/* Quick actions */}
          <StaggeredItem index={3}>
            <Text style={[styles.sectionTitle, styles.sectionTitleFlush, { color: theme.text }]}>
              Quick actions
            </Text>
            <QuickActionsGrid actions={quickActions} onPress={go} />
          </StaggeredItem>

          {/* Live insights snapshot */}
          <StaggeredItem index={4}>
            <PressableScale onPress={() => go('/insights')}>
              <GlassCard solid bubbleColor={`${theme.indicator}14`} style={styles.insightCard}>
                <View style={styles.insightRow}>
                  <View
                    style={[
                      styles.insightIcon,
                      { backgroundColor: (topInsight?.color || theme.indicator) + '16' },
                    ]}
                  >
                    <Ionicons
                      name={(topInsight?.icon as any) || 'sparkles'}
                      size={19}
                      color={topInsight?.color || theme.indicator}
                    />
                  </View>
                  <View style={styles.insightInfo}>
                    <Text style={[styles.insightEyebrow, { color: theme.textMuted }]}>
                      INTELLIGENT INSIGHTS
                    </Text>
                    <Text style={[styles.insightTitle, { color: theme.text }]} numberOfLines={1}>
                      {topInsight?.title || 'Your insights'}
                    </Text>
                    <Text style={[styles.insightSub, { color: theme.textMuted }]} numberOfLines={1}>
                      {topInsight?.body || 'Tap to see your personalized insights'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={17} color={theme.textMuted} />
                </View>
              </GlassCard>
            </PressableScale>
          </StaggeredItem>

          {/* Recent transactions */}
          <StaggeredItem index={5}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent transactions</Text>
              <PressableScale onPress={() => go('/transactions')}>
                <Text style={[styles.seeAll, { color: theme.primary }]}>See all</Text>
              </PressableScale>
            </View>
            <GlassCard solid bubble={false}>
              <View style={[styles.spending, { borderBottomColor: theme.hairline }]}>
                <View>
                  <Text style={[styles.sparkTitle, { color: theme.textMuted }]}>Spending trend</Text>
                  <Text style={[styles.sparkValue, { color: theme.text }]}>Last 8 transactions</Text>
                </View>
                {hasSpark && (
                  <Sparkline data={sparkData} width={104} height={34} color={theme.indicator} />
                )}
              </View>
              {state.transactions.slice(0, 3).map((tx, i) => (
                <PressableScale
                  key={tx.id}
                  style={[styles.txRow, i > 0 && { borderTopWidth: 1, borderTopColor: theme.hairline }]}
                  onPress={() => go('/transactions')}
                >
                  <View style={[styles.txIcon, { backgroundColor: tx.color + '16' }]}>
                    <Text style={styles.txEmoji}>{tx.icon}</Text>
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={[styles.txMerchant, { color: theme.text }]} numberOfLines={1}>
                      {tx.merchant}
                    </Text>
                    <Text style={[styles.txCategory, { color: theme.textMuted }]} numberOfLines={1}>
                      {tx.category} · {shortDate(tx.date)}
                    </Text>
                  </View>
                  <Text style={[styles.txAmount, { color: theme.text }]}>{formatPx(tx.amount)}</Text>
                </PressableScale>
              ))}
            </GlassCard>
          </StaggeredItem>

          {/* Guardrail preview */}
          <StaggeredItem index={6}>
            <PressableScale onPress={() => go('/guardrail')}>
              <GlassCard solid bubble={false}>
                <View style={styles.guardrailHeader}>
                  <View>
                    <Text style={[styles.sparkTitle, { color: theme.textMuted }]}>MyTap Guardrail</Text>
                    <Text style={[styles.sparkValue, { color: theme.text }]}>
                      P{g.used.toLocaleString()} of P{g.monthlyLimit.toLocaleString()}
                    </Text>
                  </View>
                  <Text style={[styles.guardrailPct, { color: theme.indicator }]}>{g.pct}%</Text>
                </View>
                {/* Dual-tone track: soft grey background + crisp violet indicator */}
                <View style={[styles.progressTrack, { backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(16,24,40,0.07)' }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(100, g.pct)}%`, backgroundColor: theme.indicator },
                    ]}
                  />
                </View>
              </GlassCard>
            </PressableScale>
          </StaggeredItem>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    paddingBottom: 120,
  },
  body: {
    paddingHorizontal: spacing.lg,
  },
  cardWrap: {
    marginTop: -spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...type.heading,
  },
  sectionTitleFlush: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  seeAll: {
    ...type.caption,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  acctTile: {
    width: '48.6%',
    borderRadius: radius.card,
    borderWidth: 1,
    padding: spacing.md,
    ...shadows.subtle,
  },
  acctTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  acctIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acctLast4: {
    ...type.small,
    fontVariant: ['tabular-nums'],
  },
  acctName: {
    ...type.caption,
    fontSize: 12,
  },
  acctBalance: {
    ...type.money,
    marginTop: 2,
  },
  acctFrozen: {
    ...type.small,
    fontWeight: '600',
    marginTop: 2,
  },
  insightCard: {
    marginTop: spacing.xl,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightInfo: {
    flex: 1,
  },
  insightEyebrow: {
    ...type.small,
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  insightTitle: {
    ...type.body,
    fontWeight: '600',
  },
  insightSub: {
    ...type.caption,
    fontSize: 12,
    marginTop: 1,
  },
  spending: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  sparkTitle: {
    ...type.caption,
    fontSize: 12,
  },
  sparkValue: {
    ...type.subheading,
    fontWeight: '600',
    marginTop: 1,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  txEmoji: {
    fontSize: 15,
  },
  txInfo: {
    flex: 1,
    marginRight: spacing.sm,
  },
  txMerchant: {
    ...type.body,
    fontWeight: '600',
  },
  txCategory: {
    ...type.caption,
    fontSize: 12,
    marginTop: 1,
  },
  txAmount: {
    ...type.money,
  },
  guardrailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  guardrailPct: {
    ...type.heading,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});
