-- Create ISO 27001 risks table
CREATE TABLE IF NOT EXISTS iso27001_risks (
    id SERIAL PRIMARY KEY,
    risk_id VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    likelihood INTEGER NOT NULL CHECK (likelihood >= 1 AND likelihood <= 5),
    impact INTEGER NOT NULL CHECK (impact >= 1 AND impact <= 5),
    risk_score INTEGER GENERATED ALWAYS AS (likelihood * impact) STORED,
    risk_level VARCHAR(20) GENERATED ALWAYS AS (
        CASE 
            WHEN (likelihood * impact) >= 15 THEN 'Critical'
            WHEN (likelihood * impact) >= 10 THEN 'High'
            WHEN (likelihood * impact) >= 5 THEN 'Medium'
            ELSE 'Low'
        END
    ) STORED,
    status VARCHAR(20) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Mitigated', 'Accepted')),
    owner VARCHAR(100),
    treatment_plan TEXT,
    residual_risk INTEGER,
    last_reviewed DATE DEFAULT CURRENT_DATE,
    next_review DATE,
    controls TEXT[], -- Array of ISO 27001 control references
    assets TEXT[], -- Array of affected assets
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_iso27001_risks_category ON iso27001_risks(category);
CREATE INDEX IF NOT EXISTS idx_iso27001_risks_status ON iso27001_risks(status);
CREATE INDEX IF NOT EXISTS idx_iso27001_risks_risk_level ON iso27001_risks(risk_level);
CREATE INDEX IF NOT EXISTS idx_iso27001_risks_owner ON iso27001_risks(owner);
CREATE INDEX IF NOT EXISTS idx_iso27001_risks_next_review ON iso27001_risks(next_review);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_iso27001_risks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_iso27001_risks_updated_at
    BEFORE UPDATE ON iso27001_risks
    FOR EACH ROW
    EXECUTE FUNCTION update_iso27001_risks_updated_at();

-- Create ISO 27001 controls reference table
CREATE TABLE IF NOT EXISTS iso27001_controls (
    id SERIAL PRIMARY KEY,
    control_id VARCHAR(20) UNIQUE NOT NULL,
    control_name VARCHAR(255) NOT NULL,
    control_description TEXT,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create risk-control mapping table
CREATE TABLE IF NOT EXISTS iso27001_risk_controls (
    id SERIAL PRIMARY KEY,
    risk_id INTEGER REFERENCES iso27001_risks(id) ON DELETE CASCADE,
    control_id INTEGER REFERENCES iso27001_controls(id) ON DELETE CASCADE,
    effectiveness VARCHAR(20) DEFAULT 'Medium' CHECK (effectiveness IN ('Low', 'Medium', 'High')),
    implementation_status VARCHAR(20) DEFAULT 'Planned' CHECK (implementation_status IN ('Planned', 'In Progress', 'Implemented', 'Not Applicable')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(risk_id, control_id)
);

-- Add audit logging
CREATE TRIGGER audit_iso27001_risks
    AFTER INSERT OR UPDATE OR DELETE ON iso27001_risks
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_iso27001_controls
    AFTER INSERT OR UPDATE OR DELETE ON iso27001_controls
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();

CREATE TRIGGER audit_iso27001_risk_controls
    AFTER INSERT OR UPDATE OR DELETE ON iso27001_risk_controls
    FOR EACH ROW EXECUTE FUNCTION audit_trigger();
