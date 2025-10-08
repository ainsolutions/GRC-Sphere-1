#!/usr/bin/env node

/**
 * OpenAI Configuration Validator
 *
 * This script helps validate your OpenAI API configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 OpenAI Configuration Validator');
console.log('================================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  console.log('📝 Please create a .env.local file in your project root\n');
  process.exit(1);
}

console.log('✅ .env.local file found');

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envLines = envContent.split('\n');

let openaiKey = null;
let hasValidKey = false;

for (const line of envLines) {
  if (line.startsWith('OPENAI_API_KEY=')) {
    const keyValue = line.split('=')[1]?.replace(/"/g, '');
    openaiKey = keyValue;

    if (keyValue && keyValue !== 'your-api-key-here' && keyValue.startsWith('sk-')) {
      hasValidKey = true;
    }
    break;
  }
}

console.log('\n🔑 OpenAI API Key Check:');
if (!openaiKey) {
  console.log('❌ OPENAI_API_KEY not found in .env.local');
  console.log('📝 Please add: OPENAI_API_KEY="your-actual-openai-api-key"');
} else if (openaiKey === 'your-api-key-here') {
  console.log('❌ OPENAI_API_KEY is still set to placeholder value');
  console.log('📝 Please replace with your actual OpenAI API key from https://platform.openai.com/account/api-keys');
} else if (!openaiKey.startsWith('sk-')) {
  console.log('❌ OPENAI_API_KEY does not start with "sk-"');
  console.log('📝 Please verify your API key is correct');
} else {
  console.log('✅ OPENAI_API_KEY appears to be properly configured');
  console.log(`🔒 Key starts with: ${openaiKey.substring(0, 10)}...`);
}

console.log('\n📦 Package Dependencies Check:');
try {
  const packageJson = require(path.join(process.cwd(), 'package.json'));

  const hasAiSdk = packageJson.dependencies && packageJson.dependencies['@ai-sdk/openai'];
  const hasAi = packageJson.dependencies && packageJson.dependencies['ai'];

  if (hasAiSdk && hasAi) {
    console.log('✅ @ai-sdk/openai and ai packages are installed');
  } else {
    console.log('❌ Missing required packages');
    if (!hasAiSdk) console.log('  - @ai-sdk/openai not found');
    if (!hasAi) console.log('  - ai package not found');
  }
} catch (error) {
  console.log('❌ Could not read package.json');
}

console.log('\n🚀 Next Steps:');
if (!hasValidKey) {
  console.log('1. Get your OpenAI API key from: https://platform.openai.com/account/api-keys');
  console.log('2. Update your .env.local file with the real API key');
  console.log('3. Restart your development server: npm run dev');
} else {
  console.log('1. Restart your development server: npm run dev');
  console.log('2. Test the connection: curl http://localhost:3000/api/test-openai');
  console.log('3. Try the threat analysis feature in your application');
}

console.log('\n📚 Resources:');
console.log('- OpenAI Platform: https://platform.openai.com');
console.log('- Setup Guide: Check OPENAI_SETUP.md in your project root');
console.log('- Test Endpoint: http://localhost:3000/api/test-openai');

if (hasValidKey) {
  console.log('\n🎉 Your OpenAI setup looks good! The integration should work now.');
} else {
  console.log('\n⚠️  Please complete the setup steps above before using AI features.');
}
