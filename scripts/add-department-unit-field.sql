-- Add department_unit field to departments table
-- This field will store sub-unit or division names within departments

ALTER TABLE departments
ADD COLUMN IF NOT EXISTS department_unit VARCHAR(255);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_departments_unit ON departments(department_unit);

-- Add comment for documentation
COMMENT ON COLUMN departments.department_unit IS 'Sub-unit or division name within the department';

