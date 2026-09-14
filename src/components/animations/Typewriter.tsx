import React, { useEffect, useState } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

/**
 * Typewriter effect — reveals text character by character.
 *
 * NOTE: intentional, bounded synchronous state set on mount so the first
 * frame starts from an empty string before the reveal interval begins.
 */
export function Typewriter({
  text,
  speed = 30,
  style,
}: {
  text: string;
  speed?: number;
  style?: StyleProp<TextStyle>;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCount(0);
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return <Text style={style}>{text.slice(0, count)}</Text>;
}
