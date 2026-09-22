import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import AppButton from '@/components/AppButton';
import Header from '@/components/Header';
import AmbientBackground from '@/components/AmbientBackground';
import { COLORS, RADIUS, SPACE } from '@/constants/colors';

export default function Index() {
  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(entrance, { toValue: 1, tension: 55, friction: 9, useNativeDriver: true }).start();
  }, [entrance]);

  const translateY = entrance.interpolate({ inputRange: [0, 1], outputRange: [18, 0] });

  return (
    <SafeAreaView style={styles.container}>
      <AmbientBackground />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{ opacity: entrance, transform: [{ translateY }] }}
      >
        <View style={styles.content}>
          <Header title="Attendance Hub" />

          <View style={styles.heroHeading}>
            <View style={styles.heroCopy}>
              <Text style={styles.kicker}>WELCOME BACK</Text>
              <Text style={styles.mainTitle}>Attendance, made beautifully simple.</Text>
              <Text style={styles.subTitle}>Scan an event QR, keep your records organized, and stay ready for every class.</Text>
            </View>
            <View style={styles.heroOrb}>
              <View style={styles.heroOrbHighlight} />
              <Ionicons name="qr-code" size={36} color={COLORS.primary} />
            </View>
          </View>

          <View style={styles.statsRow}>
            <MiniStat icon="scan-outline" value="01" label="Fast scan" />
            <MiniStat icon="shield-checkmark-outline" value="24/7" label="Secure" />
            <MiniStat icon="sparkles-outline" value="Live" label="Ready" />
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
              <Text style={styles.sectionHint}>Everything you need is one tap away.</Text>
            </View>
            <View style={styles.sectionDot} />
          </View>

          <View style={styles.actions}>
            <AppButton theme="primary" title="Scan QR Code" icon="qr-code-outline" onPress={() => router.push('/scan')} />
            <AppButton title="Attendance History" icon="time-outline" onPress={() => router.push('/history')} />
            <AppButton title="Profile" icon="person-outline" onPress={() => router.push('/profile')} />
          </View>

          <View style={styles.tipCard}>
            <View style={styles.tipIcon}><Ionicons name="bulb-outline" size={20} color={COLORS.primary} /></View>
            <View style={styles.tipCopy}>
              <Text style={styles.tipTitle}>Quick tip</Text>
              <Text style={styles.tipText}>Keep your camera pointed at the QR until the scan is confirmed.</Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

function MiniStat({ icon, value, label }: { icon: keyof typeof Ionicons.glyphMap; value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}><Ionicons name={icon} size={17} color={COLORS.primary} /></View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingHorizontal: SPACE.lg, paddingBottom: SPACE.section },
  content: { width: '100%', maxWidth: 560, alignSelf: 'center' },
  heroHeading: { flexDirection: 'row', alignItems: 'center', marginTop: SPACE.xl, marginBottom: SPACE.lg },
  heroCopy: { flex: 1, paddingRight: SPACE.md },
  kicker: { fontSize: 10, fontWeight: '900', letterSpacing: 1.7, color: COLORS.primarySoft, marginBottom: SPACE.xs },
  mainTitle: { fontSize: 31, lineHeight: 35, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: -1 },
  subTitle: { fontSize: 13, lineHeight: 20, color: COLORS.textSecondary, marginTop: SPACE.sm, maxWidth: 350 },
  heroOrb: { width: 92, height: 92, borderRadius: 32, backgroundColor: COLORS.cardRaised, borderWidth: 1, borderColor: 'rgba(109,59,255,0.14)', alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.shadowDeep, shadowOpacity: 0.22, shadowRadius: 15, shadowOffset: { width: 0, height: 9 }, elevation: 5 },
  heroOrbHighlight: { position: 'absolute', top: 9, left: 16, width: 54, height: 12, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.85)' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: SPACE.xl },
  statCard: { flex: 1, minHeight: 92, padding: 12, borderRadius: RADIUS.md, backgroundColor: COLORS.cardRaised, borderWidth: 1, borderColor: COLORS.glassBorder, shadowColor: COLORS.shadow, shadowOpacity: 0.16, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 2 },
  statIcon: { width: 30, height: 30, borderRadius: 11, backgroundColor: COLORS.primaryTint, alignItems: 'center', justifyContent: 'center', marginBottom: 7 },
  statValue: { fontSize: 15, fontWeight: '900', color: COLORS.textPrimary },
  statLabel: { fontSize: 10, color: COLORS.textSecondary, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACE.md },
  sectionLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 1.4, color: COLORS.textPrimary },
  sectionHint: { fontSize: 12, color: COLORS.textSecondary, marginTop: 3 },
  sectionDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary, shadowColor: COLORS.primary, shadowOpacity: 0.28, shadowRadius: 8, elevation: 2 },
  actions: { width: '100%' },
  tipCard: { flexDirection: 'row', alignItems: 'center', padding: SPACE.md, marginTop: SPACE.sm, borderRadius: RADIUS.md, backgroundColor: 'rgba(255,255,255,0.62)', borderWidth: 1, borderColor: COLORS.glassBorder },
  tipIcon: { width: 38, height: 38, borderRadius: 13, backgroundColor: COLORS.primaryTint, alignItems: 'center', justifyContent: 'center', marginRight: SPACE.sm },
  tipCopy: { flex: 1 },
  tipTitle: { fontSize: 12, fontWeight: '900', color: COLORS.textPrimary },
  tipText: { fontSize: 11, lineHeight: 17, color: COLORS.textSecondary, marginTop: 2 },
});
