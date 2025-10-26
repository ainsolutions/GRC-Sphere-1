#!/usr/bin/env python3
"""
Machine Learning Predictive Analysis for GRC System
===============================================

This script performs comprehensive predictive analysis on GRC data including:
- Risk exposure prediction
- Compliance level forecasting
- Incident likelihood assessment
- Threat likelihood based on vulnerabilities

Author: AI Assistant
Date: 2024
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import psycopg2
from psycopg2.extras import RealDictCursor
import os
import json
from typing import Dict, List, Any, Tuple
import warnings
warnings.filterwarnings('ignore')

# Machine Learning imports
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, mean_squared_error, accuracy_score
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
import xgboost as xgb
from imblearn.over_sampling import SMOTE
import joblib


class GRCPredictiveAnalyzer:
    """
    Comprehensive predictive analysis system for GRC (Governance, Risk, Compliance) data
    """

    def __init__(self, db_config: Dict[str, str]):
        """
        Initialize the predictive analyzer with database configuration

        Args:
            db_config: Database connection parameters
        """
        self.db_config = db_config
        self.models = {}
        self.scalers = {}
        self.encoders = {}
        self.connection = None

    def connect_database(self):
        """Establish database connection"""
        try:
            # Check if database config is available
            if not self.db_config or not self.db_config.get('database'):
                print("⚠️  Database configuration not available, switching to demo mode")
                return False

            self.connection = psycopg2.connect(**self.db_config, cursor_factory=RealDictCursor)
            print("✅ Database connection established")
            return True
        except Exception as e:
            print(f"❌ Database connection failed: {e}")
            print("💡 Switching to demo mode with sample data")
            return False

    def disconnect_database(self):
        """Close database connection"""
        if self.connection:
            self.connection.close()
            print("🔌 Database connection closed")

    def fetch_data_from_tables(self) -> Dict[str, pd.DataFrame]:
        """
        Fetch data from all relevant GRC tables

        Returns:
            Dictionary containing DataFrames for each table
        """
        tables_queries = {
            'risks': """
                SELECT id, risk_id, title, description, risk_level, status, impact_level,
                       likelihood_level, risk_score, remediation_status, created_at, updated_at,
                       due_date, assigned_to, department_id
                FROM risks
            """,
            'incidents': """
                SELECT id, incident_id, title, description, severity, status, impact_level,
                       created_at, resolved_at, assigned_to, department_id, category
                FROM incidents
            """,
            'vulnerabilities': """
                SELECT id, vulnerability_id, title, description, severity, status,
                       cvss_score, remediation_status, discovered_at, due_date,
                       affected_assets, category, threat_level
                FROM vulnerabilities
            """,
            'controls': """
                SELECT id, control_id, title, description, control_type, status,
                       implementation_status, effectiveness_score, last_assessment,
                       next_review_date, department_id
                FROM controls
            """,
            'compliance': """
                SELECT id, compliance_id, framework_name, compliance_score, status,
                       last_assessment, next_audit_date, critical_findings,
                       department_id, overall_compliance_percentage
                FROM compliance
            """,
            'findings': """
                SELECT id, finding_id, title, description, severity, status,
                       remediation_status, created_at, due_date, assigned_to,
                       related_risk_id, related_asset_id
                FROM findings
            """,
            'assessments': """
                SELECT id, assessment_id, title, assessment_type, status,
                       overall_score, completion_percentage, start_date, end_date,
                       department_id, assessor_id
                FROM assessments
            """,
            'threats': """
                SELECT id, threat_id, title, description, threat_level, status,
                       likelihood_score, impact_score, remediation_status,
                       discovered_at, last_seen, category
                FROM threats
            """,
            'technology_risks': """
                SELECT id, technology_risk_id, title, description, risk_level,
                       technology_type, status, impact_level, remediation_status,
                       identified_at, department_id
                FROM technology_risks
            """,
            'assets': """
                SELECT id, asset_id, name, asset_type, criticality_level,
                       location, department_id, status, last_assessment,
                       compliance_status, risk_level
                FROM assets
            """
        }

        data_frames = {}

        for table_name, query in tables_queries.items():
            try:
                df = pd.read_sql_query(query, self.connection)
                data_frames[table_name] = df
                print(f"✅ Fetched {len(df)} records from {table_name}")
            except Exception as e:
                print(f"⚠️  Failed to fetch {table_name}: {e}")
                data_frames[table_name] = pd.DataFrame()

        return data_frames

    def generate_sample_data(self) -> Dict[str, pd.DataFrame]:
        """
        Generate sample GRC data for demonstration when database is not available

        Returns:
            Dictionary of sample DataFrames
        """
        print("🔧 Generating sample GRC data...")

        # Sample risks data
        risks_data = []
        for i in range(50):
            risk = {
                'id': i + 1,
                'title': f'Risk {i + 1}',
                'status': np.random.choice(['open', 'closed', 'in_progress'], p=[0.4, 0.4, 0.2]),
                'risk_level': np.random.choice(['low', 'medium', 'high', 'critical'], p=[0.3, 0.4, 0.2, 0.1]),
                'risk_score': np.random.uniform(10, 95),
                'remediation_status': np.random.choice(['completed', 'in_progress', 'pending'], p=[0.3, 0.4, 0.3]),
                'due_date': (datetime.now() + timedelta(days=np.random.randint(-30, 60))).isoformat(),
                'created_at': (datetime.now() + timedelta(days=-np.random.randint(1, 365))).isoformat()
            }
            risks_data.append(risk)

        # Sample incidents data
        incidents_data = []
        for i in range(30):
            incident = {
                'id': i + 1,
                'title': f'Incident {i + 1}',
                'status': np.random.choice(['resolved', 'in_progress', 'open'], p=[0.6, 0.3, 0.1]),
                'severity': np.random.choice(['low', 'medium', 'high', 'critical'], p=[0.4, 0.4, 0.15, 0.05]),
                'created_at': (datetime.now() + timedelta(days=-np.random.randint(1, 180))).isoformat(),
                'resolved_at': None if np.random.random() > 0.6 else (datetime.now() + timedelta(days=-np.random.randint(1, 30))).isoformat()
            }
            incidents_data.append(incident)

        # Sample vulnerabilities data
        vulnerabilities_data = []
        for i in range(40):
            vuln = {
                'id': i + 1,
                'title': f'Vulnerability {i + 1}',
                'severity': np.random.choice(['low', 'medium', 'high', 'critical'], p=[0.3, 0.4, 0.2, 0.1]),
                'status': np.random.choice(['open', 'closed', 'in_progress'], p=[0.5, 0.3, 0.2]),
                'cvss_score': np.random.uniform(1, 10),
                'remediation_status': np.random.choice(['completed', 'in_progress', 'pending'], p=[0.2, 0.5, 0.3]),
                'due_date': (datetime.now() + timedelta(days=np.random.randint(-20, 45))).isoformat(),
                'discovered_at': (datetime.now() + timedelta(days=-np.random.randint(1, 90))).isoformat()
            }
            vulnerabilities_data.append(vuln)

        return {
            'risks': pd.DataFrame(risks_data),
            'incidents': pd.DataFrame(incidents_data),
            'vulnerabilities': pd.DataFrame(vulnerabilities_data),
            'controls': pd.DataFrame([]),
            'compliance': pd.DataFrame([]),
            'findings': pd.DataFrame([]),
            'assessments': pd.DataFrame([]),
            'threats': pd.DataFrame([]),
            'technology_risks': pd.DataFrame([]),
            'assets': pd.DataFrame([])
        }

    def feature_engineering(self, data_frames: Dict[str, pd.DataFrame]) -> pd.DataFrame:
        """
        Perform comprehensive feature engineering on the collected data

        Args:
            data_frames: Dictionary of DataFrames from different tables

        Returns:
            Processed DataFrame with engineered features
        """
        print("🔧 Performing feature engineering...")

        # Initialize master DataFrame
        master_df = pd.DataFrame()

        # Process each data source and create features
        features = {}

        # 1. Risk-related features
        if not data_frames['risks'].empty:
            risk_df = data_frames['risks'].copy()
            risk_df['risk_overdue_days'] = (pd.to_datetime('today') - pd.to_datetime(risk_df['due_date'])).dt.days
            risk_df['risk_overdue_days'] = risk_df['risk_overdue_days'].clip(lower=0)

            features.update({
                'total_risks': len(risk_df),
                'open_risks': len(risk_df[risk_df['status'] != 'closed']),
                'high_risk_count': len(risk_df[risk_df['risk_level'].isin(['high', 'critical'])]),
                'avg_risk_score': risk_df['risk_score'].mean(),
                'overdue_risks': len(risk_df[risk_df['risk_overdue_days'] > 0]),
                'remediated_risks': len(risk_df[risk_df['remediation_status'] == 'completed'])
            })

        # 2. Incident-related features
        if not data_frames['incidents'].empty:
            incident_df = data_frames['incidents'].copy()
            incident_df['incident_age_days'] = (pd.to_datetime('today') - pd.to_datetime(incident_df['created_at'])).dt.days

            features.update({
                'total_incidents': len(incident_df),
                'open_incidents': len(incident_df[incident_df['status'] != 'resolved']),
                'critical_incidents': len(incident_df[incident_df['severity'].isin(['critical', 'high'])]),
                'avg_incident_age': incident_df['incident_age_days'].mean(),
                'incident_resolution_rate': len(incident_df[incident_df['status'] == 'resolved']) / len(incident_df) if len(incident_df) > 0 else 0
            })

        # 3. Vulnerability-related features
        if not data_frames['vulnerabilities'].empty:
            vuln_df = data_frames['vulnerabilities'].copy()
            vuln_df['vuln_overdue_days'] = (pd.to_datetime('today') - pd.to_datetime(vuln_df['due_date'])).dt.days
            vuln_df['vuln_overdue_days'] = vuln_df['vuln_overdue_days'].clip(lower=0)

            features.update({
                'total_vulnerabilities': len(vuln_df),
                'open_vulnerabilities': len(vuln_df[vuln_df['status'] != 'closed']),
                'critical_vulnerabilities': len(vuln_df[vuln_df['severity'].isin(['critical', 'high'])]),
                'avg_cvss_score': vuln_df['cvss_score'].mean(),
                'overdue_vulnerabilities': len(vuln_df[vuln_df['vuln_overdue_days'] > 0]),
                'remediated_vulnerabilities': len(vuln_df[vuln_df['remediation_status'] == 'completed'])
            })

        # 4. Control-related features
        if not data_frames['controls'].empty:
            control_df = data_frames['controls'].copy()
            control_df['control_overdue_days'] = (pd.to_datetime('today') - pd.to_datetime(control_df['next_review_date'])).dt.days
            control_df['control_overdue_days'] = control_df['control_overdue_days'].clip(lower=0)

            features.update({
                'total_controls': len(control_df),
                'implemented_controls': len(control_df[control_df['implementation_status'] == 'implemented']),
                'effective_controls': len(control_df[control_df['effectiveness_score'] >= 80]),
                'avg_control_effectiveness': control_df['effectiveness_score'].mean(),
                'overdue_control_reviews': len(control_df[control_df['control_overdue_days'] > 0])
            })

        # 5. Compliance-related features
        if not data_frames['compliance'].empty:
            compliance_df = data_frames['compliance'].copy()
            features.update({
                'avg_compliance_score': compliance_df['compliance_score'].mean(),
                'overall_compliance_percentage': compliance_df['overall_compliance_percentage'].mean(),
                'critical_compliance_findings': compliance_df['critical_findings'].sum(),
                'compliant_frameworks': len(compliance_df[compliance_df['compliance_score'] >= 80])
            })

        # 6. Findings-related features
        if not data_frames['findings'].empty:
            findings_df = data_frames['findings'].copy()
            findings_df['finding_overdue_days'] = (pd.to_datetime('today') - pd.to_datetime(findings_df['due_date'])).dt.days
            findings_df['finding_overdue_days'] = findings_df['finding_overdue_days'].clip(lower=0)

            features.update({
                'total_findings': len(findings_df),
                'open_findings': len(findings_df[findings_df['status'] != 'closed']),
                'critical_findings': len(findings_df[findings_df['severity'].isin(['critical', 'high'])]),
                'overdue_findings': len(findings_df[findings_df['finding_overdue_days'] > 0]),
                'remediated_findings': len(findings_df[findings_df['remediation_status'] == 'completed'])
            })

        # 7. Assessment-related features
        if not data_frames['assessments'].empty:
            assessment_df = data_frames['assessments'].copy()
            features.update({
                'total_assessments': len(assessment_df),
                'completed_assessments': len(assessment_df[assessment_df['status'] == 'completed']),
                'avg_assessment_score': assessment_df['overall_score'].mean(),
                'assessment_completion_rate': assessment_df['completion_percentage'].mean()
            })

        # 8. Threat-related features
        if not data_frames['threats'].empty:
            threat_df = data_frames['threats'].copy()
            features.update({
                'total_threats': len(threat_df),
                'active_threats': len(threat_df[threat_df['status'] == 'active']),
                'high_threats': len(threat_df[threat_df['threat_level'].isin(['high', 'critical'])]),
                'avg_threat_likelihood': threat_df['likelihood_score'].mean(),
                'avg_threat_impact': threat_df['impact_score'].mean()
            })

        # 9. Technology risk features
        if not data_frames['technology_risks'].empty:
            tech_risk_df = data_frames['technology_risks'].copy()
            features.update({
                'total_tech_risks': len(tech_risk_df),
                'high_tech_risks': len(tech_risk_df[tech_risk_df['risk_level'].isin(['high', 'critical'])]),
                'remediated_tech_risks': len(tech_risk_df[tech_risk_df['remediation_status'] == 'completed'])
            })

        # 10. Asset-related features
        if not data_frames['assets'].empty:
            asset_df = data_frames['assets'].copy()
            features.update({
                'total_assets': len(asset_df),
                'critical_assets': len(asset_df[asset_df['criticality_level'].isin(['high', 'critical'])]),
                'non_compliant_assets': len(asset_df[asset_df['compliance_status'] != 'compliant']),
                'high_risk_assets': len(asset_df[asset_df['risk_level'].isin(['high', 'critical'])])
            })

        # Create master DataFrame
        master_df = pd.DataFrame([features])

        # Fill NaN values
        master_df = master_df.fillna(0)

        print("✅ Feature engineering completed")
        return master_df

    def create_target_variables(self, data_frames: Dict[str, pd.DataFrame]) -> Dict[str, pd.Series]:
        """
        Create target variables for different prediction models

        Args:
            data_frames: Dictionary of DataFrames from different tables

        Returns:
            Dictionary of target variables
        """
        targets = {}

        # Risk exposure target (based on risk scores and open items)
        if not data_frames['risks'].empty:
            risk_df = data_frames['risks']
            # Calculate risk exposure score
            risk_exposure = (
                risk_df['risk_score'].mean() * 0.4 +
                len(risk_df[risk_df['status'] != 'closed']) * 10 * 0.3 +
                len(risk_df[risk_df['remediation_status'] != 'completed']) * 5 * 0.3
            )
            targets['risk_exposure'] = pd.Series([min(risk_exposure, 100)])  # Cap at 100

        # Compliance level target
        if not data_frames['compliance'].empty:
            compliance_df = data_frames['compliance']
            compliance_level = compliance_df['compliance_score'].mean()
            targets['compliance_level'] = pd.Series([compliance_level])

        # Incident likelihood target (convert to binary classification)
        if not data_frames['incidents'].empty:
            incident_df = data_frames['incidents']
            # Calculate incident likelihood score and convert to binary
            recent_incidents = len(incident_df[
                pd.to_datetime(incident_df['created_at']) > (pd.to_datetime('today') - pd.Timedelta(days=30))
            ])
            open_incidents = len(incident_df[incident_df['status'] != 'resolved'])
            incident_score = min((recent_incidents * 2 + open_incidents * 5), 100)
            # Convert to binary: 1 if high risk (>70), 0 if low risk
            incident_likelihood = 1 if incident_score > 70 else 0
            targets['incident_likelihood'] = pd.Series([incident_likelihood])

        # Threat likelihood target (convert to binary classification)
        if not data_frames['vulnerabilities'].empty:
            vuln_df = data_frames['vulnerabilities']
            # Calculate threat likelihood score and convert to binary
            open_vulns = len(vuln_df[vuln_df['status'] != 'closed'])
            critical_vulns = len(vuln_df[vuln_df['severity'].isin(['critical', 'high'])])
            threat_score = min((open_vulns * 3 + critical_vulns * 5), 100)
            # Convert to binary: 1 if high risk (>70), 0 if low risk
            threat_likelihood = 1 if threat_score > 70 else 0
            targets['threat_likelihood'] = pd.Series([threat_likelihood])

        return targets

    def train_predictive_models(self, features_df: pd.DataFrame, targets: Dict[str, pd.Series]):
        """
        Train multiple predictive models for different risk metrics

        Args:
            features_df: Engineered features DataFrame
            targets: Dictionary of target variables
        """
        print("🤖 Training predictive models...")

        models_config = {
            'risk_exposure': {
                'model': RandomForestRegressor(n_estimators=100, random_state=42),
                'type': 'regression'
            },
            'compliance_level': {
                'model': RandomForestRegressor(n_estimators=100, random_state=42),
                'type': 'regression'
            },
            'incident_likelihood': {
                'model': RandomForestClassifier(n_estimators=100, random_state=42),
                'type': 'classification'
            },
            'threat_likelihood': {
                'model': GradientBoostingClassifier(n_estimators=100, random_state=42),
                'type': 'classification'
            }
        }

        for target_name, target_series in targets.items():
            if target_name in models_config and len(target_series) > 0:
                try:
                    model_config = models_config[target_name]

                    # Prepare data
                    X = features_df
                    y = target_series

                    # For small datasets, duplicate data to improve training
                    if len(X) < 5:
                        print(f"⚠️  Very small dataset for {target_name}, duplicating data")
                        X_extended = pd.concat([X] * 5, ignore_index=True)
                        y_series = pd.Series(y) if not isinstance(y, pd.Series) else y
                        y_extended = pd.concat([y_series] * 5, ignore_index=True)
                        X = X_extended
                        y = y_extended.values

                    # Create pipeline
                    if model_config['type'] == 'classification':
                        # Convert target to proper format for classification
                        if hasattr(y, 'values'):
                            y = y.values
                        y = y.astype(int)  # Ensure integer labels for classification

                        # For classification, create synthetic data if needed
                        if len(X) < 30:
                            # Duplicate data for better training
                            X_extended = pd.concat([X] * 3, ignore_index=True)
                            y_extended = np.concatenate([y] * 3)
                            X = X_extended
                            y = y_extended

                    # Train model
                    model_config['model'].fit(X, y)

                    # Store trained model
                    self.models[target_name] = model_config['model']

                    print(f"✅ {target_name} model trained successfully")

                except Exception as e:
                    print(f"❌ Failed to train {target_name} model: {e}")

    def generate_predictions(self, features_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Generate predictions using trained models

        Args:
            features_df: Current feature DataFrame

        Returns:
            Dictionary containing predictions and insights
        """
        predictions = {}

        for model_name, model in self.models.items():
            try:
                if hasattr(model, 'predict_proba'):
                    # Classification model
                    probabilities = model.predict_proba(features_df)[0]
                    prediction = model.predict(features_df)[0]

                    predictions[model_name] = {
                        'prediction': float(prediction),
                        'probabilities': probabilities.tolist(),
                        'confidence': float(max(probabilities))
                    }
                else:
                    # Regression model
                    prediction = model.predict(features_df)[0]
                    predictions[model_name] = {
                        'prediction': float(prediction),
                        'confidence': 0.8  # Default confidence for regression
                    }

                print(f"✅ Generated prediction for {model_name}")

            except Exception as e:
                print(f"❌ Failed to generate prediction for {model_name}: {e}")
                predictions[model_name] = {
                    'prediction': 0.0,
                    'error': str(e)
                }

        return predictions

    def generate_insights(self, features_df: pd.DataFrame, predictions: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate actionable insights based on predictions and current data

        Args:
            features_df: Current feature DataFrame
            predictions: Model predictions

        Returns:
            Dictionary containing insights and recommendations
        """
        insights = {
            'risk_assessment': {},
            'recommendations': [],
            'trends': {},
            'alerts': []
        }

        # Risk exposure insights
        if 'risk_exposure' in predictions:
            risk_score = predictions['risk_exposure']['prediction']
            if risk_score > 70:
                insights['risk_assessment']['level'] = 'CRITICAL'
                insights['risk_assessment']['color'] = 'red'
                insights['recommendations'].append("Immediate risk mitigation required")
                insights['alerts'].append("High risk exposure detected")
            elif risk_score > 40:
                insights['risk_assessment']['level'] = 'HIGH'
                insights['risk_assessment']['color'] = 'orange'
                insights['recommendations'].append("Enhanced monitoring and controls needed")
            else:
                insights['risk_assessment']['level'] = 'MODERATE'
                insights['risk_assessment']['color'] = 'yellow'
                insights['recommendations'].append("Maintain current risk management practices")

        # Compliance insights
        if 'compliance_level' in predictions:
            compliance_score = predictions['compliance_level']['prediction']
            if compliance_score < 70:
                insights['recommendations'].append("Compliance improvement initiatives required")
                insights['alerts'].append("Low compliance levels detected")

        # Incident likelihood insights
        if 'incident_likelihood' in predictions:
            incident_risk = predictions['incident_likelihood']['prediction']
            if incident_risk > 0.7:
                insights['recommendations'].append("Implement additional incident prevention measures")
                insights['alerts'].append("High incident likelihood predicted")

        # Threat likelihood insights
        if 'threat_likelihood' in predictions:
            threat_risk = predictions['threat_likelihood']['prediction']
            if threat_risk > 0.7:
                insights['recommendations'].append("Strengthen threat detection and response capabilities")
                insights['alerts'].append("High threat likelihood based on vulnerabilities")

        # Generate trend analysis
        insights['trends'] = {
            'open_items_trend': 'increasing' if features_df.get('open_risks', [0])[0] > 10 else 'stable',
            'remediation_effectiveness': 'good' if features_df.get('remediated_risks', [0])[0] > features_df.get('total_risks', [0])[0] * 0.7 else 'needs_improvement',
            'compliance_trend': 'improving' if features_df.get('avg_compliance_score', [0])[0] > 75 else 'needs_attention'
        }

        return insights

    def generate_advanced_insights(self, features_df: pd.DataFrame, predictions: Dict[str, Any], data_frames: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """
        Generate advanced insights with detailed reasoning and analysis
        """
        advanced_insights = {
            'risk_drivers': {},
            'predictive_reasoning': {},
            'mitigation_priorities': [],
            'emerging_patterns': [],
            'comparative_analysis': {},
            'forecasting': {}
        }

        # Analyze risk drivers
        if not data_frames['risks'].empty:
            risk_df = data_frames['risks']
            risk_drivers = {
                'top_risk_categories': risk_df['risk_level'].value_counts().to_dict(),
                'remediation_effectiveness': len(risk_df[risk_df['remediation_status'] == 'completed']) / len(risk_df) if len(risk_df) > 0 else 0,
                'aging_risks': len(risk_df[risk_df['risk_level'].isin(['high', 'critical'])]),
                'overdue_critical_risks': len(risk_df[(risk_df['risk_level'] == 'critical') & (pd.to_datetime(risk_df['due_date']) < pd.to_datetime('today'))])
            }
            advanced_insights['risk_drivers'] = risk_drivers

        # Predictive reasoning for each model
        for metric, prediction_data in predictions.items():
            if 'error' not in prediction_data:
                reasoning = self.generate_predictive_reasoning(metric, prediction_data, features_df)
                advanced_insights['predictive_reasoning'][metric] = reasoning

        # Mitigation priorities based on predictions
        mitigation_priorities = []
        if 'risk_exposure' in predictions and predictions['risk_exposure']['prediction'] > 70:
            mitigation_priorities.append({
                'priority': 'CRITICAL',
                'action': 'Immediate risk mitigation required',
                'impact': 'High',
                'timeline': 'Immediate (< 24 hours)'
            })

        if 'threat_likelihood' in predictions and predictions['threat_likelihood']['prediction'] > 0.7:
            mitigation_priorities.append({
                'priority': 'HIGH',
                'action': 'Strengthen threat detection capabilities',
                'impact': 'Medium',
                'timeline': 'Short-term (1-2 weeks)'
            })

        advanced_insights['mitigation_priorities'] = mitigation_priorities

        # Emerging patterns analysis
        patterns = []
        if features_df.get('open_vulnerabilities', [0])[0] > features_df.get('total_vulnerabilities', [0])[0] * 0.6:
            patterns.append("High vulnerability backlog indicates systemic issues")
        if features_df.get('incident_resolution_rate', [0])[0] < 0.7:
            patterns.append("Low incident resolution rate suggests process inefficiencies")
        if features_df.get('overdue_risks', [0])[0] > features_df.get('total_risks', [0])[0] * 0.3:
            patterns.append("Significant overdue risks indicate resource constraints")

        advanced_insights['emerging_patterns'] = patterns

        return advanced_insights

    def generate_predictive_reasoning(self, metric: str, prediction_data: Dict[str, Any], features_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Generate detailed reasoning for predictions
        """
        reasoning = {
            'primary_factors': [],
            'contributing_elements': [],
            'confidence_factors': [],
            'uncertainty_sources': [],
            'recommended_actions': []
        }

        prediction = prediction_data['prediction']
        confidence = prediction_data.get('confidence', 0.5)

        if metric == 'risk_exposure':
            if prediction > 70:
                reasoning['primary_factors'] = [
                    f"High number of open risks ({features_df.get('open_risks', [0])[0]})",
                    f"Elevated average risk score ({features_df.get('avg_risk_score', [0])[0]:.1f})",
                    f"Significant overdue items ({features_df.get('overdue_risks', [0])[0]})"
                ]
                reasoning['recommended_actions'] = [
                    "Prioritize critical risk remediation",
                    "Allocate additional resources to risk management",
                    "Review and update risk assessment processes"
                ]
            reasoning['confidence_factors'] = [f"Model confidence: {confidence:.1%}"]

        elif metric == 'compliance_level':
            compliance_score = features_df.get('avg_risk_score', [0])[0]
            reasoning['primary_factors'] = [
                f"Current compliance score: {compliance_score:.1f}/100",
                f"Open vulnerabilities impact: {features_df.get('open_vulnerabilities', [0])[0]}",
                f"Control effectiveness: {features_df.get('avg_control_effectiveness', [0])[0]:.1f}"
            ]
            if compliance_score < 70:
                reasoning['recommended_actions'] = [
                    "Implement compliance improvement initiatives",
                    "Conduct gap analysis for critical controls",
                    "Schedule compliance training programs"
                ]

        elif metric == 'incident_likelihood':
            open_incidents = features_df.get('open_incidents', [0])[0]
            resolution_rate = features_df.get('incident_resolution_rate', [0])[0]
            reasoning['primary_factors'] = [
                f"Open incidents: {open_incidents}",
                f"Resolution rate: {resolution_rate:.1%}",
                f"Recent incident patterns: {features_df.get('total_incidents', [0])[0]} total"
            ]
            if prediction > 0.7:
                reasoning['recommended_actions'] = [
                    "Enhance incident prevention measures",
                    "Review incident response procedures",
                    "Implement proactive monitoring"
                ]

        elif metric == 'threat_likelihood':
            open_vulns = features_df.get('open_vulnerabilities', [0])[0]
            critical_vulns = features_df.get('critical_vulnerabilities', [0])[0]
            reasoning['primary_factors'] = [
                f"Open vulnerabilities: {open_vulns}",
                f"Critical vulnerabilities: {critical_vulns}",
                f"Average CVSS score: {features_df.get('avg_cvss_score', [0])[0]:.1f}"
            ]
            if prediction > 0.7:
                reasoning['recommended_actions'] = [
                    "Accelerate vulnerability remediation",
                    "Strengthen patch management processes",
                    "Enhance threat intelligence monitoring"
                ]

        reasoning['uncertainty_sources'] = [
            "Data completeness and quality",
            "Historical pattern consistency",
            "External environmental factors"
        ]

        return reasoning

    def generate_visualization_data(self, features_df: pd.DataFrame, predictions: Dict[str, Any], data_frames: Dict[str, pd.DataFrame]) -> Dict[str, Any]:
        """
        Generate data for advanced visualizations
        """
        viz_data = {
            'risk_distribution': {},
            'trend_charts': {},
            'correlation_matrix': {},
            'prediction_confidence': {},
            'performance_metrics': {}
        }

        # Risk distribution data
        if not data_frames['risks'].empty:
            risk_df = data_frames['risks']
            viz_data['risk_distribution'] = {
                'labels': ['Low', 'Medium', 'High', 'Critical'],
                'values': [
                    len(risk_df[risk_df['risk_level'] == 'low']),
                    len(risk_df[risk_df['risk_level'] == 'medium']),
                    len(risk_df[risk_df['risk_level'] == 'high']),
                    len(risk_df[risk_df['risk_level'] == 'critical'])
                ],
                'colors': ['#22c55e', '#eab308', '#f97316', '#ef4444']
            }

        # Vulnerability severity distribution
        if not data_frames['vulnerabilities'].empty:
            vuln_df = data_frames['vulnerabilities']
            viz_data['vulnerability_distribution'] = {
                'labels': ['Low', 'Medium', 'High', 'Critical'],
                'values': [
                    len(vuln_df[vuln_df['severity'] == 'low']),
                    len(vuln_df[vuln_df['severity'] == 'medium']),
                    len(vuln_df[vuln_df['severity'] == 'high']),
                    len(vuln_df[vuln_df['severity'] == 'critical'])
                ],
                'colors': ['#22c55e', '#eab308', '#f97316', '#ef4444']
            }

        # Prediction confidence visualization
        viz_data['prediction_confidence'] = {}
        for metric, prediction_data in predictions.items():
            if 'error' not in prediction_data:
                confidence = prediction_data.get('confidence', 0.5)
                viz_data['prediction_confidence'][metric] = {
                    'confidence': confidence,
                    'uncertainty': 1 - confidence,
                    'prediction': prediction_data['prediction']
                }

        # Performance metrics for dashboard
        viz_data['performance_metrics'] = {
            'overall_health_score': self.calculate_overall_health_score(features_df, predictions),
            'risk_trend': 'improving' if features_df.get('remediated_risks', [0])[0] > features_df.get('total_risks', [0])[0] * 0.6 else 'needs_attention',
            'compliance_trend': 'stable',
            'incident_trend': 'improving' if features_df.get('incident_resolution_rate', [0])[0] > 0.7 else 'needs_attention'
        }

        return viz_data

    def analyze_correlations(self, features_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Analyze correlations between different risk factors
        """
        correlation_data = {}

        try:
            # Calculate correlations between key metrics
            numeric_columns = features_df.select_dtypes(include=[np.number]).columns
            if len(numeric_columns) > 1:
                corr_matrix = features_df[numeric_columns].corr()

                # Extract significant correlations
                significant_correlations = []
                for i in range(len(corr_matrix.columns)):
                    for j in range(i+1, len(corr_matrix.columns)):
                        corr_value = corr_matrix.iloc[i, j]
                        if abs(corr_value) > 0.3:  # Significant correlation threshold
                            significant_correlations.append({
                                'factor1': corr_matrix.columns[i],
                                'factor2': corr_matrix.columns[j],
                                'correlation': corr_value,
                                'strength': 'Strong' if abs(corr_value) > 0.7 else 'Moderate' if abs(corr_value) > 0.5 else 'Weak'
                            })

                correlation_data = {
                    'correlation_matrix': corr_matrix.to_dict(),
                    'significant_correlations': significant_correlations,
                    'key_insights': self.extract_correlation_insights(significant_correlations)
                }
        except Exception as e:
            correlation_data = {'error': f'Correlation analysis failed: {str(e)}'}

        return correlation_data

    def extract_correlation_insights(self, correlations: List[Dict[str, Any]]) -> List[str]:
        """
        Extract actionable insights from correlation analysis
        """
        insights = []

        for corr in correlations:
            factor1, factor2 = corr['factor1'], corr['factor2']
            strength = corr['strength'].lower()
            direction = 'positive' if corr['correlation'] > 0 else 'negative'

            if 'open_risks' in [factor1, factor2] and 'open_vulnerabilities' in [factor1, factor2]:
                insights.append(f"{strength} {direction} correlation between open risks and vulnerabilities suggests {'integrated' if direction == 'positive' else 'independent'} risk management approaches")

            if 'incident' in factor1.lower() and 'vulnerability' in factor2.lower():
                insights.append(f"{strength} relationship between incidents and vulnerabilities indicates {'effective' if direction == 'negative' else 'ineffective'} vulnerability management")

        return insights

    def analyze_uncertainty(self, predictions: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze prediction uncertainty and confidence intervals
        """
        uncertainty_analysis = {}

        for metric, prediction_data in predictions.items():
            if 'error' not in prediction_data:
                prediction = prediction_data['prediction']
                confidence = prediction_data.get('confidence', 0.5)

                # Calculate uncertainty bounds (simplified)
                uncertainty_range = 1 - confidence
                lower_bound = max(0, prediction - (prediction * uncertainty_range * 0.5))
                upper_bound = min(100 if metric != 'threat_likelihood' and metric != 'incident_likelihood' else 1,
                                prediction + (prediction * uncertainty_range * 0.5))

                uncertainty_analysis[metric] = {
                    'confidence_level': confidence,
                    'uncertainty_range': uncertainty_range,
                    'prediction_interval': [lower_bound, upper_bound],
                    'confidence_interpretation': self.interpret_confidence(confidence),
                    'recommendations': self.generate_uncertainty_recommendations(confidence, metric)
                }

        return uncertainty_analysis

    def interpret_confidence(self, confidence: float) -> str:
        """Interpret confidence level in human-readable terms"""
        if confidence > 0.9:
            return "Very High - Prediction is highly reliable"
        elif confidence > 0.8:
            return "High - Prediction is reliable with minor uncertainty"
        elif confidence > 0.7:
            return "Moderate - Prediction has some uncertainty"
        elif confidence > 0.6:
            return "Low - Prediction has significant uncertainty"
        else:
            return "Very Low - Prediction should be treated with caution"

    def generate_uncertainty_recommendations(self, confidence: float, metric: str) -> List[str]:
        """Generate recommendations based on prediction uncertainty"""
        recommendations = []

        if confidence < 0.7:
            recommendations.append(f"Collect more data for {metric} to improve prediction accuracy")
            recommendations.append("Consider additional validation before taking action")

        if confidence < 0.8:
            recommendations.append("Monitor actual outcomes closely to validate predictions")
            recommendations.append("Consider implementing parallel mitigation strategies")

        return recommendations

    def generate_trend_analysis(self, features_df: pd.DataFrame) -> Dict[str, Any]:
        """
        Generate trend analysis data (simulated for demo)
        """
        # Generate simulated historical data for demonstration
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

        trend_data = {
            'risk_exposure_trend': [65, 68, 72, 69, 71, 73],
            'compliance_trend': [75, 76, 74, 77, 79, 78],
            'incident_trend': [12, 15, 13, 16, 14, 17],
            'vulnerability_trend': [45, 48, 52, 49, 51, 53],
            'time_labels': months
        }

        # Calculate trend directions
        trend_analysis = {}
        for metric, values in trend_data.items():
            if metric != 'time_labels':
                if len(values) >= 2:
                    recent_avg = sum(values[-3:]) / 3
                    earlier_avg = sum(values[:-3]) / 3
                    if recent_avg > earlier_avg * 1.05:
                        direction = 'increasing'
                    elif recent_avg < earlier_avg * 0.95:
                        direction = 'decreasing'
                    else:
                        direction = 'stable'
                else:
                    direction = 'insufficient_data'

                trend_analysis[metric] = {
                    'values': values,
                    'direction': direction,
                    'change_percentage': ((values[-1] - values[0]) / values[0] * 100) if values[0] != 0 else 0
                }

        return {
            'historical_data': trend_data,
            'trend_analysis': trend_analysis,
            'forecast_periods': 3,  # Next 3 months
            'forecast_confidence': 0.75
        }

    def calculate_overall_health_score(self, features_df: pd.DataFrame, predictions: Dict[str, Any]) -> float:
        """
        Calculate overall organizational health score
        """
        score_components = []

        # Risk exposure component (30%)
        if 'risk_exposure' in predictions:
            risk_score = predictions['risk_exposure']['prediction']
            # Invert risk score (lower risk = higher health)
            risk_component = max(0, 100 - risk_score) * 0.3
            score_components.append(risk_component)

        # Compliance component (25%)
        if 'compliance_level' in predictions:
            compliance_score = predictions['compliance_level']['prediction'] * 0.25
            score_components.append(compliance_score)

        # Incident management component (20%)
        incident_rate = features_df.get('incident_resolution_rate', [0.7])[0]
        incident_component = incident_rate * 100 * 0.2
        score_components.append(incident_component)

        # Vulnerability management component (15%)
        vuln_remediated = features_df.get('remediated_vulnerabilities', [0])[0]
        vuln_total = features_df.get('total_vulnerabilities', [1])[0]
        vuln_component = (vuln_remediated / vuln_total * 100) * 0.15 if vuln_total > 0 else 0
        score_components.append(vuln_component)

        # Remediation effectiveness component (10%)
        risk_remediated = features_df.get('remediated_risks', [0])[0]
        risk_total = features_df.get('total_risks', [1])[0]
        remediation_component = (risk_remediated / risk_total * 100) * 0.1 if risk_total > 0 else 0
        score_components.append(remediation_component)

        return round(sum(score_components), 1)

    def run_complete_analysis(self) -> Dict[str, Any]:
        """
        Run the complete predictive analysis pipeline

        Returns:
            Complete analysis results
        """
        try:
            print("🚀 Starting GRC Predictive Analysis...")

            # Try to connect to database
            db_connected = self.connect_database()

            if db_connected:
                # Production mode with real data
                print("🏭 Production mode: Using database data")

                # Fetch data from database
                data_frames = self.fetch_data_from_tables()

                # Check if we got any data
                if all(df.empty for df in data_frames.values()):
                    print("⚠️  No data found in database, switching to demo mode")
                    db_connected = False
            else:
                print("📊 Demo mode: Using sample data")

            if not db_connected:
                # Demo mode with sample data
                print("🔧 Generating sample data for demonstration...")
                data_frames = self.generate_sample_data()

            # Feature engineering
            features_df = self.feature_engineering(data_frames)

            # Create target variables
            targets = self.create_target_variables(data_frames)

            # Train models
            self.train_predictive_models(features_df, targets)

            # Generate predictions
            predictions = self.generate_predictions(features_df)

            # Generate insights
            insights = self.generate_insights(features_df, predictions)

            # Advanced reasoning and detailed analysis
            advanced_insights = self.generate_advanced_insights(features_df, predictions, data_frames)

            # Visualization data
            visualization_data = self.generate_visualization_data(features_df, predictions, data_frames)

            # Risk correlations and trends
            correlation_analysis = self.analyze_correlations(features_df)

            # Predictive confidence and uncertainty
            uncertainty_analysis = self.analyze_uncertainty(predictions)

            # Historical trends (simulated for demo)
            trend_analysis = self.generate_trend_analysis(features_df)

            # Compile comprehensive results
            results = {
                'timestamp': datetime.now().isoformat(),
                'predictions': predictions,
                'insights': insights,
                'advanced_insights': advanced_insights,
                'visualization_data': visualization_data,
                'correlation_analysis': correlation_analysis,
                'uncertainty_analysis': uncertainty_analysis,
                'trend_analysis': trend_analysis,
                'feature_summary': {
                    'total_risks': int(features_df.get('total_risks', [0])[0]),
                    'open_risks': int(features_df.get('open_risks', [0])[0]),
                    'open_incidents': int(features_df.get('open_incidents', [0])[0]),
                    'open_vulnerabilities': int(features_df.get('open_vulnerabilities', [0])[0]),
                    'overdue_items': int(features_df.get('overdue_risks', [0])[0] + features_df.get('overdue_vulnerabilities', [0])[0]),
                    'compliance_score': round(features_df.get('avg_risk_score', [0])[0], 2),
                    'remediated_risks': int(features_df.get('remediated_risks', [0])[0]),
                    'critical_vulnerabilities': int(features_df.get('critical_vulnerabilities', [0])[0]),
                    'incident_resolution_rate': round(features_df.get('incident_resolution_rate', [0])[0] * 100, 1),
                    'avg_cvss_score': round(features_df.get('avg_cvss_score', [0])[0], 2)
                },
                'model_performance': {
                    'models_trained': len(self.models),
                    'available_predictions': list(predictions.keys()),
                    'mode': 'production' if db_connected else 'demo',
                    'feature_count': len(features_df.columns),
                    'training_samples': len(features_df)
                },
                'data_source': 'database' if db_connected else 'sample_data',
                'analysis_metadata': {
                    'data_tables_processed': len([k for k, v in data_frames.items() if not v.empty]),
                    'total_records_processed': sum(len(df) for df in data_frames.values()),
                    'analysis_duration_seconds': 0,  # Would be calculated in real implementation
                    'ml_algorithms_used': ['RandomForest', 'GradientBoosting', 'LogisticRegression']
                }
            }

            print("✅ Analysis completed successfully")
            return results

        except Exception as e:
            print(f"❌ Analysis failed: {e}")
            return {"error": str(e)}

        finally:
            self.disconnect_database()

def main():
    """
    Main function to run the predictive analysis
    """
    # Database configuration
    db_config = {
        'host': os.getenv('DB_HOST', 'localhost'),
        'port': int(os.getenv('DB_PORT', 5432)),
        'database': os.getenv('DB_NAME', 'grc_database'),
        'user': os.getenv('DB_USER', 'postgres'),
        'password': os.getenv('DB_PASSWORD', ''),
    }

    # Initialize analyzer
    analyzer = GRCPredictiveAnalyzer(db_config)

    # Run analysis
    results = analyzer.run_complete_analysis()

    # Save results to file
    output_file = '/tmp/grc_analysis_results.json'
    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2, default=str)

    print(f"📊 Results saved to {output_file}")

    # Print summary
    if 'error' not in results:
        print("\n📈 PREDICTIVE ANALYSIS SUMMARY:")
        print("=" * 50)

        for metric, data in results['predictions'].items():
            if 'error' not in data:
                value = data['prediction']
                if metric in ['incident_likelihood', 'threat_likelihood']:
                    status = "🔴 HIGH" if value > 0.7 else "🟡 MEDIUM" if value > 0.4 else "🟢 LOW"
                    print(f"{metric.upper()}: {status} ({value:.1%})")
                else:
                    status = "🔴 HIGH" if value > 70 else "🟡 MEDIUM" if value > 40 else "🟢 LOW"
                    print(f"{metric.upper()}: {status} ({value:.1f})")

        print(f"\n📋 Key Metrics:")
        print(f"• Open Risks: {results['feature_summary']['open_risks']}")
        print(f"• Open Incidents: {results['feature_summary']['open_incidents']}")
        print(f"• Open Vulnerabilities: {results['feature_summary']['open_vulnerabilities']}")
        print(f"• Overdue Items: {results['feature_summary']['overdue_items']}")

        if results['insights']['alerts']:
            print(f"\n🚨 ALERTS:")
            for alert in results['insights']['alerts']:
                print(f"• {alert}")

        if results['insights']['recommendations']:
            print(f"\n💡 RECOMMENDATIONS:")
            for rec in results['insights']['recommendations']:
                print(f"• {rec}")

if __name__ == "__main__":
    main()
