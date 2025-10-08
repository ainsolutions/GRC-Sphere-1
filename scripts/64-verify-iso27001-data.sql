-- Verify the inserted ISO 27001 risk data
SELECT 
    COUNT(*) as total_risks,
    COUNT(CASE WHEN risk_level = 'Critical' THEN 1 END) as critical_risks,
    COUNT(CASE WHEN risk_level = 'High' THEN 1 END) as high_risks,
    COUNT(CASE WHEN risk_level = 'Medium' THEN 1 END) as medium_risks,
    COUNT(CASE WHEN risk_level = 'Low' THEN 1 END) as low_risks
FROM iso27001_risks;

-- Show sample of inserted data
SELECT 
    risk_id,
    title,
    category,
    likelihood,
    impact,
    risk_score,
    risk_level,
    status,
    owner,
    array_length(controls, 1) as control_count,
    array_length(assets, 1) as asset_count
FROM iso27001_risks 
ORDER BY risk_score DESC, risk_id
LIMIT 10;

-- Show risk distribution by category
SELECT 
    category,
    COUNT(*) as risk_count,
    AVG(risk_score) as avg_risk_score
FROM iso27001_risks 
GROUP BY category 
ORDER BY risk_count DESC;

-- Show risk distribution by status
SELECT 
    status,
    COUNT(*) as risk_count,
    AVG(risk_score) as avg_risk_score
FROM iso27001_risks 
GROUP BY status 
ORDER BY risk_count DESC;
