-- Create junction table for technology risks and assets (many-to-many relationship)
CREATE TABLE IF NOT EXISTS technology_risk_assets (
    id SERIAL PRIMARY KEY,
    technology_risk_id INTEGER NOT NULL,
    asset_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    CONSTRAINT fk_tech_risk_assets_risk 
        FOREIGN KEY (technology_risk_id) 
        REFERENCES technology_risks(id) 
        ON DELETE CASCADE,
    
    CONSTRAINT fk_tech_risk_assets_asset 
        FOREIGN KEY (asset_id) 
        REFERENCES assets(id) 
        ON DELETE CASCADE,
    
    -- Unique constraint to prevent duplicate relationships
    CONSTRAINT uk_tech_risk_asset 
        UNIQUE (technology_risk_id, asset_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tech_risk_assets_risk_id ON technology_risk_assets(technology_risk_id);
CREATE INDEX IF NOT EXISTS idx_tech_risk_assets_asset_id ON technology_risk_assets(asset_id);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_technology_risk_assets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_technology_risk_assets_updated_at
    BEFORE UPDATE ON technology_risk_assets
    FOR EACH ROW
    EXECUTE FUNCTION update_technology_risk_assets_updated_at();

-- Migrate existing asset_id data from technology_risks table to junction table
INSERT INTO technology_risk_assets (technology_risk_id, asset_id)
SELECT id, asset_id::INTEGER
FROM technology_risks 
WHERE asset_id IS NOT NULL 
  AND asset_id != '' 
  AND asset_id ~ '^[0-9]+$'
ON CONFLICT (technology_risk_id, asset_id) DO NOTHING;

-- Remove the old asset_id column from technology_risks table
-- (Keep it for now in case we need to rollback, can be removed later)
-- ALTER TABLE technology_risks DROP COLUMN IF EXISTS asset_id;

COMMENT ON TABLE technology_risk_assets IS 'Junction table linking technology risks to multiple assets';
COMMENT ON COLUMN technology_risk_assets.technology_risk_id IS 'Reference to technology risk';
COMMENT ON COLUMN technology_risk_assets.asset_id IS 'Reference to asset';
