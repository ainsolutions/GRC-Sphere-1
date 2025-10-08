-- Add any missing columns to technology_risks table
DO $$ 
BEGIN
    -- Add columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'technology_risks' AND column_name = 'control_assessment') THEN
        ALTER TABLE technology_risks ADD COLUMN control_assessment TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'technology_risks' AND column_name = 'risk_treatment') THEN
        ALTER TABLE technology_risks ADD COLUMN risk_treatment VARCHAR(50) DEFAULT 'mitigate' CHECK (risk_treatment IN ('mitigate', 'transfer', 'avoid', 'accept'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'technology_risks' AND column_name = 'treatment_state') THEN
        ALTER TABLE technology_risks ADD COLUMN treatment_state VARCHAR(50) DEFAULT 'planned' CHECK (treatment_state IN ('planned', 'in-progress', 'completed', 'overdue', 'cancelled'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'technology_risks' AND column_name = 'treatment_end_date') THEN
        ALTER TABLE technology_risks ADD COLUMN treatment_end_date DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'technology_risks' AND column_name = 'action_owner') THEN
        ALTER TABLE technology_risks ADD COLUMN action_owner VARCHAR(255);
    END IF;
END $$;

-- Update any existing records with default values
UPDATE technology_risks 
SET 
    risk_treatment = COALESCE(risk_treatment, 'mitigate'),
    treatment_state = COALESCE(treatment_state, 'planned')
WHERE risk_treatment IS NULL OR treatment_state IS NULL;
