import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WalletCard as WalletCardType } from '../../data/mock';
import { radius, shadows, type } from '../../theme';
import { formatPula, maskCard } from '../../utils/format';
import { WaterBubble } from '../animations/WaterBubble';
import { CountUp } from '../animations/CountUp';
import { PressableScale } from '../ui/PressableScale';

/**
 * Wallet card — a gradient card face for the Home carousel and the
 * Cards & Wallets list. Carries the scheme mark, the live balance and the
 * masked PAN, with a touch-following water droplet across its surface.
 */
export function WalletCardView({
  card,
  width,
  height = 196,
  onPress,
  style,
  hideBalance = false,
  /** Marks the centred card in a carousel — adds a restrained depth lift. */
  active = true,
}: {
  card: WalletCardType;
  width?: number;
  height?: number;
  onPress?: () => void;
  style?: object;
  hideBalance?: boolean;
  active?: boolean;
}) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.97}
      bubble={false}
      style={[styles.wrap, width ? { width } : null, style] as any}
    >
      <LinearGradient
        colors={[card.gradient[0], card.gradient[1], card.gradient[2]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, { height, opacity: active ? 1 : 0.9 }]}
      >
        <WaterBubble color="rgba(255,255,255,0.12)" />
        <View style={styles.glow} pointerEvents="none" />

        <View style={styles.topRow}>
          <Text style={styles.cardName} numberOfLines={1}>
            {card.name}
          </Text>
          <View style={styles.chip}>
            <View style={styles.chipInner} />
          </View>
        </View>

        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Available balance</Text>
          {hideBalance ? (
            <Text style={styles.balance}>P••••••</Text>
          ) : (
            <CountUp
              value={card.balance}
              format={(v) => formatPula(v)}
              glow="none"
              style={styles.balance}
            />
          )}
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.mask}>{maskCard(card.last4)}</Text>
          <Text style={styles.brand}>{card.brand}</Text>
        </View>

        {card.frozen && (
          <View style={styles.frozenBadge}>
            <Ionicons name="snow" size={10} color="#fff" />
            <Text style={styles.frozenText}>Frozen</Text>
          </View>
        )}
      </LinearGradient>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.card,
    ...shadows.elevated,
  },
  gradient: {
    borderRadius: radius.card,
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardName: {
    color: 'rgba(255,255,255,0.94)',
    ...type.subheading,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  chip: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipInner: {
    width: 24,
    height: 17,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  balanceRow: {
    marginTop: 8,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.6)',
    ...type.caption,
  },
  balance: {
    color: '#fff',
    ...type.moneyLarge,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  mask: {
    color: 'rgba(255,255,255,0.85)',
    ...type.caption,
    letterSpacing: 1.6,
    fontVariant: ['tabular-nums'],
  },
  brand: {
    color: 'rgba(255,255,255,0.9)',
    ...type.small,
    fontWeight: '700',
    letterSpacing: 1.6,
  },
  frozenBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(217,45,32,0.9)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  frozenText: {
    color: '#fff',
    ...type.small,
    fontWeight: '600',
  },
});
