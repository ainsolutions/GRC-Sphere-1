-- Add residual_risk_score column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'risks' AND column_name = 'residual_risk_score'
    ) THEN
        ALTER TABLE risks ADD COLUMN residual_risk_score INTEGER;
        
        -- Update existing records to calculate residual risk score
        UPDATE risks 
        SET residual_risk_score = COALESCE(residual_likelihood_score, likelihood_score) * COALESCE(residual_impact_score, impact_score)
        WHERE residual_risk_score IS NULL;
    END IF;
END $$;

-- Create or replace function to automatically calculate residual risk score
CREATE OR REPLACE FUNCTION calculate_residual_risk_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.residual_risk_score := COALESCE(NEW.residual_likelihood_score, NEW.likelihood_score) * COALESCE(NEW.residual_impact_score, NEW.impact_score);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate residual risk score on insert/update
DROP TRIGGER IF EXISTS trigger_calculate_residual_risk_score ON risks;
CREATE TRIGGER trigger_calculate_residual_risk_score
    BEFORE INSERT OR UPDATE ON risks
    FOR EACH ROW
    EXECUTE FUNCTION calculate_residual_risk_score();
