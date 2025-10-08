-- Add 20 additional sample records to iso27001_risks table
INSERT INTO iso27001_risks (risk_id, title, description, category, likelihood, impact, owner, treatment_plan, residual_risk, next_review, controls, assets) VALUES
('ISO-009', 'Phishing Attack on Employees', 'Risk of employees falling victim to phishing emails leading to credential compromise or malware installation', 'Social Engineering', 4, 3, 'Security Team', 'Implement email filtering, security awareness training, and phishing simulation exercises', 6, '2024-05-20', ARRAY['A.7.2.2', 'A.13.2.1', 'A.12.2.1'], ARRAY['Email System', 'User Workstations']),

('ISO-010', 'Cloud Service Provider Outage', 'Risk of extended downtime due to cloud service provider infrastructure failure', 'Service Availability', 2, 4, 'IT Operations', 'Implement multi-cloud strategy, backup services, and service level agreements with penalties', 4, '2024-05-25', ARRAY['A.17.1.2', 'A.15.1.2'], ARRAY['Cloud Infrastructure', 'SaaS Applications']),

('ISO-011', 'SQL Injection Attack', 'Risk of database compromise through SQL injection vulnerabilities in web applications', 'Application Security', 3, 4, 'Development Team', 'Implement input validation, parameterized queries, and regular security testing', 6, '2024-06-01', ARRAY['A.14.2.1', 'A.14.2.5'], ARRAY['Web Applications', 'Database Systems']),

('ISO-012', 'Mobile Device Loss or Theft', 'Risk of sensitive data exposure due to loss or theft of mobile devices containing corporate data', 'Mobile Security', 3, 3, 'IT Security', 'Implement mobile device management, encryption, and remote wipe capabilities', 4, '2024-06-05', ARRAY['A.6.2.1', 'A.10.1.1'], ARRAY['Mobile Devices', 'Corporate Data']),

('ISO-013', 'Weak Password Policies', 'Risk of unauthorized access due to weak or compromised passwords across systems', 'Authentication', 4, 3, 'Identity Management', 'Enforce strong password policies, implement password managers, and multi-factor authentication', 6, '2024-06-10', ARRAY['A.9.4.3', 'A.9.2.1'], ARRAY['All Systems', 'User Accounts']),

('ISO-014', 'Unpatched Software Vulnerabilities', 'Risk of system compromise due to unpatched security vulnerabilities in operating systems and applications', 'Vulnerability Management', 3, 4, 'System Administration', 'Implement automated patch management, vulnerability scanning, and testing procedures', 6, '2024-06-15', ARRAY['A.12.6.1', 'A.14.2.3'], ARRAY['Servers', 'Workstations', 'Applications']),

('ISO-015', 'Data Exfiltration via USB Devices', 'Risk of sensitive data theft through unauthorized use of USB storage devices', 'Data Loss Prevention', 2, 4, 'Data Protection Officer', 'Implement USB port controls, data loss prevention tools, and monitoring', 3, '2024-06-20', ARRAY['A.8.3.1', 'A.13.2.3'], ARRAY['Workstations', 'Sensitive Data']),

('ISO-016', 'Social Media Information Disclosure', 'Risk of sensitive information disclosure through inappropriate social media usage by employees', 'Information Disclosure', 3, 2, 'HR Department', 'Develop social media policies, provide training, and implement monitoring tools', 3, '2024-06-25', ARRAY['A.7.2.2', 'A.13.2.1'], ARRAY['Corporate Information', 'Employee Accounts']),

('ISO-017', 'Network Segmentation Failure', 'Risk of lateral movement by attackers due to inadequate network segmentation', 'Network Security', 2, 4, 'Network Team', 'Implement network segmentation, firewalls, and network access controls', 4, '2024-06-30', ARRAY['A.13.1.1', 'A.13.1.3'], ARRAY['Internal Network', 'Critical Systems']),

('ISO-018', 'Backup System Failure', 'Risk of data loss due to backup system failures or corrupted backup data', 'Data Protection', 2, 5, 'Backup Administrator', 'Implement redundant backup systems, regular testing, and offsite storage', 5, '2024-07-05', ARRAY['A.12.3.1', 'A.17.1.2'], ARRAY['Backup Systems', 'Critical Data']),

('ISO-019', 'Privileged Account Abuse', 'Risk of system compromise through misuse of privileged administrative accounts', 'Privileged Access', 2, 5, 'Security Administrator', 'Implement privileged access management, monitoring, and regular access reviews', 5, '2024-07-10', ARRAY['A.9.2.3', 'A.9.2.5'], ARRAY['Administrative Systems', 'Critical Infrastructure']),

('ISO-020', 'API Security Vulnerabilities', 'Risk of data breach through insecure application programming interfaces (APIs)', 'API Security', 3, 4, 'API Development Team', 'Implement API security testing, authentication, and rate limiting', 6, '2024-07-15', ARRAY['A.14.2.1', 'A.13.1.1'], ARRAY['API Gateway', 'Web Services']),

('ISO-021', 'Remote Work Security Risks', 'Risk of security incidents due to inadequate security controls for remote workers', 'Remote Access', 4, 3, 'Remote Work Coordinator', 'Implement VPN, endpoint protection, and remote work security policies', 8, '2024-07-20', ARRAY['A.6.2.1', 'A.13.2.1'], ARRAY['Remote Devices', 'VPN Infrastructure']),

('ISO-022', 'Database Privilege Escalation', 'Risk of unauthorized data access through database privilege escalation attacks', 'Database Security', 2, 4, 'Database Administrator', 'Implement database access controls, monitoring, and regular privilege reviews', 4, '2024-07-25', ARRAY['A.9.2.1', 'A.12.4.1'], ARRAY['Database Systems', 'Sensitive Data']),

('ISO-023', 'IoT Device Security Vulnerabilities', 'Risk of network compromise through insecure Internet of Things (IoT) devices', 'IoT Security', 3, 3, 'IoT Security Team', 'Implement IoT device inventory, security standards, and network isolation', 5, '2024-07-30', ARRAY['A.13.1.1', 'A.11.2.6'], ARRAY['IoT Devices', 'Corporate Network']),

('ISO-024', 'Email System Compromise', 'Risk of business email compromise leading to financial fraud or data theft', 'Email Security', 3, 4, 'Email Administrator', 'Implement email security gateways, DMARC, and user training', 6, '2024-08-05', ARRAY['A.13.2.1', 'A.7.2.2'], ARRAY['Email Infrastructure', 'Financial Systems']),

('ISO-025', 'Configuration Management Drift', 'Risk of security vulnerabilities due to unauthorized changes to system configurations', 'Configuration Management', 3, 3, 'Configuration Manager', 'Implement configuration management tools, change control, and monitoring', 5, '2024-08-10', ARRAY['A.12.1.2', 'A.12.6.2'], ARRAY['System Configurations', 'Infrastructure']),

('ISO-026', 'Shadow IT Services', 'Risk of security gaps due to unauthorized cloud services and applications used by employees', 'Shadow IT', 4, 3, 'Cloud Security Team', 'Implement cloud access security brokers, policies, and discovery tools', 8, '2024-08-15', ARRAY['A.6.1.3', 'A.15.1.1'], ARRAY['Cloud Services', 'Corporate Data']),

('ISO-027', 'Certificate Management Failure', 'Risk of service disruption and security vulnerabilities due to expired or misconfigured certificates', 'Certificate Management', 2, 3, 'PKI Administrator', 'Implement automated certificate management, monitoring, and renewal processes', 3, '2024-08-20', ARRAY['A.10.1.2', 'A.14.1.3'], ARRAY['SSL Certificates', 'Web Services']),

('ISO-028', 'Vendor Security Assessment Gap', 'Risk of security incidents due to inadequate security assessments of third-party vendors', 'Vendor Management', 3, 4, 'Vendor Risk Manager', 'Implement comprehensive vendor security assessments, contracts, and monitoring', 6, '2024-08-25', ARRAY['A.15.1.1', 'A.15.2.1'], ARRAY['Vendor Systems', 'Shared Data']);
