-- Create sequence for risk ID generation
CREATE SEQUENCE IF NOT EXISTS risk_id_seq START 1;

-- Function to generate risk ID with format RISK-XXXX
CREATE OR REPLACE FUNCTION generate_risk_id() RETURNS TEXT AS $$
DECLARE
    next_num INTEGER;
    max_existing INTEGER := 0;
    risk_id_text TEXT;
BEGIN
    -- Find the highest existing risk ID number
    SELECT COALESCE(MAX(
        CASE 
            WHEN risk_id ~ '^RISK-[0-9]+$' 
            THEN CAST(SUBSTRING(risk_id FROM 6) AS INTEGER)
            ELSE 0
        END
    ), 0) INTO max_existing
    FROM risks
    WHERE risk_id IS NOT NULL;
    
    -- Set sequence to start from max existing + 1
    IF max_existing > 0 THEN
        PERFORM setval('risk_id_seq', max_existing + 1, false);
    END IF;
    
    -- Get next sequence value
    SELECT nextval('risk_id_seq') INTO next_num;
    
    -- Format as RISK-XXXX with leading zeros
    risk_id_text := 'RISK-' || LPAD(next_num::TEXT, 4, '0');
    
    -- Check if this ID already exists (collision prevention)
    WHILE EXISTS (SELECT 1 FROM risks WHERE risk_id = risk_id_text) LOOP
        SELECT nextval('risk_id_seq') INTO next_num;
        risk_id_text := 'RISK-' || LPAD(next_num::TEXT, 4, '0');
    END LOOP;
    
    RETURN risk_id_text;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to auto-generate risk_id
CREATE OR REPLACE FUNCTION auto_generate_risk_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.risk_id IS NULL OR NEW.risk_id = '' THEN
        NEW.risk_id := generate_risk_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_auto_generate_risk_id ON risks;
CREATE TRIGGER trigger_auto_generate_risk_id
    BEFORE INSERT ON risks
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_risk_id();

-- Initialize sequence based on existing data
DO $$
DECLARE
    max_existing INTEGER := 0;
BEGIN
    SELECT COALESCE(MAX(
        CASE 
            WHEN risk_id ~ '^RISK-[0-9]+$' 
            THEN CAST(SUBSTRING(risk_id FROM 6) AS INTEGER)
            ELSE 0
        END
    ), 0) INTO max_existing
    FROM risks
    WHERE risk_id IS NOT NULL;
    
    IF max_existing > 0 THEN
        PERFORM setval('risk_id_seq', max_existing, true);
    END IF;
END $$;
