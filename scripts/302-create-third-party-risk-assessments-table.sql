-- Create the missing third_party_risk_assessments table with correct column names
CREATE TABLE IF NOT EXISTS third_party_risk_assessments (
    id SERIAL PRIMARY KEY,
    assessment_name VARCHAR(255) NOT NULL,
    vendor_id INTEGER REFERENCES vendors(id),
    assessment_type VARCHAR(100),
    assessment_status VARCHAR(50) DEFAULT 'Draft',
    overall_risk_score VARCHAR(20),
    data_security_score INTEGER,
    operational_risk_score INTEGER,
    financial_stability_score INTEGER,
    compliance_score INTEGER,
    assessment_date DATE,
    next_review_date DATE,
    assessor_name VARCHAR(255),
    description TEXT,
    
    -- Additional fields for comprehensive assessment
    questionnaire_responses JSONB,
    gap_analysis JSONB,
    remediation_plan JSONB,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_third_party_assessments_vendor_id ON third_party_risk_assessments(vendor_id);
CREATE INDEX IF NOT EXISTS idx_third_party_assessments_status ON third_party_risk_assessments(assessment_status);
CREATE INDEX IF NOT EXISTS idx_third_party_assessments_date ON third_party_risk_assessments(assessment_date);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_third_party_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_third_party_assessments_updated_at
    BEFORE UPDATE ON third_party_risk_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_third_party_assessments_updated_at();
