-- SAMA Gap Analysis Table
-- Create table for SAMA cybersecurity gap analysis

CREATE TABLE IF NOT EXISTS sama_gap_analysis (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(100) NOT NULL,
    control_id VARCHAR(20) NOT NULL,
    control_name VARCHAR(200) NOT NULL,
    current_status VARCHAR(50) NOT NULL, -- Not Implemented, Partially Implemented, Implemented
    target_status VARCHAR(50) NOT NULL, -- Implemented, Enhanced
    gap_severity VARCHAR(20) NOT NULL, -- Critical, High, Medium, Low
    business_impact VARCHAR(20) NOT NULL, -- Critical, High, Medium, Low
    implementation_effort VARCHAR(20) NOT NULL, -- Low, Medium, High, Very High
    estimated_cost DECIMAL(15,2) DEFAULT 0,
    timeline_months INTEGER DEFAULT 6,
    responsible_party VARCHAR(100),
    dependencies TEXT,
    risk_if_not_addressed TEXT,
    priority_score INTEGER DEFAULT 5, -- 1-10 scale
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample SAMA gap analysis data
INSERT INTO sama_gap_analysis (
    domain,
    control_id,
    control_name,
    current_status,
    target_status,
    gap_severity,
    business_impact,
    implementation_effort,
    estimated_cost,
    timeline_months,
    responsible_party,
    dependencies,
    risk_if_not_addressed,
    priority_score
) VALUES 
('Payment Systems Security', 'PS-02', 'Transaction Monitoring', 'Partially Implemented', 'Implemented', 'High', 'High', 'High', 750000, 8, 'Payment Systems Manager', 'Vendor selection, system integration, staff training', 'Increased fraud losses, regulatory penalties, reputational damage', 9),
('Third Party Cybersecurity', 'TP-01', 'Third Party Risk Assessment', 'Not Implemented', 'Implemented', 'High', 'High', 'Medium', 150000, 6, 'Third Party Risk Manager', 'Policy development, vendor assessment tools', 'Supply chain attacks, data breaches through third parties', 8),
('Data Management and Privacy', 'DM-02', 'Data Loss Prevention', 'Not Implemented', 'Implemented', 'Medium', 'High', 'High', 300000, 9, 'Information Security Manager', 'Network infrastructure, endpoint deployment', 'Data exfiltration, regulatory violations, customer data exposure', 7),
('Cybersecurity Defense', 'CD-02', 'Access Control', 'Partially Implemented', 'Implemented', 'Medium', 'Medium', 'Medium', 200000, 4, 'Identity and Access Management Team', 'User training, system integration', 'Unauthorized access, privilege escalation attacks', 6),
('Business Continuity', 'BC-03', 'Continuity Testing', 'Not Implemented', 'Implemented', 'Medium', 'High', 'Low', 100000, 3, 'Business Continuity Manager', 'Operations team coordination, testing schedules', 'Inadequate response to business disruptions', 6),
('Cybersecurity Resilience', 'CR-02', 'Disaster Recovery', 'Partially Implemented', 'Enhanced', 'High', 'Critical', 'Very High', 1200000, 12, 'Infrastructure Manager', 'Secondary site setup, data replication', 'Extended downtime, business continuity failures', 9),
('Technology Risk Management', 'TR-02', 'Vulnerability Management', 'Partially Implemented', 'Implemented', 'Medium', 'Medium', 'Medium', 180000, 5, 'Vulnerability Management Team', 'Scanning tools, patch management system', 'Exploitation of unpatched vulnerabilities', 5),
('Incident Response', 'IR-02', 'Incident Detection and Analysis', 'Partially Implemented', 'Enhanced', 'High', 'High', 'High', 500000, 10, 'Security Operations Center', 'SIEM implementation, analyst training', 'Delayed incident detection, inadequate response', 8),
('Cybersecurity Governance', 'CG-05', 'Board and Senior Management Oversight', 'Partially Implemented', 'Implemented', 'Medium', 'Medium', 'Low', 75000, 2, 'CISO', 'Board training, reporting framework', 'Inadequate governance oversight, strategic misalignment', 4),
('Payment Systems Security', 'PS-04', 'Payment System Resilience', 'Partially Implemented', 'Enhanced', 'Critical', 'Critical', 'Very High', 2000000, 18, 'Payment Systems Architecture Team', 'Infrastructure upgrade, redundancy implementation', 'Payment system outages, financial losses, regulatory action', 10),
('Data Management and Privacy', 'DM-05', 'Cross-Border Data Transfer', 'Not Implemented', 'Implemented', 'Medium', 'Medium', 'Medium', 120000, 4, 'Data Protection Officer', 'Legal review, technical controls', 'Regulatory violations, data sovereignty issues', 5),
('Cybersecurity Defense', 'CD-03', 'Network Security', 'Implemented', 'Enhanced', 'Low', 'Medium', 'Medium', 250000, 6, 'Network Security Team', 'Network architecture review, equipment upgrade', 'Advanced persistent threats, lateral movement', 3),
('Third Party Cybersecurity', 'TP-03', 'Third Party Monitoring', 'Not Implemented', 'Implemented', 'High', 'High', 'High', 400000, 8, 'Third Party Risk Manager', 'Monitoring tools, vendor cooperation', 'Undetected third-party security incidents', 7),
('Technology Risk Management', 'TR-05', 'Technology Risk Assessment', 'Partially Implemented', 'Enhanced', 'Medium', 'High', 'Medium', 220000, 6, 'Technology Risk Manager', 'Risk assessment tools, methodology development', 'Inadequate technology risk visibility', 6),
('Incident Response', 'IR-05', 'Incident Reporting', 'Implemented', 'Enhanced', 'Low', 'Medium', 'Low', 50000, 2, 'Compliance Team', 'Reporting templates, communication procedures', 'Regulatory reporting delays, compliance issues', 2);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sama_gap_analysis_domain ON sama_gap_analysis(domain);
CREATE INDEX IF NOT EXISTS idx_sama_gap_analysis_control_id ON sama_gap_analysis(control_id);
CREATE INDEX IF NOT EXISTS idx_sama_gap_analysis_severity ON sama_gap_analysis(gap_severity);
CREATE INDEX IF NOT EXISTS idx_sama_gap_analysis_priority ON sama_gap_analysis(priority_score);
CREATE INDEX IF NOT EXISTS idx_sama_gap_analysis_status ON sama_gap_analysis(current_status);
CREATE INDEX IF NOT EXISTS idx_sama_gap_analysis_responsible ON sama_gap_analysis(responsible_party);
