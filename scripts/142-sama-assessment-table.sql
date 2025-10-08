-- SAMA Assessment Table
-- Create table for tracking SAMA compliance assessments

CREATE TABLE IF NOT EXISTS sama_assessments (
    id SERIAL PRIMARY KEY,
    assessment_name VARCHAR(200) NOT NULL,
    organization_id INTEGER REFERENCES organizations(id),
    assessment_type VARCHAR(50) NOT NULL, -- Initial, Annual, Triggered, Follow-up
    scope TEXT,
    financial_institution_type VARCHAR(100) NOT NULL,
    assessment_methodology VARCHAR(50) NOT NULL, -- Self-Assessment, Third-Party Assessment, SAMA Audit
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
    sama_approval_status VARCHAR(50) DEFAULT 'Not Submitted', -- Not Submitted, Submitted, Under Review, Approved, Rejected
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create table for SAMA assessment results (linking assessments to specific controls)
CREATE TABLE IF NOT EXISTS sama_assessment_results (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES sama_assessments(id) ON DELETE CASCADE,
    requirement_id INTEGER REFERENCES sama_requirements(id),
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

-- Insert sample SAMA assessment
INSERT INTO sama_assessments (
    assessment_name,
    organization_id,
    assessment_type,
    scope,
    financial_institution_type,
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
    sama_approval_status
) VALUES (
    'Annual SAMA Cybersecurity Assessment 2024',
    1,
    'Annual',
    'Comprehensive assessment of all banking systems including core banking, payment systems, digital channels, and supporting infrastructure',
    'bank',
    'Third-Party Assessment',
    'Dr. Khalid Al-Rashid',
    'Saudi Cybersecurity Consulting',
    'In Progress',
    'Intermediate',
    75,
    'Medium',
    'Assessment identified 15 findings across multiple domains. Most critical findings relate to payment systems security and third-party risk management. Cybersecurity governance controls are well implemented.',
    'Prioritize implementation of enhanced payment system monitoring. Strengthen third-party cybersecurity assessments. Implement advanced threat detection capabilities.',
    '2025-03-01',
    'Under Review'
);

-- Insert sample assessment results for the first few controls
INSERT INTO sama_assessment_results (
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
(1, 1, 'Implemented', 'Intermediate', 'Cybersecurity strategy document approved by board in February 2024', 'Strategy needs alignment with emerging threats', 'Update strategy to address AI and quantum computing risks', '2024-12-31', 'CISO'),
(1, 2, 'Implemented', 'Basic', 'Comprehensive cybersecurity policy framework in place', 'Policies need regular updates for regulatory changes', 'Implement quarterly policy review cycle', '2024-09-30', 'Security Team'),
(1, 3, 'Partially Implemented', 'Basic', 'Risk assessment conducted annually', 'No continuous risk monitoring for cyber threats', 'Implement continuous cyber risk monitoring platform', '2024-11-30', 'Risk Manager'),
(1, 4, 'Implemented', 'Intermediate', 'Roles and responsibilities documented in security charter', 'Some roles need clarification for incident response', 'Update role definitions for cyber incident response', '2024-10-15', 'HR Manager'),
(1, 5, 'Partially Implemented', 'Basic', 'Quarterly board reports on cybersecurity', 'Board needs more detailed cyber risk metrics', 'Enhance board reporting with quantitative cyber risk metrics', '2024-08-31', 'CISO');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sama_assessments_org ON sama_assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_sama_assessments_status ON sama_assessments(status);
CREATE INDEX IF NOT EXISTS idx_sama_assessments_type ON sama_assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_sama_assessments_institution ON sama_assessments(financial_institution_type);
CREATE INDEX IF NOT EXISTS idx_sama_assessment_results_assessment ON sama_assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_sama_assessment_results_requirement ON sama_assessment_results(requirement_id);
