-- Add assessment_id column to mica_assessments table
DO $$ 
BEGIN
    -- Check if assessment_id column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'mica_assessments' 
        AND column_name = 'assessment_id'
    ) THEN
        -- Add the assessment_id column
        ALTER TABLE mica_assessments 
        ADD COLUMN assessment_id VARCHAR(20);
        
        -- Update existing records with generated assessment IDs
        WITH numbered_assessments AS (
            SELECT 
                id,
                ROW_NUMBER() OVER (ORDER BY created_at) as row_num,
                EXTRACT(YEAR FROM created_at) as year
            FROM mica_assessments 
            WHERE assessment_id IS NULL
        )
        UPDATE mica_assessments 
        SET assessment_id = 'MICA-AS-' || na.year || '-' || LPAD(na.row_num::text, 2, '0')
        FROM numbered_assessments na
        WHERE mica_assessments.id = na.id;
        
        -- Make assessment_id NOT NULL and UNIQUE after updating existing records
        ALTER TABLE mica_assessments 
        ALTER COLUMN assessment_id SET NOT NULL;
        
        ALTER TABLE mica_assessments 
        ADD CONSTRAINT mica_assessments_assessment_id_unique UNIQUE (assessment_id);
        
        -- Create index for better performance
        CREATE INDEX idx_mica_assessments_assessment_id 
        ON mica_assessments(assessment_id);
        
        RAISE NOTICE 'Successfully added assessment_id column to mica_assessments table';
    ELSE
        RAISE NOTICE 'assessment_id column already exists in mica_assessments table';
    END IF;
END $$;
