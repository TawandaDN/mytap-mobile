import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
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
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { CountUp } from '../src/components/animations/CountUp';
import { Button } from '../src/components/ui/Button';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

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

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}>
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>Guardrail</Text>
        </View>
      </StaggeredItem>

      {/* Spending overview */}
      <StaggeredItem index={1}>
        <GlassCard bubbleColor="rgba(46,204,113,0.15)">
          <View style={styles.overviewHeader}>
            <Text style={[styles.overviewLabel, { color: theme.textMuted }]}>Spent this month</Text>
            <View style={[styles.wellnessBadge, { backgroundColor: g.pct < 50 ? '#2ECC71' : g.pct < 75 ? '#F5A623' : '#E74C3C' }]}>
              <Text style={styles.wellnessText}>{wellness}</Text>
            </View>
          </View>
          <CountUp
            value={g.used}
            format={(v) => `P${v.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            glow={g.pct < 50 ? 'emerald' : 'coral'}
            style={[styles.overviewValue, { color: theme.text }]}
          />
          {/* Dual-tone track — soft grey rail with a crisp violet indicator */}
          <View
            style={[
              styles.progressTrack,
              {
                backgroundColor:
                  theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(16,24,40,0.055)',
              },
            ]}
          >
            <Animated.View
              style={[
                styles.progressFill,
                { backgroundColor: theme.indicator },
                fillStyle,
              ]}
            />
            <View style={styles.progressSpacer} />
          </View>
          <Text style={[styles.overviewSub, { color: theme.textMuted }]}>
            {g.pct}% of P{g.monthlyLimit.toLocaleString()} limit
          </Text>
        </GlassCard>
      </StaggeredItem>

      {/* Set limit */}
      <StaggeredItem index={2}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Monthly limit</Text>
        <GlassCard bubble={false}>
          <View style={[styles.inputWrap, { borderColor: theme.border }]}>
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
          <Button title="Save limit" onPress={saveLimit} variant="gold" style={styles.saveBtn} />
        </GlassCard>
      </StaggeredItem>

      {/* Wellness tips */}
      <StaggeredItem index={3}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Financial wellness</Text>
        <GlassCard bubbleColor="rgba(245,166,35,0.15)">
          {[
            { icon: 'trending-up', text: 'You spent 12% less than last month. Keep it up!', color: '#2ECC71' },
            { icon: 'pie-chart', text: 'Groceries are your biggest category at 34% of spend.', color: '#3498DB' },
            { icon: 'bulb', text: 'Set a P500 weekly budget for dining to save P2,000/month.', color: '#F5A623' },
          ].map((tip, i) => (
            <View key={i} style={[styles.tipRow, i > 0 && styles.tipDivider]}>
              <View style={[styles.tipIcon, { backgroundColor: tip.color + '22' }]}>
                <Ionicons name={tip.icon as any} size={18} color={tip.color} />
              </View>
              <Text style={[styles.tipText, { color: theme.textSecondary }]}>{tip.text}</Text>
            </View>
          ))}
        </GlassCard>
      </StaggeredItem>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...type.title,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewLabel: {
    ...type.caption,
  },
  wellnessBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  wellnessText: {
    color: '#fff',
    ...type.small,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  overviewValue: {
    ...type.hero,
    fontVariant: ['tabular-nums'],
    marginTop: spacing.sm,
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: spacing.lg,
    flexDirection: 'row',
  },
  progressFill: {
    height: 5,
    borderRadius: 3,
  },
  progressSpacer: {
    flex: 1,
  },
  overviewSub: {
    ...type.caption,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...type.heading,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  inputPrefix: {
    ...type.title,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    ...type.title,
    fontVariant: ['tabular-nums'],
    paddingVertical: spacing.lg,
  },
  saveBtn: {
    marginTop: spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  tipDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(16,24,40,0.06)',
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipText: {
    flex: 1,
    ...type.caption,
    fontSize: 14,
    lineHeight: 21,
  },
});
