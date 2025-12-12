/**
 * Tempo Golf - Spacing System
 * 4px base unit system
 */

/**
 * Base spacing unit (4px)
 */
export const BASE_UNIT = 4;

/**
 * Spacing scale
 */
export const Spacing = {
  none: 0,
  xs: BASE_UNIT,           // 4px
  sm: BASE_UNIT * 2,       // 8px
  md: BASE_UNIT * 3,       // 12px
  lg: BASE_UNIT * 4,       // 16px
  xl: BASE_UNIT * 5,       // 20px
  '2xl': BASE_UNIT * 6,    // 24px
  '3xl': BASE_UNIT * 8,    // 32px
  '4xl': BASE_UNIT * 10,   // 40px
  '5xl': BASE_UNIT * 12,   // 48px
  '6xl': BASE_UNIT * 16,   // 64px
};

/**
 * Border Radius
 */
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

/**
 * Component-specific spacing
 */
export const ComponentSpacing = {
  // Screen padding
  screenHorizontal: Spacing.lg,
  screenVertical: Spacing.xl,
  
  // Card spacing
  cardPadding: Spacing.lg,
  cardGap: Spacing.md,
  
  // Button padding
  buttonPaddingVertical: Spacing.md,
  buttonPaddingHorizontal: Spacing['2xl'],
  buttonGap: Spacing.sm,
  
  // Input padding
  inputPaddingVertical: Spacing.md,
  inputPaddingHorizontal: Spacing.lg,
  
  // List item
  listItemPadding: Spacing.lg,
  listItemGap: Spacing.sm,
  
  // Section spacing
  sectionGap: Spacing['3xl'],
  sectionMarginBottom: Spacing['2xl'],
  
  // Icon sizes
  iconXS: 16,
  iconSM: 20,
  iconMD: 24,
  iconLG: 28,
  iconXL: 32,
  icon2XL: 40,
  
  // Avatar sizes
  avatarSM: 32,
  avatarMD: 48,
  avatarLG: 64,
  avatarXL: 96,
  
  // FAB size
  fabSize: 56,
  fabIconSize: 24,
};

/**
 * Layout dimensions
 */
export const Layout = {
  // Container widths
  containerSM: 640,
  containerMD: 768,
  containerLG: 1024,
  containerXL: 1280,
  
  // Header heights
  headerHeight: 56,
  headerHeightLarge: 64,
  
  // Tab bar height
  tabBarHeight: 60,
  
  // Bottom sheet
  bottomSheetHeaderHeight: 40,
  bottomSheetHandleWidth: 40,
  bottomSheetHandleHeight: 4,
  
  // Card dimensions
  courseCardHeight: 200,
  statCardMinHeight: 120,
  
  // Input height
  inputHeight: 48,
  inputHeightLarge: 56,
  inputHeightSmall: 40,
};
