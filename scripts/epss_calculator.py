#!/usr/bin/env python3
"""
EPSS Score Calculator using AI/ML
Calculates Exploit Prediction Scoring System (EPSS) based on multiple risk factors
"""

import os
import sys
import json
import psycopg2
from psycopg2.extras import RealDictCursor
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
import logging
from datetime import datetime
from typing import Dict, List, Any, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Weighted percentages for different risk factors
WEIGHTS = {
    'incidents': 0.30,      # 30%
    'vulnerabilities': 0.20, # 20%
    'findings': 0.20,       # 20%
    'third_party_gaps': 0.10, # 10%
    'open_risks': 0.20      # 20%
}

class EPSSCalculator:
    """EPSS Score Calculator using multi-factor analysis"""
    
    def __init__(self, db_config: Optional[Dict[str, str]] = None):
        """Initialize the calculator with database configuration"""
        if db_config is None:
            db_config = {
                'host': os.getenv('DB_HOST', 'localhost'),
                'port': os.getenv('DB_PORT', '5432'),
                'database': os.getenv('DB_NAME', 'postgres'),
                'user': os.getenv('DB_USER', 'postgres'),
                'password': os.getenv('DB_PASSWORD', '')
            }
        self.db_config = db_config
        self.conn = None
        self.scaler = StandardScaler()
        
    def connect(self):
        """Establish database connection"""
        try:
            self.conn = psycopg2.connect(**self.db_config, cursor_factory=RealDictCursor)
            logger.info("Database connection established")
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            raise
            
    def disconnect(self):
        """Close database connection"""
        if self.conn:
            self.conn.close()
            logger.info("Database connection closed")
            
    def get_vulnerability_data(self, vulnerability_id: int) -> Optional[Dict[str, Any]]:
        """Fetch vulnerability details"""
        try:
            with self.conn.cursor() as cur:
                cur.execute("""
                    SELECT id, name, cve_id, severity, assets, 
                           created_at, updated_at, cvss_score
                    FROM vulnerabilities 
                    WHERE id = %s
                """, (vulnerability_id,))
                return cur.fetchone()
        except Exception as e:
            logger.error(f"Error fetching vulnerability data: {e}")
            return None
            
    def extract_assets(self, assets_data: Any) -> List[str]:
        """Extract asset list from JSONB or string data"""
        if not assets_data:
            return []
        
        try:
            if isinstance(assets_data, str):
                assets = json.loads(assets_data)
            elif isinstance(assets_data, list):
                assets = assets_data
            else:
                assets = []
            return [str(asset) for asset in assets if asset]
        except:
            return []
            
    def count_critical_high_incidents(self, assets: List[str]) -> int:
        """Count open critical/high incidents related to assets"""
        if not assets:
            return 0
            
        try:
            with self.conn.cursor() as cur:
                # Search for assets in incident description or affected systems
                asset_conditions = " OR ".join([
                    f"(description ILIKE %s OR assets ILIKE %s)" 
                    for _ in assets
                ])
                
                params = []
                for asset in assets:
                    params.extend([f'%{asset}%', f'%{asset}%'])
                
                query = f"""
                    SELECT COUNT(*) as count 
                    FROM incidents 
                    WHERE status IN ('Open', 'In Progress', 'Investigating')
                    AND severity IN ('Critical', 'High')
                    AND ({asset_conditions})
                """
                
                cur.execute(query, params)
                result = cur.fetchone()
                return result['count'] if result else 0
        except Exception as e:
            logger.error(f"Error counting incidents: {e}")
            return 0
            
    def count_critical_high_vulnerabilities(self, assets: List[str]) -> int:
        """Count open critical/high vulnerabilities related to assets"""
        if not assets:
            return 0
            
        try:
            with self.conn.cursor() as cur:
                query = """
                    SELECT COUNT(*) as count 
                    FROM vulnerabilities 
                    WHERE remediation_status IN ('Open', 'In Progress')
                    AND severity IN ('Critical', 'High')
                    AND (
                        assets::text ILIKE ANY(%s)
                        OR affected_systems ILIKE ANY(%s)
                    )
                """
                
                asset_patterns = [f'%{asset}%' for asset in assets]
                cur.execute(query, (asset_patterns, asset_patterns))
                result = cur.fetchone()
                return result['count'] if result else 0
        except Exception as e:
            logger.error(f"Error counting vulnerabilities: {e}")
            return 0
            
    def count_critical_high_findings(self, assets: List[str]) -> int:
        """Count open critical/high findings related to assets"""
        if not assets:
            return 0
            
        try:
            with self.conn.cursor() as cur:
                asset_conditions = " OR ".join([
                    f"finding_description ILIKE %s" 
                    for _ in assets
                ])
                
                params = [f'%{asset}%' for asset in assets]
                
                query = f"""
                    SELECT COUNT(*) as count 
                    FROM assessment_findings 
                    WHERE status IN ('Open', 'In Progress')
                    AND severity IN ('Critical', 'High')
                    AND ({asset_conditions})
                """ if assets else """
                    SELECT COUNT(*) as count 
                    FROM assessment_findings 
                    WHERE status IN ('Open', 'In Progress')
                    AND severity IN ('Critical', 'High')
                """
                
                cur.execute(query, params if assets else None)
                result = cur.fetchone()
                return result['count'] if result else 0
        except Exception as e:
            logger.error(f"Error counting findings: {e}")
            return 0
            
    def count_critical_high_risks(self, assets: List[str]) -> int:
        """Count open critical/high risks from all risk tables"""
        if not assets:
            return 0
            
        total_risks = 0
        risk_tables = ['fair_risks', 'iso27001_risks', 'nist_csf_risk_templates']
        
        for table in risk_tables:
            try:
                with self.conn.cursor() as cur:
                    # Check if table exists
                    cur.execute("""
                        SELECT EXISTS (
                            SELECT FROM information_schema.tables 
                            WHERE table_name = %s
                        )
                    """, (table,))
                    
                    if not cur.fetchone()['exists']:
                        continue
                    
                    asset_conditions = " OR ".join([
                        f"description ILIKE %s" 
                        for _ in assets
                    ])
                    
                    params = [f'%{asset}%' for asset in assets]
                    
                    query = f"""
                        SELECT COUNT(*) as count 
                        FROM {table}
                        WHERE status IN ('Open', 'Identified', 'In Progress')
                        AND (
                            (impact >= 4 AND likelihood >= 4)
                            OR risk_level IN ('Critical', 'High')
                        )
                        AND ({asset_conditions})
                    """ if assets else f"""
                        SELECT COUNT(*) as count 
                        FROM {table}
                        WHERE status IN ('Open', 'Identified', 'In Progress')
                        AND (
                            (impact >= 4 AND likelihood >= 4)
                            OR risk_level IN ('Critical', 'High')
                        )
                    """
                    
                    cur.execute(query, params if assets else None)
                    result = cur.fetchone()
                    total_risks += result['count'] if result else 0
                    
            except Exception as e:
                logger.warning(f"Error counting risks from {table}: {e}")
                continue
                
        return total_risks
        
    def count_third_party_gaps(self, assets: List[str]) -> int:
        """Count gaps from third party risk analysis"""
        if not assets:
            return 0
            
        try:
            with self.conn.cursor() as cur:
                # Check if third_party_risk_assessments table exists
                cur.execute("""
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_name = 'third_party_risk_assessments'
                    )
                """)
                
                if not cur.fetchone()['exists']:
                    return 0
                
                asset_conditions = " OR ".join([
                    f"(vendor_name ILIKE %s OR assessment_findings ILIKE %s)" 
                    for _ in assets
                ])
                
                params = []
                for asset in assets:
                    params.extend([f'%{asset}%', f'%{asset}%'])
                
                query = f"""
                    SELECT COUNT(*) as count 
                    FROM third_party_risk_assessments 
                    WHERE status IN ('Open', 'In Progress', 'Identified')
                    AND risk_level IN ('Critical', 'High')
                    AND ({asset_conditions})
                """ if assets else """
                    SELECT COUNT(*) as count 
                    FROM third_party_risk_assessments 
                    WHERE status IN ('Open', 'In Progress', 'Identified')
                    AND risk_level IN ('Critical', 'High')
                """
                
                cur.execute(query, params if assets else None)
                result = cur.fetchone()
                return result['count'] if result else 0
        except Exception as e:
            logger.error(f"Error counting third party gaps: {e}")
            return 0
            
    def calculate_risk_factors(self, vulnerability_id: int) -> Dict[str, Any]:
        """Calculate all risk factors for a vulnerability"""
        vuln_data = self.get_vulnerability_data(vulnerability_id)
        if not vuln_data:
            raise ValueError(f"Vulnerability {vulnerability_id} not found")
        
        assets = self.extract_assets(vuln_data.get('assets'))
        
        logger.info(f"Calculating risk factors for vulnerability {vulnerability_id}")
        logger.info(f"Associated assets: {assets}")
        
        risk_factors = {
            'vulnerability_id': vulnerability_id,
            'vulnerability_name': vuln_data['name'],
            'cve_id': vuln_data.get('cve_id'),
            'severity': vuln_data.get('severity'),
            'cvss_score': float(vuln_data.get('cvss_score') or 0),
            'assets': assets,
            'incidents_count': self.count_critical_high_incidents(assets),
            'vulnerabilities_count': self.count_critical_high_vulnerabilities(assets),
            'findings_count': self.count_critical_high_findings(assets),
            'risks_count': self.count_critical_high_risks(assets),
            'third_party_gaps_count': self.count_third_party_gaps(assets)
        }
        
        logger.info(f"Risk factors calculated: {risk_factors}")
        return risk_factors
        
    def calculate_epss_score(self, risk_factors: Dict[str, Any]) -> float:
        """Calculate EPSS score using weighted factors"""
        
        # Normalize counts (using logarithmic scale to handle large variations)
        def normalize_count(count: int, max_expected: int = 100) -> float:
            """Normalize count to 0-1 scale using logarithmic transformation"""
            if count == 0:
                return 0.0
            # Log scale normalization
            normalized = np.log1p(count) / np.log1p(max_expected)
            return min(normalized, 1.0)
        
        # Calculate individual risk scores
        incidents_score = normalize_count(risk_factors['incidents_count'], 50)
        vulnerabilities_score = normalize_count(risk_factors['vulnerabilities_count'], 100)
        findings_score = normalize_count(risk_factors['findings_count'], 100)
        risks_score = normalize_count(risk_factors['risks_count'], 50)
        third_party_score = normalize_count(risk_factors['third_party_gaps_count'], 30)
        
        # Apply weights
        weighted_score = (
            incidents_score * WEIGHTS['incidents'] +
            vulnerabilities_score * WEIGHTS['vulnerabilities'] +
            findings_score * WEIGHTS['findings'] +
            risks_score * WEIGHTS['open_risks'] +
            third_party_score * WEIGHTS['third_party_gaps']
        )
        
        # Consider CVSS score if available
        cvss_score = risk_factors.get('cvss_score', 0)
        if cvss_score > 0:
            cvss_normalized = cvss_score / 10.0
            # Blend EPSS with CVSS (70% context-based, 30% CVSS)
            final_score = (weighted_score * 0.7) + (cvss_normalized * 0.3)
        else:
            final_score = weighted_score
        
        # Ensure score is between 0 and 1
        epss_score = max(0.0, min(1.0, final_score))
        
        logger.info(f"EPSS Score calculated: {epss_score:.4f}")
        logger.info(f"  - Incidents contribution: {incidents_score * WEIGHTS['incidents']:.4f}")
        logger.info(f"  - Vulnerabilities contribution: {vulnerabilities_score * WEIGHTS['vulnerabilities']:.4f}")
        logger.info(f"  - Findings contribution: {findings_score * WEIGHTS['findings']:.4f}")
        logger.info(f"  - Risks contribution: {risks_score * WEIGHTS['open_risks']:.4f}")
        logger.info(f"  - Third party contribution: {third_party_score * WEIGHTS['third_party_gaps']:.4f}")
        
        return epss_score
        
    def update_vulnerability_epss(self, vulnerability_id: int, epss_score: float, 
                                  risk_factors: Dict[str, Any]) -> bool:
        """Update vulnerability with calculated EPSS score"""
        try:
            with self.conn.cursor() as cur:
                cur.execute("""
                    UPDATE vulnerabilities 
                    SET epss_score = %s,
                        epss_percentile = %s,
                        epss_last_updated = NOW(),
                        epss_calculation_metadata = %s,
                        updated_at = NOW()
                    WHERE id = %s
                """, (
                    epss_score,
                    epss_score * 100,  # Convert to percentile
                    json.dumps({
                        'risk_factors': risk_factors,
                        'weights': WEIGHTS,
                        'calculated_at': datetime.now().isoformat()
                    }),
                    vulnerability_id
                ))
                self.conn.commit()
                logger.info(f"EPSS score updated for vulnerability {vulnerability_id}")
                return True
        except Exception as e:
            logger.error(f"Error updating EPSS score: {e}")
            self.conn.rollback()
            return False
            
    def calculate_and_update(self, vulnerability_id: int) -> Dict[str, Any]:
        """Main method to calculate and update EPSS score"""
        try:
            self.connect()
            
            # Calculate risk factors
            risk_factors = self.calculate_risk_factors(vulnerability_id)
            
            # Calculate EPSS score
            epss_score = self.calculate_epss_score(risk_factors)
            
            # Update database
            success = self.update_vulnerability_epss(vulnerability_id, epss_score, risk_factors)
            
            result = {
                'success': success,
                'vulnerability_id': vulnerability_id,
                'epss_score': round(epss_score, 4),
                'epss_percentile': round(epss_score * 100, 2),
                'risk_factors': risk_factors,
                'message': 'EPSS score calculated and updated successfully' if success else 'Failed to update EPSS score'
            }
            
            return result
            
        except Exception as e:
            logger.error(f"Error in calculate_and_update: {e}")
            return {
                'success': False,
                'error': str(e),
                'message': 'Failed to calculate EPSS score'
            }
        finally:
            self.disconnect()


def main():
    """Main entry point for command-line execution"""
    if len(sys.argv) < 2:
        print("Usage: python epss_calculator.py <vulnerability_id>")
        sys.exit(1)
    
    try:
        vulnerability_id = int(sys.argv[1])
    except ValueError:
        print("Error: vulnerability_id must be an integer")
        sys.exit(1)
    
    calculator = EPSSCalculator()
    result = calculator.calculate_and_update(vulnerability_id)
    
    # Output result as JSON
    print(json.dumps(result, indent=2))
    
    sys.exit(0 if result['success'] else 1)


if __name__ == "__main__":
    main()


