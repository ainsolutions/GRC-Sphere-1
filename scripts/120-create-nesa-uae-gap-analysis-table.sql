-- Create NESA UAE Gap Analysis table
CREATE TABLE IF NOT EXISTS nesa_uae_gap_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nesa_control_id UUID NOT NULL,
    existing_control TEXT,
    control_owner VARCHAR(255),
    political_procedure_control TEXT,
    initial_control_maturity VARCHAR(50) NOT NULL CHECK (initial_control_maturity IN ('Not Implemented', 'Ad Hoc', 'Repeatable', 'Defined', 'Managed', 'Optimized')),
    gap_description TEXT,
    financial_action TEXT,
    target_control_maturity VARCHAR(50) NOT NULL CHECK (target_control_maturity IN ('Not Implemented', 'Ad Hoc', 'Repeatable', 'Defined', 'Managed', 'Optimized')),
    action_owner VARCHAR(255),
    reviewer VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Under Review', 'Completed', 'On Hold')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nesa_control_id) REFERENCES nesa_uae_requirements(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nesa_gap_analysis_control_id ON nesa_uae_gap_analysis(nesa_control_id);
CREATE INDEX IF NOT EXISTS idx_nesa_gap_analysis_status ON nesa_uae_gap_analysis(status);
CREATE INDEX IF NOT EXISTS idx_nesa_gap_analysis_maturity ON nesa_uae_gap_analysis(initial_control_maturity, target_control_maturity);
CREATE INDEX IF NOT EXISTS idx_nesa_gap_analysis_created_at ON nesa_uae_gap_analysis(created_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_nesa_gap_analysis_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_nesa_gap_analysis_updated_at
    BEFORE UPDATE ON nesa_uae_gap_analysis
    FOR EACH ROW
    EXECUTE FUNCTION update_nesa_gap_analysis_updated_at();

-- Add comments for documentation
COMMENT ON TABLE nesa_uae_gap_analysis IS 'Gap analysis entries for NESA UAE compliance requirements';
COMMENT ON COLUMN nesa_uae_gap_analysis.nesa_control_id IS 'Reference to NESA UAE control requirement';
COMMENT ON COLUMN nesa_uae_gap_analysis.existing_control IS 'Description of current control implementation';
COMMENT ON COLUMN nesa_uae_gap_analysis.control_owner IS 'Person or team responsible for the control';
COMMENT ON COLUMN nesa_uae_gap_analysis.political_procedure_control IS 'Related policies, procedures, or political controls';
COMMENT ON COLUMN nesa_uae_gap_analysis.initial_control_maturity IS 'Current maturity level of the control';
COMMENT ON COLUMN nesa_uae_gap_analysis.gap_description IS 'Description of identified gaps and deficiencies';
COMMENT ON COLUMN nesa_uae_gap_analysis.financial_action IS 'Required financial investments or budget considerations';
COMMENT ON COLUMN nesa_uae_gap_analysis.target_control_maturity IS 'Desired maturity level for the control';
COMMENT ON COLUMN nesa_uae_gap_analysis.action_owner IS 'Person responsible for implementing gap remediation';
COMMENT ON COLUMN nesa_uae_gap_analysis.reviewer IS 'Person responsible for reviewing and approving remediation';
COMMENT ON COLUMN nesa_uae_gap_analysis.status IS 'Current status of the gap analysis and remediation';
COMMENT ON COLUMN nesa_uae_gap_analysis.notes IS 'Additional notes and comments';
