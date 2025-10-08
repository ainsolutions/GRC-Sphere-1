-- Seed sample data for technology control assessments
-- This script inserts sample data to demonstrate the new structure

-- Insert sample technology control assessments
INSERT INTO technology_control_assessments (
    assessment_id, technology_risk_id, assessment_name, assessment_date, 
    assessor_name, assessor_email, status, overall_effectiveness_score,
    total_controls, implemented_controls, partially_implemented_controls, 
    not_implemented_controls, notes, created_by
) VALUES 
(
    'TCA-2024-001', 
    (SELECT id FROM technology_risks LIMIT 1),
    'Cloud Infrastructure Security Assessment',
    '2024-01-15',
    'John Smith',
    'john.smith@company.com',
    'completed',
    4,
    12,
    8,
    3,
    1,
    'Comprehensive assessment of cloud security controls for AWS infrastructure',
    'system'
),
(
    'TCA-2024-002',
    (SELECT id FROM technology_risks OFFSET 1 LIMIT 1),
    'Database Security Controls Review',
    '2024-01-20',
    'Sarah Johnson',
    'sarah.johnson@company.com',
    'in_progress',
    3,
    15,
    10,
    4,
    1,
    'Annual review of database security controls and access management',
    'system'
);

-- Insert sample control assessment items
INSERT INTO technology_control_assessment_items (
    assessment_id, control_id, control_name, control_description, control_type,
    control_category, implementation_status, effectiveness_rating, testing_status,
    testing_frequency, last_test_date, next_test_date, evidence_location,
    gaps_identified, recommendations, responsible_party, implementation_date,
    target_completion_date, compliance_frameworks
) VALUES 
(
    1, 'AC-001', 'Multi-Factor Authentication', 
    'Implement MFA for all administrative access to cloud resources',
    'preventive', 'Access Control', 'fully_implemented', 5, 'passed',
    'quarterly', '2024-01-10', '2024-04-10', '/evidence/mfa-config.pdf',
    'None identified', 'Continue current implementation', 'IT Security Team',
    '2023-06-15', NULL, ARRAY['ISO27001', 'NIST', 'SOC2']
),
(
    1, 'AC-002', 'Privileged Access Management',
    'Control and monitor privileged access to critical systems',
    'preventive', 'Access Control', 'partially_implemented', 3, 'in_progress',
    'monthly', '2024-01-05', '2024-02-05', '/evidence/pam-logs.xlsx',
    'Some privileged accounts lack proper monitoring', 
    'Implement comprehensive PAM solution', 'IT Security Team',
    '2023-08-01', '2024-03-31', ARRAY['ISO27001', 'NIST']
),
(
    1, 'SC-001', 'Data Encryption at Rest',
    'Encrypt all sensitive data stored in cloud databases',
    'preventive', 'System Protection', 'fully_implemented', 4, 'passed',
    'semi_annually', '2023-12-15', '2024-06-15', '/evidence/encryption-report.pdf',
    'None identified', 'Maintain current encryption standards', 'Database Team',
    '2023-05-01', NULL, ARRAY['ISO27001', 'PCI-DSS']
),
(
    2, 'DB-001', 'Database Access Controls',
    'Implement role-based access control for database systems',
    'preventive', 'Access Control', 'fully_implemented', 4, 'passed',
    'quarterly', '2024-01-12', '2024-04-12', '/evidence/db-access-matrix.xlsx',
    'None identified', 'Regular review of access permissions', 'Database Team',
    '2023-07-01', NULL, ARRAY['ISO27001', 'SOX']
),
(
    2, 'DB-002', 'Database Activity Monitoring',
    'Monitor and log all database activities for security analysis',
    'detective', 'Monitoring', 'partially_implemented', 3, 'in_progress',
    'monthly', '2024-01-08', '2024-02-08', '/evidence/db-monitoring-config.pdf',
    'Limited coverage of non-production databases',
    'Extend monitoring to all database instances', 'Database Team',
    '2023-09-01', '2024-02-29', ARRAY['ISO27001', 'SOX']
);

-- Insert sample evidence records
INSERT INTO technology_control_assessment_evidence (
    assessment_item_id, evidence_id, evidence_name, evidence_type, file_path,
    file_size, description, collection_date, collected_by, verification_status,
    verified_by, verified_date
) VALUES 
(
    1, 'EVD-001', 'MFA Configuration Report', 'document', '/evidence/mfa-config.pdf',
    2048576, 'Detailed report showing MFA configuration for all admin accounts',
    '2024-01-10', 'John Smith', 'verified', 'Security Manager', '2024-01-11'
),
(
    2, 'EVD-002', 'PAM System Logs', 'log_file', '/evidence/pam-logs.xlsx',
    1024000, 'Privileged access monitoring logs for Q4 2023',
    '2024-01-05', 'John Smith', 'verified', 'Security Manager', '2024-01-06'
),
(
    3, 'EVD-003', 'Encryption Status Report', 'document', '/evidence/encryption-report.pdf',
    3072000, 'Comprehensive report on data encryption implementation',
    '2023-12-15', 'Database Admin', 'verified', 'Security Manager', '2023-12-16'
);

-- Insert sample risk-control mappings
INSERT INTO technology_risk_control_mappings (
    technology_risk_id, control_id, control_name, mapping_type, 
    effectiveness_contribution, implementation_priority, cost_estimate,
    implementation_effort, business_justification
) VALUES 
(
    (SELECT id FROM technology_risks LIMIT 1),
    'AC-001', 'Multi-Factor Authentication', 'prevents', 85.0, 1, 15000.00,
    'medium', 'Critical for preventing unauthorized access to cloud resources'
),
(
    (SELECT id FROM technology_risks LIMIT 1),
    'AC-002', 'Privileged Access Management', 'monitors', 70.0, 2, 50000.00,
    'high', 'Essential for monitoring and controlling privileged access'
),
(
    (SELECT id FROM technology_risks LIMIT 1),
    'SC-001', 'Data Encryption at Rest', 'mitigates', 90.0, 1, 25000.00,
    'medium', 'Protects sensitive data from unauthorized access'
);

-- Insert sample audit history
INSERT INTO technology_control_assessment_history (
    assessment_id, assessment_item_id, field_changed, old_value, new_value,
    change_reason, changed_by
) VALUES 
(
    1, 2, 'implementation_status', 'not_implemented', 'partially_implemented',
    'Initial implementation completed, monitoring phase started', 'John Smith'
),
(
    1, 2, 'effectiveness_rating', '2', '3',
    'Improved effectiveness after partial implementation', 'John Smith'
),
(
    2, 5, 'testing_status', 'not_tested', 'in_progress',
    'Started testing database monitoring controls', 'Sarah Johnson'
);
