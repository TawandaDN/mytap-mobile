import React, { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { SettingsGroup } from '../src/components/ui/SettingsGroup';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { spacing } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function SettingsScreen() {
  const { theme, mode, toggleMode } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const go = (path: any) => {
    haptics.medium();
    router.push(path);
  };

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}>
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        </View>
      </StaggeredItem>

      {/* Account */}
      <StaggeredItem index={1}>
        <SettingsGroup
          title="Account"
          icon="person-circle-outline"
          items={[
            { icon: 'person', iconColor: '#3498DB', label: 'Profile', onPress: () => go('/profile') },
            { icon: 'shield-checkmark', iconColor: '#2ECC71', label: 'KYC status', right: <Text style={[styles.value, { color: '#2ECC71' }]}>Verified</Text> },
            { icon: 'card', iconColor: '#6B3A8A', label: 'My cards', onPress: () => go('/cards') },
          ]}
        />
      </StaggeredItem>

      {/* Security */}
      <StaggeredItem index={2}>
        <SettingsGroup
          title="Security"
          icon="lock-closed-outline"
          items={[
            {
              icon: 'finger-print',
              iconColor: '#2ECC71',
              label: 'Biometric login',
              right: (
                <Switch
                  value={state.biometricEnabled}
                  onValueChange={(v) => { dispatch({ type: 'SET_BIOMETRIC', enabled: v }); haptics.toggle(); show(v ? 'Biometric login enabled' : 'Biometric login disabled'); }}
                  trackColor={{ true: theme.accent, false: 'rgba(15,23,41,0.2)' }}
                  thumbColor="#fff"
                />
              ),
            },
            { icon: 'key', iconColor: '#F5A623', label: 'Change PIN', onPress: () => show('PIN change coming soon', 'info') },
          ]}
        />
      </StaggeredItem>

      {/* Appearance */}
      <StaggeredItem index={3}>
        <SettingsGroup
          title="Appearance"
          icon="color-palette-outline"
          items={[
            { icon: 'color-palette', iconColor: '#6B3A8A', label: 'Theme & appearance', onPress: () => go('/appearance') },
            {
              icon: 'moon',
              iconColor: '#6B3A8A',
              label: 'Dark mode',
              right: (
                <Switch
                  value={mode === 'dark'}
                  onValueChange={() => { toggleMode(); haptics.toggle(); }}
                  trackColor={{ true: theme.accent, false: 'rgba(15,23,41,0.2)' }}
                  thumbColor="#fff"
                />
              ),
            },
          ]}
        />
      </StaggeredItem>

      {/* Notifications */}
      <StaggeredItem index={4}>
        <SettingsGroup
          title="Notifications"
          icon="notifications-outline"
          items={[
            {
              icon: 'notifications',
              iconColor: '#F5A623',
              label: 'Push notifications',
              right: (
                <Switch
                  value={notifEnabled}
                  onValueChange={() => { setNotifEnabled(!notifEnabled); haptics.toggle(); }}
                  trackColor={{ true: theme.accent, false: 'rgba(15,23,41,0.2)' }}
                  thumbColor="#fff"
                />
              ),
            },
            {
              icon: 'volume-high',
              iconColor: '#3498DB',
              label: 'Sound effects',
              right: (
                <Switch
                  value={soundEnabled}
                  onValueChange={() => { setSoundEnabled(!soundEnabled); haptics.toggle(); }}
                  trackColor={{ true: theme.accent, false: 'rgba(15,23,41,0.2)' }}
                  thumbColor="#fff"
                />
              ),
            },
          ]}
        />
      </StaggeredItem>

      {/* Help */}
      <StaggeredItem index={5}>
        <SettingsGroup
          title="Help"
          icon="help-circle-outline"
          items={[
            { icon: 'help-circle', iconColor: '#FF6B4A', label: 'Help & support', onPress: () => go('/help') },
            { icon: 'information-circle', iconColor: '#8A4A9A', label: 'About', onPress: () => go('/about') },
            { icon: 'document-text', iconColor: '#6B7A8A', label: 'Version', right: <Text style={[styles.value, { color: theme.textMuted }]}>2.0.0</Text> },
          ]}
        />
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
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
});