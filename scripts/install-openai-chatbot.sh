#!/bin/bash

# GRC OpenAI Chatbot Installation Script
# Sets up Python environment and dependencies for AI-powered chatbot

echo "🤖 Setting up GRC OpenAI Chatbot..."

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "📥 Installing Python dependencies..."
pip install -r scripts/requirements.txt

# Test installation
echo "🧪 Testing OpenAI chatbot setup..."
python3 scripts/test-openai-chatbot.py

echo "🎉 OpenAI chatbot setup complete!"
echo ""
echo "Next steps:"
echo "1. Make sure OPENAI_API_KEY is set in your environment"
echo "2. Ensure DATABASE_URL is configured"
echo "3. Test the chatbot with: python3 scripts/grc-openai-chatbot.py 'your question'"
