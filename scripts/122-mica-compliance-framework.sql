-- MICA Compliance Framework Tables
-- Create MICA compliance requirements table
CREATE TABLE IF NOT EXISTS mica_requirements (
    id SERIAL PRIMARY KEY,
    requirement_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    control_type VARCHAR(50) NOT NULL DEFAULT 'Technical',
    implementation_guidance TEXT,
    testing_procedures TEXT,
    references TEXT,
    priority VARCHAR(20) DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mica_requirements_category ON mica_requirements(category);
CREATE INDEX IF NOT EXISTS idx_mica_requirements_control_type ON mica_requirements(control_type);
CREATE INDEX IF NOT EXISTS idx_mica_requirements_priority ON mica_requirements(priority);

-- Insert sample MICA requirements
INSERT INTO mica_requirements (requirement_id, title, description, category, subcategory, control_type, implementation_guidance, testing_procedures, references, priority) VALUES
('MICA-1.1', 'Information Security Governance', 'Establish and maintain an information security governance framework', 'Governance', 'Security Governance', 'Administrative', 'Implement board-level oversight of information security', 'Review governance documentation and meeting minutes', 'MICA Article 5', 'High'),
('MICA-1.2', 'Risk Management Framework', 'Implement comprehensive risk management processes', 'Risk Management', 'Risk Assessment', 'Administrative', 'Conduct regular risk assessments and maintain risk register', 'Review risk assessment methodology and documentation', 'MICA Article 6', 'High'),
('MICA-2.1', 'Data Classification', 'Classify data based on sensitivity and criticality', 'Data Protection', 'Data Classification', 'Administrative', 'Develop data classification scheme and labeling procedures', 'Review data classification policies and sample classifications', 'MICA Article 10', 'High'),
('MICA-2.2', 'Data Encryption', 'Implement encryption for data at rest and in transit', 'Data Protection', 'Encryption', 'Technical', 'Use approved encryption algorithms and key management', 'Test encryption implementation and key management procedures', 'MICA Article 12', 'High'),
('MICA-3.1', 'Access Control Management', 'Implement role-based access control systems', 'Access Control', 'User Access', 'Technical', 'Deploy identity and access management solutions', 'Review access control configurations and user permissions', 'MICA Article 15', 'High'),
('MICA-3.2', 'Privileged Access Management', 'Control and monitor privileged user access', 'Access Control', 'Privileged Access', 'Technical', 'Implement PAM solutions with session monitoring', 'Test privileged access controls and monitoring capabilities', 'MICA Article 16', 'High'),
('MICA-4.1', 'Network Security Controls', 'Implement network segmentation and monitoring', 'Network Security', 'Network Controls', 'Technical', 'Deploy firewalls, IDS/IPS, and network monitoring tools', 'Test network security controls and monitoring effectiveness', 'MICA Article 20', 'High'),
('MICA-4.2', 'Secure Network Architecture', 'Design and maintain secure network architecture', 'Network Security', 'Architecture', 'Technical', 'Implement defense-in-depth network security architecture', 'Review network architecture documentation and configurations', 'MICA Article 21', 'Medium'),
('MICA-5.1', 'Incident Response Plan', 'Establish incident response procedures', 'Incident Management', 'Response Planning', 'Administrative', 'Develop and maintain incident response playbooks', 'Test incident response procedures through tabletop exercises', 'MICA Article 25', 'High'),
('MICA-5.2', 'Business Continuity Planning', 'Implement business continuity and disaster recovery', 'Business Continuity', 'Continuity Planning', 'Administrative', 'Develop BCP and DRP with regular testing', 'Review and test business continuity procedures', 'MICA Article 28', 'High'),
('MICA-6.1', 'Security Awareness Training', 'Provide regular security awareness training', 'Human Resources', 'Training', 'Administrative', 'Implement comprehensive security awareness program', 'Review training records and assess training effectiveness', 'MICA Article 30', 'Medium'),
('MICA-6.2', 'Background Screening', 'Conduct background checks for personnel', 'Human Resources', 'Screening', 'Administrative', 'Implement background screening procedures for all staff', 'Review background screening policies and records', 'MICA Article 32', 'Medium'),
('MICA-7.1', 'Vendor Risk Management', 'Assess and manage third-party risks', 'Third Party Risk', 'Vendor Assessment', 'Administrative', 'Implement vendor risk assessment and monitoring program', 'Review vendor risk assessments and contracts', 'MICA Article 35', 'High'),
('MICA-7.2', 'Supply Chain Security', 'Secure the technology supply chain', 'Third Party Risk', 'Supply Chain', 'Administrative', 'Implement supply chain security controls and assessments', 'Review supply chain security procedures and vendor assessments', 'MICA Article 36', 'Medium'),
('MICA-8.1', 'Security Monitoring', 'Implement continuous security monitoring', 'Monitoring', 'Security Operations', 'Technical', 'Deploy SIEM and security monitoring tools', 'Test security monitoring capabilities and alert procedures', 'MICA Article 40', 'High'),
('MICA-8.2', 'Log Management', 'Centralize and protect security logs', 'Monitoring', 'Log Management', 'Technical', 'Implement centralized logging with integrity protection', 'Review log management procedures and retention policies', 'MICA Article 41', 'Medium'),
('MICA-9.1', 'Vulnerability Management', 'Implement vulnerability assessment and remediation', 'Vulnerability Management', 'Assessment', 'Technical', 'Deploy vulnerability scanning and patch management', 'Test vulnerability management processes and remediation timelines', 'MICA Article 45', 'High'),
('MICA-9.2', 'Penetration Testing', 'Conduct regular penetration testing', 'Vulnerability Management', 'Testing', 'Technical', 'Perform annual penetration testing by qualified assessors', 'Review penetration testing reports and remediation evidence', 'MICA Article 46', 'Medium'),
('MICA-10.1', 'Compliance Monitoring', 'Monitor compliance with MICA requirements', 'Compliance', 'Monitoring', 'Administrative', 'Implement compliance monitoring and reporting procedures', 'Review compliance monitoring reports and corrective actions', 'MICA Article 50', 'High'),
('MICA-10.2', 'Audit and Assessment', 'Conduct regular compliance audits', 'Compliance', 'Auditing', 'Administrative', 'Perform internal and external compliance audits', 'Review audit reports and management responses', 'MICA Article 51', 'High');

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_mica_requirements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mica_requirements_updated_at
    BEFORE UPDATE ON mica_requirements
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_requirements_updated_at();
