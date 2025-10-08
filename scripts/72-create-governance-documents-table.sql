-- Create Document Management table
CREATE TABLE IF NOT EXISTS governance_documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    document_type VARCHAR(100) NOT NULL, -- Policy, Procedure, Standard, Framework, Guideline
    version VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft, under_review, active, archived, superseded
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    description TEXT,
    content TEXT,
    file_path VARCHAR(500),
    file_size BIGINT,
    mime_type VARCHAR(100),
    document_owner VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    approval_authority VARCHAR(100),
    effective_date DATE,
    last_review_date DATE,
    next_review_date DATE,
    review_frequency VARCHAR(50) DEFAULT 'annual',
    related_documents TEXT[], -- Array of related document IDs
    applicable_frameworks TEXT[], -- Array of applicable frameworks (ISO 27001, NIST CSF, etc.)
    tags TEXT[], -- Array of tags for categorization
    confidentiality_level VARCHAR(50) DEFAULT 'internal', -- public, internal, confidential, restricted
    distribution_list TEXT[], -- Array of departments/roles that should have access
    change_history JSONB, -- Store change history as JSON
    approval_workflow JSONB, -- Store approval workflow as JSON
    compliance_requirements TEXT[], -- Array of compliance requirements
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_governance_documents_type ON governance_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_governance_documents_status ON governance_documents(status);
CREATE INDEX IF NOT EXISTS idx_governance_documents_category ON governance_documents(category);
CREATE INDEX IF NOT EXISTS idx_governance_documents_owner ON governance_documents(document_owner);
CREATE INDEX IF NOT EXISTS idx_governance_documents_next_review ON governance_documents(next_review_date);

-- Insert sample data
INSERT INTO governance_documents (title, document_type, version, status, category, subcategory, description, document_owner, department, approval_authority, effective_date, last_review_date, next_review_date, review_frequency, applicable_frameworks, tags, confidentiality_level, created_by) VALUES
('ISO 27001 Information Security Management System', 'Framework', 'v2.1', 'active', 'Security Framework', 'ISMS', 'Comprehensive information security management system based on ISO 27001 standard', 'CISO', 'Security Operations', 'CEO', '2024-01-01', '2024-01-10', '2024-07-10', 'semi-annual', ARRAY['ISO 27001'], ARRAY['ISMS', 'Security', 'Framework'], 'internal', 'CISO'),
('Data Classification and Handling Policy', 'Policy', 'v1.3', 'active', 'Data Protection', 'Classification', 'Policy for classifying and handling different types of data based on sensitivity', 'Data Protection Officer', 'Legal', 'General Counsel', '2024-01-01', '2024-01-05', '2024-07-05', 'annual', ARRAY['ISO 27001', 'GDPR'], ARRAY['Data', 'Classification', 'Privacy'], 'internal', 'Data Protection Officer'),
('Incident Response Procedure', 'Procedure', 'v3.0', 'under_review', 'Incident Management', 'Response', 'Detailed procedure for responding to security incidents', 'Security Operations Manager', 'Security Operations', 'CISO', '2023-12-01', '2023-12-15', '2024-06-15', 'semi-annual', ARRAY['ISO 27001', 'NIST CSF'], ARRAY['Incident', 'Response', 'Security'], 'internal', 'Security Operations Manager'),
('Access Control Standard', 'Standard', 'v2.2', 'active', 'Access Management', 'Controls', 'Standard for implementing and managing access controls', 'Identity & Access Manager', 'IT Security', 'CISO', '2024-01-01', '2024-01-08', '2024-07-08', 'annual', ARRAY['ISO 27001', 'NIST CSF'], ARRAY['Access', 'Control', 'Identity'], 'internal', 'Identity & Access Manager'),
('Security Awareness Training Guideline', 'Guideline', 'v1.1', 'active', 'Training', 'Awareness', 'Guidelines for conducting security awareness training programs', 'Training Manager', 'Human Resources', 'CHRO', '2024-01-01', '2024-01-12', '2024-07-12', 'annual', ARRAY['ISO 27001'], ARRAY['Training', 'Awareness', 'Education'], 'internal', 'Training Manager'),
('Vulnerability Management Policy', 'Policy', 'v1.5', 'active', 'Vulnerability Management', 'Process', 'Policy for identifying, assessing, and remediating vulnerabilities', 'Vulnerability Manager', 'Security Operations', 'CISO', '2024-01-01', '2024-01-15', '2024-07-15', 'annual', ARRAY['ISO 27001', 'NIST CSF'], ARRAY['Vulnerability', 'Management', 'Security'], 'internal', 'Vulnerability Manager'),
('Business Continuity Plan', 'Procedure', 'v2.0', 'active', 'Business Continuity', 'Planning', 'Comprehensive business continuity and disaster recovery plan', 'Business Continuity Manager', 'Operations', 'COO', '2024-01-01', '2024-01-20', '2024-07-20', 'annual', ARRAY['ISO 27001', 'ISO 22301'], ARRAY['Business Continuity', 'Disaster Recovery', 'Planning'], 'confidential', 'Business Continuity Manager'),
('Third Party Risk Management Policy', 'Policy', 'v1.2', 'active', 'Third Party Risk', 'Management', 'Policy for managing risks associated with third-party vendors and suppliers', 'Third Party Risk Manager', 'Procurement', 'CPO', '2024-01-01', '2024-01-18', '2024-07-18', 'annual', ARRAY['ISO 27001', 'NIST CSF'], ARRAY['Third Party', 'Risk', 'Vendor'], 'internal', 'Third Party Risk Manager');




