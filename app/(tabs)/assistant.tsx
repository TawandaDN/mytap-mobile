import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { GradientHeader } from '../../src/components/ui/GradientHeader';
import { Card, ElevatedCard } from '../../src/components/ui/CardSystem';
import { TileIcon, catColor } from '../../src/components/ui/IconSystem';
import { FadeIn, StaggeredItem } from '../../src/components/animations/Staggered';
import { useApp } from '../../src/store/AppStore';
import { userProfile } from '../../src/data/mock';
import { formatPula, formatPx, shortDate } from '../../src/utils/format';
import { haptics } from '../../src/utils/haptics';
import { PressableScale } from '../../src/components/ui/PressableScale';
import { inter, layout, radii, space, text } from '../../src/theme/tokens';

/**
 * Assistant.
 *
 * A grounded answer surface — not a chat window. It states plainly what it is
 * looking at, answers only from the saved MyTap picture, and never invents a
 * balance or moves money. Every answer is computed from live local state.
 *
 * There are no conversational bubbles, no typing cursor, no streaming feed —
 * the picture and the answer are simply present, in native lists.
 */
export default function AssistantScreen() {
  const { theme } = useTheme();
  const { state } = useApp();
  const [query, setQuery] = useState('');
  const [asked, setAsked] = useState<string | null>(null);

  /** Grounded answer, derived strictly from the saved data. */
  const answer = useMemo(() => {
    if (!asked) return null;
    const q = asked.toLowerCase();

    if (q.includes('grocer') || q.includes('food') || q.includes('choppies')) {
      const spend = state.transactions
        .filter((t) => /choppies|grocery|shoprite/i.test(t.merchant))
        .reduce((s, t) => s + Math.abs(t.amount), 0);
      return `You have spent ${formatPula(spend)} on groceries — across ${state.transactions.filter((t) => /choppies|grocery/i.test(t.merchant)).length} purchases, mostly at Choppies Phakalane.`;
    }

    if (q.includes('data') || q.includes('expire') || q.includes('gb') || q.includes('bundle')) {
      const t = state.tariff;
      return `Your ${t.provider} ${t.name} has ${t.leftGB}GB remaining of ${t.totalGB}GB (${t.usedPct}% used). It renews on ${shortDate(t.renews)} — roughly ${t.runwayDays} day${t.runwayDays === 1 ? '' : 's'} of runway at ${t.avgDaily}GB/day.`;
    }

    if (q.includes('balance') || q.includes('wallet') || q.includes('how much do i have')) {
      const total = state.cards.reduce((s, c) => s + c.balance, 0);
      return `Your total balance is ${formatPula(total)} across ${state.cards.length} cards and wallets. The MyTap Wallet holds ${formatPula(state.cards[0]?.balance ?? 0)}.`;
    }

    if (q.includes('limit') || q.includes('guardrail') || q.includes('budget')) {
      return `Your monthly guardrail is ${formatPula(state.guardrail.monthlyLimit)} and you have used ${formatPx(state.guardrail.used)} — ${state.guardrail.pct}% of the limit.`;
    }

    if (q.includes('save') || q.includes('goal') || q.includes('savings')) {
      const g = state.savingsGoals[0];
      const pct = g ? Math.round((g.saved / g.target) * 100) : 0;
      return g
        ? `Your ${g.name} is ${pct}% funded at ${formatPula(g.saved)} of ${formatPula(g.target)}. Adding ${formatPula(g.monthly)} a month keeps it on track for ${shortDate(g.deadline)}.`
        : 'You have no savings goals yet — you can create one from Savings.';
    }

    if (q.includes('reward') || q.includes('points')) {
      return `You hold ${state.totalPoints.toLocaleString()} MyTap Points, worth about ${formatPula(state.totalPoints / 10)}. Redeem them from Rewards.`;
    }

    if (q.includes('spend') || q.includes('spent')) {
      const total = state.transactions.reduce((s, t) => s + Math.abs(t.amount), 0);
      return `Across your ${state.transactions.length} recorded transactions you have moved ${formatPula(total)}, most recently at ${state.transactions[0]?.merchant ?? '—'}.`;
    }

    return `I can see ${state.cards.length} cards, ${state.transactions.length} transactions, your ${state.tariff.provider} ${state.tariff.name} data plan and your guardrail. Ask me about balances, spending, data or your savings.`;
  }, [asked, state]);

  const suggestions = [
    'How much did I spend on groceries?',
    'When does my data expire?',
    "What's my remaining balance?",
  ];

  const submit = (value: string) => {
    if (!value.trim()) return;
    haptics.medium();
    setAsked(value.trim());
    setQuery('');
  };

  return (
    <ScreenContainer edges={['bottom']} contentContainerStyle={styles.screenContent}>
      <View style={styles.headBleed}>
        <GradientHeader kind="generic">
          <View style={styles.headTop}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>ONLINE</Text>
          </View>
          <Text style={styles.headTitle}>Make sense of your money.</Text>
          <Text style={styles.headSub}>Ask about spending, tariff usage, balances or your guardrail.</Text>
        </GradientHeader>
      </View>

      <View style={styles.body}>
        {/* The "saved picture" */}
        <StaggeredItem index={0}>
          <ElevatedCard style={styles.pictureCard}>
            <View style={styles.pictureHead}>
              <TileIcon icon="analytics" color={theme.accent} />
              <View style={styles.pictureHeadText}>
                <Text style={[styles.pictureKicker, { color: theme.textMuted }]}>SAVED PICTURE</Text>
                <Text style={[styles.pictureTitle, { color: theme.text }]}>
                  Good morning, {userProfile.name}.
                </Text>
              </View>
            </View>

            <Text style={[styles.pictureBody, { color: theme.textSecondary }]}>
              I&apos;m looking at your saved MyTap picture — {state.cards.length} cards,{' '}
              {state.transactions.length} transactions, your {state.tariff.provider}{' '}
              {state.tariff.name} plan and your guardrail.
            </Text>

            <View style={[styles.groundRow, { borderColor: theme.hairline }]}>
              <Ionicons name="lock-closed" size={14} color={theme.textMuted} />
              <Text style={[styles.groundText, { color: theme.textMuted }]}>
                I will not invent balances or execute payments for you.
              </Text>
            </View>

            <Text style={[styles.picturePrompt, { color: theme.text }]}>
              What do you want to understand?
            </Text>
          </ElevatedCard>
        </StaggeredItem>

        {/* Suggested questions */}
        <StaggeredItem index={1}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Suggested</Text>
          <Card padded={false}>
            {suggestions.map((s, i) => (
              <View key={s}>
                {i > 0 && (
                  <View
                    style={[
                      styles.rowDivider,
                      { backgroundColor: theme.hairline, marginLeft: space.md + 32 + layout.iconToText },
                    ]}
                  />
                )}
                <PressableScale
                  radius={0}
                  haptic="light"
                  style={styles.suggestion}
                  onPress={() => submit(s)}
                >
                  <TileIcon icon="help-circle" color={catColor('savings')} size={32} radius={11} glyph={16} />
                  <Text style={[styles.suggestionText, { color: theme.textSecondary }]}>{s}</Text>
                  <Ionicons name="arrow-forward" size={15} color={theme.textMuted} />
                </PressableScale>
              </View>
            ))}
          </Card>
        </StaggeredItem>

        {/* Answer */}
        {answer && (
          <FadeIn>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Answer</Text>
            <Card padded={false}>
              <View style={styles.answerHead}>
                <TileIcon icon="checkmark-circle" color={catColor('transport')} size={32} radius={11} glyph={16} />
                <Text style={[styles.answerQuestion, { color: theme.textMuted }]} numberOfLines={2}>
                  {asked}
                </Text>
              </View>
              <View
                style={[
                  styles.rowDivider,
                  { backgroundColor: theme.hairline, marginLeft: space.md + 32 + layout.iconToText },
                ]}
              />
              <Text style={[styles.answerText, { color: theme.text }]}>{answer}</Text>
            </Card>
          </FadeIn>
        )}

        {/* Ask input */}
        <StaggeredItem index={2}>
          <View
            style={[styles.askWrap, { backgroundColor: theme.surface, borderColor: theme.hairline }]}
          >
            <Ionicons name="search" size={16} color={theme.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Ask about your money or tariff"
              placeholderTextColor={theme.textMuted}
              onSubmitEditing={() => submit(query)}
              returnKeyType="send"
              style={[styles.askInput, { color: theme.text }]}
            />
            <PressableScale
              radius={radii.pill}
              haptic="light"
              style={[styles.askBtn, { backgroundColor: theme.primary }]}
              onPress={() => submit(query)}
            >
              <Text style={styles.askBtnText}>Ask</Text>
            </PressableScale>
          </View>
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
  headTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#2ECC71',
  },
  onlineText: {
    color: 'rgba(255,255,255,0.72)',
    ...text.label,
    fontFamily: inter.semibold,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  headTitle: {
    color: '#FFFFFF',
    ...text.screenTitle,
    marginTop: space.xs,
  },
  headSub: {
    color: 'rgba(255,255,255,0.78)',
    ...text.caption,
    marginTop: space.xxs,
    maxWidth: 300,
    lineHeight: 19,
  },
  body: {
    paddingHorizontal: space.md,
  },

  pictureCard: {
    marginBottom: layout.cardGap,
  },
  pictureHead: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pictureHeadText: {
    flex: 1,
    marginLeft: layout.iconToText,
  },
  pictureKicker: {
    ...text.label,
    fontFamily: inter.semibold,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  pictureTitle: {
    ...text.cardTitle,
    marginTop: 1,
  },
  pictureBody: {
    ...text.body,
    fontSize: 14.5,
    marginTop: space.sm,
  },
  groundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.card,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    marginTop: space.sm,
  },
  groundText: {
    flex: 1,
    ...text.caption,
    fontSize: 12.5,
  },
  picturePrompt: {
    ...text.cardTitle,
    marginTop: space.md,
  },

  sectionTitle: {
    ...text.sectionHeader,
    marginTop: space.lg,
    marginBottom: layout.headerGap,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  suggestionText: {
    flex: 1,
    marginHorizontal: layout.iconToText,
    ...text.body,
    fontSize: 14.5,
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
  },

  answerHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    paddingBottom: space.sm,
  },
  answerQuestion: {
    flex: 1,
    marginLeft: layout.iconToText,
    ...text.caption,
    fontSize: 12.5,
  },
  answerText: {
    ...text.body,
    fontSize: 15,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },

  askWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.pill,
    paddingLeft: space.md,
    paddingRight: 5,
    paddingVertical: 5,
    marginTop: space.lg,
  },
  askInput: {
    flex: 1,
    ...text.body,
    fontSize: 14.5,
    padding: 0,
  },
  askBtn: {
    paddingHorizontal: space.md + 2,
    paddingVertical: space.xs + 2,
  },
  askBtnText: {
    color: '#FFFFFF',
    ...text.caption,
    fontFamily: inter.semibold,
    fontWeight: '600',
  },
});
