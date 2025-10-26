-- Add departmental unit field to governance_budget table
-- This field stores the specific unit within department responsible for budget

ALTER TABLE org_tset_01.governance_budget
ADD COLUMN IF NOT EXISTS departmental_unit VARCHAR(255);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_governance_budget_departmental_unit ON org_tset_01.governance_budget(departmental_unit);

-- Add comment for documentation
COMMENT ON COLUMN org_tset_01.governance_budget.departmental_unit IS 'Specific unit within department responsible for budget';


