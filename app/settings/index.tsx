// app/settings/index.tsx
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import SelectModal from '../../components/SelectModal';
import StarfieldBackground from '../../components/StarfieldBackground';

import { ASTROLOGY_SYSTEMS, HOUSE_SYSTEMS } from '../../lib/constants/astrology';
import { defaultSettings, loadSettings, saveSettings, updateSettings } from '../../lib/profile/settings';
import type { AstrologySystem, HouseSystem, Settings } from '../../lib/types/settings';

// Hide native header
export const options = { headerShown: false, title: 'Settings' };

export default function SettingsScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [state, setState] = useState<Settings>(defaultSettings);
  const [initialJSON, setInitialJSON] = useState<string>('');

  const [showSystem, setShowSystem] = useState(false);
  const [showHouse, setShowHouse] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await loadSettings();
      setState(s);
      setInitialJSON(JSON.stringify(s));
      setLoading(false);
    })();
  }, []);

  const dirty = useMemo(() => JSON.stringify(state) !== initialJSON, [state, initialJSON]);

  const onCancel = useCallback(() => {
    // history-aware cancel
    if ((router as any)?.canGoBack?.()) router.back();
    else router.replace('/');
  }, [router]);

  const onSave = useCallback(async () => {
    setSaving(true);
    await saveSettings(state);
    setInitialJSON(JSON.stringify(state));
    setSaving(false);
    router.replace('/'); // exit after save
  }, [state, router]);

  const handleSystemSelect = useCallback(
    async (label: string) => {
      const match = ASTROLOGY_SYSTEMS.find(o => o.label === label);
      if (!match) return;
      const value = match.value as AstrologySystem;

      const next = { ...state, astrology: { ...state.astrology, system: value } };
      setState(next);
      await updateSettings({
        astrology: {
          system: value,
          houseSystem: state.astrology.houseSystem,
        },
      });
       
      console.log('[LUNARIA][settings] system set', { value });
      setShowSystem(false);
    },
    [state]
  );

  const handleHouseSelect = useCallback(
    async (label: string) => {
      const match = HOUSE_SYSTEMS.find(o => o.label === label);
      if (!match) return;
      const value = match.value as HouseSystem;

      const next = { ...state, astrology: { ...state.astrology, houseSystem: value } };
      setState(next);
      await updateSettings({
        astrology: {
          system: state.astrology.system,
          houseSystem: value,
        },
      });
       
      console.log('[LUNARIA][settings] houseSystem set', { value });
      setShowHouse(false);
    },
    [state]
  );

  if (loading) {
    return (
      <View style={[styles.root, styles.center]}>
        <StarfieldBackground />
        <ActivityIndicator />
      </View>
    );
  }

  const currentSystemLabel =
    ASTROLOGY_SYSTEMS.find(o => o.value === state.astrology.system)?.label ?? 'Select';
  const currentHouseLabel =
    HOUSE_SYSTEMS.find(o => o.value === state.astrology.houseSystem)?.label ?? 'Select';

  return (
    <View style={styles.root}>
      <StarfieldBackground />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Top bar: Cancel (right-aligned) */}
        <View style={styles.topBar}>
          <Pressable onPress={onCancel} accessibilityRole="button">
            <Text style={styles.linkText}>Cancel</Text>
          </Pressable>
        </View>

        {/* Astrology (modal pickers) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Astrology</Text>

          {/* System row opens modal */}
          <Pressable
            accessibilityRole="button"
            style={styles.navRow}
            onPress={() => setShowSystem(true)}
          >
            <Text style={styles.rowLabel}>System</Text>
            <Text style={styles.valueText}>{currentSystemLabel}</Text>
          </Pressable>

          <View style={styles.divider} />

          {/* House System row opens modal */}
          <Pressable
            accessibilityRole="button"
            style={styles.navRow}
            onPress={() => setShowHouse(true)}
          >
            <Text style={styles.rowLabel}>House System</Text>
            <Text style={styles.valueText}>{currentHouseLabel}</Text>
          </Pressable>
        </View>

        {/* Notifications */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Notifications</Text>
          <Row
            label="Daily Core Reminder"
            value={state.notifications.dailyCoreReminder}
            onChange={(val) =>
              setState((s) => ({ ...s, notifications: { ...s.notifications, dailyCoreReminder: val } }))
            }
          />
        </View>

        {/* Save */}
        <Pressable
          onPress={onSave}
          disabled={!dirty || saving}
          accessibilityRole="button"
          style={[styles.saveBtn, (!dirty || saving) && styles.saveBtnDisabled]}
        >
          {saving ? <ActivityIndicator /> : <Text style={styles.saveText}>Save</Text>}
        </Pressable>
      </ScrollView>

      {/* System Modal */}
      <SelectModal
        // We defensively support different prop names without refactoring SelectModal
        {...({} as any)}
        title="Select Astrology System"
        visible={showSystem}
        onClose={() => setShowSystem(false)}
        items={ASTROLOGY_SYSTEMS.map(o => o.label)}
        value={currentSystemLabel}
        onSelect={(label: string) => handleSystemSelect(label)}
        onChange={(label: string) => handleSystemSelect(label)}
      />

      {/* House System Modal */}
      <SelectModal
        {...({} as any)}
        title="Select House System"
        visible={showHouse}
        onClose={() => setShowHouse(false)}
        items={HOUSE_SYSTEMS.map(o => o.label)}
        value={currentHouseLabel}
        onSelect={(label: string) => handleHouseSelect(label)}
        onChange={(label: string) => handleHouseSelect(label)}
      />
    </View>
  );
}

function Row({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b0f14' }, // starfield sits behind this
  container: { flex: 1 },
  content: { padding: 16, gap: 16 },
  center: { alignItems: 'center', justifyContent: 'center' },

  topBar: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
  linkText: { color: '#80d0ff', fontSize: 16 },

  card: { backgroundColor: '#121821', borderRadius: 12, padding: 16, gap: 12 },
  cardTitle: { color: 'white', fontSize: 16, fontWeight: '600' },

  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLabel: { color: 'white', fontSize: 15 },

  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  valueText: { color: '#b9c7d9', fontSize: 14 },

  divider: { height: 1, backgroundColor: '#1c2531', marginVertical: 4 },

  saveBtn: {
    backgroundColor: '#2d76ff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
