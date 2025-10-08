-- Add additional fields to risks table for comprehensive risk management
-- This script adds ISO 27001 control mapping and residual risk assessment fields

-- Add new columns to risks table
ALTER TABLE risks 
ADD COLUMN IF NOT EXISTS existing_controls TEXT,
ADD COLUMN IF NOT EXISTS iso27002_control_id INTEGER REFERENCES iso27002_controls(id),
ADD COLUMN IF NOT EXISTS residual_likelihood_score INTEGER CHECK (residual_likelihood_score >= 1 AND residual_likelihood_score <= 5),
ADD COLUMN IF NOT EXISTS residual_impact_score INTEGER CHECK (residual_impact_score >= 1 AND residual_impact_score <= 5),
ADD COLUMN IF NOT EXISTS residual_risk_score INTEGER GENERATED ALWAYS AS (residual_likelihood_score * residual_impact_score) STORED,
ADD COLUMN IF NOT EXISTS risk_treatment VARCHAR(50) CHECK (risk_treatment IN ('Accept', 'Mitigate', 'Transfer', 'Avoid')),
ADD COLUMN IF NOT EXISTS risk_treatment_plan TEXT,
ADD COLUMN IF NOT EXISTS review_frequency VARCHAR(20) CHECK (review_frequency IN ('Monthly', 'Quarterly', 'Semi-Annual', 'Annual')),
ADD COLUMN IF NOT EXISTS control_effectiveness VARCHAR(30) CHECK (control_effectiveness IN ('Effective', 'Partially Effective', 'Ineffective', 'Not Tested')),
ADD COLUMN IF NOT EXISTS risk_appetite_threshold INTEGER CHECK (risk_appetite_threshold >= 1 AND risk_appetite_threshold <= 25),
ADD COLUMN IF NOT EXISTS business_impact TEXT,
ADD COLUMN IF NOT EXISTS regulatory_impact TEXT,
ADD COLUMN IF NOT EXISTS financial_impact_min DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS financial_impact_max DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS treatment_cost DECIMAL(15,2),
ADD COLUMN IF NOT EXISTS treatment_timeline VARCHAR(100),
ADD COLUMN IF NOT EXISTS risk_tolerance VARCHAR(20) CHECK (risk_tolerance IN ('Low', 'Medium', 'High'));

-- Create function to automatically calculate residual risk score
CREATE OR REPLACE FUNCTION calculate_residual_risk_score()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.residual_likelihood_score IS NOT NULL AND NEW.residual_impact_score IS NOT NULL THEN
        NEW.residual_risk_score := NEW.residual_likelihood_score * NEW.residual_impact_score;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate residual risk score
DROP TRIGGER IF EXISTS trigger_calculate_residual_risk_score ON risks;
CREATE TRIGGER trigger_calculate_residual_risk_score
    BEFORE INSERT OR UPDATE ON risks
    FOR EACH ROW
    EXECUTE FUNCTION calculate_residual_risk_score();

-- Create index for better performance on ISO control lookups
CREATE INDEX IF NOT EXISTS idx_risks_iso27002_control ON risks(iso27002_control_id);
CREATE INDEX IF NOT EXISTS idx_risks_residual_risk_score ON risks(residual_risk_score);
CREATE INDEX IF NOT EXISTS idx_risks_risk_treatment ON risks(risk_treatment);
CREATE INDEX IF NOT EXISTS idx_risks_review_frequency ON risks(review_frequency);

-- Create risk_control_mappings table for many-to-many relationship
CREATE TABLE IF NOT EXISTS risk_control_mappings (
    id SERIAL PRIMARY KEY,
    risk_id INTEGER NOT NULL REFERENCES risks(id) ON DELETE CASCADE,
    iso27002_control_id INTEGER NOT NULL REFERENCES iso27002_controls(id) ON DELETE CASCADE,
    control_effectiveness VARCHAR(30) CHECK (control_effectiveness IN ('Effective', 'Partially Effective', 'Ineffective', 'Not Tested')),
    implementation_status VARCHAR(30) CHECK (implementation_status IN ('Implemented', 'Partially Implemented', 'Not Implemented', 'Planned')),
    testing_frequency VARCHAR(20) CHECK (testing_frequency IN ('Monthly', 'Quarterly', 'Semi-Annual', 'Annual', 'Ad-hoc')),
    last_tested_date DATE,
    next_test_date DATE,
    control_owner VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(risk_id, iso27002_control_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_risk_control_mappings_risk_id ON risk_control_mappings(risk_id);
CREATE INDEX IF NOT EXISTS idx_risk_control_mappings_control_id ON risk_control_mappings(iso27002_control_id);

-- Add trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_risk_control_mappings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_risk_control_mappings_updated_at ON risk_control_mappings;
CREATE TRIGGER trigger_update_risk_control_mappings_updated_at
    BEFORE UPDATE ON risk_control_mappings
    FOR EACH ROW
    EXECUTE FUNCTION update_risk_control_mappings_updated_at();

-- Update existing risks to have default values
UPDATE risks SET 
    residual_likelihood_score = likelihood_score,
    residual_impact_score = impact_score,
    risk_treatment = 'Mitigate',
    review_frequency = 'Quarterly',
    control_effectiveness = 'Not Tested',
    risk_tolerance = 'Medium'
WHERE residual_likelihood_score IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN risks.existing_controls IS 'Description of current controls in place';
COMMENT ON COLUMN risks.iso27002_control_id IS 'Primary ISO 27002 control mapped to this risk';
COMMENT ON COLUMN risks.residual_likelihood_score IS 'Likelihood score after controls (1-5)';
COMMENT ON COLUMN risks.residual_impact_score IS 'Impact score after controls (1-5)';
COMMENT ON COLUMN risks.residual_risk_score IS 'Computed residual risk score (likelihood × impact)';
COMMENT ON COLUMN risks.risk_treatment IS 'Risk treatment strategy: Accept, Mitigate, Transfer, Avoid';
COMMENT ON COLUMN risks.risk_treatment_plan IS 'Detailed plan for treating the risk';
COMMENT ON COLUMN risks.review_frequency IS 'How often the risk should be reviewed';
COMMENT ON COLUMN risks.control_effectiveness IS 'Assessment of control effectiveness';
COMMENT ON COLUMN risks.risk_appetite_threshold IS 'Acceptable risk threshold (1-25)';
COMMENT ON COLUMN risks.business_impact IS 'Description of potential business impact';
COMMENT ON COLUMN risks.regulatory_impact IS 'Description of regulatory/compliance impact';
COMMENT ON COLUMN risks.financial_impact_min IS 'Minimum estimated financial impact';
COMMENT ON COLUMN risks.financial_impact_max IS 'Maximum estimated financial impact';
COMMENT ON COLUMN risks.treatment_cost IS 'Cost of implementing risk treatment';
COMMENT ON COLUMN risks.treatment_timeline IS 'Timeline for implementing treatment';
COMMENT ON COLUMN risks.risk_tolerance IS 'Organization risk tolerance level';

COMMENT ON TABLE risk_control_mappings IS 'Many-to-many mapping between risks and ISO 27002 controls';
