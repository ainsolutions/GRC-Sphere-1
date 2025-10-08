-- Create policy version history table
CREATE TABLE IF NOT EXISTS policy_versions (
    id SERIAL PRIMARY KEY,
    policy_id INTEGER REFERENCES policies(id) ON DELETE CASCADE,
    version VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    change_summary TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'under_review', 'approved', 'published', 'archived')),
    effective_date DATE,
    review_date DATE,
    next_review_date DATE,
    tags TEXT[],
    created_by INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_current BOOLEAN DEFAULT FALSE
);

-- Create policy attachments table for file uploads
CREATE TABLE IF NOT EXISTS policy_attachments (
    id SERIAL PRIMARY KEY,
    policy_id INTEGER REFERENCES policies(id) ON DELETE CASCADE,
    version_id INTEGER REFERENCES policy_versions(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64),
    uploaded_by INTEGER DEFAULT 1,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create policy activities table for audit trail
CREATE TABLE IF NOT EXISTS policy_activities (
    id SERIAL PRIMARY KEY,
    policy_id INTEGER REFERENCES policies(id) ON DELETE CASCADE,
    version_id INTEGER REFERENCES policy_versions(id) ON DELETE SET NULL,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    user_id INTEGER DEFAULT 1,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_policy_versions_policy_id ON policy_versions(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_versions_version ON policy_versions(policy_id, version);
CREATE INDEX IF NOT EXISTS idx_policy_versions_current ON policy_versions(policy_id, is_current);
CREATE INDEX IF NOT EXISTS idx_policy_attachments_policy_id ON policy_attachments(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_attachments_version_id ON policy_attachments(version_id);
CREATE INDEX IF NOT EXISTS idx_policy_activities_policy_id ON policy_activities(policy_id);

-- Function to create new policy version
CREATE OR REPLACE FUNCTION create_policy_version(
    p_policy_id INTEGER,
    p_change_summary TEXT DEFAULT NULL
) RETURNS INTEGER AS $$
DECLARE
    v_version_id INTEGER;
    v_next_version VARCHAR(10);
    v_policy RECORD;
BEGIN
    -- Get current policy data
    SELECT * INTO v_policy FROM policies WHERE id = p_policy_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Policy not found';
    END IF;
    
    -- Generate next version number
    SELECT COALESCE(
        'v' || (MAX(CAST(SUBSTRING(version FROM 2) AS DECIMAL)) + 0.1)::TEXT,
        'v1.1'
    ) INTO v_next_version
    FROM policy_versions 
    WHERE policy_id = p_policy_id;
    
    -- Mark current version as not current
    UPDATE policy_versions SET is_current = FALSE WHERE policy_id = p_policy_id;
    
    -- Create new version record
    INSERT INTO policy_versions (
        policy_id, version, title, description, content, change_summary,
        status, effective_date, review_date, next_review_date, tags,
        created_by, is_current
    ) VALUES (
        p_policy_id, v_next_version, v_policy.title, v_policy.description, 
        v_policy.content, p_change_summary, v_policy.status, v_policy.effective_date,
        v_policy.review_date, v_policy.next_review_date, v_policy.tags,
        v_policy.updated_by, TRUE
    ) RETURNING id INTO v_version_id;
    
    -- Update policy version
    UPDATE policies SET version = v_next_version WHERE id = p_policy_id;
    
    -- Log activity
    INSERT INTO policy_activities (policy_id, version_id, activity_type, description, user_id)
    VALUES (p_policy_id, v_version_id, 'version_created', 
            'New version ' || v_next_version || ' created', v_policy.updated_by);
    
    RETURN v_version_id;
END;
$$ LANGUAGE plpgsql;

-- Function to rollback to previous version
CREATE OR REPLACE FUNCTION rollback_policy_version(
    p_policy_id INTEGER,
    p_target_version_id INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    v_target_version RECORD;
BEGIN
    -- Get target version data
    SELECT * INTO v_target_version FROM policy_versions 
    WHERE id = p_target_version_id AND policy_id = p_policy_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Target version not found';
    END IF;
    
    -- Update policy with target version data
    UPDATE policies SET
        title = v_target_version.title,
        description = v_target_version.description,
        content = v_target_version.content,
        status = v_target_version.status,
        effective_date = v_target_version.effective_date,
        review_date = v_target_version.review_date,
        next_review_date = v_target_version.next_review_date,
        tags = v_target_version.tags,
        version = v_target_version.version,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_policy_id;
    
    -- Mark target version as current
    UPDATE policy_versions SET is_current = FALSE WHERE policy_id = p_policy_id;
    UPDATE policy_versions SET is_current = TRUE WHERE id = p_target_version_id;
    
    -- Log activity
    INSERT INTO policy_activities (policy_id, version_id, activity_type, description, user_id)
    VALUES (p_policy_id, p_target_version_id, 'version_rollback', 
            'Rolled back to version ' || v_target_version.version, 1);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
