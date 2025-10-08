-- Create technology_risks table
CREATE TABLE IF NOT EXISTS technology_risks (
    id SERIAL PRIMARY KEY,
    risk_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    technology_category VARCHAR(100) NOT NULL,
    technology_type VARCHAR(100) DEFAULT 'Server',
    asset_id VARCHAR(50),
    risk_category VARCHAR(100) DEFAULT 'Technology',
    likelihood INTEGER NOT NULL DEFAULT 1 CHECK (likelihood >= 1 AND likelihood <= 5),
    impact INTEGER NOT NULL DEFAULT 1 CHECK (impact >= 1 AND impact <= 5),
    current_controls TEXT DEFAULT '',
    recommended_controls TEXT DEFAULT '',
    owner VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'mitigated', 'accepted', 'closed')),
    due_date DATE,
    residual_likelihood INTEGER DEFAULT 1 CHECK (residual_likelihood >= 1 AND residual_likelihood <= 5),
    residual_impact INTEGER DEFAULT 1 CHECK (residual_impact >= 1 AND residual_impact <= 5),
    control_assessment TEXT DEFAULT '',
    risk_treatment VARCHAR(50) DEFAULT 'mitigate' CHECK (risk_treatment IN ('mitigate', 'transfer', 'avoid', 'accept')),
    treatment_state VARCHAR(50) DEFAULT 'planned' CHECK (treatment_state IN ('planned', 'in-progress', 'completed', 'overdue', 'cancelled')),
    treatment_end_date DATE,
    action_owner VARCHAR(255) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_technology_risks_risk_id ON technology_risks(risk_id);
CREATE INDEX IF NOT EXISTS idx_technology_risks_status ON technology_risks(status);
CREATE INDEX IF NOT EXISTS idx_technology_risks_owner ON technology_risks(owner);
CREATE INDEX IF NOT EXISTS idx_technology_risks_category ON technology_risks(technology_category);
CREATE INDEX IF NOT EXISTS idx_technology_risks_asset_id ON technology_risks(asset_id);
CREATE INDEX IF NOT EXISTS idx_technology_risks_created_at ON technology_risks(created_at);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_technology_risks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_technology_risks_updated_at ON technology_risks;
CREATE TRIGGER update_technology_risks_updated_at
    BEFORE UPDATE ON technology_risks
    FOR EACH ROW
    EXECUTE FUNCTION update_technology_risks_updated_at();

-- Add comments for documentation
COMMENT ON TABLE technology_risks IS 'Technology risk management and assessment data';
COMMENT ON COLUMN technology_risks.risk_id IS 'Unique risk identifier (e.g., TR-2024-00001)';
COMMENT ON COLUMN technology_risks.technology_category IS 'Category of technology (e.g., Infrastructure, Application, Network)';
COMMENT ON COLUMN technology_risks.technology_type IS 'Specific type of technology (e.g., Server, Database, Firewall)';
COMMENT ON COLUMN technology_risks.likelihood IS 'Risk likelihood score (1-5)';
COMMENT ON COLUMN technology_risks.impact IS 'Risk impact score (1-5)';
COMMENT ON COLUMN technology_risks.residual_likelihood IS 'Residual risk likelihood after controls (1-5)';
COMMENT ON COLUMN technology_risks.residual_impact IS 'Residual risk impact after controls (1-5)';
COMMENT ON COLUMN technology_risks.risk_treatment IS 'Risk treatment strategy';
COMMENT ON COLUMN technology_risks.treatment_state IS 'Current state of risk treatment implementation';
