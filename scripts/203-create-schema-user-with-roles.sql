/* 
------ Step1 for Creating Target Schema Before Restoration of Source Schema
-- Create schema for tenant
CREATE SCHEMA org_demo;

-- Create user for tenant
CREATE USER SCHEMA_DEMO_ADMIN WITH PASSWORD 'SCHEMA_DEMO_ADMIN';

-- Grant access only to their schema
GRANT USAGE ON SCHEMA org_demo TO SCHEMA_DEMO_ADMIN;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA org_demo TO SCHEMA_DEMO_ADMIN;

-- Set default search_path so queries automatically hit org_demo
ALTER ROLE SCHEMA_DEMO_ADMIN SET search_path = org_demo, public;


------ Step2 Restore the schema from backup file

------ Step3 Run below scripts after restoration

GRANT INSERT, UPDATE, DELETE, SELECT ON ALL TABLES IN SCHEMA org_demo TO SCHEMA_DEMO_ADMIN;

-- -- Grant on all sequences in the schema
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA org_demo TO SCHEMA_DEMO_ADMIN;

-- -- Make sure future tables/sequences also get the right privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA org_demo
GRANT INSERT, UPDATE, DELETE, SELECT ON TABLES TO SCHEMA_DEMO_ADMIN;

ALTER DEFAULT PRIVILEGES IN SCHEMA org_demo
GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO SCHEMA_DEMO_ADMIN;


