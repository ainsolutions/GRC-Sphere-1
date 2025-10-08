-- Create risk treatment plans table
CREATE TABLE IF NOT EXISTS risk_treatment_plans (
    id SERIAL PRIMARY KEY,
    plan_id VARCHAR(50) UNIQUE NOT NULL DEFAULT 'RTP-' || LPAD(nextval('risk_treatment_plan_seq')::TEXT, 6, '0'),
    fair_risk_id INTEGER REFERENCES fair_risks(id) ON DELETE CASCADE,
    plan_title VARCHAR(255) NOT NULL,
    plan_description TEXT,
    treatment_type VARCHAR(50) NOT NULL CHECK (treatment_type IN ('accept', 'mitigate', 'transfer', 'avoid')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    estimated_cost DECIMAL(15,2) DEFAULT 0,
    estimated_effort_hours INTEGER DEFAULT 0,
    expected_risk_reduction DECIMAL(5,2) DEFAULT 0 CHECK (expected_risk_reduction >= 0 AND expected_risk_reduction <= 100),
    plan_status VARCHAR(50) DEFAULT 'draft' CHECK (plan_status IN ('draft', 'approved', 'in_progress', 'completed', 'cancelled', 'on_hold')),
    assigned_to VARCHAR(255),
    start_date DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    approval_required BOOLEAN DEFAULT false,
    approved_by VARCHAR(255),
    approved_date DATE,
    created_by VARCHAR(255) DEFAULT 'system',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create risk treatment controls table
CREATE TABLE IF NOT EXISTS risk_treatment_controls (
    id SERIAL PRIMARY KEY,
    control_id VARCHAR(50) UNIQUE NOT NULL DEFAULT 'RTC-' || LPAD(nextval('risk_treatment_control_seq')::TEXT, 6, '0'),
    treatment_plan_id INTEGER REFERENCES risk_treatment_plans(id) ON DELETE CASCADE,
    control_title VARCHAR(255) NOT NULL,
    control_description TEXT,
    control_type VARCHAR(50) NOT NULL CHECK (control_type IN ('preventive', 'detective', 'corrective', 'compensating')),
    control_category VARCHAR(100),
    implementation_status VARCHAR(50) DEFAULT 'planned' CHECK (implementation_status IN ('planned', 'in_progress', 'implemented', 'tested', 'operational', 'failed', 'deferred')),
    effectiveness_rating INTEGER DEFAULT 3 CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    implementation_cost DECIMAL(15,2) DEFAULT 0,
    maintenance_cost_annual DECIMAL(15,2) DEFAULT 0,
    assigned_owner VARCHAR(255),
    technical_contact VARCHAR(255),
    implementation_date DATE,
    testing_date DATE,
    next_review_date DATE,
    automation_level VARCHAR(50) DEFAULT 'manual' CHECK (automation_level IN ('manual', 'semi_automated', 'fully_automated')),
    compliance_frameworks TEXT[], -- Array of compliance frameworks this control addresses
    evidence_location TEXT,
    testing_procedure TEXT,
    remediation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create risk treatment tracking table for historical changes
CREATE TABLE IF NOT EXISTS risk_treatment_tracking (
    id SERIAL PRIMARY KEY,
    treatment_plan_id INTEGER REFERENCES risk_treatment_plans(id) ON DELETE CASCADE,
    control_id INTEGER REFERENCES risk_treatment_controls(id) ON DELETE CASCADE,
    tracking_type VARCHAR(50) NOT NULL CHECK (tracking_type IN ('status_change', 'milestone', 'issue', 'completion', 'review')),
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    tracking_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    impact_assessment TEXT,
    action_required TEXT,
    responsible_party VARCHAR(255),
    due_date DATE,
    resolution_date DATE,
    aging_days INTEGER GENERATED ALWAYS AS (CURRENT_DATE - tracking_date) STORED,
    created_by VARCHAR(255) DEFAULT 'system',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sequences for ID generation
CREATE SEQUENCE IF NOT EXISTS risk_treatment_plan_seq START 1;
CREATE SEQUENCE IF NOT EXISTS risk_treatment_control_seq START 1;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_risk_treatment_plans_fair_risk_id ON risk_treatment_plans(fair_risk_id);
CREATE INDEX IF NOT EXISTS idx_risk_treatment_plans_status ON risk_treatment_plans(plan_status);
CREATE INDEX IF NOT EXISTS idx_risk_treatment_plans_priority ON risk_treatment_plans(priority);
CREATE INDEX IF NOT EXISTS idx_risk_treatment_plans_target_date ON risk_treatment_plans(target_completion_date);
CREATE INDEX IF NOT EXISTS idx_risk_treatment_plans_assigned_to ON risk_treatment_plans(assigned_to);

CREATE INDEX IF NOT EXISTS idx_risk_treatment_controls_plan_id ON risk_treatment_controls(treatment_plan_id);
CREATE INDEX IF NOT EXISTS idx_risk_treatment_controls_status ON risk_treatment_controls(implementation_status);
CREATE INDEX IF NOT EXISTS idx_risk_treatment_controls_owner ON risk_treatment_controls(assigned_owner);
CREATE INDEX IF NOT EXISTS idx_risk_treatment_controls_review_date ON risk_treatment_controls(next_review_date);

CREATE INDEX IF NOT EXISTS idx_risk_treatment_tracking_plan_id ON risk_treatment_tracking(treatment_plan_id);
CREATE INDEX IF NOT EXISTS idx_risk_treatment_tracking_control_id ON risk_treatment_tracking(control_id);
CREATE INDEX IF NOT EXISTS idx_risk_treatment_tracking_type ON risk_treatment_tracking(tracking_type);
CREATE INDEX IF NOT EXISTS idx_risk_treatment_tracking_date ON risk_treatment_tracking(tracking_date);
CREATE INDEX IF NOT EXISTS idx_risk_treatment_tracking_aging ON risk_treatment_tracking(aging_days);

-- Create triggers to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_risk_treatment_plans_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_risk_treatment_controls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_risk_treatment_plans_updated_at ON risk_treatment_plans;
CREATE TRIGGER update_risk_treatment_plans_updated_at
    BEFORE UPDATE ON risk_treatment_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_risk_treatment_plans_updated_at();

DROP TRIGGER IF EXISTS update_risk_treatment_controls_updated_at ON risk_treatment_controls;
CREATE TRIGGER update_risk_treatment_controls_updated_at
    BEFORE UPDATE ON risk_treatment_controls
    FOR EACH ROW
    EXECUTE FUNCTION update_risk_treatment_controls_updated_at();

-- Create trigger to automatically track status changes
CREATE OR REPLACE FUNCTION track_treatment_status_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Track treatment plan status changes
    IF TG_TABLE_NAME = 'risk_treatment_plans' AND OLD.plan_status != NEW.plan_status THEN
        INSERT INTO risk_treatment_tracking (
            treatment_plan_id, tracking_type, old_status, new_status, 
            tracking_date, description, created_by
        ) VALUES (
            NEW.id, 'status_change', OLD.plan_status, NEW.plan_status,
            CURRENT_DATE, 
            'Treatment plan status changed from ' || OLD.plan_status || ' to ' || NEW.plan_status,
            COALESCE(NEW.created_by, 'system')
        );
    END IF;
    
    -- Track control implementation status changes
    IF TG_TABLE_NAME = 'risk_treatment_controls' AND OLD.implementation_status != NEW.implementation_status THEN
        INSERT INTO risk_treatment_tracking (
            control_id, tracking_type, old_status, new_status,
            tracking_date, description, created_by
        ) VALUES (
            NEW.id, 'status_change', OLD.implementation_status, NEW.implementation_status,
            CURRENT_DATE,
            'Control implementation status changed from ' || OLD.implementation_status || ' to ' || NEW.implementation_status,
            'system'
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS track_treatment_plan_changes ON risk_treatment_plans;
CREATE TRIGGER track_treatment_plan_changes
    AFTER UPDATE ON risk_treatment_plans
    FOR EACH ROW
    EXECUTE FUNCTION track_treatment_status_changes();

DROP TRIGGER IF EXISTS track_treatment_control_changes ON risk_treatment_controls;
CREATE TRIGGER track_treatment_control_changes
    AFTER UPDATE ON risk_treatment_controls
    FOR EACH ROW
    EXECUTE FUNCTION track_treatment_status_changes();

-- Add comments for documentation
COMMENT ON TABLE risk_treatment_plans IS 'Risk treatment plans for managing and remediating identified risks';
COMMENT ON TABLE risk_treatment_controls IS 'Individual controls within risk treatment plans';
COMMENT ON TABLE risk_treatment_tracking IS 'Historical tracking of treatment plan and control changes with aging';

COMMENT ON COLUMN risk_treatment_plans.treatment_type IS 'Risk treatment strategy: accept, mitigate, transfer, or avoid';
COMMENT ON COLUMN risk_treatment_plans.expected_risk_reduction IS 'Expected percentage reduction in risk level after treatment';
COMMENT ON COLUMN risk_treatment_controls.effectiveness_rating IS 'Control effectiveness rating (1-5 scale)';
COMMENT ON COLUMN risk_treatment_controls.automation_level IS 'Level of automation: manual, semi_automated, or fully_automated';
COMMENT ON COLUMN risk_treatment_tracking.aging_days IS 'Automatically calculated days since tracking entry was created';
