-- NIS2 Self-Assessment Tables
-- Create tables for NIS2 self-assessment controls and responses

CREATE TABLE IF NOT EXISTS nis2_self_assessment_controls (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(100) NOT NULL,
    control_id VARCHAR(20) NOT NULL,
    control_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    implementation_status VARCHAR(50) DEFAULT 'Not Implemented', -- Implemented, Partially Implemented, Not Implemented, Not Applicable
    maturity_level VARCHAR(20), -- Basic, Intermediate, Advanced
    evidence TEXT,
    gaps_identified TEXT,
    remediation_plan TEXT,
    target_completion_date DATE,
    responsible_party VARCHAR(200),
    last_reviewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert NIS2 self-assessment controls based on requirements
INSERT INTO nis2_self_assessment_controls (domain, control_id, control_name, description, implementation_status, maturity_level, evidence, gaps_identified, remediation_plan, responsible_party) 
SELECT 
    domain,
    control_id,
    control_name,
    description,
    CASE 
        WHEN RANDOM() < 0.3 THEN 'Implemented'
        WHEN RANDOM() < 0.6 THEN 'Partially Implemented'
        ELSE 'Not Implemented'
    END as implementation_status,
    CASE 
        WHEN RANDOM() < 0.2 THEN 'Advanced'
        WHEN RANDOM() < 0.5 THEN 'Intermediate'
        ELSE 'Basic'
    END as maturity_level,
    CASE 
        WHEN RANDOM() < 0.4 THEN 'Policy documents and procedures in place. Regular training conducted.'
        WHEN RANDOM() < 0.7 THEN 'Technical controls implemented. Monitoring capabilities deployed.'
        ELSE 'Basic controls in place. Documentation needs improvement.'
    END as evidence,
    CASE 
        WHEN RANDOM() < 0.3 THEN 'No significant gaps identified.'
        WHEN RANDOM() < 0.6 THEN 'Minor gaps in documentation and training.'
        ELSE 'Significant gaps in implementation and monitoring.'
    END as gaps_identified,
    CASE 
        WHEN RANDOM() < 0.3 THEN 'Continue monitoring and improvement activities.'
        WHEN RANDOM() < 0.6 THEN 'Enhance documentation and provide additional training.'
        ELSE 'Implement missing controls and establish monitoring procedures.'
    END as remediation_plan,
    CASE 
        WHEN domain = 'Risk Management' THEN 'Risk Management Team'
        WHEN domain = 'Corporate Governance' THEN 'Governance Office'
        WHEN domain = 'Cybersecurity Measures' THEN 'Security Team'
        WHEN domain = 'Network and Information Systems Security' THEN 'IT Security Team'
        WHEN domain = 'Incident Handling' THEN 'Incident Response Team'
        WHEN domain = 'Business Continuity' THEN 'Business Continuity Team'
        WHEN domain = 'Supply Chain Security' THEN 'Procurement Team'
        WHEN domain = 'Security in Network and Information Systems Acquisition' THEN 'IT Procurement Team'
        WHEN domain = 'Policies on Vulnerability Disclosure' THEN 'Security Team'
        WHEN domain = 'Crisis Management' THEN 'Crisis Management Team'
        ELSE 'Security Team'
    END as responsible_party
FROM nis2_requirements;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nis2_self_assessment_domain ON nis2_self_assessment_controls(domain);
CREATE INDEX IF NOT EXISTS idx_nis2_self_assessment_control_id ON nis2_self_assessment_controls(control_id);
CREATE INDEX IF NOT EXISTS idx_nis2_self_assessment_status ON nis2_self_assessment_controls(implementation_status);
CREATE INDEX IF NOT EXISTS idx_nis2_self_assessment_maturity ON nis2_self_assessment_controls(maturity_level);
