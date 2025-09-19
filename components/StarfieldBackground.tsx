import React, { memo, useEffect, useMemo } from 'react';
import { AccessibilityInfo, Animated, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { HoroscopeColors } from '../constants/Colors';

const STAR_COUNT = 36; // Increased for richer starfield
const STAR_COLOR = 'rgba(245,247,250,0.8)'; // Using HoroscopeColors.text with opacity
const STAR_COLOR_DIM = 'rgba(245,247,250,0.3)'; // Dimmer stars for depth
const STAR_COLOR_BRIGHT = 'rgba(231,200,136,0.6)'; // Celestial gold accent stars

const getReduceMotion = async () => {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return await AccessibilityInfo.isReduceMotionEnabled();
  }
  // Web: fallback to prefers-reduced-motion
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  return false;
};

const StarfieldBackground = memo(function StarfieldBackground() {
  const { height } = useWindowDimensions();
  const [reduceMotion, setReduceMotion] = React.useState(false);

  useEffect(() => {
    let mounted = true;
    getReduceMotion().then((v) => { if (mounted) setReduceMotion(v); });
    return () => { mounted = false; };
  }, []);

  const stars = useMemo(
    () =>
      Array.from({ length: STAR_COUNT }).map(() => {
        const starType = Math.random();
        const isBright = starType > 0.85; // 15% bright accent stars
        const isDim = starType < 0.3; // 30% dim background stars

        return {
          top: Math.floor(Math.random() * Math.max(480, height)),
          left: Math.floor(Math.random() * 420),
          size: isBright ? 2 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 2),
          delay: Math.floor(Math.random() * 4000),
          duration: isDim ? 4000 + Math.floor(Math.random() * 2000) : 2000 + Math.floor(Math.random() * 2000),
          color: isBright ? STAR_COLOR_BRIGHT : isDim ? STAR_COLOR_DIM : STAR_COLOR,
          isBright,
          isDim,
        };
      }),
    [height]
  );
  const opacities = useMemo(() => stars.map(() => new Animated.Value(Math.random())), [stars]);

  useEffect(() => {
    let loops: Animated.CompositeAnimation[] = [];
    if (!reduceMotion) {
      loops = opacities.map((v, i) => {
        const star = stars[i];
        const minOpacity = star.isDim ? 0.1 : star.isBright ? 0.4 : 0.2;
        const maxOpacity = star.isDim ? 0.4 : star.isBright ? 1 : 0.8;

        return Animated.loop(
          Animated.sequence([
            Animated.timing(v, {
              toValue: maxOpacity,
              duration: star.duration,
              delay: star.delay,
              useNativeDriver: true,
            }),
            Animated.timing(v, {
              toValue: minOpacity,
              duration: star.duration,
              useNativeDriver: true,
            }),
          ])
        );
      });
      loops.forEach((loop) => loop.start());
    }
    return () => {
      loops.forEach((loop) => loop.stop && loop.stop());
    };
  }, [opacities, reduceMotion, stars]);

  return (
    <View pointerEvents="none" style={styles.container}>
      {/* Optional: gradient overlay can be added here if sign-in uses one */}
      {stars.map((s, i) => {
        const style = {
          position: 'absolute' as const,
          top: s.top,
          left: s.left,
          width: s.size,
          height: s.size,
          borderRadius: s.size / 2,
          backgroundColor: s.color,
          opacity: reduceMotion ? (s.isDim ? 0.3 : s.isBright ? 0.8 : 0.6) : opacities[i],
          shadowColor: s.isBright ? s.color : undefined,
          shadowOffset: s.isBright ? { width: 0, height: 0 } : undefined,
          shadowOpacity: s.isBright ? 0.3 : undefined,
          shadowRadius: s.isBright ? 2 : undefined,
          elevation: s.isBright ? 2 : undefined,
        };
        return <Animated.View key={i} style={style} />;
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    // no zIndex, no backgroundColor here
  },
});

export default StarfieldBackground;
