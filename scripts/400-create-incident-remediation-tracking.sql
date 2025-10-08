-- Create Incident Remediation Tracking Table
-- This table tracks remediation activities for security incidents

CREATE TABLE IF NOT EXISTS incident_remediation_tracking (
    id SERIAL PRIMARY KEY,
    remediation_id VARCHAR(50) UNIQUE NOT NULL DEFAULT 'INC-REM-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('incident_remediation_tracking_id_seq')::TEXT, 4, '0'),
    incident_id VARCHAR(50) REFERENCES incidents(incident_id) ON DELETE CASCADE,
    remediation_title VARCHAR(255) NOT NULL,
    remediation_description TEXT,
    remediation_type VARCHAR(50) DEFAULT 'Root Cause Fix' CHECK (remediation_type IN ('Root Cause Fix', 'Process Improvement', 'Control Enhancement', 'Training', 'Policy Update', 'System Upgrade', 'Monitoring Enhancement')),
    
    -- Status and Priority
    status VARCHAR(50) DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Under Review', 'Completed', 'Verified', 'Cancelled', 'On Hold')),
    priority VARCHAR(20) DEFAULT 'Medium' CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
    
    -- Assignment and Ownership
    assigned_to VARCHAR(255),
    assigned_email VARCHAR(255),
    responsible_department VARCHAR(100),
    responsible_manager VARCHAR(255),
    
    -- Timeline Management
    start_date DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    -- Resource Planning
    estimated_effort_hours INTEGER,
    actual_effort_hours INTEGER,
    estimated_cost NUMERIC(12,2),
    actual_cost NUMERIC(12,2),
    budget_approved BOOLEAN DEFAULT false,
    budget_approval_date DATE,
    
    -- Risk Assessment
    risk_before_remediation VARCHAR(20) DEFAULT 'Medium' CHECK (risk_before_remediation IN ('Critical', 'High', 'Medium', 'Low')),
    risk_after_remediation VARCHAR(20) CHECK (risk_after_remediation IN ('Critical', 'High', 'Medium', 'Low')),
    business_impact_assessment TEXT,
    
    -- Verification and Closure
    verification_status VARCHAR(50) DEFAULT 'Pending' CHECK (verification_status IN ('Pending', 'In Progress', 'Verified', 'Failed', 'Not Required')),
    verification_date DATE,
    verified_by VARCHAR(255),
    verification_method TEXT,
    verification_evidence TEXT,
    
    -- Success Criteria and Effectiveness
    success_criteria TEXT,
    effectiveness_rating INTEGER CHECK (effectiveness_rating >= 1 AND effectiveness_rating <= 5),
    lessons_learned TEXT,
    
    -- Communication and Updates
    last_update_date DATE DEFAULT CURRENT_DATE,
    next_review_date DATE,
    escalation_required BOOLEAN DEFAULT false,
    escalation_date DATE,
    escalation_reason TEXT,
    
    -- Supporting Documentation
    supporting_documents TEXT[],
    evidence_files TEXT[],
    
    -- Audit Trail
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Create Incident Remediation Updates Table for progress tracking
CREATE TABLE IF NOT EXISTS incident_remediation_updates (
    id SERIAL PRIMARY KEY,
    remediation_id INTEGER REFERENCES incident_remediation_tracking(id) ON DELETE CASCADE,
    update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_type VARCHAR(50) DEFAULT 'Progress Update' CHECK (update_type IN ('Progress Update', 'Status Change', 'Milestone Achieved', 'Issue Identified', 'Resource Change', 'Timeline Change')),
    update_description TEXT NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    previous_progress INTEGER,
    new_progress INTEGER,
    updated_by VARCHAR(255),
    updated_by_email VARCHAR(255),
    attachments TEXT[],
    next_steps TEXT,
    challenges TEXT,
    achievements TEXT,
    effort_spent_hours INTEGER,
    budget_spent_to_date NUMERIC(12,2)
);

-- Create Incident Remediation Dependencies Table
CREATE TABLE IF NOT EXISTS incident_remediation_dependencies (
    id SERIAL PRIMARY KEY,
    remediation_id INTEGER REFERENCES incident_remediation_tracking(id) ON DELETE CASCADE,
    dependent_remediation_id INTEGER REFERENCES incident_remediation_tracking(id) ON DELETE CASCADE,
    dependency_type VARCHAR(50) DEFAULT 'blocks' CHECK (dependency_type IN ('blocks', 'related', 'prerequisite', 'parallel')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(remediation_id, dependent_remediation_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_incident_remediation_tracking_incident_id ON incident_remediation_tracking(incident_id);
CREATE INDEX IF NOT EXISTS idx_incident_remediation_tracking_status ON incident_remediation_tracking(status);
CREATE INDEX IF NOT EXISTS idx_incident_remediation_tracking_priority ON incident_remediation_tracking(priority);
CREATE INDEX IF NOT EXISTS idx_incident_remediation_tracking_assigned_to ON incident_remediation_tracking(assigned_to);
CREATE INDEX IF NOT EXISTS idx_incident_remediation_tracking_target_date ON incident_remediation_tracking(target_completion_date);
CREATE INDEX IF NOT EXISTS idx_incident_remediation_tracking_verification_status ON incident_remediation_tracking(verification_status);
CREATE INDEX IF NOT EXISTS idx_incident_remediation_tracking_department ON incident_remediation_tracking(responsible_department);

CREATE INDEX IF NOT EXISTS idx_incident_remediation_updates_remediation_id ON incident_remediation_updates(remediation_id);
CREATE INDEX IF NOT EXISTS idx_incident_remediation_updates_date ON incident_remediation_updates(update_date);

CREATE INDEX IF NOT EXISTS idx_incident_remediation_dependencies_remediation_id ON incident_remediation_dependencies(remediation_id);
CREATE INDEX IF NOT EXISTS idx_incident_remediation_dependencies_dependent_id ON incident_remediation_dependencies(dependent_remediation_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_incident_remediation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    NEW.last_update_date = CURRENT_DATE;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_incident_remediation_tracking_updated_at 
    BEFORE UPDATE ON incident_remediation_tracking 
    FOR EACH ROW EXECUTE FUNCTION update_incident_remediation_updated_at();

-- Create view for incident remediation statistics
CREATE OR REPLACE VIEW incident_remediation_stats AS
SELECT
    COUNT(*) AS total_remediations,
    SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) AS open_remediations,
    SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress_remediations,
    SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_remediations,
    SUM(CASE WHEN status = 'Verified' THEN 1 ELSE 0 END) AS verified_remediations,
    SUM(CASE WHEN target_completion_date < CURRENT_DATE AND status NOT IN ('Completed', 'Verified') THEN 1 ELSE 0 END) AS overdue_remediations,
    SUM(CASE WHEN verification_status = 'Pending' THEN 1 ELSE 0 END) AS pending_verification,
    SUM(CASE WHEN priority = 'Critical' THEN 1 ELSE 0 END) AS critical_priority,
    SUM(CASE WHEN priority = 'High' THEN 1 ELSE 0 END) AS high_priority,
    SUM(CASE WHEN escalation_required = true THEN 1 ELSE 0 END) AS escalated_remediations,
    COALESCE(SUM(estimated_cost), 0) AS total_estimated_cost,
    COALESCE(SUM(actual_cost), 0) AS total_actual_cost,
    COALESCE(AVG(progress_percentage), 0) AS avg_completion_percentage,
    COALESCE(AVG(effectiveness_rating), 0) AS avg_effectiveness_rating
FROM incident_remediation_tracking;

-- Create view for department-wise statistics
CREATE OR REPLACE VIEW incident_remediation_department_stats AS
SELECT
    responsible_department,
    COUNT(*) AS total_remediations,
    SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_remediations,
    ROUND((SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2) AS completion_percentage,
    SUM(CASE WHEN target_completion_date < CURRENT_DATE AND status NOT IN ('Completed', 'Verified') THEN 1 ELSE 0 END) AS overdue_count,
    COALESCE(AVG(progress_percentage), 0) AS avg_progress,
    COALESCE(SUM(estimated_cost), 0) AS total_budget,
    COALESCE(SUM(actual_cost), 0) AS total_spent
FROM incident_remediation_tracking
WHERE responsible_department IS NOT NULL
GROUP BY responsible_department;

-- Insert sample incident remediation data
INSERT INTO incident_remediation_tracking (
    incident_id, remediation_title, remediation_description, remediation_type,
    status, priority, assigned_to, assigned_email, responsible_department,
    start_date, target_completion_date, estimated_effort_hours, estimated_cost,
    risk_before_remediation, business_impact_assessment, success_criteria,
    created_by
) VALUES
(
    'INC-001',
    'Implement Account Lockout Policy',
    'Configure automatic account lockout after 5 failed login attempts to prevent brute force attacks. Update security policies and implement across all systems.',
    'Control Enhancement',
    'In Progress',
    'High',
    'John Smith',
    'john.smith@company.com',
    'IT Security',
    '2024-01-16',
    '2024-02-15',
    40,
    5000.00,
    'High',
    'Prevents unauthorized access attempts and reduces security breach risk',
    'All systems implement account lockout after 5 failed attempts within 15 minutes',
    'Security Team'
),
(
    'INC-001',
    'Enhanced Monitoring for Admin Accounts',
    'Deploy advanced monitoring and alerting for all administrative accounts to detect suspicious activities in real-time.',
    'Monitoring Enhancement',
    'Open',
    'High',
    'Sarah Johnson',
    'sarah.johnson@company.com',
    'IT Security',
    '2024-01-20',
    '2024-03-01',
    60,
    15000.00,
    'High',
    'Improves detection capabilities for privileged account abuse',
    'Real-time alerts for all admin account activities with automated response capabilities',
    'Security Team'
),
(
    'INC-002',
    'Database Failover Configuration',
    'Implement automatic database failover to secondary server to prevent future system outages and ensure business continuity.',
    'System Upgrade',
    'In Progress',
    'Critical',
    'Mike Davis',
    'mike.davis@company.com',
    'Database Administration',
    '2024-01-15',
    '2024-02-28',
    120,
    25000.00,
    'Critical',
    'Eliminates single point of failure for critical financial systems',
    'Automatic failover within 30 seconds with zero data loss',
    'IT Manager'
),
(
    'INC-002',
    'Application Server Clustering',
    'Configure application server clustering to provide high availability and load distribution for financial applications.',
    'System Upgrade',
    'Open',
    'High',
    'Lisa Wong',
    'lisa.wong@company.com',
    'Application Development',
    '2024-02-01',
    '2024-03-15',
    80,
    20000.00,
    'High',
    'Ensures application availability during server maintenance or failures',
    'Load balanced application servers with automatic failover',
    'IT Manager'
),
(
    'INC-003',
    'Backup System Redundancy',
    'Implement redundant backup systems with automated verification to ensure data protection and recovery capabilities.',
    'System Upgrade',
    'Completed',
    'Medium',
    'Robert Chen',
    'robert.chen@company.com',
    'IT Operations',
    '2024-01-14',
    '2024-01-31',
    32,
    8000.00,
    'Medium',
    'Ensures reliable data backup and recovery processes',
    'Dual backup systems with automated daily verification and monthly recovery testing',
    'Backup Administrator'
),
(
    'INC-004',
    'Phishing Awareness Training',
    'Conduct comprehensive phishing awareness training for all employees to improve security awareness and reduce susceptibility to social engineering attacks.',
    'Training',
    'In Progress',
    'High',
    'Jennifer Lee',
    'jennifer.lee@company.com',
    'Human Resources',
    '2024-01-15',
    '2024-02-29',
    24,
    3000.00,
    'High',
    'Reduces human error factor in security incidents',
    '95% of employees complete training with passing score on phishing simulation',
    'HR Department'
),
(
    'INC-004',
    'Email Security Gateway Enhancement',
    'Upgrade email security gateway with advanced threat detection to automatically block sophisticated phishing attempts.',
    'System Upgrade',
    'Open',
    'Medium',
    'David Park',
    'david.park@company.com',
    'IT Security',
    '2024-01-25',
    '2024-03-10',
    48,
    12000.00,
    'Medium',
    'Provides automated protection against email-based threats',
    'Block 99% of phishing emails before reaching user inboxes',
    'Security Team'
),
(
    'INC-005',
    'Endpoint Detection and Response Deployment',
    'Deploy advanced EDR solution across all workstations to improve malware detection and response capabilities.',
    'System Upgrade',
    'Completed',
    'High',
    'Alex Thompson',
    'alex.thompson@company.com',
    'IT Security',
    '2024-01-12',
    '2024-01-25',
    56,
    18000.00,
    'High',
    'Enhances malware detection and automated response capabilities',
    'Real-time malware detection with automated quarantine and remediation',
    'Security Analyst'
);

-- Insert sample remediation updates
INSERT INTO incident_remediation_updates (
    remediation_id, update_type, update_description, previous_status, new_status,
    previous_progress, new_progress, updated_by, updated_by_email, next_steps,
    effort_spent_hours
) VALUES
(1, 'Progress Update', 'Completed policy documentation and started system configuration', 'Open', 'In Progress', 0, 25, 'John Smith', 'john.smith@company.com', 'Configure lockout settings on remaining 3 systems', 10),
(3, 'Progress Update', 'Primary database server configured, working on secondary server setup', 'Open', 'In Progress', 0, 40, 'Mike Davis', 'mike.davis@company.com', 'Complete secondary server configuration and test failover', 48),
(5, 'Status Change', 'Backup system redundancy implementation completed and tested successfully', 'In Progress', 'Completed', 80, 100, 'Robert Chen', 'robert.chen@company.com', 'Schedule monthly recovery testing', 32),
(6, 'Progress Update', 'Training materials prepared, first session conducted for management team', 'Open', 'In Progress', 0, 30, 'Jennifer Lee', 'jennifer.lee@company.com', 'Schedule training sessions for all departments', 8),
(8, 'Status Change', 'EDR solution deployed to all workstations and monitoring active', 'In Progress', 'Completed', 90, 100, 'Alex Thompson', 'alex.thompson@company.com', 'Monitor for 30 days and fine-tune detection rules', 56);

-- Insert sample dependencies
INSERT INTO incident_remediation_dependencies (
    remediation_id, dependent_remediation_id, dependency_type, description
) VALUES
(1, 2, 'related', 'Both remediations address the same security incident and should be coordinated'),
(3, 4, 'prerequisite', 'Database failover must be completed before implementing application clustering'),
(6, 7, 'parallel', 'Training and technical controls should be implemented together for maximum effectiveness');
