-- Insert sample gap analysis entries for NESA UAE controls
-- Note: This assumes some NESA UAE controls already exist in the nesa_uae_controls table

-- Sample gap analysis for Information Security Strategy and Planning
INSERT INTO nesa_uae_gap_analysis (
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
    notes
) VALUES 
(
    (SELECT id FROM nesa_uae_controls WHERE control_reference = 'H1.1' LIMIT 1),
    'We have a basic cybersecurity policy document that outlines general security principles and responsibilities. However, it lacks specific implementation guidelines and measurable objectives.',
    'IT Security Team',
    'Cybersecurity Policy v2.1, Information Security Procedure Manual',
    'Repeatable',
    'Current policy is too high-level and lacks specific implementation guidance. Missing risk-based approach and regular review cycles. No clear metrics for measuring effectiveness.',
    'Budget allocation of $50,000 required for external consultant to develop comprehensive security strategy framework and staff training.',
    'Defined',
    'CISO',
    'IT Director',
    'In Progress',
    'Policy review scheduled for Q2 2024. External consultant engaged for strategy development.'
),
(
    (SELECT id FROM nesa_uae_controls WHERE control_reference = 'H1.1.1' LIMIT 1),
    'Leadership awareness exists but formal cybersecurity governance structure is not fully established. Board receives quarterly security updates.',
    'Executive Team',
    'Board Charter Amendment, Executive Security Committee Terms of Reference',
    'Ad Hoc',
    'No formal cybersecurity governance committee. Security reporting to board is irregular. Lack of clear accountability and decision-making authority for cybersecurity matters.',
    'No additional budget required. Organizational restructuring and policy updates needed.',
    'Managed',
    'CEO',
    'Board of Directors',
    'Not Started',
    'Proposal for cybersecurity governance committee to be presented to board in next meeting.'
),
(
    (SELECT id FROM nesa_uae_controls WHERE control_reference = 'H1.1.2' LIMIT 1),
    'Senior management demonstrates commitment through budget allocation and policy endorsement. However, communication of security importance to all staff levels needs improvement.',
    'Senior Management',
    'Management Communication Policy, Security Awareness Program Charter',
    'Repeatable',
    'Security communication is inconsistent across departments. Middle management lacks clear security responsibilities. No formal security culture assessment conducted.',
    'Investment of $25,000 needed for leadership security training program and communication tools.',
    'Defined',
    'Chief Operating Officer',
    'CISO',
    'Under Review',
    'Management security training program being developed. Communication strategy under review.'
),
(
    (SELECT id FROM nesa_uae_controls WHERE control_reference = 'H2.1' LIMIT 1),
    'Basic asset inventory exists in spreadsheet format. IT assets are tracked but not comprehensively classified by criticality or sensitivity.',
    'IT Operations Team',
    'Asset Management Procedure, IT Asset Register Policy',
    'Repeatable',
    'Asset inventory is manual and not real-time. Missing classification of assets by business criticality and data sensitivity. No automated discovery tools implemented.',
    'Budget requirement of $75,000 for asset management system implementation and staff training.',
    'Managed',
    'IT Asset Manager',
    'IT Security Manager',
    'In Progress',
    'Asset management system procurement in progress. Expected implementation by Q3 2024.'
),
(
    (SELECT id FROM nesa_uae_controls WHERE control_reference = 'H3.1' LIMIT 1),
    'Access control policies exist but enforcement is inconsistent. Role-based access control partially implemented for critical systems.',
    'Identity and Access Management Team',
    'Access Control Policy v3.2, User Access Management Procedure',
    'Repeatable',
    'Access reviews are not conducted regularly. Privileged access management needs strengthening. No automated provisioning/deprovisioning process.',
    'Investment of $100,000 required for identity management system upgrade and process automation.',
    'Managed',
    'IAM Manager',
    'IT Security Manager',
    'In Progress',
    'IAM system upgrade project initiated. Access review process being redesigned.'
),
(
    (SELECT id FROM nesa_uae_controls WHERE control_reference = 'H4.1' LIMIT 1),
    'Data classification scheme exists but not consistently applied across all data types. Some sensitive data handling procedures in place.',
    'Data Protection Officer',
    'Data Classification Policy, Data Handling Procedures Manual',
    'Repeatable',
    'Data classification is not automated. Staff awareness of data handling requirements is limited. No data loss prevention tools implemented.',
    'Budget allocation of $60,000 needed for data classification tools and staff training program.',
    'Defined',
    'Data Protection Officer',
    'Chief Information Officer',
    'Not Started',
    'Data classification project planned for Q4 2024. Awaiting budget approval.'
),
(
    (SELECT id FROM nesa_uae_controls WHERE control_reference = 'H5.1' LIMIT 1),
    'Basic network security controls in place including firewalls and intrusion detection. Network segmentation partially implemented.',
    'Network Security Team',
    'Network Security Policy, Firewall Management Procedure',
    'Repeatable',
    'Network monitoring is reactive rather than proactive. Missing advanced threat detection capabilities. Network segmentation needs enhancement.',
    'Investment of $120,000 required for advanced network security tools and monitoring system upgrade.',
    'Managed',
    'Network Security Manager',
    'IT Security Manager',
    'Under Review',
    'Network security assessment completed. Upgrade proposal under management review.'
),
(
    (SELECT id FROM nesa_uae_controls WHERE control_reference = 'H6.1' LIMIT 1),
    'Incident response plan exists but has not been tested comprehensively. Basic incident handling procedures documented.',
    'Security Operations Center',
    'Incident Response Plan v2.0, Security Incident Handling Procedure',
    'Repeatable',
    'Incident response plan lacks detailed playbooks for different incident types. No regular testing or simulation exercises conducted. Communication procedures need improvement.',
    'Budget of $40,000 needed for incident response training, tabletop exercises, and plan enhancement.',
    'Defined',
    'SOC Manager',
    'IT Security Manager',
    'In Progress',
    'Incident response testing scheduled for next quarter. Plan updates in progress.'
),
(
    (SELECT id FROM nesa_uae_controls WHERE control_reference = 'H7.1' LIMIT 1),
    'Security awareness training provided annually to all staff. Basic phishing simulation conducted quarterly.',
    'Human Resources',
    'Security Awareness Training Policy, Employee Security Guidelines',
    'Repeatable',
    'Training content is generic and not role-specific. No measurement of training effectiveness. Limited reinforcement of security concepts throughout the year.',
    'Investment of $35,000 required for enhanced training platform and customized content development.',
    'Defined',
    'HR Training Manager',
    'CISO',
    'Completed',
    'New security awareness platform implemented. Role-based training modules deployed successfully.'
),
(
    (SELECT id FROM nesa_uae_controls WHERE control_reference = 'H8.1' LIMIT 1),
    'Third-party risk assessment process exists but not consistently applied. Basic vendor security questionnaires used.',
    'Procurement Team',
    'Third Party Risk Management Policy, Vendor Security Assessment Procedure',
    'Ad Hoc',
    'Risk assessment process is manual and time-consuming. No continuous monitoring of third-party security posture. Contract security requirements need standardization.',
    'Budget requirement of $80,000 for third-party risk management platform and process improvement.',
    'Defined',
    'Procurement Manager',
    'Risk Manager',
    'Not Started',
    'Third-party risk management project proposal being prepared for management approval.'
);

-- Insert additional sample entries for sub-controls
INSERT INTO nesa_uae_gap_analysis (
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
    notes
) VALUES 
(
    (SELECT id FROM nesa_uae_controls WHERE control_reference LIKE 'H1.1.%' AND sub_control_reference IS NOT NULL LIMIT 1),
    'Entity context is documented in business continuity plan but cybersecurity context analysis is limited.',
    'Business Continuity Manager',
    'Business Continuity Plan, Risk Management Framework',
    'Repeatable',
    'Cybersecurity context not formally integrated with business context. Limited understanding of external cybersecurity landscape and its impact on business operations.',
    'Consultant engagement of $30,000 for comprehensive context analysis and framework development.',
    'Defined',
    'Risk Manager',
    'Chief Risk Officer',
    'In Progress',
    'Context analysis workshop scheduled with external consultant.'
),
(
    (SELECT id FROM nesa_uae_controls WHERE control_reference LIKE 'H2.%' AND sub_control_reference IS NOT NULL LIMIT 1),
    'Asset ownership is defined for IT assets but not consistently documented for information assets.',
    'IT Asset Manager',
    'Asset Ownership Matrix, Information Asset Register',
    'Repeatable',
    'Information asset ownership is unclear in many cases. No formal process for assigning and updating asset ownership. Accountability for asset protection needs improvement.',
    'Process improvement initiative requiring $15,000 for documentation and training.',
    'Defined',
    'Information Security Officer',
    'IT Director',
    'Under Review',
    'Asset ownership review project initiated. Documentation updates in progress.'
);

-- Update statistics after inserting sample data
-- This helps with immediate testing and demonstration
UPDATE nesa_uae_gap_analysis 
SET updated_at = NOW() - (RANDOM() * INTERVAL '30 days')
WHERE created_at < NOW() - INTERVAL '1 day';
