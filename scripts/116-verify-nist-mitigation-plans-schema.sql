-- Verify the NIST CSF mitigation plans table schema
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'nist_csf_mitigation_plans'
ORDER BY ordinal_position;

-- Check constraints
SELECT 
    conname as constraint_name,
    pg_get_constraintdef(c.oid) as constraint_definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
WHERE t.relname = 'nist_csf_mitigation_plans'
AND c.contype = 'c';

-- Check current data
SELECT 
    status,
    priority,
    residual_risk_level,
    COUNT(*) as count
FROM nist_csf_mitigation_plans
GROUP BY status, priority, residual_risk_level
ORDER BY status, priority;

-- Test constraint by attempting to insert invalid data (this should fail)
-- INSERT INTO nist_csf_mitigation_plans (plan_id, plan_name, mitigation_strategy, status, assigned_owner)
-- VALUES ('TEST-001', 'Test Plan', 'Test Strategy', 'Invalid Status', 'Test Owner');
