import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { SlideUpModal } from '../src/components/ui/SlideUpModal';
import { ReceiptView } from '../src/components/receipts/ReceiptView';
import { useApp } from '../src/store/AppStore';
import { formatPula, shortDate } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function ReceiptsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state } = useApp();
  const [selected, setSelected] = useState<any>(null);
  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}><Ionicons name="chevron-back" size={22} color={theme.text} /></PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>Receipts</Text>
        </View>
      </StaggeredItem>
      <StaggeredItem index={1}>
        <GlassCard bubble={false}>
          {state.receipts.length === 0 ? (
            <View style={styles.empty}><Ionicons name="receipt-outline" size={40} color={theme.textMuted} /><Text style={[styles.emptyText, { color: theme.textMuted }]}>No receipts yet</Text></View>
          ) : (
            state.receipts.map((r, i) => (
              <PressableScale key={r.id} style={[styles.row, i > 0 && styles.divider]} onPress={() => { setSelected(r); haptics.medium(); }}>
                <View style={[styles.icon, { backgroundColor: r.color + '22' }]}><Text style={styles.emoji}>{r.icon}</Text></View>
                <View style={styles.info}><Text style={[styles.merchant, { color: theme.text }]}>{r.merchant}</Text><Text style={[styles.meta, { color: theme.textMuted }]}>{r.ref} · {shortDate(r.date)}</Text></View>
                <Text style={[styles.amount, { color: theme.text }]}>{formatPula(r.amount)}</Text>
                <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
              </PressableScale>
            ))
          )}
        </GlassCard>
      </StaggeredItem>
      <SlideUpModal visible={!!selected} onClose={() => setSelected(null)}>
        {selected && <ReceiptView receipt={selected} />}
      </SlideUpModal>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 24, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md },
  divider: { borderTopWidth: 1, borderTopColor: 'rgba(15,23,41,0.06)' },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 18 },
  info: { flex: 1 },
  merchant: { fontSize: 15, fontWeight: '600' },
  meta: { fontSize: 12, marginTop: 2 },
  amount: { fontSize: 15, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: spacing.xxxl, gap: spacing.md },
  emptyText: { fontSize: 15 },
});