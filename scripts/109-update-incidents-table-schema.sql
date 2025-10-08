-- Update incidents table to ensure proper schema
-- Add any missing columns and constraints

-- Check if incident_id column exists and has proper constraints
DO $$
BEGIN
    -- Add unique constraint to incident_id if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'incidents_incident_id_key' 
        AND table_name = 'incidents'
    ) THEN
        ALTER TABLE incidents ADD CONSTRAINT incidents_incident_id_key UNIQUE (incident_id);
    END IF;

    -- Ensure incident_id column has proper format validation
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.check_constraints 
        WHERE constraint_name = 'incidents_incident_id_format_check'
        AND table_name = 'incidents'
    ) THEN
        ALTER TABLE incidents ADD CONSTRAINT incidents_incident_id_format_check 
        CHECK (incident_id ~ '^INCT-[0-9]{4}-[0-9]{6}$');
    END IF;

    -- Ensure all required fields have NOT NULL constraints
    ALTER TABLE incidents ALTER COLUMN incident_title SET NOT NULL;
    ALTER TABLE incidents ALTER COLUMN incident_description SET NOT NULL;
    ALTER TABLE incidents ALTER COLUMN incident_type SET NOT NULL;
    ALTER TABLE incidents ALTER COLUMN severity SET NOT NULL;
    ALTER TABLE incidents ALTER COLUMN status SET NOT NULL;
    ALTER TABLE incidents ALTER COLUMN reported_by SET NOT NULL;
    ALTER TABLE incidents ALTER COLUMN assigned_to SET NOT NULL;
    ALTER TABLE incidents ALTER COLUMN reported_date SET NOT NULL;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error updating incidents table constraints: %', SQLERRM;
END $$;

-- Update existing incidents without incident_id to have proper format
UPDATE incidents 
SET incident_id = 'INCT-' || EXTRACT(YEAR FROM created_at) || '-' || 
                  LPAD((ROW_NUMBER() OVER (ORDER BY created_at))::text, 6, '0')
WHERE incident_id IS NULL OR incident_id = '' OR incident_id NOT LIKE 'INCT-%';

-- Create index for better performance on incident_id lookups
CREATE INDEX IF NOT EXISTS idx_incidents_incident_id_year ON incidents 
USING btree (substring(incident_id from 6 for 4));

-- Verify the schema updates
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'incidents' 
ORDER BY ordinal_position;

-- Show sample of updated incident IDs
SELECT incident_id, incident_title, created_at 
FROM incidents 
ORDER BY created_at DESC 
LIMIT 10;
