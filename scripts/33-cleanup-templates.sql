-- Clean up ISO 27001 templates related tables and data
-- This script removes all template-related database objects

-- Drop template-related tables if they exist
DROP TABLE IF EXISTS iso27001_template_scenarios CASCADE;
DROP TABLE IF EXISTS iso27001_template_controls CASCADE;
DROP TABLE IF EXISTS iso27001_risk_templates CASCADE;
DROP TABLE IF EXISTS iso27001_risk_categories CASCADE;

-- Remove any references to templates in other tables
-- Update risks table to remove template references if they exist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'risks' AND column_name = 'created_from_template_id') THEN
        ALTER TABLE risks DROP COLUMN created_from_template_id;
    END IF;
END $$;

-- Clean up any template-related audit logs
DELETE FROM audit_logs WHERE entity_type IN ('ISO27001_TEMPLATE', 'TEMPLATE');

-- Clean up any template-related workflow data
DELETE FROM risk_assessment_workflows WHERE methodology LIKE '%template%';

COMMIT;
