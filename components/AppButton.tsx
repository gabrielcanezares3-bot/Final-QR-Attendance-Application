import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, RADIUS, SPACE } from '@/constants/colors';

type Props = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  theme?: 'primary';
  disabled?: boolean;
  onPress: () => void;
};

export default function AppButton({ title, icon, theme, disabled, onPress }: Props) {
  const isPrimary = theme === 'primary';

  return (
    <View style={[styles.outer, isPrimary && styles.primaryOuter]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        disabled={disabled}
        onPress={onPress}
        android_ripple={{
          color: isPrimary ? 'rgba(255,255,255,0.14)' : 'rgba(109,59,255,0.08)',
        }}
        style={({ pressed }) => [
          styles.button,
          isPrimary ? styles.primary : styles.secondary,
          pressed && styles.pressed,
          disabled && styles.disabled,
        ]}
      >
        {isPrimary && <View pointerEvents="none" style={styles.topBevel} />}
        {isPrimary && <View pointerEvents="none" style={styles.bottomBevel} />}

        <View style={[styles.iconBox, isPrimary ? styles.iconPrimary : styles.iconSecondary]}>
          <Ionicons
            name={icon}
            size={18}
            color={isPrimary ? COLORS.textOnPrimary : COLORS.primary}
          />
        </View>

        <Text style={[styles.label, isPrimary ? styles.primaryLabel : styles.secondaryLabel]}>
          {title}
        </Text>

        <View style={[styles.arrow, isPrimary ? styles.arrowPrimary : styles.arrowSecondary]}>
          <Ionicons
            name="arrow-forward"
            size={15}
            color={isPrimary ? '#FFFFFF' : COLORS.primary}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    marginBottom: SPACE.md,
  },
  primaryOuter: {
    borderRadius: RADIUS.pill,
    shadowColor: COLORS.primaryDeep,
    shadowOpacity: 0.34,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 9 },
    elevation: 8,
  },
  button: {
    minHeight: 58,
    borderRadius: RADIUS.pill,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  primary: {
    backgroundColor: COLORS.primary,
    borderTopColor: 'rgba(255,255,255,0.62)',
    borderLeftColor: 'rgba(255,255,255,0.28)',
    borderRightColor: 'rgba(77,32,217,0.45)',
    borderBottomColor: COLORS.primaryDeep,
  },
  secondary: {
    backgroundColor: COLORS.cardRaised,
    borderColor: COLORS.glassBorder,
    shadowColor: COLORS.shadowDeep,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  topBevel: {
    position: 'absolute',
    top: 1,
    left: 18,
    right: 18,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  bottomBevel: {
    position: 'absolute',
    bottom: 1,
    left: 20,
    right: 20,
    height: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(45,15,125,0.28)',
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconPrimary: {
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.28)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(68,25,170,0.28)',
  },
  iconSecondary: {
    backgroundColor: COLORS.primaryTint,
  },
  label: {
    flex: 1,
    fontSize: 15.5,
    fontWeight: '900',
    letterSpacing: 0.1,
  },
  primaryLabel: {
    color: COLORS.textOnPrimary,
  },
  secondaryLabel: {
    color: COLORS.textPrimary,
  },
  arrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowPrimary: {
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(63,20,155,0.22)',
  },
  arrowSecondary: {
    backgroundColor: COLORS.primaryTint,
  },
  pressed: {
    transform: [{ scale: 0.975 }, { translateY: 2 }],
    opacity: 0.96,
  },
  disabled: {
    opacity: 0.45,
  },
});
