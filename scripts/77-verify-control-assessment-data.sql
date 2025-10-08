-- Verify that ISO 27001 risks were inserted correctly
SELECT 
    'ISO 27001 Risks' as table_name,
    COUNT(*) as total_records,
    COUNT(CASE WHEN risk_id LIKE 'ISO-R%' THEN 1 END) as iso_risks,
    COUNT(CASE WHEN controls IS NOT NULL AND array_length(controls, 1) > 0 THEN 1 END) as risks_with_controls
FROM iso27001_risks;

-- Verify control effectiveness table exists and has data
SELECT 
    'Control Effectiveness' as table_name,
    COUNT(*) as total_records,
    COUNT(DISTINCT risk_id) as unique_risks,
    COUNT(DISTINCT control_id) as unique_controls,
    AVG(effectiveness) as avg_effectiveness
FROM iso27001_control_effectiveness;

-- Show sample of risks with their controls and effectiveness
SELECT 
    r.risk_id,
    r.title,
    r.status,
    r.risk_level,
    array_length(r.controls, 1) as control_count,
    COUNT(ce.control_id) as effectiveness_records,
    ROUND(AVG(ce.effectiveness), 2) as avg_effectiveness
FROM iso27001_risks r
LEFT JOIN iso27001_control_effectiveness ce ON r.id = ce.risk_id
WHERE r.risk_id LIKE 'ISO-R%'
GROUP BY r.id, r.risk_id, r.title, r.status, r.risk_level, r.controls
ORDER BY r.risk_id;

-- Show control effectiveness distribution
SELECT 
    effectiveness,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
FROM iso27001_control_effectiveness
GROUP BY effectiveness
ORDER BY effectiveness;

-- Show implementation status distribution
SELECT 
    implementation_status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
FROM iso27001_control_effectiveness
GROUP BY implementation_status
ORDER BY implementation_status;
