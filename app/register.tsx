import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AmbientBackground from '@/components/AmbientBackground';
import AppButton from '@/components/AppButton';
import Header from '@/components/Header';
import { COLORS, RADIUS, SPACE } from '@/constants/colors';
import { signUp } from '@/lib/auth';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();

  const [fullName, setFullName] = useState('');
  const [role, setRole] =
    useState<'student' | 'teacher'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);

    if (
      !fullName.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters.'
      );
      return;
    }

    setLoading(true);

    try {
      const { data, error: authError } = await signUp(
        email.trim(),
        password,
        {
          full_name: fullName.trim(),
          role,
        }
      );

      if (authError) {
        setError(authError.message);
      } else if (data.session) {
        // Email confirmation disabled or already confirmed - session exists
      } else {
        // Email confirmation enabled - no session yet
        setSuccess(true);
      }
    } catch (err) {
      setError(
        'An unexpected error occurred. Please try again.'
      );
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Register to start recording attendance
            </Text>

            {success ? (
              <View style={styles.successContainer}>
                <Text style={styles.successTitle}>
                  Check your email!
                </Text>

                <Text style={styles.successText}>
                  We sent a confirmation link to {email}.
                  Click the link to verify your account,
                  then come back and sign in.
                </Text>

                <Link href="/login" style={styles.link}>
                  Back to Sign In
                </Link>
              </View>
            ) : (
              <View style={styles.form}>
                <Text style={styles.label}>
                  Full Name
                </Text>

                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your full name"
                  placeholderTextColor={
                    COLORS.textSecondary
                  }
                  editable={!loading}
                />

                <Text style={styles.label}>
                  I am a...
                </Text>

                <View style={styles.roleRow}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: role === 'student' }}
                    style={[
                      styles.roleChip,
                      role === 'student' &&
                        styles.roleChipActive,
                    ]}
                    onPress={() => setRole('student')}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.roleChipText,
                        role === 'student' &&
                          styles.roleChipTextActive,
                      ]}
                    >
                      Student
                    </Text>
                  </Pressable>

                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected: role === 'teacher' }}
                    style={[
                      styles.roleChip,
                      styles.roleChipLast,
                      role === 'teacher' &&
                        styles.roleChipActive,
                    ]}
                    onPress={() => setRole('teacher')}
                    disabled={loading}
                  >
                    <Text
                      style={[
                        styles.roleChipText,
                        role === 'teacher' &&
                          styles.roleChipTextActive,
                      ]}
                    >
                      Teacher
                    </Text>
                  </Pressable>
                </View>

                <Text style={styles.label}>
                  Email
                </Text>

                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your.email@school.edu"
                  placeholderTextColor={
                    COLORS.textSecondary
                  }
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />

                <Text style={styles.label}>
                  Password
                </Text>

                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
                  placeholderTextColor={
                    COLORS.textSecondary
                  }
                  secureTextEntry
                  editable={!loading}
                />

                <Text style={styles.label}>
                  Confirm Password
                </Text>

                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-enter your password"
                  placeholderTextColor={
                    COLORS.textSecondary
                  }
                  secureTextEntry
                  editable={!loading}
                />

                {error && (
                  <View style={styles.errorBox}>
                    <Text style={styles.error}>
                      {error}
                    </Text>
                  </View>
                )}

                {loading ? (
                  <View style={styles.loader}>
                    <ActivityIndicator
                      size="small"
                      color={COLORS.primary}
                    />
                  </View>
                ) : (
                  <AppButton
                    theme="primary"
                    title="Sign Up"
                    icon="person-add-outline"
                    onPress={handleRegister}
                  />
                )}
              </View>
            )}
          </View>

          {!success && (
            <Link href="/login" style={styles.link}>
              Already have an account? Sign In
            </Link>
          )}
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
    marginBottom: SPACE.md,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    gap: SPACE.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
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
  roleRow: {
    flexDirection: 'row',
    marginTop: SPACE.xs,
  },
  roleChip: {
    flex: 1,
    minHeight: 50,
    backgroundColor: COLORS.glassStrong,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACE.sm,
  },
  roleChipLast: {
    marginRight: 0,
  },
  roleChipActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryTint,
  },
  roleChipText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  roleChipTextActive: {
    color: COLORS.primarySoft,
    fontWeight: '800',
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
    marginTop: SPACE.md,
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
  successContainer: {
    padding: SPACE.md,
    backgroundColor: COLORS.glassStrong,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: RADIUS.md,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACE.sm,
    textAlign: 'center',
  },
  successText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: SPACE.sm,
  },
});
