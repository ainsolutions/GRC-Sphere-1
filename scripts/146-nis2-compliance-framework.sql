-- NIS2 Compliance Framework
-- Create table for NIS2 security measures and requirements

CREATE TABLE IF NOT EXISTS nis2_requirements (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(100) NOT NULL,
    control_id VARCHAR(20) NOT NULL UNIQUE,
    control_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    control_type VARCHAR(50) NOT NULL, -- Mandatory, Recommended
    maturity_level VARCHAR(20) NOT NULL, -- Basic, Intermediate, Advanced
    status VARCHAR(50) DEFAULT 'Not Implemented', -- Implemented, Partially Implemented, Not Implemented, Not Applicable
    implementation_guidance TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert NIS2 security measures
INSERT INTO nis2_requirements (domain, control_id, control_name, description, control_type, maturity_level, implementation_guidance) VALUES

-- Risk Management
('Risk Management', 'RM-01', 'Risk Management Framework', 'Establish comprehensive risk management framework for network and information systems', 'Mandatory', 'Basic', 'Implement systematic approach to identify, assess, and manage cybersecurity risks'),
('Risk Management', 'RM-02', 'Risk Assessment Methodology', 'Develop and implement risk assessment methodology', 'Mandatory', 'Intermediate', 'Create standardized risk assessment processes with regular reviews'),
('Risk Management', 'RM-03', 'Risk Treatment Plans', 'Implement risk treatment plans based on risk assessments', 'Mandatory', 'Advanced', 'Develop comprehensive risk treatment strategies with monitoring'),
('Risk Management', 'RM-04', 'Risk Monitoring and Review', 'Establish continuous risk monitoring and review processes', 'Mandatory', 'Advanced', 'Implement ongoing risk monitoring with regular management reporting'),
('Risk Management', 'RM-05', 'Risk Communication', 'Establish risk communication processes across the organization', 'Mandatory', 'Intermediate', 'Create clear risk communication channels and reporting structures'),

-- Corporate Governance
('Corporate Governance', 'CG-01', 'Cybersecurity Governance Structure', 'Establish clear cybersecurity governance structure and accountability', 'Mandatory', 'Basic', 'Define roles, responsibilities, and reporting lines for cybersecurity'),
('Corporate Governance', 'CG-02', 'Board Oversight', 'Ensure appropriate board-level oversight of cybersecurity risks', 'Mandatory', 'Advanced', 'Establish board cybersecurity committee and regular reporting'),
('Corporate Governance', 'CG-03', 'Cybersecurity Policies', 'Develop and maintain comprehensive cybersecurity policies', 'Mandatory', 'Basic', 'Create policy framework covering all aspects of cybersecurity'),
('Corporate Governance', 'CG-04', 'Compliance Management', 'Establish compliance management processes for regulatory requirements', 'Mandatory', 'Intermediate', 'Implement compliance monitoring and reporting systems'),
('Corporate Governance', 'CG-05', 'Performance Measurement', 'Implement cybersecurity performance measurement and reporting', 'Mandatory', 'Advanced', 'Establish KPIs and metrics for cybersecurity effectiveness'),

-- Cybersecurity Measures
('Cybersecurity Measures', 'CM-01', 'Access Control Management', 'Implement comprehensive access control measures', 'Mandatory', 'Intermediate', 'Deploy identity and access management with multi-factor authentication'),
('Cybersecurity Measures', 'CM-02', 'Asset Management', 'Maintain comprehensive inventory and management of network and information system assets', 'Mandatory', 'Basic', 'Implement asset discovery and inventory management systems'),
('Cybersecurity Measures', 'CM-03', 'Cryptography and Key Management', 'Implement appropriate cryptographic controls and key management', 'Mandatory', 'Advanced', 'Deploy encryption for data at rest and in transit with proper key management'),
('Cybersecurity Measures', 'CM-04', 'Network Security Controls', 'Implement network security controls including firewalls and intrusion detection', 'Mandatory', 'Intermediate', 'Deploy network segmentation and monitoring capabilities'),
('Cybersecurity Measures', 'CM-05', 'Endpoint Security', 'Implement endpoint security measures for all connected devices', 'Mandatory', 'Basic', 'Deploy endpoint protection and device management solutions'),

-- Network and Information Systems Security
('Network and Information Systems Security', 'NS-01', 'Network Architecture Security', 'Design and implement secure network architecture', 'Mandatory', 'Advanced', 'Implement network segmentation and zero-trust principles'),
('Network and Information Systems Security', 'NS-02', 'System Hardening', 'Implement system hardening measures for all network and information systems', 'Mandatory', 'Intermediate', 'Apply security baselines and configuration standards'),
('Network and Information Systems Security', 'NS-03', 'Vulnerability Management', 'Establish vulnerability management processes', 'Mandatory', 'Intermediate', 'Implement regular vulnerability scanning and patch management'),
('Network and Information Systems Security', 'NS-04', 'Security Monitoring', 'Implement continuous security monitoring capabilities', 'Mandatory', 'Advanced', 'Deploy SIEM and security analytics capabilities'),
('Network and Information Systems Security', 'NS-05', 'Data Protection', 'Implement data protection measures including backup and recovery', 'Mandatory', 'Basic', 'Establish data classification and protection controls'),

-- Incident Handling
('Incident Handling', 'IH-01', 'Incident Response Plan', 'Develop and maintain incident response plan', 'Mandatory', 'Basic', 'Create comprehensive incident response procedures'),
('Incident Handling', 'IH-02', 'Incident Detection and Analysis', 'Implement incident detection and analysis capabilities', 'Mandatory', 'Intermediate', 'Deploy incident detection tools and analysis procedures'),
('Incident Handling', 'IH-03', 'Incident Containment and Eradication', 'Establish incident containment and eradication procedures', 'Mandatory', 'Advanced', 'Develop rapid response and containment capabilities'),
('Incident Handling', 'IH-04', 'Incident Recovery', 'Implement incident recovery and lessons learned processes', 'Mandatory', 'Intermediate', 'Establish recovery procedures and post-incident analysis'),
('Incident Handling', 'IH-05', 'Incident Reporting', 'Establish incident reporting procedures including regulatory notifications', 'Mandatory', 'Basic', 'Create incident reporting workflows and templates'),

-- Business Continuity
('Business Continuity', 'BC-01', 'Business Continuity Plan', 'Develop and maintain business continuity plan', 'Mandatory', 'Basic', 'Create comprehensive business continuity procedures'),
('Business Continuity', 'BC-02', 'Disaster Recovery', 'Implement disaster recovery capabilities', 'Mandatory', 'Intermediate', 'Establish disaster recovery sites and procedures'),
('Business Continuity', 'BC-03', 'Backup and Recovery', 'Implement backup and recovery procedures', 'Mandatory', 'Basic', 'Establish regular backup and recovery testing'),
('Business Continuity', 'BC-04', 'Crisis Management', 'Establish crisis management procedures', 'Mandatory', 'Advanced', 'Develop crisis communication and management capabilities'),
('Business Continuity', 'BC-05', 'Testing and Exercises', 'Conduct regular testing and exercises of continuity plans', 'Mandatory', 'Intermediate', 'Implement regular testing and improvement processes'),

-- Supply Chain Security
('Supply Chain Security', 'SC-01', 'Supplier Risk Assessment', 'Conduct cybersecurity risk assessments of suppliers', 'Mandatory', 'Intermediate', 'Implement supplier cybersecurity assessment processes'),
('Supply Chain Security', 'SC-02', 'Supplier Security Requirements', 'Establish cybersecurity requirements for suppliers', 'Mandatory', 'Basic', 'Define minimum cybersecurity standards for suppliers'),
('Supply Chain Security', 'SC-03', 'Supplier Monitoring', 'Implement ongoing monitoring of supplier cybersecurity posture', 'Mandatory', 'Advanced', 'Establish continuous supplier security monitoring'),
('Supply Chain Security', 'SC-04', 'Third-Party Risk Management', 'Manage cybersecurity risks from third-party relationships', 'Mandatory', 'Intermediate', 'Implement third-party risk management framework'),
('Supply Chain Security', 'SC-05', 'Supply Chain Incident Response', 'Establish supply chain incident response procedures', 'Mandatory', 'Advanced', 'Develop coordinated incident response with suppliers'),

-- Security in Network and Information Systems Acquisition
('Security in Network and Information Systems Acquisition', 'SA-01', 'Security Requirements Definition', 'Define security requirements for system acquisitions', 'Mandatory', 'Basic', 'Establish security requirements in procurement processes'),
('Security in Network and Information Systems Acquisition', 'SA-02', 'Security Testing and Validation', 'Implement security testing and validation for acquired systems', 'Mandatory', 'Intermediate', 'Conduct security testing before system deployment'),
('Security in Network and Information Systems Acquisition', 'SA-03', 'Secure Development Lifecycle', 'Implement secure development lifecycle for custom systems', 'Mandatory', 'Advanced', 'Integrate security into development processes'),
('Security in Network and Information Systems Acquisition', 'SA-04', 'Configuration Management', 'Implement configuration management for acquired systems', 'Mandatory', 'Intermediate', 'Establish secure configuration baselines'),
('Security in Network and Information Systems Acquisition', 'SA-05', 'Acceptance Testing', 'Conduct security acceptance testing for new systems', 'Mandatory', 'Basic', 'Implement security acceptance criteria and testing'),

-- Policies on Vulnerability Disclosure
('Policies on Vulnerability Disclosure', 'VD-01', 'Vulnerability Disclosure Policy', 'Establish vulnerability disclosure policy', 'Mandatory', 'Basic', 'Create clear vulnerability disclosure procedures'),
('Policies on Vulnerability Disclosure', 'VD-02', 'Coordinated Vulnerability Disclosure', 'Implement coordinated vulnerability disclosure processes', 'Mandatory', 'Intermediate', 'Establish coordination with security researchers'),
('Policies on Vulnerability Disclosure', 'VD-03', 'Vulnerability Response', 'Implement vulnerability response procedures', 'Mandatory', 'Advanced', 'Develop rapid vulnerability response capabilities'),
('Policies on Vulnerability Disclosure', 'VD-04', 'Public Communication', 'Establish public communication procedures for vulnerabilities', 'Mandatory', 'Intermediate', 'Create vulnerability communication templates'),
('Policies on Vulnerability Disclosure', 'VD-05', 'Legal Protection', 'Provide legal protection for vulnerability researchers', 'Mandatory', 'Basic', 'Establish safe harbor provisions for researchers'),

-- Crisis Management
('Crisis Management', 'CR-01', 'Crisis Management Plan', 'Develop and maintain crisis management plan', 'Mandatory', 'Basic', 'Create comprehensive crisis management procedures'),
('Crisis Management', 'CR-02', 'Crisis Communication', 'Establish crisis communication procedures', 'Mandatory', 'Intermediate', 'Develop internal and external communication plans'),
('Crisis Management', 'CR-03', 'Crisis Response Team', 'Establish crisis response team and procedures', 'Mandatory', 'Advanced', 'Create dedicated crisis response capabilities'),
('Crisis Management', 'CR-04', 'Stakeholder Management', 'Implement stakeholder management during crises', 'Mandatory', 'Intermediate', 'Establish stakeholder communication procedures'),
('Crisis Management', 'CR-05', 'Recovery and Lessons Learned', 'Implement crisis recovery and lessons learned processes', 'Mandatory', 'Advanced', 'Establish post-crisis analysis and improvement');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nis2_requirements_domain ON nis2_requirements(domain);
CREATE INDEX IF NOT EXISTS idx_nis2_requirements_control_id ON nis2_requirements(control_id);
CREATE INDEX IF NOT EXISTS idx_nis2_requirements_status ON nis2_requirements(status);
