import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { useToast } from '../src/components/ui/Toast';
import { faqs } from '../src/data/mock';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function HelpScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { show } = useToast();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}><Ionicons name="chevron-back" size={22} color={theme.text} /></PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>Help & Support</Text>
        </View>
      </StaggeredItem>
      <StaggeredItem index={1}>
        <GlassCard bubbleColor="rgba(52,152,219,0.15)">
          <View style={styles.contactRow}>
            <View style={[styles.contactIcon, { backgroundColor: '#3498DB' }]}><Ionicons name="call" size={20} color="#fff" /></View>
            <View style={styles.contactInfo}><Text style={[styles.contactTitle, { color: theme.text }]}>Call us</Text><Text style={[styles.contactSub, { color: theme.textMuted }]}>+267 71 000 000 · 24/7</Text></View>
          </View>
          <View style={[styles.contactRow, { borderTopWidth: 1, borderTopColor: 'rgba(15,23,41,0.06)' }]}>
            <View style={[styles.contactIcon, { backgroundColor: '#2ECC71' }]}><Ionicons name="chatbubble" size={20} color="#fff" /></View>
            <View style={styles.contactInfo}><Text style={[styles.contactTitle, { color: theme.text }]}>Live chat</Text><Text style={[styles.contactSub, { color: theme.textMuted }]}>Average wait: 2 min</Text></View>
          </View>
        </GlassCard>
      </StaggeredItem>
      <StaggeredItem index={2}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Frequently asked</Text>
        <GlassCard bubble={false}>
          {faqs.map((f, i) => (
            <PressableScale key={i} style={[styles.faqRow, i > 0 && styles.divider]} onPress={() => { setOpen(open === f.q ? null : f.q); haptics.selection(); }}>
              <View style={styles.faqHeader}><Text style={[styles.faqQ, { color: theme.text }]}>{f.q}</Text><Ionicons name={open === f.q ? 'chevron-up' : 'chevron-down'} size={18} color={theme.textMuted} /></View>
              {open === f.q && <Text style={[styles.faqA, { color: theme.textSecondary }]}>{f.a}</Text>}
            </PressableScale>
          ))}
        </GlassCard>
      </StaggeredItem>
    </ScreenContainer>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 24, fontWeight: '700' },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  contactIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  contactInfo: { flex: 1 },
  contactTitle: { fontSize: 16, fontWeight: '600' },
  contactSub: { fontSize: 13, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: spacing.xl, marginBottom: spacing.md },
  faqRow: { paddingVertical: spacing.md },
  divider: { borderTopWidth: 1, borderTopColor: 'rgba(15,23,41,0.06)' },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  faqQ: { flex: 1, fontSize: 15, fontWeight: '600' },
  faqA: { fontSize: 14, lineHeight: 20, marginTop: spacing.sm },
});