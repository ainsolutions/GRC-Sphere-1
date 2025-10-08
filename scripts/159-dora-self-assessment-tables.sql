-- DORA Self-Assessment Tables
-- Create tables for DORA self-assessment controls and responses

CREATE TABLE IF NOT EXISTS dora_self_assessment_controls (
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

-- Insert DORA self-assessment controls based on requirements
INSERT INTO dora_self_assessment_controls (domain, control_id, control_name, description, implementation_status, maturity_level, evidence, gaps_identified, remediation_plan, responsible_party) 
SELECT 
    domain,
    control_id,
    control_name,
    description,
    CASE 
        WHEN RANDOM() < 0.35 THEN 'Implemented'
        WHEN RANDOM() < 0.65 THEN 'Partially Implemented'
        ELSE 'Not Implemented'
    END as implementation_status,
    CASE 
        WHEN RANDOM() < 0.25 THEN 'Advanced'
        WHEN RANDOM() < 0.55 THEN 'Intermediate'
        ELSE 'Basic'
    END as maturity_level,
    CASE 
        WHEN RANDOM() < 0.4 THEN 'ICT policies and procedures documented and implemented. Regular training conducted for relevant staff.'
        WHEN RANDOM() < 0.7 THEN 'Technical controls implemented with monitoring capabilities. Documentation maintained and updated regularly.'
        ELSE 'Basic controls in place. Documentation exists but requires enhancement and regular review.'
    END as evidence,
    CASE 
        WHEN RANDOM() < 0.3 THEN 'No significant gaps identified in current implementation.'
        WHEN RANDOM() < 0.6 THEN 'Minor gaps in documentation completeness and staff awareness training.'
        ELSE 'Significant gaps in implementation coverage and monitoring capabilities.'
    END as gaps_identified,
    CASE 
        WHEN RANDOM() < 0.3 THEN 'Continue monitoring and periodic review of implementation effectiveness.'
        WHEN RANDOM() < 0.6 THEN 'Enhance documentation and provide additional staff training on procedures.'
        ELSE 'Implement missing controls and establish comprehensive monitoring and review processes.'
    END as remediation_plan,
    CASE 
        WHEN domain = 'ICT Risk Management' THEN 'ICT Risk Management Team'
        WHEN domain = 'ICT-related Incident Management' THEN 'Incident Response Team'
        WHEN domain = 'Digital Operational Resilience Testing' THEN 'IT Security Team'
        WHEN domain = 'Managing ICT Third-party Risk' THEN 'Third-party Risk Team'
        WHEN domain = 'Information and Intelligence Sharing' THEN 'Threat Intelligence Team'
        WHEN domain = 'ICT Governance and Strategy' THEN 'ICT Governance Office'
        WHEN domain = 'ICT Business Continuity' THEN 'Business Continuity Team'
        WHEN domain = 'ICT Security Controls' THEN 'Information Security Team'
        WHEN domain = 'ICT Asset Management' THEN 'IT Asset Management Team'
        ELSE 'ICT Risk Management Team'
    END as responsible_party
FROM dora_requirements;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_dora_self_assessment_domain ON dora_self_assessment_controls(domain);
CREATE INDEX IF NOT EXISTS idx_dora_self_assessment_control_id ON dora_self_assessment_controls(control_id);
CREATE INDEX IF NOT EXISTS idx_dora_self_assessment_status ON dora_self_assessment_controls(implementation_status);
CREATE INDEX IF NOT EXISTS idx_dora_self_assessment_maturity ON dora_self_assessment_controls(maturity_level);
