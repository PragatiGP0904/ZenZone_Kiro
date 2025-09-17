import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, ImageSourcePropType } from 'react-native';
import { BackgroundLayerProps } from '../types/mood.types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * BackgroundLayer component renders mood-specific backgrounds with smooth transitions
 * Supports Happy, Sad, and Angry mood backgrounds with optional rain and fire effects
 */
export const BackgroundLayer: React.FC<BackgroundLayerProps> = ({
  currentMood,
  backgroundAsset,
  showRain = false,
  showFire = false,
  rainAnimation,
  fireAnimation
}) => {
  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const previousBackgroundRef = useRef<ImageSourcePropType | null>(null);
  const backgroundOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Handle smooth background transitions when mood changes
    if (previousBackgroundRef.current && previousBackgroundRef.current !== backgroundAsset) {
      // Start transition animation
      Animated.sequence([
        // Fade out current background
        Animated.timing(backgroundOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        // Fade in new background
        Animated.timing(backgroundOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
    
    previousBackgroundRef.current = backgroundAsset;
  }, [backgroundAsset, backgroundOpacity]);

  return (
    <View style={styles.container}>
      {/* Main background image */}
      <Animated.Image
        source={backgroundAsset}
        style={[
          styles.backgroundImage,
          {
            opacity: backgroundOpacity,
          },
        ]}
        resizeMode="cover"
      />

      {/* Rain layer for sad mood */}
      {showRain && currentMood === 'sad' && (
        <View style={styles.rainContainer}>
          {/* Rain layer asset overlay */}
          <Animated.Image
            source={require('../../Zenbloom/Images/Rainlayer_sad.png')}
            style={[
              styles.rainLayerImage,
              {
                opacity: 0.8,
              },
            ]}
            resizeMode="cover"
          />
          
          {/* Additional programmatic rain effects if rainAnimation is provided */}
          {rainAnimation && rainAnimation.map((rainAnim, index) => (
            <Animated.View
              key={`rain-${index}`}
              style={[
                styles.rainDrop,
                {
                  left: `${(index * 15) % 100}%`,
                  transform: [
                    {
                      translateY: rainAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-50, screenHeight + 50],
                      }),
                    },
                  ],
                  opacity: rainAnim.interpolate({
                    inputRange: [0, 0.1, 0.9, 1],
                    outputRange: [0, 0.6, 0.6, 0],
                  }),
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* Fire effects for angry mood */}
      {showFire && fireAnimation && (
        <View style={styles.fireContainer}>
          {fireAnimation.map((fireAnim, index) => (
            <Animated.View
              key={`fire-${index}`}
              style={[
                styles.fireParticle,
                {
                  left: `${(index * 20) % 100}%`,
                  bottom: 0,
                  transform: [
                    {
                      translateY: fireAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -100],
                      }),
                    },
                    {
                      scale: fireAnim.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0.5, 1, 0.3],
                      }),
                    },
                  ],
                  opacity: fireAnim.interpolate({
                    inputRange: [0, 0.2, 0.8, 1],
                    outputRange: [0, 1, 1, 0],
                  }),
                },
              ]}
            />
          ))}
        </View>
      )}

      {/* Overlay for mood-specific atmospheric effects */}
      <View style={[styles.overlay, getOverlayStyle(currentMood)]} />
    </View>
  );
};

/**
 * Get mood-specific overlay styles for atmospheric effects
 */
const getOverlayStyle = (mood: string) => {
  switch (mood) {
    case 'happy':
      return {
        backgroundColor: 'rgba(255, 215, 0, 0.05)', // Subtle golden tint
      };
    case 'sad':
      return {
        backgroundColor: 'rgba(74, 144, 226, 0.1)', // Subtle blue tint
      };
    case 'angry':
      return {
        backgroundColor: 'rgba(255, 69, 0, 0.08)', // Subtle red-orange tint
      };
    default:
      return {};
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: screenWidth,
    height: screenHeight,
    zIndex: 0, // Base layer - behind all other elements
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  rainContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    pointerEvents: 'none',
  },
  rainLayerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  rainDrop: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: 'rgba(135, 206, 235, 0.4)', // Lighter blue for additional drops
    borderRadius: 1,
  },
  fireContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 2,
    pointerEvents: 'none',
  },
  fireParticle: {
    position: 'absolute',
    width: 8,
    height: 8,
    backgroundColor: '#FF4500', // Red-orange fire color
    borderRadius: 4,
    shadowColor: '#FF6347',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});

export default BackgroundLayer;