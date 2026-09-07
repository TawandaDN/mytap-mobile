import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { motion } from 'motion/react';
import { WalletCard } from '../../data/mock';
import { formatPula, maskCard } from '../../utils/format';
import { CountUp } from '../animations/CountUp';
import { WaterBubble } from '../animations/WaterBubble';
import { Sparkline } from '../charts/Sparkline';
import { radius, shadows, type } from '../../theme';

/**
 * Home hero card animated with Framer Motion (motion/react).
 * Drag with spring physics, layout/shared transitions, and a live
 * ledger sparkline reflecting real-time balance activity.
 */
export function HomeCard({
  card,
  sparkData,
  onPress,
}: {
  card: WalletCard;
  sparkData: number[];
  onPress?: () => void;
}) {
  return (
    <motion.view
      style={styles.wrap}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.12}
      whileTap={{ scale: 0.98 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      onTap={onPress}
    >
      <LinearGradient
        colors={[...card.gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <WaterBubble color="rgba(255,255,255,0.16)" />
        <View style={styles.glow} />
        <View style={styles.topRow}>
          <Text style={styles.cardName}>{card.name}</Text>
          <View style={styles.chip}>
            <View style={styles.chipInner} />
          </View>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Available balance</Text>
          <CountUp value={card.balance} format={(v) => formatPula(v)} glow="emerald" style={styles.balance} />
        </View>
        {/* Live ledger sparkline */}
        <View style={styles.sparkRow}>
          <Sparkline data={sparkData} width={110} height={34} color="rgba(255,255,255,0.85)" />
          <Text style={styles.sparkLabel}>30d activity</Text>
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.mask}>{maskCard(card.last4)}</Text>
          <Text style={styles.brand}>MyTap</Text>
        </View>
        {card.frozen && (
          <View style={styles.frozenBadge}>
            <Text style={styles.frozenText}>Frozen</Text>
          </View>
        )}
      </LinearGradient>
    </motion.view>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.xxl,
    ...shadows.hero,
  },
  gradient: {
    borderRadius: radius.xxl,
    padding: 20,
    height: 220,
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
    color: 'rgba(255,255,255,0.9)',
    ...type.subheading,
    fontWeight: '600',
  },
  chip: {
    width: 40,
    height: 30,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipInner: {
    width: 26,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  balanceRow: {
    marginTop: 4,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.6)',
    ...type.caption,
  },
  balance: {
    color: '#fff',
    ...type.largeTitle,
    fontWeight: '700',
  },
  sparkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
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
  },
  brand: {
    color: 'rgba(255,255,255,0.9)',
    ...type.heading,
    fontWeight: '700',
    letterSpacing: 1,
  },
  frozenBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(231,76,60,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  frozenText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});