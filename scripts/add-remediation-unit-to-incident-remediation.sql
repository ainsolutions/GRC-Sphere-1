-- Add remediation departmental unit field to incident_remediation_tracking table
-- This field stores the specific unit within department responsible for remediation

ALTER TABLE incident_remediation_tracking
ADD COLUMN IF NOT EXISTS remediation_departmental_unit VARCHAR(255);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_incident_remediation_tracking_unit ON incident_remediation_tracking(remediation_departmental_unit);

-- Add comment for documentation
COMMENT ON COLUMN incident_remediation_tracking.remediation_departmental_unit IS 'Specific unit within department responsible for incident remediation';

