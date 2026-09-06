import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Circle, G } from 'react-native-svg';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { CountUp } from '../src/components/animations/CountUp';
import { useApp } from '../src/store/AppStore';
import { buildInsights, categoryBreakdown, monthlySpend } from '../src/utils/insights';
import { formatPula } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function InsightsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state } = useApp();

  const breakdown = useMemo(() => categoryBreakdown(state.transactions), [state.transactions]);
  const insights = useMemo(() => buildInsights(state.transactions), [state.transactions]);
  const spend = useMemo(() => monthlySpend(state.transactions), [state.transactions]);

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}>
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </PressableScale>
          <View style={styles.headerInfo}>
            <Text style={[styles.title, { color: theme.text }]}>Insights</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>Your money, understood</Text>
          </View>
          <View style={[styles.sparkle, { backgroundColor: theme.accent + '22' }]}>
            <Ionicons name="sparkles" size={18} color={theme.accent} />
          </View>
        </View>
      </StaggeredItem>

      {/* Monthly spend hero */}
      <StaggeredItem index={1}>
        <GlassCard bubbleColor={`${theme.accent}22`} style={styles.heroCard}>
          <Text style={[styles.heroLabel, { color: theme.textMuted }]}>Spent this month</Text>
          <CountUp
            value={spend.total}
            format={(v) => formatPula(v)}
            glow="gold"
            style={[styles.heroValue, { color: theme.text }]}
          />
          <View style={styles.heroDelta}>
            <Ionicons name="trending-up" size={14} color="#FF6B4A" />
            <Text style={[styles.heroDeltaText, { color: theme.textMuted }]}>
              {spend.deltaPct}% vs last month
            </Text>
          </View>
        </GlassCard>
      </StaggeredItem>

      {/* Category donut */}
      <StaggeredItem index={2}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Where your money goes</Text>
        <GlassCard bubble={false}>
          <View style={styles.donutRow}>
            <DonutChart data={breakdown} size={150} stroke={18} />
            <View style={styles.legend}>
              {breakdown.slice(0, 4).map((b) => (
                <View key={b.category} style={styles.legendRow}>
                  <View style={[styles.legendDot, { backgroundColor: b.color }]} />
                  <Text style={[styles.legendLabel, { color: theme.textSecondary }]}>{b.category}</Text>
                  <Text style={[styles.legendPct, { color: theme.textMuted }]}>{b.pct}%</Text>
                </View>
              ))}
            </View>
          </View>
        </GlassCard>
      </StaggeredItem>

      {/* Top merchants */}
      <StaggeredItem index={3}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Top merchants</Text>
        <GlassCard bubble={false}>
          {breakdown.slice(0, 3).map((b, i) => (
            <View key={b.category} style={[styles.merchantRow, i > 0 && styles.divider]}>
              <View style={[styles.merchantIcon, { backgroundColor: b.color + '22' }]}>
                <Ionicons name="storefront" size={16} color={b.color} />
              </View>
              <View style={styles.merchantInfo}>
                <Text style={[styles.merchantName, { color: theme.text }]}>{b.category}</Text>
                <View style={styles.merchantBarTrack}>
                  <View
                    style={[
                      styles.merchantBarFill,
                      { width: `${b.pct}%`, backgroundColor: b.color },
                    ]}
                  />
                </View>
              </View>
              <Text style={[styles.merchantAmount, { color: theme.text }]}>
                {formatPula(b.total)}
              </Text>
            </View>
          ))}
        </GlassCard>
      </StaggeredItem>

      {/* Insight cards */}
      <StaggeredItem index={4}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Smart insights</Text>
      </StaggeredItem>
      {insights.map((ins, i) => (
        <StaggeredItem key={ins.id} index={5 + i}>
          <PressableScale
            style={[styles.insightCard, { borderColor: theme.border, backgroundColor: theme.surface }]}
            onPress={() => haptics.medium()}
          >
            <View style={[styles.insightIcon, { backgroundColor: ins.color + '22' }]}>
              <Ionicons name={ins.icon as any} size={20} color={ins.color} />
            </View>
            <View style={styles.insightBody}>
              <Text style={[styles.insightTitle, { color: theme.text }]}>{ins.title}</Text>
              <Text style={[styles.insightText, { color: theme.textMuted }]}>{ins.body}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </PressableScale>
        </StaggeredItem>
      ))}
    </ScreenContainer>
  );
}

function StaggerItem({ children, index }: { children: React.ReactNode; index: number }) {
  return <StaggeredItem index={index}>{children}</StaggeredItem>;
}

function DonutChart({
  data,
  size,
  stroke,
}: {
  data: { category: string; total: number; pct: number; color: string }[];
  size: number;
  stroke: number;
}) {
  const { theme } = useTheme();
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const total = data.reduce((s, d) => s + d.total, 0) || 1;
  let offset = 0;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(15,23,41,0.08)" strokeWidth={stroke} fill="none" />
        {data.map((d) => {
          const frac = d.total / total;
          const dash = frac * c;
          const el = (
            <Circle
              key={d.category}
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={d.color}
              strokeWidth={stroke}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
          offset += dash;
          return el;
        })}
      </Svg>
      <View style={styles.donutCenter}>
        <Text style={[styles.donutValue, { color: theme.text }]}>{data.length}</Text>
        <Text style={[styles.donutLabel, { color: theme.textMuted }]}>categories</Text>
      </View>
    </View>
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
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  sparkle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    marginBottom: spacing.xl,
  },
  heroLabel: {
    fontSize: 13,
  },
  heroValue: {
    fontSize: 40,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  heroDelta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  heroDeltaText: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  donutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xl,
  },
  donutCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  donutLabel: {
    fontSize: 11,
  },
  legend: {
    flex: 1,
    gap: spacing.sm,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  legendPct: {
    fontSize: 13,
    fontWeight: '600',
  },
  merchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,23,41,0.06)',
  },
  merchantIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  merchantTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(15,23,41,0.08)',
    overflow: 'hidden',
  },
  merchantBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(15,23,41,0.08)',
    overflow: 'hidden',
  },
  merchantBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  merchantAmount: {
    fontSize: 14,
    fontWeight: '600',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  insightIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightBody: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  insightText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
  },
});