-- Check the schema of nist_csf_risk_templates table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'nist_csf_risk_templates' 
ORDER BY ordinal_position;

-- Check if table exists and get row count
SELECT 
    COUNT(*) as total_templates,
    COUNT(CASE WHEN nist_function = 'Govern' THEN 1 END) as govern_count,
    COUNT(CASE WHEN nist_function = 'Identify' THEN 1 END) as identify_count,
    COUNT(CASE WHEN nist_function = 'Protect' THEN 1 END) as protect_count,
    COUNT(CASE WHEN nist_function = 'Detect' THEN 1 END) as detect_count,
    COUNT(CASE WHEN nist_function = 'Respond' THEN 1 END) as respond_count,
    COUNT(CASE WHEN nist_function = 'Recover' THEN 1 END) as recover_count
FROM nist_csf_risk_templates;

-- Show existing templates if any
SELECT 
    template_id,
    template_name,
    nist_function,
    nist_category,
    risk_level
FROM nist_csf_risk_templates 
ORDER BY nist_function, template_id
LIMIT 10;
