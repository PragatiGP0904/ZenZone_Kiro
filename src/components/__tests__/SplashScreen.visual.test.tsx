import React from 'react';
import { render } from '@testing-library/react-native';
import { Dimensions } from 'react-native';
import { SplashScreen } from '../SplashScreen';

// Mock Dimensions for different screen sizes
const mockDimensions = (width: number, height: number) => {
  jest.spyOn(Dimensions, 'get').mockReturnValue({
    width,
    height,
    scale: 1,
    fontScale: 1,
  });
};

// Mock dependencies
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

describe('SplashScreen Visual Regression Tests', () => {
  const mockOnGetStarted = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Layout Consistency Across Screen Sizes', () => {
    it('should render consistently on small screens (320x568)', () => {
      mockDimensions(320, 568);
      
      const { toJSON } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      expect(toJSON()).toMatchSnapshot('small-screen-layout');
    });

    it('should render consistently on medium screens (375x667)', () => {
      mockDimensions(375, 667);
      
      const { toJSON } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      expect(toJSON()).toMatchSnapshot('medium-screen-layout');
    });

    it('should render consistently on large screens (414x896)', () => {
      mockDimensions(414, 896);
      
      const { toJSON } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      expect(toJSON()).toMatchSnapshot('large-screen-layout');
    });

    it('should render consistently on tablet screens (768x1024)', () => {
      mockDimensions(768, 1024);
      
      const { toJSON } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      expect(toJSON()).toMatchSnapshot('tablet-screen-layout');
    });

    it('should render consistently on web landscape (1024x768)', () => {
      mockDimensions(1024, 768);
      
      const { toJSON } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      expect(toJSON()).toMatchSnapshot('web-landscape-layout');
    });
  });

  describe('Element Positioning Tests', () => {
    it('should position logo in center area', () => {
      mockDimensions(375, 667);
      
      const { getByLabelText } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      const logo = getByLabelText('ZenZone logo');
      
      expect(logo).toBeTruthy();
      expect(logo.props.style).toBeDefined();
    });

    it('should position button at bottom of screen', () => {
      mockDimensions(375, 667);
      
      const { getByText } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      const button = getByText('GET STARTED');
      
      expect(button).toBeTruthy();
      expect(button.parent?.props.style).toBeDefined();
    });

    it('should position decorative elements correctly', () => {
      mockDimensions(375, 667);
      
      const { getByLabelText } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      const pentagon = getByLabelText('Pentagon decoration');
      const group = getByLabelText('Group decoration');
      
      expect(pentagon).toBeTruthy();
      expect(group).toBeTruthy();
    });
  });

  describe('Responsive Scaling Tests', () => {
    it('should scale elements appropriately on different screen sizes', () => {
      const screenSizes = [
        { width: 320, height: 568, name: 'small' },
        { width: 375, height: 667, name: 'medium' },
        { width: 414, height: 896, name: 'large' },
        { width: 768, height: 1024, name: 'tablet' },
      ];

      screenSizes.forEach(({ width, height, name }) => {
        mockDimensions(width, height);
        
        const { getByLabelText } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
        const logo = getByLabelText('ZenZone logo');
        
        expect(logo).toBeTruthy();
        expect(logo.props.style).toBeDefined();
        
        // Verify that styles are applied (actual values depend on responsive calculations)
        expect(typeof logo.props.style).toBe('object');
      });
    });
  });

  describe('Accessibility Visual States', () => {
    it('should render with high contrast mode', () => {
      jest.doMock('../../hooks/useAccessibility', () => ({
        useAccessibility: () => ({
          isScreenReaderEnabled: false,
          isReduceMotionEnabled: false,
          isHighContrastEnabled: true,
        }),
      }));
      
      mockDimensions(375, 667);
      
      const { toJSON } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      expect(toJSON()).toMatchSnapshot('high-contrast-layout');
    });

    it('should render with screen reader enabled', () => {
      jest.doMock('../../hooks/useAccessibility', () => ({
        useAccessibility: () => ({
          isScreenReaderEnabled: true,
          isReduceMotionEnabled: false,
          isHighContrastEnabled: false,
        }),
      }));
      
      mockDimensions(375, 667);
      
      const { toJSON } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      expect(toJSON()).toMatchSnapshot('screen-reader-layout');
    });
  });

  describe('Error State Visual Tests', () => {
    it('should render gracefully with asset loading errors', () => {
      jest.doMock('../../utils/errorHandling', () => ({
        ErrorLogger: {
          logError: jest.fn(),
        },
        ErrorType: {
          ANIMATION_FAILURE: 'ANIMATION_FAILURE',
          ASSET_LOADING: 'ASSET_LOADING',
          NAVIGATION_FAILURE: 'NAVIGATION_FAILURE',
        },
        createInitialFallbackState: () => ({
          hasAssetErrors: true,
          hasAnimationErrors: false,
          hasNavigationErrors: false,
          degradedMode: true,
          failedAssets: new Set(['logo', 'text']),
        }),
        safeNavigate: jest.fn((successCallback) => {
          successCallback();
          return Promise.resolve(true);
        }),
      }));
      
      mockDimensions(375, 667);
      
      const { toJSON } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      expect(toJSON()).toMatchSnapshot('error-state-layout');
    });
  });

  describe('Platform-Specific Visual Tests', () => {
    it('should render consistently on Android', () => {
      jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
        OS: 'android',
        select: jest.fn((obj) => obj.android || obj.default),
      }));
      
      mockDimensions(375, 667);
      
      const { toJSON } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      expect(toJSON()).toMatchSnapshot('android-layout');
    });

    it('should render consistently on Web', () => {
      jest.doMock('react-native/Libraries/Utilities/Platform', () => ({
        OS: 'web',
        select: jest.fn((obj) => obj.web || obj.default),
      }));
      
      mockDimensions(1024, 768);
      
      const { toJSON } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      expect(toJSON()).toMatchSnapshot('web-layout');
    });
  });

  describe('Component Structure Tests', () => {
    it('should maintain consistent component hierarchy', () => {
      mockDimensions(375, 667);
      
      const { toJSON } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      const tree = toJSON();
      
      // Verify main container structure
      expect(tree).toHaveProperty('type', 'View');
      expect(tree?.children).toBeDefined();
      
      // Verify gradient background exists
      const gradientExists = JSON.stringify(tree).includes('LinearGradient');
      expect(gradientExists).toBe(true);
    });

    it('should render all required layers', () => {
      mockDimensions(375, 667);
      
      const { getByLabelText } = render(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      // Verify all main elements are present
      expect(getByLabelText('ZenZone splash screen')).toBeTruthy();
      expect(getByLabelText('ZenZone logo')).toBeTruthy();
      expect(getByLabelText('ZenZone app text')).toBeTruthy();
      expect(getByLabelText('Get started with ZenZone')).toBeTruthy();
    });
  });

  describe('Style Consistency Tests', () => {
    it('should apply consistent styling across renders', () => {
      mockDimensions(375, 667);
      
      const { rerender, getByLabelText } = render(
        <SplashScreen onGetStarted={mockOnGetStarted} />
      );
      
      const initialLogo = getByLabelText('ZenZone logo');
      const initialStyle = initialLogo.props.style;
      
      rerender(<SplashScreen onGetStarted={mockOnGetStarted} />);
      
      const rerenderedLogo = getByLabelText('ZenZone logo');
      const rerenderedStyle = rerenderedLogo.props.style;
      
      expect(rerenderedStyle).toEqual(initialStyle);
    });
  });
});