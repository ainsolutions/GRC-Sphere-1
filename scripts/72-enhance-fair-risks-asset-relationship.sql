-- Enhance FAIR risks table to ensure proper asset relationships for heat map analysis

-- Add asset_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'fair_risks' AND column_name = 'asset_id') THEN
        ALTER TABLE fair_risks ADD COLUMN asset_id INTEGER;
    END IF;
END $$;

-- Add foreign key constraint to assets table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                   WHERE constraint_name = 'fk_fair_risks_asset_id') THEN
        ALTER TABLE fair_risks 
        ADD CONSTRAINT fk_fair_risks_asset_id 
        FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create index for better performance on asset_id lookups
CREATE INDEX IF NOT EXISTS idx_fair_risks_asset_id ON fair_risks(asset_id);
CREATE INDEX IF NOT EXISTS idx_fair_risks_original_ale ON fair_risks(original_ale);
CREATE INDEX IF NOT EXISTS idx_fair_risks_created_at ON fair_risks(created_at);

-- Update existing fair_risks records to link with assets based on title matching
-- This is a best-effort approach to link existing risks with assets
UPDATE fair_risks 
SET asset_id = (
    SELECT a.id 
    FROM assets a 
    WHERE LOWER(fair_risks.title) LIKE '%' || LOWER(a.name) || '%'
    OR LOWER(a.name) LIKE '%' || LOWER(fair_risks.title) || '%'
    LIMIT 1
)
WHERE asset_id IS NULL;

-- For risks that couldn't be matched, create generic assets based on risk categories
INSERT INTO assets (name, category, type, criticality, owner, location, description, created_at, updated_at)
SELECT DISTINCT
    'Generic ' || 
    CASE 
        WHEN fr.title ILIKE '%server%' OR fr.title ILIKE '%database%' THEN 'Server Asset'
        WHEN fr.title ILIKE '%network%' OR fr.title ILIKE '%firewall%' THEN 'Network Asset'
        WHEN fr.title ILIKE '%application%' OR fr.title ILIKE '%software%' THEN 'Application Asset'
        WHEN fr.title ILIKE '%data%' OR fr.title ILIKE '%information%' THEN 'Data Asset'
        WHEN fr.title ILIKE '%endpoint%' OR fr.title ILIKE '%workstation%' THEN 'Endpoint Asset'
        ELSE 'IT Asset'
    END as name,
    CASE 
        WHEN fr.title ILIKE '%server%' OR fr.title ILIKE '%database%' THEN 'Infrastructure'
        WHEN fr.title ILIKE '%network%' OR fr.title ILIKE '%firewall%' THEN 'Network'
        WHEN fr.title ILIKE '%application%' OR fr.title ILIKE '%software%' THEN 'Application'
        WHEN fr.title ILIKE '%data%' OR fr.title ILIKE '%information%' THEN 'Data'
        WHEN fr.title ILIKE '%endpoint%' OR fr.title ILIKE '%workstation%' THEN 'Endpoint'
        ELSE 'Other'
    END as category,
    'IT Asset' as type,
    CASE 
        WHEN fr.original_ale >= 1000000 THEN 'Critical'
        WHEN fr.original_ale >= 500000 THEN 'High'
        WHEN fr.original_ale >= 100000 THEN 'Medium'
        ELSE 'Low'
    END as criticality,
    'System Administrator' as owner,
    'Data Center' as location,
    'Auto-generated asset for FAIR risk analysis' as description,
    NOW() as created_at,
    NOW() as updated_at
FROM fair_risks fr
WHERE fr.asset_id IS NULL
  AND NOT EXISTS (
    SELECT 1 FROM assets a 
    WHERE a.name = 'Generic ' || 
    CASE 
        WHEN fr.title ILIKE '%server%' OR fr.title ILIKE '%database%' THEN 'Server Asset'
        WHEN fr.title ILIKE '%network%' OR fr.title ILIKE '%firewall%' THEN 'Network Asset'
        WHEN fr.title ILIKE '%application%' OR fr.title ILIKE '%software%' THEN 'Application Asset'
        WHEN fr.title ILIKE '%data%' OR fr.title ILIKE '%information%' THEN 'Data Asset'
        WHEN fr.title ILIKE '%endpoint%' OR fr.title ILIKE '%workstation%' THEN 'Endpoint Asset'
        ELSE 'IT Asset'
    END
  );

-- Update fair_risks records to link with the newly created generic assets
UPDATE fair_risks 
SET asset_id = (
    SELECT a.id 
    FROM assets a 
    WHERE a.name = 'Generic ' || 
    CASE 
        WHEN fair_risks.title ILIKE '%server%' OR fair_risks.title ILIKE '%database%' THEN 'Server Asset'
        WHEN fair_risks.title ILIKE '%network%' OR fair_risks.title ILIKE '%firewall%' THEN 'Network Asset'
        WHEN fair_risks.title ILIKE '%application%' OR fair_risks.title ILIKE '%software%' THEN 'Application Asset'
        WHEN fair_risks.title ILIKE '%data%' OR fair_risks.title ILIKE '%information%' THEN 'Data Asset'
        WHEN fair_risks.title ILIKE '%endpoint%' OR fair_risks.title ILIKE '%workstation%' THEN 'Endpoint Asset'
        ELSE 'IT Asset'
    END
    LIMIT 1
)
WHERE asset_id IS NULL;

-- Ensure all assets have proper categories for heat map analysis
UPDATE assets 
SET category = CASE 
    WHEN category IS NULL OR category = '' THEN
        CASE 
            WHEN type ILIKE '%server%' OR name ILIKE '%server%' THEN 'Infrastructure'
            WHEN type ILIKE '%network%' OR name ILIKE '%network%' THEN 'Network'
            WHEN type ILIKE '%application%' OR name ILIKE '%application%' THEN 'Application'
            WHEN type ILIKE '%data%' OR name ILIKE '%data%' THEN 'Data'
            WHEN type ILIKE '%endpoint%' OR name ILIKE '%endpoint%' THEN 'Endpoint'
            ELSE 'Other'
        END
    ELSE category
END
WHERE category IS NULL OR category = '';

-- Create a view for heat map analysis
CREATE OR REPLACE VIEW fair_risk_heatmap_view AS
SELECT 
    fr.id as risk_id,
    fr.risk_id as risk_identifier,
    fr.title,
    fr.original_ale,
    fr.projected_ale,
    a.id as asset_id,
    a.name as asset_name,
    a.category as asset_category,
    a.type as asset_type,
    a.criticality as asset_criticality,
    CASE 
        WHEN fr.original_ale >= 1000000 THEN 'Critical'
        WHEN fr.original_ale >= 500000 THEN 'High'
        WHEN fr.original_ale >= 100000 THEN 'Medium'
        ELSE 'Low'
    END as risk_level,
    CASE 
        WHEN EXISTS (SELECT 1 FROM risk_treatment_plans rtp WHERE rtp.risk_id = fr.id) THEN true
        ELSE false
    END as has_treatment,
    fr.created_at,
    fr.updated_at
FROM fair_risks fr
LEFT JOIN assets a ON fr.asset_id = a.id;

-- Add some sample data if tables are empty
INSERT INTO assets (name, category, type, criticality, owner, location, description, created_at, updated_at)
SELECT * FROM (VALUES
    ('Primary Database Server', 'Infrastructure', 'Database Server', 'Critical', 'DBA Team', 'Data Center A', 'Main production database server', NOW(), NOW()),
    ('Web Application Server', 'Infrastructure', 'Web Server', 'High', 'DevOps Team', 'Data Center A', 'Primary web application server', NOW(), NOW()),
    ('Firewall Appliance', 'Network', 'Security Device', 'Critical', 'Network Team', 'Data Center A', 'Main network firewall', NOW(), NOW()),
    ('Customer Portal', 'Application', 'Web Application', 'High', 'Development Team', 'Cloud', 'Customer-facing web portal', NOW(), NOW()),
    ('Employee Workstations', 'Endpoint', 'Desktop Computer', 'Medium', 'IT Support', 'Office Building', 'Standard employee workstations', NOW(), NOW()),
    ('Customer Data Repository', 'Data', 'Data Store', 'Critical', 'Data Team', 'Data Center A', 'Primary customer data storage', NOW(), NOW()),
    ('Email Server', 'Infrastructure', 'Mail Server', 'High', 'IT Operations', 'Data Center B', 'Corporate email server', NOW(), NOW()),
    ('Mobile Application', 'Application', 'Mobile App', 'Medium', 'Mobile Team', 'Cloud', 'Customer mobile application', NOW(), NOW())
) AS v(name, category, type, criticality, owner, location, description, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM assets WHERE name = v.name);

-- Update statistics for better query performance
ANALYZE fair_risks;
ANALYZE assets;
ANALYZE risk_treatment_plans;
ANALYZE risk_treatment_controls;

-- Create summary statistics table for faster dashboard queries
CREATE TABLE IF NOT EXISTS fair_risk_dashboard_stats (
    id SERIAL PRIMARY KEY,
    stat_date DATE DEFAULT CURRENT_DATE,
    total_risks INTEGER,
    total_ale_before DECIMAL(15,2),
    total_ale_after DECIMAL(15,2),
    risks_above_tolerance INTEGER,
    treated_risks INTEGER,
    avg_risk_reduction DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert initial dashboard statistics
INSERT INTO fair_risk_dashboard_stats (
    stat_date, total_risks, total_ale_before, total_ale_after, 
    risks_above_tolerance, treated_risks, avg_risk_reduction
)
SELECT 
    CURRENT_DATE,
    COUNT(*) as total_risks,
    SUM(fr.original_ale) as total_ale_before,
    SUM(fr.projected_ale) as total_ale_after,
    COUNT(CASE WHEN fr.original_ale > 500000 THEN 1 END) as risks_above_tolerance,
    COUNT(CASE WHEN EXISTS (SELECT 1 FROM risk_treatment_plans rtp WHERE rtp.risk_id = fr.id) THEN 1 END) as treated_risks,
    AVG(CASE WHEN rtp.expected_risk_reduction IS NOT NULL THEN rtp.expected_risk_reduction ELSE 0 END) as avg_risk_reduction
FROM fair_risks fr
LEFT JOIN risk_treatment_plans rtp ON fr.id = rtp.risk_id
WHERE NOT EXISTS (SELECT 1 FROM fair_risk_dashboard_stats WHERE stat_date = CURRENT_DATE);

COMMIT;
