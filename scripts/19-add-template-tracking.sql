-- Add template tracking to risks table
ALTER TABLE risks 
ADD COLUMN IF NOT EXISTS created_from_template_id INTEGER REFERENCES iso27001_risk_templates(id);

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_risks_template_id ON risks(created_from_template_id);

-- Add comment
COMMENT ON COLUMN risks.created_from_template_id IS 'Reference to the ISO 27001 template used to create this risk';
