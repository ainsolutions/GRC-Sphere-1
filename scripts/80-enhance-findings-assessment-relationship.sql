-- Enhance findings-assessment relationship
-- This script ensures proper foreign key relationships and adds sample data

-- First, ensure the assessment_findings table has proper structure
DO $$
BEGIN
    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessment_findings' AND column_name = 'updated_at') THEN
        ALTER TABLE assessment_findings ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessment_findings' AND column_name = 'assigned_to') THEN
        ALTER TABLE assessment_findings ADD COLUMN assigned_to VARCHAR(255);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'assessment_findings' AND column_name = 'due_date') THEN
        ALTER TABLE assessment_findings ADD COLUMN due_date DATE;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assessment_findings_assessment_id ON assessment_findings(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_findings_status ON assessment_findings(status);
CREATE INDEX IF NOT EXISTS idx_assessment_findings_severity ON assessment_findings(severity);
CREATE INDEX IF NOT EXISTS idx_assessment_findings_organization_id ON assessment_findings(organization_id);
CREATE INDEX IF NOT EXISTS idx_assessment_findings_department_id ON assessment_findings(department_id);
CREATE INDEX IF NOT EXISTS idx_assessment_findings_created_at ON assessment_findings(created_at);

-- Ensure cybersecurity_assessments table exists with proper structure
CREATE TABLE IF NOT EXISTS cybersecurity_assessments (
    id SERIAL PRIMARY KEY,
    assessment_id VARCHAR(50) UNIQUE NOT NULL,
    assessment_name VARCHAR(255) NOT NULL,
    type VARCHAR(100) DEFAULT 'Security',
    status VARCHAR(50) DEFAULT 'Planning',
    description TEXT,
    organization_id INTEGER REFERENCES organizations(id),
    department_id INTEGER REFERENCES departments(id),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    findings_count INTEGER DEFAULT 0
);

-- Add sample assessments if they don't exist
INSERT INTO cybersecurity_assessments (assessment_id, assessment_name, type, status, description, organization_id, department_id, user_id)
SELECT * FROM (VALUES
    ('ASSESS-2024-001', 'Annual Security Assessment', 'Security', 'In Progress', 'Comprehensive annual security assessment covering all critical systems', 1, 1, 1),
    ('ASSESS-2024-002', 'Quarterly Vulnerability Assessment', 'Vulnerability', 'Completed', 'Quarterly vulnerability scan and assessment of network infrastructure', 1, 1, 1),
    ('ASSESS-2024-003', 'HIPAA Compliance Assessment', 'Compliance', 'Planning', 'Assessment of HIPAA compliance requirements and controls', 1, 2, 2),
    ('ASSESS-2024-004', 'ISO 27001 Gap Analysis', 'Compliance', 'In Progress', 'Gap analysis for ISO 27001 certification readiness', 1, 1, 1),
    ('ASSESS-2024-005', 'Penetration Testing Assessment', 'Security', 'Scheduled', 'External penetration testing of web applications and network', 1, 1, 3)
) AS v(assessment_id, assessment_name, type, status, description, organization_id, department_id, user_id)
WHERE NOT EXISTS (SELECT 1 FROM cybersecurity_assessments WHERE assessment_id = v.assessment_id);

-- Add sample findings linked to assessments
INSERT INTO assessment_findings (
    assessment_id, finding_title, finding_description, severity, category, 
    recommendation, status, user_id, department_id, organization_id
)
SELECT * FROM (VALUES
    (1, 'Weak Password Policy', 'Current password policy does not meet security standards. Passwords can be as short as 6 characters and do not require special characters.', 'High', 'Access Control', 'Implement a strong password policy requiring minimum 12 characters, uppercase, lowercase, numbers, and special characters.', 'Open', 1, 1, 1),
    (1, 'Unencrypted Data Transmission', 'Sensitive data is being transmitted over unencrypted channels in several applications.', 'Critical', 'Data Protection', 'Implement TLS 1.3 encryption for all data transmission channels.', 'In Progress', 1, 1, 1),
    (1, 'Missing Security Headers', 'Web applications are missing critical security headers such as HSTS, CSP, and X-Frame-Options.', 'Medium', 'Application Security', 'Configure proper security headers on all web applications.', 'Open', 2, 1, 1),
    (2, 'Outdated Software Versions', 'Multiple systems are running outdated software versions with known vulnerabilities.', 'High', 'Vulnerability Management', 'Establish a regular patching schedule and update all systems to latest stable versions.', 'Resolved', 1, 1, 1),
    (2, 'Open Network Ports', 'Several unnecessary network ports are open and accessible from external networks.', 'Medium', 'Network Security', 'Close unnecessary ports and implement proper firewall rules.', 'Closed', 1, 1, 1),
    (3, 'Insufficient Access Logging', 'HIPAA requires comprehensive access logging, but current systems have gaps in audit trails.', 'High', 'Compliance', 'Implement comprehensive access logging for all systems handling PHI.', 'Open', 2, 2, 1),
    (3, 'Missing Data Encryption', 'PHI data is stored without proper encryption in several databases.', 'Critical', 'Data Protection', 'Implement database-level encryption for all PHI storage systems.', 'In Progress', 2, 2, 1),
    (4, 'Incomplete Risk Assessment', 'Current risk assessment processes do not cover all assets as required by ISO 27001.', 'Medium', 'Risk Management', 'Expand risk assessment to include all information assets and update regularly.', 'Open', 1, 1, 1),
    (4, 'Missing Incident Response Plan', 'No formal incident response plan exists as required by ISO 27001.', 'High', 'Incident Management', 'Develop and implement a comprehensive incident response plan.', 'In Progress', 1, 1, 1),
    (5, 'SQL Injection Vulnerabilities', 'Multiple SQL injection vulnerabilities discovered in web applications.', 'Critical', 'Application Security', 'Implement parameterized queries and input validation across all applications.', 'Open', 3, 1, 1)
) AS v(assessment_id, finding_title, finding_description, severity, category, recommendation, status, user_id, department_id, organization_id)
WHERE NOT EXISTS (
    SELECT 1 FROM assessment_findings af 
    WHERE af.assessment_id = v.assessment_id 
    AND af.finding_title = v.finding_title
);

-- Create trigger to update findings count in assessments
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
    RETURN NULL;
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

-- Add some additional sample data for testing
INSERT INTO cybersecurity_assessments (assessment_id, assessment_name, type, status, description, organization_id, department_id, user_id)
SELECT * FROM (VALUES
    ('ASSESS-2024-006', 'Network Security Assessment', 'Security', 'Completed', 'Comprehensive network security assessment and penetration testing', 1, 1, 1),
    ('ASSESS-2024-007', 'Cloud Security Review', 'Security', 'In Progress', 'Security review of cloud infrastructure and configurations', 1, 1, 2),
    ('ASSESS-2024-008', 'Data Privacy Assessment', 'Compliance', 'Planning', 'Assessment of data privacy controls and GDPR compliance', 1, 2, 2)
) AS v(assessment_id, assessment_name, type, status, description, organization_id, department_id, user_id)
WHERE NOT EXISTS (SELECT 1 FROM cybersecurity_assessments WHERE assessment_id = v.assessment_id);

-- Verify the setup
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

COMMIT;
