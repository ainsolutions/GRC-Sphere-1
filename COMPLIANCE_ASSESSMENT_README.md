# Compliance Assessment Management System

## Overview

The Compliance Assessment Management System is a comprehensive solution for managing regulatory compliance assessments, evaluating controls, and tracking gap remediation. This system provides an integrated workflow from initial assessment creation through control evaluation to gap closure.

## Features

### 🎯 Three-Tab Workflow

1. **Compliance Assessments** - Create and manage compliance assessments
2. **Self Assessment / Control Evaluation** - Assess individual controls in a table format
3. **Gap Remediation** - Track and close compliance gaps

### 🔗 Data Relationships

```
Compliance Assessment (1)
    ├── Control Assessments (Many)
    │   └── Gap Remediation Items (Many)
    │
    └── Gap Remediation Items (Many) ─┐
                                       ↓
                           Links to Control Assessments
```

### ✨ Key Capabilities

- **Multi-Asset Support**: Associate multiple assets with each assessment
- **Comprehensive Control Evaluation**: Detailed control assessment with evidence tracking
- **Gap Tracking**: Full lifecycle gap remediation management
- **Compliance Scoring**: Automatic calculation of compliance percentages
- **Workflow Integration**: Seamless flow from assessment to control evaluation to gap remediation
- **Owner & Department Assignment**: Integrated search components for owners and departments
- **Bulk Operations**: Bulk add controls for faster data entry

## Architecture

### Database Schema

#### 1. **compliance_assessments**
Main assessment records with overall compliance metrics.

**Key Fields:**
- `assessment_id` - Unique identifier (e.g., CA-2024-ISO27-00001)
- `regulatory_framework` - ISO 27001, NIST CSF, PCI DSS, etc.
- `assets` - JSONB array of associated assets
- `overall_compliance_score` - Auto-calculated (0-100)
- `total_controls` - Auto-updated count
- `gap_count` - Auto-updated gap count

#### 2. **compliance_control_assessments**
Individual control evaluations linked to compliance assessments.

**Key Fields:**
- `compliance_assessment_id` - Foreign key to parent assessment
- `control_id` - Control identifier (e.g., A.5.1)
- `implementation_status` - Compliant, Partially Compliant, Non-Compliant, etc.
- `gap_severity` - Critical, High, Medium, Low, None
- `remediation_required` - Boolean flag
- `maturity_levels` - Current and target maturity

#### 3. **compliance_gap_remediation**
Gap remediation tracking linked to both assessment and control.

**Key Fields:**
- `compliance_assessment_id` - Foreign key to parent assessment
- `control_assessment_id` - Foreign key to control that identified the gap
- `gap_id` - Unique identifier (e.g., GAP-2024-00001)
- `remediation_status` - Open, In Progress, Completed, etc.
- `progress_percentage` - 0-100
- `milestones` - JSONB array of milestones

## Installation

### 1. Run Database Migrations

Execute the migration scripts in order:

```bash
# 1. Add assets field to assessments table
psql -U your_user -d your_db -f scripts/997-add-assets-field-to-assessments.sql

# 2. Create compliance assessment schema
psql -U your_user -d your_db -f scripts/996-create-compliance-assessment-schema.sql

# 3. Add menu item
psql -U your_user -d your_db -f scripts/995-add-compliance-assessment-menu-item.sql
```

### 2. Verify Installation

Check that tables were created:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_name LIKE 'compliance_%';
```

Expected output:
- compliance_assessments
- compliance_control_assessments
- compliance_gap_remediation

## Usage Guide

### Creating a Compliance Assessment

1. **Navigate** to IS Compliance → Compliance Assessment
2. **Click** "New Compliance Assessment" button
3. **Fill in** required fields:
   - Assessment Name *
   - Regulatory Framework *
   - Assessment Type
   - Assessment Period (Start/End dates)
   - Assessor Information
4. **Add Assets**:
   - Search for assets using the asset search component
   - Click on assets to add them
   - Remove assets by clicking the X on badges
5. **Click** "Create Assessment"
6. **Assessment** is automatically selected for control evaluation

### Adding Control Assessments (Self-Assessment)

#### Option 1: Single Control
1. **Switch** to "Self Assessment / Controls" tab
2. **Click** "Add Control" button
3. **Fill in** control details:
   - Control ID and Name (required)
   - Category, Domain, Regulatory Reference
   - Implementation Status
   - Gap Information
   - Maturity Levels
   - Evidence and Findings
   - Control Owner and Assessor
4. **Check** "Remediation Required" if gaps identified
5. **Click** "Save Control"

#### Option 2: Bulk Add
1. **Click** "Bulk Add Controls" button
2. **Enter** multiple controls in the table:
   - Control ID
   - Control Name
   - Regulatory Reference
   - Implementation Status
   - Gap Severity
   - Remediation checkbox
3. **Click** "Add Row" for more controls
4. **Click** "Save All Controls"

### Managing Gap Remediation

1. **Switch** to "Gap Remediation" tab
2. **Prerequisites**: Controls with remediation requirements must exist
3. **Click** "Add Gap" button
4. **Select** Associated Control (dropdown shows only controls needing remediation)
5. **Fill in** gap details:
   - Gap Title and Description
   - Severity and Priority
   - Current State vs Target State
   - Remediation Action and Plan
   - Owner, Department, Assigned To
   - Timelines and Cost
   - Progress Percentage
6. **Click** "Save Gap"
7. **Track** progress by updating status and percentage
8. **Filter** gaps by status or severity

## API Endpoints

### Compliance Assessments

```typescript
// Get all assessments
GET /api/compliance-assessments

// Create assessment
POST /api/compliance-assessments
Body: {
  assessment_name: string,
  regulatory_framework: string,
  assets: string[],
  ...
}

// Update assessment
PUT /api/compliance-assessments/[id]

// Delete assessment
DELETE /api/compliance-assessments/[id]
```

### Control Assessments

```typescript
// Get controls for an assessment
GET /api/compliance-control-assessments?compliance_assessment_id=123

// Create control(s)
POST /api/compliance-control-assessments
Body: ControlAssessment | ControlAssessment[]

// Update control
PUT /api/compliance-control-assessments/[id]

// Delete control
DELETE /api/compliance-control-assessments/[id]
```

### Gap Remediation

```typescript
// Get gaps for an assessment
GET /api/compliance-gap-remediation?compliance_assessment_id=123

// Get gaps for a control
GET /api/compliance-gap-remediation?control_assessment_id=456

// Create gap
POST /api/compliance-gap-remediation

// Update gap
PUT /api/compliance-gap-remediation/[id]

// Delete gap
DELETE /api/compliance-gap-remediation/[id]
```

## Data Flow

### Assessment Creation Flow
```
User fills form
  ↓
Adds multiple assets via search
  ↓
Submits assessment
  ↓
API generates unique ID (CA-YYYY-FRAMEWORK-XXXXX)
  ↓
Stores in compliance_assessments table
  ↓
Assessment auto-selected for control evaluation
```

### Control Assessment Flow
```
User selects compliance assessment
  ↓
Adds controls (single or bulk)
  ↓
Each control linked to compliance_assessment_id
  ↓
System auto-calculates:
  - Total controls
  - Compliant controls
  - Non-compliant controls
  - Overall compliance score
  ↓
Updates parent assessment statistics
```

### Gap Remediation Flow
```
Control assessment identifies gap
  ↓
User creates gap remediation
  ↓
Gap linked to:
  - compliance_assessment_id
  - control_assessment_id (which control found the gap)
  ↓
User tracks remediation:
  - Assigns owner and team
  - Sets timelines
  - Updates progress
  - Adds implementation notes
  ↓
Gap status: Open → In Progress → Under Review → Completed → Closed
```

## Compliance Scoring Algorithm

```javascript
// Count controls by status
const totalControls = all controls
const compliantControls = controls where status = 'Compliant'
const partiallyCompliant = controls where status = 'Partially Compliant'

// Calculate score (partial compliance counts as 50%)
complianceScore = (
  (compliantControls + (partiallyCompliant * 0.5)) / totalControls
) * 100

// Example:
// Total: 100 controls
// Compliant: 60
// Partially Compliant: 20
// Non-Compliant: 20
// Score: (60 + (20 * 0.5)) / 100 * 100 = 70%
```

## Assessment ID Format

Compliance assessments use the following ID format:

```
CA-YYYY-FRAMEWORK-XXXXX

Examples:
CA-2024-ISO27-00001    (ISO 27001)
CA-2024-NISTCSF-00001  (NIST CSF)
CA-2024-PCIDSS-00001   (PCI DSS)
CA-2024-HIPAA-00001    (HIPAA)
```

Gap IDs use this format:
```
GAP-YYYY-XXXXX

Example: GAP-2024-00001
```

## Status Workflows

### Assessment Status
```
Planning → In Progress → Under Review → Completed → Approved
```

### Control Implementation Status
```
Not Assessed → Non-Compliant → Partially Compliant → Compliant
             └→ Not Applicable
```

### Gap Remediation Status
```
Open → In Progress → Under Review → Completed → Closed
    └→ Deferred (for deprioritized items)
```

## Maturity Levels

Based on CMMI (Capability Maturity Model Integration):

1. **Initial** - Ad-hoc processes
2. **Managed** - Documented and repeatable
3. **Defined** - Standardized across organization
4. **Quantitatively Managed** - Measured and controlled
5. **Optimizing** - Continuous improvement

## Supported Frameworks

The system supports all major regulatory frameworks:

- ISO 27001 (Information Security)
- NIST CSF (Cybersecurity Framework)
- PCI DSS (Payment Card Industry)
- HIPAA (Healthcare)
- SOC 2 (Service Organization Control)
- GDPR (General Data Protection Regulation)
- NESA UAE (National Electronic Security Authority)
- MAS TRM (Monetary Authority of Singapore)
- DORA (Digital Operational Resilience Act)
- NIS2 (Network and Information Security Directive)
- SAMA Cybersecurity (Saudi Arabian Monetary Authority)
- CIS Controls (Center for Internet Security)

## Views and Reports

### compliance_assessment_summary View

Pre-aggregated statistics for dashboards:

```sql
SELECT * FROM compliance_assessment_summary;
```

Returns:
- Assessment details
- Control counts
- Gap counts
- Asset counts
- Compliance score
- Timestamps

### assessments_with_assets View

Shows assessments with asset information:

```sql
SELECT * FROM assessments_with_assets;
```

## Best Practices

### 1. Assessment Planning
- Define clear scope and objectives
- Select relevant assets
- Identify appropriate framework
- Assign qualified assessor

### 2. Control Evaluation
- Use consistent assessment methods
- Document all evidence collected
- Be specific in findings and gaps
- Assign realistic maturity targets

### 3. Gap Remediation
- Prioritize by severity and business impact
- Assign clear ownership
- Set realistic timelines
- Track progress regularly
- Document lessons learned

### 4. Continuous Improvement
- Conduct regular re-assessments
- Review and update controls
- Monitor gap closure rates
- Analyze trends over time

## Security Considerations

- **Access Control**: Role-based permissions via database
- **Audit Trail**: All changes timestamped with user info
- **Data Integrity**: Foreign key constraints ensure referential integrity
- **Cascade Deletes**: Deleting assessment removes all related controls and gaps

## Performance Optimization

- **Indexes**: GIN indexes on JSONB fields (assets, milestones, tags)
- **Statistics**: Pre-calculated in parent assessment table
- **Views**: Materialized aggregations for reporting
- **Batch Operations**: Bulk control insertion supported

## Troubleshooting

### Issue: Controls not appearing in gap remediation dropdown

**Solution**: Ensure controls have `remediation_required = true` or `gap_severity != 'None'`

### Issue: Compliance score not updating

**Solution**: Control assessment updates trigger automatic recalculation. Check API logs for errors.

### Issue: Cannot delete assessment

**Solution**: Cascade delete is enabled. Verify no orphaned records with foreign key constraints.

### Issue: Assets not appearing in assessment

**Solution**: 
1. Ensure assets field in GET endpoint includes assets
2. Check JSONB parsing in frontend
3. Verify assets were saved correctly in database

## Integration Points

### With Asset Management
- Asset search component fetches from `assets` table
- Multiple assets can be associated with assessments
- Asset data is stored as JSONB array

### With User Management
- Owner search component fetches from `users` table
- Assessors, reviewers, owners, assigned-to fields
- Department search for organizational assignment

### With Findings System
- Gap remediation can reference findings
- Evidence can link to finding documentation
- Shared severity and priority classifications

## Workflow Example

### Scenario: ISO 27001 Annual Assessment

**Step 1: Create Assessment**
```
Name: ISO 27001 Annual Compliance Assessment 2024
Framework: ISO 27001
Type: Annual
Period: Jan 1 - Dec 31, 2024
Assets: [Web Server (WEB-001), Database (DB-001), App Server (APP-001)]
Assessor: John Smith
Status: Planning → In Progress
```

**Step 2: Evaluate Controls (114 controls)**
```
Control A.5.1: Information Security Policies
  Status: Compliant
  Maturity: Managed
  Evidence: Policy documents reviewed, approved
  Gap: None
  
Control A.8.1: User Endpoint Devices
  Status: Partially Compliant
  Maturity: Initial (Target: Managed)
  Gap Severity: High
  Gap: No MDM solution for BYOD devices
  Remediation Required: Yes
  
Control A.12.3: Information Backup
  Status: Non-Compliant
  Maturity: Initial (Target: Defined)
  Gap Severity: Critical
  Gap: Backup testing not performed regularly
  Remediation Required: Yes
```

**Step 3: Track Gap Remediation**
```
Gap GAP-2024-00001: Implement MDM for BYOD
  Control: A.8.1
  Severity: High
  Owner: IT Security Team
  Status: In Progress
  Progress: 40%
  Due: March 31, 2024
  
Gap GAP-2024-00002: Establish Backup Testing Process
  Control: A.12.3
  Severity: Critical
  Owner: Infrastructure Team
  Status: Open
  Priority: Critical
  Due: February 15, 2024
```

**Result:**
- Compliance Score: 85.5%
- Total Controls: 114
- Compliant: 90
- Partially Compliant: 15
- Non-Compliant: 9
- Gaps Identified: 24
- Critical Gaps: 2
- High Gaps: 8

## Menu Location

**Navigation Path:**
```
IS Compliance
  └── Compliance Assessment ← New submenu item
```

## File Structure

```
/app
  /compliance-assessment
    page.tsx                          # Main page with 3 tabs
  /api
    /compliance-assessments
      route.ts                        # GET, POST
      /[id]
        route.ts                      # GET, PUT, DELETE
    /compliance-control-assessments
      route.ts                        # GET, POST
      /[id]
        route.ts                      # PUT, DELETE
    /compliance-gap-remediation
      route.ts                        # GET, POST
      /[id]
        route.ts                      # PUT, DELETE

/components
  compliance-assessment-creation.tsx  # Tab 1: Assessment management
  compliance-self-assessment-table.tsx # Tab 2: Control evaluation
  compliance-gap-remediation.tsx      # Tab 3: Gap tracking

/scripts
  996-create-compliance-assessment-schema.sql  # Database schema
  995-add-compliance-assessment-menu-item.sql  # Menu configuration
```

## Future Enhancements

- [ ] Export compliance reports to PDF
- [ ] Import controls from regulatory databases
- [ ] Automated evidence collection
- [ ] Risk-based prioritization using AI
- [ ] Dashboard widgets for compliance metrics
- [ ] Email notifications for due dates
- [ ] Document attachment support
- [ ] Workflow approval process
- [ ] Historical trend analysis
- [ ] Comparison between assessments
- [ ] Integration with audit management

## Support

For issues or questions:
1. Check database logs for errors
2. Verify all migrations ran successfully
3. Ensure menu permissions are granted
4. Check browser console for frontend errors

## License

Internal use only - Proprietary


