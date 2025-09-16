// app/settings/index.tsx
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import StarfieldBackground from '../../components/StarfieldBackground';
import { defaultSettings, loadSettings, saveSettings } from '../../lib/profile/settings';
import type { AstrologySystem, HouseSystem, Settings } from '../../lib/types/settings';

// Hide native header for this screen.
export const options = { headerShown: false, title: 'Settings' };

const ASTROLOGY_OPTIONS: { label: string; value: AstrologySystem }[] = [
  { label: 'Western', value: 'western' },
  { label: 'Vedic', value: 'vedic' },
];

const HOUSE_OPTIONS: { label: string; value: HouseSystem }[] = [
  { label: 'Whole Sign', value: 'whole_sign' },
  { label: 'Placidus', value: 'placidus' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState<Settings>(defaultSettings);
  const [initialJSON, setInitialJSON] = useState<string>('');

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
    // @ts-expect-error expo-router may expose canGoBack
    if ((router as any)?.canGoBack?.()) router.back();
    else router.replace('/');
  }, [router]);

  const onSave = useCallback(async () => {
    setSaving(true);
    await saveSettings(state);
    setInitialJSON(JSON.stringify(state));
    setSaving(false);
    router.replace('/'); // close after save
  }, [state, router]);

  if (loading) {
    return (
      <View style={[styles.root, styles.center]}>
        <StarfieldBackground />
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StarfieldBackground />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* In-body Cancel (top right) */}
      <View style={styles.topBar}>
        <Pressable onPress={onCancel} accessibilityRole="button">
          <Text style={styles.linkText}>Cancel</Text>
        </Pressable>
      </View>

        {/* Features */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Features</Text>
          <Row
            label="Daily Core"
            value={state.features.dailyCore}
            onChange={(val) => setState((s) => ({ ...s, features: { ...s.features, dailyCore: val } }))}
          />
          <Row
            label="AI Assistant"
            value={state.features.aiAssistant}
            onChange={(val) => setState((s) => ({ ...s, features: { ...s.features, aiAssistant: val } }))}
          />
        </View>

        {/* Astrology */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Astrology</Text>

          <RadioGroup<AstrologySystem>
            title="System"
            value={state.astrology.system}
            options={ASTROLOGY_OPTIONS}
            onSelect={(v) => setState((s) => ({ ...s, astrology: { ...s.astrology, system: v } }))}
          />

          <View style={styles.divider} />

          <RadioGroup<HouseSystem>
            title="House System"
            value={state.astrology.houseSystem}
            options={HOUSE_OPTIONS}
            onSelect={(v) => setState((s) => ({ ...s, astrology: { ...s.astrology, houseSystem: v } }))}
          />
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

function RadioGroup<T extends string>({
  title,
  value,
  options,
  onSelect,
}: {
  title: string;
  value: T;
  options: { label: string; value: T }[];
  onSelect: (v: T) => void;
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={styles.rowLabel}>{title}</Text>
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={[styles.option, selected && styles.optionSelected]}
            accessibilityRole="button"
          >
            <Text style={styles.optionText}>{opt.label}</Text>
            {selected ? <Text style={styles.check}>✓</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b0f14' }, // starfield sits behind this
  container: { flex: 1 },
  content: { padding: 16, gap: 16 },
  center: { alignItems: 'center', justifyContent: 'center' },
  linkText: { color: '#80d0ff', fontSize: 16 },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8 },
  card: { backgroundColor: '#121821', borderRadius: 12, padding: 16, gap: 12 },
  cardTitle: { color: 'white', fontSize: 16, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLabel: { color: 'white', fontSize: 15 },
  option: {
    backgroundColor: '#0f1520',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    borderWidth: 2,
    borderColor: '#2d76ff',
    backgroundColor: '#162033',
  },
  optionText: { color: 'white', fontSize: 16, fontWeight: '500' },
  check: { color: '#2d76ff', fontSize: 18, fontWeight: '700', marginLeft: 8 },
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
