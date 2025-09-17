import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { InteractionButtonsProps } from '../types/mood.types';
import { buttonPressHaptic } from '../utils/haptics';

/**
 * InteractionButtons Component
 * 
 * Renders mood and growth buttons with glass-style design
 * Features:
 * - Mood-specific button assets (Happy vs Sad/Angry states)
 * - Glass-style frosted effect design
 * - Right-side positioning with proper spacing
 * - Touch feedback and press animations
 * - Mood state switching based on current mood
 */
export const InteractionButtons: React.FC<InteractionButtonsProps> = ({
  currentMood,
  moodAssets,
  onMoodButtonPress,
  onGrowthButtonPress,
  buttonPressAnimation
}) => {
  const [moodButtonPressed, setMoodButtonPressed] = useState(false);
  const [growthButtonPressed, setGrowthButtonPressed] = useState(false);
  const [moodButtonScale] = useState(new Animated.Value(1));
  const [growthButtonScale] = useState(new Animated.Value(1));

  // Handle mood button press with animation and haptic feedback
  const handleMoodButtonPressIn = () => {
    setMoodButtonPressed(true);
    // Haptic feedback
    buttonPressHaptic();
    // Scale down animation
    Animated.timing(moodButtonScale, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleMoodButtonPressOut = () => {
    setMoodButtonPressed(false);
    // Scale back up animation
    Animated.timing(moodButtonScale, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
    // Call the actual press handler
    onMoodButtonPress();
  };

  // Handle growth button press with animation and haptic feedback
  const handleGrowthButtonPressIn = () => {
    setGrowthButtonPressed(true);
    // Haptic feedback
    buttonPressHaptic();
    // Scale down animation
    Animated.timing(growthButtonScale, {
      toValue: 0.95,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const handleGrowthButtonPressOut = () => {
    setGrowthButtonPressed(false);
    // Scale back up animation
    Animated.timing(growthButtonScale, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
    // Call the actual press handler
    onGrowthButtonPress();
  };

  return (
    <View style={styles.container}>
      {/* Mood Button */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: moodButtonScale }],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, styles.glassEffect]}
          onPressIn={handleMoodButtonPressIn}
          onPressOut={handleMoodButtonPressOut}
          activeOpacity={1}
          testID="mood-button"
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Mood button - currently ${currentMood}`}
          accessibilityHint="Shows information about your current mood"
        >
          <Image
            source={moodButtonPressed ? moodAssets.moodButtonClicked : moodAssets.moodButton}
            style={styles.buttonImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Growth Button */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            transform: [{ scale: growthButtonScale }],
          },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, styles.glassEffect]}
          onPressIn={handleGrowthButtonPressIn}
          onPressOut={handleGrowthButtonPressOut}
          activeOpacity={1}
          testID="growth-button"
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Growth progress button"
          accessibilityHint="Shows your growth progress and streak information"
        >
          <Image
            source={growthButtonPressed ? moodAssets.growthButtonClicked : moodAssets.growthButton}
            style={styles.buttonImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    top: '40%',
    zIndex: 10, // Highest z-index to ensure buttons are touchable
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    // Glass frosted effect
    backdropFilter: 'blur(10px)', // Note: This may not work on all platforms
  },
  buttonImage: {
    width: 40,
    height: 40,
  },
});

export default InteractionButtons;