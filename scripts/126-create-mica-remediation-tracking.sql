-- MICA Remediation Tracking tables for managing compliance remediation activities

-- MICA Remediation Plans table
CREATE TABLE IF NOT EXISTS mica_remediation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_name VARCHAR(200) NOT NULL,
    description TEXT,
    gap_analysis_id UUID REFERENCES mica_gap_analysis(id),
    owner_name VARCHAR(100) NOT NULL,
    owner_email VARCHAR(255) NOT NULL,
    owner_department VARCHAR(100),
    start_date DATE,
    target_completion_date DATE NOT NULL,
    actual_completion_date DATE,
    budget_allocated DECIMAL(12,2) NOT NULL DEFAULT 0,
    budget_spent DECIMAL(12,2) DEFAULT 0,
    budget_remaining DECIMAL(12,2) GENERATED ALWAYS AS (budget_allocated - COALESCE(budget_spent, 0)) STORED,
    priority_level VARCHAR(20) NOT NULL DEFAULT 'medium', -- critical, high, medium, low
    status VARCHAR(30) NOT NULL DEFAULT 'active', -- active, on_hold, completed, cancelled
    completion_percentage INTEGER DEFAULT 0,
    success_criteria TEXT,
    key_milestones TEXT[],
    risks_and_issues TEXT,
    lessons_learned TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT mica_remediation_priority_check 
        CHECK (priority_level IN ('critical', 'high', 'medium', 'low')),
    CONSTRAINT mica_remediation_status_check 
        CHECK (status IN ('active', 'on_hold', 'completed', 'cancelled')),
    CONSTRAINT mica_remediation_completion_check 
        CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    CONSTRAINT mica_remediation_budget_check 
        CHECK (budget_allocated >= 0 AND budget_spent >= 0)
);

-- MICA Remediation Items table
CREATE TABLE IF NOT EXISTS mica_remediation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remediation_id UUID NOT NULL REFERENCES mica_remediation(id) ON DELETE CASCADE,
    gap_item_id UUID REFERENCES mica_gap_analysis_items(id),
    item_title VARCHAR(200) NOT NULL,
    item_description TEXT NOT NULL,
    gap_reference VARCHAR(100),
    category VARCHAR(100),
    assigned_to VARCHAR(100) NOT NULL,
    assigned_to_email VARCHAR(255),
    assigned_department VARCHAR(100),
    estimated_cost DECIMAL(12,2) DEFAULT 0,
    actual_cost DECIMAL(12,2) DEFAULT 0,
    estimated_effort_days INTEGER,
    actual_effort_days INTEGER,
    start_date DATE,
    target_completion_date DATE NOT NULL,
    actual_completion_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'not_started', -- not_started, in_progress, completed, overdue, blocked
    completion_percentage INTEGER DEFAULT 0,
    deliverables TEXT[],
    dependencies TEXT[],
    risks_issues TEXT,
    status_notes TEXT,
    last_update_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT mica_remediation_items_status_check 
        CHECK (status IN ('not_started', 'in_progress', 'completed', 'overdue', 'blocked')),
    CONSTRAINT mica_remediation_items_completion_check 
        CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    CONSTRAINT mica_remediation_items_cost_check 
        CHECK (estimated_cost >= 0 AND actual_cost >= 0)
);

-- MICA Remediation Milestones table
CREATE TABLE IF NOT EXISTS mica_remediation_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remediation_id UUID NOT NULL REFERENCES mica_remediation(id) ON DELETE CASCADE,
    milestone_name VARCHAR(200) NOT NULL,
    milestone_description TEXT,
    milestone_type VARCHAR(50) NOT NULL, -- deliverable, checkpoint, approval, review
    target_date DATE NOT NULL,
    actual_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, overdue, cancelled
    completion_criteria TEXT,
    deliverables TEXT[],
    responsible_party VARCHAR(100),
    approval_required BOOLEAN DEFAULT false,
    approved_by VARCHAR(100),
    approval_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT mica_remediation_milestones_type_check 
        CHECK (milestone_type IN ('deliverable', 'checkpoint', 'approval', 'review')),
    CONSTRAINT mica_remediation_milestones_status_check 
        CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue', 'cancelled'))
);

-- MICA Remediation Progress Updates table
CREATE TABLE IF NOT EXISTS mica_remediation_progress_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remediation_item_id UUID NOT NULL REFERENCES mica_remediation_items(id) ON DELETE CASCADE,
    update_date DATE NOT NULL DEFAULT CURRENT_DATE,
    previous_completion_percentage INTEGER,
    new_completion_percentage INTEGER NOT NULL,
    progress_description TEXT NOT NULL,
    achievements TEXT,
    challenges TEXT,
    next_steps TEXT,
    budget_spent_to_date DECIMAL(12,2),
    effort_spent_days INTEGER,
    updated_by VARCHAR(100) NOT NULL,
    updated_by_email VARCHAR(255),
    attachments TEXT[], -- Array of file paths/references
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT mica_remediation_progress_completion_check 
        CHECK (new_completion_percentage >= 0 AND new_completion_percentage <= 100)
);

-- MICA Remediation Reviews table
CREATE TABLE IF NOT EXISTS mica_remediation_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remediation_id UUID NOT NULL REFERENCES mica_remediation(id) ON DELETE CASCADE,
    review_date DATE NOT NULL,
    review_type VARCHAR(50) NOT NULL, -- weekly, monthly, quarterly, milestone, ad_hoc
    reviewer_name VARCHAR(100) NOT NULL,
    reviewer_email VARCHAR(255) NOT NULL,
    reviewer_role VARCHAR(100),
    overall_status_assessment VARCHAR(30), -- on_track, at_risk, behind_schedule, completed
    key_achievements TEXT,
    issues_identified TEXT,
    recommendations TEXT,
    budget_status_assessment TEXT,
    timeline_assessment TEXT,
    quality_assessment TEXT,
    next_review_date DATE,
    action_items TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT mica_remediation_reviews_type_check 
        CHECK (review_type IN ('weekly', 'monthly', 'quarterly', 'milestone', 'ad_hoc')),
    CONSTRAINT mica_remediation_reviews_status_check 
        CHECK (overall_status_assessment IN ('on_track', 'at_risk', 'behind_schedule', 'completed'))
);

-- MICA Remediation Metrics table
CREATE TABLE IF NOT EXISTS mica_remediation_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    remediation_id UUID NOT NULL REFERENCES mica_remediation(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_items INTEGER DEFAULT 0,
    completed_items INTEGER DEFAULT 0,
    in_progress_items INTEGER DEFAULT 0,
    not_started_items INTEGER DEFAULT 0,
    overdue_items INTEGER DEFAULT 0,
    blocked_items INTEGER DEFAULT 0,
    overall_completion_percentage DECIMAL(5,2),
    budget_utilization_percentage DECIMAL(5,2),
    schedule_performance_index DECIMAL(5,2), -- Earned value metric
    cost_performance_index DECIMAL(5,2), -- Earned value metric
    quality_score INTEGER, -- 1-100 scale
    risk_score INTEGER, -- 1-100 scale
    calculated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(remediation_id, metric_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mica_remediation_status ON mica_remediation(status);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_priority ON mica_remediation(priority_level);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_owner ON mica_remediation(owner_email);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_target_date ON mica_remediation(target_completion_date);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_items_remediation ON mica_remediation_items(remediation_id);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_items_assigned ON mica_remediation_items(assigned_to);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_items_status ON mica_remediation_items(status);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_items_target_date ON mica_remediation_items(target_completion_date);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_milestones_remediation ON mica_remediation_milestones(remediation_id);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_milestones_status ON mica_remediation_milestones(status);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_progress_item ON mica_remediation_progress_updates(remediation_item_id);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_progress_date ON mica_remediation_progress_updates(update_date);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_reviews_remediation ON mica_remediation_reviews(remediation_id);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_reviews_date ON mica_remediation_reviews(review_date);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_metrics_remediation ON mica_remediation_metrics(remediation_id);
CREATE INDEX IF NOT EXISTS idx_mica_remediation_metrics_date ON mica_remediation_metrics(metric_date);

-- Function to automatically update item status based on dates
CREATE OR REPLACE FUNCTION update_mica_remediation_item_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Auto-update status to overdue if past target date and not completed
    IF NEW.target_completion_date < CURRENT_DATE 
       AND NEW.status NOT IN ('completed', 'cancelled') 
       AND NEW.completion_percentage < 100 THEN
        NEW.status := 'overdue';
    END IF;
    
    -- Auto-update status to completed if 100% complete
    IF NEW.completion_percentage = 100 AND NEW.status != 'completed' THEN
        NEW.status := 'completed';
        NEW.actual_completion_date := CURRENT_DATE;
    END IF;
    
    -- Update last_update_date
    NEW.last_update_date := CURRENT_DATE;
    NEW.updated_at := NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_mica_remediation_item_status
    BEFORE UPDATE ON mica_remediation_items
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_remediation_item_status();

-- Function to calculate overall remediation plan completion
CREATE OR REPLACE FUNCTION calculate_mica_remediation_completion()
RETURNS TRIGGER AS $$
DECLARE
    plan_id UUID;
    total_items INTEGER;
    avg_completion DECIMAL(5,2);
BEGIN
    -- Get the remediation plan ID
    IF TG_OP = 'DELETE' THEN
        plan_id := OLD.remediation_id;
    ELSE
        plan_id := NEW.remediation_id;
    END IF;
    
    -- Calculate average completion percentage
    SELECT 
        COUNT(*),
        COALESCE(AVG(completion_percentage), 0)
    INTO total_items, avg_completion
    FROM mica_remediation_items 
    WHERE remediation_id = plan_id;
    
    -- Update the remediation plan
    UPDATE mica_remediation 
    SET 
        completion_percentage = ROUND(avg_completion),
        updated_at = NOW()
    WHERE id = plan_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_mica_remediation_completion
    AFTER INSERT OR UPDATE OR DELETE ON mica_remediation_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_mica_remediation_completion();

-- Add triggers for updated_at timestamps
CREATE TRIGGER trigger_update_mica_remediation_updated_at
    BEFORE UPDATE ON mica_remediation
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_requirements_updated_at();

CREATE TRIGGER trigger_update_mica_remediation_items_updated_at
    BEFORE UPDATE ON mica_remediation_items
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_requirements_updated_at();

CREATE TRIGGER trigger_update_mica_remediation_milestones_updated_at
    BEFORE UPDATE ON mica_remediation_milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_mica_requirements_updated_at();

COMMIT;
