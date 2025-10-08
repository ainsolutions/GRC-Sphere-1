-- MAS Assessment Management Table

CREATE TABLE IF NOT EXISTS mas_assessments (
    id SERIAL PRIMARY KEY,
    assessment_id VARCHAR(50) NOT NULL UNIQUE,
    entity_name VARCHAR(200) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    license_type VARCHAR(100) NOT NULL,
    assessment_type VARCHAR(50) NOT NULL,
    assessment_date DATE NOT NULL,
    assessor_name VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'under_review', 'completed', 'approved')),
    overall_score DECIMAL(5,2) DEFAULT 0.00 CHECK (overall_score >= 0 AND overall_score <= 100),
    findings_count INTEGER DEFAULT 0,
    high_risk_findings INTEGER DEFAULT 0,
    medium_risk_findings INTEGER DEFAULT 0,
    low_risk_findings INTEGER DEFAULT 0,
    completion_date DATE,
    next_assessment_date DATE,
    mas_notification_status VARCHAR(30) DEFAULT 'pending' CHECK (mas_notification_status IN ('pending', 'submitted', 'acknowledged', 'not_required')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample MAS assessments
INSERT INTO mas_assessments (
    assessment_id, entity_name, entity_type, license_type, assessment_type,
    assessment_date, assessor_name, status, overall_score, findings_count,
    high_risk_findings, medium_risk_findings, low_risk_findings, mas_notification_status
) VALUES
('MAS-2024-001', 'Singapore Digital Bank Ltd', 'Bank', 'Digital Full Bank License', 'Annual Review', '2024-01-15', 'John Tan', 'completed', 78.5, 12, 2, 6, 4, 'submitted'),
('MAS-2024-002', 'Asia Pacific Insurance Co', 'Insurance Company', 'General Insurance License', 'Compliance Assessment', '2024-01-20', 'Sarah Lim', 'in_progress', 65.2, 18, 4, 8, 6, 'pending'),
('MAS-2024-003', 'FinTech Payment Solutions', 'Payment Service Provider', 'Payment Services License', 'Initial Assessment', '2024-01-25', 'Michael Wong', 'under_review', 82.1, 8, 1, 4, 3, 'submitted'),
('MAS-2024-004', 'Singapore Finance Corp', 'Finance Company', 'Finance Company License', 'Follow-up Assessment', '2024-01-30', 'Lisa Chen', 'completed', 71.8, 15, 3, 7, 5, 'acknowledged'),
('MAS-2024-005', 'Wealth Management Advisers', 'Financial Adviser', 'Financial Adviser License', 'Risk-based Assessment', '2024-02-05', 'David Kumar', 'draft', 0.0, 0, 0, 0, 0, 'pending');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mas_assessments_entity_name ON mas_assessments(entity_name);
CREATE INDEX IF NOT EXISTS idx_mas_assessments_entity_type ON mas_assessments(entity_type);
CREATE INDEX IF NOT EXISTS idx_mas_assessments_status ON mas_assessments(status);
CREATE INDEX IF NOT EXISTS idx_mas_assessments_assessment_date ON mas_assessments(assessment_date);
CREATE INDEX IF NOT EXISTS idx_mas_assessments_assessment_id ON mas_assessments(assessment_id);
