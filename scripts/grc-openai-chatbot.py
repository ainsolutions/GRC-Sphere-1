#!/usr/bin/env python3
"""
GRC OpenAI Chatbot - Advanced conversational AI for GRC data analysis
Integrates with OpenAI GPT models to provide intelligent responses about governance, risk, and compliance data.
"""

import os
import json
import sys
import asyncio
import asyncpg
from openai import OpenAI
from typing import Dict, List, Any, Optional
from datetime import datetime

class GRCOpenAIChatbot:
    def __init__(self):
        self.client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.db_url = os.getenv('DATABASE_URL')
        self.conversation_history = []
        
    async def get_db_connection(self):
        """Create database connection"""
        return await asyncpg.connect(self.db_url)
    
    async def get_context_data(self, query: str) -> Dict[str, Any]:
        """Fetch relevant context data from database based on query intent"""
        conn = await self.get_db_connection()
        context = {}
        
        try:
            # Determine what data to fetch based on query keywords
            query_lower = query.lower()
            
            if any(word in query_lower for word in ['risk', 'iso27001', 'nist', 'threat']):
                # Get risk data
                risks = await conn.fetch("""
                    SELECT status, risk_level, COUNT(*) as count 
                    FROM iso27001_risks 
                    GROUP BY status, risk_level
                    ORDER BY count DESC
                """)
                context['risks'] = [dict(r) for r in risks]
                
                # Get risk summary
                risk_summary = await conn.fetchrow("""
                    SELECT 
                        COUNT(*) as total_risks,
                        COUNT(*) FILTER (WHERE LOWER(status) = 'open') as open_risks,
                        COUNT(*) FILTER (WHERE LOWER(risk_level) = 'high') as high_risks
                    FROM iso27001_risks
                """)
                context['risk_summary'] = dict(risk_summary) if risk_summary else {}
            
            if any(word in query_lower for word in ['incident', 'security', 'breach']):
                # Get incident data
                incidents = await conn.fetch("""
                    SELECT status, severity, incident_type, COUNT(*) as count 
                    FROM incidents 
                    GROUP BY status, severity, incident_type
                    ORDER BY count DESC
                """)
                context['incidents'] = [dict(i) for i in incidents]
                
                incident_summary = await conn.fetchrow("""
                    SELECT 
                        COUNT(*) as total_incidents,
                        COUNT(*) FILTER (WHERE LOWER(status) = 'open') as open_incidents,
                        COUNT(*) FILTER (WHERE LOWER(severity) = 'critical') as critical_incidents
                    FROM incidents
                """)
                context['incident_summary'] = dict(incident_summary) if incident_summary else {}
            
            if any(word in query_lower for word in ['vulnerability', 'vuln', 'cve']):
                # Get vulnerability data
                vulns = await conn.fetch("""
                    SELECT status, severity, category, COUNT(*) as count 
                    FROM vulnerabilities 
                    GROUP BY status, severity, category
                    ORDER BY count DESC
                """)
                context['vulnerabilities'] = [dict(v) for v in vulns]
                
                vuln_summary = await conn.fetchrow("""
                    SELECT 
                        COUNT(*) as total_vulnerabilities,
                        COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'Closed') as overdue_vulnerabilities,
                        COUNT(*) FILTER (WHERE LOWER(severity) = 'critical') as critical_vulnerabilities
                    FROM vulnerabilities
                """)
                context['vulnerability_summary'] = dict(vuln_summary) if vuln_summary else {}
            
            if any(word in query_lower for word in ['assessment', 'audit', 'compliance']):
                # Get assessment data
                assessments = await conn.fetch("""
                    SELECT status, priority, progress, COUNT(*) as count 
                    FROM assessments 
                    GROUP BY status, priority, progress
                    ORDER BY count DESC
                """)
                context['assessments'] = [dict(a) for a in assessments]
                
                assessment_summary = await conn.fetchrow("""
                    SELECT 
                        COUNT(*) as total_assessments,
                        COUNT(*) FILTER (WHERE LOWER(status) = 'in progress') as in_progress_assessments,
                        AVG(progress) as average_progress
                    FROM assessments
                """)
                context['assessment_summary'] = dict(assessment_summary) if assessment_summary else {}
            
            if any(word in query_lower for word in ['vendor', 'third party', 'supplier']):
                # Get third party risk data
                third_party = await conn.fetch("""
                    SELECT status, risk_level, overall_score, COUNT(*) as count 
                    FROM third_party_risk_assessments 
                    GROUP BY status, risk_level, overall_score
                    ORDER BY count DESC
                """)
                context['third_party_risks'] = [dict(t) for t in third_party]
                
                vendors = await conn.fetch("""
                    SELECT vendor_type, COUNT(*) as count 
                    FROM vendors 
                    GROUP BY vendor_type
                    ORDER BY count DESC
                """)
                context['vendors'] = [dict(v) for v in vendors]
            
            if any(word in query_lower for word in ['asset', 'inventory']):
                # Get asset data
                assets = await conn.fetch("""
                    SELECT asset_type, criticality, COUNT(*) as count 
                    FROM assets 
                    GROUP BY asset_type, criticality
                    ORDER BY count DESC
                """)
                context['assets'] = [dict(a) for a in assets]
                
                asset_summary = await conn.fetchrow("""
                    SELECT 
                        COUNT(*) as total_assets,
                        COUNT(*) FILTER (WHERE LOWER(criticality) = 'critical') as critical_assets
                    FROM assets
                """)
                context['asset_summary'] = dict(asset_summary) if asset_summary else {}
            
            if any(word in query_lower for word in ['finding', 'gap', 'issue']):
                # Get findings data
                findings = await conn.fetch("""
                    SELECT status, severity, COUNT(*) as count 
                    FROM findings 
                    GROUP BY status, severity
                    ORDER BY count DESC
                """)
                context['findings'] = [dict(f) for f in findings]
                
                finding_summary = await conn.fetchrow("""
                    SELECT 
                        COUNT(*) as total_findings,
                        COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'Closed') as overdue_findings,
                        COUNT(*) FILTER (WHERE LOWER(severity) = 'high') as high_findings
                    FROM findings
                """)
                context['finding_summary'] = dict(finding_summary) if finding_summary else {}
            
        except Exception as e:
            print(f"Error fetching context data: {e}")
            context['error'] = str(e)
        finally:
            await conn.close()
        
        return context
    
    def build_system_prompt(self, context: Dict[str, Any]) -> str:
        """Build system prompt with current GRC data context"""
        base_prompt = """You are a GRC (Governance, Risk, and Compliance) AI assistant with expertise in cybersecurity, risk management, and compliance frameworks including ISO27001, NIST CSF, HIPAA, and others.

You have access to real-time data from a comprehensive GRC system. Use this data to provide accurate, specific, and actionable insights.

Key capabilities:
- Risk analysis and reporting
- Incident management insights
- Vulnerability assessment guidance
- Compliance status reporting
- Asset management information
- Third-party risk evaluation
- Assessment and audit support

Always provide specific numbers and data when available. Be concise but comprehensive in your responses.

Current GRC Data Context:
"""
        
        # Add context data to prompt
        if context:
            base_prompt += f"\n{json.dumps(context, indent=2)}"
        
        base_prompt += """

Guidelines:
- Provide specific metrics and counts when available
- Explain the significance of the data
- Offer actionable recommendations when appropriate
- Use professional GRC terminology
- Be concise but thorough
- If asked about trends, provide context about what the numbers mean
"""
        
        return base_prompt
    
    async def generate_response(self, user_query: str) -> str:
        """Generate AI response using OpenAI with GRC context"""
        try:
            # Get relevant context data
            context = await self.get_context_data(user_query)
            
            # Build system prompt with context
            system_prompt = self.build_system_prompt(context)
            
            # Prepare messages for OpenAI
            messages = [
                {"role": "system", "content": system_prompt}
            ]
            
            # Add conversation history (last 5 exchanges)
            messages.extend(self.conversation_history[-10:])
            
            # Add current user query
            messages.append({"role": "user", "content": user_query})
            
            # Generate response using OpenAI
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=messages,
                max_tokens=1000,
                temperature=0.3,  # Lower temperature for more consistent, factual responses
            )
            
            ai_response = response.choices[0].message.content
            
            # Update conversation history
            self.conversation_history.append({"role": "user", "content": user_query})
            self.conversation_history.append({"role": "assistant", "content": ai_response})
            
            # Keep only last 10 messages to manage context length
            if len(self.conversation_history) > 10:
                self.conversation_history = self.conversation_history[-10:]
            
            return ai_response
            
        except Exception as e:
            print(f"Error generating AI response: {e}")
            return f"I apologize, but I encountered an error while processing your request: {str(e)}. Please try again or contact support if the issue persists."
    
    def clear_history(self):
        """Clear conversation history"""
        self.conversation_history = []

async def main():
    """Main function to handle command line usage"""
    if len(sys.argv) < 2:
        print("Usage: python grc-openai-chatbot.py 'your question here'")
        sys.exit(1)
    
    query = sys.argv[1]
    chatbot = GRCOpenAIChatbot()
    
    try:
        response = await chatbot.generate_response(query)
        print(json.dumps({"response": response}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    asyncio.run(main())
