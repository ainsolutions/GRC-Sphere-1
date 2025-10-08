-- Create HIPAA Remediation Tracking Table
CREATE TABLE IF NOT EXISTS hipaa_remediation_actions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requirement_id VARCHAR(50) REFERENCES hipaa_requirements(id) ON DELETE SET NULL,
    assessment_id VARCHAR(50) REFERENCES hipaa_assessments(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Open',
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium',
    severity VARCHAR(20) NOT NULL DEFAULT 'Medium',
    category VARCHAR(50) NOT NULL,
    assigned_to VARCHAR(100),
    created_by VARCHAR(100) NOT NULL,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    target_date TIMESTAMP,
    regulatory_deadline TIMESTAMP,
    completion_date TIMESTAMP,
    involves_phi BOOLEAN DEFAULT FALSE,
    breach_risk BOOLEAN DEFAULT FALSE,
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    department VARCHAR(100),
    parent_action_id INTEGER REFERENCES hipaa_remediation_actions(id) ON DELETE SET NULL,
    tags TEXT[]
);

-- Create HIPAA Remediation Updates Table
CREATE TABLE IF NOT EXISTS hipaa_remediation_updates (
    id SERIAL PRIMARY KEY,
    action_id INTEGER NOT NULL REFERENCES hipaa_remediation_actions(id) ON DELETE CASCADE,
    update_text TEXT NOT NULL,
    status VARCHAR(50),
    updated_by VARCHAR(100) NOT NULL,
    update_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completion_percentage INTEGER,
    attachments TEXT[]
);

-- Create HIPAA Remediation Dependencies Table
CREATE TABLE IF NOT EXISTS hipaa_remediation_dependencies (
    id SERIAL PRIMARY KEY,
    action_id INTEGER NOT NULL REFERENCES hipaa_remediation_actions(id) ON DELETE CASCADE,
    depends_on_action_id INTEGER NOT NULL REFERENCES hipaa_remediation_actions(id) ON DELETE CASCADE,
    dependency_type VARCHAR(50) DEFAULT 'blocks',
    UNIQUE(action_id, depends_on_action_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_remediation_status ON hipaa_remediation_actions(status);
CREATE INDEX IF NOT EXISTS idx_remediation_priority ON hipaa_remediation_actions(priority);
CREATE INDEX IF NOT EXISTS idx_remediation_category ON hipaa_remediation_actions(category);
CREATE INDEX IF NOT EXISTS idx_remediation_involves_phi ON hipaa_remediation_actions(involves_phi);
CREATE INDEX IF NOT EXISTS idx_remediation_breach_risk ON hipaa_remediation_actions(breach_risk);
CREATE INDEX IF NOT EXISTS idx_remediation_target_date ON hipaa_remediation_actions(target_date);
CREATE INDEX IF NOT EXISTS idx_remediation_regulatory_deadline ON hipaa_remediation_actions(regulatory_deadline);
CREATE INDEX IF NOT EXISTS idx_remediation_updates_action_id ON hipaa_remediation_updates(action_id);

-- Create view for dashboard statistics
CREATE OR REPLACE VIEW hipaa_remediation_stats AS
SELECT
    COUNT(*) AS total_actions,
    SUM(CASE WHEN status = 'Open' THEN 1 ELSE 0 END) AS open_actions,
    SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress_actions,
    SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_actions,
    SUM(CASE WHEN status = 'Overdue' THEN 1 ELSE 0 END) AS overdue_actions,
    SUM(CASE WHEN involves_phi = TRUE THEN 1 ELSE 0 END) AS phi_involved_actions,
    SUM(CASE WHEN breach_risk = TRUE THEN 1 ELSE 0 END) AS breach_risk_actions,
    SUM(CASE WHEN regulatory_deadline < CURRENT_TIMESTAMP AND status != 'Completed' THEN 1 ELSE 0 END) AS regulatory_overdue_actions,
    SUM(CASE WHEN priority = 'High' THEN 1 ELSE 0 END) AS high_priority_actions,
    SUM(CASE WHEN priority = 'Medium' THEN 1 ELSE 0 END) AS medium_priority_actions,
    SUM(CASE WHEN priority = 'Low' THEN 1 ELSE 0 END) AS low_priority_actions
FROM hipaa_remediation_actions;

-- Create view for category statistics
CREATE OR REPLACE VIEW hipaa_remediation_category_stats AS
SELECT
    category,
    COUNT(*) AS total_actions,
    SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed_actions,
    ROUND((SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2) AS completion_percentage
FROM hipaa_remediation_actions
GROUP BY category;

-- Insert sample data
INSERT INTO hipaa_remediation_actions (
    title, 
    description, 
    status, 
    priority, 
    severity, 
    category, 
    assigned_to, 
    created_by, 
    target_date, 
    regulatory_deadline, 
    involves_phi, 
    breach_risk, 
    department
) VALUES
(
    'Implement Automatic Session Timeout',
    'Configure all systems with PHI access to automatically log out after 15 minutes of inactivity as required by HIPAA Technical Safeguards.',
    'Open',
    'High',
    'High',
    'Technical Safeguards',
    'John Smith',
    'Sarah Johnson',
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    CURRENT_TIMESTAMP + INTERVAL '45 days',
    TRUE,
    TRUE,
    'IT'
),
(
    'Update Business Associate Agreements',
    'Review and update all Business Associate Agreements to ensure they include the required HIPAA provisions and breach notification requirements.',
    'In Progress',
    'Medium',
    'Medium',
    'Administrative Safeguards',
    'Lisa Wong',
    'Michael Brown',
    CURRENT_TIMESTAMP + INTERVAL '60 days',
    CURRENT_TIMESTAMP + INTERVAL '90 days',
    FALSE,
    FALSE,
    'Legal'
),
(
    'Conduct Staff HIPAA Training',
    'Schedule and conduct comprehensive HIPAA training for all staff members with access to PHI.',
    'Open',
    'High',
    'Medium',
    'Administrative Safeguards',
    'Robert Davis',
    'Sarah Johnson',
    CURRENT_TIMESTAMP + INTERVAL '45 days',
    CURRENT_TIMESTAMP + INTERVAL '60 days',
    TRUE,
    FALSE,
    'HR'
),
(
    'Implement Physical Access Controls',
    'Install card readers and security cameras in areas where PHI is stored or accessed.',
    'Completed',
    'Medium',
    'Medium',
    'Physical Safeguards',
    'James Wilson',
    'Michael Brown',
    CURRENT_TIMESTAMP - INTERVAL '30 days',
    CURRENT_TIMESTAMP - INTERVAL '15 days',
    TRUE,
    TRUE,
    'Facilities'
),
(
    'Update Notice of Privacy Practices',
    'Review and update the Notice of Privacy Practices to ensure compliance with current HIPAA regulations.',
    'In Progress',
    'Medium',
    'Low',
    'Privacy Rule',
    'Lisa Wong',
    'Sarah Johnson',
    CURRENT_TIMESTAMP + INTERVAL '20 days',
    CURRENT_TIMESTAMP + INTERVAL '40 days',
    FALSE,
    FALSE,
    'Compliance'
),
(
    'Implement Encryption for Data at Rest',
    'Deploy encryption solutions for all databases and file systems containing PHI.',
    'Open',
    'High',
    'High',
    'Technical Safeguards',
    'John Smith',
    'Michael Brown',
    CURRENT_TIMESTAMP + INTERVAL '15 days',
    CURRENT_TIMESTAMP + INTERVAL '30 days',
    TRUE,
    TRUE,
    'IT'
),
(
    'Conduct Risk Analysis',
    'Perform a comprehensive risk analysis of all systems containing PHI.',
    'Overdue',
    'High',
    'High',
    'Administrative Safeguards',
    'Robert Davis',
    'Sarah Johnson',
    CURRENT_TIMESTAMP - INTERVAL '15 days',
    CURRENT_TIMESTAMP - INTERVAL '5 days',
    TRUE,
    TRUE,
    'Compliance'
),
(
    'Implement Audit Controls',
    'Deploy audit logging and monitoring for all systems containing PHI.',
    'In Progress',
    'Medium',
    'Medium',
    'Technical Safeguards',
    'John Smith',
    'Michael Brown',
    CURRENT_TIMESTAMP + INTERVAL '25 days',
    CURRENT_TIMESTAMP + INTERVAL '45 days',
    TRUE,
    FALSE,
    'IT'
),
(
    'Update Disaster Recovery Plan',
    'Review and update the disaster recovery plan to ensure it addresses HIPAA requirements for data backup and recovery.',
    'Open',
    'Medium',
    'Medium',
    'Administrative Safeguards',
    'James Wilson',
    'Sarah Johnson',
    CURRENT_TIMESTAMP + INTERVAL '40 days',
    CURRENT_TIMESTAMP + INTERVAL '60 days',
    TRUE,
    FALSE,
    'IT'
),
(
    'Implement Secure Disposal Procedures',
    'Develop and implement procedures for secure disposal of PHI in electronic and physical form.',
    'Open',
    'Medium',
    'Low',
    'Physical Safeguards',
    'Lisa Wong',
    'Michael Brown',
    CURRENT_TIMESTAMP + INTERVAL '35 days',
    CURRENT_TIMESTAMP + INTERVAL '50 days',
    TRUE,
    FALSE,
    'Facilities'
);

-- Insert sample updates
INSERT INTO hipaa_remediation_updates (
    action_id,
    update_text,
    status,
    updated_by,
    completion_percentage
) VALUES
(1, 'Started researching session timeout solutions for our systems.', 'In Progress', 'John Smith', 10),
(2, 'Drafted updated BAA template and sent to legal for review.', 'In Progress', 'Lisa Wong', 40),
(3, 'Scheduled training sessions for next month.', 'In Progress', 'Robert Davis', 20),
(4, 'Completed installation of all access controls and tested functionality.', 'Completed', 'James Wilson', 100),
(5, 'First draft of updated notice completed, awaiting review.', 'In Progress', 'Lisa Wong', 50),
(6, 'Evaluated three encryption solutions, preparing recommendation.', 'In Progress', 'John Smith', 30),
(7, 'Started risk analysis but facing resource constraints.', 'In Progress', 'Robert Davis', 15),
(8, 'Implemented audit logging on 50% of critical systems.', 'In Progress', 'John Smith', 50),
(9, 'Reviewing current disaster recovery documentation.', 'In Progress', 'James Wilson', 10),
(10, 'Researching best practices for PHI disposal.', 'In Progress', 'Lisa Wong', 20);

-- Insert sample dependencies
INSERT INTO hipaa_remediation_dependencies (
    action_id,
    depends_on_action_id,
    dependency_type
) VALUES
(6, 7, 'blocks'),
(8, 6, 'blocks'),
(9, 7, 'related');
