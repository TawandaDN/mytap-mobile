import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../src/theme/ThemeContext';
import { THEME_LIST, ThemeId } from '../src/theme';
import { ScreenContainer } from '../src/components/ui/ScreenContainer';
import { GlassCard } from '../src/components/cards/GlassCard';
import { StaggeredItem } from '../src/components/animations/Staggered';
import { spacing, radius } from '../src/theme';
import { haptics } from '../src/utils/haptics';
import { PressableScale } from '../src/components/ui/PressableScale';

export default function AppearanceScreen() {
  const { theme, themeId, setThemeId, adaptive, setAdaptive, mode, setMode } = useTheme();
  const router = useRouter();

  return (
    <ScreenContainer>
      <StaggeredItem index={0}>
        <View style={styles.header}>
          <PressableScale style={styles.backBtn} onPress={() => { haptics.light(); router.back(); }}>
            <Ionicons name="chevron-back" size={22} color={theme.text} />
          </PressableScale>
          <Text style={[styles.title, { color: theme.text }]}>Appearance</Text>
        </View>
      </StaggeredItem>

      {/* Adaptive mode */}
      <StaggeredItem index={1}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Adaptive</Text>
        <GlassCard bubbleColor={`${theme.accent}22`}>
          <View style={styles.adaptiveRow}>
            <View style={[styles.adaptiveIcon, { backgroundColor: theme.accent + '22' }]}>
              <Ionicons name="sunny" size={20} color={theme.accent} />
            </View>
            <View style={styles.adaptiveInfo}>
              <Text style={[styles.adaptiveTitle, { color: theme.text }]}>Time-of-day theming</Text>
              <Text style={[styles.adaptiveSub, { color: theme.textMuted }]}>
                Palette shifts subtly with the time of day
              </Text>
            </View>
            <Switch
              value={adaptive}
              onValueChange={(v) => { setAdaptive(v); haptics.toggle(); }}
              trackColor={{ true: theme.accent, false: 'rgba(15,23,41,0.2)' }}
              thumbColor="#fff"
            />
          </View>
        </GlassCard>
      </StaggeredItem>

      {/* Mode toggle */}
      <StaggeredItem index={2}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Mode</Text>
        <GlassCard bubble={false}>
          <View style={styles.modeRow}>
            <ModeChip
              label="Light"
              icon="sunny"
              active={mode === 'light'}
              onPress={() => setMode('light')}
              theme={theme}
            />
            <ModeChip
              label="Dark"
              icon="moon"
              active={mode === 'dark'}
              onPress={() => setMode('dark')}
              theme={theme}
            />
          </View>
        </GlassCard>
      </StaggeredItem>

      {/* Theme picker */}
      <StaggeredItem index={3}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Color theme</Text>
        <View style={styles.themeGrid}>
          {THEME_LIST.map((t, i) => {
            const active = themeId === t.id;
            return (
              <PressableScale
                key={t.id}
                style={[styles.themeCard, { borderColor: active ? theme.accent : theme.border }]}
                onPress={() => { setThemeId(t.id as ThemeId); haptics.selection(); }}
              >
                <LinearGradient
                  colors={[t.dark.gradient[0], t.dark.gradient[1], t.dark.gradient[2]]}
                  style={styles.themeSwatch}
                >
                  <Text style={styles.themeEmoji}>{t.emoji}</Text>
                  {active && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    </View>
                  )}
                </LinearGradient>
                <Text style={[styles.themeName, { color: active ? theme.accent : theme.text }]}>
                  {t.name}
                </Text>
              </PressableScale>
            );
          })}
        </View>
      </StaggeredItem>
    </ScreenContainer>
  );
}

function ModeChip({
  label,
  icon,
  active,
  onPress,
  theme,
}: {
  label: string;
  icon: any;
  active: boolean;
  onPress: () => void;
  theme: any;
}) {
  return (
    <PressableScale
      style={[
        styles.modeChip,
        { backgroundColor: active ? theme.accent : theme.surfaceAlt, borderColor: active ? theme.accent : theme.border },
      ]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={18} color={active ? '#fff' : theme.textSecondary} />
      <Text style={[styles.modeText, { color: active ? '#fff' : theme.textSecondary }]}>{label}</Text>
    </PressableScale>
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
  adaptiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  adaptiveIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adaptiveInfo: {
    flex: 1,
  },
  adaptiveTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  adaptiveSub: {
    fontSize: 13,
    marginTop: 2,
  },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
  },
  modeText: {
    fontSize: 15,
    fontWeight: '600',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  themeCard: {
    width: '30%',
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.sm,
    alignItems: 'center',
    gap: 6,
  },
  themeSwatch: {
    width: '100%',
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeEmoji: {
    fontSize: 24,
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2ECC71',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});