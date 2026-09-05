import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import { WalletCardView } from './WalletCardView';
import { Card } from '../../data/mock';
import { spring } from '../../theme';
import { haptics } from '../../utils/haptics';

const CARD_WIDTH = 300;
const CARD_HEIGHT = 190;
const GAP = 16;

/**
 * Swipeable wallet card carousel with spring physics.
 * Active card scales 1.02x, adjacent cards 0.92x with blur.
 */
export function CardCarousel({ cards }: { cards: Card[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const translateX = useSharedValue(0);
  const [width, setWidth] = useState(0);

  const onGesture = (e: PanGestureHandlerGestureEvent) => {
    translateX.value = e.nativeEvent.translationX;
  };

  const onEnd = (e: PanGestureHandlerGestureEvent) => {
    const dx = e.nativeEvent.translationX;
    const vx = e.nativeEvent.velocityX;
    const threshold = width * 0.2;
    let next = activeIndex;
    if (dx < -threshold || vx < -500) next = Math.min(activeIndex + 1, cards.length - 1);
    else if (dx > threshold || vx > 500) next = Math.max(activeIndex - 1, 0);
    if (next !== activeIndex) {
      setActiveIndex(next);
      haptics.selection();
    }
    translateX.value = withSpring(0, spring);
  };

  return (
    <View
      style={styles.wrap}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {cards.map((card, i) => {
        const offset = i - activeIndex;
        const animatedStyle = useAnimatedStyle(() => {
          const baseX = offset * (CARD_WIDTH + GAP) + translateX.value;
          const scale = offset === 0 ? 1.02 : 0.92;
          return {
            transform: [{ translateX: baseX }, { scale }],
            opacity: offset === 0 ? 1 : 0.6,
          };
        });
        return (
          <Animated.View key={card.id} style={[styles.card, animatedStyle]}>
            <WalletCardView card={card} />
          </Animated.View>
        );
      })}
      <PanGestureHandler onGestureEvent={onGesture} onEnded={onEnd}>
        <Animated.View style={styles.gestureLayer} />
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: CARD_HEIGHT + 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  gestureLayer: {
    ...StyleSheet.absoluteFillObject,
  },
});