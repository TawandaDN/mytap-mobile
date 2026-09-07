import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
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
            animation: 'fade',
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="guardrail" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="assistant" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="transactions" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="receipts" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="savings" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="loans" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="insurance" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="rewards" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="notifications" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="profile" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="settings" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="help" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="utilities" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="airtime" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="data" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="send" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="qr" options={{ animation: 'fade' }} />
          <Stack.Screen name="data-bundles" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="insights" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="appearance" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="about" options={{ animation: 'slide_from_right' }} />
        </Stack>
      )}
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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