-- Create FAIR Risk Treatment Plans table
CREATE TABLE IF NOT EXISTS fair_risk_treatment_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fair_risk_id UUID NOT NULL REFERENCES fair_risks(id) ON DELETE CASCADE,
    treatment_type VARCHAR(50) NOT NULL CHECK (treatment_type IN ('accept', 'mitigate', 'transfer', 'avoid')),
    treatment_strategy TEXT NOT NULL,
    business_justification TEXT,
    cost_estimate DECIMAL(15,2) DEFAULT 0,
    expected_risk_reduction INTEGER DEFAULT 0 CHECK (expected_risk_reduction >= 0 AND expected_risk_reduction <= 100),
    approval_status VARCHAR(50) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'under_review')),
    approved_by VARCHAR(255),
    approved_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create FAIR Risk Treatment Controls table
CREATE TABLE IF NOT EXISTS fair_risk_treatment_controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    treatment_plan_id UUID NOT NULL REFERENCES fair_risk_treatment_plans(id) ON DELETE CASCADE,
    control_id VARCHAR(100) NOT NULL,
    control_title VARCHAR(500) NOT NULL,
    control_description TEXT,
    control_type VARCHAR(50) NOT NULL CHECK (control_type IN ('preventive', 'detective', 'corrective', 'compensating')),
    control_category VARCHAR(100),
    implementation_status VARCHAR(50) DEFAULT 'not_started' CHECK (implementation_status IN ('not_started', 'in_progress', 'completed', 'on_hold', 'cancelled')),
    assigned_to VARCHAR(255),
    start_date DATE,
    due_date DATE,
    completion_date DATE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    implementation_notes TEXT,
    evidence_links TEXT[],
    testing_status VARCHAR(50) DEFAULT 'not_tested' CHECK (testing_status IN ('not_tested', 'testing_planned', 'testing_in_progress', 'passed', 'failed')),
    testing_date DATE,
    testing_notes TEXT,
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    cost_actual DECIMAL(15,2) DEFAULT 0,
    aging_days INTEGER DEFAULT 0,
    aging_status VARCHAR(50) DEFAULT 'on_track' CHECK (aging_status IN ('on_track', 'due_soon', 'overdue', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create FAIR Risk Treatment Tracking table
CREATE TABLE IF NOT EXISTS fair_risk_treatment_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    treatment_plan_id UUID REFERENCES fair_risk_treatment_plans(id) ON DELETE CASCADE,
    control_id UUID REFERENCES fair_risk_treatment_controls(id) ON DELETE CASCADE,
    field_changed VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_by VARCHAR(255) NOT NULL,
    change_reason TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create function to calculate aging for treatment controls
CREATE OR REPLACE FUNCTION calculate_treatment_control_aging()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate aging days and status
    IF NEW.due_date IS NOT NULL THEN
        NEW.aging_days = GREATEST(0, CURRENT_DATE - NEW.due_date);
        
        IF NEW.implementation_status = 'completed' THEN
            NEW.aging_status = 'completed';
        ELSIF NEW.aging_days > 0 THEN
            NEW.aging_status = 'overdue';
        ELSIF NEW.aging_days >= -7 THEN
            NEW.aging_status = 'due_soon';
        ELSE
            NEW.aging_status = 'on_track';
        END IF;
    END IF;
    
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for aging calculation
DROP TRIGGER IF EXISTS trigger_calculate_treatment_control_aging ON fair_risk_treatment_controls;
CREATE TRIGGER trigger_calculate_treatment_control_aging
    BEFORE INSERT OR UPDATE ON fair_risk_treatment_controls
    FOR EACH ROW
    EXECUTE FUNCTION calculate_treatment_control_aging();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_fair_treatment_plans_risk_id ON fair_risk_treatment_plans(fair_risk_id);
CREATE INDEX IF NOT EXISTS idx_fair_treatment_controls_plan_id ON fair_risk_treatment_controls(treatment_plan_id);
CREATE INDEX IF NOT EXISTS idx_fair_treatment_controls_due_date ON fair_risk_treatment_controls(due_date);
CREATE INDEX IF NOT EXISTS idx_fair_treatment_controls_aging_status ON fair_risk_treatment_controls(aging_status);
CREATE INDEX IF NOT EXISTS idx_fair_treatment_tracking_plan_id ON fair_risk_treatment_tracking(treatment_plan_id);
CREATE INDEX IF NOT EXISTS idx_fair_treatment_tracking_control_id ON fair_risk_treatment_tracking(control_id);
CREATE INDEX IF NOT EXISTS idx_fair_treatment_tracking_changed_at ON fair_risk_treatment_tracking(changed_at);
