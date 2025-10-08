-- Insert sample risk categories
INSERT INTO risk_categories (category_name, description) VALUES
('Cybersecurity', 'Information security and cyber threats'),
('Operational', 'Business operations and processes'),
('Compliance', 'Regulatory and compliance risks'),
('Strategic', 'Strategic business risks'),
('Financial', 'Financial and economic risks'),
('Reputational', 'Brand and reputation risks');

-- Insert sample compliance frameworks
INSERT INTO compliance_frameworks (framework_name, version, description) VALUES
('ISO 27001', '2022', 'Information Security Management Systems'),
('NIST Cybersecurity Framework', '1.1', 'Framework for Improving Critical Infrastructure Cybersecurity'),
('SOC 2', 'Type II', 'Service Organization Control 2'),
('GDPR', '2018', 'General Data Protection Regulation'),
('PCI DSS', '4.0', 'Payment Card Industry Data Security Standard');

-- Insert sample information assets
INSERT INTO information_assets (asset_name, asset_type, classification, owner, custodian, location, description, business_value, confidentiality_level, integrity_level, availability_level, retention_period, disposal_method) VALUES
('Customer Database', 'Database', 'Confidential', 'John Smith', 'IT Department', 'Primary Data Center', 'Main customer information database', 'High', 'High', 'High', 'High', 7, 'Secure deletion'),
('Financial System', 'Application', 'Restricted', 'Jane Doe', 'Finance Team', 'Cloud Environment', 'Core financial management system', 'Critical', 'High', 'High', 'High', 10, 'Certified destruction'),
('Employee Portal', 'Web Application', 'Internal', 'HR Manager', 'IT Department', 'Web Server', 'Internal employee self-service portal', 'Medium', 'Medium', 'Medium', 'High', 5, 'Standard deletion'),
('Backup Servers', 'Infrastructure', 'Confidential', 'IT Manager', 'IT Department', 'Secondary Data Center', 'Backup and disaster recovery systems', 'High', 'High', 'High', 'Critical', 3, 'Physical destruction');

-- Insert sample controls
INSERT INTO controls (control_id, control_name, control_description, control_type, control_category, iso27001_reference, implementation_status, effectiveness_rating, control_owner, implementation_date, testing_frequency) VALUES
('AC-001', 'Access Control Policy', 'Formal access control policy and procedures', 'Administrative', 'Access Control', 'A.9.1.1', 'Implemented', 'Effective', 'CISO', '2023-01-15', 'Annual'),
('AC-002', 'Multi-Factor Authentication', 'MFA for all privileged accounts', 'Technical', 'Access Control', 'A.9.4.2', 'Implemented', 'Effective', 'IT Security', '2023-02-01', 'Quarterly'),
('BC-001', 'Business Continuity Plan', 'Comprehensive business continuity planning', 'Administrative', 'Business Continuity', 'A.17.1.1', 'Implemented', 'Partially Effective', 'Risk Manager', '2023-03-01', 'Semi-Annual'),
('CR-001', 'Data Encryption', 'Encryption of data at rest and in transit', 'Technical', 'Cryptography', 'A.10.1.1', 'Implemented', 'Effective', 'IT Security', '2023-01-30', 'Quarterly');
