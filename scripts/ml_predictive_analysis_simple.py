#!/usr/bin/env python3
"""
Simplified ML Predictive Analysis for GRC System
===============================================

This is a simplified version that works without database connection
for testing and demonstration purposes.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import warnings
warnings.filterwarnings('ignore')

# Machine Learning imports
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, mean_squared_error, accuracy_score
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

class SimpleGRCPredictiveAnalyzer:
    """
    Simplified predictive analysis system for GRC data
    """

    def __init__(self):
        """
        Initialize the predictive analyzer
        """
        self.models = {}
        self.scalers = {}
        self.encoders = {}

    def generate_sample_data(self):
        """
        Generate sample GRC data for demonstration
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

    def feature_engineering(self, data_frames):
        """
        Perform feature engineering on the sample data
        """
        print("🔧 Performing feature engineering...")

        # Initialize master DataFrame
        master_df = pd.DataFrame()

        # Process each data source and create features
        features = {}

        # 1. Risk-related features
        if not data_frames['risks'].empty:
            risk_df = data_frames['risks'].copy()
            risk_df['due_date'] = pd.to_datetime(risk_df['due_date'])
            risk_df['created_at'] = pd.to_datetime(risk_df['created_at'])
            risk_df['risk_overdue_days'] = (pd.to_datetime('today') - risk_df['due_date']).dt.days
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
            incident_df['created_at'] = pd.to_datetime(incident_df['created_at'])
            incident_df['incident_age_days'] = (pd.to_datetime('today') - incident_df['created_at']).dt.days

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
            vuln_df['due_date'] = pd.to_datetime(vuln_df['due_date'])
            vuln_df['discovered_at'] = pd.to_datetime(vuln_df['discovered_at'])
            vuln_df['vuln_overdue_days'] = (pd.to_datetime('today') - vuln_df['due_date']).dt.days
            vuln_df['vuln_overdue_days'] = vuln_df['vuln_overdue_days'].clip(lower=0)

            features.update({
                'total_vulnerabilities': len(vuln_df),
                'open_vulnerabilities': len(vuln_df[vuln_df['status'] != 'closed']),
                'critical_vulnerabilities': len(vuln_df[vuln_df['severity'].isin(['critical', 'high'])]),
                'avg_cvss_score': vuln_df['cvss_score'].mean(),
                'overdue_vulnerabilities': len(vuln_df[vuln_df['vuln_overdue_days'] > 0]),
                'remediated_vulnerabilities': len(vuln_df[vuln_df['remediation_status'] == 'completed'])
            })

        # Fill NaN values
        master_df = pd.DataFrame([features])
        master_df = master_df.fillna(0)

        print("✅ Feature engineering completed")
        return master_df

    def train_predictive_models(self, features_df):
        """
        Train predictive models with sample data
        """
        print("🤖 Training predictive models...")

        # Create synthetic target variables for demonstration
        np.random.seed(42)

        # Risk exposure target
        risk_exposure = min(max(features_df['avg_risk_score'].iloc[0] + features_df['open_risks'].iloc[0] * 2, 0), 100)
        compliance_level = min(max(85 - features_df['open_vulnerabilities'].iloc[0] * 0.5, 0), 100)
        incident_likelihood = min(features_df['open_incidents'].iloc[0] * 3 + features_df['critical_incidents'].iloc[0] * 5, 100) / 100
        threat_likelihood = min(features_df['open_vulnerabilities'].iloc[0] * 2 + features_df['critical_vulnerabilities'].iloc[0] * 3, 100) / 100

        targets = {
            'risk_exposure': [risk_exposure],
            'compliance_level': [compliance_level],
            'incident_likelihood': [incident_likelihood],
            'threat_likelihood': [threat_likelihood]
        }

        models_config = {
            'risk_exposure': {
                'model': RandomForestRegressor(n_estimators=10, random_state=42),
                'type': 'regression'
            },
            'compliance_level': {
                'model': RandomForestRegressor(n_estimators=10, random_state=42),
                'type': 'regression'
            },
            'incident_likelihood': {
                'model': RandomForestClassifier(n_estimators=10, random_state=42),
                'type': 'classification'
            },
            'threat_likelihood': {
                'model': GradientBoostingClassifier(n_estimators=10, random_state=42),
                'type': 'classification'
            }
        }

        for target_name, target_values in targets.items():
            if target_name in models_config:
                try:
                    # For demonstration, we'll use the same features for all models
                    X = features_df
                    y = target_values

                    model_config = models_config[target_name]
                    model_config['model'].fit(X, y)

                    self.models[target_name] = model_config['model']
                    print(f"✅ {target_name} model trained successfully")

                except Exception as e:
                    print(f"❌ Failed to train {target_name} model: {e}")

    def generate_predictions(self, features_df):
        """
        Generate predictions using trained models
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
                        'confidence': 0.8
                    }

                print(f"✅ Generated prediction for {model_name}")

            except Exception as e:
                print(f"❌ Failed to generate prediction for {model_name}: {e}")
                predictions[model_name] = {
                    'prediction': 0.0,
                    'error': str(e)
                }

        return predictions

    def generate_insights(self, features_df, predictions):
        """
        Generate insights based on predictions
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
                insights['risk_assessment'] = {'level': 'CRITICAL', 'color': 'red'}
                insights['recommendations'].append("Immediate risk mitigation required")
                insights['alerts'].append("High risk exposure detected")
            elif risk_score > 40:
                insights['risk_assessment'] = {'level': 'HIGH', 'color': 'orange'}
                insights['recommendations'].append("Enhanced monitoring and controls needed")
            else:
                insights['risk_assessment'] = {'level': 'MODERATE', 'color': 'yellow'}

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

        insights['trends'] = {
            'open_items_trend': 'increasing' if features_df.get('open_risks', [0])[0] > 10 else 'stable',
            'remediation_effectiveness': 'good' if features_df.get('remediated_risks', [0])[0] > features_df.get('total_risks', [0])[0] * 0.7 else 'needs_improvement',
            'compliance_trend': 'improving' if features_df.get('avg_cvss_score', [0])[0] < 7 else 'needs_attention'
        }

        return insights

    def run_demo_analysis(self):
        """
        Run the complete demo analysis pipeline
        """
        try:
            print("🚀 Starting GRC Predictive Analysis Demo...")
            print("=" * 60)

            # Generate sample data
            data_frames = self.generate_sample_data()

            # Feature engineering
            features_df = self.feature_engineering(data_frames)

            # Train models
            self.train_predictive_models(features_df)

            # Generate predictions
            predictions = self.generate_predictions(features_df)

            # Generate insights
            insights = self.generate_insights(features_df, predictions)

            # Create comprehensive results
            results = {
                'timestamp': datetime.now().isoformat(),
                'predictions': predictions,
                'insights': insights,
                'feature_summary': {
                    'total_risks': int(features_df.get('total_risks', [0])[0]),
                    'open_risks': int(features_df.get('open_risks', [0])[0]),
                    'open_incidents': int(features_df.get('open_incidents', [0])[0]),
                    'open_vulnerabilities': int(features_df.get('open_vulnerabilities', [0])[0]),
                    'overdue_items': int(features_df.get('overdue_risks', [0])[0] + features_df.get('overdue_vulnerabilities', [0])[0]),
                    'compliance_score': round(features_df.get('avg_risk_score', [0])[0], 2)
                },
                'model_performance': {
                    'models_trained': len(self.models),
                    'available_predictions': list(predictions.keys()),
                    'demo_mode': True
                }
            }

            print("\n✅ Demo analysis completed successfully!")

            # Save results
            with open('/tmp/grc_demo_analysis_results.json', 'w') as f:
                json.dump(results, f, indent=2, default=str)

            return results

        except Exception as e:
            print(f"❌ Demo analysis failed: {e}")
            return {"error": str(e)}

def main():
    """
    Main function to run the demo analysis
    """
    print("🤖 GRC Predictive Analysis - Demo Mode")
    print("======================================")

    # Initialize analyzer
    analyzer = SimpleGRCPredictiveAnalyzer()

    # Run demo analysis
    results = analyzer.run_demo_analysis()

    # Print summary
    if 'error' not in results:
        print("\n📈 DEMO PREDICTIVE ANALYSIS SUMMARY:")
        print("=" * 50)

        for metric, data in results['predictions'].items():
            if 'error' not in data:
                value = data['prediction']
                if metric in ['incident_likelihood', 'threat_likelihood']:
                    status = "🔴 HIGH" if value > 0.7 else "🟡 MEDIUM" if value > 0.4 else "🟢 LOW"
                    print(f"{metric.upper().replace('_', ' '):20}: {status} ({value:.1%})")
                else:
                    status = "🔴 HIGH" if value > 70 else "🟡 MEDIUM" if value > 40 else "🟢 LOW"
                    print(f"{metric.upper().replace('_', ' '):20}: {status} ({value:.1f})")

        print(f"\n📋 Demo Metrics:")
        print(f"• Sample Risks: {results['feature_summary']['total_risks']}")
        print(f"• Open Risks: {results['feature_summary']['open_risks']}")
        print(f"• Open Incidents: {results['feature_summary']['open_incidents']}")
        print(f"• Open Vulnerabilities: {results['feature_summary']['open_vulnerabilities']}")

        if results['insights']['alerts']:
            print(f"\n🚨 Demo Alerts:")
            for alert in results['insights']['alerts']:
                print(f"• {alert}")

        if results['insights']['recommendations']:
            print(f"\n💡 Demo Recommendations:")
            for rec in results['insights']['recommendations']:
                print(f"• {rec}")

        print(f"\n💾 Results saved to: /tmp/grc_demo_analysis_results.json")
        print("🌐 In production, these results would be served via the /api/ml-analysis endpoint")
    else:
        print(f"❌ Analysis failed: {results['error']}")

if __name__ == "__main__":
    main()
