import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { useApp } from '../src/store/AppStore';
import { aiSuggestions } from '../src/data/mock';
import { formatPula } from '../src/utils/format';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

interface Msg { id: string; from: 'user' | 'ai'; text: string; }

export default function AssistantScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state } = useApp();
  const [messages, setMessages] = useState<Msg[]>([{ id: 'm0', from: 'ai', text: 'Hi Tawanda! I can help with your spending, data usage, savings and more. What would you like to know?' }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const listRef = useRef<any>(null);
  const replyFor = (q: string): string => {
    const t = q.toLowerCase();
    if (t.includes('grocery') || t.includes('spend')) {
      const g = state.transactions.filter((x) => x.category === 'Groceries').reduce((s, x) => s + Math.abs(x.amount), 0);
      return `You've spent ${formatPula(g)} on groceries this month across ${state.transactions.filter((x) => x.category === 'Groceries').length} transactions. Choppies was your biggest spend.`;
    }
    if (t.includes('data') || t.includes('tariff') || t.includes('usage')) {
      return `You've used ${state.tariff.usedGB}GB of your ${state.tariff.totalGB}GB ${state.tariff.name} (${state.tariff.usedPct}%). You have ${state.tariff.leftGB}GB left. Consider adding a bundle before it renews.`;
    }
    if (t.includes('top up') || t.includes('wallet') || t.includes('balance')) {
      const w = state.cards.find((c) => c.id === 'wallet');
      return `Your MyTap Wallet balance is ${formatPula(w?.balance || 0)}. You can top up from the Cards tab anytime.`;
    }
    if (t.includes('limit') || t.includes('guardrail') || t.includes('spending')) {
      return `Your monthly guardrail is ${formatPula(state.guardrail.monthlyLimit)} and you've used ${formatPula(state.guardrail.used)} (${state.guardrail.pct}%). You're on track.`;
    }
    if (t.includes('save') || t.includes('goal')) {
      const total = state.savingsGoals.reduce((s, g) => s + g.saved, 0);
      return `You've saved ${formatPula(total)} across ${state.savingsGoals.length} goals. Your Emergency Fund is your most funded goal.`;
    }
    if (t.includes('reward') || t.includes('point')) {
      return `You have ${state.totalPoints} MyTap Points, worth about ${formatPula(Math.round(state.totalPoints / 10))}. Redeem them in the Rewards hub.`;
    }
    if (t.includes('hello') || t.includes('hi') || t.includes('hey')) {
      return 'Hello! I can help with your spending, data, savings, rewards and more. What would you like to know?';
    }
    return 'I can help you understand your spending, check data usage, review savings goals, and more. Try asking about your groceries, data usage, or wallet balance.';
  };
  const send = () => {
    const text = input.trim();
    if (!text) return;
    haptics.medium();
    setMessages((m) => [...m, { role: 'user', from: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'ai', from: 'ai', text: replyFor(text) }]);
      setTyping(false);
      haptics.light();
    }, 900);
  };
  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}><Ionicons name="chevron-back" size={22} color={theme.text} /></PressableScale>
          <View style={styles.headerInfo}><Text style={[styles.title, { color: theme.text }]}>MyTap Assistant</Text><Text style={[styles.subtitle, { color: theme.textMuted }]}>Financial insights</Text></View>
          <View style={[styles.onlineDot, { backgroundColor: '#2ECC71' }]} />
        </View>
      </StaggeredItem>
      <StaggeredItem index={1}>
        <View style={styles.suggestions}>
          {aiSuggestions.map((s) => (
            <PressableScale key={s} style={[styles.chip, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={() => { setInput(s); haptics.light(); }}><Text style={[styles.chipText, { color: theme.textSecondary }]}>{s}</Text></PressableScale>
          ))}
        </View>
      </StaggeredItem>
      <StaggeredItem index={2}>
        <GlassCard bubble={false} style={styles.chatCard}>
          {messages.map((m, i) => (
            <View key={i} style={[styles.bubbleRow, m.from === 'user' ? styles.userRow : styles.botRow]}>
              {m.from === 'bot' && <View style={[styles.botAvatar, { backgroundColor: theme.accent }]}><Ionicons name="sparkles" size={14} color="#fff" /></View>}
              <View style={[styles.bubble, m.from === 'user' ? { backgroundColor: theme.accent } : { backgroundColor: theme.surfaceAlt }]}>
                <Text style={[styles.bubbleText, { color: m.from === 'user' ? '#fff' : theme.text }]}>{m.text}</Text>
              </View>
            </View>
          ))}
          {typing && <View style={styles.typingRow}><View style={[styles.botAvatar, { backgroundColor: theme.accent }]}><Ionicons name="sparkles" size={14} color="#fff" /></View><View style={[styles.bubble, { backgroundColor: theme.surfaceAlt }]}><Text style={[styles.bubbleText, { color: theme.textMuted }]}>…</Text></View></View>}
        </GlassCard>
      </StaggeredItem>
      <StaggeredItem index={3}>
        <View style={[styles.inputRow, { borderColor: theme.border, backgroundColor: theme.surface }]}>
          <TextInput value={input} onChangeText={setInput} placeholder="Ask about your money…" placeholderTextColor={theme.textMuted} style={[styles.input, { color: theme.text }]} onSubmitEditing={send} />
          <PressableScale style={[styles.sendBtn, { backgroundColor: theme.accent }]} onPress={send}><Ionicons name="arrow-up" size={20} color="#fff" /></PressableScale>
        </View>
      </StaggeredItem>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.lg },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 12 },
  onlineDot: { width: 10, height: 10, borderRadius: 5 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1 },
  chipText: { fontSize: 12, fontWeight: '500' },
  chatCard: { marginBottom: spacing.lg },
  bubbleRow: { flexDirection: 'row', marginBottom: spacing.md, gap: spacing.sm },
  userRow: { justifyContent: 'flex-end' },
  botRow: { justifyContent: 'flex-start' },
  botAvatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-end' },
  bubble: { maxWidth: '80%', borderRadius: radius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  typingRow: { flexDirection: 'row', gap: spacing.sm },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderRadius: radius.pill, paddingLeft: spacing.lg, paddingRight: 4, paddingVertical: 4 },
  input: { flex: 1, fontSize: 15 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});