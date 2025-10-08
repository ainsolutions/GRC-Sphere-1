-- Qatar NIA Remediation Tracking
-- Create table for tracking Qatar NIA compliance remediation activities

CREATE TABLE IF NOT EXISTS qatar_nia_remediation (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES qatar_nia_assessments(id),
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

-- Insert sample Qatar NIA remediation items
INSERT INTO qatar_nia_remediation (
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
    'Incomplete Incident Response Plan', 
    'Current incident response plan lacks specific procedures for Qatar NIA notification requirements and does not cover all types of cybersecurity incidents', 
    'IM-01', 
    'High', 
    'Update incident response plan to include Qatar NIA notification procedures, define incident classification criteria, and establish communication protocols with relevant authorities', 
    'CISO Office', 
    '2024-03-20', 
    'In Progress', 
    70, 
    'Draft updated incident response plan completed. Currently under review by legal and compliance teams.', 
    'Under Review', 
    18000.00, 
    'Legal review in progress. Training materials being developed for incident response team.'
),
(
    1, 
    'Supplier Security Assessment Gap', 
    'No formal cybersecurity assessment process exists for critical suppliers and third-party service providers', 
    'SR-01', 
    'Medium', 
    'Implement supplier cybersecurity assessment framework including risk assessment questionnaires, on-site assessments for critical suppliers, and ongoing monitoring procedures', 
    'Procurement & Risk Teams', 
    '2024-05-15', 
    'Open', 
    30, 
    'Supplier assessment questionnaire template created. Pilot assessment with 3 critical suppliers planned.', 
    'Pending', 
    28000.00, 
    'Waiting for budget approval for external assessment support and supplier security tools.'
),
(
    1, 
    'Cryptographic Controls Implementation', 
    'Current encryption implementation lacks comprehensive key management and does not cover all sensitive data at rest', 
    'CR-02', 
    'High', 
    'Deploy enterprise key management system and implement encryption for all sensitive data repositories including databases and file systems', 
    'IT Security Team', 
    '2024-06-30', 
    'In Progress', 
    45, 
    'Key management solution selected and procurement initiated. Database encryption pilot completed successfully.', 
    'Under Review', 
    85000.00, 
    'Hardware delivery expected by end of March. Implementation team identified and trained.'
),
(
    2, 
    'Network Segmentation Enhancement', 
    'Current network architecture lacks proper segmentation between critical and non-critical systems', 
    'CS-03', 
    'Medium', 
    'Implement network segmentation strategy with dedicated security zones for critical banking systems, deploy next-generation firewalls, and establish network access controls', 
    'Network Infrastructure Team', 
    '2024-04-10', 
    'Completed', 
    100, 
    'Network segmentation implemented with dedicated zones for core banking systems. All firewalls configured and tested. Network access controls operational.', 
    'Verified', 
    65000.00, 
    'Solution successfully implemented and operational. Network security monitoring enhanced with new segmentation.'
),
(
    3, 
    'Physical Security Controls', 
    'Physical access controls for critical infrastructure facilities do not meet Qatar NIA requirements for biometric authentication', 
    'PE-02', 
    'Critical', 
    'Upgrade physical access control systems with biometric authentication, implement visitor management system, and enhance surveillance capabilities for critical areas', 
    'Facilities Security Team', 
    '2024-02-28', 
    'Overdue', 
    85, 
    'Biometric access control system installed for 85% of critical areas. Remaining areas require specialized equipment for hazardous environments.', 
    'Under Review', 
    45000.00, 
    'Delayed due to specialized equipment requirements for oil and gas facilities. Additional vendor support engaged.'
),
(
    3, 
    'Business Continuity Plan Update', 
    'Business continuity plan does not adequately address cybersecurity incidents and lacks specific recovery procedures for critical oil and gas operations', 
    'BC-01', 
    'High', 
    'Update business continuity plan to include cybersecurity incident scenarios, define recovery time objectives for critical operations, and establish alternative operational procedures', 
    'Business Continuity Manager', 
    '2024-07-20', 
    'Open', 
    20, 
    'Gap analysis completed. Updated BCP framework under development. Stakeholder consultation sessions scheduled.', 
    'Pending', 
    35000.00, 
    'External consultant engaged for oil and gas sector expertise. Regulatory consultation required.'
),
(
    4, 
    'Advanced Threat Detection', 
    'Current security monitoring lacks advanced threat detection capabilities required for telecommunications infrastructure protection', 
    'OS-05', 
    'High', 
    'Deploy advanced threat detection and response platform with machine learning capabilities, implement user and entity behavior analytics, and enhance security operations center', 
    'Security Operations Team', 
    '2024-05-30', 
    'In Progress', 
    60, 
    'Advanced threat detection platform selected and deployment initiated. SOC team training completed. Integration with existing systems in progress.', 
    'Under Review', 
    120000.00, 
    'Platform deployment on schedule. Integration challenges with legacy telecommunications systems being addressed.'
),
(
    4, 
    'Telecommunications Security Standards', 
    'Current security standards do not fully align with Qatar NIA requirements for telecommunications service providers', 
    'CO-01', 
    'Medium', 
    'Update security standards and procedures to align with Qatar NIA requirements, conduct gap analysis, and implement necessary policy changes', 
    'Compliance Team', 
    '2024-04-25', 
    'In Progress', 
    75, 
    'Gap analysis completed. Updated security standards drafted and under review. Policy implementation plan developed.', 
    'Under Review', 
    15000.00, 
    'Standards review in final stages. Implementation training scheduled for next month.'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_qatar_nia_remediation_assessment ON qatar_nia_remediation(assessment_id);
CREATE INDEX IF NOT EXISTS idx_qatar_nia_remediation_status ON qatar_nia_remediation(status);
CREATE INDEX IF NOT EXISTS idx_qatar_nia_remediation_risk_level ON qatar_nia_remediation(risk_level);
CREATE INDEX IF NOT EXISTS idx_qatar_nia_remediation_target_date ON qatar_nia_remediation(target_date);
CREATE INDEX IF NOT EXISTS idx_qatar_nia_remediation_responsible ON qatar_nia_remediation(responsible_party);
