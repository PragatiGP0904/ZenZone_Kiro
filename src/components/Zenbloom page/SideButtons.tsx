import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { MoodType } from '../types/mood.types';

interface SideButtonsProps {
  currentMood: MoodType;
  onMoodPress: () => void;
  onGrowthPress: () => void;
}

const getMoodButtonImage = (mood: MoodType) => {
  switch (mood) {
    case 'happy':
      return require('../../Zenbloom/Images/Mood_state_Happy.png');
    case 'sad':
    case 'angry':
      return require('../../Zenbloom/Images/Mood_state_angry,sad.png');
    default:
      return require('../../Zenbloom/Images/Mood_state_Happy.png');
  }
};



const getGrowthButtonImage = (mood: MoodType) => {
  switch (mood) {
    case 'happy':
      return require('../../Zenbloom/Images/Growth_leaf_Happy.png');
    case 'sad':
    case 'angry':
      return require('../../Zenbloom/Images/Growth_leaf_sad,angry.png');
    default:
      return require('../../Zenbloom/Images/Growth_leaf_Happy.png');
  }
};

export const SideButtons: React.FC<SideButtonsProps> = ({
  currentMood,
  onMoodPress,
  onGrowthPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={onMoodPress}
        activeOpacity={0.7}
      >
        {/* Individual glass background for mood button */}
        <View style={styles.individualGlassBackground} />
        <Image
          source={getMoodButtonImage(currentMood)}
          style={styles.buttonImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={onGrowthPress}
        activeOpacity={0.7}
      >
        {/* Individual glass background for growth button */}
        <View style={styles.individualGlassBackground} />
        <Image
          source={getGrowthButtonImage(currentMood)}
          style={styles.buttonImage}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    top: '35%',
    transform: [{ translateY: -60 }],
    zIndex: 100,
  },
  individualGlassBackground: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(15px)',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    zIndex: -1,
  },
  button: {
    width: 60,
    height: 60,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  buttonImage: {
    width: 50,
    height: 50,
  },
});