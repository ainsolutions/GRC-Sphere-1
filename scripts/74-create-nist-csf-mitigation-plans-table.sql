-- Create NIST CSF Mitigation Plans table
CREATE TABLE IF NOT EXISTS nist_csf_mitigation_plans (
    id SERIAL PRIMARY KEY,
    plan_id VARCHAR(50) UNIQUE NOT NULL,
    plan_name VARCHAR(255) NOT NULL,
    risk_template_id INTEGER REFERENCES nist_csf_risk_templates(id) ON DELETE CASCADE,
    mitigation_strategy TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Planning' CHECK (status IN ('Planning', 'In Progress', 'Completed', 'On Hold')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    action_owner VARCHAR(255) NOT NULL,
    due_date DATE,
    investment_amount DECIMAL(15,2) DEFAULT 0,
    residual_risk_level VARCHAR(20) DEFAULT 'Medium' CHECK (residual_risk_level IN ('Critical', 'High', 'Medium', 'Low', 'Very Low')),
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nist_mitigation_plans_status ON nist_csf_mitigation_plans(status);
CREATE INDEX IF NOT EXISTS idx_nist_mitigation_plans_priority ON nist_csf_mitigation_plans(priority);
CREATE INDEX IF NOT EXISTS idx_nist_mitigation_plans_due_date ON nist_csf_mitigation_plans(due_date);
CREATE INDEX IF NOT EXISTS idx_nist_mitigation_plans_risk_template ON nist_csf_mitigation_plans(risk_template_id);
CREATE INDEX IF NOT EXISTS idx_nist_mitigation_plans_owner ON nist_csf_mitigation_plans(action_owner);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_nist_mitigation_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_nist_mitigation_plans_updated_at
    BEFORE UPDATE ON nist_csf_mitigation_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_nist_mitigation_plans_updated_at();

-- Add comments for documentation
COMMENT ON TABLE nist_csf_mitigation_plans IS 'NIST CSF risk mitigation plans and tracking';
COMMENT ON COLUMN nist_csf_mitigation_plans.plan_id IS 'Unique identifier for the mitigation plan';
COMMENT ON COLUMN nist_csf_mitigation_plans.risk_template_id IS 'Reference to the associated risk template';
COMMENT ON COLUMN nist_csf_mitigation_plans.mitigation_strategy IS 'Detailed mitigation strategy description';
COMMENT ON COLUMN nist_csf_mitigation_plans.progress_percentage IS 'Completion percentage (0-100)';
COMMENT ON COLUMN nist_csf_mitigation_plans.investment_amount IS 'Financial investment allocated for mitigation';
COMMENT ON COLUMN nist_csf_mitigation_plans.residual_risk_level IS 'Expected risk level after mitigation';
