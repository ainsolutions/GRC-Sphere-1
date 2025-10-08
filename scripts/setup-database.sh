#!/bin/bash

# Database Setup Script for GRC Tech Application
echo "🚀 Setting up database for GRC Tech Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL environment variable is not set!"
    echo ""
    echo "Please set your DATABASE_URL environment variable:"
    echo "export DATABASE_URL='postgresql://username:password@hostname:port/database?sslmode=require'"
    echo ""
    echo "For Neon Database:"
    echo "1. Go to https://console.neon.tech/"
    echo "2. Create a new project"
    echo "3. Copy the connection string"
    echo "4. Set it as DATABASE_URL"
    echo ""
    echo "Example:"
    echo "export DATABASE_URL='postgresql://user:password@ep-xxx-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require'"
    exit 1
fi

print_status "Database URL is configured"

# Check if psql is available
if ! command -v psql &> /dev/null; then
    print_warning "psql is not installed. Installing PostgreSQL client..."
    
    # Detect OS and install PostgreSQL client
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt-get &> /dev/null; then
            sudo apt-get update && sudo apt-get install -y postgresql-client
        elif command -v yum &> /dev/null; then
            sudo yum install -y postgresql
        else
            print_error "Could not install PostgreSQL client. Please install it manually."
            exit 1
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install postgresql
        else
            print_error "Homebrew not found. Please install PostgreSQL client manually."
            exit 1
        fi
    else
        print_error "Unsupported OS. Please install PostgreSQL client manually."
        exit 1
    fi
fi

print_status "PostgreSQL client is available"

# Test database connection
print_status "Testing database connection..."
if psql "$DATABASE_URL" -c "SELECT version();" &> /dev/null; then
    print_success "Database connection successful!"
else
    print_error "Failed to connect to database. Please check your DATABASE_URL."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file..."
    cat > .env << EOF
# Database Configuration
DATABASE_URL="$DATABASE_URL"

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
EOF
    print_success "Created .env file"
else
    print_status ".env file already exists"
fi

# Run database schema files
print_status "Setting up database schema..."

# Get all SQL files and sort them numerically
sql_files=$(find scripts -name "*.sql" | sort -V)

for file in $sql_files; do
    print_status "Running schema file: $(basename "$file")"
    if psql "$DATABASE_URL" -f "$file" &> /dev/null; then
        print_success "Executed $(basename "$file")"
    else
        print_warning "Failed to execute $(basename "$file") - this might be expected if tables already exist"
    fi
done

print_success "Database setup completed!"
echo ""
echo "🎉 Your GRC Tech application is now connected to the database!"
echo ""
echo "Next steps:"
echo "1. Set your OpenAI API key in the .env file for AI features"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Visit http://localhost:3000 to access your application"
echo ""
echo "For production deployment:"
echo "1. Set all environment variables in your hosting platform"
echo "2. Ensure your database is accessible from your hosting environment"

