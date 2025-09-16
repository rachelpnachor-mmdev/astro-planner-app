import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import SelectModal from '../../components/SelectModal';
import StarfieldBackground from '../../components/StarfieldBackground';
import { getCurrentUser } from '../../lib/authSession';
import { PLACES } from '../../lib/constants/places';
import { TIMEZONES } from '../../lib/constants/timezones';
import {
  clearBirthProfile,
  defaultTimezone,
  isValidISODate,
  isValidTime,
  loadBirthProfile,
  saveBirthProfile,
} from '../../lib/profile/birth';
import type { BirthProfile } from '../../lib/types/profile';
import { findUserByEmail, setBirthProfileForUser } from '../../lib/userStore';

// ---- Lunaria dark theme palette (matches sign-in) ----
const Colors = {
  bg: '#0B1220',
  card: '#141C2F',
  border: '#2A3447',
  text: '#E6EDF3',
  sub: '#8B96A8',
  white: '#FFFFFF',
  blackOnWhite: '#0B1220',
  danger: '#FF5C5C',
  focus: '#6AA9FF',
};

// ---- Styles (define BEFORE component so S is always in scope) ----
const S = StyleSheet.create({
  root: { flex: 1, position: 'relative', backgroundColor: Colors.bg },
  scroll: { backgroundColor: 'transparent' },
  container: { padding: 16, paddingTop: 28, gap: 14, backgroundColor: 'transparent' },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  toolbar: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 4, marginBottom: 6 },
  cancelLink: { color: Colors.text, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 6 },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  labelText: { fontWeight: '600', marginBottom: 6, color: Colors.text, letterSpacing: 0.2 },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 16,
    backgroundColor: Colors.card,
    color: Colors.text,
  },
  invalid: { borderColor: Colors.danger },
  helpText: { color: Colors.sub, fontSize: 12, marginTop: 6 },
  primaryBtn: {
    backgroundColor: Colors.white,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: Colors.blackOnWhite, fontWeight: '700', fontSize: 16 },
  dangerBtn: {
    paddingVertical: 12,
    borderRadius: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  dangerBtnText: { color: Colors.danger, fontWeight: '700', fontSize: 16 },
  notice: { marginTop: 8, fontSize: 12 },
});

// ---- Small helpers ----
function parseDateISO(s: string) {
  const d = new Date((s || '2000-01-01') + 'T00:00:00');
  return isNaN(+d) ? new Date('2000-01-01T00:00:00') : d;
}
function fmtDateISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function fmtTime24(d: Date) {
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${min}`;
}

export default function BirthFormScreen() {
  const router = useRouter();

  // state
  const [fullName, setFullName] = useState('');
  const [dateISO, setDateISO] = useState('');
  const [timeUnknown, setTimeUnknown] = useState(false);
  const [time24, setTime24] = useState<string>('');
  const [timezone, setTimezone] = useState(defaultTimezone());
  const [locationText, setLocationText] = useState('');
  const [loading, setLoading] = useState(true);
  const [dirty, setDirty] = useState(false);

  // pickers/modals
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [iosDateDraft, setIosDateDraft] = useState<Date | null>(null);
  const [iosTimeDraft, setIosTimeDraft] = useState<Date | null>(null);
  const [tzModal, setTzModal] = useState(false);
  const [placeModal, setPlaceModal] = useState(false);

  // Intentional one-time load on mount.
   
  useEffect(() => {
    (async () => {
      try {
        // 1) Try account-scoped data in userStore
        const session = await getCurrentUser();
        if (session?.email) {
          const u = await findUserByEmail(session.email);
          const b = u?.profile?.birth as BirthProfile | undefined;
          if (b) {
            setFullName(b.fullName ?? '');
            setDateISO(b.dateISO ?? '');
            setTimeUnknown(!!b.timeUnknown);
            setTime24(b.time24 ?? '');
            setTimezone(b.timezone ?? defaultTimezone());
            setLocationText(b.locationText ?? '');
            return;
          }
        }
        // 2) Fallback to local device file
        const existing = await loadBirthProfile();
        if (existing) {
          setFullName(existing.fullName ?? '');
          setDateISO(existing.dateISO ?? '');
          setTimeUnknown(!!existing.timeUnknown);
          setTime24(existing.time24 ?? '');
          setTimezone(existing.timezone ?? defaultTimezone());
          setLocationText(existing.locationText ?? '');
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // computed validity + missing fields
  const valid =
    fullName.trim().length >= 2 &&
    isValidISODate(dateISO.trim()) &&
    (timeUnknown || isValidTime((time24 || '').trim() || '00:00')) &&
    !!timezone &&
    locationText.trim().length >= 2;

  const missing: string[] = [];
  if (fullName.trim().length < 2) missing.push('Full name');
  if (!isValidISODate(dateISO.trim())) missing.push('Birth date');
  if (!timeUnknown && !isValidTime((time24 || '').trim())) missing.push('Birth time');
  if (!timezone.trim()) missing.push('Timezone');
  if (locationText.trim().length < 2) missing.push('Birthplace');

  // Cancel flow — allow exit without saving (confirm if dirty)
  const onCancel = useCallback(() => {
    if (!dirty) {
      router.back();
      return;
    }
    Alert.alert('Discard changes?', 'You have unsaved edits. Leave without saving?', [
      { text: 'Keep editing', style: 'cancel' },
      { text: 'Discard', style: 'destructive', onPress: () => router.back() },
    ]);
  }, [dirty, router]);

  // Android hardware back: confirm when dirty
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!dirty) return false; // use default behavior
      onCancel();
      return true; // handled
    });
    return () => sub.remove();
  }, [dirty, onCancel]);

  // save handler
  async function onSave() {
    try {
      // Also save alternate keys for chart compatibility
      const birthDate = dateISO.trim().slice(0, 10);
      const birthTime = timeUnknown ? '' : (time24.trim() || '00:00');
      const place = locationText.trim();
      const payload: Omit<BirthProfile, 'createdAt' | 'updatedAt'> & {
        birthDate?: string;
        birthTime?: string;
        place?: string;
      } = {
        fullName: fullName.trim(),
        dateISO: dateISO.trim(),
        time24: timeUnknown ? null : time24.trim(),
        timeUnknown,
        timezone: timezone.trim() || defaultTimezone(),
        locationText: locationText.trim(),
        birthDate,
        birthTime,
        place,
      };

      // Save to local profile file
      await saveBirthProfile(payload);

      // Also persist on the current user in userStore
      const session = await getCurrentUser();
      if (session?.email) {
        const now = Date.now();
        const forUser: BirthProfile = { ...payload, createdAt: now, updatedAt: now };
        await setBirthProfileForUser(session.email, forUser);
      }

      Alert.alert('Saved', 'Birth profile saved locally.');
      setDirty(false);
    } catch {
      Alert.alert('Error', 'Could not save birth profile.');
    }
  }

  // clear handler (device-only)
  async function onClear() {
    Alert.alert('Clear profile?', 'This will remove saved birth data on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await clearBirthProfile();
          Alert.alert('Cleared');
        },
      },
    ]);
  }

  if (loading) return null;

  return (
    <KeyboardAvoidingWrapper>
      <View style={S.root}>
        <StarfieldBackground />
        <ScrollView contentContainerStyle={S.container} style={S.scroll}>
          <View style={S.toolbar}>
            <Pressable onPress={onCancel} hitSlop={12}>
              <Text style={S.cancelLink}>Cancel</Text>
            </Pressable>
          </View>

          <Text style={S.title}>Birth Profile</Text>

          <Card>
            <Label>Full name</Label>
            <ThemedInput
              value={fullName}
              onChangeText={(t: string) => {
                setFullName(t);
                setDirty(true);
              }}
              placeholder="e.g., Luna Rivera"
              autoCapitalize="words"
              invalid={fullName.trim().length < 2}
            />
          </Card>

          <Card>
            <Label>Birth date</Label>
            <Pressable
              onPress={() => {
                if (Platform.OS === 'ios') setIosDateDraft(parseDateISO(dateISO));
                setShowDate(true);
              }}
              style={S.input}
            >
              <Text style={{ color: dateISO ? Colors.text : Colors.sub }}>{dateISO || 'Pick a date'}</Text>
            </Pressable>
            {showDate && (
              <>
                <DateTimePicker
                  value={Platform.OS === 'ios' ? iosDateDraft ?? parseDateISO(dateISO) : parseDateISO(dateISO)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(e: any, d?: Date) => {
                    if (Platform.OS === 'android') {
                      const type = e?.type; // 'set' | 'dismissed'
                      setShowDate(false);
                      if (type === 'set' && d) {
                        setDateISO(fmtDateISO(d));
                        setDirty(true);
                      }
                    } else {
                      if (d) setIosDateDraft(d); // update draft only
                    }
                  }}
                />
                {Platform.OS === 'ios' && (
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                    <Pressable onPress={() => { setShowDate(false); setIosDateDraft(null); }}>
                      <Text style={{ color: Colors.sub, fontWeight: '600' }}>Cancel</Text>
                    </Pressable>
                    <Pressable onPress={() => {
                      if (iosDateDraft) { setDateISO(fmtDateISO(iosDateDraft)); setDirty(true); }
                      setShowDate(false); setIosDateDraft(null);
                    }}>
                      <Text style={{ color: Colors.text, fontWeight: '700' }}>Done</Text>
                    </Pressable>
                  </View>
                )}
              </>
            )}
          </Card>

          <Card style={S.rowBetween}>
            <Text style={S.labelText}>Birth time known?</Text>
            <Switch
              value={!timeUnknown}
              onValueChange={(v) => {
                setTimeUnknown(!v);
                setDirty(true);
              }}
              trackColor={{ false: '#444C5E', true: '#3B82F6' }}
              thumbColor={timeUnknown ? '#9AA4B2' : '#E6EDF3'}
            />
          </Card>

          {!timeUnknown && (
            <Card>
              <Label>Birth time</Label>
              <Pressable
                onPress={() => {
                  if (Platform.OS === 'ios') {
                    const base = time24 ? new Date(`2000-01-01T${time24}:00`) : new Date(`2000-01-01T12:00:00`);
                    setIosTimeDraft(base);
                  }
                  setShowTime(true);
                }}
                style={S.input}
              >
                <Text style={{ color: time24 ? Colors.text : Colors.sub }}>{time24 || 'Pick a time'}</Text>
              </Pressable>
              {showTime && (
                <>
                  <DateTimePicker
                    value={
                      Platform.OS === 'ios'
                        ? iosTimeDraft ?? new Date(`2000-01-01T${(time24 || '12:00')}:00`)
                        : new Date(`2000-01-01T${(time24 || '12:00')}:00`)
                    }
                    mode="time"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    is24Hour
                    onChange={(e: any, d?: Date) => {
                      if (Platform.OS === 'android') {
                        const type = e?.type; // 'set' | 'dismissed'
                        setShowTime(false);
                        if (type === 'set' && d) {
                          setTime24(fmtTime24(d));
                          setDirty(true);
                        }
                      } else {
                        if (d) setIosTimeDraft(d); // update draft only
                      }
                    }}
                  />
                  {Platform.OS === 'ios' && (
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                      <Pressable onPress={() => { setShowTime(false); setIosTimeDraft(null); }}>
                        <Text style={{ color: Colors.sub, fontWeight: '600' }}>Cancel</Text>
                      </Pressable>
                      <Pressable onPress={() => {
                        if (iosTimeDraft) { setTime24(fmtTime24(iosTimeDraft)); setDirty(true); }
                        setShowTime(false); setIosTimeDraft(null);
                      }}>
                        <Text style={{ color: Colors.text, fontWeight: '700' }}>Done</Text>
                      </Pressable>
                    </View>
                  )}
                </>
              )}
            </Card>
          )}

          <Card>
            <Label>Timezone (IANA)</Label>
            <Pressable onPress={() => setTzModal(true)} style={S.input}>
              <Text style={{ color: timezone ? Colors.text : Colors.sub }}>{timezone || 'Select timezone'}</Text>
            </Pressable>
            <Text style={S.helpText}>Defaulted to device timezone; you can override.</Text>
            <SelectModal
              visible={tzModal}
              title="Select timezone"
              items={TIMEZONES}
              onClose={() => setTzModal(false)}
              onSelect={(val) => { setTimezone(val); setDirty(true); }}
            />
          </Card>

          <Card>
            <Label>Birthplace (City, Region, Country)</Label>
            <Pressable onPress={() => setPlaceModal(true)} style={S.input}>
              <Text style={{ color: locationText ? Colors.text : Colors.sub }}>
                {locationText || 'Search & select birthplace'}
              </Text>
            </Pressable>
            <SelectModal
              visible={placeModal}
              title="Select birthplace"
              items={PLACES}
              onClose={() => setPlaceModal(false)}
              onSelect={(val) => { setLocationText(val); setDirty(true); }}
            />
          </Card>

          <View style={{ height: 10 }} />

          <PrimaryButton onPress={onSave} disabled={!valid} title="Save" />
          <View style={{ height: 6 }} />
          <DangerButton onPress={onClear} title="Clear (this device)" />

          {!valid && (
            <Text style={[S.notice, { color: Colors.danger }]}>Please fix: {missing.join(', ')}.</Text>
          )}
          {dirty && <Text style={[S.notice, { color: Colors.sub }]}>Unsaved changes</Text>}
        </ScrollView>
      </View>
    </KeyboardAvoidingWrapper>
  );
}

// ---- Themed primitives ----
function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[S.card, style]}>{children}</View>;
}
function Label({ children }: { children: string }) {
  return <Text style={S.labelText}>{children}</Text>;
}
function ThemedInput(props: any) {
  const { invalid, style, ...rest } = props;
  return (
    <TextInput
      {...rest}
      style={[S.input, invalid && S.invalid, style]}
      placeholderTextColor={Colors.sub}
      selectionColor={Colors.focus}
    />
  );
}
function PrimaryButton({
  title,
  onPress,
  disabled,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[S.primaryBtn, disabled && S.primaryBtnDisabled]}>
      <Text style={S.primaryBtnText}>{title}</Text>
    </Pressable>
  );
}
function DangerButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={S.dangerBtn}>
      <Text style={S.dangerBtnText}>{title}</Text>
    </Pressable>
  );
}
function KeyboardAvoidingWrapper({ children }: { children: React.ReactNode }) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={{ flex: 1, backgroundColor: Colors.bg }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
