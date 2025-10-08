-- Create third party risk assessment framework tables

-- Third party risk assessment templates table
CREATE TABLE IF NOT EXISTS third_party_risk_templates (
    id SERIAL PRIMARY KEY,
    category_id VARCHAR(10) NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    risk_id VARCHAR(10) NOT NULL,
    risk_title VARCHAR(500) NOT NULL,
    control_catalogue TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Third party risk assessments table
CREATE TABLE IF NOT EXISTS third_party_risk_assessments (
    id SERIAL PRIMARY KEY,
    vendor_id VARCHAR(50) NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    assessment_name VARCHAR(255) NOT NULL,
    assessment_date DATE NOT NULL,
    assessor_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'In Progress',
    overall_risk_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Third party risk assessment responses table
CREATE TABLE IF NOT EXISTS third_party_risk_assessment_responses (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES third_party_risk_assessments(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES third_party_risk_templates(id),
    assessment_result VARCHAR(50), -- 'Effective', 'Partial Effective', 'Not Effective'
    assessment_remarks TEXT,
    impact_score INTEGER CHECK (impact_score >= 1 AND impact_score <= 5),
    likelihood_score INTEGER CHECK (likelihood_score >= 1 AND likelihood_score <= 5),
    risk_level VARCHAR(20),
    risk_treatment TEXT,
    residual_impact_score INTEGER CHECK (residual_impact_score >= 1 AND residual_impact_score <= 5),
    residual_likelihood_score INTEGER CHECK (residual_likelihood_score >= 1 AND residual_likelihood_score <= 5),
    residual_risk_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_third_party_assessments_vendor ON third_party_risk_assessments(vendor_id);
CREATE INDEX IF NOT EXISTS idx_third_party_responses_assessment ON third_party_risk_assessment_responses(assessment_id);
CREATE INDEX IF NOT EXISTS idx_third_party_templates_category ON third_party_risk_templates(category_id);

-- Add audit logging
CREATE OR REPLACE FUNCTION update_third_party_assessment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_third_party_assessments_timestamp
    BEFORE UPDATE ON third_party_risk_assessments
    FOR EACH ROW EXECUTE FUNCTION update_third_party_assessment_timestamp();

CREATE TRIGGER update_third_party_responses_timestamp
    BEFORE UPDATE ON third_party_risk_assessment_responses
    FOR EACH ROW EXECUTE FUNCTION update_third_party_assessment_timestamp();
