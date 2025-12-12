/**
 * Tempo Golf - Typography System
 * Fonts: Tovar (bold, display), SF Pro (body, system)
 */

import { Platform } from 'react-native';

/**
 * Font Families
 */
export const FontFamily = {
  // Tovar - Bold, rounded font for headings/brand (used sparingly)
  tovar: Platform.select({
    ios: 'Tovar',
    android: 'Tovar-Bold',
    default: 'System',
  }),
  
  // SF Pro - Clean, modern font for UI (primary)
  sfPro: Platform.select({
    ios: 'SF Pro Display',
    android: 'System',
    default: 'System',
  }),
  
  // SF Pro Text - For smaller text
  sfProText: Platform.select({
    ios: 'SF Pro Text',
    android: 'System',
    default: 'System',
  }),
  
  // System fallback
  system: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
};

/**
 * Font Weights
 */
export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  heavy: '800' as const,
};

/**
 * Font Sizes
 */
export const FontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  '5xl': 36,
  '6xl': 48,
  '7xl': 60,
};

/**
 * Line Heights
 */
export const LineHeight = {
  tight: 1.2,
  snug: 1.3,
  normal: 1.5,
  relaxed: 1.6,
  loose: 1.8,
};

/**
 * Typography Styles
 */
export const Typography = {
  // Headings (use Tovar sparingly for brand elements)
  h1: {
    fontFamily: FontFamily.sfPro,
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['4xl'] * LineHeight.tight,
  },
  h2: {
    fontFamily: FontFamily.sfPro,
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['3xl'] * LineHeight.tight,
  },
  h3: {
    fontFamily: FontFamily.sfPro,
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['2xl'] * LineHeight.snug,
  },
  h4: {
    fontFamily: FontFamily.sfPro,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semiBold,
    lineHeight: FontSize.xl * LineHeight.snug,
  },
  h5: {
    fontFamily: FontFamily.sfPro,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
    lineHeight: FontSize.lg * LineHeight.normal,
  },
  h6: {
    fontFamily: FontFamily.sfPro,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semiBold,
    lineHeight: FontSize.base * LineHeight.normal,
  },
  
  // Body text
  bodyLarge: {
    fontFamily: FontFamily.sfProText,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.lg * LineHeight.normal,
  },
  body: {
    fontFamily: FontFamily.sfProText,
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.base * LineHeight.normal,
  },
  bodySmall: {
    fontFamily: FontFamily.sfProText,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.sm * LineHeight.normal,
  },
  
  // Labels & captions
  label: {
    fontFamily: FontFamily.sfProText,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.sm * LineHeight.normal,
  },
  caption: {
    fontFamily: FontFamily.sfProText,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.xs * LineHeight.normal,
  },
  
  // Buttons
  button: {
    fontFamily: FontFamily.sfPro,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semiBold,
    lineHeight: FontSize.base * LineHeight.tight,
  },
  buttonLarge: {
    fontFamily: FontFamily.sfPro,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
    lineHeight: FontSize.lg * LineHeight.tight,
  },
  buttonSmall: {
    fontFamily: FontFamily.sfPro,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.sm * LineHeight.tight,
  },
  
  // Brand/Logo (use Tovar)
  brand: {
    fontFamily: FontFamily.tovar,
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['3xl'] * LineHeight.tight,
    letterSpacing: -0.5,
  },
  brandLarge: {
    fontFamily: FontFamily.tovar,
    fontSize: FontSize['6xl'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['6xl'] * LineHeight.tight,
    letterSpacing: -1,
  },
  
  // Numbers (scores, stats)
  displayNumber: {
    fontFamily: FontFamily.sfPro,
    fontSize: FontSize['5xl'],
    fontWeight: FontWeight.heavy,
    lineHeight: FontSize['5xl'] * LineHeight.tight,
  },
  statNumber: {
    fontFamily: FontFamily.sfPro,
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['3xl'] * LineHeight.tight,
  },
};

/**
 * Letter Spacing
 */
export const LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
};
