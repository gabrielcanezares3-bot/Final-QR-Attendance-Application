import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AmbientBackground from '@/components/AmbientBackground';
import AppButton from '@/components/AppButton';
import Header from '@/components/Header';
import { COLORS, RADIUS, SPACE } from '@/constants/colors';
import { signIn, useAuth } from '@/lib/auth';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace('/(tabs)');
    }
  }, [session]);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const { error: authError } = await signIn(email.trim(), password);

      if (authError) {
        setError(authError.message);
      }
    } catch (err: any) {
      setError(err?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <AmbientBackground variant="compact" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Header title="QR Attendance" />
          </View>

          <View style={styles.formCard}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to record your attendance</Text>

            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your.email@school.edu"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry
                editable={!loading}
              />

              {error && (
                <View style={styles.errorBox}>
                  <Text style={styles.error}>{error}</Text>
                </View>
              )}

              {loading ? (
                <View style={styles.loader}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
              ) : (
                <AppButton
                  theme="primary"
                  title="Sign In"
                  icon="log-in-outline"
                  onPress={handleLogin}
                />
              )}
            </View>
          </View>

          <Link href="/register" style={styles.link}>
            Don't have an account? Sign Up
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACE.lg,
    paddingBottom: SPACE.lg,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: SPACE.sm,
    marginBottom: SPACE.lg,
  },
  formCard: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    padding: SPACE.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    elevation: 4,
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACE.xs,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACE.lg,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACE.xs,
    marginTop: SPACE.sm,
    letterSpacing: 0.2,
  },
  input: {
    minHeight: 54,
    backgroundColor: COLORS.glassStrong,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    paddingHorizontal: SPACE.md,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  errorBox: {
    marginTop: SPACE.md,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.sm,
    backgroundColor: 'rgba(232,93,125,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(232,93,125,0.20)',
  },
  error: {
    fontSize: 13,
    color: COLORS.danger,
    lineHeight: 19,
  },
  loader: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACE.lg,
  },
  link: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    fontSize: 14,
    color: COLORS.primarySoft,
    textAlign: 'center',
    fontWeight: '800',
    marginTop: SPACE.lg,
    paddingVertical: SPACE.sm,
  },
});
