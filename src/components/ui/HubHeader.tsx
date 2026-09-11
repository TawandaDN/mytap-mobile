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
 * Hub header — the deep purple→blue gradient block that sits at the top of
 * Home. Holds the avatar, a standard utility search bar, two uniform
 * utility icons (cart, notifications) with a notification badge, and the
 * primary metric ("Total balance") in a large, bold, tabular-nums face.
 */
export function HubHeader({
  greeting,
  name,
  initial,
  balance,
  searchValue,
  onSearchChange,
  onAvatarPress,
  onCartPress,
  onBellPress,
  unreadCount = 0,
}: {
  greeting: string;
  name: string;
  initial: string;
  balance: number;
  searchValue: string;
  onSearchChange: (t: string) => void;
  onAvatarPress?: () => void;
  onCartPress?: () => void;
  onBellPress?: () => void;
  unreadCount?: number;
}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={[...theme.headerGradient]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop: insets.top + spacing.md }]}
    >
      {/* Layered backdrop glow for depth */}
      <View style={styles.glowA} pointerEvents="none" />
      <View style={styles.glowB} pointerEvents="none" />

      {/* Top row: avatar · utility icons */}
      <View style={styles.topRow}>
        <PressableScale onPress={onAvatarPress} style={styles.avatar} scaleTo={0.92}>
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
          >
            <Ionicons name="notifications-outline" size={17} color="rgba(255,255,255,0.92)" />
            {unreadCount > 0 && <View style={styles.badge} />}
          </PressableScale>
        </View>
      </View>

      {/* Greeting */}
      <Text style={styles.greeting}>
        {greeting}, {name}
      </Text>

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

      {/* Primary metric */}
      <Text style={styles.balanceLabel}>Total balance</Text>
      <CountUp
        value={balance}
        format={(v) => formatPula(v)}
        duration={400}
        glow="none"
        style={styles.balance}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl + 4,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    overflow: 'hidden',
    ...shadows.medium,
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
    fontWeight: '700',
  },
  utilityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  utilityBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FF6B4A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  greeting: {
    color: 'rgba(255,255,255,0.82)',
    ...type.body,
    marginTop: spacing.lg,
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
    paddingVertical: 11,
    marginTop: spacing.md,
  },
  searchInput: {
    flex: 1,
    ...type.body,
    fontSize: 14,
    color: '#fff',
    padding: 0,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.72)',
    ...type.caption,
    marginTop: spacing.xl,
  },
  balance: {
    color: '#fff',
    ...type.hero,
    marginTop: 2,
  },
});
