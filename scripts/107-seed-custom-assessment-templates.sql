-- Insert sample custom assessment templates
INSERT INTO custom_assessment_templates (name, description, template_type, vendor_type_id, is_public, created_by, settings) VALUES
('Cloud Security Assessment', 'Comprehensive security assessment for cloud service providers', 'third_party_risk', 1, true, 'system', '{"scoring_method": "weighted", "pass_threshold": 70}'),
('Financial Services Risk Assessment', 'Risk assessment template for financial service providers', 'third_party_risk', 2, true, 'system', '{"scoring_method": "weighted", "pass_threshold": 80}'),
('Healthcare Compliance Assessment', 'HIPAA and healthcare compliance focused assessment', 'third_party_risk', 3, true, 'system', '{"scoring_method": "weighted", "pass_threshold": 85}'),
('IT Infrastructure Assessment', 'Assessment for IT infrastructure and technology vendors', 'third_party_risk', 4, true, 'system', '{"scoring_method": "weighted", "pass_threshold": 75}'),
('Quick Security Screening', 'Lightweight security assessment for low-risk vendors', 'third_party_risk', NULL, true, 'system', '{"scoring_method": "simple", "pass_threshold": 60}'),
('Comprehensive Due Diligence', 'Full due diligence assessment for high-risk vendors', 'third_party_risk', NULL, true, 'system', '{"scoring_method": "weighted", "pass_threshold": 90}');

-- Insert risk items for Cloud Security Assessment template
INSERT INTO custom_assessment_template_risk_items (template_id, category_name, category_description, risk_title, risk_description, default_likelihood, default_impact, control_catalogue, control_reference, is_mandatory, weight, sort_order) VALUES
-- Data Security Category
(1, 'Data Security', 'Data protection and encryption controls', 'Data Encryption at Rest', 'Vendor implements encryption for data stored in databases and file systems', 2, 4, 'ISO27001', 'A.10.1.1', true, 1.5, 1),
(1, 'Data Security', 'Data protection and encryption controls', 'Data Encryption in Transit', 'All data transmissions are encrypted using industry-standard protocols', 2, 4, 'ISO27001', 'A.13.1.1', true, 1.5, 2),
(1, 'Data Security', 'Data protection and encryption controls', 'Data Loss Prevention', 'Controls to prevent unauthorized data exfiltration', 3, 4, 'ISO27001', 'A.13.2.1', true, 1.3, 3),
(1, 'Data Security', 'Data protection and encryption controls', 'Data Backup and Recovery', 'Regular backups and tested recovery procedures', 2, 5, 'ISO27001', 'A.12.3.1', true, 1.4, 4),

-- Access Control Category
(1, 'Access Control', 'Identity and access management controls', 'Multi-Factor Authentication', 'MFA required for all administrative and user access', 3, 4, 'ISO27001', 'A.9.4.2', true, 1.4, 5),
(1, 'Access Control', 'Identity and access management controls', 'Privileged Access Management', 'Controls for managing and monitoring privileged accounts', 3, 5, 'ISO27001', 'A.9.2.3', true, 1.5, 6),
(1, 'Access Control', 'Identity and access management controls', 'Access Review Process', 'Regular review and certification of user access rights', 4, 3, 'ISO27001', 'A.9.2.5', true, 1.2, 7),

-- Infrastructure Security Category
(1, 'Infrastructure Security', 'Cloud infrastructure and network security', 'Network Segmentation', 'Proper network segmentation and micro-segmentation', 3, 4, 'ISO27001', 'A.13.1.3', true, 1.3, 8),
(1, 'Infrastructure Security', 'Cloud infrastructure and network security', 'Vulnerability Management', 'Regular vulnerability scanning and patch management', 4, 4, 'ISO27001', 'A.12.6.1', true, 1.4, 9),
(1, 'Infrastructure Security', 'Cloud infrastructure and network security', 'Container Security', 'Security controls for containerized applications', 3, 3, 'NIST', 'SC-39', false, 1.1, 10);

-- Insert risk items for Financial Services template
INSERT INTO custom_assessment_template_risk_items (template_id, category_name, category_description, risk_title, risk_description, default_likelihood, default_impact, control_catalogue, control_reference, is_mandatory, weight, sort_order) VALUES
-- Regulatory Compliance Category
(2, 'Regulatory Compliance', 'Financial services regulatory requirements', 'PCI DSS Compliance', 'Payment Card Industry Data Security Standard compliance', 2, 5, 'PCI_DSS', '3.4', true, 2.0, 1),
(2, 'Regulatory Compliance', 'Financial services regulatory requirements', 'SOX Compliance', 'Sarbanes-Oxley Act compliance for financial reporting', 2, 5, 'SOX', '404', true, 1.8, 2),
(2, 'Regulatory Compliance', 'Financial services regulatory requirements', 'Anti-Money Laundering', 'AML controls and monitoring systems', 3, 5, 'AML', 'BSA', true, 1.9, 3),

-- Financial Data Protection
(2, 'Financial Data Protection', 'Protection of sensitive financial information', 'Customer Data Encryption', 'Encryption of all customer financial data', 2, 5, 'ISO27001', 'A.10.1.1', true, 2.0, 4),
(2, 'Financial Data Protection', 'Protection of sensitive financial information', 'Transaction Monitoring', 'Real-time monitoring of financial transactions', 3, 4, 'ISO27001', 'A.12.4.1', true, 1.6, 5),
(2, 'Financial Data Protection', 'Protection of sensitive financial information', 'Data Retention Policies', 'Proper data retention and disposal policies', 3, 3, 'ISO27001', 'A.11.2.7', true, 1.3, 6);

-- Insert risk items for Healthcare template
INSERT INTO custom_assessment_template_risk_items (template_id, category_name, category_description, risk_title, risk_description, default_likelihood, default_impact, control_catalogue, control_reference, is_mandatory, weight, sort_order) VALUES
-- HIPAA Compliance Category
(3, 'HIPAA Compliance', 'Healthcare data protection requirements', 'PHI Encryption', 'Protected Health Information encryption at rest and in transit', 2, 5, 'HIPAA', '164.312(a)(2)(iv)', true, 2.0, 1),
(3, 'HIPAA Compliance', 'Healthcare data protection requirements', 'Access Controls for PHI', 'Role-based access controls for Protected Health Information', 3, 5, 'HIPAA', '164.312(a)(1)', true, 1.9, 2),
(3, 'HIPAA Compliance', 'Healthcare data protection requirements', 'Audit Logging', 'Comprehensive audit logging for PHI access', 2, 4, 'HIPAA', '164.312(b)', true, 1.7, 3),
(3, 'HIPAA Compliance', 'Healthcare data protection requirements', 'Business Associate Agreement', 'Proper BAA execution and compliance', 2, 5, 'HIPAA', '164.502(e)', true, 2.0, 4),

-- Medical Device Security
(3, 'Medical Device Security', 'Security for connected medical devices', 'Device Authentication', 'Strong authentication for medical device access', 3, 4, 'FDA', '21CFR820', true, 1.5, 5),
(3, 'Medical Device Security', 'Security for connected medical devices', 'Firmware Security', 'Secure firmware update and validation processes', 3, 4, 'FDA', '21CFR820', true, 1.4, 6);

-- Insert risk items for Quick Security Screening template
INSERT INTO custom_assessment_template_risk_items (template_id, category_name, category_description, risk_title, risk_description, default_likelihood, default_impact, control_catalogue, control_reference, is_mandatory, weight, sort_order) VALUES
-- Basic Security Controls
(5, 'Basic Security', 'Essential security controls', 'Antivirus Protection', 'Up-to-date antivirus and anti-malware protection', 3, 3, 'ISO27001', 'A.12.2.1', true, 1.0, 1),
(5, 'Basic Security', 'Essential security controls', 'Firewall Protection', 'Network firewall protection and configuration', 3, 3, 'ISO27001', 'A.13.1.1', true, 1.0, 2),
(5, 'Basic Security', 'Essential security controls', 'Password Policy', 'Strong password policy implementation', 4, 2, 'ISO27001', 'A.9.4.3', true, 1.0, 3),
(5, 'Basic Security', 'Essential security controls', 'Software Updates', 'Regular security updates and patch management', 4, 3, 'ISO27001', 'A.12.6.1', true, 1.0, 4),

-- Data Handling
(5, 'Data Handling', 'Basic data protection measures', 'Data Classification', 'Basic data classification and handling procedures', 3, 3, 'ISO27001', 'A.8.2.1', true, 1.0, 5),
(5, 'Data Handling', 'Basic data protection measures', 'Secure Disposal', 'Secure data disposal procedures', 3, 3, 'ISO27001', 'A.8.3.2', true, 1.0, 6);

-- Update usage count for templates (simulate some usage)
UPDATE custom_assessment_templates SET usage_count = 15 WHERE id = 1;
UPDATE custom_assessment_templates SET usage_count = 8 WHERE id = 2;
UPDATE custom_assessment_templates SET usage_count = 12 WHERE id = 3;
UPDATE custom_assessment_templates SET usage_count = 6 WHERE id = 4;
UPDATE custom_assessment_templates SET usage_count = 25 WHERE id = 5;
UPDATE custom_assessment_templates SET usage_count = 4 WHERE id = 6;
