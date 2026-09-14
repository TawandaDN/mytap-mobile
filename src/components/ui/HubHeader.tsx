import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { PressableScale } from './PressableScale';
import { CountUp } from '../animations/CountUp';
import { formatPula } from '../../utils/format';
import { spacing, type, radius, shadows } from '../../theme';
import { haptics } from '../../utils/haptics';

/**
 * Home header — the deep navy gradient block at the top of Home (~30% of the
 * screen) bleeding into the content canvas below.
 *
 * Holds the profile avatar, a utility search bar, a cart icon and a bell with
 * a notification badge, plus the primary metric (Total Balance) set in the
 * 40pt Light hero face.
 */
export function HubHeader({
  greetingName,
  initial,
  balance,
  searchValue,
  onSearchChange,
  onAvatarPress,
  onCartPress,
  onBellPress,
  unreadCount = 0,
  hideBalance = false,
}: {
  greetingName: string;
  initial: string;
  balance: number;
  searchValue: string;
  onSearchChange: (t: string) => void;
  onAvatarPress?: () => void;
  onCartPress?: () => void;
  onBellPress?: () => void;
  unreadCount?: number;
  hideBalance?: boolean;
}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[theme.headerGradient[0], theme.headerGradient[1], theme.headerGradient[2]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop: insets.top + spacing.md }]}
    >
      {/* Layered backdrop glows for depth */}
      <View style={styles.glowA} pointerEvents="none" />
      <View style={styles.glowB} pointerEvents="none" />

      {/* Top row: avatar · utility icons */}
      <View style={styles.topRow}>
        <PressableScale
          onPress={onAvatarPress}
          style={styles.avatar}
          scaleTo={0.92}
          bubble={false}
        >
          <Text style={styles.avatarText}>{initial}</Text>
        </PressableScale>
        <View style={styles.utilityRow}>
          <PressableScale
            style={styles.utilityBtn}
            onPress={() => {
              haptics.light();
              onCartPress?.();
            }}
            scaleTo={0.9}
            bubble={false}
          >
            <Ionicons name="cart-outline" size={17} color="rgba(255,255,255,0.92)" />
          </PressableScale>
          <PressableScale
            style={styles.utilityBtn}
            onPress={() => {
              haptics.light();
              onBellPress?.();
            }}
            scaleTo={0.9}
            bubble={false}
          >
            <Ionicons name="notifications-outline" size={17} color="rgba(255,255,255,0.92)" />
            {unreadCount > 0 && <View style={styles.badge} />}
          </PressableScale>
        </View>
      </View>

      {/* Search bar (inside the gradient) */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color="rgba(255,255,255,0.7)" />
        <TextInput
          value={searchValue}
          onChangeText={onSearchChange}
          placeholder="Search transactions, bills, or cards..."
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.searchInput}
        />
      </View>

      {/* Greeting */}
      <Text style={styles.greeting}>Good morning, {greetingName}</Text>
      <Text style={styles.greetingSub}>Here&apos;s what needs your attention.</Text>

      {/* Primary metric — Total Balance in the 40pt Light hero face */}
      <Text style={styles.balanceLabel}>Total Balance</Text>
      {hideBalance ? (
        <Text style={styles.balance}>P••••••</Text>
      ) : (
        <CountUp
          value={balance}
          format={(v) => formatPula(v)}
          duration={400}
          glow="none"
          style={styles.balance}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    overflow: 'hidden',
    ...shadows.elevated,
  },
  glowA: {
    position: 'absolute',
    top: -90,
    right: -70,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  glowB: {
    position: 'absolute',
    bottom: -120,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    ...type.subheading,
    fontWeight: '600',
  },
  utilityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  utilityBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF6B4A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    marginTop: spacing.lg,
  },
  searchInput: {
    flex: 1,
    ...type.body,
    fontSize: 14,
    color: '#fff',
    padding: 0,
  },
  greeting: {
    color: 'rgba(255,255,255,0.94)',
    ...type.heading,
    fontWeight: '500',
    marginTop: spacing.xl,
  },
  greetingSub: {
    color: 'rgba(255,255,255,0.62)',
    ...type.caption,
    marginTop: 2,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.62)',
    ...type.caption,
    marginTop: spacing.xl,
  },
  balance: {
    color: '#fff',
    ...type.hero,
    marginTop: spacing.xs,
  },
});
