-- Qatar NIA Assessment Table
-- Create table for Qatar NIA compliance assessments

CREATE TABLE IF NOT EXISTS qatar_nia_assessments (
    id SERIAL PRIMARY KEY,
    assessment_name VARCHAR(200) NOT NULL,
    organization_id INTEGER REFERENCES organizations(id),
    assessment_type VARCHAR(50) NOT NULL, -- Initial, Annual, Compliance, Follow-up
    scope TEXT,
    entity_type VARCHAR(100) NOT NULL, -- government-entity, critical-infrastructure, financial-institution, etc.
    entity_size VARCHAR(50), -- large, medium, small
    sector VARCHAR(100) NOT NULL, -- government, oil-gas, banking-finance, telecommunications, etc.
    assessment_methodology VARCHAR(100) NOT NULL, -- Self-Assessment, Third-Party Assessment, Regulatory Audit
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

-- Insert sample Qatar NIA assessments
INSERT INTO qatar_nia_assessments (
    assessment_name, 
    organization_id, 
    assessment_type, 
    scope, 
    entity_type, 
    entity_size, 
    sector, 
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
    'Qatar NIA Compliance Assessment 2024', 
    1, 
    'Initial', 
    'Comprehensive organizational assessment covering all Qatar NIA security controls across information systems and infrastructure', 
    'government-entity', 
    'large', 
    'government', 
    'Third-Party Assessment', 
    'Ahmed Al-Mahmoud', 
    'Qatar Cyber Security Consultants', 
    'In Progress', 
    'Intermediate', 
    71, 
    'Medium', 
    'Assessment identified 12 gaps across various security domains. Most critical findings relate to incident management and supplier relationship security. Access control measures are well implemented.', 
    'Priority should be given to implementing comprehensive incident response procedures and establishing supplier security assessment framework. Consider enhancing cryptographic controls implementation.', 
    '2025-01-20', 
    'Pending'
),
(
    'Annual Qatar NIA Review - Banking Sector', 
    1, 
    'Annual', 
    'Annual review focusing on banking sector specific requirements and financial services security controls', 
    'financial-institution', 
    'large', 
    'banking-finance', 
    'Self-Assessment', 
    'Fatima Al-Zahra', 
    'Internal Compliance Team', 
    'Completed', 
    'Advanced', 
    89, 
    'Low', 
    'Annual review shows significant improvement in cybersecurity posture. All critical security controls are implemented with advanced maturity levels achieved in most domains.', 
    'Continue monitoring and improvement activities. Focus on emerging threats and supply chain resilience. Plan for next annual assessment.', 
    '2025-12-15', 
    'Notified'
),
(
    'Critical Infrastructure NIA Assessment', 
    1, 
    'Initial', 
    'Assessment of critical infrastructure entity covering oil and gas sector security requirements', 
    'critical-infrastructure', 
    'large', 
    'oil-gas', 
    'Regulatory Audit', 
    'Mohammed Al-Kuwari', 
    'Qatar National Cyber Security Agency', 
    'Under Review', 
    'Basic', 
    52, 
    'High', 
    'Assessment reveals significant gaps in cybersecurity controls implementation. Critical findings in physical security, communications security, and business continuity planning.', 
    'Immediate action required to address critical security gaps. Recommend comprehensive security program implementation with external support and regular monitoring.', 
    '2024-08-30', 
    'Under Review'
),
(
    'Telecommunications Sector NIA Compliance', 
    1, 
    'Compliance', 
    'Compliance assessment following security incident in telecommunications infrastructure', 
    'telecommunications', 
    'medium', 
    'telecommunications', 
    'Third-Party Assessment', 
    'Khalid Al-Thani', 
    'Qatar Telecom Security Auditors', 
    'Completed', 
    'Intermediate', 
    76, 
    'Medium', 
    'Post-incident assessment identified weaknesses in incident detection and response procedures. Network security controls are adequate but require enhancement for advanced threats.', 
    'Strengthen incident response capabilities and implement advanced threat detection systems. Enhance staff training and awareness programs for telecommunications security.', 
    '2024-11-20', 
    'Notified'
),
(
    'Healthcare Sector NIA Assessment', 
    1, 
    'Initial', 
    'Comprehensive assessment of healthcare provider covering patient data protection and medical information systems security', 
    'healthcare-provider', 
    'medium', 
    'healthcare', 
    'Self-Assessment', 
    'Nora Al-Mansouri', 
    'Internal IT Security Team', 
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
CREATE INDEX IF NOT EXISTS idx_qatar_nia_assessments_org ON qatar_nia_assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_qatar_nia_assessments_type ON qatar_nia_assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_qatar_nia_assessments_entity_type ON qatar_nia_assessments(entity_type);
CREATE INDEX IF NOT EXISTS idx_qatar_nia_assessments_sector ON qatar_nia_assessments(sector);
CREATE INDEX IF NOT EXISTS idx_qatar_nia_assessments_status ON qatar_nia_assessments(status);
CREATE INDEX IF NOT EXISTS idx_qatar_nia_assessments_risk_rating ON qatar_nia_assessments(risk_rating);
