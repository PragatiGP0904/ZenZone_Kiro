#!/usr/bin/env node

/**
 * Setup script to configure the project for Expo
 */

import { copyFile, readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupExpo() {
  try {
    console.log('🌸 Setting up ZenBloom for Expo...\n');

    // Backup original package.json
    console.log('📦 Backing up original package.json...');
    await copyFile('package.json', 'package-web.json');
    console.log('✅ Backup created as package-web.json');

    // Replace with Expo package.json
    console.log('📦 Installing Expo configuration...');
    await copyFile('package-expo.json', 'package.json');
    console.log('✅ Expo package.json installed');

    console.log('\n🎉 Expo setup complete!');
    console.log('\nNext steps:');
    console.log('1. Run: npm install');
    console.log('2. Run: npm start (or expo start)');
    console.log('3. Scan QR code with Expo Go app on your phone');
    console.log('\n📱 Your ZenBloom app will open on your mobile device!');
    console.log('\n📖 See EXPO_SETUP.md for detailed instructions');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n💡 Manual setup:');
    console.log('1. Copy package-expo.json to package.json');
    console.log('2. Run: npm install');
    console.log('3. Run: expo start');
  }
}

async function restoreWeb() {
  try {
    console.log('🌐 Restoring web configuration...\n');

    // Restore original package.json
    console.log('📦 Restoring web package.json...');
    await copyFile('package-web.json', 'package.json');
    console.log('✅ Web package.json restored');

    console.log('\n🎉 Web setup restored!');
    console.log('\nNext steps:');
    console.log('1. Run: npm install');
    console.log('2. Run: npm start');
    console.log('3. Open: http://localhost:3000');

  } catch (error) {
    console.error('❌ Restore failed:', error.message);
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'restore' || command === 'web') {
  restoreWeb();
} else {
  setupExpo();
}