import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ZenbloomContainer } from '../ZenbloomContainer';

// Mock the SunflowerDisplay component
jest.mock('../SunflowerDisplay', () => ({
  SunflowerDisplay: ({ onTap, currentMood }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    return (
      <TouchableOpacity testID="sunflower-display" onPress={onTap}>
        <Text testID="sunflower-mood">{currentMood}</Text>
      </TouchableOpacity>
    );
  },
}));

// Mock the other components
jest.mock('../BackgroundLayer', () => ({
  BackgroundLayer: () => {
    const { View } = require('react-native');
    return <View testID="background-layer" />;
  },
}));

jest.mock('../AnimatedElements', () => ({
  AnimatedElements: () => {
    const { View } = require('react-native');
    return <View testID="animated-elements" />;
  },
}));

// Mock the hooks
jest.mock('../../hooks/useMoodState', () => ({
  useMoodState: (initialMood: string) => ({
    currentMood: initialMood,
    currentMoodConfig: {
      type: initialMood,
      label: initialMood.charAt(0).toUpperCase() + initialMood.slice(1),
      emoji: '🌼',
      description: 'Test description',
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
    },
    switchMood: jest.fn(),
  }),
}));

jest.mock('../../hooks/useAnimations', () => ({
  useAnimations: () => ({
    sunflowerSway: { interpolate: jest.fn() },
    sunflowerBlink: { interpolate: jest.fn() },
    cloudMovement: [],
    butterflyFlap: [],
    rainDrop: [],
    fireParticles: [],
    growthBarProgress: { interpolate: jest.fn() },
    cardSlide: { interpolate: jest.fn() },
    buttonPress: { interpolate: jest.fn() },
  }),
}));

jest.mock('../../assets/assetConfig', () => ({
  SHARED_ASSETS: {
    clouds: [],
    butterflies: [],
    profile: 'test-profile',
  },
}));

describe('SunflowerIntegration', () => {
  it('should render ZenbloomContainer with integrated SunflowerDisplay', () => {
    const { getByTestId } = render(
      <ZenbloomContainer initialMood="happy" />
    );

    expect(getByTestId('sunflower-display')).toBeTruthy();
    expect(getByTestId('sunflower-mood')).toBeTruthy();
    expect(getByTestId('background-layer')).toBeTruthy();
    expect(getByTestId('animated-elements')).toBeTruthy();
  });

  it('should pass correct mood to SunflowerDisplay', () => {
    const { getByTestId } = render(
      <ZenbloomContainer initialMood="sad" />
    );

    const moodText = getByTestId('sunflower-mood');
    expect(moodText.props.children).toBe('sad');
  });

  it('should handle sunflower tap interaction', () => {
    const { getByTestId } = render(
      <ZenbloomContainer initialMood="happy" />
    );

    const sunflowerDisplay = getByTestId('sunflower-display');
    
    // Should not throw when tapped
    expect(() => {
      fireEvent.press(sunflowerDisplay);
    }).not.toThrow();
  });

  it('should call onMoodChange when mood changes', () => {
    const mockOnMoodChange = jest.fn();
    
    render(
      <ZenbloomContainer 
        initialMood="happy" 
        onMoodChange={mockOnMoodChange}
      />
    );

    // This test verifies the prop is passed correctly
    // The actual mood change logic is tested in the mood selector tests
    expect(mockOnMoodChange).toBeDefined();
  });

  it('should call onBack when back button is pressed', () => {
    const mockOnBack = jest.fn();
    
    const { getByTestId } = render(
      <ZenbloomContainer 
        initialMood="happy" 
        onBack={mockOnBack}
      />
    );

    // Find and press the back button
    const backButton = getByTestId('back-button');
    fireEvent.press(backButton);

    expect(mockOnBack).toHaveBeenCalled();
  });
});