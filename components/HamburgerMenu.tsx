import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { assignArchetypeProfile, loadArchetypeProfile } from "@/lib/profile/archetype";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { clearCurrentUser } from '../lib/authSession';

export default function HamburgerMenu({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const SHOW_DEV_MENU =
    (typeof __DEV__ !== "undefined" && __DEV__) ||
    (typeof process !== "undefined" && process.env?.EXPO_PUBLIC_SHOW_DEV_MENU === "1");

  const SAMPLE_SIGNS = { rising: "Aquarius", moon: "Cancer", mars: "Aquarius", venus: "Scorpio" };

  async function devAssignSampleArchetype() {
    try {
      const profile = await assignArchetypeProfile(SAMPLE_SIGNS);
      const t = profile.tone_guidelines;
      alert(
        `Archetype saved\n${profile.archetype}\nA:${t.assertiveness.toFixed(2)}  W:${t.warmth.toFixed(2)}  S:${t.structure.toFixed(2)}  P:${t.playfulness.toFixed(2)}`
      );
      console.warn("[LUNARIA][triage] archetype profile saved", profile);
    } catch (err) {
      alert("Error: Could not assign archetype profile.");
      console.warn("[LUNARIA][triage] assign archetype failed", err);
    }
  }

  async function devShowArchetype() {
    try {
      const profile = await loadArchetypeProfile();
      if (!profile) {
        alert("Archetype: No archetype profile found.");
        return;
      }
      const t = profile.tone_guidelines;
      alert(
        `Archetype\n${profile.archetype}\nA:${t.assertiveness.toFixed(2)}  W:${t.warmth.toFixed(2)}  S:${t.structure.toFixed(2)}  P:${t.playfulness.toFixed(2)}`
      );
      console.warn("[LUNARIA][triage] archetype profile loaded", profile);
    } catch (err) {
      alert("Error: Could not load archetype profile.");
      console.warn("[LUNARIA][triage] load archetype failed", err);
    }
  }
  const router = useRouter();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={styles.menu}
          accessibilityRole="menu"
          accessibilityLabel="Main menu"
        >
          <Text style={styles.title} accessibilityRole="header" accessibilityLabel="Menu">Menu</Text>
          <TouchableOpacity
            style={styles.item}
            accessibilityRole="menuitem"
            accessibilityLabel="Profile"
            onPress={() => {
              onClose();
              router.push({ pathname: '/profile' });
            }}
          >
            <Text style={styles.itemText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            accessibilityRole="menuitem"
            accessibilityLabel="Settings"
            onPress={() => {
              onClose();
              router.push('/settings' as any);
            }}
          >
            <Text style={styles.itemText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} accessibilityRole="menuitem" accessibilityLabel="Your Package">
            <Text style={styles.itemText}>Your Package</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} accessibilityRole="menuitem" accessibilityLabel="Upgrade">
            <Text style={styles.itemText}>Upgrade</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            accessibilityRole="menuitem"
            accessibilityLabel="Export to PDF"
            onPress={() => {
              onClose();
              router.push('/pdf-export');
            }}
          >
            <Text style={styles.itemText}>Export to PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.item, { marginTop: 24 }]}
            accessibilityLabel="Sign out"
            accessibilityRole="menuitem"
            onPress={async () => {
              onClose();
              await clearCurrentUser();
              router.replace('/sign-in');
            }}
          >
            <Text style={[styles.itemText, { color: '#EF4444', fontWeight: '600' }]}>Sign out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            accessibilityLabel="Close menu"
            accessibilityRole="button"
          >
            <Feather name="x" size={24} color="#222" accessibilityLabel="Close icon" accessibilityRole="image" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
  },
  menu: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    padding: 24,
    paddingTop: 40,
    minHeight: 220,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#222',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});
