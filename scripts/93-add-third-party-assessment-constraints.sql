-- Add unique constraint to prevent duplicate responses for same assessment and template
ALTER TABLE third_party_risk_assessment_responses 
ADD CONSTRAINT unique_assessment_template 
UNIQUE (assessment_id, template_id);

-- Add check constraints for valid assessment results
ALTER TABLE third_party_risk_assessment_responses 
ADD CONSTRAINT valid_assessment_result 
CHECK (assessment_result IN ('Effective', 'Partial Effective', 'Not Effective'));

-- Add check constraints for valid status
ALTER TABLE third_party_risk_assessments 
ADD CONSTRAINT valid_status 
CHECK (status IN ('In Progress', 'Completed', 'Under Review', 'Approved'));
