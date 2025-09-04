
import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import LunariaSplash from '../components/LunariaSplash';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // QA: keep splash up for at least 10 seconds
  const [minSplashTimePassed, setMinSplashTimePassed] = React.useState(false);
  React.useEffect(() => {
    const timer = setTimeout(() => setMinSplashTimePassed(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = !fontsLoaded || !minSplashTimePassed;

  if (isLoading) {
    return <LunariaSplash appName="Lunaria" tagline="As above, so below." />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
