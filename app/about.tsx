import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function AboutScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}><Ionicons name="chevron-back" size={22} color={theme.text} /></PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>About</Text>
        </View>
      </StaggeredItem>
      <StaggeredItem index={1}>
        <GlassCard bubbleColor="rgba(107,58,138,0.15)">
          <View style={styles.logoWrap}>
            <View style={[styles.logo, { backgroundColor: theme.accent }]}><Ionicons name="wallet" size={36} color="#fff" /></View>
            <Text style={[styles.appName, { color: theme.text }]}>MyTap</Text>
            <Text style={[styles.tagline, { color: theme.textMuted }]}>The digital home for every Motswana</Text>
          </View>
        </GlassCard>
      </StaggeredItem>
      <StaggeredItem index={2}>
        <GlassCard bubble={false}>
          <InfoRow label="Version" value="2.0.0" theme={theme} />
          <InfoRow label="Developer" value="MyTap Financial Services" theme={theme} />
          <InfoRow label="Country" value="Botswana" theme={theme} />
          <InfoRow label="Licensed by" value="Bank of Botswana (demo)" theme={theme} last />
        </GlassCard>
      </StaggeredItem>
      <StaggeredItem index={3}>
        <Text style={[styles.legal, { color: theme.textMuted }]}>MyTap is a demonstration fintech app. All balances, transactions and services are simulated for showcase purposes.</Text>
      </StaggeredItem>
    </ScreenContainer>
  );
}
function InfoRow({ label, value, theme, last }: { label: string; value: string; theme: any; last?: boolean }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoDivider]}><Text style={[styles.infoLabel, { color: theme.textMuted }]}>{label}</Text><Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text></View>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)', alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 24, fontWeight: '700' },
  logoWrap: { alignItems: 'center', paddingVertical: spacing.xl },
  logo: { width: 72, height: 72, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  appName: { fontSize: 28, fontWeight: '700' },
  tagline: { fontSize: 14, marginTop: 4 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md },
  infoDivider: { borderBottomWidth: 1, borderBottomColor: 'rgba(15,23,41,0.06)' },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: '600' },
  legal: { fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: spacing.xl, paddingHorizontal: spacing.lg },
});