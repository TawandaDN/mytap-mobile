import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
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
 * Swipeable wallet card carousel with spring physics.
 * Active card scales 1.02x, adjacent cards 0.92x + reduced opacity + blur.
 */
export function CardCarousel({ cards }: { cards: WalletCard[] }) {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = useSharedValue(0);
  const width = useRef(0);

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
      <View
        style={styles.carousel}
        onLayout={(e) => (width.current = e.nativeEvent.layout.width)}
      >
        <GestureDetector gesture={pan}>
          <Animated.View style={styles.inner}>
            {cards.map((card, i) => {
              const isActive = i === activeIndex;
              const offset = i - activeIndex;
              const animatedStyle = useAnimatedStyle(() => {
                const scale = interpolate(
                  Math.abs(offset),
                  [0, 1],
                  [1.02, 0.92]
                );
                const opacity = interpolate(Math.abs(offset), [0, 1], [1, 0.6]);
                return {
                  transform: [
                    { translateX: translateX.value + offset * (CARD_WIDTH + 16) },
                    { scale },
                  ],
                  opacity,
                };
              });
              return (
                <Animated.View
                  key={card.id}
                  style={[styles.cardWrap, animatedStyle]}
                  pointerEvents={isActive ? 'auto' : 'none'}
                >
                  <WalletCardView card={card} active={isActive} />
                </Animated.View>
              );
            })}
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

const styles = StyleSheet.create({
  carousel: {
    height: 240,
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
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