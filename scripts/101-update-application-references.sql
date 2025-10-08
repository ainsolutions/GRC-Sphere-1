-- Update application references to use new schema structure
-- This script provides examples of how to update queries to use the new schemas

-- Example 1: Update queries to use schema-qualified table names
-- Instead of: SELECT * FROM risks;
-- Use: SELECT * FROM risk_mgmt.risks;

-- Example 2: Update joins across schemas
-- SELECT 
--     r.risk_title,
--     a.asset_name,
--     i.incident_title
-- FROM risk_mgmt.risks r
-- JOIN core.information_assets a ON r.asset_id = a.id
-- LEFT JOIN security.incidents i ON i.related_risk_id = r.id;

-- Example 3: Update stored procedures and functions
-- CREATE OR REPLACE FUNCTION get_risk_summary()
-- RETURNS TABLE(risk_count bigint, high_risk_count bigint) AS $$
-- BEGIN
--     RETURN QUERY
--     SELECT 
--         COUNT(*) as risk_count,
--         COUNT(*) FILTER (WHERE risk_level = 'High') as high_risk_count
--     FROM risk_mgmt.risks;
-- END;
-- $$ LANGUAGE plpgsql;

-- Create helper functions for common cross-schema queries
CREATE OR REPLACE FUNCTION get_organization_risk_summary(org_id INTEGER)
RETURNS TABLE(
    total_risks bigint,
    high_risks bigint,
    medium_risks bigint,
    low_risks bigint,
    open_incidents bigint,
    critical_vulnerabilities bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM risk_mgmt.risks WHERE organization_id = org_id) as total_risks,
        (SELECT COUNT(*) FROM risk_mgmt.risks WHERE organization_id = org_id AND risk_level = 'High') as high_risks,
        (SELECT COUNT(*) FROM risk_mgmt.risks WHERE organization_id = org_id AND risk_level = 'Medium') as medium_risks,
        (SELECT COUNT(*) FROM risk_mgmt.risks WHERE organization_id = org_id AND risk_level = 'Low') as low_risks,
        (SELECT COUNT(*) FROM security.incidents WHERE status IN ('Open', 'In Progress')) as open_incidents,
        (SELECT COUNT(*) FROM security.vulnerabilities WHERE severity = 'Critical' AND remediation_status = 'Open') as critical_vulnerabilities;
END;
$$ LANGUAGE plpgsql;

-- Create view for comprehensive risk dashboard
CREATE OR REPLACE VIEW public.risk_dashboard AS
SELECT 
    r.id,
    r.risk_title,
    r.risk_level,
    r.risk_status,
    a.asset_name,
    o.name as organization_name,
    COUNT(i.id) as related_incidents,
    COUNT(v.id) as related_vulnerabilities
FROM risk_mgmt.risks r
LEFT JOIN core.information_assets a ON r.asset_id = a.id
LEFT JOIN core.organizations o ON a.organization_id = o.id
LEFT JOIN security.incidents i ON i.related_risk_id = r.id
LEFT JOIN security.vulnerabilities v ON v.related_asset_id = a.id
GROUP BY r.id, r.risk_title, r.risk_level, r.risk_status, a.asset_name, o.name;

-- Create view for compliance overview
CREATE OR REPLACE VIEW public.compliance_overview AS
SELECT 
    cf.framework_name,
    COUNT(cr.id) as total_requirements,
    COUNT(cr.id) FILTER (WHERE cr.compliance_status = 'Compliant') as compliant_requirements,
    COUNT(cr.id) FILTER (WHERE cr.compliance_status = 'Non-Compliant') as non_compliant_requirements,
    ROUND(
        (COUNT(cr.id) FILTER (WHERE cr.compliance_status = 'Compliant')::decimal / 
         NULLIF(COUNT(cr.id), 0)) * 100, 2
    ) as compliance_percentage
FROM compliance.compliance_frameworks cf
LEFT JOIN compliance.compliance_requirements cr ON cf.id = cr.framework_id
GROUP BY cf.id, cf.framework_name;

-- Create view for security metrics
CREATE OR REPLACE VIEW public.security_metrics AS
SELECT 
    'Incidents' as metric_type,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE severity = 'Critical') as critical_count,
    COUNT(*) FILTER (WHERE severity = 'High') as high_count,
    COUNT(*) FILTER (WHERE status IN ('Open', 'In Progress')) as open_count
FROM security.incidents
UNION ALL
SELECT 
    'Vulnerabilities' as metric_type,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE severity = 'Critical') as critical_count,
    COUNT(*) FILTER (WHERE severity = 'High') as high_count,
    COUNT(*) FILTER (WHERE remediation_status = 'Open') as open_count
FROM security.vulnerabilities
UNION ALL
SELECT 
    'Threats' as metric_type,
    COUNT(*) as total_count,
    COUNT(*) FILTER (WHERE threat_level = 'critical') as critical_count,
    COUNT(*) FILTER (WHERE threat_level = 'high') as high_count,
    COUNT(*) FILTER (WHERE status = 'active') as open_count
FROM security.threats;

-- Update existing triggers to work with new schema structure
-- Example: Update audit trigger to log schema information
CREATE OR REPLACE FUNCTION admin.enhanced_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin.audit_log (
        schema_name,
        table_name,
        operation,
        old_values,
        new_values,
        changed_by,
        changed_at
    ) VALUES (
        TG_TABLE_SCHEMA,
        TG_TABLE_NAME,
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END,
        current_user,
        CURRENT_TIMESTAMP
    );
    
    RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$ LANGUAGE plpgsql;

-- Add schema_name column to audit_log if it doesn't exist
ALTER TABLE admin.audit_log ADD COLUMN IF NOT EXISTS schema_name VARCHAR(100);

-- Create indexes on new schema structure for better performance
CREATE INDEX IF NOT EXISTS idx_risks_organization ON risk_mgmt.risks(organization_id);
CREATE INDEX IF NOT EXISTS idx_assets_organization ON core.information_assets(organization_id);
CREATE INDEX IF NOT EXISTS idx_incidents_asset ON security.incidents(related_asset_id);
CREATE INDEX IF NOT EXISTS idx_vulnerabilities_asset ON security.vulnerabilities(related_asset_id);

-- Create materialized view for performance-critical queries
CREATE MATERIALIZED VIEW IF NOT EXISTS public.risk_summary_mv AS
SELECT 
    o.name as organization_name,
    COUNT(r.id) as total_risks,
    COUNT(r.id) FILTER (WHERE r.risk_level = 'Critical') as critical_risks,
    COUNT(r.id) FILTER (WHERE r.risk_level = 'High') as high_risks,
    COUNT(r.id) FILTER (WHERE r.risk_level = 'Medium') as medium_risks,
    COUNT(r.id) FILTER (WHERE r.risk_level = 'Low') as low_risks,
    AVG(r.likelihood_score * r.impact_score) as avg_risk_score,
    COUNT(i.id) as total_incidents,
    COUNT(v.id) as total_vulnerabilities
FROM core.organizations o
LEFT JOIN core.information_assets a ON o.id = a.organization_id
LEFT JOIN risk_mgmt.risks r ON a.id = r.asset_id
LEFT JOIN security.incidents i ON a.id = i.related_asset_id
LEFT JOIN security.vulnerabilities v ON a.id = v.related_asset_id
GROUP BY o.id, o.name;

-- Create unique index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_risk_summary_mv_org ON public.risk_summary_mv(organization_name);

-- Create function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.risk_summary_mv;
    -- Add other materialized views here as needed
END;
$$ LANGUAGE plpgsql;

-- Log the application reference updates
INSERT INTO admin.audit_log (
    schema_name,
    table_name, 
    operation, 
    new_values, 
    changed_by, 
    changed_at
) VALUES (
    'public',
    'application_references',
    'UPDATE',
    '{"action": "Updated application references for new schema structure", "views_created": true, "functions_updated": true}',
    'system',
    CURRENT_TIMESTAMP
);

COMMENT ON FUNCTION get_organization_risk_summary(INTEGER) IS 'Returns comprehensive risk summary for a specific organization across all schemas';
COMMENT ON VIEW public.risk_dashboard IS 'Comprehensive risk dashboard view combining data from multiple schemas';
COMMENT ON VIEW public.compliance_overview IS 'High-level compliance status across all frameworks';
COMMENT ON VIEW public.security_metrics IS 'Security metrics summary from incidents, vulnerabilities, and threats';
COMMENT ON MATERIALIZED VIEW public.risk_summary_mv IS 'Performance-optimized materialized view for risk summaries';
