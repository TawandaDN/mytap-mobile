import React, { useEffect, useState } from 'react';
import { Text, TextStyle } from 'react-native';

/**
 * Typewriter effect — reveals text character by character.
 */
export function Typewriter({
  text,
  speed = 30,
  style,
}: {
  text: string;
  speed?: number;
  style?: TextStyle;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
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