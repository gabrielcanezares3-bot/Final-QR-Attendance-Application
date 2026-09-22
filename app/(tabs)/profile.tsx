import AmbientBackground from '@/components/AmbientBackground';
import { useFocusEffect } from 'expo-router';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import AppButton from '@/components/AppButton';
import { COLORS, RADIUS, SPACE } from '@/constants/colors';
import { useAuth, signOut } from '@/lib/auth';
import { getProfile, updateProfile, type Profile } from '@/lib/profiles';

export default function ProfileScreen() {
  const { user, session } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [draftName, setDraftName] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace('/login');
    }
  }, [session]);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    const p = await getProfile(user.id);
    setProfile(p);
    setDraftName(p?.full_name ?? '');
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleSaveName = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await updateProfile(user.id, { full_name: draftName.trim() });
    setSaving(false);
    if (error) {
      Alert.alert('Error', error);
    } else {
      setProfile((prev) => (prev ? { ...prev, full_name: draftName.trim() } : prev));
      setEditing(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to sign out.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AmbientBackground />
      <View style={styles.content}>
        <Text style={styles.title}>My Profile</Text>

        {!profile ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.subtitle}>Loading profile...</Text>
          </View>
        ) : (
          <View style={styles.infoCard}>
            <View style={styles.profileIntro}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {(profile.full_name || profile.email || '?').slice(0, 1).toUpperCase()}
                </Text>
              </View>
              <View style={styles.profileIntroCopy}>
                <Text style={styles.profileIntroTitle}>
                  {profile.full_name || 'Your profile'}
                </Text>
                <Text style={styles.profileIntroSubtitle}>{profile.email}</Text>
              </View>
            </View>

            <View style={styles.badgeRow}>
              {profile.role === 'teacher' ? (
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>Teacher</Text>
                </View>
              ) : (
                <View style={[styles.roleBadge, styles.roleBadgeStudent]}>
                  <Text style={styles.roleBadgeStudentText}>Student</Text>
                </View>
              )}
            </View>

            <Text style={styles.label}>Name</Text>
            {editing ? (
              <View style={styles.nameEditRow}>
                <TextInput
                  style={styles.input}
                  value={draftName}
                  onChangeText={setDraftName}
                  placeholder="Your name"
                  placeholderTextColor={COLORS.textSecondary}
                  autoFocus
                />
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Save name"
                  style={({ pressed }) => [styles.saveButton, pressed && styles.pressed]}
                  onPress={handleSaveName}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={COLORS.textOnPrimary} />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </Pressable>
              </View>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit name"
                onPress={() => setEditing(true)}
                style={({ pressed }) => [styles.nameRow, pressed && styles.pressed]}
              >
                <Text style={styles.value}>
                  {profile.full_name || 'Tap to add your name'}
                </Text>
                <Text style={styles.editHint}>Edit</Text>
              </Pressable>
            )}

            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{profile.email}</Text>

            <Text style={styles.label}>User ID</Text>
            <Text style={styles.valueSmall}>{profile.id}</Text>
          </View>
        )}

        <View style={styles.signOutSection}>
          <AppButton
            title="Sign Out"
            icon="log-out-outline"
            onPress={handleSignOut}
            disabled={loading}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACE.lg,
    paddingTop: SPACE.lg,
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACE.lg,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginTop: SPACE.sm,
  },
  loadingState: {
    alignItems: 'center',
    paddingVertical: SPACE.xl,
  },
  infoCard: {
    padding: SPACE.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.glassStrong,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    elevation: 3,
  },
  profileIntro: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACE.md,
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E1D4FF',
    borderWidth: 1,
    borderColor: 'rgba(109,59,255,0.18)',
    marginRight: SPACE.md,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  profileIntroCopy: {
    flex: 1,
  },
  profileIntroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 3,
  },
  profileIntroSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  badgeRow: {
    alignItems: 'flex-start',
    marginBottom: SPACE.md,
  },
  roleBadge: {
    backgroundColor: 'rgba(234,168,255,0.20)',
    borderWidth: 1,
    borderColor: 'rgba(234,168,255,0.35)',
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.md,
    minHeight: 32,
    justifyContent: 'center',
  },
  roleBadgeStudent: {
    backgroundColor: 'rgba(109,59,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(109,59,255,0.16)',
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  roleBadgeStudentText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.accentSoft,
  },
  label: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSecondary,
    marginBottom: SPACE.xs,
    marginTop: SPACE.md,
    letterSpacing: 0.2,
  },
  value: {
    fontSize: 16,
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  valueSmall: {
    fontSize: 11,
    color: COLORS.textSecondary,
    lineHeight: 16,
  },
  nameRow: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.glass,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
  },
  editHint: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primarySoft,
    paddingLeft: SPACE.md,
  },
  nameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    minHeight: 50,
    backgroundColor: COLORS.glass,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primarySoft,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  saveButton: {
    marginLeft: SPACE.sm,
    backgroundColor: '#E5DDFF',
    borderWidth: 1,
    borderColor: 'rgba(109,59,255,0.18)',
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACE.md,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 72,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
    opacity: 0.9,
  },
  signOutSection: {
    marginTop: SPACE.lg,
  },
});
