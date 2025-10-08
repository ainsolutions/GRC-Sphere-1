-- Create FAIR (Factor Analysis of Information Risk) risks table
CREATE TABLE IF NOT EXISTS fair_risks (
    id SERIAL PRIMARY KEY,
    risk_title VARCHAR(255) NOT NULL,
    risk_description TEXT,
    asset_id VARCHAR(100) NOT NULL,
    threat_actor VARCHAR(255) NOT NULL,
    
    -- FAIR Threat Analysis
    threat_capability INTEGER DEFAULT 3 CHECK (threat_capability >= 1 AND threat_capability <= 5),
    threat_motivation INTEGER DEFAULT 3 CHECK (threat_motivation >= 1 AND threat_motivation <= 5),
    control_effectiveness INTEGER DEFAULT 50 CHECK (control_effectiveness >= 0 AND control_effectiveness <= 100),
    vulnerability_score INTEGER DEFAULT 3 CHECK (vulnerability_score >= 1 AND vulnerability_score <= 5),
    
    -- Loss Event Frequency (PERT estimation)
    loss_event_frequency_min DECIMAL(10,4) DEFAULT 0,
    loss_event_frequency_most_likely DECIMAL(10,4) DEFAULT 0,
    loss_event_frequency_max DECIMAL(10,4) DEFAULT 0,
    
    -- Primary Loss Magnitude (PERT estimation)
    primary_loss_min DECIMAL(15,2) DEFAULT 0,
    primary_loss_most_likely DECIMAL(15,2) DEFAULT 0,
    primary_loss_max DECIMAL(15,2) DEFAULT 0,
    
    -- Secondary Loss Magnitude (PERT estimation)
    secondary_loss_min DECIMAL(15,2) DEFAULT 0,
    secondary_loss_most_likely DECIMAL(15,2) DEFAULT 0,
    secondary_loss_max DECIMAL(15,2) DEFAULT 0,
    
    -- Calculated Values
    annual_loss_expectancy DECIMAL(15,2) DEFAULT 0,
    risk_tolerance DECIMAL(15,2) DEFAULT 50000,
    
    -- Risk Treatment
    treatment_plan TEXT,
    treatment_status VARCHAR(50) DEFAULT 'planned' CHECK (treatment_status IN ('planned', 'in_progress', 'completed', 'overdue', 'cancelled')),
    treatment_due_date DATE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fair_risks_asset_id ON fair_risks(asset_id);
CREATE INDEX IF NOT EXISTS idx_fair_risks_threat_actor ON fair_risks(threat_actor);
CREATE INDEX IF NOT EXISTS idx_fair_risks_treatment_status ON fair_risks(treatment_status);
CREATE INDEX IF NOT EXISTS idx_fair_risks_ale ON fair_risks(annual_loss_expectancy);
CREATE INDEX IF NOT EXISTS idx_fair_risks_created_at ON fair_risks(created_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_fair_risks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_fair_risks_updated_at ON fair_risks;
CREATE TRIGGER update_fair_risks_updated_at
    BEFORE UPDATE ON fair_risks
    FOR EACH ROW
    EXECUTE FUNCTION update_fair_risks_updated_at();

-- Add comments for documentation
COMMENT ON TABLE fair_risks IS 'FAIR (Factor Analysis of Information Risk) quantitative risk assessments';
COMMENT ON COLUMN fair_risks.threat_capability IS 'Threat actor capability level (1-5 scale)';
COMMENT ON COLUMN fair_risks.threat_motivation IS 'Threat actor motivation level (1-5 scale)';
COMMENT ON COLUMN fair_risks.control_effectiveness IS 'Control effectiveness percentage (0-100)';
COMMENT ON COLUMN fair_risks.vulnerability_score IS 'Vulnerability score (1-5 scale)';
COMMENT ON COLUMN fair_risks.annual_loss_expectancy IS 'Calculated Annual Loss Expectancy in USD';
COMMENT ON COLUMN fair_risks.risk_tolerance IS 'Organization risk tolerance threshold in USD';
