import React, { useEffect } from 'react';
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
import { MoodCardProps } from '../types/mood.types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * MoodCard Component
 * 
 * Displays mood-specific information in a slide-in card overlay
 * Features:
 * - Slide-in animation from right side
 * - Mood-specific text and styling
 * - Glass-style design with backdrop
 * - Dismiss functionality (tap outside or close button)
 * - Smooth entrance and exit animations
 */
export const MoodCard: React.FC<MoodCardProps> = ({
  visible,
  moodConfig,
  onClose,
  slideAnimation
}) => {
  // Animation for backdrop opacity
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;

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
      ]).start();
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
    }
  }, [visible, slideAnimation, backdropOpacity]);

  if (!visible) {
    return null;
  }

  // Get mood-specific content
  const getMoodContent = () => {
    switch (moodConfig.type) {
      case 'happy':
        return {
          title: 'Happy 🌼',
          description: 'Your flower is blooming with joy today.',
          backgroundColor: 'rgba(255, 215, 0, 0.9)', // Golden
          borderColor: 'rgba(255, 215, 0, 0.3)',
          textColor: '#2C1810',
        };
      case 'sad':
        return {
          title: 'Sad 🌧️',
          description: 'Your flower is wilting, make it happy.',
          backgroundColor: 'rgba(74, 144, 226, 0.9)', // Blue
          borderColor: 'rgba(74, 144, 226, 0.3)',
          textColor: '#FFFFFF',
        };
      case 'angry':
        return {
          title: 'Angry 🔥',
          description: 'Your flower is fuming, calm it down.',
          backgroundColor: 'rgba(255, 69, 0, 0.9)', // Red-Orange
          borderColor: 'rgba(255, 69, 0, 0.3)',
          textColor: '#FFFFFF',
        };
      default:
        return {
          title: 'Mood',
          description: 'How are you feeling today?',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          textColor: '#000000',
        };
    }
  };

  const content = getMoodContent();

  // Calculate slide transform
  const slideTransform = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [screenWidth, 0],
  });

  return (
    <View style={styles.container} testID="mood-card-container">
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose} testID="mood-card-backdrop">
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
            backgroundColor: content.backgroundColor,
            borderColor: content.borderColor,
            transform: [{ translateX: slideTransform }],
          },
        ]}
        testID="mood-card"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: content.textColor }]}>
            {content.title}
          </Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            testID="mood-card-close"
          >
            <Text style={[styles.closeButtonText, { color: content.textColor }]}>
              ✕
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Mood Icon/Asset */}
          <View style={styles.iconContainer}>
            <Image
              source={moodConfig.assets.faceExpression}
              style={styles.moodIcon}
              resizeMode="contain"
            />
          </View>

          {/* Description */}
          <Text style={[styles.description, { color: content.textColor }]}>
            {content.description}
          </Text>

          {/* Additional Info */}
          <View style={styles.infoContainer}>
            <Text style={[styles.infoText, { color: content.textColor }]}>
              Current mood: {moodConfig.label}
            </Text>
            <Text style={[styles.infoText, { color: content.textColor }]}>
              Tap the mood button to track your feelings
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.actionButton, { borderColor: content.textColor }]}
            onPress={onClose}
            testID="mood-card-got-it"
          >
            <Text style={[styles.actionButtonText, { color: content.textColor }]}>
              Got it!
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
    maxHeight: screenHeight * 0.7,
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
  iconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  moodIcon: {
    width: 60,
    height: 60,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  infoContainer: {
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 4,
    opacity: 0.8,
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
});

export default MoodCard;