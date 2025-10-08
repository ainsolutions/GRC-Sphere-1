-- Create Budget Management table
CREATE TABLE IF NOT EXISTS governance_budget (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    subcategory VARCHAR(255),
    description TEXT,
    fiscal_year VARCHAR(10) NOT NULL,
    allocated_amount DECIMAL(15,2) NOT NULL,
    spent_amount DECIMAL(15,2) DEFAULT 0,
    committed_amount DECIMAL(15,2) DEFAULT 0,
    remaining_amount DECIMAL(15,2) GENERATED ALWAYS AS (allocated_amount - spent_amount - committed_amount) STORED,
    utilization_percentage DECIMAL(5,2) GENERATED ALWAYS AS ((spent_amount / allocated_amount) * 100) STORED,
    status VARCHAR(50) DEFAULT 'on-track',
    budget_owner VARCHAR(100),
    department VARCHAR(100),
    cost_center VARCHAR(100),
    vendor VARCHAR(255),
    contract_reference VARCHAR(255),
    approval_date DATE,
    approval_authority VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_governance_budget_fiscal_year ON governance_budget(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_governance_budget_category ON governance_budget(category);
CREATE INDEX IF NOT EXISTS idx_governance_budget_status ON governance_budget(status);
CREATE INDEX IF NOT EXISTS idx_governance_budget_owner ON governance_budget(budget_owner);

-- Insert sample data
INSERT INTO governance_budget (category, subcategory, description, fiscal_year, allocated_amount, spent_amount, committed_amount, status, budget_owner, department, cost_center, vendor, approval_date, approval_authority) VALUES
('Security Tools & Software', 'SIEM Platform', 'Security Information and Event Management platform license and maintenance', '2024', 200000.00, 120000.00, 50000.00, 'on-track', 'CISO', 'Security Operations', 'SEC-001', 'Splunk Inc.', '2024-01-01', 'CFO'),
('Security Tools & Software', 'Vulnerability Scanner', 'Enterprise vulnerability scanning and management platform', '2024', 150000.00, 95000.00, 30000.00, 'on-track', 'Security Manager', 'Security Operations', 'SEC-002', 'Qualys Inc.', '2024-01-01', 'CISO'),
('Security Tools & Software', 'Identity Management', 'Identity and Access Management solution', '2024', 150000.00, 105000.00, 20000.00, 'on-track', 'IAM Manager', 'IT Security', 'SEC-003', 'Okta Inc.', '2024-01-01', 'CISO'),
('Security Training & Certification', 'Employee Training', 'Security awareness training for all employees', '2024', 100000.00, 75000.00, 15000.00, 'on-track', 'Training Manager', 'Human Resources', 'HR-001', 'KnowBe4 Inc.', '2024-01-01', 'CHRO'),
('Security Training & Certification', 'Professional Certifications', 'Security certifications for IT staff', '2024', 50000.00, 45000.00, 5000.00, 'on-track', 'Training Manager', 'Human Resources', 'HR-002', 'Various', '2024-01-01', 'CHRO'),
('Incident Response & Recovery', 'Emergency Response', 'Emergency incident response and recovery services', '2024', 150000.00, 120000.00, 20000.00, 'warning', 'CISO', 'Security Operations', 'SEC-004', 'CrowdStrike Inc.', '2024-01-01', 'CISO'),
('Incident Response & Recovery', 'Forensic Services', 'Digital forensics and investigation services', '2024', 50000.00, 60000.00, 0.00, 'critical', 'CISO', 'Security Operations', 'SEC-005', 'Mandiant Inc.', '2024-01-01', 'CISO'),
('Compliance & Audit', 'External Audit', 'Third-party security compliance audits', '2024', 75000.00, 70000.00, 5000.00, 'critical', 'Compliance Officer', 'Legal', 'LEG-001', 'Deloitte', '2024-01-01', 'General Counsel'),
('Compliance & Audit', 'Compliance Tools', 'Compliance monitoring and reporting tools', '2024', 25000.00, 25000.00, 0.00, 'critical', 'Compliance Officer', 'Legal', 'LEG-002', 'ServiceNow', '2024-01-01', 'General Counsel');




