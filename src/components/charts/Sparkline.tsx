import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgGradient, Path, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

/**
 * Animated SVG line/area chart (sparkline) of ledger activity.
 * Draws a smooth line + gradient area from 0 → target over 1500ms ease-out.
 */
export function Sparkline({
  data,
  width = 120,
  height = 40,
  color = '#2ECC71',
  strokeWidth = 2,
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 1500, easing: Easing.out(Easing.cubic) });
  }, [progress]);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 4;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (v - min) / range) * (height - pad * 2);
    return { x, y };
  });

  // Smooth path (catmull-rom → bezier)
  const linePath = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      const prev = points[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
    })
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  const lineProps = useAnimatedProps(() => ({
    strokeDashoffset: 1000 * (1 - progress.value),
  }));
  const areaProps = useAnimatedProps(() => ({
    opacity: progress.value * 0.35,
  }));

  const gid = `spark-${color.replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Defs>
          <SvgGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.5" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </SvgGradient>
        </Defs>
        <AnimatedPath
          d={areaPath}
          fill={`url(#${gid})`}
          stroke="none"
          strokeDasharray={1000}
          animatedProps={areaProps}
        />
        <AnimatedPath
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={1000}
          animatedProps={lineProps}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({});