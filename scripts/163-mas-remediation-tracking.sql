-- MAS Remediation Tracking Table

CREATE TABLE IF NOT EXISTS mas_remediation_tracking (
    id SERIAL PRIMARY KEY,
    assessment_id VARCHAR(50),
    finding_id VARCHAR(50) NOT NULL,
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    domain VARCHAR(100) NOT NULL,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('High', 'Medium', 'Low')),
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('Critical', 'High', 'Medium', 'Low')),
    status VARCHAR(30) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Under Review', 'Completed', 'Verified', 'Closed')),
    assigned_to VARCHAR(100) NOT NULL,
    due_date DATE NOT NULL,
    completion_date DATE,
    estimated_cost DECIMAL(12,2) DEFAULT 0.00,
    actual_cost DECIMAL(12,2),
    remediation_plan TEXT NOT NULL,
    verification_status VARCHAR(30) DEFAULT 'Pending' CHECK (verification_status IN ('Pending', 'In Progress', 'Completed', 'Failed')),
    verification_evidence TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assessment_id) REFERENCES mas_assessments(assessment_id) ON DELETE SET NULL
);

-- Insert sample MAS remediation tracking data
INSERT INTO mas_remediation_tracking (
    assessment_id, finding_id, title, description, domain, risk_level, priority,
    status, assigned_to, due_date, estimated_cost, remediation_plan, verification_status
) VALUES
('MAS-2024-001', 'F-001', 'Implement Multi-Factor Authentication', 'Deploy MFA for all privileged accounts accessing critical systems', 'Cyber Hygiene', 'High', 'Critical', 'In Progress', 'IT Security Team', '2024-03-15', 25000.00, 'Deploy MFA solution across all critical systems and train users on new authentication process', 'In Progress'),
('MAS-2024-001', 'F-002', 'Update Business Continuity Plan', 'Review and update BCP to include new digital banking services', 'Business Continuity Management', 'Medium', 'High', 'Open', 'Risk Management Team', '2024-04-30', 15000.00, 'Conduct BIA for new services and update recovery procedures', 'Pending'),
('MAS-2024-002', 'F-003', 'Enhance Data Classification', 'Implement comprehensive data classification scheme for customer data', 'Data Governance', 'High', 'High', 'In Progress', 'Data Governance Team', '2024-03-31', 35000.00, 'Deploy data classification tools and establish governance processes', 'In Progress'),
('MAS-2024-002', 'F-004', 'Cloud Security Assessment', 'Conduct security assessment of cloud infrastructure', 'Cloud Computing', 'Medium', 'Medium', 'Open', 'Cloud Team', '2024-05-15', 20000.00, 'Engage third-party to conduct comprehensive cloud security assessment', 'Pending'),
('MAS-2024-003', 'F-005', 'Third Party Risk Assessment', 'Complete risk assessment for payment processing vendors', 'Third Party Risk Management', 'High', 'Critical', 'Completed', 'Vendor Management Team', '2024-02-28', 18000.00, 'Conduct due diligence and risk assessment for all payment vendors', 'Completed'),
('MAS-2024-004', 'F-006', 'Incident Response Testing', 'Conduct tabletop exercise for cyber incident response', 'Incident Management', 'Medium', 'Medium', 'In Progress', 'Security Team', '2024-04-15', 12000.00, 'Design and execute tabletop exercise with external facilitator', 'In Progress'),
('MAS-2024-004', 'F-007', 'Access Management Review', 'Review and update user access management procedures', 'Access Management', 'Medium', 'High', 'Open', 'Identity Team', '2024-05-30', 22000.00, 'Review current access controls and implement automated access reviews', 'Pending');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mas_remediation_assessment_id ON mas_remediation_tracking(assessment_id);
CREATE INDEX IF NOT EXISTS idx_mas_remediation_status ON mas_remediation_tracking(status);
CREATE INDEX IF NOT EXISTS idx_mas_remediation_priority ON mas_remediation_tracking(priority);
CREATE INDEX IF NOT EXISTS idx_mas_remediation_due_date ON mas_remediation_tracking(due_date);
CREATE INDEX IF NOT EXISTS idx_mas_remediation_domain ON mas_remediation_tracking(domain);
