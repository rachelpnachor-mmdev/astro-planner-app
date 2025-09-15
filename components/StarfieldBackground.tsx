import React, { memo, useEffect, useMemo } from 'react';
import { AccessibilityInfo, Animated, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

const STAR_COUNT = 24;
const STAR_COLOR = 'rgba(213,219,232,0.9)';

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
      Array.from({ length: STAR_COUNT }).map(() => ({
        top: Math.floor(Math.random() * Math.max(480, height)),
        left: Math.floor(Math.random() * 420),
        size: 1 + Math.floor(Math.random() * 2),
        delay: Math.floor(Math.random() * 4000),
        duration: 2000 + Math.floor(Math.random() * 2000),
      })),
    [height]
  );
  const opacities = useMemo(() => stars.map(() => new Animated.Value(Math.random())), [stars]);

  useEffect(() => {
    let loops: Animated.CompositeAnimation[] = [];
    if (!reduceMotion) {
      loops = opacities.map((v, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(v, {
              toValue: 1,
              duration: stars[i].duration,
              delay: stars[i].delay,
              useNativeDriver: true,
            }),
            Animated.timing(v, {
              toValue: 0.3,
              duration: stars[i].duration,
              useNativeDriver: true,
            }),
          ])
        )
      );
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
          backgroundColor: STAR_COLOR,
          opacity: reduceMotion ? 0.6 : opacities[i],
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
