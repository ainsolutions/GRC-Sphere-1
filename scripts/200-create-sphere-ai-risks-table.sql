-- Create sphere_ai_risks table
CREATE TABLE IF NOT EXISTS sphere_ai_risks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    likelihood INTEGER CHECK (likelihood >= 1 AND likelihood <= 5),
    impact INTEGER CHECK (impact >= 1 AND impact <= 5),
    risk_owner VARCHAR(255),
    business_unit VARCHAR(255),
    assets JSONB DEFAULT '[]',
    threat_sources JSONB DEFAULT '[]',
    vulnerabilities JSONB DEFAULT '[]',
    existing_controls JSONB DEFAULT '[]',
    ai_risk_score DECIMAL(3,1) CHECK (ai_risk_score >= 0 AND ai_risk_score <= 10),
    ai_risk_level VARCHAR(20) CHECK (ai_risk_level IN ('Low', 'Medium', 'High', 'Critical')),
    ai_confidence INTEGER CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
    ai_recommendations JSONB DEFAULT '[]',
    ai_similar_risks JSONB DEFAULT '[]',
    ai_predicted_trends JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Draft', 'Under Review', 'Approved', 'Mitigated', 'Closed')),
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sphere_ai_risks_category ON sphere_ai_risks(category);
CREATE INDEX IF NOT EXISTS idx_sphere_ai_risks_risk_level ON sphere_ai_risks(ai_risk_level);
CREATE INDEX IF NOT EXISTS idx_sphere_ai_risks_status ON sphere_ai_risks(status);
CREATE INDEX IF NOT EXISTS idx_sphere_ai_risks_created_at ON sphere_ai_risks(created_at);
CREATE INDEX IF NOT EXISTS idx_sphere_ai_risks_risk_score ON sphere_ai_risks(ai_risk_score);

-- Create full-text search index
CREATE INDEX IF NOT EXISTS idx_sphere_ai_risks_search ON sphere_ai_risks USING gin(to_tsvector('english', title || ' ' || description));

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_sphere_ai_risks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sphere_ai_risks_updated_at
    BEFORE UPDATE ON sphere_ai_risks
    FOR EACH ROW
    EXECUTE FUNCTION update_sphere_ai_risks_updated_at();

-- Add comments for documentation
COMMENT ON TABLE sphere_ai_risks IS 'AI-powered cyber risk management and assessment data';
COMMENT ON COLUMN sphere_ai_risks.ai_risk_score IS 'AI-calculated risk score from 0-10';
COMMENT ON COLUMN sphere_ai_risks.ai_confidence IS 'AI confidence level in percentage (0-100)';
COMMENT ON COLUMN sphere_ai_risks.ai_recommendations IS 'JSON array of AI-generated recommendations';
COMMENT ON COLUMN sphere_ai_risks.ai_similar_risks IS 'JSON array of similar risks identified by AI';
COMMENT ON COLUMN sphere_ai_risks.ai_predicted_trends IS 'JSON array of AI-predicted risk trends';
