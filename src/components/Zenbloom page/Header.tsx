import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, StatusBar } from 'react-native';
import { MoodType } from '../types/mood.types';

interface HeaderProps {
  mood: MoodType;
  onBack: () => void;
}

const getBackIcon = (mood: MoodType) => {
  switch (mood) {
    case 'happy':
      return require('../../Zenbloom/Images/Back_icon_happy.png');
    case 'sad':
    case 'angry':
      return require('../../Zenbloom/Images/Back_icon_sad,angry.png');
    default:
      return require('../../Zenbloom/Images/Back_icon_happy.png');
  }
};

const getLogo = (mood: MoodType) => {
  switch (mood) {
    case 'happy':
      return require('../../Zenbloom/Images/Zenbloom_logo_Happy.png');
    case 'sad':
      return require('../../Zenbloom/Images/Zenbloom_logo_Sad.png');
    case 'angry':
      return require('../../Zenbloom/Images/Zenbloom_logo_Angry.png');
    default:
      return require('../../Zenbloom/Images/Zenbloom_logo_Happy.png');
  }
};

export const Header: React.FC<HeaderProps> = ({ mood, onBack }) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      {/* Glass background for header */}
      <View style={styles.glassBackground} />
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Image
            source={getBackIcon(mood)}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <Image
            source={getLogo(mood)}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <TouchableOpacity style={styles.profileButton} activeOpacity={0.7}>
          <Image
            source={require('../../Zenbloom/Images/Profile.png')}
            style={styles.profileIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  glassBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    backdropFilter: 'blur(15px)',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 99,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    height: 100,
    zIndex: 100,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 32,
    height: 32,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 50,
  },
  profileButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});