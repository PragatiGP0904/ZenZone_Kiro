import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { MoodType, StreakData } from '../types/mood.types';

const { width: screenWidth } = Dimensions.get('window');

interface GrowthOverlayProps {
  visible: boolean;
  streakData: StreakData;
  currentMood: MoodType;
  onClose: () => void;
}

const getGrowthInfo = (mood: MoodType) => {
  switch (mood) {
    case 'happy':
      return {
        title: 'Zenbloom Growth',
        backgroundColor: 'rgba(135, 206, 250, 0.95)',
      };
    case 'sad':
      return {
        title: 'Zenbloom Growth',
        backgroundColor: 'rgba(128, 128, 128, 0.95)',
      };
    case 'angry':
      return {
        title: 'Zenbloom Growth',
        backgroundColor: 'rgba(220, 20, 60, 0.95)',
      };
    default:
      return {
        title: 'Zenbloom Growth',
        backgroundColor: 'rgba(135, 206, 250, 0.95)',
      };
  }
};

export const GrowthOverlay: React.FC<GrowthOverlayProps> = ({
  visible,
  streakData,
  currentMood,
  onClose,
}) => {
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const sparkleAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate progress bar fill
      Animated.timing(progressAnimation, {
        toValue: streakData.progressPercentage / 100,
        duration: 1500,
        useNativeDriver: false,
      }).start();

      // Animate sparkles
      Animated.loop(
        Animated.sequence([
          Animated.timing(sparkleAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleAnimation, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      progressAnimation.setValue(0);
      sparkleAnimation.setValue(0);
    }
  }, [visible, streakData.progressPercentage, progressAnimation, sparkleAnimation]);

  if (!visible) return null;

  const growthInfo = getGrowthInfo(currentMood);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <View style={[styles.card, { backgroundColor: growthInfo.backgroundColor }]}>
        <View style={styles.header}>
          <Text style={styles.icon}>🌱</Text>
          <Text style={styles.title}>{growthInfo.title}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.streakText}>
          {streakData.currentStreak}-day streak broke
        </Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill, 
                { 
                  width: progressAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                }
              ]} 
            />
            {/* Sparkle effects */}
            <Animated.View
              style={[
                styles.sparkle,
                {
                  left: progressAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '95%'],
                  }),
                  opacity: sparkleAnimation,
                  transform: [
                    {
                      scale: sparkleAnimation.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0.5, 1.2, 0.5],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.sparkleText}>✨</Text>
            </Animated.View>
          </View>
          <Text style={styles.progressText}>
            {streakData.progressPercentage}% complete
          </Text>
        </View>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  card: {
    width: '90%',
    maxWidth: 280,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: 'white',
  },
  sparkle: {
    position: 'absolute',
    top: -15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleText: {
    fontSize: 16,
    color: '#FFD700',
  },
});