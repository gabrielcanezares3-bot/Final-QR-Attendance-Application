import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Defs, Ellipse, RadialGradient, Rect, Stop } from 'react-native-svg';
import { COLORS } from '@/constants/colors';

interface AmbientBackgroundProps {
  style?: object;
  variant?: 'default' | 'compact';
}

export default function AmbientBackground({ style, variant = 'default' }: AmbientBackgroundProps) {
  const compact = variant === 'compact';
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: 6500, useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: 6500, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [drift]);

  const translateX = drift.interpolate({ inputRange: [0, 1], outputRange: [0, compact ? -10 : -18] });
  const translateY = drift.interpolate({ inputRange: [0, 1], outputRange: [0, compact ? 8 : 14] });
  const scale = drift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.045] });

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFillObject, style]}>
      <View style={styles.base} />
      <Animated.View style={[StyleSheet.absoluteFillObject, { transform: [{ translateX }, { translateY }, { scale }] }]}>
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFillObject}>
          <Defs>
            <RadialGradient id="purpleOrb" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={COLORS.orbCore} stopOpacity="0.72" />
              <Stop offset="9%" stopColor={COLORS.orbHighlight} stopOpacity="0.60" />
              <Stop offset="22%" stopColor={COLORS.orbInner} stopOpacity="0.44" />
              <Stop offset="42%" stopColor={COLORS.orbMid} stopOpacity="0.27" />
              <Stop offset="68%" stopColor={COLORS.orbOuter} stopOpacity="0.13" />
              <Stop offset="100%" stopColor={COLORS.orbDeepSoft} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="pinkOrb" cx="50%" cy="50%" r="50%">
              <Stop offset="0%" stopColor={COLORS.orbCore} stopOpacity="0.60" />
              <Stop offset="12%" stopColor={COLORS.orbHighlight} stopOpacity="0.48" />
              <Stop offset="28%" stopColor={COLORS.orbMagenta} stopOpacity="0.34" />
              <Stop offset="52%" stopColor={COLORS.orbViolet} stopOpacity="0.20" />
              <Stop offset="78%" stopColor={COLORS.orbOuter} stopOpacity="0.09" />
              <Stop offset="100%" stopColor={COLORS.orbDeepSoft} stopOpacity="0" />
            </RadialGradient>
            <RadialGradient id="wash" cx="50%" cy="30%" r="80%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.10" />
              <Stop offset="65%" stopColor="#F3F0FF" stopOpacity="0.01" />
              <Stop offset="100%" stopColor="#DDD5F5" stopOpacity="0.16" />
            </RadialGradient>
          </Defs>
          <Ellipse cx={compact ? '86%' : '88%'} cy={compact ? '12%' : '7%'} rx={compact ? '50%' : '55%'} ry={compact ? '42%' : '46%'} fill="url(#purpleOrb)" />
          <Ellipse cx={compact ? '10%' : '6%'} cy={compact ? '91%' : '95%'} rx={compact ? '46%' : '50%'} ry={compact ? '38%' : '43%'} fill="url(#pinkOrb)" />
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#wash)" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.background,
  },
});
