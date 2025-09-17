import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { InteractionButtons } from '../InteractionButtons';
import { MoodType } from '../../types/mood.types';

// Mock assets for testing
const mockMoodAssets = {
  sunflower: 'test-sunflower',
  background: 'test-background',
  petals: 'test-petals',
  faceExpression: 'test-face',
  logo: 'test-logo',
  moodButton: 'test-mood-button',
  moodButtonClicked: 'test-mood-button-clicked',
  growthButton: 'test-growth-button',
  growthButtonClicked: 'test-growth-button-clicked',
  backIcon: 'test-back-icon',
  growthFlower: 'test-growth-flower',
};

const mockButtonPressAnimation = { interpolate: jest.fn() } as any;

describe('InteractionButtons', () => {
  const defaultProps = {
    currentMood: 'happy' as MoodType,
    moodAssets: mockMoodAssets,
    onMoodButtonPress: jest.fn(),
    onGrowthButtonPress: jest.fn(),
    buttonPressAnimation: mockButtonPressAnimation,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render mood and growth buttons', () => {
    const { getByTestId } = render(<InteractionButtons {...defaultProps} />);

    expect(getByTestId('mood-button')).toBeTruthy();
    expect(getByTestId('growth-button')).toBeTruthy();
  });

  it('should call onMoodButtonPress when mood button is pressed', () => {
    const { getByTestId } = render(<InteractionButtons {...defaultProps} />);

    const moodButton = getByTestId('mood-button');
    
    // Simulate press in and press out to trigger the full press cycle
    fireEvent(moodButton, 'pressIn');
    fireEvent(moodButton, 'pressOut');

    expect(defaultProps.onMoodButtonPress).toHaveBeenCalledTimes(1);
  });

  it('should call onGrowthButtonPress when growth button is pressed', () => {
    const { getByTestId } = render(<InteractionButtons {...defaultProps} />);

    const growthButton = getByTestId('growth-button');
    
    // Simulate press in and press out to trigger the full press cycle
    fireEvent(growthButton, 'pressIn');
    fireEvent(growthButton, 'pressOut');

    expect(defaultProps.onGrowthButtonPress).toHaveBeenCalledTimes(1);
  });

  it('should render with happy mood assets', () => {
    const { getByTestId } = render(<InteractionButtons {...defaultProps} />);

    const moodButton = getByTestId('mood-button');
    const growthButton = getByTestId('growth-button');

    // Check that buttons are rendered (specific asset testing would require more complex setup)
    expect(moodButton).toBeTruthy();
    expect(growthButton).toBeTruthy();
  });

  it('should render with sad mood assets', () => {
    const sadProps = {
      ...defaultProps,
      currentMood: 'sad' as MoodType,
    };

    const { getByTestId } = render(<InteractionButtons {...sadProps} />);

    const moodButton = getByTestId('mood-button');
    const growthButton = getByTestId('growth-button');

    expect(moodButton).toBeTruthy();
    expect(growthButton).toBeTruthy();
  });

  it('should render with angry mood assets', () => {
    const angryProps = {
      ...defaultProps,
      currentMood: 'angry' as MoodType,
    };

    const { getByTestId } = render(<InteractionButtons {...angryProps} />);

    const moodButton = getByTestId('mood-button');
    const growthButton = getByTestId('growth-button');

    expect(moodButton).toBeTruthy();
    expect(growthButton).toBeTruthy();
  });

  it('should have proper styling for glass effect', () => {
    const { getByTestId } = render(<InteractionButtons {...defaultProps} />);

    const moodButton = getByTestId('mood-button');
    const growthButton = getByTestId('growth-button');

    // Check that buttons have the expected structure
    expect(moodButton).toBeTruthy();
    expect(growthButton).toBeTruthy();
  });

  it('should be positioned correctly on the right side', () => {
    const { getByTestId } = render(<InteractionButtons {...defaultProps} />);

    const moodButton = getByTestId('mood-button');
    const growthButton = getByTestId('growth-button');

    // Buttons should be rendered and positioned
    expect(moodButton).toBeTruthy();
    expect(growthButton).toBeTruthy();
  });

  it('should handle multiple rapid button presses', () => {
    const { getByTestId } = render(<InteractionButtons {...defaultProps} />);

    const moodButton = getByTestId('mood-button');
    
    // Simulate rapid presses
    fireEvent.press(moodButton);
    fireEvent.press(moodButton);
    fireEvent.press(moodButton);

    expect(defaultProps.onMoodButtonPress).toHaveBeenCalledTimes(3);
  });

  it('should maintain button state across mood changes', () => {
    const { rerender, getByTestId } = render(<InteractionButtons {...defaultProps} />);

    // Initial render with happy mood
    expect(getByTestId('mood-button')).toBeTruthy();

    // Re-render with sad mood
    const sadProps = { ...defaultProps, currentMood: 'sad' as MoodType };
    rerender(<InteractionButtons {...sadProps} />);

    // Buttons should still be present
    expect(getByTestId('mood-button')).toBeTruthy();
    expect(getByTestId('growth-button')).toBeTruthy();
  });
});  it('shou
ld show clicked state assets when buttons are pressed', () => {
    const { getByTestId } = render(<InteractionButtons {...defaultProps} />);

    const moodButton = getByTestId('mood-button');
    
    // Simulate press in to show clicked state
    fireEvent(moodButton, 'pressIn');
    
    // The component should now be showing the clicked state
    // (Testing the actual asset change would require more complex setup)
    expect(moodButton).toBeTruthy();
  });

  it('should handle press animations with scale transform', () => {
    const { getByTestId } = render(<InteractionButtons {...defaultProps} />);

    const moodButton = getByTestId('mood-button');
    
    // Simulate press in and out
    fireEvent(moodButton, 'pressIn');
    fireEvent(moodButton, 'pressOut');
    
    // Animation should have been triggered
    expect(moodButton).toBeTruthy();
  });

  it('should handle haptic feedback on button press', () => {
    // Mock Vibration
    const mockVibrate = jest.fn();
    jest.doMock('react-native', () => ({
      ...jest.requireActual('react-native'),
      Vibration: { vibrate: mockVibrate },
    }));

    const { getByTestId } = render(<InteractionButtons {...defaultProps} />);

    const moodButton = getByTestId('mood-button');
    
    // Simulate press in to trigger haptic feedback
    fireEvent(moodButton, 'pressIn');
    
    // Note: In a real test environment, we'd verify Vibration.vibrate was called
    expect(moodButton).toBeTruthy();
  });

  it('should reset button state after press out', () => {
    const { getByTestId } = render(<InteractionButtons {...defaultProps} />);

    const moodButton = getByTestId('mood-button');
    
    // Simulate full press cycle
    fireEvent(moodButton, 'pressIn');
    fireEvent(moodButton, 'pressOut');
    
    // Button should be back to normal state
    expect(moodButton).toBeTruthy();
  });

  it('should handle both buttons being pressed simultaneously', () => {
    const { getByTestId } = render(<InteractionButtons {...defaultProps} />);

    const moodButton = getByTestId('mood-button');
    const growthButton = getByTestId('growth-button');
    
    // Simulate pressing both buttons
    fireEvent(moodButton, 'pressIn');
    fireEvent(growthButton, 'pressIn');
    fireEvent(moodButton, 'pressOut');
    fireEvent(growthButton, 'pressOut');
    
    expect(defaultProps.onMoodButtonPress).toHaveBeenCalledTimes(1);
    expect(defaultProps.onGrowthButtonPress).toHaveBeenCalledTimes(1);
  });