-- Insert sample assessments data
INSERT INTO assessments (
  assessment_id,
  assessment_name,
  assessment_type,
  framework,
  start_date,
  end_date,
  status,
  progress,
  assessor,
  organization,
  methodology,
  scope,
  findings_count,
  compliance_score,
  created_at,
  updated_at
) VALUES
-- ISO 27001 Assessments
('ASS-001', 'ISO 27001 Annual Assessment 2024', 'Compliance Assessment', 'ISO 27001', '2024-01-15', '2024-03-15', 'completed', 100, 'John Smith', 'TechCorp Inc.', 'Gap Analysis', 'Information Security Management System', 12, 85.5, '2024-01-15 09:00:00', '2024-03-15 17:00:00'),
('ASS-002', 'ISO 27001 Pre-Certification Assessment', 'Pre-Assessment', 'ISO 27001', '2024-02-01', '2024-04-01', 'in-progress', 75, 'Sarah Johnson', 'SecureIT Ltd.', 'Control Testing', 'ISMS Implementation Review', 8, 78.2, '2024-02-01 10:00:00', '2024-03-20 14:30:00'),
('ASS-003', 'ISO 27001 Surveillance Audit Prep', 'Internal Audit', 'ISO 27001', '2024-03-10', '2024-05-10', 'in-progress', 60, 'Michael Brown', 'CyberSafe Solutions', 'Document Review', 'Annual Surveillance Preparation', 5, 82.1, '2024-03-10 08:00:00', '2024-04-15 16:45:00'),

-- NIST CSF Assessments
('ASS-004', 'NIST Cybersecurity Framework Assessment', 'Framework Assessment', 'NIST CSF', '2024-01-20', '2024-04-20', 'completed', 100, 'Emily Davis', 'RiskGuard Consulting', 'Maturity Assessment', 'Cybersecurity Framework Implementation', 15, 72.8, '2024-01-20 09:30:00', '2024-04-20 15:20:00'),
('ASS-005', 'NIST CSF Implementation Review', 'Implementation Review', 'NIST CSF', '2024-02-15', '2024-05-15', 'in-progress', 80, 'Robert Wilson', 'InfoSec Partners', 'Control Validation', 'Framework Controls Assessment', 10, 76.5, '2024-02-15 11:00:00', '2024-04-10 13:15:00'),
('ASS-006', 'NIST CSF Maturity Assessment', 'Maturity Assessment', 'NIST CSF', '2024-04-01', '2024-07-01', 'planning', 25, 'Lisa Anderson', 'CyberMaturity Inc.', 'Capability Assessment', 'Organizational Cybersecurity Maturity', 3, 68.9, '2024-04-01 10:30:00', '2024-04-25 12:00:00'),

-- HIPAA Assessments
('ASS-007', 'HIPAA Security Rule Assessment', 'Compliance Assessment', 'HIPAA', '2024-01-10', '2024-03-10', 'completed', 100, 'Dr. Jennifer Lee', 'HealthSec Advisors', 'Risk Assessment', 'Healthcare Data Security', 18, 88.7, '2024-01-10 08:30:00', '2024-03-10 16:30:00'),
('ASS-008', 'HIPAA Privacy Rule Review', 'Privacy Assessment', 'HIPAA', '2024-02-20', '2024-04-20', 'in-progress', 70, 'Mark Thompson', 'MedCompliance LLC', 'Policy Review', 'Patient Privacy Controls', 7, 91.2, '2024-02-20 09:15:00', '2024-04-05 14:20:00'),
('ASS-009', 'HIPAA Breach Risk Assessment', 'Risk Assessment', 'HIPAA', '2024-03-15', '2024-06-15', 'in-progress', 45, 'Amanda Clark', 'HealthRisk Solutions', 'Vulnerability Assessment', 'Data Breach Prevention', 12, 79.4, '2024-03-15 10:45:00', '2024-04-20 11:30:00'),

-- SOC 2 Assessments
('ASS-010', 'SOC 2 Type II Readiness Assessment', 'Readiness Assessment', 'SOC 2', '2024-01-25', '2024-04-25', 'completed', 100, 'David Rodriguez', 'AuditPro Services', 'Control Testing', 'SOC 2 Compliance Preparation', 22, 83.6, '2024-01-25 09:00:00', '2024-04-25 17:45:00'),
('ASS-011', 'SOC 2 Security Controls Review', 'Control Assessment', 'SOC 2', '2024-03-01', '2024-06-01', 'in-progress', 65, 'Karen White', 'TrustAssurance Inc.', 'Evidence Collection', 'Security Control Effectiveness', 14, 87.1, '2024-03-01 08:45:00', '2024-04-18 15:10:00'),

-- PCI DSS Assessments
('ASS-012', 'PCI DSS Level 1 Assessment', 'Compliance Assessment', 'PCI DSS', '2024-02-10', '2024-05-10', 'in-progress', 85, 'Thomas Garcia', 'PaymentSec Auditors', 'Network Scanning', 'Payment Card Industry Compliance', 9, 92.3, '2024-02-10 10:00:00', '2024-04-22 13:45:00'),
('ASS-013', 'PCI DSS Quarterly Review', 'Quarterly Review', 'PCI DSS', '2024-04-15', '2024-05-15', 'planning', 20, 'Nancy Martinez', 'CardSafe Solutions', 'Vulnerability Scan', 'Quarterly Security Assessment', 2, 89.8, '2024-04-15 11:30:00', '2024-04-28 09:20:00'),

-- GDPR Assessments
('ASS-014', 'GDPR Compliance Assessment', 'Compliance Assessment', 'GDPR', '2024-01-30', '2024-04-30', 'completed', 100, 'Sophie Laurent', 'EuroPrivacy Consultants', 'Data Mapping', 'General Data Protection Regulation', 16, 86.4, '2024-01-30 09:30:00', '2024-04-30 16:15:00'),
('ASS-015', 'GDPR Data Protection Review', 'Privacy Assessment', 'GDPR', '2024-03-20', '2024-06-20', 'in-progress', 55, 'Hans Mueller', 'DataProtect GmbH', 'Privacy Impact Assessment', 'Personal Data Processing Review', 11, 81.7, '2024-03-20 08:15:00', '2024-04-25 14:50:00'),

-- Security Risk Assessments
('ASS-016', 'Annual Security Risk Assessment', 'Risk Assessment', 'Security Risk', '2024-01-05', '2024-03-05', 'completed', 100, 'Alex Johnson', 'SecureRisk Analytics', 'Threat Modeling', 'Enterprise Security Risk Evaluation', 25, 74.2, '2024-01-05 08:00:00', '2024-03-05 18:00:00'),
('ASS-017', 'Cloud Security Assessment', 'Security Assessment', 'Security Risk', '2024-02-25', '2024-05-25', 'in-progress', 70, 'Maria Gonzalez', 'CloudSec Experts', 'Configuration Review', 'Cloud Infrastructure Security', 13, 79.8, '2024-02-25 10:15:00', '2024-04-12 12:30:00'),
('ASS-018', 'Third-Party Security Review', 'Vendor Assessment', 'Security Risk', '2024-04-05', '2024-07-05', 'planning', 30, 'James Wilson', 'VendorSec Solutions', 'Due Diligence', 'Supplier Security Assessment', 6, 71.5, '2024-04-05 09:45:00', '2024-04-30 11:15:00'),

-- Operational Risk Assessments
('ASS-019', 'Business Continuity Assessment', 'Operational Assessment', 'Operational Risk', '2024-01-12', '2024-04-12', 'completed', 100, 'Patricia Adams', 'ContinuityPro LLC', 'BCP Testing', 'Business Continuity Planning', 19, 88.9, '2024-01-12 09:20:00', '2024-04-12 17:30:00'),
('ASS-020', 'Operational Resilience Review', 'Resilience Assessment', 'Operational Risk', '2024-03-05', '2024-06-05', 'in-progress', 50, 'Christopher Lee', 'ResilienceFirst Inc.', 'Process Review', 'Operational Risk Management', 8, 82.6, '2024-03-05 08:30:00', '2024-04-20 15:45:00');
