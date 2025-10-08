-- Create PCI DSS gap analysis table
CREATE TABLE IF NOT EXISTS pci_dss_gap_analysis (
    id SERIAL PRIMARY KEY,
    gap_id VARCHAR(50) UNIQUE NOT NULL DEFAULT 'PCI-GAP-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('gap_analysis_id_seq')::TEXT, 4, '0'),
    requirement_id VARCHAR(10) REFERENCES pci_dss_requirements(requirement_id),
    requirement TEXT NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    current_state VARCHAR(50) DEFAULT 'not_assessed' CHECK (current_state IN ('compliant', 'partial', 'non_compliant', 'not_assessed')),
    target_state VARCHAR(50) DEFAULT 'compliant' CHECK (target_state IN ('compliant', 'not_applicable')),
    gap_severity VARCHAR(20) DEFAULT 'medium' CHECK (gap_severity IN ('critical', 'high', 'medium', 'low')),
    risk_score INTEGER DEFAULT 5 CHECK (risk_score >= 1 AND risk_score <= 10),
    business_impact TEXT,
    technical_complexity VARCHAR(20) DEFAULT 'medium' CHECK (technical_complexity IN ('low', 'medium', 'high')),
    estimated_effort VARCHAR(50),
    estimated_cost VARCHAR(50),
    estimated_timeline VARCHAR(50),
    priority INTEGER DEFAULT 5,
    recommended_actions TEXT[],
    dependencies TEXT[],
    success_criteria TEXT,
    owner VARCHAR(255),
    stakeholders TEXT[],
    current_controls TEXT,
    proposed_controls TEXT,
    compensating_controls TEXT,
    regulatory_impact TEXT,
    business_justification TEXT,
    implementation_approach TEXT,
    testing_approach TEXT,
    rollback_plan TEXT,
    communication_plan TEXT,
    training_requirements TEXT,
    budget_approved BOOLEAN DEFAULT FALSE,
    budget_amount DECIMAL(10,2),
    project_manager VARCHAR(255),
    start_date DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    status VARCHAR(50) DEFAULT 'identified' CHECK (status IN ('identified', 'approved', 'in_progress', 'completed', 'cancelled', 'on_hold')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    last_assessed DATE DEFAULT CURRENT_DATE,
    next_review_date DATE,
    created_by VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(255),
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sequence for gap analysis IDs if it doesn't exist
CREATE SEQUENCE IF NOT EXISTS gap_analysis_id_seq START 1;

-- Insert sample gap analysis data
INSERT INTO pci_dss_gap_analysis (
    requirement_id,
    requirement,
    description,
    category,
    current_state,
    gap_severity,
    risk_score,
    business_impact,
    technical_complexity,
    estimated_effort,
    estimated_cost,
    estimated_timeline,
    priority,
    recommended_actions,
    dependencies,
    owner,
    stakeholders
) VALUES 
('2.1', 'Change vendor-supplied defaults', 'Always change vendor-supplied defaults and remove unnecessary default accounts', 'System Configuration',
 'non_compliant', 'critical', 9, 'High risk of unauthorized access to systems', 'medium', '16 hours', '$2,400', '2 weeks', 1,
 ARRAY['Conduct comprehensive audit of all systems', 'Change all default passwords immediately', 'Remove unnecessary default accounts', 'Implement password policy enforcement'],
 ARRAY['Asset inventory completion', 'Access management system'], 'IT Security Team', ARRAY['IT Operations', 'System Administrators']),

('6.1', 'Develop secure systems and applications', 'Establish a process to identify security vulnerabilities', 'Application Security',
 'non_compliant', 'high', 8, 'Potential for unidentified vulnerabilities in applications', 'high', '40 hours', '$6,000', '6 weeks', 2,
 ARRAY['Implement vulnerability management program', 'Deploy vulnerability scanning tools', 'Establish patch management process', 'Create security development lifecycle'],
 ARRAY['Tool procurement', 'Staff training'], 'Development Team', ARRAY['Security Team', 'DevOps Team']),

('4.1', 'Encrypt transmission of cardholder data', 'Encrypt transmission of cardholder data across open, public networks', 'Data Protection',
 'partial', 'medium', 6, 'Risk of data interception during transmission', 'medium', '24 hours', '$3,600', '3 weeks', 3,
 ARRAY['Upgrade to TLS 1.3 for all connections', 'Implement certificate management', 'Test encryption implementation', 'Update network security policies'],
 ARRAY['Certificate authority setup', 'Network team coordination'], 'Network Team', ARRAY['Security Team', 'Infrastructure Team']),

('8.1', 'Identify and authenticate access', 'Assign a unique ID to each person with computer access', 'Access Control',
 'partial', 'medium', 5, 'Difficulty in tracking user activities and access', 'low', '12 hours', '$1,800', '4 weeks', 4,
 ARRAY['Implement unique user ID policy', 'Deploy identity management system', 'Establish user provisioning process', 'Create access review procedures'],
 ARRAY['Identity management system', 'HR process integration'], 'IT Operations', ARRAY['HR Team', 'Security Team']),

('11.1', 'Test for wireless access points', 'Implement a process to test for the presence of wireless access points', 'Testing',
 'partial', 'low', 3, 'Potential for unauthorized wireless access', 'low', '8 hours', '$1,200', '2 weeks', 5,
 ARRAY['Implement automated wireless scanning', 'Create wireless access point inventory', 'Establish incident response procedures', 'Deploy wireless intrusion detection'],
 ARRAY['Scanning tools', 'Network monitoring system'], 'Network Team', ARRAY['Security Team', 'IT Operations']),

('12.1', 'Establish information security policy', 'Establish, publish, maintain, and disseminate a security policy', 'Policy',
 'compliant', 'low', 2, 'Minor policy updates needed for PCI DSS alignment', 'low', '4 hours', '$600', '1 week', 6,
 ARRAY['Review current security policy', 'Update policy for PCI DSS requirements', 'Conduct staff training', 'Implement policy acknowledgment process'],
 ARRAY['Legal review', 'Management approval'], 'Security Team', ARRAY['Legal Team', 'HR Team', 'Management']);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pci_dss_gap_analysis_requirement_id ON pci_dss_gap_analysis(requirement_id);
CREATE INDEX IF NOT EXISTS idx_pci_dss_gap_analysis_severity ON pci_dss_gap_analysis(gap_severity);
CREATE INDEX IF NOT EXISTS idx_pci_dss_gap_analysis_priority ON pci_dss_gap_analysis(priority);
CREATE INDEX IF NOT EXISTS idx_pci_dss_gap_analysis_status ON pci_dss_gap_analysis(status);
CREATE INDEX IF NOT EXISTS idx_pci_dss_gap_analysis_owner ON pci_dss_gap_analysis(owner);
CREATE INDEX IF NOT EXISTS idx_pci_dss_gap_analysis_risk_score ON pci_dss_gap_analysis(risk_score);
