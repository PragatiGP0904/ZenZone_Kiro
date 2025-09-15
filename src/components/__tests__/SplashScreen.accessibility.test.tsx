import React from 'react';
import { render } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import SplashScreen from '../SplashScreen';
import { AccessibilityLabels, AccessibilityRoles } from '../../constants/accessibility';

// Mock the accessibility hook
jest.mock('../../hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    isScreenReaderEnabled: false,
    isReduceMotionEnabled: false,
    isHighContrastEnabled: false,
  }),
}));

// Mock React Native Reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock Expo LinearGradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

describe('SplashScreen Accessibility', () => {
  const mockOnGetStarted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have proper accessibility labels for screen readers', () => {
    const { getByLabelText } = render(
      <SplashScreen onGetStarted={mockOnGetStarted} />
    );

    // Check main accessibility labels
    expect(getByLabelText(AccessibilityLabels.SPLASH_SCREEN)).toBeTruthy();
    expect(getByLabelText(AccessibilityLabels.GET_STARTED_BUTTON)).toBeTruthy();
    expect(getByLabelText(AccessibilityLabels.LOGO)).toBeTruthy();
    expect(getByLabelText(AccessibilityLabels.APP_TEXT)).toBeTruthy();
  });

  it('should have proper accessibility roles', () => {
    const { getByRole } = render(
      <SplashScreen onGetStarted={mockOnGetStarted} />
    );

    // Check button role
    expect(getByRole(AccessibilityRoles.BUTTON)).toBeTruthy();
  });

  it('should make button focusable for assistive technology', () => {
    const { getByLabelText } = render(
      <SplashScreen onGetStarted={mockOnGetStarted} />
    );

    const button = getByLabelText(AccessibilityLabels.GET_STARTED_BUTTON);
    expect(button.props.focusable).toBe(true);
    expect(button.props.accessible).toBe(true);
  });

  it('should have accessibility hint for button', () => {
    const { getByLabelText } = render(
      <SplashScreen onGetStarted={mockOnGetStarted} />
    );

    const button = getByLabelText(AccessibilityLabels.GET_STARTED_BUTTON);
    expect(button.props.accessibilityHint).toBe(AccessibilityLabels.GET_STARTED_HINT);
  });

  it('should handle button press correctly', () => {
    const { getByLabelText } = render(
      <SplashScreen onGetStarted={mockOnGetStarted} />
    );

    const button = getByLabelText(AccessibilityLabels.GET_STARTED_BUTTON);
    button.props.onPress();
    
    expect(mockOnGetStarted).toHaveBeenCalledTimes(1);
  });
});

describe('SplashScreen Accessibility with Screen Reader', () => {
  const mockOnGetStarted = jest.fn();

  beforeEach(() => {
    // Mock screen reader enabled
    jest.doMock('../../hooks/useAccessibility', () => ({
      useAccessibility: () => ({
        isScreenReaderEnabled: true,
        isReduceMotionEnabled: false,
        isHighContrastEnabled: false,
      }),
    }));
  });

  it('should hide decorative elements from screen readers', () => {
    const { getByLabelText } = render(
      <SplashScreen onGetStarted={mockOnGetStarted} />
    );

    // Decorative elements should have importantForAccessibility="no"
    const pentagonElement = getByLabelText(AccessibilityLabels.PENTAGON_DECORATION);
    expect(pentagonElement.props.importantForAccessibility).toBe('no');
  });
});

describe('SplashScreen Accessibility with Reduced Motion', () => {
  const mockOnGetStarted = jest.fn();

  beforeEach(() => {
    // Mock reduced motion enabled
    jest.doMock('../../hooks/useAccessibility', () => ({
      useAccessibility: () => ({
        isScreenReaderEnabled: false,
        isReduceMotionEnabled: true,
        isHighContrastEnabled: false,
      }),
    }));
  });

  it('should respect reduced motion preferences', () => {
    // This test would verify that animations are disabled or reduced
    // The actual implementation is in the component's useEffect
    const { getByLabelText } = render(
      <SplashScreen onGetStarted={mockOnGetStarted} />
    );

    // Component should render without throwing errors when reduced motion is enabled
    expect(getByLabelText(AccessibilityLabels.SPLASH_SCREEN)).toBeTruthy();
  });
});