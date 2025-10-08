-- NESA UAE Remediation Action Tracking
-- Create comprehensive remediation tracking system for NESA UAE findings

-- Create remediation actions table
CREATE TABLE IF NOT EXISTS nesa_uae_remediation_actions (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES nesa_uae_assessments(id) ON DELETE CASCADE,
    requirement_id INTEGER REFERENCES nesa_uae_requirements(id),
    finding_id VARCHAR(50) NOT NULL, -- Unique identifier for the finding
    finding_title VARCHAR(255) NOT NULL,
    finding_description TEXT NOT NULL,
    finding_severity VARCHAR(20) NOT NULL, -- Critical, High, Medium, Low
    finding_category VARCHAR(100), -- Technical, Administrative, Physical
    
    -- Remediation details
    remediation_action TEXT NOT NULL,
    remediation_priority VARCHAR(20) NOT NULL, -- Critical, High, Medium, Low
    remediation_status VARCHAR(50) DEFAULT 'Open', -- Open, In Progress, Under Review, Completed, Closed, Deferred
    remediation_type VARCHAR(50), -- Immediate, Short-term, Long-term
    
    -- Assignment and ownership
    assigned_to VARCHAR(255),
    assigned_department VARCHAR(100),
    responsible_manager VARCHAR(255),
    
    -- Timeline
    target_completion_date DATE,
    actual_completion_date DATE,
    estimated_effort_hours INTEGER,
    actual_effort_hours INTEGER,
    
    -- Cost tracking
    estimated_cost DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    budget_approved BOOLEAN DEFAULT FALSE,
    
    -- Progress tracking
    progress_percentage INTEGER DEFAULT 0,
    last_update_date DATE DEFAULT CURRENT_DATE,
    next_review_date DATE,
    
    -- Evidence and documentation
    evidence_required TEXT,
    evidence_provided TEXT,
    supporting_documents TEXT[], -- Array of document references
    
    -- Risk assessment
    risk_before_remediation VARCHAR(20), -- Critical, High, Medium, Low
    risk_after_remediation VARCHAR(20),
    business_impact TEXT,
    
    -- Approval workflow
    requires_approval BOOLEAN DEFAULT FALSE,
    approved_by VARCHAR(255),
    approval_date DATE,
    approval_comments TEXT,
    
    -- Verification
    verification_method VARCHAR(100),
    verified_by VARCHAR(255),
    verification_date DATE,
    verification_status VARCHAR(50), -- Pending, Passed, Failed
    verification_comments TEXT,
    
    -- Metadata
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_severity CHECK (finding_severity IN ('Critical', 'High', 'Medium', 'Low')),
    CONSTRAINT valid_priority CHECK (remediation_priority IN ('Critical', 'High', 'Medium', 'Low')),
    CONSTRAINT valid_status CHECK (remediation_status IN ('Open', 'In Progress', 'Under Review', 'Completed', 'Closed', 'Deferred')),
    CONSTRAINT valid_progress CHECK (progress_percentage >= 0 AND progress_percentage <= 100)
);

-- Create remediation action updates/comments table for tracking progress
CREATE TABLE IF NOT EXISTS nesa_uae_remediation_updates (
    id SERIAL PRIMARY KEY,
    remediation_action_id INTEGER REFERENCES nesa_uae_remediation_actions(id) ON DELETE CASCADE,
    update_type VARCHAR(50) NOT NULL, -- Progress Update, Status Change, Comment, Evidence Upload
    update_description TEXT NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    previous_progress INTEGER,
    new_progress INTEGER,
    update_by VARCHAR(255) NOT NULL,
    update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attachments TEXT[] -- Array of attachment references
);

-- Create remediation dependencies table
CREATE TABLE IF NOT EXISTS nesa_uae_remediation_dependencies (
    id SERIAL PRIMARY KEY,
    parent_action_id INTEGER REFERENCES nesa_uae_remediation_actions(id) ON DELETE CASCADE,
    dependent_action_id INTEGER REFERENCES nesa_uae_remediation_actions(id) ON DELETE CASCADE,
    dependency_type VARCHAR(50) NOT NULL, -- Blocks, Requires, Related
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Prevent self-dependencies
    CONSTRAINT no_self_dependency CHECK (parent_action_id != dependent_action_id),
    -- Unique dependency relationships
    CONSTRAINT unique_dependency UNIQUE (parent_action_id, dependent_action_id)
);

-- Insert sample remediation actions
INSERT INTO nesa_uae_remediation_actions (
    assessment_id,
    requirement_id,
    finding_id,
    finding_title,
    finding_description,
    finding_severity,
    finding_category,
    remediation_action,
    remediation_priority,
    remediation_status,
    remediation_type,
    assigned_to,
    assigned_department,
    responsible_manager,
    target_completion_date,
    estimated_effort_hours,
    estimated_cost,
    progress_percentage,
    next_review_date,
    evidence_required,
    risk_before_remediation,
    risk_after_remediation,
    business_impact,
    requires_approval,
    verification_method,
    created_by
) VALUES 
(
    1, 1, 'NESA-2024-001', 
    'Incomplete Cybersecurity Strategy Documentation',
    'The current cybersecurity strategy lacks specific implementation timelines and measurable objectives as required by NESA controls.',
    'High',
    'Administrative',
    'Update cybersecurity strategy document to include specific implementation timelines, measurable objectives, and key performance indicators. Ensure alignment with NESA requirements and organizational business objectives.',
    'High',
    'In Progress',
    'Short-term',
    'Ahmed Al-Rashid',
    'Information Security',
    'Sarah Johnson - CISO',
    '2024-09-30',
    40,
    5000.00,
    25,
    '2024-08-15',
    'Updated strategy document with board approval, implementation timeline, and KPI framework',
    'High',
    'Medium',
    'Incomplete strategy may result in non-compliance with NESA requirements and potential regulatory penalties',
    TRUE,
    'Document Review and Board Approval',
    'System Administrator'
),
(
    1, 3,
    'NESA-2024-002',
    'Inadequate Continuous Risk Monitoring',
    'Current risk assessment process is conducted annually only. NESA requires continuous monitoring of cybersecurity risks for critical infrastructure.',
    'Critical',
    'Technical',
    'Implement automated risk monitoring tools and establish continuous risk assessment processes. Deploy SIEM solution with real-time threat detection and risk scoring capabilities.',
    'Critical',
    'Open',
    'Long-term',
    'Omar Hassan',
    'IT Operations',
    'Michael Chen - IT Director',
    '2024-12-31',
    200,
    75000.00,
    0,
    '2024-08-01',
    'SIEM deployment documentation, risk monitoring procedures, automated alerting configuration, and staff training records',
    'Critical',
    'Low',
    'Lack of continuous monitoring exposes organization to undetected threats and may result in security incidents',
    TRUE,
    'Technical Testing and Process Validation',
    'System Administrator'
),
(
    1, 5,
    'NESA-2024-003',
    'Insufficient Board Cybersecurity Reporting',
    'Current quarterly board reports lack technical depth and specific metrics required for effective cybersecurity governance oversight.',
    'Medium',
    'Administrative',
    'Enhance board reporting framework to include detailed technical metrics, threat landscape analysis, and cybersecurity investment ROI. Develop executive dashboard for real-time cybersecurity posture visibility.',
    'Medium',
    'Open',
    'Short-term',
    'Fatima Al-Zahra',
    'Risk Management',
    'Sarah Johnson - CISO',
    '2024-10-15',
    60,
    15000.00,
    0,
    '2024-08-10',
    'Enhanced board report templates, executive dashboard screenshots, and board feedback documentation',
    'Medium',
    'Low',
    'Inadequate board oversight may result in insufficient cybersecurity investment and strategic misalignment',
    FALSE,
    'Board Review and Feedback',
    'System Administrator'
),
(
    1, 10,
    'NESA-2024-004',
    'Incomplete Asset Inventory Management',
    'Critical infrastructure assets are not fully documented in the asset management system, creating gaps in security monitoring and control implementation.',
    'High',
    'Technical',
    'Conduct comprehensive asset discovery and documentation. Implement automated asset management tools with integration to security monitoring systems. Establish asset classification and handling procedures.',
    'High',
    'In Progress',
    'Immediate',
    'Khalid Al-Mansouri',
    'Asset Management',
    'Michael Chen - IT Director',
    '2024-08-31',
    120,
    25000.00,
    60,
    '2024-08-05',
    'Complete asset inventory database, asset classification documentation, and integration with security tools',
    'High',
    'Medium',
    'Incomplete asset visibility may result in unprotected critical systems and compliance violations',
    FALSE,
    'Asset Discovery Scan and Documentation Review',
    'System Administrator'
);

-- Insert sample remediation updates
INSERT INTO nesa_uae_remediation_updates (
    remediation_action_id,
    update_type,
    update_description,
    previous_status,
    new_status,
    previous_progress,
    new_progress,
    update_by
) VALUES 
(1, 'Progress Update', 'Strategy document draft completed and sent for initial review. Incorporated NESA control requirements and aligned with business objectives.', 'Open', 'In Progress', 0, 25, 'Ahmed Al-Rashid'),
(4, 'Progress Update', 'Asset discovery phase completed for data center infrastructure. Identified 847 assets including servers, network devices, and security appliances. Moving to classification phase.', 'Open', 'In Progress', 30, 60, 'Khalid Al-Mansouri'),
(4, 'Status Change', 'Asset management tool procurement approved. Beginning implementation phase with vendor support.', 'In Progress', 'In Progress', 60, 60, 'Michael Chen');

-- Insert sample dependencies
INSERT INTO nesa_uae_remediation_dependencies (
    parent_action_id,
    dependent_action_id,
    dependency_type,
    description
) VALUES 
(2, 4, 'Requires', 'Continuous risk monitoring requires complete asset inventory to effectively monitor all critical infrastructure components'),
(1, 3, 'Related', 'Board reporting enhancements should align with updated cybersecurity strategy objectives and metrics');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nesa_remediation_assessment ON nesa_uae_remediation_actions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_nesa_remediation_requirement ON nesa_uae_remediation_actions(requirement_id);
CREATE INDEX IF NOT EXISTS idx_nesa_remediation_status ON nesa_uae_remediation_actions(remediation_status);
CREATE INDEX IF NOT EXISTS idx_nesa_remediation_priority ON nesa_uae_remediation_actions(remediation_priority);
CREATE INDEX IF NOT EXISTS idx_nesa_remediation_severity ON nesa_uae_remediation_actions(finding_severity);
CREATE INDEX IF NOT EXISTS idx_nesa_remediation_assigned ON nesa_uae_remediation_actions(assigned_to);
CREATE INDEX IF NOT EXISTS idx_nesa_remediation_target_date ON nesa_uae_remediation_actions(target_completion_date);
CREATE INDEX IF NOT EXISTS idx_nesa_remediation_updates_action ON nesa_uae_remediation_updates(remediation_action_id);
CREATE INDEX IF NOT EXISTS idx_nesa_remediation_updates_date ON nesa_uae_remediation_updates(update_date);
CREATE INDEX IF NOT EXISTS idx_nesa_remediation_deps_parent ON nesa_uae_remediation_dependencies(parent_action_id);
CREATE INDEX IF NOT EXISTS idx_nesa_remediation_deps_dependent ON nesa_uae_remediation_dependencies(dependent_action_id);

-- Create view for remediation dashboard
CREATE OR REPLACE VIEW nesa_uae_remediation_dashboard AS
SELECT 
    ra.id,
    ra.assessment_id,
    ra.finding_id,
    ra.finding_title,
    ra.finding_severity,
    ra.remediation_priority,
    ra.remediation_status,
    ra.assigned_to,
    ra.assigned_department,
    ra.target_completion_date,
    ra.progress_percentage,
    ra.estimated_cost,
    ra.actual_cost,
    CASE 
        WHEN ra.target_completion_date < CURRENT_DATE AND ra.remediation_status NOT IN ('Completed', 'Closed') THEN 'Overdue'
        WHEN ra.target_completion_date <= CURRENT_DATE + INTERVAL '7 days' AND ra.remediation_status NOT IN ('Completed', 'Closed') THEN 'Due Soon'
        ELSE 'On Track'
    END as timeline_status,
    na.assessment_name,
    na.critical_infrastructure_type,
    nr.control_name,
    nr.domain
FROM nesa_uae_remediation_actions ra
LEFT JOIN nesa_uae_assessments na ON ra.assessment_id = na.id
LEFT JOIN nesa_uae_requirements nr ON ra.requirement_id = nr.id;
