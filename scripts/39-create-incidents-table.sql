-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
    id SERIAL PRIMARY KEY,
    incident_id VARCHAR(50) UNIQUE NOT NULL,
    incident_title VARCHAR(255) NOT NULL,
    incident_description TEXT NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(20) NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    reported_by VARCHAR(255) NOT NULL,
    assigned_to VARCHAR(255) NOT NULL,
    reported_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    detected_date TIMESTAMP WITH TIME ZONE,
    related_asset_id INTEGER REFERENCES information_assets(id),
    related_risk_id INTEGER REFERENCES risks(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_incidents_incident_id ON incidents(incident_id);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_severity ON incidents(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_reported_date ON incidents(reported_date);
CREATE INDEX IF NOT EXISTS idx_incidents_related_asset ON incidents(related_asset_id);
CREATE INDEX IF NOT EXISTS idx_incidents_related_risk ON incidents(related_risk_id);

-- Insert sample incident data
INSERT INTO incidents (
    incident_id, incident_title, incident_description, incident_type,
    severity, status, reported_by, assigned_to, reported_date, detected_date,
    related_asset_id, related_risk_id
) VALUES 
(
    'INC-001',
    'Unauthorized Access Attempt',
    'Multiple failed login attempts detected on admin account from suspicious IP addresses. Potential brute force attack identified by security monitoring system.',
    'Security Breach',
    'High',
    'Open',
    'Security Team',
    'CISO',
    '2024-01-15 10:30:00',
    '2024-01-15 10:15:00',
    1,
    1
),
(
    'INC-002',
    'System Outage - Financial System',
    'Complete system failure affecting financial operations. Database connection lost and application servers unresponsive. Business operations severely impacted.',
    'System Failure',
    'Critical',
    'In Progress',
    'Operations Team',
    'IT Manager',
    '2024-01-14 14:20:00',
    '2024-01-14 14:15:00',
    2,
    2
),
(
    'INC-003',
    'Data Backup Failure',
    'Scheduled backup process failed for critical systems. Backup verification shows incomplete data transfer. Risk of data loss if primary systems fail.',
    'Data Loss',
    'Medium',
    'Resolved',
    'IT Operations',
    'Backup Administrator',
    '2024-01-13 02:00:00',
    '2024-01-13 02:00:00',
    3,
    NULL
),
(
    'INC-004',
    'Phishing Email Campaign',
    'Multiple employees reported suspicious emails requesting credential verification. Email appears to mimic legitimate company communications.',
    'Phishing',
    'High',
    'In Progress',
    'HR Department',
    'Security Team',
    '2024-01-12 09:15:00',
    '2024-01-12 08:45:00',
    NULL,
    3
),
(
    'INC-005',
    'Malware Detection on Workstation',
    'Antivirus software detected and quarantined malware on employee workstation. Potential data exfiltration attempt blocked.',
    'Malware',
    'Medium',
    'Resolved',
    'IT Support',
    'Security Analyst',
    '2024-01-11 16:30:00',
    '2024-01-11 16:25:00',
    4,
    4
);

-- Add audit trigger for incidents table
CREATE OR REPLACE FUNCTION update_incidents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_incidents_updated_at
    BEFORE UPDATE ON incidents
    FOR EACH ROW
    EXECUTE FUNCTION update_incidents_updated_at();
