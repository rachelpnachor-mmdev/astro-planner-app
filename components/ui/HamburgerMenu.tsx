import { assignArchetypeProfile, loadArchetypeProfile } from "@/lib/profile/archetype";
import React, { useEffect } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useRouter } from 'expo-router';
const SHOW_DEV_MENU =
  (typeof __DEV__ !== "undefined" && __DEV__) ||
  (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_SHOW_DEV_MENU === "1");

const SAMPLE_SIGNS = { rising: "Aquarius", moon: "Cancer", mars: "Aquarius", venus: "Scorpio" };

async function devAssignSampleArchetype() {
  try {
    const profile = await assignArchetypeProfile(SAMPLE_SIGNS);
    const t = profile.tone_guidelines;
    Alert.alert(
      "Archetype saved",
      `${profile.archetype}\nA:${t.assertiveness.toFixed(2)}  W:${t.warmth.toFixed(2)}  S:${t.structure.toFixed(2)}  P:${t.playfulness.toFixed(2)}`
    );
   
  console.warn("[LUNARIA][triage] archetype profile saved", profile);
  } catch (err) {
    Alert.alert("Error", "Could not assign archetype profile.");
   
  console.warn("[LUNARIA][triage] assign archetype failed", err);
  }
}

async function devShowArchetype() {
  try {
    const profile = await loadArchetypeProfile();
    if (!profile) {
      Alert.alert("Archetype", "No archetype profile found.");
      return;
    }
    const t = profile.tone_guidelines;
    Alert.alert(
      "Archetype",
      `${profile.archetype}\nA:${t.assertiveness.toFixed(2)}  W:${t.warmth.toFixed(2)}  S:${t.structure.toFixed(2)}  P:${t.playfulness.toFixed(2)}`
    );
   
  console.warn("[LUNARIA][triage] archetype profile loaded", profile);
  } catch (err) {
    Alert.alert("Error", "Could not load archetype profile.");
   
  console.warn("[LUNARIA][triage] load archetype failed", err);
  }
}

export default function HamburgerMenu() {
  const router = useRouter();
  useEffect(() => {
   
  console.warn("[LUNARIA][triage] HamburgerMenu mounted", { __DEV__, SHOW_DEV_MENU });
  }, []);
  return (
    <View style={{ padding: 16 }}>
      {/* ...existing menu items... */}
      <Pressable style={{ paddingVertical: 12 }} onPress={() => {/* navigate to profile */}}>
        <Text style={{ fontSize: 16 }}>Profile</Text>
      </Pressable>
      <Pressable style={{ paddingVertical: 12 }} onPress={() => router.push('/settings' as any)}>
        <Text>Settings</Text>
      </Pressable>
      {/* DEV-only actions */}
      {SHOW_DEV_MENU && (
        <>
          <Pressable style={{ paddingVertical: 12 }} onPress={devAssignSampleArchetype}>
            <Text style={{ fontSize: 16 }}>Dev: Assign Archetype (Sample)</Text>
          </Pressable>
          <Pressable style={{ paddingVertical: 12 }} onPress={devShowArchetype}>
            <Text style={{ fontSize: 16 }}>Dev: Show Archetype</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}
