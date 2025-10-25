-- Create Compliance Assessment Schema
-- This schema supports comprehensive compliance assessments with control evaluation and gap remediation

-- 1. Compliance Assessments Table
CREATE TABLE IF NOT EXISTS compliance_assessments (
    id SERIAL PRIMARY KEY,
    assessment_id VARCHAR(100) UNIQUE NOT NULL,
    assessment_name VARCHAR(500) NOT NULL,
    regulatory_framework VARCHAR(200) NOT NULL, -- ISO 27001, NIST CSF, PCI DSS, etc.
    assessment_type VARCHAR(100) DEFAULT 'Initial', -- Initial, Follow-up, Annual, Ad-hoc
    organization_id INTEGER,
    department_id INTEGER,
    assessment_scope TEXT,
    assessment_objective TEXT,
    assessment_period_start DATE,
    assessment_period_end DATE,
    assessor_name VARCHAR(200),
    assessor_organization VARCHAR(200),
    assessor_email VARCHAR(200),
    reviewer_name VARCHAR(200),
    status VARCHAR(50) DEFAULT 'Planning', -- Planning, In Progress, Under Review, Completed, Approved
    overall_compliance_score DECIMAL(5,2), -- 0-100
    total_controls INTEGER DEFAULT 0,
    compliant_controls INTEGER DEFAULT 0,
    non_compliant_controls INTEGER DEFAULT 0,
    partially_compliant_controls INTEGER DEFAULT 0,
    not_applicable_controls INTEGER DEFAULT 0,
    gap_count INTEGER DEFAULT 0,
    critical_gaps INTEGER DEFAULT 0,
    high_gaps INTEGER DEFAULT 0,
    medium_gaps INTEGER DEFAULT 0,
    low_gaps INTEGER DEFAULT 0,
    assets JSONB DEFAULT '[]'::jsonb, -- Associated assets
    compliance_summary TEXT,
    recommendations TEXT,
    next_assessment_date DATE,
    approval_status VARCHAR(50) DEFAULT 'Pending', -- Pending, Approved, Rejected
    approved_by VARCHAR(200),
    approval_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(200),
    updated_by VARCHAR(200)
);

-- 2. Compliance Control Assessments Table (Self-Assessment / Control Evaluation)
CREATE TABLE IF NOT EXISTS compliance_control_assessments (
    id SERIAL PRIMARY KEY,
    compliance_assessment_id INTEGER NOT NULL REFERENCES compliance_assessments(id) ON DELETE CASCADE,
    control_id VARCHAR(100) NOT NULL,
    control_name VARCHAR(500) NOT NULL,
    control_description TEXT,
    control_category VARCHAR(200),
    control_domain VARCHAR(200),
    regulatory_reference VARCHAR(200), -- e.g., ISO 27001:2022 A.5.1
    control_objective TEXT,
    implementation_status VARCHAR(50) DEFAULT 'Not Implemented', -- Compliant, Partially Compliant, Non-Compliant, Not Applicable, Not Assessed
    compliance_level VARCHAR(50), -- Full, Partial, None, N/A
    evidence_collected TEXT,
    evidence_references JSONB DEFAULT '[]'::jsonb,
    assessment_method VARCHAR(100), -- Document Review, Interview, Testing, Observation
    findings TEXT,
    gap_description TEXT,
    gap_severity VARCHAR(50), -- Critical, High, Medium, Low
    risk_rating VARCHAR(50), -- Critical, High, Medium, Low
    current_maturity_level VARCHAR(50), -- Initial, Managed, Defined, Quantitatively Managed, Optimizing
    target_maturity_level VARCHAR(50),
    remediation_required BOOLEAN DEFAULT false,
    remediation_priority VARCHAR(50), -- Critical, High, Medium, Low
    control_owner VARCHAR(200),
    assessor_notes TEXT,
    assessed_date DATE,
    assessed_by VARCHAR(200),
    review_notes TEXT,
    reviewed_by VARCHAR(200),
    review_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Compliance Gap Remediation Table
CREATE TABLE IF NOT EXISTS compliance_gap_remediation (
    id SERIAL PRIMARY KEY,
    compliance_assessment_id INTEGER NOT NULL REFERENCES compliance_assessments(id) ON DELETE CASCADE,
    control_assessment_id INTEGER NOT NULL REFERENCES compliance_control_assessments(id) ON DELETE CASCADE,
    gap_id VARCHAR(100) UNIQUE NOT NULL,
    gap_title VARCHAR(500) NOT NULL,
    gap_description TEXT NOT NULL,
    control_reference VARCHAR(200), -- Link back to the control
    regulatory_reference VARCHAR(200),
    gap_category VARCHAR(200),
    gap_severity VARCHAR(50) NOT NULL, -- Critical, High, Medium, Low
    risk_impact TEXT,
    current_state TEXT,
    target_state TEXT,
    remediation_action TEXT NOT NULL,
    remediation_plan TEXT,
    remediation_owner VARCHAR(200),
    remediation_department VARCHAR(200),
    assigned_to VARCHAR(200),
    remediation_status VARCHAR(50) DEFAULT 'Open', -- Open, In Progress, Under Review, Completed, Closed, Deferred
    priority VARCHAR(50) DEFAULT 'Medium', -- Critical, High, Medium, Low
    effort_estimate VARCHAR(50), -- Low, Medium, High
    cost_estimate DECIMAL(15,2),
    resources_required TEXT,
    implementation_timeline VARCHAR(200),
    start_date DATE,
    due_date DATE,
    completion_date DATE,
    progress_percentage INTEGER DEFAULT 0,
    milestones JSONB DEFAULT '[]'::jsonb,
    dependencies TEXT,
    implementation_notes TEXT,
    evidence_of_closure TEXT,
    verification_method VARCHAR(200),
    verified_by VARCHAR(200),
    verification_date DATE,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    recurrence_prevention TEXT,
    lessons_learned TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(200),
    updated_by VARCHAR(200)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_compliance_assessments_framework ON compliance_assessments(regulatory_framework);
CREATE INDEX IF NOT EXISTS idx_compliance_assessments_status ON compliance_assessments(status);
CREATE INDEX IF NOT EXISTS idx_compliance_assessments_org ON compliance_assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_compliance_assessments_dept ON compliance_assessments(department_id);
CREATE INDEX IF NOT EXISTS idx_compliance_assessments_assets ON compliance_assessments USING gin(assets);

CREATE INDEX IF NOT EXISTS idx_control_assessments_compliance ON compliance_control_assessments(compliance_assessment_id);
CREATE INDEX IF NOT EXISTS idx_control_assessments_status ON compliance_control_assessments(implementation_status);
CREATE INDEX IF NOT EXISTS idx_control_assessments_severity ON compliance_control_assessments(gap_severity);
CREATE INDEX IF NOT EXISTS idx_control_assessments_control ON compliance_control_assessments(control_id);

CREATE INDEX IF NOT EXISTS idx_gap_remediation_compliance ON compliance_gap_remediation(compliance_assessment_id);
CREATE INDEX IF NOT EXISTS idx_gap_remediation_control ON compliance_gap_remediation(control_assessment_id);
CREATE INDEX IF NOT EXISTS idx_gap_remediation_status ON compliance_gap_remediation(remediation_status);
CREATE INDEX IF NOT EXISTS idx_gap_remediation_severity ON compliance_gap_remediation(gap_severity);
CREATE INDEX IF NOT EXISTS idx_gap_remediation_owner ON compliance_gap_remediation(remediation_owner);

-- Add constraints
ALTER TABLE compliance_assessments 
ADD CONSTRAINT chk_compliance_status 
CHECK (status IN ('Planning', 'In Progress', 'Under Review', 'Completed', 'Approved', 'Cancelled'));

ALTER TABLE compliance_assessments 
ADD CONSTRAINT chk_compliance_approval 
CHECK (approval_status IN ('Pending', 'Approved', 'Rejected'));

ALTER TABLE compliance_control_assessments 
ADD CONSTRAINT chk_control_implementation_status 
CHECK (implementation_status IN ('Compliant', 'Partially Compliant', 'Non-Compliant', 'Not Applicable', 'Not Assessed'));

ALTER TABLE compliance_control_assessments 
ADD CONSTRAINT chk_control_gap_severity 
CHECK (gap_severity IN ('Critical', 'High', 'Medium', 'Low', 'None'));

ALTER TABLE compliance_gap_remediation 
ADD CONSTRAINT chk_gap_status 
CHECK (remediation_status IN ('Open', 'In Progress', 'Under Review', 'Completed', 'Closed', 'Deferred'));

ALTER TABLE compliance_gap_remediation 
ADD CONSTRAINT chk_gap_severity 
CHECK (gap_severity IN ('Critical', 'High', 'Medium', 'Low'));

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_compliance_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_compliance_assessments_updated_at
    BEFORE UPDATE ON compliance_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_compliance_assessments_updated_at();

CREATE TRIGGER trigger_control_assessments_updated_at
    BEFORE UPDATE ON compliance_control_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_compliance_assessments_updated_at();

CREATE TRIGGER trigger_gap_remediation_updated_at
    BEFORE UPDATE ON compliance_gap_remediation
    FOR EACH ROW
    EXECUTE FUNCTION update_compliance_assessments_updated_at();

-- Add helpful comments
COMMENT ON TABLE compliance_assessments IS 'Main compliance assessment records for regulatory frameworks';
COMMENT ON TABLE compliance_control_assessments IS 'Individual control assessments linked to compliance assessments';
COMMENT ON TABLE compliance_gap_remediation IS 'Gap remediation tracking linked to control assessments';

COMMENT ON COLUMN compliance_assessments.assets IS 'JSONB array of associated assets for this compliance assessment';
COMMENT ON COLUMN compliance_assessments.overall_compliance_score IS 'Overall compliance percentage (0-100)';
COMMENT ON COLUMN compliance_control_assessments.compliance_assessment_id IS 'Foreign key to parent compliance assessment';
COMMENT ON COLUMN compliance_gap_remediation.control_assessment_id IS 'Foreign key to control assessment that identified this gap';
COMMENT ON COLUMN compliance_gap_remediation.compliance_assessment_id IS 'Foreign key to parent compliance assessment';

-- Create helpful views
CREATE OR REPLACE VIEW compliance_assessment_summary AS
SELECT 
    ca.id,
    ca.assessment_id,
    ca.assessment_name,
    ca.regulatory_framework,
    ca.status,
    ca.overall_compliance_score,
    ca.total_controls,
    ca.compliant_controls,
    ca.non_compliant_controls,
    ca.gap_count,
    ca.critical_gaps,
    jsonb_array_length(COALESCE(ca.assets, '[]'::jsonb)) as asset_count,
    COUNT(DISTINCT cca.id) as assessed_controls_count,
    COUNT(DISTINCT CASE WHEN cgr.remediation_status IN ('Open', 'In Progress') THEN cgr.id END) as open_gaps_count,
    ca.created_at,
    ca.updated_at
FROM compliance_assessments ca
LEFT JOIN compliance_control_assessments cca ON ca.id = cca.compliance_assessment_id
LEFT JOIN compliance_gap_remediation cgr ON ca.id = cgr.compliance_assessment_id
GROUP BY ca.id
ORDER BY ca.created_at DESC;

COMMENT ON VIEW compliance_assessment_summary IS 'Summary view of compliance assessments with aggregated metrics';


