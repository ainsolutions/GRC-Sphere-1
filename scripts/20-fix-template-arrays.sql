-- Fix array column types in iso27001_risk_templates table
ALTER TABLE iso27001_risk_templates 
  ALTER COLUMN threats TYPE text[] USING threats::text[],
  ALTER COLUMN vulnerabilities TYPE text[] USING vulnerabilities::text[],
  ALTER COLUMN asset_types TYPE text[] USING asset_types::text[],
  ALTER COLUMN compliance_references TYPE text[] USING compliance_references::text[];

-- Update existing data to proper array format
UPDATE iso27001_risk_templates 
SET 
  threats = CASE 
    WHEN threats IS NULL THEN ARRAY[]::text[]
    WHEN jsonb_typeof(threats::jsonb) = 'array' THEN ARRAY(SELECT jsonb_array_elements_text(threats::jsonb))
    ELSE ARRAY[threats::text]
  END,
  vulnerabilities = CASE 
    WHEN vulnerabilities IS NULL THEN ARRAY[]::text[]
    WHEN jsonb_typeof(vulnerabilities::jsonb) = 'array' THEN ARRAY(SELECT jsonb_array_elements_text(vulnerabilities::jsonb))
    ELSE ARRAY[vulnerabilities::text]
  END,
  asset_types = CASE 
    WHEN asset_types IS NULL THEN ARRAY[]::text[]
    WHEN jsonb_typeof(asset_types::jsonb) = 'array' THEN ARRAY(SELECT jsonb_array_elements_text(asset_types::jsonb))
    ELSE ARRAY[asset_types::text]
  END,
  compliance_references = CASE 
    WHEN compliance_references IS NULL THEN ARRAY[]::text[]
    WHEN jsonb_typeof(compliance_references::jsonb) = 'array' THEN ARRAY(SELECT jsonb_array_elements_text(compliance_references::jsonb))
    ELSE ARRAY[compliance_references::text]
  END
WHERE id > 0;
