-- Policy Management System Schema
-- This script creates all necessary tables, functions, and triggers for comprehensive policy management

-- Create policy_categories table
CREATE TABLE IF NOT EXISTS policy_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3b82f6',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create policies table (enhanced)
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

-- Create policy_activities table for audit trail
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_policies_policy_id ON policies(policy_id);
CREATE INDEX IF NOT EXISTS idx_policies_status ON policies(status);
CREATE INDEX IF NOT EXISTS idx_policies_category_id ON policies(category_id);
CREATE INDEX IF NOT EXISTS idx_policies_organization_id ON policies(organization_id);
CREATE INDEX IF NOT EXISTS idx_policies_tags ON policies USING GIN(tags);

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

-- Create function to create policy version
CREATE OR REPLACE FUNCTION create_policy_version(
    p_policy_id INTEGER,
    p_change_summary TEXT DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    v_current_policy policies%ROWTYPE;
    v_next_version VARCHAR(20);
    v_version_id INTEGER;
BEGIN
    -- Get current policy
    SELECT * INTO v_current_policy
    FROM policies
    WHERE id = p_policy_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Policy not found';
    END IF;

    -- Calculate next version
    v_next_version := calculate_next_version(v_current_policy.version);

    -- Mark current version as historical
    UPDATE policy_versions
    SET is_current = FALSE, version_status = 'historical'
    WHERE policy_id = p_policy_id AND is_current = TRUE;

    -- Create new version
    INSERT INTO policy_versions (
        policy_id, version, title, description, content,
        change_summary, status, version_status, is_current, created_by
    ) VALUES (
        p_policy_id, v_next_version, v_current_policy.title,
        v_current_policy.description, v_current_policy.content,
        p_change_summary, v_current_policy.status, 'current', TRUE,
        v_current_policy.updated_by
    ) RETURNING id INTO v_version_id;

    -- Update policy with new version
    UPDATE policies
    SET version = v_next_version, updated_at = CURRENT_TIMESTAMP
    WHERE id = p_policy_id;

    -- Copy current attachments to new version
    UPDATE policy_attachments
    SET version_id = v_version_id, version = v_next_version, is_current = TRUE
    WHERE policy_id = p_policy_id AND is_current = TRUE;

    RETURN v_version_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate next version
CREATE OR REPLACE FUNCTION calculate_next_version(current_version VARCHAR(20))
RETURNS VARCHAR(20) AS $$
DECLARE
    v_parts TEXT[];
    v_major INTEGER;
    v_minor INTEGER;
BEGIN
    -- Split version by dots
    v_parts := string_to_array(current_version, '.');

    IF array_length(v_parts, 1) >= 2 THEN
        v_major := v_parts[1]::INTEGER;
        v_minor := v_parts[2]::INTEGER;
        RETURN v_major || '.' || (v_minor + 1);
    ELSE
        RETURN (current_version::INTEGER + 1)::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to rollback to specific version
CREATE OR REPLACE FUNCTION rollback_policy_version(
    p_policy_id INTEGER,
    p_version_id INTEGER
) RETURNS VOID AS $$
DECLARE
    v_target_version policy_versions%ROWTYPE;
    v_current_version_id INTEGER;
BEGIN
    -- Get target version
    SELECT * INTO v_target_version
    FROM policy_versions
    WHERE id = p_version_id AND policy_id = p_policy_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Version not found';
    END IF;

    -- Mark current version as historical
    UPDATE policy_versions
    SET is_current = FALSE, version_status = 'historical'
    WHERE policy_id = p_policy_id AND is_current = TRUE;

    -- Mark target version as current
    UPDATE policy_versions
    SET is_current = TRUE, version_status = 'current'
    WHERE id = p_version_id;

    -- Update policy with rolled back data
    UPDATE policies
    SET
        title = v_target_version.title,
        description = v_target_version.description,
        content = v_target_version.content,
        version = v_target_version.version,
        status = v_target_version.status,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_policy_id;

    -- Update attachments to point to rolled back version
    UPDATE policy_attachments
    SET is_current = FALSE
    WHERE policy_id = p_policy_id;

    UPDATE policy_attachments
    SET is_current = TRUE
    WHERE version_id = p_version_id;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_policies_updated_at ON policies;
CREATE TRIGGER update_policies_updated_at
    BEFORE UPDATE ON policies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_procedures_updated_at ON procedures;
CREATE TRIGGER update_procedures_updated_at
    BEFORE UPDATE ON procedures
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

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

-- Insert sample data for testing
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

-- Insert sample attachments
INSERT INTO policy_attachments (policy_id, version_id, filename, original_filename, file_path, file_size, mime_type, uploaded_by) VALUES
    (1, 3, 'policy-1-security-policy-v2.1.pdf', 'Information Security Policy v2.1.pdf', '/files/policy-1-security-policy-v2.1.pdf', 245760, 'application/pdf', 1),
    (2, NULL, 'policy-2-access-control-template.docx', 'Access Control Template.docx', '/files/policy-2-access-control-template.docx', 51200, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 1)
ON CONFLICT DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE policies IS 'Main table for storing policies with version tracking';
COMMENT ON TABLE policy_versions IS 'Stores all versions of policies for audit trail';
COMMENT ON TABLE policy_attachments IS 'Stores file attachments related to policies and versions';
COMMENT ON TABLE procedures IS 'Stores procedures linked to policies';
COMMENT ON TABLE procedure_executions IS 'Tracks execution of procedures';
COMMENT ON TABLE policy_activities IS 'Audit trail for all policy-related activities';

-- Grant permissions (adjust as needed for your setup)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
