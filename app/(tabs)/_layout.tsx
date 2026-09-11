import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../src/theme/ThemeContext';
import { BottomTabBar, TabKey } from '../../src/components/ui/BottomTabBar';
import HomeScreen from './index';
import SavingsScreen from './savings';
import AssistantScreen from './assistant';
import PayScreen from '../pay';
import HistoryScreen from '../transactions';

/**
 * Tab layout — renders the active screen behind a sticky white bottom tab bar.
 * Five destinations: Home · Savings · Assistant · Payments · History.
 */
export default function TabsLayout() {
  const { theme } = useTheme();
  const [active, setActive] = useState<TabKey>('home');

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <View style={styles.screen}>
        {active === 'home' && <HomeScreen />}
        {active === 'savings' && <SavingsScreen />}
        {active === 'assistant' && <AssistantScreen />}
        {active === 'pay' && <PayScreen />}
        {active === 'history' && <HistoryScreen />}
      </View>
      <BottomTabBar active={active} onChange={setActive} />
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
