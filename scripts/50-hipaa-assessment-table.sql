-- Create HIPAA assessments table
CREATE TABLE IF NOT EXISTS hipaa_assessments (
    id SERIAL PRIMARY KEY,
    assessment_name VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    phi_types JSONB DEFAULT '[]',
    assessment_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Not Started',
    risk_level VARCHAR(20) NOT NULL DEFAULT 'Medium',
    completion_percentage INTEGER DEFAULT 0,
    scope TEXT,
    findings TEXT,
    recommendations TEXT,
    assessor VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    target_date DATE,
    completed_date DATE,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample HIPAA assessments
INSERT INTO hipaa_assessments (
    assessment_name,
    entity_type,
    phi_types,
    assessment_type,
    status,
    risk_level,
    completion_percentage,
    scope,
    assessor,
    target_date,
    created_date
) VALUES
(
    'Annual HIPAA Compliance Review 2024',
    'Healthcare Provider',
    '["Medical Records", "Billing Information", "Insurance Claims"]',
    'Annual',
    'In Progress',
    'Medium',
    65,
    'Comprehensive review of all HIPAA compliance requirements across the organization',
    'Jane Smith, CISA',
    '2024-12-31',
    '2024-01-15'
),
(
    'Business Associate Agreement Assessment',
    'Business Associate',
    '["Patient Demographics", "Treatment Records"]',
    'Initial',
    'Completed',
    'Low',
    100,
    'Assessment of business associate compliance with HIPAA requirements',
    'John Doe, CISSP',
    '2024-06-30',
    '2024-03-01'
),
(
    'Incident Response HIPAA Assessment',
    'Healthcare Provider',
    '["Electronic Health Records", "Lab Results"]',
    'Triggered',
    'In Progress',
    'High',
    25,
    'Assessment triggered by security incident involving potential PHI exposure',
    'Sarah Johnson, CISM',
    '2024-08-15',
    '2024-07-20'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hipaa_assessments_status ON hipaa_assessments(status);
CREATE INDEX IF NOT EXISTS idx_hipaa_assessments_risk_level ON hipaa_assessments(risk_level);
CREATE INDEX IF NOT EXISTS idx_hipaa_assessments_target_date ON hipaa_assessments(target_date);
CREATE INDEX IF NOT EXISTS idx_hipaa_requirements_category ON hipaa_requirements(category);
CREATE INDEX IF NOT EXISTS idx_hipaa_requirements_status ON hipaa_requirements(status);
