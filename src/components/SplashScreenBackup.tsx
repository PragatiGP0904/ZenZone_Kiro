import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SplashScreenProps {
  onGetStarted: () => void;
}

const { width, height } = Dimensions.get('window');

const SplashScreenBackup: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFB6C1', '#FFFFE0', '#98FB98', '#87CEEB', '#DDA0DD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo Area */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>ZenZone</Text>
          </View>

          {/* App Text */}
          <View style={styles.textContainer}>
            <Text style={styles.appText}>Mental Health & Wellness</Text>
          </View>

          {/* Tagline */}
          <View style={styles.taglineContainer}>
            <Text style={styles.tagline}>
              "The quiet between breaths is where peace blooms."
            </Text>
          </View>

          {/* Decorative Elements */}
          <View style={styles.decorativeContainer}>
            <View style={[styles.shape, styles.pentagon]} />
            <View style={[styles.shape, styles.circle]} />
            <View style={[styles.shape, styles.bubble1]} />
            <View style={[styles.shape, styles.bubble2]} />
          </View>

          {/* Get Started Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={onGetStarted}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Get Started"
              accessibilityHint="Tap to begin using the ZenZone app"
            >
              <Text style={styles.buttonText}>GET STARTED</Text>
            </TouchableOpacity>
          </View>

          {/* Debug Info */}
          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>
              Backup Splash Screen - {width}x{height}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: height * 0.1,
    paddingBottom: height * 0.1,
  },
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: Math.min(width * 0.15, 60),
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appText: {
    fontSize: Math.min(width * 0.06, 24),
    fontWeight: '600',
    color: '#34495E',
    textAlign: 'center',
  },
  taglineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tagline: {
    fontSize: Math.min(width * 0.04, 16),
    fontStyle: 'italic',
    color: '#5D6D7E',
    textAlign: 'center',
    lineHeight: 24,
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  shape: {
    position: 'absolute',
    borderRadius: 10,
  },
  pentagon: {
    top: height * 0.15,
    right: width * 0.1,
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 182, 193, 0.6)',
    transform: [{ rotate: '45deg' }],
  },
  circle: {
    top: height * 0.25,
    left: width * 0.05,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(152, 251, 152, 0.5)',
    borderRadius: 40,
  },
  bubble1: {
    top: height * 0.6,
    left: width * 0.15,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(135, 206, 235, 0.4)',
    borderRadius: 20,
  },
  bubble2: {
    top: height * 0.7,
    right: width * 0.2,
    width: 30,
    height: 30,
    backgroundColor: 'rgba(221, 160, 221, 0.5)',
    borderRadius: 15,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  getStartedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: Math.max(width * 0.1, 40),
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  buttonText: {
    fontSize: Math.min(width * 0.045, 18),
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    letterSpacing: 1,
  },
  debugInfo: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 3,
  },
  debugText: {
    color: 'white',
    fontSize: 10,
  },
});

export default SplashScreenBackup;