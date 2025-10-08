-- MICA Gap Analysis Table
CREATE TABLE IF NOT EXISTS mica_gap_analysis (
    id SERIAL PRIMARY KEY,
    analysis_name VARCHAR(255) NOT NULL,
    organization_id INTEGER REFERENCES organizations(id),
    assessment_id INTEGER REFERENCES mica_assessments(id),
    analysis_date DATE DEFAULT CURRENT_DATE,
    analyst_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'In Progress',
    overall_gap_score DECIMAL(5,2),
    critical_gaps_count INTEGER DEFAULT 0,
    high_gaps_count INTEGER DEFAULT 0,
    medium_gaps_count INTEGER DEFAULT 0,
    low_gaps_count INTEGER DEFAULT 0,
    executive_summary TEXT,
    methodology_used TEXT,
    key_findings TEXT,
    priority_recommendations TEXT,
    resource_requirements TEXT,
    timeline_estimate TEXT,
    budget_estimate DECIMAL(12,2),
    business_impact_assessment TEXT,
    risk_implications TEXT,
    next_steps TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT mica_gap_analysis_status_check CHECK (status IN ('Draft', 'In Progress', 'Under Review', 'Completed', 'Approved'))
);

-- MICA Gap Analysis Details
CREATE TABLE IF NOT EXISTS mica_gap_analysis_details (
    id SERIAL PRIMARY KEY,
    gap_analysis_id INTEGER REFERENCES mica_gap_analysis(id) ON DELETE CASCADE,
    requirement_id INTEGER REFERENCES mica_requirements(id),
    current_state_description TEXT,
    target_state_description TEXT,
    gap_description TEXT NOT NULL,
    gap_severity VARCHAR(20) DEFAULT 'Medium',
    business_impact VARCHAR(20) DEFAULT 'Medium',
    technical_complexity VARCHAR(20) DEFAULT 'Medium',
    estimated_effort_hours INTEGER,
    estimated_cost DECIMAL(10,2),
    recommended_solution TEXT,
    implementation_approach TEXT,
    dependencies TEXT,
    risks_and_challenges TEXT,
    success_criteria TEXT,
    priority_ranking INTEGER,
    target_completion_date DATE,
    assigned_owner VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Identified',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT mica_gap_severity_check CHECK (gap_severity IN ('Critical', 'High', 'Medium', 'Low')),
    CONSTRAINT mica_gap_business_impact_check CHECK (business_impact IN ('Critical', 'High', 'Medium', 'Low')),
    CONSTRAINT mica_gap_complexity_check CHECK (technical_complexity IN ('Low', 'Medium', 'High', 'Very High')),
    CONSTRAINT mica_gap_detail_status_check CHECK (status IN ('Identified', 'Analyzed', 'Planned', 'In Progress', 'Resolved', 'Deferred'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mica_gap_analysis_org ON mica_gap_analysis(organization_id);
CREATE INDEX IF NOT EXISTS idx_mica_gap_analysis_assessment ON mica_gap_analysis(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mica_gap_analysis_status ON mica_gap_analysis(status);
CREATE INDEX IF NOT EXISTS idx_mica_gap_details_analysis ON mica_gap_analysis_details(gap_analysis_id);
CREATE INDEX IF NOT EXISTS idx_mica_gap_details_requirement ON mica_gap_analysis_details(requirement_id);
CREATE INDEX IF NOT EXISTS idx_mica_gap_details_severity ON mica_gap_analysis_details(gap_severity);

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_mica_gap_analysis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mica_gap_analysis_updated_at
    BEFORE UPDATE ON mica_gap_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_gap_analysis_updated_at();

CREATE OR REPLACE FUNCTION update_mica_gap_details_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_mica_gap_details_updated_at
    BEFORE UPDATE ON mica_gap_analysis_details
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_gap_details_updated_at();
