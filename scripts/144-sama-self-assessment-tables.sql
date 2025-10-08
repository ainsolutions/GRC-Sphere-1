-- SAMA Self-Assessment Tables
-- Create tables for SAMA self-assessment functionality

CREATE TABLE IF NOT EXISTS sama_self_assessment_controls (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(100) NOT NULL,
    control_id VARCHAR(20) NOT NULL,
    control_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    implementation_status VARCHAR(50) DEFAULT 'Not Assessed', -- Implemented, Partially Implemented, Not Implemented, Not Applicable, Not Assessed
    maturity_level VARCHAR(20) DEFAULT 'Not Assessed', -- Basic, Intermediate, Advanced, Not Assessed
    evidence TEXT,
    gaps_identified TEXT,
    remediation_plan TEXT,
    target_completion_date DATE,
    responsible_party VARCHAR(100),
    last_reviewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert SAMA self-assessment controls based on requirements
INSERT INTO sama_self_assessment_controls (domain, control_id, control_name, description, implementation_status, maturity_level, evidence, gaps_identified, remediation_plan, responsible_party)
SELECT 
    domain,
    control_id,
    control_name,
    description,
    'Not Assessed',
    'Not Assessed',
    '',
    '',
    '',
    ''
FROM sama_requirements;

-- Update some sample controls with assessment data
UPDATE sama_self_assessment_controls SET
    implementation_status = 'Implemented',
    maturity_level = 'Intermediate',
    evidence = 'Board-approved cybersecurity strategy document dated February 2024, includes risk management framework and governance structure',
    gaps_identified = 'Strategy needs regular review cycle and alignment with emerging threats',
    remediation_plan = 'Establish annual strategy review process and include emerging technology risks',
    responsible_party = 'Chief Information Security Officer',
    last_reviewed = CURRENT_TIMESTAMP
WHERE control_id = 'CG-01';

UPDATE sama_self_assessment_controls SET
    implementation_status = 'Partially Implemented',
    maturity_level = 'Basic',
    evidence = 'Multi-factor authentication deployed for privileged accounts, role-based access control implemented for core systems',
    gaps_identified = 'MFA not implemented for all user accounts, access reviews not conducted regularly',
    remediation_plan = 'Roll out MFA to all users by Q4 2024, implement quarterly access reviews',
    responsible_party = 'Identity and Access Management Team',
    last_reviewed = CURRENT_TIMESTAMP
WHERE control_id = 'CD-02';

UPDATE sama_self_assessment_controls SET
    implementation_status = 'Implemented',
    maturity_level = 'Advanced',
    evidence = 'AES-256 encryption for data at rest, TLS 1.3 for data in transit, key management system implemented',
    gaps_identified = 'Encryption key rotation policy needs enhancement',
    remediation_plan = 'Implement automated key rotation for all encryption keys',
    responsible_party = 'Cryptography Team',
    last_reviewed = CURRENT_TIMESTAMP
WHERE control_id = 'CD-05';

UPDATE sama_self_assessment_controls SET
    implementation_status = 'Not Implemented',
    maturity_level = 'Not Assessed',
    evidence = '',
    gaps_identified = 'No formal third-party cybersecurity risk assessment framework in place',
    remediation_plan = 'Develop comprehensive third-party risk assessment framework with regular monitoring',
    responsible_party = 'Third Party Risk Manager',
    last_reviewed = CURRENT_TIMESTAMP
WHERE control_id = 'TP-01';

UPDATE sama_self_assessment_controls SET
    implementation_status = 'Partially Implemented',
    maturity_level = 'Basic',
    evidence = 'Basic transaction monitoring in place, alerts configured for high-value transactions',
    gaps_identified = 'No real-time fraud detection, limited machine learning capabilities',
    remediation_plan = 'Implement advanced transaction monitoring with AI-based fraud detection',
    responsible_party = 'Payment Systems Security Team',
    last_reviewed = CURRENT_TIMESTAMP
WHERE control_id = 'PS-02';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sama_self_assessment_domain ON sama_self_assessment_controls(domain);
CREATE INDEX IF NOT EXISTS idx_sama_self_assessment_control_id ON sama_self_assessment_controls(control_id);
CREATE INDEX IF NOT EXISTS idx_sama_self_assessment_status ON sama_self_assessment_controls(implementation_status);
CREATE INDEX IF NOT EXISTS idx_sama_self_assessment_maturity ON sama_self_assessment_controls(maturity_level);
CREATE INDEX IF NOT EXISTS idx_sama_self_assessment_responsible ON sama_self_assessment_controls(responsible_party);
