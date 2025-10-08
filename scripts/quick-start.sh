#!/bin/bash

# Quick Start Script for GRC Tech Application
echo "🚀 GRC Tech Application - Quick Start"
echo "=================================="
echo ""

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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    echo "Download from: https://nodejs.org/"
    exit 1
fi

print_success "Node.js is installed ($(node --version))"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
fi

print_success "npm is installed ($(npm --version))"

# Install dependencies
print_status "Installing dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ] && [ -z "$POSTGRES_URL" ]; then
    echo ""
    print_warning "DATABASE_URL is not set"
    echo ""
    echo "You need to set up a database first. Here are your options:"
    echo ""
    echo "1. Neon Database (Recommended - Free tier available):"
    echo "   - Go to https://console.neon.tech/"
    echo "   - Sign up and create a new project"
    echo "   - Copy the connection string"
    echo "   - Set it as DATABASE_URL"
    echo ""
    echo "2. Other PostgreSQL Database:"
    echo "   - Use any PostgreSQL database"
    echo "   - Ensure it's accessible from your application"
    echo ""
    echo "Example:"
    echo "export DATABASE_URL='postgresql://user:password@hostname:port/database?sslmode=require'"
    echo ""
    echo "After setting DATABASE_URL, run this script again."
    echo ""
    echo "Or run the database setup manually:"
    echo "npm run db:setup"
    exit 1
fi

print_success "Database URL is configured"

# Run database setup
print_status "Setting up database..."
if npm run db:setup; then
    print_success "Database setup completed"
else
    print_warning "Database setup had some issues, but continuing..."
fi

# Start the development server
echo ""
print_status "Starting development server..."
echo ""
echo "🎉 Your GRC Tech application is starting up!"
echo ""
echo "The application will be available at: http://localhost:3000"
echo ""
echo "To stop the server, press Ctrl+C"
echo ""
echo "For database health check, visit: http://localhost:3000/api/database/health"
echo ""

# Start the development server
npm run dev

