import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Header } from './Header';
import { SunflowerDisplay } from './SunflowerDisplay';
import { SideButtons } from './SideButtons';
import { MoodOverlay } from './MoodOverlay';
import { GrowthOverlay } from './GrowthOverlay';
import { EnvironmentalEffects } from './EnvironmentalEffects';
import RainEffect from './RainEffect';
import type { MoodType, StreakData } from '../types/mood.types';

const { width, height } = Dimensions.get('window');

interface ZenbloomContainerProps {
  initialMood: MoodType;
  onMoodChange: (mood: MoodType) => void;
  streakData: StreakData;
  onBack: () => void;
}

const getBackgroundImage = (mood: MoodType) => {
  switch (mood) {
    case 'happy':
      return require('../../Zenbloom/Images/Background_Happy.png');
    case 'sad':
      return require('../../Zenbloom/Images/Background_Sad.png');
    case 'angry':
      return require('../../Zenbloom/Images/Background_Angry.png');
    default:
      return require('../../Zenbloom/Images/Background_Happy.png');
  }
};

export const ZenbloomContainer: React.FC<ZenbloomContainerProps> = ({
  initialMood,
  onMoodChange,
  streakData,
  onBack,
}) => {
  const [currentMood, setCurrentMood] = useState<MoodType>(initialMood);
  const [showMoodOverlay, setShowMoodOverlay] = useState(false);
  const [showGrowthOverlay, setShowGrowthOverlay] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);

  const handleMoodChange = (mood: MoodType) => {
    setCurrentMood(mood);
    onMoodChange(mood);
    setShowMoodOverlay(false);
    setShowMoodSelector(false);
  };

  const handleMoodButtonPress = () => {
    setShowMoodOverlay(true);
    setShowGrowthOverlay(false);
    setShowMoodSelector(false);
  };

  const handleGrowthButtonPress = () => {
    setShowGrowthOverlay(true);
    setShowMoodOverlay(false);
    setShowMoodSelector(false);
  };

  const handleChangeMoodPress = () => {
    setShowMoodSelector(true);
    setShowMoodOverlay(false);
    setShowGrowthOverlay(false);
  };

  const handleOverlayClose = () => {
    setShowMoodOverlay(false);
    setShowGrowthOverlay(false);
    setShowMoodSelector(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={getBackgroundImage(currentMood)}
        style={styles.background}
        resizeMode="cover"
      >
        <EnvironmentalEffects currentMood={currentMood} />
        
        {/* Rain effect for sad mood */}
        <RainEffect visible={currentMood === 'sad'} />
        
        <Header 
          mood={currentMood} 
          onBack={onBack}
        />
        
        <SunflowerDisplay currentMood={currentMood} />
        
        <SideButtons
          currentMood={currentMood}
          onMoodPress={handleMoodButtonPress}
          onGrowthPress={handleGrowthButtonPress}
        />

        <MoodOverlay
          visible={showMoodOverlay}
          currentMood={currentMood}
          onClose={handleOverlayClose}
        />

        <GrowthOverlay
          visible={showGrowthOverlay}
          streakData={streakData}
          currentMood={currentMood}
          onClose={handleOverlayClose}
        />

        {/* Change Mood Button */}
        <TouchableOpacity 
          style={styles.changeMoodButton}
          onPress={handleChangeMoodPress}
          activeOpacity={0.8}
        >
          <Text style={styles.changeMoodText}>Change Mood</Text>
        </TouchableOpacity>

        {/* Mood Selector */}
        {showMoodSelector && (
          <View style={styles.moodSelectorContainer}>
            <TouchableOpacity style={styles.backdrop} onPress={handleOverlayClose} />
            <View style={styles.moodSelectorCard}>
              <Text style={styles.selectorTitle}>Select Your Mood</Text>
              <View style={styles.moodOptions}>
                <TouchableOpacity 
                  style={[styles.moodOption, currentMood === 'happy' && styles.selectedMood]}
                  onPress={() => handleMoodChange('happy')}
                >
                  <Text style={styles.moodEmoji}>😊</Text>
                  <Text style={styles.moodLabel}>Happy</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.moodOption, currentMood === 'sad' && styles.selectedMood]}
                  onPress={() => handleMoodChange('sad')}
                >
                  <Text style={styles.moodEmoji}>😢</Text>
                  <Text style={styles.moodLabel}>Sad</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.moodOption, currentMood === 'angry' && styles.selectedMood]}
                  onPress={() => handleMoodChange('angry')}
                >
                  <Text style={styles.moodEmoji}>😠</Text>
                  <Text style={styles.moodLabel}>Angry</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  changeMoodButton: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  changeMoodText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  moodSelectorContainer: {
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  moodSelectorCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(20px)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    padding: 20,
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  selectorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  moodOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  moodOption: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 70,
  },
  selectedMood: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  moodEmoji: {
    fontSize: 30,
    marginBottom: 5,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});