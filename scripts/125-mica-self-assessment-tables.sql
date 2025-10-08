-- MICA Self-Assessment Tables
CREATE TABLE IF NOT EXISTS mica_self_assessments (
    id SERIAL PRIMARY KEY,
    assessment_name VARCHAR(255) NOT NULL,
    organization_id INTEGER REFERENCES organizations(id),
    assessment_period VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Draft',
    overall_maturity_score DECIMAL(5,2),
    completion_percentage INTEGER DEFAULT 0,
    started_date DATE DEFAULT CURRENT_DATE,
    completed_date DATE,
    reviewed_by VARCHAR(255),
    approved_by VARCHAR(255),
    approval_date DATE,
    executive_summary TEXT,
    key_strengths TEXT,
    improvement_areas TEXT,
    strategic_recommendations TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT mica_self_assessment_status_check CHECK (status IN ('Draft', 'In Progress', 'Under Review', 'Completed', 'Approved'))
);

-- MICA Self-Assessment Control Responses
CREATE TABLE IF NOT EXISTS mica_self_assessment_controls (
    id SERIAL PRIMARY KEY,
    self_assessment_id INTEGER REFERENCES mica_self_assessments(id) ON DELETE CASCADE,
    requirement_id INTEGER REFERENCES mica_requirements(id),
    maturity_level INTEGER CHECK (maturity_level >= 0 AND maturity_level <= 5),
    implementation_status VARCHAR(50),
    evidence_description TEXT,
    control_effectiveness VARCHAR(50),
    improvement_opportunities TEXT,
    action_plan TEXT,
    responsible_owner VARCHAR(255),
    target_completion_date DATE,
    comments TEXT,
    last_reviewed_date DATE,
    reviewer_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT mica_self_implementation_status_check CHECK (implementation_status IN ('Not Implemented', 'Partially Implemented', 'Largely Implemented', 'Fully Implemented')),
    CONSTRAINT mica_self_effectiveness_check CHECK (control_effectiveness IN ('Ineffective', 'Partially Effective', 'Largely Effective', 'Fully Effective'))
);

-- MICA Self-Assessment Audit Trail
CREATE TABLE IF NOT EXISTS mica_self_assessment_audit (
    id SERIAL PRIMARY KEY,
    self_assessment_id INTEGER REFERENCES mica_self_assessments(id) ON DELETE CASCADE,
    control_id INTEGER REFERENCES mica_self_assessment_controls(id),
    action_type VARCHAR(50) NOT NULL,
    field_changed VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    changed_by VARCHAR(255),
    change_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mica_self_assessments_org ON mica_self_assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_mica_self_assessments_status ON mica_self_assessments(status);
CREATE INDEX IF NOT EXISTS idx_mica_self_controls_assessment ON mica_self_assessment_controls(self_assessment_id);
CREATE INDEX IF NOT EXISTS idx_mica_self_controls_requirement ON mica_self_assessment_controls(requirement_id);
CREATE INDEX IF NOT EXISTS idx_mica_self_audit_assessment ON mica_self_assessment_audit(self_assessment_id);

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_mica_self_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mica_self_assessments_updated_at
    BEFORE UPDATE ON mica_self_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_self_assessments_updated_at();

CREATE OR REPLACE FUNCTION update_mica_self_controls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mica_self_controls_updated_at
    BEFORE UPDATE ON mica_self_assessment_controls
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_self_controls_updated_at();
