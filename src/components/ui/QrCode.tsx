import React, { useMemo } from 'react';
import Svg, { Rect } from 'react-native-svg';

/**
 * A perfectly rendered vector QR code — deterministic pattern derived from a
 * seed string, with the three real finder patterns. Renders crisply at any
 * size (no raster blur) for the QR Pay sheet.
 */
export function QrCode({
  value = 'https://mytap.bw/pay/tawanda',
  size = 180,
  color = '#101828',
  background = 'transparent',
}: {
  value?: string;
  size?: number;
  color?: string;
  background?: string;
}) {
  const modules = 25;
  const cell = size / modules;

  // Deterministic pseudo-random bitfield from the seed.
  const grid = useMemo(() => {
    let h = 2166136261;
    for (let i = 0; i < value.length; i++) {
      h ^= value.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const rand = (x: number, y: number) => {
      let n = h ^ Math.imul(x + 1, 374761393) ^ Math.imul(y + 1, 668265263);
      n = Math.imul(n ^ (n >>> 13), 1274126177);
      return ((n ^ (n >>> 16)) >>> 0) % 100;
    };
    const g: boolean[][] = Array.from({ length: modules }, () => Array(modules).fill(false));
    for (let y = 0; y < modules; y++) {
      for (let x = 0; x < modules; x++) {
        g[y][x] = rand(x, y) < 47;
      }
    }
    return g;
  }, [value]);

  const finderPositions = [
    { x: 0, y: 0 },
    { x: modules - 7, y: 0 },
    { x: 0, y: modules - 7 },
  ];

  const inFinderZone = (x: number, y: number) =>
    (x < 8 && y < 8) || (x >= modules - 8 && y < 8) || (x < 8 && y >= modules - 8);

  const cells: React.ReactNode[] = [];

  // Data modules
  grid.forEach((row, y) => {
    row.forEach((on, x) => {
      if (!on || inFinderZone(x, y)) return;
      cells.push(
        <Rect
          key={`d-${x}-${y}`}
          x={x * cell}
          y={y * cell}
          width={cell}
          height={cell}
          rx={cell * 0.22}
          fill={color}
        />
      );
    });
  });

  // Finder patterns (7×7 outer ring + 3×3 core)
  finderPositions.forEach((p, i) => {
    cells.push(
      <Rect
        key={`fo-${i}`}
        x={p.x * cell}
        y={p.y * cell}
        width={cell * 7}
        height={cell * 7}
        rx={cell * 1.6}
        fill={color}
      />
    );
    cells.push(
      <Rect
        key={`fi-${i}`}
        x={(p.x + 1) * cell}
        y={(p.y + 1) * cell}
        width={cell * 5}
        height={cell * 5}
        rx={cell * 1.1}
        fill="#FFFFFF"
      />
    );
    cells.push(
      <Rect
        key={`fc-${i}`}
        x={(p.x + 2) * cell}
        y={(p.y + 2) * cell}
        width={cell * 3}
        height={cell * 3}
        rx={cell * 0.7}
        fill={color}
      />
    );
  });

  return (
    <Svg width={size} height={size}>
      {background !== 'transparent' && (
        <Rect x={0} y={0} width={size} height={size} fill={background} />
      )}
      {cells}
    </Svg>
  );
}
