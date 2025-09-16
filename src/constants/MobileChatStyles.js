/**
 * Mobile Chat Styles - Design System
 * Colors and typography extracted from UI mockups
 * Optimized for mobile mental health app experience
 */

// Typography System (Poppins for headings, Quicksand for body text)
export const typography = {
  fonts: {
    primary: 'Poppins, -apple-system, BlinkMacSystemFont, sans-serif', // Headers, navigation, buttons
    secondary: 'Quicksand, -apple-system, BlinkMacSystemFont, sans-serif', // Chat messages, body text
  },
  weights: {
    regular: 400,
    semiBold: 600,
    bold: 700,
  },
  sizes: {
    xs: '11px',
    sm: '12px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
};

// Color Palette (extracted from UI mockups - will be refined based on actual images)
export const colors = {
  // Primary colors for mental health app
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6B73FF', // Main brand color
    600: '#5B63D3',
    700: '#4C52A3',
    800: '#3D4373',
    900: '#2E3343',
  },
  
  // Success/positive colors (green tones)
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  
  // Neutral colors for backgrounds and text
  neutral: {
    50: '#FAFBFC',
    100: '#F5F7FA',
    200: '#E1E8ED',
    300: '#C7D0D9',
    400: '#A0AEC0',
    500: '#8E9AAF',
    600: '#68778D',
    700: '#4A5568',
    800: '#2C3E50',
    900: '#1A202C',
  },
  
  // Warning/attention colors
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  // Error/danger colors
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  
  // Semantic colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

// Chat-specific color mappings
export const chatColors = {
  userBubble: {
    background: colors.success[100], // Light green for user messages
    text: colors.success[800],
    border: colors.success[200],
  },
  aiBubble: {
    background: colors.neutral[100], // Light gray for AI messages
    text: colors.neutral[800],
    border: colors.neutral[200],
  },
  typing: {
    background: colors.neutral[100],
    text: colors.neutral[500],
    dots: colors.primary[500],
  },
  input: {
    background: colors.neutral[100],
    border: colors.neutral[200],
    borderFocus: colors.primary[500],
    text: colors.neutral[800],
    placeholder: colors.neutral[500],
  },
  avatar: {
    user: colors.success[500],
    ai: colors.primary[500],
  },
};

// Spacing system (8px base unit)
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
};

// Border radius system
export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  xxl: '20px',
  full: '50%',
  bubble: '20px',
};

// Shadow system
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  lg: '0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)',
  xl: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
  bubble: '0 1px 2px rgba(0, 0, 0, 0.1)',
};

// Mobile breakpoints
export const breakpoints = {
  xs: '320px',
  sm: '375px',
  md: '414px',
  lg: '768px',
  xl: '1024px',
};

// Animation durations
export const animations = {
  fast: '0.15s',
  normal: '0.2s',
  slow: '0.3s',
  slower: '0.5s',
};

// Z-index scale
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
};

// Mobile-specific styles
export const mobileStyles = {
  // Touch-friendly minimum sizes
  minTouchTarget: '44px',
  
  // Safe area handling
  safeArea: {
    top: 'env(safe-area-inset-top)',
    bottom: 'env(safe-area-inset-bottom)',
    left: 'env(safe-area-inset-left)',
    right: 'env(safe-area-inset-right)',
  },
  
  // Common mobile patterns
  fullWidth: '100%',
  fullHeight: '100vh',
  fullScreen: {
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
  },
};

// Utility functions for responsive design
export const utils = {
  // Convert px to rem (assuming 16px base)
  rem: (px) => `${px / 16}rem`,
  
  // Media query helper
  mediaQuery: (breakpoint) => `@media (min-width: ${breakpoints[breakpoint]})`,
  
  // Clamp function for responsive typography
  clamp: (min, preferred, max) => `clamp(${min}, ${preferred}, ${max})`,
  
  // Generate rgba color
  rgba: (color, alpha) => `rgba(${color}, ${alpha})`,
};

export default {
  typography,
  colors,
  chatColors,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  animations,
  zIndex,
  mobileStyles,
  utils,
};