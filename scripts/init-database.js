#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Initializing GRC Tech Database...\n');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
  console.error('❌ Error: DATABASE_URL or POSTGRES_URL environment variable is required');
  console.log('\nPlease set your database URL:');
  console.log('export DATABASE_URL="your-database-connection-string"');
  console.log('\nFor Neon Database:');
  console.log('1. Go to https://console.neon.tech/');
  console.log('2. Create a new project');
  console.log('3. Copy the connection string');
  console.log('4. Set it as DATABASE_URL');
  process.exit(1);
}

// Check if psql is available
try {
  execSync('psql --version', { stdio: 'ignore' });
} catch (error) {
  console.error('❌ Error: psql is not installed');
  console.log('\nPlease install PostgreSQL client:');
  console.log('macOS: brew install postgresql');
  console.log('Ubuntu: sudo apt-get install postgresql-client');
  console.log('Windows: Download from https://www.postgresql.org/download/windows/');
  process.exit(1);
}

// Test database connection
console.log('🔍 Testing database connection...');
try {
  execSync(`psql "${process.env.DATABASE_URL || process.env.POSTGRES_URL}" -c "SELECT version();"`, { 
    stdio: 'pipe' 
  });
  console.log('✅ Database connection successful!');
} catch (error) {
  console.error('❌ Failed to connect to database');
  console.error('Please check your DATABASE_URL and try again');
  process.exit(1);
}

// Create .env file if it doesn't exist
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  const envContent = `# Database Configuration
DATABASE_URL="${process.env.DATABASE_URL || process.env.POSTGRES_URL}"

# OpenAI Configuration (for AI features)
OPENAI_API_KEY="your-openai-api-key"

# Application Configuration
NODE_ENV="development"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Email Configuration (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload Configuration (optional)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file');
} else {
  console.log('📝 .env file already exists');
}

// Run database schema files
console.log('🗄️ Setting up database schema...');

const scriptsDir = path.join(process.cwd(), 'scripts');
const sqlFiles = fs.readdirSync(scriptsDir)
  .filter(file => file.endsWith('.sql'))
  .sort((a, b) => {
    // Sort numerically by filename prefix
    const aNum = parseInt(a.match(/^(\d+)/)?.[1] || '999');
    const bNum = parseInt(b.match(/^(\d+)/)?.[1] || '999');
    return aNum - bNum;
  });

let successCount = 0;
let errorCount = 0;

for (const file of sqlFiles) {
  const filePath = path.join(scriptsDir, file);
  console.log(`  📄 Running: ${file}`);
  
  try {
    execSync(`psql "${process.env.DATABASE_URL || process.env.POSTGRES_URL}" -f "${filePath}"`, {
      stdio: 'pipe'
    });
    console.log(`    ✅ Success: ${file}`);
    successCount++;
  } catch (error) {
    console.log(`    ⚠️  Warning: ${file} (this might be expected if tables already exist)`);
    errorCount++;
  }
}

console.log('\n📊 Schema Setup Summary:');
console.log(`  ✅ Successful: ${successCount} files`);
console.log(`  ⚠️  Warnings: ${errorCount} files`);

console.log('\n🎉 Database initialization completed!');
console.log('\nNext steps:');
console.log('1. Set your OpenAI API key in the .env file for AI features');
console.log('2. Run "npm run dev" to start the development server');
console.log('3. Visit http://localhost:3000 to access your application');
console.log('\nFor production deployment:');
console.log('1. Set all environment variables in your hosting platform');
console.log('2. Ensure your database is accessible from your hosting environment');

