-- Create SWIFT Customer Security Programme (CSP) Compliance Schema
-- SWIFT CSP is a mandatory security framework for financial institutions using SWIFT

-- 1. SWIFT Compliance Assessments Table
CREATE TABLE IF NOT EXISTS swift_assessments (
    id SERIAL PRIMARY KEY,
    assessment_id VARCHAR(100) UNIQUE NOT NULL,
    assessment_name VARCHAR(500) NOT NULL,
    organization_id INTEGER,
    department_id INTEGER,
    assessment_type VARCHAR(100) DEFAULT 'Annual', -- Annual, Ad-hoc, Pre-audit, Post-incident
    swift_community_version VARCHAR(50), -- e.g., CSP v2023, CSP v2024
    scope TEXT,
    assessment_date DATE,
    completion_date DATE,
    assessor_name VARCHAR(200),
    assessor_organization VARCHAR(200),
    assessor_email VARCHAR(200),
    reviewer_name VARCHAR(200),
    status VARCHAR(50) DEFAULT 'Planning', -- Planning, In Progress, Under Review, Completed, Submitted
    
    -- Compliance Scoring
    overall_compliance_score DECIMAL(5,2), -- 0-100
    architecture_security_score DECIMAL(5,2),
    access_control_score DECIMAL(5,2),
    operational_security_score DECIMAL(5,2),
    
    -- Control Statistics
    total_controls INTEGER DEFAULT 0,
    mandatory_controls INTEGER DEFAULT 0,
    advisory_controls INTEGER DEFAULT 0,
    compliant_controls INTEGER DEFAULT 0,
    non_compliant_controls INTEGER DEFAULT 0,
    partially_compliant_controls INTEGER DEFAULT 0,
    not_applicable_controls INTEGER DEFAULT 0,
    
    -- Findings
    findings_count INTEGER DEFAULT 0,
    critical_findings INTEGER DEFAULT 0,
    high_findings INTEGER DEFAULT 0,
    medium_findings INTEGER DEFAULT 0,
    low_findings INTEGER DEFAULT 0,
    
    -- SWIFT Specific
    swift_bic_code VARCHAR(11), -- Bank Identifier Code
    swift_environment VARCHAR(50), -- Production, Test, Both
    message_volume_category VARCHAR(20), -- Low, Medium, High
    attestation_status VARCHAR(50) DEFAULT 'Pending', -- Pending, Submitted, Validated, Rejected
    attestation_date DATE,
    attestation_submitted_by VARCHAR(200),
    next_assessment_date DATE,
    
    -- Additional fields
    assets JSONB DEFAULT '[]'::jsonb,
    executive_summary TEXT,
    recommendations TEXT,
    action_plan TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(200),
    updated_by VARCHAR(200)
);

-- 2. SWIFT Control Assessments Table (CSP Controls)
CREATE TABLE IF NOT EXISTS swift_control_assessments (
    id SERIAL PRIMARY KEY,
    swift_assessment_id INTEGER NOT NULL REFERENCES swift_assessments(id) ON DELETE CASCADE,
    
    -- Control Information
    control_id VARCHAR(50) NOT NULL, -- e.g., 1.1, 2.3A, 3.2
    control_objective VARCHAR(500) NOT NULL,
    control_description TEXT,
    control_category VARCHAR(100), -- Architecture Security, Access Control, Operational Security
    control_domain VARCHAR(100), -- Physical, Logical, Network, etc.
    control_type VARCHAR(50) DEFAULT 'Mandatory', -- Mandatory, Advisory
    cscf_reference VARCHAR(100), -- Customer Security Controls Framework reference
    
    -- Implementation Assessment
    implementation_status VARCHAR(50) DEFAULT 'Not Assessed', -- Compliant, Non-Compliant, Partially Compliant, Not Applicable
    compliance_level VARCHAR(50), -- Full, Substantial, Partial, None
    maturity_level VARCHAR(50), -- Initial, Developing, Defined, Managed, Optimized
    effectiveness_rating VARCHAR(50), -- Effective, Partially Effective, Ineffective, Not Tested
    
    -- Evidence and Testing
    evidence_collected TEXT,
    evidence_references JSONB DEFAULT '[]'::jsonb,
    testing_method VARCHAR(100), -- Document Review, Interview, Technical Testing, Observation
    testing_results TEXT,
    testing_date DATE,
    tested_by VARCHAR(200),
    
    -- Gap Assessment  
    gap_identified BOOLEAN DEFAULT false,
    gap_description TEXT,
    gap_severity VARCHAR(50), -- Critical, High, Medium, Low
    risk_rating VARCHAR(50), -- Critical, High, Medium, Low
    risk_justification TEXT,
    compensating_controls TEXT,
    
    -- Remediation
    remediation_required BOOLEAN DEFAULT false,
    remediation_priority VARCHAR(50), -- Critical, High, Medium, Low
    remediation_due_date DATE,
    remediation_owner VARCHAR(200),
    
    -- Assessment Details
    control_owner VARCHAR(200),
    assessor_notes TEXT,
    assessed_date DATE,
    assessed_by VARCHAR(200),
    review_notes TEXT,
    reviewed_by VARCHAR(200),
    review_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(swift_assessment_id, control_id)
);

-- 3. SWIFT Gap Remediation Table
CREATE TABLE IF NOT EXISTS swift_gap_remediation (
    id SERIAL PRIMARY KEY,
    swift_assessment_id INTEGER NOT NULL REFERENCES swift_assessments(id) ON DELETE CASCADE,
    swift_control_id INTEGER NOT NULL REFERENCES swift_control_assessments(id) ON DELETE CASCADE,
    
    gap_id VARCHAR(100) UNIQUE NOT NULL,
    gap_title VARCHAR(500) NOT NULL,
    gap_description TEXT NOT NULL,
    control_reference VARCHAR(50), -- Link to SWIFT control
    cscf_reference VARCHAR(100),
    
    -- Gap Classification
    gap_category VARCHAR(200),
    gap_severity VARCHAR(50) NOT NULL, -- Critical, High, Medium, Low
    risk_impact TEXT,
    business_impact TEXT,
    regulatory_impact TEXT,
    
    -- Current vs Target
    current_state TEXT,
    target_state TEXT,
    gap_analysis TEXT,
    
    -- Remediation Planning
    remediation_action TEXT NOT NULL,
    remediation_plan TEXT,
    remediation_strategy VARCHAR(100), -- Immediate, Short-term, Long-term
    remediation_approach VARCHAR(100), -- Fix, Compensating Control, Accept Risk, Transfer Risk
    
    -- Assignment
    remediation_owner VARCHAR(200),
    remediation_department VARCHAR(200),
    assigned_to VARCHAR(200),
    remediation_team VARCHAR(500),
    
    -- Status and Progress
    remediation_status VARCHAR(50) DEFAULT 'Open', -- Open, In Progress, Under Review, Completed, Verified, Closed
    priority VARCHAR(50) DEFAULT 'Medium', -- Critical, High, Medium, Low
    progress_percentage INTEGER DEFAULT 0,
    
    -- Effort and Cost
    effort_estimate VARCHAR(50), -- Low, Medium, High, Very High
    estimated_hours INTEGER,
    cost_estimate DECIMAL(15,2),
    actual_cost DECIMAL(15,2),
    
    -- Timeline
    implementation_timeline VARCHAR(200),
    start_date DATE,
    due_date DATE,
    completion_date DATE,
    verification_date DATE,
    
    -- Implementation Details
    implementation_milestones JSONB DEFAULT '[]'::jsonb,
    dependencies TEXT,
    technical_requirements TEXT,
    resources_required TEXT,
    implementation_notes TEXT,
    
    -- Verification and Closure
    evidence_of_closure TEXT,
    verification_method VARCHAR(200),
    verified_by VARCHAR(200),
    effectiveness_validated BOOLEAN DEFAULT false,
    
    -- Follow-up
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    follow_up_notes TEXT,
    
    -- Lessons Learned
    root_cause_analysis TEXT,
    recurrence_prevention TEXT,
    lessons_learned TEXT,
    
    -- Metadata
    tags JSONB DEFAULT '[]'::jsonb,
    attachments JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(200),
    updated_by VARCHAR(200)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_swift_assessments_org ON swift_assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_swift_assessments_status ON swift_assessments(status);
CREATE INDEX IF NOT EXISTS idx_swift_assessments_attestation ON swift_assessments(attestation_status);
CREATE INDEX IF NOT EXISTS idx_swift_assessments_assets ON swift_assessments USING gin(assets);

CREATE INDEX IF NOT EXISTS idx_swift_controls_assessment ON swift_control_assessments(swift_assessment_id);
CREATE INDEX IF NOT EXISTS idx_swift_controls_status ON swift_control_assessments(implementation_status);
CREATE INDEX IF NOT EXISTS idx_swift_controls_type ON swift_control_assessments(control_type);
CREATE INDEX IF NOT EXISTS idx_swift_controls_category ON swift_control_assessments(control_category);

CREATE INDEX IF NOT EXISTS idx_swift_gaps_assessment ON swift_gap_remediation(swift_assessment_id);
CREATE INDEX IF NOT EXISTS idx_swift_gaps_control ON swift_gap_remediation(swift_control_id);
CREATE INDEX IF NOT EXISTS idx_swift_gaps_status ON swift_gap_remediation(remediation_status);
CREATE INDEX IF NOT EXISTS idx_swift_gaps_severity ON swift_gap_remediation(gap_severity);
CREATE INDEX IF NOT EXISTS idx_swift_gaps_owner ON swift_gap_remediation(remediation_owner);

-- Add constraints
ALTER TABLE swift_assessments 
ADD CONSTRAINT chk_swift_status 
CHECK (status IN ('Planning', 'In Progress', 'Under Review', 'Completed', 'Submitted'));

ALTER TABLE swift_assessments 
ADD CONSTRAINT chk_swift_attestation 
CHECK (attestation_status IN ('Pending', 'Submitted', 'Validated', 'Rejected'));

ALTER TABLE swift_control_assessments 
ADD CONSTRAINT chk_swift_control_implementation 
CHECK (implementation_status IN ('Compliant', 'Non-Compliant', 'Partially Compliant', 'Not Applicable', 'Not Assessed'));

ALTER TABLE swift_control_assessments 
ADD CONSTRAINT chk_swift_control_type 
CHECK (control_type IN ('Mandatory', 'Advisory'));

ALTER TABLE swift_gap_remediation 
ADD CONSTRAINT chk_swift_gap_status 
CHECK (remediation_status IN ('Open', 'In Progress', 'Under Review', 'Completed', 'Verified', 'Closed'));

ALTER TABLE swift_gap_remediation 
ADD CONSTRAINT chk_swift_gap_severity 
CHECK (gap_severity IN ('Critical', 'High', 'Medium', 'Low'));

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_swift_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_swift_assessments_updated_at
    BEFORE UPDATE ON swift_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_swift_updated_at();

CREATE TRIGGER trigger_swift_controls_updated_at
    BEFORE UPDATE ON swift_control_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_swift_updated_at();

CREATE TRIGGER trigger_swift_gaps_updated_at
    BEFORE UPDATE ON swift_gap_remediation
    FOR EACH ROW
    EXECUTE FUNCTION update_swift_updated_at();

-- Helpful comments
COMMENT ON TABLE swift_assessments IS 'SWIFT Customer Security Programme (CSP) compliance assessments';
COMMENT ON TABLE swift_control_assessments IS 'Individual SWIFT CSP control assessments';
COMMENT ON TABLE swift_gap_remediation IS 'SWIFT compliance gap remediation tracking';

COMMENT ON COLUMN swift_assessments.swift_bic_code IS 'SWIFT Bank Identifier Code (BIC/SWIFT code)';
COMMENT ON COLUMN swift_assessments.attestation_status IS 'Status of annual SWIFT CSP attestation';
COMMENT ON COLUMN swift_control_assessments.control_type IS 'Mandatory controls are required, Advisory are recommended';
COMMENT ON COLUMN swift_control_assessments.cscf_reference IS 'Customer Security Controls Framework reference';

-- Create views for reporting
CREATE OR REPLACE VIEW swift_assessment_summary AS
SELECT 
    sa.id,
    sa.assessment_id,
    sa.assessment_name,
    sa.swift_community_version,
    sa.status,
    sa.overall_compliance_score,
    sa.total_controls,
    sa.mandatory_controls,
    sa.advisory_controls,
    sa.compliant_controls,
    sa.findings_count,
    sa.attestation_status,
    sa.swift_bic_code,
    COUNT(DISTINCT sca.id) as assessed_controls_count,
    COUNT(DISTINCT CASE WHEN sgr.remediation_status IN ('Open', 'In Progress') THEN sgr.id END) as open_gaps_count,
    jsonb_array_length(COALESCE(sa.assets, '[]'::jsonb)) as asset_count,
    sa.created_at,
    sa.updated_at
FROM swift_assessments sa
LEFT JOIN swift_control_assessments sca ON sa.id = sca.swift_assessment_id
LEFT JOIN swift_gap_remediation sgr ON sa.id = sgr.swift_assessment_id
GROUP BY sa.id
ORDER BY sa.created_at DESC;

COMMENT ON VIEW swift_assessment_summary IS 'Summary view of SWIFT CSP assessments with aggregated metrics';

-- Seed standard SWIFT CSP controls (CSP v2023)
INSERT INTO swift_control_assessments (swift_assessment_id, control_id, control_objective, control_category, control_type, cscf_reference)
SELECT 
    0, -- placeholder, will be updated when assessments are created
    control_id,
    control_objective,
    control_category,
    control_type,
    cscf_reference
FROM (VALUES
    -- Architecture Security Controls
    ('1.1', 'Restrict Internet Access', 'Architecture Security', 'Mandatory', 'CSCF-1.1'),
    ('1.2', 'Protect Critical Systems', 'Architecture Security', 'Mandatory', 'CSCF-1.2'),
    ('2.1', 'Secure Local Environment', 'Architecture Security', 'Mandatory', 'CSCF-2.1'),
    ('2.2', 'Protect Operator PCs', 'Architecture Security', 'Mandatory', 'CSCF-2.2'),
    ('2.3', 'Virtualisation Security', 'Architecture Security', 'Advisory', 'CSCF-2.3'),
    ('2.4', 'Operator Session Confidentiality', 'Architecture Security', 'Mandatory', 'CSCF-2.4'),
    ('2.5', 'Back-office Data Flow Security', 'Architecture Security', 'Mandatory', 'CSCF-2.5'),
    ('2.6', 'General Purpose vs SWIFT', 'Architecture Security', 'Mandatory', 'CSCF-2.6'),
    ('2.7', 'Physical and Logical Separation', 'Architecture Security', 'Advisory', 'CSCF-2.7'),
    ('2.8', 'Transaction Business Flow Security', 'Architecture Security', 'Mandatory', 'CSCF-2.8'),
    ('2.9', 'Middleware Security', 'Architecture Security', 'Mandatory', 'CSCF-2.9'),
    
    -- Access Control
    ('3.1', 'Operating System Access Control', 'Access Control', 'Mandatory', 'CSCF-3.1'),
    ('3.2', 'Database Access Control', 'Access Control', 'Mandatory', 'CSCF-3.2'),
    ('4.1', 'Password Complexity', 'Access Control', 'Mandatory', 'CSCF-4.1'),
    ('4.2', 'Multi-Factor Authentication', 'Access Control', 'Mandatory', 'CSCF-4.2'),
    ('5.1', 'Account Management', 'Access Control', 'Mandatory', 'CSCF-5.1'),
    ('5.2', 'Privilege Management', 'Access Control', 'Mandatory', 'CSCF-5.2'),
    ('6.1', 'Token Management', 'Access Control', 'Mandatory', 'CSCF-6.1'),
    ('6.2', 'Certificate Management', 'Access Control', 'Mandatory', 'CSCF-6.2'),
    ('6.3', 'Key Management', 'Access Control', 'Mandatory', 'CSCF-6.3'),
    ('6.4', 'Hardware Security Modules', 'Access Control', 'Advisory', 'CSCF-6.4'),
    
    -- Operational Security
    ('7.1', 'Logging and Monitoring', 'Operational Security', 'Mandatory', 'CSCF-7.1'),
    ('7.2', 'System Integrity', 'Operational Security', 'Mandatory', 'CSCF-7.2'),
    ('7.3', 'Software Integrity', 'Operational Security', 'Mandatory', 'CSCF-7.3'),
    ('7.4', 'Malware Protection', 'Operational Security', 'Mandatory', 'CSCF-7.4'),
    ('7.5', 'System Hardening', 'Operational Security', 'Mandatory', 'CSCF-7.5'),
    ('7.6', 'Security Updates', 'Operational Security', 'Mandatory', 'CSCF-7.6')
) AS controls(control_id, control_objective, control_category, control_type, cscf_reference)
WHERE NOT EXISTS (
    SELECT 1 FROM swift_control_assessments 
    WHERE swift_assessment_id = 0 
    AND control_id = controls.control_id
);

COMMENT ON TABLE swift_assessments IS 'SWIFT Customer Security Programme compliance assessments for financial institutions';
COMMENT ON TABLE swift_control_assessments IS 'Individual SWIFT CSP control assessments';
COMMENT ON TABLE swift_gap_remediation IS 'Gap remediation tracking for SWIFT compliance';

