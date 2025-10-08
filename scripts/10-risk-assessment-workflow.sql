-- Risk Assessment Workflows Table
CREATE TABLE risk_assessment_workflows (
    id SERIAL PRIMARY KEY,
    workflow_id VARCHAR(50) UNIQUE NOT NULL,
    workflow_name VARCHAR(255) NOT NULL,
    description TEXT,
    methodology VARCHAR(100) NOT NULL, -- 'ISO27001', 'NIST', 'OCTAVE', 'FAIR'
    scope TEXT,
    assessment_type VARCHAR(100), -- 'Initial', 'Annual', 'Triggered', 'Continuous'
    status VARCHAR(50) DEFAULT 'Draft', -- 'Draft', 'In Progress', 'Review', 'Approved', 'Completed'
    created_by VARCHAR(255),
    assigned_to VARCHAR(255),
    start_date DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    approval_date DATE,
    approved_by VARCHAR(255),
    executive_summary TEXT,
    overall_risk_rating VARCHAR(50),
    recommendations TEXT,
    next_review_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risk Assessment Steps Table (for workflow tracking)
CREATE TABLE risk_assessment_steps (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES risk_assessment_workflows(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    step_name VARCHAR(255) NOT NULL,
    step_description TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- 'Pending', 'In Progress', 'Completed', 'Skipped'
    assigned_to VARCHAR(255),
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risk Assessment Scope Table
CREATE TABLE risk_assessment_scope (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES risk_assessment_workflows(id) ON DELETE CASCADE,
    scope_type VARCHAR(100), -- 'Business Unit', 'System', 'Process', 'Location', 'Asset'
    scope_name VARCHAR(255),
    scope_description TEXT,
    inclusion_criteria TEXT,
    exclusion_criteria TEXT,
    business_impact VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risk Assessment Context Table
CREATE TABLE risk_assessment_context (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES risk_assessment_workflows(id) ON DELETE CASCADE,
    business_objectives TEXT,
    regulatory_requirements TEXT,
    stakeholder_expectations TEXT,
    risk_appetite TEXT,
    risk_tolerance TEXT,
    internal_context TEXT,
    external_context TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risk Assessment Criteria Table
CREATE TABLE risk_assessment_criteria (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES risk_assessment_workflows(id) ON DELETE CASCADE,
    likelihood_scale JSONB, -- JSON array of likelihood levels with descriptions
    impact_scale JSONB, -- JSON array of impact levels with descriptions
    risk_matrix JSONB, -- JSON representation of the risk matrix
    acceptance_criteria TEXT,
    escalation_criteria TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workflow Risk Assessments (linking individual risks to workflows)
CREATE TABLE workflow_risk_assessments (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES risk_assessment_workflows(id) ON DELETE CASCADE,
    risk_id INTEGER REFERENCES risks(id) ON DELETE CASCADE,
    assessment_notes TEXT,
    mitigation_strategy TEXT,
    treatment_option VARCHAR(100), -- 'Accept', 'Mitigate', 'Transfer', 'Avoid'
    treatment_plan TEXT,
    treatment_owner VARCHAR(255),
    treatment_deadline DATE,
    monitoring_requirements TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risk Assessment Reviews Table
CREATE TABLE risk_assessment_reviews (
    id SERIAL PRIMARY KEY,
    workflow_id INTEGER REFERENCES risk_assessment_workflows(id) ON DELETE CASCADE,
    reviewer_name VARCHAR(255),
    reviewer_role VARCHAR(100),
    review_date DATE,
    review_status VARCHAR(50), -- 'Approved', 'Rejected', 'Requires Changes'
    comments TEXT,
    recommendations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Risk Assessment Templates Table
CREATE TABLE risk_assessment_templates (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    methodology VARCHAR(100) NOT NULL,
    description TEXT,
    default_steps JSONB, -- JSON array of default steps
    default_criteria JSONB, -- Default risk criteria
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_workflow_status ON risk_assessment_workflows(status);
CREATE INDEX idx_workflow_methodology ON risk_assessment_workflows(methodology);
CREATE INDEX idx_workflow_created_by ON risk_assessment_workflows(created_by);
CREATE INDEX idx_workflow_assigned_to ON risk_assessment_workflows(assigned_to);
CREATE INDEX idx_steps_workflow_id ON risk_assessment_steps(workflow_id);
CREATE INDEX idx_scope_workflow_id ON risk_assessment_scope(workflow_id);
CREATE INDEX idx_context_workflow_id ON risk_assessment_context(workflow_id);
CREATE INDEX idx_criteria_workflow_id ON risk_assessment_criteria(workflow_id);
CREATE INDEX idx_workflow_risks_workflow_id ON workflow_risk_assessments(workflow_id);
CREATE INDEX idx_reviews_workflow_id ON risk_assessment_reviews(workflow_id);
