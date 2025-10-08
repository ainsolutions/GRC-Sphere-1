-- Additional MICA assessment tables for comprehensive assessment management

-- MICA Assessment Templates table
CREATE TABLE IF NOT EXISTS mica_assessment_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name VARCHAR(200) NOT NULL,
    description TEXT,
    template_type VARCHAR(50) NOT NULL, -- comprehensive, focused, quick_check
    applicable_categories TEXT[], -- Array of applicable requirement categories
    assessment_criteria JSONB, -- Structured assessment criteria
    scoring_methodology TEXT,
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT mica_assessment_templates_type_check 
        CHECK (template_type IN ('comprehensive', 'focused', 'quick_check'))
);

-- MICA Assessment Evidence table
CREATE TABLE IF NOT EXISTS mica_assessment_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_result_id UUID NOT NULL REFERENCES mica_assessment_results(id) ON DELETE CASCADE,
    evidence_type VARCHAR(100) NOT NULL, -- document, screenshot, system_output, interview_notes
    evidence_title VARCHAR(200) NOT NULL,
    evidence_description TEXT,
    file_path VARCHAR(500), -- Path to stored evidence file
    file_size BIGINT,
    file_type VARCHAR(50),
    uploaded_by VARCHAR(100),
    upload_date TIMESTAMP DEFAULT NOW(),
    is_confidential BOOLEAN DEFAULT false,
    retention_period_months INTEGER DEFAULT 84, -- 7 years default retention
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT mica_assessment_evidence_type_check 
        CHECK (evidence_type IN ('document', 'screenshot', 'system_output', 'interview_notes', 'other'))
);

-- MICA Assessment Findings table
CREATE TABLE IF NOT EXISTS mica_assessment_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES mica_assessments(id) ON DELETE CASCADE,
    requirement_id UUID REFERENCES mica_requirements(id),
    finding_type VARCHAR(50) NOT NULL, -- deficiency, observation, best_practice
    severity VARCHAR(20) NOT NULL, -- critical, high, medium, low
    finding_title VARCHAR(200) NOT NULL,
    finding_description TEXT NOT NULL,
    root_cause_analysis TEXT,
    business_impact TEXT,
    recommended_actions TEXT,
    management_response TEXT,
    target_resolution_date DATE,
    actual_resolution_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'open', -- open, in_progress, resolved, closed
    assigned_to VARCHAR(100),
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT mica_assessment_findings_type_check 
        CHECK (finding_type IN ('deficiency', 'observation', 'best_practice')),
    CONSTRAINT mica_assessment_findings_severity_check 
        CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    CONSTRAINT mica_assessment_findings_status_check 
        CHECK (status IN ('open', 'in_progress', 'resolved', 'closed'))
);

-- MICA Assessment Action Plans table
CREATE TABLE IF NOT EXISTS mica_assessment_action_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES mica_assessments(id) ON DELETE CASCADE,
    finding_id UUID REFERENCES mica_assessment_findings(id),
    action_title VARCHAR(200) NOT NULL,
    action_description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL, -- critical, high, medium, low
    assigned_to VARCHAR(100) NOT NULL,
    assigned_to_email VARCHAR(255),
    estimated_effort_hours INTEGER,
    estimated_cost DECIMAL(12,2),
    target_completion_date DATE NOT NULL,
    actual_completion_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'not_started', -- not_started, in_progress, completed, overdue, cancelled
    completion_percentage INTEGER DEFAULT 0,
    status_notes TEXT,
    dependencies TEXT,
    deliverables TEXT[],
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT mica_assessment_action_plans_priority_check 
        CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    CONSTRAINT mica_assessment_action_plans_status_check 
        CHECK (status IN ('not_started', 'in_progress', 'completed', 'overdue', 'cancelled')),
    CONSTRAINT mica_assessment_action_plans_completion_check 
        CHECK (completion_percentage >= 0 AND completion_percentage <= 100)
);

-- MICA Assessment Reviews table
CREATE TABLE IF NOT EXISTS mica_assessment_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES mica_assessments(id) ON DELETE CASCADE,
    reviewer_name VARCHAR(100) NOT NULL,
    reviewer_email VARCHAR(255) NOT NULL,
    reviewer_role VARCHAR(100),
    review_type VARCHAR(50) NOT NULL, -- quality_review, management_review, independent_review
    review_status VARCHAR(30) NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, approved, rejected
    review_comments TEXT,
    recommendations TEXT,
    approval_status VARCHAR(30), -- approved, rejected, conditional_approval
    approval_conditions TEXT,
    review_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT mica_assessment_reviews_type_check 
        CHECK (review_type IN ('quality_review', 'management_review', 'independent_review')),
    CONSTRAINT mica_assessment_reviews_status_check 
        CHECK (review_status IN ('pending', 'in_progress', 'completed', 'approved', 'rejected')),
    CONSTRAINT mica_assessment_reviews_approval_check 
        CHECK (approval_status IN ('approved', 'rejected', 'conditional_approval'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mica_assessment_templates_type ON mica_assessment_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_mica_assessment_templates_active ON mica_assessment_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_mica_assessment_evidence_result ON mica_assessment_evidence(assessment_result_id);
CREATE INDEX IF NOT EXISTS idx_mica_assessment_evidence_type ON mica_assessment_evidence(evidence_type);
CREATE INDEX IF NOT EXISTS idx_mica_assessment_findings_assessment ON mica_assessment_findings(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mica_assessment_findings_severity ON mica_assessment_findings(severity);
CREATE INDEX IF NOT EXISTS idx_mica_assessment_findings_status ON mica_assessment_findings(status);
CREATE INDEX IF NOT EXISTS idx_mica_assessment_action_plans_assessment ON mica_assessment_action_plans(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mica_assessment_action_plans_assigned ON mica_assessment_action_plans(assigned_to);
CREATE INDEX IF NOT EXISTS idx_mica_assessment_action_plans_status ON mica_assessment_action_plans(status);
CREATE INDEX IF NOT EXISTS idx_mica_assessment_reviews_assessment ON mica_assessment_reviews(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mica_assessment_reviews_status ON mica_assessment_reviews(review_status);

-- Insert sample assessment template
INSERT INTO mica_assessment_templates (
    template_name, description, template_type, applicable_categories, 
    assessment_criteria, scoring_methodology, created_by
) VALUES (
    'MICA Comprehensive Assessment Template',
    'Complete assessment template covering all MICA requirements across all categories',
    'comprehensive',
    ARRAY['Authorization', 'Operational', 'Custody', 'Market Abuse', 'Transparency', 'Consumer Protection', 'AML/CFT', 'Governance', 'Technology', 'Financial', 'Reporting'],
    '{
        "scoring_scale": {
            "compliant": {"score": 100, "description": "Fully compliant with requirement"},
            "partially_compliant": {"score": 50, "description": "Partially compliant, minor gaps identified"},
            "non_compliant": {"score": 0, "description": "Non-compliant, significant gaps identified"}
        },
        "evidence_requirements": {
            "mandatory": ["Policy documents", "Procedures", "System evidence"],
            "optional": ["Training records", "Audit reports", "Management reports"]
        },
        "assessment_approach": "Risk-based assessment focusing on high-risk areas first"
    }',
    'Risk-based scoring with weighted categories based on regulatory importance and business impact',
    'System Administrator'
);

-- Add triggers for updated_at timestamps
CREATE TRIGGER trigger_update_mica_assessment_templates_updated_at
    BEFORE UPDATE ON mica_assessment_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_requirements_updated_at();

CREATE TRIGGER trigger_update_mica_assessment_findings_updated_at
    BEFORE UPDATE ON mica_assessment_findings
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_requirements_updated_at();

CREATE TRIGGER trigger_update_mica_assessment_action_plans_updated_at
    BEFORE UPDATE ON mica_assessment_action_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_requirements_updated_at();

CREATE TRIGGER trigger_update_mica_assessment_reviews_updated_at
    BEFORE UPDATE ON mica_assessment_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_requirements_updated_at();

COMMIT;
