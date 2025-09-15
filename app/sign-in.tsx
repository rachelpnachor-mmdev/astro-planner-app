import { router, Stack } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Image,
    Keyboard,
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
import { setCurrentUser } from '../lib/authSession';
import { addUser, findUserByEmail, getAllUsers, resetUsers } from '../lib/userStore';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1220',
  },
  card: {
    backgroundColor: '#141C2B',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderColor: 'rgba(213,219,232,0.25)',
    borderWidth: 1,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: 'transparent',
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D5DBE8',
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
  errorText: {
    color: '#EF4444',
    marginTop: 6,
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
});

type Errors = { email?: string; password?: string; form?: string };

export default function SignInScreen() {
  useEffect(() => {
    (async () => {
      try {
        const users = await getAllUsers();
        if (__DEV__) console.log('[SIGNIN] mount users count=', users.length, users);
      } catch (e) {
        if (__DEV__) console.log('[SIGNIN] mount users read failed', e);
      }
    })();
  }, []);
  const { height } = useWindowDimensions();
  const LunariaLogo = require('../assets/images/lunarialogo.png');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setSubmitting] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const isValidEmail = (v: string): boolean => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
  const isValidPassword = (pw: string): boolean => pw.trim().length >= 6;
  const reduceMotion = false;
  const stars = useMemo(
    () =>
      Array.from({ length: 24 }).map(() => ({
        top: Math.floor(Math.random() * Math.max(480, height)),
        left: Math.floor(Math.random() * 420),
        size: 1 + Math.floor(Math.random() * 2),
        delay: Math.floor(Math.random() * 4000),
        duration: 2000 + Math.floor(Math.random() * 2000),
      })),
    [height]
  );
  const opacities = useMemo(() => stars.map(() => new Animated.Value(Math.random())), [stars]);
  useEffect(() => {
    let loops: Animated.CompositeAnimation[] = [];
    if (!reduceMotion) {
      loops = opacities.map((v, i) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(v, {
              toValue: 1,
              duration: stars[i].duration,
              delay: stars[i].delay,
              useNativeDriver: true,
            }),
            Animated.timing(v, {
              toValue: 0.3,
              duration: stars[i].duration,
              useNativeDriver: true,
            }),
          ])
        )
      );
      loops.forEach((loop) => loop.start());
    }
    return () => {
      loops.forEach((loop) => loop.stop && loop.stop());
    };
  }, [opacities, reduceMotion, stars]);

  const handleSubmit = async (): Promise<void> => {
    Keyboard.dismiss();
    setSubmitting(true);
  let newErrors: Errors = {};
  if (!isValidEmail(email)) newErrors.email = 'Please enter a valid email address.';
  if (!isValidPassword(password)) newErrors.password = 'Password must be at least 6 characters.';
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setSubmitting(false);
      return;
    }
    if (isSignUp) {
      const existing = await findUserByEmail(email);
      if (existing) {
        setErrors({ form: 'An account already exists for this email. Try signing in.' });
        setSubmitting(false);
        return;
      }
      await addUser(email, password);
      setErrors({ form: 'Account created! You can sign in now.' });
      setIsSignUp(false);
      setPassword('');
      setTimeout(() => {
        (passwordRef?.current as any)?.focus?.();
      }, 0);
      setSubmitting(false);
      return;
    }
    const user = await findUserByEmail(email);
    if (!user) {
      setErrors({ form: 'No account found for this email. Please sign up.' });
      setSubmitting(false);
      return;
    }
    if (user.password !== password) {
      setErrors({ form: 'Incorrect password. Try again or reset your password.' });
      setSubmitting(false);
      return;
    }
    setErrors({});
    await setCurrentUser(email);
    router.replace('/(tabs)');
    return;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#0B1220' }]}> 
        {stars.map((s, i) => {
          const style = {
            position: 'absolute' as const,
            top: s.top,
            left: s.left,
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
              style={[styles.input, emailFocused && styles.inputFocused]}
              placeholder="Email"
              placeholderTextColor="#D5DBE8"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (errors.email || errors.form)
                  setErrors((prev) => ({ ...prev, email: undefined, form: undefined }));
              }}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={() => {
                (passwordRef.current as any)?.focus?.();
              }}
              testID="signin-email"
            />
            {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            <View style={{ height: 16 }} />
            <TextInput
              ref={passwordRef}
              style={[styles.input, passwordFocused && styles.inputFocused]}
              placeholder="Password"
              placeholderTextColor="#D5DBE8"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                if (errors.password || errors.form)
                  setErrors((prev) => ({ ...prev, password: undefined, form: undefined }));
              }}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              secureTextEntry
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={handleSubmit}
              testID="signin-password"
            />
            {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            <View style={{ height: 16 }} />
            <TouchableOpacity
              style={styles.primaryButton}
              accessibilityLabel={isSignUp ? "Sign up button" : "Sign in button"}
              onPress={handleSubmit}
              disabled={isSubmitting}
              testID="signin-primary"
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                {isSubmitting ? <ActivityIndicator /> : (
                  <Text style={styles.primaryButtonText}>{isSignUp ? 'Sign up' : 'Sign in'}</Text>
                )}
              </View>
            </TouchableOpacity>
            {!!errors.form && <Text style={[styles.errorText, { textAlign: 'center', marginTop: 8 }]}>{errors.form}</Text>}
            <View style={{ height: 12 }} />
            <TouchableOpacity style={styles.socialButton} accessibilityLabel="Continue with Apple" onPress={() => {}}>
              <Text style={styles.socialIcon}></Text>
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
            <View style={{ height: 12 }} />
            <TouchableOpacity style={styles.socialButton} accessibilityLabel="Continue with Google" onPress={() => {}}>
              <Image
                source={require('../assets/images/favicon.png')}
                style={styles.googleIcon}
                accessibilityLabel="Google icon"
              />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            <View style={{ height: 16 }} />
            <TouchableOpacity accessibilityLabel="Forgot password" onPress={() => {}} activeOpacity={0.7}>
              <Text style={styles.linkForgot}>Forgot password?</Text>
            </TouchableOpacity>
            <View style={{ height: 8 }} />
            {/* Updated sign up link handler for input persistence and focus */}
            <TouchableOpacity
              accessibilityLabel="Sign up"
              onPress={() => {
                setErrors({});
                setIsSignUp(true);
                setPassword('');
                if (!email.trim()) {
                  // @ts-expect-error runtime exists
                  (emailRef?.current as any)?.focus?.();
                } else {
                  (passwordRef?.current as any)?.focus?.();
                }
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.linkSignup}>Don’t have an account? Sign up</Text>
            </TouchableOpacity>
            {__DEV__ && (
              <View style={{ marginTop: 12 }}>
                <TouchableOpacity onPress={async () => {
                  const users = await getAllUsers();
                  console.log('[SIGNIN] users now:', users);
                  setErrors({ form: `Users in storage: ${users.length}` });
                }}>
                  <Text style={[styles.linkForgot, { textAlign: 'center' }]}>DEV: Dump users</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => {
                  await resetUsers();
                  console.log('[SIGNIN] storage cleared');
                  setErrors({ form: 'DEV: User store cleared.' });
                }}>
                  <Text style={[styles.linkForgot, { textAlign: 'center', marginTop: 6 }]}>DEV: Clear users</Text>
                </TouchableOpacity>
              </View>
            )}
            {isSignUp && (
              <TouchableOpacity accessibilityLabel="Back to Sign in"
                onPress={() => { setErrors({}); setIsSignUp(false); }} activeOpacity={0.7}>
                <Text style={[styles.linkForgot, { textAlign: 'center', marginTop: 8 }]}>Have an account? Sign in</Text>
              </TouchableOpacity>
            )}
            {__DEV__ && (
              <View style={{ marginTop: 12, gap: 8 }}>
                <TouchableOpacity onPress={async () => {
                  const users = await getAllUsers();
                  console.log('[SIGNIN] users in storage:', users);
                  setErrors({ form: `Users in storage: ${users.length}` });
                }}>
                  <Text style={[styles.linkForgot, { textAlign: 'center' }]}>DEV: Dump users to console</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => {
                  await resetUsers();
                  console.log('[SIGNIN] storage cleared');
                  setErrors({ form: 'DEV: User store cleared.' });
                }}>
                  <Text style={[styles.linkForgot, { textAlign: 'center' }]}>DEV: Clear user store</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
// ...existing code...
