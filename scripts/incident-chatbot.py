import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class IncidentChatbot:
    """
    AI Chatbot for incident reporting with conversational data collection.
    Handles step-by-step gathering of incident information for database insertion.
    """
    
    def __init__(self):
        self.conversation_state = {
            'step': 'greeting',
            'data': {},
            'attempts': 0,
            'max_attempts': 3
        }
        
        self.incident_types = [
            "Security Breach",
            "Data Loss", 
            "System Failure",
            "Malware",
            "Phishing",
            "Unauthorized Access",
            "Other"
        ]
        
        self.severity_levels = ["Low", "Medium", "High", "Critical"]
        
        self.conversation_flow = [
            'greeting',
            'title',
            'description',
            'type',
            'severity',
            'reporter',
            'assignee',
            'detection_date',
            'confirmation',
            'submission'
        ]
        
    def generate_incident_id(self) -> str:
        """Generate a unique incident ID"""
        timestamp = str(int(datetime.now().timestamp()))[-6:]
        return f"INC-{timestamp}"
    
    def start_conversation(self) -> str:
        """Initialize the conversation"""
        incident_id = self.generate_incident_id()
        self.conversation_state['data']['incident_id'] = incident_id
        
        return f"""👋 Hello! I'm here to help you report a security incident.

I've generated incident ID: **{incident_id}** for this report.

Let's start by getting some basic information. What would you like to title this incident?"""

    def process_user_input(self, user_input: str) -> Tuple[str, bool]:
        """
        Process user input and return bot response and completion status
        Returns: (response_message, is_complete)
        """
        try:
            current_step = self.conversation_state['step']
            user_input = user_input.strip()
            
            if not user_input:
                return "Please provide a response to continue.", False
            
            # Route to appropriate handler based on current step
            if current_step == 'greeting':
                return self._handle_title_input(user_input)
            elif current_step == 'title':
                return self._handle_description_input(user_input)
            elif current_step == 'description':
                return self._handle_type_input(user_input)
            elif current_step == 'type':
                return self._handle_severity_input(user_input)
            elif current_step == 'severity':
                return self._handle_reporter_input(user_input)
            elif current_step == 'reporter':
                return self._handle_assignee_input(user_input)
            elif current_step == 'assignee':
                return self._handle_detection_date_input(user_input)
            elif current_step == 'detection_date':
                return self._handle_confirmation_input(user_input)
            elif current_step == 'confirmation':
                return self._handle_submission_input(user_input)
            else:
                return "I'm not sure how to help with that. Let's start over.", False
                
        except Exception as e:
            logger.error(f"Error processing user input: {e}")
            return "I encountered an error. Let's try again.", False
    
    def _handle_title_input(self, user_input: str) -> Tuple[str, bool]:
        """Handle incident title input"""
        if len(user_input) < 5:
            return "Please provide a more descriptive title (at least 5 characters).", False
        
        self.conversation_state['data']['incident_title'] = user_input
        self.conversation_state['step'] = 'title'
        
        return f"""Great! I've recorded the title as: **{user_input}**

Now, please provide a detailed description of what happened. Include as much relevant information as possible.""", False
    
    def _handle_description_input(self, user_input: str) -> Tuple[str, bool]:
        """Handle incident description input"""
        if len(user_input) < 10:
            return "Please provide a more detailed description (at least 10 characters).", False
        
        self.conversation_state['data']['incident_description'] = user_input
        self.conversation_state['step'] = 'description'
        
        type_options = '\n'.join([f"{i+1}. {t}" for i, t in enumerate(self.incident_types)])
        
        return f"""Perfect! I've recorded the description.

What type of incident is this? Please choose a number or type the incident type:

{type_options}""", False
    
    def _handle_type_input(self, user_input: str) -> Tuple[str, bool]:
        """Handle incident type input"""
        selected_type = self._parse_incident_type(user_input)
        
        if not selected_type:
            type_options = '\n'.join([f"{i+1}. {t}" for i, t in enumerate(self.incident_types)])
            return f"""I didn't recognize that incident type. Please choose from the list by number (1-{len(self.incident_types)}) or type one of the exact options:

{type_options}""", False
        
        self.conversation_state['data']['incident_type'] = selected_type
        self.conversation_state['step'] = 'type'
        
        severity_options = '\n'.join([f"{i+1}. {s}" for i, s in enumerate(self.severity_levels)])
        
        return f"""Got it! Incident type: **{selected_type}**

What's the severity level of this incident?

{severity_options}""", False
    
    def _handle_severity_input(self, user_input: str) -> Tuple[str, bool]:
        """Handle severity level input"""
        selected_severity = self._parse_severity_level(user_input)
        
        if not selected_severity:
            severity_options = '\n'.join([f"{i+1}. {s}" for i, s in enumerate(self.severity_levels)])
            return f"""Please choose a valid severity level by number (1-{len(self.severity_levels)}) or type: {', '.join(self.severity_levels)}

{severity_options}""", False
        
        self.conversation_state['data']['severity'] = selected_severity
        self.conversation_state['step'] = 'severity'
        
        return f"""Severity level set to: **{selected_severity}**

Who is reporting this incident? Please provide the reporter's name.""", False
    
    def _handle_reporter_input(self, user_input: str) -> Tuple[str, bool]:
        """Handle reporter name input"""
        if len(user_input) < 2:
            return "Please provide a valid reporter name.", False
        
        self.conversation_state['data']['reported_by'] = user_input
        self.conversation_state['step'] = 'reporter'
        
        return f"""Reporter recorded as: **{user_input}**

Who should this incident be assigned to? Please provide the assignee's name.""", False
    
    def _handle_assignee_input(self, user_input: str) -> Tuple[str, bool]:
        """Handle assignee name input"""
        if len(user_input) < 2:
            return "Please provide a valid assignee name.", False
        
        self.conversation_state['data']['assigned_to'] = user_input
        self.conversation_state['step'] = 'assignee'
        
        return f"""Assigned to: **{user_input}**

When was this incident first detected? Please provide the date and time (e.g., "2024-01-15 14:30" or "today at 2:30 PM"). You can also type "unknown" if not sure.""", False
    
    def _handle_detection_date_input(self, user_input: str) -> Tuple[str, bool]:
        """Handle detection date input"""
        detection_date = self._parse_datetime(user_input)
        
        if user_input.lower() != "unknown" and not detection_date:
            return """I couldn't parse that date format. Please try again with a format like "2024-01-15 14:30", "today at 2:30 PM", or "unknown".""", False
        
        if detection_date:
            self.conversation_state['data']['detected_date'] = detection_date.isoformat()
        
        self.conversation_state['data']['reported_date'] = datetime.now().isoformat()
        self.conversation_state['step'] = 'detection_date'
        
        # Generate summary for confirmation
        summary = self._generate_summary()
        
        return f"""{summary}

Is this information correct? Type "yes" to submit the incident or "no" to start over.""", False
    
    def _handle_confirmation_input(self, user_input: str) -> Tuple[str, bool]:
        """Handle confirmation input"""
        user_input_lower = user_input.lower()
        
        if 'yes' in user_input_lower or user_input_lower == 'y':
            self.conversation_state['step'] = 'confirmation'
            return self._submit_incident()
        elif 'no' in user_input_lower or user_input_lower == 'n':
            self._reset_conversation()
            return "No problem! Let's start over. What would you like to title this incident?", False
        else:
            return 'Please type "yes" to submit the incident or "no" to start over.', False
    
    def _handle_submission_input(self, user_input: str) -> Tuple[str, bool]:
        """Handle post-submission input"""
        return "Incident has been submitted successfully! You can close this chat or start a new incident report.", True
    
    def _parse_incident_type(self, user_input: str) -> Optional[str]:
        """Parse and validate incident type input"""
        # Check if input is a number
        try:
            num_input = int(user_input)
            if 1 <= num_input <= len(self.incident_types):
                return self.incident_types[num_input - 1]
        except ValueError:
            pass
        
        # Try to match input to existing types
        user_input_lower = user_input.lower()
        for incident_type in self.incident_types:
            if (incident_type.lower() in user_input_lower or 
                user_input_lower in incident_type.lower() or
                incident_type.lower() == user_input_lower):
                return incident_type
        
        return None
    
    def _parse_severity_level(self, user_input: str) -> Optional[str]:
        """Parse and validate severity level input"""
        # Check if input is a number
        try:
            num_input = int(user_input)
            if 1 <= num_input <= len(self.severity_levels):
                return self.severity_levels[num_input - 1]
        except ValueError:
            pass
        
        # Try to match input to existing severity levels
        user_input_lower = user_input.lower()
        for severity in self.severity_levels:
            if severity.lower() == user_input_lower:
                return severity
        
        return None
    
    def _parse_datetime(self, user_input: str) -> Optional[datetime]:
        """Parse datetime input with various formats"""
        user_input_lower = user_input.lower().strip()
        
        if user_input_lower == "unknown":
            return None
        
        try:
            # Handle "today" variations
            if "today" in user_input_lower:
                today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
                
                # Extract time if provided
                time_match = re.search(r'(\d{1,2}):(\d{2})\s*(am|pm)?', user_input_lower)
                if time_match:
                    hours = int(time_match.group(1))
                    minutes = int(time_match.group(2))
                    ampm = time_match.group(3)
                    
                    if ampm == "pm" and hours != 12:
                        hours += 12
                    elif ampm == "am" and hours == 12:
                        hours = 0
                    
                    return today.replace(hour=hours, minute=minutes)
                else:
                    return today
            
            # Handle "yesterday" variations
            elif "yesterday" in user_input_lower:
                yesterday = datetime.now() - timedelta(days=1)
                return yesterday.replace(hour=0, minute=0, second=0, microsecond=0)
            
            # Try standard datetime parsing
            else:
                # Common formats to try
                formats = [
                    "%Y-%m-%d %H:%M",
                    "%Y-%m-%d %H:%M:%S",
                    "%m/%d/%Y %H:%M",
                    "%m/%d/%Y",
                    "%Y-%m-%d",
                    "%d/%m/%Y %H:%M",
                    "%d/%m/%Y"
                ]
                
                for fmt in formats:
                    try:
                        return datetime.strptime(user_input, fmt)
                    except ValueError:
                        continue
                
                # If no format matches, try parsing with dateutil if available
                try:
                    from dateutil import parser
                    return parser.parse(user_input)
                except (ImportError, ValueError):
                    pass
        
        except Exception as e:
            logger.error(f"Error parsing datetime: {e}")
        
        return None
    
    def _generate_summary(self) -> str:
        """Generate incident summary for confirmation"""
        data = self.conversation_state['data']
        
        detection_date_str = "Unknown"
        if 'detected_date' in data:
            try:
                detection_date = datetime.fromisoformat(data['detected_date'])
                detection_date_str = detection_date.strftime("%Y-%m-%d %H:%M")
            except:
                detection_date_str = "Unknown"
        
        return f"""**Incident Summary:**
• **ID:** {data.get('incident_id', 'N/A')}
• **Title:** {data.get('incident_title', 'N/A')}
• **Type:** {data.get('incident_type', 'N/A')}
• **Severity:** {data.get('severity', 'N/A')}
• **Reporter:** {data.get('reported_by', 'N/A')}
• **Assigned to:** {data.get('assigned_to', 'N/A')}
• **Detection Date:** {detection_date_str}
• **Description:** {data.get('incident_description', 'N/A')}"""
    
    def _submit_incident(self) -> Tuple[str, bool]:
        """Submit the incident (placeholder for actual database submission)"""
        try:
            # In a real implementation, this would call the database API
            incident_data = self.conversation_state['data']
            incident_data['status'] = 'Open'
            
            # Log the incident data for debugging
            logger.info(f"Submitting incident: {json.dumps(incident_data, indent=2)}")
            
            # Simulate successful submission
            incident_id = incident_data.get('incident_id', 'Unknown')
            assignee = incident_data.get('assigned_to', 'Unknown')
            
            return f"""✅ **Incident successfully created!**

Incident ID: **{incident_id}**

The incident has been logged in the system and assigned to {assignee}. You can now close this chat or start reporting another incident.""", True
            
        except Exception as e:
            logger.error(f"Error submitting incident: {e}")
            return f"""❌ **Error creating incident**

There was a problem submitting your incident. Please try again or use the manual form. Error: {str(e)}""", False
    
    def _reset_conversation(self):
        """Reset conversation state for new incident"""
        self.conversation_state = {
            'step': 'greeting',
            'data': {},
            'attempts': 0,
            'max_attempts': 3
        }
    
    def get_conversation_progress(self) -> Dict[str, Any]:
        """Get current conversation progress"""
        current_step_index = self.conversation_flow.index(self.conversation_state['step'])
        progress_percentage = (current_step_index / len(self.conversation_flow)) * 100
        
        return {
            'current_step': self.conversation_state['step'],
            'step_number': current_step_index + 1,
            'total_steps': len(self.conversation_flow),
            'progress_percentage': progress_percentage,
            'collected_data': self.conversation_state['data']
        }
    
    def export_incident_data(self) -> Dict[str, Any]:
        """Export collected incident data for database insertion"""
        return {
            **self.conversation_state['data'],
            'created_via': 'chatbot',
            'created_at': datetime.now().isoformat()
        }

# Example usage and testing
if __name__ == "__main__":
    # Initialize chatbot
    chatbot = IncidentChatbot()
    
    print("=== Incident Reporting Chatbot Test ===")
    print(chatbot.start_conversation())
    
    # Simulate conversation flow
    test_inputs = [
        "Unauthorized database access detected",
        "Someone accessed our customer database without authorization. Multiple failed login attempts were detected before successful breach.",
        "1",  # Security Breach
        "3",  # High
        "Security Team",
        "CISO",
        "today at 14:30",
        "yes"
    ]
    
    for i, user_input in enumerate(test_inputs):
        print(f"\n--- Step {i+1} ---")
        print(f"User: {user_input}")
        
        response, is_complete = chatbot.process_user_input(user_input)
        print(f"Bot: {response}")
        
        if is_complete:
            print("\n=== Conversation Complete ===")
            print("Final incident data:")
            print(json.dumps(chatbot.export_incident_data(), indent=2))
            break
        
        # Show progress
        progress = chatbot.get_conversation_progress()
        print(f"Progress: {progress['step_number']}/{progress['total_steps']} ({progress['progress_percentage']:.1f}%)")
