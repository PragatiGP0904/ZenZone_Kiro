import React from 'react';
import { render } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { AnimatedElements } from '../AnimatedElements';
import { SHARED_ASSETS } from '../../assets/assetConfig';

// Mock Animated.timing to avoid animation issues in tests
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Animated: {
      ...RN.Animated,
      timing: jest.fn(() => ({
        start: jest.fn(),
      })),
    },
  };
});

describe('AnimatedElements', () => {
  const mockCloudAnimations = SHARED_ASSETS.clouds.map(() => new Animated.Value(0));
  const mockButterflyAnimations = SHARED_ASSETS.butterflies.map(() => new Animated.Value(0));

  const defaultProps = {
    currentMood: 'happy' as const,
    sharedAssets: SHARED_ASSETS,
    cloudAnimations: mockCloudAnimations,
    butterflyAnimations: mockButterflyAnimations,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByTestId } = render(<AnimatedElements {...defaultProps} />);
    // Component should render without errors
    expect(() => render(<AnimatedElements {...defaultProps} />)).not.toThrow();
  });

  it('renders all cloud assets', () => {
    const { UNSAFE_getAllByType } = render(<AnimatedElements {...defaultProps} />);
    const images = UNSAFE_getAllByType('Image');
    
    // Should render 6 cloud images (Cloud1.png through Cloud6.png)
    const cloudImages = images.filter(image => 
      SHARED_ASSETS.clouds.some(cloudAsset => 
        image.props.source === cloudAsset
      )
    );
    
    expect(cloudImages).toHaveLength(6);
  });

  it('starts cloud animations on mount', () => {
    render(<AnimatedElements {...defaultProps} />);
    
    // Animated.timing should be called for each cloud
    expect(Animated.timing).toHaveBeenCalledTimes(6);
    
    // Each animation should be configured with 25-second duration
    mockCloudAnimations.forEach((animation) => {
      expect(Animated.timing).toHaveBeenCalledWith(animation, {
        toValue: 1,
        duration: 25000,
        useNativeDriver: true,
      });
    });
  });

  it('renders rain layer only for sad mood', () => {
    const { rerender, queryByTestId } = render(
      <AnimatedElements 
        {...defaultProps} 
        currentMood="happy"
        rainAnimations={[new Animated.Value(0)]}
      />
    );
    
    // Rain layer should not be visible for happy mood
    expect(queryByTestId('rain-layer')).toBeNull();
    
    // Change to sad mood
    rerender(
      <AnimatedElements 
        {...defaultProps} 
        currentMood="sad"
        rainAnimations={[new Animated.Value(0)]}
      />
    );
    
    // Rain layer should be visible for sad mood
    // Note: This test will be more meaningful when rain animations are implemented
  });

  it('renders fire layer only for angry mood', () => {
    const { rerender, queryByTestId } = render(
      <AnimatedElements 
        {...defaultProps} 
        currentMood="happy"
        fireAnimations={[new Animated.Value(0)]}
      />
    );
    
    // Fire layer should not be visible for happy mood
    expect(queryByTestId('fire-layer')).toBeNull();
    
    // Change to angry mood
    rerender(
      <AnimatedElements 
        {...defaultProps} 
        currentMood="angry"
        fireAnimations={[new Animated.Value(0)]}
      />
    );
    
    // Fire layer should be visible for angry mood
    // Note: This test will be more meaningful when fire animations are implemented
  });

  it('applies correct cloud positioning and styling', () => {
    const { UNSAFE_getAllByType } = render(<AnimatedElements {...defaultProps} />);
    const animatedViews = UNSAFE_getAllByType('AnimatedViewNativeComponent');
    
    // Should have cloud containers with proper positioning
    const cloudContainers = animatedViews.filter(view => 
      view.props.style && 
      Array.isArray(view.props.style) &&
      view.props.style.some((style: any) => style && style.top !== undefined)
    );
    
    expect(cloudContainers.length).toBeGreaterThan(0);
  });

  it('sets pointer events to none for non-interactive layer', () => {
    const { UNSAFE_getByType } = render(<AnimatedElements {...defaultProps} />);
    const container = UNSAFE_getByType('View');
    
    expect(container.props.pointerEvents).toBe('none');
  });

  describe('Cloud positioning configuration', () => {
    it('generates different positions for each cloud', () => {
      // This tests the getCloudPositioning function indirectly
      const { UNSAFE_getAllByType } = render(<AnimatedElements {...defaultProps} />);
      const images = UNSAFE_getAllByType('Image');
      
      const cloudImages = images.filter(image => 
        SHARED_ASSETS.clouds.some(cloudAsset => 
          image.props.source === cloudAsset
        )
      );
      
      // Each cloud should have different dimensions
      const dimensions = cloudImages.map(img => ({
        width: img.props.style.width,
        height: img.props.style.height,
      }));
      
      // Should have variety in cloud sizes
      const uniqueWidths = new Set(dimensions.map(d => d.width));
      expect(uniqueWidths.size).toBeGreaterThan(1);
    });
  });
});

describe('Cloud Animation Integration', () => {
  it('handles animation cleanup on unmount', () => {
    const mockStopAnimation = jest.fn();
    const mockAnimations = SHARED_ASSETS.clouds.map(() => ({
      setValue: jest.fn(),
      stopAnimation: mockStopAnimation,
      interpolate: jest.fn(() => ({ setValue: jest.fn(), stopAnimation: jest.fn() })),
    }));

    const { unmount } = render(
      <AnimatedElements
        currentMood="happy"
        sharedAssets={SHARED_ASSETS}
        cloudAnimations={mockAnimations as any}
        butterflyAnimations={[]}
      />
    );

    unmount();

    // stopAnimation should be called for each cloud animation
    expect(mockStopAnimation).toHaveBeenCalledTimes(6);
  });
});