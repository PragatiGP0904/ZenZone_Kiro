import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { GrowthCardProps } from '../types/mood.types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * GrowthCard Component
 * 
 * Displays growth progress and streak information in a slide-in card overlay
 * Features:
 * - Progress visualization with mood-specific colors
 * - Streak tracking and milestone display
 * - Slide-in animation from right side
 * - Mood-specific growth flower assets
 * - Interactive progress bar with visual feedback
 */
export const GrowthCard: React.FC<GrowthCardProps> = ({
  visible,
  streakData,
  moodConfig,
  onClose,
  slideAnimation,
  progressAnimation
}) => {
  // Animation for backdrop opacity
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  
  // Special effects animations
  const shimmerAnimation = useRef(new Animated.Value(0)).current;
  const sparkleAnimations = useRef(
    Array.from({ length: 8 }, () => new Animated.Value(0))
  ).current;
  const milestoneAnimations = useRef(
    streakData.milestones.map(() => new Animated.Value(1))
  ).current;
  
  // Red pulsing glow animation for angry mood
  const redPulseAnimation = useRef(new Animated.Value(1)).current;
  
  // Enhanced gradient and particle effects
  const gradientAnimation = useRef(new Animated.Value(0)).current;
  const particleAnimations = useRef(
    Array.from({ length: 12 }, () => ({
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
      rotate: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    if (visible) {
      // Show card with slide-in animation
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Animate progress bar
        Animated.timing(progressAnimation, {
          toValue: streakData.progressPercentage / 100,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start(() => {
        // Start special effects after main animations complete
        startSpecialEffects();
      });
    } else {
      // Hide card with slide-out animation
      Animated.parallel([
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Stop special effects
      stopSpecialEffects();
    }
  }, [visible, slideAnimation, backdropOpacity, progressAnimation, streakData.progressPercentage]);

  // Start special effects animations
  const startSpecialEffects = () => {
    // Start shimmer effect
    startShimmerEffect();
    
    // Start enhanced sparkle particles
    startEnhancedSparkleEffect();
    
    // Start gradient animation
    startGradientAnimation();
    
    // Start particle system
    startParticleSystem();
    
    // Trigger milestone bloom pulses
    triggerMilestonePulses();
    
    // Start red pulsing glow for angry mood
    if (moodConfig.type === 'angry') {
      startRedPulseEffect();
    }
  };

  // Stop special effects animations
  const stopSpecialEffects = () => {
    shimmerAnimation.stopAnimation();
    gradientAnimation.stopAnimation();
    redPulseAnimation.stopAnimation();
    sparkleAnimations.forEach(anim => anim.stopAnimation());
    milestoneAnimations.forEach(anim => anim.stopAnimation());
    particleAnimations.forEach(particle => {
      particle.translateY.stopAnimation();
      particle.opacity.stopAnimation();
      particle.scale.stopAnimation();
      particle.rotate.stopAnimation();
    });
  };

  // Red pulsing glow effect for angry mood
  const startRedPulseEffect = () => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(redPulseAnimation, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(redPulseAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(pulse, 200); // Short pause between pulses
      });
    };
    pulse();
  };

  // Enhanced shimmer effect that passes across the progress bar
  const startShimmerEffect = () => {
    const shimmer = () => {
      shimmerAnimation.setValue(0);
      
      // Adjust shimmer duration and intensity based on mood
      let shimmerDuration = 2500; // Default duration
      let shimmerInterval = 4000; // Default interval
      
      if (moodConfig.type === 'sad') {
        shimmerDuration = 3500; // Slower for sad mood
        shimmerInterval = 6000; // Less frequent for sad mood
      } else if (moodConfig.type === 'angry') {
        shimmerDuration = 1500; // Faster for angry mood
        shimmerInterval = 2000; // More frequent for angry mood
      }
      
      Animated.timing(shimmerAnimation, {
        toValue: 1,
        duration: shimmerDuration,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(shimmer, shimmerInterval);
      });
    };
    shimmer();
  };

  // Smooth gradient filling animation
  const startGradientAnimation = () => {
    const gradient = () => {
      gradientAnimation.setValue(0);
      Animated.timing(gradientAnimation, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(gradient, 5000); // Repeat every 5 seconds
      });
    };
    gradient();
  };

  // Enhanced sparkle particles rising from progress bar
  const startEnhancedSparkleEffect = () => {
    const createSparkle = (index: number) => {
      const delay = index * 200; // Stagger sparkles
      
      const sparkle = () => {
        sparkleAnimations[index].setValue(0);
        Animated.timing(sparkleAnimations[index], {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(sparkle, 1500 + Math.random() * 3000); // Random interval
        });
      };
      
      setTimeout(sparkle, delay);
    };

    sparkleAnimations.forEach((_, index) => createSparkle(index));
  };

  // Advanced particle system for rising effects
  const startParticleSystem = () => {
    const createParticle = (index: number) => {
      const delay = index * 150; // Stagger particles
      
      const animateParticle = () => {
        // Reset particle values
        particleAnimations[index].translateY.setValue(0);
        particleAnimations[index].opacity.setValue(0);
        particleAnimations[index].scale.setValue(0);
        particleAnimations[index].rotate.setValue(0);
        
        // Animate particle lifecycle
        Animated.parallel([
          Animated.timing(particleAnimations[index].translateY, {
            toValue: -80,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(particleAnimations[index].opacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.delay(1900),
            Animated.timing(particleAnimations[index].opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(particleAnimations[index].scale, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.delay(1700),
            Animated.timing(particleAnimations[index].scale, {
              toValue: 0.3,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(particleAnimations[index].rotate, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(animateParticle, 1000 + Math.random() * 2000); // Random interval
        });
      };
      
      setTimeout(animateParticle, delay);
    };

    particleAnimations.forEach((_, index) => createParticle(index));
  };

  // Enhanced milestone bloom pulse effects at 25%, 50%, 75%, 100%
  const triggerMilestonePulses = () => {
    const milestonePoints = [25, 50, 75, 100];
    
    milestonePoints.forEach((milestone, index) => {
      if (streakData.progressPercentage >= milestone) {
        const delay = index * 300; // Stagger pulses
        
        setTimeout(() => {
          // Create bloom pulse effect using Animated.sequence with milestoneAnimations
          Animated.sequence([
            Animated.timing(milestoneAnimations[index], {
              toValue: 1.5,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(milestoneAnimations[index], {
              toValue: 1.2,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(milestoneAnimations[index], {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start();
          
          // Trigger additional sparkle burst at milestone
          triggerMilestoneBurst(milestone);
        }, delay);
      }
    });
  };

  // Trigger sparkle burst at milestone points
  const triggerMilestoneBurst = (milestone: number) => {
    const burstParticles = particleAnimations.slice(0, 4); // Use first 4 particles for burst
    
    burstParticles.forEach((particle, index) => {
      const delay = index * 50;
      
      setTimeout(() => {
        // Reset particle
        particle.translateY.setValue(0);
        particle.opacity.setValue(0);
        particle.scale.setValue(0);
        particle.rotate.setValue(0);
        
        // Burst animation
        Animated.parallel([
          Animated.timing(particle.translateY, {
            toValue: -60,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: 1,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.delay(700),
            Animated.timing(particle.opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(particle.scale, {
            toValue: 1.5,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(particle.rotate, {
            toValue: 2,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start();
      }, delay);
    });
  };

  if (!visible) {
    return null;
  }

  // Get mood-specific styling
  const getMoodStyling = () => {
    switch (moodConfig.type) {
      case 'happy':
        return {
          backgroundColor: 'rgba(255, 215, 0, 0.95)', // Golden
          borderColor: 'rgba(255, 215, 0, 0.3)',
          textColor: '#2C1810',
          progressColor: '#FFD700',
          progressTrackColor: 'rgba(255, 215, 0, 0.3)',
        };
      case 'sad':
        return {
          backgroundColor: 'rgba(74, 144, 226, 0.95)', // Blue
          borderColor: 'rgba(74, 144, 226, 0.3)',
          textColor: '#FFFFFF',
          progressColor: '#4A90E2',
          progressTrackColor: 'rgba(74, 144, 226, 0.3)',
        };
      case 'angry':
        return {
          backgroundColor: 'rgba(255, 69, 0, 0.95)', // Red-Orange
          borderColor: 'rgba(255, 69, 0, 0.3)',
          textColor: '#FFFFFF',
          progressColor: '#FF4500',
          progressTrackColor: 'rgba(255, 69, 0, 0.3)',
        };
      default:
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          textColor: '#000000',
          progressColor: '#007AFF',
          progressTrackColor: 'rgba(0, 122, 255, 0.3)',
        };
    }
  };

  const styling = getMoodStyling();

  // Calculate slide transform
  const slideTransform = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [screenWidth, 0],
  });

  // Calculate progress bar width
  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container} testID="growth-card-container">
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose} testID="growth-card-backdrop">
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Card */}
      <Animated.View
        style={[
          styles.card,
          {
            backgroundColor: styling.backgroundColor,
            borderColor: styling.borderColor,
            transform: [{ translateX: slideTransform }],
          },
        ]}
        testID="growth-card"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: styling.textColor }]}>
            Growth Progress 🌱
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            testID="growth-card-close"
          >
            <Text style={[styles.closeButtonText, { color: styling.textColor }]}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Growth Flower Asset */}
          <View style={styles.flowerContainer}>
            <Image
              source={moodConfig.assets.growthFlower}
              style={styles.growthFlower}
              resizeMode="contain"
            />
          </View>

          {/* Streak Information */}
          <View style={styles.streakContainer}>
            <Text style={[styles.streakTitle, { color: styling.textColor }]}>
              Current Streak
            </Text>
            <Text style={[styles.streakNumber, { color: styling.textColor }]}>
              {streakData.currentStreak} days
            </Text>
            <Text style={[styles.streakSubtext, { color: styling.textColor }]}>
              Total: {streakData.totalDays} days
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <Text style={[styles.progressLabel, { color: styling.textColor }]}>
              Progress: {streakData.progressPercentage}%
            </Text>
            
            <View style={styles.progressBarContainer}>
              {/* Progress Track */}
              <View 
                style={[
                  styles.progressTrack, 
                  { backgroundColor: styling.progressTrackColor }
                ]} 
              />
              
              {/* Progress Bar with Enhanced Gradient */}
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: styling.progressColor,
                    width: progressWidth,
                  },
                ]}
                testID="progress-bar"
              >
                {/* Gradient Overlay */}
                <Animated.View
                  style={[
                    styles.gradientOverlay,
                    {
                      opacity: gradientAnimation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0.3, 0.8, 0.3],
                      }),
                      transform: [
                        {
                          scaleX: gradientAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.8, 1.2],
                          }),
                        },
                      ],
                    },
                  ]}
                />
                
                {/* Enhanced Shimmer Effect */}
                <Animated.View
                  style={[
                    styles.shimmerEffect,
                    {
                      backgroundColor: moodConfig.type === 'sad' 
                        ? 'rgba(135, 206, 235, 0.4)' // Dim blue shimmer for sad mood
                        : moodConfig.type === 'angry'
                        ? 'rgba(255, 69, 0, 0.7)' // Red-orange shimmer for angry mood
                        : 'rgba(255, 255, 255, 0.6)', // Default white shimmer
                      transform: [
                        {
                          translateX: shimmerAnimation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-80, screenWidth + 50],
                          }),
                        },
                        ...(moodConfig.type === 'angry' ? [{
                          scale: redPulseAnimation,
                        }] : []),
                      ],
                      opacity: shimmerAnimation.interpolate({
                        inputRange: [0, 0.3, 0.7, 1],
                        outputRange: [
                          0, 
                          moodConfig.type === 'sad' ? 0.6 : moodConfig.type === 'angry' ? 0.9 : 1, 
                          moodConfig.type === 'sad' ? 0.6 : moodConfig.type === 'angry' ? 0.9 : 1, 
                          0
                        ],
                      }),
                      shadowColor: moodConfig.type === 'angry' ? '#FF4500' : undefined,
                      shadowOffset: moodConfig.type === 'angry' ? { width: 0, height: 0 } : undefined,
                      shadowOpacity: moodConfig.type === 'angry' ? 0.8 : undefined,
                      shadowRadius: moodConfig.type === 'angry' ? 8 : undefined,
                    },
                  ]}
                />
              </Animated.View>
              
              {/* Enhanced Sparkle Particles */}
              {sparkleAnimations.map((sparkleAnim, index) => {
                const sparkleTranslateY = sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -80],
                });
                
                const sparkleOpacity = sparkleAnim.interpolate({
                  inputRange: [0, 0.15, 0.85, 1],
                  outputRange: [0, 1, 1, 0],
                });
                
                const sparkleScale = sparkleAnim.interpolate({
                  inputRange: [0, 0.3, 0.7, 1],
                  outputRange: [0.3, 1.2, 1, 0.2],
                });
                
                const sparkleRotate = sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                });

                return (
                  <Animated.View
                    key={`sparkle-${index}`}
                    style={[
                      styles.sparkleParticle,
                      {
                        left: `${(index * 12 + 8) % 85}%`,
                        backgroundColor: styling.progressColor,
                        transform: [
                          { translateY: sparkleTranslateY },
                          { scale: sparkleScale },
                          { rotate: sparkleRotate },
                        ],
                        opacity: sparkleOpacity,
                      },
                    ]}
                  />
                );
              })}
              
              {/* Advanced Particle System */}
              {particleAnimations.map((particle, index) => {
                const particleRotate = particle.rotate.interpolate({
                  inputRange: [0, 1, 2],
                  outputRange: ['0deg', '180deg', '360deg'],
                });

                return (
                  <Animated.View
                    key={`particle-${index}`}
                    style={[
                      styles.advancedParticle,
                      {
                        left: `${(index * 8 + 5) % 90}%`,
                        backgroundColor: styling.progressColor,
                        transform: [
                          { translateY: particle.translateY },
                          { scale: particle.scale },
                          { rotate: particleRotate },
                        ],
                        opacity: particle.opacity,
                      },
                    ]}
                  />
                );
              })}
            </View>

            {/* Milestones */}
            <View style={styles.milestonesContainer}>
              <Text style={[styles.milestonesLabel, { color: styling.textColor }]}>
                Milestones
              </Text>
              <View style={styles.milestonesList}>
                {streakData.milestones.map((milestone, index) => {
                  const isAchieved = streakData.progressPercentage >= milestone;
                  
                  return (
                    <Animated.View
                      key={milestone}
                      style={[
                        styles.milestone,
                        {
                          backgroundColor: isAchieved
                            ? styling.progressColor
                            : styling.progressTrackColor,
                          transform: [{ scale: milestoneAnimations[index] }],
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.milestoneText,
                          {
                            color: isAchieved ? '#FFFFFF' : styling.textColor,
                          },
                        ]}
                      >
                        {milestone}%
                      </Text>
                      
                      {/* milestoneBloom backgroundColor visual effects for achieved milestones */}
                      {isAchieved && (
                        <Animated.View
                          style={[
                            styles.milestoneBloom,
                            {
                              backgroundColor: styling.progressColor,
                              transform: [{ scale: milestoneAnimations[index] }],
                            },
                          ]}
                        />
                      )}
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: styling.textColor }]}
            onPress={onClose}
            testID="growth-card-continue"
          >
            <Text style={[styles.actionButtonText, { color: styling.textColor }]}>
              Keep Growing!
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    width: screenWidth * 0.85,
    maxHeight: screenHeight * 0.8,
    marginRight: 20,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  flowerContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  growthFlower: {
    width: 60,
    height: 60,
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  streakTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  streakSubtext: {
    fontSize: 14,
    opacity: 0.8,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    position: 'relative',
    marginBottom: 20,
  },
  progressTrack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 6,
  },
  progressBar: {
    position: 'absolute',
    height: '100%',
    borderRadius: 6,
    minWidth: 2,
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 6,
  },
  shimmerEffect: {
    position: 'absolute',
    top: -2,
    width: 60,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 8,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  milestonesContainer: {
    width: '100%',
    alignItems: 'center',
  },
  milestonesLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  milestonesList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  milestone: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  milestoneText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  actionButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sparkleParticle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    bottom: 12,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  advancedParticle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    bottom: 12,
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  milestoneBloom: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 16,
    opacity: 0.3,
  },
});

export default GrowthCard;