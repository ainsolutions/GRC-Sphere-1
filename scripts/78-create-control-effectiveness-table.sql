-- Create table for storing control effectiveness ratings
CREATE TABLE IF NOT EXISTS iso27001_control_effectiveness (
    id SERIAL PRIMARY KEY,
    risk_id INTEGER NOT NULL REFERENCES iso27001_risks(id) ON DELETE CASCADE,
    control_id VARCHAR(20) NOT NULL,
    effectiveness INTEGER NOT NULL CHECK (effectiveness >= 1 AND effectiveness <= 5),
    implementation_status VARCHAR(50) DEFAULT 'Not Started',
    notes TEXT,
    evidence_location TEXT,
    last_tested DATE,
    next_review_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(risk_id, control_id)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_control_effectiveness_risk_id ON iso27001_control_effectiveness(risk_id);
CREATE INDEX IF NOT EXISTS idx_control_effectiveness_control_id ON iso27001_control_effectiveness(control_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_control_effectiveness_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_control_effectiveness_updated_at
    BEFORE UPDATE ON iso27001_control_effectiveness
    FOR EACH ROW
    EXECUTE FUNCTION update_control_effectiveness_updated_at();
