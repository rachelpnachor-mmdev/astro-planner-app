// app/profile/birth.tsx
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
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
import StarfieldBackground from '../../components/StarfieldBackground';
import {
    clearBirthProfile,
    defaultTimezone,
    isValidISODate,
    isValidTime,
    loadBirthProfile,
    saveBirthProfile,
    type BirthProfile,
} from '../../lib/profile/birth';

// ---- Lunaria dark theme palette (matches sign-in) ----
const Colors = {
  bg: '#0B1220',        // page background
  card: '#141C2F',      // card/input background
  border: '#2A3447',    // outlines
  text: '#E6EDF3',      // primary text
  sub: '#8B96A8',       // helper/placeholder
  white: '#FFFFFF',     // primary button fill
  blackOnWhite: '#0B1220', // primary button text
  danger: '#FF5C5C',    // destructive
  focus: '#6AA9FF',     // caret/selection tint
};

// ---- Styles (define BEFORE component so S is always in scope) ----
const S = StyleSheet.create({
  root: { flex: 1, position: 'relative', backgroundColor: Colors.bg },
  scroll: { backgroundColor: 'transparent' },
  container: { padding: 16, gap: 14, backgroundColor: 'transparent' },
  title: { fontSize: 22, fontWeight: '700', color: Colors.text, marginBottom: 4 },
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

  // load existing profile (if any)
  useEffect(() => {
    (async () => {
      const existing = await loadBirthProfile();
      if (existing) {
        setFullName(existing.fullName);
        setDateISO(existing.dateISO);
        setTimeUnknown(!!existing.timeUnknown);
        setTime24(existing.time24 ?? '');
        setTimezone(existing.timezone || defaultTimezone());
        setLocationText(existing.locationText || '');
      }
      setLoading(false);
    })();
  }, []);

  // computed validity
  const valid =
    fullName.trim().length >= 2 &&
    isValidISODate(dateISO.trim()) &&
    (timeUnknown || isValidTime((time24 || '').trim() || '00:00')) &&
    !!timezone &&
    locationText.trim().length >= 2;

  // save handler
  async function onSave() {
    try {
      const payload: Omit<BirthProfile, 'createdAt' | 'updatedAt'> = {
        fullName: fullName.trim(),
        dateISO: dateISO.trim(),
        time24: timeUnknown ? null : time24.trim(),
        timeUnknown,
        timezone: timezone.trim() || defaultTimezone(),
        locationText: locationText.trim(),
      };
      await saveBirthProfile(payload);
      Alert.alert('Saved', 'Birth profile saved locally.');
      setDirty(false);
    } catch {
      Alert.alert('Error', 'Could not save birth profile.');
    }
  }

  // clear handler
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
            />
          </Card>

          <Card>
            <Label>Birth date (YYYY-MM-DD)</Label>
            <ThemedInput
              value={dateISO}
              onChangeText={(t: string) => {
                setDateISO(t);
                setDirty(true);
              }}
              placeholder="1992-08-17"
              keyboardType="numbers-and-punctuation"
              autoCorrect={false}
              invalid={!!dateISO && !isValidISODate(dateISO)}
            />
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
              <Label>Birth time (24h HH:mm)</Label>
              <ThemedInput
                value={time24}
                onChangeText={(t: string) => {
                  setTime24(t);
                  setDirty(true);
                }}
                placeholder="14:35"
                keyboardType="numbers-and-punctuation"
                autoCorrect={false}
                invalid={!!time24 && !isValidTime(time24)}
              />
            </Card>
          )}

          <Card>
            <Label>Timezone (IANA)</Label>
            <ThemedInput
              value={timezone}
              onChangeText={(t: string) => {
                setTimezone(t);
                setDirty(true);
              }}
              placeholder="America/Denver"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={S.helpText}>Defaulted to device timezone; you can override.</Text>
          </Card>

          <Card>
            <Label>Birthplace (City, Region, Country)</Label>
            <ThemedInput
              value={locationText}
              onChangeText={(t: string) => {
                setLocationText(t);
                setDirty(true);
              }}
              placeholder="Boulder, CO, USA"
              autoCapitalize="words"
            />
          </Card>

          <View style={{ height: 10 }} />

          <PrimaryButton onPress={onSave} disabled={!valid} title="Save" />
          <View style={{ height: 6 }} />
          <DangerButton onPress={onClear} title="Clear (this device)" />

          {!valid && (
            <Text style={[S.notice, { color: Colors.danger }]}>
              Please enter a valid date (YYYY-MM-DD) and, if time is known, a valid 24h time (HH:mm).
            </Text>
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
