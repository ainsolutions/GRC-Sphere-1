-- Insert sample NESA UAE requirements if they don't exist
INSERT INTO nesa_uae_requirements (id, control_name, control_reference, control_description, priority, implementation_guidance)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'Information Security Policy', 'NESA-CC-1.1', 'Establish and maintain an information security policy that is approved by management, communicated to employees, and regularly reviewed and updated.', 'P1', 'Develop a comprehensive information security policy document that covers all aspects of information security management.'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Risk Assessment', 'NESA-CC-1.2', 'Conduct regular risk assessments to identify, analyze, and evaluate information security risks.', 'P1', 'Implement a formal risk assessment methodology and conduct assessments at least annually.'),
    ('550e8400-e29b-41d4-a716-446655440003', 'Access Control Policy', 'NESA-CC-2.1', 'Implement access control policies and procedures to ensure that access to information and information processing facilities is authorized and restricted.', 'P1', 'Define user access rights and implement role-based access control mechanisms.'),
    ('550e8400-e29b-41d4-a716-446655440004', 'Incident Response', 'NESA-CC-3.1', 'Establish and maintain an incident response capability to handle information security incidents effectively.', 'P2', 'Develop incident response procedures and establish an incident response team.'),
    ('550e8400-e29b-41d4-a716-446655440005', 'Business Continuity', 'NESA-CC-4.1', 'Develop and maintain business continuity plans to ensure the continuity of operations during disruptions.', 'P2', 'Create business continuity plans and conduct regular testing and updates.')
ON CONFLICT (id) DO NOTHING;

-- Insert sample gap analysis entries
INSERT INTO nesa_uae_gap_analysis (
    id,
    nesa_control_id,
    existing_control,
    control_owner,
    political_procedure_control,
    initial_control_maturity,
    gap_description,
    financial_action,
    target_control_maturity,
    action_owner,
    reviewer,
    status,
    notes,
    created_at,
    updated_at
) VALUES 
(
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'We have a basic information security policy document that was created 2 years ago. It covers general security principles but lacks specific implementation guidelines and has not been updated recently.',
    'IT Security Team',
    'Information Security Policy v1.0, Employee Handbook Section 5.2',
    'Repeatable',
    'Current policy lacks specific implementation guidelines, risk assessment procedures, and regular review cycles. No formal approval process from senior management documented.',
    'Budget allocation of $15,000 for policy review, legal consultation, and staff training on updated policies.',
    'Managed',
    'Sarah Johnson - CISO',
    'Michael Chen - CTO',
    'In Progress',
    'Policy review meeting scheduled for next week. Legal team consultation in progress.',
    '2024-01-15 10:00:00+00',
    '2024-01-20 14:30:00+00'
),
(
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440002',
    'Risk assessments are conducted informally by the IT team on an ad-hoc basis. No formal methodology or documentation process is in place.',
    'IT Operations Manager',
    'IT Risk Management Procedure v0.5 (draft)',
    'Ad Hoc',
    'Lack of formal risk assessment methodology, no regular assessment schedule, insufficient documentation of identified risks and mitigation strategies.',
    'Investment of $25,000 for risk management software, consultant fees, and staff training.',
    'Defined',
    'David Rodriguez - Risk Manager',
    'Sarah Johnson - CISO',
    'Not Started',
    'Waiting for budget approval. Risk management software evaluation in progress.',
    '2024-01-10 09:15:00+00',
    '2024-01-10 09:15:00+00'
),
(
    '660e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440003',
    'Basic access control is implemented through Active Directory with role-based permissions. However, access reviews are not conducted regularly and privileged access is not properly monitored.',
    'System Administrator',
    'Access Control Policy v2.1, Privileged Access Management Procedure',
    'Defined',
    'Irregular access reviews, lack of privileged access monitoring, no formal access certification process, and insufficient segregation of duties.',
    'Budget requirement of $40,000 for privileged access management solution and identity governance tools.',
    'Managed',
    'Lisa Wang - Identity Manager',
    'Michael Chen - CTO',
    'Under Review',
    'Access review process redesign completed. PAM solution procurement under evaluation.',
    '2024-01-05 16:45:00+00',
    '2024-01-25 11:20:00+00'
),
(
    '660e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440004',
    'Incident response is handled reactively by the IT support team. No formal incident response plan or dedicated team exists.',
    'IT Support Manager',
    'IT Support Escalation Procedure v1.3',
    'Ad Hoc',
    'No formal incident response plan, lack of dedicated incident response team, insufficient incident classification and escalation procedures, no post-incident review process.',
    'Estimated cost of $30,000 for incident response training, tools, and establishing dedicated team resources.',
    'Defined',
    'Alex Thompson - Security Analyst',
    'Sarah Johnson - CISO',
    'In Progress',
    'Incident response team formation in progress. Training schedule being developed.',
    '2024-01-12 13:30:00+00',
    '2024-01-22 10:15:00+00'
),
(
    '660e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440005',
    'Basic backup procedures are in place, but no comprehensive business continuity plan exists. Disaster recovery testing is not performed regularly.',
    'Operations Manager',
    'Backup and Recovery Procedure v1.8, Emergency Response Plan (outdated)',
    'Repeatable',
    'Lack of comprehensive business continuity plan, no regular disaster recovery testing, insufficient documentation of critical business processes and recovery procedures.',
    'Investment of $50,000 for business continuity planning consultant, backup infrastructure upgrade, and staff training.',
    'Managed',
    'Robert Kim - Operations Director',
    'Michael Chen - CTO',
    'Completed',
    'Business continuity plan completed and approved. First DR test scheduled for next month.',
    '2024-01-08 08:00:00+00',
    '2024-01-28 17:45:00+00'
);

-- Verify the data was inserted
SELECT 
    ga.id,
    nr.control_reference,
    nr.control_name,
    ga.initial_control_maturity,
    ga.target_control_maturity,
    ga.status,
    ga.control_owner
FROM nesa_uae_gap_analysis ga
JOIN nesa_uae_requirements nr ON ga.nesa_control_id = nr.id
ORDER BY nr.control_reference;
