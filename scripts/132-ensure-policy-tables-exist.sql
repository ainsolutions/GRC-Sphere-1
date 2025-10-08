-- Create policy categories table
CREATE TABLE IF NOT EXISTS policy_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create policies table
CREATE TABLE IF NOT EXISTS policies (
    id SERIAL PRIMARY KEY,
    policy_id VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    category_id INTEGER REFERENCES policy_categories(id),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'approved', 'published', 'archived')),
    version VARCHAR(10) DEFAULT '1.0',
    effective_date DATE,
    review_date DATE,
    next_review_date DATE,
    tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create procedures table
CREATE TABLE IF NOT EXISTS procedures (
    id SERIAL PRIMARY KEY,
    procedure_id VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    policy_id INTEGER REFERENCES policies(id),
    steps JSONB DEFAULT '[]',
    roles_responsibilities JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'approved', 'published', 'archived')),
    version VARCHAR(10) DEFAULT '1.0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create procedure executions table
CREATE TABLE IF NOT EXISTS procedure_executions (
    id SERIAL PRIMARY KEY,
    execution_id VARCHAR(20) NOT NULL UNIQUE,
    procedure_id INTEGER REFERENCES procedures(id),
    executed_by INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_minutes INTEGER,
    steps_completed JSONB DEFAULT '[]',
    notes TEXT,
    evidence_files JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_policies_category_id ON policies(category_id);
CREATE INDEX IF NOT EXISTS idx_policies_status ON policies(status);
CREATE INDEX IF NOT EXISTS idx_policies_next_review_date ON policies(next_review_date);
CREATE INDEX IF NOT EXISTS idx_procedures_policy_id ON procedures(policy_id);
CREATE INDEX IF NOT EXISTS idx_procedure_executions_procedure_id ON procedure_executions(procedure_id);
CREATE INDEX IF NOT EXISTS idx_procedure_executions_status ON procedure_executions(status);

-- Insert default policy categories
INSERT INTO policy_categories (name, description, color) VALUES
('Information Security', 'Policies related to information security and data protection', '#EF4444'),
('Access Control', 'User access and authentication policies', '#3B82F6'),
('Data Privacy', 'Data privacy and GDPR compliance policies', '#10B981'),
('Business Continuity', 'Business continuity and disaster recovery policies', '#F59E0B'),
('Risk Management', 'Risk assessment and management policies', '#8B5CF6'),
('Compliance', 'Regulatory compliance and audit policies', '#06B6D4')
ON CONFLICT (name) DO NOTHING;

-- Insert sample policies
INSERT INTO policies (policy_id, title, description, content, category_id, status, effective_date, next_review_date, tags) VALUES
('POL001', 'Information Security Policy', 'Comprehensive information security policy covering all aspects of data protection', 
'# Information Security Policy

## Purpose
This policy establishes the framework for protecting information assets...

## Scope
This policy applies to all employees, contractors, and third parties...

## Policy Statement
All information assets must be protected according to their classification level...', 
1, 'published', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', ARRAY['security', 'data-protection', 'mandatory']),

('POL002', 'Password Policy', 'Password requirements and management guidelines', 
'# Password Policy

## Requirements
- Minimum 12 characters
- Mix of uppercase, lowercase, numbers, and symbols
- No dictionary words
- Changed every 90 days

## Implementation
All systems must enforce these requirements...', 
2, 'published', CURRENT_DATE, CURRENT_DATE + INTERVAL '6 months', ARRAY['passwords', 'authentication', 'security']),

('POL003', 'Data Classification Policy', 'Guidelines for classifying and handling sensitive data', 
'# Data Classification Policy

## Classification Levels
1. Public
2. Internal
3. Confidential
4. Restricted

## Handling Requirements
Each classification level has specific handling requirements...', 
3, 'approved', CURRENT_DATE, CURRENT_DATE + INTERVAL '1 year', ARRAY['data-classification', 'privacy', 'gdpr'])
ON CONFLICT (policy_id) DO NOTHING;

-- Insert sample procedures
INSERT INTO procedures (procedure_id, title, description, policy_id, steps, status) VALUES
('PROC001', 'User Access Review Procedure', 'Monthly procedure for reviewing user access rights', 1, 
'[
  {"id": 1, "title": "Generate user access report", "description": "Extract current user permissions from all systems", "required": true},
  {"id": 2, "title": "Review access with managers", "description": "Send reports to department managers for review", "required": true},
  {"id": 3, "title": "Process access changes", "description": "Implement approved access modifications", "required": true},
  {"id": 4, "title": "Document review results", "description": "Record all changes and approvals", "required": true}
]', 'published'),

('PROC002', 'Password Reset Procedure', 'Standard procedure for resetting user passwords', 2, 
'[
  {"id": 1, "title": "Verify user identity", "description": "Confirm identity using approved methods", "required": true},
  {"id": 2, "title": "Generate temporary password", "description": "Create secure temporary password", "required": true},
  {"id": 3, "title": "Communicate new password", "description": "Send password via secure channel", "required": true},
  {"id": 4, "title": "Force password change", "description": "Require user to change password on first login", "required": true}
]', 'published'),

('PROC003', 'Data Classification Review', 'Quarterly review of data classification assignments', 3, 
'[
  {"id": 1, "title": "Inventory data assets", "description": "Create comprehensive list of data assets", "required": true},
  {"id": 2, "title": "Review current classifications", "description": "Assess current classification levels", "required": true},
  {"id": 3, "title": "Update classifications", "description": "Modify classifications as needed", "required": true},
  {"id": 4, "title": "Update handling procedures", "description": "Ensure handling matches classification", "required": true}
]', 'approved')
ON CONFLICT (procedure_id) DO NOTHING;

-- Insert sample procedure executions
INSERT INTO procedure_executions (execution_id, procedure_id, status, started_at, completed_at, duration_minutes, steps_completed, notes) VALUES
('EXEC0001', 1, 'completed', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days' + INTERVAL '45 minutes', 45,
'[
  {"id": 1, "title": "Generate user access report", "completed": true, "timestamp": "2024-01-15T09:00:00Z"},
  {"id": 2, "title": "Review access with managers", "completed": true, "timestamp": "2024-01-15T09:30:00Z"},
  {"id": 3, "title": "Process access changes", "completed": true, "timestamp": "2024-01-15T09:40:00Z"},
  {"id": 4, "title": "Document review results", "completed": true, "timestamp": "2024-01-15T09:45:00Z"}
]', 'Monthly access review completed successfully. 3 access modifications processed.'),

('EXEC0002', 2, 'completed', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day' + INTERVAL '15 minutes', 15,
'[
  {"id": 1, "title": "Verify user identity", "completed": true, "timestamp": "2024-01-16T14:00:00Z"},
  {"id": 2, "title": "Generate temporary password", "completed": true, "timestamp": "2024-01-16T14:05:00Z"},
  {"id": 3, "title": "Communicate new password", "completed": true, "timestamp": "2024-01-16T14:10:00Z"},
  {"id": 4, "title": "Force password change", "completed": true, "timestamp": "2024-01-16T14:15:00Z"}
]', 'Password reset for user john.doe@company.com completed successfully.'),

('EXEC0003', 1, 'in_progress', CURRENT_TIMESTAMP - INTERVAL '2 hours', NULL, NULL,
'[
  {"id": 1, "title": "Generate user access report", "completed": true, "timestamp": "2024-01-17T10:00:00Z"},
  {"id": 2, "title": "Review access with managers", "completed": false, "timestamp": null},
  {"id": 3, "title": "Process access changes", "completed": false, "timestamp": null},
  {"id": 4, "title": "Document review results", "completed": false, "timestamp": null}
]', 'Current monthly access review in progress. Waiting for manager approvals.')
ON CONFLICT (execution_id) DO NOTHING;

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_policy_categories_updated_at ON policy_categories;
CREATE TRIGGER update_policy_categories_updated_at BEFORE UPDATE ON policy_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_policies_updated_at ON policies;
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_procedures_updated_at ON procedures;
CREATE TRIGGER update_procedures_updated_at BEFORE UPDATE ON procedures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
