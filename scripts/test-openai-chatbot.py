#!/usr/bin/env python3
"""
Test script for GRC OpenAI Chatbot
Verifies OpenAI integration and database connectivity for the new AI-powered chatbot
"""

import os
import sys
import asyncio
import json
from pathlib import Path

# Add scripts directory to Python path
sys.path.append(str(Path(__file__).parent))

async def test_openai_chatbot():
    """Test the OpenAI chatbot functionality"""
    print("🤖 Testing GRC OpenAI Chatbot...")
    
    # Test environment variables
    print("\n📋 Checking Environment Variables:")
    required_vars = ['OPENAI_API_KEY', 'DATABASE_URL']
    missing_vars = []
    
    for var in required_vars:
        if os.getenv(var):
            print(f"  ✅ {var}: Set")
        else:
            print(f"  ❌ {var}: Missing")
            missing_vars.append(var)
    
    if missing_vars:
        print(f"\n❌ Missing required environment variables: {', '.join(missing_vars)}")
        return False
    
    # Test imports
    print("\n📦 Testing Python Dependencies:")
    try:
        import openai
        print("  ✅ OpenAI: Available")
        
        import asyncpg
        print("  ✅ AsyncPG: Available")
        
        import json
        print("  ✅ JSON: Available")
        
    except ImportError as e:
        print(f"  ❌ Import Error: {e}")
        return False
    
    # Test OpenAI client initialization
    print("\n🔑 Testing OpenAI Client:")
    try:
        from openai import OpenAI
        client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        print("  ✅ OpenAI client initialized successfully")
    except Exception as e:
        print(f"  ❌ OpenAI client error: {e}")
        return False
    
    # Test database connection
    print("\n🗄️ Testing Database Connection:")
    try:
        import asyncpg
        conn = await asyncpg.connect(os.getenv('DATABASE_URL'))
        await conn.close()
        print("  ✅ Database connection successful")
    except Exception as e:
        print(f"  ❌ Database connection error: {e}")
        return False
    
    # Test chatbot functionality
    print("\n🤖 Testing Chatbot Functionality:")
    try:
        from grc_openai_chatbot import GRCOpenAIChatbot
        
        chatbot = GRCOpenAIChatbot()
        test_query = "How many risks are in the system?"
        
        print(f"  📝 Test query: '{test_query}'")
        response = await chatbot.generate_response(test_query)
        
        if response and len(response) > 10:
            print("  ✅ Chatbot response generated successfully")
            print(f"  📄 Response preview: {response[:100]}...")
        else:
            print("  ❌ Chatbot response too short or empty")
            return False
            
    except Exception as e:
        print(f"  ❌ Chatbot test error: {e}")
        return False
    
    print("\n🎉 All tests passed! OpenAI chatbot is ready to use.")
    return True

async def main():
    """Main test function"""
    print("=" * 60)
    print("GRC OpenAI Chatbot Test Suite")
    print("=" * 60)
    
    success = await test_openai_chatbot()
    
    if success:
        print("\n✅ Setup Complete! You can now use the OpenAI-powered chatbot.")
        print("\nTo test manually, run:")
        print("python3 scripts/grc-openai-chatbot.py 'How many incidents are open?'")
    else:
        print("\n❌ Setup incomplete. Please fix the issues above.")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(main())
