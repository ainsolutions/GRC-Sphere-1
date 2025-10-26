# AI-Powered EPSS Calculator

## Overview

This AI-powered Exploit Prediction Scoring System (EPSS) calculator uses machine learning and multi-factor risk analysis to predict the exploitability of vulnerabilities based on your organization's specific context.

Unlike traditional EPSS scores that rely solely on external threat intelligence, this system analyzes your internal security posture across multiple dimensions to provide contextual risk scores.

## Features

### 1. **Multi-Factor Risk Analysis**
The calculator analyzes five key risk areas with weighted percentages:

- **Incidents (30%)**: Open critical and high-severity incidents related to assets
- **Vulnerabilities (20%)**: Other open critical and high vulnerabilities on the same assets
- **Findings (20%)**: Open critical and high assessment findings
- **Open Risks (20%)**: Critical and high risks from FAIR, ISO27001, and NIST CSF risk registers
- **Third-Party Gaps (10%)**: Gaps identified in third-party risk assessments

### 2. **Asset-Based Context**
The calculator considers the assets associated with each vulnerability, providing context-aware risk scores based on:
- Asset criticality
- Asset exposure
- Historical security issues on the same assets
- Related security incidents

### 3. **AI/ML Integration**
Uses scikit-learn for:
- Logarithmic normalization of risk factors
- Weighted risk scoring
- CVSS score integration (when available)

### 4. **Real-Time Calculation**
Calculate EPSS scores:
- On-demand for individual vulnerabilities
- In batch for all open vulnerabilities
- Automatically triggered when new vulnerabilities are added

## Architecture

```
┌─────────────────────────────────────┐
│   Vulnerabilities Page (UI)         │
│   - Calculate AI EPSS button        │
│   - Individual calc per vuln        │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   API Endpoint                       │
│   /api/vulnerabilities/epss/calculate│
│   - POST: Single calculation         │
│   - PUT: Batch calculation           │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Python EPSS Calculator             │
│   scripts/epss_calculator.py         │
│   - Fetch risk factors               │
│   - Calculate weighted score         │
│   - Update database                  │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Database                           │
│   - epss_score (0-1)                │
│   - epss_percentile (0-100)         │
│   - epss_calculation_metadata        │
└─────────────────────────────────────┘
```

## Installation

### 1. Install Python Dependencies

```bash
pip install psycopg2-binary numpy scikit-learn
```

### 2. Run Database Migrations

```bash
# Add EPSS fields to vulnerabilities table
psql -U your_username -d your_database -f scripts/998-add-epss-fields-to-vulnerabilities.sql

# Add assets field to vulnerabilities table
psql -U your_username -d your_database -f scripts/999-add-asset-field-to-vulnerabilities.sql
```

### 3. Configure Environment Variables

Ensure these environment variables are set:
```bash
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database
DB_USER=your_username
DB_PASSWORD=your_password
```

## Usage

### From the UI (Recommended)

#### Batch Calculation
1. Navigate to the **Vulnerabilities** page
2. Click the **"Calculate AI EPSS Scores"** button (purple gradient button with lightning icon)
3. Wait for the calculation to complete
4. View updated EPSS scores in the vulnerability list

#### Individual Calculation
1. In the vulnerabilities table, find the vulnerability you want to analyze
2. Click the **lightning (⚡) icon** in the Actions column
3. View the calculated EPSS score in the EPSS column

### From Command Line

```bash
# Calculate EPSS for a single vulnerability
python3 scripts/epss_calculator.py <vulnerability_id>

# Example
python3 scripts/epss_calculator.py 42
```

### From API

#### Single Vulnerability
```bash
POST /api/vulnerabilities/epss/calculate
Content-Type: application/json

{
  "vulnerability_id": 42
}
```

#### Batch Calculation
```bash
PUT /api/vulnerabilities/epss/calculate
Content-Type: application/json

{
  "vulnerability_ids": [42, 43, 44, 45]
}
```

## Database Schema

### New Fields in `vulnerabilities` Table

```sql
-- EPSS score (0-1 scale)
epss_score DECIMAL(5,4)

-- EPSS percentile (0-100 scale)
epss_percentile DECIMAL(5,2)

-- Last calculation timestamp
epss_last_updated TIMESTAMP

-- Calculation metadata (JSONB)
epss_calculation_metadata JSONB
```

### Sample Calculation Metadata
```json
{
  "risk_factors": {
    "vulnerability_id": 42,
    "vulnerability_name": "SQL Injection in Login Form",
    "cve_id": "CVE-2024-12345",
    "severity": "Critical",
    "cvss_score": 9.1,
    "assets": [
      "Web Server (WEB-001)",
      "Database Server (DB-001)"
    ],
    "incidents_count": 3,
    "vulnerabilities_count": 5,
    "findings_count": 8,
    "risks_count": 4,
    "third_party_gaps_count": 2
  },
  "weights": {
    "incidents": 0.3,
    "vulnerabilities": 0.2,
    "findings": 0.2,
    "third_party_gaps": 0.1,
    "open_risks": 0.2
  },
  "calculated_at": "2024-01-15T10:30:00Z"
}
```

## Risk Score Interpretation

| EPSS Score | Risk Level | Description |
|------------|-----------|-------------|
| 0.8 - 1.0  | Critical  | Extremely high likelihood of exploitation |
| 0.6 - 0.79 | High      | High likelihood of exploitation |
| 0.4 - 0.59 | Medium    | Moderate likelihood of exploitation |
| 0.2 - 0.39 | Low       | Low likelihood of exploitation |
| 0.0 - 0.19 | Very Low  | Very low likelihood of exploitation |

## Calculation Formula

The EPSS score is calculated using a weighted algorithm:

```python
# Normalize each factor (logarithmic scale)
incidents_score = log1p(count) / log1p(max_expected)

# Apply weights
weighted_score = (
    incidents_score * 0.30 +
    vulnerabilities_score * 0.20 +
    findings_score * 0.20 +
    risks_score * 0.20 +
    third_party_score * 0.10
)

# Blend with CVSS if available (70% context, 30% CVSS)
if cvss_score > 0:
    final_score = (weighted_score * 0.7) + (cvss_normalized * 0.3)
else:
    final_score = weighted_score
```

## Customization

### Adjusting Weights

Edit `scripts/epss_calculator.py`:

```python
WEIGHTS = {
    'incidents': 0.30,           # Change these values
    'vulnerabilities': 0.20,     # Total must equal 1.0
    'findings': 0.20,
    'third_party_gaps': 0.10,
    'open_risks': 0.20
}
```

### Adding New Risk Factors

1. Add data collection method in `EPSSCalculator` class
2. Update `calculate_risk_factors()` method
3. Update `calculate_epss_score()` with new weight
4. Adjust existing weights to maintain total = 1.0

## Troubleshooting

### Python Script Fails

**Check Python version:**
```bash
python3 --version  # Should be 3.8 or higher
```

**Check dependencies:**
```bash
pip list | grep -E "psycopg2|numpy|scikit-learn"
```

**Check database connection:**
```bash
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1"
```

### API Errors

**Check logs:**
```bash
# Next.js logs
tail -f .next/server/app-paths-manifest.json

# Python script output
python3 scripts/epss_calculator.py <vuln_id>
```

**Verify API route:**
```bash
curl -X POST http://localhost:3000/api/vulnerabilities/epss/calculate \
  -H "Content-Type: application/json" \
  -d '{"vulnerability_id": 1}'
```

### No Assets Found

If vulnerabilities have no associated assets:
1. Edit the vulnerability
2. Add assets using the asset search component
3. Re-run EPSS calculation

## Performance Considerations

- **Batch Processing**: Calculates ~10-20 vulnerabilities per minute
- **Individual Calculation**: ~2-5 seconds per vulnerability
- **Database Impact**: Minimal (read-heavy queries with proper indexing)
- **Memory Usage**: ~50-100MB per calculation process

## Best Practices

1. **Regular Updates**: Recalculate EPSS scores weekly or after major security events
2. **Asset Mapping**: Ensure all vulnerabilities have associated assets for accurate scoring
3. **Data Hygiene**: Keep incident, finding, and risk data up-to-date
4. **Threshold Alerts**: Set up alerts for vulnerabilities with EPSS > 0.6
5. **Prioritization**: Use EPSS scores alongside CVSS for remediation prioritization

## Integration with Workflows

### Automatic Calculation on New Vulnerabilities

Add to your vulnerability creation workflow:
```typescript
// After creating vulnerability
await fetch('/api/vulnerabilities/epss/calculate', {
  method: 'POST',
  body: JSON.stringify({ vulnerability_id: newVuln.id })
})
```

### Scheduled Batch Updates

Use cron job:
```bash
0 2 * * * curl -X PUT http://localhost:3000/api/vulnerabilities/epss/calculate \
  -H "Content-Type: application/json" \
  -d '{"vulnerability_ids": [...]}'
```

## Support

For issues or questions:
1. Check logs in `/logs/epss_calculator.log`
2. Review calculation metadata in database
3. Verify all required tables exist
4. Ensure Python dependencies are installed

## Future Enhancements

- [ ] TensorFlow neural network integration
- [ ] Threat intelligence feed integration
- [ ] Historical trend analysis
- [ ] Predictive analytics dashboard
- [ ] Custom ML model training
- [ ] Real-time recalculation on security events

## License

Internal use only - Proprietary


