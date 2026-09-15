import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GradientHeader } from '../ui/GradientHeader';
import { PressableScale } from './PressableScale';
import { CountUp } from '../animations/CountUp';
import { formatPula } from '../../utils/format';
import { radii, space, text } from '../../theme/tokens';

/**
 * Home header.
 *
 * The deep navy gradient block at the top of Home — the profile avatar, a
 * utility search bar, cart and notification icons — carrying the primary
 * metric (Total Balance) in the 40pt Light hero face. The gradient bleeds
 * into the content canvas beneath rather than ending on a hard edge.
 */
export function HubHeader({
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
  return (
    <GradientHeader kind="home">
      {/* Top row — avatar · utility icons */}
      <View style={styles.topRow}>
        <PressableScale onPress={onAvatarPress} style={styles.avatar} scaleTo={0.94} bubble={false}>
          <Text style={styles.avatarText}>{initial}</Text>
        </PressableScale>

        <View style={styles.utilityRow}>
          <PressableScale
            style={styles.utilityBtn}
            haptic="light"
            onPress={onCartPress}
            scaleTo={0.96}
            bubble={false}
          >
            <Ionicons name="cart-outline" size={18} color="rgba(255,255,255,0.92)" />
          </PressableScale>
          <PressableScale
            style={styles.utilityBtn}
            haptic="light"
            onPress={onBellPress}
            scaleTo={0.96}
            bubble={false}
          >
            <Ionicons name="notifications-outline" size={18} color="rgba(255,255,255,0.92)" />
            {unreadCount > 0 && <View style={styles.badge} />}
          </PressableScale>
        </View>
      </View>

      {/* Search — 20px radius, icon left, mic right, muted placeholder */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color="rgba(255,255,255,0.66)" />
        <TextInput
          value={searchValue}
          onChangeText={onSearchChange}
          placeholder="Search transactions, bills, or cards..."
          placeholderTextColor="rgba(255,255,255,0.55)"
          style={styles.searchInput}
        />
        <Ionicons name="mic-outline" size={16} color="rgba(255,255,255,0.66)" />
      </View>

      {/* Primary metric */}
      <Text style={styles.balanceLabel}>TOTAL BALANCE</Text>
      {hideBalance ? (
        <Text style={styles.balance}>P ••••••</Text>
      ) : (
        <CountUp
          value={balance}
          format={(v) => formatPula(v)}
          duration={400}
          glow="none"
          style={styles.balance}
        />
      )}
    </GradientHeader>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radii.avatar,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    fontWeight: '600',
  },
  utilityRow: {
    flexDirection: 'row',
    gap: space.xs,
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
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B4A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: radii.search,
    paddingHorizontal: space.md,
    paddingVertical: 10,
    marginTop: space.md,
  },
  searchInput: {
    flex: 1,
    ...text.body,
    fontSize: 14,
    color: '#fff',
    padding: 0,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.62)',
    ...text.label,
    letterSpacing: 0.5,
    marginTop: space.xl,
  },
  balance: {
    color: '#fff',
    ...text.hero,
    marginTop: space.xxs,
  },
});
