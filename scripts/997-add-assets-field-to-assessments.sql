-- Add assets field to assessments table
-- This field will store multiple associated assets for each assessment as JSONB array

DO $$
BEGIN
    -- Check if assets column doesn't exist, then add it
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'assessments' 
        AND column_name = 'assets'
    ) THEN
        ALTER TABLE org_tset_01.assessments ADD COLUMN assets JSONB DEFAULT '[]'::jsonb;
        
        -- Add GIN index for better JSONB array search performance
        CREATE INDEX IF NOT EXISTS idx_assessments_assets ON org_tset_01.assessments USING gin(assets);
        
        RAISE NOTICE 'Assets column added to assessments table successfully';
    ELSE
        RAISE NOTICE 'Assets column already exists in assessments table';
    END IF;

    -- Migrate existing asset_id and asset_name to assets array if they exist
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'assessments' 
        AND column_name IN ('asset_id', 'asset_name')
    ) THEN
        -- Update assets array from existing asset_id and asset_name
        UPDATE org_tset_01.assessments 
        SET assets = CASE 
            WHEN asset_id IS NOT NULL AND asset_name IS NOT NULL 
            THEN jsonb_build_array(asset_name || ' (' || asset_id || ')')
            WHEN asset_name IS NOT NULL 
            THEN jsonb_build_array(asset_name)
            WHEN asset_id IS NOT NULL 
            THEN jsonb_build_array(asset_id)
            ELSE '[]'::jsonb
        END
        WHERE (asset_id IS NOT NULL OR asset_name IS NOT NULL)
        AND (assets IS NULL OR assets = '[]'::jsonb);
        
        RAISE NOTICE 'Migrated existing asset_id and asset_name data to assets array';
    END IF;

END $$;

-- Add comment to the column
COMMENT ON COLUMN org_tset_01.assessments.assets IS 'Multiple associated assets for this assessment stored as JSONB array (searchable from assets table)';

-- Create a view for assessments with their assets
CREATE OR REPLACE VIEW org_tset_01.assessments_with_assets AS
SELECT 
    a.id,
    a.assessment_id,
    a.assessment_name,
    a.assessment_type,
    a.assessment_status,
    a.compliance_framework,
    a.assets,
    jsonb_array_length(COALESCE(a.assets, '[]'::jsonb)) as assets_count,
    a.completion_percentage,
    a.findings_count,
    a.created_at,
    a.updated_at
FROM org_tset_01.assessments a
ORDER BY a.created_at DESC;

COMMENT ON VIEW org_tset_01.assessments_with_assets IS 'View of assessments showing asset count and details';
