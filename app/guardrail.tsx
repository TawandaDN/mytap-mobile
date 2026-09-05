import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { Button } from '../src/components/ui/Button';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { guardrailProfile } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';

export default function GuardrailScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [limit, setLimit] = useState(guardrailProfile.monthlyLimit);

  const presets = [2000, 5000, 10000, 20000];

  const save = () => {
    dispatch({ type: 'SET_LIMIT', limit });
    haptics.success();
    show('Spending limit updated');
    router.back();
  };

  const pct = Math.min(100, Math.round((guardrailProfile.used / limit) * 100));
  const barColor = pct < 60 ? '#2ECC71' : pct < 85 ? '#F5A623' : '#E74C3C';

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}>
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </Pressable>
          <Text style={[styles.title, { color: theme.text }]}>MyTap Guardrail</Text>
        </View>
      </StaggeredItem>

      <StaggeredItem index={1}>
        <GlassCard bubbleColor="rgba(46,204,113,0.15)">
          <Text style={[styles.usedLabel, { color: theme.textMuted }]}>Spent this month</Text>
          <Text style={[styles.usedValue, { color: theme.text }]}>
            P{guardrailProfile.used.toLocaleString()}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: barColor }]} />
          </View>
          <Text style={[styles.progressText, { color: theme.textMuted }]}>
            {pct}% of your P{limit.toLocaleString()} limit
          </Text>
        </GlassCard>
      </StaggeredItem>

      <StaggeredItem index={2}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Set monthly limit</Text>
        <GlassCard bubble={false}>
          <View style={styles.presetRow}>
            {presets.map((p) => (
              <Pressable
                key={p}
                style={[
                  styles.preset,
                  { backgroundColor: theme.surfaceAlt, borderColor: theme.border },
                  limit === p && { borderColor: theme.accent, borderWidth: 2 },
                ]}
                onPress={() => {
                  setLimit(p);
                  haptics.selection();
                }}
              >
                <Text style={[styles.presetText, { color: theme.text }]}>P{p.toLocaleString()}</Text>
              </Pressable>
            ))}
          </View>
          <View style={[styles.limitRow, { borderColor: theme.border }]}>
            <Text style={[styles.limitPrefix, { color: theme.textMuted }]}>P</Text>
            <Text style={[styles.limitValue, { color: theme.text }]}>{limit.toLocaleString()}</Text>
          </View>
        </GlassCard>
      </StaggeredItem>

      <StaggeredItem index={3}>
        <GlassCard bubbleColor="rgba(52,152,219,0.12)">
          <View style={styles.wellnessRow}>
            <Ionicons name="heart" size={20} color="#2ECC71" />
            <Text style={[styles.wellnessText, { color: theme.textSecondary }]}>
              You're on track. Staying under your limit helps you save for what matters.
            </Text>
          </View>
        </GlassCard>
      </StaggeredItem>

      <StaggeredItem index={4}>
        <Button title="Save limit" onPress={apply} />
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
    fontSize: 24,
    fontWeight: '700',
  },
  usedLabel: {
    fontSize: 14,
  },
  usedValue: {
    fontSize: 36,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: spacing.lg,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(15,23,41,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 13,
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  presetRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  preset: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingVertical: 12,
    alignItems: 'center',
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
  },
  limitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
  },
  limitPrefix: {
    fontSize: 20,
    fontWeight: '600',
    marginRight: spacing.sm,
  },
  limitValue: {
    fontSize: 20,
    fontWeight: '700',
    paddingVertical: spacing.md,
  },
  wellnessRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  wellnessText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});