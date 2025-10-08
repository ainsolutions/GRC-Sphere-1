-- Fix assessment_findings table structure
-- This script ensures the table has the correct columns and structure

-- Drop the table if it exists and recreate with proper structure
DROP TABLE IF EXISTS assessment_findings CASCADE;

-- Create the assessment_findings table with proper structure
CREATE TABLE assessment_findings (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL,
    finding_title VARCHAR(500) NOT NULL,
    finding_description TEXT NOT NULL,
    severity VARCHAR(50) NOT NULL DEFAULT 'Medium',
    category VARCHAR(100),
    recommendation TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Open',
    assigned_to VARCHAR(200),
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    department_id INTEGER,
    organization_id INTEGER DEFAULT 1
);

-- Add indexes for better performance
CREATE INDEX idx_assessment_findings_assessment_id ON assessment_findings(assessment_id);
CREATE INDEX idx_assessment_findings_status ON assessment_findings(status);
CREATE INDEX idx_assessment_findings_severity ON assessment_findings(severity);
CREATE INDEX idx_assessment_findings_organization_id ON assessment_findings(organization_id);
CREATE INDEX idx_assessment_findings_department_id ON assessment_findings(department_id);
CREATE INDEX idx_assessment_findings_created_at ON assessment_findings(created_at);

-- Ensure cybersecurity_assessments table exists
CREATE TABLE IF NOT EXISTS cybersecurity_assessments (
    id SERIAL PRIMARY KEY,
    assessment_id VARCHAR(50) UNIQUE NOT NULL,
    assessment_name VARCHAR(255) NOT NULL,
    type VARCHAR(100) DEFAULT 'Security',
    status VARCHAR(50) DEFAULT 'Planning',
    description TEXT,
    organization_id INTEGER DEFAULT 1,
    department_id INTEGER,
    user_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    findings_count INTEGER DEFAULT 0
);

-- Ensure organizations table exists
CREATE TABLE IF NOT EXISTS organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure departments table exists
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organization_id INTEGER DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure users table exists
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    organization_id INTEGER DEFAULT 1,
    department_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default organization if it doesn't exist
INSERT INTO organizations (id, name, description) 
VALUES (1, 'Default Organization', 'Default organization for the system')
ON CONFLICT (id) DO NOTHING;

-- Insert default departments if they don't exist
INSERT INTO departments (id, name, organization_id, description) VALUES
(1, 'IT Department', 1, 'Information Technology Department'),
(2, 'Security Department', 1, 'Information Security Department'),
(3, 'Compliance Department', 1, 'Compliance and Risk Management Department')
ON CONFLICT (id) DO NOTHING;

-- Insert default users if they don't exist
INSERT INTO users (id, username, email, first_name, last_name, organization_id, department_id) VALUES
(1, 'admin', 'admin@company.com', 'System', 'Administrator', 1, 1),
(2, 'security', 'security@company.com', 'Security', 'Manager', 1, 2),
(3, 'compliance', 'compliance@company.com', 'Compliance', 'Officer', 1, 3)
ON CONFLICT (id) DO NOTHING;

-- Insert sample assessments
INSERT INTO cybersecurity_assessments (assessment_id, assessment_name, type, status, description, organization_id, department_id, user_id) VALUES
('ASSESS-2024-001', 'Annual Security Assessment', 'Security', 'In Progress', 'Comprehensive annual security assessment covering all critical systems', 1, 1, 1),
('ASSESS-2024-002', 'Quarterly Vulnerability Assessment', 'Vulnerability', 'Completed', 'Quarterly vulnerability scan and assessment of network infrastructure', 1, 1, 1),
('ASSESS-2024-003', 'HIPAA Compliance Assessment', 'Compliance', 'Planning', 'Assessment of HIPAA compliance requirements and controls', 1, 2, 2),
('ASSESS-2024-004', 'ISO 27001 Gap Analysis', 'Compliance', 'In Progress', 'Gap analysis for ISO 27001 certification readiness', 1, 1, 1),
('ASSESS-2024-005', 'Penetration Testing Assessment', 'Security', 'Scheduled', 'External penetration testing of web applications and network', 1, 1, 3)
ON CONFLICT (assessment_id) DO NOTHING;

-- Insert sample findings
INSERT INTO assessment_findings (
    assessment_id, finding_title, finding_description, severity, category, 
    recommendation, status, user_id, department_id, organization_id, assigned_to, due_date
) VALUES
(1, 'Weak Password Policy', 'Current password policy does not meet security standards. Passwords can be as short as 6 characters and do not require special characters.', 'High', 'Access Control', 'Implement a strong password policy requiring minimum 12 characters, uppercase, lowercase, numbers, and special characters.', 'Open', 1, 1, 1, 'IT Security Team', '2024-03-15'),
(1, 'Unencrypted Data Transmission', 'Sensitive data is being transmitted over unencrypted channels in several applications.', 'Critical', 'Data Protection', 'Implement TLS 1.3 encryption for all data transmission channels.', 'In Progress', 1, 1, 1, 'Development Team', '2024-02-28'),
(1, 'Missing Security Headers', 'Web applications are missing critical security headers such as HSTS, CSP, and X-Frame-Options.', 'Medium', 'Application Security', 'Configure proper security headers on all web applications.', 'Open', 2, 1, 1, 'Web Development Team', '2024-03-10'),
(2, 'Outdated Software Versions', 'Multiple systems are running outdated software versions with known vulnerabilities.', 'High', 'Vulnerability Management', 'Establish a regular patching schedule and update all systems to latest stable versions.', 'Resolved', 1, 1, 1, 'System Administrators', '2024-02-15'),
(2, 'Open Network Ports', 'Several unnecessary network ports are open and accessible from external networks.', 'Medium', 'Network Security', 'Close unnecessary ports and implement proper firewall rules.', 'Closed', 1, 1, 1, 'Network Team', '2024-02-20'),
(3, 'Insufficient Access Logging', 'HIPAA requires comprehensive access logging, but current systems have gaps in audit trails.', 'High', 'Compliance', 'Implement comprehensive access logging for all systems handling PHI.', 'Open', 2, 2, 1, 'Compliance Team', '2024-04-01'),
(3, 'Missing Data Encryption', 'PHI data is stored without proper encryption in several databases.', 'Critical', 'Data Protection', 'Implement database-level encryption for all PHI storage systems.', 'In Progress', 2, 2, 1, 'Database Team', '2024-03-15'),
(4, 'Incomplete Risk Assessment', 'Current risk assessment processes do not cover all assets as required by ISO 27001.', 'Medium', 'Risk Management', 'Expand risk assessment to include all information assets and update regularly.', 'Open', 1, 1, 1, 'Risk Management Team', '2024-03-30'),
(4, 'Missing Incident Response Plan', 'No formal incident response plan exists as required by ISO 27001.', 'High', 'Incident Management', 'Develop and implement a comprehensive incident response plan.', 'In Progress', 1, 1, 1, 'Security Team', '2024-04-15'),
(5, 'SQL Injection Vulnerabilities', 'Multiple SQL injection vulnerabilities discovered in web applications.', 'Critical', 'Application Security', 'Implement parameterized queries and input validation across all applications.', 'Open', 3, 1, 1, 'Development Team', '2024-02-25');

-- Create trigger function to update findings count
CREATE OR REPLACE FUNCTION update_assessment_findings_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE cybersecurity_assessments 
        SET findings_count = findings_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.assessment_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE cybersecurity_assessments 
        SET findings_count = findings_count - 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.assessment_id;
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' AND OLD.assessment_id != NEW.assessment_id THEN
        -- If assessment_id changed, update both old and new assessments
        UPDATE cybersecurity_assessments 
        SET findings_count = findings_count - 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.assessment_id;
        
        UPDATE cybersecurity_assessments 
        SET findings_count = findings_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.assessment_id;
        RETURN NEW;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_update_assessment_findings_count ON assessment_findings;
CREATE TRIGGER trigger_update_assessment_findings_count
    AFTER INSERT OR UPDATE OR DELETE ON assessment_findings
    FOR EACH ROW EXECUTE FUNCTION update_assessment_findings_count();

-- Update current findings count for existing assessments
UPDATE cybersecurity_assessments 
SET findings_count = (
    SELECT COUNT(*) 
    FROM assessment_findings af 
    WHERE af.assessment_id = cybersecurity_assessments.id
),
updated_at = CURRENT_TIMESTAMP;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create updated_at triggers for all tables
DROP TRIGGER IF EXISTS update_assessment_findings_updated_at ON assessment_findings;
CREATE TRIGGER update_assessment_findings_updated_at
    BEFORE UPDATE ON assessment_findings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cybersecurity_assessments_updated_at ON cybersecurity_assessments;
CREATE TRIGGER update_cybersecurity_assessments_updated_at
    BEFORE UPDATE ON cybersecurity_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'assessment_findings'
ORDER BY ordinal_position;

-- Show sample data
SELECT 
    ca.assessment_id,
    ca.assessment_name,
    ca.status,
    ca.findings_count,
    COUNT(af.id) as actual_findings_count
FROM cybersecurity_assessments ca
LEFT JOIN assessment_findings af ON ca.id = af.assessment_id
GROUP BY ca.id, ca.assessment_id, ca.assessment_name, ca.status, ca.findings_count
ORDER BY ca.assessment_id;
