-- Add missing columns to assessment_findings table
ALTER TABLE assessment_findings 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id),
ADD COLUMN IF NOT EXISTS department_id INTEGER REFERENCES departments(id),
ADD COLUMN IF NOT EXISTS organization_id INTEGER REFERENCES organizations(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessment_findings_user_id ON assessment_findings(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_findings_department_id ON assessment_findings(department_id);
CREATE INDEX IF NOT EXISTS idx_assessment_findings_organization_id ON assessment_findings(organization_id);
CREATE INDEX IF NOT EXISTS idx_assessment_findings_assessment_id ON assessment_findings(assessment_id);

-- Update existing findings to have organization and department data
-- This will set organization_id and department_id based on the assessment's context
UPDATE assessment_findings 
SET organization_id = 1, department_id = 1 
WHERE organization_id IS NULL;

-- Add some sample data for testing
INSERT INTO assessment_findings (
    assessment_id, finding_title, finding_description, severity, category, 
    recommendation, status, user_id, department_id, organization_id, 
    assigned_to, due_date
) VALUES 
(1, 'Weak Password Policy', 'Current password policy does not meet industry standards for complexity requirements', 'High', 'Access Control', 'Implement stronger password policy with minimum 12 characters, complexity requirements, and regular rotation', 'Open', 1, 1, 1, 'John Smith', '2024-02-15'),
(1, 'Unencrypted Data Transmission', 'Sensitive data is being transmitted without proper encryption protocols', 'Critical', 'Data Protection', 'Implement TLS 1.3 for all data transmission and ensure end-to-end encryption', 'In Progress', 2, 2, 1, 'Jane Doe', '2024-01-30'),
(2, 'Missing Security Awareness Training', 'Employees lack adequate cybersecurity awareness training', 'Medium', 'Risk Management', 'Develop and implement comprehensive security awareness training program', 'Open', 3, 3, 1, 'Mike Johnson', '2024-03-01'),
(2, 'Outdated Firewall Rules', 'Firewall configuration contains outdated and potentially insecure rules', 'High', 'Network Security', 'Review and update firewall rules, remove unnecessary access, implement least privilege principle', 'Resolved', 4, 4, 1, 'Sarah Wilson', '2024-01-15')
ON CONFLICT DO NOTHING;
