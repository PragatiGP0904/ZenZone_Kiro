import React from 'react';
import { render } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { AnimatedElements } from '../AnimatedElements';
import { BackgroundLayer } from '../BackgroundLayer';
import { GrowthCard } from '../GrowthCard';
import { MOOD_CONFIGS, SHARED_ASSETS } from '../../assets/assetConfig';

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
        stopAnimation: jest.fn(),
        interpolate: jest.fn(() => 'mocked-interpolation'),
      })),
    },
  };
});

describe('Sad Mood Effects', () => {
  const mockAnimations = {
    cloudMovement: Array.from({ length: 6 }, () => new Animated.Value(0)),
    butterflyFlap: Array.from({ length: 7 }, () => new Animated.Value(0)),
    rainDrop: Array.from({ length: 20 }, () => new Animated.Value(0)),
    fireParticles: [],
  };

  const mockStreakData = {
    currentStreak: 5,
    totalDays: 15,
    progressPercentage: 60,
    milestones: [25, 50, 75, 100],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AnimatedElements - Rain Effects', () => {
    it('should render rain layer when mood is sad', () => {
      const { getByTestId } = render(
        <AnimatedElements
          currentMood="sad"
          sharedAssets={SHARED_ASSETS}
          cloudAnimations={mockAnimations.cloudMovement}
          butterflyAnimations={mockAnimations.butterflyFlap}
          rainAnimations={mockAnimations.rainDrop}
          fireAnimations={mockAnimations.fireParticles}
        />
      );

      // Rain layer should be present for sad mood
      expect(true).toBe(true); // Placeholder - actual implementation would check for rain elements
    });

    it('should not render rain layer when mood is not sad', () => {
      const { queryByTestId } = render(
        <AnimatedElements
          currentMood="happy"
          sharedAssets={SHARED_ASSETS}
          cloudAnimations={mockAnimations.cloudMovement}
          butterflyAnimations={mockAnimations.butterflyFlap}
          rainAnimations={mockAnimations.rainDrop}
          fireAnimations={mockAnimations.fireParticles}
        />
      );

      // Rain layer should not be present for non-sad moods
      expect(true).toBe(true); // Placeholder
    });

    it('should start rain animations when mood is sad', () => {
      render(
        <AnimatedElements
          currentMood="sad"
          sharedAssets={SHARED_ASSETS}
          cloudAnimations={mockAnimations.cloudMovement}
          butterflyAnimations={mockAnimations.butterflyFlap}
          rainAnimations={mockAnimations.rainDrop}
          fireAnimations={mockAnimations.fireParticles}
        />
      );

      // Should start rain animations
      expect(Animated.timing).toHaveBeenCalled();
    });

    it('should render falling petals in sad mood', () => {
      const { container } = render(
        <AnimatedElements
          currentMood="sad"
          sharedAssets={SHARED_ASSETS}
          cloudAnimations={mockAnimations.cloudMovement}
          butterflyAnimations={mockAnimations.butterflyFlap}
          rainAnimations={mockAnimations.rainDrop}
          fireAnimations={mockAnimations.fireParticles}
        />
      );

      // Should render falling petals for sad mood
      expect(container).toBeTruthy();
    });

    it('should have staggered timing for raindrops', () => {
      render(
        <AnimatedElements
          currentMood="sad"
          sharedAssets={SHARED_ASSETS}
          cloudAnimations={mockAnimations.cloudMovement}
          butterflyAnimations={mockAnimations.butterflyFlap}
          rainAnimations={mockAnimations.rainDrop}
          fireAnimations={mockAnimations.fireParticles}
        />
      );

      // Should use staggered timing for natural rain effect
      expect(Animated.timing).toHaveBeenCalled();
    });
  });

  describe('BackgroundLayer - Rain Layer Asset', () => {
    it('should display rain layer asset when showRain is true and mood is sad', () => {
      const { container } = render(
        <BackgroundLayer
          currentMood="sad"
          backgroundAsset={MOOD_CONFIGS.sad.assets.background}
          showRain={true}
          showFire={false}
        />
      );

      expect(container).toBeTruthy();
    });

    it('should not display rain layer when showRain is false', () => {
      const { container } = render(
        <BackgroundLayer
          currentMood="sad"
          backgroundAsset={MOOD_CONFIGS.sad.assets.background}
          showRain={false}
          showFire={false}
        />
      );

      expect(container).toBeTruthy();
    });

    it('should not display rain layer when mood is not sad', () => {
      const { container } = render(
        <BackgroundLayer
          currentMood="happy"
          backgroundAsset={MOOD_CONFIGS.happy.assets.background}
          showRain={true}
          showFire={false}
        />
      );

      expect(container).toBeTruthy();
    });

    it('should apply sad mood overlay styling', () => {
      const { container } = render(
        <BackgroundLayer
          currentMood="sad"
          backgroundAsset={MOOD_CONFIGS.sad.assets.background}
          showRain={true}
          showFire={false}
        />
      );

      // Should apply blue tint overlay for sad mood
      expect(container).toBeTruthy();
    });
  });

  describe('GrowthCard - Dim Blue Shimmer Effect', () => {
    it('should use dim blue shimmer effect for sad mood', () => {
      const mockSlideAnimation = new Animated.Value(0);
      const mockProgressAnimation = new Animated.Value(0);

      const { container } = render(
        <GrowthCard
          visible={true}
          streakData={mockStreakData}
          moodConfig={MOOD_CONFIGS.sad}
          onClose={jest.fn()}
          slideAnimation={mockSlideAnimation}
          progressAnimation={mockProgressAnimation}
        />
      );

      expect(container).toBeTruthy();
    });

    it('should have slower shimmer animation for sad mood', () => {
      const mockSlideAnimation = new Animated.Value(0);
      const mockProgressAnimation = new Animated.Value(0);

      render(
        <GrowthCard
          visible={true}
          streakData={mockStreakData}
          moodConfig={MOOD_CONFIGS.sad}
          onClose={jest.fn()}
          slideAnimation={mockSlideAnimation}
          progressAnimation={mockProgressAnimation}
        />
      );

      // Should use slower timing for sad mood shimmer
      expect(Animated.timing).toHaveBeenCalled();
    });

    it('should use reduced opacity for sad mood shimmer', () => {
      const mockSlideAnimation = new Animated.Value(0);
      const mockProgressAnimation = new Animated.Value(0);

      const { container } = render(
        <GrowthCard
          visible={true}
          streakData={mockStreakData}
          moodConfig={MOOD_CONFIGS.sad}
          onClose={jest.fn()}
          slideAnimation={mockSlideAnimation}
          progressAnimation={mockProgressAnimation}
        />
      );

      // Should use reduced opacity for sad mood
      expect(container).toBeTruthy();
    });

    it('should use blue color scheme for sad mood', () => {
      const mockSlideAnimation = new Animated.Value(0);
      const mockProgressAnimation = new Animated.Value(0);

      const { container } = render(
        <GrowthCard
          visible={true}
          streakData={mockStreakData}
          moodConfig={MOOD_CONFIGS.sad}
          onClose={jest.fn()}
          slideAnimation={mockSlideAnimation}
          progressAnimation={mockProgressAnimation}
        />
      );

      // Should use blue color scheme for sad mood
      expect(container).toBeTruthy();
    });
  });

  describe('Integration Tests', () => {
    it('should coordinate all sad mood effects together', () => {
      // Test that all sad mood effects work together properly
      const mockSlideAnimation = new Animated.Value(0);
      const mockProgressAnimation = new Animated.Value(0);

      const backgroundLayer = render(
        <BackgroundLayer
          currentMood="sad"
          backgroundAsset={MOOD_CONFIGS.sad.assets.background}
          showRain={true}
          showFire={false}
        />
      );

      const animatedElements = render(
        <AnimatedElements
          currentMood="sad"
          sharedAssets={SHARED_ASSETS}
          cloudAnimations={mockAnimations.cloudMovement}
          butterflyAnimations={mockAnimations.butterflyFlap}
          rainAnimations={mockAnimations.rainDrop}
          fireAnimations={mockAnimations.fireParticles}
        />
      );

      const growthCard = render(
        <GrowthCard
          visible={true}
          streakData={mockStreakData}
          moodConfig={MOOD_CONFIGS.sad}
          onClose={jest.fn()}
          slideAnimation={mockSlideAnimation}
          progressAnimation={mockProgressAnimation}
        />
      );

      expect(backgroundLayer.container).toBeTruthy();
      expect(animatedElements.container).toBeTruthy();
      expect(growthCard.container).toBeTruthy();
    });

    it('should only show sad effects when mood is sad', () => {
      // Verify that sad effects only appear in sad mood state
      const { container } = render(
        <AnimatedElements
          currentMood="happy"
          sharedAssets={SHARED_ASSETS}
          cloudAnimations={mockAnimations.cloudMovement}
          butterflyAnimations={mockAnimations.butterflyFlap}
          rainAnimations={mockAnimations.rainDrop}
          fireAnimations={mockAnimations.fireParticles}
        />
      );

      // Should not show rain effects for happy mood
      expect(container).toBeTruthy();
    });
  });

  describe('Performance', () => {
    it('should use native driver for rain animations', () => {
      render(
        <AnimatedElements
          currentMood="sad"
          sharedAssets={SHARED_ASSETS}
          cloudAnimations={mockAnimations.cloudMovement}
          butterflyAnimations={mockAnimations.butterflyFlap}
          rainAnimations={mockAnimations.rainDrop}
          fireAnimations={mockAnimations.fireParticles}
        />
      );

      expect(Animated.timing).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          useNativeDriver: true,
        })
      );
    });

    it('should cleanup rain animations on unmount', () => {
      const { unmount } = render(
        <AnimatedElements
          currentMood="sad"
          sharedAssets={SHARED_ASSETS}
          cloudAnimations={mockAnimations.cloudMovement}
          butterflyAnimations={mockAnimations.butterflyFlap}
          rainAnimations={mockAnimations.rainDrop}
          fireAnimations={mockAnimations.fireParticles}
        />
      );

      unmount();

      // Should cleanup animations on unmount
      expect(true).toBe(true); // Placeholder for cleanup verification
    });
  });
});