import { buildDailyCapsule } from '../lib/ai/capsule/daily';
// dev/assistantProbe.ts

import { Alert, Platform, ToastAndroid } from 'react-native';
import { saveArchetypeProfile } from '../lib/ai/archetype/archetype';
import { chatReply } from '../lib/ai/assistant/chat';
import { prepareAssistantMessages } from '../lib/ai/assistant/runtime';
import { clearAllMemory, exportAllMemory, retrieveMemory, saveMemory } from '../lib/ai/memory';
import { summarizeWeekly } from '../lib/ai/memory/summarize';
import { runSyncPush } from '../lib/ai/sync/engine';
import { loadSyncState, resetSyncState } from '../lib/ai/sync/state';
export async function capsuleDryRun() {
  try {
    const cap = await buildDailyCapsule();
    console.log('[Daily Capsule]', cap);
    if (!cap.bullets.length) throw new Error('No bullets');
    // toast helper already exists
    // @ts-ignore
    toast('✅ Daily Capsule PASS');
  } catch (e) {
    console.log('[Daily Capsule] FAIL', e);
    // @ts-ignore
    toast('❌ Daily Capsule FAIL — see logs');
  }
}
export async function chatDryRun() {
  try {
    const res = await chatReply('What did I put in my protection jar? One quick suggestion for the door.');
    console.log('[AI Chat] reply:', res.reply);
    console.log('[AI Chat] meta:', res.meta);
    if (!res.reply) throw new Error('Empty reply');
    toast('✅ Chat adapter PASS');
  } catch (e) {
    console.log('[AI Chat] FAIL', e);
    toast('❌ Chat adapter FAIL — see logs');
  }
}

function toast(msg: string) {
  if (Platform.OS === 'android') ToastAndroid.show(msg, ToastAndroid.SHORT);
  else Alert.alert(msg);
}

function assert(cond: any, msg: string) {
  if (!cond) throw new Error(msg);
}

export async function runAssistantSmoke() {
  try {
    // archetype save
    const profile = await saveArchetypeProfile({
      rising: 'Aquarius', moon: 'Cancer', mars: 'Aquarius', venus: 'Scorpio',
    });
    assert(!!profile?.archetype, 'Archetype not saved');

    // seed memory
    await saveMemory({ topic: 'rituals', content: 'Protection jar with bay + salt on 2025-09-12.' });
    await saveMemory({ topic: 'inventory', content: 'Added orange selenite to keep stones self-charged.' });
    await saveMemory({ topic: 'family', content: 'Bedtime crystal set updated.' });
    await saveMemory({ topic: 'work', content: 'Scoped assistant runtime glue milestone.' });

    // retrieve & prepare
    const hits = await retrieveMemory({ query: 'protection jar', limit: 5 });
    assert(hits.length >= 1, 'No memory hits for "protection jar"');

    const prep = await prepareAssistantMessages('Remind me what I put in my protection jar and suggest a door ritual.');
    assert(prep.meta.hits >= 1, 'Prepared context has no hits');
    assert(prep.system.includes('"') || prep.system.length > 0, 'System directive missing');
    assert(prep.context.length > 0, 'Context block missing');

    console.log('[AI Probe] PASS', { hits: hits.length, meta: prep.meta });
    toast('✅ AI smoke test PASS');
  } catch (e) {
    console.log('[AI Probe] FAIL', e);
    toast('❌ AI smoke test FAIL — see logs');
  }
}

export async function exportAssistantMemory() {
  try {
    const dump = await exportAllMemory();
    console.log('[AI Export] Topic index:', dump.topicIndex);
    const total = Object.values(dump.byTopic).reduce((n, arr) => n + arr.length, 0);
    assert(total >= 1, 'No entries to export');
    toast(`✅ Export PASS (${total} entries)`);
  } catch (e) {
    console.log('[AI Export] FAIL', e);
    toast('❌ Export FAIL — see logs');
  }
}

export async function clearAssistantMemory() {
  try {
    await clearAllMemory();
    toast('✅ Cleared all memory');
  } catch (e) {
    console.log('[AI Clear] FAIL', e);
    toast('❌ Clear FAIL — see logs');
  }
}

export async function summarizeRitualsWeek() {
  try {
    const entries = await retrieveMemory({ topics: ['rituals'], limit: 50 });
    const path = await summarizeWeekly('rituals', entries);
    console.log('[AI Summary] rituals ->', path);
    toast('✅ Summary written (rituals)');
  } catch (e) {
    console.log('[AI Summary] FAIL', e);
    toast('❌ Summary FAIL — see logs');
  }
}

export async function syncPushStub() {
  try {
    const res = await runSyncPush();
    console.log('[SYNC PUSH]', res);
    if (res.skipped) {
      toast('ℹ️ Sync: nothing to push');
      return;
    }
    if (!res.ok) throw new Error(res.error || 'Push failed');
    toast(`✅ Sync push OK (${res.topicsPushed.reduce((n,t)=>n+t.count,0)} items)`);
  } catch (e) {
    console.log('[SYNC PUSH] FAIL', e);
    toast('❌ Sync push FAIL — see logs');
  }
}

export async function syncShowState() {
  const st = await loadSyncState();
  console.log('[SYNC STATE]', st);
  toast('ℹ️ Sync state logged');
}

export async function syncResetState() {
  await resetSyncState();
  toast('🧹 Sync state reset');
}
