-- SBP ETRMF Assessment Table
-- Create table for SBP ETRMF compliance assessments

CREATE TABLE IF NOT EXISTS sbp_etrmf_assessments (
    id SERIAL PRIMARY KEY,
    assessment_name VARCHAR(200) NOT NULL,
    organization_id INTEGER REFERENCES organizations(id),
    assessment_type VARCHAR(50) NOT NULL, -- Initial, Periodic, Follow-up
    scope TEXT,
    assessment_methodology VARCHAR(100) NOT NULL, -- Self-Assessment, Independent Review
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assessor_name VARCHAR(200),
    assessor_organization VARCHAR(200),
    status VARCHAR(50) DEFAULT 'Draft', -- Draft, In Progress, Under Review, Completed
    overall_maturity_level VARCHAR(50), -- Basic, Intermediate, Advanced
    compliance_percentage INTEGER DEFAULT 0,
    risk_rating VARCHAR(20), -- Low, Medium, High, Critical
    findings_summary TEXT,
    recommendations TEXT,
    next_assessment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sbp_etrmf_assessments_org ON sbp_etrmf_assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_sbp_etrmf_assessments_type ON sbp_etrmf_assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_sbp_etrmf_assessments_status ON sbp_etrmf_assessments(status);
CREATE INDEX IF NOT EXISTS idx_sbp_etrmf_assessments_risk ON sbp_etrmf_assessments(risk_rating);


