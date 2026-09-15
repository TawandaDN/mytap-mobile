import { Platform, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Centralized tactile feedback.
 *
 * Every interaction resolves to a physical confirmation. expo-haptics drives
 * the Taptic Engine where it is available; where it is not (older devices,
 * Android without a vibrator driver, or a rejected permission) we fall back
 * to React Native's Vibration API so the touch still lands.
 *
 * Patterns are deliberately short and dry — a fintech app taps, it never buzzes.
 */

/** Vibration fallback durations (ms) per intensity. */
const VIBRATION = {
  soft: 8,
  light: 12,
  medium: 22,
  heavy: 38,
  success: [0, 16, 60, 26] as number[],
  warning: [0, 12, 50, 12] as number[],
  error: [0, 26, 70, 26] as number[],
} as const;

/** True once a haptics call has failed — stop paying for the round trip. */
let nativeHapticsUnavailable = Platform.OS === 'web';

function vibrate(pattern: number | number[]) {
  try {
    Vibration.vibrate(pattern);
  } catch {
    // Vibration is unavailable — the interaction simply proceeds silently.
  }
}

function impact(style: Haptics.ImpactFeedbackStyle, fallback: number | number[]) {
  if (nativeHapticsUnavailable) {
    vibrate(fallback);
    return;
  }
  Haptics.impactAsync(style).catch(() => {
    nativeHapticsUnavailable = true;
    vibrate(fallback);
  });
}

function notify(type: Haptics.NotificationFeedbackType, fallback: number | number[]) {
  if (nativeHapticsUnavailable) {
    vibrate(fallback);
    return;
  }
  Haptics.notificationAsync(type).catch(() => {
    nativeHapticsUnavailable = true;
    vibrate(fallback);
  });
}

function select() {
  if (nativeHapticsUnavailable) {
    vibrate(VIBRATION.soft);
    return;
  }
  Haptics.selectionAsync().catch(() => {
    nativeHapticsUnavailable = true;
    vibrate(VIBRATION.soft);
  });
}

export const haptics = {
  light: () => impact(Haptics.ImpactFeedbackStyle.Light, VIBRATION.light),
  medium: () => impact(Haptics.ImpactFeedbackStyle.Medium, VIBRATION.medium),
  heavy: () => impact(Haptics.ImpactFeedbackStyle.Heavy, VIBRATION.heavy),
  soft: () => impact(Haptics.ImpactFeedbackStyle.Soft, VIBRATION.soft),
  rigid: () => impact(Haptics.ImpactFeedbackStyle.Rigid, VIBRATION.medium),
  success: () => notify(Haptics.NotificationFeedbackType.Success, VIBRATION.success),
  warning: () => notify(Haptics.NotificationFeedbackType.Warning, VIBRATION.warning),
  error: () => notify(Haptics.NotificationFeedbackType.Error, VIBRATION.error),
  selection: () => select(),
  pressIn: () => impact(Haptics.ImpactFeedbackStyle.Soft, VIBRATION.soft),
  pressOut: () => impact(Haptics.ImpactFeedbackStyle.Light, VIBRATION.light),
  swipe: () => impact(Haptics.ImpactFeedbackStyle.Medium, VIBRATION.medium),
  tab: () => {
    impact(Haptics.ImpactFeedbackStyle.Light, VIBRATION.light);
    select();
  },
  toggle: () => select(),
  refresh: () => impact(Haptics.ImpactFeedbackStyle.Light, VIBRATION.light),
  /** Authorising a payment — a firm double tap, never a buzz. */
  paymentSuccess: () => {
    notify(Haptics.NotificationFeedbackType.Success, VIBRATION.success);
    impact(Haptics.ImpactFeedbackStyle.Heavy, VIBRATION.heavy);
  },
  processing: () => impact(Haptics.ImpactFeedbackStyle.Medium, VIBRATION.medium),
  flip: () => impact(Haptics.ImpactFeedbackStyle.Medium, VIBRATION.medium),
  tilt: () => impact(Haptics.ImpactFeedbackStyle.Soft, VIBRATION.soft),
  shake: () => notify(Haptics.NotificationFeedbackType.Error, VIBRATION.error),
};

export const useHaptics = () => haptics;
