-- Add IP address field to information_assets table
ALTER TABLE information_assets 
ADD COLUMN ip_address inet;

-- Add comment to describe the column
COMMENT ON COLUMN information_assets.ip_address IS 'IP address associated with the asset (for network assets, servers, etc.)';
