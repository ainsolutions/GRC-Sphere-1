-- MAS (Monetary Authority of Singapore) Compliance Framework

-- Create MAS requirements table
CREATE TABLE IF NOT EXISTS mas_requirements (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(100) NOT NULL,
    requirement_id VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    criticality VARCHAR(20) NOT NULL CHECK (criticality IN ('High', 'Medium', 'Low')),
    applicable_entities TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert MAS requirements data
INSERT INTO mas_requirements (domain, requirement_id, title, description, category, criticality, applicable_entities) VALUES
-- Technology Risk Management
('Technology Risk Management', 'TRM-1.1', 'Technology Risk Management Framework', 'Establish comprehensive technology risk management framework covering all technology-related risks', 'Governance', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Technology Risk Management', 'TRM-1.2', 'Technology Risk Appetite and Tolerance', 'Define and maintain technology risk appetite and tolerance levels aligned with business strategy', 'Risk Management', 'High', '{"Bank", "Finance Company", "Insurance Company"}'),
('Technology Risk Management', 'TRM-1.3', 'Technology Risk Assessment', 'Conduct regular technology risk assessments covering all critical systems and processes', 'Risk Assessment', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Technology Risk Management', 'TRM-2.1', 'System Development Life Cycle', 'Implement secure system development life cycle with appropriate controls and testing', 'Development', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Technology Risk Management', 'TRM-2.2', 'Change Management', 'Establish robust change management processes for all technology changes', 'Operations', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Technology Risk Management', 'TRM-2.3', 'System Documentation', 'Maintain comprehensive and up-to-date system documentation', 'Documentation', 'Medium', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),

-- Cyber Hygiene
('Cyber Hygiene', 'CH-1.1', 'Cybersecurity Governance', 'Establish cybersecurity governance structure with clear roles and responsibilities', 'Governance', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Cyber Hygiene', 'CH-1.2', 'Cybersecurity Policy', 'Develop and maintain comprehensive cybersecurity policies and procedures', 'Policy', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Cyber Hygiene', 'CH-2.1', 'Access Control Management', 'Implement strong access control mechanisms including multi-factor authentication', 'Access Control', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Cyber Hygiene', 'CH-2.2', 'Privileged Access Management', 'Establish privileged access management controls for administrative accounts', 'Access Control', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Cyber Hygiene', 'CH-3.1', 'Network Security', 'Implement network security controls including firewalls and intrusion detection', 'Network Security', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Cyber Hygiene', 'CH-3.2', 'Endpoint Security', 'Deploy endpoint security solutions on all devices accessing critical systems', 'Endpoint Security', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),

-- Outsourcing
('Outsourcing', 'OUT-1.1', 'Outsourcing Risk Management', 'Establish outsourcing risk management framework covering all outsourced functions', 'Risk Management', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Outsourcing', 'OUT-1.2', 'Due Diligence Assessment', 'Conduct thorough due diligence assessment of service providers', 'Due Diligence', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Outsourcing', 'OUT-2.1', 'Service Level Agreements', 'Establish comprehensive service level agreements with clear performance metrics', 'Contracts', 'Medium', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Outsourcing', 'OUT-2.2', 'Ongoing Monitoring', 'Implement ongoing monitoring and oversight of outsourced functions', 'Monitoring', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Outsourcing', 'OUT-3.1', 'Data Protection', 'Ensure adequate data protection measures for outsourced functions', 'Data Protection', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Outsourcing', 'OUT-3.2', 'Business Continuity', 'Ensure service providers have adequate business continuity arrangements', 'Business Continuity', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),

-- Business Continuity Management
('Business Continuity Management', 'BCM-1.1', 'Business Continuity Framework', 'Establish comprehensive business continuity management framework', 'Framework', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Business Continuity Management', 'BCM-1.2', 'Business Impact Analysis', 'Conduct regular business impact analysis for all critical functions', 'Analysis', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Business Continuity Management', 'BCM-2.1', 'Recovery Strategies', 'Develop and maintain recovery strategies for critical business functions', 'Recovery', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Business Continuity Management', 'BCM-2.2', 'Testing and Exercises', 'Conduct regular testing and exercises of business continuity plans', 'Testing', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Business Continuity Management', 'BCM-3.1', 'Crisis Management', 'Establish crisis management procedures and communication protocols', 'Crisis Management', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Business Continuity Management', 'BCM-3.2', 'Recovery Time Objectives', 'Define and maintain appropriate recovery time objectives for critical systems', 'Objectives', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),

-- Data Governance
('Data Governance', 'DG-1.1', 'Data Governance Framework', 'Establish comprehensive data governance framework with clear accountability', 'Governance', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Data Governance', 'DG-1.2', 'Data Classification', 'Implement data classification scheme based on sensitivity and criticality', 'Classification', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Data Governance', 'DG-2.1', 'Data Quality Management', 'Establish data quality management processes and controls', 'Quality', 'Medium', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Data Governance', 'DG-2.2', 'Data Retention and Disposal', 'Implement data retention and secure disposal policies and procedures', 'Retention', 'Medium', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Data Governance', 'DG-3.1', 'Data Privacy Protection', 'Implement data privacy protection measures in compliance with regulations', 'Privacy', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Data Governance', 'DG-3.2', 'Data Loss Prevention', 'Deploy data loss prevention controls to prevent unauthorized data exfiltration', 'Protection', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),

-- Cloud Computing
('Cloud Computing', 'CC-1.1', 'Cloud Strategy and Governance', 'Establish cloud strategy and governance framework for cloud adoption', 'Strategy', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Cloud Computing', 'CC-1.2', 'Cloud Risk Assessment', 'Conduct comprehensive risk assessment before cloud adoption', 'Risk Assessment', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Cloud Computing', 'CC-2.1', 'Cloud Service Provider Selection', 'Establish criteria and process for cloud service provider selection', 'Selection', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Cloud Computing', 'CC-2.2', 'Cloud Security Controls', 'Implement appropriate security controls for cloud environments', 'Security', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Cloud Computing', 'CC-3.1', 'Data Residency and Sovereignty', 'Ensure compliance with data residency and sovereignty requirements', 'Compliance', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Cloud Computing', 'CC-3.2', 'Cloud Monitoring and Logging', 'Implement comprehensive monitoring and logging for cloud services', 'Monitoring', 'Medium', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),

-- Operational Risk Management
('Operational Risk Management', 'ORM-1.1', 'Operational Risk Framework', 'Establish operational risk management framework covering all operational risks', 'Framework', 'High', '{"Bank", "Finance Company", "Insurance Company"}'),
('Operational Risk Management', 'ORM-1.2', 'Risk Identification and Assessment', 'Implement processes for operational risk identification and assessment', 'Assessment', 'High', '{"Bank", "Finance Company", "Insurance Company"}'),
('Operational Risk Management', 'ORM-2.1', 'Key Risk Indicators', 'Establish key risk indicators for monitoring operational risks', 'Monitoring', 'Medium', '{"Bank", "Finance Company", "Insurance Company"}'),
('Operational Risk Management', 'ORM-2.2', 'Loss Data Collection', 'Implement loss data collection and analysis processes', 'Data Collection', 'Medium', '{"Bank", "Finance Company", "Insurance Company"}'),

-- Third Party Risk Management
('Third Party Risk Management', 'TPRM-1.1', 'Third Party Risk Framework', 'Establish third party risk management framework', 'Framework', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Third Party Risk Management', 'TPRM-1.2', 'Vendor Due Diligence', 'Conduct comprehensive due diligence on third party vendors', 'Due Diligence', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Third Party Risk Management', 'TPRM-2.1', 'Contract Management', 'Establish robust contract management processes for third parties', 'Contracts', 'Medium', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Third Party Risk Management', 'TPRM-2.2', 'Ongoing Monitoring', 'Implement ongoing monitoring of third party relationships', 'Monitoring', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),

-- Incident Management
('Incident Management', 'IM-1.1', 'Incident Response Framework', 'Establish incident response framework and procedures', 'Framework', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Incident Management', 'IM-1.2', 'Incident Classification', 'Implement incident classification and escalation procedures', 'Classification', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Incident Management', 'IM-2.1', 'Incident Response Team', 'Establish dedicated incident response team with defined roles', 'Team', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Incident Management', 'IM-2.2', 'Incident Reporting', 'Implement incident reporting to MAS and other relevant authorities', 'Reporting', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),

-- Access Management
('Access Management', 'AM-1.1', 'Identity and Access Management', 'Implement comprehensive identity and access management system', 'Identity Management', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Access Management', 'AM-1.2', 'User Access Provisioning', 'Establish user access provisioning and deprovisioning processes', 'Provisioning', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Access Management', 'AM-2.1', 'Access Reviews', 'Conduct regular access reviews and certifications', 'Reviews', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}'),
('Access Management', 'AM-2.2', 'Segregation of Duties', 'Implement segregation of duties controls for critical functions', 'Segregation', 'High', '{"Bank", "Finance Company", "Insurance Company", "Payment Service Provider"}');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mas_requirements_domain ON mas_requirements(domain);
CREATE INDEX IF NOT EXISTS idx_mas_requirements_criticality ON mas_requirements(criticality);
CREATE INDEX IF NOT EXISTS idx_mas_requirements_requirement_id ON mas_requirements(requirement_id);
