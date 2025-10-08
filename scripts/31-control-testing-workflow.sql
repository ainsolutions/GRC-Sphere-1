-- Control Testing Workflow Tables

-- Control Test Plans
CREATE TABLE IF NOT EXISTS control_test_plans (
    id SERIAL PRIMARY KEY,
    control_id INTEGER NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    test_description TEXT,
    test_type VARCHAR(50) NOT NULL, -- 'Manual', 'Automated', 'Walkthrough', 'Inspection'
    test_frequency VARCHAR(50) NOT NULL, -- 'Monthly', 'Quarterly', 'Semi-Annually', 'Annually'
    test_procedures TEXT NOT NULL,
    expected_evidence TEXT,
    test_criteria TEXT,
    assigned_tester VARCHAR(255),
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Control Test Executions
CREATE TABLE IF NOT EXISTS control_test_executions (
    id SERIAL PRIMARY KEY,
    control_id INTEGER NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    test_plan_id INTEGER REFERENCES control_test_plans(id) ON DELETE SET NULL,
    test_date DATE NOT NULL,
    tester_name VARCHAR(255) NOT NULL,
    tester_email VARCHAR(255),
    test_result VARCHAR(50) NOT NULL, -- 'Pass', 'Fail', 'Partial', 'Not Applicable'
    effectiveness_rating VARCHAR(50), -- 'Effective', 'Partially Effective', 'Ineffective'
    test_notes TEXT,
    evidence_collected TEXT,
    issues_identified TEXT,
    recommendations TEXT,
    next_test_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Control Test Issues/Findings
CREATE TABLE IF NOT EXISTS control_test_issues (
    id SERIAL PRIMARY KEY,
    test_execution_id INTEGER NOT NULL REFERENCES control_test_executions(id) ON DELETE CASCADE,
    issue_title VARCHAR(255) NOT NULL,
    issue_description TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL, -- 'Critical', 'High', 'Medium', 'Low'
    status VARCHAR(50) DEFAULT 'Open', -- 'Open', 'In Progress', 'Resolved', 'Closed'
    assigned_to VARCHAR(255),
    due_date DATE,
    resolution_notes TEXT,
    resolved_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Control Test Evidence/Attachments
CREATE TABLE IF NOT EXISTS control_test_evidence (
    id SERIAL PRIMARY KEY,
    test_execution_id INTEGER NOT NULL REFERENCES control_test_executions(id) ON DELETE CASCADE,
    evidence_name VARCHAR(255) NOT NULL,
    evidence_type VARCHAR(100), -- 'Document', 'Screenshot', 'Log File', 'Report'
    file_path VARCHAR(500),
    file_size INTEGER,
    description TEXT,
    uploaded_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Control Testing Schedule
CREATE TABLE IF NOT EXISTS control_test_schedule (
    id SERIAL PRIMARY KEY,
    control_id INTEGER NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    test_type VARCHAR(50) NOT NULL,
    assigned_tester VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Scheduled', -- 'Scheduled', 'In Progress', 'Completed', 'Overdue'
    reminder_sent BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_control_test_executions_control_id ON control_test_executions(control_id);
CREATE INDEX IF NOT EXISTS idx_control_test_executions_test_date ON control_test_executions(test_date);
CREATE INDEX IF NOT EXISTS idx_control_test_issues_execution_id ON control_test_issues(test_execution_id);
CREATE INDEX IF NOT EXISTS idx_control_test_schedule_control_id ON control_test_schedule(control_id);
CREATE INDEX IF NOT EXISTS idx_control_test_schedule_date ON control_test_schedule(scheduled_date);

-- Update controls table to track testing status
ALTER TABLE controls ADD COLUMN IF NOT EXISTS last_test_date DATE;
ALTER TABLE controls ADD COLUMN IF NOT EXISTS last_test_result VARCHAR(50);
ALTER TABLE controls ADD COLUMN IF NOT EXISTS test_status VARCHAR(50) DEFAULT 'Not Tested';
