import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { WalletCard } from '../../data/mock';
import { WalletCardView } from './WalletCardView';
import { useTheme } from '../../theme/ThemeContext';
import { spacing } from '../../theme';
import { haptics } from '../../utils/haptics';

const CARD_WIDTH = 300;

/**
 * Swipeable wallet card carousel.
 *
 * Gesture physics come from the pan gesture; the settle is a calm ease-out
 * (300ms) — never a spring. Cards scale 1.0 → 0.96 and fade 1 → 0.6 as they
 * move off-centre, with no tilt or rotation.
 */
export function CardCarousel({
  cards,
  onPressCard,
  hideBalance = false,
}: {
  cards: WalletCard[];
  onPressCard?: (card: WalletCard) => void;
  hideBalance?: boolean;
}) {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = useSharedValue(0);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      const threshold = 60;
      if (e.translationX < -threshold && activeIndex < cards.length - 1) {
        setActiveIndex((i) => i + 1);
        haptics.swipe();
      } else if (e.translationX > threshold && activeIndex > 0) {
        setActiveIndex((i) => i - 1);
        haptics.swipe();
      }
      translateX.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    });

  return (
    <View>
      <View style={styles.carousel}>
        <GestureDetector gesture={pan}>
          <Animated.View style={styles.inner}>
            {cards.map((card, i) => (
              <CarouselItem
                key={card.id}
                card={card}
                offset={i - activeIndex}
                translateX={translateX}
                isActive={i === activeIndex}
                hideBalance={hideBalance}
                onPress={() => onPressCard?.(card)}
              />
            ))}
          </Animated.View>
        </GestureDetector>
      </View>
      <View style={styles.dots}>
        {cards.map((c, i) => (
          <View
            key={c.id}
            style={[
              styles.dot,
              i === activeIndex && { backgroundColor: theme.accent, width: 20 },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

/** One carousel slot — its own component so the animation hook is legal. */
function CarouselItem({
  card,
  offset,
  translateX,
  isActive,
  hideBalance,
  onPress,
}: {
  card: WalletCard;
  offset: number;
  translateX: SharedValue<number>;
  isActive: boolean;
  hideBalance: boolean;
  onPress: () => void;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const distance = Math.min(Math.abs(offset), 1);
    const scale = interpolate(distance, [0, 1], [1, 0.96]);
    const opacity = interpolate(distance, [0, 1], [1, 0.6]);
    return {
      transform: [{ translateX: translateX.value + offset * (CARD_WIDTH + 16) }, { scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[styles.cardWrap, animatedStyle]}
      pointerEvents={isActive ? 'auto' : 'none'}
    >
      <WalletCardView card={card} active={isActive} hideBalance={hideBalance} onPress={onPress} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  carousel: {
    height: 240,
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
  },
  cardWrap: {
    width: CARD_WIDTH,
    marginRight: 16,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(15,23,41,0.15)',
  },
});