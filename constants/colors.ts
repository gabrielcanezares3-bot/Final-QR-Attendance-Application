export const COLORS = {
  // Fresh visual system: soft lavender + vivid purple + electric violet
  primary: '#6D3BFF',
  primaryDeep: '#4D20D9',
  primarySoft: '#8D6BFF',
  primaryTint: '#EEE8FF',

  accent: '#A56BFF',
  accentSoft: '#B99AFF',
  cyan: '#6DDCFF',
  cyanSoft: '#C8F3FF',
  pink: '#EAA8FF',

  warm: '#FF8AAE',
  warmSoft: '#FFC0D1',

  background: '#F3F0FF',
  backgroundDeep: '#E8E2FF',
  surface: 'rgba(255,255,255,0.72)',
  card: '#F9F7FF',
  cardRaised: '#FFFFFF',

  textPrimary: '#241A3A',
  textSecondary: '#766B8D',
  textMuted: '#9A91AD',
  textOnPrimary: '#FFFFFF',

  border: 'rgba(108,72,190,0.12)',
  glassBorder: 'rgba(108,72,190,0.15)',
  glass: 'rgba(255,255,255,0.66)',
  glassStrong: 'rgba(255,255,255,0.88)',

  shadow: 'rgba(71,49,126,0.18)',
  shadowDeep: 'rgba(71,49,126,0.28)',
  neonGlow: 'rgba(109,59,255,0.28)',
  neonGlowDeep: 'rgba(77,32,217,0.22)',

  success: '#28B88A',
  danger: '#E85D7D',
  warning: '#D89B35',

  gradientTop: '#8E65FF',
  gradientMid: '#6D3BFF',
  gradientBottom: '#C36BFF',

  // Ambient glow palette
  orbCore: '#FFFFFF',
  orbHighlight: '#F1E7FF',
  orbInner: '#D39CFF',
  orbMid: '#8B5CFF',
  orbOuter: '#6D3BFF',
  orbDeep: '#5A32C8',
  orbDeepSoft: '#DAD1FF',
  orbViolet: '#B76DFF',
  orbMagenta: '#EE8CFF',
} as const;

export const SPACE = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  section: 36,
} as const;

export const RADIUS = {
  sm: 14,
  md: 18,
  lg: 26,
  xl: 30,
  pill: 999,
} as const;
