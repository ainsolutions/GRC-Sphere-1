-- NIS2 Remediation Tracking
-- Create table for tracking NIS2 compliance remediation activities

CREATE TABLE IF NOT EXISTS nis2_remediation (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES nis2_assessments(id),
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

-- Insert sample NIS2 remediation items
INSERT INTO nis2_remediation (
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
    'Current incident response plan lacks specific procedures for NIS2 notification requirements and does not cover all types of cybersecurity incidents', 
    'IH-01', 
    'High', 
    'Update incident response plan to include NIS2 notification procedures, define incident classification criteria, and establish communication protocols with relevant authorities', 
    'CISO Office', 
    '2024-03-15', 
    'In Progress', 
    65, 
    'Draft updated incident response plan completed. Currently under review by legal and compliance teams.', 
    'Under Review', 
    15000.00, 
    'Legal review in progress. Training materials being developed.'
),
(
    1, 
    'Supply Chain Security Assessment Gap', 
    'No formal cybersecurity assessment process exists for critical suppliers and third-party service providers', 
    'SC-01', 
    'Medium', 
    'Implement supplier cybersecurity assessment framework including risk assessment questionnaires, on-site assessments for critical suppliers, and ongoing monitoring procedures', 
    'Procurement & Risk Teams', 
    '2024-04-30', 
    'Open', 
    25, 
    'Supplier assessment questionnaire template created. Pilot assessment with 3 critical suppliers planned.', 
    'Pending', 
    25000.00, 
    'Waiting for budget approval for external assessment support.'
),
(
    1, 
    'Network Segmentation Deficiencies', 
    'Critical systems are not properly segmented from general corporate network, creating potential for lateral movement in case of breach', 
    'NS-01', 
    'High', 
    'Implement network segmentation strategy with dedicated security zones for critical systems, deploy next-generation firewalls, and establish network access controls', 
    'IT Infrastructure Team', 
    '2024-05-31', 
    'In Progress', 
    40, 
    'Network architecture design completed. Firewall procurement in progress. Implementation scheduled for Q2 2024.', 
    'Under Review', 
    75000.00, 
    'Hardware delivery expected by end of February. Implementation team identified.'
),
(
    2, 
    'Vulnerability Management Process Enhancement', 
    'Current vulnerability management process lacks automated scanning capabilities and does not cover all network segments', 
    'NS-03', 
    'Medium', 
    'Deploy comprehensive vulnerability management solution with automated scanning, risk-based prioritization, and integration with patch management systems', 
    'Security Operations Team', 
    '2024-02-28', 
    'Completed', 
    100, 
    'Vulnerability management platform deployed and configured. All network segments now covered by automated scanning. Integration with ITSM completed.', 
    'Verified', 
    45000.00, 
    'Solution successfully implemented and operational. Monthly vulnerability reports now generated automatically.'
),
(
    3, 
    'Multi-Factor Authentication Implementation', 
    'Multi-factor authentication is not implemented for all privileged accounts and remote access scenarios', 
    'CM-01', 
    'Critical', 
    'Deploy MFA solution for all privileged accounts, remote access, and critical system access. Implement risk-based authentication policies.', 
    'Identity & Access Management Team', 
    '2024-01-31', 
    'Overdue', 
    80, 
    'MFA solution deployed for 80% of privileged accounts. Remaining accounts require application-specific integration work.', 
    'Under Review', 
    30000.00, 
    'Delayed due to integration challenges with legacy systems. Additional vendor support engaged.'
),
(
    3, 
    'Security Monitoring and SIEM Enhancement', 
    'Current SIEM solution has limited coverage and lacks advanced threat detection capabilities required for NIS2 compliance', 
    'NS-04', 
    'High', 
    'Upgrade SIEM platform with advanced analytics, implement user and entity behavior analytics (UEBA), and enhance log collection coverage', 
    'Security Operations Center', 
    '2024-06-15', 
    'Open', 
    15, 
    'SIEM platform evaluation completed. Vendor selection in progress. Technical requirements documented.', 
    'Pending', 
    120000.00, 
    'Budget approval received. RFP process initiated with three potential vendors.'
),
(
    4, 
    'Business Continuity Plan Update', 
    'Business continuity plan does not adequately address cybersecurity incidents and lacks specific recovery procedures for critical healthcare systems', 
    'BC-01', 
    'Medium', 
    'Update business continuity plan to include cybersecurity incident scenarios, define recovery time objectives for critical systems, and establish alternative communication channels', 
    'Business Continuity Manager', 
    '2024-04-15', 
    'In Progress', 
    55, 
    'Gap analysis completed. Updated BCP framework developed. Currently conducting tabletop exercises to validate procedures.', 
    'Under Review', 
    20000.00, 
    'Tabletop exercise scheduled for next month. External consultant engaged for validation.'
),
(
    4, 
    'Staff Security Awareness Training', 
    'Current security awareness training program does not cover NIS2-specific requirements and incident reporting procedures', 
    'CG-03', 
    'Low', 
    'Develop comprehensive security awareness training program covering NIS2 requirements, incident reporting procedures, and role-specific security responsibilities', 
    'Human Resources & Security Team', 
    '2024-03-31', 
    'In Progress', 
    70, 
    'Training content developed and reviewed. E-learning platform configured. Pilot training conducted with management team.', 
    'Under Review', 
    12000.00, 
    'Positive feedback from pilot training. Full rollout planned for next month.'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nis2_remediation_assessment ON nis2_remediation(assessment_id);
CREATE INDEX IF NOT EXISTS idx_nis2_remediation_status ON nis2_remediation(status);
CREATE INDEX IF NOT EXISTS idx_nis2_remediation_risk_level ON nis2_remediation(risk_level);
CREATE INDEX IF NOT EXISTS idx_nis2_remediation_target_date ON nis2_remediation(target_date);
CREATE INDEX IF NOT EXISTS idx_nis2_remediation_responsible ON nis2_remediation(responsible_party);
