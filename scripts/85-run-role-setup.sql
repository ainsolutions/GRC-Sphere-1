-- This script ensures all role and permission setup is complete

-- Verify tables exist
SELECT 'Roles table' as table_name, COUNT(*) as record_count FROM roles
UNION ALL
SELECT 'Permissions table', COUNT(*) FROM permissions
UNION ALL
SELECT 'Pages table', COUNT(*) FROM pages
UNION ALL
SELECT 'Database tables', COUNT(*) FROM database_tables;

-- Grant Super Admin role full permissions to all pages
INSERT INTO role_permissions (role_id, page_id, permission_id, granted)
SELECT 
    r.id as role_id,
    p.id as page_id,
    perm.id as permission_id,
    TRUE as granted
FROM roles r
CROSS JOIN pages p
CROSS JOIN permissions perm
WHERE r.name = 'Super Admin'
ON CONFLICT (role_id, page_id, permission_id) DO UPDATE SET granted = TRUE;

-- Grant Super Admin role full permissions to all database tables
INSERT INTO table_permissions (role_id, table_id, can_view, can_create, can_edit, can_delete, can_export, scope_filter)
SELECT 
    r.id as role_id,
    dt.id as table_id,
    TRUE as can_view,
    TRUE as can_create,
    TRUE as can_edit,
    TRUE as can_delete,
    TRUE as can_export,
    'all' as scope_filter
FROM roles r
CROSS JOIN database_tables dt
WHERE r.name = 'Super Admin'
ON CONFLICT (role_id, table_id) DO UPDATE SET 
    can_view = TRUE,
    can_create = TRUE,
    can_edit = TRUE,
    can_delete = TRUE,
    can_export = TRUE,
    scope_filter = 'all';

-- Grant Admin role most permissions (excluding some admin-only functions)
INSERT INTO role_permissions (role_id, page_id, permission_id, granted)
SELECT 
    r.id as role_id,
    p.id as page_id,
    perm.id as permission_id,
    CASE 
        WHEN p.path = '/settings' AND perm.name = 'admin' THEN FALSE
        WHEN perm.name = 'admin' THEN FALSE
        ELSE TRUE
    END as granted
FROM roles r
CROSS JOIN pages p
CROSS JOIN permissions perm
WHERE r.name = 'Admin'
ON CONFLICT (role_id, page_id, permission_id) DO UPDATE SET 
    granted = CASE 
        WHEN EXCLUDED.role_id IN (SELECT id FROM roles WHERE name = 'Admin') 
             AND EXISTS (SELECT 1 FROM pages WHERE id = EXCLUDED.page_id AND path = '/settings')
             AND EXISTS (SELECT 1 FROM permissions WHERE id = EXCLUDED.permission_id AND name = 'admin')
        THEN FALSE
        ELSE TRUE
    END;

-- Grant Viewer role read-only permissions
INSERT INTO role_permissions (role_id, page_id, permission_id, granted)
SELECT 
    r.id as role_id,
    p.id as page_id,
    perm.id as permission_id,
    TRUE as granted
FROM roles r
CROSS JOIN pages p
CROSS JOIN permissions perm
WHERE r.name = 'Viewer' AND perm.name = 'view'
ON CONFLICT (role_id, page_id, permission_id) DO UPDATE SET granted = TRUE;

-- Assign first user (if exists) Super Admin role
INSERT INTO user_roles (user_id, role_id, assigned_by, is_active)
SELECT 
    u.id as user_id,
    r.id as role_id,
    u.id as assigned_by,
    TRUE as is_active
FROM users u
CROSS JOIN roles r
WHERE r.name = 'Super Admin'
AND u.id = 1
ON CONFLICT (user_id, role_id) DO UPDATE SET is_active = TRUE;

-- Show setup summary
SELECT 
    'Setup Complete' as status,
    (SELECT COUNT(*) FROM roles) as total_roles,
    (SELECT COUNT(*) FROM permissions) as total_permissions,
    (SELECT COUNT(*) FROM pages) as total_pages,
    (SELECT COUNT(*) FROM database_tables) as total_tables,
    (SELECT COUNT(*) FROM role_permissions WHERE granted = TRUE) as granted_page_permissions,
    (SELECT COUNT(*) FROM table_permissions) as table_permissions,
    (SELECT COUNT(*) FROM user_roles WHERE is_active = TRUE) as active_user_roles;
