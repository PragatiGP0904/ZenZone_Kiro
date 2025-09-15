#!/usr/bin/env node

/**
 * Simple App Test Script
 * Tests if the app can start and the splash screen is visible
 */

const { spawn } = require('child_process');

console.log('🚀 Testing ZenZone Splash Screen...\n');

console.log('📋 Pre-flight checks:');
const fs = require('fs');

// Check required files
const requiredFiles = [
  'App.tsx',
  'src/components/SplashScreen.tsx',
  'package.json'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please check the file structure.');
  process.exit(1);
}

console.log('\n🌐 Starting web development server...');
console.log('This will open the app in your browser where you should see:');
console.log('✓ Gradient background (pink, yellow, green, blue, purple)');
console.log('✓ "ZenZone" text in large letters');
console.log('✓ "Mental Health & Wellness" subtitle');
console.log('✓ Tagline about peace and breaths');
console.log('✓ Colored decorative shapes');
console.log('✓ "GET STARTED" button at the bottom');
console.log('✓ Debug message at the top confirming it loaded');
console.log('\nPress Ctrl+C to stop the server when you\'re done testing.\n');

// Start the development server
const serverProcess = spawn('npx', ['expo', 'start', '--web'], {
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping development server...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});

serverProcess.on('close', (code) => {
  console.log(`\n📊 Development server exited with code ${code}`);
  process.exit(code);
});