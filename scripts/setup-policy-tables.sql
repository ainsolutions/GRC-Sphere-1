-- Quick setup for policy management tables
-- Run this script to create the necessary tables for the policy management system

-- Create policy_categories table
CREATE TABLE IF NOT EXISTS policy_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3b82f6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create policies table
CREATE TABLE IF NOT EXISTS policies (
    id SERIAL PRIMARY KEY,
    policy_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    category_id INTEGER REFERENCES policy_categories(id),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'approved', 'published', 'archived')),
    version VARCHAR(20) DEFAULT '1.0',
    effective_date DATE,
    review_date DATE,
    next_review_date DATE,
    tags TEXT[] DEFAULT '{}',
    organization_id INTEGER DEFAULT 1,
    created_by INTEGER,
    updated_by INTEGER,
    department_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create policy_versions table
CREATE TABLE IF NOT EXISTS policy_versions (
    id SERIAL PRIMARY KEY,
    policy_id INTEGER NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    change_summary TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    version_status VARCHAR(20) DEFAULT 'historical' CHECK (version_status IN ('current', 'historical', 'archived')),
    is_current BOOLEAN DEFAULT FALSE,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create policy_attachments table
CREATE TABLE IF NOT EXISTS policy_attachments (
    id SERIAL PRIMARY KEY,
    policy_id INTEGER NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
    version_id INTEGER REFERENCES policy_versions(id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100),
    file_hash VARCHAR(64) UNIQUE,
    uploaded_by INTEGER,
    version VARCHAR(20),
    is_current BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create procedures table
CREATE TABLE IF NOT EXISTS procedures (
    id SERIAL PRIMARY KEY,
    procedure_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    policy_id INTEGER REFERENCES policies(id) ON DELETE CASCADE,
    steps JSONB DEFAULT '[]'::jsonb,
    roles_responsibilities JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'approved', 'published', 'archived')),
    version VARCHAR(20) DEFAULT '1.0',
    execution_count INTEGER DEFAULT 0,
    completed_executions INTEGER DEFAULT 0,
    active_executions INTEGER DEFAULT 0,
    last_execution TIMESTAMP,
    organization_id INTEGER DEFAULT 1,
    created_by INTEGER,
    updated_by INTEGER,
    department_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create procedure_executions table
CREATE TABLE IF NOT EXISTS procedure_executions (
    id SERIAL PRIMARY KEY,
    execution_id VARCHAR(50) UNIQUE NOT NULL,
    procedure_id INTEGER NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
    executed_by INTEGER,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    duration_minutes INTEGER,
    steps_completed JSONB DEFAULT '[]'::jsonb,
    evidence_files JSONB DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create policy_activities table
CREATE TABLE IF NOT EXISTS policy_activities (
    id SERIAL PRIMARY KEY,
    policy_id INTEGER REFERENCES policies(id) ON DELETE CASCADE,
    version_id INTEGER REFERENCES policy_versions(id) ON DELETE SET NULL,
    procedure_id INTEGER REFERENCES procedures(id) ON DELETE CASCADE,
    execution_id INTEGER REFERENCES procedure_executions(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT,
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_policies_policy_id ON policies(policy_id);
CREATE INDEX IF NOT EXISTS idx_policies_status ON policies(status);
CREATE INDEX IF NOT EXISTS idx_policies_category_id ON policies(category_id);
CREATE INDEX IF NOT EXISTS idx_policy_versions_policy_id ON policy_versions(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_versions_is_current ON policy_versions(is_current);
CREATE INDEX IF NOT EXISTS idx_policy_attachments_policy_id ON policy_attachments(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_attachments_version_id ON policy_attachments(version_id);
CREATE INDEX IF NOT EXISTS idx_policy_attachments_file_hash ON policy_attachments(file_hash);
CREATE INDEX IF NOT EXISTS idx_procedures_policy_id ON procedures(policy_id);
CREATE INDEX IF NOT EXISTS idx_procedures_status ON procedures(status);
CREATE INDEX IF NOT EXISTS idx_procedure_executions_procedure_id ON procedure_executions(procedure_id);
CREATE INDEX IF NOT EXISTS idx_procedure_executions_status ON procedure_executions(status);
CREATE INDEX IF NOT EXISTS idx_policy_activities_policy_id ON policy_activities(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_activities_activity_type ON policy_activities(activity_type);

-- Insert default policy categories
INSERT INTO policy_categories (name, description, color) VALUES
    ('Information Security', 'Policies related to information security management', '#ef4444'),
    ('Access Control', 'Policies for access control and authorization', '#f97316'),
    ('Data Protection', 'Policies for data protection and privacy', '#eab308'),
    ('Network Security', 'Policies for network security and infrastructure', '#22c55e'),
    ('Incident Response', 'Policies for incident response and management', '#3b82f6'),
    ('Compliance', 'Policies for regulatory compliance', '#8b5cf6'),
    ('Human Resources', 'Policies for HR and personnel management', '#ec4899'),
    ('Operations', 'Policies for operational procedures', '#6b7280')
ON CONFLICT (name) DO NOTHING;

-- Insert sample policies
INSERT INTO policies (policy_id, title, description, content, category_id, status, version) VALUES
    ('POL-001', 'Information Security Policy', 'Master policy for information security management', '# Information Security Policy\n\nThis policy establishes the framework for information security within our organization...', 1, 'published', '2.1'),
    ('POL-002', 'Access Control Policy', 'Policy for controlling access to information systems', '# Access Control Policy\n\nThis policy defines access control requirements...', 2, 'published', '1.5'),
    ('POL-003', 'Data Protection Policy', 'Policy for protecting sensitive data', '# Data Protection Policy\n\nThis policy outlines data protection measures...', 3, 'under_review', '1.0')
ON CONFLICT (policy_id) DO NOTHING;

-- Insert sample procedures
INSERT INTO procedures (procedure_id, title, description, policy_id, steps, status) VALUES
    ('PROC-001', 'Access Request Procedure', 'Procedure for requesting system access', 2, '[{"id": 1, "title": "Submit access request form", "description": "Fill out the access request form with required details"}, {"id": 2, "title": "Manager approval", "description": "Get approval from line manager"}, {"id": 3, "title": "IT review", "description": "IT team reviews and provisions access"}]', 'published'),
    ('PROC-002', 'Incident Response Procedure', 'Procedure for handling security incidents', 5, '[{"id": 1, "title": "Incident detection", "description": "Detect and identify security incident"}, {"id": 2, "title": "Initial assessment", "description": "Assess impact and severity"}, {"id": 3, "title": "Containment", "description": "Contain the incident to prevent spread"}]', 'published')
ON CONFLICT (procedure_id) DO NOTHING;

-- Insert sample policy versions
INSERT INTO policy_versions (policy_id, version, title, description, content, change_summary, status, is_current) VALUES
    (1, '1.0', 'Information Security Policy', 'Master policy for information security management', '# Information Security Policy v1.0\n\nInitial version of the policy...', 'Initial creation', 'published', FALSE),
    (1, '2.0', 'Information Security Policy', 'Master policy for information security management', '# Information Security Policy v2.0\n\nUpdated with new compliance requirements...', 'Added compliance requirements', 'published', FALSE),
    (1, '2.1', 'Information Security Policy', 'Master policy for information security management', '# Information Security Policy v2.1\n\nThis policy establishes the framework for information security within our organization...', 'Minor updates and clarifications', 'published', TRUE)
ON CONFLICT DO NOTHING;
