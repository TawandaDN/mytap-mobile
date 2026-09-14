import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { motion } from 'motion/react';
import { Ionicons } from '@expo/vector-icons';
import { WalletCard } from '../../data/mock';
import { formatPula, maskCard } from '../../utils/format';
import { CountUp } from '../animations/CountUp';
import { Sparkline } from '../charts/Sparkline';
import { haptics } from '../../utils/haptics';
import { radius, shadows, type } from '../../theme';

/**
 * Home hero card.
 *
 * A Framer Motion draggable card carrying the live ledger sparkline.
 * Hover is a restrained 2px vertical lift over 300ms ease-out —
 * no tilt, no spin, no 3D rotation.
 */
export function HomeCard({
  card,
  sparkData,
  onPress,
  hideBalance = false,
}: {
  card: WalletCard;
  sparkData: number[];
  onPress?: () => void;
  hideBalance?: boolean;
}) {
  return (
    <motion.view
      style={styles.wrap}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.06}
      dragMomentum={false}
      whileTap={{ scale: 0.985 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onTap={() => {
        haptics.medium();
        onPress?.();
      }}
    >
      <LinearGradient
        colors={[card.gradient[0], card.gradient[1], card.gradient[2]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Material depth: top sheen + soft corner glow */}
        <View style={styles.topSheen} />
        <View style={styles.glow} />

        <View style={styles.topRow}>
          <View style={styles.brandRow}>
            <View style={styles.logoDot}>
              <Ionicons name="flash" size={12} color="#fff" />
            </View>
            <Text style={styles.cardName}>{card.name}</Text>
          </View>
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

        {/* Live ledger sparkline — the balance's real activity curve */}
        <View style={styles.sparkRow}>
          <Sparkline
            data={sparkData.length >= 2 ? sparkData : [1, 1]}
            width={104}
            height={28}
            color="rgba(255,255,255,0.9)"
          />
          <Text style={styles.sparkLabel}>30d activity</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.mask}>{maskCard(card.last4)}</Text>
          <Text style={styles.brand}>{card.brand}</Text>
        </View>

        {card.frozen && (
          <View style={styles.frozenBadge}>
            <Ionicons name="snow" size={11} color="#fff" />
            <Text style={styles.frozenText}>Frozen</Text>
          </View>
        )}
      </LinearGradient>
    </motion.view>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.card,
    ...shadows.premium,
  },
  gradient: {
    borderRadius: radius.card,
    padding: 20,
    height: 204,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  topSheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '52%',
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  glow: {
    position: 'absolute',
    top: -70,
    right: -50,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    color: 'rgba(255,255,255,0.94)',
    ...type.subheading,
    fontWeight: '600',
  },
  chip: {
    width: 38,
    height: 28,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
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
    marginTop: 2,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.62)',
    ...type.caption,
  },
  balance: {
    color: '#fff',
    ...type.moneyLarge,
  },
  sparkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sparkLabel: {
    color: 'rgba(255,255,255,0.6)',
    ...type.small,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mask: {
    color: 'rgba(255,255,255,0.85)',
    ...type.subheading,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  brand: {
    color: 'rgba(255,255,255,0.92)',
    ...type.small,
    fontWeight: '700',
    letterSpacing: 2,
  },
  frozenBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(217,45,32,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  frozenText: {
    color: '#fff',
    ...type.small,
    fontWeight: '600',
  },
});
