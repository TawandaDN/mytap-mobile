import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { useApp } from '../src/store/AppStore';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';

type Msg = { id: string; role: 'user' | 'assistant'; text: string };

const suggestions = [
  'How much did I spend this month?',
  'Am I close to my data limit?',
  'Give me a savings tip',
];

const canned: Record<string, string> = {
  spend: 'You spent P383.59 this month across 3 transactions. Your biggest spend was Choppies at P278.59.',
  data: 'You have used 84% of your Mascom Connect 10GB bundle, with 1.6GB left. It renews on 30 Aug.',
  save: 'Try setting a daily spending cap of P150. Small consistent limits add up to real savings by month end.',
  default: 'I can help with your spending, data usage, and savings. Try asking about your monthly spend or data balance.',
};

function pickReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('spend') || t.includes('money') || t.includes('month')) return replies.spend;
  if (t.includes('data') || t.includes('bundle') || t.includes('gb')) return replies.data;
  if (t.includes('save') || t.includes('tip') || t.includes('budget')) return replies.save;
  return replies.default;
}

export default function AssistantScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state } = useApp();
  const [messages, setMessages] = useState<Msg[]>([
    { id: '0', role: 'assistant', text: 'Hi Tawanda! I can help you understand your spending, data usage, and savings. What would you like to know?' },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [...m, { id: String(Date.now()), role: 'user', text: trimmed }]);
    setInput('');
    setTyping(true);
    haptics.medium();
    setTimeout(() => {
      setMessages((m) => [...m, { id: String(Date.now() + 1), role: 'assistant', text: pickReply(trimmed) }]);
      setTyping(false);
      haptics.light();
    }, 900);
  };

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}>
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </Pressable>
          <View style={styles.headerInfo}>
            <Text style={[styles.title, { color: theme.text }]}>MyTap Assistant</Text>
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>Financial insights</Text>
          </View>
          <View style={[styles.onlineDot, { backgroundColor: '#2ECC71' }]} />
        </View>
      </StaggeredItem>

      <FlatList
        data={messages}
        keyExtractor={(m) => m.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.bubbleRow, item.role === 'user' ? styles.userRow : styles.assistantRow]}>
            <View
              style={[
                styles.bubble,
                item.role === 'user'
                  ? { backgroundColor: theme.accent, alignSelf: 'flex-end' }
                  : { backgroundColor: theme.surface, borderColor: theme.border, alignSelf: 'flex-start' },
              ]}
            >
              <Text style={[styles.bubbleText, { color: item.role === 'user' ? '#fff' : theme.text }]}>
                {item.text}
              </Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          typing ? (
            <View style={styles.typingRow}>
              <View style={[styles.typingBubble, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <Text style={[styles.typingText, { color: theme.textMuted }]}>…</Text>
              </View>
            </View>
          ) : null
        }
      />

      <View style={styles.suggestions}>
        {suggestions.map((s) => (
          <Pressable key={s} style={[styles.suggestion, { borderColor: theme.border }]} onPress={() => send(s)}>
            <Text style={[styles.suggestionText, { color: theme.textSecondary }]}>{s}</Text>
          </Pressable>
        ))}
      </View>

      <View style={[styles.inputBar, { borderColor: theme.border }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask about your money…"
          placeholderTextColor={theme.textMuted}
          style={[styles.input, { color: theme.text }]}
          onSubmitEditing={() => send(input)}
        />
        <Pressable style={[styles.sendBtn, { backgroundColor: theme.accent }]} onPress={() => send(input)}>
          <Ionicons name="arrow-up" size={18} color="#fff" />
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
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
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 'auto',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.md,
  },
  bubbleRow: {
    marginBottom: spacing.sm,
  },
  userRow: {
    alignItems: 'flex-end',
  },
  assistantRow: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 21,
  },
  typingRow: {
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  typingBubble: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
  },
  typingText: {
    fontSize: 18,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  suggestion: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingLeft: spacing.lg,
    paddingRight: 6,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});