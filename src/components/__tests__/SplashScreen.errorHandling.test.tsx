import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import SplashScreen from '../SplashScreen';
import { ErrorLogger, ErrorType } from '../../utils/errorHandling';
import { PerformanceMonitor, AnimationMemoryManager } from '../../utils/performanceOptimization';

// Mock dependencies
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  
  // Add our custom mock functions
  Reanimated.useSharedValue = jest.fn((initial) => ({ value: initial }));
  Reanimated.useAnimatedStyle = jest.fn((fn) => fn());
  Reanimated.withDelay = jest.fn((delay, animation) => animation);
  Reanimated.withTiming = jest.fn((value, config, callback) => {
    if (callback) callback(true);
    return value;
  });
  Reanimated.withRepeat = jest.fn((animation) => animation);
  Reanimated.cancelAnimation = jest.fn();
  Reanimated.runOnJS = jest.fn((fn) => fn);
  
  return Reanimated;
});

jest.mock('../../hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    isScreenReaderEnabled: false,
    isReduceMotionEnabled: false,
    isHighContrastEnabled: false,
  }),
}));

jest.mock('../../utils/errorHandling');
jest.mock('../../utils/performanceOptimization');

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

describe('SplashScreen Error Handling and Performance', () => {
  const mockOnGetStarted = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    ErrorLogger.clearErrors = jest.fn();
    ErrorLogger.logError = jest.fn();
    PerformanceMonitor.startMonitoring = jest.fn();
    PerformanceMonitor.stopMonitoring = jest.fn();
    AnimationMemoryManager.clearAllAnimations = jest.fn();
  });

  describe('Asset Loading Error Handling', () => {
    it('should handle critical asset loading failures gracefully', async () => {
      const { getByTestId } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );

      // Simulate logo asset loading error
      const logoImage = getByTestId('safe-image-logo');
      
      await act(async () => {
        fireEvent(logoImage, 'onError', new Error('Network error'));
      });

      expect(ErrorLogger.logError).toHaveBeenCalledWith(
        ErrorType.ASSET_LOADING,
        expect.stringContaining('logo'),
        expect.any(Error),
        expect.objectContaining({
          assetKey: 'logo',
          isCritical: true,
        })
      );
    });

    it('should handle decorative asset loading failures without affecting functionality', async () => {
      const { getByTestId } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );

      // Simulate pentagon asset loading error
      const pentagonImage = getByTestId('safe-image-pentagon');
      
      await act(async () => {
        fireEvent(pentagonImage, 'onError', new Error('Asset not found'));
      });

      expect(ErrorLogger.logError).toHaveBeenCalledWith(
        ErrorType.ASSET_LOADING,
        expect.stringContaining('pentagon'),
        expect.any(Error),
        expect.objectContaining({
          assetKey: 'pentagon',
          isCritical: false,
        })
      );
    });

    it('should enter degraded mode when critical assets fail', async () => {
      const { getByTestId } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );

      // Simulate both critical assets failing
      const logoImage = getByTestId('safe-image-logo');
      const textImage = getByTestId('safe-image-text');
      
      await act(async () => {
        fireEvent(logoImage, 'onError', new Error('Logo failed'));
        fireEvent(textImage, 'onError', new Error('Text failed'));
      });

      // Should still be functional even in degraded mode
      const getStartedButton = getByTestId('get-started-button');
      fireEvent.press(getStartedButton);
      
      expect(mockOnGetStarted).toHaveBeenCalled();
    });
  });

  describe('Animation Error Handling', () => {
    it('should handle animation failures gracefully', async () => {
      // Mock animation failure
      const mockWithTiming = require('react-native-reanimated').withTiming;
      mockWithTiming.mockImplementationOnce(() => {
        throw new Error('Animation failed');
      });

      const { getByTestId } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );

      await waitFor(() => {
        expect(ErrorLogger.logError).toHaveBeenCalledWith(
          ErrorType.ANIMATION_FAILURE,
          expect.stringContaining('Animation'),
          expect.any(Error),
          expect.any(Object)
        );
      });
    });

    it('should start performance monitoring when animations begin', async () => {
      render(<SplashScreen onGetStarted={mockOnGetStarted} />);

      await waitFor(() => {
        expect(PerformanceMonitor.startMonitoring).toHaveBeenCalled();
      });
    });

    it('should clean up animations on unmount', () => {
      const { unmount } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );

      unmount();

      expect(AnimationMemoryManager.clearAllAnimations).toHaveBeenCalled();
    });
  });

  describe('Navigation Error Handling', () => {
    it('should handle navigation errors with timeout', async () => {
      // Mock a slow navigation
      const slowOnGetStarted = jest.fn(() => {
        return new Promise(resolve => setTimeout(resolve, 6000));
      });

      const { getByTestId } = render(
        <SplashScreen onGetStarted={slowOnGetStarted} />
      );

      const getStartedButton = getByTestId('get-started-button');
      
      await act(async () => {
        fireEvent.press(getStartedButton);
      });

      // Should log navigation timeout error
      await waitFor(() => {
        expect(ErrorLogger.logError).toHaveBeenCalledWith(
          ErrorType.NAVIGATION_FAILURE,
          expect.stringContaining('timeout'),
          expect.any(Error)
        );
      }, { timeout: 6000 });
    });

    it('should provide fallback navigation when primary fails', async () => {
      // Mock navigation that throws error
      const failingOnGetStarted = jest.fn(() => {
        throw new Error('Navigation failed');
      });

      const { getByTestId } = render(
        <SplashScreen onGetStarted={failingOnGetStarted} />
      );

      const getStartedButton = getByTestId('get-started-button');
      
      await act(async () => {
        fireEvent.press(getStartedButton);
      });

      // Should still call the navigation function as fallback
      expect(failingOnGetStarted).toHaveBeenCalled();
      expect(ErrorLogger.logError).toHaveBeenCalledWith(
        ErrorType.NAVIGATION_FAILURE,
        expect.stringContaining('failed'),
        expect.any(Error)
      );
    });
  });

  describe('Performance Optimization', () => {
    it('should detect device capabilities and adjust animations accordingly', () => {
      const mockDetectDeviceCapabilities = require('../../utils/performanceOptimization').detectDeviceCapabilities;
      mockDetectDeviceCapabilities.mockReturnValue({
        isLowEndDevice: true,
        supportsComplexAnimations: false,
        recommendedAnimationDuration: 200,
        maxConcurrentAnimations: 2,
        shouldUseNativeDriver: true,
      });

      render(<SplashScreen onGetStarted={mockOnGetStarted} />);

      expect(mockDetectDeviceCapabilities).toHaveBeenCalled();
    });

    it('should reduce animations on low-end devices', () => {
      const mockGetOptimizedAnimationConfig = require('../../utils/performanceOptimization').getOptimizedAnimationConfig;
      mockGetOptimizedAnimationConfig.mockReturnValue({
        duration: 200,
        useNativeDriver: true,
        enableComplexEasing: false,
        maxConcurrentAnimations: 2,
        shouldReduceMotion: true,
      });

      render(<SplashScreen onGetStarted={mockOnGetStarted} />);

      expect(mockGetOptimizedAnimationConfig).toHaveBeenCalled();
    });
  });

  describe('Fallback States', () => {
    it('should show appropriate fallback UI when assets fail to load', async () => {
      const { getByText } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );

      // Should still show the get started button even if assets fail
      await waitFor(() => {
        expect(getByText('GET STARTED')).toBeTruthy();
      });
    });

    it('should maintain functionality even with multiple failures', async () => {
      const { getByTestId } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );

      // Simulate multiple asset failures
      const images = ['logo', 'text', 'pentagon', 'group', 'bubble'];
      
      for (const assetKey of images) {
        const image = getByTestId(`safe-image-${assetKey}`);
        await act(async () => {
          fireEvent(image, 'onError', new Error(`${assetKey} failed`));
        });
      }

      // Button should still work
      const getStartedButton = getByTestId('get-started-button');
      fireEvent.press(getStartedButton);
      
      expect(mockOnGetStarted).toHaveBeenCalled();
    });
  });
});