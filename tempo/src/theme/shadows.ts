/**
 * Tempo Golf - Shadow System
 * Elevation and shadow styles
 */

import { Platform, ViewStyle } from 'react-native';

/**
 * Shadow presets for different elevation levels
 */
export const Shadows = {
  none: Platform.select<ViewStyle>({
    ios: {
      shadowColor: 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    android: {
      elevation: 0,
    },
  }),
  
  sm: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
  }),
  
  md: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
  
  lg: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 8,
    },
  }),
  
  xl: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
    android: {
      elevation: 12,
    },
  }),
  
  '2xl': Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
    },
    android: {
      elevation: 16,
    },
  }),
};

/**
 * Component-specific shadows
 */
export const ComponentShadows = {
  card: Shadows.md,
  cardHover: Shadows.lg,
  button: Shadows.sm,
  fab: Shadows.xl,
  modal: Shadows['2xl'],
  bottomSheet: Shadows.xl,
  dropdown: Shadows.lg,
};
