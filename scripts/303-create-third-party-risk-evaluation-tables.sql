-- Create comprehensive third party risk evaluation and gap analysis tables
-- These tables will integrate with existing vendors and contracts tables

-- Third Party Risk Evaluations (main assessment table)
CREATE TABLE IF NOT EXISTS third_party_risk_evaluations (
    id SERIAL PRIMARY KEY,
    evaluation_id VARCHAR(50) UNIQUE NOT NULL DEFAULT 'TPR-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('third_party_risk_evaluations_id_seq')::TEXT, 4, '0'),
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    contract_id INTEGER REFERENCES contracts(id) ON DELETE SET NULL,
    evaluation_name VARCHAR(255) NOT NULL,
    evaluation_type VARCHAR(50) DEFAULT 'Comprehensive' CHECK (evaluation_type IN ('Initial', 'Annual', 'Comprehensive', 'Targeted', 'Incident-Driven')),
    evaluation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    evaluator_name VARCHAR(255) NOT NULL,
    evaluator_email VARCHAR(255),
    evaluation_status VARCHAR(50) DEFAULT 'In Progress' CHECK (evaluation_status IN ('Draft', 'In Progress', 'Under Review', 'Completed', 'Approved')),
    
    -- Risk Scoring
    overall_risk_score NUMERIC(5,2) DEFAULT 0,
    overall_risk_level VARCHAR(20) DEFAULT 'Low' CHECK (overall_risk_level IN ('Low', 'Medium', 'High', 'Critical')),
    inherent_risk_score NUMERIC(5,2) DEFAULT 0,
    residual_risk_score NUMERIC(5,2) DEFAULT 0,
    
    -- Category Scores
    security_score NUMERIC(5,2) DEFAULT 0,
    operational_score NUMERIC(5,2) DEFAULT 0,
    financial_score NUMERIC(5,2) DEFAULT 0,
    compliance_score NUMERIC(5,2) DEFAULT 0,
    privacy_score NUMERIC(5,2) DEFAULT 0,
    business_continuity_score NUMERIC(5,2) DEFAULT 0,
    
    -- Assessment Summary
    total_questions INTEGER DEFAULT 0,
    answered_questions INTEGER DEFAULT 0,
    high_risk_findings INTEGER DEFAULT 0,
    medium_risk_findings INTEGER DEFAULT 0,
    low_risk_findings INTEGER DEFAULT 0,
    
    -- Metadata
    scope TEXT,
    methodology TEXT,
    executive_summary TEXT,
    key_findings TEXT,
    recommendations TEXT,
    next_review_date DATE,
    approved_by VARCHAR(255),
    approved_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Third Party Risk Questions (questionnaire items)
CREATE TABLE IF NOT EXISTS third_party_risk_questions (
    id SERIAL PRIMARY KEY,
    question_id VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('Security & Data Protection', 'Privacy & Data Handling', 'Operational Risk', 'Financial Stability', 'Compliance & Regulatory', 'Business Continuity')),
    subcategory VARCHAR(100),
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'Multiple Choice' CHECK (question_type IN ('Multiple Choice', 'Yes/No', 'Scale', 'Text', 'File Upload')),
    response_options JSONB, -- For multiple choice options
    weight NUMERIC(3,2) DEFAULT 1.0,
    is_mandatory BOOLEAN DEFAULT true,
    compliance_frameworks TEXT[], -- ISO27001, SOC2, GDPR, etc.
    best_practice_guidance TEXT,
    risk_impact_description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Third Party Risk Responses (answers to questions)
CREATE TABLE IF NOT EXISTS third_party_risk_responses (
    id SERIAL PRIMARY KEY,
    evaluation_id INTEGER REFERENCES third_party_risk_evaluations(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES third_party_risk_questions(id) ON DELETE CASCADE,
    response_value TEXT,
    response_score NUMERIC(5,2) DEFAULT 0,
    risk_level VARCHAR(20) DEFAULT 'Low' CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
    evidence_provided TEXT,
    evidence_files JSONB, -- Array of file references
    assessor_notes TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(evaluation_id, question_id)
);

-- Third Party Gap Analysis (identified gaps and remediation)
CREATE TABLE IF NOT EXISTS third_party_gap_analysis (
    id SERIAL PRIMARY KEY,
    gap_id VARCHAR(50) UNIQUE NOT NULL DEFAULT 'GAP-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('third_party_gap_analysis_id_seq')::TEXT, 4, '0'),
    evaluation_id INTEGER REFERENCES third_party_risk_evaluations(id) ON DELETE CASCADE,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES third_party_risk_questions(id) ON DELETE SET NULL,
    
    -- Gap Details
    gap_title VARCHAR(255) NOT NULL,
    gap_description TEXT NOT NULL,
    gap_category VARCHAR(100) NOT NULL,
    current_state TEXT,
    target_state TEXT,
    gap_severity VARCHAR(20) DEFAULT 'Medium' CHECK (gap_severity IN ('Low', 'Medium', 'High', 'Critical')),
    
    -- Risk Assessment
    likelihood VARCHAR(20) DEFAULT 'Medium' CHECK (likelihood IN ('Very Low', 'Low', 'Medium', 'High', 'Very High')),
    impact VARCHAR(20) DEFAULT 'Medium' CHECK (impact IN ('Very Low', 'Low', 'Medium', 'High', 'Very High')),
    risk_score NUMERIC(5,2) DEFAULT 0,
    business_impact TEXT,
    regulatory_impact TEXT,
    
    -- Remediation Planning
    remediation_strategy TEXT,
    recommended_actions TEXT,
    responsible_party VARCHAR(255),
    vendor_responsible_party VARCHAR(255),
    target_completion_date DATE,
    estimated_effort VARCHAR(50), -- Hours, Days, Weeks, Months
    estimated_cost NUMERIC(12,2),
    priority_ranking INTEGER DEFAULT 5, -- 1-10 scale
    
    -- Implementation Tracking
    remediation_status VARCHAR(50) DEFAULT 'Identified' CHECK (remediation_status IN ('Identified', 'Planned', 'In Progress', 'Under Review', 'Completed', 'Accepted Risk', 'Deferred')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    actual_completion_date DATE,
    actual_cost NUMERIC(12,2),
    actual_effort VARCHAR(50),
    
    -- Verification
    verification_method TEXT,
    verification_status VARCHAR(50) DEFAULT 'Pending' CHECK (verification_status IN ('Pending', 'In Progress', 'Verified', 'Failed')),
    verification_date DATE,
    verified_by VARCHAR(255),
    verification_evidence TEXT,
    
    -- Dependencies and Constraints
    dependencies TEXT,
    constraints_limitations TEXT,
    alternative_solutions TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Third Party Risk Controls (control mappings and assessments)
CREATE TABLE IF NOT EXISTS third_party_risk_controls (
    id SERIAL PRIMARY KEY,
    evaluation_id INTEGER REFERENCES third_party_risk_evaluations(id) ON DELETE CASCADE,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    control_id VARCHAR(100) NOT NULL,
    control_name VARCHAR(255) NOT NULL,
    control_description TEXT,
    control_category VARCHAR(100),
    control_type VARCHAR(50) CHECK (control_type IN ('Preventive', 'Detective', 'Corrective', 'Compensating')),
    
    -- Implementation Assessment
    implementation_status VARCHAR(50) DEFAULT 'Not Assessed' CHECK (implementation_status IN ('Not Implemented', 'Partially Implemented', 'Implemented', 'Not Applicable', 'Not Assessed')),
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    maturity_level INTEGER CHECK (maturity_level >= 1 AND maturity_level <= 5),
    
    -- Testing and Validation
    testing_status VARCHAR(50) DEFAULT 'Not Tested' CHECK (testing_status IN ('Not Tested', 'Planned', 'In Progress', 'Passed', 'Failed', 'Not Applicable')),
    last_test_date DATE,
    next_test_date DATE,
    testing_frequency VARCHAR(50),
    test_results TEXT,
    
    -- Evidence and Documentation
    evidence_provided TEXT,
    evidence_quality VARCHAR(20) DEFAULT 'Adequate' CHECK (evidence_quality IN ('Inadequate', 'Adequate', 'Good', 'Excellent')),
    documentation_links TEXT[],
    
    -- Gap Analysis
    gaps_identified TEXT,
    improvement_recommendations TEXT,
    remediation_required BOOLEAN DEFAULT false,
    remediation_priority VARCHAR(20) DEFAULT 'Medium' CHECK (remediation_priority IN ('Low', 'Medium', 'High', 'Critical')),
    
    -- Compliance Mapping
    compliance_frameworks TEXT[], -- ISO27001, SOC2, GDPR, etc.
    regulatory_requirements TEXT[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assessed_by VARCHAR(255),
    UNIQUE(evaluation_id, control_id)
);

-- Third Party Risk Remediation Tracking (detailed remediation activities)
CREATE TABLE IF NOT EXISTS third_party_risk_remediation_tracking (
    id SERIAL PRIMARY KEY,
    remediation_id VARCHAR(50) UNIQUE NOT NULL DEFAULT 'REM-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('third_party_risk_remediation_tracking_id_seq')::TEXT, 4, '0'),
    gap_analysis_id INTEGER REFERENCES third_party_gap_analysis(id) ON DELETE CASCADE,
    evaluation_id INTEGER REFERENCES third_party_risk_evaluations(id) ON DELETE CASCADE,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    
    -- Remediation Details
    remediation_title VARCHAR(255) NOT NULL,
    remediation_description TEXT,
    remediation_type VARCHAR(50) CHECK (remediation_type IN ('Process Improvement', 'Technology Implementation', 'Policy Update', 'Training', 'Contract Amendment', 'Control Implementation')),
    
    -- Assignment and Ownership
    assigned_to VARCHAR(255),
    assigned_email VARCHAR(255),
    vendor_contact VARCHAR(255),
    vendor_contact_email VARCHAR(255),
    responsible_department VARCHAR(100),
    
    -- Timeline and Progress
    start_date DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    status VARCHAR(50) DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Under Review', 'Completed', 'Cancelled', 'On Hold')),
    
    -- Resource Planning
    estimated_effort_hours INTEGER,
    actual_effort_hours INTEGER,
    estimated_cost NUMERIC(12,2),
    actual_cost NUMERIC(12,2),
    budget_approved BOOLEAN DEFAULT false,
    budget_approval_date DATE,
    
    -- Risk and Impact
    risk_before_remediation VARCHAR(20),
    risk_after_remediation VARCHAR(20),
    business_impact_assessment TEXT,
    success_criteria TEXT,
    
    -- Verification and Closure
    verification_method TEXT,
    verification_status VARCHAR(50) DEFAULT 'Pending' CHECK (verification_status IN ('Pending', 'In Progress', 'Verified', 'Failed', 'Not Required')),
    verification_date DATE,
    verified_by VARCHAR(255),
    verification_evidence TEXT,
    closure_notes TEXT,
    
    -- Communication and Updates
    last_update_date DATE DEFAULT CURRENT_DATE,
    next_review_date DATE,
    escalation_required BOOLEAN DEFAULT false,
    escalation_date DATE,
    escalation_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Third Party Risk Evidence (supporting documentation)
CREATE TABLE IF NOT EXISTS third_party_risk_evidence (
    id SERIAL PRIMARY KEY,
    evidence_id VARCHAR(50) UNIQUE NOT NULL DEFAULT 'EVD-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('third_party_risk_evidence_id_seq')::TEXT, 4, '0'),
    evaluation_id INTEGER REFERENCES third_party_risk_evaluations(id) ON DELETE CASCADE,
    vendor_id INTEGER REFERENCES vendors(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES third_party_risk_questions(id) ON DELETE SET NULL,
    gap_analysis_id INTEGER REFERENCES third_party_gap_analysis(id) ON DELETE SET NULL,
    remediation_id INTEGER REFERENCES third_party_risk_remediation_tracking(id) ON DELETE SET NULL,
    
    -- Evidence Details
    evidence_name VARCHAR(255) NOT NULL,
    evidence_type VARCHAR(100) CHECK (evidence_type IN ('Document', 'Certificate', 'Report', 'Screenshot', 'Policy', 'Procedure', 'Contract', 'Audit Report', 'Test Results', 'Other')),
    evidence_description TEXT,
    
    -- File Information
    file_name VARCHAR(255),
    file_path VARCHAR(500),
    file_type VARCHAR(50),
    file_size BIGINT,
    file_hash VARCHAR(128),
    
    -- Classification and Metadata
    confidentiality_level VARCHAR(20) DEFAULT 'Internal' CHECK (confidentiality_level IN ('Public', 'Internal', 'Confidential', 'Restricted')),
    evidence_quality VARCHAR(20) DEFAULT 'Adequate' CHECK (evidence_quality IN ('Poor', 'Adequate', 'Good', 'Excellent')),
    source VARCHAR(100), -- Vendor, Internal, Third Party
    collection_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    
    -- Verification
    verified BOOLEAN DEFAULT false,
    verified_by VARCHAR(255),
    verified_date DATE,
    verification_notes TEXT,
    
    -- Retention and Disposal
    retention_period INTEGER, -- in years
    disposal_date DATE,
    disposal_method VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_third_party_risk_evaluations_vendor_id ON third_party_risk_evaluations(vendor_id);
CREATE INDEX IF NOT EXISTS idx_third_party_risk_evaluations_contract_id ON third_party_risk_evaluations(contract_id);
CREATE INDEX IF NOT EXISTS idx_third_party_risk_evaluations_status ON third_party_risk_evaluations(evaluation_status);
CREATE INDEX IF NOT EXISTS idx_third_party_risk_evaluations_risk_level ON third_party_risk_evaluations(overall_risk_level);
CREATE INDEX IF NOT EXISTS idx_third_party_risk_evaluations_date ON third_party_risk_evaluations(evaluation_date);

CREATE INDEX IF NOT EXISTS idx_third_party_risk_questions_category ON third_party_risk_questions(category);
CREATE INDEX IF NOT EXISTS idx_third_party_risk_questions_active ON third_party_risk_questions(is_active);

CREATE INDEX IF NOT EXISTS idx_third_party_risk_responses_evaluation_id ON third_party_risk_responses(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_third_party_risk_responses_question_id ON third_party_risk_responses(question_id);

CREATE INDEX IF NOT EXISTS idx_third_party_gap_analysis_evaluation_id ON third_party_gap_analysis(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_third_party_gap_analysis_vendor_id ON third_party_gap_analysis(vendor_id);
CREATE INDEX IF NOT EXISTS idx_third_party_gap_analysis_status ON third_party_gap_analysis(remediation_status);
CREATE INDEX IF NOT EXISTS idx_third_party_gap_analysis_severity ON third_party_gap_analysis(gap_severity);

CREATE INDEX IF NOT EXISTS idx_third_party_risk_controls_evaluation_id ON third_party_risk_controls(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_third_party_risk_controls_vendor_id ON third_party_risk_controls(vendor_id);

CREATE INDEX IF NOT EXISTS idx_third_party_risk_remediation_tracking_gap_id ON third_party_risk_remediation_tracking(gap_analysis_id);
CREATE INDEX IF NOT EXISTS idx_third_party_risk_remediation_tracking_vendor_id ON third_party_risk_remediation_tracking(vendor_id);
CREATE INDEX IF NOT EXISTS idx_third_party_risk_remediation_tracking_status ON third_party_risk_remediation_tracking(status);

CREATE INDEX IF NOT EXISTS idx_third_party_risk_evidence_evaluation_id ON third_party_risk_evidence(evaluation_id);
CREATE INDEX IF NOT EXISTS idx_third_party_risk_evidence_vendor_id ON third_party_risk_evidence(vendor_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_third_party_risk_evaluations_updated_at BEFORE UPDATE ON third_party_risk_evaluations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_third_party_risk_questions_updated_at BEFORE UPDATE ON third_party_risk_questions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_third_party_risk_responses_updated_at BEFORE UPDATE ON third_party_risk_responses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_third_party_gap_analysis_updated_at BEFORE UPDATE ON third_party_gap_analysis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_third_party_risk_controls_updated_at BEFORE UPDATE ON third_party_risk_controls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_third_party_risk_remediation_tracking_updated_at BEFORE UPDATE ON third_party_risk_remediation_tracking FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_third_party_risk_evidence_updated_at BEFORE UPDATE ON third_party_risk_evidence FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
