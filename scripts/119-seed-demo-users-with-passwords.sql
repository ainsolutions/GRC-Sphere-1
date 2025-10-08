-- Seed demo users with bcrypt-hashed passwords for local development
-- Passwords are hashed with bcrypt (10 rounds) to match lib/crypto.ts

-- Ensure base org and departments exist
INSERT INTO organizations (id, name, description, status)
VALUES (1, 'GRC Tech Demo', 'Demo organization for GRC Tech platform', 'Active')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO departments (id, organization_id, name, description, status)
VALUES 
  (1, 1, 'IT Security', 'Information Technology Security Department', 'Active'),
  (2, 1, 'Risk Management', 'Enterprise Risk Management Department', 'Active'),
  (3, 1, 'Compliance', 'Regulatory Compliance Department', 'Active')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Upsert users with password_hash set
-- Credentials:
--  admin / Admin@123
--  user1 / User1@123
--  user2 / User2@123

INSERT INTO users (
  username, email, first_name, last_name, phone,
  organization_id, department_id, job_title, status, password_hash
) VALUES
  (
    'admin', 'admin@grctech.com', 'Admin', 'User', '+1-555-0001',
    1, 1, 'System Administrator', 'Active',
    '$2b$10$ecr.4MTscqnLV9mnXsTFvuNlU1uy9cWx.bDwkEFys/b7NrEn5kx1W'
  ),
  (
    'user1', 'john.doe@grctech.com', 'John', 'Doe', '+1-555-0002',
    1, 2, 'Risk Analyst', 'Active',
    '$2b$10$ryeDBcro8.ZR5RU18/YfTe6T8aa.t1Dp7qZ3BXtv4VFALWfa4NFRm'
  ),
  (
    'user2', 'jane.smith@grctech.com', 'Jane', 'Smith', '+1-555-0003',
    1, 3, 'Compliance Officer', 'Active',
    '$2b$10$PH0iXIEZZNB9fVi5Sv64bON3lLd/FoIlMX87YbVRp6P9V5ZN9rVwq'
  )
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  phone = EXCLUDED.phone,
  organization_id = EXCLUDED.organization_id,
  department_id = EXCLUDED.department_id,
  job_title = EXCLUDED.job_title,
  status = EXCLUDED.status,
  password_hash = EXCLUDED.password_hash,
  updated_at = CURRENT_TIMESTAMP;


