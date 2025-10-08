-- Create assessments table if it doesn't exist
CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    assessment_id VARCHAR(50) UNIQUE NOT NULL,
    assessment_name VARCHAR(255) NOT NULL,
    assessment_type VARCHAR(100) NOT NULL,
    assessment_scope TEXT,
    assessment_status VARCHAR(50) DEFAULT 'Planning',
    start_date DATE,
    end_date DATE,
    assigned_assessor VARCHAR(255) NOT NULL,
    assessment_methodology TEXT,
    compliance_framework VARCHAR(100),
    assessment_priority VARCHAR(20) DEFAULT 'Medium',
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    findings_count INTEGER DEFAULT 0,
    high_risk_findings INTEGER DEFAULT 0,
    medium_risk_findings INTEGER DEFAULT 0,
    low_risk_findings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(assessment_status);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON assessments(assessment_type);
CREATE INDEX IF NOT EXISTS idx_assessments_assessor ON assessments(assigned_assessor);
CREATE INDEX IF NOT EXISTS idx_assessments_framework ON assessments(compliance_framework);
CREATE INDEX IF NOT EXISTS idx_assessments_priority ON assessments(assessment_priority);
CREATE INDEX IF NOT EXISTS idx_assessments_dates ON assessments(start_date, end_date);

-- Add constraints
ALTER TABLE assessments 
ADD CONSTRAINT chk_assessment_status 
CHECK (assessment_status IN ('Planning', 'In Progress', 'Under Review', 'Completed', 'On Hold', 'Cancelled'));

ALTER TABLE assessments 
ADD CONSTRAINT chk_assessment_priority 
CHECK (assessment_priority IN ('Low', 'Medium', 'High', 'Critical'));

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_assessments_updated_at ON assessments;
CREATE TRIGGER trigger_update_assessments_updated_at
    BEFORE UPDATE ON assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_assessments_updated_at();
