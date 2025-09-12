import { Stack } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    AccessibilityInfo,
    Animated,
    Easing,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LunariaLogo from '../assets/images/lunarialogo.png';

export default function SignInScreen() {
  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const { width, height } = useWindowDimensions();
  const isShort = height < 700;
  const logoSize   = clamp(height * 0.18, 112, 160); // ~18% of screen, 112–160px
  const logoTop    = clamp(height * 0.04, 12, 28);   // 12–28px
  const logoBottom = clamp(height * 0.03, 12, 24);   // 12–24px
  const stars = useMemo(() => Array.from({ length: 28 }).map((_, i) => ({
    left: Math.random() * width,
    top: Math.random() * height,
    size: 1 + Math.round(Math.random() * 2),
    delay: Math.round(Math.random() * 4000),
    duration: 2000 + Math.round(Math.random() * 2000),
  })), [width, height]);
  const opacities = useRef(stars.map(() => new Animated.Value(Math.random()))).current;
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const loops = opacities.map((v, idx) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(v, { toValue: 1, duration: stars[idx].duration, easing: Easing.inOut(Easing.quad), useNativeDriver: true, delay: stars[idx].delay }),
          Animated.timing(v, { toValue: 0.25, duration: stars[idx].duration, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        ])
      )
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [reduceMotion, opacities, stars]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      {/* Animated starfield background */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#0B1220' }]}> 
        {stars.map((s, i) => {
          const style = {
            position: 'absolute' as const,
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            borderRadius: s.size / 2,
            backgroundColor: 'rgba(213,219,232,0.9)',
            opacity: reduceMotion ? 0.6 : opacities[i],
          };
          return <Animated.View key={i} style={style} />;
        })}
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            minHeight: height,
            justifyContent: 'center',
            paddingHorizontal: 24,
            paddingBottom: 32,
          }}
        >
          <View style={{ alignItems: 'center', marginTop: -45, marginBottom: 30 }}>
            <Image
              source={LunariaLogo}
              style={{ width: 214, height: 214, resizeMode: 'contain' }}
              accessibilityLabel="Lunaria logo"
            />
          </View>
          <View style={[styles.card, { marginTop: -50 }]}>
            <TextInput
              style={[
                styles.input,
                emailFocused && styles.inputFocused,
              ]}
              placeholder="Email"
              placeholderTextColor="#D5DBE8"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="emailAddress"
              accessibilityLabel="Email input"
              returnKeyType="next"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <View style={{ height: 16 }} />
            <TextInput
              ref={passwordRef}
              style={[
                styles.input,
                passwordFocused && styles.inputFocused,
              ]}
              placeholder="Password"
              placeholderTextColor="#D5DBE8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="password"
              autoCapitalize="none"
              accessibilityLabel="Password input"
              returnKeyType="go"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              onSubmitEditing={() => {}}
            />
            <View style={{ height: 16 }} />
            <TouchableOpacity
              style={styles.primaryButton}
              accessibilityLabel="Sign in button"
              onPress={() => {}}
            >
              <Text style={styles.primaryButtonText}>Sign in</Text>
            </TouchableOpacity>
            <View style={{ height: 12 }} />
            <TouchableOpacity
              style={styles.socialButton}
              accessibilityLabel="Continue with Apple"
              onPress={() => {}}
            >
              <Text style={styles.socialIcon}></Text>
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
            <View style={{ height: 12 }} />
            <TouchableOpacity
              style={styles.socialButton}
              accessibilityLabel="Continue with Google"
              onPress={() => {}}
            >
              <Image
                source={require('../assets/images/favicon.png')}
                style={styles.googleIcon}
                accessibilityLabel="Google icon"
              />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            <View style={{ height: 16 }} />
            <TouchableOpacity
              accessibilityLabel="Forgot password"
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <Text style={styles.linkForgot}>Forgot password?</Text>
            </TouchableOpacity>
            <View style={{ height: 8 }} />
            <TouchableOpacity
              accessibilityLabel="Sign up"
              onPress={() => {}}
              activeOpacity={0.7}
            >
              <Text style={styles.linkSignup}>Don’t have an account? Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1220',
    paddingBottom: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 32,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  crescent: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D5DBE8',
    marginBottom: 8,
    shadowColor: '#fff',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  wordmark: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  card: {
    backgroundColor: '#141C2B',
    borderRadius: 24,
    padding: 24,
    maxWidth: 360,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  input: {
    height: 52,
    width: '100%',
    backgroundColor: '#141C2B',
    borderRadius: 16,
    paddingHorizontal: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(213,219,232,0.25)',
    fontSize: 16,
  },
  inputFocused: {
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  primaryButton: {
    height: 52,
    width: '100%',
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#0B1220',
    fontWeight: '600',
    fontSize: 16,
  },
  socialButton: {
    height: 52,
    width: '100%',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D5DBE8',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  socialIcon: {
    fontSize: 20,
    marginRight: 12,
    color: '#D5DBE8',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
    resizeMode: 'contain',
  },
  socialButtonText: {
    color: '#D5DBE8',
    fontWeight: '600',
    fontSize: 16,
  },
  linkForgot: {
    color: '#D5DBE8',
    fontSize: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  linkSignup: {
    color: '#3B82F6',
    fontSize: 15,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  stars: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
    backgroundColor: 'transparent',
    borderStyle: 'dotted',
    borderColor: '#D5DBE8',
    borderWidth: 0.5,
    opacity: 0.08,
  },
});
