-- Create Controls Repository table
CREATE TABLE IF NOT EXISTS governance_controls (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    control_id VARCHAR(100) NOT NULL, -- e.g., A.9.1.1, PR.DS-1
    framework VARCHAR(100) NOT NULL, -- ISO 27001, NIST CSF, COBIT, etc.
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    control_type VARCHAR(100), -- Preventive, Detective, Corrective, Administrative, Technical, Physical
    implementation_status VARCHAR(50) DEFAULT 'not_implemented', -- not_implemented, partially_implemented, implemented, not_applicable
    effectiveness_rating VARCHAR(50), -- low, medium, high, not_assessed
    maturity_level VARCHAR(50), -- initial, managed, defined, quantitatively_managed, optimizing
    owner VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    responsible_party VARCHAR(100),
    implementation_date DATE,
    last_assessment_date DATE,
    next_assessment_date DATE,
    assessment_frequency VARCHAR(50) DEFAULT 'annual',
    test_results JSONB, -- Store test results as JSON
    evidence_location VARCHAR(500), -- Where evidence is stored
    related_risks TEXT[], -- Array of related risk IDs
    related_assets TEXT[], -- Array of related asset IDs
    dependencies TEXT[], -- Array of control dependencies
    cost_estimate DECIMAL(10,2),
    maintenance_cost DECIMAL(10,2),
    automation_level VARCHAR(50) DEFAULT 'manual', -- manual, semi_automated, automated
    monitoring_frequency VARCHAR(50),
    reporting_frequency VARCHAR(50),
    compliance_requirements TEXT[], -- Array of compliance requirements
    applicable_regulations TEXT[], -- Array of applicable regulations
    control_measures TEXT[], -- Array of specific control measures
    exceptions TEXT, -- Any exceptions or deviations
    remediation_plan TEXT, -- Plan for addressing gaps
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_governance_controls_framework ON governance_controls(framework);
CREATE INDEX IF NOT EXISTS idx_governance_controls_category ON governance_controls(category);
CREATE INDEX IF NOT EXISTS idx_governance_controls_status ON governance_controls(implementation_status);
CREATE INDEX IF NOT EXISTS idx_governance_controls_owner ON governance_controls(owner);
CREATE INDEX IF NOT EXISTS idx_governance_controls_control_id ON governance_controls(control_id);

-- Insert sample data
INSERT INTO governance_controls (name, description, control_id, framework, category, subcategory, control_type, implementation_status, effectiveness_rating, maturity_level, owner, department, responsible_party, implementation_date, last_assessment_date, next_assessment_date, assessment_frequency, cost_estimate, maintenance_cost, automation_level, monitoring_frequency, reporting_frequency, compliance_requirements, applicable_regulations, control_measures, created_by) VALUES
('Access Control Management', 'Controls for managing user access to information systems and services', 'A.9.1.1', 'ISO 27001', 'Access Control', 'User Access Management', 'Administrative', 'implemented', 'high', 'defined', 'IT Security Team', 'IT Security', 'Identity & Access Manager', '2023-01-15', '2024-01-10', '2024-07-10', 'semi-annual', 50000.00, 10000.00, 'semi_automated', 'continuous', 'monthly', ARRAY['ISO 27001', 'SOX'], ARRAY['GDPR', 'HIPAA'], ARRAY['User provisioning', 'Access reviews', 'Privileged access management'], 'Identity & Access Manager'),
('Data Encryption', 'Encryption controls for data at rest and in transit', 'PR.DS-1', 'NIST CSF', 'Data Security', 'Encryption', 'Technical', 'implemented', 'high', 'quantitatively_managed', 'Data Security Team', 'IT Security', 'Data Security Manager', '2023-02-01', '2024-01-08', '2024-07-08', 'semi-annual', 75000.00, 15000.00, 'automated', 'continuous', 'monthly', ARRAY['NIST CSF', 'ISO 27001'], ARRAY['GDPR', 'PCI DSS'], ARRAY['Database encryption', 'File encryption', 'Communication encryption'], 'Data Security Manager'),
('Security Monitoring', 'Continuous monitoring of security events and incidents', 'A.12.4.1', 'ISO 27001', 'Monitoring', 'Event Monitoring', 'Technical', 'partially_implemented', 'medium', 'managed', 'SOC Team', 'Security Operations', 'SOC Manager', '2023-03-01', '2024-01-05', '2024-07-05', 'semi-annual', 100000.00, 20000.00, 'automated', 'continuous', 'daily', ARRAY['ISO 27001', 'NIST CSF'], ARRAY['SOX', 'PCI DSS'], ARRAY['SIEM monitoring', 'Log analysis', 'Threat detection'], 'SOC Manager'),
('Vulnerability Management', 'Processes for identifying and remediating vulnerabilities', 'PR.IP-12', 'NIST CSF', 'Vulnerability Management', 'Assessment', 'Administrative', 'implemented', 'high', 'defined', 'Vulnerability Management Team', 'Security Operations', 'Vulnerability Manager', '2023-04-01', '2024-01-12', '2024-07-12', 'semi-annual', 60000.00, 12000.00, 'semi_automated', 'weekly', 'monthly', ARRAY['NIST CSF', 'ISO 27001'], ARRAY['PCI DSS', 'SOX'], ARRAY['Vulnerability scanning', 'Patch management', 'Risk assessment'], 'Vulnerability Manager'),
('Incident Response', 'Processes for responding to security incidents', 'RS.RP-1', 'NIST CSF', 'Incident Response', 'Response Process', 'Administrative', 'implemented', 'high', 'defined', 'Incident Response Team', 'Security Operations', 'Incident Response Manager', '2023-05-01', '2024-01-15', '2024-07-15', 'semi-annual', 40000.00, 8000.00, 'manual', 'as_needed', 'monthly', ARRAY['NIST CSF', 'ISO 27001'], ARRAY['SOX', 'PCI DSS'], ARRAY['Incident detection', 'Response procedures', 'Recovery processes'], 'Incident Response Manager'),
('Security Awareness Training', 'Training programs for security awareness', 'PR.AT-1', 'NIST CSF', 'Training', 'Awareness', 'Administrative', 'implemented', 'medium', 'managed', 'Training Team', 'Human Resources', 'Training Manager', '2023-06-01', '2024-01-18', '2024-07-18', 'annual', 25000.00, 5000.00, 'manual', 'quarterly', 'quarterly', ARRAY['NIST CSF', 'ISO 27001'], ARRAY['SOX'], ARRAY['Employee training', 'Phishing simulation', 'Security awareness campaigns'], 'Training Manager'),
('Backup and Recovery', 'Controls for data backup and recovery', 'PR.DS-4', 'NIST CSF', 'Data Protection', 'Backup', 'Technical', 'implemented', 'high', 'defined', 'IT Operations Team', 'IT Operations', 'Backup Administrator', '2023-07-01', '2024-01-20', '2024-07-20', 'semi-annual', 80000.00, 16000.00, 'automated', 'daily', 'monthly', ARRAY['NIST CSF', 'ISO 27001'], ARRAY['SOX', 'PCI DSS'], ARRAY['Automated backups', 'Recovery testing', 'Offsite storage'], 'Backup Administrator'),
('Network Security', 'Controls for network security and segmentation', 'PR.AC-5', 'NIST CSF', 'Network Security', 'Segmentation', 'Technical', 'implemented', 'high', 'defined', 'Network Security Team', 'IT Security', 'Network Security Manager', '2023-08-01', '2024-01-22', '2024-07-22', 'semi-annual', 90000.00, 18000.00, 'automated', 'continuous', 'monthly', ARRAY['NIST CSF', 'ISO 27001'], ARRAY['PCI DSS', 'SOX'], ARRAY['Firewall management', 'Network segmentation', 'Intrusion detection'], 'Network Security Manager');

