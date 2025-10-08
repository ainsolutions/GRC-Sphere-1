-- Seed threat assessments data
INSERT INTO threat_assessments (
    id,
    name,
    description,
    methodology,
    scope,
    status,
    priority,
    risk_score,
    risk_level,
    assigned_to,
    due_date,
    created_by,
    mitigation_strategies,
    recommendations,
    review_notes
) VALUES 
(
    gen_random_uuid(),
    'Q1 2024 Cybersecurity Threat Assessment',
    'Comprehensive assessment of cybersecurity threats for the first quarter of 2024, focusing on external and internal threat vectors.',
    'NIST',
    'All IT systems, networks, and data repositories within the organization',
    'in-progress',
    'high',
    15.5,
    'High',
    'Security Team',
    '2024-03-15',
    'admin',
    'Implement multi-factor authentication, enhance network monitoring, conduct regular security awareness training, and establish incident response procedures.',
    'Prioritize patching critical vulnerabilities, implement zero-trust architecture, and enhance endpoint detection and response capabilities.',
    'Assessment requires coordination with IT operations team for system access and testing.'
),
(
    gen_random_uuid(),
    'Physical Security Assessment 2024',
    'Evaluation of physical security threats to corporate facilities and data centers.',
    'ISO 27001',
    'Main office building, data center, and remote office locations',
    'completed',
    'medium',
    8.2,
    'Medium',
    'Facilities Team',
    '2024-02-28',
    'admin',
    'Upgrade access control systems, install additional surveillance cameras, implement visitor management system, and conduct security guard training.',
    'Install biometric access controls for sensitive areas, implement 24/7 monitoring, and establish physical security incident response procedures.',
    'Assessment completed successfully with all recommendations documented and prioritized.'
),
(
    gen_random_uuid(),
    'Supply Chain Risk Assessment',
    'Assessment of risks associated with third-party vendors and supply chain partners.',
    'COSO',
    'All critical vendors, suppliers, and third-party service providers',
    'under-review',
    'critical',
    18.7,
    'Critical',
    'Risk Management Team',
    '2024-03-30',
    'admin',
    'Implement vendor risk assessment program, establish contractual security requirements, conduct regular vendor audits, and develop contingency plans for critical suppliers.',
    'Create vendor risk scoring matrix, implement continuous monitoring of vendor security posture, and establish clear incident notification requirements.',
    'Requires legal review of vendor contracts and coordination with procurement team.'
),
(
    gen_random_uuid(),
    'Insider Threat Assessment',
    'Evaluation of potential threats from internal personnel and privileged users.',
    'NIST',
    'All employees, contractors, and privileged users with system access',
    'draft',
    'high',
    12.3,
    'Medium',
    'HR Security Team',
    '2024-04-15',
    'admin',
    'Implement user behavior analytics, enhance background check procedures, establish clear data access policies, and conduct regular access reviews.',
    'Deploy insider threat detection tools, implement data loss prevention solutions, and establish anonymous reporting mechanisms.',
    'Assessment planning phase - requires coordination with HR and legal departments.'
);

-- Seed threat assessment threats relationships
-- Get assessment and threat IDs for relationships
DO $$
DECLARE
    assessment_1 UUID;
    assessment_2 UUID;
    assessment_3 UUID;
    assessment_4 UUID;
    threat_malware UUID;
    threat_phishing UUID;
    threat_breach UUID;
    threat_insider UUID;
    threat_physical UUID;
    threat_supply UUID;
BEGIN
    -- Get assessment IDs
    SELECT id INTO assessment_1 FROM threat_assessments WHERE name = 'Q1 2024 Cybersecurity Threat Assessment';
    SELECT id INTO assessment_2 FROM threat_assessments WHERE name = 'Physical Security Assessment 2024';
    SELECT id INTO assessment_3 FROM threat_assessments WHERE name = 'Supply Chain Risk Assessment';
    SELECT id INTO assessment_4 FROM threat_assessments WHERE name = 'Insider Threat Assessment';
    
    -- Get threat IDs
    SELECT id INTO threat_malware FROM threats WHERE name = 'Malware Attack';
    SELECT id INTO threat_phishing FROM threats WHERE name = 'Phishing';
    SELECT id INTO threat_breach FROM threats WHERE name = 'Data Breach';
    SELECT id INTO threat_insider FROM threats WHERE name = 'Insider Threat';
    SELECT id INTO threat_physical FROM threats WHERE name = 'Physical Security Breach';
    SELECT id INTO threat_supply FROM threats WHERE name = 'Supply Chain Attack';
    
    -- Insert threat assessment relationships for Q1 2024 Cybersecurity Assessment
    IF assessment_1 IS NOT NULL THEN
        INSERT INTO threat_assessment_threats (assessment_id, threat_id, likelihood, impact, risk_score, risk_level, mitigation_notes) VALUES
        (assessment_1, threat_malware, 4, 4, 16, 'High', 'Deploy advanced endpoint protection and conduct regular malware scans'),
        (assessment_1, threat_phishing, 5, 3, 15, 'High', 'Implement email security gateway and conduct phishing awareness training'),
        (assessment_1, threat_breach, 3, 5, 15, 'High', 'Enhance data encryption and implement data loss prevention controls');
    END IF;
    
    -- Insert threat assessment relationships for Physical Security Assessment
    IF assessment_2 IS NOT NULL THEN
        INSERT INTO threat_assessment_threats (assessment_id, threat_id, likelihood, impact, risk_score, risk_level, mitigation_notes) VALUES
        (assessment_2, threat_physical, 2, 4, 8, 'Medium', 'Upgrade access control systems and enhance surveillance coverage'),
        (assessment_2, threat_insider, 2, 3, 6, 'Low', 'Implement visitor management system and conduct background checks');
    END IF;
    
    -- Insert threat assessment relationships for Supply Chain Assessment
    IF assessment_3 IS NOT NULL THEN
        INSERT INTO threat_assessment_threats (assessment_id, threat_id, likelihood, impact, risk_score, risk_level, mitigation_notes) VALUES
        (assessment_3, threat_supply, 4, 5, 20, 'Critical', 'Implement vendor risk assessment program and establish security requirements'),
        (assessment_3, threat_breach, 3, 4, 12, 'Medium', 'Require vendor security certifications and conduct regular audits'),
        (assessment_3, threat_malware, 3, 3, 9, 'Medium', 'Establish secure communication channels with vendors');
    END IF;
    
    -- Insert threat assessment relationships for Insider Threat Assessment
    IF assessment_4 IS NOT NULL THEN
        INSERT INTO threat_assessment_threats (assessment_id, threat_id, likelihood, impact, risk_score, risk_level, mitigation_notes) VALUES
        (assessment_4, threat_insider, 3, 4, 12, 'Medium', 'Deploy user behavior analytics and implement privileged access management'),
        (assessment_4, threat_breach, 2, 5, 10, 'Medium', 'Enhance data access controls and implement data classification');
    END IF;
END $$;
