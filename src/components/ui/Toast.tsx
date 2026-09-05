import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../theme/ThemeContext';
import { radius, shadows, type } from '../../theme';

type ToastType = 'success' | 'error' | 'info';

interface ToastCtx {
  show: (msg: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastCtx>({ show: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const [msg, setMsg] = useState('');
  const [type, setType] = useState<ToastType>('success');
  const [visible, setVisible] = useState(false);
  const progress = useSharedValue(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(
    (m: string, t: ToastType = 'success') => {
      setMsg(m);
      setType(t);
      setVisible(true);
      progress.value = 0;
      progress.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) });
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        progress.value = withTiming(0, { duration: 250 });
        setTimeout(() => setVisible(false), 250);
      }, 2200);
    },
    [progress]
  );

  const style = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: (1 - progress.value) * 20 }],
  }));

  const color = type === 'success' ? '#2ECC71' : type === 'error' ? '#E74C3C' : '#3498DB';

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {visible && (
        <View style={styles.wrap} pointerEvents="none">
          <Animated.View
            style={[
              styles.toast,
              { backgroundColor: theme.surface, borderColor: color + '55' },
              style,
            ]}
          >
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={[styles.text, { color: theme.text }]}>{msg}</Text>
          </Animated.View>
        </View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    ...shadows.medium,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    ...type.body,
    fontWeight: '500',
  },
});