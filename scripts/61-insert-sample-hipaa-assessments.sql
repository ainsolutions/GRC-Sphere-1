-- Insert Sample HIPAA Assessments and Results for Testing
-- This script creates realistic assessment scenarios with varied compliance levels

-- Insert Sample HIPAA Assessments
INSERT INTO hipaa_assessments (title, description, status, compliance_score, created_at, updated_at) VALUES
('Q1 2024 HIPAA Security Rule Assessment', 'Comprehensive assessment of HIPAA Security Rule compliance focusing on administrative, physical, and technical safeguards', 'Completed', 87.5, '2024-01-15 09:00:00', '2024-01-30 16:30:00'),
('Privacy Rule Compliance Review', 'Annual review of Privacy Rule implementation and individual rights procedures', 'In Progress', 72.3, '2024-02-01 10:00:00', '2024-02-15 14:20:00'),
('Business Associate Agreement Review', 'Assessment of business associate contracts and third-party risk management', 'Planned', NULL, '2024-03-01 08:00:00', '2024-03-01 08:00:00'),
('Annual HIPAA Compliance Audit', 'Comprehensive annual audit covering all HIPAA requirements and organizational policies', 'Planned', NULL, '2024-04-01 09:00:00', '2024-04-01 09:00:00'),
('Breach Response Procedures Assessment', 'Evaluation of breach notification procedures and incident response capabilities', 'Completed', 91.2, '2024-01-05 11:00:00', '2024-01-20 15:45:00');

-- Get assessment IDs for inserting results
-- We'll use the assessment IDs that were just created

-- Insert Assessment Results for Q1 2024 Security Rule Assessment (ID 1)
INSERT INTO hipaa_assessment_results (assessment_id, requirement_id, compliance_status, evidence, gaps_identified, remediation_notes, risk_level, responsible_party, next_review_date, created_at, updated_at) VALUES
-- Administrative Safeguards Results
(1, '164.308(a)(1)(i)', 'Compliant', 'Security Officer designated: John Smith, CISO. Documented responsibilities and authority matrix in place.', '', 'Continue quarterly security officer training and annual role review.', 'Low', 'John Smith', '2024-04-15', '2024-01-15 10:00:00', '2024-01-15 10:00:00'),
(1, '164.308(a)(1)(ii)(A)', 'Compliant', 'Security Management Process documented in Security Policy v2.1. Incident response procedures tested quarterly.', '', 'Update security policy annually and conduct tabletop exercises.', 'Low', 'Security Team', '2024-07-15', '2024-01-15 10:05:00', '2024-01-15 10:05:00'),
(1, '164.308(a)(2)', 'Partially Compliant', 'Workforce training program exists but completion rate is 78%. Some contractors lack HIPAA training.', 'Training completion gaps for 22% of workforce, contractor training program incomplete', 'Implement mandatory training completion tracking and contractor-specific HIPAA training program.', 'Medium', 'HR Department', '2024-03-15', '2024-01-15 10:10:00', '2024-01-15 10:10:00'),
(1, '164.308(a)(3)(i)', 'Compliant', 'Access management policies implemented through Active Directory with role-based access controls.', '', 'Annual access review scheduled for Q2 2024.', 'Low', 'IT Security', '2024-06-15', '2024-01-15 10:15:00', '2024-01-15 10:15:00'),
(1, '164.308(a)(4)(i)', 'Partially Compliant', 'Security awareness program exists but lacks phishing simulation and regular updates.', 'Phishing awareness training not implemented, security updates not regularly communicated', 'Implement monthly phishing simulations and quarterly security awareness communications.', 'Medium', 'Security Team', '2024-02-15', '2024-01-15 10:20:00', '2024-01-15 10:20:00'),
(1, '164.308(a)(5)(i)', 'Compliant', 'Security incident procedures documented and tested. 24/7 incident response capability established.', '', 'Continue quarterly incident response drills and annual procedure updates.', 'Low', 'Incident Response Team', '2024-04-15', '2024-01-15 10:25:00', '2024-01-15 10:25:00'),
(1, '164.308(a)(6)(i)', 'Compliant', 'Business continuity plan includes ePHI protection measures. Disaster recovery tested annually.', '', 'Schedule Q3 2024 disaster recovery test and plan update.', 'Low', 'IT Operations', '2024-09-15', '2024-01-15 10:30:00', '2024-01-15 10:30:00'),
(1, '164.308(a)(7)(i)', 'Non-Compliant', 'Risk assessment conducted in 2022 but not updated annually as required.', 'Risk assessment outdated, no formal vulnerability assessment process', 'Conduct comprehensive risk assessment and implement annual review process.', 'High', 'Risk Management', '2024-02-01', '2024-01-15 10:35:00', '2024-01-15 10:35:00'),
(1, '164.308(a)(8)', 'Compliant', 'Business associate agreements reviewed and updated. BAA template compliant with current regulations.', '', 'Annual BAA review scheduled for Q4 2024.', 'Low', 'Legal Department', '2024-10-15', '2024-01-15 10:40:00', '2024-01-15 10:40:00'),

-- Physical Safeguards Results
(1, '164.310(a)(1)', 'Compliant', 'Facility access controls implemented with badge readers and security cameras. Access logs maintained.', '', 'Upgrade access control system planned for Q3 2024.', 'Low', 'Facilities Management', '2024-07-15', '2024-01-15 11:00:00', '2024-01-15 11:00:00'),
(1, '164.310(b)', 'Partially Compliant', 'Workstation use policies exist but not consistently enforced. Some workstations lack automatic screen locks.', 'Inconsistent workstation security configuration, policy enforcement gaps', 'Implement centralized workstation management and automated policy enforcement.', 'Medium', 'IT Support', '2024-03-01', '2024-01-15 11:05:00', '2024-01-15 11:05:00'),
(1, '164.310(c)', 'Compliant', 'Physical workstation security measures implemented including cable locks and restricted access areas.', '', 'Continue quarterly physical security assessments.', 'Low', 'Security Team', '2024-04-15', '2024-01-15 11:10:00', '2024-01-15 11:10:00'),
(1, '164.310(d)(1)', 'Compliant', 'Device and media control procedures documented and implemented. Asset tracking system in place.', '', 'Upgrade asset tracking system planned for Q2 2024.', 'Low', 'IT Asset Management', '2024-06-15', '2024-01-15 11:15:00', '2024-01-15 11:15:00'),

-- Technical Safeguards Results
(1, '164.312(a)(1)', 'Compliant', 'Technical access controls implemented through identity management system with multi-factor authentication.', '', 'Evaluate advanced authentication methods for Q4 2024.', 'Low', 'IT Security', '2024-10-15', '2024-01-15 12:00:00', '2024-01-15 12:00:00'),
(1, '164.312(b)', 'Compliant', 'Audit controls implemented with SIEM system monitoring all ePHI access and system activities.', '', 'SIEM system upgrade scheduled for Q3 2024.', 'Low', 'Security Operations', '2024-07-15', '2024-01-15 12:05:00', '2024-01-15 12:05:00'),
(1, '164.312(c)(1)', 'Compliant', 'Data integrity controls implemented including checksums and digital signatures for critical ePHI.', '', 'Continue monthly integrity verification processes.', 'Low', 'Data Management', '2024-04-15', '2024-01-15 12:10:00', '2024-01-15 12:10:00'),
(1, '164.312(d)', 'Compliant', 'Person/entity authentication implemented through multi-factor authentication for all ePHI access.', '', 'Evaluate biometric authentication options for high-risk access.', 'Low', 'IT Security', '2024-08-15', '2024-01-15 12:15:00', '2024-01-15 12:15:00'),
(1, '164.312(e)(1)', 'Partially Compliant', 'Transmission security implemented for most systems but some legacy applications lack encryption.', 'Legacy system encryption gaps, incomplete transmission security coverage', 'Upgrade legacy applications and implement comprehensive transmission encryption.', 'High', 'IT Architecture', '2024-03-01', '2024-01-15 12:20:00', '2024-01-15 12:20:00');

-- Insert Assessment Results for Privacy Rule Compliance Review (ID 2)
INSERT INTO hipaa_assessment_results (assessment_id, requirement_id, compliance_status, evidence, gaps_identified, remediation_notes, risk_level, responsible_party, next_review_date, created_at, updated_at) VALUES
-- Privacy Rule Results
(2, '164.502(a)', 'Compliant', 'Use and disclosure policies documented and implemented. Staff training completed on permitted uses.', '', 'Annual policy review scheduled for Q4 2024.', 'Low', 'Privacy Officer', '2024-10-01', '2024-02-01 10:00:00', '2024-02-01 10:00:00'),
(2, '164.502(b)', 'Partially Compliant', 'Minimum necessary policies exist but implementation inconsistent across departments.', 'Inconsistent minimum necessary implementation, lack of department-specific procedures', 'Develop department-specific minimum necessary procedures and training.', 'Medium', 'Privacy Officer', '2024-04-01', '2024-02-01 10:05:00', '2024-02-01 10:05:00'),
(2, '164.502(e)', 'Non-Compliant', 'Some business associate agreements outdated and missing required provisions.', 'Outdated BAAs, missing breach notification provisions, inadequate safeguard requirements', 'Update all BAAs to current standards and implement BAA management system.', 'High', 'Legal Department', '2024-03-01', '2024-02-01 10:10:00', '2024-02-01 10:10:00'),
(2, '164.520', 'Compliant', 'Notice of Privacy Practices updated and distributed. Patient acknowledgment process implemented.', '', 'Review NPP for regulatory updates in Q3 2024.', 'Low', 'Privacy Officer', '2024-07-01', '2024-02-01 10:15:00', '2024-02-01 10:15:00'),
(2, '164.524', 'Partially Compliant', 'Individual access procedures exist but response times exceed regulatory requirements.', 'Delayed response to access requests, incomplete request tracking system', 'Implement automated request tracking and improve response time procedures.', 'Medium', 'Health Information Management', '2024-03-15', '2024-02-01 10:20:00', '2024-02-01 10:20:00'),
(2, '164.526', 'Compliant', 'Amendment procedures documented and implemented. Amendment tracking system in place.', '', 'Continue quarterly amendment process review.', 'Low', 'Health Information Management', '2024-05-01', '2024-02-01 10:25:00', '2024-02-01 10:25:00'),
(2, '164.528', 'Non-Compliant', 'Accounting of disclosures process incomplete and lacks required documentation.', 'Incomplete disclosure tracking, missing required disclosure categories, inadequate documentation', 'Implement comprehensive disclosure tracking system and staff training.', 'High', 'Privacy Officer', '2024-02-15', '2024-02-01 10:30:00', '2024-02-01 10:30:00'),
(2, '164.530', 'Compliant', 'Privacy Officer designated with appropriate authority and resources. Privacy policies current.', '', 'Annual privacy officer training scheduled for Q2 2024.', 'Low', 'Privacy Officer', '2024-06-01', '2024-02-01 10:35:00', '2024-02-01 10:35:00');

-- Insert Assessment Results for Breach Response Procedures Assessment (ID 5)
INSERT INTO hipaa_assessment_results (assessment_id, requirement_id, compliance_status, evidence, gaps_identified, remediation_notes, risk_level, responsible_party, next_review_date, created_at, updated_at) VALUES
-- Breach Notification Results
(5, '164.402', 'Compliant', 'Breach definition and risk assessment procedures clearly documented and understood by incident response team.', '', 'Annual breach definition training scheduled for all staff.', 'Low', 'Privacy Officer', '2024-07-01', '2024-01-05 11:00:00', '2024-01-05 11:00:00'),
(5, '164.404', 'Compliant', 'Individual notification procedures documented with template letters and communication protocols.', '', 'Update notification templates based on regulatory guidance.', 'Low', 'Privacy Officer', '2024-04-01', '2024-01-05 11:05:00', '2024-01-05 11:05:00'),
(5, '164.406',  'Compliant', 'Media notification procedures established with pre-approved communication templates and media contacts.', '', 'Test media notification procedures in Q2 2024 tabletop exercise.', 'Low', 'Communications Team', '2024-06-01', '2024-01-05 11:10:00', '2024-01-05 11:10:00'),
(5, '164.408', 'Compliant', 'HHS notification procedures documented with secure submission process and required forms.', '', 'Verify HHS submission portal access and update contact information.', 'Low', 'Privacy Officer', '2024-03-01', '2024-01-05 11:15:00', '2024-01-05 11:15:00'),
(5, '164.410', 'Compliant', 'Business associate breach notification requirements included in all BAAs with clear timelines.', '', 'Conduct annual BAA breach notification training for vendors.', 'Low', 'Vendor Management', '2024-08-01', '2024-01-05 11:20:00', '2024-01-05 11:20:00'),
(5, '164.412', 'Compliant', 'Law enforcement delay procedures documented with legal review process and communication protocols.', '', 'Review law enforcement coordination procedures with legal counsel.', 'Low', 'Legal Department', '2024-05-01', '2024-01-05 11:25:00', '2024-01-05 11:25:00'),
(5, '164.414', 'Compliant', 'Administrative requirements and burden of proof procedures documented with evidence collection protocols.', '', 'Update evidence collection procedures based on recent regulatory guidance.', 'Low', 'Privacy Officer', '2024-04-15', '2024-01-05 11:30:00', '2024-01-05 11:30:00');

-- Update assessment compliance scores based on results
UPDATE hipaa_assessments SET 
    compliance_score = (
        SELECT ROUND(
            (COUNT(CASE WHEN har.compliance_status = 'Compliant' THEN 1 END) * 100.0 / COUNT(*)), 1
        )
        FROM hipaa_assessment_results har 
        WHERE har.assessment_id = hipaa_assessments.id
    ),
    updated_at = CURRENT_TIMESTAMP
WHERE id IN (1, 2, 5);

SELECT 'Sample HIPAA assessments and results inserted successfully!' as status,
       (SELECT COUNT(*) FROM hipaa_assessments) as total_assessments,
       (SELECT COUNT(*) FROM hipaa_assessment_results) as total_results;
