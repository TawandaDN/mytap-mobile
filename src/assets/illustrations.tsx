import React from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp } from 'react-native';

/**
 * 3D illustration registry.
 *
 * A single consistent set — soft studio light, rounded shapes, premium
 * materials (glass, brushed metal, matte ceramic) in the MyTap palette.
 * Referenced by key so screens stay decoupled from file paths.
 */
const registry = {
  wallet: require('../../assets/illustrations/wallet.png'),
  success: require('../../assets/illustrations/success.png'),
  coins: require('../../assets/illustrations/coins.png'),
  onboarding: require('../../assets/illustrations/onboarding.png'),
  cardVirtual: require('../../assets/illustrations/card_virtual.png'),
  cardMetal: require('../../assets/illustrations/card_metal.png'),
  shield: require('../../assets/illustrations/shield.png'),
} as Record<string, ImageSourcePropType>;

export type IllustrationKey = keyof typeof registry;

export function illustration(key: IllustrationKey): ImageSourcePropType {
  return registry[key];
}

/** Ready-sized illustration. */
export function Illustration({
  name,
  size = 160,
  style,
}: {
  name: IllustrationKey;
  size?: number;
  style?: StyleProp<ImageStyle>;
}) {
  return (
    <Image
      source={registry[name]}
      resizeMode="contain"
      style={[{ width: size, height: size }, style]}
      accessibilityIgnoresInvertColors
    />
  );
}
