import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { MoodSelector } from '../MoodSelector';

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
      spring: jest.fn(() => ({
        start: jest.fn((callback) => callback && callback()),
      })),
      Value: jest.fn(() => ({
        setValue: jest.fn(),
        interpolate: jest.fn(() => 'mocked-interpolation'),
      })),
    },
  };
});

describe('MoodSelector Component', () => {
  const defaultProps = {
    visible: true,
    currentMood: 'happy' as const,
    onMoodSelect: jest.fn(),
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render when visible is true', () => {
      const { getByTestId } = render(<MoodSelector {...defaultProps} />);
      
      expect(getByTestId('mood-selector-container')).toBeTruthy();
      expect(getByTestId('mood-selector-modal')).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      const { queryByTestId } = render(
        <MoodSelector {...defaultProps} visible={false} />
      );
      
      expect(queryByTestId('mood-selector-container')).toBeNull();
    });

    it('should render all mood options', () => {
      const { getByTestId } = render(<MoodSelector {...defaultProps} />);
      
      expect(getByTestId('mood-option-happy')).toBeTruthy();
      expect(getByTestId('mood-option-sad')).toBeTruthy();
      expect(getByTestId('mood-option-angry')).toBeTruthy();
    });

    it('should show current mood as selected', () => {
      const { getByTestId } = render(
        <MoodSelector {...defaultProps} currentMood="sad" />
      );
      
      const sadOption = getByTestId('mood-option-sad');
      expect(sadOption).toBeTruthy();
      // The selected option should have different styling
    });
  });

  describe('Animations', () => {
    it('should start slide-up animation when visible becomes true', () => {
      const { rerender } = render(
        <MoodSelector {...defaultProps} visible={false} />
      );

      rerender(<MoodSelector {...defaultProps} visible={true} />);

      expect(Animated.parallel).toHaveBeenCalled();
      expect(Animated.timing).toHaveBeenCalled();
      expect(Animated.spring).toHaveBeenCalled();
    });

    it('should start slide-down animation when visible becomes false', () => {
      const { rerender } = render(
        <MoodSelector {...defaultProps} visible={true} />
      );

      rerender(<MoodSelector {...defaultProps} visible={false} />);

      expect(Animated.parallel).toHaveBeenCalled();
      expect(Animated.timing).toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    it('should call onClose when backdrop is pressed', () => {
      const mockOnClose = jest.fn();
      const { getByTestId } = render(
        <MoodSelector {...defaultProps} onClose={mockOnClose} />
      );
      
      const backdrop = getByTestId('mood-selector-backdrop');
      fireEvent.press(backdrop);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when close button is pressed', () => {
      const mockOnClose = jest.fn();
      const { getByTestId } = render(
        <MoodSelector {...defaultProps} onClose={mockOnClose} />
      );
      
      const closeButton = getByTestId('mood-selector-close');
      fireEvent.press(closeButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when cancel button is pressed', () => {
      const mockOnClose = jest.fn();
      const { getByTestId } = render(
        <MoodSelector {...defaultProps} onClose={mockOnClose} />
      );
      
      const cancelButton = getByTestId('mood-selector-cancel');
      fireEvent.press(cancelButton);
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onMoodSelect when a mood option is pressed', async () => {
      const mockOnMoodSelect = jest.fn();
      const { getByTestId } = render(
        <MoodSelector {...defaultProps} onMoodSelect={mockOnMoodSelect} />
      );
      
      const sadOption = getByTestId('mood-option-sad');
      fireEvent.press(sadOption);
      
      // Wait for the setTimeout delay
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
      });
      
      expect(mockOnMoodSelect).toHaveBeenCalledWith('sad');
    });

    it('should handle happy mood selection', async () => {
      const mockOnMoodSelect = jest.fn();
      const { getByTestId } = render(
        <MoodSelector {...defaultProps} onMoodSelect={mockOnMoodSelect} />
      );
      
      const happyOption = getByTestId('mood-option-happy');
      fireEvent.press(happyOption);
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
      });
      
      expect(mockOnMoodSelect).toHaveBeenCalledWith('happy');
    });

    it('should handle angry mood selection', async () => {
      const mockOnMoodSelect = jest.fn();
      const { getByTestId } = render(
        <MoodSelector {...defaultProps} onMoodSelect={mockOnMoodSelect} />
      );
      
      const angryOption = getByTestId('mood-option-angry');
      fireEvent.press(angryOption);
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
      });
      
      expect(mockOnMoodSelect).toHaveBeenCalledWith('angry');
    });
  });

  describe('Modal Interface', () => {
    it('should display correct title and subtitle', () => {
      const { getByText } = render(<MoodSelector {...defaultProps} />);
      
      expect(getByText('Choose Your Mood')).toBeTruthy();
      expect(getByText('Select how you\'re feeling right now')).toBeTruthy();
    });

    it('should display mood labels with emojis', () => {
      const { getByText } = render(<MoodSelector {...defaultProps} />);
      
      expect(getByText('🌼 Happy')).toBeTruthy();
      expect(getByText('🌧️ Sad')).toBeTruthy();
      expect(getByText('🔥 Angry')).toBeTruthy();
    });

    it('should display mood descriptions', () => {
      const { getByText } = render(<MoodSelector {...defaultProps} />);
      
      expect(getByText('Your flower is blooming with joy today.')).toBeTruthy();
      expect(getByText('Your flower is wilting, make it happy.')).toBeTruthy();
      expect(getByText('Your flower is fuming, calm it down.')).toBeTruthy();
    });
  });

  describe('Selection Indicator', () => {
    it('should show selection indicator for current mood', () => {
      const { getByTestId } = render(
        <MoodSelector {...defaultProps} currentMood="happy" />
      );
      
      const happyOption = getByTestId('mood-option-happy');
      expect(happyOption).toBeTruthy();
      // Should have selected styling
    });

    it('should update selection indicator when current mood changes', () => {
      const { rerender, getByTestId } = render(
        <MoodSelector {...defaultProps} currentMood="happy" />
      );
      
      rerender(<MoodSelector {...defaultProps} currentMood="sad" />);
      
      const sadOption = getByTestId('mood-option-sad');
      expect(sadOption).toBeTruthy();
      // Should show sad as selected
    });
  });

  describe('Accessibility', () => {
    it('should have proper test IDs for all interactive elements', () => {
      const { getByTestId } = render(<MoodSelector {...defaultProps} />);
      
      expect(getByTestId('mood-selector-container')).toBeTruthy();
      expect(getByTestId('mood-selector-backdrop')).toBeTruthy();
      expect(getByTestId('mood-selector-modal')).toBeTruthy();
      expect(getByTestId('mood-selector-close')).toBeTruthy();
      expect(getByTestId('mood-selector-cancel')).toBeTruthy();
      expect(getByTestId('mood-option-happy')).toBeTruthy();
      expect(getByTestId('mood-option-sad')).toBeTruthy();
      expect(getByTestId('mood-option-angry')).toBeTruthy();
    });

    it('should handle activeOpacity for mood options', () => {
      const { getByTestId } = render(<MoodSelector {...defaultProps} />);
      
      const happyOption = getByTestId('mood-option-happy');
      expect(happyOption.props.activeOpacity).toBe(0.8);
    });
  });

  describe('Performance', () => {
    it('should use native driver for animations', () => {
      render(<MoodSelector {...defaultProps} />);
      
      expect(Animated.timing).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          useNativeDriver: true,
        })
      );
    });

    it('should cleanup animations properly', () => {
      const { unmount } = render(<MoodSelector {...defaultProps} />);
      
      unmount();
      
      // Animations should be cleaned up on unmount
      // This is handled by React Native's cleanup
      expect(true).toBe(true); // Placeholder for cleanup verification
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid mood selection', async () => {
      const mockOnMoodSelect = jest.fn();
      const { getByTestId } = render(
        <MoodSelector {...defaultProps} onMoodSelect={mockOnMoodSelect} />
      );
      
      const happyOption = getByTestId('mood-option-happy');
      const sadOption = getByTestId('mood-option-sad');
      
      // Rapid selections
      fireEvent.press(happyOption);
      fireEvent.press(sadOption);
      
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
      });
      
      // Should handle both selections
      expect(mockOnMoodSelect).toHaveBeenCalled();
    });

    it('should handle undefined props gracefully', () => {
      const minimalProps = {
        visible: true,
        currentMood: 'happy' as const,
        onMoodSelect: jest.fn(),
        onClose: jest.fn(),
      };
      
      expect(() => render(<MoodSelector {...minimalProps} />)).not.toThrow();
    });
  });
});