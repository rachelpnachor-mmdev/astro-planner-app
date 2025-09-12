import { Asset } from 'expo-asset';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';

export default function RootLayout() {
  const [assetsReady, setAssetsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const logo = require('../assets/images/lunarialogo.png');
        await Asset.loadAsync([logo]);
      } finally {
        setAssetsReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (assetsReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [assetsReady]);

  if (!assetsReady) return null;
  return <Slot />;
}
