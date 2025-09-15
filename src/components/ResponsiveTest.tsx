import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { 
  wp, 
  hp, 
  rf, 
  rs, 
  getScreenCategory,
  getResponsiveSpacing,
  screenDimensions
} from '../constants/responsive';

const ResponsiveTest: React.FC = () => {
  const spacing = getResponsiveSpacing();
  const screenCategory = getScreenCategory();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Responsive Layout Test</Text>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Screen Width: {screenDimensions.width}px</Text>
        <Text style={styles.infoText}>Screen Height: {screenDimensions.height}px</Text>
        <Text style={styles.infoText}>Screen Category: {screenCategory}</Text>
        <Text style={styles.infoText}>Scale Factor: {screenDimensions.scale.toFixed(2)}</Text>
      </View>

      <View style={styles.testContainer}>
        <Text style={styles.sectionTitle}>Responsive Dimensions</Text>
        <View style={styles.testBox}>
          <Text style={styles.testText}>wp(50): {wp(50).toFixed(1)}px</Text>
          <Text style={styles.testText}>hp(20): {hp(20).toFixed(1)}px</Text>
          <Text style={styles.testText}>rf(18): {rf(18).toFixed(1)}px</Text>
          <Text style={styles.testText}>rs(100): {rs(100).toFixed(1)}px</Text>
        </View>
      </View>

      <View style={styles.spacingContainer}>
        <Text style={styles.sectionTitle}>Responsive Spacing</Text>
        <View style={styles.spacingBox}>
          <Text style={styles.testText}>Small: {spacing.sm}px</Text>
          <Text style={styles.testText}>Medium: {spacing.md}px</Text>
          <Text style={styles.testText}>Large: {spacing.lg}px</Text>
          <Text style={styles.testText}>XL: {spacing.xl}px</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(5),
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: rf(24),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: hp(3),
    color: '#333',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: rs(8),
    marginBottom: hp(2),
  },
  infoText: {
    fontSize: rf(14),
    marginBottom: hp(0.5),
    color: '#666',
  },
  testContainer: {
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: rs(8),
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: rf(18),
    fontWeight: '600',
    marginBottom: hp(1),
    color: '#333',
  },
  testBox: {
    backgroundColor: '#f8f8f8',
    padding: wp(3),
    borderRadius: rs(4),
  },
  testText: {
    fontSize: rf(12),
    marginBottom: hp(0.5),
    color: '#555',
  },
  spacingContainer: {
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: rs(8),
  },
  spacingBox: {
    backgroundColor: '#f8f8f8',
    padding: wp(3),
    borderRadius: rs(4),
  },
});

export default ResponsiveTest;