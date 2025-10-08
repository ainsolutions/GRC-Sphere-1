-- Create control effectiveness table if it doesn't exist
CREATE TABLE IF NOT EXISTS iso27001_control_effectiveness (
    id SERIAL PRIMARY KEY,
    risk_id INTEGER REFERENCES iso27001_risks(id) ON DELETE CASCADE,
    control_id VARCHAR(20) NOT NULL,
    effectiveness INTEGER CHECK (effectiveness >= 0 AND effectiveness <= 5) DEFAULT 0,
    implementation_status VARCHAR(50) DEFAULT 'Not Started',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(risk_id, control_id)
);

-- Insert comprehensive ISO 27001 risks with control assessments
INSERT INTO iso27001_risks (
    risk_id, title, description, category, likelihood, impact, risk_score, risk_level, 
    status, owner, treatment_plan, residual_likelihood, residual_impact, residual_risk,
    last_reviewed, next_review, controls, assets, control_assessment, risk_treatment
) VALUES 
(
    'ISO-R001',
    'Unauthorized Access to Customer Database',
    'Risk of unauthorized personnel gaining access to sensitive customer data stored in the primary database due to inadequate access controls, weak authentication mechanisms, or privilege escalation vulnerabilities.',
    'Access Control',
    4, 5, 20, 'Critical',
    'In Progress',
    'John Smith - IT Security Manager',
    'Implement multi-factor authentication, conduct access review quarterly, deploy privileged access management solution, and establish database activity monitoring.',
    2, 3, 6,
    '2024-01-15',
    '2024-04-15',
    ARRAY['A.9.1.1', 'A.9.2.1', 'A.9.2.3', 'A.9.4.2', 'A.12.4.1'],
    ARRAY['Customer Database', 'Authentication System', 'User Directory'],
    'Current access controls are partially implemented. MFA is deployed for admin accounts but not for regular database users. Access reviews are conducted annually instead of quarterly. Database activity monitoring is in place but alerting needs improvement.',
    'Mitigate'
),
(
    'ISO-R002',
    'Data Loss Due to Inadequate Backup Procedures',
    'Risk of permanent data loss due to insufficient backup procedures, untested recovery processes, or failure of backup systems during critical incidents.',
    'Operations Security',
    3, 4, 12, 'High',
    'Open',
    'Sarah Johnson - Operations Manager',
    'Implement automated daily backups, establish offsite backup storage, conduct monthly recovery tests, and document comprehensive disaster recovery procedures.',
    2, 2, 4,
    '2024-01-10',
    '2024-03-10',
    ARRAY['A.12.3.1', 'A.17.1.2', 'A.17.1.3'],
    ARRAY['Primary Database', 'File Servers', 'Email System'],
    'Backup procedures exist but are not fully automated. Recovery testing is performed quarterly but not documented properly. Offsite backup storage is implemented but retention policies need review.',
    'Mitigate'
),
(
    'ISO-R003',
    'Malware Infection Through Email and Web Browsing',
    'Risk of malware infection affecting critical systems through email attachments, malicious websites, or compromised software downloads, potentially leading to data breaches or system downtime.',
    'Operations Security',
    4, 3, 12, 'High',
    'In Progress',
    'Mike Chen - Cybersecurity Analyst',
    'Deploy advanced email security gateway, implement web content filtering, conduct regular security awareness training, and establish endpoint detection and response capabilities.',
    2, 2, 4,
    '2024-01-20',
    '2024-04-20',
    ARRAY['A.12.2.1', 'A.7.2.2', 'A.13.1.1', 'A.14.2.8'],
    ARRAY['Email System', 'Web Proxy', 'Employee Workstations'],
    'Email security is partially implemented with basic spam filtering. Web content filtering is in place but needs policy updates. Security awareness training is conducted annually. EDR is deployed on 70% of endpoints.',
    'Mitigate'
),
(
    'ISO-R004',
    'Insider Threat from Privileged Users',
    'Risk of malicious or negligent actions by privileged users who have elevated access to critical systems and sensitive data, potentially causing significant damage or data breaches.',
    'Access Control',
    2, 5, 10, 'High',
    'Open',
    'Lisa Wang - HR Director',
    'Implement privileged access management, establish user behavior analytics, conduct background checks for privileged roles, and implement segregation of duties for critical operations.',
    1, 3, 3,
    '2024-01-05',
    '2024-03-05',
    ARRAY['A.9.2.3', 'A.6.1.2', 'A.7.1.1', 'A.12.4.3'],
    ARRAY['Administrative Systems', 'Financial Systems', 'HR Database'],
    'Background checks are performed for all privileged users. Segregation of duties is partially implemented. User behavior analytics is not yet deployed. Privileged access management is in planning phase.',
    'Mitigate'
),
(
    'ISO-R005',
    'Physical Security Breach at Data Center',
    'Risk of unauthorized physical access to the data center facility, potentially leading to theft of equipment, data breaches, or disruption of critical services.',
    'Physical Security',
    2, 4, 8, 'Medium',
    'Mitigated',
    'Robert Brown - Facilities Manager',
    'Implement biometric access controls, install comprehensive CCTV surveillance, establish 24/7 security monitoring, and conduct regular physical security assessments.',
    1, 2, 2,
    '2024-01-25',
    '2024-07-25',
    ARRAY['A.11.1.1', 'A.11.1.2', 'A.11.2.1'],
    ARRAY['Data Center', 'Server Equipment', 'Network Infrastructure'],
    'Physical security controls are well implemented. Biometric access controls are in place for all critical areas. CCTV surveillance covers all entry points. 24/7 security monitoring is operational.',
    'Mitigate'
),
(
    'ISO-R006',
    'Third-Party Vendor Data Breach',
    'Risk of data breach or security incident occurring at a third-party vendor who has access to organizational data or systems, potentially compromising confidential information.',
    'Supplier Relationships',
    3, 4, 12, 'High',
    'In Progress',
    'Jennifer Davis - Procurement Manager',
    'Establish comprehensive vendor security assessments, implement contractual security requirements, conduct regular vendor audits, and develop incident response procedures for vendor-related incidents.',
    2, 3, 6,
    '2024-01-12',
    '2024-04-12',
    ARRAY['A.15.1.1', 'A.15.1.2', 'A.15.2.1'],
    ARRAY['Vendor Systems', 'Shared Data', 'Integration Points'],
    'Vendor security assessments are conducted for critical vendors. Contractual security requirements exist but need standardization. Regular vendor audits are performed annually. Incident response procedures for vendor incidents are being developed.',
    'Mitigate'
),
(
    'ISO-R007',
    'Cryptographic Key Compromise',
    'Risk of cryptographic keys being compromised, stolen, or improperly managed, potentially leading to unauthorized decryption of sensitive data or compromise of encrypted communications.',
    'Cryptography',
    2, 5, 10, 'High',
    'Open',
    'David Wilson - Security Architect',
    'Implement hardware security modules for key storage, establish key rotation procedures, deploy key management system, and conduct regular cryptographic assessments.',
    1, 3, 3,
    '2024-01-08',
    '2024-03-08',
    ARRAY['A.10.1.1', 'A.10.1.2'],
    ARRAY['Encryption Keys', 'Certificate Authority', 'Encrypted Databases'],
    'Key management procedures exist but are not fully automated. Hardware security modules are planned but not yet implemented. Key rotation is performed manually on an annual basis. Cryptographic assessments are conducted during annual audits.',
    'Mitigate'
),
(
    'ISO-R008',
    'Business Continuity Failure During Disaster',
    'Risk of inability to maintain critical business operations during a major disaster or extended outage, potentially resulting in significant financial losses and reputational damage.',
    'Business Continuity',
    2, 5, 10, 'High',
    'In Progress',
    'Amanda Taylor - Business Continuity Manager',
    'Develop comprehensive business continuity plan, establish alternate processing sites, implement data replication to secondary location, and conduct regular disaster recovery exercises.',
    1, 3, 3,
    '2024-01-18',
    '2024-04-18',
    ARRAY['A.17.1.1', 'A.17.1.2', 'A.17.2.1'],
    ARRAY['Critical Applications', 'Data Center', 'Communication Systems'],
    'Business continuity plan exists but needs updating. Alternate processing site is established but not fully tested. Data replication is implemented for critical systems. Disaster recovery exercises are conducted annually.',
    'Mitigate'
),
(
    'ISO-R009',
    'Unpatched Software Vulnerabilities',
    'Risk of security vulnerabilities in operating systems, applications, and network devices remaining unpatched, potentially allowing attackers to exploit known weaknesses.',
    'Operations Security',
    4, 3, 12, 'High',
    'In Progress',
    'Kevin Martinez - System Administrator',
    'Implement automated patch management system, establish vulnerability scanning procedures, create patch testing environment, and develop emergency patching procedures for critical vulnerabilities.',
    2, 2, 4,
    '2024-01-22',
    '2024-04-22',
    ARRAY['A.12.6.1', 'A.12.1.2', 'A.14.2.2'],
    ARRAY['Servers', 'Workstations', 'Network Devices'],
    'Patch management is partially automated for Windows systems. Vulnerability scanning is performed monthly. Patch testing environment exists but is not consistently used. Emergency patching procedures are documented but need improvement.',
    'Mitigate'
),
(
    'ISO-R010',
    'Inadequate Incident Response Capabilities',
    'Risk of ineffective response to security incidents due to lack of proper procedures, insufficient training, or inadequate tools, potentially leading to extended impact and recovery time.',
    'Incident Management',
    3, 4, 12, 'High',
    'Open',
    'Rachel Green - Incident Response Manager',
    'Establish comprehensive incident response procedures, provide regular training to response team, implement security incident and event management system, and conduct tabletop exercises.',
    2, 2, 4,
    '2024-01-14',
    '2024-03-14',
    ARRAY['A.16.1.1', 'A.16.1.2', 'A.16.1.5'],
    ARRAY['SIEM System', 'Response Team', 'Communication Tools'],
    'Incident response procedures exist but need updating. Response team training is conducted annually. SIEM system is deployed but alerting rules need tuning. Tabletop exercises are planned but not yet conducted.',
    'Mitigate'
);

-- Insert control effectiveness ratings for each risk
INSERT INTO iso27001_control_effectiveness (risk_id, control_id, effectiveness, implementation_status) VALUES
-- ISO-R001: Unauthorized Access to Customer Database
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R001'), 'A.9.1.1', 3, 'Partially Implemented'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R001'), 'A.9.2.1', 4, 'Implemented'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R001'), 'A.9.2.3', 2, 'In Progress'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R001'), 'A.9.4.2', 3, 'Partially Implemented'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R001'), 'A.12.4.1', 4, 'Implemented'),

-- ISO-R002: Data Loss Due to Inadequate Backup Procedures
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R002'), 'A.12.3.1', 3, 'Partially Implemented'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R002'), 'A.17.1.2', 2, 'In Progress'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R002'), 'A.17.1.3', 2, 'In Progress'),

-- ISO-R003: Malware Infection Through Email and Web Browsing
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R003'), 'A.12.2.1', 3, 'Partially Implemented'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R003'), 'A.7.2.2', 2, 'In Progress'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R003'), 'A.13.1.1', 4, 'Implemented'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R003'), 'A.14.2.8', 3, 'Partially Implemented'),

-- ISO-R004: Insider Threat from Privileged Users
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R004'), 'A.9.2.3', 1, 'Not Started'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R004'), 'A.6.1.2', 3, 'Partially Implemented'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R004'), 'A.7.1.1', 4, 'Implemented'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R004'), 'A.12.4.3', 2, 'In Progress'),

-- ISO-R005: Physical Security Breach at Data Center
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R005'), 'A.11.1.1', 5, 'Implemented'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R005'), 'A.11.1.2', 5, 'Implemented'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R005'), 'A.11.2.1', 4, 'Implemented'),

-- ISO-R006: Third-Party Vendor Data Breach
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R006'), 'A.15.1.1', 3, 'Partially Implemented'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R006'), 'A.15.1.2', 3, 'Partially Implemented'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R006'), 'A.15.2.1', 2, 'In Progress'),

-- ISO-R007: Cryptographic Key Compromise
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R007'), 'A.10.1.1', 2, 'In Progress'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R007'), 'A.10.1.2', 1, 'Not Started'),

-- ISO-R008: Business Continuity Failure During Disaster
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R008'), 'A.17.1.1', 3, 'Partially Implemented'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R008'), 'A.17.1.2', 2, 'In Progress'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R008'), 'A.17.2.1', 3, 'Partially Implemented'),

-- ISO-R009: Unpatched Software Vulnerabilities
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R009'), 'A.12.6.1', 3, 'Partially Implemented'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R009'), 'A.12.1.2', 2, 'In Progress'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R009'), 'A.14.2.2', 2, 'In Progress'),

-- ISO-R010: Inadequate Incident Response Capabilities
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R010'), 'A.16.1.1', 2, 'In Progress'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R010'), 'A.16.1.2', 3, 'Partially Implemented'),
((SELECT id FROM iso27001_risks WHERE risk_id = 'ISO-R010'), 'A.16.1.5', 2, 'In Progress');

-- Update the risks to ensure they have the control effectiveness data
UPDATE iso27001_risks SET updated_at = CURRENT_TIMESTAMP WHERE risk_id LIKE 'ISO-R%';

COMMIT;
