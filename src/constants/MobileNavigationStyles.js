/**
 * Mobile Navigation Styles
 * Specific styles for navigation components and interactions
 * Extends the main mobile chat styles with navigation-specific patterns
 */

import { colors, spacing, typography, mobileStyles, shadows, animations } from './MobileChatStyles.js';

// Navigation-specific color scheme
export const navigationColors = {
  // Bottom navigation
  bottomNav: {
    background: colors.white,
    border: colors.neutral[200],
    shadow: shadows.lg,
  },
  
  // Tab states
  tab: {
    active: {
      background: colors.primary[50],
      icon: colors.primary[600],
      text: colors.primary[600],
      border: colors.primary[200],
    },
    inactive: {
      background: 'transparent',
      icon: colors.neutral[500],
      text: colors.neutral[500],
      border: 'transparent',
    },
    hover: {
      background: colors.neutral[50],
      icon: colors.neutral[600],
      text: colors.neutral[600],
    },
    pressed: {
      background: colors.primary[100],
      icon: colors.primary[700],
      text: colors.primary[700],
    },
  },
  
  // Header colors
  header: {
    background: colors.white,
    text: colors.neutral[800],
    border: colors.neutral[200],
    backButton: colors.neutral[600],
  },
  
  // Screen backgrounds
  screen: {
    default: colors.neutral[50],
    chat: colors.white,
    home: colors.neutral[50],
    calendar: colors.neutral[50],
    mood: colors.neutral[50],
    settings: colors.neutral[50],
  },
};

// Navigation layout dimensions
export const navigationLayout = {
  // Bottom navigation
  bottomNav: {
    height: '80px',
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.sm,
    tabCount: 5,
    tabMinWidth: mobileStyles.minTouchTarget,
    tabMinHeight: mobileStyles.minTouchTarget,
  },
  
  // Header
  header: {
    minHeight: mobileStyles.minTouchTarget,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backButtonSize: mobileStyles.minTouchTarget,
    iconSize: '20px',
  },
  
  // Safe areas
  safeArea: {
    top: mobileStyles.safeArea.top,
    bottom: mobileStyles.safeArea.bottom,
    left: mobileStyles.safeArea.left,
    right: mobileStyles.safeArea.right,
  },
};

// Touch interaction styles
export const touchStyles = {
  // Base touch target
  touchTarget: {
    minWidth: mobileStyles.minTouchTarget,
    minHeight: mobileStyles.minTouchTarget,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    WebkitTapHighlightColor: 'transparent',
    userSelect: 'none',
    outline: 'none',
    border: 'none',
    background: 'transparent',
  },
  
  // Navigation tab touch styles
  navTab: {
    padding: spacing.sm,
    borderRadius: '8px',
    transition: `all ${animations.normal} ease`,
    transform: 'scale(1)',
    ':active': {
      transform: 'scale(0.95)',
    },
  },
  
  // Button press feedback
  pressEffect: {
    transform: 'scale(0.95)',
    transition: `transform ${animations.fast} ease`,
  },
  
  // Hover effects (for devices that support it)
  hover: {
    transition: `background-color ${animations.normal} ease`,
  },
};

// Animation presets for navigation
export const navigationAnimations = {
  // Tab switching animation
  tabSwitch: {
    duration: animations.normal,
    easing: 'ease-in-out',
    properties: ['transform', 'background-color', 'color'],
  },
  
  // Screen transition
  screenTransition: {
    duration: animations.slow,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    slideIn: {
      from: { transform: 'translateX(100%)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
    slideOut: {
      from: { transform: 'translateX(0)', opacity: 1 },
      to: { transform: 'translateX(-100%)', opacity: 0 },
    },
  },
  
  // Icon state changes
  iconTransition: {
    duration: animations.normal,
    easing: 'ease',
    properties: ['filter', 'transform'],
  },
  
  // Haptic feedback timing
  haptic: {
    light: 5, // milliseconds
    medium: 10,
    heavy: 15,
  },
};

// Accessibility styles
export const accessibilityStyles = {
  // Focus indicators
  focus: {
    outline: `2px solid ${colors.primary[500]}`,
    outlineOffset: '2px',
    borderRadius: '4px',
  },
  
  // High contrast mode support
  highContrast: {
    border: `1px solid ${colors.neutral[400]}`,
    background: colors.white,
  },
  
  // Screen reader support
  screenReader: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
};

// Responsive navigation styles
export const responsiveNavigation = {
  // Small phones (320px - 374px)
  small: {
    bottomNav: {
      height: '70px',
      paddingHorizontal: '4px',
    },
    tab: {
      fontSize: typography.sizes.xs,
      iconSize: '20px',
      padding: '6px',
    },
    header: {
      paddingHorizontal: spacing.md,
      fontSize: typography.sizes.md,
    },
  },
  
  // Medium phones (375px - 413px)
  medium: {
    bottomNav: {
      height: '80px',
      paddingHorizontal: spacing.sm,
    },
    tab: {
      fontSize: typography.sizes.sm,
      iconSize: '24px',
      padding: spacing.sm,
    },
    header: {
      paddingHorizontal: spacing.lg,
      fontSize: typography.sizes.lg,
    },
  },
  
  // Large phones (414px+)
  large: {
    bottomNav: {
      height: '90px',
      paddingHorizontal: spacing.md,
    },
    tab: {
      fontSize: typography.sizes.base,
      iconSize: '28px',
      padding: spacing.md,
    },
    header: {
      paddingHorizontal: spacing.xl,
      fontSize: typography.sizes.xl,
    },
  },
};

// Utility functions for navigation
export const navigationUtils = {
  // Generate tab styles based on state
  getTabStyle: (isActive, isPressed = false, isHovered = false) => {
    let baseStyle = touchStyles.navTab;
    
    if (isActive) {
      baseStyle = {
        ...baseStyle,
        backgroundColor: navigationColors.tab.active.background,
        transform: 'scale(1.05)',
      };
    } else if (isPressed) {
      baseStyle = {
        ...baseStyle,
        backgroundColor: navigationColors.tab.pressed.background,
        transform: 'scale(0.95)',
      };
    } else if (isHovered) {
      baseStyle = {
        ...baseStyle,
        backgroundColor: navigationColors.tab.hover.background,
      };
    }
    
    return baseStyle;
  },
  
  // Generate icon filter for different states
  getIconFilter: (isActive) => {
    if (isActive) {
      // Primary color filter
      return 'brightness(0) saturate(100%) invert(45%) sepia(99%) saturate(1000%) hue-rotate(230deg) brightness(100%) contrast(101%)';
    } else {
      // Neutral color filter
      return 'brightness(0) saturate(100%) invert(60%) sepia(8%) saturate(1000%) hue-rotate(200deg) brightness(95%) contrast(85%)';
    }
  },
  
  // Calculate safe area padding
  getSafeAreaPadding: (side) => {
    return `env(safe-area-inset-${side})`;
  },
  
  // Generate media queries for responsive design
  mediaQuery: (size) => {
    const breakpoints = {
      small: '(max-width: 374px)',
      medium: '(min-width: 375px) and (max-width: 413px)',
      large: '(min-width: 414px)',
    };
    return `@media ${breakpoints[size]}`;
  },
};

export default {
  navigationColors,
  navigationLayout,
  touchStyles,
  navigationAnimations,
  accessibilityStyles,
  responsiveNavigation,
  navigationUtils,
};