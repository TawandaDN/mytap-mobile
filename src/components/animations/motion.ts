import { Easing } from 'react-native-reanimated';

/**
 * Canonical easing curves for the MyTap motion system.
 *
 * Zero bounciness: everything resolves on an ease-out (or, for the loading
 * shimmer and the screen slide, a linear / ease-in-out) curve. No spring,
 * no elastic, no overshoot.
 *
 * Use these with `withTiming` — never `withSpring` — outside drag gestures.
 */
export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeLinear = Easing.linear;

/** Durations (ms), straight from the motion spec. */
export const DURATION = {
  /** Entry / exit fades, card hover lift, screen transitions. */
  fade: 300,
  /** Screen slide. */
  slide: 400,
  /** Modals and dialogs. */
  scale: 400,
  /** Balance / number updates. */
  count: 500,
  /** Progress ring stroke, 0% → target. */
  stroke: 1500,
  /** Loading shimmer sweep. */
  shimmer: 6000,
  /** Payment success — glow + checkmark draw. */
  success: 800,
} as const;

/**
 * Card hover — a restrained 2px vertical lift. No tilt, no spin, no 3D.
 * Pair with a shadow intensification over the same 300ms ease-out.
 */
export const HOVER_LIFT = -2;

/** Screen transition scale — crossfade from 0.98 to 1.0. */
export const ENTER_SCALE = 0.98;

/** Timing configs ready to hand to `withTiming`. */
export const timing = {
  fade: { duration: DURATION.fade, easing: easeOut },
  slide: { duration: DURATION.slide, easing: easeInOut },
  scale: { duration: DURATION.scale, easing: easeOut },
  count: { duration: DURATION.count, easing: easeOut },
  stroke: { duration: DURATION.stroke, easing: easeOut },
  shimmer: { duration: DURATION.shimmer, easing: easeLinear },
  hover: { duration: DURATION.fade, easing: easeOut },
  success: { duration: DURATION.success, easing: easeOut },
} as const;

/** Interpolate a 0→1 progress into a translateY entry offset. */
export function entryOffset(progress: number, distance = 20) {
  'worklet';
  return (1 - progress) * distance;
}
