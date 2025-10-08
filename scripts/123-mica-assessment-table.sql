-- MICA Assessment Table
CREATE TABLE IF NOT EXISTS mica_assessments (
    id SERIAL PRIMARY KEY,
    assessment_name VARCHAR(255) NOT NULL,
    assessment_type VARCHAR(100) DEFAULT 'Self-Assessment',
    organization_id INTEGER REFERENCES organizations(id),
    assessor_name VARCHAR(255),
    assessment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'In Progress',
    scope_description TEXT,
    methodology TEXT,
    overall_score DECIMAL(5,2),
    maturity_level VARCHAR(50),
    executive_summary TEXT,
    key_findings TEXT,
    recommendations TEXT,
    next_review_date DATE,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT mica_assessments_status_check CHECK (status IN ('Draft', 'In Progress', 'Under Review', 'Completed', 'Approved'))
);

-- MICA Assessment Results Table
CREATE TABLE IF NOT EXISTS mica_assessment_results (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES mica_assessments(id) ON DELETE CASCADE,
    requirement_id INTEGER REFERENCES mica_requirements(id),
    compliance_status VARCHAR(50) NOT NULL,
    implementation_score INTEGER CHECK (implementation_score >= 0 AND implementation_score <= 100),
    evidence_provided TEXT,
    gaps_identified TEXT,
    remediation_plan TEXT,
    target_completion_date DATE,
    responsible_party VARCHAR(255),
    comments TEXT,
    assessor_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT mica_results_compliance_status_check CHECK (compliance_status IN ('Compliant', 'Partially Compliant', 'Non-Compliant', 'Not Applicable', 'Not Assessed'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mica_assessments_org ON mica_assessments(organization_id);
CREATE INDEX IF NOT EXISTS idx_mica_assessments_status ON mica_assessments(status);
CREATE INDEX IF NOT EXISTS idx_mica_assessments_date ON mica_assessments(assessment_date);
CREATE INDEX IF NOT EXISTS idx_mica_results_assessment ON mica_assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mica_results_requirement ON mica_assessment_results(requirement_id);
CREATE INDEX IF NOT EXISTS idx_mica_results_status ON mica_assessment_results(compliance_status);

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_mica_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mica_assessments_updated_at
    BEFORE UPDATE ON mica_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_assessments_updated_at();

CREATE OR REPLACE FUNCTION update_mica_assessment_results_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mica_assessment_results_updated_at
    BEFORE UPDATE ON mica_assessment_results
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_assessment_results_updated_at();
