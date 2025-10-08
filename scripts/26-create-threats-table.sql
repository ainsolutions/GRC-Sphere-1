-- Create threats table with proper structure and indexes
CREATE TABLE IF NOT EXISTS threats (
    id SERIAL PRIMARY KEY,
    threat_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    source VARCHAR(100),
    threat_level VARCHAR(20) CHECK (threat_level IN ('critical', 'high', 'medium', 'low')),
    status VARCHAR(20) CHECK (status IN ('active', 'monitoring', 'mitigated', 'resolved')),
    indicators_of_compromise JSONB DEFAULT '[]'::jsonb,
    mitigation_strategies JSONB DEFAULT '[]'::jsonb,
    threat_references JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_threats_threat_id ON threats(threat_id);
CREATE INDEX IF NOT EXISTS idx_threats_category ON threats(category);
CREATE INDEX IF NOT EXISTS idx_threats_threat_level ON threats(threat_level);
CREATE INDEX IF NOT EXISTS idx_threats_status ON threats(status);
CREATE INDEX IF NOT EXISTS idx_threats_created_at ON threats(created_at);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_threats_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_threats_updated_at ON threats;
CREATE TRIGGER trigger_update_threats_updated_at
    BEFORE UPDATE ON threats
    FOR EACH ROW
    EXECUTE FUNCTION update_threats_updated_at();
