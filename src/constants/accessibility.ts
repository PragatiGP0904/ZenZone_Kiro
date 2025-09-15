// Accessibility labels and hints for screen readers
export const AccessibilityLabels = {
  SPLASH_SCREEN: 'ZenZone splash screen',
  LOGO: 'ZenZone logo',
  APP_TEXT: 'ZenZone app name',
  PENTAGON_DECORATION: 'Decorative pentagon shape with shimmer effect',
  GROUP_DECORATION: 'Decorative floating elements',
  BUBBLE_DECORATION: 'Decorative floating bubble',
  GET_STARTED_BUTTON: 'Get Started',
  GET_STARTED_HINT: 'Navigate to the main application',
} as const;

// Accessibility roles
export const AccessibilityRoles = {
  BUTTON: 'button' as const,
  IMAGE: 'image' as const,
  TEXT: 'text' as const,
  NONE: 'none' as const, // For decorative elements
} as const;

// Color contrast ratios that meet WCAG AA guidelines
export const AccessibleColors = {
  // High contrast button colors (meets WCAG AA 4.5:1 ratio)
  BUTTON_BACKGROUND: '#1565C0', // Darker blue for better contrast
  BUTTON_BACKGROUND_PRESSED: '#0D47A1', // Even darker when pressed
  BUTTON_TEXT: '#FFFFFF', // White text on dark background
  
  // High contrast text colors
  PRIMARY_TEXT: '#212121', // Dark gray for primary text
  SECONDARY_TEXT: '#757575', // Medium gray for secondary text
  
  // Background colors with sufficient contrast
  BACKGROUND_OVERLAY: 'rgba(255, 255, 255, 0.95)', // High opacity white overlay
} as const;

// Animation durations for reduced motion
export const ReducedMotionDurations = {
  INSTANT: 0, // No animation
  QUICK: 150, // Very quick for essential feedback
  NORMAL: 300, // Reduced from normal animation times
} as const;

// Helper function to get appropriate animation duration based on reduce motion preference
export const getAnimationDuration = (
  normalDuration: number,
  isReduceMotionEnabled: boolean
): number => {
  if (isReduceMotionEnabled) {
    // Return much shorter duration or instant for reduced motion
    if (normalDuration > 1000) return ReducedMotionDurations.NORMAL;
    if (normalDuration > 500) return ReducedMotionDurations.QUICK;
    return ReducedMotionDurations.INSTANT;
  }
  return normalDuration;
};

// Helper function to get appropriate animation configuration
export const getAccessibleAnimationConfig = (
  isReduceMotionEnabled: boolean
) => ({
  // Disable or reduce complex animations
  enableComplexAnimations: !isReduceMotionEnabled,
  // Reduce animation intensity
  animationIntensity: isReduceMotionEnabled ? 0.3 : 1.0,
  // Use simpler easing functions
  useSimpleEasing: isReduceMotionEnabled,
});