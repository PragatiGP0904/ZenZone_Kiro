import { useState, useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';

interface AccessibilityState {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isHighContrastEnabled: boolean;
}

export const useAccessibility = (): AccessibilityState => {
  const [accessibilityState, setAccessibilityState] = useState<AccessibilityState>({
    isScreenReaderEnabled: false,
    isReduceMotionEnabled: false,
    isHighContrastEnabled: false,
  });

  useEffect(() => {
    // Check screen reader status
    const checkScreenReader = async () => {
      try {
        const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
        setAccessibilityState(prev => ({
          ...prev,
          isScreenReaderEnabled: isEnabled,
        }));
      } catch (error) {
        console.warn('Failed to check screen reader status:', error);
      }
    };

    // Check reduce motion preference
    const checkReduceMotion = async () => {
      try {
        const isEnabled = await AccessibilityInfo.isReduceMotionEnabled();
        setAccessibilityState(prev => ({
          ...prev,
          isReduceMotionEnabled: isEnabled,
        }));
      } catch (error) {
        console.warn('Failed to check reduce motion status:', error);
      }
    };

    // Check high contrast preference (if available)
    const checkHighContrast = async () => {
      try {
        // Note: High contrast detection may not be available on all platforms
        // This is a fallback implementation
        setAccessibilityState(prev => ({
          ...prev,
          isHighContrastEnabled: false, // Default to false, can be enhanced later
        }));
      } catch (error) {
        console.warn('Failed to check high contrast status:', error);
      }
    };

    // Initial checks
    checkScreenReader();
    checkReduceMotion();
    checkHighContrast();

    // Set up listeners for accessibility changes
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (isEnabled: boolean) => {
        setAccessibilityState(prev => ({
          ...prev,
          isScreenReaderEnabled: isEnabled,
        }));
      }
    );

    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (isEnabled: boolean) => {
        setAccessibilityState(prev => ({
          ...prev,
          isReduceMotionEnabled: isEnabled,
        }));
      }
    );

    // Cleanup listeners
    return () => {
      screenReaderListener?.remove();
      reduceMotionListener?.remove();
    };
  }, []);

  return accessibilityState;
};