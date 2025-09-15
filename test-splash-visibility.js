#!/usr/bin/env node

/**
 * Test Splash Screen Visibility
 * This script starts the development server and provides instructions for testing
 */

const { spawn } = require('child_process');
const fs = require('fs');

class SplashVisibilityTester {
  constructor() {
    this.serverProcess = null;
  }

  log(message, type = 'info') {
    const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
    console.log(`${icons[type]} ${message}`);
  }

  async startDevServer() {
    this.log('🚀 Starting Expo development server...');
    
    return new Promise((resolve, reject) => {
      this.serverProcess = spawn('npx', ['expo', 'start', '--web'], {
        stdio: 'pipe',
        shell: true
      });

      let serverStarted = false;
      let webUrl = null;

      const timeout = setTimeout(() => {
        if (!serverStarted) {
          this.log('❌ Server startup timeout', 'error');
          this.cleanup();
          reject(new Error('Server startup timeout'));
        }
      }, 60000);

      this.serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(output);

        // Look for web server URL
        if (output.includes('Web') && output.includes('http')) {
          const urlMatch = output.match(/http:\/\/[^\s]+/);
          if (urlMatch) {
            webUrl = urlMatch[0];
            serverStarted = true;
            clearTimeout(timeout);
            
            this.log(`✅ Web server started at: ${webUrl}`, 'success');
            this.provideTestInstructions(webUrl);
            resolve(webUrl);
          }
        }

        // Look for Metro bundler ready
        if (output.includes('Metro') && output.includes('ready')) {
          this.log('✅ Metro bundler is ready', 'success');
        }
      });

      this.serverProcess.stderr.on('data', (data) => {
        const error = data.toString();
        console.error('Server error:', error);
        
        if (error.includes('Error') && !error.includes('Warning')) {
          clearTimeout(timeout);
          this.cleanup();
          reject(new Error(`Server error: ${error}`));
        }
      });

      this.serverProcess.on('close', (code) => {
        this.log(`Server process exited with code ${code}`);
        if (code !== 0 && !serverStarted) {
          reject(new Error(`Server process failed with code ${code}`));
        }
      });
    });
  }

  provideTestInstructions(webUrl) {
    console.log('\n' + '='.repeat(80));
    console.log('🧪 SPLASH SCREEN VISIBILITY TEST INSTRUCTIONS');
    console.log('='.repeat(80));
    console.log(`\n1. Open your web browser and navigate to: ${webUrl}`);
    console.log('\n2. You should see the ZenZone splash screen with:');
    console.log('   ✓ Gradient background (pink, yellow, green, blue, purple)');
    console.log('   ✓ ZenZone logo in the center');
    console.log('   ✓ App text below the logo');
    console.log('   ✓ "GET STARTED" button at the bottom');
    console.log('   ✓ Floating animations (pentagon, group, bubbles)');
    console.log('   ✓ Small test buttons in bottom-right corner');
    console.log('\n3. Check browser console (F12) for any JavaScript errors');
    console.log('\n4. Test the animations:');
    console.log('   ✓ Logo should pop out with elastic animation');
    console.log('   ✓ Text should slide in from the left');
    console.log('   ✓ Pentagon should shimmer continuously');
    console.log('   ✓ Group elements should float and shimmer');
    console.log('   ✓ Bubbles should float in circular patterns');
    console.log('\n5. Test the button:');
    console.log('   ✓ "GET STARTED" button should be clickable');
    console.log('   ✓ Should log "Get Started pressed" to console');
    console.log('\n6. Test responsiveness:');
    console.log('   ✓ Resize browser window to test responsive layout');
    console.log('   ✓ All elements should scale appropriately');
    console.log('\n' + '='.repeat(80));
    console.log('Press Ctrl+C to stop the development server');
    console.log('='.repeat(80));
  }

  cleanup() {
    if (this.serverProcess) {
      this.log('🛑 Stopping development server...');
      this.serverProcess.kill('SIGTERM');
      
      // Force kill after 5 seconds if it doesn't stop gracefully
      setTimeout(() => {
        if (this.serverProcess && !this.serverProcess.killed) {
          this.serverProcess.kill('SIGKILL');
        }
      }, 5000);
    }
  }

  async runTest() {
    try {
      // Check if we can start the server
      await this.startDevServer();
      
      // Keep the process alive until user stops it
      process.on('SIGINT', () => {
        this.log('\n🛑 Received interrupt signal, shutting down...');
        this.cleanup();
        process.exit(0);
      });

      process.on('SIGTERM', () => {
        this.log('\n🛑 Received terminate signal, shutting down...');
        this.cleanup();
        process.exit(0);
      });

    } catch (error) {
      this.log(`❌ Test failed: ${error.message}`, 'error');
      this.cleanup();
      process.exit(1);
    }
  }
}

// Run the test
if (require.main === module) {
  const tester = new SplashVisibilityTester();
  tester.runTest();
}

module.exports = SplashVisibilityTester;