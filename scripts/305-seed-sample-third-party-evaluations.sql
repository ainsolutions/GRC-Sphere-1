-- Seed sample third party risk evaluations with realistic data

-- Insert sample evaluations for existing vendors
INSERT INTO third_party_risk_evaluations (
    vendor_id, evaluation_name, evaluation_type, evaluation_date, evaluator_name, evaluator_email,
    evaluation_status, overall_risk_score, overall_risk_level, inherent_risk_score, residual_risk_score,
    security_score, operational_score, financial_score, compliance_score, privacy_score, business_continuity_score,
    total_questions, answered_questions, high_risk_findings, medium_risk_findings, low_risk_findings,
    scope, methodology, executive_summary, key_findings, recommendations, next_review_date,
    created_by
) VALUES
-- CloudSecure Solutions Evaluation
(1, 'CloudSecure Solutions - Annual Risk Assessment 2024', 'Annual', '2024-01-15', 'Sarah Johnson', 'sarah.johnson@company.com',
 'Completed', 7.2, 'Medium', 8.5, 7.2, 8.0, 7.5, 6.8, 7.8, 8.2, 6.9,
 22, 22, 2, 5, 15,
 'Comprehensive assessment of cloud infrastructure services including data storage, processing, and security controls.',
 'Risk-based assessment following ISO 27001 and SOC 2 frameworks',
 'CloudSecure Solutions demonstrates strong security controls and compliance posture. Some areas for improvement identified in incident response and vendor management.',
 'Strong encryption and access controls; Good compliance certifications; Areas for improvement: incident response testing frequency, vendor management documentation',
 'Increase incident response testing to quarterly; Enhance vendor management documentation; Implement automated vulnerability scanning',
 '2025-01-15', 'Risk Assessment Team'),

-- DataFlow Analytics Evaluation  
(2, 'DataFlow Analytics - Initial Due Diligence', 'Initial', '2024-02-20', 'Michael Chen', 'michael.chen@company.com',
 'Completed', 8.1, 'High', 9.2, 8.1, 7.5, 8.0, 8.5, 8.8, 7.8, 8.2,
 22, 22, 3, 6, 13,
 'Initial risk assessment for data analytics and processing services engagement.',
 'Comprehensive due diligence assessment with focus on data privacy and security',
 'DataFlow Analytics shows strong technical capabilities but has some gaps in privacy controls and cross-border data transfer procedures.',
 'Strong financial position and technical capabilities; Good security infrastructure; Gaps in GDPR compliance and data subject rights procedures',
 'Implement GDPR compliance program; Establish data subject rights procedures; Enhance cross-border data transfer controls',
 '2024-08-20', 'Vendor Management Team'),

-- SecureComm Networks Evaluation
(3, 'SecureComm Networks - Targeted Security Assessment', 'Targeted', '2024-03-10', 'Lisa Rodriguez', 'lisa.rodriguez@company.com',
 'Completed', 6.5, 'Medium', 7.8, 6.5, 7.2, 6.8, 6.0, 7.5, 6.2, 6.1,
 22, 22, 1, 4, 17,
 'Focused assessment of telecommunications security controls and network infrastructure.',
 'Security-focused assessment with penetration testing and vulnerability analysis',
 'SecureComm Networks has adequate security controls for telecommunications services with room for improvement in business continuity planning.',
 'Adequate network security controls; Regular vulnerability assessments; Weaknesses in disaster recovery testing and geographic redundancy',
 'Enhance disaster recovery testing frequency; Implement geographic redundancy; Improve change management documentation',
 '2024-09-10', 'IT Security Team'),

-- GlobalPay Systems Evaluation
(4, 'GlobalPay Systems - Comprehensive Risk Assessment', 'Comprehensive', '2024-01-30', 'David Kim', 'david.kim@company.com',
 'Approved', 5.8, 'Medium', 7.2, 5.8, 6.5, 5.9, 5.2, 6.8, 6.1, 5.5,
 22, 22, 1, 3, 18,
 'Full risk assessment of payment processing services including PCI DSS compliance and financial controls.',
 'Comprehensive assessment following PCI DSS and SOC 2 Type II standards',
 'GlobalPay Systems demonstrates strong compliance with payment industry standards and maintains robust financial controls.',
 'Excellent PCI DSS compliance; Strong financial stability; Good fraud detection capabilities; Minor gaps in vendor management',
 'Enhance third-party vendor oversight; Implement additional fraud monitoring controls; Update business continuity documentation',
 '2025-01-30', 'Financial Risk Team'),

-- TechSupport Pro Evaluation
(5, 'TechSupport Pro - Annual Review 2024', 'Annual', '2024-02-15', 'Jennifer Walsh', 'jennifer.walsh@company.com',
 'Under Review', 7.8, 'Medium', 8.9, 7.8, 8.2, 7.5, 7.0, 8.5, 7.8, 7.2,
 22, 20, 2, 4, 14,
 'Annual review of IT support services including remote access capabilities and data handling procedures.',
 'Annual assessment with focus on remote access security and data protection',
 'TechSupport Pro maintains good security practices for IT support services with some areas requiring attention in access management.',
 'Strong technical capabilities; Good security awareness training; Areas for improvement: privileged access management, data retention policies',
 'Implement privileged access management solution; Update data retention and disposal procedures; Enhance monitoring of remote access sessions',
 '2025-02-15', 'IT Operations Team');

-- Insert sample responses for the first evaluation (CloudSecure Solutions)
INSERT INTO third_party_risk_responses (evaluation_id, question_id, response_value, response_score, risk_level, evidence_provided, assessor_notes) VALUES
(1, 1, 'Yes, certified (ISO 27001)', 9.0, 'Low', 'ISO 27001 certificate provided, valid until 2025', 'Current ISO 27001 certification verified'),
(1, 2, 'Role-based access control with regular reviews', 8.5, 'Low', 'Access control policy and quarterly review reports provided', 'Well-documented RBAC implementation'),
(1, 3, 'AES-256 for rest, TLS 1.3 for transit', 9.0, 'Low', 'Encryption standards documentation and configuration screenshots', 'Strong encryption standards implemented'),
(1, 4, 'Semi-annual assessments', 7.0, 'Medium', 'Last vulnerability assessment report from 6 months ago', 'Should increase frequency to quarterly'),
(1, 5, 'Yes, but not regularly tested', 6.5, 'Medium', 'Incident response plan document provided', 'Plan exists but testing frequency should be increased'),
(1, 6, 'Comprehensive data classification with handling procedures', 8.0, 'Low', 'Data classification policy and handling procedures', 'Good data classification framework'),
(1, 7, 'Documented policies with automated enforcement', 8.5, 'Low', 'Data retention policy and automated deletion logs', 'Automated retention management in place'),
(1, 8, 'Adequate safeguards with legal mechanisms', 8.0, 'Low', 'Standard contractual clauses and adequacy assessment', 'Proper cross-border transfer controls'),
(1, 9, 'Manual processes with documented procedures', 7.0, 'Medium', 'Data subject rights procedure document', 'Manual process could be improved with automation'),
(1, 10, 'Plan exists, periodic testing', 7.5, 'Medium', 'BCP document and last test results', 'Testing should be more frequent'),
(1, 11, 'Formal change management with approval workflows', 8.0, 'Low', 'Change management policy and workflow documentation', 'Good change management processes'),
(1, 12, 'Regular monitoring with manual intervention', 7.0, 'Medium', 'Monitoring dashboard screenshots and procedures', 'Could benefit from automated scaling'),
(1, 13, 'Basic vendor oversight', 6.0, 'Medium', 'Vendor list and basic assessment documentation', 'Vendor management program needs enhancement'),
(1, 14, 'Stable financial position', 7.5, 'Low', 'Financial statements and credit report', 'Financially stable organization'),
(1, 15, 'Comprehensive coverage including cyber liability', 8.0, 'Low', 'Insurance certificates including cyber liability', 'Adequate insurance coverage verified'),
(1, 16, 'Comprehensive SLAs with financial penalties', 8.5, 'Low', 'Service level agreement with penalty clauses', 'Strong SLA framework in place'),
(1, 17, 'Fully compliant with all relevant regulations', 8.5, 'Low', 'Compliance attestations and audit reports', 'Strong regulatory compliance posture'),
(1, 18, 'Multiple relevant certifications (SOC2, ISO27001, etc.)', 9.0, 'Low', 'SOC 2 Type II and ISO 27001 certificates', 'Excellent certification portfolio'),
(1, 19, 'Comprehensive legal protections and indemnification', 8.0, 'Low', 'Contract with indemnification clauses', 'Strong contractual protections'),
(1, 20, 'Automated backups with tested recovery procedures', 8.5, 'Low', 'Backup policy and recovery test results', 'Robust backup and recovery capabilities'),
(1, 21, 'Some geographic distribution', 7.0, 'Medium', 'Infrastructure diagram showing multiple regions', 'Could improve geographic redundancy'),
(1, 22, 'Basic communication procedures', 6.5, 'Medium', 'Crisis communication plan outline', 'Communication plan needs enhancement');

-- Insert sample gap analysis for CloudSecure Solutions
INSERT INTO third_party_gap_analysis (
    evaluation_id, vendor_id, question_id, gap_title, gap_description, gap_category,
    current_state, target_state, gap_severity, likelihood, impact, risk_score,
    business_impact, remediation_strategy, recommended_actions, responsible_party,
    target_completion_date, estimated_effort, estimated_cost, priority_ranking,
    remediation_status, created_by
) VALUES
(1, 1, 4, 'Vulnerability Assessment Frequency', 'Vendor conducts vulnerability assessments semi-annually instead of quarterly as per best practice', 'Security & Data Protection',
 'Semi-annual vulnerability assessments', 'Quarterly vulnerability assessments with automated scanning', 'Medium', 'Medium', 'Medium', 6.0,
 'Delayed identification of security vulnerabilities could lead to exploitation', 'Increase assessment frequency and implement automated scanning',
 'Implement quarterly vulnerability assessments; Deploy automated vulnerability scanning tools; Establish continuous monitoring',
 'CloudSecure Security Team', '2024-06-30', '2-3 months', 15000.00, 7, 'Planned', 'Risk Assessment Team'),

(1, 1, 5, 'Incident Response Testing', 'Incident response plan exists but is not regularly tested', 'Security & Data Protection',
 'Incident response plan without regular testing', 'Quarterly incident response testing with documented results', 'Medium', 'Medium', 'High', 7.5,
 'Untested incident response procedures may fail during actual incidents', 'Implement regular testing schedule with tabletop exercises',
 'Establish quarterly incident response testing; Conduct tabletop exercises; Document test results and improvements',
 'CloudSecure Operations Team', '2024-05-15', '1-2 months', 8000.00, 8, 'In Progress', 'Risk Assessment Team'),

(1, 1, 13, 'Vendor Management Enhancement', 'Basic vendor oversight lacks comprehensive risk assessment framework', 'Operational Risk',
 'Basic vendor list with limited assessment', 'Comprehensive vendor risk management program with regular assessments', 'Medium', 'Low', 'Medium', 5.0,
 'Inadequate vendor oversight creates cascading risks through supply chain', 'Develop comprehensive vendor management program',
 'Implement vendor risk assessment framework; Establish regular vendor reviews; Create vendor performance monitoring',
 'CloudSecure Procurement Team', '2024-08-31', '3-4 months', 25000.00, 6, 'Identified', 'Risk Assessment Team');

-- Insert sample remediation tracking
INSERT INTO third_party_risk_remediation_tracking (
    gap_analysis_id, evaluation_id, vendor_id, remediation_title, remediation_description,
    remediation_type, assigned_to, vendor_contact, start_date, target_completion_date,
    progress_percentage, status, estimated_cost, risk_before_remediation, risk_after_remediation,
    success_criteria, created_by
) VALUES
(2, 1, 1, 'Implement Quarterly Incident Response Testing', 'Establish regular incident response testing program with quarterly tabletop exercises and annual full-scale tests',
 'Process Improvement', 'Jennifer Walsh', 'CloudSecure Operations Manager', '2024-03-01', '2024-05-15',
 75, 'In Progress', 8000.00, 'Medium', 'Low',
 'Quarterly tests completed with documented results; Response time improvements measured; Team readiness validated',
 'Risk Assessment Team'),

(1, 1, 1, 'Increase Vulnerability Assessment Frequency', 'Transition from semi-annual to quarterly vulnerability assessments with automated scanning implementation',
 'Process Improvement', 'Michael Chen', 'CloudSecure Security Team Lead', '2024-04-01', '2024-06-30',
 25, 'Planned', 15000.00, 'Medium', 'Low',
 'Quarterly assessments scheduled and completed; Automated scanning tools deployed; Vulnerability remediation SLAs established',
 'Risk Assessment Team');

-- Insert sample evidence
INSERT INTO third_party_risk_evidence (
    evaluation_id, vendor_id, question_id, evidence_name, evidence_type, evidence_description,
    file_name, confidentiality_level, evidence_quality, source, collection_date, uploaded_by
) VALUES
(1, 1, 1, 'ISO 27001 Certificate', 'Certificate', 'Current ISO 27001 certification valid until December 2025',
 'cloudsecure_iso27001_cert.pdf', 'Internal', 'Excellent', 'Vendor', '2024-01-15', 'Sarah Johnson'),

(1, 1, 3, 'Encryption Standards Documentation', 'Document', 'Technical documentation detailing encryption implementation and key management',
 'cloudsecure_encryption_standards.pdf', 'Confidential', 'Good', 'Vendor', '2024-01-15', 'Sarah Johnson'),

(1, 1, 18, 'SOC 2 Type II Report', 'Report', 'Latest SOC 2 Type II audit report covering security and availability',
 'cloudsecure_soc2_report.pdf', 'Confidential', 'Excellent', 'Vendor', '2024-01-15', 'Sarah Johnson');

-- Update sequence values
SELECT setval('third_party_risk_evaluations_id_seq', (SELECT MAX(id) FROM third_party_risk_evaluations));
SELECT setval('third_party_gap_analysis_id_seq', (SELECT MAX(id) FROM third_party_gap_analysis));
SELECT setval('third_party_risk_remediation_tracking_id_seq', (SELECT MAX(id) FROM third_party_risk_remediation_tracking));
SELECT setval('third_party_risk_evidence_id_seq', (SELECT MAX(id) FROM third_party_risk_evidence));
