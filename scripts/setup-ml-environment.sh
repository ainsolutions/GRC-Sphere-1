#!/bin/bash

# ML Environment Setup Script for GRC Predictive Analysis
# This script sets up the Python environment and dependencies for machine learning analysis

set -e

echo "🤖 Setting up ML Environment for GRC Predictive Analysis..."
echo "========================================================"

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check Python version
PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
REQUIRED_VERSION="3.8"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$PYTHON_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Python $REQUIRED_VERSION+ is required. Current version: $PYTHON_VERSION"
    exit 1
fi

echo "✅ Python $PYTHON_VERSION detected"

# Check if pip is installed
if ! command -v pip3 &> /dev/null; then
    echo "❌ pip3 is not installed. Please install pip3 first."
    exit 1
fi

echo "✅ pip3 detected"

# Create virtual environment if it doesn't exist
VENV_DIR="ml_env"
if [ ! -d "$VENV_DIR" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv $VENV_DIR
    echo "✅ Virtual environment created"
else
    echo "✅ Virtual environment already exists"
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source $VENV_DIR/bin/activate

# Upgrade pip
echo "⬆️  Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo "📚 Installing Python dependencies..."
pip install -r scripts/requirements-ml.txt

# Verify installations
echo "🔍 Verifying installations..."

# Check critical packages
PACKAGES=("pandas" "numpy" "scikit-learn" "psycopg2" "xgboost")
for package in "${PACKAGES[@]}"; do
    if python3 -c "import $package" 2>/dev/null; then
        echo "✅ $package installed successfully"
    else
        echo "❌ Failed to install $package"
        exit 1
    fi
done

# Create environment activation script
cat > activate_ml_env.sh << 'EOF'
#!/bin/bash
# ML Environment Activation Script

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$SCRIPT_DIR/ml_env"

if [ ! -d "$VENV_DIR" ]; then
    echo "❌ ML environment not found. Run setup-ml-environment.sh first."
    exit 1
fi

echo "🔄 Activating ML environment..."
source "$VENV_DIR/bin/activate"
echo "✅ ML environment activated!"
echo "📍 Virtual environment: $VENV_DIR"
echo "🐍 Python executable: $(which python)"
echo ""
echo "To run ML analysis:"
echo "  python scripts/ml_predictive_analysis.py"
echo ""
echo "To deactivate:"
echo "  deactivate"
EOF

chmod +x activate_ml_env.sh

# Test the setup by running a simple import test
echo "🧪 Testing ML setup..."
python3 -c "
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import psycopg2
from datetime import datetime
print('✅ All ML dependencies imported successfully')
print(f'📊 Pandas version: {pd.__version__}')
print(f'🧠 NumPy version: {np.__version__}')
print(f'🤖 Scikit-learn version: {__import__('sklearn').__version__}')
"

echo ""
echo "🎉 ML Environment Setup Complete!"
echo "=================================="
echo "✅ Python $PYTHON_VERSION"
echo "✅ Virtual environment created: $VENV_DIR"
echo "✅ All dependencies installed"
echo ""
echo "🚀 To use the ML environment:"
echo "   source activate_ml_env.sh"
echo ""
echo "📊 To run predictive analysis:"
echo "   python scripts/ml_predictive_analysis.py"
echo ""
echo "🌐 To test the web interface:"
echo "   Visit: http://localhost:3000/ai-analysis"
echo ""
echo "📝 Note: Make sure your database is running and configured"
echo "        with the correct DATABASE_URL in your .env.local file"
