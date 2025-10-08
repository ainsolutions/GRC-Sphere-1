-- Add demo users with known passwords for login testing
INSERT INTO users (first_name, last_name, username, email, phone, organization_id, department_id, job_title, status) 
VALUES 
  ('Admin', 'User', 'admin', 'admin@grctech.com', '+1-555-0001', 1, 1, 'System Administrator', 'Active'),
  ('John', 'Doe', 'user1', 'john.doe@grctech.com', '+1-555-0002', 1, 2, 'Risk Analyst', 'Active'),
  ('Jane', 'Smith', 'user2', 'jane.smith@grctech.com', '+1-555-0003', 1, 3, 'Compliance Officer', 'Active')
ON CONFLICT (username) DO UPDATE SET
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  phone = EXCLUDED.phone,
  organization_id = EXCLUDED.organization_id,
  department_id = EXCLUDED.department_id,
  job_title = EXCLUDED.job_title,
  status = EXCLUDED.status;

-- Ensure we have organizations and departments for the demo users
INSERT INTO organizations (name, description, status) 
VALUES ('GRC Tech Demo', 'Demo organization for GRC Tech platform', 'Active')
ON CONFLICT (name) DO NOTHING;

INSERT INTO departments (name, description, organization_id, status) 
VALUES 
  ('IT Security', 'Information Technology Security Department', 1, 'Active'),
  ('Risk Management', 'Enterprise Risk Management Department', 1, 'Active'),
  ('Compliance', 'Regulatory Compliance Department', 1, 'Active')
ON CONFLICT (name, organization_id) DO NOTHING;
