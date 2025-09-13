import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, useWindowDimensions, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

// density multiplies BASE_COUNT; stars are seeded and stable across re-renders.
const BASE_COUNT = 120;
const MAX_STARS = 300;

// Simple seeded random for stable star positions
function seededRandom(seed: number) {
  let x = Math.sin(seed) * 10000;
  return () => {
    x = Math.sin(x) * 10000;
    return x - Math.floor(x);
  };
}

type StarfieldProps = {
  density?: number;
  zIndex?: number;
  reducedMotion?: boolean;
};

export default function Starfield({
  density = 1,
  zIndex = -1,
  reducedMotion = false,
}: StarfieldProps) {
  const { width, height } = useWindowDimensions();
  const starCount = Math.min(Math.round(BASE_COUNT * density), MAX_STARS);

  // Stable star positions using useRef and seeded random
  const starsRef = useRef<{ cx: number; cy: number; r: number; opacity: number; twinkle: Animated.Value; width: number; height: number }[]>([]);
  if (
    starsRef.current.length !== starCount ||
    starsRef.current[0]?.width !== width ||
    starsRef.current[0]?.height !== height
  ) {
    const rand = seededRandom(width * height + starCount);
    starsRef.current = Array.from({ length: starCount }).map(() => {
      // Radius: 0.3–0.8 (small), 0.8–1.3 (medium), 1.3–1.8 (bright)
      const rType = rand();
      let r;
      if (rType < 0.7) r = 0.3 + rand() * 0.5;
      else if (rType < 0.95) r = 0.8 + rand() * 0.5;
      else r = 1.3 + rand() * 0.5;
      return {
        cx: rand() * width,
        cy: rand() * height,
        r,
        opacity: 0.55 + rand() * 0.45,
        twinkle: new Animated.Value(0),
        width,
        height,
      };
    });
  }

  // Twinkle animation
  useEffect(() => {
    if (reducedMotion) return;
    const loops = starsRef.current.map((star, i) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(star.twinkle, {
            toValue: 1,
            duration: 1800 + Math.floor(i * 7) % 800,
            delay: Math.floor(i * 13) % 1200,
            useNativeDriver: true,
          }),
          Animated.timing(star.twinkle, {
            toValue: 0,
            duration: 1800 + Math.floor(i * 7) % 800,
            useNativeDriver: true,
          }),
        ])
      );
    });
    loops.forEach(loop => loop.start());
    return () => loops.forEach(loop => loop.stop && loop.stop());
  }, [reducedMotion, width, height, starCount]);

  return (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { zIndex },
      ]}
      accessible={false}
      importantForAccessibility="no"
    >
      <Svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
        {starsRef.current.map((s, i) => (
          <AnimatedCircle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="#E6EDF3"
            opacity={reducedMotion ? s.opacity : Animated.add(s.twinkle, s.opacity).interpolate({
              inputRange: [0, 1.5],
              outputRange: [s.opacity, Math.min(1, s.opacity + 0.25)],
            })}
          />
        ))}
      </Svg>
    </View>
  );
}

// Animated wrapper for SVG Circle
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
