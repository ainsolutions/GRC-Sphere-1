-- Create organized schemas for better database structure
-- This script creates new schemas and transfers tables from public schema

-- 1. Create new schemas
CREATE SCHEMA IF NOT EXISTS core;           -- Core business entities (assets, organizations, users)
CREATE SCHEMA IF NOT EXISTS risk_mgmt;      -- Risk management tables
CREATE SCHEMA IF NOT EXISTS compliance;     -- Compliance and regulatory tables
CREATE SCHEMA IF NOT EXISTS security;       -- Security-related tables (incidents, threats, vulnerabilities)
CREATE SCHEMA IF NOT EXISTS assessment;     -- Assessment and audit tables
CREATE SCHEMA IF NOT EXISTS admin;          -- Administrative tables (roles, permissions)
CREATE SCHEMA IF NOT EXISTS vendor_mgmt;    -- Vendor and third-party management
CREATE SCHEMA IF NOT EXISTS analytics;      -- Analytics and AI-related tables

-- 2. Transfer Core Business Tables to 'core' schema
ALTER TABLE IF EXISTS information_assets SET SCHEMA core;
ALTER TABLE IF EXISTS organizations SET SCHEMA core;
ALTER TABLE IF EXISTS users SET SCHEMA core;
ALTER TABLE IF EXISTS departments SET SCHEMA core;

-- 3. Transfer Risk Management Tables to 'risk_mgmt' schema
ALTER TABLE IF EXISTS risks SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS risk_categories SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS risk_controls SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS iso27001_risks SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS iso27001_controls SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS iso27001_risk_controls SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS iso27001_control_effectiveness SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS iso27001_evidence SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS iso27001_validation_rules SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS iso27001_treatment_plans SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS iso27001_treatment_controls SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS iso27001_treatment_tracking SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS fair_risks SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS risk_treatment_plans SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS risk_treatment_controls SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS risk_treatment_tracking SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS technology_risks SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS nist_csf_risk_templates SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS nist_csf_functions SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS nist_csf_categories SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS nist_csf_subcategories SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS nist_csf_mitigation_plans SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS risk_assessment_workflows SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS risk_assessment_steps SET SCHEMA risk_mgmt;
ALTER TABLE IF EXISTS risk_assessment_responses SET SCHEMA risk_mgmt;

-- 4. Transfer Compliance Tables to 'compliance' schema
ALTER TABLE IF EXISTS compliance_frameworks SET SCHEMA compliance;
ALTER TABLE IF EXISTS compliance_requirements SET SCHEMA compliance;
ALTER TABLE IF EXISTS hipaa_requirements SET SCHEMA compliance;
ALTER TABLE IF EXISTS hipaa_assessments SET SCHEMA compliance;
ALTER TABLE IF EXISTS hipaa_assessment_results SET SCHEMA compliance;
ALTER TABLE IF EXISTS hipaa_remediation_actions SET SCHEMA compliance;
ALTER TABLE IF EXISTS hipaa_remediation_updates SET SCHEMA compliance;
ALTER TABLE IF EXISTS nesa_uae_requirements SET SCHEMA compliance;
ALTER TABLE IF EXISTS nesa_uae_controls SET SCHEMA compliance;
ALTER TABLE IF EXISTS nesa_uae_assessments SET SCHEMA compliance;
ALTER TABLE IF EXISTS nesa_uae_assessment_results SET SCHEMA compliance;
ALTER TABLE IF EXISTS nesa_uae_remediation_actions SET SCHEMA compliance;
ALTER TABLE IF EXISTS nesa_uae_remediation_updates SET SCHEMA compliance;
ALTER TABLE IF EXISTS nesa_uae_remediation_dependencies SET SCHEMA compliance;
ALTER TABLE IF EXISTS nesa_uae_self_assessments SET SCHEMA compliance;
ALTER TABLE IF EXISTS nesa_uae_self_assessment_controls SET SCHEMA compliance;
ALTER TABLE IF EXISTS nesa_uae_self_assessment_audit_log SET SCHEMA compliance;
ALTER TABLE IF EXISTS nesa_uae_gap_analysis SET SCHEMA compliance;

-- 5. Transfer Security Tables to 'security' schema
ALTER TABLE IF EXISTS incidents SET SCHEMA security;
ALTER TABLE IF EXISTS threats SET SCHEMA security;
ALTER TABLE IF EXISTS threat_assessments SET SCHEMA security;
ALTER TABLE IF EXISTS threat_assessment_threats SET SCHEMA security;
ALTER TABLE IF EXISTS vulnerabilities SET SCHEMA security;
ALTER TABLE IF EXISTS controls SET SCHEMA security;
ALTER TABLE IF EXISTS control_testing_workflows SET SCHEMA security;
ALTER TABLE IF EXISTS control_testing_results SET SCHEMA security;
ALTER TABLE IF EXISTS control_testing_evidence SET SCHEMA security;

-- 6. Transfer Assessment Tables to 'assessment' schema
ALTER TABLE IF EXISTS assessments SET SCHEMA assessment;
ALTER TABLE IF EXISTS cybersecurity_assessments SET SCHEMA assessment;
ALTER TABLE IF EXISTS assessment_findings SET SCHEMA assessment;

-- 7. Transfer Administrative Tables to 'admin' schema
ALTER TABLE IF EXISTS roles SET SCHEMA admin;
ALTER TABLE IF EXISTS permissions SET SCHEMA admin;
ALTER TABLE IF EXISTS pages SET SCHEMA admin;
ALTER TABLE IF EXISTS database_tables SET SCHEMA admin;
ALTER TABLE IF EXISTS role_permissions SET SCHEMA admin;
ALTER TABLE IF EXISTS table_permissions SET SCHEMA admin;
ALTER TABLE IF EXISTS user_roles SET SCHEMA admin;
ALTER TABLE IF EXISTS audit_log SET SCHEMA admin;

-- 8. Transfer Vendor Management Tables to 'vendor_mgmt' schema
ALTER TABLE IF EXISTS vendors SET SCHEMA vendor_mgmt;
ALTER TABLE IF EXISTS contracts SET SCHEMA vendor_mgmt;
ALTER TABLE IF EXISTS third_party_risk_templates SET SCHEMA vendor_mgmt;
ALTER TABLE IF EXISTS third_party_risk_assessments SET SCHEMA vendor_mgmt;
ALTER TABLE IF EXISTS third_party_risk_assessment_responses SET SCHEMA vendor_mgmt;

-- 9. Transfer Analytics Tables to 'analytics' schema
ALTER TABLE IF EXISTS ai_analysis_results SET SCHEMA analytics;

-- 10. Update all foreign key references to use schema-qualified names
-- Note: PostgreSQL automatically updates foreign key references when tables are moved

-- 11. Create views in public schema for backward compatibility (optional)
-- This ensures existing application code continues to work

-- Core tables views
CREATE OR REPLACE VIEW public.information_assets AS SELECT * FROM core.information_assets;
CREATE OR REPLACE VIEW public.organizations AS SELECT * FROM core.organizations;
CREATE OR REPLACE VIEW public.users AS SELECT * FROM core.users;
CREATE OR REPLACE VIEW public.departments AS SELECT * FROM core.departments;

-- Risk management views
CREATE OR REPLACE VIEW public.risks AS SELECT * FROM risk_mgmt.risks;
CREATE OR REPLACE VIEW public.risk_categories AS SELECT * FROM risk_mgmt.risk_categories;
CREATE OR REPLACE VIEW public.risk_controls AS SELECT * FROM risk_mgmt.risk_controls;
CREATE OR REPLACE VIEW public.iso27001_risks AS SELECT * FROM risk_mgmt.iso27001_risks;
CREATE OR REPLACE VIEW public.iso27001_controls AS SELECT * FROM risk_mgmt.iso27001_controls;
CREATE OR REPLACE VIEW public.iso27001_risk_controls AS SELECT * FROM risk_mgmt.iso27001_risk_controls;
CREATE OR REPLACE VIEW public.fair_risks AS SELECT * FROM risk_mgmt.fair_risks;
CREATE OR REPLACE VIEW public.technology_risks AS SELECT * FROM risk_mgmt.technology_risks;

-- Compliance views
CREATE OR REPLACE VIEW public.compliance_frameworks AS SELECT * FROM compliance.compliance_frameworks;
CREATE OR REPLACE VIEW public.compliance_requirements AS SELECT * FROM compliance.compliance_requirements;
CREATE OR REPLACE VIEW public.hipaa_requirements AS SELECT * FROM compliance.hipaa_requirements;
CREATE OR REPLACE VIEW public.hipaa_assessments AS SELECT * FROM compliance.hipaa_assessments;
CREATE OR REPLACE VIEW public.nesa_uae_requirements AS SELECT * FROM compliance.nesa_uae_requirements;
CREATE OR REPLACE VIEW public.nesa_uae_assessments AS SELECT * FROM compliance.nesa_uae_assessments;

-- Security views
CREATE OR REPLACE VIEW public.incidents AS SELECT * FROM security.incidents;
CREATE OR REPLACE VIEW public.threats AS SELECT * FROM security.threats;
CREATE OR REPLACE VIEW public.threat_assessments AS SELECT * FROM security.threat_assessments;
CREATE OR REPLACE VIEW public.vulnerabilities AS SELECT * FROM security.vulnerabilities;
CREATE OR REPLACE VIEW public.controls AS SELECT * FROM security.controls;

-- Assessment views
CREATE OR REPLACE VIEW public.assessments AS SELECT * FROM assessment.assessments;
CREATE OR REPLACE VIEW public.cybersecurity_assessments AS SELECT * FROM assessment.cybersecurity_assessments;
CREATE OR REPLACE VIEW public.assessment_findings AS SELECT * FROM assessment.assessment_findings;

-- Admin views
CREATE OR REPLACE VIEW public.roles AS SELECT * FROM admin.roles;
CREATE OR REPLACE VIEW public.permissions AS SELECT * FROM admin.permissions;
CREATE OR REPLACE VIEW public.user_roles AS SELECT * FROM admin.user_roles;

-- Vendor management views
CREATE OR REPLACE VIEW public.vendors AS SELECT * FROM vendor_mgmt.vendors;
CREATE OR REPLACE VIEW public.contracts AS SELECT * FROM vendor_mgmt.contracts;

-- Analytics views
CREATE OR REPLACE VIEW public.ai_analysis_results AS SELECT * FROM analytics.ai_analysis_results;

-- 12. Grant appropriate permissions to schemas
GRANT USAGE ON SCHEMA core TO PUBLIC;
GRANT USAGE ON SCHEMA risk_mgmt TO PUBLIC;
GRANT USAGE ON SCHEMA compliance TO PUBLIC;
GRANT USAGE ON SCHEMA security TO PUBLIC;
GRANT USAGE ON SCHEMA assessment TO PUBLIC;
GRANT USAGE ON SCHEMA admin TO PUBLIC;
GRANT USAGE ON SCHEMA vendor_mgmt TO PUBLIC;
GRANT USAGE ON SCHEMA analytics TO PUBLIC;

-- Grant table permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA core TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA risk_mgmt TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA compliance TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA security TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA assessment TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA admin TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA vendor_mgmt TO PUBLIC;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA analytics TO PUBLIC;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA core TO PUBLIC;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA risk_mgmt TO PUBLIC;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA compliance TO PUBLIC;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA security TO PUBLIC;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA assessment TO PUBLIC;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA admin TO PUBLIC;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA vendor_mgmt TO PUBLIC;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA analytics TO PUBLIC;

-- 13. Update search_path to include new schemas
-- This can be set at database level or per user/role
-- ALTER DATABASE your_database_name SET search_path = public, core, risk_mgmt, compliance, security, assessment, admin, vendor_mgmt, analytics;

-- 14. Create schema documentation
COMMENT ON SCHEMA core IS 'Core business entities including assets, organizations, users, and departments';
COMMENT ON SCHEMA risk_mgmt IS 'Risk management tables including risk assessments, treatments, and frameworks (ISO 27001, NIST CSF, FAIR)';
COMMENT ON SCHEMA compliance IS 'Compliance and regulatory framework tables (HIPAA, NESA UAE, etc.)';
COMMENT ON SCHEMA security IS 'Security-related tables including incidents, threats, vulnerabilities, and controls';
COMMENT ON SCHEMA assessment IS 'Assessment and audit tables for cybersecurity evaluations';
COMMENT ON SCHEMA admin IS 'Administrative tables for roles, permissions, and system configuration';
COMMENT ON SCHEMA vendor_mgmt IS 'Vendor and third-party risk management tables';
COMMENT ON SCHEMA analytics IS 'Analytics and AI-related tables for reporting and insights';

-- 15. Log the schema migration
INSERT INTO admin.audit_log (
    table_name, 
    operation, 
    old_values, 
    new_values, 
    changed_by, 
    changed_at
) VALUES (
    'schema_migration',
    'REORGANIZE',
    '{"schema": "public"}',
    '{"schemas": ["core", "risk_mgmt", "compliance", "security", "assessment", "admin", "vendor_mgmt", "analytics"]}',
    'system',
    CURRENT_TIMESTAMP
);

-- Print completion message
DO $$
BEGIN
    RAISE NOTICE 'Schema reorganization completed successfully!';
    RAISE NOTICE 'Tables have been moved to organized schemas:';
    RAISE NOTICE '- core: Core business entities';
    RAISE NOTICE '- risk_mgmt: Risk management tables';
    RAISE NOTICE '- compliance: Compliance frameworks';
    RAISE NOTICE '- security: Security-related tables';
    RAISE NOTICE '- assessment: Assessment and audit tables';
    RAISE NOTICE '- admin: Administrative tables';
    RAISE NOTICE '- vendor_mgmt: Vendor management tables';
    RAISE NOTICE '- analytics: Analytics and AI tables';
    RAISE NOTICE 'Backward compatibility views created in public schema';
END $$;
