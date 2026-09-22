import { useAuth } from '@/lib/auth';
import { registerAttendance } from '@/lib/attendance';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppButton from '@/components/AppButton';
import AmbientBackground from '@/components/AmbientBackground';
import { COLORS, RADIUS, SPACE } from '@/constants/colors';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [lastData, setLastData] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  if (!permission) {
    return (
      <View style={styles.container}>
        <AmbientBackground variant="compact" />
        <View style={styles.permissionCard}>
          <View style={styles.permissionIcon}>
            <Text style={styles.permissionIconText}>QR</Text>
          </View>
          <Text style={styles.title}>Preparing your scanner</Text>
          <Text style={styles.subtitle}>Getting the camera ready...</Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <AmbientBackground variant="compact" />
        <View style={styles.permissionCard}>
          <View style={styles.permissionIcon}>
            <Text style={styles.permissionIconText}>QR</Text>
          </View>
          <Text style={styles.title}>Camera Permission Needed</Text>
          <Text style={styles.subtitle}>
            We need access to your camera to scan QR codes.
          </Text>
          <AppButton
            theme="primary"
            title="Grant Permission"
            icon="camera"
            onPress={requestPermission}
          />
        </View>
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (!user) {
      setScanned(true);
      setLastData(data);
      setMessage('Please sign in to record attendance.');
      setSuccess(false);
      return;
    }

    setScanned(true);
    setLastData(data);

    try {
      const result = await registerAttendance(data, user.id);
      setMessage(result.message);
      setSuccess(result.success);
    } catch (err: any) {
      setMessage(err?.message || 'Failed to record attendance.');
      setSuccess(false);
    }
  };
  const handleScanAgain = () => {
    setScanned(false);
    setLastData(null);
    setMessage(null);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      <View style={styles.cameraShade} pointerEvents="none" />
      <View style={styles.scanFrame} pointerEvents="none">
        <View style={[styles.frameCorner, styles.frameCornerTopLeft]} />
        <View style={[styles.frameCorner, styles.frameCornerTopRight]} />
        <View style={[styles.frameCorner, styles.frameCornerBottomLeft]} />
        <View style={[styles.frameCorner, styles.frameCornerBottomRight]} />
      </View>

      <View
        style={[styles.overlay, { bottom: Math.max(insets.bottom + 84, 104) }]}
      >
        <Text style={styles.overlayEyebrow}>LIVE SCANNER</Text>
        <Text style={styles.overlayText}>
          {scanned ? 'QR Code detected!' : 'Point your camera at a QR code'}
        </Text>

        {scanned && message && (
          <Text
            style={[styles.scanResult, success ? styles.success : styles.error]}
          >
            {message}
          </Text>
        )}

        {scanned && lastData && (
          <Text style={styles.scanData}>{lastData}</Text>
        )}

        {scanned && (
          <AppButton
            theme="primary"
            title="Scan Again"
            icon="refresh"
            onPress={() => setScanned(false)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  camera: {
    ...StyleSheet.absoluteFillObject,
  },
  cameraShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(35,20,60,0.18)',
  },
  scanFrame: {
    position: 'absolute',
    width: 270,
    height: 270,
    top: '23%',
    borderRadius: 38,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.30,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 0 },
    elevation: 7,
  },
  frameCorner: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderColor: COLORS.primary,
  },
  frameCornerTopLeft: {
    top: -1,
    left: -1,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 18,
  },
  frameCornerTopRight: {
    top: -1,
    right: -1,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 18,
  },
  frameCornerBottomLeft: {
    bottom: -1,
    left: -1,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 18,
  },
  frameCornerBottomRight: {
    bottom: -1,
    right: -1,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 18,
  },
  overlay: {
    position: 'absolute',
    left: SPACE.md,
    right: SPACE.md,
    maxWidth: 520,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(109,59,255,0.16)',
    paddingHorizontal: SPACE.lg,
    paddingTop: SPACE.lg,
    paddingBottom: SPACE.sm,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  overlayEyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
    color: COLORS.accentSoft,
    marginBottom: SPACE.xs,
  },
  overlayText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: SPACE.sm,
    textAlign: 'center',
  },
  scanResult: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: SPACE.sm,
    fontWeight: '800',
  },
  success: {
    color: COLORS.success,
  },
  error: {
    color: COLORS.danger,
  },
  scanData: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACE.sm,
  },
  permissionCard: {
    width: '90%',
    maxWidth: 420,
    padding: SPACE.xl,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(109,59,255,0.16)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.36,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 7,
  },
  permissionIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: COLORS.primaryTint,
    borderWidth: 1,
    borderColor: 'rgba(109,59,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACE.lg,
  },
  permissionIconText: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primarySoft,
    letterSpacing: 1,
  },
  title: {
    fontSize: 23,
    fontWeight: '900',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACE.xs,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACE.lg,
  },
});
