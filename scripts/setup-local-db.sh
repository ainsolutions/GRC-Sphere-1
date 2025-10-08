#!/bin/bash

# Local PostgreSQL Setup Script
echo "🔧 Setting up local PostgreSQL database for development..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    print_error "PostgreSQL is not installed. Please install it first:"
    echo "brew install postgresql"
    exit 1
fi

print_success "PostgreSQL is installed"

# Stop any running PostgreSQL service
print_status "Stopping PostgreSQL service..."
brew services stop postgresql@14 2>/dev/null || true

# Configure PostgreSQL for local development (no password)
print_status "Configuring PostgreSQL for local development..."

# Detect PostgreSQL data directory (Apple Silicon vs Intel Homebrew paths)
PG_DATA_DIR=""
for DIR in "/opt/homebrew/var/postgresql@14" "/usr/local/var/postgresql@14"; do
  if [ -d "$DIR" ]; then
    PG_DATA_DIR="$DIR"
    break
  fi
done

if [ -z "$PG_DATA_DIR" ]; then
  print_error "Could not determine PostgreSQL data directory. Checked: /opt/homebrew/var/postgresql@14 and /usr/local/var/postgresql@14"
  exit 1
fi

# Backup pg_hba.conf if present
if [ -f "$PG_DATA_DIR/pg_hba.conf" ]; then
  cp "$PG_DATA_DIR/pg_hba.conf" "$PG_DATA_DIR/pg_hba.conf.backup"
  print_status "Backed up pg_hba.conf at $PG_DATA_DIR"
fi

# Write a simple pg_hba.conf for local development
cat > "$PG_DATA_DIR/pg_hba.conf" << 'EOF'
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
EOF

print_success "Configured PostgreSQL for local development at $PG_DATA_DIR"

# Start PostgreSQL service
print_status "Starting PostgreSQL service..."
brew services start postgresql@14

# Wait a moment for the service to start
sleep 3

# Ensure local role 'apple' exists with LOGIN and SUPERUSER for dev
print_status "Ensuring role 'apple' exists..."
if ! psql -U postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname = 'apple'" | grep -q 1; then
  psql -U postgres -c "CREATE ROLE apple LOGIN SUPERUSER;" || true
fi
print_success "Role 'apple' ready"

# Create database
print_status "Creating database 'grc_tech'..."
if createdb -U apple grc_tech 2>/dev/null; then
  print_success "Database 'grc_tech' created successfully"
else
  print_warning "Database 'grc_tech' might already exist"
fi

# Test connection
print_status "Testing database connection..."
if psql -U apple -d grc_tech -c "SELECT version();" &>/dev/null; then
  print_success "Database connection successful!"

  # Persist DATABASE_URL to .env.local
  echo "DATABASE_URL=\"postgresql://apple@localhost:5432/grc_tech\"" > .env.local
  export DATABASE_URL="postgresql://apple@localhost:5432/grc_tech"

  print_success "Local database setup completed!"
  echo ""
  echo "Your DATABASE_URL is: $DATABASE_URL"
  echo "Saved to .env.local"
  echo ""
  echo "Now you can run:"
  echo "npm run db:setup"
  echo ""
else
  print_error "Failed to connect to database"
  echo "Please check PostgreSQL installation and try again"
  exit 1
fi

