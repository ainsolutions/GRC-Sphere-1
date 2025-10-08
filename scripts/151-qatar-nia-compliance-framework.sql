-- Qatar NIA Compliance Framework
-- Create table for Qatar National Information Assurance security controls and requirements

CREATE TABLE IF NOT EXISTS qatar_nia_requirements (
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

-- Insert Qatar NIA security controls
INSERT INTO qatar_nia_requirements (domain, control_id, control_name, description, control_type, maturity_level, implementation_guidance) VALUES

-- Information Security Governance
('Information Security Governance', 'ISG-01', 'Information Security Policy', 'Establish comprehensive information security policy approved by senior management', 'Mandatory', 'Basic', 'Develop policy framework covering all aspects of information security governance'),
('Information Security Governance', 'ISG-02', 'Information Security Organization', 'Define information security roles and responsibilities within the organization', 'Mandatory', 'Basic', 'Establish clear organizational structure for information security management'),
('Information Security Governance', 'ISG-03', 'Management Direction for Information Security', 'Ensure management commitment and support for information security', 'Mandatory', 'Intermediate', 'Implement management oversight and regular review processes'),
('Information Security Governance', 'ISG-04', 'Contact with Authorities', 'Maintain appropriate contacts with relevant authorities and special interest groups', 'Mandatory', 'Basic', 'Establish communication channels with regulatory and law enforcement authorities'),
('Information Security Governance', 'ISG-05', 'Information Security in Project Management', 'Integrate information security requirements into project management processes', 'Mandatory', 'Intermediate', 'Include security considerations in all project lifecycle phases'),

-- Risk Management
('Risk Management', 'RM-01', 'Information Security Risk Management Process', 'Establish and maintain information security risk management process', 'Mandatory', 'Basic', 'Implement systematic approach to identify, assess, and treat information security risks'),
('Risk Management', 'RM-02', 'Information Security Risk Assessment', 'Conduct regular information security risk assessments', 'Mandatory', 'Intermediate', 'Perform comprehensive risk assessments using recognized methodologies'),
('Risk Management', 'RM-03', 'Information Security Risk Treatment', 'Implement risk treatment plans based on risk assessment results', 'Mandatory', 'Advanced', 'Develop and execute risk treatment strategies with appropriate controls'),
('Risk Management', 'RM-04', 'Information Security Risk Monitoring and Review', 'Monitor and review information security risks on regular basis', 'Mandatory', 'Advanced', 'Establish continuous risk monitoring with regular management reporting'),
('Risk Management', 'RM-05', 'Supplier Risk Assessment', 'Assess information security risks associated with supplier relationships', 'Mandatory', 'Intermediate', 'Evaluate and monitor supplier security posture and compliance'),

-- Asset Management
('Asset Management', 'AM-01', 'Responsibility for Assets', 'Assign ownership and responsibility for information assets', 'Mandatory', 'Basic', 'Establish asset ownership and custodian responsibilities'),
('Asset Management', 'AM-02', 'Information Classification', 'Classify information assets according to their importance and sensitivity', 'Mandatory', 'Intermediate', 'Implement information classification scheme with handling requirements'),
('Asset Management', 'AM-03', 'Information Labeling', 'Label information assets according to their classification', 'Mandatory', 'Basic', 'Apply consistent labeling standards for classified information'),
('Asset Management', 'AM-04', 'Information Handling', 'Handle information assets according to their classification requirements', 'Mandatory', 'Intermediate', 'Establish procedures for secure handling of classified information'),
('Asset Management', 'AM-05', 'Acceptable Use of Assets', 'Define and implement acceptable use policies for information assets', 'Mandatory', 'Basic', 'Create clear guidelines for appropriate use of organizational assets'),

-- Access Control
('Access Control', 'AC-01', 'Access Control Policy', 'Establish access control policy based on business and security requirements', 'Mandatory', 'Basic', 'Define comprehensive access control framework and principles'),
('Access Control', 'AC-02', 'Access to Networks and Network Services', 'Control access to networks and network services', 'Mandatory', 'Intermediate', 'Implement network access controls with authentication and authorization'),
('Access Control', 'AC-03', 'User Access Management', 'Manage user access rights throughout the access lifecycle', 'Mandatory', 'Intermediate', 'Establish user provisioning, modification, and deprovisioning processes'),
('Access Control', 'AC-04', 'User Responsibilities', 'Define user responsibilities for protecting authentication information', 'Mandatory', 'Basic', 'Educate users on secure authentication practices and responsibilities'),
('Access Control', 'AC-05', 'System and Application Access Control', 'Control access to systems and applications based on access control policy', 'Mandatory', 'Advanced', 'Implement role-based access control with least privilege principles'),

-- Cryptography
('Cryptography', 'CR-01', 'Policy on the Use of Cryptographic Controls', 'Develop policy on the use of cryptographic controls for protection of information', 'Mandatory', 'Intermediate', 'Establish cryptographic standards and implementation guidelines'),
('Cryptography', 'CR-02', 'Key Management', 'Implement key management system to support organizational use of cryptographic techniques', 'Mandatory', 'Advanced', 'Deploy comprehensive key lifecycle management processes'),
('Cryptography', 'CR-03', 'Protection of Information in Transit', 'Protect information in transit using appropriate cryptographic controls', 'Mandatory', 'Intermediate', 'Implement encryption for data transmission across networks'),
('Cryptography', 'CR-04', 'Protection of Information at Rest', 'Protect sensitive information at rest using encryption', 'Mandatory', 'Advanced', 'Deploy encryption solutions for data storage and databases'),
('Cryptography', 'CR-05', 'Digital Signatures', 'Use digital signatures to ensure authenticity and integrity of information', 'Recommended', 'Advanced', 'Implement digital signature solutions for critical transactions'),

-- Physical and Environmental Security
('Physical and Environmental Security', 'PE-01', 'Physical Security Perimeter', 'Define and implement physical security perimeters to protect areas containing sensitive information', 'Mandatory', 'Basic', 'Establish physical barriers and access controls for secure areas'),
('Physical and Environmental Security', 'PE-02', 'Physical Entry Controls', 'Implement entry controls to secure areas containing information processing facilities', 'Mandatory', 'Intermediate', 'Deploy access control systems for physical facility protection'),
('Physical and Environmental Security', 'PE-03', 'Protection Against Environmental Threats', 'Protect against environmental threats such as fire, flood, and other natural disasters', 'Mandatory', 'Intermediate', 'Implement environmental monitoring and protection systems'),
('Physical and Environmental Security', 'PE-04', 'Equipment Protection', 'Protect equipment from physical and environmental threats', 'Mandatory', 'Basic', 'Secure equipment against theft, damage, and environmental hazards'),
('Physical and Environmental Security', 'PE-05', 'Secure Disposal or Reuse of Equipment', 'Securely dispose of or reuse equipment containing storage media', 'Mandatory', 'Intermediate', 'Implement secure data sanitization and equipment disposal procedures'),

-- Operations Security
('Operations Security', 'OS-01', 'Operational Procedures and Responsibilities', 'Document and implement operational procedures and responsibilities', 'Mandatory', 'Basic', 'Establish comprehensive operational procedures and assign responsibilities'),
('Operations Security', 'OS-02', 'Change Management', 'Control changes to information processing facilities and systems', 'Mandatory', 'Intermediate', 'Implement formal change management processes with approval workflows'),
('Operations Security', 'OS-03', 'Capacity Management', 'Monitor and project resource utilization to ensure required system performance', 'Mandatory', 'Intermediate', 'Establish capacity planning and performance monitoring processes'),
('Operations Security', 'OS-04', 'Separation of Development, Testing and Operational Environments', 'Separate development, testing, and operational environments', 'Mandatory', 'Advanced', 'Implement environment segregation with appropriate access controls'),
('Operations Security', 'OS-05', 'Protection from Malware', 'Implement detection, prevention and recovery controls to protect against malware', 'Mandatory', 'Intermediate', 'Deploy comprehensive anti-malware solutions and procedures'),

-- Communications Security
('Communications Security', 'CS-01', 'Network Security Management', 'Manage and control networks to protect information in systems and applications', 'Mandatory', 'Intermediate', 'Implement network security controls and monitoring capabilities'),
('Communications Security', 'CS-02', 'Security of Network Services', 'Identify and include security mechanisms, service levels and management requirements in network services agreements', 'Mandatory', 'Advanced', 'Establish security requirements for network service providers'),
('Communications Security', 'CS-03', 'Segregation in Networks', 'Segregate groups of information services, users and information systems on networks', 'Mandatory', 'Advanced', 'Implement network segmentation and micro-segmentation strategies'),
('Communications Security', 'CS-04', 'Information Transfer Policies and Procedures', 'Establish formal transfer policies, procedures and controls to protect transfer of information', 'Mandatory', 'Intermediate', 'Define secure information transfer protocols and procedures'),
('Communications Security', 'CS-05', 'Electronic Messaging', 'Protect information involved in electronic messaging', 'Mandatory', 'Basic', 'Implement security controls for email and messaging systems'),

-- System Acquisition and Development
('System Acquisition and Development', 'SA-01', 'Security Requirements Analysis and Specification', 'Include information security requirements in requirements for new systems or enhancements', 'Mandatory', 'Intermediate', 'Integrate security requirements into system development lifecycle'),
('System Acquisition and Development', 'SA-02', 'Securing Application Services on Public Networks', 'Protect information involved in application service transactions over public networks', 'Mandatory', 'Advanced', 'Implement secure application architectures for public network access'),
('System Acquisition and Development', 'SA-03', 'System Security Testing', 'Conduct security testing during development and acceptance of systems', 'Mandatory', 'Advanced', 'Perform comprehensive security testing including penetration testing'),
('System Acquisition and Development', 'SA-04', 'Test Data Protection', 'Protect test data used for system testing', 'Mandatory', 'Intermediate', 'Implement data masking and anonymization for test environments'),
('System Acquisition and Development', 'SA-05', 'Secure System Engineering Principles', 'Apply secure system engineering principles in system development', 'Mandatory', 'Advanced', 'Integrate security by design principles throughout development'),

-- Supplier Relationships
('Supplier Relationships', 'SR-01', 'Information Security Policy for Supplier Relationships', 'Establish information security policy for managing risks arising from supplier relationships', 'Mandatory', 'Basic', 'Define security requirements and expectations for suppliers'),
('Supplier Relationships', 'SR-02', 'Addressing Security within Supplier Agreements', 'Address relevant information security requirements in agreements with suppliers', 'Mandatory', 'Intermediate', 'Include comprehensive security clauses in supplier contracts'),
('Supplier Relationships', 'SR-03', 'Information and Communication Technology Supply Chain', 'Include information security requirements in ICT supply chain agreements', 'Mandatory', 'Advanced', 'Implement supply chain security risk management processes'),
('Supplier Relationships', 'SR-04', 'Monitoring and Review of Supplier Services', 'Monitor, review and audit supplier service delivery on regular basis', 'Mandatory', 'Intermediate', 'Establish ongoing supplier security monitoring and assessment'),
('Supplier Relationships', 'SR-05', 'Managing Changes to Supplier Services', 'Manage changes to supplier services including maintenance of information security policies', 'Mandatory', 'Advanced', 'Control supplier service changes with security impact assessment'),

-- Information Security Incident Management
('Information Security Incident Management', 'IM-01', 'Management of Information Security Incidents and Improvements', 'Establish management responsibilities and procedures for information security incident management', 'Mandatory', 'Basic', 'Define incident management framework with clear roles and responsibilities'),
('Information Security Incident Management', 'IM-02', 'Reporting Information Security Events', 'Report information security events through appropriate management channels as quickly as possible', 'Mandatory', 'Basic', 'Establish incident reporting procedures and communication channels'),
('Information Security Incident Management', 'IM-03', 'Reporting Information Security Weaknesses', 'Require all employees and contractors to report information security weaknesses', 'Mandatory', 'Basic', 'Create vulnerability reporting mechanisms and procedures'),
('Information Security Incident Management', 'IM-04', 'Assessment of and Decision on Information Security Events', 'Assess information security events and decide if they are to be classified as incidents', 'Mandatory', 'Intermediate', 'Implement event classification and escalation procedures'),
('Information Security Incident Management', 'IM-05', 'Response to Information Security Incidents', 'Respond to information security incidents in accordance with documented procedures', 'Mandatory', 'Advanced', 'Develop comprehensive incident response capabilities and procedures'),

-- Business Continuity
('Business Continuity', 'BC-01', 'Information Security Continuity', 'Plan and implement information security continuity management', 'Mandatory', 'Intermediate', 'Develop business continuity plans with security considerations'),
('Business Continuity', 'BC-02', 'Redundancies', 'Implement redundancies to ensure availability of information processing facilities', 'Mandatory', 'Advanced', 'Deploy redundant systems and infrastructure for critical operations'),
('Business Continuity', 'BC-03', 'Information Backup', 'Maintain backup copies of information, software and system images', 'Mandatory', 'Basic', 'Implement comprehensive backup and recovery procedures'),
('Business Continuity', 'BC-04', 'Testing, Maintaining and Re-assessing Business Continuity Plans', 'Test, maintain and re-assess business continuity plans on regular basis', 'Mandatory', 'Intermediate', 'Conduct regular testing and updates of continuity plans'),
('Business Continuity', 'BC-05', 'Recovery Time and Recovery Point Objectives', 'Define and implement recovery time and recovery point objectives', 'Mandatory', 'Advanced', 'Establish measurable recovery objectives for critical systems'),

-- Compliance
('Compliance', 'CO-01', 'Identification of Applicable Legislation and Contractual Requirements', 'Identify and document all relevant legislative, statutory, regulatory and contractual requirements', 'Mandatory', 'Basic', 'Maintain comprehensive compliance requirements inventory'),
('Compliance', 'CO-02', 'Intellectual Property Rights', 'Ensure compliance with intellectual property rights requirements', 'Mandatory', 'Basic', 'Implement procedures to respect intellectual property rights'),
('Compliance', 'CO-03', 'Protection of Records', 'Protect records from loss, destruction, falsification, unauthorized access and unauthorized release', 'Mandatory', 'Intermediate', 'Establish records management and protection procedures'),
('Compliance', 'CO-04', 'Privacy and Protection of Personally Identifiable Information', 'Ensure privacy and protection of personally identifiable information as required by legislation and regulation', 'Mandatory', 'Advanced', 'Implement comprehensive privacy protection and data governance'),
('Compliance', 'CO-05', 'Information Security Reviews', 'Conduct independent reviews of information security implementation and compliance', 'Mandatory', 'Intermediate', 'Perform regular internal and external security assessments');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_qatar_nia_requirements_domain ON qatar_nia_requirements(domain);
CREATE INDEX IF NOT EXISTS idx_qatar_nia_requirements_control_id ON qatar_nia_requirements(control_id);
CREATE INDEX IF NOT EXISTS idx_qatar_nia_requirements_status ON qatar_nia_requirements(status);
