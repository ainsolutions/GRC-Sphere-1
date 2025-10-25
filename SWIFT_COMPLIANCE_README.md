# SWIFT Customer Security Programme (CSP) Compliance Module

## Overview

The SWIFT Compliance Module is a comprehensive solution for managing SWIFT Customer Security Programme (CSP) compliance assessments, control evaluations, and attestation management for financial institutions using the SWIFT network.

## What is SWIFT CSP?

SWIFT CSP (Customer Security Programme) is a mandatory security framework for all financial institutions connected to the SWIFT network. It requires:
- Annual self-attestation of security controls
- Compliance with mandatory security controls
- Consideration of advisory controls
- Regular security assessments
- Remediation of identified gaps

## Module Structure

Following the same architecture as ISO27001 compliance assessment:

### 🎯 Four-Tab Workflow

1. **Assessment** - Create and manage SWIFT CSP assessments
2. **Self Assessment** - Evaluate individual SWIFT controls in table format
3. **Gap Analysis** - Analyze identified gaps and compliance status
4. **Remediation Tracking** - Track and close SWIFT compliance gaps

### 🔗 Data Relationships

```
SWIFT Assessment (1)
    ├── SWIFT Control Assessments (Many)
    │   └── SWIFT Gap Remediation (Many)
    │
    └── Assets (JSONB Array)
```

## SWIFT CSP Control Categories

The module supports the three main SWIFT CSP control categories:

### 1. **Architecture Security** (Controls 1.x - 2.x)
- Restrict Internet Access (1.1)
- Protect Critical Systems (1.2)
- Secure Local Environment (2.1)
- Protect Operator PCs (2.2)
- Virtualisation Security (2.3)
- Operator Session Confidentiality (2.4)
- Back-office Data Flow Security (2.5)
- Physical and Logical Separation (2.7)
- Transaction Business Flow Security (2.8)
- Middleware Security (2.9)

### 2. **Access Control** (Controls 3.x - 6.x)
- Operating System Access Control (3.1)
- Database Access Control (3.2)
- Password Complexity (4.1)
- Multi-Factor Authentication (4.2)
- Account Management (5.1)
- Privilege Management (5.2)
- Token Management (6.1)
- Certificate Management (6.2)
- Key Management (6.3)
- Hardware Security Modules (6.4)

### 3. **Operational Security** (Controls 7.x)
- Logging and Monitoring (7.1)
- System Integrity (7.2)
- Software Integrity (7.3)
- Malware Protection (7.4)
- System Hardening (7.5)
- Security Updates (7.6)

## Database Schema

### Tables Created

#### 1. **swift_assessments**
Main SWIFT CSP assessment records

**Key Fields:**
- `assessment_id` - Format: SWIFT-YYYY-XXXXX
- `swift_bic_code` - Bank Identifier Code (8 or 11 characters)
- `swift_community_version` - CSP v2024, v2023, etc.
- `attestation_status` - Pending, Submitted, Validated, Rejected
- `overall_compliance_score` - Auto-calculated (0-100)
- `mandatory_controls` - Count of mandatory controls
- `advisory_controls` - Count of advisory controls
- `assets` - JSONB array of SWIFT-related assets

#### 2. **swift_control_assessments**
Individual SWIFT CSP control evaluations

**Key Fields:**
- `swift_assessment_id` - Foreign key to parent assessment
- `control_id` - SWIFT control identifier (e.g., 1.1, 2.3A, 6.2)
- `control_type` - Mandatory or Advisory
- `implementation_status` - Compliant, Partially Compliant, Non-Compliant, Not Applicable
- `compliance_level` - Full, Substantial, Partial, None
- `maturity_level` - Initial, Developing, Defined, Managed, Optimized
- `effectiveness_rating` - Effective, Partially Effective, Ineffective, Not Tested
- `gap_identified` - Boolean flag
- `remediation_required` - Boolean flag

#### 3. **swift_gap_remediation**
Gap remediation tracking

**Key Fields:**
- `gap_id` - Format: SWIFT-GAP-YYYY-XXXXX
- `swift_assessment_id` - Link to parent assessment
- `swift_control_id` - Link to control that identified the gap
- `gap_severity` - Critical, High, Medium, Low
- `remediation_status` - Open, In Progress, Under Review, Completed, Verified, Closed
- `progress_percentage` - 0-100
- `attestation impact` - How gap affects annual attestation

## Installation

### 1. Run Database Migration

```bash
# Create SWIFT compliance schema
psql -U your_user -d your_db -f scripts/994-create-swift-compliance-schema.sql

# Add menu item
psql -U your_user -d your_db -f scripts/993-add-swift-compliance-menu-item.sql
```

### 2. Verify Tables Created

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE 'swift_%';
```

Expected output:
- swift_assessments
- swift_control_assessments
- swift_gap_remediation

### 3. Verify Menu Item

Navigate to: **IS Compliance → SWIFT Compliance**

## Usage Guide

### Creating a SWIFT Assessment

1. **Navigate** to IS Compliance → SWIFT Compliance
2. **Click** "New SWIFT Assessment"
3. **Fill in** required fields:
   - Assessment Name * (e.g., "SWIFT CSP Annual Attestation 2024")
   - SWIFT BIC Code * (e.g., "ABNANL2A" or "ABNANL2AXXX")
   - CSP Version (e.g., "CSP v2024")
   - Assessment Type (Annual, Pre-audit, Post-incident, etc.)
   - SWIFT Environment (Production, Test, Both)
   - Message Volume Category
4. **Add Assets**:
   - SWIFT Alliance Access
   - SWIFTNet Link
   - Alliance Lite2
   - Alliance Cloud
   - HSM (Hardware Security Modules)
   - Back-office systems
5. **Assign** Assessor and Reviewer
6. **Click** "Create SWIFT Assessment"

### Evaluating SWIFT CSP Controls

1. **Switch** to "Self Assessment" tab
2. **Click** "Add Control"
3. **Enter** control details:
   - Control ID (e.g., 1.1, 2.3A, 6.2)
   - Control Objective (what the control aims to achieve)
   - Control Type (Mandatory or Advisory)
   - Category (Architecture Security, Access Control, Operational Security)
   - Implementation Status
   - Compliance Level
   - Evidence Collected
4. **Mark** "Remediation Required" if gaps found
5. **Save** control
6. **Repeat** for all applicable SWIFT CSP controls

### Typical SWIFT Control Count

- **Total Controls**: ~26 controls (varies by CSP version)
- **Mandatory Controls**: ~20-22
- **Advisory Controls**: ~4-6

### Managing Gap Remediation

1. **Switch** to "Remediation Tracking" tab
2. **Prerequisites**: Controls with remediation requirements
3. **Click** "Add Gap"
4. **Select** associated SWIFT control
5. **Fill in**:
   - Gap Title and Description
   - Gap Severity (impacts attestation)
   - Remediation Action and Plan
   - Owner and Department
   - Due Date (before annual attestation deadline)
   - Priority
6. **Track** progress to closure
7. **Update** status: Open → In Progress → Completed → Verified → Closed

## SWIFT-Specific Features

### BIC Code Validation
- Accepts 8 or 11 character codes
- Auto-converts to uppercase
- Format: AAAABBCCXXX
  - AAAA: Bank code
  - BB: Country code
  - CC: Location code
  - XXX: Branch code (optional)

### Message Volume Categories
- **Low**: < 1,000 messages/day
- **Medium**: 1,000 - 10,000 messages/day
- **High**: > 10,000 messages/day

### CSP Versions Supported
- CSP v2024 (latest)
- CSP v2023
- CSP v2022

### Assessment Types
- **Annual Attestation**: Required yearly self-assessment
- **Pre-audit**: Preparation before external audit
- **Post-incident**: After security incident
- **Ad-hoc**: On-demand assessment
- **Internal**: Internal audit/review

### Attestation Workflow

```
Assessment Creation
  ↓
Control Evaluation
  ↓
Gap Identification
  ↓
Remediation (if required)
  ↓
Management Review
  ↓
Attestation Submission
  ↓
SWIFT Validation
```

## Compliance Scoring

### Calculation Formula

```javascript
// Mandatory controls weighted higher
const totalMandatoryControls = controls.filter(c => c.type === 'Mandatory').length
const compliantMandatory = controls.filter(c => 
  c.type === 'Mandatory' && c.status === 'Compliant'
).length

// Advisory controls count but weighted less
const totalAdvisoryControls = controls.filter(c => c.type === 'Advisory').length
const compliantAdvisory = controls.filter(c => 
  c.type === 'Advisory' && c.status === 'Compliant'
).length

// Calculate score (Mandatory: 80%, Advisory: 20%)
mandatoryScore = (compliantMandatory / totalMandatoryControls) * 80
advisoryScore = (compliantAdvisory / totalAdvisoryControls) * 20
overallScore = mandatoryScore + advisoryScore

// Partial compliance counts as 50%
```

### Attestation Requirements

**Cannot Attest if:**
- Any mandatory control is Non-Compliant
- Critical or High severity gaps remain open
- Evidence is insufficient
- Testing not completed

**Can Attest with Conditions if:**
- Mandatory controls are Compliant or Partially Compliant
- Gaps have documented remediation plans
- Target dates for closure are defined

## API Endpoints

### SWIFT Assessments

```typescript
// Get all SWIFT assessments
GET /api/swift-assessments

// Create SWIFT assessment
POST /api/swift-assessments
Body: {
  assessment_name: string,
  swift_bic_code: string,
  swift_community_version: string,
  assets: string[],
  ...
}

// Update SWIFT assessment
PUT /api/swift-assessments/[id]

// Delete SWIFT assessment
DELETE /api/swift-assessments/[id]
```

### SWIFT Control Assessments

```typescript
// Get controls for a SWIFT assessment
GET /api/swift-control-assessments?swift_assessment_id=123

// Create SWIFT control(s)
POST /api/swift-control-assessments
Body: SWIFTControl | SWIFTControl[]

// Update SWIFT control
PUT /api/swift-control-assessments/[id]

// Delete SWIFT control
DELETE /api/swift-control-assessments/[id]
```

### SWIFT Gap Remediation

```typescript
// Get gaps for a SWIFT assessment
GET /api/swift-gap-remediation?swift_assessment_id=123

// Create SWIFT gap
POST /api/swift-gap-remediation

// Update SWIFT gap
PUT /api/swift-gap-remediation/[id]

// Delete SWIFT gap
DELETE /api/swift-gap-remediation/[id]
```

## File Structure

```
/app
  /swift-compliance
    page.tsx                    # Main page with 4 tabs
    loading.tsx                 # Loading state
  /api
    /swift-assessments
      route.ts                  # GET, POST
      /[id]
        route.ts                # GET, PUT, DELETE
    /swift-control-assessments
      route.ts                  # GET, POST
      /[id]
        route.ts                # PUT, DELETE
    /swift-gap-remediation
      route.ts                  # GET, POST
      /[id]
        route.ts                # PUT, DELETE

/components
  swift-compliance-assessment.tsx  # Tab 1: Assessment management
  swift-self-assessment.tsx         # Tab 2: Control evaluation
  swift-gap-analysis.tsx           # Tab 3: Gap analysis
  swift-remediation-tracker.tsx    # Tab 4: Remediation tracking

/scripts
  994-create-swift-compliance-schema.sql  # Database schema
  993-add-swift-compliance-menu-item.sql  # Menu configuration
```

## Best Practices for SWIFT Compliance

### 1. **Annual Attestation Preparation**
- Start assessment 3-4 months before deadline
- Review previous year's findings
- Update control evidence
- Test all controls thoroughly
- Document everything

### 2. **Mandatory vs Advisory Controls**
- **Mandatory**: Must be compliant for attestation
- **Advisory**: Recommended but not required
- Prioritize mandatory controls
- Document reasons for advisory control non-implementation

### 3. **Evidence Requirements**
- Screenshots of configurations
- Policy documents
- Procedure documents
- Test results
- Logs and monitoring reports
- Change management records
- Training records

### 4. **Common SWIFT Assets to Include**
- Alliance Access (Web Platform or Alliance Desktop)
- SWIFTNet Link (Connectivity solution)
- Alliance Lite2 (For low-volume users)
- Alliance Cloud
- HSM (Hardware Security Modules)
- Back-office integration systems
- SWIFT-related network infrastructure

### 5. **Gap Remediation Timeline**
- **Critical Gaps**: Immediate action (7-14 days)
- **High Gaps**: Within 30 days
- **Medium Gaps**: Within 60 days
- **Low Gaps**: Within 90 days
- All gaps should be closed before attestation

## SWIFT CSP Control Mapping

### Pre-populated Controls

The system comes with 26 standard SWIFT CSP controls:

| Control ID | Objective | Type | Category |
|------------|-----------|------|----------|
| 1.1 | Restrict Internet Access | Mandatory | Architecture |
| 1.2 | Protect Critical Systems | Mandatory | Architecture |
| 2.1 | Secure Local Environment | Mandatory | Architecture |
| 2.2 | Protect Operator PCs | Mandatory | Architecture |
| 2.3 | Virtualisation Security | Advisory | Architecture |
| 2.4 | Operator Session Confidentiality | Mandatory | Architecture |
| ... | ... | ... | ... |
| 7.6 | Security Updates | Mandatory | Operational |

## Attestation Process

### Annual Attestation Workflow

```
1. Create Assessment
   ↓
2. Evaluate All Controls (Mandatory + Advisory)
   ↓
3. Identify Gaps
   ↓
4. Create Remediation Plans
   ↓
5. Implement Remediations
   ↓
6. Verify Effectiveness
   ↓
7. Management Review
   ↓
8. Submit Attestation to SWIFT
   ↓
9. SWIFT Validation
   ↓
10. Attestation Accepted/Rejected
```

### Attestation Status Values

- **Pending**: Assessment not yet ready for submission
- **Submitted**: Attestation submitted to SWIFT
- **Validated**: SWIFT validated the attestation
- **Rejected**: SWIFT rejected the attestation (remediation required)

## Integration Points

### With Asset Management
- Link SWIFT-specific assets (Alliance Access, SWIFTNet Link, HSMs)
- Track which assets are in scope for SWIFT CSP
- Multi-asset support for comprehensive coverage

### With Governance Controls
- Map SWIFT controls to internal control framework
- Leverage existing control evidence
- Cross-reference with ISO 27001, NIST CSF, etc.

### With Incident Management
- Link security incidents to SWIFT gaps
- Post-incident assessments
- Incident impact on attestation

### With Third-Party Risk
- SWIFT service provider assessments
- Shared infrastructure controls
- Vendor security validation

## Menu Location

**Navigation Path:**
```
IS Compliance
  ├── Compliance Assessment
  └── SWIFT Compliance ← New submenu item
```

## Sample Workflow

### Scenario: Annual SWIFT CSP Attestation 2024

**Step 1: Create Assessment**
```
Name: SWIFT CSP Annual Attestation 2024
BIC Code: ABNANL2A
CSP Version: CSP v2024
Type: Annual Attestation
Environment: Production
Message Volume: High
Assessor: SWIFT Security Team
```

**Step 2: Add Assets**
```
- Alliance Access (SWIFT-AA-001)
- SWIFTNet Link (SWIFT-SNL-001)
- HSM Primary (HSM-001)
- HSM Backup (HSM-002)
- Back-office Integration (BO-001)
```

**Step 3: Evaluate Controls (26 controls)**
```
Control 1.1: Restrict Internet Access
  Type: Mandatory
  Status: Compliant
  Evidence: Firewall rules, network diagrams
  
Control 2.3: Virtualisation Security
  Type: Advisory
  Status: Partially Compliant
  Gap: No dedicated security monitoring for virtual infrastructure
  Severity: Medium
  Remediation Required: Yes
  
Control 4.2: Multi-Factor Authentication
  Type: Mandatory
  Status: Compliant
  Evidence: MFA configuration screenshots, audit logs
```

**Step 4: Track Remediation**
```
Gap SWIFT-GAP-2024-00001: Virtualisation Security Monitoring
  Control: 2.3
  Severity: Medium
  Owner: Infrastructure Security Team
  Status: In Progress
  Due: March 1, 2024
  Progress: 60%
  
  Actions:
  - Deploy SIEM for hypervisor monitoring
  - Configure alerts for VM security events
  - Document monitoring procedures
```

**Step 5: Attestation**
```
Overall Compliance: 96%
Mandatory Controls: 22/22 Compliant
Advisory Controls: 3/4 Compliant
Gaps: 1 Medium (with remediation plan)
Status: Ready for Attestation
Attestation Status: Submitted → Validated
```

## Compliance Metrics

### Key Performance Indicators

- **Mandatory Control Compliance**: Target 100%
- **Overall CSP Compliance**: Target > 95%
- **Time to Remediate Critical Gaps**: < 7 days
- **Time to Remediate High Gaps**: < 30 days
- **Attestation Submission**: Before deadline
- **Attestation Validation Rate**: Target 100%

### Reporting

**Pre-built Views:**
- `swift_assessment_summary` - Aggregated assessment metrics
- Control compliance by category
- Gap severity distribution
- Remediation status tracking

## Security Considerations

### SWIFT-Specific Security
- **Network Isolation**: Document network segmentation
- **Access Control**: Document MFA implementation
- **Monitoring**: 24/7 monitoring of SWIFT environment
- **Incident Response**: SWIFT incident reporting procedures
- **Physical Security**: Data center controls for SWIFT infrastructure

### Attestation Accuracy
- All information must be accurate
- False attestation has serious consequences
- Document all exceptions
- Maintain audit trail

## Troubleshooting

### Issue: Cannot submit attestation

**Solution**: 
- Check all mandatory controls are Compliant
- Verify no Critical/High gaps remain open
- Ensure evidence is documented
- Complete management review

### Issue: Controls not updating statistics

**Solution**: The API automatically recalculates statistics when controls are added/updated. Check API logs for errors.

### Issue: BIC Code validation error

**Solution**: 
- Ensure 8 or 11 characters
- Use uppercase letters only
- Format: AAAABBCCXXX

## Best Practices

1. **Start Early**: Begin 3-4 months before attestation deadline
2. **Document Everything**: Evidence is critical for attestation
3. **Test Controls**: Don't just review documentation
4. **Prioritize Mandatory**: 100% compliance required
5. **Plan Remediations**: Have clear plans for identified gaps
6. **Management Buy-in**: Executive support is essential
7. **Regular Reviews**: Quarterly reviews between attestations
8. **Keep Updated**: Track SWIFT CSP version changes

## Important Dates

### SWIFT Attestation Calendar

- **Deadline**: Varies by institution (typically Q1 each year)
- **Frequency**: Annual
- **Grace Period**: Usually 30 days after deadline
- **Penalties**: Non-compliance may result in service restrictions

### Recommended Timeline

```
3 months before: Start assessment
2 months before: Complete control evaluation
1.5 months before: Identify all gaps
1 month before: Complete remediation
2 weeks before: Management review
1 week before: Submit attestation
Deadline: SWIFT receives attestation
```

## Differences from ISO27001

While similar in structure, SWIFT CSP has specific differences:

| Aspect | ISO 27001 | SWIFT CSP |
|--------|-----------|-----------|
| Controls | 93 controls (Annex A) | ~26 controls (CSP) |
| Mandatory | None | 20-22 mandatory controls |
| Attestation | Not required | Annual attestation required |
| Scope | Broad ISMS | SWIFT environment only |
| Penalty | None | Service restrictions possible |
| Certification | External cert | Self-attestation |

## Support

For SWIFT CSP compliance support:
1. Review SWIFT Customer Security Programme documentation
2. Check SWIFT.com for latest CSP version
3. Contact SWIFT support for attestation questions
4. Engage SWIFT-certified consultants if needed

## References

- SWIFT Customer Security Programme (CSP)
- SWIFT Customer Security Controls Framework (CSCF)
- SWIFT.com - Security resources
- Local SWIFT user group

## License

Internal use only - Proprietary

