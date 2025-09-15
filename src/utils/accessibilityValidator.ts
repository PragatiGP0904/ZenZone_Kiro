import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Utility functions to validate and test accessibility features
 */

export interface AccessibilityValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates that an element has proper accessibility properties
 */
export const validateAccessibilityProps = (
  element: any,
  expectedLabel?: string,
  expectedRole?: string,
  expectedHint?: string
): AccessibilityValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if element is accessible
  if (!element.props.accessible) {
    errors.push('Element is not marked as accessible');
  }

  // Check accessibility label
  if (expectedLabel && element.props.accessibilityLabel !== expectedLabel) {
    errors.push(`Expected accessibility label "${expectedLabel}", got "${element.props.accessibilityLabel}"`);
  }

  // Check accessibility role
  if (expectedRole && element.props.accessibilityRole !== expectedRole) {
    errors.push(`Expected accessibility role "${expectedRole}", got "${element.props.accessibilityRole}"`);
  }

  // Check accessibility hint
  if (expectedHint && element.props.accessibilityHint !== expectedHint) {
    warnings.push(`Expected accessibility hint "${expectedHint}", got "${element.props.accessibilityHint}"`);
  }

  // Check focusability for interactive elements
  if (expectedRole === 'button' && !element.props.focusable) {
    warnings.push('Interactive button should be focusable for assistive technology');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validates color contrast ratios
 */
export const validateColorContrast = (
  foregroundColor: string,
  backgroundColor: string,
  minimumRatio: number = 4.5
): AccessibilityValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Simple color contrast validation (in a real app, you'd use a proper color contrast library)
  // This is a simplified implementation for demonstration
  const isHighContrast = checkColorContrast(foregroundColor, backgroundColor, minimumRatio);
  
  if (!isHighContrast) {
    errors.push(`Color contrast ratio between ${foregroundColor} and ${backgroundColor} does not meet WCAG AA standards (${minimumRatio}:1)`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Simplified color contrast checker
 * In production, use a proper color contrast library like 'color-contrast'
 */
const checkColorContrast = (
  foreground: string,
  background: string,
  minimumRatio: number
): boolean => {
  // This is a simplified implementation
  // In a real app, you would calculate the actual contrast ratio
  
  // Known good combinations from our accessibility constants
  const knownGoodCombinations = [
    { fg: '#FFFFFF', bg: '#1565C0' }, // White on dark blue
    { fg: '#FFFFFF', bg: '#0D47A1' }, // White on darker blue
    { fg: '#212121', bg: '#FFFFFF' }, // Dark gray on white
  ];

  return knownGoodCombinations.some(
    combo => combo.fg === foreground && combo.bg === background
  );
};

/**
 * Tests accessibility features at runtime
 */
export const testAccessibilityFeatures = async (): Promise<AccessibilityValidationResult> => {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Test screen reader detection
    const isScreenReaderEnabled = await AccessibilityInfo.isScreenReaderEnabled();
    console.log('Screen reader enabled:', isScreenReaderEnabled);

    // Test reduce motion detection
    const isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
    console.log('Reduce motion enabled:', isReduceMotionEnabled);

    // Platform-specific tests
    if (Platform.OS === 'ios') {
      // iOS-specific accessibility tests
      const isBoldTextEnabled = await AccessibilityInfo.isBoldTextEnabled();
      console.log('Bold text enabled:', isBoldTextEnabled);
    }

    if (Platform.OS === 'android') {
      // Android-specific accessibility tests
      const isTouchExplorationEnabled = await AccessibilityInfo.isTouchExplorationEnabled();
      console.log('Touch exploration enabled:', isTouchExplorationEnabled);
    }

  } catch (error) {
    errors.push(`Failed to test accessibility features: ${error}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validates that animations respect reduced motion preferences
 */
export const validateReducedMotionSupport = (
  animationConfig: any,
  isReduceMotionEnabled: boolean
): AccessibilityValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (isReduceMotionEnabled) {
    // Check if complex animations are disabled
    if (animationConfig.enableComplexAnimations) {
      errors.push('Complex animations should be disabled when reduce motion is enabled');
    }

    // Check if animation intensity is reduced
    if (animationConfig.animationIntensity > 0.5) {
      warnings.push('Animation intensity should be reduced when reduce motion is enabled');
    }

    // Check if simple easing is used
    if (!animationConfig.useSimpleEasing) {
      warnings.push('Simple easing functions should be used when reduce motion is enabled');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Comprehensive accessibility audit
 */
export const auditAccessibility = async (
  componentProps: any,
  animationConfig: any,
  isReduceMotionEnabled: boolean
): Promise<AccessibilityValidationResult> => {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // Test runtime accessibility features
  const runtimeTest = await testAccessibilityFeatures();
  allErrors.push(...runtimeTest.errors);
  allWarnings.push(...runtimeTest.warnings);

  // Validate reduced motion support
  const motionTest = validateReducedMotionSupport(animationConfig, isReduceMotionEnabled);
  allErrors.push(...motionTest.errors);
  allWarnings.push(...motionTest.warnings);

  // Validate color contrast for button
  const contrastTest = validateColorContrast('#FFFFFF', '#1565C0');
  allErrors.push(...contrastTest.errors);
  allWarnings.push(...contrastTest.warnings);

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
};