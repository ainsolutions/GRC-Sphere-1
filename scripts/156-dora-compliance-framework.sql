-- DORA Compliance Framework
-- Create table for DORA (Digital Operational Resilience Act) requirements

CREATE TABLE IF NOT EXISTS dora_requirements (
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

-- Insert DORA requirements
INSERT INTO dora_requirements (domain, control_id, control_name, description, control_type, maturity_level, implementation_guidance) VALUES

-- ICT Risk Management
('ICT Risk Management', 'ICT-RM-01', 'ICT Risk Management Framework', 'Establish comprehensive ICT risk management framework aligned with business strategy', 'Mandatory', 'Basic', 'Implement systematic approach to identify, assess, and manage ICT risks'),
('ICT Risk Management', 'ICT-RM-02', 'ICT Risk Assessment', 'Conduct regular ICT risk assessments covering all critical systems and processes', 'Mandatory', 'Intermediate', 'Perform comprehensive risk assessments at least annually'),
('ICT Risk Management', 'ICT-RM-03', 'ICT Risk Appetite and Tolerance', 'Define and maintain ICT risk appetite and tolerance levels', 'Mandatory', 'Advanced', 'Establish clear risk appetite statements and tolerance thresholds'),
('ICT Risk Management', 'ICT-RM-04', 'ICT Risk Monitoring', 'Implement continuous ICT risk monitoring and reporting', 'Mandatory', 'Advanced', 'Deploy real-time risk monitoring capabilities'),
('ICT Risk Management', 'ICT-RM-05', 'ICT Risk Treatment', 'Implement appropriate ICT risk treatment measures', 'Mandatory', 'Intermediate', 'Develop and execute risk treatment plans'),

-- ICT-related Incident Management
('ICT-related Incident Management', 'ICT-IM-01', 'Incident Management Policy', 'Establish comprehensive ICT incident management policy and procedures', 'Mandatory', 'Basic', 'Create detailed incident response procedures'),
('ICT-related Incident Management', 'ICT-IM-02', 'Incident Detection and Reporting', 'Implement incident detection and internal reporting mechanisms', 'Mandatory', 'Intermediate', 'Deploy automated incident detection tools'),
('ICT-related Incident Management', 'ICT-IM-03', 'Incident Classification', 'Establish incident classification and prioritization criteria', 'Mandatory', 'Basic', 'Define clear incident severity levels'),
('ICT-related Incident Management', 'ICT-IM-04', 'Incident Response Team', 'Establish dedicated incident response team with defined roles', 'Mandatory', 'Intermediate', 'Create cross-functional incident response team'),
('ICT-related Incident Management', 'ICT-IM-05', 'External Incident Reporting', 'Implement external incident reporting to authorities', 'Mandatory', 'Advanced', 'Establish regulatory reporting procedures'),
('ICT-related Incident Management', 'ICT-IM-06', 'Incident Recovery', 'Implement incident recovery and business continuity procedures', 'Mandatory', 'Advanced', 'Develop comprehensive recovery plans'),
('ICT-related Incident Management', 'ICT-IM-07', 'Lessons Learned', 'Conduct post-incident analysis and lessons learned', 'Mandatory', 'Intermediate', 'Implement continuous improvement process'),

-- Digital Operational Resilience Testing
('Digital Operational Resilience Testing', 'DORT-01', 'Testing Strategy', 'Develop comprehensive digital operational resilience testing strategy', 'Mandatory', 'Advanced', 'Create risk-based testing approach'),
('Digital Operational Resilience Testing', 'DORT-02', 'Vulnerability Assessments', 'Conduct regular vulnerability assessments and penetration testing', 'Mandatory', 'Intermediate', 'Perform quarterly vulnerability assessments'),
('Digital Operational Resilience Testing', 'DORT-03', 'Scenario-based Testing', 'Implement scenario-based operational resilience testing', 'Mandatory', 'Advanced', 'Conduct realistic attack simulations'),
('Digital Operational Resilience Testing', 'DORT-04', 'Red Team Testing', 'Perform advanced red team testing exercises', 'Mandatory', 'Advanced', 'Engage external red team specialists'),
('Digital Operational Resilience Testing', 'DORT-05', 'Testing Documentation', 'Maintain comprehensive testing documentation and results', 'Mandatory', 'Basic', 'Document all testing activities and findings'),
('Digital Operational Resilience Testing', 'DORT-06', 'Remediation Tracking', 'Track and verify remediation of identified vulnerabilities', 'Mandatory', 'Intermediate', 'Implement vulnerability management system'),

-- Managing ICT Third-party Risk
('Managing ICT Third-party Risk', 'ICT-TPR-01', 'Third-party Risk Strategy', 'Develop ICT third-party risk management strategy', 'Mandatory', 'Basic', 'Create comprehensive third-party risk framework'),
('Managing ICT Third-party Risk', 'ICT-TPR-02', 'Due Diligence', 'Conduct thorough due diligence on ICT third-party providers', 'Mandatory', 'Intermediate', 'Implement standardized due diligence process'),
('Managing ICT Third-party Risk', 'ICT-TPR-03', 'Contractual Arrangements', 'Establish appropriate contractual arrangements with ICT third parties', 'Mandatory', 'Advanced', 'Include specific DORA requirements in contracts'),
('Managing ICT Third-party Risk', 'ICT-TPR-04', 'Concentration Risk', 'Monitor and manage ICT third-party concentration risk', 'Mandatory', 'Advanced', 'Assess and mitigate concentration risks'),
('Managing ICT Third-party Risk', 'ICT-TPR-05', 'Ongoing Monitoring', 'Implement ongoing monitoring of ICT third-party providers', 'Mandatory', 'Intermediate', 'Establish continuous monitoring processes'),
('Managing ICT Third-party Risk', 'ICT-TPR-06', 'Exit Strategies', 'Develop exit strategies for critical ICT third-party arrangements', 'Mandatory', 'Advanced', 'Create detailed exit and transition plans'),

-- Information and Intelligence Sharing
('Information and Intelligence Sharing', 'IIS-01', 'Information Sharing Arrangements', 'Participate in information sharing arrangements', 'Recommended', 'Intermediate', 'Join relevant threat intelligence sharing groups'),
('Information and Intelligence Sharing', 'IIS-02', 'Threat Intelligence', 'Implement threat intelligence capabilities', 'Recommended', 'Advanced', 'Deploy threat intelligence platforms'),
('Information and Intelligence Sharing', 'IIS-03', 'Cyber Threat Information', 'Share relevant cyber threat information with authorities', 'Recommended', 'Basic', 'Establish information sharing protocols'),

-- ICT Governance and Strategy
('ICT Governance and Strategy', 'ICT-GS-01', 'ICT Strategy', 'Develop and maintain comprehensive ICT strategy', 'Mandatory', 'Basic', 'Align ICT strategy with business objectives'),
('ICT Governance and Strategy', 'ICT-GS-02', 'ICT Governance Framework', 'Establish ICT governance framework with clear accountability', 'Mandatory', 'Intermediate', 'Define roles and responsibilities for ICT governance'),
('ICT Governance and Strategy', 'ICT-GS-03', 'Board Oversight', 'Ensure appropriate board-level oversight of ICT risks', 'Mandatory', 'Advanced', 'Establish board ICT risk committee'),
('ICT Governance and Strategy', 'ICT-GS-04', 'ICT Policies', 'Develop and maintain comprehensive ICT policies', 'Mandatory', 'Basic', 'Create policy framework covering all ICT areas'),
('ICT Governance and Strategy', 'ICT-GS-05', 'Performance Monitoring', 'Implement ICT performance monitoring and reporting', 'Mandatory', 'Intermediate', 'Establish ICT KPIs and metrics'),

-- ICT Business Continuity
('ICT Business Continuity', 'ICT-BC-01', 'Business Continuity Plan', 'Develop comprehensive ICT business continuity plan', 'Mandatory', 'Basic', 'Create detailed continuity procedures'),
('ICT Business Continuity', 'ICT-BC-02', 'Recovery Time Objectives', 'Define recovery time and point objectives for critical systems', 'Mandatory', 'Intermediate', 'Establish RTO and RPO for all critical systems'),
('ICT Business Continuity', 'ICT-BC-03', 'Backup and Recovery', 'Implement robust backup and recovery capabilities', 'Mandatory', 'Basic', 'Deploy automated backup solutions'),
('ICT Business Continuity', 'ICT-BC-04', 'Alternative Sites', 'Establish alternative processing sites for critical operations', 'Mandatory', 'Advanced', 'Implement geographically distributed sites'),
('ICT Business Continuity', 'ICT-BC-05', 'Testing and Exercises', 'Conduct regular business continuity testing and exercises', 'Mandatory', 'Intermediate', 'Perform quarterly continuity tests'),

-- ICT Security Controls
('ICT Security Controls', 'ICT-SC-01', 'Access Control', 'Implement comprehensive access control measures', 'Mandatory', 'Intermediate', 'Deploy identity and access management'),
('ICT Security Controls', 'ICT-SC-02', 'Cryptography', 'Implement appropriate cryptographic controls', 'Mandatory', 'Advanced', 'Deploy encryption for data at rest and in transit'),
('ICT Security Controls', 'ICT-SC-03', 'Network Security', 'Implement network security controls and monitoring', 'Mandatory', 'Intermediate', 'Deploy network segmentation and monitoring'),
('ICT Security Controls', 'ICT-SC-04', 'Endpoint Security', 'Implement endpoint security measures', 'Mandatory', 'Basic', 'Deploy endpoint protection solutions'),
('ICT Security Controls', 'ICT-SC-05', 'Security Monitoring', 'Implement continuous security monitoring', 'Mandatory', 'Advanced', 'Deploy SIEM and security analytics'),
('ICT Security Controls', 'ICT-SC-06', 'Patch Management', 'Implement systematic patch management processes', 'Mandatory', 'Basic', 'Establish automated patch management'),

-- ICT Asset Management
('ICT Asset Management', 'ICT-AM-01', 'Asset Inventory', 'Maintain comprehensive ICT asset inventory', 'Mandatory', 'Basic', 'Implement automated asset discovery'),
('ICT Asset Management', 'ICT-AM-02', 'Asset Classification', 'Classify ICT assets based on criticality and sensitivity', 'Mandatory', 'Intermediate', 'Develop asset classification scheme'),
('ICT Asset Management', 'ICT-AM-03', 'Asset Lifecycle', 'Manage ICT assets throughout their lifecycle', 'Mandatory', 'Intermediate', 'Implement asset lifecycle management'),
('ICT Asset Management', 'ICT-AM-04', 'Configuration Management', 'Implement configuration management for ICT assets', 'Mandatory', 'Advanced', 'Deploy configuration management tools'),
('ICT Asset Management', 'ICT-AM-05', 'Change Management', 'Implement change management processes for ICT assets', 'Mandatory', 'Basic', 'Establish formal change control procedures');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dora_requirements_domain ON dora_requirements(domain);
CREATE INDEX IF NOT EXISTS idx_dora_requirements_control_id ON dora_requirements(control_id);
CREATE INDEX IF NOT EXISTS idx_dora_requirements_status ON dora_requirements(status);
