#!/bin/bash

# AI GRC Analysis Dependencies Installation Script
echo "🚀 Installing AI GRC Analysis Dependencies..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip3."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Upgrade pip
echo "⬆️ Upgrading pip..."
pip install --upgrade pip

# Install required packages
echo "📚 Installing Python packages..."
pip install -r scripts/requirements.txt

# Verify installations
echo "✅ Verifying installations..."
python3 -c "import openai; print('✅ OpenAI installed successfully')"
python3 -c "import psycopg2; print('✅ psycopg2 installed successfully')"
python3 -c "import requests; print('✅ requests installed successfully')"

echo "🎉 All dependencies installed successfully!"
echo "💡 To activate the virtual environment, run: source venv/bin/activate"
echo "🔑 Don't forget to set your environment variables:"
echo "   export OPENAI_API_KEY='your-openai-api-key'"
echo "   export DATABASE_URL='your-database-url'"
