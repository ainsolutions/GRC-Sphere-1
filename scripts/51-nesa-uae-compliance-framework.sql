-- NESA UAE Compliance Framework
-- Create table for NESA UAE cybersecurity controls and requirements

CREATE TABLE IF NOT EXISTS nesa_uae_requirements (
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

-- Insert NESA UAE cybersecurity controls
INSERT INTO nesa_uae_requirements (domain, control_id, control_name, description, control_type, maturity_level, implementation_guidance) VALUES

-- Cybersecurity Governance
('Cybersecurity Governance', 'CG-01', 'Cybersecurity Strategy', 'Establish and maintain a comprehensive cybersecurity strategy aligned with business objectives', 'Mandatory', 'Basic', 'Develop a documented cybersecurity strategy that addresses risk management, governance structure, and strategic objectives'),
('Cybersecurity Governance', 'CG-02', 'Cybersecurity Policy', 'Implement cybersecurity policies and procedures', 'Mandatory', 'Basic', 'Create comprehensive cybersecurity policies covering all aspects of information security'),
('Cybersecurity Governance', 'CG-03', 'Risk Management Framework', 'Establish risk management processes and procedures', 'Mandatory', 'Intermediate', 'Implement a formal risk management framework with regular risk assessments'),
('Cybersecurity Governance', 'CG-04', 'Roles and Responsibilities', 'Define cybersecurity roles and responsibilities', 'Mandatory', 'Basic', 'Clearly define roles and responsibilities for cybersecurity across the organization'),
('Cybersecurity Governance', 'CG-05', 'Board Oversight', 'Ensure board-level oversight of cybersecurity', 'Mandatory', 'Advanced', 'Establish board-level cybersecurity oversight and reporting mechanisms'),

-- Asset Management
('Asset Management', 'AM-01', 'Asset Inventory', 'Maintain comprehensive inventory of all assets', 'Mandatory', 'Basic', 'Create and maintain an accurate inventory of all IT and OT assets'),
('Asset Management', 'AM-02', 'Asset Classification', 'Classify assets based on criticality and sensitivity', 'Mandatory', 'Intermediate', 'Implement asset classification scheme based on business impact and data sensitivity'),
('Asset Management', 'AM-03', 'Asset Ownership', 'Assign ownership and responsibility for assets', 'Mandatory', 'Basic', 'Assign clear ownership and accountability for all assets'),
('Asset Management', 'AM-04', 'Asset Handling', 'Implement secure asset handling procedures', 'Mandatory', 'Intermediate', 'Establish procedures for secure handling, storage, and disposal of assets'),
('Asset Management', 'AM-05', 'Media Handling', 'Secure handling of removable media', 'Mandatory', 'Basic', 'Implement controls for secure handling and disposal of removable media'),

-- Human Resources Security
('Human Resources Security', 'HR-01', 'Security Screening', 'Conduct security screening for personnel', 'Mandatory', 'Basic', 'Implement background checks and security clearance processes'),
('Human Resources Security', 'HR-02', 'Security Training', 'Provide cybersecurity awareness training', 'Mandatory', 'Basic', 'Conduct regular cybersecurity awareness training for all personnel'),
('Human Resources Security', 'HR-03', 'Terms of Employment', 'Include security responsibilities in employment terms', 'Mandatory', 'Basic', 'Include cybersecurity responsibilities in employment contracts'),
('Human Resources Security', 'HR-04', 'Disciplinary Process', 'Establish disciplinary process for security violations', 'Mandatory', 'Intermediate', 'Implement formal disciplinary procedures for security policy violations'),
('Human Resources Security', 'HR-05', 'Termination Procedures', 'Secure termination and change of employment procedures', 'Mandatory', 'Basic', 'Establish procedures for secure termination and role changes'),

-- Physical and Environmental Security
('Physical and Environmental Security', 'PE-01', 'Physical Security Perimeter', 'Establish physical security perimeters', 'Mandatory', 'Basic', 'Implement physical barriers and access controls around facilities'),
('Physical and Environmental Security', 'PE-02', 'Physical Entry Controls', 'Control physical access to facilities', 'Mandatory', 'Basic', 'Implement access control systems for physical entry to facilities'),
('Physical and Environmental Security', 'PE-03', 'Protection Against Environmental Threats', 'Protect against environmental threats', 'Mandatory', 'Intermediate', 'Implement controls to protect against fire, flood, earthquake, and other environmental threats'),
('Physical and Environmental Security', 'PE-04', 'Equipment Protection', 'Protect equipment from physical and environmental threats', 'Mandatory', 'Basic', 'Implement physical protection measures for critical equipment'),
('Physical and Environmental Security', 'PE-05', 'Secure Disposal', 'Secure disposal or reuse of equipment', 'Mandatory', 'Basic', 'Implement secure procedures for equipment disposal and sanitization'),

-- Communications and Operations Management
('Communications and Operations Management', 'CO-01', 'Operational Procedures', 'Document and implement operational procedures', 'Mandatory', 'Basic', 'Establish documented operational procedures and responsibilities'),
('Communications and Operations Management', 'CO-02', 'Change Management', 'Implement change management procedures', 'Mandatory', 'Intermediate', 'Establish formal change management processes for systems and operations'),
('Communications and Operations Management', 'CO-03', 'Capacity Management', 'Monitor and manage system capacity', 'Mandatory', 'Intermediate', 'Implement capacity monitoring and management procedures'),
('Communications and Operations Management', 'CO-04', 'System Acceptance', 'Establish system acceptance criteria', 'Mandatory', 'Advanced', 'Define acceptance criteria and testing procedures for new systems'),
('Communications and Operations Management', 'CO-05', 'Protection Against Malicious Code', 'Implement malware protection', 'Mandatory', 'Basic', 'Deploy and maintain anti-malware solutions across all systems'),

-- Access Control
('Access Control', 'AC-01', 'Access Control Policy', 'Establish access control policy and procedures', 'Mandatory', 'Basic', 'Develop comprehensive access control policies and procedures'),
('Access Control', 'AC-02', 'User Access Management', 'Manage user access rights', 'Mandatory', 'Basic', 'Implement user access management processes including provisioning and deprovisioning'),
('Access Control', 'AC-03', 'User Responsibilities', 'Define user responsibilities for access control', 'Mandatory', 'Basic', 'Establish user responsibilities and acceptable use policies'),
('Access Control', 'AC-04', 'Network Access Control', 'Control network access', 'Mandatory', 'Intermediate', 'Implement network access controls and segmentation'),
('Access Control', 'AC-05', 'Operating System Access Control', 'Control access to operating systems', 'Mandatory', 'Intermediate', 'Implement operating system access controls and authentication'),

-- Systems Development and Maintenance
('Systems Development and Maintenance', 'SD-01', 'Security Requirements', 'Include security requirements in systems development', 'Mandatory', 'Intermediate', 'Integrate security requirements into system development lifecycle'),
('Systems Development and Maintenance', 'SD-02', 'Security in Development Process', 'Implement security in development processes', 'Mandatory', 'Advanced', 'Embed security practices throughout the development process'),
('Systems Development and Maintenance', 'SD-03', 'Technical Vulnerability Management', 'Manage technical vulnerabilities', 'Mandatory', 'Intermediate', 'Implement vulnerability management processes and procedures'),
('Systems Development and Maintenance', 'SD-04', 'Restrictions on Software Installation', 'Control software installation', 'Mandatory', 'Basic', 'Implement controls to restrict unauthorized software installation'),
('Systems Development and Maintenance', 'SD-05', 'System Security Testing', 'Conduct security testing of systems', 'Mandatory', 'Advanced', 'Perform regular security testing and penetration testing'),

-- Incident Management
('Incident Management', 'IM-01', 'Incident Response Planning', 'Establish incident response procedures', 'Mandatory', 'Basic', 'Develop and maintain incident response plans and procedures'),
('Incident Management', 'IM-02', 'Reporting Security Events', 'Report security events and weaknesses', 'Mandatory', 'Basic', 'Establish procedures for reporting security incidents and events'),
('Incident Management', 'IM-03', 'Incident Response Team', 'Establish incident response team', 'Mandatory', 'Intermediate', 'Form and train incident response team with defined roles and responsibilities'),
('Incident Management', 'IM-04', 'Evidence Collection', 'Collect and preserve evidence', 'Mandatory', 'Advanced', 'Implement procedures for evidence collection and forensic analysis'),
('Incident Management', 'IM-05', 'Learning from Incidents', 'Learn from security incidents', 'Mandatory', 'Intermediate', 'Establish processes to learn from incidents and improve security posture'),

-- Business Continuity Management
('Business Continuity Management', 'BC-01', 'Business Continuity Planning', 'Develop business continuity plans', 'Mandatory', 'Intermediate', 'Develop comprehensive business continuity and disaster recovery plans'),
('Business Continuity Management', 'BC-02', 'Business Impact Analysis', 'Conduct business impact analysis', 'Mandatory', 'Intermediate', 'Perform regular business impact analysis to identify critical processes'),
('Business Continuity Management', 'BC-03', 'Recovery Planning', 'Develop recovery procedures', 'Mandatory', 'Advanced', 'Establish detailed recovery procedures and alternative processing facilities'),
('Business Continuity Management', 'BC-04', 'Business Continuity Testing', 'Test business continuity plans', 'Mandatory', 'Advanced', 'Regularly test and update business continuity plans'),
('Business Continuity Management', 'BC-05', 'Backup and Recovery', 'Implement backup and recovery procedures', 'Mandatory', 'Basic', 'Establish regular backup procedures and test recovery capabilities'),

-- Compliance
('Compliance', 'CM-01', 'Legal and Regulatory Requirements', 'Comply with legal and regulatory requirements', 'Mandatory', 'Basic', 'Identify and comply with applicable legal and regulatory requirements'),
('Compliance', 'CM-02', 'Data Protection and Privacy', 'Protect personal and sensitive data', 'Mandatory', 'Intermediate', 'Implement data protection and privacy controls'),
('Compliance', 'CM-03', 'Cryptographic Controls', 'Implement cryptographic controls', 'Mandatory', 'Advanced', 'Use appropriate cryptographic controls to protect sensitive information'),
('Compliance', 'CM-04', 'System Audit Controls', 'Implement audit controls and monitoring', 'Mandatory', 'Intermediate', 'Establish audit trails and monitoring capabilities'),
('Compliance', 'CM-05', 'Information Systems Audit', 'Conduct regular system audits', 'Mandatory', 'Advanced', 'Perform regular audits of information systems and security controls');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nesa_uae_requirements_domain ON nesa_uae_requirements(domain);
CREATE INDEX IF NOT EXISTS idx_nesa_uae_requirements_control_id ON nesa_uae_requirements(control_id);
CREATE INDEX IF NOT EXISTS idx_nesa_uae_requirements_status ON nesa_uae_requirements(status);
CREATE INDEX IF NOT EXISTS idx_nesa_uae_requirements_maturity_level ON nesa_uae_requirements(maturity_level);
