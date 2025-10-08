#!/bin/bash

# GRC Application Server Startup Script
# This script ensures OpenAI API key is properly configured before starting the server

echo "🚀 Starting GRC Application Server..."
echo "====================================="

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "📝 Please create a .env.local file with your environment variables."
    exit 1
fi

# Extract OpenAI API key from .env.local
OPENAI_KEY=$(grep "OPENAI_API_KEY" .env.local | cut -d'=' -f2 | sed 's/"//g')

if [ -z "$OPENAI_KEY" ] || [ "$OPENAI_KEY" = "your-api-key-here" ]; then
    echo "❌ OpenAI API key not properly configured!"
    echo "📝 Please update OPENAI_API_KEY in .env.local with your actual OpenAI API key."
    echo "🔗 Get your key from: https://platform.openai.com/account/api-keys"
    exit 1
fi

echo "✅ OpenAI API key found"
echo "🔑 Key starts with: ${OPENAI_KEY:0:10}..."

# Unset any system-level OpenAI API key to avoid conflicts
unset OPENAI_API_KEY

# Start the development server directly with next dev
echo "🌟 Starting Next.js development server..."
echo "📍 Application will be available at: http://localhost:3000"
echo ""
echo "🧪 Test OpenAI connection: curl http://localhost:3000/api/test-openai"
echo "🎯 Try threat analysis: Visit the threats page and use the AI Analysis tab"
echo ""

npx next dev