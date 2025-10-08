-- Insert system permissions
INSERT INTO permissions (name, description, permission_type, is_system_permission) VALUES
('view', 'View/Read access to resources', 'read', TRUE),
('create', 'Create new resources', 'write', TRUE),
('edit', 'Edit/Update existing resources', 'write', TRUE),
('delete', 'Delete resources', 'delete', TRUE),
('export', 'Export data', 'export', TRUE),
('admin', 'Full administrative access', 'admin', TRUE)
ON CONFLICT (name) DO NOTHING;

-- Insert system roles
INSERT INTO roles (name, description, is_system_role) VALUES
('Super Admin', 'Full system access with all permissions', TRUE),
('Admin', 'Administrative access with most permissions', TRUE),
('Manager', 'Management level access with limited admin permissions', TRUE),
('User', 'Standard user access with basic permissions', TRUE),
('Viewer', 'Read-only access to most resources', TRUE)
ON CONFLICT (name) DO NOTHING;

-- Insert application pages
INSERT INTO pages (name, path, module, description) VALUES
-- Dashboard
('Dashboard', '/', 'Dashboard', 'Main dashboard page'),
('Analytics', '/analytics', 'Dashboard', 'Analytics and reporting dashboard'),
('AI Analysis', '/ai-analysis', 'Dashboard', 'AI-powered analysis dashboard'),

-- Risk Management
('Risk Dashboard', '/risks', 'Risk Management', 'Risk management overview'),
('ISO 27001 Risks', '/risks/iso27001', 'Risk Management', 'ISO 27001 risk management'),
('NIST CSF Risks', '/risks/nist-csf', 'Risk Management', 'NIST Cybersecurity Framework risks'),
('FAIR Risks', '/risks/fair', 'Risk Management', 'FAIR risk analysis'),
('FAIR Dashboard', '/risks/fair/dashboard', 'Risk Management', 'FAIR risk dashboard'),
('Threat Assessments', '/risks/threat-assessments', 'Risk Management', 'Threat assessment management'),
('Threats', '/risks/threats', 'Risk Management', 'Threat catalog management'),
('Risk Treatment', '/risk-treatment', 'Risk Management', 'Risk treatment planning'),

-- Compliance
('Compliance', '/compliance', 'Compliance', 'Compliance management overview'),
('Third Party Risk', '/third-party-risk', 'Compliance', 'Third-party risk management'),

-- Assessments
('Assessments', '/assessments', 'Assessments', 'Security assessments overview'),
('Assessment Findings', '/assessments/findings', 'Assessments', 'Assessment findings management'),
('Vulnerabilities', '/assessments/vulnerabilities', 'Assessments', 'Vulnerability management'),

-- Assets
('Assets', '/assets', 'Asset Management', 'Asset inventory management'),

-- Incidents
('Incidents', '/incidents', 'Incident Management', 'Security incident management'),

-- Findings
('Findings', '/findings', 'Findings', 'Security findings management'),

-- Audit
('Audit Logs', '/audit', 'Audit', 'System audit logs'),

-- User Management
('Users', '/users', 'User Management', 'User account management'),
('Organizations', '/organizations', 'User Management', 'Organization management'),

-- Settings
('Settings', '/settings', 'Administration', 'System settings and configuration')
ON CONFLICT (path) DO NOTHING;

-- Insert database tables
INSERT INTO database_tables (table_name, display_name, module, description) VALUES
-- Core tables
('users', 'Users', 'User Management', 'System users'),
('organizations', 'Organizations', 'User Management', 'Organizations'),
('departments', 'Departments', 'User Management', 'Departments'),

-- Risk Management tables
('risks', 'Risks', 'Risk Management', 'Risk register'),
('iso27001_risks', 'ISO 27001 Risks', 'Risk Management', 'ISO 27001 specific risks'),
('nist_csf_risk_templates', 'NIST CSF Risk Templates', 'Risk Management', 'NIST CSF risk templates'),
('fair_risks', 'FAIR Risks', 'Risk Management', 'FAIR risk analysis'),
('threats', 'Threats', 'Risk Management', 'Threat catalog'),
('threat_assessments', 'Threat Assessments', 'Risk Management', 'Threat assessments'),
('risk_treatment_plans', 'Risk Treatment Plans', 'Risk Management', 'Risk treatment plans'),
('risk_treatment_controls', 'Risk Treatment Controls', 'Risk Management', 'Risk treatment controls'),

-- Asset Management tables
('assets', 'Assets', 'Asset Management', 'Asset inventory'),

-- Compliance tables
('assessments', 'Assessments', 'Compliance', 'Security assessments'),
('findings', 'Findings', 'Compliance', 'Assessment findings'),
('vulnerabilities', 'Vulnerabilities', 'Compliance', 'Vulnerability records'),
('hipaa_assessments', 'HIPAA Assessments', 'Compliance', 'HIPAA compliance assessments'),
('nesa_uae_assessments', 'NESA UAE Assessments', 'Compliance', 'NESA UAE compliance assessments'),

-- Incident Management tables
('incidents', 'Incidents', 'Incident Management', 'Security incidents'),

-- Audit tables
('audit_logs', 'Audit Logs', 'Audit', 'System audit trail'),

-- Control Management tables
('iso27002_controls', 'ISO 27002 Controls', 'Controls', 'ISO 27002 control catalog'),
('nist_csf_controls', 'NIST CSF Controls', 'Controls', 'NIST CSF control catalog'),
('control_testing', 'Control Testing', 'Controls', 'Control effectiveness testing')
ON CONFLICT (table_name) DO NOTHING;
