-- MAS Self-Assessment Tables

CREATE TABLE IF NOT EXISTS mas_self_assessment_controls (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(100) NOT NULL,
    control_id VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    criticality VARCHAR(20) NOT NULL CHECK (criticality IN ('High', 'Medium', 'Low')),
    implementation_status VARCHAR(30) DEFAULT 'Not Implemented' CHECK (implementation_status IN ('Implemented', 'Partially Implemented', 'Not Implemented', 'Not Applicable')),
    maturity_level VARCHAR(20) DEFAULT 'Basic' CHECK (maturity_level IN ('Basic', 'Intermediate', 'Advanced')),
    evidence TEXT DEFAULT '',
    gaps_identified TEXT DEFAULT '',
    remediation_plan TEXT DEFAULT '',
    target_completion_date DATE,
    responsible_party VARCHAR(100) DEFAULT '',
    last_reviewed DATE,
    reviewer_comments TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert MAS self-assessment controls based on requirements
INSERT INTO mas_self_assessment_controls (domain, control_id, title, description, category, criticality, implementation_status, maturity_level) VALUES
-- Technology Risk Management Controls
('Technology Risk Management', 'TRM-1.1', 'Technology Risk Management Framework', 'Establish comprehensive technology risk management framework covering all technology-related risks', 'Governance', 'High', 'Partially Implemented', 'Intermediate'),
('Technology Risk Management', 'TRM-1.2', 'Technology Risk Appetite and Tolerance', 'Define and maintain technology risk appetite and tolerance levels aligned with business strategy', 'Risk Management', 'High', 'Not Implemented', 'Basic'),
('Technology Risk Management', 'TRM-1.3', 'Technology Risk Assessment', 'Conduct regular technology risk assessments covering all critical systems and processes', 'Risk Assessment', 'High', 'Implemented', 'Intermediate'),
('Technology Risk Management', 'TRM-2.1', 'System Development Life Cycle', 'Implement secure system development life cycle with appropriate controls and testing', 'Development', 'High', 'Partially Implemented', 'Intermediate'),
('Technology Risk Management', 'TRM-2.2', 'Change Management', 'Establish robust change management processes for all technology changes', 'Operations', 'High', 'Implemented', 'Advanced'),
('Technology Risk Management', 'TRM-2.3', 'System Documentation', 'Maintain comprehensive and up-to-date system documentation', 'Documentation', 'Medium', 'Partially Implemented', 'Basic'),

-- Cyber Hygiene Controls
('Cyber Hygiene', 'CH-1.1', 'Cybersecurity Governance', 'Establish cybersecurity governance structure with clear roles and responsibilities', 'Governance', 'High', 'Implemented', 'Intermediate'),
('Cyber Hygiene', 'CH-1.2', 'Cybersecurity Policy', 'Develop and maintain comprehensive cybersecurity policies and procedures', 'Policy', 'High', 'Implemented', 'Advanced'),
('Cyber Hygiene', 'CH-2.1', 'Access Control Management', 'Implement strong access control mechanisms including multi-factor authentication', 'Access Control', 'High', 'Partially Implemented', 'Intermediate'),
('Cyber Hygiene', 'CH-2.2', 'Privileged Access Management', 'Establish privileged access management controls for administrative accounts', 'Access Control', 'High', 'Not Implemented', 'Basic'),
('Cyber Hygiene', 'CH-3.1', 'Network Security', 'Implement network security controls including firewalls and intrusion detection', 'Network Security', 'High', 'Implemented', 'Intermediate'),
('Cyber Hygiene', 'CH-3.2', 'Endpoint Security', 'Deploy endpoint security solutions on all devices accessing critical systems', 'Endpoint Security', 'High', 'Partially Implemented', 'Intermediate'),

-- Outsourcing Controls
('Outsourcing', 'OUT-1.1', 'Outsourcing Risk Management', 'Establish outsourcing risk management framework covering all outsourced functions', 'Risk Management', 'High', 'Partially Implemented', 'Basic'),
('Outsourcing', 'OUT-1.2', 'Due Diligence Assessment', 'Conduct thorough due diligence assessment of service providers', 'Due Diligence', 'High', 'Implemented', 'Intermediate'),
('Outsourcing', 'OUT-2.1', 'Service Level Agreements', 'Establish comprehensive service level agreements with clear performance metrics', 'Contracts', 'Medium', 'Implemented', 'Intermediate'),
('Outsourcing', 'OUT-2.2', 'Ongoing Monitoring', 'Implement ongoing monitoring and oversight of outsourced functions', 'Monitoring', 'High', 'Partially Implemented', 'Basic'),
('Outsourcing', 'OUT-3.1', 'Data Protection', 'Ensure adequate data protection measures for outsourced functions', 'Data Protection', 'High', 'Partially Implemented', 'Intermediate'),
('Outsourcing', 'OUT-3.2', 'Business Continuity', 'Ensure service providers have adequate business continuity arrangements', 'Business Continuity', 'High', 'Not Implemented', 'Basic'),

-- Business Continuity Management Controls
('Business Continuity Management', 'BCM-1.1', 'Business Continuity Framework', 'Establish comprehensive business continuity management framework', 'Framework', 'High', 'Implemented', 'Intermediate'),
('Business Continuity Management', 'BCM-1.2', 'Business Impact Analysis', 'Conduct regular business impact analysis for all critical functions', 'Analysis', 'High', 'Partially Implemented', 'Intermediate'),
('Business Continuity Management', 'BCM-2.1', 'Recovery Strategies', 'Develop and maintain recovery strategies for critical business functions', 'Recovery', 'High', 'Partially Implemented', 'Basic'),
('Business Continuity Management', 'BCM-2.2', 'Testing and Exercises', 'Conduct regular testing and exercises of business continuity plans', 'Testing', 'High', 'Not Implemented', 'Basic'),
('Business Continuity Management', 'BCM-3.1', 'Crisis Management', 'Establish crisis management procedures and communication protocols', 'Crisis Management', 'High', 'Partially Implemented', 'Intermediate'),
('Business Continuity Management', 'BCM-3.2', 'Recovery Time Objectives', 'Define and maintain appropriate recovery time objectives for critical systems', 'Objectives', 'High', 'Implemented', 'Intermediate'),

-- Data Governance Controls
('Data Governance', 'DG-1.1', 'Data Governance Framework', 'Establish comprehensive data governance framework with clear accountability', 'Governance', 'High', 'Partially Implemented', 'Basic'),
('Data Governance', 'DG-1.2', 'Data Classification', 'Implement data classification scheme based on sensitivity and criticality', 'Classification', 'High', 'Not Implemented', 'Basic'),
('Data Governance', 'DG-2.1', 'Data Quality Management', 'Establish data quality management processes and controls', 'Quality', 'Medium', 'Partially Implemented', 'Basic'),
('Data Governance', 'DG-2.2', 'Data Retention and Disposal', 'Implement data retention and secure disposal policies and procedures', 'Retention', 'Medium', 'Implemented', 'Intermediate'),
('Data Governance', 'DG-3.1', 'Data Privacy Protection', 'Implement data privacy protection measures in compliance with regulations', 'Privacy', 'High', 'Partially Implemented', 'Intermediate'),
('Data Governance', 'DG-3.2', 'Data Loss Prevention', 'Deploy data loss prevention controls to prevent unauthorized data exfiltration', 'Protection', 'High', 'Not Implemented', 'Basic'),

-- Cloud Computing Controls
('Cloud Computing', 'CC-1.1', 'Cloud Strategy and Governance', 'Establish cloud strategy and governance framework for cloud adoption', 'Strategy', 'High', 'Partially Implemented', 'Basic'),
('Cloud Computing', 'CC-1.2', 'Cloud Risk Assessment', 'Conduct comprehensive risk assessment before cloud adoption', 'Risk Assessment', 'High', 'Implemented', 'Intermediate'),
('Cloud Computing', 'CC-2.1', 'Cloud Service Provider Selection', 'Establish criteria and process for cloud service provider selection', 'Selection', 'High', 'Implemented', 'Intermediate'),
('Cloud Computing', 'CC-2.2', 'Cloud Security Controls', 'Implement appropriate security controls for cloud environments', 'Security', 'High', 'Partially Implemented', 'Intermediate'),
('Cloud Computing', 'CC-3.1', 'Data Residency and Sovereignty', 'Ensure compliance with data residency and sovereignty requirements', 'Compliance', 'High', 'Implemented', 'Advanced'),
('Cloud Computing', 'CC-3.2', 'Cloud Monitoring and Logging', 'Implement comprehensive monitoring and logging for cloud services', 'Monitoring', 'Medium', 'Partially Implemented', 'Basic'),

-- Access Management Controls
('Access Management', 'AM-1.1', 'Identity and Access Management', 'Implement comprehensive identity and access management system', 'Identity Management', 'High', 'Partially Implemented', 'Intermediate'),
('Access Management', 'AM-1.2', 'User Access Provisioning', 'Establish user access provisioning and deprovisioning processes', 'Provisioning', 'High', 'Implemented', 'Intermediate'),
('Access Management', 'AM-2.1', 'Access Reviews', 'Conduct regular access reviews and certifications', 'Reviews', 'High', 'Partially Implemented', 'Basic'),
('Access Management', 'AM-2.2', 'Segregation of Duties', 'Implement segregation of duties controls for critical functions', 'Segregation', 'High', 'Not Implemented', 'Basic');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mas_self_assessment_domain ON mas_self_assessment_controls(domain);
CREATE INDEX IF NOT EXISTS idx_mas_self_assessment_status ON mas_self_assessment_controls(implementation_status);
CREATE INDEX IF NOT EXISTS idx_mas_self_assessment_criticality ON mas_self_assessment_controls(criticality);
CREATE INDEX IF NOT EXISTS idx_mas_self_assessment_control_id ON mas_self_assessment_controls(control_id);
