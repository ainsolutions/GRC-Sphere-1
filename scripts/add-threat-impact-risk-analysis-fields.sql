-- Add impact and risk analysis fields to threats table
-- This script adds the missing fields for comprehensive threat analysis

-- Add impact_analysis field
ALTER TABLE threats
ADD COLUMN IF NOT EXISTS impact_analysis TEXT;

-- Add risk_analysis field
ALTER TABLE threats
ADD COLUMN IF NOT EXISTS risk_analysis TEXT;

-- Add threat_analysis field (for AI-generated analysis)
ALTER TABLE threats
ADD COLUMN IF NOT EXISTS threat_analysis TEXT;

-- Add organization_id for multi-tenancy support
ALTER TABLE threats
ADD COLUMN IF NOT EXISTS organization_id INTEGER DEFAULT 1;

-- Add user_id to track who created/updated the threat
ALTER TABLE threats
ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id);
ALTER TABLE threats
ADD COLUMN IF NOT EXISTS updated_by INTEGER REFERENCES users(id);

-- Add department_id for organizational structure
ALTER TABLE threats
ADD COLUMN IF NOT EXISTS department_id INTEGER REFERENCES departments(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_threats_organization_id ON threats(organization_id);
CREATE INDEX IF NOT EXISTS idx_threats_created_by ON threats(created_by);
CREATE INDEX IF NOT EXISTS idx_threats_updated_by ON threats(updated_by);
CREATE INDEX IF NOT EXISTS idx_threats_department_id ON threats(department_id);

-- Update existing records to have default organization_id
UPDATE threats
SET organization_id = 1
WHERE organization_id IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN threats.impact_analysis IS 'Detailed analysis of the threat''s potential impact on the organization';
COMMENT ON COLUMN threats.risk_analysis IS 'Comprehensive risk assessment including likelihood, severity, and mitigation recommendations';
COMMENT ON COLUMN threats.threat_analysis IS 'AI-generated analysis of the threat';
COMMENT ON COLUMN threats.organization_id IS 'Organization ID for multi-tenancy support';
COMMENT ON COLUMN threats.created_by IS 'User who created the threat record';
COMMENT ON COLUMN threats.updated_by IS 'User who last updated the threat record';
COMMENT ON COLUMN threats.department_id IS 'Department responsible for this threat';

-- Log the schema changes
INSERT INTO admin.audit_log (
    table_name,
    operation,
    old_values,
    new_values,
    changed_by,
    changed_at
) VALUES (
    'threats',
    'ALTER',
    '{"fields": ["id", "threat_id", "name", "description", "category", "source", "threat_level", "status", "indicators_of_compromise", "mitigation_strategies", "threat_references", "created_at", "updated_at"]}',
    '{"added_fields": ["impact_analysis", "risk_analysis", "threat_analysis", "organization_id", "created_by", "updated_by", "department_id"]}',
    'system',
    CURRENT_TIMESTAMP
);
