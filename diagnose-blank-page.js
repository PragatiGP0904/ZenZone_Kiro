#!/usr/bin/env node

/**
 * Diagnose Blank White Page Issue
 * This script identifies and fixes common causes of blank pages in React Native Web
 */

const fs = require('fs');
const { execSync } = require('child_process');

class BlankPageDiagnostic {
  constructor() {
    this.issues = [];
    this.fixes = [];
  }

  log(message, type = 'info') {
    const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️', fix: '🔧' };
    console.log(`${icons[type]} ${message}`);
  }

  // Check if expo-linear-gradient is properly installed
  checkLinearGradient() {
    this.log('Checking expo-linear-gradient installation...');
    
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      
      if (packageJson.dependencies['expo-linear-gradient']) {
        this.log('✓ expo-linear-gradient found in dependencies', 'success');
        return true;
      } else {
        this.log('✗ expo-linear-gradient missing from dependencies', 'error');
        this.issues.push('expo-linear-gradient not installed');
        this.fixes.push('Install expo-linear-gradient');
        return false;
      }
    } catch (error) {
      this.log(`✗ Error checking package.json: ${error.message}`, 'error');
      return false;
    }
  }

  // Create a minimal test component without LinearGradient
  createMinimalTest() {
    this.log('Creating minimal test component...', 'fix');
    
    const minimalSplash = `import React from 'react';
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

export default SplashScreen;`;

    fs.writeFileSync('src/components/SplashScreen-minimal.tsx', minimalSplash);
    this.log('✓ Created SplashScreen-minimal.tsx', 'success');
  }

  // Create an even simpler App.tsx for testing
  createMinimalApp() {
    this.log('Creating minimal App.tsx...', 'fix');
    
    const minimalApp = `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function App() {
  console.log('✅ App component rendering');
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🟢 App is working!</Text>
      <Text style={styles.subtext}>If you see this, React Native Web is working</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFB6C1',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#34495E',
    textAlign: 'center',
  },
});`;

    fs.writeFileSync('App-minimal.tsx', minimalApp);
    this.log('✓ Created App-minimal.tsx', 'success');
  }

  // Install missing dependencies
  installDependencies() {
    this.log('Installing/reinstalling expo-linear-gradient...', 'fix');
    
    try {
      execSync('npx expo install expo-linear-gradient', { stdio: 'inherit' });
      this.log('✓ expo-linear-gradient installed', 'success');
      return true;
    } catch (error) {
      this.log(`✗ Failed to install expo-linear-gradient: ${error.message}`, 'error');
      return false;
    }
  }

  // Clear Metro cache
  clearCache() {
    this.log('Clearing Metro bundler cache...', 'fix');
    
    try {
      execSync('npx expo start --clear', { stdio: 'inherit', timeout: 10000 });
      return true;
    } catch (error) {
      this.log('Cache clear command initiated (may continue in background)', 'info');
      return true;
    }
  }

  // Check browser console for errors
  checkBrowserConsole() {
    this.log('Browser Console Check Instructions:', 'info');
    console.log('\n📋 To check for JavaScript errors:');
    console.log('1. Open your browser to http://localhost:8084');
    console.log('2. Press F12 to open Developer Tools');
    console.log('3. Click on the "Console" tab');
    console.log('4. Look for any red error messages');
    console.log('5. Common errors to look for:');
    console.log('   - "Module not found" errors');
    console.log('   - "Cannot resolve module" errors');
    console.log('   - "LinearGradient" related errors');
    console.log('   - Any other red error messages\n');
  }

  // Generate step-by-step fix instructions
  generateFixInstructions() {
    console.log('\n' + '='.repeat(80));
    console.log('🔧 STEP-BY-STEP FIX INSTRUCTIONS');
    console.log('='.repeat(80));
    
    console.log('\n🎯 IMMEDIATE FIXES TO TRY:');
    
    console.log('\n1️⃣ TEST WITH MINIMAL COMPONENT:');
    console.log('   mv App.tsx App-original.tsx');
    console.log('   mv App-minimal.tsx App.tsx');
    console.log('   npx expo start --web');
    console.log('   → If this shows "App is working!", the issue is in SplashScreen');
    
    console.log('\n2️⃣ TEST WITHOUT LINEARGRADIENT:');
    console.log('   mv src/components/SplashScreen.tsx src/components/SplashScreen-original.tsx');
    console.log('   mv src/components/SplashScreen-minimal.tsx src/components/SplashScreen.tsx');
    console.log('   mv App-original.tsx App.tsx');
    console.log('   npx expo start --web');
    console.log('   → If this works, LinearGradient is the problem');
    
    console.log('\n3️⃣ REINSTALL DEPENDENCIES:');
    console.log('   npx expo install expo-linear-gradient');
    console.log('   npm install');
    console.log('   npx expo start --clear --web');
    
    console.log('\n4️⃣ CHECK BROWSER CONSOLE:');
    console.log('   Open browser → F12 → Console tab → Look for red errors');
    
    console.log('\n5️⃣ RESTORE ORIGINAL (if needed):');
    console.log('   mv App-original.tsx App.tsx');
    console.log('   mv src/components/SplashScreen-original.tsx src/components/SplashScreen.tsx');
    
    console.log('\n' + '='.repeat(80));
    console.log('💡 MOST LIKELY CAUSES:');
    console.log('• expo-linear-gradient not properly installed for web');
    console.log('• Metro bundler cache issues');
    console.log('• JavaScript errors preventing component render');
    console.log('• Import path issues');
    console.log('='.repeat(80));
  }

  async runDiagnostic() {
    this.log('🔍 Diagnosing blank white page issue...\n');
    
    // Run checks
    this.checkLinearGradient();
    this.checkBrowserConsole();
    
    // Create test files
    this.createMinimalTest();
    this.createMinimalApp();
    
    // Generate instructions
    this.generateFixInstructions();
    
    // Offer to install dependencies
    console.log('\n❓ Would you like me to try reinstalling expo-linear-gradient? (y/n)');
    
    // For now, just show the instructions
    console.log('\n🚀 Run the commands above to diagnose and fix the issue.');
  }
}

// Run diagnostic
if (require.main === module) {
  const diagnostic = new BlankPageDiagnostic();
  diagnostic.runDiagnostic().catch((error) => {
    console.error('❌ Diagnostic failed:', error);
    process.exit(1);
  });
}

module.exports = BlankPageDiagnostic;