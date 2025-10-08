-- Add finding_id column to assessment_findings table
ALTER TABLE assessment_findings 
ADD COLUMN finding_id VARCHAR(20) UNIQUE;

-- Create index for better performance
CREATE INDEX idx_assessment_findings_finding_id ON assessment_findings(finding_id);

-- Update existing records with generated finding IDs
DO $$
DECLARE
    rec RECORD;
    current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
    counter INTEGER := 1;
    new_finding_id VARCHAR(20);
BEGIN
    FOR rec IN 
        SELECT id FROM assessment_findings 
        WHERE finding_id IS NULL 
        ORDER BY created_at ASC
    LOOP
        new_finding_id := 'FIND-' || current_year || '-' || LPAD(counter::TEXT, 7, '0');
        
        UPDATE assessment_findings 
        SET finding_id = new_finding_id 
        WHERE id = rec.id;
        
        counter := counter + 1;
    END LOOP;
END $$;

-- Make finding_id NOT NULL after populating existing records
ALTER TABLE assessment_findings 
ALTER COLUMN finding_id SET NOT NULL;

-- Verify the update
SELECT 
    COUNT(*) as total_findings,
    COUNT(finding_id) as findings_with_id,
    MIN(finding_id) as first_id,
    MAX(finding_id) as last_id
FROM assessment_findings;
