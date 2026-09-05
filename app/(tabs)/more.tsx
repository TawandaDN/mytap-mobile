import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme/ThemeContext';
import { ScreenContainer } from '../../src/components/ui/ScreenContainer';
import { GlassCard } from '../../src/components/cards/GlassCard';
import { StaggeredItem } from '../../src/components/animations/Staggered';
import { useToast } from '../../src/components/ui/Toast';
import { useApp } from '../../src/store/AppStore';
import { guardrailProfile } from '../../src/utils/format';
import { spacing, type, radius } from '../../src/theme';
import { haptics } from '../../src/utils/haptics';

export default function MoreScreen({
  onOpenGuardrail,
  onOpenAssistant,
}: {
  onOpenGuardrail: () => void;
  onOpenAssistant: () => void;
}) {
  const { theme } = useTheme();
  const { state } = useApp();
  const { show } = useToast();

  const profile = {
    name: 'Tawanda Moko',
    phone: '+267 71 234 567',
    email: 'tawanda@mytap.bw',
    tier: 'Gold',
  };

  const menuItems = [
    { icon: 'shield-checkmark', label: 'Security', color: '#2ECC71', onPress: () => show('Security settings', 'info') },
    { icon: 'lock-closed', label: 'Privacy', color: '#3498DB', onPress: () => show('Privacy settings', 'info') },
    { icon: 'notifications', label: 'Notifications', color: '#F5A623', onPress: () => show('Notification settings', 'info') },
    { icon: 'language', label: 'Language', color: '#8A4A9A', onPress: () => show('Language: English', 'info') },
    { icon: 'help-circle', label: 'Help & support', color: '#FF6B4A', onPress: () => show('Support coming soon', 'info') },
  ];

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <Text style={[styles.title, { color: theme.text }]}>More</Text>
      </StaggeredItem>

      {/* Profile */}
      <StaggeredItem index={1}>
        <GlassCard bubbleColor="rgba(107,58,138,0.15)">
          <View style={styles.profileRow}>
            <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
              <Text style={styles.avatarText}>T</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.text }]}>{profile.name}</Text>
              <Text style={[styles.profilePhone, { color: theme.textMuted }]}>{profile.phone}</Text>
            </View>
            <View style={[styles.tierBadge, { backgroundColor: '#F5A623' }]}>
              <Text style={styles.tierText}>{profile.tier}</Text>
            </View>
          </View>
        </GlassCard>
      </StaggeredItem>

      {/* Guardrail shortcut */}
      <StaggeredItem index={2}>
        <Pressable onPress={() => { haptics.medium(); onOpenGuardrail(); }}>
          <GlassCard bubbleColor="rgba(46,204,113,0.15)">
            <View style={styles.guardrailRow}>
              <View style={[styles.guardrailIcon, { backgroundColor: '#2ECC71' }]}>
                <Ionicons name="shield-checkmark" size={20} color="#fff" />
              </View>
              <View style={styles.guardrailInfo}>
                <Text style={[styles.guardrailTitle, { color: theme.text }]}>MyTap Guardrail</Text>
                <Text style={[styles.guardrailSub, { color: theme.textMuted }]}>
                  P{guardrailProfile.used.toLocaleString()} of P{guardrailProfile.monthlyLimit.toLocaleString()} used
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </View>
          </GlassCard>
        </Pressable>
      </StaggeredItem>

      {/* AI Assistant shortcut */}
      <StaggeredItem index={3}>
        <Pressable onPress={() => { haptics.medium(); onOpenAssistant(); }}>
          <GlassCard bubbleColor="rgba(52,152,219,0.15)">
            <View style={styles.guardrailRow}>
              <View style={[styles.guardrailIcon, { backgroundColor: '#3498DB' }]}>
                <Ionicons name="sparkles" size={20} color="#fff" />
              </View>
              <View style={styles.guardrailInfo}>
                <Text style={[styles.guardrailTitle, { color: theme.text }]}>MyTap Assistant</Text>
                <Text style={[styles.guardrailSub, { color: theme.textMuted }]}>
                  Ask about your spending, data & more
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </View>
          </GlassCard>
        </Pressable>
      </StaggeredItem>

      {/* Menu */}
      <StaggeredItem index={4}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Settings</Text>
        <GlassCard bubble={false}>
          {menuItems.map((item, i) => (
            <Pressable
              key={item.label}
              style={[styles.menuRow, i > 0 && styles.menuDivider]}
              onPress={() => { haptics.light(); item.onPress(); }}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '22' }]}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
              </View>
              <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
            </Pressable>
          ))}
        </GlassCard>
      </StaggeredItem>

      {/* Sign out */}
      <StaggeredItem index={5}>
        <Pressable
          style={[styles.signOut, { borderColor: '#E74C3C' }]}
          onPress={() => {
            haptics.warning();
            show('Signed out (demo)', 'info');
          }}
        >
          <Ionicons name="log-out-outline" size={18} color="#E74C3C" />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </StaggeredItem>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: spacing.xl,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
  },
  profilePhone: {
    fontSize: 13,
    marginTop: 2,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  tierText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  guardrailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  guardrailIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guardrailInfo: {
    flex: 1,
  },
  guardrailTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  guardrailSub: {
    fontSize: 13,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  menuDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(15,23,41,0.06)',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  signOut: {
    marginTop: spacing.xl,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  signOutText: {
    color: '#E74C3C',
    fontSize: 15,
    fontWeight: '600',
  },
});