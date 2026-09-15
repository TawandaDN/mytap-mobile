import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/theme/ThemeContext';
import { useApp } from '../../src/store/AppStore';
import { GlassCard } from '../../src/components/cards/GlassCard';
import { TileIcon } from '../../src/components/ui/IconSystem';
import { Illustration } from '../../src/assets/illustrations';
import { HomeCard } from '../../src/components/cards/HomeCard';
import { HubHeader } from '../../src/components/ui/HubHeader';
import { QuickActionsGrid, QuickAction } from '../../src/components/ui/QuickActionsGrid';
import { PressableScale } from '../../src/components/ui/PressableScale';
import { ProgressRing } from '../../src/components/ui/ProgressRing';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { StaggeredItem } from '../../src/components/animations/Staggered';
import { Button } from '../../src/components/ui/Button';
import { ScreenHeader } from '../../src/components/ui/ScreenHeader';
import { formatPula, formatPx } from '../../src/utils/format';
import { haptics } from '../../src/utils/haptics';
import { radius, shadows, spacing, type } from '../../src/theme';

/** Quick actions — the eight primary verbs of the app. */
const QUICK_ACTIONS: QuickAction[] = [
  { icon: 'paper-plane-outline', label: 'Send', color: '#1E3A5F', route: '/send' },
  { icon: 'wallet-outline', label: 'Pay', color: '#0B6B4F', route: '/pay' },
  { icon: 'radio-outline', label: 'Tap to Pay', color: '#FF6B4A', route: '/pay' },
  { icon: 'add-circle-outline', label: 'Top up', color: '#2ECC71', route: '/send' },
  { icon: 'call-outline', label: 'Airtime', color: '#F5A623', route: '/airtime' },
  { icon: 'wifi-outline', label: 'Data', color: '#6B3A8A', route: '/data-bundles' },
  { icon: 'receipt-outline', label: 'Bills', color: '#1E3A5F', route: '/utilities' },
  { icon: 'qr-code-outline', label: 'QR', color: '#FF6B4A', route: '/qr' },
];

function dayLabel(d: Date) {
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const { state, dispatch } = useApp();
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [nfcDismissed, setNfcDismissed] = useState(false);

  const totalBalance = useMemo(
    () => state.cards.reduce((sum, c) => sum + c.balance, 0),
    [state.cards]
  );

  const unread = state.notifications.filter((n) => !n.read).length;
  const primary = state.cards[0];
  const tariff = state.tariff;

  /** Live ledger curve — the real activity series for the primary card. */
  const spark = useMemo(() => {
    const series = state.transactions.slice(0, 8).map((t) => Math.abs(t.amount)).reverse();
    return series.length >= 2 ? series : [1, 1];
  }, [state.transactions]);

  const recent = state.transactions.slice(0, 3);

  const onRefresh = () => {
    setRefreshing(true);
    haptics.refresh();
    setTimeout(() => setRefreshing(false), 900);
  };

  return (
    <ScreenContainer
      onRefresh={onRefresh}
      refreshing={refreshing}
      edges={['bottom']}
      contentContainerStyle={styles.root}
    >
      {/* Deep navy gradient header (top ~30%) with the primary metric */}
      <View style={styles.headerWrap}>
        <HubHeader
          initial="TD"
          balance={totalBalance}
          searchValue={search}
          onSearchChange={setSearch}
          hideBalance={state.hideBalances}
          unreadCount={unread}
          onAvatarPress={() => router.push('/profile' as never)}
          onCartPress={() => router.push('/more' as never)}
          onBellPress={() => router.push('/notifications' as never)}
        />
      </View>

      <View style={styles.body}>
        {/* MONDAY, SEP 14 [Today] */}
        <StaggeredItem index={0}>
          <GlassCard style={styles.todayCard} bubbleStrength={0.6}>
            <View style={styles.todayTop}>
              <Text style={[styles.todayDate, { color: theme.textMuted }]}>
                {dayLabel(new Date())}
              </Text>
              <View style={[styles.todayPill, { backgroundColor: theme.primary + '18' }]}>
                <Text style={[styles.todayPillText, { color: theme.primary }]}>Today</Text>
              </View>
            </View>
            <Text style={[styles.todayTitle, { color: theme.text }]}>
              Good morning, Tawanda.
            </Text>
            <Text style={[styles.todaySub, { color: theme.textMuted }]}>
              Here&apos;s what needs your attention.
            </Text>
          </GlassCard>
        </StaggeredItem>

        {/* Quick actions — the eight primary verbs */}
        <StaggeredItem index={1}>
          <QuickActionsGrid
            actions={QUICK_ACTIONS}
            onPress={(route) => router.push(route as never)}
          />
        </StaggeredItem>

        {/* YOUR CARDS & WALLETS — Manage > */}
        <StaggeredItem index={2}>
          <ScreenHeader
            title="Your cards & wallets"
            subtitle="Everything you can tap."
            actionLabel="Manage"
            onAction={() => router.push('/cards' as never)}
          />
        </StaggeredItem>
        <StaggeredItem index={3}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carousel}
            snapToInterval={296}
            decelerationRate="fast"
          >
            {state.cards.map((card) => (
              <View key={card.id} style={styles.carouselItem}>
                <HomeCard
                  card={card}
                  sparkData={spark}
                  hideBalance={state.hideBalances}
                  onPress={() => router.push('/cards' as never)}
                />
              </View>
            ))}
          </ScrollView>
        </StaggeredItem>

        {/* TELECOM ASSET CORE */}
        <StaggeredItem index={4}>
          <ScreenHeader
            title="Telecom asset core"
            subtitle="Your data works as currency."
          />
        </StaggeredItem>
        <StaggeredItem index={5}>
          <LinearGradient
            colors={[theme.gradient[0], theme.gradient[1], theme.gradient[2]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.telecomCard}
          >
            <View style={styles.telecomGlow} pointerEvents="none" />
            <View style={styles.telecomTop}>
              <Text style={styles.telecomKicker}>{tariff.provider.toUpperCase()} · DATA VAULT</Text>
              <View style={styles.telecomRing}>
                <ProgressRing
                  size={104}
                  strokeWidth={6}
                  progress={tariff.usedPct / 100}
                  color="#2ECC71"
                  trackColor="rgba(255,255,255,0.18)"
                >
                  <Text style={styles.ringValue}>{tariff.leftGB} GB</Text>
                  <Text style={styles.ringLabel}>LEFT</Text>
                </ProgressRing>
              </View>
            </View>

            <View style={styles.telecomMeta}>
              <View style={styles.telecomMetaItem}>
                <Text style={styles.metaLabel}>Usage velocity</Text>
                <Text style={styles.metaValue}>7d</Text>
              </View>
              <View style={styles.telecomMetaItem}>
                <Text style={styles.metaLabel}>Wallet bridge</Text>
                <Text style={styles.metaValue}>{formatPula(primary.balance)}</Text>
              </View>
            </View>

            <View style={styles.telecomBtns}>
              <Button
                title="Trade / Sell GB"
                variant="ghost"
                onPress={() => router.push('/data-bundles' as never)}
                style={styles.telecomBtn}
              />
              <Button
                title="Daily Boost"
                variant="primary"
                onPress={() => router.push('/data-bundles' as never)}
                style={styles.telecomBtn}
              />
            </View>

            <View style={styles.cashbackRow}>
              <Ionicons name="sparkles" size={14} color="#F5A623" />
              <Text style={styles.cashbackText}>
                Ecosystem cashback: <Text style={styles.cashbackAccent}>+15% multiplier</Text>
              </Text>
            </View>
          </LinearGradient>
        </StaggeredItem>

        {/* YOUR MYTAP DAY [READY] */}
        <StaggeredItem index={6}>
          <GlassCard style={styles.dayCard} bubbleStrength={0.6}>
            <View style={styles.dayTop}>
              <Text style={[styles.todayDate, { color: theme.textMuted }]}>YOUR MYTAP DAY</Text>
              <View style={[styles.todayPill, { backgroundColor: theme.primary + '18' }]}>
                <Text style={[styles.todayPillText, { color: theme.primary }]}>Ready</Text>
              </View>
            </View>
            <Text style={[styles.dayTitle, { color: theme.text }]}>Ready when you are.</Text>
            <View style={styles.dayStatus}>
              <View style={[styles.statusDot, { backgroundColor: theme.primary }]} />
              <Text style={[styles.daySub, { color: theme.textMuted }]}>
                MyTap Wallet is ready · {formatPula(totalBalance)}
              </Text>
            </View>
          </GlassCard>
        </StaggeredItem>

        {/* MYTAP MARKET */}
        <StaggeredItem index={7}>
          <ScreenHeader title="MyTap market" subtitle="Utilities, reimagined as proxies." />
        </StaggeredItem>

        {/* BPC · TOKEN LIFESPAN PREDICTOR */}
        <StaggeredItem index={8}>
          <GlassCard style={styles.marketCard} bubbleStrength={0.5}>
            <View style={styles.marketHead}>
              <TileIcon icon="flash" color="#F5A623" size={42} radius={14} glyph={19} />
              <View style={styles.marketHeadText}>
                <Text style={[styles.marketKicker, { color: theme.textMuted }]}>
                  BPC · TOKEN LIFESPAN PREDICTOR
                </Text>
                <Text style={[styles.marketMeta, { color: theme.textMuted }]}>
                  Meter 14085142801
                </Text>
              </View>
            </View>

            <View style={styles.marketRows}>
              <View style={styles.marketRow}>
                <Text style={[styles.marketRowLabel, { color: theme.textMuted }]}>Last load</Text>
                <Text style={[styles.marketRowValue, { color: theme.text }]}>{formatPx(200)}</Text>
              </View>
              <View style={styles.marketRow}>
                <Text style={[styles.marketRowLabel, { color: theme.textMuted }]}>Est. remaining</Text>
                <Text style={[styles.marketRowValue, { color: theme.text }]}>42 kWh</Text>
              </View>
            </View>

            <Button
              title="Auto-Refill Token · P200"
              variant="primary"
              fullWidth
              onPress={() => router.push('/utilities' as never)}
            />
          </GlassCard>
        </StaggeredItem>

        {/* WUC · WATER INVOICE + CHOPPIES · CASHBACK MARKET */}
        <View style={styles.marketSplit}>
          <StaggeredItem index={9} style={styles.marketSplitItem}>
            <GlassCard style={styles.marketCardSm} bubbleStrength={0.5}>
              <TileIcon icon="water" color="#2ECC71" size={42} radius={14} glyph={19} />
              <Text style={[styles.marketKicker, { color: theme.textMuted }]}>
                WUC · WATER INVOICE
              </Text>
              <Text style={[styles.marketMeta, { color: theme.textMuted }]}>Statement 15 Sep</Text>

              <Text style={[styles.marketRowLabel, { color: theme.textMuted, marginTop: spacing.md }]}>
                Unpaid invoice
              </Text>
              <Text style={[styles.marketAmount, { color: theme.text }]}>{formatPula(340.5)}</Text>
              <Text style={[styles.marketDue, { color: theme.danger }]}>
                Due in 4 days · 6 Sep
              </Text>

              <Button
                title="Pay in One-Tap"
                variant="primary"
                fullWidth
                onPress={() => router.push('/utilities' as never)}
                style={styles.marketBtnSm}
              />
            </GlassCard>
          </StaggeredItem>

          <StaggeredItem index={10} style={styles.marketSplitItem}>
            <GlassCard style={styles.marketCardSm} bubbleStrength={0.5}>
              {/* Special offer — 3D cashback illustration */}
              <Illustration name="coins" size={56} />
              <Text style={[styles.marketKicker, { color: theme.textMuted }]}>
                CHOPPIES · CASHBACK MARKET
              </Text>
              <Text style={[styles.marketMeta, { color: theme.textMuted }]}>Groceries</Text>

              <Text style={[styles.marketAmount, { color: theme.text, marginTop: spacing.md }]}>
                Spend P100
              </Text>
              <Text style={[styles.marketDue, { color: theme.primary }]}>earn P15 credit</Text>

              <Button
                title="Shop now"
                variant="ghost"
                fullWidth
                onPress={() => router.push('/rewards' as never)}
                style={styles.marketBtnSm}
              />
            </GlassCard>
          </StaggeredItem>
        </View>

        {/* Recent transactions with the ledger sparkline */}
        <StaggeredItem index={11}>
          <ScreenHeader
            title="Recent activity"
            subtitle="Where your money moved."
            actionLabel="See all"
            onAction={() => router.push('/transactions' as never)}
          />
        </StaggeredItem>
        <StaggeredItem index={12}>
          <GlassCard solid style={styles.listCard}>
            {recent.map((t, i) => (
              <View key={t.id}>
                <PressableScale
                  style={styles.txRow}
                  bubble={false}
                  haptic="light"
                  onPress={() => router.push('/transactions' as never)}
                >
                  <View style={[styles.txIcon, { backgroundColor: t.color + '16' }]}>
                    <Text style={styles.txEmoji}>{t.icon}</Text>
                  </View>
                  <View style={styles.txText}>
                    <Text style={[styles.txMerchant, { color: theme.text }]} numberOfLines={1}>
                      {t.merchant}
                    </Text>
                    <Text style={[styles.txCategory, { color: theme.textMuted }]}>
                      {t.category}
                    </Text>
                  </View>
                  <Text style={[styles.txAmount, { color: theme.danger }]}>
                    {formatPx(t.amount)}
                  </Text>
                </PressableScale>
                {i < recent.length - 1 && (
                  <View style={[styles.divider, { backgroundColor: theme.hairline }]} />
                )}
              </View>
            ))}
          </GlassCard>
        </StaggeredItem>

        {/* NFC Sense banner — dismissible */}
        {!nfcDismissed && !state.bannerDismissed && (
          <StaggeredItem index={13}>
            <View
              style={[
                styles.nfcBanner,
                { backgroundColor: theme.bannerBg, borderColor: theme.bannerBorder },
              ]}
            >
              <View style={styles.nfcLeft}>
                <View style={[styles.nfcIcon, { backgroundColor: '#F5A62322' }]}>
                  <Ionicons name="radio-outline" size={18} color="#B8892B" />
                </View>
                <View>
                  <Text style={[styles.nfcTitle, { color: theme.text }]}>POS detected</Text>
                  <Text style={[styles.nfcSub, { color: theme.textMuted }]}>
                    A terminal is nearby and ready.
                  </Text>
                </View>
              </View>
              <View style={styles.nfcRight}>
                <PressableScale
                  style={[styles.nfcBtn, { backgroundColor: theme.primary }]}
                  bubble={false}
                  haptic="heavy"
                  onPress={() => router.push('/pay' as never)}
                >
                  <Text style={styles.nfcBtnText}>Tap to pay</Text>
                </PressableScale>
                <PressableScale
                  style={styles.nfcClose}
                  bubble={false}
                  haptic="light"
                  onPress={() => {
                    setNfcDismissed(true);
                    dispatch({ type: 'DISMISS_BANNER' });
                    haptics.light();
                  }}
                >
                  <Ionicons name="close" size={16} color={theme.textMuted} />
                </PressableScale>
              </View>
            </View>
          </StaggeredItem>
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  headerWrap: {
    marginHorizontal: -spacing.lg,
    marginTop: -spacing.md,
  },
  body: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },

  todayCard: {
    padding: 16,
  },
  todayTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  todayDate: {
    ...type.label,
    fontSize: 10.5,
  },
  todayPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  todayPillText: {
    ...type.small,
    fontWeight: '600',
  },
  todayTitle: {
    ...type.heading,
    fontWeight: '600',
  },
  todaySub: {
    ...type.caption,
    marginTop: 2,
  },

  carousel: {
    gap: spacing.md,
    paddingRight: spacing.lg,
  },
  carouselItem: {
    width: 280,
  },

  telecomCard: {
    borderRadius: radius.card,
    padding: 18,
    overflow: 'hidden',
    ...shadows.elevated,
  },
  telecomGlow: {
    position: 'absolute',
    top: -70,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  telecomTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  telecomKicker: {
    color: 'rgba(255,255,255,0.72)',
    ...type.label,
    fontSize: 10,
  },
  telecomRing: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringValue: {
    color: '#fff',
    ...type.heading,
    fontWeight: '700',
    includeFontPadding: false,
    textAlign: 'center',
  },
  ringLabel: {
    color: 'rgba(255,255,255,0.6)',
    ...type.small,
    fontSize: 9,
    includeFontPadding: false,
    textAlign: 'center',
  },
  telecomMeta: {
    flexDirection: 'row',
    gap: spacing.xxl,
    marginTop: spacing.lg,
  },
  telecomMetaItem: {},
  metaLabel: {
    color: 'rgba(255,255,255,0.6)',
    ...type.small,
  },
  metaValue: {
    color: '#fff',
    ...type.subheading,
    fontWeight: '600',
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  telecomBtns: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  telecomBtn: {
    flex: 1,
  },
  cashbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.lg,
  },
  cashbackText: {
    color: 'rgba(255,255,255,0.72)',
    ...type.caption,
  },
  cashbackAccent: {
    color: '#F5A623',
    fontWeight: '600',
  },

  dayCard: {
    padding: 16,
  },
  dayTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  dayTitle: {
    ...type.heading,
    fontWeight: '600',
  },
  dayStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  daySub: {
    ...type.caption,
  },

  marketCard: {
    padding: 16,
    gap: spacing.md,
  },
  marketCardSm: {
    padding: 16,
    flex: 1,
  },
  marketSplit: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  marketSplitItem: {
    flex: 1,
  },
  marketHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  marketHeadText: {
    flex: 1,
  },
  marketIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marketKicker: {
    ...type.label,
    fontSize: 9.5,
  },
  marketMeta: {
    ...type.caption,
    marginTop: 1,
  },
  marketRows: {
    gap: spacing.sm,
  },
  marketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marketRowLabel: {
    ...type.caption,
  },
  marketRowValue: {
    ...type.money,
  },
  marketAmount: {
    ...type.money,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },
  marketDue: {
    ...type.small,
    marginTop: 2,
  },
  marketBtnSm: {
    marginTop: spacing.md,
  },

  listCard: {
    padding: 0,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: spacing.md,
  },
  txIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txEmoji: {
    fontSize: 17,
  },
  txText: {
    flex: 1,
  },
  txMerchant: {
    ...type.subheading,
    fontWeight: '600',
    fontSize: 14.5,
  },
  txCategory: {
    ...type.caption,
    marginTop: 1,
  },
  txAmount: {
    ...type.money,
  },
  divider: {
    height: 1,
    marginLeft: 66,
  },

  nfcBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.card,
    padding: 12,
    gap: spacing.sm,
  },
  nfcLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  nfcIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nfcTitle: {
    ...type.subheading,
    fontWeight: '600',
    fontSize: 14.5,
  },
  nfcSub: {
    ...type.small,
    marginTop: 1,
  },
  nfcRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  nfcBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  nfcBtnText: {
    color: '#fff',
    ...type.caption,
    fontWeight: '600',
  },
  nfcClose: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
