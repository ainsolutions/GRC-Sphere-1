-- Qatar NIA Self-Assessment Tables
-- Create tables for Qatar NIA self-assessment controls and responses

CREATE TABLE IF NOT EXISTS qatar_nia_self_assessment_controls (
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

-- Insert Qatar NIA self-assessment controls based on requirements
INSERT INTO qatar_nia_self_assessment_controls (domain, control_id, control_name, description, implementation_status, maturity_level, evidence, gaps_identified, remediation_plan, responsible_party) 
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
        WHEN RANDOM() < 0.4 THEN 'Policy documents and procedures in place. Regular training conducted. Compliance monitoring active.'
        WHEN RANDOM() < 0.7 THEN 'Technical controls implemented. Monitoring capabilities deployed. Documentation maintained.'
        ELSE 'Basic controls in place. Documentation needs improvement. Training required.'
    END as evidence,
    CASE 
        WHEN RANDOM() < 0.3 THEN 'No significant gaps identified. Controls operating effectively.'
        WHEN RANDOM() < 0.6 THEN 'Minor gaps in documentation and training. Some process improvements needed.'
        ELSE 'Significant gaps in implementation and monitoring. Major improvements required.'
    END as gaps_identified,
    CASE 
        WHEN RANDOM() < 0.3 THEN 'Continue monitoring and improvement activities. Regular review scheduled.'
        WHEN RANDOM() < 0.6 THEN 'Enhance documentation and provide additional training. Update procedures.'
        ELSE 'Implement missing controls and establish monitoring procedures. Assign dedicated resources.'
    END as remediation_plan,
    CASE 
        WHEN domain = 'Information Security Governance' THEN 'Governance Office'
        WHEN domain = 'Risk Management' THEN 'Risk Management Team'
        WHEN domain = 'Asset Management' THEN 'Asset Management Team'
        WHEN domain = 'Access Control' THEN 'Identity & Access Management Team'
        WHEN domain = 'Cryptography' THEN 'Cryptography Team'
        WHEN domain = 'Physical and Environmental Security' THEN 'Facilities Security Team'
        WHEN domain = 'Operations Security' THEN 'IT Operations Team'
        WHEN domain = 'Communications Security' THEN 'Network Security Team'
        WHEN domain = 'System Acquisition and Development' THEN 'Development Team'
        WHEN domain = 'Supplier Relationships' THEN 'Procurement Team'
        WHEN domain = 'Information Security Incident Management' THEN 'Incident Response Team'
        WHEN domain = 'Business Continuity' THEN 'Business Continuity Team'
        WHEN domain = 'Compliance' THEN 'Compliance Team'
        ELSE 'Security Team'
    END as responsible_party
FROM qatar_nia_requirements;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_qatar_nia_self_assessment_domain ON qatar_nia_self_assessment_controls(domain);
CREATE INDEX IF NOT EXISTS idx_qatar_nia_self_assessment_control_id ON qatar_nia_self_assessment_controls(control_id);
CREATE INDEX IF NOT EXISTS idx_qatar_nia_self_assessment_status ON qatar_nia_self_assessment_controls(implementation_status);
CREATE INDEX IF NOT EXISTS idx_qatar_nia_self_assessment_maturity ON qatar_nia_self_assessment_controls(maturity_level);
