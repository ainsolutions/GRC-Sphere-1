-- DORA Assessment Table
-- Create table for DORA compliance assessments

CREATE TABLE IF NOT EXISTS dora_assessments (
    id SERIAL PRIMARY KEY,
    assessment_name VARCHAR(200) NOT NULL,
    organization_id INTEGER REFERENCES organizations(id),
    assessment_type VARCHAR(50) NOT NULL, -- Initial, Annual, Compliance, Follow-up
    scope TEXT,
    entity_type VARCHAR(100) NOT NULL, -- credit-institution, investment-firm, insurance-undertaking, etc.
    entity_size VARCHAR(50), -- large, medium, small
    member_state VARCHAR(10) NOT NULL, -- EU member state code
    assessment_methodology VARCHAR(100) NOT NULL, -- Self-Assessment, Third-Party Assessment, Supervisory Assessment
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
    authority_notification_status VARCHAR(50) DEFAULT 'Not Notified', -- Not Notified, Pending, Notified, Under Review, Not Required
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample DORA assessments
INSERT INTO dora_assessments (
    assessment_name, 
    organization_id, 
    assessment_type, 
    scope, 
    entity_type, 
    entity_size, 
    member_state, 
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
    authority_notification_status
) VALUES 
(
    'Initial DORA Compliance Assessment 2024', 
    1, 
    'Initial', 
    'Comprehensive DORA assessment covering all ICT risk management requirements for digital operational resilience', 
    'credit-institution', 
    'large', 
    'DE', 
    'Third-Party Assessment', 
    'Klaus Mueller', 
    'FinTech Risk Consulting GmbH', 
    'In Progress', 
    'Intermediate', 
    73, 
    'Medium', 
    'Assessment identified 11 gaps across ICT risk management domains. Most critical findings relate to third-party risk management and digital operational resilience testing. ICT governance framework is well established.', 
    'Priority should be given to implementing comprehensive third-party risk management procedures and establishing advanced resilience testing capabilities. Consider enhancing incident management processes.', 
    '2025-01-20', 
    'Pending'
),
(
    'Annual DORA Review - Banking Sector', 
    1, 
    'Annual', 
    'Annual review focusing on banking sector specific DORA requirements and critical ICT services', 
    'credit-institution', 
    'large', 
    'FR', 
    'Self-Assessment', 
    'Marie Dubois', 
    'Internal Risk Management', 
    'Completed', 
    'Advanced', 
    89, 
    'Low', 
    'Annual review shows significant improvement in digital operational resilience posture. All critical ICT requirements are implemented with advanced maturity levels achieved in most domains.', 
    'Continue monitoring and improvement activities. Focus on emerging ICT threats and third-party resilience. Plan for next annual assessment.', 
    '2025-12-15', 
    'Notified'
),
(
    'Investment Firm DORA Assessment', 
    1, 
    'Initial', 
    'Assessment of investment firm covering trading systems and digital operational resilience requirements', 
    'investment-firm', 
    'medium', 
    'NL', 
    'Third-Party Assessment', 
    'Jan van der Berg', 
    'Dutch Financial Risk B.V.', 
    'Under Review', 
    'Basic', 
    58, 
    'High', 
    'Assessment reveals significant gaps in digital operational resilience implementation. Critical findings in ICT third-party risk management and resilience testing capabilities.', 
    'Immediate action required to address critical ICT risk gaps. Recommend comprehensive resilience program implementation with external support.', 
    '2024-07-15', 
    'Under Review'
),
(
    'Insurance Undertaking DORA Compliance', 
    1, 
    'Compliance', 
    'Compliance assessment following regulatory inquiry into digital operational resilience practices', 
    'insurance-undertaking', 
    'large', 
    'IT', 
    'Supervisory Assessment', 
    'Marco Rossi', 
    'Italian Financial Supervisory Authority', 
    'Completed', 
    'Intermediate', 
    76, 
    'Medium', 
    'Supervisory assessment identified areas for improvement in ICT incident management and third-party risk oversight. Overall resilience framework is adequate but requires enhancement.', 
    'Strengthen ICT incident response capabilities and implement enhanced third-party monitoring. Improve staff training and awareness programs.', 
    '2024-11-30', 
    'Notified'
),
(
    'Payment Institution DORA Assessment', 
    1, 
    'Initial', 
    'Comprehensive assessment of payment institution covering payment systems and digital operational resilience', 
    'payment-institution', 
    'medium', 
    'ES', 
    'Self-Assessment', 
    'Carlos Martinez', 
    'Internal Compliance Team', 
    'Draft', 
    NULL, 
    0, 
    NULL, 
    NULL, 
    NULL, 
    NULL, 
    'Not Notified'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dora_assessments_org ON dora_assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_dora_assessments_type ON dora_assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_dora_assessments_entity_type ON dora_assessments(entity_type);
CREATE INDEX IF NOT EXISTS idx_dora_assessments_member_state ON dora_assessments(member_state);
CREATE INDEX IF NOT EXISTS idx_dora_assessments_status ON dora_assessments(status);
CREATE INDEX IF NOT EXISTS idx_dora_assessments_risk_rating ON dora_assessments(risk_rating);
