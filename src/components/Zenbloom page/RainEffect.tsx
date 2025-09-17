import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface RainEffectProps {
  visible?: boolean;
}

/**
 * RainEffect Component
 * 
 * Displays a simple animated rain effect that covers the whole screen
 * - Uses React Native Animated for smooth rain animation
 * - Plays in a loop with transparent background
 * - Does not block user interaction with buttons
 * - Lightweight and reliable fallback
 */
const RainEffect: React.FC<RainEffectProps> = ({ visible = true }) => {
  const rainAnimations = useRef(
    Array.from({ length: 60 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (visible) {
      const startRainAnimations = () => {
        rainAnimations.forEach((animation, index) => {
          const animateRain = () => {
            animation.setValue(0);
            Animated.timing(animation, {
              toValue: 1,
              duration: 1000 + Math.random() * 1000, // 1-2 seconds
              useNativeDriver: true,
            }).start(() => {
              setTimeout(animateRain, Math.random() * 500); // Random delay
            });
          };
          
          // Stagger start times
          setTimeout(animateRain, index * 50);
        });
      };

      startRainAnimations();
    }
  }, [visible, rainAnimations]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      {rainAnimations.map((animation, index) => (
        <Animated.View
          key={index}
          style={[
            styles.raindrop,
            {
              left: `${(index * 1.8) % 100}%`,
              transform: [
                {
                  translateY: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, screenHeight + 30],
                  }),
                },
              ],
              opacity: animation.interpolate({
                inputRange: [0, 0.1, 0.9, 1],
                outputRange: [0, 0.7, 0.7, 0],
              }),
            },
          ]}
        />
      ))}
      
      {/* Rain atmosphere overlay */}
      <View style={styles.rainAtmosphere} />
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
    zIndex: 0, // Behind all UI elements
  },
  raindrop: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: 'rgba(135, 206, 235, 0.7)',
    borderRadius: 1,
    top: -30,
  },
  rainAtmosphere: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(135, 206, 235, 0.1)',
  },
});

export default RainEffect;