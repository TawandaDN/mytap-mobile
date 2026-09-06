import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { useApp } from '../src/store/AppStore';
import { shortDate } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const unread = state.notifications.filter((n) => !n.read).length;
  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}><Ionicons name="chevron-back" size={22} color={theme.text} /></PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>Notifications</Text>
          {unread > 0 && <PressableScale style={styles.markAll} onPress={() => { dispatch({ type: 'MARK_ALL_NOTIF_READ' }); haptics.light(); }}><Text style={[styles.markAllText, { color: theme.accent }]}>Mark all read</Text></PressableScale>}
        </View>
      </StaggeredItem>
      <StaggeredItem index={1}>
        <GlassCard bubble={false}>
          {state.notifications.length === 0 ? (
            <View style={styles.empty}><Ionicons name="notifications-off-outline" size={40} color={theme.textMuted} /><Text style={[styles.emptyText, { color: theme.textMuted }]}>No notifications</Text></View>
          ) : (
            state.notifications.map((n, i) => (
              <PressableScale key={n.id} style={[styles.row, i > 0 && styles.divider]} onPress={() => { dispatch({ type: 'MARK_NOTIF_READ', id: n.id }); haptics.light(); }}>
                <View style={[styles.icon, { backgroundColor: n.color + '22' }]}><Ionicons name={n.type === 'payment' ? 'card' : n.type === 'security' ? 'shield' : n.type === 'system' ? 'stats-chart' : 'notifications'} size={18} color={n.color} /></View>
                <View style={styles.info}>
                  <View style={styles.titleRow}><Text style={[styles.notifTitle, { color: theme.text }]}>{n.title}</Text>{!n.read && <View style={[styles.unreadDot, { backgroundColor: theme.accent }]} />}</View>
                  <Text style={[styles.notifBody, { color: theme.textMuted }]}>{n.body}</Text>
                  <Text style={[styles.notifTime, { color: theme.textMuted }]}>{shortDate(n.time)}</Text>
                </View>
              </PressableScale>
            ))
          )}
        </GlassCard>
      </StaggeredItem>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 24, fontWeight: '700' },
  markAll: { paddingHorizontal: 12, paddingVertical: 6 },
  markAllText: { fontSize: 13, fontWeight: '600' },
  row: { flexDirection: 'row', paddingVertical: spacing.md, gap: spacing.md },
  divider: { borderTopWidth: 1, borderTopColor: 'rgba(15,23,41,0.06)' },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  notifTitle: { fontSize: 15, fontWeight: '600' },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  notifBody: { fontSize: 13, marginTop: 2 },
  notifTime: { fontSize: 11, marginTop: 4 },
  empty: { alignItems: 'center', paddingVertical: spacing.xxxl, gap: spacing.md },
  emptyText: { fontSize: 15 },
});