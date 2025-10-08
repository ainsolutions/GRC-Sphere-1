-- Create MICA compliance framework tables
-- Markets in Crypto-Assets Regulation (MICA) compliance management

-- MICA Requirements table
CREATE TABLE IF NOT EXISTS mica_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    control_type VARCHAR(50) NOT NULL, -- preventive, detective, corrective
    implementation_guidance TEXT,
    evidence_requirements TEXT[], -- Array of required evidence types
    maturity_levels TEXT[], -- Array of maturity level descriptions
    risk_level VARCHAR(20) NOT NULL DEFAULT 'medium', -- low, medium, high, critical
    compliance_status VARCHAR(30) NOT NULL DEFAULT 'not_assessed', -- compliant, non_compliant, partially_compliant, not_assessed
    last_assessment_date TIMESTAMP,
    next_assessment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT mica_requirements_risk_level_check 
        CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT mica_requirements_compliance_status_check 
        CHECK (compliance_status IN ('compliant', 'non_compliant', 'partially_compliant', 'not_assessed'))
);

-- MICA Assessments table
CREATE TABLE IF NOT EXISTS mica_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_name VARCHAR(200) NOT NULL,
    description TEXT,
    assessment_type VARCHAR(50) NOT NULL DEFAULT 'internal', -- internal, external, self_assessment
    scope TEXT,
    assessor_name VARCHAR(100) NOT NULL,
    assessor_email VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    target_completion_date DATE NOT NULL,
    actual_completion_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'draft', -- draft, in_progress, completed, cancelled
    overall_score DECIMAL(5,2),
    compliance_percentage DECIMAL(5,2),
    findings_summary TEXT,
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT mica_assessments_type_check 
        CHECK (assessment_type IN ('internal', 'external', 'self_assessment')),
    CONSTRAINT mica_assessments_status_check 
        CHECK (status IN ('draft', 'in_progress', 'completed', 'cancelled'))
);

-- MICA Assessment Results table
CREATE TABLE IF NOT EXISTS mica_assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES mica_assessments(id) ON DELETE CASCADE,
    requirement_id UUID NOT NULL REFERENCES mica_requirements(id) ON DELETE CASCADE,
    compliance_status VARCHAR(30) NOT NULL, -- compliant, non_compliant, partially_compliant
    assessment_score DECIMAL(5,2),
    evidence_provided TEXT,
    gaps_identified TEXT,
    recommendations TEXT,
    assessor_notes TEXT,
    assessment_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT mica_assessment_results_status_check 
        CHECK (compliance_status IN ('compliant', 'non_compliant', 'partially_compliant')),
    UNIQUE(assessment_id, requirement_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mica_requirements_category ON mica_requirements(category);
CREATE INDEX IF NOT EXISTS idx_mica_requirements_risk_level ON mica_requirements(risk_level);
CREATE INDEX IF NOT EXISTS idx_mica_requirements_compliance_status ON mica_requirements(compliance_status);
CREATE INDEX IF NOT EXISTS idx_mica_assessments_status ON mica_assessments(status);
CREATE INDEX IF NOT EXISTS idx_mica_assessments_assessor ON mica_assessments(assessor_email);
CREATE INDEX IF NOT EXISTS idx_mica_assessment_results_assessment ON mica_assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mica_assessment_results_requirement ON mica_assessment_results(requirement_id);

-- Insert sample MICA requirements
INSERT INTO mica_requirements (
    requirement_id, title, description, category, subcategory, control_type,
    implementation_guidance, evidence_requirements, maturity_levels, risk_level
) VALUES 
-- Authorization Requirements
('MICA-AUTH-001', 'Crypto-Asset Service Provider Authorization', 
 'Obtain proper authorization from competent authorities before providing crypto-asset services',
 'Authorization', 'Service Provider Licensing', 'preventive',
 'Submit comprehensive application including business plan, governance arrangements, and compliance procedures',
 ARRAY['Authorization certificate', 'Business plan', 'Governance documentation', 'Compliance procedures'],
 ARRAY['Level 0: No authorization process', 'Level 1: Basic application submitted', 'Level 2: Documentation in progress', 'Level 3: Complete application submitted', 'Level 4: Authorization obtained', 'Level 5: Ongoing compliance monitoring'],
 'critical'),

('MICA-AUTH-002', 'Fit and Proper Assessment', 
 'Ensure management and key personnel meet fit and proper requirements',
 'Authorization', 'Personnel Requirements', 'preventive',
 'Conduct thorough background checks and competency assessments for all key personnel',
 ARRAY['Background check reports', 'Competency assessments', 'Training records', 'Professional qualifications'],
 ARRAY['Level 0: No assessment process', 'Level 1: Basic checks performed', 'Level 2: Documented assessment criteria', 'Level 3: Comprehensive assessment process', 'Level 4: Regular reassessment', 'Level 5: Continuous monitoring'],
 'high'),

-- Operational Requirements
('MICA-OPS-001', 'Operational Resilience', 
 'Maintain robust operational resilience and business continuity arrangements',
 'Operational', 'Business Continuity', 'preventive',
 'Implement comprehensive business continuity and disaster recovery plans with regular testing',
 ARRAY['Business continuity plan', 'Disaster recovery procedures', 'Testing records', 'Incident response plan'],
 ARRAY['Level 0: No resilience planning', 'Level 1: Basic continuity plan', 'Level 2: Documented procedures', 'Level 3: Regular testing', 'Level 4: Comprehensive resilience framework', 'Level 5: Continuous improvement'],
 'high'),

('MICA-OPS-002', 'Risk Management Framework', 
 'Establish and maintain comprehensive risk management framework',
 'Operational', 'Risk Management', 'preventive',
 'Develop risk appetite, policies, procedures, and monitoring systems for all material risks',
 ARRAY['Risk management policy', 'Risk appetite statement', 'Risk registers', 'Monitoring reports'],
 ARRAY['Level 0: No risk management', 'Level 1: Basic risk identification', 'Level 2: Risk policies defined', 'Level 3: Comprehensive framework', 'Level 4: Advanced risk monitoring', 'Level 5: Integrated risk culture'],
 'critical'),

-- Custody Requirements
('MICA-CUST-001', 'Safeguarding of Crypto-Assets', 
 'Implement appropriate safeguarding arrangements for client crypto-assets',
 'Custody', 'Asset Safeguarding', 'preventive',
 'Use secure custody solutions with appropriate segregation and protection measures',
 ARRAY['Custody procedures', 'Segregation evidence', 'Security assessments', 'Insurance documentation'],
 ARRAY['Level 0: No safeguarding', 'Level 1: Basic custody', 'Level 2: Segregated storage', 'Level 3: Enhanced security', 'Level 4: Multi-signature controls', 'Level 5: Advanced custody solutions'],
 'critical'),

('MICA-CUST-002', 'Client Asset Segregation', 
 'Maintain proper segregation between client and proprietary assets',
 'Custody', 'Asset Segregation', 'preventive',
 'Implement systems and controls to ensure clear segregation and identification of client assets',
 ARRAY['Segregation procedures', 'Reconciliation records', 'System controls', 'Audit reports'],
 ARRAY['Level 0: No segregation', 'Level 1: Basic separation', 'Level 2: System controls', 'Level 3: Regular reconciliation', 'Level 4: Real-time monitoring', 'Level 5: Advanced segregation technology'],
 'high'),

-- Market Abuse Prevention
('MICA-MAR-001', 'Market Abuse Detection', 
 'Implement systems to detect and prevent market abuse in crypto-asset trading',
 'Market Abuse', 'Detection Systems', 'detective',
 'Deploy surveillance systems capable of detecting suspicious trading patterns and market manipulation',
 ARRAY['Surveillance system documentation', 'Detection algorithms', 'Alert procedures', 'Investigation records'],
 ARRAY['Level 0: No detection systems', 'Level 1: Basic monitoring', 'Level 2: Automated alerts', 'Level 3: Advanced surveillance', 'Level 4: AI-powered detection', 'Level 5: Predictive analytics'],
 'high'),

('MICA-MAR-002', 'Insider Dealing Prevention', 
 'Prevent insider dealing and ensure proper handling of inside information',
 'Market Abuse', 'Insider Dealing', 'preventive',
 'Establish policies and procedures to identify, manage, and prevent misuse of inside information',
 ARRAY['Insider dealing policy', 'Information barriers', 'Training records', 'Monitoring procedures'],
 ARRAY['Level 0: No controls', 'Level 1: Basic policy', 'Level 2: Information barriers', 'Level 3: Regular training', 'Level 4: Advanced monitoring', 'Level 5: Continuous surveillance'],
 'high'),

-- Transparency Requirements
('MICA-TRANS-001', 'Public Disclosure Requirements', 
 'Comply with public disclosure requirements for crypto-asset services',
 'Transparency', 'Public Disclosure', 'preventive',
 'Publish required information about services, risks, and operational arrangements',
 ARRAY['Disclosure documents', 'Website publications', 'Regulatory filings', 'Update procedures'],
 ARRAY['Level 0: No disclosures', 'Level 1: Basic information', 'Level 2: Regular updates', 'Level 3: Comprehensive disclosure', 'Level 4: Real-time information', 'Level 5: Enhanced transparency'],
 'medium'),

('MICA-TRANS-002', 'Client Reporting', 
 'Provide appropriate reporting to clients on their crypto-asset holdings and transactions',
 'Transparency', 'Client Reporting', 'preventive',
 'Implement systems to provide timely and accurate reporting to clients',
 ARRAY['Reporting procedures', 'Client statements', 'System capabilities', 'Accuracy controls'],
 ARRAY['Level 0: No reporting', 'Level 1: Basic statements', 'Level 2: Regular reporting', 'Level 3: Real-time access', 'Level 4: Advanced analytics', 'Level 5: Personalized insights'],
 'medium'),

-- Consumer Protection
('MICA-CONS-001', 'Client Onboarding and KYC', 
 'Implement robust client onboarding and know-your-customer procedures',
 'Consumer Protection', 'Client Onboarding', 'preventive',
 'Establish comprehensive KYC procedures including identity verification and risk assessment',
 ARRAY['KYC procedures', 'Identity verification records', 'Risk assessments', 'Monitoring systems'],
 ARRAY['Level 0: No KYC', 'Level 1: Basic identification', 'Level 2: Enhanced due diligence', 'Level 3: Risk-based approach', 'Level 4: Continuous monitoring', 'Level 5: Advanced analytics'],
 'high'),

('MICA-CONS-002', 'Complaints Handling', 
 'Establish effective complaints handling procedures for clients',
 'Consumer Protection', 'Complaints Management', 'corrective',
 'Implement fair and transparent procedures for handling client complaints',
 ARRAY['Complaints policy', 'Handling procedures', 'Resolution records', 'Reporting systems'],
 ARRAY['Level 0: No process', 'Level 1: Basic handling', 'Level 2: Formal procedures', 'Level 3: Tracking system', 'Level 4: Root cause analysis', 'Level 5: Proactive resolution'],
 'medium'),

-- Anti-Money Laundering
('MICA-AML-001', 'AML/CFT Compliance', 
 'Implement comprehensive anti-money laundering and counter-terrorist financing measures',
 'AML/CFT', 'Compliance Program', 'preventive',
 'Establish risk-based AML/CFT program including policies, procedures, and monitoring systems',
 ARRAY['AML policy', 'Risk assessment', 'Monitoring systems', 'Training records', 'Suspicious activity reports'],
 ARRAY['Level 0: No AML program', 'Level 1: Basic policies', 'Level 2: Risk assessment', 'Level 3: Monitoring systems', 'Level 4: Advanced analytics', 'Level 5: Integrated compliance'],
 'critical'),

('MICA-AML-002', 'Transaction Monitoring', 
 'Monitor transactions for suspicious activity and money laundering risks',
 'AML/CFT', 'Transaction Monitoring', 'detective',
 'Deploy automated systems to monitor transactions and identify suspicious patterns',
 ARRAY['Monitoring system', 'Alert procedures', 'Investigation records', 'SAR filings'],
 ARRAY['Level 0: No monitoring', 'Level 1: Manual review', 'Level 2: Basic automation', 'Level 3: Advanced rules', 'Level 4: Machine learning', 'Level 5: AI-powered detection'],
 'high'),

-- Governance Requirements
('MICA-GOV-001', 'Corporate Governance', 
 'Maintain appropriate corporate governance arrangements',
 'Governance', 'Corporate Structure', 'preventive',
 'Establish clear governance structure with appropriate oversight and accountability',
 ARRAY['Governance framework', 'Board charter', 'Committee structures', 'Reporting lines'],
 ARRAY['Level 0: No governance', 'Level 1: Basic structure', 'Level 2: Defined roles', 'Level 3: Regular oversight', 'Level 4: Performance monitoring', 'Level 5: Continuous improvement'],
 'high'),

('MICA-GOV-002', 'Internal Audit Function', 
 'Establish independent internal audit function',
 'Governance', 'Internal Audit', 'detective',
 'Implement independent internal audit function with appropriate scope and authority',
 ARRAY['Audit charter', 'Audit plans', 'Audit reports', 'Management responses'],
 ARRAY['Level 0: No internal audit', 'Level 1: Basic reviews', 'Level 2: Formal function', 'Level 3: Risk-based auditing', 'Level 4: Continuous auditing', 'Level 5: Integrated assurance'],
 'medium'),

-- Technology Requirements
('MICA-TECH-001', 'Cybersecurity Framework', 
 'Implement comprehensive cybersecurity measures to protect systems and data',
 'Technology', 'Cybersecurity', 'preventive',
 'Deploy multi-layered cybersecurity controls including access management, encryption, and monitoring',
 ARRAY['Security policy', 'Access controls', 'Encryption standards', 'Monitoring systems', 'Incident response'],
 ARRAY['Level 0: Basic security', 'Level 1: Standard controls', 'Level 2: Enhanced protection', 'Level 3: Advanced security', 'Level 4: Threat intelligence', 'Level 5: Adaptive security'],
 'critical'),

('MICA-TECH-002', 'Data Protection and Privacy', 
 'Ensure appropriate protection of personal and sensitive data',
 'Technology', 'Data Protection', 'preventive',
 'Implement data protection measures in compliance with privacy regulations',
 ARRAY['Data protection policy', 'Privacy controls', 'Consent management', 'Breach procedures'],
 ARRAY['Level 0: Basic protection', 'Level 1: Policy framework', 'Level 2: Technical controls', 'Level 3: Privacy by design', 'Level 4: Advanced protection', 'Level 5: Zero trust model'],
 'high'),

-- Financial Requirements
('MICA-FIN-001', 'Capital Requirements', 
 'Maintain adequate capital levels as required by regulation',
 'Financial', 'Capital Adequacy', 'preventive',
 'Calculate and maintain minimum capital requirements based on business activities and risks',
 ARRAY['Capital calculations', 'Financial statements', 'Regulatory reports', 'Stress testing'],
 ARRAY['Level 0: No capital planning', 'Level 1: Basic calculations', 'Level 2: Regular monitoring', 'Level 3: Stress testing', 'Level 4: Dynamic management', 'Level 5: Integrated planning'],
 'critical'),

('MICA-FIN-002', 'Liquidity Management', 
 'Maintain adequate liquidity to meet operational requirements',
 'Financial', 'Liquidity Management', 'preventive',
 'Implement liquidity management framework with appropriate buffers and contingency plans',
 ARRAY['Liquidity policy', 'Cash flow projections', 'Contingency plans', 'Monitoring reports'],
 ARRAY['Level 0: No liquidity management', 'Level 1: Basic monitoring', 'Level 2: Formal framework', 'Level 3: Stress testing', 'Level 4: Dynamic management', 'Level 5: Predictive analytics'],
 'high'),

-- Reporting Requirements
('MICA-REP-001', 'Regulatory Reporting', 
 'Submit required regulatory reports accurately and timely',
 'Reporting', 'Regulatory Compliance', 'preventive',
 'Establish processes to ensure accurate and timely submission of all required regulatory reports',
 ARRAY['Reporting procedures', 'Data quality controls', 'Submission records', 'Accuracy validations'],
 ARRAY['Level 0: Manual reporting', 'Level 1: Basic automation', 'Level 2: Quality controls', 'Level 3: Integrated systems', 'Level 4: Real-time reporting', 'Level 5: Predictive compliance'],
 'medium');

-- Update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_mica_requirements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_mica_requirements_updated_at
    BEFORE UPDATE ON mica_requirements
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_requirements_updated_at();

CREATE TRIGGER trigger_update_mica_assessments_updated_at
    BEFORE UPDATE ON mica_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_requirements_updated_at();

CREATE TRIGGER trigger_update_mica_assessment_results_updated_at
    BEFORE UPDATE ON mica_assessment_results
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_requirements_updated_at();

COMMIT;
