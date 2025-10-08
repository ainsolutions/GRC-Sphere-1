-- Create vulnerabilities table for tracking security vulnerabilities
CREATE TABLE IF NOT EXISTS vulnerabilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    severity VARCHAR(50) DEFAULT 'Medium',
    cvss_score DECIMAL(3,1),
    cve_id VARCHAR(50),
    affected_systems TEXT,
    remediation_status VARCHAR(50) DEFAULT 'Open',
    remediation_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_name ON vulnerabilities(name);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_category ON vulnerabilities(category);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_severity ON vulnerabilities(severity);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_cve_id ON vulnerabilities(cve_id);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_search ON vulnerabilities USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

-- Add constraints
ALTER TABLE vulnerabilities 
ADD CONSTRAINT chk_severity 
CHECK (severity IN ('Critical', 'High', 'Medium', 'Low', 'Informational'));

ALTER TABLE vulnerabilities 
ADD CONSTRAINT chk_remediation_status 
CHECK (remediation_status IN ('Open', 'In Progress', 'Resolved', 'Accepted Risk', 'False Positive'));

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_vulnerabilities_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vulnerabilities_updated_at
    BEFORE UPDATE ON vulnerabilities
    FOR EACH ROW
    EXECUTE FUNCTION update_vulnerabilities_updated_at();
