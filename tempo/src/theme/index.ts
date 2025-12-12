/**
 * Tempo Golf - Main Theme Configuration
 * Combines all theme tokens and provides light/dark themes
 */

import { MD3LightTheme, MD3DarkTheme, MD3Theme } from 'react-native-paper';
import { LightTheme as LightColors, DarkTheme as DarkColors } from './colors';
import { Typography, FontFamily } from './typography';
import { Spacing, BorderRadius } from './spacing';
import { Shadows } from './shadows';

/**
 * Custom theme type extending React Native Paper theme
 */
export interface TempoTheme extends MD3Theme {
  custom: {
    spacing: typeof Spacing;
    borderRadius: typeof BorderRadius;
    shadows: typeof Shadows;
    typography: typeof Typography;
  };
}

/**
 * Light Theme
 */
export const lightTheme: TempoTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: LightColors.primary,
    primaryContainer: LightColors.primaryLight,
    secondary: LightColors.primaryDark,
    secondaryContainer: LightColors.surfaceVariant,
    tertiary: LightColors.primaryLight,
    
    surface: LightColors.surface,
    surfaceVariant: LightColors.surfaceVariant,
    surfaceDisabled: LightColors.borderLight,
    
    background: LightColors.background,
    
    error: LightColors.error,
    errorContainer: '#FEE2E2',
    
    onPrimary: LightColors.textInverse,
    onPrimaryContainer: LightColors.primary,
    onSecondary: LightColors.textInverse,
    onSecondaryContainer: LightColors.primaryDark,
    onTertiary: LightColors.textInverse,
    
    onSurface: LightColors.text,
    onSurfaceVariant: LightColors.textSecondary,
    onSurfaceDisabled: LightColors.buttonDisabled,
    
    onBackground: LightColors.text,
    
    onError: LightColors.textInverse,
    onErrorContainer: LightColors.error,
    
    outline: LightColors.border,
    outlineVariant: LightColors.borderLight,
    
    inverseSurface: LightColors.primaryDark,
    inverseOnSurface: LightColors.textInverse,
    inversePrimary: LightColors.primaryLight,
    
    shadow: LightColors.shadowColor,
    scrim: 'rgba(0, 0, 0, 0.4)',
    
    backdrop: 'rgba(0, 0, 0, 0.4)',
    
    // Navigation
    elevation: {
      level0: LightColors.background,
      level1: LightColors.surface,
      level2: LightColors.surfaceVariant,
      level3: LightColors.cardElevated,
      level4: LightColors.cardElevated,
      level5: LightColors.cardElevated,
    },
  },
  fonts: {
    ...MD3LightTheme.fonts,
    displayLarge: {
      ...Typography.h1,
      fontFamily: FontFamily.sfPro,
      letterSpacing: 0,
    },
    displayMedium: {
      ...Typography.h2,
      fontFamily: FontFamily.sfPro,
      letterSpacing: 0,
    },
    displaySmall: {
      ...Typography.h3,
      fontFamily: FontFamily.sfPro,
      letterSpacing: 0,
    },
    headlineLarge: {
      ...Typography.h3,
      fontFamily: FontFamily.sfPro,
      letterSpacing: 0,
    },
    headlineMedium: {
      ...Typography.h4,
      fontFamily: FontFamily.sfPro,
      letterSpacing: 0,
    },
    headlineSmall: {
      ...Typography.h5,
      fontFamily: FontFamily.sfPro,
      letterSpacing: 0,
    },
    titleLarge: {
      ...Typography.h5,
      fontFamily: FontFamily.sfPro,
      letterSpacing: 0,
    },
    titleMedium: {
      ...Typography.h6,
      fontFamily: FontFamily.sfPro,
      letterSpacing: 0,
    },
    titleSmall: {
      ...Typography.label,
      fontFamily: FontFamily.sfProText,
      letterSpacing: 0,
    },
    bodyLarge: {
      ...Typography.bodyLarge,
      fontFamily: FontFamily.sfProText,
      letterSpacing: 0,
    },
    bodyMedium: {
      ...Typography.body,
      fontFamily: FontFamily.sfProText,
      letterSpacing: 0,
    },
    bodySmall: {
      ...Typography.bodySmall,
      fontFamily: FontFamily.sfProText,
      letterSpacing: 0,
    },
    labelLarge: {
      ...Typography.button,
      fontFamily: FontFamily.sfPro,
      letterSpacing: 0,
    },
    labelMedium: {
      ...Typography.label,
      fontFamily: FontFamily.sfProText,
      letterSpacing: 0,
    },
    labelSmall: {
      ...Typography.caption,
      fontFamily: FontFamily.sfProText,
      letterSpacing: 0,
    },
  },
  roundness: BorderRadius.lg,
  custom: {
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows: Shadows,
    typography: Typography,
  },
};

/**
 * Dark Theme
 */
export const darkTheme: TempoTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: DarkColors.primary,
    primaryContainer: DarkColors.primaryDark,
    secondary: DarkColors.primaryDark,
    secondaryContainer: DarkColors.surfaceVariant,
    tertiary: DarkColors.primaryLight,
    
    surface: DarkColors.surface,
    surfaceVariant: DarkColors.surfaceVariant,
    surfaceDisabled: DarkColors.border,
    
    background: DarkColors.background,
    
    error: DarkColors.error,
    errorContainer: '#7F1D1D',
    
    onPrimary: DarkColors.textInverse,
    onPrimaryContainer: DarkColors.primary,
    onSecondary: DarkColors.textInverse,
    onSecondaryContainer: DarkColors.text,
    onTertiary: DarkColors.textInverse,
    
    onSurface: DarkColors.text,
    onSurfaceVariant: DarkColors.textSecondary,
    onSurfaceDisabled: DarkColors.buttonDisabled,
    
    onBackground: DarkColors.text,
    
    onError: DarkColors.textInverse,
    onErrorContainer: DarkColors.error,
    
    outline: DarkColors.border,
    outlineVariant: DarkColors.borderLight,
    
    inverseSurface: DarkColors.text,
    inverseOnSurface: DarkColors.textInverse,
    inversePrimary: DarkColors.primaryDark,
    
    shadow: DarkColors.shadowColor,
    scrim: 'rgba(0, 0, 0, 0.6)',
    
    backdrop: 'rgba(0, 0, 0, 0.6)',
    
    // Navigation
    elevation: {
      level0: DarkColors.background,
      level1: DarkColors.surface,
      level2: DarkColors.surfaceVariant,
      level3: DarkColors.cardElevated,
      level4: DarkColors.cardElevated,
      level5: DarkColors.cardElevated,
    },
  },
  fonts: {
    ...lightTheme.fonts, // Same fonts for both themes
  },
  roundness: BorderRadius.lg,
  custom: {
    spacing: Spacing,
    borderRadius: BorderRadius,
    shadows: Shadows,
    typography: Typography,
  },
};

/**
 * Export both themes
 */
export { LightColors, DarkColors };
export * from './typography';
export * from './spacing';
export * from './shadows';
