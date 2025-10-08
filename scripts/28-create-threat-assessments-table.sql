-- Create threat assessments table
CREATE TABLE IF NOT EXISTS threat_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    methodology VARCHAR(100) NOT NULL,
    scope TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in-progress', 'under-review', 'completed', 'approved')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('critical', 'high', 'medium', 'low')),
    risk_score DECIMAL(5,2) DEFAULT 0,
    risk_level VARCHAR(20) DEFAULT 'Low',
    assigned_to VARCHAR(255),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    mitigation_strategies TEXT,
    recommendations TEXT,
    review_notes TEXT
);

-- Create threat assessment threats junction table
CREATE TABLE IF NOT EXISTS threat_assessment_threats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES threat_assessments(id) ON DELETE CASCADE,
    threat_id UUID NOT NULL REFERENCES threats(id) ON DELETE CASCADE,
    likelihood INTEGER NOT NULL CHECK (likelihood BETWEEN 1 AND 5),
    impact INTEGER NOT NULL CHECK (impact BETWEEN 1 AND 5),
    risk_score DECIMAL(5,2) NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    mitigation_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assessment_id, threat_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_threat_assessments_status ON threat_assessments(status);
CREATE INDEX IF NOT EXISTS idx_threat_assessments_priority ON threat_assessments(priority);
CREATE INDEX IF NOT EXISTS idx_threat_assessments_assigned_to ON threat_assessments(assigned_to);
CREATE INDEX IF NOT EXISTS idx_threat_assessments_due_date ON threat_assessments(due_date);
CREATE INDEX IF NOT EXISTS idx_threat_assessments_created_at ON threat_assessments(created_at);
CREATE INDEX IF NOT EXISTS idx_threat_assessment_threats_assessment_id ON threat_assessment_threats(assessment_id);
CREATE INDEX IF NOT EXISTS idx_threat_assessment_threats_threat_id ON threat_assessment_threats(threat_id);
CREATE INDEX IF NOT EXISTS idx_threat_assessment_threats_risk_score ON threat_assessment_threats(risk_score);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_threat_assessment_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_threat_assessments_updated_at
    BEFORE UPDATE ON threat_assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_threat_assessment_updated_at();

CREATE TRIGGER update_threat_assessment_threats_updated_at
    BEFORE UPDATE ON threat_assessment_threats
    FOR EACH ROW
    EXECUTE FUNCTION update_threat_assessment_updated_at();
