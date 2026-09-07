import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { WalletCard as WalletCardType } from '../../data/mock';
import { fonts, radius, shadows, type } from '../../theme';
import { formatPula, maskCard } from '../../utils/format';
import { WaterBubble } from '../animations/WaterBubble';
import { CountUp } from '../animations/CountUp';
import { Sparkline } from '../charts/Sparkline';

/**
 * Premium gradient wallet card with water bubble, 3D floating effect,
 * and MyTap Glow radial highlight.
 */
export function WalletCardView({
  card,
  active = false,
  onPress,
  style,
}: {
  card: WalletCardType;
  active?: boolean;
  onPress?: () => void;
  style?: object;
}) {
  const float = useSharedValue(0);

  useEffect(() => {
    float.value = withRepeat(
      withTiming(1, { duration: 3000 }),
      -1,
      true
    );
  }, [float]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: float.value * 6 }],
  }));

  return (
    <Animated.View style={[styles.wrap, floatStyle, style]}>
      <LinearGradient
        colors={[...card.gradient]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <WaterBubble color="rgba(255,255,255,0.16)" />
        {/* MyTap Glow radial highlight */}
        <View style={styles.glow} />
        <View style={styles.topRow}>
          <Text style={styles.cardName}>{card.name}</Text>
          <View style={styles.chip}>
            <View style={styles.chipInner} />
          </View>
        </View>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>Available balance</Text>
          <CountUp
            value={card.balance}
            format={(v) => formatPula(v)}
            glow="emerald"
            style={styles.balance}
          />
        </View>
        {/* Live ledger sparkline */}
        <View style={styles.sparkRow}>
          <Sparkline data={[3, 4, 3.5, 5, 4.5, 6, 5.5, 7, 6.5, 8]} width={110} height={30} color="rgba(255,255,255,0.85)" />
          <Text style={styles.sparkLabel}>30d</Text>
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
    </Animated.View>
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
    marginTop: 8,
  },
  sparkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  sparkLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
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