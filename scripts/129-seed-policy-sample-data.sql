-- Insert policy categories
INSERT INTO policy_categories (name, description, color) VALUES
('Information Security', 'Policies related to information security management', '#EF4444'),
('Access Control', 'Policies governing user access and authentication', '#3B82F6'),
('Data Protection', 'Policies for data privacy and protection', '#10B981'),
('Incident Response', 'Policies for handling security incidents', '#F59E0B'),
('Business Continuity', 'Policies for business continuity and disaster recovery', '#8B5CF6'),
('Compliance', 'Regulatory compliance policies', '#EC4899'),
('Risk Management', 'Risk assessment and management policies', '#6B7280'),
('Training & Awareness', 'Security training and awareness policies', '#14B8A6')
ON CONFLICT (name) DO NOTHING;

-- Insert sample policies
INSERT INTO policies (policy_id, title, description, content, category_id, status, version, effective_date, next_review_date, tags) VALUES
('POL001', 'Information Security Policy', 'Comprehensive information security policy covering all aspects of cybersecurity', 
'# Information Security Policy

## 1. Purpose
This policy establishes the framework for protecting information assets and ensuring the confidentiality, integrity, and availability of data.

## 2. Scope
This policy applies to all employees, contractors, and third parties who have access to organizational information systems.

## 3. Policy Statements
- All users must comply with security requirements
- Access controls must be implemented and maintained
- Security incidents must be reported immediately
- Regular security training is mandatory

## 4. Responsibilities
- CISO: Overall security program oversight
- IT Department: Technical implementation
- All Users: Compliance with security requirements

## 5. Compliance
Non-compliance may result in disciplinary action up to and including termination.', 
(SELECT id FROM policy_categories WHERE name = 'Information Security'), 'published', '2.1', '2024-01-01', '2025-01-01', 
ARRAY['security', 'compliance', 'mandatory']),

('POL002', 'Access Control Policy', 'Policy governing user access rights and authentication requirements', 
'# Access Control Policy

## 1. Purpose
To ensure that access to information systems is granted based on business need and the principle of least privilege.

## 2. User Access Management
- Access requests must be approved by data owners
- Regular access reviews are required
- Terminated users must have access revoked immediately

## 3. Authentication Requirements
- Strong passwords are mandatory
- Multi-factor authentication for privileged accounts
- Account lockout after failed attempts

## 4. Monitoring
- Access attempts are logged and monitored
- Suspicious activities are investigated
- Regular audit reports are generated',
(SELECT id FROM policy_categories WHERE name = 'Access Control'),
'published', '1.5', '2024-02-01', '2025-02-01',
ARRAY['access', 'authentication', 'authorization']),

('POL003', 'Data Protection Policy', 'Policy for protecting sensitive and personal data', 
'# Data Protection Policy

## 1. Purpose
To ensure the protection of personal and sensitive data in compliance with applicable regulations.

## 2. Data Classification
- Public: No restrictions
- Internal: Limited to organization
- Confidential: Restricted access
- Restricted: Highest protection level

## 3. Data Handling
- Encryption for data at rest and in transit
- Secure disposal of data
- Data retention schedules
- Privacy impact assessments

## 4. Breach Response
- Immediate containment
- Assessment of impact
- Notification procedures
- Remediation actions',
(SELECT id FROM policy_categories WHERE name = 'Data Protection'),
'published', '1.8', '2024-03-01', '2025-03-01',
ARRAY['data-protection', 'privacy', 'gdpr']),

('POL004', 'Incident Response Policy', 'Policy for handling cybersecurity incidents', 
'# Incident Response Policy

## 1. Purpose
To establish procedures for detecting, responding to, and recovering from cybersecurity incidents.

## 2. Incident Classification
- Low: Minimal impact
- Medium: Moderate impact
- High: Significant impact
- Critical: Severe impact

## 3. Response Team
- Incident Commander
- Technical Lead
- Communications Lead
- Legal Counsel

## 4. Response Procedures
1. Detection and Analysis
2. Containment and Eradication
3. Recovery and Post-Incident Activity
4. Lessons Learned

## 5. Communication
- Internal notifications
- External notifications
- Media relations
- Customer communications',
(SELECT id FROM policy_categories WHERE name = 'Incident Response'),
'published', '2.0', '2024-04-01', '2025-04-01',
ARRAY['incident-response', 'emergency', 'communication']),

('POL005', 'Risk Management Policy', 'Policy for identifying and managing cybersecurity risks', 
'# Risk Management Policy

## 1. Purpose
To establish a systematic approach to identifying, assessing, and managing cybersecurity risks.

## 2. Risk Assessment Process
- Asset identification
- Threat identification
- Vulnerability assessment
- Risk calculation
- Risk treatment decisions

## 3. Risk Treatment Options
- Accept: Acknowledge and monitor
- Avoid: Eliminate the risk source
- Mitigate: Reduce likelihood or impact
- Transfer: Share or transfer risk

## 4. Risk Monitoring
- Regular risk assessments
- Key risk indicators
- Risk reporting
- Continuous improvement

## 5. Governance
- Risk committee oversight
- Executive reporting
- Board communication
- Stakeholder engagement',
(SELECT id FROM policy_categories WHERE name = 'Risk Management'),
'under_review', '1.2', '2024-05-01', '2024-12-01',
ARRAY['risk-management', 'assessment', 'governance'])
ON CONFLICT (policy_id) DO NOTHING;

-- Insert sample procedures
INSERT INTO procedures (procedure_id, title, description, policy_id, steps, status) VALUES
('PROC001', 'User Account Provisioning', 'Procedure for creating new user accounts', 
(SELECT id FROM policies WHERE policy_id = 'POL002'),
'[
  {"id": 1, "title": "Receive access request form", "description": "Validate completed access request form", "required": true},
  {"id": 2, "title": "Verify manager approval", "description": "Confirm request is approved by appropriate manager", "required": true},
  {"id": 3, "title": "Determine access requirements", "description": "Identify required systems and access levels", "required": true},
  {"id": 4, "title": "Create user account", "description": "Create account in Active Directory", "required": true},
  {"id": 5, "title": "Assign group memberships", "description": "Add user to appropriate security groups", "required": true},
  {"id": 6, "title": "Send credentials", "description": "Provide login credentials securely to user", "required": true},
  {"id": 7, "title": "Document access", "description": "Record access grant in access management system", "required": true}
]', 'published'),

('PROC002', 'Incident Response Activation', 'Procedure for activating incident response team', 
(SELECT id FROM policies WHERE policy_id = 'POL004'),
'[
  {"id": 1, "title": "Incident detection", "description": "Security incident is detected or reported", "required": true},
  {"id": 2, "title": "Initial assessment", "description": "Perform initial impact and severity assessment", "required": true},
  {"id": 3, "title": "Classify incident", "description": "Classify incident severity (Low/Medium/High/Critical)", "required": true},
  {"id": 4, "title": "Activate response team", "description": "Notify and activate appropriate response team members", "required": true},
  {"id": 5, "title": "Establish communication", "description": "Set up incident communication channels", "required": true},
  {"id": 6, "title": "Begin containment", "description": "Implement immediate containment measures", "required": true}
]', 'published'),

('PROC003', 'Data Breach Response', 'Procedure for responding to data breaches', 
(SELECT id FROM policies WHERE policy_id = 'POL003'),
'[
  {"id": 1, "title": "Breach identification", "description": "Identify and confirm data breach", "required": true},
  {"id": 2, "title": "Assess scope", "description": "Determine what data was compromised", "required": true},
  {"id": 3, "title": "Contain breach", "description": "Implement measures to stop further data loss", "required": true},
  {"id": 4, "title": "Notify stakeholders", "description": "Inform management and legal team", "required": true},
  {"id": 5, "title": "Regulatory notification", "description": "Report to regulatory authorities within 72 hours", "required": true},
  {"id": 6, "title": "Individual notification", "description": "Notify affected individuals if required", "required": true},
  {"id": 7, "title": "Document incident", "description": "Create detailed incident documentation", "required": true}
]', 'published');

-- Insert sample procedure executions
INSERT INTO procedure_executions (execution_id, procedure_id, status, started_at, completed_at, duration_minutes, steps_completed, notes) VALUES
('EXEC001', (SELECT id FROM procedures WHERE procedure_id = 'PROC001'), 'completed', 
'2024-01-15 09:00:00', '2024-01-15 09:25:00', 25,
'[
  {"id": 1, "title": "Receive access request form", "completed": true, "timestamp": "2024-01-15T09:02:00Z"},
  {"id": 2, "title": "Verify manager approval", "completed": true, "timestamp": "2024-01-15T09:05:00Z"},
  {"id": 3, "title": "Determine access requirements", "completed": true, "timestamp": "2024-01-15T09:10:00Z"},
  {"id": 4, "title": "Create user account", "completed": true, "timestamp": "2024-01-15T09:15:00Z"},
  {"id": 5, "title": "Assign group memberships", "completed": true, "timestamp": "2024-01-15T09:20:00Z"},
  {"id": 6, "title": "Send credentials", "completed": true, "timestamp": "2024-01-15T09:23:00Z"},
  {"id": 7, "title": "Document access", "completed": true, "timestamp": "2024-01-15T09:25:00Z"}
]', 'New employee John Smith - Marketing department'),

('EXEC002', (SELECT id FROM procedures WHERE procedure_id = 'PROC002'), 'in_progress', 
'2024-01-20 14:30:00', NULL, NULL,
'[
  {"id": 1, "title": "Incident detection", "completed": true, "timestamp": "2024-01-20T14:30:00Z"},
  {"id": 2, "title": "Initial assessment", "completed": true, "timestamp": "2024-01-20T14:35:00Z"},
  {"id": 3, "title": "Classify incident", "completed": true, "timestamp": "2024-01-20T14:40:00Z"},
  {"id": 4, "title": "Activate response team", "completed": true, "timestamp": "2024-01-20T14:45:00Z"},
  {"id": 5, "title": "Establish communication", "completed": false},
  {"id": 6, "title": "Begin containment", "completed": false}
]', 'Suspicious network activity detected - investigating potential intrusion'),

('EXEC003', (SELECT id FROM procedures WHERE procedure_id = 'PROC001'), 'completed', 
'2024-01-18 11:00:00', '2024-01-18 11:30:00', 30,
'[
  {"id": 1, "title": "Receive access request form", "completed": true, "timestamp": "2024-01-18T11:02:00Z"},
  {"id": 2, "title": "Verify manager approval", "completed": true, "timestamp": "2024-01-18T11:08:00Z"},
  {"id": 3, "title": "Determine access requirements", "completed": true, "timestamp": "2024-01-18T11:15:00Z"},
  {"id": 4, "title": "Create user account", "completed": true, "timestamp": "2024-01-18T11:20:00Z"},
  {"id": 5, "title": "Assign group memberships", "completed": true, "timestamp": "2024-01-18T11:25:00Z"},
  {"id": 6, "title": "Send credentials", "completed": true, "timestamp": "2024-01-18T11:28:00Z"},
  {"id": 7, "title": "Document access", "completed": true, "timestamp": "2024-01-18T11:30:00Z"}
]', 'New contractor Sarah Johnson - IT department');
