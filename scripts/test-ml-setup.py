#!/usr/bin/env python3
"""
Test script for ML Predictive Analysis setup
Verifies that all components are properly configured and working
"""

import sys
import os
import json
from datetime import datetime

def test_imports():
    """Test if all required packages can be imported"""
    print("🔍 Testing Python imports...")

    required_packages = [
        'pandas',
        'numpy',
        'sklearn',
        'psycopg2',
        'xgboost',
        'imblearn'
    ]

    failed_imports = []

    for package in required_packages:
        try:
            if package == 'sklearn':
                import sklearn
                print(f"✅ {package} v{sklearn.__version__}")
            elif package == 'psycopg2':
                import psycopg2
                print(f"✅ {package} imported")
            else:
                module = __import__(package)
                version = getattr(module, '__version__', 'unknown')
                print(f"✅ {package} v{version}")
        except ImportError as e:
            failed_imports.append(package)
            print(f"❌ {package} - Import failed: {e}")

    if failed_imports:
        print(f"\n❌ Failed to import: {', '.join(failed_imports)}")
        return False

    print("✅ All required packages imported successfully")
    return True

def test_database_connection():
    """Test database connectivity"""
    print("\n🔍 Testing database connection...")

    try:
        import psycopg2
        from psycopg2.extras import RealDictCursor

        # Try to get database URL from environment
        db_url = os.getenv('DATABASE_URL')
        if not db_url:
            print("⚠️  DATABASE_URL not found in environment")
            print("   Please set DATABASE_URL in your .env.local file")
            return False

        # Parse database URL
        if db_url.startswith('postgresql://'):
            # Simple URL parsing
            url_parts = db_url.replace('postgresql://', '').split('@')
            if len(url_parts) == 2:
                credentials = url_parts[0].split(':')
                host_port_db = url_parts[1].split('/')

                if len(credentials) == 2 and len(host_port_db) >= 2:
                    db_config = {
                        'user': credentials[0],
                        'password': credentials[1],
                        'host': host_port_db[0].split(':')[0],
                        'port': host_port_db[0].split(':')[1] if ':' in host_port_db[0] else '5432',
                        'database': host_port_db[1].split('?')[0]
                    }

                    conn = psycopg2.connect(**db_config, cursor_factory=RealDictCursor)
                    conn.close()
                    print("✅ Database connection successful")
                    return True

        print("❌ Failed to parse DATABASE_URL or connect to database")
        return False

    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def test_ml_script():
    """Test if the main ML script can be imported and has required functions"""
    print("\n🔍 Testing ML script...")

    try:
        # Add current directory to path
        sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

        # Import the ML analysis class
        from scripts.ml_predictive_analysis import GRCPredictiveAnalyzer

        # Check if class exists
        analyzer = GRCPredictiveAnalyzer({})
        print("✅ ML analysis class imported successfully")

        # Check required methods
        required_methods = [
            'connect_database',
            'fetch_data_from_tables',
            'feature_engineering',
            'create_target_variables',
            'train_predictive_models',
            'generate_predictions',
            'generate_insights',
            'run_complete_analysis'
        ]

        missing_methods = []
        for method in required_methods:
            if not hasattr(analyzer, method):
                missing_methods.append(method)

        if missing_methods:
            print(f"❌ Missing methods: {', '.join(missing_methods)}")
            return False

        print("✅ All required methods found")
        return True

    except ImportError as e:
        print(f"❌ Failed to import ML script: {e}")
        return False
    except Exception as e:
        print(f"❌ ML script test failed: {e}")
        return False

def test_api_endpoints():
    """Test if API endpoints are accessible"""
    print("\n🔍 Testing API endpoints...")

    try:
        import requests

        base_url = "http://localhost:3000"

        # Test ML analysis endpoint
        try:
            response = requests.get(f"{base_url}/api/ml-analysis", timeout=5)
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    print("✅ ML analysis API endpoint working")
                    return True
                else:
                    print("⚠️  ML analysis API returned error:", data.get('error'))
            else:
                print(f"⚠️  ML analysis API returned status {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"⚠️  Cannot connect to ML analysis API: {e}")
            print("   Make sure the Next.js server is running with 'npm run dev'")

        return False

    except ImportError:
        print("⚠️  requests library not available for API testing")
        print("   Install with: pip install requests")
        return False

def create_sample_data():
    """Create sample data for testing"""
    print("\n🔍 Creating sample test data...")

    sample_data = {
        "risks": [
            {
                "id": 1,
                "title": "Sample Risk",
                "status": "open",
                "risk_level": "high",
                "risk_score": 75.0,
                "remediation_status": "in_progress",
                "due_date": "2024-02-15",
                "created_at": "2024-01-01"
            }
        ],
        "incidents": [
            {
                "id": 1,
                "title": "Sample Incident",
                "status": "resolved",
                "severity": "medium",
                "created_at": "2024-01-10",
                "resolved_at": "2024-01-12"
            }
        ],
        "vulnerabilities": [
            {
                "id": 1,
                "title": "Sample Vulnerability",
                "severity": "high",
                "status": "open",
                "cvss_score": 8.5,
                "remediation_status": "pending",
                "due_date": "2024-02-01",
                "discovered_at": "2024-01-05"
            }
        ]
    }

    # Save sample data to file for testing
    with open('/tmp/sample_grc_data.json', 'w') as f:
        json.dump(sample_data, f, indent=2)

    print("✅ Sample test data created")
    return True

def main():
    """Run all tests"""
    print("🚀 ML Predictive Analysis Setup Test")
    print("=" * 50)

    results = {
        'imports': test_imports(),
        'database': test_database_connection(),
        'ml_script': test_ml_script(),
        'api': test_api_endpoints(),
        'sample_data': create_sample_data()
    }

    print("\n" + "=" * 50)
    print("📊 TEST RESULTS SUMMARY")
    print("=" * 50)

    all_passed = True
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name.upper():12}: {status}")
        if not passed:
            all_passed = False

    print("\n" + "=" * 50)

    if all_passed:
        print("🎉 ALL TESTS PASSED!")
        print("   Your ML predictive analysis system is ready to use.")
        print("\n🚀 Next steps:")
        print("   1. Start your Next.js server: npm run dev")
        print("   2. Visit: http://localhost:3000/ai-analysis")
        print("   3. Click 'Refresh' to run your first analysis")
    else:
        print("⚠️  SOME TESTS FAILED")
        print("   Please fix the failed tests before using the ML system.")
        print("\n🔧 Common fixes:")
        print("   • Install missing Python packages: pip install -r scripts/requirements-ml.txt")
        print("   • Set up database connection in .env.local")
        print("   • Start Next.js server: npm run dev")

    return 0 if all_passed else 1

if __name__ == "__main__":
    sys.exit(main())
