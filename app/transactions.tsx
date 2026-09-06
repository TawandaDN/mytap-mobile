import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { SlideUpModal } from '../src/components/ui/SlideUpModal';
import { useApp } from '../src/store/AppStore';
import { formatPula, shortDate } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

type Filter = 'all' | 'income' | 'expense' | 'groceries' | 'utilities' | 'airtime';

export default function TransactionsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const filtered = useMemo(() => {
    let list = state.transactions;
    if (filter === 'income') list = list.filter((t) => t.amount > 0);
    if (filter === 'expense') list = list.filter((t) => t.amount < 0);
    if (filter === 'groceries') list = list.filter((t) => t.category === 'Groceries');
    if (filter === 'utilities') list = list.filter((t) => ['Electricity', 'Water', 'TV', 'Internet'].includes(t.category));
    if (filter === 'airtime') list = list.filter((t) => t.category === 'Airtime');
    if (query) { const q = query.toLowerCase(); list = list.filter((t) => t.merchant.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)); }
    return list;
  }, [state.transactions, filter, query]);
  const onRefresh = () => { setRefreshing(true); haptics.refresh(); setTimeout(() => setRefreshing(false), 1000); };
  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' }, { key: 'income', label: 'Income' }, { key: 'expense', label: 'Expense' }, { key: 'groceries', label: 'Groceries' }, { key: 'utilities', label: 'Utilities' }, { key: 'airtime', label: 'Airtime' },
  ];
  return (
    <ScreenContainer onRefresh={onRefresh} refreshing={refreshing}>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}><Ionicons name="chevron-back" size={22} color={theme.text} /></PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>Transactions</Text>
          <PressableScale style={styles.exportBtn} onPress={() => { haptics.medium(); }}><Ionicons name="download-outline" size={20} color={theme.accent} /></PressableScale>
        </View>
      </StaggeredItem>
      <StaggeredItem index={1}>
        <View style={[styles.searchWrap, { borderColor: theme.border, backgroundColor: theme.surface }]}>
          <Ionicons name="search" size={18} color={theme.textMuted} />
          <TextInput value={query} onChangeText={setQuery} placeholder="Search transactions" placeholderTextColor={theme.textMuted} style={[styles.searchInput, { color: theme.text }]} />
        </View>
      </StaggeredItem>
      <StaggeredItem index={2}>
        <View style={styles.filters}>
          {filters.map((f) => (
            <PressableScale key={f.key} style={[styles.filterChip, { backgroundColor: filter === f.key ? theme.accent : theme.surface, borderColor: theme.border }]} onPress={() => { setFilter(f.key); haptics.selection(); }}>
              <Text style={[styles.filterText, { color: filter === f.key ? '#fff' : theme.textSecondary }]}>{f.label}</Text>
            </PressableScale>
          ))}
        </View>
      </StaggeredItem>
      <StaggeredItem index={3}>
        <GlassCard bubble={false}>
          {filtered.length === 0 ? (
            <View style={styles.empty}><Ionicons name="receipt-outline" size={40} color={theme.textMuted} /><Text style={[styles.emptyText, { color: theme.textMuted }]}>No transactions found</Text></View>
          ) : (
            filtered.map((tx, i) => (
              <PressableScale key={tx.id} style={[styles.txRow, i > 0 && styles.txDivider]} onPress={() => { setSelected(tx); haptics.medium(); }}>
                <View style={[styles.txIcon, { backgroundColor: tx.color + '22' }]}><Text style={styles.txEmoji}>{tx.icon}</Text></View>
                <View style={styles.txInfo}><Text style={[styles.txMerchant, { color: theme.text }]}>{tx.merchant}</Text><Text style={[styles.txCategory, { color: theme.textMuted }]}>{tx.category} · {shortDate(tx.date)}</Text></View>
                <Text style={[styles.txAmount, { color: tx.amount > 0 ? '#2ECC71' : '#E74C3C' }]}>{formatPula(tx.amount, { sign: true })}</Text>
              </PressableScale>
            ))
          )}
        </GlassCard>
      </StaggeredItem>
      <SlideUpModal visible={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <>
            <View style={styles.detailHeader}>
              <View style={[styles.detailIcon, { backgroundColor: selected.color + '22' }]}><Text style={styles.detailEmoji}>{selected.icon}</Text></View>
              <Text style={[styles.detailMerchant, { color: theme.text }]}>{selected.merchant}</Text>
              <Text style={[styles.detailAmount, { color: selected.amount > 0 ? '#2ECC71' : '#E74C3C' }]}>{formatPula(selected.amount, { sign: true })}</Text>
            </View>
            <View style={styles.detailBody}>
              <DetailRow label="Category" value={selected.category} theme={theme} />
              <DetailRow label="Date" value={new Date(selected.date).toLocaleString()} theme={theme} />
              <DetailRow label="Reference" value={selected.ref || '—'} theme={theme} />
              <DetailRow label="Method" value={selected.method || 'MyTap Wallet'} theme={theme} />
              <DetailRow label="Status" value={selected.status || 'Completed'} theme={theme} accent />
            </View>
          </>
        )}
      </SlideUpModal>
    </ScreenContainer>
  );
}
function DetailRow({ label, value, theme, accent }: { label: string; value: string; theme: any; accent?: boolean }) {
  return (
    <View style={styles.detailRow}><Text style={[styles.detailLabel, { color: theme.textMuted }]}>{label}</Text><Text style={[styles.detailValue, { color: accent ? '#2ECC71' : theme.text }]}>{value}</Text></View>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 24, fontWeight: '700' },
  exportBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, marginBottom: spacing.lg },
  searchInput: { flex: 1, fontSize: 15 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: '600' },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  txDivider: { borderTopWidth: 1, borderTopColor: 'rgba(15,23,41,0.06)' },
  txIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  txEmoji: { fontSize: 18 },
  txInfo: { flex: 1 },
  txMerchant: { fontSize: 15, fontWeight: '600' },
  txCategory: { fontSize: 12, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: spacing.xxxl, gap: spacing.md },
  emptyText: { fontSize: 15 },
  detailHeader: { alignItems: 'center', marginBottom: spacing.xl },
  detailIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  detailEmoji: { fontSize: 28 },
  detailMerchant: { fontSize: 20, fontWeight: '700' },
  detailAmount: { fontSize: 28, fontWeight: '700', marginTop: spacing.sm },
  detailBody: { marginBottom: spacing.lg },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: 'rgba(15,23,41,0.06)' },
  detailLabel: { fontSize: 14 },
  detailValue: { fontSize: 14, fontWeight: '600' },
});