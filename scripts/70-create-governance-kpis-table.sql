-- Create IS KPIs and Performance Measurement table
CREATE TABLE IF NOT EXISTS governance_kpis (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_value VARCHAR(100) NOT NULL,
    current_value VARCHAR(100) NOT NULL,
    unit VARCHAR(50),
    category VARCHAR(100) NOT NULL,
    framework VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    trend VARCHAR(50) DEFAULT 'stable',
    measurement_frequency VARCHAR(50) DEFAULT 'monthly',
    owner VARCHAR(100),
    department VARCHAR(100),
    calculation_method TEXT,
    data_source VARCHAR(255),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    next_review_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_governance_kpis_category ON governance_kpis(category);
CREATE INDEX IF NOT EXISTS idx_governance_kpis_status ON governance_kpis(status);
CREATE INDEX IF NOT EXISTS idx_governance_kpis_owner ON governance_kpis(owner);

-- Insert sample data
INSERT INTO governance_kpis (name, description, target_value, current_value, unit, category, framework, status, trend, owner, department, calculation_method, data_source, next_review_date) VALUES
('Security Incident Response Time', 'Average time to respond to security incidents', '4', '3.2', 'hours', 'Response', 'ISO 27001', 'active', 'improving', 'CISO', 'Security Operations', 'Average of all incident response times in the last 30 days', 'Incident Management System', '2024-02-15'),
('Vulnerability Remediation Rate', 'Percentage of critical vulnerabilities remediated within SLA', '95', '92', 'percentage', 'Remediation', 'NIST CSF', 'active', 'stable', 'Vulnerability Manager', 'Security Operations', 'Count of remediated vulnerabilities / Total critical vulnerabilities * 100', 'Vulnerability Scanner', '2024-02-14'),
('Security Awareness Training Completion', 'Percentage of employees who completed security awareness training', '100', '98', 'percentage', 'Training', 'ISO 27001', 'active', 'improving', 'Training Manager', 'Human Resources', 'Completed training / Total employees * 100', 'Learning Management System', '2024-02-13'),
('Policy Compliance Rate', 'Percentage of policies with current compliance status', '99', '97', 'percentage', 'Compliance', 'ISO 27001', 'active', 'declining', 'Compliance Officer', 'Legal', 'Compliant policies / Total policies * 100', 'Policy Management System', '2024-02-12'),
('Access Control Effectiveness', 'Percentage of access reviews completed on time', '100', '95', 'percentage', 'Access Control', 'ISO 27001', 'active', 'stable', 'IAM Manager', 'IT Security', 'Completed reviews / Total required reviews * 100', 'Identity Management System', '2024-02-11'),
('Security Monitoring Coverage', 'Percentage of critical systems under security monitoring', '100', '98', 'percentage', 'Monitoring', 'NIST CSF', 'active', 'improving', 'SOC Manager', 'Security Operations', 'Monitored systems / Total critical systems * 100', 'SIEM System', '2024-02-10');
