import React, { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/theme/ThemeContext';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { useToast } from '../src/components/ui/Toast';
import { useApp } from '../src/store/AppStore';
import { spacing, type, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function SettingsScreen() {
  const { theme, mode, toggleMode } = useTheme();
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { show } = useToast();
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

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

      <StaggeredItem index={1}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
        <GlassCard bubble={false}>
          <SettingRow
            icon="color-palette"
            iconColor="#6B3A8A"
            label="Theme & appearance"
            theme={theme}
            right={
              <PressableScale onPress={() => { haptics.medium(); router.push('/appearance'); }}>
                <View style={styles.linkRow}>
                  <Text style={[styles.linkText, { color: theme.accent }]}>Customize</Text>
                  <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
                </View>
              </PressableScale>
            }
          />
          <SettingRow
            icon="moon"
            iconColor="#6B3A8A"
            label="Dark mode"
            theme={theme}
            right={
              <Switch
                value={mode === 'dark'}
                onValueChange={() => { toggleMode(); haptics.toggle(); }}
                trackColor={{ true: theme.accent, false: 'rgba(15,23,41,0.2)' }}
                thumbColor="#fff"
              />
            }
          />
        </GlassCard>
      </StaggeredItem>

      <StaggeredItem index={2}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
        <GlassCard bubble={false}>
          <SettingRow
            icon="notifications"
            iconColor="#F5A623"
            label="Push notifications"
            theme={theme}
            right={
              <Switch
                value={notifEnabled}
                onValueChange={() => { setNotifEnabled(!notifEnabled); haptics.toggle(); }}
                trackColor={{ true: theme.accent, false: 'rgba(15,23,41,0.2)' }}
                thumbColor="#fff"
              />
            }
          />
          <SettingRow
            icon="volume-high"
            iconColor="#3498DB"
            label="Sound effects"
            theme={theme}
            right={
              <Switch
                value={soundEnabled}
                onValueChange={() => { setSoundEnabled(!soundEnabled); haptics.toggle(); }}
                trackColor={{ true: theme.accent, false: 'rgba(15,23,41,0.2)' }}
                thumbColor="#fff"
              />
            }
          />
        </GlassCard>
      </StaggeredItem>

      <StaggeredItem index={3}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Security</Text>
        <GlassCard bubble={false}>
          <SettingRow
            icon="finger-print"
            iconColor="#2ECC71"
            label="Biometric login"
            theme={theme}
            right={
              <Switch
                value={state.biometricEnabled}
                onValueChange={(v) => { dispatch({ type: 'SET_BIOMETRIC', enabled: v }); haptics.toggle(); show(v ? 'Biometric login enabled' : 'Biometric login disabled'); }}
                trackColor={{ true: theme.accent, false: 'rgba(15,23,41,0.2)' }}
                thumbColor="#fff"
              />
            }
          />
        </GlassCard>
      </StaggeredItem>

      <StaggeredItem index={4}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
        <GlassCard bubble={false}>
          <SettingRow icon="information-circle" iconColor="#6B7A8A" label="Version" theme={theme} right={<Text style={[styles.version, { color: theme.textMuted }]}>2.0.0</Text>} />
        </GlassCard>
      </StaggeredItem>
    </ScreenContainer>
  );
}

function SettingRow({
  icon,
  iconColor,
  label,
  theme,
  right,
}: {
  icon: any;
  iconColor: string;
  label: string;
  theme: any;
  right: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.rowIcon, { backgroundColor: iconColor + '22' }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
      <View style={styles.rowRight}>{right}</View>
    </View>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
  },
  version: {
    fontSize: 14,
  },
});