#!/usr/bin/env node

/**
 * Debug Splash Screen Visibility Issues
 * This script helps diagnose why the splash screen is not appearing
 */

const fs = require('fs');

class SplashDebugger {
  constructor() {
    this.issues = [];
    this.suggestions = [];
  }

  log(message, type = 'info') {
    const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
    console.log(`${icons[type]} ${message}`);
  }

  checkAssetPaths() {
    this.log('Checking asset paths...');
    
    const requiredAssets = [
      'assets/zenzone.png',
      'assets/text.png', 
      'assets/pent.png',
      'assets/Group.png',
      'assets/bubble.png'
    ];

    let missingAssets = [];
    
    requiredAssets.forEach(asset => {
      if (fs.existsSync(asset)) {
        this.log(`✓ ${asset} exists`, 'success');
      } else {
        this.log(`✗ ${asset} missing`, 'error');
        missingAssets.push(asset);
        this.issues.push(`Missing asset: ${asset}`);
      }
    });

    if (missingAssets.length > 0) {
      this.suggestions.push('Ensure all required assets are in the assets/ directory');
    }

    return missingAssets.length === 0;
  }

  checkAssetConstants() {
    this.log('Checking asset constants...');
    
    if (fs.existsSync('src/constants/assets.ts')) {
      const assetsContent = fs.readFileSync('src/constants/assets.ts', 'utf8');
      
      if (assetsContent.includes('require(')) {
        this.log('✓ Asset requires found', 'success');
      } else {
        this.log('✗ No asset requires found', 'error');
        this.issues.push('Asset constants file missing require statements');
      }
    } else {
      this.log('✗ Asset constants file missing', 'error');
      this.issues.push('Missing src/constants/assets.ts file');
      this.suggestions.push('Create asset constants file with proper require statements');
    }
  }

  checkSplashScreenComponent() {
    this.log('Checking SplashScreen component...');
    
    if (!fs.existsSync('src/components/SplashScreen.tsx')) {
      this.log('✗ SplashScreen.tsx missing', 'error');
      this.issues.push('SplashScreen component file missing');
      return false;
    }

    const splashContent = fs.readFileSync('src/components/SplashScreen.tsx', 'utf8');
    
    // Check for common issues
    if (!splashContent.includes('export default')) {
      this.log('✗ No default export found', 'error');
      this.issues.push('SplashScreen component missing default export');
    }

    if (!splashContent.includes('LinearGradient')) {
      this.log('✗ LinearGradient not found', 'error');
      this.issues.push('LinearGradient component missing');
    }

    if (!splashContent.includes('SafeImage')) {
      this.log('✗ SafeImage component not found', 'error');
      this.issues.push('SafeImage component missing');
    }

    // Check for style issues
    if (!splashContent.includes('flex: 1')) {
      this.log('⚠️ No flex: 1 found in styles', 'warning');
      this.suggestions.push('Ensure container has flex: 1 to fill screen');
    }

    // Check for error handling
    if (splashContent.includes('handleAssetError')) {
      this.log('✓ Asset error handling found', 'success');
    } else {
      this.log('⚠️ No asset error handling found', 'warning');
      this.suggestions.push('Add asset error handling to prevent blank screens');
    }

    return true;
  }

  checkSafeImageComponent() {
    this.log('Checking SafeImage component...');
    
    if (!fs.existsSync('src/components/SafeImage.tsx')) {
      this.log('✗ SafeImage.tsx missing', 'error');
      this.issues.push('SafeImage component file missing');
      this.suggestions.push('Create SafeImage component for asset loading');
      return false;
    }

    const safeImageContent = fs.readFileSync('src/components/SafeImage.tsx', 'utf8');
    
    if (!safeImageContent.includes('Image')) {
      this.log('✗ Image component not imported', 'error');
      this.issues.push('SafeImage missing Image import');
    }

    if (safeImageContent.includes('onError')) {
      this.log('✓ Error handling in SafeImage', 'success');
    } else {
      this.log('⚠️ No error handling in SafeImage', 'warning');
    }

    return true;
  }

  checkAppStructure() {
    this.log('Checking App.tsx structure...');
    
    const appContent = fs.readFileSync('App.tsx', 'utf8');
    
    // Check if SplashScreen is properly rendered
    if (appContent.includes('<SplashScreen')) {
      this.log('✓ SplashScreen component rendered in App', 'success');
    } else {
      this.log('✗ SplashScreen not rendered in App', 'error');
      this.issues.push('SplashScreen component not rendered in App.tsx');
    }

    // Check for z-index conflicts
    if (appContent.includes('zIndex: 1000')) {
      this.log('⚠️ High z-index found on test buttons', 'warning');
      this.suggestions.push('Test buttons may be covering the splash screen');
    }

    // Check container styles
    if (appContent.includes('flex: 1')) {
      this.log('✓ Container has flex: 1', 'success');
    } else {
      this.log('⚠️ Container may not have proper flex styling', 'warning');
    }
  }

  createSimplifiedApp() {
    this.log('Creating simplified App for testing...');
    
    const simplifiedApp = `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SplashScreen from './src/components/SplashScreen';

export default function App() {
  const handleGetStarted = () => {
    console.log('Get Started pressed');
  };

  return (
    <View style={styles.container}>
      <SplashScreen onGetStarted={handleGetStarted} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});`;

    fs.writeFileSync('App-simple.tsx', simplifiedApp);
    this.log('✓ Created App-simple.tsx for testing', 'success');
    this.suggestions.push('Try renaming App-simple.tsx to App.tsx to test without overlays');
  }

  createMinimalSplashScreen() {
    this.log('Creating minimal splash screen for testing...');
    
    const minimalSplash = `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SplashScreenProps {
  onGetStarted: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onGetStarted }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFB6C1', '#FFFFE0', '#98FB98', '#87CEEB', '#DDA0DD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.title}>ZenZone</Text>
          <Text style={styles.subtitle}>The quiet between breaths is where peace blooms.</Text>
          
          <TouchableOpacity style={styles.button} onPress={onGetStarted}>
            <Text style={styles.buttonText}>GET STARTED</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
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
    color: '#333',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default SplashScreen;`;

    fs.writeFileSync('SplashScreen-minimal.tsx', minimalSplash);
    this.log('✓ Created SplashScreen-minimal.tsx for testing', 'success');
    this.suggestions.push('Replace SplashScreen component with minimal version to test basic functionality');
  }

  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('🔍 SPLASH SCREEN DEBUG REPORT');
    console.log('='.repeat(80));
    
    if (this.issues.length > 0) {
      console.log('\n❌ ISSUES FOUND:');
      this.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
      });
    } else {
      console.log('\n✅ No critical issues found');
    }

    if (this.suggestions.length > 0) {
      console.log('\n💡 SUGGESTIONS:');
      this.suggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion}`);
      });
    }

    console.log('\n🔧 IMMEDIATE FIXES TO TRY:');
    console.log('1. Remove test buttons temporarily by commenting them out in App.tsx');
    console.log('2. Check browser console/Metro logs for JavaScript errors');
    console.log('3. Verify all assets exist in the assets/ directory');
    console.log('4. Try the minimal splash screen version created above');
    console.log('5. Run: npx expo start --clear to clear Metro cache');
    
    console.log('\n' + '='.repeat(80));
  }

  async runDiagnostics() {
    this.log('🚀 Starting Splash Screen Diagnostics...\n');

    const checks = [
      { name: 'Asset Paths', fn: () => this.checkAssetPaths() },
      { name: 'Asset Constants', fn: () => this.checkAssetConstants() },
      { name: 'SplashScreen Component', fn: () => this.checkSplashScreenComponent() },
      { name: 'SafeImage Component', fn: () => this.checkSafeImageComponent() },
      { name: 'App Structure', fn: () => this.checkAppStructure() }
    ];

    for (const check of checks) {
      this.log(`\n🔄 Checking ${check.name}...`);
      try {
        check.fn();
      } catch (error) {
        this.log(`❌ Error in ${check.name}: ${error.message}`, 'error');
        this.issues.push(`${check.name} check failed: ${error.message}`);
      }
    }

    // Create test files
    this.createSimplifiedApp();
    this.createMinimalSplashScreen();

    this.generateReport();
  }
}

// Run diagnostics
if (require.main === module) {
  const splashDebugger = new SplashDebugger();
  splashDebugger.runDiagnostics().catch((error) => {
    console.error('❌ Diagnostics failed:', error);
    process.exit(1);
  });
}

module.exports = SplashDebugger;