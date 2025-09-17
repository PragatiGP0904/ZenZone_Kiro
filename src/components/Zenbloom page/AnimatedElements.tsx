import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { AnimatedElementsProps, MoodType } from '../types/mood.types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * AnimatedElements component handles all animated environmental elements
 * including clouds, butterflies, rain, and fire effects
 */
export const AnimatedElements: React.FC<AnimatedElementsProps> = ({
  currentMood,
  sharedAssets,
  cloudAnimations,
  butterflyAnimations,
  rainAnimations,
  fireAnimations
}) => {
  // Cloud animation setup - continuous looping movement
  useEffect(() => {
    const startCloudAnimations = () => {
      cloudAnimations.forEach((animation, index) => {
        // Reset animation to start position
        animation.setValue(0);
        
        // Create staggered start times for natural appearance
        const delay = index * 4000; // 4 second stagger between clouds
        
        // Start continuous looping animation
        const animateCloud = () => {
          Animated.timing(animation, {
            toValue: 1,
            duration: 25000, // 25 second duration as specified
            useNativeDriver: true,
          }).start(() => {
            // Reset and restart for continuous loop
            animation.setValue(0);
            animateCloud();
          });
        };
        
        // Start with delay for staggered effect
        setTimeout(animateCloud, delay);
      });
    };

    startCloudAnimations();
    
    // Cleanup function to stop animations
    return () => {
      cloudAnimations.forEach(animation => {
        animation.stopAnimation();
      });
    };
  }, [cloudAnimations]);

  // Butterfly animation setup - wing flapping and flight paths
  useEffect(() => {
    const startButterflyAnimations = () => {
      butterflyAnimations.forEach((animation, index) => {
        // Reset animation to start position
        animation.setValue(0);
        
        // Create staggered start times for natural appearance
        const delay = index * 1200; // 1.2 second stagger between butterflies
        
        // Start continuous looping animation for flight path
        const animateButterfly = () => {
          const butterflyData = getButterflyPositioning(index, currentMood);
          
          Animated.timing(animation, {
            toValue: 1,
            duration: butterflyData.flightDuration,
            useNativeDriver: true,
          }).start(() => {
            // Reset and restart for continuous loop
            animation.setValue(0);
            animateButterfly();
          });
        };
        
        // Start with delay for staggered effect
        setTimeout(animateButterfly, delay);
      });
    };

    startButterflyAnimations();
    
    // Cleanup function to stop animations
    return () => {
      butterflyAnimations.forEach(animation => {
        animation.stopAnimation();
      });
    };
  }, [butterflyAnimations, currentMood]);

  // Rain animation setup - falling raindrops and petals for sad mood
  useEffect(() => {
    if (currentMood === 'sad' && rainAnimations) {
      const startRainAnimations = () => {
        rainAnimations.forEach((animation, index) => {
          // Reset animation to start position
          animation.setValue(0);
          
          // Create staggered start times for natural rain appearance
          const delay = index * 200; // 200ms stagger between raindrops
          
          // Start continuous looping animation for falling rain
          const animateRain = () => {
            const raindropData = getRaindropPositioning(index);
            
            Animated.timing(animation, {
              toValue: 1,
              duration: raindropData.fallDuration,
              useNativeDriver: true,
            }).start(() => {
              // Reset and restart for continuous loop with random delay
              animation.setValue(0);
              const randomDelay = Math.random() * 1000; // 0-1 second random delay
              setTimeout(animateRain, randomDelay);
            });
          };
          
          // Start with delay for staggered effect
          setTimeout(animateRain, delay);
        });
      };

      startRainAnimations();
      
      // Cleanup function to stop animations
      return () => {
        rainAnimations.forEach(animation => {
          animation.stopAnimation();
        });
      };
    }
  }, [rainAnimations, currentMood]);

  // Fire animation setup - heat wave and fire particles for angry mood
  useEffect(() => {
    if (currentMood === 'angry' && fireAnimations) {
      const startFireAnimations = () => {
        fireAnimations.forEach((animation, index) => {
          // Reset animation to start position
          animation.setValue(0);
          
          // Create staggered start times for natural fire appearance
          const delay = index * 150; // 150ms stagger between fire particles
          
          // Start continuous looping animation for fire effects
          const animateFire = () => {
            const fireData = getFireParticlePositioning(index);
            
            Animated.timing(animation, {
              toValue: 1,
              duration: fireData.riseDuration,
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
  }, [fireAnimations, currentMood]);

  // Render individual cloud with parallax movement
  const renderCloud = (cloudAsset: any, index: number) => {
    const animation = cloudAnimations[index];
    
    if (!animation) return null;

    // Calculate cloud positioning for natural sky appearance
    const cloudData = getCloudPositioning(index);
    
    // Transform animation value to screen position
    const translateX = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [-cloudData.width, screenWidth + cloudData.width], // Move from left edge to right edge
    });

    return (
      <Animated.View
        key={`cloud-${index}`}
        style={[
          styles.cloudContainer,
          {
            top: cloudData.top,
            transform: [{ translateX }],
            zIndex: cloudData.zIndex,
          }
        ]}
      >
        <Animated.Image
          source={cloudAsset}
          style={[
            styles.cloudImage,
            {
              width: cloudData.width,
              height: cloudData.height,
              opacity: cloudData.opacity,
            }
          ]}
          resizeMode="contain"
        />
      </Animated.View>
    );
  };

  // Render individual butterfly with wing flapping and flight path
  const renderButterfly = (butterflyAsset: any, index: number) => {
    const animation = butterflyAnimations[index];
    
    if (!animation) return null;

    // Calculate butterfly positioning and flight path
    const butterflyData = getButterflyPositioning(index, currentMood);
    
    // Create curved flight path using interpolation
    const translateX = animation.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: butterflyData.flightPath.x,
    });

    const translateY = animation.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: butterflyData.flightPath.y,
    });

    // Wing flapping animation using scale transform
    const wingFlap = animation.interpolate({
      inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      outputRange: [1, 0.9, 1.1, 0.8, 1.2, 1, 0.9, 1.1, 0.8, 1.2, 1],
    });

    // Rotation for natural flight movement
    const rotation = animation.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: ['0deg', '15deg', '0deg', '-15deg', '0deg'],
    });

    return (
      <Animated.View
        key={`butterfly-${index}`}
        style={[
          styles.butterflyContainer,
          {
            transform: [
              { translateX },
              { translateY },
              { rotate: rotation },
              { scaleX: wingFlap },
              { scaleY: wingFlap },
            ],
            zIndex: butterflyData.zIndex,
          }
        ]}
      >
        <Animated.Image
          source={butterflyAsset}
          style={[
            styles.butterflyImage,
            {
              width: butterflyData.width,
              height: butterflyData.height,
              opacity: butterflyData.opacity,
            }
          ]}
          resizeMode="contain"
        />
      </Animated.View>
    );
  };

  // Render individual raindrop with falling animation
  const renderRaindrop = (index: number) => {
    const animation = rainAnimations?.[index];
    
    if (!animation) return null;

    // Calculate raindrop positioning for natural rain appearance
    const raindropData = getRaindropPositioning(index);
    
    // Transform animation value to screen position (falling down)
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [-raindropData.height, screenHeight + raindropData.height],
    });

    // Fade in/out effect for natural appearance
    const opacity = animation.interpolate({
      inputRange: [0, 0.1, 0.9, 1],
      outputRange: [0, raindropData.opacity, raindropData.opacity, 0],
    });

    // Slight horizontal drift for realism
    const translateX = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, raindropData.drift],
    });

    return (
      <Animated.View
        key={`raindrop-${index}`}
        style={[
          styles.raindropContainer,
          {
            left: raindropData.left,
            transform: [
              { translateY },
              { translateX },
            ],
            zIndex: raindropData.zIndex,
          }
        ]}
      >
        <Animated.View
          style={[
            styles.raindrop,
            {
              width: raindropData.width,
              height: raindropData.height,
              opacity: opacity,
              backgroundColor: raindropData.color,
            }
          ]}
        />
      </Animated.View>
    );
  };

  // Render falling petal for sad mood
  const renderFallingPetal = (index: number) => {
    if (currentMood !== 'sad') return null;
    
    const animation = rainAnimations?.[index + 10]; // Use different animations for petals
    
    if (!animation) return null;

    // Calculate petal positioning and movement
    const petalData = getFallingPetalPositioning(index);
    
    // Falling animation with gentle swaying
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [-20, screenHeight + 50],
    });

    // Gentle swaying motion
    const translateX = animation.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, petalData.swayAmount, 0, -petalData.swayAmount, 0],
    });

    // Rotation for natural falling motion
    const rotation = animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', `${petalData.rotationAmount}deg`],
    });

    // Fade effect
    const opacity = animation.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0, petalData.opacity, petalData.opacity, 0],
    });

    return (
      <Animated.View
        key={`petal-${index}`}
        style={[
          styles.fallingPetalContainer,
          {
            left: petalData.left,
            transform: [
              { translateY },
              { translateX },
              { rotate: rotation },
            ],
            zIndex: petalData.zIndex,
          }
        ]}
      >
        <Animated.View
          style={[
            styles.fallingPetal,
            {
              width: petalData.width,
              height: petalData.height,
              opacity: opacity,
              backgroundColor: petalData.color,
              borderRadius: petalData.borderRadius,
            }
          ]}
        />
      </Animated.View>
    );
  };

  // Render fire particle for angry mood
  const renderFireParticle = (index: number) => {
    const animation = fireAnimations?.[index];
    
    if (!animation) return null;

    // Calculate fire particle positioning and movement
    const fireData = getFireParticlePositioning(index);
    
    // Rising animation with heat wave effect
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -fireData.riseHeight],
    });

    // Horizontal flickering motion
    const translateX = animation.interpolate({
      inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
      outputRange: [0, fireData.flickerAmount, -fireData.flickerAmount, fireData.flickerAmount, -fireData.flickerAmount, 0],
    });

    // Scale animation for fire intensity
    const scale = animation.interpolate({
      inputRange: [0, 0.3, 0.7, 1],
      outputRange: [fireData.initialScale, fireData.maxScale, fireData.maxScale * 0.8, 0.2],
    });

    // Fade effect with fire glow
    const opacity = animation.interpolate({
      inputRange: [0, 0.1, 0.8, 1],
      outputRange: [0, fireData.opacity, fireData.opacity, 0],
    });

    return (
      <Animated.View
        key={`fire-${index}`}
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

  // Render lightning flash effect on clouds for angry mood
  const renderLightningFlash = () => {
    if (currentMood !== 'angry') return null;

    return (
      <Animated.View
        style={[
          styles.lightningFlash,
          {
            opacity: cloudAnimations[0]?.interpolate({
              inputRange: [0, 0.1, 0.15, 0.2, 1],
              outputRange: [0, 0.8, 0, 0.6, 0],
            }) || 0,
          }
        ]}
      />
    );
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Cloud Layer with Lightning Flash */}
      <View style={styles.cloudLayer}>
        {sharedAssets.clouds.map((cloudAsset, index) => 
          renderCloud(cloudAsset, index)
        )}
        
        {/* Lightning Flash Effect for Angry Mood */}
        {renderLightningFlash()}
      </View>
      
      {/* Butterfly Layer */}
      <View style={styles.butterflyLayer}>
        {sharedAssets.butterflies.map((butterflyAsset, index) => 
          renderButterfly(butterflyAsset, index)
        )}
      </View>
      
      {/* Rain Layer for sad mood */}
      {currentMood === 'sad' && rainAnimations && (
        <View style={styles.rainLayer}>
          {/* Falling raindrops */}
          {rainAnimations.slice(0, 15).map((_, index) => 
            renderRaindrop(index)
          )}
          
          {/* Falling petals (occasional) */}
          {rainAnimations.slice(15, 20).map((_, index) => 
            renderFallingPetal(index)
          )}
        </View>
      )}
      
      {/* Fire Layer for angry mood */}
      {currentMood === 'angry' && fireAnimations && (
        <View style={styles.fireLayer}>
          {/* Fire particles and heat wave effects */}
          {fireAnimations.map((_, index) => 
            renderFireParticle(index)
          )}
        </View>
      )}
    </View>
  );
};

/**
 * Calculate positioning data for each cloud to create natural sky appearance
 * Returns positioning, sizing, and layering information for staggered clouds
 */
const getCloudPositioning = (index: number) => {
  const cloudConfigs = [
    // Cloud 1 - Large, high, slow (background)
    {
      width: screenWidth * 0.4,
      height: screenWidth * 0.25,
      top: screenHeight * 0.1,
      opacity: 0.7,
      zIndex: 1,
    },
    // Cloud 2 - Medium, mid-high, medium speed
    {
      width: screenWidth * 0.3,
      height: screenWidth * 0.18,
      top: screenHeight * 0.15,
      opacity: 0.8,
      zIndex: 2,
    },
    // Cloud 3 - Small, high, fast (foreground)
    {
      width: screenWidth * 0.25,
      height: screenWidth * 0.15,
      top: screenHeight * 0.08,
      opacity: 0.9,
      zIndex: 3,
    },
    // Cloud 4 - Large, mid, slow
    {
      width: screenWidth * 0.35,
      height: screenWidth * 0.22,
      top: screenHeight * 0.18,
      opacity: 0.6,
      zIndex: 1,
    },
    // Cloud 5 - Medium, low, medium speed
    {
      width: screenWidth * 0.28,
      height: screenWidth * 0.17,
      top: screenHeight * 0.22,
      opacity: 0.75,
      zIndex: 2,
    },
    // Cloud 6 - Small, very high, fast
    {
      width: screenWidth * 0.2,
      height: screenWidth * 0.12,
      top: screenHeight * 0.05,
      opacity: 0.85,
      zIndex: 3,
    },
  ];

  // Return configuration for the specified cloud index
  return cloudConfigs[index] || cloudConfigs[0];
};

/**
 * Calculate positioning data for raindrops to create natural rain effect
 * Returns positioning, sizing, and timing information for staggered raindrops
 */
const getRaindropPositioning = (index: number) => {
  const raindropConfigs = [
    // Various raindrop configurations for natural appearance
    {
      width: 2,
      height: 15,
      left: `${(index * 7 + 5) % 95}%`,
      opacity: 0.7,
      color: 'rgba(135, 206, 235, 0.8)', // Light blue
      drift: -5, // Slight leftward drift
      fallDuration: 1500,
      zIndex: 4,
    },
    {
      width: 1.5,
      height: 12,
      left: `${(index * 11 + 10) % 90}%`,
      opacity: 0.6,
      color: 'rgba(135, 206, 235, 0.7)',
      drift: 3, // Slight rightward drift
      fallDuration: 1800,
      zIndex: 3,
    },
    {
      width: 2.5,
      height: 18,
      left: `${(index * 13 + 15) % 85}%`,
      opacity: 0.8,
      color: 'rgba(135, 206, 235, 0.9)',
      drift: -8,
      fallDuration: 1200,
      zIndex: 5,
    },
  ];

  // Cycle through configurations
  const configIndex = index % raindropConfigs.length;
  const baseConfig = raindropConfigs[configIndex];
  
  // Add some randomization for natural appearance
  return {
    ...baseConfig,
    left: `${(index * 6.7 + Math.random() * 10) % 95}%`,
    fallDuration: baseConfig.fallDuration + Math.random() * 500, // Add 0-500ms variation
    drift: baseConfig.drift + (Math.random() - 0.5) * 4, // Add slight variation to drift
  };
};

/**
 * Calculate positioning data for falling petals in sad mood
 * Returns positioning, sizing, and movement information for occasional petal falls
 */
const getFallingPetalPositioning = (index: number) => {
  const petalConfigs = [
    // Various petal configurations for natural falling appearance
    {
      width: 8,
      height: 6,
      left: `${(index * 15 + 20) % 80}%`,
      opacity: 0.6,
      color: 'rgba(74, 144, 226, 0.7)', // Sad blue petal color
      swayAmount: 15,
      rotationAmount: 180,
      borderRadius: 4,
      zIndex: 6,
    },
    {
      width: 6,
      height: 4,
      left: `${(index * 18 + 30) % 75}%`,
      opacity: 0.5,
      color: 'rgba(100, 149, 237, 0.6)', // Lighter blue
      swayAmount: 20,
      rotationAmount: 270,
      borderRadius: 3,
      zIndex: 5,
    },
    {
      width: 10,
      height: 8,
      left: `${(index * 22 + 40) % 70}%`,
      opacity: 0.7,
      color: 'rgba(65, 105, 225, 0.8)', // Deeper blue
      swayAmount: 12,
      rotationAmount: 360,
      borderRadius: 5,
      zIndex: 7,
    },
  ];

  // Cycle through configurations
  const configIndex = index % petalConfigs.length;
  const baseConfig = petalConfigs[configIndex];
  
  // Add randomization for natural appearance
  return {
    ...baseConfig,
    left: `${(index * 12.3 + Math.random() * 15) % 85}%`,
    swayAmount: baseConfig.swayAmount + (Math.random() - 0.5) * 8,
    rotationAmount: baseConfig.rotationAmount + Math.random() * 90,
  };
};

/**
 * Calculate positioning data for fire particles in angry mood
 * Returns positioning, sizing, and movement information for fire/heat wave effects
 */
const getFireParticlePositioning = (index: number) => {
  const fireConfigs = [
    // Various fire particle configurations for natural fire appearance
    {
      width: 12,
      height: 16,
      left: `${(index * 8 + 5) % 90}%`,
      bottom: 0,
      opacity: 0.8,
      color: '#FF4500', // Red-orange fire color
      shadowColor: '#FF6347',
      shadowRadius: 6,
      flickerAmount: 8,
      riseHeight: 120,
      initialScale: 0.5,
      maxScale: 1.2,
      borderRadius: 6,
      riseDuration: 1200,
      zIndex: 8,
    },
    {
      width: 8,
      height: 12,
      left: `${(index * 11 + 10) % 85}%`,
      bottom: 5,
      opacity: 0.7,
      color: '#FF6347', // Tomato fire color
      shadowColor: '#FF4500',
      shadowRadius: 4,
      flickerAmount: 12,
      riseHeight: 100,
      initialScale: 0.4,
      maxScale: 1.0,
      borderRadius: 4,
      riseDuration: 1000,
      zIndex: 7,
    },
    {
      width: 16,
      height: 20,
      left: `${(index * 13 + 15) % 80}%`,
      bottom: -2,
      opacity: 0.9,
      color: '#DC143C', // Crimson fire color
      shadowColor: '#FF0000',
      shadowRadius: 8,
      flickerAmount: 6,
      riseHeight: 140,
      initialScale: 0.6,
      maxScale: 1.4,
      borderRadius: 8,
      riseDuration: 1400,
      zIndex: 9,
    },
  ];

  // Cycle through configurations
  const configIndex = index % fireConfigs.length;
  const baseConfig = fireConfigs[configIndex];
  
  // Add randomization for natural fire appearance
  return {
    ...baseConfig,
    left: `${(index * 7.5 + Math.random() * 12) % 88}%`,
    flickerAmount: baseConfig.flickerAmount + (Math.random() - 0.5) * 6,
    riseHeight: baseConfig.riseHeight + Math.random() * 40,
    riseDuration: baseConfig.riseDuration + Math.random() * 400,
  };
};

/**
 * Calculate positioning data and flight paths for butterflies
 * Creates different movement patterns based on mood state
 */
const getButterflyPositioning = (index: number, currentMood: MoodType) => {
  // Base butterfly configurations
  const butterflyConfigs = [
    // Butterfly 1 - Large, gentle arc
    {
      width: screenWidth * 0.08,
      height: screenWidth * 0.08,
      opacity: 0.9,
      zIndex: 4,
      baseFlightDuration: 8000,
    },
    // Butterfly 2 - Medium, figure-8 pattern
    {
      width: screenWidth * 0.06,
      height: screenWidth * 0.06,
      opacity: 0.85,
      zIndex: 3,
      baseFlightDuration: 10000,
    },
    // Butterfly 3 - Small, quick movements
    {
      width: screenWidth * 0.05,
      height: screenWidth * 0.05,
      opacity: 0.8,
      zIndex: 5,
      baseFlightDuration: 6000,
    },
    // Butterfly 4 - Medium, diagonal flight
    {
      width: screenWidth * 0.07,
      height: screenWidth * 0.07,
      opacity: 0.9,
      zIndex: 3,
      baseFlightDuration: 9000,
    },
    // Butterfly 5 - Large, slow curves
    {
      width: screenWidth * 0.09,
      height: screenWidth * 0.09,
      opacity: 0.75,
      zIndex: 2,
      baseFlightDuration: 12000,
    },
    // Butterfly 6 - Small, erratic pattern
    {
      width: screenWidth * 0.04,
      height: screenWidth * 0.04,
      opacity: 0.95,
      zIndex: 6,
      baseFlightDuration: 5000,
    },
    // Butterfly 7 - Medium, circular motion
    {
      width: screenWidth * 0.06,
      height: screenWidth * 0.06,
      opacity: 0.8,
      zIndex: 4,
      baseFlightDuration: 7000,
    },
  ];

  const config = butterflyConfigs[index] || butterflyConfigs[0];
  
  // Create different flight paths based on butterfly index
  const flightPaths = [
    // Butterfly 1 - Gentle horizontal arc
    {
      x: [-config.width, screenWidth * 0.2, screenWidth * 0.5, screenWidth * 0.8, screenWidth + config.width],
      y: [screenHeight * 0.3, screenHeight * 0.25, screenHeight * 0.35, screenHeight * 0.28, screenHeight * 0.32],
    },
    // Butterfly 2 - Figure-8 pattern
    {
      x: [-config.width, screenWidth * 0.15, screenWidth * 0.4, screenWidth * 0.65, screenWidth + config.width],
      y: [screenHeight * 0.4, screenHeight * 0.3, screenHeight * 0.5, screenHeight * 0.3, screenHeight * 0.4],
    },
    // Butterfly 3 - Quick zigzag
    {
      x: [-config.width, screenWidth * 0.25, screenWidth * 0.35, screenWidth * 0.75, screenWidth + config.width],
      y: [screenHeight * 0.2, screenHeight * 0.35, screenHeight * 0.15, screenHeight * 0.4, screenHeight * 0.25],
    },
    // Butterfly 4 - Diagonal sweep
    {
      x: [-config.width, screenWidth * 0.3, screenWidth * 0.6, screenWidth * 0.9, screenWidth + config.width],
      y: [screenHeight * 0.15, screenHeight * 0.4, screenHeight * 0.2, screenHeight * 0.45, screenHeight * 0.18],
    },
    // Butterfly 5 - Large slow curves
    {
      x: [-config.width, screenWidth * 0.1, screenWidth * 0.5, screenWidth * 0.85, screenWidth + config.width],
      y: [screenHeight * 0.5, screenHeight * 0.35, screenHeight * 0.6, screenHeight * 0.3, screenHeight * 0.55],
    },
    // Butterfly 6 - Erratic small movements
    {
      x: [-config.width, screenWidth * 0.2, screenWidth * 0.45, screenWidth * 0.7, screenWidth + config.width],
      y: [screenHeight * 0.25, screenHeight * 0.4, screenHeight * 0.2, screenHeight * 0.45, screenHeight * 0.3],
    },
    // Butterfly 7 - Circular motion
    {
      x: [-config.width, screenWidth * 0.25, screenWidth * 0.5, screenWidth * 0.75, screenWidth + config.width],
      y: [screenHeight * 0.35, screenHeight * 0.2, screenHeight * 0.35, screenHeight * 0.2, screenHeight * 0.35],
    },
  ];

  const flightPath = flightPaths[index] || flightPaths[0];
  
  // Adjust butterfly behavior based on mood
  let moodMultiplier = 1;
  let opacityMultiplier = 1;
  
  switch (currentMood) {
    case 'happy':
      // More active movement - faster and more visible
      moodMultiplier = 0.7; // 30% faster
      opacityMultiplier = 1.2; // More visible
      break;
    case 'sad':
      // Slower, more subdued movement
      moodMultiplier = 1.5; // 50% slower
      opacityMultiplier = 0.6; // Less visible
      break;
    case 'angry':
      // Erratic, quick movements
      moodMultiplier = 0.8; // 20% faster
      opacityMultiplier = 0.8; // Slightly less visible
      break;
  }
  
  return {
    ...config,
    flightPath,
    flightDuration: Math.round(config.baseFlightDuration * moodMultiplier),
    opacity: Math.min(config.opacity * opacityMultiplier, 1), // Cap at 1
  };
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2, // Above background, below UI elements
  },
  cloudLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.4, // Clouds in upper 40% of screen
    zIndex: 1,
  },
  cloudContainer: {
    position: 'absolute',
  },
  cloudImage: {
    // Cloud image styling handled by container
  },
  butterflyLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 3, // Above clouds
  },
  butterflyContainer: {
    position: 'absolute',
  },
  butterflyImage: {
    // Butterfly image styling handled by container
  },
  rainLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2, // Between clouds and butterflies
  },
  raindropContainer: {
    position: 'absolute',
  },
  raindrop: {
    borderRadius: 1,
    shadowColor: 'rgba(135, 206, 235, 0.5)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  fallingPetalContainer: {
    position: 'absolute',
  },
  fallingPetal: {
    shadowColor: 'rgba(74, 144, 226, 0.4)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
  },
  fireLayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: screenHeight * 0.3, // Fire effects in bottom 30%
    zIndex: 2,
  },
  fireParticleContainer: {
    position: 'absolute',
  },
  fireParticle: {
    // Fire particle styling handled by container
  },
  lightningFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 10,
  },
});