-- Add Compliance Assessment menu item under IS Compliance

DO $$
DECLARE
    compliance_parent_id INTEGER;
    new_page_id INTEGER;
BEGIN
    -- Find or create "IS Compliance" parent menu item
    SELECT id INTO compliance_parent_id
    FROM pages
    WHERE path = '/compliance' OR name = 'IS Compliance' OR name = 'Compliance'
    LIMIT 1;

    -- If IS Compliance doesn't exist, create it as a parent
    IF compliance_parent_id IS NULL THEN
        INSERT INTO pages (name, path, module, description, is_active, priority)
        VALUES ('IS Compliance', '-', 'Compliance', 'Information Security Compliance Management', true, 50)
        RETURNING id INTO compliance_parent_id;
        
        RAISE NOTICE 'Created IS Compliance parent menu item with ID: %', compliance_parent_id;
    ELSE
        -- Update existing compliance to be a parent (no direct path)
        UPDATE pages 
        SET path = '-', 
            name = 'IS Compliance',
            description = 'Information Security Compliance Management'
        WHERE id = compliance_parent_id;
        
        RAISE NOTICE 'Updated existing Compliance menu item with ID: %', compliance_parent_id;
    END IF;

    -- Add "Compliance Assessment" as a child menu item
    INSERT INTO pages (name, path, module, description, parent_id, is_active, priority, icon)
    VALUES (
        'Compliance Assessment',
        '/compliance-assessment',
        'Compliance',
        'Comprehensive compliance assessment with control evaluation and gap remediation',
        compliance_parent_id,
        true,
        1,
        'FileCheck'
    )
    ON CONFLICT (path) DO UPDATE
    SET parent_id = compliance_parent_id,
        name = 'Compliance Assessment',
        description = 'Comprehensive compliance assessment with control evaluation and gap remediation',
        icon = 'FileCheck',
        is_active = true
    RETURNING id INTO new_page_id;

    RAISE NOTICE 'Added/Updated Compliance Assessment menu item with ID: %', new_page_id;

    -- Ensure other compliance-related pages are also under IS Compliance parent
    UPDATE pages 
    SET parent_id = compliance_parent_id
    WHERE path IN (
        '/security-compliance',
        '/cyber-maturity'
    ) AND parent_id IS NULL;

    RAISE NOTICE 'Updated parent references for related compliance pages';

    -- Grant default permissions to Super Admin role
    INSERT INTO role_permissions (role_id, page_id, permission_id)
    SELECT 
        r.id as role_id,
        new_page_id as page_id,
        p.id as permission_id
    FROM roles r, permissions p
    WHERE r.name = 'Super Admin'
    AND p.name IN ('view', 'create', 'edit', 'delete')
    ON CONFLICT DO NOTHING;

    RAISE NOTICE 'Granted permissions to Super Admin role';

END $$;

-- Add table registrations for the new compliance tables
INSERT INTO database_tables (table_name, display_name, module, description) VALUES
('compliance_assessments', 'Compliance Assessments', 'Compliance', 'Regulatory compliance assessments'),
('compliance_control_assessments', 'Compliance Control Assessments', 'Compliance', 'Individual control assessments'),
('compliance_gap_remediation', 'Compliance Gap Remediation', 'Compliance', 'Gap remediation tracking')
ON CONFLICT (table_name) DO NOTHING;

-- Verify the structure
DO $$
DECLARE
    menu_structure TEXT;
BEGIN
    SELECT string_agg(
        CASE 
            WHEN parent_id IS NULL THEN name || ' (' || COALESCE(path, 'no path') || ')'
            ELSE '  └─ ' || name || ' (' || path || ')'
        END,
        E'\n' ORDER BY parent_id NULLS FIRST, priority, name
    ) INTO menu_structure
    FROM pages
    WHERE name LIKE '%Compliance%' OR parent_id IN (SELECT id FROM pages WHERE name LIKE '%Compliance%');

    RAISE NOTICE E'Compliance menu structure:\n%', menu_structure;
END $$;


