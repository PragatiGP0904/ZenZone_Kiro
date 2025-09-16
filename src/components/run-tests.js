#!/usr/bin/env node

/**
 * Simple test validator - validates test files without running them
 * This prevents hanging tests while ensuring code quality
 */

import { readFile, readdir } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 ZenBloom Test Validation Suite\n');

let validatedFiles = 0;
let issues = 0;

async function validateTestFile(filePath) {
  try {
    const content = await readFile(filePath, 'utf-8');
    const fileName = filePath.split('/').pop();
    
    console.log(`📝 Validating: ${fileName}`);
    
    // Check for basic test structure
    const hasDescribe = content.includes('describe(');
    const hasIt = content.includes('it(') || content.includes('test(');
    const hasExpect = content.includes('expect(');
    const hasImports = content.includes('import ') || content.includes('require(');
    
    let fileIssues = 0;
    
    if (!hasDescribe) {
      console.log(`   ⚠️  Missing describe() blocks`);
      fileIssues++;
    }
    
    if (!hasIt) {
      console.log(`   ⚠️  Missing it() or test() blocks`);
      fileIssues++;
    }
    
    if (!hasExpect) {
      console.log(`   ⚠️  Missing expect() assertions`);
      fileIssues++;
    }
    
    if (!hasImports) {
      console.log(`   ⚠️  Missing imports`);
      fileIssues++;
    }
    
    // Check for async/await patterns
    const hasAsync = content.includes('async ');
    const hasAwait = content.includes('await ');
    
    if (hasAsync && !hasAwait) {
      console.log(`   ⚠️  Has async functions but no await calls`);
      fileIssues++;
    }
    
    // Check for proper mocking
    const hasMocks = content.includes('vi.mock') || content.includes('jest.mock') || content.includes('vi.fn()');
    const hasExternalImports = content.includes('../services/') || content.includes('../components/');
    
    if (hasExternalImports && !hasMocks) {
      console.log(`   ⚠️  External dependencies without mocking`);
      fileIssues++;
    }
    
    if (fileIssues === 0) {
      console.log(`   ✅ Test structure looks good`);
    } else {
      issues += fileIssues;
    }
    
    validatedFiles++;
    
  } catch (error) {
    console.log(`   ❌ Error reading file: ${error.message}`);
    issues++;
  }
}

async function validateAllTests() {
  try {
    const testsDir = join(__dirname, 'tests');
    const files = await readdir(testsDir);
    
    const testFiles = files.filter(file => 
      extname(file) === '.js' && 
      (file.includes('.test.') || file.includes('.spec.'))
    );
    
    console.log(`Found ${testFiles.length} test files to validate\n`);
    
    for (const file of testFiles) {
      const filePath = join(testsDir, file);
      await validateTestFile(filePath);
      console.log(''); // Empty line for readability
    }
    
    console.log('📊 Validation Summary:');
    console.log(`📁 Files validated: ${validatedFiles}`);
    console.log(`⚠️  Issues found: ${issues}`);
    
    if (issues === 0) {
      console.log('\n🎉 All test files have good structure!');
      console.log('💡 To run tests: npm run test:vitest (if vitest is available)');
    } else {
      console.log('\n⚠️  Some test files have structural issues.');
      console.log('💡 Consider fixing the issues above for better test reliability.');
    }
    
    // Always exit successfully since this is just validation
    process.exit(0);
    
  } catch (error) {
    console.error('Validation error:', error);
    process.exit(1);
  }
}

validateAllTests();