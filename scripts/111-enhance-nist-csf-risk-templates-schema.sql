-- Enhance NIST CSF Risk Templates table with additional fields

-- Add new columns to nist_csf_risk_templates table
ALTER TABLE nist_csf_risk_templates 
ADD COLUMN IF NOT EXISTS residual_likelihood INTEGER CHECK (residual_likelihood BETWEEN 1 AND 5),
ADD COLUMN IF NOT EXISTS residual_impact INTEGER CHECK (residual_impact BETWEEN 1 AND 5),
ADD COLUMN IF NOT EXISTS residual_risk_level VARCHAR(20),
ADD COLUMN IF NOT EXISTS existing_controls TEXT[],
ADD COLUMN IF NOT EXISTS control_references INTEGER[],
ADD COLUMN IF NOT EXISTS implementation_guidance TEXT,
ADD COLUMN IF NOT EXISTS compliance_requirements INTEGER[],
ADD COLUMN IF NOT EXISTS maturity_level INTEGER REFERENCES nist_csf_implementation_tiers(tier_level),
ADD COLUMN IF NOT EXISTS risk_treatment VARCHAR(20) CHECK (risk_treatment IN ('Mitigate', 'Avoidance', 'Transfer', 'Eliminate'));

-- Create NIST references table if it doesn't exist
CREATE TABLE IF NOT EXISTS nist_references (
    id SERIAL PRIMARY KEY,
    reference_code VARCHAR(50) NOT NULL UNIQUE,
    reference_name VARCHAR(200) NOT NULL,
    reference_description TEXT,
    reference_type VARCHAR(50), -- 'control', 'guidance', 'compliance'
    category VARCHAR(100),
    implementation_guidance TEXT,
    compliance_requirement TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample NIST references
INSERT INTO nist_references (reference_code, reference_name, reference_description, reference_type, category, implementation_guidance, compliance_requirement) VALUES
-- Control References
('NIST-800-53-AC-1', 'Access Control Policy and Procedures', 'Develop, document, and disseminate access control policy and procedures', 'control', 'Access Control', 'Establish formal access control policies that address purpose, scope, roles, responsibilities, and compliance requirements', 'Organizations must maintain documented access control policies and procedures'),
('NIST-800-53-AC-2', 'Account Management', 'Manage information system accounts including establishment, activation, modification, review, and removal', 'control', 'Access Control', 'Implement automated account management functions where possible and maintain account inventories', 'All user accounts must be properly managed throughout their lifecycle'),
('NIST-800-53-AC-3', 'Access Enforcement', 'Enforce approved authorizations for logical access to information and system resources', 'control', 'Access Control', 'Implement role-based access controls and principle of least privilege', 'Access must be restricted based on approved authorizations'),
('NIST-800-53-AU-1', 'Audit and Accountability Policy and Procedures', 'Develop, document, and disseminate audit and accountability policy and procedures', 'control', 'Audit and Accountability', 'Establish comprehensive audit policies covering event types, frequency, and retention', 'Organizations must maintain audit trails for security-relevant events'),
('NIST-800-53-CA-1', 'Security Assessment and Authorization Policy and Procedures', 'Develop, document, and disseminate security assessment and authorization policy', 'control', 'Security Assessment', 'Establish formal assessment procedures and authorization processes', 'Security assessments must be conducted regularly and documented'),
('NIST-800-53-CM-1', 'Configuration Management Policy and Procedures', 'Develop, document, and disseminate configuration management policy and procedures', 'control', 'Configuration Management', 'Implement baseline configurations and change control processes', 'System configurations must be managed and controlled'),
('NIST-800-53-CP-1', 'Contingency Planning Policy and Procedures', 'Develop, document, and disseminate contingency planning policy and procedures', 'control', 'Contingency Planning', 'Develop comprehensive business continuity and disaster recovery plans', 'Organizations must have documented contingency plans'),
('NIST-800-53-IA-1', 'Identification and Authentication Policy and Procedures', 'Develop, document, and disseminate identification and authentication policy', 'control', 'Identification and Authentication', 'Implement strong authentication mechanisms and identity verification', 'Users must be uniquely identified and authenticated'),
('NIST-800-53-IR-1', 'Incident Response Policy and Procedures', 'Develop, document, and disseminate incident response policy and procedures', 'control', 'Incident Response', 'Establish incident response team and procedures for handling security incidents', 'Security incidents must be properly handled and documented'),
('NIST-800-53-MA-1', 'System Maintenance Policy and Procedures', 'Develop, document, and disseminate system maintenance policy and procedures', 'control', 'Maintenance', 'Implement controlled maintenance procedures and documentation', 'System maintenance must be properly controlled and documented'),

-- Implementation Guidance References
('NIST-CSF-ID.AM-1', 'Physical devices and systems within the organization are inventoried', 'Maintain accurate inventory of physical devices and systems', 'guidance', 'Asset Management', 'Implement automated asset discovery tools and maintain centralized asset database', 'All organizational assets must be identified and inventoried'),
('NIST-CSF-ID.AM-2', 'Software platforms and applications within the organization are inventoried', 'Maintain accurate inventory of software platforms and applications', 'guidance', 'Asset Management', 'Use software asset management tools and maintain software licenses inventory', 'All software assets must be identified and properly licensed'),
('NIST-CSF-PR.AC-1', 'Identities and credentials are issued, managed, verified, revoked, and audited', 'Comprehensive identity and credential management', 'guidance', 'Access Control', 'Implement identity lifecycle management processes and regular access reviews', 'Identity management must follow established procedures'),
('NIST-CSF-PR.DS-1', 'Data-at-rest is protected', 'Implement protection mechanisms for data at rest', 'guidance', 'Data Security', 'Use encryption, access controls, and data loss prevention technologies', 'Sensitive data at rest must be protected using appropriate controls'),
('NIST-CSF-DE.CM-1', 'The network is monitored to detect potential cybersecurity events', 'Continuous network monitoring for security events', 'guidance', 'Detection', 'Deploy network monitoring tools and establish security operations center', 'Networks must be continuously monitored for security events'),

-- Compliance Requirements
('SOX-404', 'Sarbanes-Oxley Section 404', 'Internal control over financial reporting requirements', 'compliance', 'Financial Reporting', 'Implement and test internal controls over financial reporting processes', 'Public companies must maintain effective internal controls over financial reporting'),
('PCI-DSS-3.2.1', 'Payment Card Industry Data Security Standard', 'Security requirements for organizations handling cardholder data', 'compliance', 'Payment Security', 'Implement comprehensive security controls for cardholder data environment', 'Organizations processing payment cards must comply with PCI DSS requirements'),
('HIPAA-164.312', 'HIPAA Security Rule', 'Administrative, physical, and technical safeguards for electronic PHI', 'compliance', 'Healthcare', 'Implement comprehensive safeguards for protected health information', 'Covered entities must protect electronic protected health information'),
('GDPR-32', 'GDPR Security of Processing', 'Technical and organizational measures for data protection', 'compliance', 'Data Protection', 'Implement appropriate technical and organizational security measures', 'Organizations processing EU personal data must implement appropriate security measures'),
('ISO-27001-A.9.1.1', 'ISO 27001 Access Control Policy', 'Access control policy requirements', 'compliance', 'Information Security', 'Establish and maintain access control policies and procedures', 'Organizations must have documented access control policies');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nist_references_type ON nist_references(reference_type);
CREATE INDEX IF NOT EXISTS idx_nist_references_category ON nist_references(category);
CREATE INDEX IF NOT EXISTS idx_nist_references_active ON nist_references(is_active);

-- Update existing templates with default values
UPDATE nist_csf_risk_templates 
SET 
    residual_likelihood = CASE 
        WHEN default_likelihood > 1 THEN default_likelihood - 1 
        ELSE default_likelihood 
    END,
    residual_impact = CASE 
        WHEN default_impact > 1 THEN default_impact - 1 
        ELSE default_impact 
    END,
    maturity_level = 1,
    risk_treatment = 'Mitigate'
WHERE residual_likelihood IS NULL;

-- Update residual risk levels based on residual likelihood and impact
UPDATE nist_csf_risk_templates 
SET residual_risk_level = CASE 
    WHEN (residual_likelihood * residual_impact) >= 20 THEN 'Critical'
    WHEN (residual_likelihood * residual_impact) >= 15 THEN 'High'
    WHEN (residual_likelihood * residual_impact) >= 10 THEN 'Medium'
    WHEN (residual_likelihood * residual_impact) >= 5 THEN 'Low'
    ELSE 'Very Low'
END
WHERE residual_risk_level IS NULL;
