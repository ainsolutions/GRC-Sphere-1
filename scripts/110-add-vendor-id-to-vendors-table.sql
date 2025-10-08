-- Add vendor_id column to vendors table with automatic generation

-- First, add the vendor_id column
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS vendor_id VARCHAR(20) UNIQUE;

-- Create function to generate vendor ID
CREATE OR REPLACE FUNCTION generate_vendor_id() RETURNS VARCHAR(20) AS $$
DECLARE
    current_year INTEGER;
    next_sequence INTEGER;
    new_vendor_id VARCHAR(20);
BEGIN
    current_year := EXTRACT(YEAR FROM CURRENT_DATE);
    
    -- Get the next sequence number for the current year
    SELECT COALESCE(MAX(CAST(SUBSTRING(vendor_id FROM 10) AS INTEGER)), 0) + 1
    INTO next_sequence
    FROM vendors 
    WHERE vendor_id LIKE 'VNC-' || current_year || '-%';
    
    -- Format the vendor ID
    new_vendor_id := 'VNC-' || current_year || '-' || LPAD(next_sequence::TEXT, 4, '0');
    
    RETURN new_vendor_id;
END;
$$ LANGUAGE plpgsql;

-- Update existing vendors without vendor_id
UPDATE vendors 
SET vendor_id = generate_vendor_id() 
WHERE vendor_id IS NULL;

-- Add constraint to ensure vendor_id format
ALTER TABLE vendors ADD CONSTRAINT check_vendor_id_format 
CHECK (vendor_id ~ '^VNC-[0-9]{4}-[0-9]{4}$');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_vendors_vendor_id ON vendors(vendor_id);

-- Make vendor_id NOT NULL after updating existing records
ALTER TABLE vendors ALTER COLUMN vendor_id SET NOT NULL;
