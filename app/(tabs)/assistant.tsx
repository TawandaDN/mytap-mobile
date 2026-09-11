import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { GlassCard } from '../../src/components/cards/GlassCard';
import { StaggeredItem } from '../../src/components/animations/Staggered';
import { spacing, type, radius } from '../../src/theme';
import { haptics } from '../../src/utils/haptics';
import { PressableScale } from '../../src/components/ui/PressableScale';

interface Answer {
  question: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const ANSWERS: Answer[] = [
  {
    question: 'How much did I spend on groceries?',
    text: 'P278.59 at Choppies and P412.30 at Shoprite this month. Groceries make up 38% of your monthly spend.',
    icon: 'cart-outline',
    color: '#0E8A5F',
  },
  {
    question: 'How much data do I have left?',
    text: 'Your Mascom Connect 10GB is 84% used — 1.6GB remaining. It renews on 30 Aug.',
    icon: 'cellular-outline',
    color: '#1E4FA8',
  },
  {
    question: "What's my wallet balance?",
    text: 'Your MyTap Wallet balance is P3,553.77. You can top up from Cards at any time.',
    icon: 'wallet-outline',
    color: '#3B2560',
  },
  {
    question: 'Am I within my spending limit?',
    text: 'Your monthly guardrail is P10,000 and you have used P4,120 — 41%. You are well within your limit.',
    icon: 'shield-outline',
    color: '#6D5AE6',
  },
  {
    question: 'How are my savings goals doing?',
    text: 'Your Emergency Fund is 63% funded at P12,500 of P20,000. Keep contributing P1,000/month to reach it by March.',
    icon: 'trending-up-outline',
    color: '#0E8A5F',
  },
  {
    question: 'What rewards do I have?',
    text: 'You have 1,250 MyTap Points — worth about P125. Redeem them from the Rewards section.',
    icon: 'gift-outline',
    color: '#B8892B',
  },
  {
    question: 'Can I pay my BPC bill here?',
    text: 'Yes. Pay BPC electricity, WUC water, DStv and BTC internet from Pay bills. Your last BPC payment was P100.',
    icon: 'flash-outline',
    color: '#B8892B',
  },
  {
    question: 'Am I eligible for a loan?',
    text: 'You are eligible for a P15,000 personal loan at 8.5% interest. Your active loan has P2,900 remaining.',
    icon: 'cash-outline',
    color: '#3B2560',
  },
];

/**
 * Assistant (tab) — a clean, native financial query surface.
 * No chat bubbles, no typing cursors: a standard search field, a dense list
 * of curated questions, and an instant, scannable answer panel.
 */
export default function AssistantScreen() {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Answer>(ANSWERS[0]);

  const filtered = useMemo(() => {
    if (!query.trim()) return ANSWERS;
    const q = query.toLowerCase();
    return ANSWERS.filter(
      (a) => a.question.toLowerCase().includes(q) || a.text.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <Text style={[styles.title, { color: theme.text }]}>Assistant</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>Instant answers about your money</Text>
      </StaggeredItem>

      <StaggeredItem index={1}>
        <View style={[styles.searchWrap, { backgroundColor: theme.surface, borderColor: theme.hairline }]}>
          <Ionicons name="search" size={17} color={theme.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search transactions, bills, or cards..."
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>
      </StaggeredItem>

      <StaggeredItem index={2}>
        <GlassCard bubbleColor={`${selected.color}14`} style={styles.answerCard}>
          <View style={styles.answerHeader}>
            <View style={[styles.answerIcon, { backgroundColor: selected.color + '16' }]}>
              <Ionicons name={selected.icon} size={19} color={selected.color} />
            </View>
            <Text style={[styles.answerEyebrow, { color: theme.textMuted }]}>ANSWER</Text>
          </View>
          <Text style={[styles.answerText, { color: theme.text }]}>{selected.text}</Text>
        </GlassCard>
      </StaggeredItem>

      <StaggeredItem index={3}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {query.trim() ? 'Matching questions' : 'Popular questions'}
        </Text>
        <GlassCard solid bubble={false}>
          {filtered.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="help-circle-outline" size={32} color={theme.textMuted} />
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>No matching questions</Text>
            </View>
          ) : (
            filtered.map((a, i) => {
              const active = selected.question === a.question;
              return (
                <PressableScale
                  key={a.question}
                  style={[styles.row, i > 0 && { borderTopWidth: 1, borderTopColor: theme.hairline }]}
                  onPress={() => {
                    setSelected(a);
                    haptics.medium();
                  }}
                >
                  <View style={[styles.rowIcon, { backgroundColor: a.color + '14' }]}>
                    <Ionicons name={a.icon} size={16} color={a.color} />
                  </View>
                  <Text
                    style={[
                      styles.rowText,
                      { color: active ? theme.primary : theme.text },
                      active && { fontWeight: '600' },
                    ]}
                    numberOfLines={2}
                  >
                    {a.question}
                  </Text>
                  <Ionicons name="chevron-forward" size={15} color={theme.textMuted} />
                </PressableScale>
              );
            })
          )}
        </GlassCard>
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
    marginTop: 2,
    marginBottom: spacing.xl,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  searchInput: {
    flex: 1,
    ...type.body,
    padding: 0,
  },
  answerCard: {
    marginBottom: spacing.sm,
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  answerIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerEyebrow: {
    ...type.label,
    fontWeight: '700',
    letterSpacing: 0.9,
  },
  answerText: {
    ...type.body,
    fontSize: 15,
    lineHeight: 23,
  },
  sectionTitle: {
    ...type.heading,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    ...type.body,
    fontSize: 14.5,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  emptyText: {
    ...type.body,
  },
});
