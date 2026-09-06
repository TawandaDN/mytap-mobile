import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { GlassCard } from '../../src/components/cards/GlassCard';
import { StaggeredItem } from '../../src/components/animations/Staggered';
import { useToast } from '../../src/components/ui/Toast';
import { useApp } from '../../src/store/AppStore';
import { userProfile } from '../../src/data/mock';
import { spacing, type, radius } from '../../src/theme';
import { haptics } from '../../src/utils/haptics';
import { PressableScale } from '../../src/components/ui/PressableScale';

export default function MoreScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const go = (path: any) => { haptics.medium(); router.push(path); };

  const sections = [
    { title: 'Money', items: [
      { icon: 'swap-horizontal', label: 'Transactions', color: '#3498DB', onPress: () => go('/transactions') },
      { icon: 'receipt', label: 'Receipts', color: '#2ECC71', onPress: () => go('/receipts') },
      { icon: 'flash', label: 'Pay bills', color: '#F5A623', onPress: () => go('/utilities') },
      { icon: 'phone-portrait', label: 'Buy airtime', color: '#E67E22', onPress: () => go('/airtime') },
      { icon: 'cellular', label: 'Data bundles', color: '#2ECC71', onPress: () => go('/data-bundles') },
      { icon: 'send', label: 'Send money', color: '#1ABC9C', onPress: () => go('/send') },
      { icon: 'qr-code', label: 'QR pay', color: '#6B3A8A', onPress: () => go('/qr') },
    ]},
    { title: 'Grow', items: [
      { icon: 'trending-up', label: 'Savings goals', color: '#2ECC71', onPress: () => go('/savings') },
      { icon: 'cash', label: 'Loans', color: '#6B3A8A', onPress: () => go('/loans') },
      { icon: 'shield-checkmark', label: 'Insurance', color: '#3498DB', onPress: () => go('/insurance') },
      { icon: 'gift', label: 'Rewards', color: '#F5A623', onPress: () => go('/rewards') },
      { icon: 'shield', label: 'Guardrail', color: '#2ECC71', onPress: () => go('/guardrail') },
    ]},
    { title: 'Account', items: [
      { icon: 'person', label: 'Profile', color: '#3498DB', onPress: () => go('/profile') },
      { icon: 'notifications', label: 'Notifications', color: '#F5A623', onPress: () => go('/notifications') },
      { icon: 'settings', label: 'Settings', color: '#6B7A8A', onPress: () => go('/settings') },
      { icon: 'help-circle', label: 'Help & support', color: '#FF6B4A', onPress: () => go('/help') },
      { icon: 'information-circle', label: 'About', color: '#8A4A9A', onPress: () => go('/about') },
    ]},
  ];

  return (
    <ScreenContainer>
      <StaggeredItem index={0}><Text style={[styles.title, { color: theme.text }]}>More</Text></StaggeredItem>
      <StaggeredItem index={1}>
        <PressableScale onPress={() => go('/profile')}>
          <GlassCard bubbleColor="rgba(107,58,138,0.15)">
            <View style={styles.profileRow}>
              <View style={[styles.avatar, { backgroundColor: theme.accent }]}><Text style={styles.avatarText}>{userProfile.name[0]}</Text></View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.text }]}>{userProfile.fullName}</Text>
                <Text style={[styles.profilePhone, { color: theme.textMuted }]}>{userProfile.phone}</Text>
              </View>
              <View style={[styles.tierBadge, { backgroundColor: '#F5A623' }]}><Text style={styles.tierText}>{userProfile.tier}</Text></View>
            </View>
          </GlassCard>
        </PressableScale>
      </StaggeredItem>
      <StaggeredItem index={2}>
        <PressableScale onPress={() => go('/assistant')}>
          <GlassCard bubbleColor="rgba(52,152,219,0.15)">
            <View style={styles.shortcutRow}>
              <View style={[styles.shortcutIcon, { backgroundColor: '#3498DB' }]}><Ionicons name="sparkles" size={20} color="#fff" /></View>
              <View style={styles.shortcutInfo}>
                <Text style={[styles.shortcutTitle, { color: theme.text }]}>MyTap Assistant</Text>
                <Text style={[styles.shortcutSub, { color: theme.textMuted }]}>Ask about your spending, data & more</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </View>
          </GlassCard>
        </PressableScale>
      </StaggeredItem>
      <StaggeredItem index={3}>
        <GlassCard bubbleColor="rgba(46,204,113,0.15)">
          <View style={styles.shortcutRow}>
            <View style={[styles.shortcutIcon, { backgroundColor: '#2ECC71' }]}><Ionicons name="finger-print" size={20} color="#fff" /></View>
            <View style={styles.shortcutInfo}>
              <Text style={[styles.shortcutTitle, { color: theme.text }]}>Biometric login</Text>
              <Text style={[styles.shortcutSub, { color: theme.textMuted }]}>{state.biometricEnabled ? 'Face ID / fingerprint enabled' : 'Lock the app with Face ID'}</Text>
            </View>
            <Switch value={state.biometricEnabled} onValueChange={(v) => { dispatch({ type: 'SET_BIOMETRIC', enabled: v }); haptics.toggle(); show(v ? 'Biometric login enabled' : 'Biometric login disabled'); }} trackColor={{ true: theme.accent, false: 'rgba(15,23,41,0.2)' }} thumbColor="#fff" />
          </View>
        </GlassCard>
      </StaggeredItem>
      {sections.map((section, si) => (
        <StaggeredItem key={section.title} index={si + 4}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
          <GlassCard bubble={false}>
            {section.items.map((item, i) => (
              <PressableScale key={item.label} style={[styles.menuRow, i > 0 && styles.menuDivider]} onPress={item.onPress}>
                <View style={[styles.menuIcon, { backgroundColor: item.color + '22' }]}><Ionicons name={item.icon as any} size={18} color={item.color} /></View>
                <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
              </PressableScale>
            ))}
          </GlassCard>
        </StaggeredItem>
      ))}
      <StaggeredItem index={sections.length + 4}>
        <Pressable style={[styles.signOut, { borderColor: '#E74C3C' }]} onPress={() => { haptics.warning(); show('Signed out (demo)', 'info'); }}>
          <Ionicons name="log-out-outline" size={18} color="#E74C3C" />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </StaggeredItem>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontWeight: '700', marginBottom: spacing.xl },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: '700' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '700' },
  profilePhone: { fontSize: 13, marginTop: 2 },
  tierBadge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 },
  tierText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  shortcutRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  shortcutIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  shortcutInfo: { flex: 1 },
  shortcutTitle: { fontSize: 16, fontWeight: '600' },
  shortcutSub: { fontSize: 13, marginTop: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: spacing.xl, marginBottom: spacing.md },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.md },
  menuDivider: { borderTopWidth: 1, borderTopColor: 'rgba(15,23,41,0.06)' },
  menuIcon: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  signOut: { marginTop: spacing.xl, borderWidth: 1, borderRadius: radius.pill, paddingVertical: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  signOutText: { color: '#E74C3C', fontSize: 15, fontWeight: '600' },
});