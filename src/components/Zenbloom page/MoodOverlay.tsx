import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { MoodType } from '../types/mood.types';

const { width: screenWidth } = Dimensions.get('window');

interface MoodOverlayProps {
  visible: boolean;
  currentMood: MoodType;
  onClose: () => void;
}

const getMoodInfo = (mood: MoodType) => {
  switch (mood) {
    case 'happy':
      return {
        emoji: '😊',
        title: 'Happy',
        description: 'Your flower is blooming with joy today',
        backgroundColor: 'rgba(135, 206, 250, 0.95)',
      };
    case 'sad':
      return {
        emoji: '😢',
        title: 'Sad',
        description: 'Your flower is wilting, make it happy',
        backgroundColor: 'rgba(128, 128, 128, 0.95)',
      };
    case 'angry':
      return {
        emoji: '😠',
        title: 'Angry',
        description: 'Your flower is burning with rage, help it calm down',
        backgroundColor: 'rgba(220, 20, 60, 0.95)',
      };
    default:
      return {
        emoji: '😊',
        title: 'Happy',
        description: 'Your flower is blooming with joy today',
        backgroundColor: 'rgba(135, 206, 250, 0.95)',
      };
  }
};

export const MoodOverlay: React.FC<MoodOverlayProps> = ({
  visible,
  currentMood,
  onClose,
}) => {
  if (!visible) return null;

  const moodInfo = getMoodInfo(currentMood);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <View style={[styles.card, { backgroundColor: moodInfo.backgroundColor }]}>
        <View style={styles.header}>
          <Text style={styles.emoji}>{moodInfo.emoji}</Text>
          <Text style={styles.title}>{moodInfo.title}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>{moodInfo.description}</Text>
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
    marginBottom: 10,
  },
  emoji: {
    fontSize: 32,
  },
  title: {
    fontSize: 18,
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
  description: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    lineHeight: 20,
  },
});