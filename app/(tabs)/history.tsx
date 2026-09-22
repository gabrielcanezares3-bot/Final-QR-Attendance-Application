import AmbientBackground from '@/components/AmbientBackground';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import { COLORS, RADIUS, SPACE } from '@/constants/colors';
import { useAuth } from '@/lib/auth';
import {
  getAttendanceHistory,
  getTeacherEventAttendance,
  type AttendanceRecord,
  type TeacherEventAttendance,
} from '@/lib/attendance';
import { getProfile, type Role } from '@/lib/profiles';

export default function HistoryScreen() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Role | null>(null);
  const [studentRecords, setStudentRecords] = useState<AttendanceRecord[]>([]);
  const [teacherEvents, setTeacherEvents] = useState<TeacherEventAttendance[]>([]);

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const profile = await getProfile(user.id);
    const currentRole = profile?.role ?? 'student';
    setRole(currentRole);

    if (currentRole === 'teacher') {
      const events = await getTeacherEventAttendance(user.id);
      setTeacherEvents(events);
      setStudentRecords([]);
    } else {
      const records = await getAttendanceHistory(user.id);
      setStudentRecords(records);
      setTeacherEvents([]);
    }

    setLoading(false);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <AmbientBackground />
        <View style={styles.loadingState}>
          <ActivityIndicator size="small" color={COLORS.primary} />
          <Text style={styles.subtitle}>Loading records...</Text>
        </View>
      </View>
    );
  }

  if (role === 'teacher') {
    return (
      <View style={styles.container}>
        <AmbientBackground />
        <View style={styles.content}>
          <Text style={styles.title}>Attendance History</Text>

          {teacherEvents.length === 0 ? (
            <EmptyState>
              No events yet. Create an event from the Teacher tab.
            </EmptyState>
          ) : (
            <FlatList
              data={teacherEvents}
              keyExtractor={(item) => item.eventId}
              contentContainerStyle={styles.list}
              style={styles.listFrame}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventTitle}>{item.title}</Text>
                    <View style={styles.countBadge}>
                      <Text style={styles.countText}>{item.attendeeCount}</Text>
                    </View>
                  </View>

                  <Text style={styles.eventMeta}>{item.eventCode}</Text>

                  {item.startTime && (
                    <Text style={styles.eventMeta}>{formatDate(item.startTime)}</Text>
                  )}

                  {item.attendees.length === 0 ? (
                    <Text style={styles.attendeeEmpty}>No attendees yet.</Text>
                  ) : (
                    <View style={styles.attendeeList}>
                      {item.attendees.map((attendee) => (
                        <View key={attendee.studentId} style={styles.attendeeRow}>
                          <Text style={styles.attendeeName}>
                            {attendee.studentName || shortId(attendee.studentId)}
                          </Text>
                          <Text style={styles.eventMeta}>
                            {formatDate(attendee.scannedAt)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            />
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AmbientBackground />
      <View style={styles.content}>
        <Text style={styles.title}>Attendance History</Text>

        {studentRecords.length === 0 ? (
          <EmptyState>
            No records yet. Scan a QR code to register your attendance.
          </EmptyState>
        ) : (
          <FlatList
            data={studentRecords}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            style={styles.listFrame}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.eventTitle}>{item.eventTitle}</Text>
                <Text style={styles.eventMeta}>{item.eventId}</Text>
                <Text style={styles.eventMeta}>{formatDate(item.scannedAt)}</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return 'Date unavailable';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return date.toLocaleString();
}

function shortId(value: string | null | undefined): string {
  if (!value) {
    return 'Unknown student';
  }

  if (value.length <= 12) {
    return value;
  }

  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function EmptyState({ children }: { children: string }) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIcon}>
        <Text style={styles.emptyIconText}>—</Text>
      </View>
      <Text style={styles.emptyText}>{children}</Text>
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
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACE.xl,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginTop: SPACE.sm,
  },
  listFrame: {
    flex: 1,
  },
  list: {
    paddingBottom: SPACE.xl,
  },
  card: {
    backgroundColor: COLORS.glassStrong,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    padding: SPACE.lg,
    marginBottom: SPACE.md,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACE.xs,
    flex: 1,
  },
  eventMeta: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },
  countBadge: {
    backgroundColor: 'rgba(109,59,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(109,59,255,0.16)',
    paddingHorizontal: SPACE.sm,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: RADIUS.pill,
    marginLeft: SPACE.sm,
  },
  countText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.accentSoft,
  },
  attendeeList: {
    marginTop: SPACE.md,
  },
  attendeeRow: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(151,204,255,0.10)',
    paddingVertical: SPACE.sm,
  },
  attendeeName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  attendeeEmpty: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: SPACE.md,
  },
  emptyState: {
    padding: SPACE.xl,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.glass,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    alignItems: 'center',
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primaryTint,
    borderWidth: 1,
    borderColor: 'rgba(109,59,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACE.md,
  },
  emptyIconText: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primarySoft,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});