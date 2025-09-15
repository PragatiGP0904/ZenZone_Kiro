#!/usr/bin/env node

/**
 * Quick Fix for Splash Screen Visibility
 * This script provides options to fix splash screen visibility issues
 */

const fs = require('fs');
const path = require('path');

class SplashFixer {
  constructor() {
    this.backupSuffix = '.backup';
  }

  log(message, type = 'info') {
    const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
    console.log(`${icons[type]} ${message}`);
  }

  // Option 1: Use backup splash screen
  useBackupSplashScreen() {
    this.log('🔄 Switching to backup splash screen...');
    
    try {
      // Backup current SplashScreen
      if (fs.existsSync('src/components/SplashScreen.tsx')) {
        fs.copyFileSync(
          'src/components/SplashScreen.tsx',
          'src/components/SplashScreen.tsx' + this.backupSuffix
        );
        this.log('✓ Current SplashScreen backed up');
      }

      // Replace with backup version
      if (fs.existsSync('src/components/SplashScreenBackup.tsx')) {
        fs.copyFileSync(
          'src/components/SplashScreenBackup.tsx',
          'src/components/SplashScreen.tsx'
        );
        this.log('✓ Backup SplashScreen activated', 'success');
        return true;
      } else {
        this.log('✗ Backup SplashScreen not found', 'error');
        return false;
      }
    } catch (error) {
      this.log(`✗ Error switching to backup: ${error.message}`, 'error');
      return false;
    }
  }

  // Option 2: Restore original splash screen
  restoreOriginalSplashScreen() {
    this.log('🔄 Restoring original splash screen...');
    
    try {
      const backupPath = 'src/components/SplashScreen.tsx' + this.backupSuffix;
      
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, 'src/components/SplashScreen.tsx');
        fs.unlinkSync(backupPath); // Remove backup file
        this.log('✓ Original SplashScreen restored', 'success');
        return true;
      } else {
        this.log('✗ No backup found to restore', 'error');
        return false;
      }
    } catch (error) {
      this.log(`✗ Error restoring original: ${error.message}`, 'error');
      return false;
    }
  }

  // Option 3: Remove test buttons from App.tsx
  removeTestButtons() {
    this.log('🔄 Removing test buttons from App.tsx...');
    
    try {
      if (!fs.existsSync('App.tsx')) {
        this.log('✗ App.tsx not found', 'error');
        return false;
      }

      // Backup App.tsx
      fs.copyFileSync('App.tsx', 'App.tsx' + this.backupSuffix);
      
      const appContent = fs.readFileSync('App.tsx', 'utf8');
      
      // Create clean version without test buttons
      const cleanApp = `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import SplashScreen from './src/components/SplashScreen';

const Stack = createStackNavigator();

export default function App() {
  const handleGetStarted = () => {
    console.log('Get Started pressed - Navigation will be implemented');
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash">
          {() => (
            <View style={styles.container}>
              <SplashScreen onGetStarted={handleGetStarted} />
            </View>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});`;

      fs.writeFileSync('App.tsx', cleanApp);
      this.log('✓ Clean App.tsx created (test buttons removed)', 'success');
      return true;
      
    } catch (error) {
      this.log(`✗ Error removing test buttons: ${error.message}`, 'error');
      return false;
    }
  }

  // Option 4: Restore original App.tsx
  restoreOriginalApp() {
    this.log('🔄 Restoring original App.tsx...');
    
    try {
      const backupPath = 'App.tsx' + this.backupSuffix;
      
      if (fs.existsSync(backupPath)) {
        fs.copyFileSync(backupPath, 'App.tsx');
        fs.unlinkSync(backupPath);
        this.log('✓ Original App.tsx restored', 'success');
        return true;
      } else {
        this.log('✗ No App.tsx backup found', 'error');
        return false;
      }
    } catch (error) {
      this.log(`✗ Error restoring App.tsx: ${error.message}`, 'error');
      return false;
    }
  }

  // Show current status
  showStatus() {
    this.log('📊 Current Status:');
    
    const files = [
      { path: 'src/components/SplashScreen.tsx', desc: 'Main SplashScreen' },
      { path: 'src/components/SplashScreenBackup.tsx', desc: 'Backup SplashScreen' },
      { path: 'src/components/SplashScreen.tsx.backup', desc: 'SplashScreen Backup' },
      { path: 'App.tsx', desc: 'Main App' },
      { path: 'App.tsx.backup', desc: 'App Backup' }
    ];

    files.forEach(file => {
      const exists = fs.existsSync(file.path);
      const icon = exists ? '✅' : '❌';
      this.log(`${icon} ${file.desc}: ${exists ? 'EXISTS' : 'MISSING'}`);
    });
  }

  showMenu() {
    console.log('\n' + '='.repeat(60));
    console.log('🔧 SPLASH SCREEN VISIBILITY FIXER');
    console.log('='.repeat(60));
    console.log('Choose an option:');
    console.log('1. Use backup splash screen (simple, guaranteed visible)');
    console.log('2. Restore original splash screen');
    console.log('3. Remove test buttons from App.tsx');
    console.log('4. Restore original App.tsx');
    console.log('5. Show current status');
    console.log('6. Exit');
    console.log('='.repeat(60));
  }

  async runInteractive() {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = (question) => {
      return new Promise((resolve) => {
        rl.question(question, resolve);
      });
    };

    try {
      while (true) {
        this.showMenu();
        const choice = await askQuestion('Enter your choice (1-6): ');

        switch (choice.trim()) {
          case '1':
            this.useBackupSplashScreen();
            break;
          case '2':
            this.restoreOriginalSplashScreen();
            break;
          case '3':
            this.removeTestButtons();
            break;
          case '4':
            this.restoreOriginalApp();
            break;
          case '5':
            this.showStatus();
            break;
          case '6':
            this.log('👋 Goodbye!');
            rl.close();
            return;
          default:
            this.log('❌ Invalid choice. Please enter 1-6.', 'error');
        }

        console.log('\n');
      }
    } catch (error) {
      this.log(`❌ Error: ${error.message}`, 'error');
      rl.close();
    }
  }

  // Quick fix - automatically apply the most likely solution
  quickFix() {
    this.log('🚀 Applying quick fix for splash screen visibility...\n');
    
    this.showStatus();
    console.log('');

    // Step 1: Try using backup splash screen
    this.log('Step 1: Switching to backup splash screen...');
    if (this.useBackupSplashScreen()) {
      this.log('✅ Backup splash screen activated', 'success');
    }

    // Step 2: Remove test buttons
    this.log('Step 2: Removing test buttons...');
    if (this.removeTestButtons()) {
      this.log('✅ Test buttons removed', 'success');
    }

    console.log('\n' + '='.repeat(60));
    this.log('🎉 Quick fix applied! Try running the app now:', 'success');
    this.log('   npx expo start --web');
    console.log('='.repeat(60));
    console.log('If you want to restore the original files later, run:');
    console.log('   node fix-splash-visibility.js restore');
    console.log('='.repeat(60));
  }

  restoreAll() {
    this.log('🔄 Restoring all original files...\n');
    
    let restored = false;
    
    if (this.restoreOriginalSplashScreen()) {
      restored = true;
    }
    
    if (this.restoreOriginalApp()) {
      restored = true;
    }

    if (restored) {
      this.log('✅ All original files restored', 'success');
    } else {
      this.log('⚠️ No backup files found to restore', 'warning');
    }
  }
}

// Command line interface
if (require.main === module) {
  const fixer = new SplashFixer();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Interactive mode
    fixer.runInteractive();
  } else if (args[0] === 'quick' || args[0] === 'fix') {
    // Quick fix mode
    fixer.quickFix();
  } else if (args[0] === 'restore') {
    // Restore mode
    fixer.restoreAll();
  } else if (args[0] === 'status') {
    // Status mode
    fixer.showStatus();
  } else {
    console.log('Usage:');
    console.log('  node fix-splash-visibility.js          # Interactive mode');
    console.log('  node fix-splash-visibility.js quick    # Apply quick fix');
    console.log('  node fix-splash-visibility.js restore  # Restore original files');
    console.log('  node fix-splash-visibility.js status   # Show current status');
  }
}

module.exports = SplashFixer;