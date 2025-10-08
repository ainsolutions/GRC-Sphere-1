-- Insert risk categories
INSERT INTO risk_categories (category_name, description) VALUES
('Cybersecurity', 'Information security and cyber threats'),
('Operational', 'Business operations and processes'),
('Financial', 'Financial and economic risks'),
('Compliance', 'Regulatory and compliance risks'),
('Strategic', 'Strategic and business risks'),
('Reputational', 'Brand and reputation risks')
ON CONFLICT DO NOTHING;

-- Insert compliance frameworks
INSERT INTO compliance_frameworks (framework_name, version, description) VALUES
('ISO 27001', '2022', 'Information Security Management Systems'),
('NIST Cybersecurity Framework', '1.1', 'Framework for Improving Critical Infrastructure Cybersecurity'),
('SOC 2', 'Type II', 'Service Organization Control 2'),
('GDPR', '2018', 'General Data Protection Regulation'),
('PCI DSS', '4.0', 'Payment Card Industry Data Security Standard'),
('HIPAA', '2013', 'Health Insurance Portability and Accountability Act')
ON CONFLICT DO NOTHING;

-- Insert sample compliance requirements for ISO 27001
INSERT INTO compliance_requirements (framework_id, requirement_id, requirement_title, requirement_description, compliance_status, responsible_party) VALUES
((SELECT id FROM compliance_frameworks WHERE framework_name = 'ISO 27001'), 'A.5.1.1', 'Information security policy', 'An information security policy shall be defined, approved by management, published and communicated to employees and relevant external parties.', 'Compliant', 'CISO'),
((SELECT id FROM compliance_frameworks WHERE framework_name = 'ISO 27001'), 'A.8.1.1', 'Inventory of assets', 'Assets associated with information and information processing facilities shall be identified and an inventory of these assets shall be drawn up and maintained.', 'Partially Compliant', 'IT Manager'),
((SELECT id FROM compliance_frameworks WHERE framework_name = 'ISO 27001'), 'A.9.1.1', 'Access control policy', 'An access control policy shall be established, documented and reviewed based on business and information security requirements.', 'Non-Compliant', 'Security Team'),
((SELECT id FROM compliance_frameworks WHERE framework_name = 'ISO 27001'), 'A.12.6.1', 'Management of technical vulnerabilities', 'Information about technical vulnerabilities of information systems being used shall be obtained in a timely fashion.', 'Compliant', 'IT Security'),
((SELECT id FROM compliance_frameworks WHERE framework_name = 'ISO 27001'), 'A.16.1.1', 'Responsibilities and procedures', 'Management responsibilities and procedures shall be established to ensure a quick, effective and orderly response to information security incidents.', 'Partially Compliant', 'Incident Response Team')
ON CONFLICT DO NOTHING;
