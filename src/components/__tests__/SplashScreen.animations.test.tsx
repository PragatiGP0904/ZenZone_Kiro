import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { SplashScreen } from '../SplashScreen';

// Mock react-native-reanimated with more detailed mocks
const mockSharedValue = jest.fn((initialValue) => ({
  value: initialValue,
  addListener: jest.fn(),
  removeListener: jest.fn(),
}));

const mockUseAnimatedStyle = jest.fn((callback) => {
  return callback();
});

const mockWithTiming = jest.fn((toValue, config, callback) => {
  // Simulate animation completion
  if (callback) {
    setTimeout(() => callback(true), 100);
  }
  return toValue;
});

const mockWithDelay = jest.fn((delay, animation) => animation);
const mockWithRepeat = jest.fn((animation) => animation);
const mockCancelAnimation = jest.fn();
const mockRunOnJS = jest.fn((callback) => () => callback());

jest.mock('react-native-reanimated', () => ({
  useSharedValue: mockSharedValue,
  useAnimatedStyle: mockUseAnimatedStyle,
  withTiming: mockWithTiming,
  withDelay: mockWithDelay,
  withRepeat: mockWithRepeat,
  cancelAnimation: mockCancelAnimation,
  runOnJS: mockRunOnJS,
  Easing: {
    ease: 'ease',
    out: jest.fn((fn) => fn),
    back: jest.fn(() => 'back'),
    inOut: jest.fn((fn) => fn),
    bezier: jest.fn(() => 'bezier'),
  },
}));

// Mock other dependencies
jest.mock('../../hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    isScreenReaderEnabled: false,
    isReduceMotionEnabled: false,
    isHighContrastEnabled: false,
  }),
}));

jest.mock('../../utils/errorHandling', () => ({
  ErrorLogger: {
    logError: jest.fn(),
  },
  ErrorType: {
    ANIMATION_FAILURE: 'ANIMATION_FAILURE',
    ASSET_LOADING: 'ASSET_LOADING',
    NAVIGATION_FAILURE: 'NAVIGATION_FAILURE',
  },
  createInitialFallbackState: () => ({
    hasAssetErrors: false,
    hasAnimationErrors: false,
    hasNavigationErrors: false,
    degradedMode: false,
    failedAssets: new Set(),
  }),
  safeNavigate: jest.fn((successCallback) => {
    successCallback();
    return Promise.resolve(true);
  }),
}));

jest.mock('../../utils/performanceOptimization', () => ({
  detectDeviceCapabilities: () => ({
    isLowEndDevice: false,
    supportsComplexAnimations: true,
    maxConcurrentAnimations: 10,
  }),
  getOptimizedAnimationConfig: () => ({
    duration: 800,
    shouldReduceMotion: false,
    enableComplexEasing: true,
  }),
  PerformanceMonitor: {
    startMonitoring: jest.fn(),
    stopMonitoring: jest.fn(),
  },
  AnimationScheduler: {
    scheduleAnimation: jest.fn((id, priority, callback) => {
      // Simulate async animation scheduling
      setTimeout(callback, 10);
    }),
  },
  AnimationMemoryManager: {
    clearAllAnimations: jest.fn(),
  },
}));

describe('SplashScreen Animation Integration Tests', () => {
  const mockOnGetStarted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Animation Initialization', () => {
    it('should initialize all animation shared values', () => {
      render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      // Verify shared values are created for all animations
      expect(mockSharedValue).toHaveBeenCalledWith(0); // logoScale
      expect(mockSharedValue).toHaveBeenCalledWith(expect.any(Number)); // textTranslateX
      expect(mockSharedValue).toHaveBeenCalledWith(0); // textOpacity
      expect(mockSharedValue).toHaveBeenCalledWith(0.6); // pentagonShimmer
      expect(mockSharedValue).toHaveBeenCalledWith(0); // groupFloatY
      expect(mockSharedValue).toHaveBeenCalledWith(0.7); // groupShimmer
    });

    it('should create animated styles for all elements', () => {
      render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      // Verify animated styles are created
      expect(mockUseAnimatedStyle).toHaveBeenCalled();
    });
  });

  describe('Logo Animation Sequence', () => {
    it('should trigger logo pop-out animation on mount', async () => {
      render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      
      expect(mockWithTiming).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          duration: expect.any(Number),
          easing: expect.any(String),
        }),
        expect.any(Function)
      );
    });

    it('should use delay for logo animation', async () => {
      render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      
      expect(mockWithDelay).toHaveBeenCalled();
    });
  });

  describe('Text Animation Sequence', () => {
    it('should trigger text slide-in animation after logo', async () => {
      render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      await act(async () => {
        jest.advanceTimersByTime(1500);
      });
      
      // Text animation should be triggered
      expect(mockWithTiming).toHaveBeenCalledWith(
        0,
        expect.objectContaining({
          duration: expect.any(Number),
        }),
        expect.any(Function)
      );
    });

    it('should animate text opacity alongside slide-in', async () => {
      render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      await act(async () => {
        jest.advanceTimersByTime(1500);
      });
      
      // Opacity animation should be triggered
      expect(mockWithTiming).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          duration: expect.any(Number),
        })
      );
    });
  });

  describe('Continuous Animations', () => {
    it('should start pentagon shimmer animation', async () => {
      render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      
      expect(mockWithRepeat).toHaveBeenCalled();
    });

    it('should start group floating animation', async () => {
      render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      
      expect(mockWithRepeat).toHaveBeenCalled();
    });

    it('should start bubble floating animations', async () => {
      render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });
      
      // Multiple bubble animations should be started
      expect(mockWithRepeat).toHaveBeenCalledTimes(expect.any(Number));
    });
  });

  describe('Animation Cleanup', () => {
    it('should cancel animations on unmount', () => {
      const { unmount } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      unmount();
      
      expect(mockCancelAnimation).toHaveBeenCalled();
    });

    it('should clear animation memory on unmount', () => {
      const { unmount } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      unmount();
      
      const { AnimationMemoryManager } = require('../../utils/performanceOptimization');
      expect(AnimationMemoryManager.clearAllAnimations).toHaveBeenCalled();
    });
  });

  describe('Performance Monitoring', () => {
    it('should start performance monitoring when animations begin', async () => {
      render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      await act(async () => {
        jest.advanceTimersByTime(100);
      });
      
      const { PerformanceMonitor } = require('../../utils/performanceOptimization');
      expect(PerformanceMonitor.startMonitoring).toHaveBeenCalled();
    });

    it('should stop performance monitoring after timeout', async () => {
      render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      await act(async () => {
        jest.advanceTimersByTime(6000); // Beyond 5 second timeout
      });
      
      const { PerformanceMonitor } = require('../../utils/performanceOptimization');
      expect(PerformanceMonitor.stopMonitoring).toHaveBeenCalled();
    });
  });

  describe('Animation Error Handling', () => {
    it('should handle animation failures gracefully', async () => {
      // Mock animation failure
      mockWithTiming.mockImplementationOnce(() => {
        throw new Error('Animation failed');
      });
      
      render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      
      const { ErrorLogger } = require('../../utils/errorHandling');
      expect(ErrorLogger.logError).toHaveBeenCalledWith(
        'ANIMATION_FAILURE',
        expect.stringContaining('Animation'),
        expect.any(Error),
        expect.any(Object)
      );
    });
  });

  describe('Reduced Motion Support', () => {
    it('should respect reduced motion preferences', () => {
      // Mock reduced motion enabled
      jest.doMock('../../hooks/useAccessibility', () => ({
        useAccessibility: () => ({
          isScreenReaderEnabled: false,
          isReduceMotionEnabled: true,
          isHighContrastEnabled: false,
        }),
      }));
      
      render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      // Should still render without errors
      expect(mockSharedValue).toHaveBeenCalled();
    });
  });

  describe('Animation Sequencing', () => {
    it('should schedule animations with correct priorities', async () => {
      render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      await act(async () => {
        jest.advanceTimersByTime(500);
      });
      
      const { AnimationScheduler } = require('../../utils/performanceOptimization');
      expect(AnimationScheduler.scheduleAnimation).toHaveBeenCalledWith(
        'logo',
        10,
        expect.any(Function)
      );
      expect(AnimationScheduler.scheduleAnimation).toHaveBeenCalledWith(
        'text',
        9,
        expect.any(Function)
      );
    });
  });
});