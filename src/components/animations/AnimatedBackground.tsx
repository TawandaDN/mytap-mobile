import React from 'react';
import { MeshBackdrop } from './MeshBackdrop';

/**
 * Animated gradient background with drifting water-bubble orbs and
 * device-tilt parallax. Delegates to MeshBackdrop for the living,
 * depth-rich backdrop used across every screen.
 */
export function AnimatedBackground({
  children,
  intensity = 1,
}: {
  children?: React.ReactNode;
  intensity?: number;
}) {
  return <MeshBackdrop intensity={intensity}>{children}</MeshBackdrop>;
}