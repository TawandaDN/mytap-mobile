import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { GlassCard } from '../../src/components/cards/GlassCard';
import { StaggeredItem } from '../../src/components/animations/Staggered';
import { ProgressRing } from '../../src/components/ui/ProgressRing';
import { Button } from '../../src/components/ui/Button';
import { SlideUpModal } from '../../src/components/ui/SlideUpModal';
import { useToast } from '../../src/components/ui/Toast';
import { useApp } from '../../src/store/AppStore';
import { shortDate } from '../../src/utils/format';
import { spacing, type, radius } from '../../src/theme';
import { haptics } from '../../src/utils/haptics';
import { PressableScale } from '../../src/components/ui/PressableScale';

export default function TariffScreen() {
  const { theme } = useTheme();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [bundleModal, setBundleModal] = useState(false);
  const t = state.tariff;
  const ringColor = t.usedPct < 60 ? '#2ECC71' : t.usedPct < 85 ? '#F5A623' : '#E74C3C';
  const addBundle = (gb: number) => { dispatch({ type: 'ADD_BUNDLE', gb }); setBundleModal(false); haptics.success(); show(`Added ${gb}GB to your bundle`); };
  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <Text style={[styles.title, { color: theme.text }]}>Tariff</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>Your data usage</Text>
      </StaggeredItem>
      <StaggeredItem index={1}>
        <GlassCard bubbleColor="rgba(46,204,113,0.15)" style={styles.ringCard}>
          <View style={styles.ringWrap}>
            <ProgressRing size={200} strokeWidth={16} progress={t.usedPct / 100} gradient={[ringColor, t.usedPct < 60 ? '#2ECC71' : '#F5A623', '#E74C3C']}>
              <Text style={[styles.ringPct, { color: theme.text }]}>{t.usedPct}%</Text>
              <Text style={[styles.ringLabel, { color: theme.textMuted }]}>used</Text>
            </ProgressRing>
          </View>
          <View style={styles.ringStats}>
            <View style={styles.stat}><Text style={[styles.statValue, { color: theme.text }]}>{t.usedGB}GB</Text><Text style={[styles.statLabel, { color: theme.textMuted }]}>Used</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.stat}><Text style={[styles.statValue, { color: theme.text }]}>{t.leftGB}GB</Text><Text style={[styles.statLabel, { color: theme.textMuted }]}>Left</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.stat}><Text style={[styles.statValue, { color: theme.text }]}>{t.totalGB}GB</Text><Text style={[styles.statLabel, { color: theme.textMuted }]}>Total</Text></View>
          </View>
        </GlassCard>
      </StaggeredItem>
      <StaggeredItem index={2}>
        <GlassCard bubble={false}>
          <View style={styles.planHeader}>
            <View style={[styles.planIcon, { backgroundColor: t.color + '22' }]}><Ionicons name="cellular" size={20} color={t.color} /></View>
            <View style={styles.planInfo}>
              <Text style={[styles.planName, { color: theme.text }]}>{t.name}</Text>
              <Text style={[styles.planProvider, { color: theme.textMuted }]}>{t.provider}</Text>
            </View>
          </View>
          <View style={styles.planFooter}>
            <Text style={[styles.planRenew, { color: theme.textMuted }]}>Renews {shortDate(t.renews)}</Text>
            <PressableScale style={styles.manageBtn} onPress={() => { setBundleModal(true); haptics.medium(); }}><Ionicons name="add" size={16} color="#fff" /><Text style={styles.manageText}>Manage</Text></PressableScale>
          </View>
        </GlassCard>
      </StaggeredItem>
      <StaggeredItem index={3}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Usage breakdown</Text>
        <GlassCard bubble={false}>
          {[{ label: 'Social media', value: 3.2, color: '#3498DB' }, { label: 'Streaming', value: 2.8, color: '#8A4A9A' }, { label: 'Browsing', value: 1.6, color: '#2ECC71' }, { label: 'Other', value: 0.8, color: '#F5A623' }].map((u, i) => (
            <View key={u.label} style={[styles.usageRow, i > 0 && styles.usageDivider]}>
              <View style={[styles.usageDot, { backgroundColor: u.color }]} />
              <Text style={[styles.usageLabel, { color: theme.text }]}>{u.label}</Text>
              <Text style={[styles.usageValue, { color: theme.textMuted }]}>{u.value}GB</Text>
            </View>
          ))}
        </GlassCard>
      </StaggeredItem>
      <StaggeredItem index={4}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Insights</Text>
        <GlassCard bubbleColor="rgba(245,166,35,0.15)">
          <View style={styles.insightRow}>
            <Ionicons name="bulb-outline" size={20} color="#F5A623" />
            <Text style={[styles.insightText, { color: theme.textSecondary }]}>You're using data faster than usual. Consider adding a bundle before {shortDate(t.renews)}.</Text>
          </View>
        </GlassCard>
      </StaggeredItem>
      <SlideUpModal visible={bundleModal} onClose={() => setBundleModal(false)}>
        <Text style={[styles.modalTitle, { color: theme.text }]}>Add a bundle</Text>
        <Text style={[styles.modalSub, { color: theme.textMuted }]}>Choose extra data for {t.provider}</Text>
        {[1, 2, 5, 10].map((gb) => (
          <PressableScale key={gb} style={[styles.bundleOption, { borderColor: theme.border }]} onPress={() => { haptics.selection(); addBundle(gb); }}>
            <View style={[styles.bundleIcon, { backgroundColor: t.color + '22' }]}><Ionicons name="cellular" size={18} color={t.color} /></View>
            <Text style={[styles.bundleName, { color: theme.text }]}>{gb}GB bundle</Text>
            <Text style={[styles.bundlePrice, { color: theme.textMuted }]}>P{gb * 15}</Text>
          </PressableScale>
        ))}
      </SlideUpModal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 15, marginBottom: spacing.xl },
  ringCard: { marginBottom: spacing.xl },
  ringWrap: { alignItems: 'center', paddingVertical: spacing.lg },
  ringPct: { fontSize: 40, fontWeight: '700' },
  ringLabel: { fontSize: 14 },
  ringStats: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: spacing.lg },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(15,23,41,0.08)' },
  planHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  planIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  planInfo: { flex: 1 },
  planName: { fontSize: 17, fontWeight: '600' },
  planProvider: { fontSize: 13 },
  planFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg },
  planRenew: { fontSize: 13 },
  manageBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#2ECC71', paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.pill },
  manageText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: spacing.xl, marginBottom: spacing.md },
  usageRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  usageDivider: { borderTopWidth: 1, borderTopColor: 'rgba(15,23,41,0.06)' },
  usageDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.md },
  usageLabel: { flex: 1, fontSize: 15 },
  usageValue: { fontSize: 15, fontWeight: '600' },
  insightRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  insightText: { flex: 1, fontSize: 14, lineHeight: 20 },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
  modalSub: { fontSize: 14, marginBottom: spacing.xl },
  bundleOption: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.sm },
  bundleIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  bundleName: { flex: 1, fontSize: 15, fontWeight: '600' },
  bundlePrice: { fontSize: 14, fontWeight: '600' },
});