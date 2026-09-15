import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { Skeleton } from './Skeleton';
import { StaggeredItem } from './Staggered';
import { radii, space, elevation, iconTile } from '../../theme/tokens';

/**
 * Layout-matched loading skeletons.
 *
 * Grey blocks with a single animated gradient sweeping across, on a 6000ms
 * linear loop — never a spinner. Each skeleton mirrors the real layout it
 * stands in for, so the swap to live data is a fill, not a reflow.
 */

/** History — date header + a soft card of ledger rows. */
export function HistorySkeleton({ groups = 2, rowsPerGroup = 3 }: { groups?: number; rowsPerGroup?: number }) {
  const { theme } = useTheme();

  return (
    <>
      {Array.from({ length: groups }).map((_, gi) => (
        <StaggeredItem key={gi} index={gi + 1}>
          <View style={styles.headerBlock}>
            <Skeleton width={132} height={11} radius={6} />
          </View>
          <View style={[styles.card, { backgroundColor: theme.surface }]}>
            {Array.from({ length: rowsPerGroup }).map((__, ri) => (
              <View
                key={ri}
                style={[
                  styles.row,
                  ri > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.hairline },
                ]}
              >
                <Skeleton width={32} height={32} radius={11} />
                <View style={styles.rowText}>
                  <Skeleton width="58%" height={13} radius={6} />
                  <Skeleton width="34%" height={10} radius={5} style={styles.rowGap} />
                </View>
                <View style={styles.rowRight}>
                  <Skeleton width={68} height={13} radius={6} />
                  <Skeleton width={42} height={10} radius={5} style={styles.rowGap} />
                </View>
              </View>
            ))}
          </View>
        </StaggeredItem>
      ))}
    </>
  );
}

/** Cards — gradient-shaped card faces plus the Card Shop rows. */
export function CardsSkeleton({ count = 3 }: { count?: number }) {
  const { theme } = useTheme();

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <StaggeredItem key={i} index={i + 1}>
          <View style={styles.cardFaceWrap}>
            <Skeleton width="100%" height={188} radius={radii.elevated} style={elevation.premium} />
            <View style={styles.cardActions}>
              <Skeleton width="100%" height={40} radius={radii.pill} style={styles.flex} />
              <Skeleton width="100%" height={40} radius={radii.pill} style={styles.flex} />
            </View>
          </View>
        </StaggeredItem>
      ))}

      <StaggeredItem index={count + 1}>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          {Array.from({ length: 3 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.shopRow,
                i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.hairline },
              ]}
            >
              <Skeleton width={iconTile.size} height={iconTile.size} radius={iconTile.radius} />
              <View style={styles.rowText}>
                <Skeleton width="52%" height={13} radius={6} />
                <Skeleton width="72%" height={10} radius={5} style={styles.rowGap} />
              </View>
              <Skeleton width={54} height={13} radius={6} />
            </View>
          ))}
        </View>
      </StaggeredItem>
    </>
  );
}

const styles = StyleSheet.create({
  headerBlock: {
    marginTop: space.xl,
    marginBottom: space.sm,
    marginLeft: 4,
  },
  card: {
    borderRadius: radii.card,
    paddingHorizontal: space.md,
    ...elevation.standard,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.sm,
  },
  rowText: {
    flex: 1,
    marginLeft: space.sm,
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  rowGap: {
    marginTop: space.xxs + 2,
  },
  cardFaceWrap: {
    marginBottom: space.lg,
    gap: space.sm,
  },
  cardActions: {
    flexDirection: 'row',
    gap: space.sm,
  },
  flex: {
    flex: 1,
  },
  shopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.sm + 2,
    gap: space.sm,
  },
});
