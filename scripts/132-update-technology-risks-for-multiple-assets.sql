-- Update technology_risks table to support multiple assets
-- Add asset_ids column to store array of asset IDs

-- First, let's check if the column already exists
DO $$ 
BEGIN
    -- Check if asset_ids column exists and its type
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'technology_risks' 
        AND column_name = 'asset_ids'
    ) THEN
        RAISE NOTICE 'asset_ids column already exists';
    ELSE
        -- Add asset_ids column as VARCHAR to store comma-separated asset IDs
        ALTER TABLE technology_risks ADD COLUMN asset_ids VARCHAR;
        RAISE NOTICE 'Added asset_ids column as VARCHAR';
    END IF;
    
    -- Migrate existing single asset_id to asset_ids if asset_id column exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'technology_risks' 
        AND column_name = 'asset_id'
    ) THEN
        -- Update asset_ids with existing asset_id values
        UPDATE technology_risks 
        SET asset_ids = asset_id::VARCHAR 
        WHERE asset_id IS NOT NULL AND asset_ids IS NULL;
        
        RAISE NOTICE 'Migrated existing asset_id values to asset_ids';
    END IF;
END $$;

-- Migrate existing asset_id data to asset_ids array
UPDATE technology_risks 
SET asset_ids = CASE 
    WHEN asset_id IS NOT NULL AND asset_id != '' THEN ARRAY[asset_id::INTEGER]
    ELSE NULL 
END
WHERE asset_ids IS NULL;

-- Create index for better performance on asset_ids searches
CREATE INDEX IF NOT EXISTS idx_technology_risks_asset_ids ON technology_risks USING gin (string_to_array(asset_ids, ','));

-- Add comment for documentation
COMMENT ON COLUMN technology_risks.asset_ids IS 'Array of asset IDs related to this technology risk';

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'technology_risks' 
AND column_name IN ('asset_id', 'asset_ids')
ORDER BY column_name;
