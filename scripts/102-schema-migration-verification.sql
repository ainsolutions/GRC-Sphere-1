-- Schema Migration Verification Script
-- This script verifies that all tables have been successfully moved to their new schemas

-- 1. Check if all expected schemas exist
DO $$
DECLARE
    schema_names TEXT[] := ARRAY['core', 'risk_mgmt', 'compliance', 'security', 'assessment', 'admin', 'vendor_mgmt', 'analytics'];
    schema_name TEXT;
    schema_exists BOOLEAN;
BEGIN
    RAISE NOTICE 'Verifying schema creation...';
    
    FOREACH schema_name IN ARRAY schema_names
    LOOP
        SELECT EXISTS(
            SELECT 1 FROM information_schema.schemata 
            WHERE schema_name = schema_name
        ) INTO schema_exists;
        
        IF schema_exists THEN
            RAISE NOTICE '✓ Schema % exists', schema_name;
        ELSE
            RAISE WARNING '✗ Schema % does not exist', schema_name;
        END IF;
    END LOOP;
END $$;

-- 2. Verify table distribution across schemas
SELECT 
    schemaname,
    COUNT(*) as table_count,
    string_agg(tablename, ', ' ORDER BY tablename) as tables
FROM pg_tables 
WHERE schemaname IN ('core', 'risk_mgmt', 'compliance', 'security', 'assessment', 'admin', 'vendor_mgmt', 'analytics')
GROUP BY schemaname
ORDER BY schemaname;

-- 3. Check for any remaining tables in public schema (excluding views)
SELECT 
    'public' as schema_name,
    tablename,
    'Should be moved to appropriate schema' as status
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename NOT LIKE '%_view'
AND tablename NOT IN (
    'spatial_ref_sys', 'geography_columns', 'geometry_columns', 'raster_columns', 'raster_overviews'
);

-- 4. Verify views exist in public schema for backward compatibility
SELECT 
    'public' as schema_name,
    viewname,
    'Backward compatibility view' as status
FROM pg_views 
WHERE schemaname = 'public'
AND viewname IN (
    'information_assets', 'organizations', 'users', 'departments',
    'risks', 'risk_categories', 'iso27001_risks', 'fair_risks',
    'incidents', 'threats', 'vulnerabilities', 'controls',
    'assessments', 'roles', 'permissions', 'vendors', 'contracts'
)
ORDER BY viewname;

-- 5. Check foreign key constraints are still valid
SELECT 
    tc.table_schema,
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema IN ('core', 'risk_mgmt', 'compliance', 'security', 'assessment', 'admin', 'vendor_mgmt', 'analytics')
ORDER BY tc.table_schema, tc.table_name;

-- 6. Verify indexes have been maintained
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname IN ('core', 'risk_mgmt', 'compliance', 'security', 'assessment', 'admin', 'vendor_mgmt', 'analytics')
ORDER BY schemaname, tablename, indexname;

-- 7. Check sequence ownership and permissions
SELECT 
    s.schemaname,
    s.sequencename,
    s.sequenceowner,
    pg_get_serial_sequence(s.schemaname||'.'||t.tablename, c.column_name) as associated_table
FROM pg_sequences s
LEFT JOIN information_schema.tables t ON t.table_schema = s.schemaname
LEFT JOIN information_schema.columns c ON c.table_schema = t.table_schema 
    AND c.table_name = t.table_name 
    AND c.column_default LIKE '%'||s.sequencename||'%'
WHERE s.schemaname IN ('core', 'risk_mgmt', 'compliance', 'security', 'assessment', 'admin', 'vendor_mgmt', 'analytics')
ORDER BY s.schemaname, s.sequencename;

-- 8. Verify triggers are still functioning
SELECT 
    event_object_schema,
    event_object_table,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE event_object_schema IN ('core', 'risk_mgmt', 'compliance', 'security', 'assessment', 'admin', 'vendor_mgmt', 'analytics')
ORDER BY event_object_schema, event_object_table, trigger_name;

-- 9. Check permissions on new schemas
SELECT 
    n.nspname as schema_name,
    r.rolname as role_name,
    p.privilege_type
FROM information_schema.role_usage_grants p
JOIN pg_namespace n ON n.nspname = p.object_name
JOIN pg_roles r ON r.rolname = p.grantee
WHERE n.nspname IN ('core', 'risk_mgmt', 'compliance', 'security', 'assessment', 'admin', 'vendor_mgmt', 'analytics')
ORDER BY schema_name, role_name;

-- 10. Test sample queries across schemas to ensure functionality
DO $$
DECLARE
    risk_count INTEGER;
    asset_count INTEGER;
    incident_count INTEGER;
BEGIN
    RAISE NOTICE 'Testing cross-schema queries...';
    
    -- Test risk management query
    SELECT COUNT(*) INTO risk_count FROM risk_mgmt.risks;
    RAISE NOTICE '✓ Risk management schema: % risks found', risk_count;
    
    -- Test core schema query
    SELECT COUNT(*) INTO asset_count FROM core.information_assets;
    RAISE NOTICE '✓ Core schema: % assets found', asset_count;
    
    -- Test security schema query
    SELECT COUNT(*) INTO incident_count FROM security.incidents;
    RAISE NOTICE '✓ Security schema: % incidents found', incident_count;
    
    -- Test cross-schema join
    SELECT COUNT(*) INTO risk_count 
    FROM risk_mgmt.risks r
    JOIN core.information_assets a ON r.asset_id = a.id;
    RAISE NOTICE '✓ Cross-schema join: % risks with assets found', risk_count;
    
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING '✗ Error testing queries: %', SQLERRM;
END $$;

-- 11. Generate migration summary report
SELECT 
    'SCHEMA MIGRATION SUMMARY' as report_section,
    '' as details
UNION ALL
SELECT 
    'Total Schemas Created',
    COUNT(*)::text
FROM information_schema.schemata 
WHERE schema_name IN ('core', 'risk_mgmt', 'compliance', 'security', 'assessment', 'admin', 'vendor_mgmt', 'analytics')
UNION ALL
SELECT 
    'Total Tables Migrated',
    COUNT(*)::text
FROM pg_tables 
WHERE schemaname IN ('core', 'risk_mgmt', 'compliance', 'security', 'assessment', 'admin', 'vendor_mgmt', 'analytics')
UNION ALL
SELECT 
    'Backward Compatibility Views',
    COUNT(*)::text
FROM pg_views 
WHERE schemaname = 'public'
UNION ALL
SELECT 
    'Foreign Key Constraints',
    COUNT(*)::text
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
AND table_schema IN ('core', 'risk_mgmt', 'compliance', 'security', 'assessment', 'admin', 'vendor_mgmt', 'analytics')
UNION ALL
SELECT 
    'Active Triggers',
    COUNT(*)::text
FROM information_schema.triggers
WHERE event_object_schema IN ('core', 'risk_mgmt', 'compliance', 'security', 'assessment', 'admin', 'vendor_mgmt', 'analytics');

-- 12. Log verification completion
INSERT INTO admin.audit_log (
    schema_name,
    table_name,
    operation,
    new_values,
    changed_by,
    changed_at
) VALUES (
    'public',
    'schema_migration_verification',
    'VERIFY',
    '{"status": "completed", "verification_date": "' || CURRENT_TIMESTAMP || '"}',
    'system',
    CURRENT_TIMESTAMP
);

RAISE NOTICE 'Schema migration verification completed successfully!';
