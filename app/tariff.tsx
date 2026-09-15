import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GradientHeader } from '../src/components/ui/GradientHeader';
import { Card, DarkCard, ElevatedCard } from '../src/components/ui/CardSystem';
import { Divider, TileIcon, catColor } from '../src/components/ui/IconSystem';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { ProgressRing } from '../src/components/ui/ProgressRing';
import { SlideUpModal } from '../src/components/ui/SlideUpModal';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { shortDate } from '../src/utils/format';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';
import { inter, layout, radii, space, text } from '../src/theme/tokens';

/**
 * Tariff — the Telecom Asset Core view.
 *
 * The usage ring lives on a Dark Card (data surfaces are always dark, per the
 * card system), drawn with a thin, elegant stroke and the reading centred
 * exactly inside the circle. Plan detail, the per-category breakdown and the
 * insight each sit on a Standard / Elevated card.
 */
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
    <ScreenContainer edges={['bottom']} contentContainerStyle={styles.screenContent}>
      <View style={styles.headBleed}>
        <GradientHeader kind="generic">
          <Text style={styles.headKicker}>TELECOM</Text>
          <Text style={styles.headTitle}>Tariff</Text>
          <Text style={styles.headSub}>
            {t.provider} · {t.name}
          </Text>
        </GradientHeader>
      </View>

      <View style={styles.body}>
        {/* Usage ring — dark data surface, thin stroke, centred reading */}
        <StaggeredItem index={0}>
          <DarkCard style={styles.ringCard}>
            <View style={styles.ringWrap}>
              <ProgressRing
                size={188}
                strokeWidth={5}
                progress={t.usedPct / 100}
                color={ringColor}
                trackColor="rgba(255,255,255,0.09)"
              >
                <View style={styles.ringReading}>
                  <Text style={styles.ringValue}>{t.leftGB} GB</Text>
                  <Text style={styles.ringLabel}>LEFT</Text>
                </View>
              </ProgressRing>
            </View>

            <View style={styles.ringStats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{t.usedGB}GB</Text>
                <Text style={styles.statLabel}>Used</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{t.leftGB}GB</Text>
                <Text style={styles.statLabel}>Left</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statValue}>{t.totalGB}GB</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </DarkCard>
        </StaggeredItem>

        {/* Plan detail */}
        <StaggeredItem index={1}>
          <Card style={styles.planCard}>
            <View style={styles.planHeader}>
              <TileIcon icon="cellular" color={catColor('data')} />
              <View style={styles.planInfo}>
                <Text style={[styles.planName, { color: theme.text }]}>{t.name}</Text>
                <Text style={[styles.planProvider, { color: theme.textMuted }]}>{t.provider}</Text>
              </View>
              <View style={[styles.pctPill, { backgroundColor: `${ringColor}1F` }]}>
                <Text style={[styles.pctPillText, { color: ringColor }]}>{t.usedPct}%</Text>
              </View>
            </View>

            <Divider indent={0} />

            <View style={styles.planFooter}>
              <View>
                <Text style={[styles.footerLabel, { color: theme.textMuted }]}>Renews</Text>
                <Text style={[styles.footerValue, { color: theme.text }]}>
                  {shortDate(t.renews)}
                </Text>
              </View>
              <View>
                <Text style={[styles.footerLabel, { color: theme.textMuted }]}>Avg / day</Text>
                <Text style={[styles.footerValue, { color: theme.text }]}>{t.avgDaily}GB</Text>
              </View>
              <PressableScale
                haptic="medium"
                radius={radii.pill}
                style={styles.manageBtn}
                onPress={() => {
                  setBundleModal(true);
                  haptics.medium();
                }}
              >
                <Text style={styles.manageText}>Add bundle</Text>
              </PressableScale>
            </View>

            <PressableScale
              haptic="light"
              radius={radii.card}
              style={[styles.autoRenewRow, { borderColor: theme.hairline }]}
              onPress={() => {
                dispatch({ type: 'TOGGLE_AUTO_RENEW' });
                haptics.toggle();
              }}
            >
              <TileIcon icon="refresh" color={catColor('data')} size={32} radius={11} glyph={16} />
              <Text style={[styles.autoRenewText, { color: theme.textSecondary }]}>Auto-renew</Text>
              <View
                style={[
                  styles.autoRenewToggle,
                  { backgroundColor: t.autoRenew ? theme.primary : theme.indicatorTrack },
                ]}
              >
                <View
                  style={[styles.autoRenewKnob, { alignSelf: t.autoRenew ? 'flex-end' : 'flex-start' }]}
                />
              </View>
            </PressableScale>
          </Card>
        </StaggeredItem>

        {/* Usage breakdown */}
        <StaggeredItem index={2}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Usage breakdown</Text>
          <Card style={styles.breakdownCard}>
            {t.breakdown.map((u) => {
              const pct = Math.round((u.value / t.usedGB) * 100);
              return (
                <View key={u.label} style={styles.breakdownItem}>
                  <View style={styles.breakdownHead}>
                    <View style={[styles.usageDot, { backgroundColor: u.color }]} />
                    <Text style={[styles.usageLabel, { color: theme.text }]}>{u.label}</Text>
                    <Text style={[styles.usageValue, { color: theme.textMuted }]}>{u.value} GB</Text>
                  </View>
                  <View style={[styles.miniTrack, { backgroundColor: theme.indicatorTrack }]}>
                    <View style={[styles.miniFill, { width: `${pct}%`, backgroundColor: u.color }]} />
                  </View>
                </View>
              );
            })}
          </Card>
        </StaggeredItem>

        {/* Insight */}
        <StaggeredItem index={3}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Insight</Text>
          <ElevatedCard style={styles.insightCard}>
            <View style={styles.insightRow}>
              <TileIcon icon="bulb" color={catColor('rewards')} />
              <View style={styles.insightBody}>
                <Text style={[styles.insightTitle, { color: theme.text }]}>
                  Running faster than usual
                </Text>
                <Text style={[styles.insightText, { color: theme.textSecondary }]}>
                  At {t.avgDaily}GB a day you have roughly {t.runwayDays}{' '}
                  {t.runwayDays === 1 ? 'day' : 'days'} of runway. Add a bundle before{' '}
                  {shortDate(t.renews)} to avoid a hard stop.
                </Text>
              </View>
            </View>
          </ElevatedCard>
        </StaggeredItem>
      </View>

      <SlideUpModal visible={bundleModal} onClose={() => setBundleModal(false)}>
        <Text style={[styles.modalTitle, { color: theme.text }]}>Add a bundle</Text>
        <Text style={[styles.modalSub, { color: theme.textMuted }]}>
          Choose extra data for {t.provider}
        </Text>
        {[1, 2, 5, 10].map((gb) => (
          <PressableScale
            key={gb}
            haptic="light"
            radius={radii.card}
            style={[styles.bundleOption, { borderColor: theme.hairline }]}
            onPress={() => {
              haptics.selection();
              addBundle(gb);
            }}
          >
            <TileIcon icon="cellular" color={catColor('data')} size={36} radius={12} glyph={18} />
            <Text style={[styles.bundleName, { color: theme.text }]}>{gb}GB bundle</Text>
            <Text style={[styles.bundlePrice, { color: theme.textMuted }]}>P{gb * 15}</Text>
          </PressableScale>
        ))}
      </SlideUpModal>
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
    color: '#2ECC71',
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

  ringCard: {
    marginBottom: layout.cardGap,
  },
  ringWrap: {
    alignItems: 'center',
    paddingVertical: space.sm,
  },
  /** Exact optical centring inside the ring. */
  ringReading: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringValue: {
    fontSize: 34,
    lineHeight: 38,
    fontFamily: inter.bold,
    fontWeight: '700',
    letterSpacing: -0.6,
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  ringLabel: {
    ...text.label,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  ringStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: space.lg,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 17,
    lineHeight: 22,
    fontFamily: inter.semibold,
    fontWeight: '600',
    color: '#FFFFFF',
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    ...text.caption,
    fontSize: 12,
    color: 'rgba(255,255,255,0.58)',
    marginTop: 2,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    height: 26,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  planCard: {
    marginBottom: layout.cardGap,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
    marginLeft: layout.iconToText,
  },
  planName: {
    ...text.cardTitle,
  },
  planProvider: {
    ...text.caption,
    marginTop: 1,
  },
  pctPill: {
    paddingHorizontal: space.sm,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  pctPillText: {
    ...text.label,
    fontFamily: inter.semibold,
    fontWeight: '700',
  },

  planFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
    marginVertical: space.md,
  },
  footerLabel: {
    ...text.label,
  },
  footerValue: {
    ...text.cardTitle,
    fontVariant: ['tabular-nums'],
    marginTop: 1,
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B6B4F',
    paddingHorizontal: space.md,
    paddingVertical: space.xs + 2,
  },
  manageText: {
    color: '#FFFFFF',
    ...text.caption,
    fontFamily: inter.semibold,
    fontWeight: '600',
  },

  autoRenewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.card,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs + 2,
  },
  autoRenewText: {
    flex: 1,
    marginLeft: space.xxs,
    ...text.body,
    fontSize: 14.5,
    fontFamily: inter.medium,
    fontWeight: '500',
  },
  autoRenewToggle: {
    width: 42,
    height: 24,
    borderRadius: 12,
    padding: 3,
  },
  autoRenewKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
  },

  sectionTitle: {
    ...text.sectionHeader,
    marginTop: space.lg,
    marginBottom: layout.headerGap,
  },
  breakdownCard: {
    gap: space.sm,
  },
  breakdownItem: {
    gap: 7,
  },
  breakdownHead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usageDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    marginRight: space.sm,
  },
  usageLabel: {
    flex: 1,
    ...text.body,
    fontSize: 14.5,
  },
  usageValue: {
    ...text.moneyTabular,
    fontSize: 13,
  },
  miniTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginLeft: 21,
  },
  miniFill: {
    height: 4,
    borderRadius: 2,
  },

  insightCard: {
    marginBottom: space.xs,
  },
  insightRow: {
    flexDirection: 'row',
    gap: layout.iconToText,
    alignItems: 'flex-start',
  },
  insightBody: {
    flex: 1,
  },
  insightTitle: {
    ...text.cardTitle,
  },
  insightText: {
    ...text.body,
    fontSize: 14.5,
    marginTop: layout.bodyToCaption,
  },

  modalTitle: {
    ...text.screenTitle,
    fontSize: 22,
    marginBottom: space.xxs,
  },
  modalSub: {
    ...text.caption,
    marginBottom: space.lg,
  },
  bundleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: layout.iconToText,
    borderWidth: StyleSheet.hairlineWidth,
    padding: space.sm,
    marginBottom: space.xs,
  },
  bundleName: {
    flex: 1,
    ...text.body,
    fontFamily: inter.semibold,
    fontWeight: '600',
  },
  bundlePrice: {
    ...text.moneyTabular,
  },
});
