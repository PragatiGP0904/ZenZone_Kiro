import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { MoodType } from '../types/mood.types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface AngryMoodEffectsProps {
  currentMood: MoodType;
  isActive: boolean;
}

/**
 * AngryMoodEffects component handles all angry mood specific visual effects
 * including fire/heat wave animations, lightning flashes, and red pulsing effects
 */
export const AngryMoodEffects: React.FC<AngryMoodEffectsProps> = ({
  currentMood,
  isActive
}) => {
  // Animation references for fire effects
  const fireAnimations = useRef(
    Array.from({ length: 12 }, () => new Animated.Value(0))
  ).current;
  
  // Animation reference for lightning flashes
  const lightningAnimation = useRef(new Animated.Value(0)).current;
  
  // Animation reference for growth bar pulsing
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  // Fire/heat wave animation setup
  useEffect(() => {
    if (currentMood === 'angry' && isActive) {
      const startFireAnimations = () => {
        fireAnimations.forEach((animation, index) => {
          // Reset animation to start position
          animation.setValue(0);
          
          // Create staggered start times for natural fire appearance
          const delay = index * 100; // 100ms stagger between fire particles
          
          // Start continuous looping animation for fire effects
          const animateFire = () => {
            Animated.timing(animation, {
              toValue: 1,
              duration: 1000 + Math.random() * 500, // 1-1.5 second duration with variation
              useNativeDriver: true,
            }).start(() => {
              // Reset and restart for continuous loop with random delay
              animation.setValue(0);
              const randomDelay = Math.random() * 800; // 0-800ms random delay
              setTimeout(animateFire, randomDelay);
            });
          };
          
          // Start with delay for staggered effect
          setTimeout(animateFire, delay);
        });
      };

      startFireAnimations();
      
      // Cleanup function to stop animations
      return () => {
        fireAnimations.forEach(animation => {
          animation.stopAnimation();
        });
      };
    }
  }, [fireAnimations, currentMood, isActive]);

  // Lightning flash animation setup
  useEffect(() => {
    if (currentMood === 'angry' && isActive) {
      const startLightningFlashes = () => {
        const flashSequence = () => {
          // Create lightning flash sequence
          Animated.sequence([
            // Quick flash
            Animated.timing(lightningAnimation, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            // Brief pause
            Animated.timing(lightningAnimation, {
              toValue: 0,
              duration: 50,
              useNativeDriver: true,
            }),
            // Second flash (slightly dimmer)
            Animated.timing(lightningAnimation, {
              toValue: 0.6,
              duration: 80,
              useNativeDriver: true,
            }),
            // Fade out
            Animated.timing(lightningAnimation, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start(() => {
            // Wait 4-6 seconds before next flash
            const nextFlashDelay = 4000 + Math.random() * 2000;
            setTimeout(flashSequence, nextFlashDelay);
          });
        };
        
        // Start first flash after initial delay
        setTimeout(flashSequence, 2000);
      };

      startLightningFlashes();
      
      // Cleanup function
      return () => {
        lightningAnimation.stopAnimation();
      };
    }
  }, [lightningAnimation, currentMood, isActive]);

  // Red pulsing glow animation for growth bar
  useEffect(() => {
    if (currentMood === 'angry' && isActive) {
      const startPulseAnimation = () => {
        const pulseSequence = () => {
          Animated.sequence([
            // Pulse up
            Animated.timing(pulseAnimation, {
              toValue: 1.05,
              duration: 1500,
              useNativeDriver: true,
            }),
            // Pulse down
            Animated.timing(pulseAnimation, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
          ]).start(() => {
            pulseSequence(); // Continuous pulsing
          });
        };
        
        pulseSequence();
      };

      startPulseAnimation();
      
      // Cleanup function
      return () => {
        pulseAnimation.stopAnimation();
      };
    }
  }, [pulseAnimation, currentMood, isActive]);

  // Don't render if not angry mood or not active
  if (currentMood !== 'angry' || !isActive) {
    return null;
  }

  // Render fire particle at bottom of screen
  const renderFireParticle = (index: number) => {
    const animation = fireAnimations[index];
    const fireData = getFireParticleData(index);
    
    // Rising animation with heat wave effect
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -fireData.riseHeight],
    });

    // Horizontal flickering motion for heat wave effect
    const translateX = animation.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: [
        0, 
        fireData.flickerAmount, 
        -fireData.flickerAmount, 
        fireData.flickerAmount * 0.5, 
        -fireData.flickerAmount * 0.5, 
        0
      ],
    });

    // Scale animation for fire intensity
    const scale = animation.interpolate({
      inputRange: [0, 0.3, 0.7, 1],
      outputRange: [fireData.initialScale, fireData.maxScale, fireData.maxScale * 0.8, 0.2],
    });

    // Opacity with fire glow effect
    const opacity = animation.interpolate({
      inputRange: [0, 0.1, 0.8, 1],
      outputRange: [0, fireData.opacity, fireData.opacity, 0],
    });

    return (
      <Animated.View
        key={`fire-particle-${index}`}
        style={[
          styles.fireParticleContainer,
          {
            left: fireData.left,
            bottom: fireData.bottom,
            transform: [
              { translateY },
              { translateX },
              { scale },
            ],
            zIndex: fireData.zIndex,
          }
        ]}
      >
        <Animated.View
          style={[
            styles.fireParticle,
            {
              width: fireData.width,
              height: fireData.height,
              opacity: opacity,
              backgroundColor: fireData.color,
              borderRadius: fireData.borderRadius,
              shadowColor: fireData.shadowColor,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.8,
              shadowRadius: fireData.shadowRadius,
            }
          ]}
        />
      </Animated.View>
    );
  };

  // Render lightning flash overlay
  const renderLightningFlash = () => {
    const flashOpacity = lightningAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.3],
    });

    return (
      <Animated.View
        style={[
          styles.lightningFlash,
          {
            opacity: flashOpacity,
          }
        ]}
        testID="lightning-flash"
      />
    );
  };

  // Render red pulsing glow effect (this will be used by growth bar)
  const renderPulsingGlow = () => {
    const glowScale = pulseAnimation.interpolate({
      inputRange: [1, 1.05],
      outputRange: [1, 1.1],
    });

    const glowOpacity = pulseAnimation.interpolate({
      inputRange: [1, 1.05],
      outputRange: [0.6, 0.9],
    });

    return (
      <Animated.View
        style={[
          styles.pulsingGlow,
          {
            transform: [{ scale: glowScale }],
            opacity: glowOpacity,
          }
        ]}
        testID="pulsing-glow"
      />
    );
  };

  return (
    <View style={styles.container} pointerEvents="none" testID="angry-effects-container">
      {/* Fire/Heat Wave Layer at bottom of screen */}
      <View style={styles.fireLayer} testID="fire-layer">
        {fireAnimations.map((_, index) => renderFireParticle(index))}
      </View>
      
      {/* Lightning Flash Overlay */}
      {renderLightningFlash()}
      
      {/* Red Pulsing Glow Effect */}
      {renderPulsingGlow()}
    </View>
  );
};

/**
 * Generate fire particle data for natural fire/heat wave appearance
 */
const getFireParticleData = (index: number) => {
  const fireConfigs = [
    // Large fire particles
    {
      width: 16,
      height: 20,
      color: '#FF4500', // Red-orange
      shadowColor: '#FF6347',
      shadowRadius: 8,
      flickerAmount: 8,
      riseHeight: 120,
      initialScale: 0.5,
      maxScale: 1.4,
      borderRadius: 8,
      opacity: 0.9,
      zIndex: 10,
    },
    // Medium fire particles
    {
      width: 12,
      height: 16,
      color: '#FF6347', // Tomato
      shadowColor: '#FF4500',
      shadowRadius: 6,
      flickerAmount: 12,
      riseHeight: 100,
      initialScale: 0.4,
      maxScale: 1.2,
      borderRadius: 6,
      opacity: 0.8,
      zIndex: 9,
    },
    // Small fire particles
    {
      width: 8,
      height: 12,
      color: '#DC143C', // Crimson
      shadowColor: '#FF0000',
      shadowRadius: 4,
      flickerAmount: 6,
      riseHeight: 80,
      initialScale: 0.3,
      maxScale: 1.0,
      borderRadius: 4,
      opacity: 0.7,
      zIndex: 8,
    },
  ];

  const configIndex = index % fireConfigs.length;
  const baseConfig = fireConfigs[configIndex];
  
  // Calculate position along bottom of screen
  const leftPosition = (index * 8.5 + Math.random() * 10) % 90;
  const bottomPosition = Math.random() * 10; // Slight variation in bottom position
  
  return {
    ...baseConfig,
    left: `${leftPosition}%`,
    bottom: bottomPosition,
    // Add some randomization for natural fire appearance
    flickerAmount: baseConfig.flickerAmount + (Math.random() - 0.5) * 4,
    riseHeight: baseConfig.riseHeight + Math.random() * 30,
  };
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5, // Above other animated elements
  },
  fireLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150, // Fire effects at bottom 150px of screen
    zIndex: 10,
  },
  fireParticleContainer: {
    position: 'absolute',
  },
  fireParticle: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
  },
  lightningFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.4, // Cover cloud area
    backgroundColor: '#FFFFFF',
    zIndex: 15, // Above clouds for lightning effect
  },
  pulsingGlow: {
    position: 'absolute',
    top: '60%', // Position where growth bar typically appears
    left: '10%',
    right: '10%',
    height: 40,
    backgroundColor: '#FF4500',
    borderRadius: 20,
    zIndex: 1, // Behind growth bar but creates glow effect
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
});

export default AngryMoodEffects;