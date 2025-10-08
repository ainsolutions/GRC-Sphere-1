-- DORA Remediation Tracking
-- Create table for tracking DORA compliance remediation activities

CREATE TABLE IF NOT EXISTS dora_remediation (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES dora_assessments(id),
    finding_title VARCHAR(200) NOT NULL,
    finding_description TEXT,
    control_reference VARCHAR(50),
    risk_level VARCHAR(20) NOT NULL, -- Critical, High, Medium, Low
    remediation_action TEXT NOT NULL,
    responsible_party VARCHAR(200),
    target_date DATE,
    status VARCHAR(50) DEFAULT 'Open', -- Open, In Progress, On Hold, Completed, Overdue
    progress_percentage INTEGER DEFAULT 0,
    evidence_provided TEXT,
    verification_status VARCHAR(50) DEFAULT 'Pending', -- Pending, Under Review, Verified, Rejected
    cost_estimate DECIMAL(12,2) DEFAULT 0,
    actual_completion_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample DORA remediation items
INSERT INTO dora_remediation (
    assessment_id, 
    finding_title, 
    finding_description, 
    control_reference, 
    risk_level, 
    remediation_action, 
    responsible_party, 
    target_date, 
    status, 
    progress_percentage, 
    evidence_provided, 
    verification_status, 
    cost_estimate, 
    notes
) VALUES 
(
    1, 
    'Incomplete ICT Third-party Risk Framework', 
    'Current third-party risk management framework lacks comprehensive due diligence procedures and ongoing monitoring capabilities required by DORA', 
    'ICT-TPR-02', 
    'High', 
    'Implement comprehensive third-party risk management framework including due diligence procedures, contractual requirements, and ongoing monitoring processes', 
    'Risk Management Team', 
    '2024-03-30', 
    'In Progress', 
    70, 
    'Third-party risk policy updated. Due diligence templates created. Monitoring procedures under development.', 
    'Under Review', 
    45000.00, 
    'Contractual amendments with critical third parties in progress.'
),
(
    1, 
    'Digital Operational Resilience Testing Gap', 
    'No formal digital operational resilience testing program exists, including scenario-based testing and red team exercises', 
    'DORT-01', 
    'Critical', 
    'Establish comprehensive digital operational resilience testing program including vulnerability assessments, scenario-based testing, and red team exercises', 
    'IT Security Team', 
    '2024-05-15', 
    'Open', 
    25, 
    'Testing strategy framework drafted. External red team vendor selection in progress.', 
    'Pending', 
    85000.00, 
    'Budget approval pending for external testing services.'
),
(
    1, 
    'ICT Incident Management Enhancement', 
    'Current incident management procedures do not fully comply with DORA requirements for classification, reporting, and recovery', 
    'ICT-IM-01', 
    'Medium', 
    'Enhance ICT incident management procedures to include DORA-compliant classification, internal and external reporting, and recovery processes', 
    'Incident Response Team', 
    '2024-04-15', 
    'In Progress', 
    55, 
    'Incident classification matrix updated. External reporting procedures drafted. Recovery playbooks under review.', 
    'Under Review', 
    25000.00, 
    'Training sessions scheduled for incident response team.'
),
(
    2, 
    'ICT Asset Management System Upgrade', 
    'Current asset management system lacks comprehensive inventory and configuration management capabilities required for DORA compliance', 
    'ICT-AM-01', 
    'Medium', 
    'Upgrade ICT asset management system to include automated discovery, comprehensive inventory, and configuration management capabilities', 
    'IT Operations Team', 
    '2024-02-28', 
    'Completed', 
    100, 
    'New asset management platform deployed and configured. All critical assets inventoried and classified. Configuration management processes implemented.', 
    'Verified', 
    65000.00, 
    'System successfully implemented and operational. Staff training completed.'
),
(
    3, 
    'ICT Governance Framework Implementation', 
    'Lack of formal ICT governance framework with clear roles, responsibilities, and board oversight as required by DORA', 
    'ICT-GS-02', 
    'High', 
    'Implement comprehensive ICT governance framework including board oversight, clear roles and responsibilities, and performance monitoring', 
    'Governance Office', 
    '2024-06-30', 
    'Open', 
    15, 
    'Governance framework design initiated. Board ICT committee charter under development.', 
    'Pending', 
    35000.00, 
    'External governance consultant engaged to support implementation.'
),
(
    3, 
    'Business Continuity Plan Enhancement', 
    'Current business continuity plan does not adequately address ICT-specific recovery requirements and testing procedures', 
    'ICT-BC-01', 
    'High', 
    'Enhance business continuity plan to include ICT-specific recovery procedures, RTO/RPO definitions, and regular testing requirements', 
    'Business Continuity Manager', 
    '2024-08-15', 
    'In Progress', 
    40, 
    'ICT business continuity plan framework developed. RTO/RPO analysis completed for critical systems. Testing procedures under development.', 
    'Under Review', 
    40000.00, 
    'Tabletop exercise planned for Q2 2024 to validate procedures.'
),
(
    4, 
    'Cryptographic Controls Implementation', 
    'Insufficient cryptographic controls for data protection and secure communications as required by DORA security measures', 
    'ICT-SC-02', 
    'Medium', 
    'Implement comprehensive cryptographic controls including encryption for data at rest and in transit, key management, and secure communications', 
    'Information Security Team', 
    '2024-05-30', 
    'In Progress', 
    60, 
    'Encryption solution selected and partially deployed. Key management system configured. Secure communication protocols implemented.', 
    'Under Review', 
    55000.00, 
    'Remaining systems scheduled for encryption deployment in Q2 2024.'
),
(
    4, 
    'Security Monitoring Enhancement', 
    'Current security monitoring capabilities do not provide comprehensive coverage and real-time threat detection required for DORA compliance', 
    'ICT-SC-05', 
    'High', 
    'Enhance security monitoring capabilities with SIEM deployment, security analytics, and real-time threat detection', 
    'Security Operations Center', 
    '2024-07-31', 
    'Open', 
    20, 
    'SIEM platform evaluation completed. Vendor selection in progress. Technical requirements documented.', 
    'Pending', 
    120000.00, 
    'Budget approval received. Implementation team being assembled.'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dora_remediation_assessment ON dora_remediation(assessment_id);
CREATE INDEX IF NOT EXISTS idx_dora_remediation_status ON dora_remediation(status);
CREATE INDEX IF NOT EXISTS idx_dora_remediation_risk_level ON dora_remediation(risk_level);
CREATE INDEX IF NOT EXISTS idx_dora_remediation_target_date ON dora_remediation(target_date);
CREATE INDEX IF NOT EXISTS idx_dora_remediation_responsible ON dora_remediation(responsible_party);
