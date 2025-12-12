/**
 * Tempo Golf - Color System
 * Extracted from design prototype
 */

export const Colors = {
  // Brand Colors (from design system)
  navy: '#16133A',           // Primary dark navy
  purple: '#6352FF',         // Primary brand purple
  myrtle: '#9589FF',         // Secondary purple
  lilac: '#CEC9FF',          // Tertiary purple
  pale: '#F2F0FF',           // Light purple background
  
  // Grayscale
  black: '#111827',          // Rich black
  darkGray: '#4B5563',       // Dark gray
  gray: '#9CA3AF',           // Medium gray
  lightGray: '#E5E7EB',      // Light gray
  white: '#FFFFFF',          // Pure white
  
  // Semantic Colors
  success: '#22C55E',        // Brighter green for positive stats
  warning: '#F59E0B',        // Orange for warnings
  error: '#EF4444',          // Red for errors
  info: '#6352FF',           // Purple for info (brand color)
  
  // Course/Map Colors
  fairway: '#4ADE80',        // Bright green
  water: '#3B82F6',          // Blue
  sand: '#FCD34D',           // Yellow
  outOfBounds: '#EF4444',    // Red
  pin: '#DC2626',            // Flag red
  
  // Transparent/Overlay
  overlay: 'rgba(22, 19, 58, 0.6)',      // Navy overlay
  overlayLight: 'rgba(22, 19, 58, 0.3)', // Lighter overlay
  scrim: 'rgba(0, 0, 0, 0.5)',           // Modal backdrop
  transparent: 'transparent',
};

/**
 * Light Theme Colors
 */
export const LightTheme = {
  primary: Colors.purple,
  primaryDark: Colors.navy,
  primaryLight: Colors.myrtle,
  
  background: Colors.white,
  surface: Colors.white,
  surfaceVariant: Colors.pale,
  
  text: Colors.black,
  textSecondary: Colors.darkGray,
  textTertiary: Colors.gray,
  textInverse: Colors.white,
  
  border: Colors.lightGray,
  borderLight: '#F3F4F6',
  
  card: Colors.white,
  cardElevated: Colors.white,
  
  success: Colors.success,
  warning: Colors.warning,
  error: Colors.error,
  info: Colors.info,
  
  // Component-specific
  buttonPrimary: Colors.purple,
  buttonSecondary: Colors.navy,
  buttonDisabled: Colors.gray,
  
  inputBackground: Colors.white,
  inputBorder: Colors.lightGray,
  inputPlaceholder: Colors.gray,
  
  tabBarBackground: Colors.navy,
  tabBarActive: Colors.purple,
  tabBarInactive: Colors.gray,
  
  chipBackground: Colors.pale,
  chipText: Colors.purple,
  
  shadowColor: Colors.black,
};

/**
 * Dark Theme Colors
 */
export const DarkTheme = {
  primary: Colors.myrtle,         // Lighter purple for dark mode
  primaryDark: Colors.purple,
  primaryLight: Colors.lilac,
  
  background: '#0F0E1A',          // Darker than navy
  surface: '#1A1838',             // Navy surface
  surfaceVariant: '#242141',      // Lighter surface
  
  text: Colors.white,
  textSecondary: '#D1D5DB',
  textTertiary: Colors.gray,
  textInverse: Colors.navy,
  
  border: '#374151',
  borderLight: '#2D3748',
  
  card: '#1A1838',
  cardElevated: '#242141',
  
  success: '#34D399',             // Lighter green for dark mode
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
  
  // Component-specific
  buttonPrimary: Colors.myrtle,
  buttonSecondary: Colors.navy,
  buttonDisabled: Colors.darkGray,
  
  inputBackground: '#1A1838',
  inputBorder: '#374151',
  inputPlaceholder: Colors.gray,
  
  tabBarBackground: '#0F0E1A',
  tabBarActive: Colors.myrtle,
  tabBarInactive: '#6B7280',
  
  chipBackground: '#242141',
  chipText: Colors.myrtle,
  
  shadowColor: Colors.black,
};

/**
 * Color with opacity helper
 */
export const withOpacity = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
