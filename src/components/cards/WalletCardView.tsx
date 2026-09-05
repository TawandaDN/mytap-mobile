import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../data/mock';
import { formatPula, maskCard } from '../../utils/format';
import { type } from '../../theme';

/**
 * A single wallet card visual with its signature gradient.
 */
export function WalletCardView({ card }: { card: Card }) {
  return (
    <LinearGradient
      colors={card.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.top}>
        <Text style={styles.name}>{card.name}</Text>
        <View style={styles.chip} />
      </View>
      <Text style={styles.balance}>{formatPula(card.balance)}</Text>
      <Text style={styles.mask}>{maskCard(card.last4)}</Text>
      <View style={styles.bottom}>
        <Text style={styles.type}>{card.type.toUpperCase()}</Text>
        <Text style={styles.frozen}>{card.frozen ? 'FROZEN' : 'ACTIVE'}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 28,
    padding: 24,
    justifyContent: 'space-between',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '600',
  },
  chip: {
    width: 36,
    height: 26,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  balance: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '700',
  },
  mask: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    letterSpacing: 2,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  frozen: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '700',
  },
});