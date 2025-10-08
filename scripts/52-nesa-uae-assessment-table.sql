-- NESA UAE Assessment Table
-- Create table for tracking NESA UAE compliance assessments

CREATE TABLE IF NOT EXISTS nesa_uae_assessments (
    id SERIAL PRIMARY KEY,
    assessment_name VARCHAR(200) NOT NULL,
    organization_id INTEGER REFERENCES organizations(id),
    assessment_type VARCHAR(50) NOT NULL, -- Initial, Annual, Triggered, Follow-up
    scope TEXT,
    critical_infrastructure_type VARCHAR(100) NOT NULL,
    assessment_methodology VARCHAR(50) NOT NULL, -- Self-Assessment, Third-Party Assessment, NESA Audit
    assessment_date DATE DEFAULT CURRENT_DATE,
    assessor_name VARCHAR(100),
    assessor_organization VARCHAR(200),
    status VARCHAR(50) DEFAULT 'Draft', -- Draft, In Progress, Under Review, Completed
    overall_maturity_level VARCHAR(20), -- Basic, Intermediate, Advanced
    compliance_percentage INTEGER DEFAULT 0,
    risk_rating VARCHAR(20), -- Low, Medium, High, Critical
    findings_summary TEXT,
    recommendations TEXT,
    next_assessment_date DATE,
    nesa_approval_status VARCHAR(50) DEFAULT 'Not Submitted', -- Not Submitted, Submitted, Under Review, Approved, Rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for NESA UAE assessment results (linking assessments to specific controls)
CREATE TABLE IF NOT EXISTS nesa_uae_assessment_results (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES nesa_uae_assessments(id) ON DELETE CASCADE,
    requirement_id INTEGER REFERENCES nesa_uae_requirements(id),
    implementation_status VARCHAR(50) NOT NULL, -- Implemented, Partially Implemented, Not Implemented, Not Applicable
    maturity_level VARCHAR(20), -- Basic, Intermediate, Advanced
    evidence TEXT,
    gaps_identified TEXT,
    remediation_actions TEXT,
    target_completion_date DATE,
    responsible_party VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assessment_id, requirement_id)
);

-- Insert sample NESA UAE assessment
INSERT INTO nesa_uae_assessments (
    assessment_name,
    organization_id,
    assessment_type,
    scope,
    critical_infrastructure_type,
    assessment_methodology,
    assessor_name,
    assessor_organization,
    status,
    overall_maturity_level,
    compliance_percentage,
    risk_rating,
    findings_summary,
    recommendations,
    next_assessment_date,
    nesa_approval_status
) VALUES (
    'Annual NESA UAE Cybersecurity Assessment 2024',
    1,
    'Annual',
    'Comprehensive assessment of all critical infrastructure systems including network infrastructure, data centers, and operational technology systems',
    'Banking and Finance',
    'Third-Party Assessment',
    'Ahmed Al-Mansouri',
    'UAE Cybersecurity Consulting LLC',
    'In Progress',
    'Intermediate',
    78,
    'Medium',
    'Assessment identified 12 findings across multiple domains. Most critical findings relate to incident response capabilities and business continuity planning. Physical security controls are well implemented.',
    'Prioritize implementation of comprehensive incident response procedures. Enhance business continuity testing frequency. Implement additional network segmentation controls.',
    '2025-02-01',
    'Under Review'
);

-- Insert sample assessment results for the first few controls
INSERT INTO nesa_uae_assessment_results (
    assessment_id,
    requirement_id,
    implementation_status,
    maturity_level,
    evidence,
    gaps_identified,
    remediation_actions,
    target_completion_date,
    responsible_party
) VALUES 
(1, 1, 'Implemented', 'Intermediate', 'Cybersecurity strategy document approved by board in January 2024', 'Strategy needs annual review cycle', 'Establish annual strategy review process', '2024-12-31', 'CISO'),
(1, 2, 'Implemented', 'Basic', 'Comprehensive cybersecurity policy framework in place', 'Policies need regular updates', 'Implement quarterly policy review cycle', '2024-09-30', 'Security Team'),
(1, 3, 'Partially Implemented', 'Basic', 'Risk assessment conducted annually', 'No continuous risk monitoring', 'Implement continuous risk monitoring tools', '2024-11-30', 'Risk Manager'),
(1, 4, 'Implemented', 'Intermediate', 'Roles and responsibilities documented in security charter', 'Some roles need clarification', 'Update role definitions and responsibilities', '2024-10-15', 'HR Manager'),
(1, 5, 'Partially Implemented', 'Basic', 'Quarterly board reports on cybersecurity', 'Board needs more detailed technical briefings', 'Enhance board reporting with technical metrics', '2024-08-31', 'CISO');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nesa_uae_assessments_org ON nesa_uae_assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_nesa_uae_assessments_status ON nesa_uae_assessments(status);
CREATE INDEX IF NOT EXISTS idx_nesa_uae_assessments_type ON nesa_uae_assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_nesa_uae_assessments_infrastructure ON nesa_uae_assessments(critical_infrastructure_type);
CREATE INDEX IF NOT EXISTS idx_nesa_uae_assessment_results_assessment ON nesa_uae_assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_nesa_uae_assessment_results_requirement ON nesa_uae_assessment_results(requirement_id);
