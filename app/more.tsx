import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { ScreenHeader } from '../src/components/ui/ScreenHeader';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { useToast } from '../src/components/ui/Toast';
import { useApp, ToggleKey } from '../src/store/AppStore';
import { userProfile } from '../src/data/mock';
import { THEME_LIST, ThemeId, spacing, type, radius, shadows } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

/**
 * More — the profile hub.
 *
 * A verified profile header, the APPEARANCE · THEMES selector, a grouped
 * toggle list, and the full catalogue of destinations that do not live in
 * the tab bar. No flat list: everything is grouped, headed and scannable.
 */
export default function MoreScreen() {
  const { theme, themeId, setThemeId, mode, toggleMode } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { show } = useToast();

  const go = (path: any) => {
    haptics.medium();
    router.push(path);
  };

  const toggle = (key: ToggleKey, value: boolean, label: string) => {
    dispatch({ type: 'SET_TOGGLE', key, value });
    haptics.toggle();
    show(`${label} ${value ? 'on' : 'off'}`, 'info');
  };

  const sections: {
    title: string;
    items: {
      icon: keyof typeof Ionicons.glyphMap;
      label: string;
      sub?: string;
      color: string;
      onPress: () => void;
    }[];
  }[] = [
    {
      title: 'Money',
      items: [
        { icon: 'card', label: 'Cards & wallets', sub: 'Manage, freeze & top up', color: '#1E3A5F', onPress: () => go('/cards') },
        { icon: 'qr-code', label: 'QR Pay', sub: 'Scan · Pay · Receive', color: '#6B3A8A', onPress: () => go('/qr') },
        { icon: 'receipt', label: 'Receipts', sub: 'Digital receipts & exports', color: '#0B6B4F', onPress: () => go('/receipts') },
        { icon: 'swap-horizontal', label: 'Transactions', sub: 'Full history & search', color: '#1E3A5F', onPress: () => go('/transactions') },
        { icon: 'flash', label: 'Pay bills', sub: 'BPC · WUC · DStv · BTC', color: '#B8892B', onPress: () => go('/utilities') },
        { icon: 'call', label: 'Airtime', sub: 'Mascom · BTC · Orange', color: '#FF6B4A', onPress: () => go('/airtime') },
        { icon: 'wifi', label: 'Data bundles', sub: 'Buy data & auto-renew', color: '#0B6B4F', onPress: () => go('/data-bundles') },
      ],
    },
    {
      title: 'Grow',
      items: [
        { icon: 'sparkles', label: 'Insights', sub: 'Personalized spending analysis', color: '#6B4FE0', onPress: () => go('/insights') },
        { icon: 'trending-up', label: 'Savings goals', color: '#0B6B4F', onPress: () => go('/savings') },
        { icon: 'cash', label: 'Loans', color: '#6B3A8A', onPress: () => go('/loans') },
        { icon: 'shield-checkmark', label: 'Insurance', color: '#1E3A5F', onPress: () => go('/insurance') },
        { icon: 'gift', label: 'Rewards', color: '#B8892B', onPress: () => go('/rewards') },
        { icon: 'shield', label: 'Guardrail', sub: 'Monthly spending limit', color: '#0B6B4F', onPress: () => go('/guardrail') },
      ],
    },
    {
      title: 'Services',
      items: [
        { icon: 'pricetag', label: 'Tariff & data', sub: 'Usage, bundles, auto-renew', color: '#0B6B4F', onPress: () => go('/tariff') },
        { icon: 'pricetags', label: 'Stickers', sub: 'NFC sticker design & info', color: '#6B3A8A', onPress: () => go('/sticker') },
        { icon: 'sparkles', label: 'MyTap Assistant', sub: 'Ask about spending & data', color: '#6B4FE0', onPress: () => go('/assistant') },
        { icon: 'notifications', label: 'Notifications', color: '#B8892B', onPress: () => go('/notifications') },
      ],
    },
    {
      title: 'Help',
      items: [
        { icon: 'help-circle', label: 'Help & support', color: '#FF6B4A', onPress: () => go('/help') },
        { icon: 'information-circle', label: 'About MyTap', color: '#6B3A8A', onPress: () => go('/about') },
      ],
    },
  ];

  return (
    <ScreenContainer>
      {/* Verified profile header */}
      <StaggeredItem index={0}>
        <GlassCard style={styles.profileCard} bubbleStrength={0.6}>
          <View style={styles.profileRow}>
            <View style={[styles.avatar, { backgroundColor: theme.headerGradient[1] }]}>
              <Text style={styles.avatarText}>{userProfile.initials}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.text }]}>
                {userProfile.fullName}
              </Text>
              <Text style={[styles.profileMeta, { color: theme.textMuted }]}>
                {userProfile.phone}
              </Text>
              <Text style={[styles.profileMeta, { color: theme.textMuted }]}>
                {userProfile.email}
              </Text>
            </View>
            <View style={[styles.verified, { backgroundColor: theme.primary + '16' }]}>
              <Ionicons name="checkmark-circle" size={13} color={theme.primary} />
              <Text style={[styles.verifiedText, { color: theme.primary }]}>Verified</Text>
            </View>
          </View>
        </GlassCard>
      </StaggeredItem>

      {/* APPEARANCE · THEMES */}
      <StaggeredItem index={1}>
        <ScreenHeader title="Appearance · Themes" subtitle="Choose your palette." />
        <View style={styles.themeRow}>
          {THEME_LIST.map((t) => {
            const active = themeId === t.id;
            return (
              <PressableScale
                key={t.id}
                bubble={false}
                scaleTo={0.95}
                style={styles.themeItem}
                onPress={() => {
                  setThemeId(t.id as ThemeId);
                  haptics.selection();
                }}
              >
                <LinearGradient
                  colors={[t.dark.gradient[0], t.dark.gradient[1], t.dark.gradient[2]]}
                  style={[
                    styles.themeSwatch,
                    {
                      borderColor: active ? theme.accent : 'transparent',
                      borderWidth: active ? 2 : 0,
                    },
                  ]}
                >
                  {active && <Ionicons name="checkmark" size={16} color="#fff" />}
                </LinearGradient>
                <Text
                  style={[styles.themeName, { color: active ? theme.accent : theme.textMuted }]}
                  numberOfLines={1}
                >
                  {t.name}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      </StaggeredItem>

      {/* Preferences — grouped toggles */}
      <StaggeredItem index={2}>
        <ScreenHeader title="Preferences" subtitle="Security, privacy and reminders." />
        <GlassCard solid style={styles.toggleCard}>
          <ToggleRow
            icon="moon"
            label="Dark mode"
            sub="Deep, low-light palette"
            value={mode === 'dark'}
            onValueChange={() => {
              toggleMode();
              haptics.toggle();
            }}
            theme={theme}
            first
          />
          <ToggleRow
            icon="eye-off"
            label="Hide balances"
            sub="Mask amounts across the app"
            value={state.hideBalances}
            onValueChange={(v) => toggle('hideBalances', v, 'Hide balances')}
            theme={theme}
          />
          <ToggleRow
            icon="finger-print"
            label="Biometric confirmation"
            sub="Face ID / fingerprint before paying"
            value={state.biometricConfirm}
            onValueChange={(v) => toggle('biometricConfirm', v, 'Biometric confirmation')}
            theme={theme}
          />
          <ToggleRow
            icon="checkmark-done"
            label="Payment confirmation"
            sub="Confirm each payment before it sends"
            value={state.paymentConfirm}
            onValueChange={(v) => toggle('paymentConfirm', v, 'Payment confirmation')}
            theme={theme}
          />
          <ToggleRow
            icon="alarm"
            label="Payment reminders"
            sub="Alerts before a bill is due"
            value={state.paymentReminders}
            onValueChange={(v) => toggle('paymentReminders', v, 'Payment reminders')}
            theme={theme}
          />
        </GlassCard>
      </StaggeredItem>

      {/* Account */}
      <StaggeredItem index={3}>
        <ScreenHeader title="Account" subtitle="Profile and security." />
        <GlassCard solid style={styles.toggleCard}>
          <PressableScale
            style={styles.navRow}
            onPress={() => go('/profile')}
          >
            <View style={[styles.navIcon, { backgroundColor: '#1E3A5F16' }]}>
              <Ionicons name="person" size={17} color="#1E3A5F" />
            </View>
            <View style={styles.navInfo}>
              <Text style={[styles.navLabel, { color: theme.text }]}>Profile</Text>
              <Text style={[styles.navSub, { color: theme.textMuted }]}>
                {userProfile.tier} member · KYC verified
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </PressableScale>
          <PressableScale style={styles.navRow} onPress={() => go('/settings')}>
            <View style={[styles.navIcon, { backgroundColor: '#0B6B4F16' }]}>
              <Ionicons name="finger-print" size={17} color="#0B6B4F" />
            </View>
            <View style={styles.navInfo}>
              <Text style={[styles.navLabel, { color: theme.text }]}>Security</Text>
              <Text style={[styles.navSub, { color: theme.textMuted }]}>
                Biometrics, PIN, app lock
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </PressableScale>
          <PressableScale style={styles.navRow} onPress={() => go('/appearance')}>
            <View style={[styles.navIcon, { backgroundColor: '#6B4FE016' }]}>
              <Ionicons name="color-palette" size={17} color="#6B4FE0" />
            </View>
            <View style={styles.navInfo}>
              <Text style={[styles.navLabel, { color: theme.text }]}>Appearance</Text>
              <Text style={[styles.navSub, { color: theme.textMuted }]}>
                Themes, material skins, adaptive
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </PressableScale>
          <PressableScale style={styles.navRow} onPress={() => go('/notifications')}>
            <View style={[styles.navIcon, { backgroundColor: '#B8892B16' }]}>
              <Ionicons name="notifications" size={17} color="#B8892B" />
            </View>
            <View style={styles.navInfo}>
              <Text style={[styles.navLabel, { color: theme.text }]}>Notifications</Text>
              <Text style={[styles.navSub, { color: theme.textMuted }]}>
                Recent activity alerts
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </PressableScale>
        </GlassCard>
      </StaggeredItem>

      {/* Grouped destinations */}
      {sections.map((section, si) => (
        <StaggeredItem key={section.title} index={si + 4}>
          <ScreenHeader title={section.title} />
          <GlassCard solid style={styles.toggleCard}>
            {section.items.map((item, i) => (
              <PressableScale
                key={item.label}
                style={[styles.navRow, i > 0 && { borderTopWidth: 1, borderTopColor: theme.hairline }]}
                onPress={item.onPress}
              >
                <View style={[styles.navIcon, { backgroundColor: item.color + '14' }]}>
                  <Ionicons name={item.icon} size={17} color={item.color} />
                </View>
                <View style={styles.navInfo}>
                  <Text style={[styles.navLabel, { color: theme.text }]}>{item.label}</Text>
                  {item.sub ? (
                    <Text style={[styles.navSub, { color: theme.textMuted }]} numberOfLines={1}>
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
      <StaggeredItem index={sections.length + 4}>
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

function ToggleRow({
  icon,
  label,
  sub,
  value,
  onValueChange,
  theme,
  first,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  theme: any;
  first?: boolean;
}) {
  return (
    <View style={[styles.navRow, !first && { borderTopWidth: 1, borderTopColor: theme.hairline }]}>
      <View style={[styles.navIcon, { backgroundColor: theme.accent + '14' }]}>
        <Ionicons name={icon} size={17} color={theme.accent} />
      </View>
      <View style={styles.navInfo}>
        <Text style={[styles.navLabel, { color: theme.text }]}>{label}</Text>
        {sub ? <Text style={[styles.navSub, { color: theme.textMuted }]}>{sub}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: theme.primary, false: 'rgba(16,24,40,0.16)' }}
        thumbColor="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    padding: 16,
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
  profileMeta: {
    ...type.caption,
    fontSize: 12,
    marginTop: 1,
  },
  verified: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },
  verifiedText: {
    ...type.small,
    fontWeight: '600',
  },

  themeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  themeItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  themeSwatch: {
    width: '100%',
    height: 46,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.subtle,
  },
  themeName: {
    ...type.small,
    fontWeight: '600',
  },

  toggleCard: {
    padding: 0,
    marginTop: spacing.md,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: spacing.md,
  },
  navIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navInfo: {
    flex: 1,
  },
  navLabel: {
    ...type.body,
    fontWeight: '500',
  },
  navSub: {
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