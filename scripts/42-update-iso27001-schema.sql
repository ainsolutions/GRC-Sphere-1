-- Update ISO 27001 risks table to include new fields
ALTER TABLE iso27001_risks 
ADD COLUMN IF NOT EXISTS control_assessment TEXT,
ADD COLUMN IF NOT EXISTS risk_treatment VARCHAR(50);

-- Update the risk_controls table to include effectiveness as integer (1-5)
ALTER TABLE iso27001_risk_controls 
DROP COLUMN IF EXISTS effectiveness CASCADE;

ALTER TABLE iso27001_risk_controls 
ADD COLUMN effectiveness INTEGER DEFAULT 3 CHECK (effectiveness >= 1 AND effectiveness <= 5);

-- Create index for better performance on control effectiveness queries
CREATE INDEX IF NOT EXISTS idx_iso27001_risk_controls_risk_id ON iso27001_risk_controls(risk_id);
CREATE INDEX IF NOT EXISTS idx_iso27001_risk_controls_control_id ON iso27001_risk_controls(control_id);

-- Update existing data to have default effectiveness ratings
UPDATE iso27001_risk_controls SET effectiveness = 3 WHERE effectiveness IS NULL;
