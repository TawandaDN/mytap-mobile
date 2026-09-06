import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { radius } from '../../theme';

/**
 * Modal that slides up with a 400ms spring bounce.
 */
export function SlideUpModal({
  visible,
  onClose,
  children,
  style,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  const { theme } = useTheme();
  const translateY = useSharedValue(600);
  const backdrop = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
      backdrop.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
    } else {
      translateY.value = withTiming(600, { duration: 300, easing: Easing.out(Easing.cubic) });
      backdrop.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.cubic) });
    }
  }, [visible, translateY, backdrop]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value,
  }));

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.root}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: theme.surface, borderColor: theme.border },
            sheetStyle,
            style,
          ]}
        >
          <View style={[styles.handle, { backgroundColor: theme.textMuted }]} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15,23,41,0.5)',
  },
  sheet: {
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: 20,
    paddingBottom: 40,
    borderWidth: 1,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
    opacity: 0.4,
  },
});