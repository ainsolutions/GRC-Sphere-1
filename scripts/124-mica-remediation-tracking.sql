-- MICA Remediation Tracking Tables
CREATE TABLE IF NOT EXISTS mica_remediation_plans (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES mica_assessments(id),
    requirement_id INTEGER REFERENCES mica_requirements(id),
    gap_description TEXT NOT NULL,
    remediation_action TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'Medium',
    status VARCHAR(50) DEFAULT 'Open',
    assigned_to VARCHAR(255),
    target_date DATE,
    actual_completion_date DATE,
    estimated_cost DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    business_impact TEXT,
    technical_complexity VARCHAR(20) DEFAULT 'Medium',
    dependencies TEXT,
    progress_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT mica_remediation_priority_check CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
    CONSTRAINT mica_remediation_status_check CHECK (status IN ('Open', 'In Progress', 'On Hold', 'Completed', 'Cancelled')),
    CONSTRAINT mica_remediation_complexity_check CHECK (technical_complexity IN ('Low', 'Medium', 'High', 'Very High'))
);

-- MICA Remediation Updates Table
CREATE TABLE IF NOT EXISTS mica_remediation_updates (
    id SERIAL PRIMARY KEY,
    remediation_id INTEGER REFERENCES mica_remediation_plans(id) ON DELETE CASCADE,
    update_date DATE DEFAULT CURRENT_DATE,
    status_update VARCHAR(50),
    progress_percentage INTEGER CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    update_description TEXT,
    challenges_faced TEXT,
    next_steps TEXT,
    updated_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mica_remediation_assessment ON mica_remediation_plans(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_requirement ON mica_remediation_plans(requirement_id);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_status ON mica_remediation_plans(status);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_priority ON mica_remediation_plans(priority);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_target_date ON mica_remediation_plans(target_date);
CREATE INDEX IF NOT EXISTS idx_mica_updates_remediation ON mica_remediation_updates(remediation_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_mica_remediation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mica_remediation_updated_at
    BEFORE UPDATE ON mica_remediation_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_remediation_updated_at();
