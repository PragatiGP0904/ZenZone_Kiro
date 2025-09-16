import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AffirmationScreen from './src/components/AffirmationScreen/AffirmationScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <AffirmationScreen />
    </SafeAreaProvider>
  );
}