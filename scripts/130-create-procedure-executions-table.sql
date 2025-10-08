-- This table was already created in the previous script, but adding additional indexes and constraints

-- Add additional constraints and indexes for procedure executions
ALTER TABLE procedure_executions 
ADD CONSTRAINT chk_duration_positive CHECK (duration_minutes >= 0);

-- Add index for execution tracking
CREATE INDEX IF NOT EXISTS idx_procedure_executions_started_at ON procedure_executions(started_at);
CREATE INDEX IF NOT EXISTS idx_procedure_executions_completed_at ON procedure_executions(completed_at);

-- Insert sample procedures
INSERT INTO procedures (procedure_id, title, description, policy_id, steps, status, version) VALUES
('PROC001', 'User Access Provisioning', 'Standard procedure for provisioning user access to systems',
(SELECT id FROM policies WHERE policy_id = 'POL002'),
'[
  {"id": 1, "title": "Receive access request", "description": "Review and validate access request form", "required": true},
  {"id": 2, "title": "Verify business justification", "description": "Confirm business need with manager", "required": true},
  {"id": 3, "title": "Check existing access", "description": "Review current user permissions", "required": true},
  {"id": 4, "title": "Provision access", "description": "Grant appropriate system access", "required": true},
  {"id": 5, "title": "Document access", "description": "Update access management system", "required": true},
  {"id": 6, "title": "Notify stakeholders", "description": "Inform user and manager of access grant", "required": true}
]'::jsonb,
'published', '1.0'),

('PROC002', 'Security Incident Response', 'Standard procedure for responding to security incidents',
(SELECT id FROM policies WHERE policy_id = 'POL004'),
'[
  {"id": 1, "title": "Incident detection", "description": "Identify and confirm security incident", "required": true},
  {"id": 2, "title": "Initial assessment", "description": "Assess severity and impact", "required": true},
  {"id": 3, "title": "Activate response team", "description": "Notify incident response team members", "required": true},
  {"id": 4, "title": "Contain incident", "description": "Implement containment measures", "required": true},
  {"id": 5, "title": "Investigate and analyze", "description": "Conduct detailed investigation", "required": true},
  {"id": 6, "title": "Eradicate threat", "description": "Remove threat from environment", "required": true},
  {"id": 7, "title": "Recover systems", "description": "Restore affected systems to normal operation", "required": true},
  {"id": 8, "title": "Document lessons learned", "description": "Create post-incident report", "required": true}
]'::jsonb,
'published', '1.0'),

('PROC003', 'Data Breach Response', 'Procedure for responding to data breach incidents',
(SELECT id FROM policies WHERE policy_id = 'POL003'),
'[
  {"id": 1, "title": "Breach identification", "description": "Confirm data breach has occurred", "required": true},
  {"id": 2, "title": "Immediate containment", "description": "Stop ongoing data exposure", "required": true},
  {"id": 3, "title": "Impact assessment", "description": "Determine scope and severity of breach", "required": true},
  {"id": 4, "title": "Legal notification", "description": "Notify legal team and assess regulatory requirements", "required": true},
  {"id": 5, "title": "Regulatory notification", "description": "Submit required breach notifications", "required": true},
  {"id": 6, "title": "Affected party notification", "description": "Notify affected individuals", "required": true},
  {"id": 7, "title": "Remediation", "description": "Implement corrective measures", "required": true}
]'::jsonb,
'published', '1.0')
ON CONFLICT (procedure_id) DO NOTHING;
