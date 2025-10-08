-- Create HIPAA Assessment Results table
CREATE TABLE IF NOT EXISTS hipaa_assessment_results (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL,
    requirement_id INTEGER NOT NULL,
    compliance_status VARCHAR(50) DEFAULT 'not-assessed' CHECK (compliance_status IN ('compliant', 'non-compliant', 'partially-compliant', 'not-applicable', 'not-assessed')),
    implementation_status VARCHAR(50) DEFAULT 'not-implemented' CHECK (implementation_status IN ('implemented', 'partially-implemented', 'not-implemented', 'planned')),
    evidence_provided TEXT,
    gaps_identified TEXT,
    remediation_required TEXT,
    risk_rating VARCHAR(20) DEFAULT 'medium' CHECK (risk_rating IN ('critical', 'high', 'medium', 'low')),
    comments TEXT,
    assessor_notes TEXT,
    last_reviewed_date TIMESTAMP,
    next_review_date DATE,
    responsible_party VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_assessment_results_assessment 
        FOREIGN KEY (assessment_id) 
        REFERENCES hipaa_assessments(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_assessment_results_requirement 
        FOREIGN KEY (requirement_id) 
        REFERENCES hipaa_requirements(id) 
        ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate results
    UNIQUE(assessment_id, requirement_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment_id ON hipaa_assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_requirement_id ON hipaa_assessment_results(requirement_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_compliance_status ON hipaa_assessment_results(compliance_status);
CREATE INDEX IF NOT EXISTS idx_assessment_results_risk_rating ON hipaa_assessment_results(risk_rating);
CREATE INDEX IF NOT EXISTS idx_assessment_results_next_review ON hipaa_assessment_results(next_review_date);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_hipaa_assessment_results_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_hipaa_assessment_results_updated_at
    BEFORE UPDATE ON hipaa_assessment_results
    FOR EACH ROW
    EXECUTE FUNCTION update_hipaa_assessment_results_updated_at();

-- Add comments for documentation
COMMENT ON TABLE hipaa_assessment_results IS 'Stores individual assessment results for HIPAA requirements';
COMMENT ON COLUMN hipaa_assessment_results.assessment_id IS 'Reference to the parent assessment';
COMMENT ON COLUMN hipaa_assessment_results.requirement_id IS 'Reference to the HIPAA requirement being assessed';
COMMENT ON COLUMN hipaa_assessment_results.compliance_status IS 'Current compliance status for this requirement';
COMMENT ON COLUMN hipaa_assessment_results.implementation_status IS 'Implementation status of controls for this requirement';
COMMENT ON COLUMN hipaa_assessment_results.evidence_provided IS 'Evidence or documentation supporting compliance';
COMMENT ON COLUMN hipaa_assessment_results.gaps_identified IS 'Identified gaps in compliance';
COMMENT ON COLUMN hipaa_assessment_results.remediation_required IS 'Required actions to achieve compliance';
COMMENT ON COLUMN hipaa_assessment_results.risk_rating IS 'Risk level associated with non-compliance';
COMMENT ON COLUMN hipaa_assessment_results.responsible_party IS 'Person or team responsible for this requirement';
COMMENT ON COLUMN hipaa_assessment_results.next_review_date IS 'Scheduled date for next review of this requirement';
