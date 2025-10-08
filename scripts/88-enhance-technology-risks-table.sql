-- Add control assessment, residual risk, and treatment plan columns
ALTER TABLE technology_risks
ADD COLUMN controlAssessment TEXT,
ADD COLUMN residualRisk INTEGER,
ADD COLUMN treatmentPlan TEXT;
