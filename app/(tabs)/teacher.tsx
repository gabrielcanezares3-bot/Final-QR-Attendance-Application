import AmbientBackground from '@/components/AmbientBackground';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import AppButton from '@/components/AppButton';
import { COLORS, RADIUS, SPACE } from '@/constants/colors';
import { useAuth } from '@/lib/auth';
import { createEvent } from '@/lib/events';
import { getProfile, type Role } from '@/lib/profiles';
import { buildQRPayload } from '@/lib/qr';

function toLocalISO(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:00`
  );
}

function formatDateTime(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  const month = date.toLocaleString('en-US', { month: 'short' });
  return `${month} ${pad(date.getDate())}, ${date.getFullYear()} at ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function toInputDateTimeValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

const QUICK_END_OPTIONS = [
  { label: '+30 min', ms: 30 * 60 * 1000 },
  { label: '+1 hour', ms: 60 * 60 * 1000 },
  { label: '+2 hours', ms: 2 * 60 * 60 * 1000 },
];

type EditTarget = 'start' | 'end';

export default function TeacherScreen() {
  const { user } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [eventId, setEventId] = useState('');
  const [startDate, setStartDate] = useState(() => new Date());
  const [endDate, setEndDate] = useState(
    () => new Date(Date.now() + 60 * 60 * 1000)
  );
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [editingPart, setEditingPart] = useState<'date' | 'time'>('date');
  const [payload, setPayload] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isAndroid = Platform.OS === 'android';

  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (!user) {
        setRoleLoading(false);
        return () => {
          active = false;
        };
      }
      getProfile(user.id).then((profile) => {
        if (!active) return;
        setRole(profile?.role ?? 'student');
        setRoleLoading(false);
      });
      return () => {
        active = false;
      };
    }, [user])
  );

  if (roleLoading) {
    return (
      <View style={styles.centerContainer}>
        <AmbientBackground />
        <View style={styles.centerCard}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.checkingText}>Checking your account...</Text>
        </View>
      </View>
    );
  }

  if (role !== 'teacher') {
    return (
      <View style={styles.centerContainer}>
        <AmbientBackground />
        <View style={styles.centerCard}>
          <View style={styles.lockIcon}>
            <Ionicons name="lock-closed-outline" size={24} color={COLORS.primarySoft} />
          </View>
          <Text style={styles.lockTitle}>Teachers Only</Text>
          <Text style={styles.lockSubtitle}>
            Only teacher accounts can create events.
          </Text>
        </View>
      </View>
    );
  }

  const openPicker = (target: EditTarget) => {
    setMessage(null);
    setEditTarget(target);
    setEditingPart('date');
  };

  const renderDateTimeField = (target: EditTarget) => {
    const value = target === 'start' ? startDate : endDate;
    const icon = target === 'start' ? 'sunny-outline' : 'moon-outline';
    const handleChange = (next: Date) => {
      setMessage(null);
      if (target === 'start') setStartDate(next);
      else setEndDate(next);
    };

    if (Platform.OS === 'web') {
      return <WebDateTimeField value={value} icon={icon} onChange={handleChange} />;
    }

    return (
      <PickerField
        value={formatDateTime(value)}
        icon={icon}
        onPress={() => openPicker(target)}
      />
    );
  };

  const onPickerChange = (
    event: DateTimePickerEvent,
    selected?: Date
  ) => {
    if (!editTarget) return;
    if (event.type === 'dismissed' || !selected) {
      setEditTarget(null);
      setEditingPart('date');
      return;
    }

    const current = editTarget === 'start' ? startDate : endDate;
    const next = new Date(current);
    next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
    next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);

    if (editTarget === 'start') setStartDate(next);
    else setEndDate(next);

    if (isAndroid && editingPart === 'date') {
      setEditingPart('time');
    } else {
      setEditTarget(null);
      setEditingPart('date');
    }
  };

  const handleQuickEnd = (ms: number) => {
    setMessage(null);
    setEndDate(new Date(startDate.getTime() + ms));
  };

  const handleCreateEvent = () => {
    const event = {
      eventId: eventId.trim(),
      title: title.trim(),
      start: toLocalISO(startDate),
      end: toLocalISO(endDate),
    };

    if (!event.eventId || !event.title) {
      setMessage('Event title and code are required.');
      return;
    }

    if (endDate.getTime() <= startDate.getTime()) {
      setMessage('End time must be after start time.');
      return;
    }

    createEvent(event).then(({ error }) => {
      if (error) {
        setMessage('Could not save the event. Please try again.');
        return;
      }
      setMessage('Event saved! Scan the QR with the Scan tab to test it.');
      setPayload(buildQRPayload(event));
    });
  };

  return (
    <View style={styles.screen}>
      <AmbientBackground />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Create Event QR</Text>
        <Text style={styles.subtitle}>
          Fill in the event details, then scan the generated QR with the Scan tab.
        </Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Event Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Founders Day Assembly"
            placeholderTextColor={COLORS.textSecondary}
          />

          <Text style={styles.label}>Event Code</Text>
          <TextInput
            style={styles.input}
            value={eventId}
            onChangeText={setEventId}
            placeholder="e.g. EVT-2026-0002"
            placeholderTextColor={COLORS.textSecondary}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Starts</Text>
          {renderDateTimeField('start')}

          <Text style={styles.label}>Ends</Text>
          {renderDateTimeField('end')}
          <View style={styles.chipRow}>
            {QUICK_END_OPTIONS.map((option) => (
              <Pressable
                key={option.label}
                accessibilityRole="button"
                style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
                onPress={() => handleQuickEnd(option.ms)}
              >
                <Text style={styles.chipText}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.hint}>Tap a chip to set the end time from start.</Text>

          {message && <Text style={styles.message}>{message}</Text>}

          <AppButton
            theme="primary"
            title="Create Event"
            icon="add-circle-outline"
            onPress={handleCreateEvent}
          />
        </View>

        {editTarget && Platform.OS !== 'web' && (
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={editTarget === 'start' ? startDate : endDate}
              mode={isAndroid ? editingPart : 'datetime'}
              display={isAndroid ? 'default' : 'spinner'}
              onChange={onPickerChange}
            />
          </View>
        )}

        {payload && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>
              Scan this QR code with the Scan tab:
            </Text>
            <View style={styles.qrBox}>
              <QRCode value={payload} size={200} />
            </View>
            <Text style={styles.payloadText}>{payload}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

type PickerFieldProps = {
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

function PickerField({ value, icon, onPress }: PickerFieldProps) {
  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [styles.pickerField, pressed && styles.pickerFieldPressed]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color={COLORS.primary} />
      <Text style={styles.pickerValue}>{value}</Text>
      <Ionicons name="calendar-outline" size={18} color={COLORS.textSecondary} />
    </Pressable>
  );
}

type WebDateTimeFieldProps = {
  value: Date;
  icon: keyof typeof Ionicons.glyphMap;
  onChange: (date: Date) => void;
};

function WebDateTimeField({ value, icon, onChange }: WebDateTimeFieldProps) {
  return (
    <View style={styles.pickerField}>
      <Ionicons name={icon} size={20} color={COLORS.primary} />
      <input
        type="datetime-local"
        aria-label="Event date and time"
        value={toInputDateTimeValue(value)}
        onChange={(event) => {
          const next = new Date(event.target.value);
          if (!Number.isNaN(next.getTime())) onChange(next);
        }}
        onClick={(event) => {
          try {
            event.currentTarget.showPicker();
          } catch {
            // Fall back to the browser's native datetime-local input behavior.
          }
        }}
        style={webInputStyle}
      />
    </View>
  );
}

const webInputStyle = {
  flex: 1,
  marginLeft: 10,
  marginRight: 10,
  fontSize: 15,
  fontWeight: 500,
  color: COLORS.textPrimary,
  background: 'transparent',
  border: 'none',
  outline: `2px solid ${COLORS.primarySoft}`,
  outlineOffset: 2,
  padding: 0,
  fontFamily: 'inherit',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACE.xl,
    overflow: 'hidden',
  },
  centerCard: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    padding: SPACE.xl,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  checkingText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    marginTop: SPACE.md,
  },
  lockIcon: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primaryTint,
    borderWidth: 1,
    borderColor: 'rgba(109,59,255,0.20)',
    marginBottom: SPACE.md,
  },
  lockTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginTop: SPACE.xs,
  },
  lockSubtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: SPACE.sm,
  },
  content: {
    paddingHorizontal: SPACE.lg,
    paddingTop: SPACE.lg,
    paddingBottom: SPACE.section,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  title: {
    fontSize: 27,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACE.xs,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACE.lg,
  },
  formCard: {
    padding: SPACE.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACE.xs,
    marginTop: SPACE.md,
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
  pickerField: {
    minHeight: 54,
    backgroundColor: COLORS.glassStrong,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickerFieldPressed: {
    backgroundColor: COLORS.primaryTint,
    borderColor: COLORS.primarySoft,
  },
  pickerValue: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginHorizontal: SPACE.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACE.sm,
  },
  chip: {
    minHeight: 44,
    backgroundColor: COLORS.glassStrong,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    paddingHorizontal: SPACE.md,
    paddingVertical: SPACE.sm,
    marginRight: SPACE.sm,
    marginBottom: SPACE.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipPressed: {
    backgroundColor: 'rgba(109,59,255,0.08)',
    borderColor: COLORS.accentSoft,
    transform: [{ scale: 0.98 }],
  },
  chipText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primarySoft,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: SPACE.xs,
    lineHeight: 18,
  },
  pickerContainer: {
    marginTop: SPACE.md,
    alignItems: 'center',
  },
  message: {
    fontSize: 14,
    color: COLORS.primarySoft,
    lineHeight: 20,
    marginTop: SPACE.md,
    marginBottom: SPACE.xs,
  },
  resultCard: {
    backgroundColor: COLORS.glassStrong,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(109,59,255,0.16)',
    padding: SPACE.lg,
    marginTop: SPACE.lg,
    alignItems: 'center',
    elevation: 3,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACE.md,
  },
  qrBox: {
    backgroundColor: '#FFFFFF',
    padding: SPACE.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACE.md,
  },
  payloadText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
  },
});
