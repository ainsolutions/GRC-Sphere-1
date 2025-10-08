-- Enhance NIST CSF Mitigation Plans with status field and evidence functionality

-- Add status field to nist_csf_mitigation_plans table
ALTER TABLE nist_csf_mitigation_plans 
ADD COLUMN IF NOT EXISTS status_new VARCHAR(20) CHECK (status_new IN ('Draft', 'Initiated', 'In Progress', 'Completed'));

-- Update existing status values to new format
UPDATE nist_csf_mitigation_plans 
SET status_new = CASE 
    WHEN status = 'Planning' THEN 'Draft'
    WHEN status = 'In Progress' THEN 'In Progress'
    WHEN status = 'On Hold' THEN 'Draft'
    WHEN status = 'Completed' THEN 'Completed'
    WHEN status = 'Cancelled' THEN 'Draft'
    ELSE 'Draft'
END
WHERE status_new IS NULL;

-- Drop old status column and rename new one
ALTER TABLE nist_csf_mitigation_plans DROP COLUMN IF EXISTS status;
ALTER TABLE nist_csf_mitigation_plans RENAME COLUMN status_new TO status;

-- Set default status
ALTER TABLE nist_csf_mitigation_plans ALTER COLUMN status SET DEFAULT 'Draft';

-- Create evidence table for mitigation plans
CREATE TABLE IF NOT EXISTS nist_mitigation_plan_evidence (
    id SERIAL PRIMARY KEY,
    evidence_id VARCHAR(50) NOT NULL UNIQUE,
    plan_id INTEGER NOT NULL REFERENCES nist_csf_mitigation_plans(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    file_type VARCHAR(100),
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nist_evidence_plan_id ON nist_mitigation_plan_evidence(plan_id);
CREATE INDEX IF NOT EXISTS idx_nist_evidence_active ON nist_mitigation_plan_evidence(is_active);
CREATE INDEX IF NOT EXISTS idx_nist_evidence_upload_date ON nist_mitigation_plan_evidence(upload_date);

-- Function to generate evidence ID
CREATE OR REPLACE FUNCTION generate_nist_evidence_id() RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    current_year TEXT;
    sequence_num INTEGER;
BEGIN
    current_year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    
    -- Get the next sequence number for this year
    SELECT COALESCE(MAX(CAST(SUBSTRING(evidence_id FROM 'NIST-EVD-' || current_year || '-(.*)') AS INTEGER)), 0) + 1
    INTO sequence_num
    FROM nist_mitigation_plan_evidence
    WHERE evidence_id LIKE 'NIST-EVD-' || current_year || '-%';
    
    new_id := 'NIST-EVD-' || current_year || '-' || LPAD(sequence_num::TEXT, 6, '0');
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Insert sample evidence records
INSERT INTO nist_mitigation_plan_evidence (evidence_id, plan_id, file_name, file_path, file_size, file_type, uploaded_by, description) 
SELECT 
    generate_nist_evidence_id(),
    p.id,
    'Implementation_Report_' || p.plan_id || '.pdf',
    '/uploads/evidence/nist/' || p.plan_id || '/Implementation_Report_' || p.plan_id || '.pdf',
    FLOOR(RANDOM() * 5000000 + 100000)::BIGINT,
    'application/pdf',
    'System Administrator',
    'Implementation completion report for ' || p.plan_name
FROM nist_csf_mitigation_plans p
WHERE p.status = 'Completed'
LIMIT 5;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_nist_evidence_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_nist_evidence_updated_at
    BEFORE UPDATE ON nist_mitigation_plan_evidence
    FOR EACH ROW
    EXECUTE FUNCTION update_nist_evidence_updated_at();

-- Add constraint to prevent marking as completed without evidence
-- This will be enforced at the application level for better user experience
