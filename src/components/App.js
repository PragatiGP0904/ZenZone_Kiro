/**
 * ZenBloom - Mental Health Companion
 * Expo Entry Point
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import MobileAppExpo from './components/MobileAppExpo.jsx';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <MobileAppExpo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});