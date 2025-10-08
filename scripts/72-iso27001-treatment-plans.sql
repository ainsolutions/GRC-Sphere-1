-- Create ISO 27001 Treatment Plans table
CREATE TABLE IF NOT EXISTS iso27001_treatment_plans (
    id SERIAL PRIMARY KEY,
    plan_id VARCHAR(50) UNIQUE NOT NULL,
    iso27001_risk_id INTEGER NOT NULL REFERENCES iso27001_risks(id) ON DELETE CASCADE,
    iso_risk_id VARCHAR(50) NOT NULL,
    risk_title VARCHAR(500) NOT NULL,
    original_risk_level VARCHAR(20) NOT NULL,
    original_risk_score INTEGER NOT NULL,
    treatment_type VARCHAR(20) NOT NULL CHECK (treatment_type IN ('mitigate', 'transfer', 'accept', 'avoid')),
    treatment_strategy TEXT,
    business_justification TEXT,
    estimated_cost DECIMAL(12,2) DEFAULT 0,
    expected_risk_reduction INTEGER DEFAULT 0 CHECK (expected_risk_reduction >= 0 AND expected_risk_reduction <= 100),
    plan_status VARCHAR(20) DEFAULT 'draft' CHECK (plan_status IN ('draft', 'approved', 'in_progress', 'completed', 'on_hold')),
    owner VARCHAR(100) NOT NULL,
    assigned_to VARCHAR(100),
    start_date DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    residual_likelihood INTEGER DEFAULT 1 CHECK (residual_likelihood >= 1 AND residual_likelihood <= 5),
    residual_impact INTEGER DEFAULT 1 CHECK (residual_impact >= 1 AND residual_impact <= 5),
    residual_risk_score INTEGER GENERATED ALWAYS AS (residual_likelihood * residual_impact) STORED,
    residual_risk_level VARCHAR(20) GENERATED ALWAYS AS (
        CASE 
            WHEN (residual_likelihood * residual_impact) >= 15 THEN 'Critical'
            WHEN (residual_likelihood * residual_impact) >= 10 THEN 'High'
            WHEN (residual_likelihood * residual_impact) >= 5 THEN 'Medium'
            ELSE 'Low'
        END
    ) STORED,
    total_controls INTEGER DEFAULT 0,
    completed_controls INTEGER DEFAULT 0,
    overdue_controls INTEGER DEFAULT 0,
    avg_effectiveness DECIMAL(3,2) DEFAULT 0,
    actual_cost DECIMAL(12,2) DEFAULT 0,
    plan_aging_days INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'System'
);

-- Create ISO 27001 Treatment Controls table
CREATE TABLE IF NOT EXISTS iso27001_treatment_controls (
    id SERIAL PRIMARY KEY,
    control_id VARCHAR(50) UNIQUE NOT NULL,
    treatment_plan_id INTEGER NOT NULL REFERENCES iso27001_treatment_plans(id) ON DELETE CASCADE,
    treatment_plan_id_display VARCHAR(50) NOT NULL,
    treatment_type VARCHAR(20) NOT NULL,
    iso_risk_id VARCHAR(50) NOT NULL,
    risk_title VARCHAR(500) NOT NULL,
    control_title VARCHAR(200) NOT NULL,
    control_description TEXT,
    control_type VARCHAR(20) DEFAULT 'preventive' CHECK (control_type IN ('preventive', 'detective', 'corrective')),
    control_category VARCHAR(100),
    implementation_status VARCHAR(20) DEFAULT 'not_started' CHECK (implementation_status IN ('not_started', 'in_progress', 'completed', 'on_hold', 'cancelled')),
    effectiveness_rating INTEGER DEFAULT 0 CHECK (effectiveness_rating >= 0 AND effectiveness_rating <= 5),
    implementation_cost DECIMAL(10,2) DEFAULT 0,
    assigned_owner VARCHAR(100),
    technical_contact VARCHAR(100),
    implementation_date DATE,
    testing_date DATE,
    next_review_date DATE,
    due_date DATE,
    completion_date DATE,
    automation_level VARCHAR(20) DEFAULT 'manual' CHECK (automation_level IN ('manual', 'semi_automated', 'fully_automated')),
    compliance_frameworks TEXT[] DEFAULT ARRAY['ISO 27001'],
    evidence_location TEXT,
    testing_procedure TEXT,
    remediation_notes TEXT,
    aging_days INTEGER DEFAULT 0,
    aging_status VARCHAR(20) DEFAULT 'on_track' CHECK (aging_status IN ('on_track', 'due_soon', 'overdue', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create ISO 27001 Treatment Tracking table
CREATE TABLE IF NOT EXISTS iso27001_treatment_tracking (
    id SERIAL PRIMARY KEY,
    treatment_plan_id INTEGER NOT NULL REFERENCES iso27001_treatment_plans(id) ON DELETE CASCADE,
    control_id INTEGER REFERENCES iso27001_treatment_controls(id) ON DELETE CASCADE,
    treatment_plan_id_display VARCHAR(50) NOT NULL,
    control_title VARCHAR(200),
    iso_risk_id VARCHAR(50) NOT NULL,
    risk_title VARCHAR(500) NOT NULL,
    tracking_type VARCHAR(20) NOT NULL CHECK (tracking_type IN ('status_change', 'assignment_change', 'progress_update', 'cost_update', 'review')),
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    tracking_date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    impact_assessment TEXT,
    action_required TEXT,
    responsible_party VARCHAR(100),
    due_date DATE,
    resolution_date DATE,
    aging_days INTEGER DEFAULT 0,
    created_by VARCHAR(100) DEFAULT 'System',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_iso27001_treatment_plans_risk_id ON iso27001_treatment_plans(iso27001_risk_id);
CREATE INDEX IF NOT EXISTS idx_iso27001_treatment_plans_status ON iso27001_treatment_plans(plan_status);
CREATE INDEX IF NOT EXISTS idx_iso27001_treatment_plans_owner ON iso27001_treatment_plans(owner);
CREATE INDEX IF NOT EXISTS idx_iso27001_treatment_controls_plan_id ON iso27001_treatment_controls(treatment_plan_id);
CREATE INDEX IF NOT EXISTS idx_iso27001_treatment_controls_status ON iso27001_treatment_controls(implementation_status);
CREATE INDEX IF NOT EXISTS idx_iso27001_treatment_tracking_plan_id ON iso27001_treatment_tracking(treatment_plan_id);

-- Function to generate treatment plan ID
CREATE OR REPLACE FUNCTION generate_iso27001_treatment_plan_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.plan_id := 'ISO-TP-' || LPAD(nextval('iso27001_treatment_plans_id_seq')::text, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate control ID
CREATE OR REPLACE FUNCTION generate_iso27001_control_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.control_id := 'ISO-TC-' || LPAD(nextval('iso27001_treatment_controls_id_seq')::text, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update aging calculations
CREATE OR REPLACE FUNCTION update_iso27001_aging()
RETURNS TRIGGER AS $$
BEGIN
    -- Update plan aging
    IF TG_TABLE_NAME = 'iso27001_treatment_plans' THEN
        IF NEW.target_completion_date IS NOT NULL AND NEW.actual_completion_date IS NULL THEN
            NEW.plan_aging_days := GREATEST(0, CURRENT_DATE - NEW.target_completion_date);
        ELSE
            NEW.plan_aging_days := 0;
        END IF;
    END IF;
    
    -- Update control aging
    IF TG_TABLE_NAME = 'iso27001_treatment_controls' THEN
        IF NEW.due_date IS NOT NULL AND NEW.completion_date IS NULL THEN
            NEW.aging_days := GREATEST(0, CURRENT_DATE - NEW.due_date);
            
            -- Update aging status
            IF NEW.implementation_status = 'completed' THEN
                NEW.aging_status := 'completed';
            ELSIF NEW.aging_days > 0 THEN
                NEW.aging_status := 'overdue';
            ELSIF NEW.aging_days >= -7 THEN
                NEW.aging_status := 'due_soon';
            ELSE
                NEW.aging_status := 'on_track';
            END IF;
        ELSE
            NEW.aging_days := 0;
            NEW.aging_status := CASE WHEN NEW.implementation_status = 'completed' THEN 'completed' ELSE 'on_track' END;
        END IF;
    END IF;
    
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trg_generate_iso27001_treatment_plan_id ON iso27001_treatment_plans;
CREATE TRIGGER trg_generate_iso27001_treatment_plan_id
    BEFORE INSERT ON iso27001_treatment_plans
    FOR EACH ROW EXECUTE FUNCTION generate_iso27001_treatment_plan_id();

DROP TRIGGER IF EXISTS trg_generate_iso27001_control_id ON iso27001_treatment_controls;
CREATE TRIGGER trg_generate_iso27001_control_id
    BEFORE INSERT ON iso27001_treatment_controls
    FOR EACH ROW EXECUTE FUNCTION generate_iso27001_control_id();

DROP TRIGGER IF EXISTS trg_update_iso27001_plan_aging ON iso27001_treatment_plans;
CREATE TRIGGER trg_update_iso27001_plan_aging
    BEFORE INSERT OR UPDATE ON iso27001_treatment_plans
    FOR EACH ROW EXECUTE FUNCTION update_iso27001_aging();

DROP TRIGGER IF EXISTS trg_update_iso27001_control_aging ON iso27001_treatment_controls;
CREATE TRIGGER trg_update_iso27001_control_aging
    BEFORE INSERT OR UPDATE ON iso27001_treatment_controls
    FOR EACH ROW EXECUTE FUNCTION update_iso27001_aging();
