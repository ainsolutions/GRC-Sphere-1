-- Add model/version field to information_assets table
ALTER TABLE information_assets
ADD COLUMN IF NOT EXISTS model_version VARCHAR(255);

-- Add comment to the new column
COMMENT ON COLUMN information_assets.model_version IS 'Model and version information for the asset (e.g., Windows Server 2022, Cisco ASA 5506, etc.)';

-- Update existing records with default values (optional)
-- UPDATE information_assets SET model_version = 'Unknown' WHERE model_version IS NULL;
