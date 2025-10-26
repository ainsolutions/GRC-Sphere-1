-- Add reviewer, department, and departmental_unit fields to assessments table

ALTER TABLE assessments
ADD COLUMN IF NOT EXISTS reviewer VARCHAR(255),
ADD COLUMN IF NOT EXISTS department VARCHAR(255),
ADD COLUMN IF NOT EXISTS departmental_unit VARCHAR(255);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_reviewer ON assessments(reviewer);
CREATE INDEX IF NOT EXISTS idx_assessments_department ON assessments(department);
CREATE INDEX IF NOT EXISTS idx_assessments_departmental_unit ON assessments(departmental_unit);

-- Add comments for documentation
COMMENT ON COLUMN assessments.reviewer IS 'User responsible for reviewing the assessment';
COMMENT ON COLUMN assessments.department IS 'Department conducting or responsible for the assessment';
COMMENT ON COLUMN assessments.departmental_unit IS 'Specific unit within department responsible for the assessment';

