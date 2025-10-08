-- Insert sample ISO 27001 treatment plans
INSERT INTO iso27001_treatment_plans (
    iso27001_risk_id, iso_risk_id, risk_title, original_risk_level, original_risk_score,
    treatment_type, treatment_strategy, business_justification, estimated_cost, expected_risk_reduction,
    plan_status, owner, assigned_to, start_date, target_completion_date,
    residual_likelihood, residual_impact
) VALUES 
(1, 'ISO-R-000001', 'Unauthorized Access to Customer Database', 'High', 12, 'mitigate', 
 'Implement multi-factor authentication and access controls', 
 'Critical customer data requires enhanced protection to meet compliance requirements', 
 25000, 70, 'approved', 'John Smith', 'Security Team', '2024-01-15', '2024-06-30', 2, 2),

(2, 'ISO-R-000002', 'Data Breach via Email System', 'Medium', 9, 'mitigate',
 'Deploy email encryption and DLP solutions',
 'Email is primary vector for data exfiltration, encryption will reduce risk significantly',
 15000, 60, 'in_progress', 'Sarah Johnson', 'IT Team', '2024-02-01', '2024-05-31', 2, 3),

(3, 'ISO-R-000003', 'Insider Threat - Privileged User Abuse', 'Critical', 20, 'mitigate',
 'Implement privileged access management and monitoring',
 'Privileged users pose highest risk, monitoring will detect and prevent abuse',
 40000, 80, 'approved', 'Mike Davis', 'Security Team', '2024-01-01', '2024-08-31', 1, 3),

(4, 'ISO-R-000004', 'Third-party Vendor Security Risk', 'Medium', 8, 'transfer',
 'Require vendor security insurance and contractual liability',
 'Transfer financial risk to vendors while maintaining operational controls',
 5000, 50, 'draft', 'Lisa Chen', 'Procurement', '2024-03-01', '2024-07-31', 2, 2),

(5, 'ISO-R-000005', 'Legacy System Vulnerabilities', 'High', 15, 'mitigate',
 'Upgrade legacy systems and implement compensating controls',
 'Legacy systems cannot be patched, replacement is necessary for security',
 75000, 85, 'approved', 'Tom Wilson', 'Infrastructure Team', '2024-02-15', '2024-12-31', 1, 2);

-- Insert sample treatment controls
INSERT INTO iso27001_treatment_controls (
    treatment_plan_id, treatment_plan_id_display, treatment_type, iso_risk_id, risk_title,
    control_title, control_description, control_type, control_category,
    implementation_status, effectiveness_rating, implementation_cost, assigned_owner,
    due_date, automation_level, compliance_frameworks, evidence_location, testing_procedure
) VALUES 
(1, 'ISO-TP-000001', 'mitigate', 'ISO-R-000001', 'Unauthorized Access to Customer Database',
 'Multi-Factor Authentication Implementation', 'Deploy MFA for all database access', 'preventive', 'Access Control',
 'in_progress', 4, 15000, 'Security Team', '2024-04-30', 'semi_automated', 
 ARRAY['ISO 27001', 'SOC 2'], '/security/evidence/mfa-implementation', 'Test MFA bypass attempts'),

(1, 'ISO-TP-000001', 'mitigate', 'ISO-R-000001', 'Unauthorized Access to Customer Database',
 'Database Access Logging', 'Implement comprehensive database access logging', 'detective', 'Monitoring',
 'completed', 5, 8000, 'Security Team', '2024-03-31', 'fully_automated',
 ARRAY['ISO 27001', 'PCI DSS'], '/security/evidence/db-logging', 'Review log completeness and accuracy'),

(2, 'ISO-TP-000002', 'mitigate', 'ISO-R-000002', 'Data Breach via Email System',
 'Email Encryption Deployment', 'Deploy end-to-end email encryption', 'preventive', 'Cryptography',
 'in_progress', 3, 10000, 'IT Team', '2024-04-15', 'semi_automated',
 ARRAY['ISO 27001'], '/it/evidence/email-encryption', 'Test encryption key management'),

(2, 'ISO-TP-000002', 'mitigate', 'ISO-R-000002', 'Data Breach via Email System',
 'Data Loss Prevention (DLP)', 'Implement DLP solution for email monitoring', 'detective', 'Data Protection',
 'not_started', 0, 5000, 'IT Team', '2024-05-15', 'fully_automated',
 ARRAY['ISO 27001', 'GDPR'], '/it/evidence/dlp-implementation', 'Test DLP policy effectiveness'),

(3, 'ISO-TP-000003', 'mitigate', 'ISO-R-000003', 'Insider Threat - Privileged User Abuse',
 'Privileged Access Management (PAM)', 'Deploy PAM solution for privileged accounts', 'preventive', 'Access Control',
 'in_progress', 4, 25000, 'Security Team', '2024-06-30', 'semi_automated',
 ARRAY['ISO 27001', 'NIST'], '/security/evidence/pam-deployment', 'Test privileged session recording'),

(3, 'ISO-TP-000003', 'mitigate', 'ISO-R-000003', 'Insider Threat - Privileged User Abuse',
 'User Behavior Analytics (UBA)', 'Implement UBA for anomaly detection', 'detective', 'Monitoring',
 'not_started', 0, 15000, 'Security Team', '2024-07-31', 'fully_automated',
 ARRAY['ISO 27001'], '/security/evidence/uba-implementation', 'Test anomaly detection accuracy'),

(4, 'ISO-TP-000004', 'transfer', 'ISO-R-000004', 'Third-party Vendor Security Risk',
 'Vendor Security Assessment', 'Conduct comprehensive security assessments', 'preventive', 'Supplier Management',
 'completed', 4, 3000, 'Procurement', '2024-04-01', 'manual',
 ARRAY['ISO 27001', 'SOC 2'], '/procurement/evidence/vendor-assessments', 'Review assessment completeness'),

(5, 'ISO-TP-000005', 'mitigate', 'ISO-R-000005', 'Legacy System Vulnerabilities',
 'Legacy System Replacement', 'Replace critical legacy systems', 'preventive', 'System Development',
 'in_progress', 3, 50000, 'Infrastructure Team', '2024-10-31', 'manual',
 ARRAY['ISO 27001'], '/infrastructure/evidence/system-replacement', 'Test new system security controls'),

(5, 'ISO-TP-000005', 'mitigate', 'ISO-R-000005', 'Legacy System Vulnerabilities',
 'Network Segmentation', 'Isolate legacy systems in secure network segments', 'preventive', 'Network Security',
 'completed', 5, 10000, 'Infrastructure Team', '2024-03-31', 'semi_automated',
 ARRAY['ISO 27001', 'NIST'], '/infrastructure/evidence/network-segmentation', 'Test network isolation effectiveness');

-- Insert sample tracking entries
INSERT INTO iso27001_treatment_tracking (
    treatment_plan_id, control_id, treatment_plan_id_display, control_title, iso_risk_id, risk_title,
    tracking_type, old_status, new_status, tracking_date, description, responsible_party, created_by
) VALUES 
(1, 1, 'ISO-TP-000001', 'Multi-Factor Authentication Implementation', 'ISO-R-000001', 'Unauthorized Access to Customer Database',
 'status_change', 'not_started', 'in_progress', '2024-02-01', 'MFA implementation project initiated', 'Security Team', 'John Smith'),

(1, 2, 'ISO-TP-000001', 'Database Access Logging', 'ISO-R-000001', 'Unauthorized Access to Customer Database',
 'status_change', 'in_progress', 'completed', '2024-03-15', 'Database logging fully implemented and tested', 'Security Team', 'John Smith'),

(2, 3, 'ISO-TP-000002', 'Email Encryption Deployment', 'ISO-R-000002', 'Data Breach via Email System',
 'status_change', 'not_started', 'in_progress', '2024-02-15', 'Email encryption project started', 'IT Team', 'Sarah Johnson'),

(3, 5, 'ISO-TP-000003', 'Privileged Access Management (PAM)', 'ISO-R-000003', 'Insider Threat - Privileged User Abuse',
 'status_change', 'not_started', 'in_progress', '2024-03-01', 'PAM solution procurement completed, implementation started', 'Security Team', 'Mike Davis'),

(4, 7, 'ISO-TP-000004', 'Vendor Security Assessment', 'ISO-R-000004', 'Third-party Vendor Security Risk',
 'status_change', 'in_progress', 'completed', '2024-03-20', 'All vendor security assessments completed', 'Procurement', 'Lisa Chen'),

(5, 8, 'ISO-TP-000005', 'Legacy System Replacement', 'ISO-R-000005', 'Legacy System Vulnerabilities',
 'progress_update', 'in_progress', 'in_progress', '2024-03-10', '30% of legacy systems replaced, on track for completion', 'Infrastructure Team', 'Tom Wilson'),

(5, 9, 'ISO-TP-000005', 'Network Segmentation', 'ISO-R-000005', 'Legacy System Vulnerabilities',
 'status_change', 'in_progress', 'completed', '2024-03-25', 'Network segmentation completed and tested', 'Infrastructure Team', 'Tom Wilson');

-- Update treatment plan statistics
UPDATE iso27001_treatment_plans SET 
    total_controls = (SELECT COUNT(*) FROM iso27001_treatment_controls WHERE treatment_plan_id = iso27001_treatment_plans.id),
    completed_controls = (SELECT COUNT(*) FROM iso27001_treatment_controls WHERE treatment_plan_id = iso27001_treatment_plans.id AND implementation_status = 'completed'),
    overdue_controls = (SELECT COUNT(*) FROM iso27001_treatment_controls WHERE treatment_plan_id = iso27001_treatment_plans.id AND aging_status = 'overdue'),
    avg_effectiveness = (SELECT COALESCE(AVG(effectiveness_rating), 0) FROM iso27001_treatment_controls WHERE treatment_plan_id = iso27001_treatment_plans.id AND effectiveness_rating > 0);
