import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { formatPx } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

interface Tx {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  icon: string;
  color: string;
}

const FILTERS = ['All', 'Income', 'Groceries', 'Utilities', 'Airtime', 'Data'];

/**
 * History — a dense, native timeline feed grouped strictly by date headers.
 * Each row: a compact circular status icon, a bold merchant title, a soft
 * grey category subtitle, and a right-aligned tabular-nums amount so the
 * decimals align perfectly when stacked. Searchable and filterable.
 */
export default function HistoryScreen() {
  const { theme } = useTheme();
  const { state } = useApp();
  const { show } = useToast();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    return state.transactions.filter((tx) => {
      const matchesQuery =
        !query.trim() ||
        tx.merchant.toLowerCase().includes(query.toLowerCase()) ||
        tx.category.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === 'All' || tx.category === filter;
      return matchesQuery && matchesFilter;
    });
  }, [state.transactions, query, filter]);

  // Group strictly by calendar day.
  const groups = useMemo(() => {
    const map = new Map<string, Tx[]>();
    filtered.forEach((tx) => {
      const key = dayKey(tx.date);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(tx);
    });
    return Array.from(map.entries()).map(([header, items]) => ({ header, items }));
  }, [filtered]);

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <Text style={[styles.title, { color: theme.text }]}>History</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>Where your money moved</Text>
      </StaggeredItem>

      {/* Search */}
      <StaggeredItem index={1}>
        <View style={[styles.searchWrap, { backgroundColor: theme.surface, borderColor: theme.hairline }]}>
          <Ionicons name="search" size={17} color={theme.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search transactions, bills, or cards..."
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>
      </StaggeredItem>

      {/* Filter chips */}
      <StaggeredItem index={2}>
        <View style={styles.chips}>
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <PressableScale
                key={f}
                scaleTo={0.95}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? theme.primary : theme.surface,
                    borderColor: active ? theme.primary : theme.hairline,
                  },
                ]}
                onPress={() => {
                  setFilter(f);
                  haptics.selection();
                }}
              >
                <Text style={[styles.chipText, { color: active ? '#fff' : theme.textSecondary }]}>
                  {f}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      </StaggeredItem>

      {/* Timeline feed, grouped by date */}
      {groups.length === 0 ? (
        <StaggeredItem index={3}>
          <GlassCard solid bubble={false} style={styles.emptyCard}>
            <Ionicons name="receipt-outline" size={34} color={theme.textMuted} />
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>No transactions found</Text>
          </GlassCard>
        </StaggeredItem>
      ) : (
        groups.map((group, gi) => (
          <StaggeredItem key={group.header} index={3 + gi}>
            <Text style={[styles.dateHeader, { color: theme.textMuted }]}>{group.header}</Text>
            <GlassCard solid bubble={false}>
              {group.items.map((tx, i) => (
                <PressableScale
                  key={tx.id}
                  style={[styles.row, i > 0 && { borderTopWidth: 1, borderTopColor: theme.hairline }]}
                  onPress={() => {
                    haptics.light();
                    show(`${tx.merchant} · ${formatPx(tx.amount)}`);
                  }}
                >
                  <View style={[styles.icon, { backgroundColor: tx.color + '14' }]}>
                    <Text style={styles.emoji}>{tx.icon}</Text>
                  </View>
                  <View style={styles.info}>
                    <Text style={[styles.merchant, { color: theme.text }]} numberOfLines={1}>
                      {tx.merchant}
                    </Text>
                    <Text style={[styles.category, { color: theme.textMuted }]} numberOfLines={1}>
                      {tx.category}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.amount,
                      { color: tx.amount >= 0 ? theme.primary : theme.text },
                    ]}
                  >
                    {formatPx(tx.amount)}
                  </Text>
                </PressableScale>
              ))}
            </GlassCard>
          </StaggeredItem>
        ))
      )}
    </ScreenContainer>
  );
}

function dayKey(iso: string) {
  const d = new Date(iso);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${months[d.getMonth()]} ${d.getDate()}, ${days[d.getDay()]}`;
}

const styles = StyleSheet.create({
  title: {
    ...type.largeTitle,
  },
  subtitle: {
    ...type.caption,
    marginTop: 2,
    marginBottom: spacing.xl,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchInput: {
    flex: 1,
    ...type.body,
    padding: 0,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  chipText: {
    ...type.caption,
    fontSize: 12.5,
    fontWeight: '600',
  },
  dateHeader: {
    ...type.label,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  emoji: {
    fontSize: 14,
  },
  info: {
    flex: 1,
    marginRight: spacing.sm,
  },
  merchant: {
    ...type.body,
    fontSize: 14.5,
    fontWeight: '600',
  },
  category: {
    ...type.caption,
    fontSize: 12,
    marginTop: 1,
  },
  amount: {
    ...type.money,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  emptyText: {
    ...type.body,
  },
});
