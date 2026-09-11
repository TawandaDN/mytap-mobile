import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { SettingsGroup } from '../src/components/ui/SettingsGroup';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { userProfile } from '../src/data/mock';
import { spacing, type, radius, shadows } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

/**
 * More hub — grouped, scannable sections with headers + icons.
 * Hosts the destinations that no longer live in the tab bar
 * (Cards · Tariff · Sticker) plus the full super-app catalogue.
 */
export default function MoreScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { show } = useToast();

  const go = (path: any) => {
    haptics.medium();
    router.push(path);
  };

  const sections: {
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    items: { icon: keyof typeof Ionicons.glyphMap; label: string; sub?: string; color: string; onPress: () => void }[];
  }[] = [
    {
      title: 'Money',
      icon: 'wallet',
      items: [
        { icon: 'card', label: 'Cards', sub: 'Manage, freeze & top up', color: '#1E4FA8', onPress: () => go('/cards') },
        { icon: 'qr-code', label: 'QR Pay', sub: 'Scan · Pay · Receive', color: '#3B2560', onPress: () => go('/qr') },
        { icon: 'receipt', label: 'Receipts', sub: 'Digital receipts & exports', color: '#0E8A5F', onPress: () => go('/receipts') },
        { icon: 'swap-horizontal', label: 'Transactions', sub: 'Full history & search', color: '#1E4FA8', onPress: () => go('/transactions') },
        { icon: 'flash', label: 'Pay bills', sub: 'BPC · WUC · DStv · BTC', color: '#B8892B', onPress: () => go('/utilities') },
        { icon: 'phone-portrait', label: 'Airtime', sub: 'Mascom · BTC · Orange', color: '#E5604A', onPress: () => go('/airtime') },
        { icon: 'cellular', label: 'Data bundles', sub: 'Buy data & auto-renew', color: '#0E8A5F', onPress: () => go('/data-bundles') },
      ],
    },
    {
      title: 'Grow',
      icon: 'trending-up',
      items: [
        { icon: 'sparkles', label: 'Insights', sub: 'Personalized spending analysis', color: '#6D5AE6', onPress: () => go('/insights') },
        { icon: 'trending-up', label: 'Savings goals', color: '#0E8A5F', onPress: () => go('/savings') },
        { icon: 'cash', label: 'Loans', color: '#3B2560', onPress: () => go('/loans') },
        { icon: 'shield-checkmark', label: 'Insurance', color: '#1E4FA8', onPress: () => go('/insurance') },
        { icon: 'gift', label: 'Rewards', color: '#B8892B', onPress: () => go('/rewards') },
        { icon: 'shield', label: 'Guardrail', sub: 'Monthly spending limit', color: '#0E8A5F', onPress: () => go('/guardrail') },
      ],
    },
    {
      title: 'Services',
      icon: 'grid',
      items: [
        { icon: 'pricetag', label: 'Tariff & data', sub: 'Usage, bundles, auto-renew', color: '#0E8A5F', onPress: () => go('/tariff') },
        { icon: 'pricetags', label: 'Stickers', sub: 'NFC sticker design & info', color: '#3B2560', onPress: () => go('/sticker') },
        { icon: 'sparkles', label: 'MyTap Assistant', sub: 'Ask about spending & data', color: '#6D5AE6', onPress: () => go('/assistant') },
      ],
    },
    {
      title: 'Account',
      icon: 'person',
      items: [
        { icon: 'person', label: 'Profile', sub: `${userProfile.tier} member`, color: '#1E4FA8', onPress: () => go('/profile') },
        { icon: 'notifications', label: 'Notifications', color: '#B8892B', onPress: () => go('/notifications') },
        { icon: 'color-palette', label: 'Theme & appearance', sub: 'Themes, skins, adaptive', color: '#6D5AE6', onPress: () => go('/appearance') },
        { icon: 'settings', label: 'Settings', color: '#7A8699', onPress: () => go('/settings') },
        { icon: 'help-circle', label: 'Help & support', color: '#E5604A', onPress: () => go('/help') },
        { icon: 'information-circle', label: 'About', color: '#3B2560', onPress: () => go('/about') },
      ],
    },
  ];

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <Text style={[styles.title, { color: theme.text }]}>More</Text>
      </StaggeredItem>

      {/* Profile card */}
      <StaggeredItem index={1}>
        <PressableScale onPress={() => go('/profile')}>
          <GlassCard solid bubbleColor={`${theme.indicator}14`}>
            <View style={styles.profileRow}>
              <View style={[styles.avatar, { backgroundColor: theme.headerGradient[1] }]}>
                <Text style={styles.avatarText}>{userProfile.name[0]}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.text }]}>{userProfile.fullName}</Text>
                <Text style={[styles.profilePhone, { color: theme.textMuted }]}>{userProfile.phone}</Text>
              </View>
              <View style={[styles.tierBadge, { backgroundColor: theme.gold }]}>
                <Text style={styles.tierText}>{userProfile.tier}</Text>
              </View>
            </View>
          </GlassCard>
        </PressableScale>
      </StaggeredItem>

      {/* Security row */}
      <StaggeredItem index={2}>
        <GlassCard solid bubble={false} style={styles.securityCard}>
          <View style={styles.shortcutRow}>
            <View style={[styles.shortcutIcon, { backgroundColor: theme.primary + '16' }]}>
              <Ionicons name="finger-print" size={19} color={theme.primary} />
            </View>
            <View style={styles.shortcutInfo}>
              <Text style={[styles.shortcutTitle, { color: theme.text }]}>Biometric login</Text>
              <Text style={[styles.shortcutSub, { color: theme.textMuted }]}>
                {state.biometricEnabled ? 'Face ID / fingerprint active' : 'Lock the app with Face ID'}
              </Text>
            </View>
            <Switch
              value={state.biometricEnabled}
              onValueChange={(v) => {
                dispatch({ type: 'SET_BIOMETRIC', enabled: v });
                haptics.toggle();
                show(v ? 'Biometric login enabled' : 'Biometric login disabled');
              }}
              trackColor={{ true: theme.primary, false: 'rgba(16,24,40,0.18)' }}
              thumbColor="#fff"
            />
          </View>
        </GlassCard>
      </StaggeredItem>

      {/* Grouped sections */}
      {sections.map((section, si) => (
        <StaggeredItem key={section.title} index={si + 3}>
          <View style={styles.groupHeader}>
            <Ionicons name={section.icon} size={14} color={theme.textMuted} />
            <Text style={[styles.groupTitle, { color: theme.textMuted }]}>
              {section.title.toUpperCase()}
            </Text>
          </View>
          <GlassCard solid bubble={false} style={styles.groupCard}>
            {section.items.map((item, i) => (
              <PressableScale
                key={item.label}
                style={[styles.menuRow, i > 0 && { borderTopWidth: 1, borderTopColor: theme.hairline }]}
                onPress={item.onPress}
              >
                <View style={[styles.menuIcon, { backgroundColor: item.color + '14' }]}>
                  <Ionicons name={item.icon} size={17} color={item.color} />
                </View>
                <View style={styles.menuInfo}>
                  <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
                  {item.sub ? (
                    <Text style={[styles.menuSub, { color: theme.textMuted }]} numberOfLines={1}>
                      {item.sub}
                    </Text>
                  ) : null}
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
              </PressableScale>
            ))}
          </GlassCard>
        </StaggeredItem>
      ))}

      {/* Sign out */}
      <StaggeredItem index={sections.length + 3}>
        <PressableScale
          style={[styles.signOut, { borderColor: theme.hairline, backgroundColor: theme.surface }]}
          onPress={() => {
            haptics.warning();
            show('Signed out (demo)', 'info');
          }}
        >
          <Ionicons name="log-out-outline" size={17} color={theme.danger} />
          <Text style={[styles.signOutText, { color: theme.danger }]}>Sign out</Text>
        </PressableScale>
      </StaggeredItem>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...type.largeTitle,
    marginBottom: spacing.xl,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    ...type.title,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    ...type.subheading,
    fontWeight: '600',
  },
  profilePhone: {
    ...type.caption,
    marginTop: 2,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  tierText: {
    color: '#fff',
    ...type.small,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  securityCard: {
    marginTop: spacing.md,
  },
  shortcutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  shortcutIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortcutInfo: {
    flex: 1,
  },
  shortcutTitle: {
    ...type.body,
    fontWeight: '600',
  },
  shortcutSub: {
    ...type.caption,
    fontSize: 12,
    marginTop: 1,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
    marginLeft: 4,
  },
  groupTitle: {
    ...type.label,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  groupCard: {
    marginBottom: 0,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuInfo: {
    flex: 1,
  },
  menuLabel: {
    ...type.body,
    fontWeight: '500',
  },
  menuSub: {
    ...type.caption,
    fontSize: 12,
    marginTop: 1,
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
    ...type.body,
    fontWeight: '600',
  },
});
