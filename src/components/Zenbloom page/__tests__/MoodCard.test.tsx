import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MoodCard } from '../MoodCard';
import { MoodType } from '../../types/mood.types';

// Mock assets for testing
const mockMoodConfig = {
  type: 'happy' as MoodType,
  label: 'Happy',
  emoji: '🌼',
  description: 'Your flower is blooming with joy today.',
  assets: {
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
  },
};

const mockSlideAnimation = { interpolate: jest.fn(() => 0) } as any;

describe('MoodCard', () => {
  const defaultProps = {
    visible: true,
    moodConfig: mockMoodConfig,
    onClose: jest.fn(),
    slideAnimation: mockSlideAnimation,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when visible is true', () => {
    const { getByTestId } = render(<MoodCard {...defaultProps} />);

    expect(getByTestId('mood-card-container')).toBeTruthy();
    expect(getByTestId('mood-card')).toBeTruthy();
  });

  it('should not render when visible is false', () => {
    const { queryByTestId } = render(
      <MoodCard {...defaultProps} visible={false} />
    );

    expect(queryByTestId('mood-card-container')).toBeNull();
  });

  it('should call onClose when backdrop is pressed', () => {
    const { getByTestId } = render(<MoodCard {...defaultProps} />);

    const backdrop = getByTestId('mood-card-backdrop');
    fireEvent.press(backdrop);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when close button is pressed', () => {
    const { getByTestId } = render(<MoodCard {...defaultProps} />);

    const closeButton = getByTestId('mood-card-close');
    fireEvent.press(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when "Got it!" button is pressed', () => {
    const { getByTestId } = render(<MoodCard {...defaultProps} />);

    const gotItButton = getByTestId('mood-card-got-it');
    fireEvent.press(gotItButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should display happy mood content correctly', () => {
    const { getByText } = render(<MoodCard {...defaultProps} />);

    expect(getByText('Happy 🌼')).toBeTruthy();
    expect(getByText('Your flower is blooming with joy today.')).toBeTruthy();
  });

  it('should display sad mood content correctly', () => {
    const sadMoodConfig = {
      ...mockMoodConfig,
      type: 'sad' as MoodType,
      label: 'Sad',
    };

    const { getByText } = render(
      <MoodCard {...defaultProps} moodConfig={sadMoodConfig} />
    );

    expect(getByText('Sad 🌧️')).toBeTruthy();
    expect(getByText('Your flower is wilting, make it happy.')).toBeTruthy();
  });

  it('should display angry mood content correctly', () => {
    const angryMoodConfig = {
      ...mockMoodConfig,
      type: 'angry' as MoodType,
      label: 'Angry',
    };

    const { getByText } = render(
      <MoodCard {...defaultProps} moodConfig={angryMoodConfig} />
    );

    expect(getByText('Angry 🔥')).toBeTruthy();
    expect(getByText('Your flower is fuming, calm it down.')).toBeTruthy();
  });

  it('should display current mood label', () => {
    const { getByText } = render(<MoodCard {...defaultProps} />);

    expect(getByText('Current mood: Happy')).toBeTruthy();
  });

  it('should handle slide animation interpolation', () => {
    render(<MoodCard {...defaultProps} />);

    expect(mockSlideAnimation.interpolate).toHaveBeenCalled();
  });
});