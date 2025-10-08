-- Create PCI DSS self-assessment controls table
CREATE TABLE IF NOT EXISTS pci_dss_self_assessment_controls (
    id SERIAL PRIMARY KEY,
    requirement_id VARCHAR(10) REFERENCES pci_dss_requirements(requirement_id),
    requirement TEXT NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    control_objective TEXT,
    testing_procedures TEXT[],
    response VARCHAR(20) CHECK (response IN ('yes', 'no', 'not_applicable')),
    evidence TEXT,
    comments TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    assessment_date DATE,
    next_review_date DATE,
    validation_required BOOLEAN DEFAULT FALSE,
    validation_method VARCHAR(100),
    validation_evidence TEXT,
    risk_if_no VARCHAR(20) DEFAULT 'medium' CHECK (risk_if_no IN ('critical', 'high', 'medium', 'low')),
    compensating_controls TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert PCI DSS self-assessment controls
INSERT INTO pci_dss_self_assessment_controls (
    requirement_id,
    requirement,
    description,
    category,
    control_objective,
    testing_procedures,
    response,
    evidence,
    comments,
    updated_by
) VALUES 
('1.1', 'Install and maintain firewall configuration', 'Establish and implement firewall and router configuration standards', 'Network Security',
 'Protect cardholder data by implementing proper firewall controls',
 ARRAY['Examine firewall and router configuration standards', 'Verify firewall rules are documented and approved', 'Test that firewall configurations restrict connections between untrusted networks'],
 'yes', 'Firewall configuration documentation reviewed and approved', 'All firewall rules documented and regularly reviewed', 'John Smith'),

('1.2', 'Build firewall configurations that restrict connections', 'Build firewall and router configurations that restrict connections between untrusted networks', 'Network Security',
 'Ensure proper network segmentation and access controls',
 ARRAY['Examine firewall configurations for network restrictions', 'Verify traffic flow documentation', 'Test network segmentation effectiveness'],
 'yes', 'Network segmentation implemented and tested', 'Regular penetration testing validates network controls', 'John Smith'),

('2.1', 'Change vendor-supplied defaults', 'Always change vendor-supplied defaults and remove unnecessary default accounts', 'System Configuration',
 'Ensure systems are properly configured and secured',
 ARRAY['Verify all vendor default passwords are changed', 'Confirm unnecessary default accounts are removed', 'Test that default security parameters are modified'],
 'no', 'Default passwords found on 3 systems during audit', 'Remediation in progress - target completion Feb 15, 2024', 'Sarah Johnson'),

('2.2', 'Develop configuration standards', 'Develop configuration standards for all system components', 'System Configuration',
 'Implement secure system configurations across all components',
 ARRAY['Examine system configuration standards', 'Verify implementation of security configurations', 'Test that unnecessary services are disabled'],
 'yes', 'Configuration standards documented and implemented', 'Regular configuration reviews conducted quarterly', 'Mike Davis'),

('3.1', 'Protect stored cardholder data', 'Keep cardholder data storage to a minimum', 'Data Protection',
 'Minimize cardholder data storage and protect stored data',
 ARRAY['Verify data retention policy is implemented', 'Confirm cardholder data is encrypted when stored', 'Test that data storage is limited to business requirements'],
 'yes', 'Data retention policy implemented, encryption verified', 'Regular data purging process in place', 'Mike Davis'),

('3.2', 'Do not store sensitive authentication data', 'Do not store sensitive authentication data after authorization', 'Data Protection',
 'Prevent storage of sensitive authentication data',
 ARRAY['Verify no sensitive authentication data is stored', 'Examine data storage procedures', 'Test data purging processes'],
 'yes', 'No sensitive authentication data stored, verified through code review', 'Application code reviewed and validated', 'Lisa Chen'),

('4.1', 'Encrypt transmission of cardholder data', 'Encrypt transmission of cardholder data across open, public networks', 'Data Protection',
 'Protect cardholder data during transmission',
 ARRAY['Verify strong cryptography is used for data transmission', 'Test that cardholder data is never sent unencrypted', 'Confirm encryption keys are properly managed'],
 NULL, NULL, NULL, 'Lisa Chen'),

('5.1', 'Deploy anti-virus software', 'Deploy anti-virus software on all systems commonly affected by malicious software', 'System Security',
 'Protect systems from malicious software',
 ARRAY['Verify anti-virus software is deployed on all applicable systems', 'Confirm anti-virus definitions are current', 'Test that audit logs are generated'],
 'yes', 'Anti-virus deployed on all systems with current definitions', 'Centralized management and monitoring in place', 'IT Operations'),

('6.1', 'Establish security vulnerability process', 'Establish a process to identify security vulnerabilities', 'Application Security',
 'Ensure timely identification and remediation of security vulnerabilities',
 ARRAY['Verify vulnerability identification process exists', 'Confirm security patches are installed timely', 'Test vulnerability scanning procedures'],
 'no', 'No formal vulnerability management process documented', 'Working on implementing vulnerability management program', 'Security Team'),

('7.1', 'Limit access to cardholder data', 'Limit access to cardholder data by business need-to-know', 'Access Control',
 'Ensure access to cardholder data is restricted to authorized personnel',
 ARRAY['Verify access control policies are defined', 'Review user access rights', 'Test access restrictions are enforced'],
 'yes', 'Role-based access controls implemented and regularly reviewed', 'Quarterly access reviews conducted', 'HR Team'),

('8.1', 'Define and implement user identification', 'Define and implement policies for proper user identification management', 'Access Control',
 'Ensure unique identification and accountability for system access',
 ARRAY['Verify unique user ID assignment', 'Review user account management procedures', 'Test inactive account removal process'],
 'no', 'Some shared accounts still in use', 'Working on eliminating shared accounts by March 2024', 'IT Operations'),

('9.1', 'Use appropriate facility entry controls', 'Use appropriate facility entry controls to limit and monitor physical access', 'Physical Security',
 'Protect physical access to systems and cardholder data',
 ARRAY['Examine facility entry controls', 'Verify access monitoring procedures', 'Test visitor access management'],
 'yes', 'Badge access system implemented with monitoring', 'Security cameras and access logs maintained', 'Facilities Team'),

('10.1', 'Implement audit trails', 'Implement audit trails to link all access to system components to each individual user', 'Monitoring',
 'Ensure comprehensive logging and monitoring of system access',
 ARRAY['Verify audit trail implementation', 'Review audit log entries', 'Test audit trail security and integrity'],
 'yes', 'Centralized logging system implemented with SIEM', 'Log retention and analysis procedures in place', 'Security Team'),

('11.1', 'Test for wireless access points', 'Implement a process to test for the presence of wireless access points', 'Testing',
 'Detect and manage wireless access points in the environment',
 ARRAY['Verify wireless testing procedures', 'Review wireless access point inventory', 'Test incident response for unauthorized wireless'],
 'yes', 'Quarterly wireless scans conducted with documented results', 'Wireless access points properly secured and monitored', 'Network Team'),

('12.1', 'Establish information security policy', 'Establish, publish, maintain, and disseminate a security policy', 'Policy',
 'Provide security governance and direction for the organization',
 ARRAY['Examine information security policy', 'Verify annual review process', 'Review policy communication and training'],
 'yes', 'Information security policy established and annually reviewed', 'Security awareness training provided to all staff', 'Security Team');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pci_dss_self_assessment_requirement_id ON pci_dss_self_assessment_controls(requirement_id);
CREATE INDEX IF NOT EXISTS idx_pci_dss_self_assessment_category ON pci_dss_self_assessment_controls(category);
CREATE INDEX IF NOT EXISTS idx_pci_dss_self_assessment_response ON pci_dss_self_assessment_controls(response);
CREATE INDEX IF NOT EXISTS idx_pci_dss_self_assessment_updated ON pci_dss_self_assessment_controls(last_updated);
