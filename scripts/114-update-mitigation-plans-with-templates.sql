-- Update existing mitigation plans with template relationships
-- This script links existing mitigation plans to appropriate NIST CSF risk templates

-- First, let's see what templates we have available
DO $$
DECLARE
    template_count INTEGER;
    plan_count INTEGER;
BEGIN
    -- Count available templates
    SELECT COUNT(*) INTO template_count FROM nist_csf_risk_templates WHERE is_active = true;
    
    -- Count existing plans without templates
    SELECT COUNT(*) INTO plan_count FROM nist_csf_mitigation_plans WHERE template_id IS NULL;
    
    RAISE NOTICE 'Found % active risk templates and % mitigation plans without templates', template_count, plan_count;
    
    -- Only proceed if we have both templates and plans to update
    IF template_count > 0 AND plan_count > 0 THEN
        -- Update existing mitigation plans with random template assignments for demo purposes
        -- In a real scenario, this would be done based on business logic or manual assignment
        
        WITH random_templates AS (
            SELECT 
                mp.id as plan_id,
                rt.id as template_id,
                ROW_NUMBER() OVER (PARTITION BY mp.id ORDER BY RANDOM()) as rn
            FROM nist_csf_mitigation_plans mp
            CROSS JOIN nist_csf_risk_templates rt
            WHERE mp.template_id IS NULL 
            AND rt.is_active = true
        )
        UPDATE nist_csf_mitigation_plans 
        SET template_id = rt.template_id
        FROM random_templates rt
        WHERE nist_csf_mitigation_plans.id = rt.plan_id 
        AND rt.rn = 1;
        
        -- Get count of updated records
        GET DIAGNOSTICS plan_count = ROW_COUNT;
        RAISE NOTICE 'Updated % mitigation plans with template relationships', plan_count;
        
    ELSE
        RAISE NOTICE 'Skipping template assignment - insufficient data available';
    END IF;
END $$;

-- Insert some sample mitigation plans with template relationships if the table is empty
INSERT INTO nist_csf_mitigation_plans (
    plan_id, 
    plan_name, 
    template_id, 
    mitigation_strategy, 
    status, 
    progress_percentage, 
    action_owner, 
    due_date, 
    investment_amount, 
    residual_risk_level, 
    priority, 
    notes
)
SELECT 
    'NIST-MIT-' || LPAD((ROW_NUMBER() OVER())::TEXT, 4, '0'),
    'Mitigation Plan for ' || rt.template_name,
    rt.id,
    'Implement comprehensive controls to address ' || rt.template_name || ' risks through systematic approach including policy development, technical controls, and staff training.',
    CASE (RANDOM() * 4)::INT
        WHEN 0 THEN 'Planning'
        WHEN 1 THEN 'In Progress'
        WHEN 2 THEN 'Completed'
        ELSE 'On Hold'
    END,
    (RANDOM() * 100)::INT,
    CASE (RANDOM() * 5)::INT
        WHEN 0 THEN 'John Smith'
        WHEN 1 THEN 'Sarah Johnson'
        WHEN 2 THEN 'Mike Davis'
        WHEN 3 THEN 'Lisa Chen'
        ELSE 'David Wilson'
    END,
    CURRENT_DATE + (RANDOM() * 365)::INT,
    (RANDOM() * 100000 + 5000)::DECIMAL(15,2),
    CASE (RANDOM() * 4)::INT
        WHEN 0 THEN 'Low'
        WHEN 1 THEN 'Medium'
        WHEN 2 THEN 'High'
        ELSE 'Critical'
    END,
    CASE (RANDOM() * 4)::INT
        WHEN 0 THEN 'Low'
        WHEN 1 THEN 'Medium'
        WHEN 2 THEN 'High'
        ELSE 'Critical'
    END,
    'Sample mitigation plan created for demonstration purposes. This plan addresses the specific risks identified in the associated risk template.'
FROM nist_csf_risk_templates rt
WHERE rt.is_active = true
AND NOT EXISTS (SELECT 1 FROM nist_csf_mitigation_plans WHERE template_id = rt.id)
LIMIT 20;

-- Verify the results
DO $$
DECLARE
    total_plans INTEGER;
    plans_with_templates INTEGER;
    plans_without_templates INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_plans FROM nist_csf_mitigation_plans;
    SELECT COUNT(*) INTO plans_with_templates FROM nist_csf_mitigation_plans WHERE template_id IS NOT NULL;
    SELECT COUNT(*) INTO plans_without_templates FROM nist_csf_mitigation_plans WHERE template_id IS NULL;
    
    RAISE NOTICE 'Migration Summary:';
    RAISE NOTICE '- Total mitigation plans: %', total_plans;
    RAISE NOTICE '- Plans with templates: %', plans_with_templates;
    RAISE NOTICE '- Plans without templates: %', plans_without_templates;
END $$;
