#!/usr/bin/env python3
"""
GRC AI Analyst - Advanced AI-Powered Risk Analysis
Generates comprehensive GRC insights using OpenAI GPT-4
"""

import os
import sys
import json
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('grc_ai_analyst.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

try:
    import openai
    import psycopg2
    from psycopg2.extras import RealDictCursor
    import pandas as pd
    import numpy as np
except ImportError as e:
    logger.error(f"Required package not installed: {e}")
    logger.error("Please run: pip install -r requirements.txt")
    sys.exit(1)

class GRCAIAnalyst:
    """Advanced AI-powered GRC analysis engine"""
    
    def __init__(self):
        """Initialize the AI analyst with API keys and database connection"""
        self.openai_client = None
        self.db_connection = None
        self.setup_connections()
    
    def setup_connections(self):
        """Setup OpenAI and database connections"""
        # Setup OpenAI
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            logger.error("OPENAI_API_KEY environment variable not set")
            sys.exit(1)
        
        self.openai_client = openai.OpenAI(api_key=api_key)
        logger.info("OpenAI client initialized successfully")
        
        # Setup database connection
        database_url = os.getenv('DATABASE_URL')
        if not database_url:
            logger.error("DATABASE_URL environment variable not set")
            sys.exit(1)
        
        try:
            self.db_connection = psycopg2.connect(database_url)
            logger.info("Database connection established successfully")
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            sys.exit(1)
    
    def fetch_grc_data(self) -> Dict:
        """Fetch comprehensive GRC data from database"""
        logger.info("Fetching GRC data from database...")
        
        data = {}
        
        try:
            with self.db_connection.cursor(cursor_factory=RealDictCursor) as cursor:
                # Fetch risks data
                cursor.execute("""
                    SELECT risk_id, title, description, likelihood, impact, 
                           risk_score, status, category, created_at
                    FROM risks 
                    ORDER BY risk_score DESC 
                    LIMIT 100
                """)
                data['risks'] = cursor.fetchall()
                
                # Fetch vulnerabilities data
                cursor.execute("""
                    SELECT id, title, severity, cvss_score, status, 
                           description, affected_systems, created_at
                    FROM vulnerabilities 
                    ORDER BY cvss_score DESC 
                    LIMIT 100
                """)
                data['vulnerabilities'] = cursor.fetchall()
                
                # Fetch incidents data
                cursor.execute("""
                    SELECT id, title, severity, status, category, 
                           description, impact, created_at, resolved_at
                    FROM incidents 
                    ORDER BY created_at DESC 
                    LIMIT 100
                """)
                data['incidents'] = cursor.fetchall()
                
                # Fetch assets data
                cursor.execute("""
                    SELECT id, name, type, criticality, owner, 
                           location, status, created_at
                    FROM assets 
                    ORDER BY criticality DESC 
                    LIMIT 100
                """)
                data['assets'] = cursor.fetchall()
                
                # Fetch compliance data
                cursor.execute("""
                    SELECT id, framework, requirement, status, 
                           compliance_score, last_assessment, notes
                    FROM compliance_requirements 
                    ORDER BY compliance_score ASC 
                    LIMIT 100
                """)
                data['compliance'] = cursor.fetchall()
                
        except Exception as e:
            logger.error(f"Error fetching GRC data: {e}")
            return {}
        
        logger.info(f"Fetched GRC data: {len(data.get('risks', []))} risks, "
                   f"{len(data.get('vulnerabilities', []))} vulnerabilities, "
                   f"{len(data.get('incidents', []))} incidents")
        
        return data
    
    def generate_ai_analysis(self, analysis_type: str, grc_data: Dict) -> str:
        """Generate AI-powered analysis using OpenAI GPT-4"""
        logger.info(f"Generating AI analysis for: {analysis_type}")
        
        # Define analysis prompts
        prompts = {
            'risk_exposure': """
            You are a Chief Risk Officer (CRO) analyzing organizational risk exposure. 
            Based on the provided GRC data, generate a comprehensive executive risk assessment report.
            
            Focus on:
            1. Overall risk posture and maturity
            2. Critical risk exposures requiring immediate attention
            3. Risk correlation and interdependencies
            4. Strategic risk priorities and resource allocation
            5. Board-level recommendations with business impact
            
            Provide specific metrics, timelines, and actionable recommendations.
            Format as an executive briefing suitable for C-suite presentation.
            """,
            
            'threat_landscape': """
            You are a Chief Information Security Officer (CISO) analyzing the cybersecurity threat landscape.
            Based on the provided security data, generate a comprehensive threat intelligence report.
            
            Focus on:
            1. Current threat environment and attack trends
            2. Sector-specific threats and attack vectors
            3. Vulnerability exploitation patterns
            4. Defensive strategy recommendations
            5. Incident response and recovery capabilities
            
            Provide tactical and strategic security recommendations with implementation timelines.
            Format as a security briefing for executive leadership.
            """,
            
            'vulnerability_remediation': """
            You are a Security Architect analyzing vulnerability management and remediation strategies.
            Based on the vulnerability data, generate a comprehensive remediation plan.
            
            Focus on:
            1. Risk-based vulnerability prioritization
            2. Remediation timeline and resource requirements
            3. Automated vs manual remediation strategies
            4. Patch management optimization
            5. Continuous vulnerability management
            
            Provide specific remediation steps, timelines, and success metrics.
            Format as a technical implementation plan.
            """,
            
            'incident_patterns': """
            You are an Incident Response Manager analyzing incident patterns and response effectiveness.
            Based on the incident data, generate a comprehensive incident analysis report.
            
            Focus on:
            1. Incident trend analysis and patterns
            2. Response time and resolution effectiveness
            3. Root cause analysis and prevention opportunities
            4. Process improvement recommendations
            5. Resource optimization and training needs
            
            Provide specific metrics, improvement recommendations, and implementation plans.
            Format as an operational improvement report.
            """,
            
            'compliance_remediation': """
            You are a Compliance Officer analyzing regulatory compliance posture and remediation needs.
            Based on the compliance data, generate a comprehensive compliance assessment report.
            
            Focus on:
            1. Overall compliance posture across frameworks
            2. Critical compliance gaps and remediation priorities
            3. Regulatory risk exposure and mitigation strategies
            4. Compliance program optimization
            5. Audit readiness and continuous monitoring
            
            Provide specific compliance scores, remediation timelines, and regulatory risk assessments.
            Format as a compliance briefing for executive leadership.
            """,
            
            'integrated_grc': """
            You are a GRC Director providing integrated governance, risk, and compliance analysis.
            Based on all provided GRC data, generate a comprehensive organizational risk posture assessment.
            
            Focus on:
            1. Integrated risk and compliance maturity assessment
            2. Cross-domain risk correlations and dependencies
            3. Governance effectiveness and oversight gaps
            4. Strategic GRC program recommendations
            5. Technology and process optimization opportunities
            
            Provide holistic recommendations for GRC program enhancement and organizational resilience.
            Format as a strategic GRC assessment for board presentation.
            """
        }
        
        if analysis_type not in prompts:
            logger.error(f"Unknown analysis type: {analysis_type}")
            return ""
        
        # Prepare data summary for AI analysis
        data_summary = self.prepare_data_summary(grc_data)
        
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": prompts[analysis_type]},
                    {"role": "user", "content": f"GRC Data Summary:\n{data_summary}\n\nPlease provide a comprehensive analysis based on this data."}
                ],
                max_tokens=4000,
                temperature=0.7
            )
            
            analysis_content = response.choices[0].message.content
            logger.info(f"AI analysis generated successfully for {analysis_type}")
            return analysis_content
            
        except Exception as e:
            logger.error(f"Error generating AI analysis: {e}")
            return f"Error generating analysis: {str(e)}"
    
    def prepare_data_summary(self, grc_data: Dict) -> str:
        """Prepare a concise data summary for AI analysis"""
        summary_parts = []
        
        # Risk summary
        if 'risks' in grc_data and grc_data['risks']:
            risks = grc_data['risks']
            high_risks = [r for r in risks if r.get('risk_score', 0) >= 7]
            summary_parts.append(f"RISKS: {len(risks)} total, {len(high_risks)} high-risk items")
            
            # Top risk categories
            categories = {}
            for risk in risks:
                cat = risk.get('category', 'Unknown')
                categories[cat] = categories.get(cat, 0) + 1
            top_categories = sorted(categories.items(), key=lambda x: x[1], reverse=True)[:3]
            summary_parts.append(f"Top risk categories: {', '.join([f'{cat} ({count})' for cat, count in top_categories])}")
        
        # Vulnerability summary
        if 'vulnerabilities' in grc_data and grc_data['vulnerabilities']:
            vulns = grc_data['vulnerabilities']
            critical_vulns = [v for v in vulns if v.get('severity', '').lower() == 'critical']
            high_vulns = [v for v in vulns if v.get('severity', '').lower() == 'high']
            summary_parts.append(f"VULNERABILITIES: {len(vulns)} total, {len(critical_vulns)} critical, {len(high_vulns)} high")
        
        # Incident summary
        if 'incidents' in grc_data and grc_data['incidents']:
            incidents = grc_data['incidents']
            open_incidents = [i for i in incidents if i.get('status', '').lower() in ['open', 'investigating']]
            summary_parts.append(f"INCIDENTS: {len(incidents)} total, {len(open_incidents)} open")
        
        # Asset summary
        if 'assets' in grc_data and grc_data['assets']:
            assets = grc_data['assets']
            critical_assets = [a for a in assets if a.get('criticality', '').lower() == 'critical']
            summary_parts.append(f"ASSETS: {len(assets)} total, {len(critical_assets)} critical")
        
        # Compliance summary
        if 'compliance' in grc_data and grc_data['compliance']:
            compliance = grc_data['compliance']
            non_compliant = [c for c in compliance if c.get('status', '').lower() in ['non-compliant', 'partial']]
            avg_score = np.mean([c.get('compliance_score', 0) for c in compliance if c.get('compliance_score')])
            summary_parts.append(f"COMPLIANCE: {len(compliance)} requirements, {len(non_compliant)} non-compliant, avg score: {avg_score:.1f}%")
        
        return "\n".join(summary_parts)
    
    def save_analysis_result(self, analysis_type: str, analysis_content: str) -> bool:
        """Save analysis result to database"""
        logger.info(f"Saving analysis result for: {analysis_type}")
        
        try:
            with self.db_connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO ai_analysis_results (analysis_type, analysis_content)
                    VALUES (%s, %s)
                """, (analysis_type, analysis_content))
                
                self.db_connection.commit()
                logger.info(f"Analysis result saved successfully for {analysis_type}")
                return True
                
        except Exception as e:
            logger.error(f"Error saving analysis result: {e}")
            self.db_connection.rollback()
            return False
    
    def run_comprehensive_analysis(self) -> Dict:
        """Run comprehensive AI analysis across all GRC domains"""
        logger.info("Starting comprehensive GRC AI analysis...")
        
        # Fetch GRC data
        grc_data = self.fetch_grc_data()
        if not grc_data:
            logger.error("No GRC data available for analysis")
            return {"success": False, "error": "No data available"}
        
        # Define analysis types
        analysis_types = [
            'risk_exposure',
            'threat_landscape', 
            'vulnerability_remediation',
            'incident_patterns',
            'compliance_remediation',
            'integrated_grc'
        ]
        
        results = {}
        successful_analyses = 0
        
        for analysis_type in analysis_types:
            logger.info(f"Running {analysis_type} analysis...")
            
            try:
                # Generate AI analysis
                analysis_content = self.generate_ai_analysis(analysis_type, grc_data)
                
                if analysis_content:
                    # Save to database
                    if self.save_analysis_result(analysis_type, analysis_content):
                        results[analysis_type] = {
                            "success": True,
                            "content_length": len(analysis_content)
                        }
                        successful_analyses += 1
                    else:
                        results[analysis_type] = {
                            "success": False,
                            "error": "Failed to save to database"
                        }
                else:
                    results[analysis_type] = {
                        "success": False,
                        "error": "Failed to generate analysis content"
                    }
                    
            except Exception as e:
                logger.error(f"Error in {analysis_type} analysis: {e}")
                results[analysis_type] = {
                    "success": False,
                    "error": str(e)
                }
        
        logger.info(f"Comprehensive analysis completed. {successful_analyses}/{len(analysis_types)} analyses successful.")
        
        return {
            "success": successful_analyses > 0,
            "total_analyses": len(analysis_types),
            "successful_analyses": successful_analyses,
            "results": results
        }
    
    def cleanup(self):
        """Cleanup database connections"""
        if self.db_connection:
            self.db_connection.close()
            logger.info("Database connection closed")

def main():
    """Main execution function"""
    logger.info("GRC AI Analyst starting...")
    
    analyst = GRCAIAnalyst()
    
    try:
        # Run comprehensive analysis
        results = analyst.run_comprehensive_analysis()
        
        # Print results summary
        print("\n" + "="*60)
        print("GRC AI ANALYSIS RESULTS SUMMARY")
        print("="*60)
        print(f"Total Analyses: {results.get('total_analyses', 0)}")
        print(f"Successful: {results.get('successful_analyses', 0)}")
        print(f"Overall Success: {'✅ YES' if results.get('success', False) else '❌ NO'}")
        
        if 'results' in results:
            print("\nDetailed Results:")
            for analysis_type, result in results['results'].items():
                status = "✅ SUCCESS" if result.get('success', False) else "❌ FAILED"
                print(f"  {analysis_type}: {status}")
                if not result.get('success', False) and 'error' in result:
                    print(f"    Error: {result['error']}")
        
        print("="*60)
        
        return 0 if results.get('success', False) else 1
        
    except Exception as e:
        logger.error(f"Fatal error in main execution: {e}")
        return 1
        
    finally:
        analyst.cleanup()

if __name__ == "__main__":
    sys.exit(main())
