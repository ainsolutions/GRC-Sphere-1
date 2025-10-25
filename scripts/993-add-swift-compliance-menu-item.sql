-- Add SWIFT Compliance submenu item under IS Compliance

DO $$
DECLARE
    compliance_parent_id INTEGER;
    swift_page_id INTEGER;
BEGIN
    -- Find or create "IS Compliance" parent menu item
    SELECT id INTO compliance_parent_id
    FROM pages
    WHERE (path = '/compliance' OR name = 'IS Compliance' OR name = 'Compliance')
    AND parent_id IS NULL
    LIMIT 1;

    -- If IS Compliance doesn't exist, create it as a parent
    IF compliance_parent_id IS NULL THEN
        INSERT INTO pages (name, path, module, description, is_active, priority, icon)
        VALUES ('IS Compliance', '-', 'Compliance', 'Information Security Compliance Management', true, 50, 'BookOpen')
        RETURNING id INTO compliance_parent_id;
        
        RAISE NOTICE 'Created IS Compliance parent menu item with ID: %', compliance_parent_id;
    ELSE
        -- Update existing compliance to be a parent (no direct path)
        UPDATE pages 
        SET path = '-', 
            name = 'IS Compliance',
            description = 'Information Security Compliance Management',
            icon = 'BookOpen'
        WHERE id = compliance_parent_id;
        
        RAISE NOTICE 'Updated existing IS Compliance menu item with ID: %', compliance_parent_id;
    END IF;

    -- Add "SWIFT Compliance" as a child menu item
    INSERT INTO pages (name, path, module, description, parent_id, is_active, priority, icon)
    VALUES (
        'SWIFT Compliance',
        '/swift-compliance',
        'Compliance',
        'SWIFT Customer Security Programme (CSP) compliance assessment and attestation',
        compliance_parent_id,
        true,
        3,
        'DollarSign'
    )
    ON CONFLICT (path) DO UPDATE
    SET parent_id = compliance_parent_id,
        name = 'SWIFT Compliance',
        description = 'SWIFT Customer Security Programme (CSP) compliance assessment and attestation',
        icon = 'DollarSign',
        is_active = true,
        priority = 3
    RETURNING id INTO swift_page_id;

    RAISE NOTICE 'Added/Updated SWIFT Compliance menu item with ID: %', swift_page_id;

    -- Grant default permissions to Super Admin role
    INSERT INTO role_permissions (role_id, page_id, permission_id)
    SELECT 
        r.id as role_id,
        swift_page_id as page_id,
        p.id as permission_id
    FROM roles r, permissions p
    WHERE r.name = 'Super Admin'
    AND p.name IN ('view', 'create', 'edit', 'delete')
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Granted permissions to Super Admin role for SWIFT Compliance';

    -- Verify menu structure
    RAISE NOTICE 'Menu structure created:';
    RAISE NOTICE '  IS Compliance (parent)';
    RAISE NOTICE '    └─ SWIFT Compliance (/swift-compliance)';

END $$;

-- Add table registrations for SWIFT tables
INSERT INTO database_tables (table_name, display_name, module, description) VALUES
('swift_assessments', 'SWIFT Assessments', 'Compliance', 'SWIFT Customer Security Programme assessments'),
('swift_control_assessments', 'SWIFT Control Assessments', 'Compliance', 'SWIFT CSP control evaluations'),
('swift_gap_remediation', 'SWIFT Gap Remediation', 'Compliance', 'SWIFT compliance gap remediation tracking')
ON CONFLICT (table_name) DO NOTHING;

COMMENT ON TABLE swift_assessments IS 'SWIFT Customer Security Programme (CSP) compliance assessments for financial institutions';
COMMENT ON TABLE swift_control_assessments IS 'Individual SWIFT CSP control assessments linked to compliance assessments';
COMMENT ON TABLE swift_gap_remediation IS 'Gap remediation tracking for SWIFT CSP compliance gaps';

