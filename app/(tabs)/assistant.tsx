import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { GlassCard } from '../../src/components/cards/GlassCard';
import { FadeIn, StaggeredItem } from '../../src/components/animations/Staggered';
import { useApp } from '../../src/store/AppStore';
import { userProfile } from '../../src/data/mock';
import { formatPula, formatPx, shortDate } from '../../src/utils/format';
import { spacing, type, radius } from '../../src/theme';
import { haptics } from '../../src/utils/haptics';
import { PressableScale } from '../../src/components/ui/PressableScale';

/**
 * Assistant.
 *
 * A grounded answer surface — not a chatbot. It states plainly what it is
 * looking at, answers only from the saved MyTap picture, and never invents a
 * balance or moves money. Answers are computed from live local state.
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

  const submit = (text: string) => {
    if (!text.trim()) return;
    haptics.medium();
    setAsked(text.trim());
    setQuery('');
  };

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <Text style={[styles.title, { color: theme.text }]}>Make sense of your money.</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>
          Ask about spending, tariff usage, balances or your guardrail.
        </Text>
      </StaggeredItem>

      {/* ONLINE status card */}
      <StaggeredItem index={1}>
        <View style={[styles.onlineRow, { borderColor: theme.hairline, backgroundColor: theme.surface }]}>
          <View style={[styles.onlineDot, { backgroundColor: theme.primary }]} />
          <Text style={[styles.onlineText, { color: theme.primary }]}>ONLINE</Text>
          <Text style={[styles.onlineMeta, { color: theme.textMuted }]}>
            Grounded on your saved data
          </Text>
        </View>
      </StaggeredItem>

      {/* The "saved picture" */}
      <StaggeredItem index={2}>
        <GlassCard style={styles.pictureCard} bubbleStrength={0.6}>
          <View style={styles.pictureHead}>
            <View style={[styles.pictureIcon, { backgroundColor: theme.accent + '16' }]}>
              <Ionicons name="sparkles" size={18} color={theme.accent} />
            </View>
            <Text style={[styles.pictureKicker, { color: theme.textMuted }]}>SAVED PICTURE</Text>
          </View>

          <Text style={[styles.pictureTitle, { color: theme.text }]}>
            Good morning, {userProfile.name}.
          </Text>
          <Text style={[styles.pictureBody, { color: theme.textSecondary }]}>
            I&apos;m looking at your saved MyTap picture — {state.cards.length} cards,{' '}
            {state.transactions.length} transactions, your {state.tariff.provider}{' '}
            {state.tariff.name} plan and your guardrail.
          </Text>
          <Text style={[styles.pictureBody, { color: theme.textMuted }]}>
            I will not invent balances or execute payments for you.
          </Text>

          <View style={[styles.pictureDivider, { backgroundColor: theme.hairline }]} />
          <Text style={[styles.picturePrompt, { color: theme.text }]}>
            What do you want to understand?
          </Text>
        </GlassCard>
      </StaggeredItem>

      {/* Suggested questions */}
      <StaggeredItem index={3}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Suggested</Text>
        <View style={styles.suggestions}>
          {suggestions.map((s) => (
            <PressableScale
              key={s}
              style={[styles.suggestion, { backgroundColor: theme.surface, borderColor: theme.hairline }]}
              onPress={() => submit(s)}
            >
              <Text style={[styles.suggestionText, { color: theme.textSecondary }]}>{s}</Text>
              <Ionicons name="arrow-forward" size={14} color={theme.textMuted} />
            </PressableScale>
          ))}
        </View>
      </StaggeredItem>

      {/* Answer */}
      {answer && (
        <FadeIn>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Answer</Text>
          <GlassCard style={styles.answerCard}>
            <View style={styles.answerHead}>
              <View style={[styles.answerIcon, { backgroundColor: theme.primary + '16' }]}>
                <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
              </View>
              <Text style={[styles.answerQuestion, { color: theme.textMuted }]} numberOfLines={2}>
                {asked}
              </Text>
            </View>
            <Text style={[styles.answerText, { color: theme.text }]}>{answer}</Text>
          </GlassCard>
        </FadeIn>
      )}

      {/* Ask input */}
      <StaggeredItem index={4}>
        <View style={[styles.askWrap, { backgroundColor: theme.surface, borderColor: theme.hairline }]}>
          <Ionicons name="chatbubble-outline" size={16} color={theme.textMuted} />
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
            style={[styles.askBtn, { backgroundColor: theme.primary }]}
            bubble={false}
            onPress={() => submit(query)}
          >
            <Text style={styles.askBtnText}>Ask</Text>
          </PressableScale>
        </View>
      </StaggeredItem>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...type.largeTitle,
  },
  subtitle: {
    ...type.caption,
    marginTop: 4,
    marginBottom: spacing.lg,
    lineHeight: 19,
  },

  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    marginBottom: spacing.md,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  onlineText: {
    ...type.label,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  onlineMeta: {
    ...type.small,
    marginLeft: 'auto',
  },

  pictureCard: {
    padding: 16,
  },
  pictureHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  pictureIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pictureKicker: {
    ...type.label,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  pictureTitle: {
    ...type.heading,
    fontWeight: '600',
  },
  pictureBody: {
    ...type.body,
    fontSize: 14.5,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  pictureDivider: {
    height: 1,
    marginVertical: spacing.lg,
  },
  picturePrompt: {
    ...type.subheading,
    fontWeight: '600',
  },

  sectionTitle: {
    ...type.heading,
    fontWeight: '600',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  suggestions: {
    gap: spacing.sm,
  },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: 13,
  },
  suggestionText: {
    flex: 1,
    ...type.body,
    fontSize: 14.5,
  },

  answerCard: {
    padding: 16,
  },
  answerHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  answerIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerQuestion: {
    flex: 1,
    ...type.caption,
    fontSize: 12.5,
  },
  answerText: {
    ...type.body,
    fontSize: 15,
    lineHeight: 23,
  },

  askWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingLeft: spacing.lg,
    paddingRight: 5,
    paddingVertical: 5,
    marginTop: spacing.xl,
  },
  askInput: {
    flex: 1,
    ...type.body,
    fontSize: 14.5,
    padding: 0,
  },
  askBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: radius.pill,
  },
  askBtnText: {
    color: '#fff',
    ...type.caption,
    fontWeight: '600',
  },
});
