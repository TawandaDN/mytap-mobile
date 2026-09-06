import React, { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { aiSuggestions } from '../src/data/mock';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

interface Message { id: string; role: 'user' | 'assistant'; text: string; }

const INITIAL: Message[] = [{ id: 'm0', role: 'assistant', text: "Hi Tawanda! I'm your MyTap assistant. Ask me about your spending, data usage, or anything financial." }];

function replyFor(input: string): string {
  const q = input.toLowerCase();
  if (q.includes('grocery') || q.includes('spend') || q.includes('shopping')) return 'You spent P278.59 at Choppies and P412.30 at Shoprite this month. Groceries make up about 38% of your monthly spending. Want me to set a grocery budget?';
  if (q.includes('data') || q.includes('tariff') || q.includes('bundle') || q.includes('usage')) return 'Your Mascom Connect 10GB is 84% used with 1.6GB left. It renews on 30 Aug. Consider adding a 2GB bundle to be safe.';
  if (q.includes('top up') || q.includes('wallet') || q.includes('balance') || q.includes('money')) return 'Your MyTap Wallet balance is P3,553.77. You can add money from the Cards tab anytime, or buy airtime and data from the More tab.';
  if (q.includes('limit') || q.includes('guardrail') || q.includes('budget')) return 'Your monthly guardrail is P10,000 and you have used P4,120 (41%). You are within your limit. I can help you set a category budget.';
  if (q.includes('airtime') || q.includes('top up phone')) return 'You can buy airtime for Mascom, BTC, Orange or beMobile from the More tab. Quick amounts are P10, P20, P30, P50 and P100.';
  if (q.includes('electricity') || q.includes('bpc') || q.includes('bill')) return 'You can pay your BPC electricity, WUC water, DStv and BTC internet bills from the "Pay bills" section in More. Your last BPC payment was P100.';
  if (q.includes('saving') || q.includes('goal')) return 'You have 3 savings goals. Your Emergency Fund is 63% funded at P12,500 of P20,000. Keep contributing P1,000/month to reach it by March.';
  if (q.includes('loan') || q.includes('borrow')) return 'You are eligible for a P15,000 personal loan at 8.5% interest. Your active loan has P2,900 remaining. Apply from the Loans section.';
  if (q.includes('reward') || q.includes('cashback') || q.includes('point')) return 'You have 1,250 MyTap Points worth about P125 in rewards. Redeem them from the Rewards section before they expire.';
  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) return "Hello Tawanda! 👋 I'm your MyTap assistant. Ask me about your spending, data usage, savings, or anything financial.";
  return "I can help with spending insights, data usage, wallet balance, guardrail limits, bills, airtime, savings, loans and rewards. Try asking about your groceries or data usage!";
}

export default function AssistantScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(INITIAL);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text: trimmed };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    haptics.medium();
    setTyping(true);
    setTimeout(() => {
      const reply: Message = { id: `a-${Date.now()}`, role: 'assistant', text: replyFor(trimmed) };
      setMessages((m) => [...m, reply]);
      setTyping(false);
      haptics.light();
    }, 900);
  };

  return (
    <KeyboardAvoidingView style={[styles.root, { backgroundColor: theme.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}><Ionicons name="chevron-back" size={22} color={theme.text} /></PressableScale>
        <View style={styles.headerInfo}><Text style={[styles.headerTitle, { color: theme.text }]}>MyTap Assistant</Text><Text style={[styles.headerSub, { color: theme.textMuted }]}>Financial insights</Text></View>
        <View style={[styles.onlineDot, { backgroundColor: '#2ECC71' }]} />
      </View>
      <ScrollView ref={scrollRef} style={styles.chat} contentContainerStyle={styles.chatContent} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
        {messages.map((m, i) => (
          <StaggeredItem key={m.id} index={i}>
            <View style={[styles.bubbleRow, m.role === 'user' ? styles.userRow : styles.assistantRow]}>
              {m.role === 'assistant' && <View style={[styles.avatar, { backgroundColor: theme.accent }]}><Ionicons name="sparkles" size={14} color="#fff" /></View>}
              <View style={[styles.bubble, m.role === 'user' ? [styles.userBubble, { backgroundColor: theme.accent }] : [styles.assistantBubble, { backgroundColor: theme.surface, borderColor: theme.border }]]}>
                <Text style={[styles.bubbleText, { color: m.role === 'user' ? '#fff' : theme.text }]}>{m.text}</Text>
              </View>
            </View>
          </StaggeredItem>
        ))}
        {typing && (
          <View style={styles.assistantRow}>
            <View style={[styles.avatar, { backgroundColor: theme.accent }]}><Ionicons name="sparkles" size={14} color="#fff" /></View>
            <View style={[styles.bubble, styles.assistantBubble, { backgroundColor: theme.surface }]}><Text style={[styles.typingText, { color: theme.textMuted }]}>…</Text></View>
          </View>
        )}
      </ScrollView>
      <View style={styles.suggestions}>
        {aiSuggestions.slice(0, 2).map((s) => (
          <Pressable key={s} style={[styles.suggestion, { borderColor: theme.border }]} onPress={() => send(s)}><Text style={[styles.suggestionText, { color: theme.textSecondary }]}>{s}</Text></Pressable>
        ))}
      </View>
      <View style={[styles.inputBar, { borderColor: theme.border }]}>
        <TextInput value={input} onChangeText={setInput} placeholder="Ask MyTap to find…" placeholderTextColor={theme.textMuted} style={[styles.input, { color: theme.text }]} onSubmitEditing={() => send(input)} />
        <PressableScale style={[styles.sendBtn, { backgroundColor: theme.accent }]} onPress={() => send(input)}><Ionicons name="arrow-up" size={20} color="#fff" /></PressableScale>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: spacing.xxxl, paddingBottom: spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  headerInfo: { flex: 1 },
  headerSub: { fontSize: 12 },
  onlineDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 'auto' },
  chat: { flex: 1 },
  chatContent: { padding: spacing.lg, paddingBottom: spacing.xl },
  bubbleRow: { flexDirection: 'row', marginBottom: spacing.md, alignItems: 'flex-end' },
  userRow: { justifyContent: 'flex-end' },
  assistantRow: { justifyContent: 'flex-start', gap: spacing.sm },
  avatar: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  bubble: { maxWidth: '78%', paddingHorizontal: 16, paddingVertical: 12, borderRadius: radius.lg },
  userBubble: { borderBottomRightRadius: 4 },
  assistantBubble: { borderBottomLeftRadius: 4, borderWidth: 1 },
  bubbleText: { fontSize: 15, lineHeight: 21 },
  typingText: { fontSize: 20 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  suggestion: { borderWidth: 1, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 8 },
  suggestionText: { fontSize: 13, fontWeight: '500' },
  inputBar: { flexDirection: 'row', alignItems: 'center', margin: spacing.lg, borderWidth: 1, borderRadius: radius.pill, paddingLeft: spacing.lg, paddingRight: spacing.sm, paddingVertical: spacing.sm },
  input: { flex: 1, fontSize: 15 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});