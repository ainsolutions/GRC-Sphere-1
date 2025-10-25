-- Add departmental unit field to governance_kpis table
-- This field stores the specific unit within department responsible for KPI

ALTER TABLE governance_kpis
ADD COLUMN IF NOT EXISTS departmental_unit VARCHAR(255);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_governance_kpis_departmental_unit ON governance_kpis(departmental_unit);

-- Add comment for documentation
COMMENT ON COLUMN governance_kpis.departmental_unit IS 'Specific unit within department responsible for KPI';

