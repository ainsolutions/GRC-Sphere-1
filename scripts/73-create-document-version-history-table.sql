-- Create Document Management with Version History
-- Enhanced governance documents with proper version control and file management

-- Main documents table (current version only)
CREATE TABLE IF NOT EXISTS governance_documents (
    id SERIAL PRIMARY KEY,
    document_id VARCHAR(50) UNIQUE NOT NULL, -- Human-readable document identifier (e.g., POL-001, PROC-002)
    title VARCHAR(500) NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- Policy, Procedure, Standard, Framework, Guideline
    current_version VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'initial', -- initial, draft, under_review, reviewed, approved, published, archived
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    description TEXT,
    document_owner VARCHAR(100) NOT NULL,
    department_owner VARCHAR(100),
    approval_authority VARCHAR(100),
    review_frequency VARCHAR(50) DEFAULT 'annual',
    related_documents TEXT[], -- Array of related document IDs
    applicable_frameworks TEXT[], -- Array of applicable frameworks (ISO 27001, NIST CSF, etc.)
    tags TEXT[], -- Array of tags for categorization
    confidentiality_level VARCHAR(50) DEFAULT 'internal', -- public, internal, confidential, restricted
    distribution_list TEXT[], -- Array of departments/roles that should have access
    compliance_requirements TEXT[], -- Array of compliance requirements
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Document versions table (complete version history)
CREATE TABLE IF NOT EXISTS governance_document_versions (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES governance_documents(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft', -- draft, under_review, reviewed, approved, published
    version_notes TEXT, -- What changed in this version
    reviewed_by VARCHAR(100),
    approved_by VARCHAR(100),
    reviewed_at TIMESTAMP,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    UNIQUE(document_id, version)
);

-- Document attachments table (for additional files)
CREATE TABLE IF NOT EXISTS governance_document_attachments (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES governance_documents(id) ON DELETE CASCADE,
    version_id INTEGER REFERENCES governance_document_versions(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    description TEXT,
    uploaded_by VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document approval workflow table
CREATE TABLE IF NOT EXISTS governance_document_approvals (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES governance_documents(id) ON DELETE CASCADE,
    version_id INTEGER REFERENCES governance_document_versions(id) ON DELETE CASCADE,
    approver_role VARCHAR(100) NOT NULL,
    approver_name VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, skipped
    comments TEXT,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document access logs table
CREATE TABLE IF NOT EXISTS governance_document_access_logs (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES governance_documents(id) ON DELETE CASCADE,
    version_id INTEGER REFERENCES governance_document_versions(id),
    user_id VARCHAR(100),
    action VARCHAR(50) NOT NULL, -- viewed, downloaded, edited, approved, etc.
    ip_address VARCHAR(45),
    user_agent TEXT,
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_governance_documents_document_id ON governance_documents(document_id);
CREATE INDEX IF NOT EXISTS idx_governance_documents_type ON governance_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_governance_documents_status ON governance_documents(status);
CREATE INDEX IF NOT EXISTS idx_governance_documents_category ON governance_documents(category);
CREATE INDEX IF NOT EXISTS idx_governance_documents_owner ON governance_documents(document_owner);
CREATE INDEX IF NOT EXISTS idx_governance_documents_department ON governance_documents(department_owner);

CREATE INDEX IF NOT EXISTS idx_document_versions_document_id ON governance_document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_versions_status ON governance_document_versions(status);
CREATE INDEX IF NOT EXISTS idx_document_versions_created_at ON governance_document_versions(created_at);

CREATE INDEX IF NOT EXISTS idx_document_attachments_document_id ON governance_document_attachments(document_id);
CREATE INDEX IF NOT EXISTS idx_document_approvals_document_id ON governance_document_approvals(document_id);
CREATE INDEX IF NOT EXISTS idx_document_access_logs_document_id ON governance_document_access_logs(document_id);

-- Create function to generate document ID
CREATE OR REPLACE FUNCTION generate_document_id(doc_type VARCHAR, category VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    prefix VARCHAR(10);
    next_num INTEGER;
BEGIN
    -- Generate prefix based on document type
    CASE UPPER(doc_type)
        WHEN 'POLICY' THEN prefix := 'POL';
        WHEN 'PROCEDURE' THEN prefix := 'PROC';
        WHEN 'STANDARD' THEN prefix := 'STD';
        WHEN 'FRAMEWORK' THEN prefix := 'FRM';
        WHEN 'GUIDELINE' THEN prefix := 'GLD';
        WHEN 'TEMPLATE' THEN prefix := 'TPL';
        ELSE prefix := 'DOC';
    END CASE;

    -- Get next number for this prefix
    SELECT COALESCE(MAX(CAST(SUBSTRING(document_id FROM '[0-9]+$') AS INTEGER)), 0) + 1
    INTO next_num
    FROM governance_documents
    WHERE document_id LIKE prefix || '-%';

    -- Return formatted document ID
    RETURN prefix || '-' || LPAD(next_num::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Insert sample data
INSERT INTO governance_documents (document_id, title, document_type, current_version, status, category, subcategory, description, document_owner, department_owner, approval_authority, applicable_frameworks, tags, confidentiality_level, created_by) VALUES
('POL-001', 'Information Security Policy', 'Policy', '1.0', 'approved', 'Information Security', 'Governance', 'Main information security policy document', 'CISO', 'Information Security', 'CEO', ARRAY['ISO 27001', 'NIST CSF'], ARRAY['Security', 'Policy', 'Governance'], 'internal', 'CISO'),
('PROC-001', 'Incident Response Procedure', 'Procedure', '2.1', 'reviewed', 'Incident Management', 'Response', 'Standard procedure for handling security incidents', 'Incident Manager', 'Security Operations', 'CISO', ARRAY['ISO 27001', 'NIST CSF'], ARRAY['Incident', 'Response', 'Security'], 'internal', 'Incident Manager'),
('STD-001', 'Access Control Standard', 'Standard', '1.2', 'draft', 'Access Management', 'Controls', 'Technical standard for access control implementation', 'Access Manager', 'IT Security', 'CISO', ARRAY['ISO 27001'], ARRAY['Access', 'Control', 'Technical'], 'internal', 'Access Manager');

-- Insert sample versions
INSERT INTO governance_document_versions (document_id, version, title, content, status, version_notes, created_by) VALUES
(1, '1.0', 'Information Security Policy', 'This is the main information security policy content...', 'approved', 'Initial version', 'CISO'),
(2, '1.0', 'Incident Response Procedure', 'Initial incident response procedure content...', 'approved', 'Initial version', 'Incident Manager'),
(2, '2.0', 'Incident Response Procedure', 'Updated incident response procedure with new requirements...', 'reviewed', 'Added ransomware response section', 'Incident Manager'),
(2, '2.1', 'Incident Response Procedure', 'Final review updates to incident response procedure...', 'reviewed', 'Minor corrections and clarifications', 'Incident Manager'),
(3, '1.0', 'Access Control Standard', 'Initial access control standard...', 'draft', 'Initial draft', 'Access Manager'),
(3, '1.1', 'Access Control Standard', 'Updated access control standard with MFA requirements...', 'draft', 'Added MFA requirements', 'Access Manager'),
(3, '1.2', 'Access Control Standard', 'Final access control standard with all requirements...', 'draft', 'Added privileged access management', 'Access Manager');

-- Insert sample approval workflow
INSERT INTO governance_document_approvals (document_id, version_id, approver_role, status) VALUES
(1, 1, 'CISO', 'approved'),
(1, 1, 'CEO', 'approved'),
(2, 3, 'CISO', 'approved'),
(2, 3, 'Security Team Lead', 'pending');
