-- Create schema-specific roles for better security and access control
-- This script creates roles with appropriate permissions for each schema

-- 1. Create schema-specific roles
CREATE ROLE IF NOT EXISTS core_admin;
CREATE ROLE IF NOT EXISTS core_user;
CREATE ROLE IF NOT EXISTS risk_manager;
CREATE ROLE IF NOT EXISTS risk_analyst;
CREATE ROLE IF NOT EXISTS compliance_officer;
CREATE ROLE IF NOT EXISTS compliance_auditor;
CREATE ROLE IF NOT EXISTS security_admin;
CREATE ROLE IF NOT EXISTS security_analyst;
CREATE ROLE IF NOT EXISTS assessment_manager;
CREATE ROLE IF NOT EXISTS assessment_auditor;
CREATE ROLE IF NOT EXISTS system_admin;
CREATE ROLE IF NOT EXISTS vendor_manager;
CREATE ROLE IF NOT EXISTS analytics_user;
CREATE ROLE IF NOT EXISTS readonly_user;

-- 2. Grant schema usage permissions

-- Core schema permissions
GRANT USAGE ON SCHEMA core TO core_admin, core_user, risk_manager, compliance_officer, security_admin, assessment_manager, system_admin, readonly_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA core TO core_admin, system_admin;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA core TO core_user, risk_manager, compliance_officer, security_admin, assessment_manager;
GRANT SELECT ON ALL TABLES IN SCHEMA core TO risk_analyst, compliance_auditor, security_analyst, assessment_auditor, vendor_manager, analytics_user, readonly_user;

-- Risk management schema permissions
GRANT USAGE ON SCHEMA risk_mgmt TO risk_manager, risk_analyst, compliance_officer, security_admin, system_admin, readonly_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA risk_mgmt TO risk_manager, system_admin;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA risk_mgmt TO compliance_officer, security_admin;
GRANT SELECT ON ALL TABLES IN SCHEMA risk_mgmt TO risk_analyst, compliance_auditor, security_analyst, assessment_auditor, analytics_user, readonly_user;

-- Compliance schema permissions
GRANT USAGE ON SCHEMA compliance TO compliance_officer, compliance_auditor, risk_manager, assessment_manager, system_admin, readonly_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA compliance TO compliance_officer, system_admin;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA compliance TO assessment_manager;
GRANT SELECT ON ALL TABLES IN SCHEMA compliance TO compliance_auditor, risk_manager, risk_analyst, security_analyst, analytics_user, readonly_user;

-- Security schema permissions
GRANT USAGE ON SCHEMA security TO security_admin, security_analyst, risk_manager, compliance_officer, system_admin, readonly_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA security TO security_admin, system_admin;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA security TO risk_manager, compliance_officer;
GRANT SELECT ON ALL TABLES IN SCHEMA security TO security_analyst, risk_analyst, compliance_auditor, assessment_auditor, analytics_user, readonly_user;

-- Assessment schema permissions
GRANT USAGE ON SCHEMA assessment TO assessment_manager, assessment_auditor, compliance_officer, risk_manager, system_admin, readonly_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA assessment TO assessment_manager, system_admin;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA assessment TO compliance_officer, risk_manager;
GRANT SELECT ON ALL TABLES IN SCHEMA assessment TO assessment_auditor, risk_analyst, compliance_auditor, security_analyst, analytics_user, readonly_user;

-- Admin schema permissions
GRANT USAGE ON SCHEMA admin TO system_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA admin TO system_admin;
GRANT SELECT ON admin.audit_log TO core_admin, risk_manager, compliance_officer, security_admin, assessment_manager;

-- Vendor management schema permissions
GRANT USAGE ON SCHEMA vendor_mgmt TO vendor_manager, risk_manager, compliance_officer, system_admin, readonly_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA vendor_mgmt TO vendor_manager, system_admin;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA vendor_mgmt TO risk_manager, compliance_officer;
GRANT SELECT ON ALL TABLES IN SCHEMA vendor_mgmt TO risk_analyst, compliance_auditor, security_analyst, analytics_user, readonly_user;

-- Analytics schema permissions
GRANT USAGE ON SCHEMA analytics TO analytics_user, system_admin, readonly_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA analytics TO system_admin;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA analytics TO analytics_user;
GRANT SELECT ON ALL TABLES IN SCHEMA analytics TO risk_manager, compliance_officer, security_admin, assessment_manager, readonly_user;

-- 3. Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA core TO core_admin, core_user, risk_manager, compliance_officer, security_admin, assessment_manager, system_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA risk_mgmt TO risk_manager, compliance_officer, security_admin, system_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA compliance TO compliance_officer, assessment_manager, system_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA security TO security_admin, risk_manager, compliance_officer, system_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA assessment TO assessment_manager, compliance_officer, risk_manager, system_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA admin TO system_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA vendor_mgmt TO vendor_manager, risk_manager, compliance_officer, system_admin;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA analytics TO analytics_user, system_admin;

-- 4. Create role hierarchies
GRANT risk_analyst TO risk_manager;
GRANT compliance_auditor TO compliance_officer;
GRANT security_analyst TO security_admin;
GRANT assessment_auditor TO assessment_manager;
GRANT core_user TO core_admin;

-- 5. Grant permissions on public schema views (for backward compatibility)
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user, analytics_user, risk_analyst, compliance_auditor, security_analyst, assessment_auditor;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO core_admin, risk_manager, compliance_officer, security_admin, assessment_manager, vendor_manager, system_admin;

-- 6. Create function execution permissions
GRANT EXECUTE ON FUNCTION get_organization_risk_summary(INTEGER) TO risk_manager, risk_analyst, compliance_officer, security_admin, analytics_user, readonly_user;
GRANT EXECUTE ON FUNCTION refresh_all_materialized_views() TO system_admin, analytics_user;

-- 7. Create row-level security policies (examples)

-- Enable RLS on sensitive tables
ALTER TABLE core.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin.audit_log ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY user_own_data ON core.users
    FOR ALL TO core_user
    USING (id = current_setting('app.current_user_id')::integer);

CREATE POLICY admin_all_users ON core.users
    FOR ALL TO core_admin, system_admin
    USING (true);

-- Create policy for audit log access
CREATE POLICY audit_log_admin_access ON admin.audit_log
    FOR SELECT TO system_admin
    USING (true);

CREATE POLICY audit_log_manager_access ON admin.audit_log
    FOR SELECT TO core_admin, risk_manager, compliance_officer, security_admin, assessment_manager
    USING (schema_name IN (
        CASE 
            WHEN current_user = 'risk_manager' THEN 'risk_mgmt'
            WHEN current_user = 'compliance_officer' THEN 'compliance'
            WHEN current_user = 'security_admin' THEN 'security'
            WHEN current_user = 'assessment_manager' THEN 'assessment'
            WHEN current_user = 'core_admin' THEN 'core'
            ELSE 'none'
        END
    ));

-- 8. Create role documentation
COMMENT ON ROLE core_admin IS 'Full administrative access to core business entities (assets, organizations, users)';
COMMENT ON ROLE core_user IS 'Standard user access to core business entities with read/write permissions';
COMMENT ON ROLE risk_manager IS 'Full access to risk management functions and data';
COMMENT ON ROLE risk_analyst IS 'Read-only access to risk management data for analysis';
COMMENT ON ROLE compliance_officer IS 'Full access to compliance frameworks and assessments';
COMMENT ON ROLE compliance_auditor IS 'Read-only access to compliance data for auditing';
COMMENT ON ROLE security_admin IS 'Full access to security-related data (incidents, threats, vulnerabilities)';
COMMENT ON ROLE security_analyst IS 'Read-only access to security data for analysis';
COMMENT ON ROLE assessment_manager IS 'Full access to assessment and audit functions';
COMMENT ON ROLE assessment_auditor IS 'Read-only access to assessment data';
COMMENT ON ROLE system_admin IS 'Full system administrative access to all schemas and functions';
COMMENT ON ROLE vendor_manager IS 'Full access to vendor and third-party risk management';
COMMENT ON ROLE analytics_user IS 'Access to analytics data and reporting functions';
COMMENT ON ROLE readonly_user IS 'Read-only access to all non-sensitive data across schemas';

-- 9. Create default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO core_admin, system_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA core GRANT SELECT ON TABLES TO readonly_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA risk_mgmt GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO risk_manager, system_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA risk_mgmt GRANT SELECT ON TABLES TO risk_analyst, readonly_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA compliance GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO compliance_officer, system_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA compliance GRANT SELECT ON TABLES TO compliance_auditor, readonly_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA security GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO security_admin, system_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA security GRANT SELECT ON TABLES TO security_analyst, readonly_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA assessment GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO assessment_manager, system_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA assessment GRANT SELECT ON TABLES TO assessment_auditor, readonly_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA vendor_mgmt GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO vendor_manager, system_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA vendor_mgmt GRANT SELECT ON TABLES TO readonly_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA analytics GRANT SELECT, INSERT, UPDATE ON TABLES TO analytics_user, system_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA analytics GRANT SELECT ON TABLES TO readonly_user;

-- 10. Log role creation
INSERT INTO admin.audit_log (
    schema_name,
    table_name,
    operation,
    new_values,
    changed_by,
    changed_at
) VALUES (
    'admin',
    'role_management',
    'CREATE',
    '{"action": "Created schema-specific roles", "roles_created": 13, "policies_created": 4}',
    'system',
    CURRENT_TIMESTAMP
);

-- Print role creation summary
DO $$
BEGIN
    RAISE NOTICE 'Schema-specific roles created successfully!';
    RAISE NOTICE 'Roles created:';
    RAISE NOTICE '- core_admin, core_user: Core business entity management';
    RAISE NOTICE '- risk_manager, risk_analyst: Risk management';
    RAISE NOTICE '- compliance_officer, compliance_auditor: Compliance management';
    RAISE NOTICE '- security_admin, security_analyst: Security management';
    RAISE NOTICE '- assessment_manager, assessment_auditor: Assessment management';
    RAISE NOTICE '- system_admin: Full system access';
    RAISE NOTICE '- vendor_manager: Vendor management';
    RAISE NOTICE '- analytics_user: Analytics and reporting';
    RAISE NOTICE '- readonly_user: Read-only access';
    RAISE NOTICE 'Row-level security policies enabled on sensitive tables';
END $$;
