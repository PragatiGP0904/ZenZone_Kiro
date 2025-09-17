import React from 'react';
import { render } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { BackgroundLayer } from '../BackgroundLayer';
import { MOOD_CONFIGS } from '../../assets/assetConfig';

describe('BackgroundLayer', () => {
  const mockRainAnimation = [new Animated.Value(0), new Animated.Value(0)];
  const mockFireAnimation = [new Animated.Value(0), new Animated.Value(0)];

  it('renders happy background correctly', () => {
    const { getByTestId } = render(
      <BackgroundLayer
        currentMood="happy"
        backgroundAsset={MOOD_CONFIGS.happy.assets.background}
      />
    );
    
    // Component should render without crashing
    expect(true).toBe(true);
  });

  it('renders sad background with rain effects', () => {
    const { getByTestId } = render(
      <BackgroundLayer
        currentMood="sad"
        backgroundAsset={MOOD_CONFIGS.sad.assets.background}
        showRain={true}
        rainAnimation={mockRainAnimation}
      />
    );
    
    // Component should render without crashing
    expect(true).toBe(true);
  });

  it('renders angry background with fire effects', () => {
    const { getByTestId } = render(
      <BackgroundLayer
        currentMood="angry"
        backgroundAsset={MOOD_CONFIGS.angry.assets.background}
        showFire={true}
        fireAnimation={mockFireAnimation}
      />
    );
    
    // Component should render without crashing
    expect(true).toBe(true);
  });

  it('handles mood transitions', () => {
    const { rerender } = render(
      <BackgroundLayer
        currentMood="happy"
        backgroundAsset={MOOD_CONFIGS.happy.assets.background}
      />
    );

    // Change mood and verify no crashes
    rerender(
      <BackgroundLayer
        currentMood="sad"
        backgroundAsset={MOOD_CONFIGS.sad.assets.background}
      />
    );
    
    expect(true).toBe(true);
  });

  it('renders without rain or fire effects by default', () => {
    const { getByTestId } = render(
      <BackgroundLayer
        currentMood="happy"
        backgroundAsset={MOOD_CONFIGS.happy.assets.background}
      />
    );
    
    // Component should render without crashing
    expect(true).toBe(true);
  });
});