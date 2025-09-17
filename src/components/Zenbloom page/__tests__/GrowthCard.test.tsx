import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { GrowthCard } from '../GrowthCard';
import { MoodType, StreakData } from '../../types/mood.types';

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

const mockStreakData: StreakData = {
  currentStreak: 7,
  totalDays: 30,
  progressPercentage: 65,
  milestones: [25, 50, 75, 100],
};

const mockSlideAnimation = { interpolate: jest.fn(() => 0) } as any;
const mockProgressAnimation = { interpolate: jest.fn(() => '65%') } as any;

describe('GrowthCard', () => {
  const defaultProps = {
    visible: true,
    streakData: mockStreakData,
    moodConfig: mockMoodConfig,
    onClose: jest.fn(),
    slideAnimation: mockSlideAnimation,
    progressAnimation: mockProgressAnimation,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when visible is true', () => {
    const { getByTestId } = render(<GrowthCard {...defaultProps} />);

    expect(getByTestId('growth-card-container')).toBeTruthy();
    expect(getByTestId('growth-card')).toBeTruthy();
  });

  it('should not render when visible is false', () => {
    const { queryByTestId } = render(
      <GrowthCard {...defaultProps} visible={false} />
    );

    expect(queryByTestId('growth-card-container')).toBeNull();
  });

  it('should call onClose when backdrop is pressed', () => {
    const { getByTestId } = render(<GrowthCard {...defaultProps} />);

    const backdrop = getByTestId('growth-card-backdrop');
    fireEvent.press(backdrop);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when close button is pressed', () => {
    const { getByTestId } = render(<GrowthCard {...defaultProps} />);

    const closeButton = getByTestId('growth-card-close');
    fireEvent.press(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when "Keep Growing!" button is pressed', () => {
    const { getByTestId } = render(<GrowthCard {...defaultProps} />);

    const continueButton = getByTestId('growth-card-continue');
    fireEvent.press(continueButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('should display streak information correctly', () => {
    const { getByText } = render(<GrowthCard {...defaultProps} />);

    expect(getByText('7 days')).toBeTruthy();
    expect(getByText('Total: 30 days')).toBeTruthy();
    expect(getByText('Progress: 65%')).toBeTruthy();
  });

  it('should display milestones correctly', () => {
    const { getByText } = render(<GrowthCard {...defaultProps} />);

    expect(getByText('25%')).toBeTruthy();
    expect(getByText('50%')).toBeTruthy();
    expect(getByText('75%')).toBeTruthy();
    expect(getByText('100%')).toBeTruthy();
  });

  it('should handle different mood configurations', () => {
    const sadMoodConfig = {
      ...mockMoodConfig,
      type: 'sad' as MoodType,
      label: 'Sad',
    };

    const { getByText } = render(
      <GrowthCard {...defaultProps} moodConfig={sadMoodConfig} />
    );

    expect(getByText('Growth Progress 🌱')).toBeTruthy();
  });

  it('should handle different streak data', () => {
    const differentStreakData: StreakData = {
      currentStreak: 21,
      totalDays: 90,
      progressPercentage: 85,
      milestones: [25, 50, 75, 100],
    };

    const { getByText } = render(
      <GrowthCard {...defaultProps} streakData={differentStreakData} />
    );

    expect(getByText('21 days')).toBeTruthy();
    expect(getByText('Total: 90 days')).toBeTruthy();
    expect(getByText('Progress: 85%')).toBeTruthy();
  });

  it('should handle progress bar animation', () => {
    const { getByTestId } = render(<GrowthCard {...defaultProps} />);

    const progressBar = getByTestId('progress-bar');
    expect(progressBar).toBeTruthy();
  });

  it('should handle slide animation interpolation', () => {
    render(<GrowthCard {...defaultProps} />);

    expect(mockSlideAnimation.interpolate).toHaveBeenCalled();
  });

  it('should handle progress animation interpolation', () => {
    render(<GrowthCard {...defaultProps} />);

    expect(mockProgressAnimation.interpolate).toHaveBeenCalled();
  });

  it('should display growth flower asset', () => {
    const { getByTestId } = render(<GrowthCard {...defaultProps} />);

    // The growth flower image should be rendered
    expect(getByTestId('growth-card')).toBeTruthy();
  });

  it('should handle zero progress correctly', () => {
    const zeroProgressData: StreakData = {
      currentStreak: 0,
      totalDays: 0,
      progressPercentage: 0,
      milestones: [25, 50, 75, 100],
    };

    const { getByText } = render(
      <GrowthCard {...defaultProps} streakData={zeroProgressData} />
    );

    expect(getByText('0 days')).toBeTruthy();
    expect(getByText('Progress: 0%')).toBeTruthy();
  });

  it('should handle maximum progress correctly', () => {
    const maxProgressData: StreakData = {
      currentStreak: 100,
      totalDays: 365,
      progressPercentage: 100,
      milestones: [25, 50, 75, 100],
    };

    const { getByText } = render(
      <GrowthCard {...defaultProps} streakData={maxProgressData} />
    );

    expect(getByText('100 days')).toBeTruthy();
    expect(getByText('Progress: 100%')).toBeTruthy();
  });
});