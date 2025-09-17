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
import { MoodSelectorProps, MoodType } from '../types/mood.types';
import { MOOD_CONFIGS } from '../assets/assetConfig';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * MoodSelector Component
 * 
 * A modal interface for selecting mood states with smooth animations
 * Features:
 * - Modal slide-up animation from bottom
 * - Visual mood options with emojis and descriptions
 * - Smooth transitions between mood states
 * - Integration with existing "Change Mood" button
 * - Backdrop dismissal functionality
 */
export const MoodSelector: React.FC<MoodSelectorProps> = ({
  visible,
  currentMood,
  onMoodSelect,
  onClose,
}) => {
  // Animation for modal slide-up
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      // Show modal with slide-up animation
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
        Animated.spring(scaleAnimation, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Hide modal with slide-down animation
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
        Animated.timing(scaleAnimation, {
          toValue: 0.9,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnimation, backdropOpacity, scaleAnimation]);

  const handleMoodSelection = (mood: MoodType) => {
    // Add a small delay for visual feedback
    setTimeout(() => {
      onMoodSelect(mood);
      onClose();
    }, 150);
  };

  if (!visible) {
    return null;
  }

  // Calculate slide transform
  const slideTransform = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, 0],
  });

  const moods: MoodType[] = ['happy', 'sad', 'angry'];

  return (
    <View style={styles.container} testID="mood-selector-container">
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose} testID="mood-selector-backdrop">
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>

      {/* Modal */}
      <Animated.View
        style={[
          styles.modal,
          {
            transform: [
              { translateY: slideTransform },
              { scale: scaleAnimation },
            ],
          },
        ]}
        testID="mood-selector-modal"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Mood</Text>
          <Text style={styles.subtitle}>
            Select how you're feeling right now
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            testID="mood-selector-close"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Mood Options */}
        <View style={styles.moodOptions}>
          {moods.map((mood) => {
            const config = MOOD_CONFIGS[mood];
            const isSelected = currentMood === mood;
            
            return (
              <TouchableOpacity
                key={mood}
                style={[
                  styles.moodOption,
                  isSelected && styles.selectedMoodOption,
                ]}
                onPress={() => handleMoodSelection(mood)}
                testID={`mood-option-${mood}`}
                activeOpacity={0.8}
              >
                {/* Mood Icon */}
                <View style={styles.moodIconContainer}>
                  <Image
                    source={config.assets.sunflower}
                    style={styles.moodIcon}
                    resizeMode="contain"
                  />
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedIndicatorText}>✓</Text>
                    </View>
                  )}
                </View>

                {/* Mood Info */}
                <View style={styles.moodInfo}>
                  <Text style={styles.moodLabel}>
                    {config.emoji} {config.label}
                  </Text>
                  <Text style={styles.moodDescription}>
                    {config.description}
                  </Text>
                </View>

                {/* Selection Border */}
                {isSelected && <View style={styles.selectionBorder} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={onClose}
            testID="mood-selector-cancel"
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
    zIndex: 1000,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: screenHeight * 0.7,
    minHeight: screenHeight * 0.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 20,
  },
  header: {
    padding: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  moodOptions: {
    padding: 20,
    paddingTop: 25,
  },
  moodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 15,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedMoodOption: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  moodIconContainer: {
    width: 60,
    height: 60,
    marginRight: 16,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodIcon: {
    width: 50,
    height: 50,
  },
  selectedIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedIndicatorText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  moodInfo: {
    flex: 1,
  },
  moodLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  moodDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  selectionBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#2196F3',
    opacity: 0.3,
  },
  footer: {
    padding: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  cancelButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
});

export default MoodSelector;