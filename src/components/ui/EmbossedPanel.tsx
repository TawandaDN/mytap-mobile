import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import { useSkin } from '../../theme/SkinContext';
import { radius } from '../../theme';

/**
 * Skeuomorphic inset/embossed surface — layered inner highlight + inset shadow
 * for a material, machined feel. Used for inset panels, keypads, and
 * "pressed-in" elements.
 */
export function EmbossedPanel({
  children,
  style,
  inset = true,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  inset?: boolean;
}) {
  const { theme } = useTheme();
  const { skin } = useSkin();

  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: theme.surfaceAlt,
          borderColor: inset ? skin.inset : skin.highlight,
          shadowColor: inset ? skin.inset : skin.highlight,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: radius.lg,
    borderWidth: 1,
    // Inset shadow (top inner dark, bottom inner light)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 0,
    overflow: 'hidden',
  },
});