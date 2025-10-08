-- NIS2 Assessment Table
-- Create table for NIS2 compliance assessments

CREATE TABLE IF NOT EXISTS nis2_assessments (
    id SERIAL PRIMARY KEY,
    assessment_name VARCHAR(200) NOT NULL,
    organization_id INTEGER REFERENCES organizations(id),
    assessment_type VARCHAR(50) NOT NULL, -- Initial, Annual, Triggered, Follow-up
    scope TEXT,
    entity_type VARCHAR(100) NOT NULL, -- essential-entity, important-entity, digital-service-provider
    entity_size VARCHAR(50), -- large, medium, small
    member_state VARCHAR(10) NOT NULL, -- EU member state code
    assessment_methodology VARCHAR(100) NOT NULL, -- Self-Assessment, Third-Party Assessment, Authority Audit
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

-- Insert sample NIS2 assessments
INSERT INTO nis2_assessments (
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
    'Initial NIS2 Compliance Assessment 2024', 
    1, 
    'Initial', 
    'Complete organizational assessment covering all NIS2 security measures across network and information systems', 
    'essential-entity', 
    'large', 
    'DE', 
    'Third-Party Assessment', 
    'Maria Schmidt', 
    'CyberSec Consulting GmbH', 
    'In Progress', 
    'Intermediate', 
    68, 
    'Medium', 
    'Assessment identified 15 gaps across various security domains. Most critical findings relate to incident handling and supply chain security measures. Network security controls are well implemented.', 
    'Priority should be given to implementing comprehensive incident response procedures and establishing supply chain security assessments. Consider upgrading security monitoring capabilities.', 
    '2025-01-15', 
    'Pending'
),
(
    'Annual NIS2 Review - Energy Sector', 
    1, 
    'Annual', 
    'Annual review focusing on energy sector specific requirements and critical infrastructure protection', 
    'essential-entity', 
    'large', 
    'FR', 
    'Self-Assessment', 
    'Jean Dubois', 
    'Internal Audit Team', 
    'Completed', 
    'Advanced', 
    85, 
    'Low', 
    'Annual review shows significant improvement in cybersecurity posture. All critical security measures are implemented with advanced maturity levels achieved in most domains.', 
    'Continue monitoring and improvement activities. Focus on emerging threats and supply chain resilience. Plan for next annual assessment.', 
    '2025-12-01', 
    'Notified'
),
(
    'Digital Service Provider Assessment', 
    1, 
    'Initial', 
    'Assessment of digital service provider covering cloud services and digital infrastructure', 
    'digital-service-provider', 
    'medium', 
    'NL', 
    'Third-Party Assessment', 
    'Anna van der Berg', 
    'Dutch Cyber Assessment B.V.', 
    'Under Review', 
    'Basic', 
    45, 
    'High', 
    'Assessment reveals significant gaps in cybersecurity measures implementation. Critical findings in access control, vulnerability management, and incident response capabilities.', 
    'Immediate action required to address critical security gaps. Recommend comprehensive security program implementation with external support.', 
    '2024-06-30', 
    'Under Review'
),
(
    'Healthcare Sector NIS2 Compliance', 
    1, 
    'Triggered', 
    'Triggered assessment following security incident in healthcare information systems', 
    'important-entity', 
    'medium', 
    'IT', 
    'Authority Audit', 
    'Marco Rossi', 
    'Italian Cybersecurity Agency', 
    'Completed', 
    'Intermediate', 
    72, 
    'Medium', 
    'Post-incident assessment identified weaknesses in incident detection and response procedures. Network security controls are adequate but require enhancement.', 
    'Strengthen incident response capabilities and implement continuous security monitoring. Enhance staff training and awareness programs.', 
    '2024-10-15', 
    'Notified'
),
(
    'Financial Services NIS2 Assessment', 
    1, 
    'Initial', 
    'Comprehensive assessment of financial services entity covering payment systems and financial infrastructure', 
    'important-entity', 
    'large', 
    'ES', 
    'Self-Assessment', 
    'Carlos Martinez', 
    'Internal Risk Management', 
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
CREATE INDEX IF NOT EXISTS idx_nis2_assessments_org ON nis2_assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_nis2_assessments_type ON nis2_assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_nis2_assessments_entity_type ON nis2_assessments(entity_type);
CREATE INDEX IF NOT EXISTS idx_nis2_assessments_member_state ON nis2_assessments(member_state);
CREATE INDEX IF NOT EXISTS idx_nis2_assessments_status ON nis2_assessments(status);
CREATE INDEX IF NOT EXISTS idx_nis2_assessments_risk_rating ON nis2_assessments(risk_rating);
