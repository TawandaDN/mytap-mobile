import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeContext';
import { BottomTabBar, TabKey } from '../../src/components/ui/BottomTabBar';
import HomeScreen from './index';
import CardsScreen from './cards';
import PayScreen from './pay';
import TariffScreen from './tariff';
import StickerScreen from './sticker';
import MoreScreen from './more';

/**
 * Tab layout — renders the active screen with a crossfade + scale transition
 * and a floating glassmorphism bottom tab bar.
 */
export default function TabsLayout() {
  const { theme } = useTheme();
  const router = useRouter();
  const [active, setActive] = useState<TabKey>('home');

  const handleChange = (key: TabKey) => {
    setActive(key);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={styles.screen}>
        {active === 'home' && <HomeScreen />}
        {active === 'cards' && <CardsScreen />}
        {active === 'pay' && <PayScreen />}
        {active === 'tariff' && <TariffScreen />}
        {active === 'more' && <MoreScreen onOpenGuardrail={() => router.push('/guardrail')} onOpenAssistant={() => router.push('/assistant')} />}
        {active === 'sticker' && <StickerScreen />}
      </View>
      <BottomTabBar active={active} onChange={handleChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
});