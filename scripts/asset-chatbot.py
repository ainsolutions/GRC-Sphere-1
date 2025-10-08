#!/usr/bin/env python3
"""
Asset Registration Chatbot
A conversational AI assistant for collecting asset information and inserting into database.
"""

import os
import sys
import json
import psycopg2
from datetime import datetime
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AssetChatbot:
    def __init__(self):
        self.asset_data = {}
        self.current_step = 0
        self.conversation_history = []
        
        # Database connection
        self.db_url = os.getenv('DATABASE_URL')
        if not self.db_url:
            print("Error: DATABASE_URL environment variable not set")
            sys.exit(1)
            
        # Conversation steps
        self.steps = [
            {
                'field': 'asset_name',
                'question': 'Hi! I\'m here to help you register a new asset. Let\'s start with the basics. What\'s the name of the asset you\'d like to register?',
                'validation': self.validate_asset_name,
                'error_message': 'Asset name must be at least 2 characters long.'
            },
            {
                'field': 'asset_type',
                'question': 'Great! What type of asset is this? Please choose from: Hardware, Software, Data, Network, Physical, or Document.',
                'validation': self.validate_asset_type,
                'error_message': 'Please select a valid asset type: Hardware, Software, Data, Network, Physical, or Document.'
            },
            {
                'field': 'owner',
                'question': 'Who is the owner or responsible person for this asset? Please provide their name or department.',
                'validation': self.validate_owner,
                'error_message': 'Owner name must be at least 2 characters long.'
            },
            {
                'field': 'custodian',
                'question': 'Who is the custodian of this asset? Please provide their name or department.',
                'validation': self.validate_custodian,
                'error_message': 'Custodian name must be at least 2 characters long.'
            },
            {
                'field': 'retention_period',
                'question': 'What is the retention period for this asset? Please provide the number of years.',
                'validation': self.validate_retention_period,
                'error_message': 'Retention period must be a number.'
            },
            {
                'field': 'disposal_method',
                'question': 'What is the disposal method for this asset? Please provide the method.',
                'validation': self.validate_disposal_method,
                'error_message': 'Disposal method must be at least 2 characters long.'
            },
            {
                'field': 'ip_address',
                'question': 'What is the IP address of this asset? Please provide the IP address.',
                'validation': self.validate_ip_address,
                'error_message': 'IP address must be at least 2 characters long.'
            },
            {
                'field': 'model_version',
                'question': 'What is the model version of this asset? Please provide the version.',
                'validation': self.validate_model_version,
                'error_message': 'Model version must be at least 2 characters long.'
            },
            {
                'field': 'classification',
                'question': 'What\'s the data classification level? Please choose from: Public, Internal, Confidential, or Restricted.',
                'validation': self.validate_classification,
                'error_message': 'Please select a valid classification: Public, Internal, Confidential, or Restricted.'
            },
            {
                'field': 'business_value',
                'question': 'What\'s the business value of this asset? Please choose from: Low, Medium, High, or Critical.',
                'validation': self.validate_business_value,
                'error_message': 'Please select a valid business value: Low, Medium, High, or Critical.'
            },
            {
                'field': 'confidentiality_level',
                'question': 'Now let\'s set the CIA ratings. What\'s the confidentiality level? Please enter a number from 1 to 5 (1 = lowest, 5 = highest).',
                'validation': self.validate_cia_level,
                'error_message': 'Please enter a number from 1 to 5.'
            },
            {
                'field': 'integrity_level',
                'question': 'What\'s the integrity level? Please enter a number from 1 to 5 (1 = lowest, 5 = highest).',
                'validation': self.validate_cia_level,
                'error_message': 'Please enter a number from 1 to 5.'
            },
            {
                'field': 'availability_level',
                'question': 'What\'s the availability level? Please enter a number from 1 to 5 (1 = lowest, 5 = highest).',
                'validation': self.validate_cia_level,
                'error_message': 'Please enter a number from 1 to 5.'
            },
            {
                'field': 'location',
                'question': 'Where is this asset located? Please provide the physical or logical location.',
                'validation': self.validate_location,
                'error_message': 'Location must be at least 2 characters long.'
            },
            {
                'field': 'description',
                'question': 'Finally, please provide a brief description of this asset and its purpose.',
                'validation': self.validate_description,
                'error_message': 'Description must be at least 10 characters long.'
            }
        ]

    def validate_asset_name(self, value):
        return len(value.strip()) >= 2

    def validate_asset_type(self, value):
        valid_types = ['Hardware', 'Software', 'Data', 'Network', 'Physical', 'Document']
        return value.strip() in valid_types

    def validate_owner(self, value):
        return len(value.strip()) >= 2

    def validate_custodian(self, value):
        return len(value.strip()) >= 2

    def validate_retention_period(self, value):
        return value.strip().isdigit()

    def validate_disposal_method(self, value):
        return len(value.strip()) >= 2

    def validate_ip_address(self, value):
        return len(value.strip()) >= 2

    def validate_model_version(self, value):
        return len(value.strip()) >= 2

    def validate_classification(self, value):
        valid_classifications = ['Public', 'Internal', 'Confidential', 'Restricted']
        return value.strip() in valid_classifications

    def validate_business_value(self, value):
        valid_values = ['Low', 'Medium', 'High', 'Critical']
        return value.strip() in valid_values

    def validate_cia_level(self, value):
        return re.match(r'^[1-5]$', value.strip()) is not None

    def validate_location(self, value):
        return len(value.strip()) >= 2

    def validate_description(self, value):
        return len(value.strip()) >= 10

    def generate_asset_id(self):
        """Generate a unique asset ID"""
        timestamp = str(int(datetime.now().timestamp()))[-6:]
        return f"AST-{timestamp}"

    def get_db_connection(self):
        """Get database connection"""
        try:
            conn = psycopg2.connect(self.db_url)
            return conn
        except Exception as e:
            print(f"Database connection error: {e}")
            return None

    def insert_asset(self):
        """Insert asset into database"""
        conn = self.get_db_connection()
        if not conn:
            return False

        try:
            cursor = conn.cursor()
            
            # Generate asset ID
            asset_id = self.generate_asset_id()
            
            # Insert query
            insert_query = """
                INSERT INTO assets (
                    asset_id, asset_name, asset_type, owner, custodian, retention_period, disposal_method, ip_address, model_version, classification,
                    business_value, confidentiality_level, integrity_level,
                    availability_level, location, description, created_at
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
            """
            
            values = (
                asset_id,
                self.asset_data['asset_name'],
                self.asset_data['asset_type'],
                self.asset_data['owner'],
                self.asset_data['custodian'],
                self.asset_data['retention_period'],
                self.asset_data['disposal_method'],
                self.asset_data['ip_address'],
                self.asset_data['model_version'],
                self.asset_data['classification'],
                self.asset_data['business_value'],
                int(self.asset_data['confidentiality_level']),
                int(self.asset_data['integrity_level']),
                int(self.asset_data['availability_level']),
                self.asset_data['location'],
                self.asset_data['description'],
                datetime.now()
            )
            
            cursor.execute(insert_query, values)
            asset_db_id = cursor.fetchone()[0]
            conn.commit()
            
            print(f"✅ Asset created successfully!")
            print(f"   Asset ID: {asset_id}")
            print(f"   Database ID: {asset_db_id}")
            print(f"   Name: {self.asset_data['asset_name']}")
            
            return True
            
        except Exception as e:
            print(f"Error inserting asset: {e}")
            conn.rollback()
            return False
        finally:
            cursor.close()
            conn.close()

    def display_summary(self):
        """Display asset summary"""
        print("\n" + "="*50)
        print("📋 ASSET SUMMARY")
        print("="*50)
        print(f"Name: {self.asset_data['asset_name']}")
        print(f"Type: {self.asset_data['asset_type']}")
        print(f"Owner: {self.asset_data['owner']}")
        print(f"Custodian: {self.asset_data['custodian']}")
        print(f"Retention Period: {self.asset_data['retention_period']}")
        print(f"Disposal Method: {self.asset_data['disposal_method']}")
        print(f"IP Address: {self.asset_data['ip_address']}")
        print(f"Model Version: {self.asset_data['model_version']}")
        print(f"Classification: {self.asset_data['classification']}")
        print(f"Business Value: {self.asset_data['business_value']}")
        print(f"CIA Levels: C:{self.asset_data['confidentiality_level']} I:{self.asset_data['integrity_level']} A:{self.asset_data['availability_level']}")
        print(f"Location: {self.asset_data['location']}")
        print(f"Description: {self.asset_data['description']}")
        print("="*50)

    def start_conversation(self):
        """Start the chatbot conversation"""
        print("🤖 Asset Registration Chatbot")
        print("="*40)
        print("I'll help you register a new asset step by step.")
        print("Type 'quit' at any time to exit.\n")

        while self.current_step < len(self.steps):
            step = self.steps[self.current_step]
            
            # Ask question
            print(f"🤖: {step['question']}")
            
            # Get user input
            user_input = input("👤: ").strip()
            
            # Check for quit
            if user_input.lower() == 'quit':
                print("🤖: Goodbye! Asset registration cancelled.")
                return
            
            # Validate input
            if step['validation'](user_input):
                self.asset_data[step['field']] = user_input
                self.conversation_history.append({
                    'step': self.current_step,
                    'question': step['question'],
                    'answer': user_input,
                    'timestamp': datetime.now().isoformat()
                })
                self.current_step += 1
                print("✅ Got it!\n")
            else:
                print(f"❌ {step['error_message']} Please try again.\n")

        # Show summary and confirm
        self.display_summary()
        
        while True:
            confirm = input("\n🤖: Would you like to create this asset? (yes/no): ").strip().lower()
            
            if confirm == 'yes':
                if self.insert_asset():
                    print("\n🎉 Asset registration completed successfully!")
                else:
                    print("\n❌ Failed to create asset. Please try again.")
                break
            elif confirm == 'no':
                print("\n🤖: Asset registration cancelled.")
                break
            else:
                print("Please type 'yes' or 'no'.")

    def save_conversation_log(self):
        """Save conversation history to file"""
        log_data = {
            'timestamp': datetime.now().isoformat(),
            'asset_data': self.asset_data,
            'conversation_history': self.conversation_history,
            'completed': self.current_step >= len(self.steps)
        }
        
        log_filename = f"asset_chat_log_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        
        try:
            with open(log_filename, 'w') as f:
                json.dump(log_data, f, indent=2)
            print(f"📝 Conversation log saved to: {log_filename}")
        except Exception as e:
            print(f"Warning: Could not save conversation log: {e}")

def main():
    """Main function"""
    try:
        chatbot = AssetChatbot()
        chatbot.start_conversation()
        chatbot.save_conversation_log()
    except KeyboardInterrupt:
        print("\n\n🤖: Conversation interrupted. Goodbye!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
