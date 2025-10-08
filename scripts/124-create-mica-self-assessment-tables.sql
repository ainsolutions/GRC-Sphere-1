-- Create MICA Self Assessment Tables
-- This script creates tables for comprehensive self-assessment functionality

-- 1. Self Assessments Table
CREATE TABLE IF NOT EXISTS mica_self_assessments (
    id SERIAL PRIMARY KEY,
    assessment_name VARCHAR(255) NOT NULL,
    organization_id INTEGER DEFAULT 1,
    assessment_scope TEXT,
    assessment_period_start DATE,
    assessment_period_end DATE,
    assessor_name VARCHAR(255),
    assessor_title VARCHAR(255),
    assessor_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Draft',
    overall_maturity_score DECIMAL(3,2) DEFAULT 0,
    compliance_percentage DECIMAL(5,2) DEFAULT 0,
    total_controls INTEGER DEFAULT 0,
    implemented_controls INTEGER DEFAULT 0,
    partially_implemented_controls INTEGER DEFAULT 0,
    not_implemented_controls INTEGER DEFAULT 0,
    not_applicable_controls INTEGER DEFAULT 0,
    high_priority_gaps INTEGER DEFAULT 0,
    medium_priority_gaps INTEGER DEFAULT 0,
    low_priority_gaps INTEGER DEFAULT 0,
    executive_summary TEXT,
    key_findings TEXT,
    recommendations TEXT,
    next_assessment_date DATE,
    created_by VARCHAR(255) DEFAULT 'System',
    updated_by VARCHAR(255) DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Self Assessment Controls Table
CREATE TABLE IF NOT EXISTS mica_self_assessment_controls (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL REFERENCES mica_self_assessments(id) ON DELETE CASCADE,
    requirement_id INTEGER REFERENCES mica_requirements(id),
    control_id VARCHAR(50) NOT NULL,
    control_name VARCHAR(500) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    current_maturity_level VARCHAR(50) DEFAULT 'not-implemented',
    target_maturity_level VARCHAR(50) DEFAULT 'intermediate',
    implementation_status VARCHAR(50) DEFAULT 'not-implemented',
    existing_controls TEXT,
    target_controls TEXT,
    action_owner VARCHAR(255),
    action_owner_email VARCHAR(255),
    target_completion_date DATE,
    evidence_provided TEXT,
    gaps_identified TEXT,
    remediation_actions TEXT,
    business_justification TEXT,
    estimated_cost DECIMAL(12,2) DEFAULT 0,
    estimated_effort_hours INTEGER DEFAULT 0,
    priority VARCHAR(20) DEFAULT 'medium',
    compliance_percentage INTEGER DEFAULT 0,
    last_reviewed_date DATE,
    next_review_date DATE,
    reviewer_name VARCHAR(255),
    reviewer_comments TEXT,
    approval_status VARCHAR(50) DEFAULT 'pending',
    approved_by VARCHAR(255),
    approval_date DATE,
    created_by VARCHAR(255) DEFAULT 'System',
    updated_by VARCHAR(255) DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Self Assessment Audit Log Table
CREATE TABLE IF NOT EXISTS mica_self_assessment_audit_log (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL REFERENCES mica_self_assessments(id) ON DELETE CASCADE,
    control_id VARCHAR(50),
    action_type VARCHAR(50) NOT NULL,
    field_changed VARCHAR(255),
    old_value TEXT,
    new_value TEXT,
    changed_by VARCHAR(255) NOT NULL,
    change_reason TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mica_self_assessments_status ON mica_self_assessments(status);
CREATE INDEX IF NOT EXISTS idx_mica_self_assessments_created_at ON mica_self_assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_mica_self_assessment_controls_assessment_id ON mica_self_assessment_controls(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mica_self_assessment_controls_control_id ON mica_self_assessment_controls(control_id);
CREATE INDEX IF NOT EXISTS idx_mica_self_assessment_controls_domain ON mica_self_assessment_controls(domain);
CREATE INDEX IF NOT EXISTS idx_mica_self_assessment_controls_status ON mica_self_assessment_controls(implementation_status);
CREATE INDEX IF NOT EXISTS idx_mica_self_assessment_controls_maturity ON mica_self_assessment_controls(current_maturity_level);
CREATE INDEX IF NOT EXISTS idx_mica_self_assessment_controls_priority ON mica_self_assessment_controls(priority);
CREATE INDEX IF NOT EXISTS idx_mica_self_assessment_audit_log_assessment_id ON mica_self_assessment_audit_log(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mica_self_assessment_audit_log_timestamp ON mica_self_assessment_audit_log(timestamp);

-- Add constraints
ALTER TABLE mica_self_assessment_controls 
ADD CONSTRAINT chk_mica_current_maturity_level 
CHECK (current_maturity_level IN ('not-implemented', 'basic', 'intermediate', 'advanced'));

ALTER TABLE mica_self_assessment_controls 
ADD CONSTRAINT chk_mica_target_maturity_level 
CHECK (target_maturity_level IN ('basic', 'intermediate', 'advanced'));

ALTER TABLE mica_self_assessment_controls 
ADD CONSTRAINT chk_mica_implementation_status 
CHECK (implementation_status IN ('not-implemented', 'partially-implemented', 'implemented', 'not-applicable'));

ALTER TABLE mica_self_assessment_controls 
ADD CONSTRAINT chk_mica_priority 
CHECK (priority IN ('low', 'medium', 'high'));

ALTER TABLE mica_self_assessment_controls 
ADD CONSTRAINT chk_mica_compliance_percentage 
CHECK (compliance_percentage >= 0 AND compliance_percentage <= 100);

ALTER TABLE mica_self_assessments 
ADD CONSTRAINT chk_mica_status 
CHECK (status IN ('Draft', 'In Progress', 'Under Review', 'Completed', 'Approved'));

ALTER TABLE mica_self_assessments 
ADD CONSTRAINT chk_mica_compliance_percentage_assessment 
CHECK (compliance_percentage >= 0 AND compliance_percentage <= 100);

ALTER TABLE mica_self_assessments 
ADD CONSTRAINT chk_mica_overall_maturity_score 
CHECK (overall_maturity_score >= 0 AND overall_maturity_score <= 5);

-- Add comments for documentation
COMMENT ON TABLE mica_self_assessments IS 'MICA self-assessment projects and their overall statistics';
COMMENT ON TABLE mica_self_assessment_controls IS 'Individual control assessments within MICA self-assessments';
COMMENT ON TABLE mica_self_assessment_audit_log IS 'Audit trail for all changes made to MICA self-assessments';

COMMENT ON COLUMN mica_self_assessments.overall_maturity_score IS 'Average maturity score across all controls (1-5 scale)';
COMMENT ON COLUMN mica_self_assessments.compliance_percentage IS 'Overall compliance percentage across all controls';
COMMENT ON COLUMN mica_self_assessment_controls.current_maturity_level IS 'Current implementation maturity level';
COMMENT ON COLUMN mica_self_assessment_controls.target_maturity_level IS 'Desired target maturity level';
COMMENT ON COLUMN mica_self_assessment_controls.compliance_percentage IS 'Individual control compliance percentage (0-100)';
COMMENT ON COLUMN mica_self_assessment_controls.estimated_cost IS 'Estimated cost for implementing remediation actions';
COMMENT ON COLUMN mica_self_assessment_controls.estimated_effort_hours IS 'Estimated effort in hours for implementation';
