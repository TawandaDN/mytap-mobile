// Side-effect first: the native gesture handler must be installed before
// anything else is imported.
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { ThemeProvider, useTheme } from '../src/theme/ThemeContext';
import { SkinProvider } from '../src/theme/SkinContext';
import { AppProvider, useApp } from '../src/store/AppStore';
import { ToastProvider } from '../src/components/ui/Toast';
import { BiometricLock } from '../src/components/auth/BiometricLock';

function RootNavigator() {
  const { theme } = useTheme();
  const { state } = useApp();
  const [unlocked, setUnlocked] = useState(!state.biometricEnabled);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style={theme.mode === 'dark' ? 'light' : 'dark'} />
      {state.biometricEnabled && !unlocked ? (
        <BiometricLock onUnlock={() => setUnlocked(true)} />
      ) : (
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.background },
            // Refined screen transition — smooth crossfade (ScreenContainer
            // adds the 0.98 → 1.0 scale), 300ms ease-out.
            animation: 'fade',
            animationDuration: 300,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="guardrail" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="transactions" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="receipts" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="loans" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="insurance" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="rewards" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="help" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="utilities" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="airtime" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="send" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="qr" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="data-bundles" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="insights" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="appearance" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="cards" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="tariff" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="sticker" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="more" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="pay" options={{ animation: 'fade' }} />
          <Stack.Screen name="assistant" options={{ animation: 'slide_from_right' }} />
        </Stack>
      )}
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemeProvider>
        <SkinProvider>
          <AppProvider>
            <ToastProvider>
              <RootNavigator />
            </ToastProvider>
          </AppProvider>
        </SkinProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
