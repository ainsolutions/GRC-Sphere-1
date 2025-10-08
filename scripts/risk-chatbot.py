import os
import sys
import json
import psycopg2
from datetime import datetime, timedelta
import re

class RiskChatbot:
    def __init__(self):
        self.db_url = os.getenv('DATABASE_URL')
        self.conversation_state = {
            'step': 0,
            'data': {},
            'completed': False
        }
        self.steps = [
            'risk_title',
            'risk_description', 
            'category_id',
            'asset_id',
            'threat_source',
            'vulnerability',
            'likelihood_score',
            'impact_score',
            'risk_owner',
            'risk_status',
            'identified_date',
            'next_review_date',
            'existing_controls',
            'risk_treatment',
            'risk_treatment_plan',
            'review_frequency'
        ]
        
    def connect_db(self):
        try:
            return psycopg2.connect(self.db_url)
        except Exception as e:
            print(f"Database connection error: {e}")
            return None
    
    def get_risk_categories(self):
        conn = self.connect_db()
        if not conn:
            return []
        
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT id, category_name FROM risk_categories ORDER BY category_name")
            categories = cursor.fetchall()
            conn.close()
            return categories
        except Exception as e:
            print(f"Error fetching categories: {e}")
            return []
    
    def get_assets(self):
        conn = self.connect_db()
        if not conn:
            return []
        
        try:
            cursor = conn.cursor()
            cursor.execute("SELECT id, asset_name FROM information_assets ORDER BY asset_name")
            assets = cursor.fetchall()
            conn.close()
            return assets
        except Exception as e:
            print(f"Error fetching assets: {e}")
            return []
    
    def validate_input(self, step, value):
        if step == 'risk_title':
            return len(value.strip()) >= 3, "Risk title must be at least 3 characters long"
        elif step == 'risk_description':
            return len(value.strip()) >= 10, "Risk description must be at least 10 characters long"
        elif step == 'category_id':
            try:
                cat_id = int(value)
                categories = self.get_risk_categories()
                valid_ids = [cat[0] for cat in categories]
                return cat_id in valid_ids, f"Please select a valid category ID from: {valid_ids}"
            except ValueError:
                return False, "Please enter a valid number"
        elif step == 'asset_id':
            try:
                asset_id = int(value)
                assets = self.get_assets()
                valid_ids = [asset[0] for asset in assets]
                return asset_id in valid_ids, f"Please select a valid asset ID from: {valid_ids}"
            except ValueError:
                return False, "Please enter a valid number"
        elif step in ['likelihood_score', 'impact_score']:
            try:
                score = int(value)
                return 1 <= score <= 5, "Score must be between 1 and 5"
            except ValueError:
                return False, "Please enter a valid number between 1 and 5"
        elif step == 'risk_owner':
            return len(value.strip()) >= 2, "Risk owner must be at least 2 characters long"
        elif step == 'risk_status':
            valid_statuses = ['Open', 'In Progress', 'Closed', 'Under Review']
            return value in valid_statuses, f"Status must be one of: {', '.join(valid_statuses)}"
        elif step in ['identified_date', 'next_review_date']:
            try:
                datetime.strptime(value, '%Y-%m-%d')
                return True, ""
            except ValueError:
                return False, "Please enter date in YYYY-MM-DD format"
        elif step == 'existing_controls':
            return len(value.strip()) >= 5, "Existing controls description must be at least 5 characters long"
        elif step == 'risk_treatment':
            valid_treatments = ['Accept', 'Mitigate', 'Transfer', 'Avoid']
            return value in valid_treatments, f"Treatment must be one of: {', '.join(valid_treatments)}"
        elif step == 'risk_treatment_plan':
            return len(value.strip()) >= 10, "Treatment plan must be at least 10 characters long"
        elif step == 'review_frequency':
            valid_frequencies = ['Monthly', 'Quarterly', 'Semi-annually', 'Annually']
            return value in valid_frequencies, f"Frequency must be one of: {', '.join(valid_frequencies)}"
        
        return True, ""
    
    def get_step_prompt(self, step):
        prompts = {
            'risk_title': "What is the title of this risk? (e.g., 'Data breach due to weak passwords')",
            'risk_description': "Please provide a detailed description of this risk:",
            'category_id': self.get_category_prompt(),
            'asset_id': self.get_asset_prompt(),
            'threat_source': "What is the threat source? (e.g., 'External hackers', 'Malicious insiders', 'Natural disasters')",
            'vulnerability': "What vulnerability could be exploited? (e.g., 'Weak password policy', 'Unpatched software')",
            'likelihood_score': "What is the likelihood score (1-5)?\n1 = Very Low, 2 = Low, 3 = Medium, 4 = High, 5 = Very High",
            'impact_score': "What is the impact score (1-5)?\n1 = Very Low, 2 = Low, 3 = Medium, 4 = High, 5 = Very High",
            'risk_owner': "Who is the risk owner? (person responsible for managing this risk)",
            'risk_status': "What is the current risk status?\nOptions: Open, In Progress, Closed, Under Review",
            'identified_date': "When was this risk identified? (YYYY-MM-DD format)",
            'next_review_date': "When should this risk be reviewed next? (YYYY-MM-DD format)",
            'existing_controls': "What existing controls are in place to mitigate this risk?",
            'risk_treatment': "What is the risk treatment strategy?\nOptions: Accept, Mitigate, Transfer, Avoid",
            'risk_treatment_plan': "Please describe the risk treatment plan in detail:",
            'review_frequency': "How often should this risk be reviewed?\nOptions: Monthly, Quarterly, Semi-annually, Annually"
        }
        return prompts.get(step, "Please provide the required information:")
    
    def get_category_prompt(self):
        categories = self.get_risk_categories()
        if not categories:
            return "Please enter the risk category ID:"
        
        prompt = "Please select a risk category by entering its ID:\n"
        for cat_id, cat_name in categories:
            prompt += f"{cat_id}: {cat_name}\n"
        return prompt
    
    def get_asset_prompt(self):
        assets = self.get_assets()
        if not assets:
            return "Please enter the asset ID:"
        
        prompt = "Please select an asset by entering its ID:\n"
        for asset_id, asset_name in assets:
            prompt += f"{asset_id}: {asset_name}\n"
        return prompt
    
    def process_message(self, message):
        if self.conversation_state['completed']:
            return {
                'response': "Risk registration completed! Type 'restart' to register another risk.",
                'completed': True,
                'step': len(self.steps),
                'total_steps': len(self.steps)
            }
        
        if message.lower() == 'restart':
            self.conversation_state = {'step': 0, 'data': {}, 'completed': False}
            return {
                'response': "Let's register a new risk! " + self.get_step_prompt(self.steps[0]),
                'completed': False,
                'step': 0,
                'total_steps': len(self.steps)
            }
        
        current_step = self.conversation_state['step']
        
        if current_step >= len(self.steps):
            # Show summary and confirm
            if message.lower() in ['yes', 'y', 'confirm']:
                result = self.save_risk()
                if result['success']:
                    self.conversation_state['completed'] = True
                    return {
                        'response': f"✅ Risk successfully registered with ID: {result['risk_id']}!\n\nType 'restart' to register another risk.",
                        'completed': True,
                        'step': len(self.steps),
                        'total_steps': len(self.steps)
                    }
                else:
                    return {
                        'response': f"❌ Error saving risk: {result['error']}\n\nType 'restart' to try again.",
                        'completed': False,
                        'step': current_step,
                        'total_steps': len(self.steps)
                    }
            elif message.lower() in ['no', 'n', 'cancel']:
                self.conversation_state = {'step': 0, 'data': {}, 'completed': False}
                return {
                    'response': "Risk registration cancelled. Let's start over!\n\n" + self.get_step_prompt(self.steps[0]),
                    'completed': False,
                    'step': 0,
                    'total_steps': len(self.steps)
                }
            else:
                return {
                    'response': self.get_summary() + "\n\nPlease confirm by typing 'yes' or 'no':",
                    'completed': False,
                    'step': current_step,
                    'total_steps': len(self.steps)
                }
        
        step_name = self.steps[current_step]
        is_valid, error_msg = self.validate_input(step_name, message)
        
        if not is_valid:
            return {
                'response': f"❌ {error_msg}\n\n{self.get_step_prompt(step_name)}",
                'completed': False,
                'step': current_step,
                'total_steps': len(self.steps)
            }
        
        # Store the validated input
        if step_name in ['category_id', 'asset_id', 'likelihood_score', 'impact_score']:
            self.conversation_state['data'][step_name] = int(message)
        else:
            self.conversation_state['data'][step_name] = message
        
        self.conversation_state['step'] += 1
        
        if self.conversation_state['step'] >= len(self.steps):
            # Show summary
            return {
                'response': self.get_summary() + "\n\nDo you want to save this risk? (yes/no)",
                'completed': False,
                'step': self.conversation_state['step'],
                'total_steps': len(self.steps)
            }
        else:
            # Move to next step
            next_step = self.steps[self.conversation_state['step']]
            return {
                'response': f"✅ Got it!\n\n{self.get_step_prompt(next_step)}",
                'completed': False,
                'step': self.conversation_state['step'],
                'total_steps': len(self.steps)
            }
    
    def get_summary(self):
        data = self.conversation_state['data']
        
        # Get category and asset names
        categories = self.get_risk_categories()
        assets = self.get_assets()
        
        category_name = "Unknown"
        for cat_id, cat_name in categories:
            if cat_id == data.get('category_id'):
                category_name = cat_name
                break
        
        asset_name = "Unknown"
        for asset_id, name in assets:
            if asset_id == data.get('asset_id'):
                asset_name = name
                break
        
        inherent_risk_score = data.get('likelihood_score', 0) * data.get('impact_score', 0)
        
        summary = f"""
📋 **Risk Summary:**

**Basic Information:**
• Title: {data.get('risk_title', 'N/A')}
• Description: {data.get('risk_description', 'N/A')}
• Category: {category_name}
• Asset: {asset_name}

**Risk Assessment:**
• Threat Source: {data.get('threat_source', 'N/A')}
• Vulnerability: {data.get('vulnerability', 'N/A')}
• Likelihood Score: {data.get('likelihood_score', 'N/A')}/5
• Impact Score: {data.get('impact_score', 'N/A')}/5
• Inherent Risk Score: {inherent_risk_score}

**Management:**
• Risk Owner: {data.get('risk_owner', 'N/A')}
• Status: {data.get('risk_status', 'N/A')}
• Treatment: {data.get('risk_treatment', 'N/A')}
• Review Frequency: {data.get('review_frequency', 'N/A')}

**Dates:**
• Identified: {data.get('identified_date', 'N/A')}
• Next Review: {data.get('next_review_date', 'N/A')}

**Controls & Treatment:**
• Existing Controls: {data.get('existing_controls', 'N/A')}
• Treatment Plan: {data.get('risk_treatment_plan', 'N/A')}
"""
        return summary
    
    def save_risk(self):
        conn = self.connect_db()
        if not conn:
            return {'success': False, 'error': 'Database connection failed'}
        
        try:
            cursor = conn.cursor()
            data = self.conversation_state['data']
            
            inherent_risk_score = data['likelihood_score'] * data['impact_score']
            
            # Insert risk
            insert_query = """
                INSERT INTO risks (
                    risk_title, risk_description, category_id, asset_id,
                    threat_source, vulnerability, likelihood_score, impact_score,
                    inherent_risk_score, risk_owner, risk_status, identified_date,
                    next_review_date, existing_controls, risk_treatment,
                    risk_treatment_plan, review_frequency
                ) VALUES (
                    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                ) RETURNING id, risk_id
            """
            
            cursor.execute(insert_query, (
                data['risk_title'],
                data['risk_description'],
                data['category_id'],
                data['asset_id'],
                data['threat_source'],
                data['vulnerability'],
                data['likelihood_score'],
                data['impact_score'],
                inherent_risk_score,
                data['risk_owner'],
                data['risk_status'],
                data['identified_date'],
                data['next_review_date'],
                data['existing_controls'],
                data['risk_treatment'],
                data['risk_treatment_plan'],
                data['review_frequency']
            ))
            
            result = cursor.fetchone()
            conn.commit()
            conn.close()
            
            return {
                'success': True,
                'risk_id': result[1],  # risk_id (auto-generated)
                'id': result[0]  # database id
            }
            
        except Exception as e:
            conn.rollback()
            conn.close()
            return {'success': False, 'error': str(e)}

def main():
    chatbot = RiskChatbot()
    
    print("🤖 Risk Management Chatbot")
    print("=" * 40)
    print("I'll help you register a new risk in the system.")
    print("Type 'exit' to quit or 'restart' to start over.\n")
    
    # Start conversation
    response = chatbot.process_message("start")
    print(f"Bot: {response['response']}")
    
    while True:
        try:
            user_input = input("\nYou: ").strip()
            
            if user_input.lower() == 'exit':
                print("Goodbye!")
                break
            
            response = chatbot.process_message(user_input)
            print(f"\nBot: {response['response']}")
            
            if response.get('completed'):
                print("\n" + "=" * 40)
                print("Risk registration completed!")
                print("=" * 40)
                
        except KeyboardInterrupt:
            print("\n\nGoodbye!")
            break
        except Exception as e:
            print(f"\nError: {e}")

if __name__ == "__main__":
    main()
