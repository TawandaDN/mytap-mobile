import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { ProgressRing } from '../src/components/ui/ProgressRing';
import { Button } from '../src/components/ui/Button';
import { SlideUpModal } from '../src/components/ui/SlideUpModal';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { shortDate } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function TariffScreen() {
  const { theme } = useTheme();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [bundleModal, setBundleModal] = useState(false);
  const t = state.tariff;

  const ringColor = t.usedPct < 60 ? '#2ECC71' : t.usedPct < 85 ? '#F5A623' : '#E74C3C';

  const addBundle = (gb: number) => {
    dispatch({ type: 'ADD_BUNDLE', gb });
    setBundleModal(false);
    haptics.success();
    show(`Added ${gb}GB to your bundle`);
  };

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <Text style={[styles.title, { color: theme.text }]}>Tariff</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>Your data usage</Text>
      </StaggeredItem>

      {/* Usage ring */}
      <StaggeredItem index={1}>
        <GlassCard bubbleColor="rgba(46,204,113,0.15)" style={styles.ringCard}>
          <View style={styles.ringWrap}>
            <ProgressRing
              size={190}
              strokeWidth={7}
              progress={t.usedPct / 100}
              color={ringColor}
              trackColor={theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(16,24,40,0.05)'}
            >
              <Text style={[styles.ringPct, { color: theme.text }]}>{t.leftGB} GB</Text>
              <Text style={[styles.ringLabel, { color: theme.textMuted }]}>remaining</Text>
            </ProgressRing>
          </View>
          <View style={styles.ringStats}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.text }]}>{t.usedGB}GB</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Used</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.text }]}>{t.leftGB}GB</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Left</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.text }]}>{t.totalGB}GB</Text>
              <Text style={[styles.statLabel, { color: theme.textMuted }]}>Total</Text>
            </View>
          </View>
        </GlassCard>
      </StaggeredItem>

      {/* Plan info */}
      <StaggeredItem index={2}>
        <GlassCard bubble={false}>
          <View style={styles.planHeader}>
            <View style={[styles.planIcon, { backgroundColor: t.color + '22' }]}>
              <Ionicons name="cellular" size={20} color={t.color} />
            </View>
            <View style={styles.planInfo}>
              <Text style={[styles.planName, { color: theme.text }]}>{t.name}</Text>
              <Text style={[styles.planProvider, { color: theme.textMuted }]}>{t.provider}</Text>
            </View>
          </View>
          <View style={styles.planFooter}>
            <Text style={[styles.planRenew, { color: theme.textMuted }]}>
              Renews {shortDate(t.renews)}
            </Text>
            <PressableScale style={styles.manageBtn} onPress={() => { setBundleModal(true); haptics.medium(); }}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.manageText}>Manage</Text>
            </PressableScale>
          </View>
          <PressableScale
            style={[styles.autoRenewRow, { borderColor: theme.hairline }]}
            onPress={() => { dispatch({ type: 'TOGGLE_AUTO_RENEW' }); haptics.toggle(); }}
          >
            <Ionicons name="refresh" size={16} color={t.color} />
            <Text style={[styles.autoRenewText, { color: theme.textSecondary }]}>Auto-renew</Text>
            <View style={[styles.autoRenewToggle, { backgroundColor: t.autoRenew ? theme.primary : 'rgba(16,24,40,0.15)' }]}>
              <View style={[styles.autoRenewKnob, { alignSelf: t.autoRenew ? 'flex-end' : 'flex-start' }]} />
            </View>
          </PressableScale>
        </GlassCard>
      </StaggeredItem>

      {/* Usage breakdown */}
      <StaggeredItem index={3}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Usage breakdown</Text>
        <GlassCard solid style={styles.breakdownCard}>
          {t.breakdown.map((u, i) => {
            const pct = Math.round((u.value / t.usedGB) * 100);
            return (
              <View key={u.label} style={styles.breakdownItem}>
                <View style={styles.breakdownHead}>
                  <View style={[styles.usageDot, { backgroundColor: u.color }]} />
                  <Text style={[styles.usageLabel, { color: theme.text }]}>{u.label}</Text>
                  <Text style={[styles.usageValue, { color: theme.textMuted }]}>
                    {u.value} GB
                  </Text>
                </View>
                <View
                  style={[
                    styles.miniTrack,
                    {
                      backgroundColor:
                        theme.mode === 'dark' ? 'rgba(255,255,255,0.07)' : 'rgba(16,24,40,0.05)',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.miniFill,
                      { width: `${pct}%`, backgroundColor: u.color },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </GlassCard>
      </StaggeredItem>

      {/* Insights */}
      <StaggeredItem index={4}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Insights</Text>
        <GlassCard bubbleColor="rgba(245,166,35,0.15)">
          <View style={styles.insightRow}>
            <Ionicons name="bulb-outline" size={20} color="#F5A623" />
            <Text style={[styles.insightText, { color: theme.textSecondary }]}>
              You're using data faster than usual. Consider adding a bundle before {shortDate(t.renews)}.
            </Text>
          </View>
        </GlassCard>
      </StaggeredItem>

      <SlideUpModal visible={bundleModal} onClose={() => setBundleModal(false)}>
        <Text style={[styles.modalTitle, { color: theme.text }]}>Add a bundle</Text>
        <Text style={[styles.modalSub, { color: theme.textMuted }]}>Choose extra data for {t.provider}</Text>
        {[1, 2, 5, 10].map((gb) => (
          <PressableScale
            key={gb}
            style={[styles.bundleOption, { borderColor: theme.hairline }]}
            onPress={() => {
              haptics.selection();
              addBundle(gb);
            }}
          >
            <View style={[styles.bundleIcon, { backgroundColor: t.color + '22' }]}>
              <Ionicons name="cellular" size={18} color={t.color} />
            </View>
            <Text style={[styles.bundleName, { color: theme.text }]}>{gb}GB bundle</Text>
            <Text style={[styles.bundlePrice, { color: theme.textMuted }]}>P{gb * 15}</Text>
          </PressableScale>
        ))}
      </SlideUpModal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...type.largeTitle,
    marginBottom: 4,
  },
  subtitle: {
    ...type.body,
    marginBottom: spacing.xl,
  },
  ringCard: {
    marginBottom: spacing.xl,
  },
  ringWrap: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  ringPct: {
    ...type.display,
    fontVariant: ['tabular-nums'],
  },
  ringLabel: {
    ...type.caption,
  },
  ringStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.lg,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...type.heading,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    ...type.caption,
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(16,24,40,0.08)',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  planIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    ...type.subheading,
    fontWeight: '600',
  },
  planProvider: {
    ...type.caption,
  },
  planFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  planRenew: {
    ...type.caption,
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0B6B4F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
  },
  manageText: {
    color: '#fff',
    ...type.caption,
    fontWeight: '600',
  },
  autoRenewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.lg,
  },
  autoRenewText: {
    flex: 1,
    ...type.caption,
    fontWeight: '500',
  },
  autoRenewToggle: {
    width: 40,
    height: 22,
    borderRadius: 11,
    padding: 2,
  },
  autoRenewKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    ...type.heading,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  usageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  usageDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(16,24,40,0.06)',
  },
  breakdownCard: {
    gap: spacing.md,
  },
  breakdownItem: {
    gap: 7,
  },
  breakdownHead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usageDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.md,
  },
  usageLabel: {
    flex: 1,
    ...type.body,
  },
  usageValue: {
    ...type.money,
    fontSize: 13,
  },
  miniTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginLeft: 23,
  },
  miniFill: {
    height: 4,
    borderRadius: 2,
  },
  insightRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  insightText: {
    flex: 1,
    ...type.caption,
    fontSize: 14,
    lineHeight: 21,
  },
  modalTitle: {
    ...type.title,
    marginBottom: 4,
  },
  modalSub: {
    ...type.caption,
    marginBottom: spacing.xl,
  },
  bundleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  bundleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bundleName: {
    flex: 1,
    ...type.body,
    fontWeight: '600',
  },
  bundlePrice: {
    ...type.money,
  },
});
