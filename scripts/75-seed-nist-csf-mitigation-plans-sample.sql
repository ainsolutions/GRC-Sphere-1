-- Insert sample NIST CSF mitigation plans
INSERT INTO nist_csf_mitigation_plans (
    plan_id,
    plan_name,
    risk_template_id,
    mitigation_strategy,
    status,
    progress_percentage,
    action_owner,
    due_date,
    investment_amount,
    residual_risk_level,
    priority,
    notes
) VALUES 
-- Critical Priority Plans
('NIST-MIT-0001', 'Identity Management System Upgrade', 1, 'Implement multi-factor authentication and privileged access management system to strengthen identity controls', 'In Progress', 65, 'John Smith', '2024-03-15', 150000.00, 'Medium', 'Critical', 'Phase 1 completed, working on MFA rollout'),
('NIST-MIT-0002', 'Endpoint Detection Response', 2, 'Deploy advanced EDR solution across all endpoints with 24/7 monitoring capabilities', 'Planning', 15, 'Sarah Johnson', '2024-04-30', 200000.00, 'Low', 'Critical', 'Vendor selection in progress'),
('NIST-MIT-0003', 'Data Encryption at Rest', 3, 'Implement full disk encryption and database encryption for all sensitive data stores', 'In Progress', 80, 'Mike Chen', '2024-02-28', 75000.00, 'Low', 'High', 'Database encryption completed, working on file systems'),

-- High Priority Plans
('NIST-MIT-0004', 'Security Awareness Training', 4, 'Comprehensive security awareness program with phishing simulation and quarterly training', 'Completed', 100, 'Lisa Rodriguez', '2024-01-31', 25000.00, 'Medium', 'High', 'Successfully completed Q1 training cycle'),
('NIST-MIT-0005', 'Network Segmentation', 5, 'Implement network micro-segmentation to limit lateral movement and contain breaches', 'In Progress', 45, 'David Wilson', '2024-05-15', 120000.00, 'Medium', 'High', 'Core network segments defined, implementing controls'),
('NIST-MIT-0006', 'Vulnerability Management', 6, 'Automated vulnerability scanning and patch management system deployment', 'In Progress', 70, 'Emily Davis', '2024-03-30', 80000.00, 'Low', 'High', 'Scanning tools deployed, working on patch automation'),

-- Medium Priority Plans
('NIST-MIT-0007', 'Incident Response Plan Update', 7, 'Revise and test incident response procedures with tabletop exercises', 'Planning', 25, 'Robert Taylor', '2024-06-30', 15000.00, 'Medium', 'Medium', 'Initial draft completed, scheduling tabletop exercises'),
('NIST-MIT-0008', 'Cloud Security Controls', 8, 'Implement cloud security posture management and container security', 'In Progress', 55, 'Jennifer Lee', '2024-04-15', 95000.00, 'Medium', 'Medium', 'CSPM tools configured, working on container policies'),
('NIST-MIT-0009', 'Third-Party Risk Assessment', 9, 'Establish vendor risk assessment program with continuous monitoring', 'Planning', 10, 'Mark Anderson', '2024-07-31', 40000.00, 'Medium', 'Medium', 'Risk assessment framework being developed'),
('NIST-MIT-0010', 'Data Loss Prevention', 10, 'Deploy DLP solution to monitor and prevent sensitive data exfiltration', 'In Progress', 35, 'Amanda White', '2024-05-30', 110000.00, 'Low', 'Medium', 'DLP policies defined, deploying monitoring agents'),

-- Low Priority Plans
('NIST-MIT-0011', 'Security Metrics Dashboard', 11, 'Develop executive dashboard for security metrics and KPI tracking', 'Planning', 5, 'Chris Brown', '2024-08-15', 30000.00, 'Low', 'Low', 'Requirements gathering phase'),
('NIST-MIT-0012', 'Mobile Device Management', 12, 'Implement MDM solution for corporate mobile devices and BYOD policy', 'In Progress', 40, 'Jessica Garcia', '2024-06-15', 45000.00, 'Medium', 'Low', 'MDM platform selected, configuring policies'),

-- Overdue Plans
('NIST-MIT-0013', 'Legacy System Hardening', 13, 'Security hardening of legacy systems that cannot be immediately replaced', 'In Progress', 30, 'Kevin Martinez', '2024-01-15', 60000.00, 'High', 'High', 'Delayed due to system dependencies'),
('NIST-MIT-0014', 'Backup and Recovery Testing', 14, 'Implement automated backup testing and disaster recovery validation', 'Planning', 20, 'Rachel Thompson', '2024-02-01', 35000.00, 'Medium', 'Medium', 'Testing procedures being finalized'),

-- Completed Plans
('NIST-MIT-0015', 'Firewall Rule Optimization', 15, 'Review and optimize firewall rules to reduce attack surface', 'Completed', 100, 'Daniel Kim', '2024-01-20', 20000.00, 'Low', 'Medium', 'Successfully reduced rule complexity by 40%');

-- Update some plans to have realistic aging status
UPDATE nist_csf_mitigation_plans 
SET due_date = CURRENT_DATE - INTERVAL '10 days'
WHERE plan_id IN ('NIST-MIT-0013', 'NIST-MIT-0014');

UPDATE nist_csf_mitigation_plans 
SET due_date = CURRENT_DATE + INTERVAL '5 days'
WHERE plan_id IN ('NIST-MIT-0001', 'NIST-MIT-0003');
