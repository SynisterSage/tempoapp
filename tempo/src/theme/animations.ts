/**
 * Tempo Golf - Animation Constants
 * Timing, easing, and animation configurations
 */

/**
 * Animation Durations (milliseconds)
 */
export const Duration = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
};

/**
 * Easing Functions
 */
export const Easing = {
  linear: 'linear',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
  spring: 'spring',
} as const;

/**
 * Animation Presets
 */
export const Animations = {
  // Fade
  fadeIn: {
    duration: Duration.normal,
    easing: Easing.easeOut,
  },
  fadeOut: {
    duration: Duration.fast,
    easing: Easing.easeIn,
  },
  
  // Scale
  scaleIn: {
    duration: Duration.normal,
    easing: Easing.spring,
  },
  scaleOut: {
    duration: Duration.fast,
    easing: Easing.easeIn,
  },
  
  // Slide
  slideInUp: {
    duration: Duration.normal,
    easing: Easing.easeOut,
  },
  slideInDown: {
    duration: Duration.normal,
    easing: Easing.easeOut,
  },
  slideOutDown: {
    duration: Duration.fast,
    easing: Easing.easeIn,
  },
  
  // Button press
  buttonPress: {
    duration: Duration.fast,
    scale: 0.95,
  },
  
  // Card press
  cardPress: {
    duration: Duration.fast,
    scale: 0.98,
  },
  
  // FAB
  fabExpand: {
    duration: Duration.normal,
    easing: Easing.spring,
  },
};

/**
 * Haptic Feedback Types
 */
export const HapticType = {
  light: 'impactLight',
  medium: 'impactMedium',
  heavy: 'impactHeavy',
  success: 'notificationSuccess',
  warning: 'notificationWarning',
  error: 'notificationError',
  selection: 'selection',
} as const;
