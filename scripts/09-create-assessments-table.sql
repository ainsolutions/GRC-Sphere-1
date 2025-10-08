-- Create assessments table
CREATE TABLE IF NOT EXISTS assessments (
    id SERIAL PRIMARY KEY,
    assessment_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    scope TEXT,
    methodology VARCHAR(100) NOT NULL,
    assessor VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Planned',
    overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
    maturity_level VARCHAR(50) DEFAULT 'Initial',
    findings_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessments_assessment_id ON assessments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_type ON assessments(type);
CREATE INDEX IF NOT EXISTS idx_assessments_created_at ON assessments(created_at);

-- Insert sample data
INSERT INTO assessments (assessment_id, name, type, scope, methodology, assessor, start_date, end_date, status, overall_score, maturity_level, findings_count) VALUES
('ASSESS-001', 'Annual ISO 27001 Assessment', 'compliance', 'Entire organization including all IT systems and processes', 'iso27001', 'External Auditor - CyberSec Solutions', '2024-01-01', '2024-01-15', 'Completed', 85, 'Managed', 12),
('ASSESS-002', 'Cybersecurity Maturity Assessment', 'maturity', 'IT Infrastructure and security controls', 'nist-csf', 'Internal Security Team', '2024-02-01', '2024-02-10', 'In Progress', 72, 'Defined', 8),
('ASSESS-003', 'Penetration Testing', 'technical', 'Web applications and external network perimeter', 'owasp', 'Security Consultant - PenTest Pro', '2024-01-20', '2024-01-25', 'Completed', 78, 'Defined', 15),
('ASSESS-004', 'GDPR Compliance Review', 'compliance', 'Data processing activities and privacy controls', 'gdpr', 'Privacy Consultant', '2024-03-01', '2024-03-15', 'Planned', NULL, 'Initial', 0),
('ASSESS-005', 'SOC 2 Type II Assessment', 'compliance', 'Security, availability, and confidentiality controls', 'custom', 'External Auditor - Compliance Corp', '2024-04-01', '2024-04-30', 'Planned', NULL, 'Developing', 0);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
