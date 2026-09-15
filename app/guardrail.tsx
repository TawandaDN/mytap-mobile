import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GradientHeader } from '../src/components/ui/GradientHeader';
import { Card, ElevatedCard } from '../src/components/ui/CardSystem';
import { TileIcon, catColor } from '../src/components/ui/IconSystem';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { CountUp } from '../src/components/animations/CountUp';
import { Button } from '../src/components/ui/Button';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';
import { inter, layout, radii, space, text } from '../src/theme/tokens';

/**
 * Guardrail — spending limits and financial wellness.
 *
 * The progress visual is a dual-tone track: a soft rail with a crisp violet
 * indicator filling it on a steady 1500ms ease-out. Never a thick solid bar.
 */
export default function GuardrailScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [limit, setLimit] = useState(String(state.guardrail.monthlyLimit));
  const g = state.guardrail;

  /** Steady fill 0 → target, 1500ms ease-out — never a snap. */
  const fill = useSharedValue(0);
  useEffect(() => {
    fill.value = withTiming(Math.min(1, g.pct / 100), {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });
  }, [g.pct, fill]);

  const fillStyle = useAnimatedStyle(() => ({ flex: Math.max(0.0001, fill.value) }));

  const saveLimit = () => {
    const val = parseInt(limit, 10);
    if (!val || val <= 0) {
      show('Enter a valid limit', 'error');
      return;
    }
    dispatch({ type: 'SET_GUARDRAIL', limit: val });
    haptics.success();
    show('Spending limit updated');
  };

  const wellness = g.pct < 50 ? 'Excellent' : g.pct < 80 ? 'On track' : 'Watch out';
  const wellnessColor = g.pct < 50 ? '#2ECC71' : g.pct < 75 ? '#F5A623' : '#E74C3C';

  const tips = [
    { icon: 'trending-up' as const, text: 'You spent 12% less than last month. Keep it up!', color: catColor('transport') },
    { icon: 'pie-chart' as const, text: 'Groceries are your biggest category at 34% of spend.', color: catColor('savings') },
    { icon: 'bulb' as const, text: 'Set a P500 weekly budget for dining to save P2,000/month.', color: catColor('rewards') },
  ];

  return (
    <ScreenContainer edges={['bottom']} contentContainerStyle={styles.screenContent}>
      <View style={styles.headBleed}>
        <GradientHeader kind="generic">
          <View style={styles.headRow}>
            <PressableScale
              haptic="light"
              radius={radii.icon}
              style={styles.backBtn}
              onPress={() => {
                haptics.light();
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </PressableScale>
            <View style={styles.headText}>
              <Text style={styles.headKicker}>SPENDING</Text>
              <Text style={styles.headTitle}>Guardrail</Text>
            </View>
          </View>
        </GradientHeader>
      </View>

      <View style={styles.body}>
        {/* Spending overview */}
        <StaggeredItem index={0}>
          <ElevatedCard style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Text style={[styles.overviewLabel, { color: theme.textMuted }]}>
                Spent this month
              </Text>
              <View style={[styles.wellnessBadge, { backgroundColor: `${wellnessColor}1F` }]}>
                <View style={[styles.wellnessDot, { backgroundColor: wellnessColor }]} />
                <Text style={[styles.wellnessText, { color: wellnessColor }]}>{wellness}</Text>
              </View>
            </View>

            <CountUp
              value={g.used}
              format={(v) => `P ${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
              glow={g.pct < 50 ? 'emerald' : 'coral'}
              style={[styles.overviewValue, { color: theme.text }]}
            />

            {/* Dual-tone track — soft rail, crisp violet indicator */}
            <View style={[styles.progressTrack, { backgroundColor: theme.indicatorTrack }]}>
              <Animated.View
                style={[
                  styles.progressFill,
                  { backgroundColor: theme.indicator },
                  fillStyle,
                ]}
              />
              <View style={styles.progressSpacer} />
            </View>

            <View style={styles.overviewFooter}>
              <Text style={[styles.overviewSub, { color: theme.textMuted }]}>
                {g.pct}% of P{g.monthlyLimit.toLocaleString()} limit
              </Text>
              <Text style={[styles.overviewRemaining, { color: theme.text }]}>
                P{Math.max(0, g.monthlyLimit - g.used).toLocaleString()} left
              </Text>
            </View>
          </ElevatedCard>
        </StaggeredItem>

        {/* Set limit */}
        <StaggeredItem index={1}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Monthly limit</Text>
          <Card>
            <View style={styles.limitRow}>
              <TileIcon icon="flag" color={catColor('savings')} />
              <View style={styles.limitInfo}>
                <Text style={[styles.limitTitle, { color: theme.text }]}>Set your ceiling</Text>
                <Text style={[styles.limitSub, { color: theme.textMuted }]}>
                  We alert you as you approach it.
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.inputWrap,
                { borderColor: theme.hairline, backgroundColor: theme.background },
              ]}
            >
              <Text style={[styles.inputPrefix, { color: theme.textMuted }]}>P</Text>
              <TextInput
                value={limit}
                onChangeText={setLimit}
                keyboardType="number-pad"
                placeholder="10000"
                placeholderTextColor={theme.textMuted}
                style={[styles.input, { color: theme.text }]}
              />
            </View>
            <Button title="Save limit" onPress={saveLimit} variant="primary" fullWidth />
          </Card>
        </StaggeredItem>

        {/* Wellness tips */}
        <StaggeredItem index={2}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Financial wellness</Text>
          <Card padded={false}>
            {tips.map((tip, i) => (
              <View key={tip.icon}>
                {i > 0 && (
                  <View
                    style={[
                      styles.tipDivider,
                      { backgroundColor: theme.hairline, marginLeft: space.md + 44 + space.sm },
                    ]}
                  />
                )}
                <View style={styles.tipRow}>
                  <TileIcon icon={tip.icon} color={tip.color} />
                  <Text style={[styles.tipText, { color: theme.textSecondary }]}>{tip.text}</Text>
                </View>
              </View>
            ))}
          </Card>
        </StaggeredItem>
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
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radii.icon,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headText: {
    marginLeft: space.sm,
  },
  headKicker: {
    color: 'rgba(255,255,255,0.62)',
    ...text.label,
    fontFamily: inter.medium,
    letterSpacing: 1.2,
  },
  headTitle: {
    color: '#FFFFFF',
    ...text.screenTitle,
    marginTop: 1,
  },
  body: {
    paddingHorizontal: space.md,
  },

  overviewCard: {
    marginBottom: layout.cardGap,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewLabel: {
    ...text.label,
    letterSpacing: 0.5,
  },
  wellnessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: space.sm,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  wellnessDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  wellnessText: {
    ...text.label,
    fontFamily: inter.semibold,
    fontWeight: '700',
  },
  overviewValue: {
    ...text.hero,
    fontVariant: ['tabular-nums'],
    marginTop: space.xs,
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: space.md,
    flexDirection: 'row',
  },
  progressFill: {
    height: 5,
    borderRadius: 3,
  },
  progressSpacer: {
    flex: 1,
  },
  overviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: space.sm,
  },
  overviewSub: {
    ...text.caption,
  },
  overviewRemaining: {
    ...text.moneyTabular,
    fontSize: 14,
  },

  sectionTitle: {
    ...text.sectionHeader,
    marginTop: space.lg,
    marginBottom: layout.headerGap,
  },
  limitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.md,
  },
  limitInfo: {
    flex: 1,
    marginLeft: layout.iconToText,
  },
  limitTitle: {
    ...text.cardTitle,
  },
  limitSub: {
    ...text.caption,
    marginTop: layout.bodyToCaption,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.card,
    paddingHorizontal: space.md,
    marginBottom: layout.contentToButton,
  },
  inputPrefix: {
    fontSize: 20,
    fontFamily: inter.semibold,
    fontWeight: '600',
    marginRight: space.xs,
  },
  input: {
    flex: 1,
    fontSize: 20,
    lineHeight: 26,
    fontFamily: inter.semibold,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
    paddingVertical: space.sm + 2,
  },

  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  tipDivider: {
    height: StyleSheet.hairlineWidth,
  },
  tipText: {
    flex: 1,
    marginLeft: layout.iconToText,
    ...text.body,
    fontSize: 14.5,
  },
});
