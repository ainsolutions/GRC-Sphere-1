-- Create evidence table for ISO 27001 risks
CREATE TABLE IF NOT EXISTS iso27001_evidence (
    id SERIAL PRIMARY KEY,
    risk_id INTEGER NOT NULL REFERENCES iso27001_risks(id) ON DELETE CASCADE,
    control_id VARCHAR(20), -- Optional reference to specific control
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    file_data TEXT NOT NULL, -- Base64 encoded file data
    description TEXT,
    uploaded_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create validation rules table
CREATE TABLE IF NOT EXISTS iso27001_validation_rules (
    id SERIAL PRIMARY KEY,
    require_evidence_for_mitigated BOOLEAN DEFAULT true,
    require_evidence_for_accepted BOOLEAN DEFAULT true,
    updated_by VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_iso27001_evidence_risk_id ON iso27001_evidence(risk_id);
CREATE INDEX IF NOT EXISTS idx_iso27001_evidence_control_id ON iso27001_evidence(control_id);
CREATE INDEX IF NOT EXISTS idx_iso27001_evidence_created_at ON iso27001_evidence(created_at);

-- Insert default validation rules
INSERT INTO iso27001_validation_rules (require_evidence_for_mitigated, require_evidence_for_accepted, updated_by)
VALUES (true, true, 'System')
ON CONFLICT DO NOTHING;
