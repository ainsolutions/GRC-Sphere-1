# Synthetic Data Generation

This guide explains how to insert synthetic data into your GRC platform for testing and development purposes.

## 📋 Overview

The synthetic data generator creates realistic test data for all major modules:
- **Assets** - IT assets with various types and criticality levels
- **Threats** - Security threats with categories and sources
- **Vulnerabilities** - CVEs with CVSS scores
- **Technology Risks** - Technical risk assessments
- **NIST CSF Risks** - NIST Cybersecurity Framework risks
- **Assessments** - Compliance and security assessments
- **Findings** - Security findings and gaps
- **Incidents** - Security incidents with proper categorization

## 🚀 Quick Start

### Option 1: Using the Admin UI (Recommended)

1. Navigate to: `/admin/insert-data`
2. Configure the number of records for each module
3. Click "Insert Synthetic Data"
4. Wait for completion (usually 10-30 seconds)

### Option 2: Using the Script

Run the script directly:

```bash
npx tsx scripts/run-insert-synthetic-data.ts
```

With custom configuration:

```bash
npx tsx scripts/run-insert-synthetic-data.ts --assets=100 --incidents=50 --findings=100
```

### Option 3: Using the API

Make a POST request to the API:

```bash
curl -X POST http://localhost:3000/api/admin/insert-synthetic-data \
  -H "Content-Type: application/json" \
  -d '{
    "assets": 80,
    "threats": 35,
    "vulnerabilities": 60,
    "technologyRisks": 45,
    "nistCsfRisks": 40,
    "assessments": 30,
    "findings": 75,
    "incidents": 50
  }'
```

## ⚙️ Configuration

### Default Configuration

```javascript
{
  assets: 80,
  threats: 35,
  vulnerabilities: 60,
  technologyRisks: 45,
  nistCsfRisks: 40,
  assessments: 30,
  findings: 75,
  incidents: 50
}
```

### Custom Configuration

You can customize the number of records for each module:

```javascript
{
  assets: 100,           // Number of assets to create
  threats: 50,           // Number of threats
  vulnerabilities: 80,   // Number of vulnerabilities
  technologyRisks: 60,   // Number of tech risks
  nistCsfRisks: 50,     // Number of NIST CSF risks
  assessments: 40,       // Number of assessments
  findings: 100,         // Number of findings
  incidents: 60          // Number of incidents
}
```

## 📊 Data Characteristics

### Assets
- **Types**: Server, Database, Network Device, Application, Cloud Service, Mobile Device, Workstation, IoT Device
- **Criticality**: Critical, High, Medium, Low
- **Status**: Active, Inactive, Maintenance, Retired
- **Departments**: IT, Finance, HR, Operations, Sales, Marketing
- **Locations**: HQ, Branch Office, Data Center, Cloud

### Threats
- **Categories**: Malware, Phishing, DDoS, Insider Threat, Physical Breach, Social Engineering, Supply Chain, Ransomware
- **Sources**: External Hacker, Internal User, Nation State, Competitor, Criminal Organization, Insider
- **Likelihood**: Very Low, Low, Medium, High, Very High
- **Impact**: Very Low, Low, Medium, High, Very High

### Vulnerabilities
- **Types**: SQL Injection, XSS, CSRF, Authentication Bypass, Privilege Escalation, Code Injection, Path Traversal, XXE
- **Severity**: Critical, High, Medium, Low, Info
- **CVSS Scores**: 0.5 to 9.0
- **Status**: Open, In Progress, Resolved, Accepted, Risk Accepted

### Technology Risks
- **Categories**: Infrastructure, Application, Data, Network, Cloud, Mobile, IoT, AI/ML
- **Status**: Open, In Progress, Mitigated, Accepted, Transferred
- **Treatment**: Mitigate, Accept, Transfer, Avoid
- **Risk Scores**: 1-25

### NIST CSF Risks
- **Functions**: Identify, Protect, Detect, Respond, Recover
- **Categories**: Asset Management, Access Control, Data Security, System Monitoring, Incident Response, Recovery Planning
- **Risk Scores**: 1-25

### Assessments
- **Types**: Compliance Assessment, Security Assessment, Privacy Assessment, Risk Assessment, Vulnerability Assessment, Penetration Test, Internal Audit, External Audit
- **Status**: Planning, In Progress, Completed, On Hold, Cancelled
- **Priority**: Low, Medium, High, Critical
- **Frameworks**: ISO 27001, NIST CSF, HIPAA, SOC 2, PCI DSS, GDPR, CIS Controls, COBIT

### Findings
- **Types**: Non-Compliance, Control Gap, Vulnerability, Policy Violation, Configuration Error, Access Control Issue, Data Protection Issue, Incident
- **Severity**: Critical, High, Medium, Low, Info
- **Status**: Open, In Progress, Resolved, Accepted, Closed

### Incidents
- **Types**: Security Breach, System Failure, Phishing, Malware, Data Loss, Performance, Network, Application Error, Hardware Failure, Unauthorized Access
- **Severity**: Critical, High, Medium, Low
- **Status**: Open, In Progress, Resolved, Closed

## 🎯 Use Cases

### Development
- Test UI components with realistic data
- Verify pagination and filtering
- Test search functionality
- Validate data relationships

### Testing
- Load testing with large datasets
- Performance testing
- Integration testing
- User acceptance testing

### Demos
- Client presentations
- Training sessions
- Sales demonstrations
- Feature showcases

## ⚠️ Important Notes

1. **Database**: Data is inserted into your current tenant database
2. **No Deletion**: Existing data will NOT be deleted
3. **Relationships**: All records have realistic relationships and references
4. **Dates**: Randomized within 2024 timeframe
5. **Workflows**: Status values follow proper workflows
6. **Testing Only**: This is for development/testing purposes

## 🔧 Troubleshooting

### Error: "Failed to insert synthetic data"
- Check database connection
- Verify tenant database is accessible
- Check for table existence

### Error: "Duplicate key violation"
- Some records may already exist
- Try reducing the number of records
- Clear existing data first (if safe to do so)

### Performance Issues
- Start with smaller numbers (10-20 per module)
- Increase gradually as needed
- Monitor database performance

## 📝 Example Usage

### Minimal Data (Quick Testing)
```bash
npx tsx scripts/run-insert-synthetic-data.ts --assets=10 --incidents=5
```

### Medium Dataset (Development)
```bash
npx tsx scripts/run-insert-synthetic-data.ts --assets=50 --incidents=25 --findings=50
```

### Large Dataset (Load Testing)
```bash
npx tsx scripts/run-insert-synthetic-data.ts --assets=500 --incidents=200 --findings=500
```

## 🎨 Data Quality

The synthetic data generator creates:
- ✅ Realistic names and descriptions
- ✅ Proper status transitions
- ✅ Valid date ranges
- ✅ Consistent relationships
- ✅ Proper categorization
- ✅ Realistic severity levels
- ✅ Valid risk scores
- ✅ Proper ownership assignments

## 📈 Next Steps

After inserting synthetic data:
1. Navigate to each module to see the data
2. Test filtering and search functionality
3. Verify dashboard calculations
4. Test report generation
5. Validate data relationships

## 🔐 Security Note

This tool is for development and testing only. Do NOT use in production environments without proper safeguards.

---

**Need Help?** Check the console logs for detailed insertion progress and any errors.


