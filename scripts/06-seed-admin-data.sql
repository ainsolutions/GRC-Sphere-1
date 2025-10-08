-- Insert default permissions
INSERT INTO permissions (name, description, category) VALUES
-- Asset Management
('assets.create', 'Create new assets', 'Asset Management'),
('assets.read', 'View assets', 'Asset Management'),
('assets.update', 'Update existing assets', 'Asset Management'),
('assets.delete', 'Delete assets', 'Asset Management'),

-- Risk Management
('risks.create', 'Create new risks', 'Risk Management'),
('risks.read', 'View risks', 'Risk Management'),
('risks.update', 'Update existing risks', 'Risk Management'),
('risks.delete', 'Delete risks', 'Risk Management'),
('risks.assess', 'Conduct risk assessments', 'Risk Management'),

-- Control Management
('controls.create', 'Create new controls', 'Control Management'),
('controls.read', 'View controls', 'Control Management'),
('controls.update', 'Update existing controls', 'Control Management'),
('controls.delete', 'Delete controls', 'Control Management'),
('controls.test', 'Test control effectiveness', 'Control Management'),

-- Incident Management
('incidents.create', 'Create new incidents', 'Incident Management'),
('incidents.read', 'View incidents', 'Incident Management'),
('incidents.update', 'Update existing incidents', 'Incident Management'),
('incidents.delete', 'Delete incidents', 'Incident Management'),
('incidents.investigate', 'Investigate incidents', 'Incident Management'),

-- Assessment Management
('assessments.create', 'Create new assessments', 'Assessment Management'),
('assessments.read', 'View assessments', 'Assessment Management'),
('assessments.update', 'Update existing assessments', 'Assessment Management'),
('assessments.delete', 'Delete assessments', 'Assessment Management'),
('assessments.conduct', 'Conduct assessments', 'Assessment Management'),

-- User Administration
('users.create', 'Create new users', 'User Administration'),
('users.read', 'View users', 'User Administration'),
('users.update', 'Update existing users', 'User Administration'),
('users.delete', 'Delete users', 'User Administration'),
('users.manage_roles', 'Manage user roles', 'User Administration'),

-- System Administration
('system.admin', 'Full system administration', 'System Administration'),
('system.audit', 'View audit logs', 'System Administration'),
('system.settings', 'Manage system settings', 'System Administration')
ON CONFLICT (name) DO NOTHING;

-- Insert sample organization
INSERT INTO organizations (name, description, address, phone, email, website, status) VALUES
('TechCorp Solutions', 'Leading technology solutions provider', '123 Tech Street, Silicon Valley, CA 94000', '+1-555-0123', 'info@techcorp.com', 'https://techcorp.com', 'Active')
ON CONFLICT DO NOTHING;

-- Insert sample departments
INSERT INTO departments (organization_id, name, description, department_head, budget, cost_center, phone, email, location, status) VALUES
((SELECT id FROM organizations WHERE name = 'TechCorp Solutions'), 'Information Technology', 'IT operations and infrastructure', 'John Smith', 500000.00, 'IT-001', '+1-555-0124', 'it@techcorp.com', 'Building A, Floor 2', 'Active'),
((SELECT id FROM organizations WHERE name = 'TechCorp Solutions'), 'Security & Compliance', 'Information security and compliance management', 'Jane Doe', 300000.00, 'SEC-001', '+1-555-0125', 'security@techcorp.com', 'Building A, Floor 3', 'Active'),
((SELECT id FROM organizations WHERE name = 'TechCorp Solutions'), 'Human Resources', 'Human resources and employee management', 'Mike Johnson', 200000.00, 'HR-001', '+1-555-0126', 'hr@techcorp.com', 'Building B, Floor 1', 'Active'),
((SELECT id FROM organizations WHERE name = 'TechCorp Solutions'), 'Finance', 'Financial operations and accounting', 'Sarah Wilson', 400000.00, 'FIN-001', '+1-555-0127', 'finance@techcorp.com', 'Building B, Floor 2', 'Active')
ON CONFLICT DO NOTHING;

-- Insert sample users
INSERT INTO users (organization_id, department_id, username, email, first_name, last_name, phone, job_title, employee_id, status) VALUES
((SELECT id FROM organizations WHERE name = 'TechCorp Solutions'), 
 (SELECT id FROM departments WHERE name = 'Information Technology'), 
 'jsmith', 'john.smith@techcorp.com', 'John', 'Smith', '+1-555-1001', 'IT Director', 'EMP001', 'Active'),
((SELECT id FROM organizations WHERE name = 'TechCorp Solutions'), 
 (SELECT id FROM departments WHERE name = 'Security & Compliance'), 
 'jdoe', 'jane.doe@techcorp.com', 'Jane', 'Doe', '+1-555-1002', 'CISO', 'EMP002', 'Active'),
((SELECT id FROM organizations WHERE name = 'TechCorp Solutions'), 
 (SELECT id FROM departments WHERE name = 'Human Resources'), 
 'mjohnson', 'mike.johnson@techcorp.com', 'Mike', 'Johnson', '+1-555-1003', 'HR Manager', 'EMP003', 'Active'),
((SELECT id FROM organizations WHERE name = 'TechCorp Solutions'), 
 (SELECT id FROM departments WHERE name = 'Finance'), 
 'swilson', 'sarah.wilson@techcorp.com', 'Sarah', 'Wilson', '+1-555-1004', 'Finance Director', 'EMP004', 'Active')
ON CONFLICT DO NOTHING;

-- Insert sample roles
INSERT INTO roles (organization_id, name, description, is_system_role) VALUES
((SELECT id FROM organizations WHERE name = 'TechCorp Solutions'), 'System Administrator', 'Full system access and administration', true),
((SELECT id FROM organizations WHERE name = 'TechCorp Solutions'), 'Security Manager', 'Security and compliance management', false),
((SELECT id FROM organizations WHERE name = 'TechCorp Solutions'), 'Risk Analyst', 'Risk assessment and management', false),
((SELECT id FROM organizations WHERE name = 'TechCorp Solutions'), 'Auditor', 'Audit and compliance review', false),
((SELECT id FROM organizations WHERE name = 'TechCorp Solutions'), 'User', 'Basic user access', false)
ON CONFLICT DO NOTHING;

-- Assign permissions to roles
-- System Administrator gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'System Administrator'
ON CONFLICT DO NOTHING;

-- Security Manager gets security-related permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Security Manager' 
AND p.name IN ('assets.read', 'assets.update', 'risks.create', 'risks.read', 'risks.update', 'risks.assess', 
               'controls.create', 'controls.read', 'controls.update', 'controls.test', 
               'incidents.create', 'incidents.read', 'incidents.update', 'incidents.investigate',
               'assessments.create', 'assessments.read', 'assessments.update', 'assessments.conduct')
ON CONFLICT DO NOTHING;

-- Risk Analyst gets risk-related permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Risk Analyst' 
AND p.name IN ('assets.read', 'risks.create', 'risks.read', 'risks.update', 'risks.assess', 
               'controls.read', 'assessments.read', 'assessments.conduct')
ON CONFLICT DO NOTHING;

-- Auditor gets read-only permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'Auditor' 
AND p.name IN ('assets.read', 'risks.read', 'controls.read', 'incidents.read', 'assessments.read', 'system.audit')
ON CONFLICT DO NOTHING;

-- Basic User gets limited read permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.name = 'User' 
AND p.name IN ('assets.read', 'risks.read', 'controls.read')
ON CONFLICT DO NOTHING;

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT u.id, r.id, u.id
FROM users u, roles r
WHERE u.username = 'jsmith' AND r.name = 'System Administrator'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT u.id, r.id, (SELECT id FROM users WHERE username = 'jsmith')
FROM users u, roles r
WHERE u.username = 'jdoe' AND r.name = 'Security Manager'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT u.id, r.id, (SELECT id FROM users WHERE username = 'jsmith')
FROM users u, roles r
WHERE u.username = 'mjohnson' AND r.name = 'User'
ON CONFLICT DO NOTHING;

INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT u.id, r.id, (SELECT id FROM users WHERE username = 'jsmith')
FROM users u, roles r
WHERE u.username = 'swilson' AND r.name = 'Auditor'
ON CONFLICT DO NOTHING;
