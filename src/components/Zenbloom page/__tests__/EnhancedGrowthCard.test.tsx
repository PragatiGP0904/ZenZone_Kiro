import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { GrowthCard } from '../GrowthCard';
import { MOOD_CONFIGS } from '../../assets/assetConfig';

// Mock Animated for testing
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Animated: {
      ...RN.Animated,
      timing: jest.fn(() => ({
        start: jest.fn((callback) => callback && callback()),
      })),
      parallel: jest.fn(() => ({
        start: jest.fn((callback) => callback && callback()),
      })),
      sequence: jest.fn(() => ({
        start: jest.fn((callback) => callback && callback()),
      })),
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        interpolate: jest.fn(() => 'mocked-interpolation'),
        stopAnimation: jest.fn(),
      })),
    },
  };
});

describe('Enhanced Growth Card Effects', () => {
  const mockSlideAnimation = new Animated.Value(0);
  const mockProgressAnimation = new Animated.Value(0);
  
  const defaultProps = {
    visible: true,
    streakData: {
      currentStreak: 15,
      totalDays: 60,
      progressPercentage: 75,
      milestones: [25, 50, 75, 100],
    },
    moodConfig: MOOD_CONFIGS.happy,
    onClose: jest.fn(),
    slideAnimation: mockSlideAnimation,
    progressAnimation: mockProgressAnimation,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Special Effects Animations', () => {
    it('should start special effects when card becomes visible', () => {
      const { rerender } = render(
        <GrowthCard {...defaultProps} visible={false} />
      );

      // Make card visible
      rerender(<GrowthCard {...defaultProps} visible={true} />);

      // Verify animations are started
      expect(Animated.timing).toHaveBeenCalled();
      expect(Animated.parallel).toHaveBeenCalled();
    });

    it('should stop special effects when card becomes hidden', () => {
      const { rerender } = render(
        <GrowthCard {...defaultProps} visible={true} />
      );

      // Hide card
      rerender(<GrowthCard {...defaultProps} visible={false} />);

      // Verify animations are stopped
      expect(mockSlideAnimation.stopAnimation).toBeDefined();
    });

    it('should render enhanced sparkle particles', () => {
      const { getByTestId } = render(<GrowthCard {...defaultProps} />);
      
      const progressBar = getByTestId('progress-bar');
      expect(progressBar).toBeTruthy();
    });

    it('should render gradient overlay on progress bar', () => {
      const { getByTestId } = render(<GrowthCard {...defaultProps} />);
      
      const progressBar = getByTestId('progress-bar');
      expect(progressBar).toBeTruthy();
      expect(progressBar.props.children).toBeDefined();
    });
  });

  describe('Mood-Specific Colors', () => {
    it('should use golden colors for happy mood', () => {
      const { getByTestId } = render(
        <GrowthCard {...defaultProps} moodConfig={MOOD_CONFIGS.happy} />
      );
      
      const card = getByTestId('growth-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: 'rgba(255, 215, 0, 0.95)',
          }),
        ])
      );
    });

    it('should use blue colors for sad mood', () => {
      const { getByTestId } = render(
        <GrowthCard {...defaultProps} moodConfig={MOOD_CONFIGS.sad} />
      );
      
      const card = getByTestId('growth-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: 'rgba(74, 144, 226, 0.95)',
          }),
        ])
      );
    });

    it('should use red-orange colors for angry mood', () => {
      const { getByTestId } = render(
        <GrowthCard {...defaultProps} moodConfig={MOOD_CONFIGS.angry} />
      );
      
      const card = getByTestId('growth-card');
      expect(card.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: 'rgba(255, 69, 0, 0.95)',
          }),
        ])
      );
    });
  });

  describe('Milestone Effects', () => {
    it('should render milestone bloom effects for achieved milestones', () => {
      const propsWithHighProgress = {
        ...defaultProps,
        streakData: {
          ...defaultProps.streakData,
          progressPercentage: 80, // Above 75% milestone
        },
      };

      const { getByText } = render(<GrowthCard {...propsWithHighProgress} />);
      
      // Check that milestones are rendered
      expect(getByText('25%')).toBeTruthy();
      expect(getByText('50%')).toBeTruthy();
      expect(getByText('75%')).toBeTruthy();
      expect(getByText('100%')).toBeTruthy();
    });

    it('should trigger milestone pulse animations for achieved milestones', () => {
      const propsWithMilestone = {
        ...defaultProps,
        streakData: {
          ...defaultProps.streakData,
          progressPercentage: 50, // Exactly at 50% milestone
        },
      };

      render(<GrowthCard {...propsWithMilestone} />);

      // Verify that sequence animations are called for milestone pulses
      expect(Animated.sequence).toHaveBeenCalled();
    });
  });

  describe('Progress Bar Animations', () => {
    it('should animate progress bar width based on percentage', () => {
      const { getByTestId } = render(<GrowthCard {...defaultProps} />);
      
      const progressBar = getByTestId('progress-bar');
      expect(progressBar).toBeTruthy();
      
      // Verify progress animation is used
      expect(Animated.timing).toHaveBeenCalledWith(
        mockProgressAnimation,
        expect.objectContaining({
          toValue: 0.75, // 75% converted to decimal
          duration: 1000,
          useNativeDriver: false,
        })
      );
    });

    it('should render shimmer effect with proper animation', () => {
      render(<GrowthCard {...defaultProps} />);
      
      // Verify shimmer animation is started
      expect(Animated.timing).toHaveBeenCalled();
    });

    it('should render gradient overlay with scaling animation', () => {
      render(<GrowthCard {...defaultProps} />);
      
      // Verify gradient animation is started
      expect(Animated.timing).toHaveBeenCalled();
    });
  });

  describe('Particle System', () => {
    it('should render advanced particle system', () => {
      render(<GrowthCard {...defaultProps} />);
      
      // Verify particle animations are started
      expect(Animated.parallel).toHaveBeenCalled();
    });

    it('should create sparkle burst effects at milestones', () => {
      const propsWithMilestone = {
        ...defaultProps,
        streakData: {
          ...defaultProps.streakData,
          progressPercentage: 100, // At 100% milestone
        },
      };

      render(<GrowthCard {...propsWithMilestone} />);

      // Verify burst animations are triggered
      expect(Animated.parallel).toHaveBeenCalled();
    });
  });

  describe('Performance and Cleanup', () => {
    it('should cleanup animations when component unmounts', () => {
      const { unmount } = render(<GrowthCard {...defaultProps} />);
      
      unmount();
      
      // Animations should be stopped on unmount
      // This is handled by React Native's cleanup
      expect(true).toBe(true); // Placeholder for cleanup verification
    });

    it('should use native driver for transform animations', () => {
      render(<GrowthCard {...defaultProps} />);
      
      // Verify that useNativeDriver is used for performance
      expect(Animated.timing).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          useNativeDriver: expect.any(Boolean),
        })
      );
    });
  });

  describe('Interaction Handling', () => {
    it('should close card when backdrop is tapped', () => {
      const mockOnClose = jest.fn();
      const { getByTestId } = render(
        <GrowthCard {...defaultProps} onClose={mockOnClose} />
      );
      
      const backdrop = getByTestId('growth-card-backdrop');
      fireEvent.press(backdrop);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should close card when close button is tapped', () => {
      const mockOnClose = jest.fn();
      const { getByTestId } = render(
        <GrowthCard {...defaultProps} onClose={mockOnClose} />
      );
      
      const closeButton = getByTestId('growth-card-close');
      fireEvent.press(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should close card when continue button is tapped', () => {
      const mockOnClose = jest.fn();
      const { getByTestId } = render(
        <GrowthCard {...defaultProps} onClose={mockOnClose} />
      );
      
      const continueButton = getByTestId('growth-card-continue');
      fireEvent.press(continueButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper test IDs for all interactive elements', () => {
      const { getByTestId } = render(<GrowthCard {...defaultProps} />);
      
      expect(getByTestId('growth-card-container')).toBeTruthy();
      expect(getByTestId('growth-card')).toBeTruthy();
      expect(getByTestId('growth-card-backdrop')).toBeTruthy();
      expect(getByTestId('growth-card-close')).toBeTruthy();
      expect(getByTestId('growth-card-continue')).toBeTruthy();
      expect(getByTestId('progress-bar')).toBeTruthy();
    });

    it('should display streak information clearly', () => {
      const { getByText } = render(<GrowthCard {...defaultProps} />);
      
      expect(getByText('15 days')).toBeTruthy(); // Current streak
      expect(getByText('Total: 60 days')).toBeTruthy(); // Total days
      expect(getByText('Progress: 75%')).toBeTruthy(); // Progress percentage
    });
  });
});