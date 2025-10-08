-- Fix the status constraint for NIST CSF mitigation plans
-- Drop the existing constraint if it exists
ALTER TABLE nist_csf_mitigation_plans DROP CONSTRAINT IF EXISTS nist_csf_mitigation_plans_status_check;
ALTER TABLE nist_csf_mitigation_plans DROP CONSTRAINT IF EXISTS nist_csf_mitigation_plans_status_new_check1;

-- Add the correct status constraint
ALTER TABLE nist_csf_mitigation_plans 
ADD CONSTRAINT nist_csf_mitigation_plans_status_check 
CHECK (status IN ('Planning', 'In Progress', 'Completed', 'On Hold'));

-- Update any existing records that might have invalid status values
UPDATE nist_csf_mitigation_plans 
SET status = 'Planning' 
WHERE status NOT IN ('Planning', 'In Progress', 'Completed', 'On Hold');

-- Verify the constraint is working
SELECT DISTINCT status FROM nist_csf_mitigation_plans;

-- Add comment for documentation
COMMENT ON CONSTRAINT nist_csf_mitigation_plans_status_check ON nist_csf_mitigation_plans 
IS 'Ensures status values are valid: Planning, In Progress, Completed, On Hold';
