import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { SunflowerDisplay } from '../SunflowerDisplay';
import { MOOD_CONFIGS } from '../../assets/assetConfig';

// Mock Animated.Image
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Animated: {
      ...RN.Animated,
      Image: 'Animated.Image',
      View: 'Animated.View',
    },
  };
});

describe('SunflowerDisplay', () => {
  const mockSwayAnimation = new Animated.Value(0);
  const mockBlinkAnimation = new Animated.Value(0);
  const mockOnTap = jest.fn();

  const defaultProps = {
    currentMood: 'happy' as const,
    moodAssets: MOOD_CONFIGS.happy.assets,
    swayAnimation: mockSwayAnimation,
    blinkAnimation: mockBlinkAnimation,
    onTap: mockOnTap,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with happy mood assets', () => {
    const { getByTestId } = render(<SunflowerDisplay {...defaultProps} />);
    
    // Component should render without crashing
    expect(() => render(<SunflowerDisplay {...defaultProps} />)).not.toThrow();
  });

  it('renders correctly with sad mood assets', () => {
    const sadProps = {
      ...defaultProps,
      currentMood: 'sad' as const,
      moodAssets: MOOD_CONFIGS.sad.assets,
    };

    expect(() => render(<SunflowerDisplay {...sadProps} />)).not.toThrow();
  });

  it('renders correctly with angry mood assets', () => {
    const angryProps = {
      ...defaultProps,
      currentMood: 'angry' as const,
      moodAssets: MOOD_CONFIGS.angry.assets,
    };

    expect(() => render(<SunflowerDisplay {...angryProps} />)).not.toThrow();
  });

  it('calls onTap when sunflower is pressed', () => {
    const { getByRole } = render(<SunflowerDisplay {...defaultProps} />);
    
    const touchableArea = getByRole('button');
    fireEvent.press(touchableArea);
    
    expect(mockOnTap).toHaveBeenCalledTimes(1);
  });

  it('renders all three layers (sunflower, petals, face)', () => {
    const { UNSAFE_getAllByType } = render(<SunflowerDisplay {...defaultProps} />);
    
    // Should have 3 Animated.Image components (sunflower, petals, face)
    const animatedImages = UNSAFE_getAllByType('Animated.Image');
    expect(animatedImages).toHaveLength(3);
  });

  it('applies sway animation transform', () => {
    const { UNSAFE_getByType } = render(<SunflowerDisplay {...defaultProps} />);
    
    // Should have an Animated.View with transform style
    const animatedView = UNSAFE_getByType('Animated.View');
    expect(animatedView.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          transform: expect.any(Array),
        }),
      ])
    );
  });

  it('applies blink animation to face layer', () => {
    const { UNSAFE_getAllByType } = render(<SunflowerDisplay {...defaultProps} />);
    
    const animatedImages = UNSAFE_getAllByType('Animated.Image');
    // The face layer (third image) should have opacity animation
    const faceLayer = animatedImages[2];
    expect(faceLayer.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          opacity: expect.any(Object), // Animated interpolation
        }),
      ])
    );
  });

  it('uses correct asset sources for each mood', () => {
    const { UNSAFE_getAllByType, rerender } = render(<SunflowerDisplay {...defaultProps} />);
    
    // Test happy mood assets
    let animatedImages = UNSAFE_getAllByType('Animated.Image');
    expect(animatedImages[0].props.source).toBe(MOOD_CONFIGS.happy.assets.sunflower);
    expect(animatedImages[1].props.source).toBe(MOOD_CONFIGS.happy.assets.petals);
    expect(animatedImages[2].props.source).toBe(MOOD_CONFIGS.happy.assets.faceExpression);

    // Test sad mood assets
    const sadProps = {
      ...defaultProps,
      currentMood: 'sad' as const,
      moodAssets: MOOD_CONFIGS.sad.assets,
    };
    rerender(<SunflowerDisplay {...sadProps} />);
    
    animatedImages = UNSAFE_getAllByType('Animated.Image');
    expect(animatedImages[0].props.source).toBe(MOOD_CONFIGS.sad.assets.sunflower);
    expect(animatedImages[1].props.source).toBe(MOOD_CONFIGS.sad.assets.petals);
    expect(animatedImages[2].props.source).toBe(MOOD_CONFIGS.sad.assets.faceExpression);

    // Test angry mood assets
    const angryProps = {
      ...defaultProps,
      currentMood: 'angry' as const,
      moodAssets: MOOD_CONFIGS.angry.assets,
    };
    rerender(<SunflowerDisplay {...angryProps} />);
    
    animatedImages = UNSAFE_getAllByType('Animated.Image');
    expect(animatedImages[0].props.source).toBe(MOOD_CONFIGS.angry.assets.sunflower);
    expect(animatedImages[1].props.source).toBe(MOOD_CONFIGS.angry.assets.petals);
    expect(animatedImages[2].props.source).toBe(MOOD_CONFIGS.angry.assets.faceExpression);
  });

  it('handles missing onTap prop gracefully', () => {
    const propsWithoutOnTap = {
      ...defaultProps,
      onTap: undefined,
    };

    expect(() => render(<SunflowerDisplay {...propsWithoutOnTap} />)).not.toThrow();
  });

  it('has proper layering with z-index values', () => {
    const { UNSAFE_getAllByType } = render(<SunflowerDisplay {...defaultProps} />);
    
    const animatedImages = UNSAFE_getAllByType('Animated.Image');
    
    // Check that each layer has the correct z-index
    expect(animatedImages[0].props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ zIndex: 1 }), // sunflower base
      ])
    );
    expect(animatedImages[1].props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ zIndex: 2 }), // petals
      ])
    );
    expect(animatedImages[2].props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ zIndex: 3 }), // face
      ])
    );
  });
});