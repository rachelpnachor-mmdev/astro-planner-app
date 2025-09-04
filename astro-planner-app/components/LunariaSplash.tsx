// LunariaSplash.tsx
// UI-only loading screen for the Lunaria app (no data fetching here).
// Dependencies: react-native-svg, react-native-linear-gradient (optional)

import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing, Platform } from "react-native";
import Svg, { Circle, Path, G } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";

type Props = {
  appName?: string;           // defaults to "Lunaria"
  tagline?: string;           // defaults to "As above, so below."
  showSpinner?: boolean;      // whether to show the orbiting dot
  accentColor?: string;       // accent glow (#B9C6FF by default)
};

const LunariaSplash: React.FC<Props> = ({
  appName = "Lunaria",
  tagline = "As above, so below.",
  showSpinner = true,
  accentColor = "#B9C6FF",
}) => {
  // Slow rotation for the astro chart wheel
  const chartRotation = useRef(new Animated.Value(0)).current;

  // Gentle twinkle (opacity pulse) for stars
  const twinkle = useRef(new Animated.Value(0)).current;

  // Spinner: a dot orbiting around the moon
  const spinnerRotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(chartRotation, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(twinkle, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(twinkle, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();

    if (showSpinner) {
      Animated.loop(
        Animated.timing(spinnerRotation, {
          toValue: 1,
          duration: 3500,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [chartRotation, spinnerRotation, twinkle, showSpinner]);

  const chartSpin = chartRotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const spinnerSpin = spinnerRotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const starOpacity = twinkle.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  return (
    <View style={styles.container} accessibilityRole="image" accessibilityLabel={`${appName} loading screen`}>
      {/* Night-sky gradient (swap to a View with backgroundColor if you prefer no dependency) */}
      <LinearGradient colors={["#0B0E1A", "#06070D"]} style={StyleSheet.absoluteFillObject} />

      <View style={styles.center}>
        <View style={styles.svgWrap} accessible accessibilityLabel="Moon with celestial chart and stars">
          <Svg width="220" height="220" viewBox="0 0 220 220">
            {/* Subtle star field (static + twinkling) */}
            <G opacity={0.85}>
              {STAR_COORDS.map((s, i) => (
                <Circle key={`star-${i}`} cx={s.x} cy={s.y} r={s.r} fill="#DDE3FF" opacity={0.6} />
              ))}
              <AnimatedCircle cx={30} cy={40} r={1.5} fill="#FFFFFF" opacity={starOpacity as any} />
              <AnimatedCircle cx={175} cy={25} r={1.2} fill="#FFFFFF" opacity={starOpacity as any} />
              <AnimatedCircle cx={200} cy={150} r={1.4} fill="#FFFFFF" opacity={starOpacity as any} />
            </G>

            {/* Slowly rotating astro chart wheel */}
            <AnimatedG
              origin="110,110"
              style={{ transform: [{ rotate: chartSpin }] }}
              opacity={0.25}
            >
              <Circle cx={110} cy={110} r={90} stroke="#C6CCFF" strokeWidth={0.75} fill="none" />
              <Circle cx={110} cy={110} r={70} stroke="#C6CCFF" strokeWidth={0.5} fill="none" />
              <Circle cx={110} cy={110} r={50} stroke="#C6CCFF" strokeWidth={0.35} fill="none" />
              {/* 12 radial lines */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 12;
                const x = 110 + 90 * Math.cos(angle);
                const y = 110 + 90 * Math.sin(angle);
                return <Path key={`ray-${i}`} d={`M110 110 L${x} ${y}`} stroke="#C6CCFF" strokeWidth={0.4} />;
              })}
            </AnimatedG>

            {/* Moon (crescent) */}
            <G>
              {/* Glow */}
              <Circle cx={110} cy={110} r={40} fill="rgba(185,198,255,0.08)" />
              {/* Full disk (dim) */}
              <Circle cx={110} cy={110} r={34} fill="#E9ECFF" opacity={0.15} />
              {/* Crescent mask shape: draw a crescent by overlaying a dark circle offset */}
              <Circle cx={96} cy={110} r={34} fill="#0B0E1A" />
              {/* Highlight rim */}
              <Circle cx={110} cy={110} r={34} stroke="#E9ECFF" strokeWidth={0.6} fill="none" opacity={0.7} />
            </G>

            {/* Orbiting dot as a spinner */}
            {showSpinner && (
              <AnimatedG origin="110,110" style={{ transform: [{ rotate: spinnerSpin }] }}>
                <Circle cx={110} cy={62} r={3} fill={accentColor} />
              </AnimatedG>
            )}
          </Svg>
        </View>

        <Text style={styles.title} accessibilityRole="header">{appName}</Text>
        <Text style={styles.tagline} numberOfLines={2} accessibilityLabel={`Tagline: ${tagline}`}>
          {tagline}
        </Text>
      </View>

      {/* (Optional) tiny footer build/version or privacy link could sit here */}
    </View>
  );
};

// ---- helpers

const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const STAR_COORDS = [
  { x: 18, y: 28, r: 1.1 },
  { x: 55, y: 18, r: 0.9 },
  { x: 200, y: 40, r: 1.1 },
  { x: 190, y: 90, r: 0.8 },
  { x: 24, y: 180, r: 1.2 },
  { x: 70, y: 200, r: 0.9 },
  { x: 160, y: 190, r: 0.8 },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06070D",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  svgWrap: {
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.45, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 8 },
    }),
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    color: "#F2F4FF",
    letterSpacing: 0.5,
    fontWeight: "700",
  },
  tagline: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 22,
    color: "#C9CFF7",
    textAlign: "center",
    opacity: 0.9,
  },
});

export default LunariaSplash;
