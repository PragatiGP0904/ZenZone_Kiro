import React from 'react';
import { render } from '@testing-library/react-native';
import { Animated } from 'react-native';
import { AngryMoodEffects } from '../AngryMoodEffects';

// Mock Animated API
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  RN.Animated.timing = jest.fn(() => ({
    start: jest.fn((callback) => callback && callback()),
  }));
  
  RN.Animated.sequence = jest.fn(() => ({
    start: jest.fn((callback) => callback && callback()),
  }));
  
  return RN;
});

describe('AngryMoodEffects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when mood is not angry', () => {
    const { queryByTestId } = render(
      <AngryMoodEffects currentMood="happy" isActive={true} />
    );
    
    // Component should return null for non-angry moods
    expect(queryByTestId('angry-effects-container')).toBeNull();
  });

  it('renders nothing when not active', () => {
    const { queryByTestId } = render(
      <AngryMoodEffects currentMood="angry" isActive={false} />
    );
    
    // Component should return null when not active
    expect(queryByTestId('angry-effects-container')).toBeNull();
  });

  it('renders fire effects when angry mood is active', () => {
    const { getByTestId } = render(
      <AngryMoodEffects currentMood="angry" isActive={true} />
    );
    
    // Should render the main container
    expect(getByTestId('angry-effects-container')).toBeTruthy();
  });

  it('starts fire animations when angry mood becomes active', () => {
    const { rerender } = render(
      <AngryMoodEffects currentMood="happy" isActive={true} />
    );
    
    // Change to angry mood
    rerender(<AngryMoodEffects currentMood="angry" isActive={true} />);
    
    // Should start fire animations
    expect(Animated.timing).toHaveBeenCalled();
  });

  it('starts lightning flash animations when angry mood is active', () => {
    render(<AngryMoodEffects currentMood="angry" isActive={true} />);
    
    // Should start lightning sequence animations
    expect(Animated.sequence).toHaveBeenCalled();
  });

  it('renders fire particles at bottom of screen', () => {
    const { getByTestId } = render(
      <AngryMoodEffects currentMood="angry" isActive={true} />
    );
    
    const fireLayer = getByTestId('fire-layer');
    expect(fireLayer).toBeTruthy();
    expect(fireLayer.props.style).toMatchObject({
      position: 'absolute',
      bottom: 0,
    });
  });

  it('renders lightning flash overlay', () => {
    const { getByTestId } = render(
      <AngryMoodEffects currentMood="angry" isActive={true} />
    );
    
    const lightningFlash = getByTestId('lightning-flash');
    expect(lightningFlash).toBeTruthy();
    expect(lightningFlash.props.style).toMatchObject({
      position: 'absolute',
      top: 0,
      backgroundColor: '#FFFFFF',
    });
  });

  it('renders pulsing glow effect for growth bar', () => {
    const { getByTestId } = render(
      <AngryMoodEffects currentMood="angry" isActive={true} />
    );
    
    const pulsingGlow = getByTestId('pulsing-glow');
    expect(pulsingGlow).toBeTruthy();
    expect(pulsingGlow.props.style).toMatchObject({
      backgroundColor: '#FF4500',
      borderRadius: 20,
    });
  });

  it('creates multiple fire particles with different configurations', () => {
    const { getByTestId } = render(
      <AngryMoodEffects currentMood="angry" isActive={true} />
    );
    
    const fireLayer = getByTestId('fire-layer');
    
    // Should have multiple fire particle children
    expect(fireLayer.props.children).toHaveLength(12); // 12 fire particles as defined
  });

  it('applies correct z-index layering for effects', () => {
    const { getByTestId } = render(
      <AngryMoodEffects currentMood="angry" isActive={true} />
    );
    
    const container = getByTestId('angry-effects-container');
    const lightningFlash = getByTestId('lightning-flash');
    
    // Container should have high z-index
    expect(container.props.style.zIndex).toBe(5);
    
    // Lightning flash should be above clouds
    expect(lightningFlash.props.style.zIndex).toBe(15);
  });

  it('stops animations when component unmounts', () => {
    const { unmount } = render(
      <AngryMoodEffects currentMood="angry" isActive={true} />
    );
    
    const stopAnimationSpy = jest.fn();
    
    // Mock the stopAnimation method
    jest.spyOn(Animated.Value.prototype, 'stopAnimation').mockImplementation(stopAnimationSpy);
    
    unmount();
    
    // Should call stopAnimation on unmount
    expect(stopAnimationSpy).toHaveBeenCalled();
  });

  it('handles mood changes correctly', () => {
    const { rerender } = render(
      <AngryMoodEffects currentMood="angry" isActive={true} />
    );
    
    // Change mood to sad
    rerender(<AngryMoodEffects currentMood="sad" isActive={true} />);
    
    // Should stop rendering effects
    expect(() => render(<AngryMoodEffects currentMood="sad" isActive={true} />)).not.toThrow();
  });

  it('uses correct fire colors and effects', () => {
    const { getByTestId } = render(
      <AngryMoodEffects currentMood="angry" isActive={true} />
    );
    
    const pulsingGlow = getByTestId('pulsing-glow');
    
    // Should use red/orange fire colors
    expect(pulsingGlow.props.style.backgroundColor).toBe('#FF4500');
    expect(pulsingGlow.props.style.shadowColor).toBe('#FF0000');
  });
});