import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import SplashScreen from './src/components/SplashScreen';
import LoadingScreen from './src/components/LoadingScreen';
import SignInScreen from './src/components/SignInScreen';
import SignUpScreen from './src/components/SignUpScreen';
import HomeScreen from './src/components/HomeScreen';

const Stack = createStackNavigator();

export default function App() {
  console.log('🚀 ZenZone App starting...');

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
        initialRouteName="Splash"
      >
        <Stack.Screen name="Splash" component={SplashScreenComponent} />
        <Stack.Screen name="Loading" component={LoadingScreenComponent} />
        <Stack.Screen name="SignIn" component={SignInScreenComponent} />
        <Stack.Screen name="SignUp" component={SignUpScreenComponent} />
        <Stack.Screen name="Home" component={HomeScreenComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Splash Screen Component with navigation
function SplashScreenComponent({ navigation }: any) {
  const handleGetStarted = () => {
    console.log('🎯 Navigating to Loading screen...');
    navigation.navigate('Loading');
  };

  return (
    <View style={styles.container}>
      <SplashScreen onGetStarted={handleGetStarted} />
    </View>
  );
}

// Loading Screen Component
function LoadingScreenComponent({ navigation }: any) {
  const handleLoadingComplete = () => {
    console.log('⏰ Loading complete - navigating to Sign In...');
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <LoadingScreen onComplete={handleLoadingComplete} />
    </View>
  );
}

// Sign In Screen Component
function SignInScreenComponent({ navigation }: any) {
  const handleSignIn = () => {
    console.log('🔐 Sign in successful - navigating to Home...');
    navigation.navigate('Home');
  };

  const handleSignUp = () => {
    console.log('📝 Navigating to Sign Up...');
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <SignInScreen onSignIn={handleSignIn} onSignUp={handleSignUp} />
    </View>
  );
}

// Sign Up Screen Component
function SignUpScreenComponent({ navigation }: any) {
  const handleSignUp = () => {
    console.log('📝 Account created successfully - navigating to Home...');
    navigation.navigate('Home');
  };

  const handleBackToSignIn = () => {
    console.log('← Back to Sign In...');
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <SignUpScreen onSignUp={handleSignUp} onBackToSignIn={handleBackToSignIn} />
    </View>
  );
}

// Home Screen Component
function HomeScreenComponent({ navigation }: any) {
  const handleLogout = () => {
    console.log('👋 Logging out - back to Splash...');
    navigation.navigate('Splash');
  };

  return (
    <View style={styles.container}>
      <HomeScreen onLogout={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});