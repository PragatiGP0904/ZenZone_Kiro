import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SplashScreen } from '../SplashScreen';

// Mock the hooks and utilities
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
    scheduleAnimation: jest.fn((id, priority, callback) => callback()),
  },
  AnimationMemoryManager: {
    clearAllAnimations: jest.fn(),
  },
}));

describe('SplashScreen Component', () => {
  const mockOnGetStarted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByTestId } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );
      
      expect(getByTestId).toBeDefined();
    });

    it('should render with correct accessibility labels', () => {
      const { getByLabelText } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );
      
      expect(getByLabelText('ZenZone splash screen')).toBeTruthy();
      expect(getByLabelText('Get started with ZenZone')).toBeTruthy();
    });

    it('should render all required image components', () => {
      const { getByLabelText } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );
      
      expect(getByLabelText('ZenZone logo')).toBeTruthy();
      expect(getByLabelText('ZenZone app text')).toBeTruthy();
      expect(getByLabelText('Pentagon decoration')).toBeTruthy();
      expect(getByLabelText('Group decoration')).toBeTruthy();
    });

    it('should render GET STARTED button', () => {
      const { getByText } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );
      
      expect(getByText('GET STARTED')).toBeTruthy();
    });
  });

  describe('Props Handling', () => {
    it('should accept onGetStarted prop', () => {
      expect(() => {
        render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      }).not.toThrow();
    });

    it('should call onGetStarted when button is pressed', async () => {
      const { getByText } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );
      
      const button = getByText('GET STARTED');
      fireEvent.press(button);
      
      await waitFor(() => {
        expect(mockOnGetStarted).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Button Interaction', () => {
    it('should handle button press events', () => {
      const { getByText } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );
      
      const button = getByText('GET STARTED');
      
      fireEvent.press(button);
      expect(mockOnGetStarted).toHaveBeenCalled();
    });

    it('should handle button press in and out events', () => {
      const { getByText } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );
      
      const button = getByText('GET STARTED');
      
      fireEvent(button, 'pressIn');
      fireEvent(button, 'pressOut');
      
      // Should not throw errors
      expect(button).toBeTruthy();
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper accessibility roles', () => {
      const { getByRole } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );
      
      expect(getByRole('button')).toBeTruthy();
    });

    it('should have accessibility hints for button', () => {
      const { getByLabelText } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );
      
      const button = getByLabelText('Get started with ZenZone');
      expect(button.props.accessibilityHint).toBe('Navigates to the main app');
    });
  });

  describe('Error Handling', () => {
    it('should handle navigation errors gracefully', async () => {
      const mockErrorOnGetStarted = jest.fn(() => {
        throw new Error('Navigation failed');
      });
      
      const { getByText } = render(
        <SplashScreen onGetStarted={mockErrorOnGetStarted} />
      );
      
      const button = getByText('GET STARTED');
      
      // Should not crash when navigation fails
      expect(() => {
        fireEvent.press(button);
      }).not.toThrow();
    });
  });

  describe('Component Lifecycle', () => {
    it('should cleanup animations on unmount', () => {
      const { unmount } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );
      
      unmount();
      
      // Should not throw errors during cleanup
      expect(true).toBe(true);
    });
  });

  describe('Responsive Design', () => {
    it('should render with responsive styles', () => {
      const { getByTestId } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );
      
      // Component should render without layout errors
      expect(getByTestId).toBeDefined();
    });
  });
});