import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SplashScreen from './SplashScreen';
import { ErrorLogger, ErrorType } from '../utils/errorHandling';

const NavigationTest: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'main'>('splash');
  const [navigationAttempts, setNavigationAttempts] = useState(0);
  const [errors, setErrors] = useState<any[]>([]);

  const handleGetStarted = () => {
    setNavigationAttempts(prev => prev + 1);
    
    // Simulate potential navigation issues for testing
    if (navigationAttempts === 2) {
      // Simulate a navigation error on the 3rd attempt
      throw new Error('Simulated navigation failure');
    }
    
    // Smooth transition with slight delay to test performance
    setTimeout(() => {
      setCurrentScreen('main');
    }, 100);
  };

  const handleBackToSplash = () => {
    setCurrentScreen('splash');
    setNavigationAttempts(0);
    ErrorLogger.clearErrors();
    setErrors([]);
  };

  const handleShowErrors = () => {
    const allErrors = ErrorLogger.getErrors();
    setErrors(allErrors);
    
    if (allErrors.length > 0) {
      Alert.alert(
        'Error Log',
        `Found ${allErrors.length} errors. Check console for details.`,
        [{ text: 'OK' }]
      );
      console.log('All errors:', allErrors);
    } else {
      Alert.alert('Error Log', 'No errors found!', [{ text: 'OK' }]);
    }
  };

  const handleSimulateError = () => {
    // Simulate different types of errors for testing
    ErrorLogger.logError(
      ErrorType.ASSET_LOADING,
      'Simulated asset loading error',
      new Error('Test error'),
      { assetKey: 'test-asset' }
    );
    
    ErrorLogger.logError(
      ErrorType.PERFORMANCE_DEGRADATION,
      'Simulated performance issue',
      new Error('Frame drops detected'),
      { frameDrops: 15 }
    );
    
    Alert.alert('Test Errors', 'Simulated errors have been logged', [{ text: 'OK' }]);
  };

  if (currentScreen === 'main') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Main Screen</Text>
          <Text style={styles.subtitle}>Navigation successful!</Text>
        </View>
        
        <View style={styles.content}>
          <Text style={styles.info}>
            Navigation attempts: {navigationAttempts}
          </Text>
          <Text style={styles.info}>
            Logged errors: {errors.length}
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleBackToSplash}
            accessibilityRole="button"
            accessibilityLabel="Back to Splash Screen"
          >
            <Text style={styles.buttonText}>← Back to Splash</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={handleShowErrors}
            accessibilityRole="button"
            accessibilityLabel="Show Error Log"
          >
            <Text style={styles.buttonText}>Show Errors</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.warningButton]} 
            onPress={handleSimulateError}
            accessibilityRole="button"
            accessibilityLabel="Simulate Test Errors"
          >
            <Text style={styles.buttonText}>Simulate Errors</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.testControls}>
        <TouchableOpacity 
          style={styles.testButton} 
          onPress={handleShowErrors}
          accessibilityRole="button"
          accessibilityLabel="Show Error Log"
        >
          <Text style={styles.testButtonText}>Errors: {ErrorLogger.getErrors().length}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.testButton, styles.warningButton]} 
          onPress={handleSimulateError}
          accessibilityRole="button"
          accessibilityLabel="Simulate Test Errors"
        >
          <Text style={styles.testButtonText}>+ Error</Text>
        </TouchableOpacity>
      </View>
      
      <SplashScreen onGetStarted={handleGetStarted} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  testControls: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    flexDirection: 'row',
    gap: 10,
  },
  testButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 5,
    minWidth: 60,
  },
  testButtonText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 50,
    gap: 15,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#6C757D',
  },
  warningButton: {
    backgroundColor: '#DC3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NavigationTest;