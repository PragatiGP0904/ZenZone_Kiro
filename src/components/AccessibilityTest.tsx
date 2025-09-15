import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert 
} from 'react-native';
import { useAccessibility } from '../hooks/useAccessibility';
import { 
  AccessibilityLabels, 
  AccessibilityRoles, 
  AccessibleColors,
  getAccessibleAnimationConfig 
} from '../constants/accessibility';
import { 
  testAccessibilityFeatures, 
  validateColorContrast,
  validateReducedMotionSupport,
  auditAccessibility 
} from '../utils/accessibilityValidator';

const AccessibilityTest: React.FC = () => {
  const { isScreenReaderEnabled, isReduceMotionEnabled, isHighContrastEnabled } = useAccessibility();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, result]);
  };

  const runAccessibilityTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    try {
      addTestResult('🧪 Starting Accessibility Tests...\n');

      // Test 1: Screen Reader Detection
      addTestResult(`📱 Screen Reader: ${isScreenReaderEnabled ? '✅ Enabled' : '❌ Disabled'}`);
      
      // Test 2: Reduce Motion Detection
      addTestResult(`🎬 Reduce Motion: ${isReduceMotionEnabled ? '✅ Enabled' : '❌ Disabled'}`);
      
      // Test 3: High Contrast Detection
      addTestResult(`🎨 High Contrast: ${isHighContrastEnabled ? '✅ Enabled' : '❌ Disabled'}`);

      // Test 4: Animation Configuration
      const animConfig = getAccessibleAnimationConfig(isReduceMotionEnabled);
      const motionValidation = validateReducedMotionSupport(animConfig, isReduceMotionEnabled);
      
      if (motionValidation.isValid) {
        addTestResult('✅ Animation configuration respects reduced motion preferences');
      } else {
        addTestResult(`❌ Animation issues: ${motionValidation.errors.join(', ')}`);
      }

      // Test 5: Color Contrast Validation
      const contrastValidation = validateColorContrast('#FFFFFF', '#1565C0');
      if (contrastValidation.isValid) {
        addTestResult('✅ Button color contrast meets WCAG AA standards');
      } else {
        addTestResult(`❌ Color contrast issues: ${contrastValidation.errors.join(', ')}`);
      }

      // Test 6: Runtime Accessibility Features
      const runtimeTest = await testAccessibilityFeatures();
      if (runtimeTest.isValid) {
        addTestResult('✅ Runtime accessibility features working correctly');
      } else {
        addTestResult(`❌ Runtime issues: ${runtimeTest.errors.join(', ')}`);
      }

      // Test 7: Comprehensive Audit
      const auditResult = await auditAccessibility({}, animConfig, isReduceMotionEnabled);
      addTestResult('\n📋 Comprehensive Audit Results:');
      
      if (auditResult.isValid) {
        addTestResult('✅ All accessibility tests passed!');
      } else {
        addTestResult(`❌ Audit found ${auditResult.errors.length} errors`);
        auditResult.errors.forEach(error => addTestResult(`   • ${error}`));
      }

      if (auditResult.warnings.length > 0) {
        addTestResult(`⚠️ ${auditResult.warnings.length} warnings found:`);
        auditResult.warnings.forEach(warning => addTestResult(`   • ${warning}`));
      }

      addTestResult('\n🎉 Accessibility testing complete!');

    } catch (error) {
      addTestResult(`❌ Test failed: ${error}`);
    } finally {
      setIsRunningTests(false);
    }
  };

  const showAccessibilityInfo = () => {
    Alert.alert(
      'Accessibility Features',
      `Current Status:
      
Screen Reader: ${isScreenReaderEnabled ? 'ON' : 'OFF'}
Reduce Motion: ${isReduceMotionEnabled ? 'ON' : 'OFF'}
High Contrast: ${isHighContrastEnabled ? 'ON' : 'OFF'}

These settings are detected from your device's accessibility preferences.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View 
      style={styles.container}
      accessible={true}
      accessibilityRole={AccessibilityRoles.NONE}
      accessibilityLabel="Accessibility testing screen"
    >
      <Text 
        style={styles.title}
        accessible={true}
        accessibilityRole={AccessibilityRoles.TEXT}
        accessibilityLabel="Accessibility Test Suite"
      >
        Accessibility Test Suite
      </Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusTitle}>Current Accessibility Status:</Text>
        <Text style={[styles.statusItem, isScreenReaderEnabled && styles.statusEnabled]}>
          📱 Screen Reader: {isScreenReaderEnabled ? 'ON' : 'OFF'}
        </Text>
        <Text style={[styles.statusItem, isReduceMotionEnabled && styles.statusEnabled]}>
          🎬 Reduce Motion: {isReduceMotionEnabled ? 'ON' : 'OFF'}
        </Text>
        <Text style={[styles.statusItem, isHighContrastEnabled && styles.statusEnabled]}>
          🎨 High Contrast: {isHighContrastEnabled ? 'ON' : 'OFF'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.testButton,
            isHighContrastEnabled && styles.testButtonHighContrast,
            isRunningTests && styles.testButtonDisabled
          ]}
          onPress={runAccessibilityTests}
          disabled={isRunningTests}
          accessible={true}
          accessibilityRole={AccessibilityRoles.BUTTON}
          accessibilityLabel="Run Accessibility Tests"
          accessibilityHint="Execute comprehensive accessibility validation tests"
          accessibilityState={{ disabled: isRunningTests }}
        >
          <Text style={[
            styles.testButtonText,
            isHighContrastEnabled && styles.testButtonTextHighContrast
          ]}>
            {isRunningTests ? 'Running Tests...' : 'Run Accessibility Tests'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.infoButton,
            isHighContrastEnabled && styles.infoButtonHighContrast
          ]}
          onPress={showAccessibilityInfo}
          accessible={true}
          accessibilityRole={AccessibilityRoles.BUTTON}
          accessibilityLabel="Show Accessibility Info"
          accessibilityHint="Display current accessibility settings information"
        >
          <Text style={[
            styles.infoButtonText,
            isHighContrastEnabled && styles.infoButtonTextHighContrast
          ]}>
            Show Info
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.resultsContainer}
        accessible={true}
        accessibilityRole={AccessibilityRoles.NONE}
        accessibilityLabel="Test results"
      >
        {testResults.map((result, index) => (
          <Text 
            key={index} 
            style={styles.resultText}
            accessible={true}
            accessibilityRole={AccessibilityRoles.TEXT}
          >
            {result}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#212121',
  },
  statusContainer: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#212121',
  },
  statusItem: {
    fontSize: 14,
    marginBottom: 5,
    color: '#757575',
  },
  statusEnabled: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  testButton: {
    backgroundColor: '#1565C0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    minHeight: 44, // Minimum touch target size
  },
  testButtonHighContrast: {
    backgroundColor: AccessibleColors.BUTTON_BACKGROUND,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  testButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  testButtonTextHighContrast: {
    color: AccessibleColors.BUTTON_TEXT,
    fontWeight: '800',
  },
  infoButton: {
    backgroundColor: '#757575',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minHeight: 44, // Minimum touch target size
  },
  infoButtonHighContrast: {
    backgroundColor: '#424242',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  infoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoButtonTextHighContrast: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resultText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#212121',
    lineHeight: 20,
  },
});

export default AccessibilityTest;