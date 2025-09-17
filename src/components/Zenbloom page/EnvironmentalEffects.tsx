import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { MoodType } from '../types/mood.types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface EnvironmentalEffectsProps {
  currentMood: MoodType;
}

export const EnvironmentalEffects: React.FC<EnvironmentalEffectsProps> = ({
  currentMood,
}) => {
  // Animation values for different effects
  const cloudAnimation1 = useRef(new Animated.Value(0)).current;
  const cloudAnimation2 = useRef(new Animated.Value(0)).current;
  const cloudAnimation3 = useRef(new Animated.Value(0)).current;
  const cloudAnimation4 = useRef(new Animated.Value(0)).current;
  const cloudAnimation5 = useRef(new Animated.Value(0)).current;
  const cloudAnimation6 = useRef(new Animated.Value(0)).current;
  const butterflyAnimation1 = useRef(new Animated.Value(0)).current;
  const butterflyAnimation2 = useRef(new Animated.Value(0)).current;
  const butterflyAnimation3 = useRef(new Animated.Value(0)).current;
  const butterflyAnimation4 = useRef(new Animated.Value(0)).current;
  const butterflyAnimation5 = useRef(new Animated.Value(0)).current;
  const butterflyAnimation6 = useRef(new Animated.Value(0)).current;
  const rainAnimation = useRef(new Animated.Value(0)).current;
  const fireAnimation1 = useRef(new Animated.Value(0)).current;
  const fireAnimation2 = useRef(new Animated.Value(0)).current;
  const fireAnimation3 = useRef(new Animated.Value(0)).current;

  // Cloud animations - only for happy mood (no clouds for angry)
  useEffect(() => {
    const animateCloud = (animation: Animated.Value, duration: number, delay: number) => {
      const startAnimation = () => {
        animation.setValue(0);
        Animated.timing(animation, {
          toValue: 1,
          duration: duration,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(startAnimation, delay);
        });
      };
      setTimeout(startAnimation, delay);
    };

    if (currentMood === 'happy') {
      // More clouds for happy mood - moving across entire screen including button area
      animateCloud(cloudAnimation1, 25000, 0);
      animateCloud(cloudAnimation2, 30000, 3000);
      animateCloud(cloudAnimation3, 22000, 6000);
      animateCloud(cloudAnimation4, 28000, 9000);
      animateCloud(cloudAnimation5, 20000, 12000);
      animateCloud(cloudAnimation6, 26000, 15000);
    }
    // No clouds for sad and angry moods
  }, [currentMood, cloudAnimation1, cloudAnimation2, cloudAnimation3, cloudAnimation4, cloudAnimation5, cloudAnimation6]);

  // Butterfly animations (only for happy mood) - flying in all directions
  useEffect(() => {
    if (currentMood === 'happy') {
      const animateButterfly = (animation: Animated.Value, duration: number, delay: number) => {
        const startAnimation = () => {
          animation.setValue(0);
          Animated.timing(animation, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
          }).start(() => {
            setTimeout(startAnimation, delay + Math.random() * 3000);
          });
        };
        setTimeout(startAnimation, delay);
      };

      // More butterflies flying in different directions
      animateButterfly(butterflyAnimation1, 8000, 0);
      animateButterfly(butterflyAnimation2, 10000, 1500);
      animateButterfly(butterflyAnimation3, 7000, 3000);
      animateButterfly(butterflyAnimation4, 9000, 4500);
      animateButterfly(butterflyAnimation5, 6000, 6000);
      animateButterfly(butterflyAnimation6, 11000, 7500);
    }
  }, [currentMood, butterflyAnimation1, butterflyAnimation2, butterflyAnimation3, butterflyAnimation4, butterflyAnimation5, butterflyAnimation6]);

  // Rain animation removed as requested

  // Fire animations (only for angry mood) - synchronized timing
  useEffect(() => {
    if (currentMood === 'angry') {
      const startSynchronizedFire = () => {
        // Reset all animations to start together
        fireAnimation1.setValue(0);
        fireAnimation2.setValue(0);
        fireAnimation3.setValue(0);
        
        // Start all fire animations simultaneously
        Animated.parallel([
          Animated.timing(fireAnimation1, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(fireAnimation2, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(fireAnimation3, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(startSynchronizedFire, 200);
        });
      };
      
      startSynchronizedFire();
    }
  }, [currentMood, fireAnimation1, fireAnimation2, fireAnimation3]);

  // Render clouds - only for happy mood, bigger and more clouds
  const renderClouds = () => {
    if (currentMood !== 'happy') return null;

    return (
      <>
        {/* Cloud 1 - Large */}
        <Animated.View
          style={[
            styles.cloudContainer,
            {
              top: screenHeight * 0.12,
              left: cloudAnimation1.interpolate({
                inputRange: [0, 1],
                outputRange: [-180, screenWidth + 120],
              }),
            },
          ]}
        >
          <Image
            source={require('../../Zenbloom/Images/Cloud1.png')}
            style={[styles.cloudImage, { width: 180, height: 90 }]}
            resizeMode="contain"
          />
        </Animated.View>
        
        {/* Cloud 2 - Extra Large */}
        <Animated.View
          style={[
            styles.cloudContainer,
            {
              top: screenHeight * 0.18,
              left: cloudAnimation2.interpolate({
                inputRange: [0, 1],
                outputRange: [-220, screenWidth + 150],
              }),
            },
          ]}
        >
          <Image
            source={require('../../Zenbloom/Images/Cloud2.png')}
            style={[styles.cloudImage, { width: 220, height: 110 }]}
            resizeMode="contain"
          />
        </Animated.View>
        
        {/* Cloud 3 - Medium */}
        <Animated.View
          style={[
            styles.cloudContainer,
            {
              top: screenHeight * 0.08,
              left: cloudAnimation3.interpolate({
                inputRange: [0, 1],
                outputRange: [-150, screenWidth + 90],
              }),
            },
          ]}
        >
          <Image
            source={require('../../Zenbloom/Images/Cloud3.png')}
            style={[styles.cloudImage, { width: 150, height: 75 }]}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Cloud 4 - Large - moves through button area */}
        <Animated.View
          style={[
            styles.cloudContainer,
            {
              top: screenHeight * 0.35, // Button area height
              left: cloudAnimation4.interpolate({
                inputRange: [0, 1],
                outputRange: [-200, screenWidth + 130],
              }),
            },
          ]}
        >
          <Image
            source={require('../../Zenbloom/Images/Cloud4.png')}
            style={[styles.cloudImage, { width: 200, height: 100 }]}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Cloud 5 - Medium - very high */}
        <Animated.View
          style={[
            styles.cloudContainer,
            {
              top: screenHeight * 0.05,
              left: cloudAnimation5.interpolate({
                inputRange: [0, 1],
                outputRange: [-130, screenWidth + 70],
              }),
            },
          ]}
        >
          <Image
            source={require('../../Zenbloom/Images/Cloud5.png')}
            style={[styles.cloudImage, { width: 130, height: 65 }]}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Cloud 6 - Large - mid-button area */}
        <Animated.View
          style={[
            styles.cloudContainer,
            {
              top: screenHeight * 0.28, // Near button area
              left: cloudAnimation6.interpolate({
                inputRange: [0, 1],
                outputRange: [-170, screenWidth + 100],
              }),
            },
          ]}
        >
          <Image
            source={require('../../Zenbloom/Images/Cloud6.png')}
            style={[styles.cloudImage, { width: 170, height: 85 }]}
            resizeMode="contain"
          />
        </Animated.View>
      </>
    );
  };

  // Render butterflies (only for happy mood) - flying in all directions
  const renderButterflies = () => {
    if (currentMood !== 'happy') return null;

    return (
      <>
        {/* Butterfly 1 - Circulating around sunflower */}
        <Animated.View
          style={[
            styles.butterflyContainer,
            {
              top: screenHeight * 0.45 + butterflyAnimation1.interpolate({
                inputRange: [0, 0.25, 0.5, 0.75, 1],
                outputRange: [0, -60, 0, 60, 0],
              }),
              left: screenWidth * 0.5 + butterflyAnimation1.interpolate({
                inputRange: [0, 0.25, 0.5, 0.75, 1],
                outputRange: [-80, 0, 80, 0, -80],
              }),
              transform: [
                {
                  scale: butterflyAnimation1.interpolate({
                    inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                    outputRange: [1, 1.1, 0.9, 1.2, 0.8, 1, 1.1, 0.9, 1.2, 0.8, 1],
                  }),
                },
                {
                  rotate: butterflyAnimation1.interpolate({
                    inputRange: [0, 0.25, 0.5, 0.75, 1],
                    outputRange: ['0deg', '90deg', '180deg', '270deg', '360deg'],
                  }),
                },
              ],
              opacity: butterflyAnimation1.interpolate({
                inputRange: [0, 0.1, 0.9, 1],
                outputRange: [1, 1, 1, 1], // Never disappear
              }),
            },
          ]}
        >
          <Image
            source={require('../../Zenbloom/Images/Butterfly1.png')}
            style={styles.butterflyImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Butterfly 2 - Figure-8 around sunflower */}
        <Animated.View
          style={[
            styles.butterflyContainer,
            {
              top: screenHeight * 0.4 + butterflyAnimation2.interpolate({
                inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
                outputRange: [0, -40, 0, 40, 0, -40, 0, 40, 0],
              }),
              left: screenWidth * 0.5 + butterflyAnimation2.interpolate({
                inputRange: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
                outputRange: [-60, -30, 0, 30, 60, 30, 0, -30, -60],
              }),
              transform: [
                {
                  scale: butterflyAnimation2.interpolate({
                    inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                    outputRange: [1, 0.9, 1.2, 0.8, 1.1, 1, 0.9, 1.2, 0.8, 1.1, 1],
                  }),
                },
              ],
              opacity: 1, // Always visible
            },
          ]}
        >
          <Image
            source={require('../../Zenbloom/Images/Butterfly2.png')}
            style={styles.butterflyImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Butterfly 3 - Spiral around sunflower */}
        <Animated.View
          style={[
            styles.butterflyContainer,
            {
              top: screenHeight * 0.5 + butterflyAnimation3.interpolate({
                inputRange: [0, 0.33, 0.66, 1],
                outputRange: [-100, -30, 30, -100],
              }),
              left: screenWidth * 0.5 + butterflyAnimation3.interpolate({
                inputRange: [0, 0.33, 0.66, 1],
                outputRange: [0, -70, 70, 0],
              }),
              transform: [
                {
                  scale: butterflyAnimation3.interpolate({
                    inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                    outputRange: [1, 1.2, 0.8, 1.1, 0.9, 1, 1.2, 0.8, 1.1, 0.9, 1],
                  }),
                },
              ],
              opacity: 1, // Always visible
            },
          ]}
        >
          <Image
            source={require('../../Zenbloom/Images/Butterfly3.png')}
            style={styles.butterflyImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Butterfly 4 - Large circle around sunflower */}
        <Animated.View
          style={[
            styles.butterflyContainer,
            {
              top: screenHeight * 0.42 + butterflyAnimation4.interpolate({
                inputRange: [0, 0.25, 0.5, 0.75, 1],
                outputRange: [0, -80, 0, 80, 0],
              }),
              left: screenWidth * 0.5 + butterflyAnimation4.interpolate({
                inputRange: [0, 0.25, 0.5, 0.75, 1],
                outputRange: [100, 0, -100, 0, 100],
              }),
              transform: [
                {
                  scale: butterflyAnimation4.interpolate({
                    inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                    outputRange: [1, 0.9, 1.3, 0.7, 1.2, 1, 0.9, 1.3, 0.7, 1.2, 1],
                  }),
                },
              ],
              opacity: 1, // Always visible
            },
          ]}
        >
          <Image
            source={require('../../Zenbloom/Images/Butterfly4.png')}
            style={styles.butterflyImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Butterfly 5 - Top area around sunflower */}
        <Animated.View
          style={[
            styles.butterflyContainer,
            {
              top: screenHeight * 0.25 + butterflyAnimation5.interpolate({
                inputRange: [0, 0.33, 0.66, 1],
                outputRange: [0, -40, 20, 0],
              }),
              left: screenWidth * 0.5 + butterflyAnimation5.interpolate({
                inputRange: [0, 0.33, 0.66, 1],
                outputRange: [-120, 60, -60, -120],
              }),
              transform: [
                {
                  scale: butterflyAnimation5.interpolate({
                    inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                    outputRange: [1, 1.1, 0.8, 1.3, 0.9, 1, 1.1, 0.8, 1.3, 0.9, 1],
                  }),
                },
              ],
              opacity: 1,
            },
          ]}
        >
          <Image
            source={require('../../Zenbloom/Images/Butterfly5.png')}
            style={styles.butterflyImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Butterfly 6 - Bottom right area */}
        <Animated.View
          style={[
            styles.butterflyContainer,
            {
              top: screenHeight * 0.55 + butterflyAnimation6.interpolate({
                inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
                outputRange: [0, -30, 15, -20, 10, 0],
              }),
              left: screenWidth * 0.5 + butterflyAnimation6.interpolate({
                inputRange: [0, 0.2, 0.4, 0.6, 0.8, 1],
                outputRange: [120, 80, 140, 60, 100, 120],
              }),
              transform: [
                {
                  scale: butterflyAnimation6.interpolate({
                    inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                    outputRange: [1, 0.8, 1.4, 0.6, 1.3, 1, 0.8, 1.4, 0.6, 1.3, 1],
                  }),
                },
              ],
              opacity: 1,
            },
          ]}
        >
          <Image
            source={require('../../Zenbloom/Images/Butterfly7.png')}
            style={styles.butterflyImage}
            resizeMode="contain"
          />
        </Animated.View>
      </>
    );
  };

  // Rain animation removed as requested
  const renderRain = () => {
    return null;
  };

  // Render fire effects (only for angry mood) - from sides and top, avoiding header
  const renderFire = () => {
    if (currentMood !== 'angry') return null;

    // Bottom fire particles
    const bottomFire = Array.from({ length: 20 }, (_, index) => (
      <Animated.View
        key={`bottom-${index}`}
        style={[
          styles.fireParticle,
          {
            left: (index * screenWidth / 20) + Math.random() * 20,
            bottom: Math.random() * 30,
            transform: [
              {
                translateY: fireAnimation1.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -120 - Math.random() * 80],
                }),
              },
              {
                scale: fireAnimation1.interpolate({
                  inputRange: [0, 0.3, 0.7, 1],
                  outputRange: [0.5, 1.3, 0.9, 0.2],
                }),
              },
            ],
            opacity: fireAnimation1.interpolate({
              inputRange: [0, 0.2, 0.8, 1],
              outputRange: [0, 1, 1, 0],
            }),
          },
        ]}
      />
    ));

    // Left side fire particles
    const leftFire = Array.from({ length: 10 }, (_, index) => (
      <Animated.View
        key={`left-${index}`}
        style={[
          styles.fireParticleSmall,
          {
            left: Math.random() * 30,
            top: 120 + (index * (screenHeight - 200) / 10),
            transform: [
              {
                translateX: fireAnimation2.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 60 + Math.random() * 40],
                }),
              },
              {
                scale: fireAnimation2.interpolate({
                  inputRange: [0, 0.4, 0.8, 1],
                  outputRange: [0.3, 1.0, 0.7, 0.1],
                }),
              },
            ],
            opacity: fireAnimation2.interpolate({
              inputRange: [0, 0.3, 0.7, 1],
              outputRange: [0, 0.8, 0.8, 0],
            }),
          },
        ]}
      />
    ));

    // Right side fire particles
    const rightFire = Array.from({ length: 10 }, (_, index) => (
      <Animated.View
        key={`right-${index}`}
        style={[
          styles.fireParticleSmall,
          {
            right: Math.random() * 30,
            top: 120 + (index * (screenHeight - 200) / 10),
            transform: [
              {
                translateX: fireAnimation3.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -60 - Math.random() * 40],
                }),
              },
              {
                scale: fireAnimation3.interpolate({
                  inputRange: [0, 0.4, 0.8, 1],
                  outputRange: [0.3, 1.0, 0.7, 0.1],
                }),
              },
            ],
            opacity: fireAnimation3.interpolate({
              inputRange: [0, 0.3, 0.7, 1],
              outputRange: [0, 0.8, 0.8, 0],
            }),
          },
        ]}
      />
    ));

    return (
      <>
        {bottomFire}
        {leftFire}
        {rightFire}
      </>
    );
  };

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Clouds for all moods */}
      {renderClouds()}
      
      {/* Butterflies only for happy mood */}
      {renderButterflies()}
      
      {/* Rain only for sad mood */}
      {renderRain()}
      
      {/* Fire only for angry mood */}
      {renderFire()}
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
    zIndex: 1,
  },
  cloudContainer: {
    position: 'absolute',
  },
  cloudImage: {
    opacity: 0.9,
  },
  butterflyContainer: {
    position: 'absolute',
  },
  butterflyImage: {
    width: 18,
    height: 15,
  },

  fireParticle: {
    position: 'absolute',
    width: 10,
    height: 15,
    backgroundColor: '#FF4500',
    borderRadius: 5,
    shadowColor: '#FF6347',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
  },
  fireParticleSmall: {
    position: 'absolute',
    width: 6,
    height: 10,
    backgroundColor: '#FF6347',
    borderRadius: 3,
    shadowColor: '#FF4500',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});