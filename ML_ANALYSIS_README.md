# 🤖 Machine Learning Predictive Analysis for GRC

## Overview

This system provides comprehensive machine learning-based predictive analysis for Governance, Risk, and Compliance (GRC) data. It uses advanced algorithms to predict risk exposure, compliance levels, incident likelihood, and threat likelihood based on historical data and current indicators.

## 🚀 Key Features

### Predictive Models
- **Risk Exposure Prediction**: Forecasts overall risk levels using historical patterns
- **Compliance Level Forecasting**: Predicts compliance scores and identifies gaps
- **Incident Likelihood Assessment**: Estimates probability of future security incidents
- **Threat Likelihood Analysis**: Evaluates threat potential based on vulnerability data

### Data Sources
The system analyzes data from multiple GRC tables:
- Risks (status, remediation, overdue items)
- Incidents (frequency, severity, resolution times)
- Vulnerabilities (CVSS scores, remediation status)
- Controls (effectiveness, implementation status)
- Compliance (framework scores, audit results)
- Findings (severity, remediation status)
- Assessments (completion rates, scores)
- Threats (likelihood, impact scores)
- Technology Risks (risk levels, remediation)
- Assets (criticality, compliance status)

## 📊 Predictive Metrics

### 1. Risk Exposure Score (0-100)
- **High (>70)**: Critical risk requiring immediate attention
- **Medium (40-70)**: Moderate risk needing monitoring
- **Low (<40)**: Acceptable risk levels

### 2. Compliance Level (0-100%)
- **Excellent (90-100%)**: Strong compliance posture
- **Good (70-89%)**: Adequate compliance with minor gaps
- **Needs Attention (50-69%)**: Compliance improvement required
- **Critical (<50%)**: Immediate compliance remediation needed

### 3. Incident Likelihood (0-100%)
- **High (>70%)**: High probability of incidents
- **Medium (40-70%)**: Moderate incident risk
- **Low (<40%)**: Low incident probability

### 4. Threat Likelihood (0-100%)
- **High (>70%)**: High threat potential from vulnerabilities
- **Medium (40-70%)**: Moderate threat risk
- **Low (<40%)**: Low threat likelihood

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- PostgreSQL database
- Node.js (for the web interface)

### 1. Database Setup
```bash
# Run the database schema setup
psql [your-database-url] -f scripts/create-policy-management-schema.sql
```

### 2. Python Environment Setup
```bash
# Make the setup script executable
chmod +x scripts/setup-ml-environment.sh

# Run the setup script
./scripts/setup-ml-environment.sh
```

This will:
- Create a Python virtual environment (`ml_env/`)
- Install all required dependencies
- Create an activation script (`activate_ml_env.sh`)

### 3. Environment Configuration
Create/update your `.env.local` file:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/database_name
DB_HOST=localhost
DB_PORT=5432
DB_NAME=grc_database
DB_USER=your_username
DB_PASSWORD=your_password
```

### 4. Activate ML Environment
```bash
# Activate the ML environment
source activate_ml_env.sh
```

## 🎯 Usage

### Web Interface
1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to the AI Analysis page:
   ```
   http://localhost:3000/ai-analysis
   ```

3. Click "Refresh" to run a new predictive analysis

### Command Line
```bash
# Activate ML environment
source activate_ml_env.sh

# Run predictive analysis
python scripts/ml_predictive_analysis.py
```

### API Integration
```bash
# GET analysis results
curl http://localhost:3000/api/ml-analysis

# POST custom analysis
curl -X POST http://localhost:3000/api/ml-analysis \
  -H "Content-Type: application/json" \
  -d '{"analysis_type": "full", "parameters": {}}'
```

## 📈 Feature Engineering

The system creates comprehensive features from raw data:

### Temporal Features
- **Overdue Days**: Days past due dates for risks, vulnerabilities, findings
- **Age Analysis**: Time-based analysis of incidents and assessments
- **Trend Indicators**: Recent activity patterns

### Status-Based Features
- **Open vs Closed**: Ratios of open items across all categories
- **Remediation Status**: Effectiveness of remediation efforts
- **Completion Rates**: Assessment and procedure completion metrics

### Severity Features
- **Critical Item Counts**: Number of high-severity items
- **Risk Scoring**: Aggregated risk scores across categories
- **Compliance Metrics**: Framework compliance percentages

### Relationship Features
- **Asset- Vulnerability Links**: Assets affected by vulnerabilities
- **Risk- Control Mapping**: Controls addressing specific risks
- **Threat- Vulnerability Correlation**: Threat potential from vulnerabilities

## 🤖 Machine Learning Models

### Model Architecture
- **Random Forest**: For risk exposure and compliance prediction
- **Gradient Boosting**: For threat likelihood analysis
- **Logistic Regression**: For incident likelihood classification

### Training Strategy
- **Feature Selection**: Automated feature importance analysis
- **Cross-Validation**: 5-fold cross-validation for model validation
- **Hyperparameter Tuning**: Grid search for optimal parameters
- **Ensemble Methods**: Multiple models for robust predictions

### Model Evaluation
- **Accuracy Metrics**: Classification accuracy and F1 scores
- **Regression Metrics**: Mean squared error and R² scores
- **Feature Importance**: Analysis of most influential features
- **Confidence Intervals**: Prediction confidence levels

## 📊 Output Analysis

### Prediction Results
```json
{
  "predictions": {
    "risk_exposure": {
      "prediction": 65.4,
      "confidence": 0.85
    },
    "compliance_level": {
      "prediction": 78.2,
      "confidence": 0.92
    },
    "incident_likelihood": {
      "prediction": 0.45,
      "probabilities": [0.55, 0.45],
      "confidence": 0.78
    },
    "threat_likelihood": {
      "prediction": 0.32,
      "probabilities": [0.68, 0.32],
      "confidence": 0.81
    }
  }
}
```

### Insights & Recommendations
- **Critical Alerts**: Immediate action items
- **AI Recommendations**: Data-driven improvement suggestions
- **Trend Analysis**: Historical pattern identification
- **Risk Assessment**: Overall risk posture evaluation

## 🔧 Configuration

### Model Parameters
Modify `scripts/ml_predictive_analysis.py`:
```python
# Adjust model parameters
models_config = {
    'risk_exposure': {
        'model': RandomForestRegressor(
            n_estimators=200,  # Increase for better accuracy
            max_depth=10,      # Control overfitting
            random_state=42
        ),
        'type': 'regression'
    }
}
```

### Feature Selection
Customize feature engineering:
```python
def custom_feature_engineering(self, data_frames):
    # Add your custom features
    features['custom_metric'] = calculate_custom_metric(data_frames)
    return features
```

### Database Queries
Modify data extraction queries in `fetch_data_from_tables()`:
```python
'table_name': """
    SELECT custom_fields
    FROM table_name
    WHERE custom_conditions
""",
```

## 📋 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check database status
psql -h localhost -U your_user -d your_database

# Verify DATABASE_URL
echo $DATABASE_URL
```

#### 2. Python Dependencies Missing
```bash
# Reinstall dependencies
source activate_ml_env.sh
pip install -r scripts/requirements-ml.txt
```

#### 3. Model Training Errors
- Check data quality and completeness
- Verify feature engineering logic
- Ensure sufficient training data

#### 4. Web Interface Not Loading
```bash
# Check Next.js server
npm run dev

# Verify API endpoints
curl http://localhost:3000/api/ml-analysis
```

### Performance Optimization

#### Data Processing
- **Batch Processing**: Process large datasets in chunks
- **Memory Management**: Optimize memory usage for large datasets
- **Caching**: Cache frequently accessed data

#### Model Training
- **Incremental Learning**: Update models with new data
- **Feature Reduction**: Remove low-importance features
- **Parallel Processing**: Utilize multiple CPU cores

## 📚 API Reference

### GET /api/ml-analysis
Returns the latest predictive analysis results.

**Response:**
```json
{
  "success": true,
  "analysis": {
    "predictions": {...},
    "insights": {...},
    "feature_summary": {...},
    "model_performance": {...}
  },
  "metadata": {
    "executed_at": "2024-01-15T10:30:00Z",
    "execution_time": "completed"
  }
}
```

### POST /api/ml-analysis
Runs a custom predictive analysis.

**Request:**
```json
{
  "analysis_type": "full",
  "parameters": {
    "time_range": "30d",
    "include_historical": true
  }
}
```

## 🔐 Security Considerations

### Data Privacy
- All analysis is performed locally
- No external data transmission
- Secure database connections

### Model Security
- Input validation and sanitization
- Secure model serialization
- Access control for predictions

## 📈 Future Enhancements

### Planned Features
- **Real-time Predictions**: Streaming analysis for live data
- **Deep Learning Models**: Neural networks for complex patterns
- **Anomaly Detection**: Unsupervised learning for unusual patterns
- **Predictive Maintenance**: Equipment and system failure prediction
- **Natural Language Processing**: Text analysis of findings and reports

### Advanced Analytics
- **Time Series Forecasting**: Trend prediction over time
- **Causal Inference**: Cause-effect relationship analysis
- **Network Analysis**: Relationship mapping between entities
- **Sentiment Analysis**: Stakeholder sentiment from feedback

## 🤝 Contributing

### Development Guidelines
1. Follow PEP 8 Python style guidelines
2. Add comprehensive docstrings
3. Include unit tests for new features
4. Update documentation for API changes

### Testing
```bash
# Run unit tests
python -m pytest tests/

# Run integration tests
python -m pytest tests/integration/
```

## 📞 Support

For technical support or questions about the ML predictive analysis system:

1. Check the troubleshooting section above
2. Review the API documentation
3. Examine the Python script logs
4. Verify database connectivity

## 📄 License

This ML analysis system is part of the GRC (Governance, Risk, Compliance) platform.

---

**Last Updated**: January 15, 2024
**Version**: 1.0.0
**Python Version**: 3.8+
**ML Libraries**: scikit-learn, XGBoost, pandas, numpy
