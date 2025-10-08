-- Insert ISO 27001 risk categories (Control domains A.5 through A.18)
INSERT INTO iso27001_risk_categories (control_domain, domain_name, domain_description) VALUES
('A.5', 'Information Security Policies', 'Management direction and support for information security'),
('A.6', 'Organization of Information Security', 'Internal organization and mobile devices/teleworking'),
('A.7', 'Human Resource Security', 'Prior to employment, during employment, and termination'),
('A.8', 'Asset Management', 'Responsibility for assets, information classification, media handling'),
('A.9', 'Access Control', 'Business requirements, user access management, system responsibilities'),
('A.10', 'Cryptography', 'Cryptographic controls'),
('A.11', 'Physical and Environmental Security', 'Secure areas, equipment protection'),
('A.12', 'Operations Security', 'Operational procedures, malware protection, backup, logging'),
('A.13', 'Communications Security', 'Network security management, information transfer'),
('A.14', 'System Acquisition Development and Maintenance', 'Security requirements, security in development, test data'),
('A.15', 'Supplier Relationships', 'Information security in supplier relationships'),
('A.16', 'Information Security Incident Management', 'Management of information security incidents'),
('A.17', 'Information Security Aspects of Business Continuity Management', 'Information security continuity, redundancies'),
('A.18', 'Compliance', 'Compliance with legal requirements, information security reviews')
ON CONFLICT (control_domain) DO NOTHING;

-- Insert sample ISO 27001 risk templates
INSERT INTO iso27001_risk_templates (
    template_id, template_name, risk_description, category_id, 
    threats, vulnerabilities, assets_affected, 
    default_likelihood, default_impact, risk_level, compliance_references
) VALUES
(
    'ISO-TMPL-0001',
    'Unauthorized Access to Information Systems',
    'Risk of unauthorized individuals gaining access to information systems and sensitive data through various attack vectors including credential theft, social engineering, or system vulnerabilities.',
    (SELECT id FROM iso27001_risk_categories WHERE control_domain = 'A.9'),
    '["Malicious insiders", "External attackers", "Social engineering", "Credential theft", "Brute force attacks"]',
    '["Weak passwords", "Unpatched systems", "Inadequate access controls", "Missing multi-factor authentication", "Poor user awareness"]',
    '["User accounts", "Administrative systems", "Databases", "Network infrastructure", "Confidential data"]',
    3, 4, 'High',
    '["A.9.1.1", "A.9.2.1", "A.9.2.2", "A.9.4.2", "A.9.4.3"]'
),
(
    'ISO-TMPL-0002',
    'Malware and Ransomware Attacks',
    'Risk of malicious software including viruses, trojans, ransomware, and other malware compromising system integrity, availability, and confidentiality of information.',
    (SELECT id FROM iso27001_risk_categories WHERE control_domain = 'A.12'),
    '["Ransomware groups", "Malware distributors", "Phishing campaigns", "Drive-by downloads", "Infected removable media"]',
    '["Outdated antivirus", "Unpatched software", "User behavior", "Email security gaps", "Web filtering weaknesses"]',
    '["Workstations", "Servers", "Email systems", "File shares", "Backup systems"]',
    4, 5, 'Critical',
    '["A.12.2.1", "A.12.6.1", "A.13.1.1", "A.16.1.1"]'
),
(
    'ISO-TMPL-0003',
    'Data Breach and Information Disclosure',
    'Risk of unauthorized disclosure, theft, or loss of sensitive information including personal data, intellectual property, and confidential business information.',
    (SELECT id FROM iso27001_risk_categories WHERE control_domain = 'A.8'),
    '["Data thieves", "Malicious insiders", "Accidental disclosure", "System breaches", "Physical theft"]',
    '["Inadequate encryption", "Poor data classification", "Weak access controls", "Insufficient monitoring", "Human error"]',
    '["Customer data", "Employee records", "Financial information", "Intellectual property", "Business plans"]',
    3, 5, 'Critical',
    '["A.8.2.1", "A.8.2.2", "A.8.2.3", "A.10.1.1", "A.13.2.1"]'
),
(
    'ISO-TMPL-0004',
    'System Availability and Service Disruption',
    'Risk of system outages, service disruptions, or degraded performance affecting business operations and service delivery to customers.',
    (SELECT id FROM iso27001_risk_categories WHERE control_domain = 'A.17'),
    '["DDoS attacks", "System failures", "Natural disasters", "Power outages", "Network disruptions"]',
    '["Single points of failure", "Inadequate redundancy", "Poor capacity planning", "Insufficient monitoring", "Weak disaster recovery"]',
    '["Critical applications", "Network infrastructure", "Data centers", "Cloud services", "Communication systems"]',
    3, 4, 'High',
    '["A.17.1.1", "A.17.1.2", "A.17.2.1", "A.12.3.1", "A.11.2.4"]'
),
(
    'ISO-TMPL-0005',
    'Third-Party and Supply Chain Risks',
    'Risk arising from third-party vendors, suppliers, and service providers that may compromise information security through inadequate controls or malicious activities.',
    (SELECT id FROM iso27001_risk_categories WHERE control_domain = 'A.15'),
    '["Compromised vendors", "Supply chain attacks", "Inadequate vendor controls", "Data sharing risks", "Service dependencies"]',
    '["Weak vendor assessment", "Poor contract terms", "Insufficient monitoring", "Lack of security requirements", "Vendor access risks"]',
    '["Vendor systems", "Shared data", "Third-party applications", "Supply chain", "Outsourced services"]',
    3, 3, 'Medium',
    '["A.15.1.1", "A.15.1.2", "A.15.1.3", "A.15.2.1", "A.15.2.2"]'
)
ON CONFLICT (template_id) DO NOTHING;

-- Insert sample controls for templates
INSERT INTO iso27001_template_controls (template_id, control_reference, control_effectiveness, is_mandatory, implementation_notes) VALUES
-- Controls for Unauthorized Access template
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0001'), 'A.9.1.1', 4, true, 'Implement comprehensive access control policy'),
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0001'), 'A.9.2.1', 3, true, 'User registration and de-registration procedures'),
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0001'), 'A.9.4.2', 4, true, 'Secure log-on procedures with MFA'),

-- Controls for Malware template
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0002'), 'A.12.2.1', 4, true, 'Controls against malware'),
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0002'), 'A.12.6.1', 3, true, 'Management of technical vulnerabilities'),

-- Controls for Data Breach template
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0003'), 'A.8.2.1', 4, true, 'Classification of information'),
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0003'), 'A.10.1.1', 5, true, 'Policy on the use of cryptographic controls'),

-- Controls for System Availability template
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0004'), 'A.17.1.1', 4, true, 'Planning information security continuity'),
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0004'), 'A.12.3.1', 3, true, 'Information backup'),

-- Controls for Third-Party template
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0005'), 'A.15.1.1', 3, true, 'Information security policy for supplier relationships'),
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0005'), 'A.15.2.1', 4, true, 'Monitoring and review of supplier services');

-- Insert sample scenarios for templates
INSERT INTO iso27001_template_scenarios (template_id, scenario_name, scenario_description, threat_actor, attack_vector, likelihood, impact, risk_score) VALUES
-- Scenarios for Unauthorized Access template
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0001'), 'Credential Stuffing Attack', 'Automated attack using stolen credentials from data breaches', 'External Cybercriminals', 'Automated credential testing', 4, 4, 16),
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0001'), 'Insider Threat', 'Malicious employee accessing unauthorized systems', 'Malicious Insider', 'Privilege abuse', 2, 5, 10),

-- Scenarios for Malware template
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0002'), 'Ransomware via Email', 'Ransomware delivered through phishing email', 'Ransomware Groups', 'Email attachment', 4, 5, 20),
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0002'), 'Drive-by Download', 'Malware infection from compromised website', 'Malware Distributors', 'Web browsing', 3, 4, 12),

-- Scenarios for Data Breach template
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0003'), 'Database Breach', 'Direct access to database containing sensitive information', 'External Attackers', 'SQL injection', 3, 5, 15),
((SELECT id FROM iso27001_risk_templates WHERE template_id = 'ISO-TMPL-0003'), 'Accidental Disclosure', 'Employee accidentally sends confidential data to wrong recipient', 'Human Error', 'Email misconfiguration', 3, 3, 9);
