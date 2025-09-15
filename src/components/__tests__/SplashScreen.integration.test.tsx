import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SplashScreen from '../SplashScreen';

// Mock dependencies
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, ...props }: any) => {
    const { View } = require('react-native');
    return <View {...props}>{children}</View>;
  },
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  
  // Add our custom mock functions
  Reanimated.useSharedValue = jest.fn((initial) => ({ value: initial }));
  Reanimated.useAnimatedStyle = jest.fn((fn) => fn());
  Reanimated.withDelay = jest.fn((delay, animation) => animation);
  Reanimated.withTiming = jest.fn((value, config, callback) => {
    if (callback) setTimeout(() => callback(true), 0);
    return value;
  });
  Reanimated.withRepeat = jest.fn((animation) => animation);
  Reanimated.cancelAnimation = jest.fn();
  Reanimated.runOnJS = jest.fn((fn) => () => fn());
  
  return Reanimated;
});

jest.mock('../../hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    isScreenReaderEnabled: false,
    isReduceMotionEnabled: false,
    isHighContrastEnabled: false,
  }),
}));

// Mock the utility modules
jest.mock('../../utils/errorHandling', () => ({
  ErrorLogger: {
    logError: jest.fn(),
    clearErrors: jest.fn(),
    getErrors: jest.fn(() => []),
    getErrorsByType: jest.fn(() => []),
  },
  ErrorType: {
    ASSET_LOADING: 'ASSET_LOADING',
    ANIMATION_FAILURE: 'ANIMATION_FAILURE',
    NAVIGATION_FAILURE: 'NAVIGATION_FAILURE',
    PERFORMANCE_DEGRADATION: 'PERFORMANCE_DEGRADATION',
  },
  createInitialFallbackState: jest.fn(() => ({
    hasAssetErrors: false,
    hasAnimationErrors: false,
    hasNavigationErrors: false,
    degradedMode: false,
    failedAssets: new Set(),
  })),
  AssetRetryManager: {
    retryAssetLoad: jest.fn(() => Promise.resolve(true)),
    resetRetries: jest.fn(),
  },
  safeNavigate: jest.fn((fn) => {
    fn();
    return Promise.resolve(true);
  }),
}));

jest.mock('../../utils/performanceOptimization', () => ({
  detectDeviceCapabilities: jest.fn(() => ({
    isLowEndDevice: false,
    supportsComplexAnimations: true,
    recommendedAnimationDuration: 600,
    maxConcurrentAnimations: 6,
    shouldUseNativeDriver: true,
  })),
  getOptimizedAnimationConfig: jest.fn(() => ({
    duration: 600,
    useNativeDriver: true,
    enableComplexEasing: true,
    maxConcurrentAnimations: 6,
    shouldReduceMotion: false,
  })),
  PerformanceMonitor: {
    startMonitoring: jest.fn(),
    stopMonitoring: jest.fn(),
    reportFrameDrop: jest.fn(),
  },
  AnimationScheduler: {
    scheduleAnimation: jest.fn((id, priority, execute) => {
      setTimeout(execute, 0);
    }),
  },
  AnimationMemoryManager: {
    registerAnimation: jest.fn(() => true),
    unregisterAnimation: jest.fn(),
    clearAllAnimations: jest.fn(),
    getActiveAnimationCount: jest.fn(() => 0),
  },
}));

describe('SplashScreen Integration Tests', () => {
  const mockOnGetStarted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { getByText } = render(
      <SplashScreen onGetStarted={mockOnGetStarted} />
    );

    expect(getByText('GET STARTED')).toBeTruthy();
  });

  it('should handle complete user flow with error recovery', async () => {
    const { getByText } = render(
      <SplashScreen onGetStarted={mockOnGetStarted} />
    );

    // Wait for component to initialize
    await waitFor(() => {
      expect(getByText('GET STARTED')).toBeTruthy();
    });

    // Simulate user interaction
    const getStartedButton = getByText('GET STARTED');
    fireEvent.press(getStartedButton);

    // Verify navigation was called
    await waitFor(() => {
      expect(mockOnGetStarted).toHaveBeenCalled();
    });
  });

  it('should initialize performance monitoring', async () => {
    const { PerformanceMonitor } = require('../../utils/performanceOptimization');
    
    render(<SplashScreen onGetStarted={mockOnGetStarted} />);

    await waitFor(() => {
      expect(PerformanceMonitor.startMonitoring).toHaveBeenCalled();
    });
  });

  it('should detect device capabilities on mount', () => {
    const { detectDeviceCapabilities } = require('../../utils/performanceOptimization');
    
    render(<SplashScreen onGetStarted={mockOnGetStarted} />);

    expect(detectDeviceCapabilities).toHaveBeenCalled();
  });

  it('should schedule animations with proper priorities', async () => {
    const { AnimationScheduler } = require('../../utils/performanceOptimization');
    
    render(<SplashScreen onGetStarted={mockOnGetStarted} />);

    await waitFor(() => {
      expect(AnimationScheduler.scheduleAnimation).toHaveBeenCalled();
    });

    // Verify high priority animations (logo, text) are scheduled
    const calls = AnimationScheduler.scheduleAnimation.mock.calls;
    const logoCalls = calls.filter(call => call[0] === 'logo');
    const textCalls = calls.filter(call => call[0] === 'text');
    
    expect(logoCalls.length).toBeGreaterThan(0);
    expect(textCalls.length).toBeGreaterThan(0);
  });

  it('should clean up resources on unmount', () => {
    const { AnimationMemoryManager } = require('../../utils/performanceOptimization');
    
    const { unmount } = render(
      <SplashScreen onGetStarted={mockOnGetStarted} />
    );

    unmount();

    expect(AnimationMemoryManager.clearAllAnimations).toHaveBeenCalled();
  });

  it('should handle navigation with error recovery', async () => {
    const { safeNavigate } = require('../../utils/errorHandling');
    
    const { getByText } = render(
      <SplashScreen onGetStarted={mockOnGetStarted} />
    );

    const getStartedButton = getByText('GET STARTED');
    fireEvent.press(getStartedButton);

    await waitFor(() => {
      expect(safeNavigate).toHaveBeenCalled();
    });
  });

  it('should maintain accessibility during error states', async () => {
    const { getByText, getByLabelText } = render(
      <SplashScreen onGetStarted={mockOnGetStarted} />
    );

    // Button should remain accessible even if assets fail
    const button = getByText('GET STARTED');
    expect(button).toBeTruthy();
    
    // Should have proper accessibility labels
    expect(button.props.accessibilityRole).toBe('button');
    expect(button.props.accessibilityLabel).toBe('Get Started');
  });

  it('should work in degraded mode', async () => {
    // Mock degraded mode
    const { createInitialFallbackState } = require('../../utils/errorHandling');
    createInitialFallbackState.mockReturnValue({
      hasAssetErrors: true,
      hasAnimationErrors: true,
      hasNavigationErrors: false,
      degradedMode: true,
      failedAssets: new Set(['logo', 'text']),
    });

    const { getByText } = render(
      <SplashScreen onGetStarted={mockOnGetStarted} />
    );

    // Should still render and be functional
    const getStartedButton = getByText('GET STARTED');
    fireEvent.press(getStartedButton);

    await waitFor(() => {
      expect(mockOnGetStarted).toHaveBeenCalled();
    });
  });
});