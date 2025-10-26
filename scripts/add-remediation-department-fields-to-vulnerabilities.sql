-- Add remediation department and unit fields to vulnerabilities table
-- These fields track which department and unit are responsible for vulnerability remediation

ALTER TABLE vulnerabilities
ADD COLUMN IF NOT EXISTS remediation_department VARCHAR(255);

ALTER TABLE vulnerabilities
ADD COLUMN IF NOT EXISTS remediation_departmental_unit VARCHAR(255);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_remediation_department ON vulnerabilities(remediation_department);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_remediation_unit ON vulnerabilities(remediation_departmental_unit);

-- Add comments for documentation
COMMENT ON COLUMN vulnerabilities.remediation_department IS 'Department responsible for vulnerability remediation';
COMMENT ON COLUMN vulnerabilities.remediation_departmental_unit IS 'Specific unit within department responsible for remediation';

