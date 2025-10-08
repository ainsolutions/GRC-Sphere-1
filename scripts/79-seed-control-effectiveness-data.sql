-- Insert sample control effectiveness data for existing risks
INSERT INTO iso27001_control_effectiveness (risk_id, control_id, effectiveness, implementation_status, notes) VALUES
-- Risk 1: Unauthorized Access to Customer Database
(1, 'A.9.1.1', 4, 'Implemented', 'Access control policy is well-defined and regularly reviewed'),
(1, 'A.9.2.1', 3, 'Partially Implemented', 'User registration process exists but needs automation'),
(1, 'A.9.2.3', 5, 'Implemented', 'Privileged access management system fully deployed'),
(1, 'A.9.4.2', 4, 'Implemented', 'Multi-factor authentication enforced for all users'),

-- Risk 2: Data Breach via Malware
(2, 'A.12.2.1', 4, 'Implemented', 'Enterprise antivirus solution with real-time protection'),
(2, 'A.12.6.1', 3, 'In Progress', 'Vulnerability management program being enhanced'),
(2, 'A.13.1.1', 4, 'Implemented', 'Network segmentation and monitoring in place'),
(2, 'A.14.2.8', 2, 'Not Started', 'Security testing needs to be integrated into SDLC'),

-- Risk 3: Insider Threat - Data Theft
(3, 'A.7.1.1', 4, 'Implemented', 'Background screening process for all employees'),
(3, 'A.7.2.2', 3, 'Partially Implemented', 'Security awareness training conducted annually'),
(3, 'A.9.2.5', 4, 'Implemented', 'Regular access reviews conducted quarterly'),
(3, 'A.11.2.9', 3, 'Partially Implemented', 'Clear desk policy exists but enforcement varies'),

-- Risk 4: Cloud Service Provider Compromise
(4, 'A.15.1.1', 3, 'Partially Implemented', 'Supplier security policy needs updates'),
(4, 'A.15.1.2', 4, 'Implemented', 'Security requirements included in all cloud contracts'),
(4, 'A.15.2.1', 2, 'In Progress', 'Cloud provider monitoring capabilities being developed'),

-- Risk 5: Physical Security Breach
(5, 'A.11.1.1', 4, 'Implemented', 'Physical security perimeter well-established'),
(5, 'A.11.1.2', 5, 'Implemented', 'Card access system with biometric verification'),
(5, 'A.11.2.1', 3, 'Partially Implemented', 'Equipment protection adequate but could be improved'),
(5, 'A.11.2.7', 4, 'Implemented', 'Secure disposal procedures for all equipment'),

-- Risk 6: Business Continuity Failure
(6, 'A.17.1.1', 3, 'Partially Implemented', 'Business continuity plan exists but needs testing'),
(6, 'A.17.1.2', 2, 'In Progress', 'Implementation of continuity measures ongoing'),
(6, 'A.17.2.1', 4, 'Implemented', 'Redundant processing facilities available'),
(6, 'A.12.3.1', 4, 'Implemented', 'Automated backup systems with offsite storage'),

-- Risk 7: Software Vulnerability Exploitation
(7, 'A.12.6.1', 3, 'Partially Implemented', 'Vulnerability scanning in place, patching process needs improvement'),
(7, 'A.14.2.1', 2, 'Not Started', 'Secure development policy under development'),
(7, 'A.14.2.8', 2, 'Not Started', 'Security testing integration planned'),

-- Risk 8: Social Engineering Attack
(8, 'A.7.2.2', 3, 'Partially Implemented', 'Security awareness training covers social engineering'),
(8, 'A.13.2.1', 4, 'Implemented', 'Email security controls including anti-phishing'),
(8, 'A.16.1.2', 3, 'Partially Implemented', 'Incident reporting process exists but needs promotion'),

-- Risk 9: Cryptographic Key Compromise
(9, 'A.10.1.1', 4, 'Implemented', 'Comprehensive cryptographic policy in place'),
(9, 'A.10.1.2', 3, 'Partially Implemented', 'Key management system deployed but needs hardening'),

-- Risk 10: Compliance Violation
(10, 'A.18.1.1', 4, 'Implemented', 'Legal and regulatory requirements well-documented'),
(10, 'A.18.2.1', 3, 'Partially Implemented', 'Independent security reviews conducted annually'),
(10, 'A.18.2.2', 4, 'Implemented', 'Regular compliance monitoring and reporting');

-- Update the updated_at timestamp for all records
UPDATE iso27001_control_effectiveness SET updated_at = CURRENT_TIMESTAMP;
