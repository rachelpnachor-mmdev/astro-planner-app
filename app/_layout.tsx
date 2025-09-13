import { Asset } from 'expo-asset';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { DevSettings } from 'react-native';

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

  // Dev Menu wiring for AI assistant probe
  useEffect(() => {
    if (!__DEV__) return;
    (async () => {
      const mod = await import('../dev/assistantProbe');
      DevSettings.addMenuItem('AI ▶ Seed + Prep (smoke test)', async () => {
        try { await mod.runAssistantSmoke(); } catch (e) { console.log('[AI Probe] Error', e); }
      });
      DevSettings.addMenuItem('AI ▶ Export (log counts)', async () => {
        try { await mod.exportAssistantMemory(); } catch (e) { console.log('[AI Export] Error', e); }
      });
      DevSettings.addMenuItem('AI ▶ Clear ALL memory', async () => {
        try { await mod.clearAssistantMemory(); } catch (e) { console.log('[AI Clear] Error', e); }
      });
      DevSettings.addMenuItem('AI ▶ Weekly Summary (rituals)', async () => {
        try { await mod.summarizeRitualsWeek(); } catch (e) { console.log('[AI Summary] Error', e); }
      });
      DevSettings.addMenuItem('AI ▶ Chat dry-run', async () => {
        try { await mod.chatDryRun(); } catch (e) { console.log('[AI Chat] Error', e); }
      });
      DevSettings.addMenuItem('AI ▶ Provider check + chat', async () => {
  console.log('[AI Provider] active:', process.env.EXPO_PUBLIC_AI_PROVIDER ?? 'mock');
  const probe = await import('../dev/assistantProbe');
  await probe.chatDryRun();
      });
      DevSettings.addMenuItem('AI ▶ Daily Core Capsule', async () => {
        const mod = await import('../dev/assistantProbe');
        await mod.capsuleDryRun();
      });
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
