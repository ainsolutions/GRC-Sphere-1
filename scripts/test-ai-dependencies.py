#!/usr/bin/env python3
"""
AI GRC Analysis Dependencies Test Script
Tests all required dependencies and connections
"""

import sys
import os
from datetime import datetime

def test_imports():
    """Test all required package imports"""
    print("🧪 Testing Python package imports...")
    
    try:
        import openai
        print("✅ OpenAI imported successfully")
    except ImportError as e:
        print(f"❌ OpenAI import failed: {e}")
        return False
    
    try:
        import psycopg2
        print("✅ psycopg2 imported successfully")
    except ImportError as e:
        print(f"❌ psycopg2 import failed: {e}")
        return False
    
    try:
        import requests
        print("✅ requests imported successfully")
    except ImportError as e:
        print(f"❌ requests import failed: {e}")
        return False
    
    try:
        import numpy as np
        print("✅ numpy imported successfully")
    except ImportError as e:
        print(f"❌ numpy import failed: {e}")
        return False
    
    try:
        import pandas as pd
        print("✅ pandas imported successfully")
    except ImportError as e:
        print(f"❌ pandas import failed: {e}")
        return False
    
    return True

def test_environment_variables():
    """Test required environment variables"""
    print("\n🔧 Testing environment variables...")
    
    openai_key = os.getenv('OPENAI_API_KEY')
    if openai_key:
        print("✅ OPENAI_API_KEY is set")
    else:
        print("⚠️ OPENAI_API_KEY is not set")
    
    database_url = os.getenv('DATABASE_URL')
    if database_url:
        print("✅ DATABASE_URL is set")
    else:
        print("⚠️ DATABASE_URL is not set")
    
    return openai_key is not None and database_url is not None

def test_database_connection():
    """Test database connection"""
    print("\n🗄️ Testing database connection...")
    
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("❌ DATABASE_URL not set, skipping database test")
        return False
    
    try:
        import psycopg2
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print(f"✅ Database connection successful: {version[0]}")
        cursor.close()
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_openai_connection():
    """Test OpenAI API connection"""
    print("\n🤖 Testing OpenAI API connection...")
    
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        print("❌ OPENAI_API_KEY not set, skipping OpenAI test")
        return False
    
    try:
        import openai
        client = openai.OpenAI(api_key=api_key)
        
        # Test with a simple completion
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "Hello, this is a test."}],
            max_tokens=10
        )
        
        print("✅ OpenAI API connection successful")
        return True
    except Exception as e:
        print(f"❌ OpenAI API connection failed: {e}")
        return False

def main():
    """Main test function"""
    print("🚀 AI GRC Analysis Dependencies Test")
    print("=" * 50)
    print(f"Test started at: {datetime.now()}")
    print()
    
    # Run all tests
    imports_ok = test_imports()
    env_vars_ok = test_environment_variables()
    db_ok = test_database_connection()
    openai_ok = test_openai_connection()
    
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY:")
    print(f"Package Imports: {'✅ PASS' if imports_ok else '❌ FAIL'}")
    print(f"Environment Variables: {'✅ PASS' if env_vars_ok else '❌ FAIL'}")
    print(f"Database Connection: {'✅ PASS' if db_ok else '❌ FAIL'}")
    print(f"OpenAI API Connection: {'✅ PASS' if openai_ok else '❌ FAIL'}")
    
    all_tests_passed = imports_ok and env_vars_ok and db_ok and openai_ok
    
    if all_tests_passed:
        print("\n🎉 All tests passed! AI GRC Analysis is ready to run.")
        return 0
    else:
        print("\n⚠️ Some tests failed. Please check the configuration.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
