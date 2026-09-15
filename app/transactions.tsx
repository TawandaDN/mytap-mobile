import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GradientHeader } from '../src/components/ui/GradientHeader';
import { Card, SectionLabel } from '../src/components/ui/CardSystem';
import { Divider, TileIcon, catColor } from '../src/components/ui/IconSystem';
import { EmptyState } from '../src/components/ui/EmptyState';
import { HistorySkeleton } from '../src/components/animations/Skeletons';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { formatPx, groupDateLabel } from '../src/utils/format';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';
import { inter, radii, space, text } from '../src/theme/tokens';

/**
 * History — a dense, highly scannable native timeline.
 *
 * Grouped strictly by date headers ("August 5, Wed"), each row carries a
 * compact rounded-square status tile, a distinct merchant title, a soft grey
 * category subtitle and a right-aligned tabular-nums amount so decimals align
 * perfectly when stacked. No chat bubbles, no loading streams — the initial
 * mount shows a layout-matched shimmer, then the data is simply present.
 */

const FILTERS = ['All', 'Airtime', 'Mascom data', 'Transfer'];

/** Map a ledger category onto the icon system's tint + filled glyph. */
function categoryVisual(category: string): { color: string; icon: keyof typeof Ionicons.glyphMap } {
  switch (category) {
    case 'Airtime':
      return { color: catColor('airtime'), icon: 'flash' };
    case 'Mascom data':
      return { color: catColor('data'), icon: 'wifi' };
    case 'Transfer':
      return { color: catColor('payments'), icon: 'swap-horizontal' };
    case 'Savings':
      return { color: catColor('savings'), icon: 'trending-up' };
    case 'Electricity':
    case 'Water':
    case 'Bills':
      return { color: catColor('bills'), icon: 'receipt' };
    default:
      return { color: catColor('history'), icon: 'receipt' };
  }
}

export default function HistoryScreen() {
  const { theme } = useTheme();
  const { state } = useApp();
  const { show } = useToast();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  /** Initial mount — shimmer on the real layout, then reveal. */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return state.transactions.filter((tx) => {
      const matchesQuery =
        !query.trim() ||
        tx.merchant.toLowerCase().includes(query.toLowerCase()) ||
        tx.category.toLowerCase().includes(query.toLowerCase()) ||
        (tx.account ?? '').includes(query);
      const matchesFilter = filter === 'All' || tx.category === filter;
      return matchesQuery && matchesFilter;
    });
  }, [state.transactions, query, filter]);

  /** Group strictly by calendar day. */
  const groups = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    filtered.forEach((tx) => {
      const key = groupDateLabel(tx.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(tx);
    });
    return Array.from(map.entries()).map(([header, items]) => ({ header, items }));
  }, [filtered]);

  const noLedger = state.transactions.length === 0;
  const noMatches = !noLedger && groups.length === 0;

  return (
    <ScreenContainer edges={['bottom']} contentContainerStyle={styles.screenContent}>
      {/* Bleeding gradient header — the title block floats on deep navy. */}
      <View style={styles.headBleed}>
        <GradientHeader kind="generic">
          <Text style={styles.headKicker}>HISTORY</Text>
          <Text style={styles.headTitle}>Recent transactions</Text>
          <Text style={styles.headSub}>Where your money moved.</Text>
        </GradientHeader>
      </View>

      <View style={styles.body}>
        {/* Search bar — 20px radius, icon left, mic right. */}
        <StaggeredItem index={0}>
          <View
            style={[styles.searchWrap, { backgroundColor: theme.surface, borderColor: theme.hairline }]}
          >
            <Ionicons name="search" size={16} color={theme.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search transactions, bills, or cards..."
              placeholderTextColor={theme.textMuted}
              style={[styles.searchInput, { color: theme.text }]}
            />
            <Ionicons name="mic" size={16} color={theme.textMuted} />
          </View>
        </StaggeredItem>

        {/* Filter chips */}
        <StaggeredItem index={1}>
          <View style={styles.chips}>
            {FILTERS.map((f) => {
              const active = filter === f;
              return (
                <PressableScale
                  key={f}
                  scaleTo={0.95}
                  haptic="light"
                  style={[
                    styles.chip,
                    { backgroundColor: active ? theme.surface : 'transparent', borderColor: theme.hairline },
                  ]}
                  onPress={() => {
                    setFilter(f);
                    haptics.selection();
                  }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: active ? theme.accent : theme.textSecondary },
                    ]}
                  >
                    {f}
                  </Text>
                </PressableScale>
              );
            })}
          </View>
        </StaggeredItem>

        {/* Loading — layout-matched shimmer, never a spinner */}
        {loading && <HistorySkeleton groups={2} rowsPerGroup={3} />}

        {/* Empty — nothing in the ledger at all */}
        {!loading && noLedger && (
          <View style={styles.emptyWrap}>
            <EmptyState
              illustration="wallet"
              title="No transactions yet"
              subtitle="Your ledger will fill up the moment you make your first tap, transfer or bill payment."
              actionLabel="Make a payment"
              onAction={() => router.push('/pay' as never)}
            />
          </View>
        )}

        {/* Empty — search or filter matched nothing */}
        {!loading && noMatches && (
          <View style={styles.emptyWrap}>
            <EmptyState
              illustration="shield"
              title="Nothing matched"
              subtitle="No ledger entries match that search or filter yet. Try a different term or clear the filters."
              actionLabel="Clear filters"
              onAction={() => {
                setQuery('');
                setFilter('All');
                haptics.light();
              }}
            />
          </View>
        )}

        {/* Timeline feed */}
        {!loading &&
          groups.map((group, gi) => (
            <StaggeredItem key={group.header} index={2 + gi}>
              <View style={styles.dateHead}>
                <SectionLabel>{group.header}</SectionLabel>
              </View>
              <Card padded={false}>
                {group.items.map((tx, i) => {
                  const v = categoryVisual(tx.category);
                  const positive = tx.amount >= 0;
                  return (
                    <View key={tx.id}>
                      {i > 0 && <Divider indent={space.md + 32 + space.sm} />}
                      <PressableScale
                        radius={0}
                        haptic="light"
                        style={styles.row}
                        onPress={() => {
                          haptics.light();
                          show(`${tx.merchant} · ${formatPx(tx.amount)}`, 'info');
                        }}
                      >
                        <TileIcon icon={v.icon} color={v.color} size={32} radius={11} glyph={16} />
                        <View style={styles.info}>
                          <Text style={[styles.merchant, { color: theme.text }]} numberOfLines={1}>
                            {tx.merchant}
                            {tx.account ? (
                              <Text style={[styles.account, { color: theme.textMuted }]}>
                                {'  ·  '}
                                {tx.account}
                              </Text>
                            ) : null}
                          </Text>
                          <Text style={[styles.category, { color: theme.textMuted }]} numberOfLines={1}>
                            {tx.category}
                          </Text>
                        </View>
                        <Text
                          style={[styles.amount, { color: positive ? '#2ECC71' : '#E74C3C' }]}
                        >
                          {formatPx(tx.amount)}
                        </Text>
                      </PressableScale>
                    </View>
                  );
                })}
              </Card>
            </StaggeredItem>
          ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  headBleed: {
    marginBottom: space.lg,
  },
  headKicker: {
    color: '#FF6B4A',
    ...text.sectionLabel,
  },
  headTitle: {
    color: '#FFFFFF',
    ...text.screenTitle,
    marginTop: space.xxs,
  },
  headSub: {
    color: 'rgba(255,255,255,0.78)',
    ...text.caption,
    marginTop: space.xxs,
  },
  body: {
    paddingHorizontal: space.md,
  },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.search,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  searchInput: {
    flex: 1,
    ...text.body,
    padding: 0,
  },

  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    marginTop: space.sm,
  },
  chip: {
    paddingHorizontal: space.sm + 2,
    paddingVertical: 7,
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: {
    ...text.caption,
    fontFamily: inter.semibold,
    fontWeight: '600',
  },

  dateHead: {
    marginTop: space.xl,
    marginBottom: space.sm,
    marginLeft: space.xxs,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  info: {
    flex: 1,
    marginLeft: space.sm,
    marginRight: space.sm,
  },
  merchant: {
    fontSize: 14,
    lineHeight: 19,
    fontFamily: inter.semibold,
    fontWeight: '600',
    letterSpacing: -0.05,
  },
  account: {
    fontSize: 11,
    fontFamily: inter.regular,
    fontWeight: '400',
  },
  category: {
    ...text.caption,
    fontSize: 12.5,
    marginTop: 1,
  },
  amount: {
    ...text.moneyTabular,
    fontSize: 14,
    textAlign: 'right',
  },

  emptyWrap: {
    marginTop: space.xl,
  },
});
