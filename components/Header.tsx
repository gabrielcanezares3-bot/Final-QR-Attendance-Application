import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACE } from '@/constants/colors';

export default function Header({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <View style={styles.logoShell}>
        <View style={styles.logoHighlight} />
        <View style={styles.logoCore}>
          <Image source={require('@/assets/images/icon.png')} style={styles.logo} contentFit="contain" />
        </View>
        <View style={styles.statusDot} />
      </View>
      <View style={styles.titleBlock}>
        <Text style={styles.kicker}>QR ATTENDANCE</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.livePill}><View style={styles.liveDot} /><Text style={styles.liveText}>LIVE</Text></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%', flexDirection: 'row', alignItems: 'center', paddingVertical: SPACE.sm },
  logoShell: {
    width: 60, height: 60, borderRadius: 20, backgroundColor: COLORS.cardRaised,
    borderWidth: 1, borderColor: 'rgba(109,59,255,0.12)', alignItems: 'center', justifyContent: 'center',
    marginRight: SPACE.md, shadowColor: COLORS.shadowDeep, shadowOpacity: 0.18, shadowRadius: 13,
    shadowOffset: { width: 0, height: 7 }, elevation: 4,
  },
  logoHighlight: { position: 'absolute', width: 34, height: 10, borderRadius: 8, top: 7, left: 13, backgroundColor: 'rgba(255,255,255,0.72)' },
  logoCore: { width: 46, height: 46, borderRadius: 15, backgroundColor: COLORS.primaryTint, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  logo: { width: 36, height: 36 },
  statusDot: { position: 'absolute', width: 10, height: 10, borderRadius: RADIUS.pill, right: -2, bottom: -1, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.background },
  titleBlock: { flex: 1 },
  kicker: { fontSize: 9, fontWeight: '900', letterSpacing: 1.7, color: COLORS.primarySoft, marginBottom: 2 },
  title: { fontSize: 22, fontWeight: '900', color: COLORS.textPrimary, letterSpacing: -0.4 },
  livePill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, paddingVertical: 7, borderRadius: RADIUS.pill, backgroundColor: COLORS.cardRaised, borderWidth: 1, borderColor: COLORS.glassBorder },
  liveDot: { width: 6, height: 6, borderRadius: 6, backgroundColor: COLORS.success, marginRight: 5 },
  liveText: { fontSize: 8, fontWeight: '900', letterSpacing: 1, color: COLORS.textSecondary },
});
