-- Add risk_id column to fair_risks table with auto-generation
ALTER TABLE fair_risks ADD COLUMN IF NOT EXISTS risk_id VARCHAR(20) UNIQUE;

-- Create sequence for FAIR risk IDs
CREATE SEQUENCE IF NOT EXISTS fair_risk_id_seq START 1;

-- Create function to generate FAIR risk ID
CREATE OR REPLACE FUNCTION generate_fair_risk_id()
RETURNS TEXT AS $$
DECLARE
    next_id INTEGER;
    formatted_id TEXT;
BEGIN
    -- Get next sequence value
    SELECT nextval('fair_risk_id_seq') INTO next_id;
    
    -- Format as FAIR-XXXXXX
    formatted_id := 'FAIR-' || LPAD(next_id::TEXT, 6, '0');
    
    RETURN formatted_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to auto-generate risk_id
CREATE OR REPLACE FUNCTION set_fair_risk_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.risk_id IS NULL THEN
        NEW.risk_id := generate_fair_risk_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_set_fair_risk_id ON fair_risks;
CREATE TRIGGER trigger_set_fair_risk_id
    BEFORE INSERT ON fair_risks
    FOR EACH ROW
    EXECUTE FUNCTION set_fair_risk_id();

-- Update existing records without risk_id
UPDATE fair_risks 
SET risk_id = generate_fair_risk_id() 
WHERE risk_id IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_fair_risks_risk_id ON fair_risks(risk_id);

-- Add comment
COMMENT ON COLUMN fair_risks.risk_id IS 'Auto-generated FAIR risk identifier in format FAIR-XXXXXX';
