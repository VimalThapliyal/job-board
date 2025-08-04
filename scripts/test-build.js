const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Testing build process...');

try {
  // Check if all required files exist
  const requiredFiles = [
    'package.json',
    'next.config.ts',
    'tsconfig.json',
    'src/app/layout.tsx',
    'src/app/page.tsx'
  ];

  console.log('📁 Checking required files...');
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
    }
  });

  // Check TypeScript compilation
  console.log('\n🔧 Checking TypeScript compilation...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful');

  // Check ESLint
  console.log('\n🔍 Running ESLint...');
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ ESLint passed');

  // Try building
  console.log('\n🏗️  Attempting build...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful!');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 