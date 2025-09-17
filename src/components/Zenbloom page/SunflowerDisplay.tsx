import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { MoodType } from '../types/mood.types';

interface SunflowerDisplayProps {
  currentMood: MoodType;
  onTap?: () => void;
}

const getSunflowerImage = (mood: MoodType) => {
  switch (mood) {
    case 'happy':
      return require('../../Zenbloom/Images/Sunflower_Happy.png');
    case 'sad':
      return require('../../Zenbloom/Images/Sunflower_Sad.png');
    case 'angry':
      return require('../../Zenbloom/Images/Sunflower_Angry.png');
    default:
      return require('../../Zenbloom/Images/Sunflower_Happy.png');
  }
};

export const SunflowerDisplay: React.FC<SunflowerDisplayProps> = ({
  currentMood,
  onTap
}) => {
  const swayAnimation = useRef(new Animated.Value(0)).current;

  // Sunflower swaying animation
  useEffect(() => {
    const startSwaying = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(swayAnimation, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(swayAnimation, {
            toValue: -1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(swayAnimation, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startSwaying();
  }, [swayAnimation]);

  // Create rotation interpolation for swaying
  const swayRotation = swayAnimation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-3deg', '0deg', '3deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onTap}
        style={styles.touchableArea}
      >
        <Animated.View
          style={[
            styles.sunflowerContainer,
            {
              transform: [{ rotate: swayRotation }],
            },
          ]}
        >
          <Image
            source={getSunflowerImage(currentMood)}
            style={currentMood === 'sad' ? styles.sunflowerSad : styles.sunflower}
            resizeMode="contain"
          />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 0,
  },
  touchableArea: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sunflowerContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sunflower: {
    width: 450,
    height: 500,
  },
  sunflowerSad: {
    width: 500,
    height: 550,
  },
});