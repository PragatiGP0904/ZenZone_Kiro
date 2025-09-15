import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface SplashScreenProps {
  onGetStarted: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  console.log('✅ SplashScreen rendering - no LinearGradient');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>ZenZone</Text>
        <Text style={styles.subtitle}>Mental Health & Wellness</Text>
        <Text style={styles.tagline}>
          "The quiet between breaths is where peace blooms."
        </Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            console.log('✅ Button pressed!');
            alert('Button works! LinearGradient might be the issue.');
            onGetStarted();
          }}
        >
          <Text style={styles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>
        
        <View style={styles.debugBox}>
          <Text style={styles.debugText}>
            🟢 Minimal Splash Screen Loaded
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFB6C1', // Pink background
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 20,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#5D6D7E',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  debugBox: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    borderRadius: 8,
  },
  debugText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default SplashScreen;