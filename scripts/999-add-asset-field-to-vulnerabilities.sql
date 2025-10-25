-- Add assets field to vulnerabilities table
-- This field will store multiple associated assets for each vulnerability as JSONB array

DO $$
BEGIN
    -- Check if the old 'asset' column exists and needs to be migrated
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'vulnerabilities' 
        AND column_name = 'asset'
    ) THEN
        -- Check if it's VARCHAR type (old schema)
        IF EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'vulnerabilities' 
            AND column_name = 'asset'
            AND data_type = 'character varying'
        ) THEN
            RAISE NOTICE 'Migrating asset column from VARCHAR to JSONB array...';
            
            -- Create temporary assets column
            ALTER TABLE vulnerabilities ADD COLUMN assets JSONB DEFAULT '[]'::jsonb;
            
            -- Migrate data from asset to assets (convert single value to array)
            UPDATE vulnerabilities 
            SET assets = CASE 
                WHEN asset IS NOT NULL AND asset != '' 
                THEN jsonb_build_array(asset)
                ELSE '[]'::jsonb
            END
            WHERE asset IS NOT NULL;
            
            -- Drop old asset column
            ALTER TABLE vulnerabilities DROP COLUMN asset;
            
            -- Add index for better search performance
            CREATE INDEX IF NOT EXISTS idx_vulnerabilities_assets ON vulnerabilities USING gin(assets);
            
            RAISE NOTICE 'Asset column migrated to assets JSONB array successfully';
        ELSE
            RAISE NOTICE 'Asset column exists but migration not needed';
        END IF;
    ELSE
        -- Check if assets column doesn't exist, then add it
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'vulnerabilities' 
            AND column_name = 'assets'
        ) THEN
            ALTER TABLE vulnerabilities ADD COLUMN assets JSONB DEFAULT '[]'::jsonb;
            
            -- Add index for better search performance
            CREATE INDEX IF NOT EXISTS idx_vulnerabilities_assets ON vulnerabilities USING gin(assets);
            
            RAISE NOTICE 'Assets column added to vulnerabilities table successfully';
        ELSE
            RAISE NOTICE 'Assets column already exists in vulnerabilities table';
        END IF;
    END IF;
END $$;

-- Add comment to the column
COMMENT ON COLUMN vulnerabilities.assets IS 'Multiple associated assets for this vulnerability stored as JSONB array (searchable from assets table)';

