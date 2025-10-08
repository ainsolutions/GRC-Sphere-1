-- Seed Sample Data for NESA UAE Self Assessment
-- This script creates sample self-assessment data for demonstration

-- Insert sample self-assessment
INSERT INTO nesa_uae_self_assessments (
    assessment_name,
    organization_id,
    assessment_scope,
    assessment_period_start,
    assessment_period_end,
    assessor_name,
    assessor_title,
    assessor_email,
    status,
    overall_maturity_score,
    compliance_percentage,
    total_controls,
    implemented_controls,
    partially_implemented_controls,
    not_implemented_controls,
    not_applicable_controls,
    high_priority_gaps,
    medium_priority_gaps,
    low_priority_gaps,
    executive_summary,
    key_findings,
    recommendations,
    next_assessment_date,
    created_by,
    updated_by
) VALUES (
    'Q1 2024 NESA UAE Compliance Assessment',
    1,
    'Comprehensive assessment of all NESA UAE cybersecurity controls across the organization including IT infrastructure, data protection, and operational security measures.',
    '2024-01-01',
    '2024-03-31',
    'Ahmed Al-Mansouri',
    'Chief Information Security Officer',
    'ahmed.almansouri@company.ae',
    'In Progress',
    2.3,
    65.5,
    85,
    35,
    25,
    20,
    5,
    8,
    12,
    5,
    'The organization demonstrates a moderate level of cybersecurity maturity with significant progress in governance and access control domains. Key areas requiring immediate attention include incident response capabilities and business continuity planning.',
    'Strong governance framework established; Access control mechanisms well-implemented; Incident response procedures need enhancement; Staff training programs require expansion; Third-party risk management needs improvement.',
    'Implement comprehensive incident response plan; Enhance staff cybersecurity awareness training; Establish formal business continuity procedures; Strengthen third-party vendor assessment processes; Deploy advanced threat detection capabilities.',
    '2024-07-01',
    'System',
    'System'
),
(
    'Annual NESA UAE Security Review 2023',
    1,
    'Annual comprehensive review of cybersecurity posture against NESA UAE requirements focusing on critical infrastructure protection and data security.',
    '2023-10-01',
    '2023-12-31',
    'Fatima Al-Zahra',
    'Security Compliance Manager',
    'fatima.alzahra@company.ae',
    'Completed',
    2.8,
    78.2,
    85,
    45,
    22,
    15,
    3,
    5,
    10,
    7,
    'The organization has achieved good cybersecurity maturity with strong performance in most control areas. Continuous improvement efforts have resulted in enhanced security posture compared to previous assessment.',
    'Excellent progress in asset management; Strong access control implementation; Good incident management procedures; Effective security awareness program; Well-established governance framework.',
    'Continue current security initiatives; Focus on advanced threat detection; Enhance business continuity testing; Strengthen supply chain security; Implement zero-trust architecture principles.',
    '2024-10-01',
    'System',
    'System'
);

-- Get the assessment IDs for sample control data
DO $$
DECLARE
    assessment_1_id INTEGER;
    assessment_2_id INTEGER;
BEGIN
    -- Get the first assessment ID
    SELECT id INTO assessment_1_id 
    FROM nesa_uae_self_assessments 
    WHERE assessment_name = 'Q1 2024 NESA UAE Compliance Assessment';
    
    -- Get the second assessment ID
    SELECT id INTO assessment_2_id 
    FROM nesa_uae_self_assessments 
    WHERE assessment_name = 'Annual NESA UAE Security Review 2023';
    
    -- Insert sample control assessments for the first assessment
    INSERT INTO nesa_uae_self_assessment_controls (
        assessment_id,
        requirement_id,
        control_id,
        control_name,
        domain,
        current_maturity_level,
        target_maturity_level,
        implementation_status,
        existing_controls,
        target_controls,
        action_owner,
        action_owner_email,
        target_completion_date,
        evidence_provided,
        gaps_identified,
        remediation_actions,
        business_justification,
        estimated_cost,
        estimated_effort_hours,
        priority,
        compliance_percentage,
        last_reviewed_date,
        next_review_date,
        reviewer_name,
        reviewer_comments,
        approval_status,
        created_by,
        updated_by
    ) VALUES 
    (
        assessment_1_id,
        1,
        'CG-01',
        'Cybersecurity Governance Framework',
        'Cybersecurity Governance',
        'intermediate',
        'advanced',
        'implemented',
        'Established cybersecurity governance committee with defined roles and responsibilities. Regular board reporting on cybersecurity matters.',
        'Enhance governance framework with advanced risk management integration and automated reporting capabilities.',
        'Ahmed Al-Mansouri',
        'ahmed.almansouri@company.ae',
        '2024-06-30',
        'Governance charter, meeting minutes, board reports, policy documents',
        'Limited integration with enterprise risk management; Manual reporting processes',
        'Integrate with ERM system; Implement automated dashboard reporting; Enhance KPI tracking',
        'Improved risk visibility and decision-making capabilities for executive leadership',
        25000.00,
        120,
        'medium',
        85,
        '2024-01-15',
        '2024-04-15',
        'Ahmed Al-Mansouri',
        'Good progress on governance framework. Need to focus on automation and integration.',
        'approved',
        'System',
        'System'
    ),
    (
        assessment_1_id,
        2,
        'AM-01',
        'Asset Inventory Management',
        'Asset Management',
        'basic',
        'intermediate',
        'partially-implemented',
        'Basic asset inventory maintained in spreadsheets. Some automated discovery tools deployed.',
        'Comprehensive automated asset management system with real-time discovery and classification.',
        'Sara Al-Hashimi',
        'sara.alhashimi@company.ae',
        '2024-05-31',
        'Asset inventory spreadsheets, discovery tool reports, asset tagging procedures',
        'Manual processes; Incomplete coverage; No real-time updates; Limited asset classification',
        'Deploy comprehensive ITAM solution; Implement automated discovery; Establish asset classification scheme',
        'Improved security posture through complete asset visibility and better risk management',
        45000.00,
        200,
        'high',
        45,
        '2024-01-10',
        '2024-04-10',
        'Sara Al-Hashimi',
        'Significant gaps in asset management. Priority implementation required.',
        'pending',
        'System',
        'System'
    ),
    (
        assessment_1_id,
        3,
        'HR-01',
        'Personnel Security Screening',
        'Human Resources Security',
        'intermediate',
        'advanced',
        'implemented',
        'Background checks conducted for all employees. Security awareness training provided annually.',
        'Enhanced screening procedures with continuous monitoring and role-based training programs.',
        'Omar Al-Rashid',
        'omar.alrashid@company.ae',
        '2024-08-31',
        'HR screening procedures, training records, background check reports',
        'Limited continuous monitoring; Generic training approach; No role-specific requirements',
        'Implement continuous monitoring; Develop role-based training; Enhance screening criteria',
        'Reduced insider threat risk and improved security culture across the organization',
        15000.00,
        80,
        'medium',
        75,
        '2024-01-20',
        '2024-04-20',
        'Omar Al-Rashid',
        'Good foundation in place. Enhancement opportunities identified.',
        'approved',
        'System',
        'System'
    ),
    (
        assessment_1_id,
        4,
        'PE-01',
        'Physical Access Controls',
        'Physical and Environmental Security',
        'advanced',
        'advanced',
        'implemented',
        'Multi-factor authentication for physical access. Biometric controls at critical areas. 24/7 monitoring.',
        'Maintain current advanced physical security measures with regular updates and testing.',
        'Khalid Al-Mansoori',
        'khalid.almansoori@company.ae',
        '2024-12-31',
        'Access control logs, biometric system reports, security camera footage, guard reports',
        'Minor gaps in visitor management; Some legacy systems need updates',
        'Upgrade visitor management system; Replace legacy access control panels',
        'Maintain high level of physical security while improving operational efficiency',
        8000.00,
        40,
        'low',
        92,
        '2024-01-25',
        '2024-04-25',
        'Khalid Al-Mansoori',
        'Excellent physical security implementation. Minor improvements needed.',
        'approved',
        'System',
        'System'
    ),
    (
        assessment_1_id,
        5,
        'CO-01',
        'Network Security Management',
        'Communications and Operations Management',
        'basic',
        'advanced',
        'partially-implemented',
        'Basic firewall rules and network segmentation. Some monitoring tools deployed.',
        'Advanced network security with micro-segmentation, AI-based threat detection, and comprehensive monitoring.',
        'Nadia Al-Zahra',
        'nadia.alzahra@company.ae',
        '2024-07-31',
        'Firewall configurations, network diagrams, monitoring tool reports',
        'Limited segmentation; Basic threat detection; Manual rule management; Insufficient monitoring coverage',
        'Implement micro-segmentation; Deploy AI-based threat detection; Automate rule management; Enhance monitoring',
        'Significantly improved network security posture and threat detection capabilities',
        75000.00,
        300,
        'high',
        35,
        '2024-01-12',
        '2024-04-12',
        'Nadia Al-Zahra',
        'Major network security improvements required. High priority for implementation.',
        'pending',
        'System',
        'System'
    );

    -- Insert sample audit log entries
    INSERT INTO nesa_uae_self_assessment_audit_log (
        assessment_id,
        control_id,
        action_type,
        field_changed,
        old_value,
        new_value,
        changed_by,
        change_reason,
        timestamp
    ) VALUES 
    (
        assessment_1_id,
        'CG-01',
        'UPDATE',
        'Implementation Status',
        'partially-implemented',
        'implemented',
        'Ahmed Al-Mansouri',
        'Governance framework implementation completed',
        '2024-01-15 10:30:00'
    ),
    (
        assessment_1_id,
        'CG-01',
        'UPDATE',
        'Compliance Percentage',
        '70',
        '85',
        'Ahmed Al-Mansouri',
        'Updated compliance percentage based on completed implementation',
        '2024-01-15 10:35:00'
    ),
    (
        assessment_1_id,
        'AM-01',
        'UPDATE',
        'Action Owner',
        'TBD',
        'Sara Al-Hashimi',
        'Ahmed Al-Mansouri',
        'Assigned asset management lead as action owner',
        '2024-01-10 14:20:00'
    ),
    (
        assessment_1_id,
        'AM-01',
        'UPDATE',
        'Priority',
        'medium',
        'high',
        'Ahmed Al-Mansouri',
        'Elevated priority due to significant security gaps',
        '2024-01-10 14:25:00'
    ),
    (
        assessment_1_id,
        'SYSTEM',
        'INITIALIZE',
        'Controls Initialization',
        '0',
        '85',
        'System',
        'Initial control setup from NESA UAE requirements',
        '2024-01-01 09:00:00'
    );

END $$;

-- Update assessment statistics based on sample data
UPDATE nesa_uae_self_assessments 
SET 
    total_controls = (
        SELECT COUNT(*) 
        FROM nesa_uae_self_assessment_controls 
        WHERE assessment_id = nesa_uae_self_assessments.id
    ),
    implemented_controls = (
        SELECT COUNT(*) 
        FROM nesa_uae_self_assessment_controls 
        WHERE assessment_id = nesa_uae_self_assessments.id 
        AND implementation_status = 'implemented'
    ),
    partially_implemented_controls = (
        SELECT COUNT(*) 
        FROM nesa_uae_self_assessment_controls 
        WHERE assessment_id = nesa_uae_self_assessments.id 
        AND implementation_status = 'partially-implemented'
    ),
    not_implemented_controls = (
        SELECT COUNT(*) 
        FROM nesa_uae_self_assessment_controls 
        WHERE assessment_id = nesa_uae_self_assessments.id 
        AND implementation_status = 'not-implemented'
    ),
    high_priority_gaps = (
        SELECT COUNT(*) 
        FROM nesa_uae_self_assessment_controls 
        WHERE assessment_id = nesa_uae_self_assessments.id 
        AND priority = 'high' 
        AND implementation_status != 'implemented'
    ),
    medium_priority_gaps = (
        SELECT COUNT(*) 
        FROM nesa_uae_self_assessment_controls 
        WHERE assessment_id = nesa_uae_self_assessments.id 
        AND priority = 'medium' 
        AND implementation_status != 'implemented'
    ),
    low_priority_gaps = (
        SELECT COUNT(*) 
        FROM nesa_uae_self_assessment_controls 
        WHERE assessment_id = nesa_uae_self_assessments.id 
        AND priority = 'low' 
        AND implementation_status != 'implemented'
    ),
    compliance_percentage = (
        SELECT COALESCE(AVG(compliance_percentage), 0)
        FROM nesa_uae_self_assessment_controls 
        WHERE assessment_id = nesa_uae_self_assessments.id
    ),
    overall_maturity_score = (
        SELECT COALESCE(AVG(CASE 
            WHEN current_maturity_level = 'advanced' THEN 4
            WHEN current_maturity_level = 'intermediate' THEN 3
            WHEN current_maturity_level = 'basic' THEN 2
            WHEN current_maturity_level = 'not-implemented' THEN 1
            ELSE 0
        END), 0)
        FROM nesa_uae_self_assessment_controls 
        WHERE assessment_id = nesa_uae_self_assessments.id
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE assessment_name IN ('Q1 2024 NESA UAE Compliance Assessment', 'Annual NESA UAE Security Review 2023');
