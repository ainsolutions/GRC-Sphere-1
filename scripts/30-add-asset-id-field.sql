-- Add asset_id column and auto-generation functionality
ALTER TABLE assets ADD COLUMN IF NOT EXISTS asset_id VARCHAR(20) UNIQUE;

-- Create sequence for asset ID generation
CREATE SEQUENCE IF NOT EXISTS asset_id_seq START 1;

-- Create function to generate asset ID
CREATE OR REPLACE FUNCTION generate_asset_id() RETURNS VARCHAR(20) AS $$
BEGIN
    RETURN 'ASST-' || LPAD(nextval('asset_id_seq')::text, 7, '0');
END;
$$ LANGUAGE plpgsql;

-- Update existing assets with generated IDs
UPDATE assets 
SET asset_id = generate_asset_id() 
WHERE asset_id IS NULL;

-- Add constraint to ensure asset_id is not null for new records
ALTER TABLE assets ALTER COLUMN asset_id SET NOT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_assets_asset_id ON assets(asset_id);

-- Update the assets table structure to match our needs
ALTER TABLE assets 
ADD COLUMN IF NOT EXISTS classification VARCHAR(50),
ADD COLUMN IF NOT EXISTS business_value VARCHAR(50),
ADD COLUMN IF NOT EXISTS confidentiality_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS integrity_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS availability_level INTEGER DEFAULT 1;

-- Set default trigger for new assets
CREATE OR REPLACE FUNCTION set_asset_id() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.asset_id IS NULL THEN
        NEW.asset_id := generate_asset_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_asset_id ON assets;
CREATE TRIGGER trigger_set_asset_id
    BEFORE INSERT ON assets
    FOR EACH ROW
    EXECUTE FUNCTION set_asset_id();
