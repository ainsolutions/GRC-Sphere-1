-- SAMA Compliance Framework
-- Create table for SAMA cybersecurity controls and requirements

CREATE TABLE IF NOT EXISTS sama_requirements (
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

-- Insert SAMA cybersecurity controls
INSERT INTO sama_requirements (domain, control_id, control_name, description, control_type, maturity_level, implementation_guidance) VALUES

-- Cybersecurity Governance
('Cybersecurity Governance', 'CG-01', 'Cybersecurity Strategy and Framework', 'Establish comprehensive cybersecurity strategy aligned with business objectives and regulatory requirements', 'Mandatory', 'Basic', 'Develop documented cybersecurity strategy approved by board of directors'),
('Cybersecurity Governance', 'CG-02', 'Cybersecurity Policies and Procedures', 'Implement comprehensive cybersecurity policies and procedures', 'Mandatory', 'Basic', 'Create and maintain cybersecurity policy framework covering all operational areas'),
('Cybersecurity Governance', 'CG-03', 'Risk Management Framework', 'Establish enterprise-wide cybersecurity risk management framework', 'Mandatory', 'Intermediate', 'Implement formal risk management processes with regular assessments and reporting'),
('Cybersecurity Governance', 'CG-04', 'Roles and Responsibilities', 'Define clear cybersecurity roles, responsibilities, and accountability', 'Mandatory', 'Basic', 'Establish cybersecurity organizational structure with defined roles and responsibilities'),
('Cybersecurity Governance', 'CG-05', 'Board and Senior Management Oversight', 'Ensure appropriate board and senior management oversight of cybersecurity', 'Mandatory', 'Advanced', 'Establish board-level cybersecurity committee and regular reporting mechanisms'),

-- Cybersecurity Defense
('Cybersecurity Defense', 'CD-01', 'Asset Management', 'Maintain comprehensive inventory and classification of information assets', 'Mandatory', 'Basic', 'Implement asset inventory system with classification based on criticality and sensitivity'),
('Cybersecurity Defense', 'CD-02', 'Access Control', 'Implement robust access control mechanisms', 'Mandatory', 'Intermediate', 'Deploy multi-factor authentication and role-based access controls'),
('Cybersecurity Defense', 'CD-03', 'Network Security', 'Implement network security controls and monitoring', 'Mandatory', 'Intermediate', 'Deploy firewalls, intrusion detection systems, and network segmentation'),
('Cybersecurity Defense', 'CD-04', 'Endpoint Security', 'Secure all endpoints including workstations, servers, and mobile devices', 'Mandatory', 'Basic', 'Deploy endpoint protection solutions and maintain security configurations'),
('Cybersecurity Defense', 'CD-05', 'Data Protection', 'Implement data protection controls including encryption', 'Mandatory', 'Advanced', 'Encrypt sensitive data at rest and in transit using approved cryptographic standards'),

-- Cybersecurity Resilience
('Cybersecurity Resilience', 'CR-01', 'Business Continuity Planning', 'Develop and maintain business continuity plans', 'Mandatory', 'Intermediate', 'Create comprehensive business continuity plans with regular testing'),
('Cybersecurity Resilience', 'CR-02', 'Disaster Recovery', 'Implement disaster recovery capabilities', 'Mandatory', 'Advanced', 'Establish disaster recovery sites and procedures with defined recovery objectives'),
('Cybersecurity Resilience', 'CR-03', 'Backup and Recovery', 'Implement robust backup and recovery procedures', 'Mandatory', 'Basic', 'Establish regular backup procedures with tested recovery capabilities'),
('Cybersecurity Resilience', 'CR-04', 'System Redundancy', 'Implement system redundancy for critical operations', 'Mandatory', 'Advanced', 'Deploy redundant systems and infrastructure for critical business functions'),
('Cybersecurity Resilience', 'CR-05', 'Crisis Management', 'Establish crisis management procedures', 'Mandatory', 'Intermediate', 'Develop crisis management plans with clear escalation procedures'),

-- Third Party Cybersecurity
('Third Party Cybersecurity', 'TP-01', 'Third Party Risk Assessment', 'Conduct cybersecurity risk assessments of third parties', 'Mandatory', 'Intermediate', 'Implement third-party risk assessment framework with regular reviews'),
('Third Party Cybersecurity', 'TP-02', 'Contractual Requirements', 'Include cybersecurity requirements in third-party contracts', 'Mandatory', 'Basic', 'Establish standard cybersecurity clauses for third-party agreements'),
('Third Party Cybersecurity', 'TP-03', 'Third Party Monitoring', 'Monitor third-party cybersecurity compliance', 'Mandatory', 'Advanced', 'Implement continuous monitoring of third-party cybersecurity posture'),
('Third Party Cybersecurity', 'TP-04', 'Data Sharing Controls', 'Implement controls for data sharing with third parties', 'Mandatory', 'Intermediate', 'Establish data sharing agreements with appropriate security controls'),
('Third Party Cybersecurity', 'TP-05', 'Third Party Incident Response', 'Coordinate incident response with third parties', 'Mandatory', 'Advanced', 'Establish incident response coordination procedures with third parties'),

-- Data Management and Privacy
('Data Management and Privacy', 'DM-01', 'Data Classification', 'Classify data based on sensitivity and criticality', 'Mandatory', 'Basic', 'Implement data classification scheme with appropriate handling procedures'),
('Data Management and Privacy', 'DM-02', 'Data Loss Prevention', 'Implement data loss prevention controls', 'Mandatory', 'Intermediate', 'Deploy DLP solutions to prevent unauthorized data exfiltration'),
('Data Management and Privacy', 'DM-03', 'Privacy Protection', 'Implement privacy protection measures', 'Mandatory', 'Advanced', 'Establish privacy protection framework compliant with applicable regulations'),
('Data Management and Privacy', 'DM-04', 'Data Retention', 'Implement data retention and disposal policies', 'Mandatory', 'Basic', 'Establish data retention schedules with secure disposal procedures'),
('Data Management and Privacy', 'DM-05', 'Cross-Border Data Transfer', 'Control cross-border data transfers', 'Mandatory', 'Advanced', 'Implement controls for international data transfers with regulatory compliance'),

-- Technology Risk Management
('Technology Risk Management', 'TR-01', 'System Development Security', 'Integrate security into system development lifecycle', 'Mandatory', 'Intermediate', 'Implement secure development practices and security testing'),
('Technology Risk Management', 'TR-02', 'Vulnerability Management', 'Implement comprehensive vulnerability management', 'Mandatory', 'Basic', 'Establish vulnerability scanning and patch management procedures'),
('Technology Risk Management', 'TR-03', 'Configuration Management', 'Maintain secure system configurations', 'Mandatory', 'Intermediate', 'Implement configuration management with security baselines'),
('Technology Risk Management', 'TR-04', 'Change Management', 'Implement secure change management processes', 'Mandatory', 'Basic', 'Establish change management procedures with security reviews'),
('Technology Risk Management', 'TR-05', 'Technology Risk Assessment', 'Conduct regular technology risk assessments', 'Mandatory', 'Advanced', 'Perform comprehensive technology risk assessments with remediation tracking'),

-- Incident Response
('Incident Response', 'IR-01', 'Incident Response Plan', 'Develop and maintain incident response plans', 'Mandatory', 'Basic', 'Create comprehensive incident response procedures with defined roles'),
('Incident Response', 'IR-02', 'Incident Detection and Analysis', 'Implement incident detection and analysis capabilities', 'Mandatory', 'Intermediate', 'Deploy security monitoring tools with incident analysis procedures'),
('Incident Response', 'IR-03', 'Incident Containment and Eradication', 'Establish incident containment and eradication procedures', 'Mandatory', 'Advanced', 'Develop incident containment strategies with eradication procedures'),
('Incident Response', 'IR-04', 'Incident Recovery', 'Implement incident recovery procedures', 'Mandatory', 'Intermediate', 'Establish recovery procedures to restore normal operations'),
('Incident Response', 'IR-05', 'Incident Reporting', 'Establish incident reporting procedures', 'Mandatory', 'Basic', 'Implement incident reporting to SAMA and other relevant authorities'),

-- Business Continuity
('Business Continuity', 'BC-01', 'Business Impact Analysis', 'Conduct business impact analysis', 'Mandatory', 'Intermediate', 'Perform regular business impact analysis to identify critical processes'),
('Business Continuity', 'BC-02', 'Continuity Planning', 'Develop business continuity plans', 'Mandatory', 'Advanced', 'Create comprehensive business continuity plans for critical operations'),
('Business Continuity', 'BC-03', 'Continuity Testing', 'Test business continuity plans regularly', 'Mandatory', 'Advanced', 'Conduct regular testing of business continuity plans with lessons learned'),
('Business Continuity', 'BC-04', 'Alternative Processing Sites', 'Establish alternative processing capabilities', 'Mandatory', 'Advanced', 'Implement alternative processing sites for critical operations'),
('Business Continuity', 'BC-05', 'Communication Plans', 'Develop crisis communication plans', 'Mandatory', 'Intermediate', 'Establish communication procedures for business continuity events'),

-- Payment Systems Security
('Payment Systems Security', 'PS-01', 'Payment System Controls', 'Implement comprehensive payment system security controls', 'Mandatory', 'Advanced', 'Deploy multi-layered security controls for payment processing systems'),
('Payment Systems Security', 'PS-02', 'Transaction Monitoring', 'Monitor payment transactions for suspicious activities', 'Mandatory', 'Intermediate', 'Implement real-time transaction monitoring with fraud detection'),
('Payment Systems Security', 'PS-03', 'Payment Data Protection', 'Protect payment card and sensitive payment data', 'Mandatory', 'Advanced', 'Implement PCI DSS compliance and payment data encryption'),
('Payment Systems Security', 'PS-04', 'Payment System Resilience', 'Ensure payment system availability and resilience', 'Mandatory', 'Advanced', 'Implement high availability and disaster recovery for payment systems'),
('Payment Systems Security', 'PS-05', 'Payment System Audit', 'Conduct regular payment system audits', 'Mandatory', 'Advanced', 'Perform regular security audits of payment processing systems');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sama_requirements_domain ON sama_requirements(domain);
CREATE INDEX IF NOT EXISTS idx_sama_requirements_control_id ON sama_requirements(control_id);
CREATE INDEX IF NOT EXISTS idx_sama_requirements_status ON sama_requirements(status);
CREATE INDEX IF NOT EXISTS idx_sama_requirements_maturity_level ON sama_requirements(maturity_level);
