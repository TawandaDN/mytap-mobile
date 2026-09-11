import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { GlassCard } from '../../src/components/cards/GlassCard';
import { StaggeredItem } from '../../src/components/animations/Staggered';
import { ProgressRing } from '../../src/components/ui/ProgressRing';
import { CountUp } from '../../src/components/animations/CountUp';
import { Button } from '../../src/components/ui/Button';
import { SlideUpModal } from '../../src/components/ui/SlideUpModal';
import { useToast } from '../../src/components/ui/Toast';
import { useApp } from '../../src/store/AppStore';
import { formatPula } from '../../src/utils/format';
import { spacing, type, radius } from '../../src/theme';
import { haptics } from '../../src/utils/haptics';
import { PressableScale } from '../../src/components/ui/PressableScale';

/**
 * Savings Goals (tab) — total-saved hero with a precise count-up, then one
 * elegant card per goal: a thin progress ring drawn smoothly 0→target with
 * tabular-nums amounts and a solid-green contribute action.
 */
export default function SavingsScreen() {
  const { theme } = useTheme();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [contribGoal, setContribGoal] = useState<any>(null);
  const [amount, setAmount] = useState('');

  const contribute = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      show('Enter a valid amount', 'error');
      return;
    }
    dispatch({ type: 'CONTRIBUTE_GOAL', goalId: contribGoal.id, amount: amt });
    dispatch({
      type: 'PAY',
      cardId: 'wallet',
      amount: amt,
      merchant: contribGoal.name,
      category: 'Savings',
      icon: contribGoal.icon,
      color: contribGoal.color,
    });
    setContribGoal(null);
    setAmount('');
    haptics.success();
    show(`Added ${formatPula(amt)} to ${contribGoal.name}`);
  };

  const totalSaved = state.savingsGoals.reduce((s, g) => s + g.saved, 0);

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <Text style={[styles.title, { color: theme.text }]}>Savings</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>Goals, automated</Text>
      </StaggeredItem>

      <StaggeredItem index={1}>
        <GlassCard bubbleColor={`${theme.primary}14`} style={styles.hero}>
          <Text style={[styles.totalLabel, { color: theme.textMuted }]}>Total saved</Text>
          <CountUp
            value={totalSaved}
            format={(v) => formatPula(v)}
            duration={400}
            glow="none"
            style={[styles.totalValue, { color: theme.text }]}
          />
          <Text style={[styles.totalSub, { color: theme.textMuted }]}>
            across {state.savingsGoals.length} goals
          </Text>
        </GlassCard>
      </StaggeredItem>

      {state.savingsGoals.map((g, i) => {
        const pct = Math.round((g.saved / g.target) * 100);
        return (
          <StaggeredItem key={g.id} index={i + 2}>
            <GlassCard solid bubble={false}>
              <View style={styles.goalRow}>
                <ProgressRing size={72} strokeWidth={6} progress={pct / 100} color={g.color}>
                  <Text style={[styles.goalPct, { color: theme.text }]}>{pct}%</Text>
                </ProgressRing>
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalName, { color: theme.text }]} numberOfLines={1}>
                    {g.icon} {g.name}
                  </Text>
                  <Text style={[styles.goalAmount, { color: theme.text }]}>
                    {formatPula(g.saved)}{' '}
                    <Text style={[styles.goalTarget, { color: theme.textMuted }]}>
                      of {formatPula(g.target)}
                    </Text>
                  </Text>
                  <Text style={[styles.goalMeta, { color: theme.textMuted }]}>
                    P{g.monthly}/mo · by {new Date(g.deadline).toLocaleDateString('en-BW', { month: 'short', year: 'numeric' })}
                  </Text>
                </View>
              </View>
              <PressableScale
                style={[styles.contributeBtn, { backgroundColor: theme.primary }]}
                onPress={() => { setContribGoal(g); setAmount(''); haptics.medium(); }}
              >
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={styles.contributeText}>Contribute</Text>
              </PressableScale>
            </GlassCard>
          </StaggeredItem>
        );
      })}

      <SlideUpModal visible={!!contribGoal} onClose={() => setContribGoal(null)}>
        {contribGoal && (
          <>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Contribute to {contribGoal.name}</Text>
            <Text style={[styles.modalSub, { color: theme.textMuted }]}>
              {formatPula(contribGoal.saved)} of {formatPula(contribGoal.target)} saved
            </Text>
            <View style={[styles.inputWrap, { borderColor: theme.hairline }]}>
              <Text style={[styles.inputPrefix, { color: theme.textMuted }]}>P</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={theme.textMuted}
                style={[styles.input, { color: theme.text }]}
              />
            </View>
            <Button title="Add to goal" onPress={contribute} fullWidth style={styles.modalBtn} />
          </>
        )}
      </SlideUpModal>
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
  hero: {
    marginBottom: spacing.lg,
  },
  totalLabel: {
    ...type.caption,
  },
  totalValue: {
    ...type.hero,
    marginTop: spacing.xs,
  },
  totalSub: {
    ...type.caption,
    marginTop: 2,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  goalPct: {
    ...type.subheading,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    ...type.subheading,
    fontWeight: '600',
  },
  goalAmount: {
    ...type.money,
    marginTop: spacing.xs,
  },
  goalTarget: {
    ...type.caption,
  },
  goalMeta: {
    ...type.caption,
    fontSize: 12,
    marginTop: 2,
  },
  contributeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: radius.pill,
    marginTop: spacing.lg,
  },
  contributeText: {
    color: '#fff',
    ...type.caption,
    fontWeight: '600',
  },
  modalTitle: {
    ...type.title,
    marginBottom: 4,
  },
  modalSub: {
    ...type.caption,
    marginBottom: spacing.xl,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
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
  modalBtn: {
    marginTop: spacing.sm,
  },
});
