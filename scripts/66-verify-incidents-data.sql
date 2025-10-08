-- Verification script for incidents table data
-- This script checks the quality and distribution of the inserted incident data

-- Check total number of incidents
SELECT 'Total Incidents' as metric, COUNT(*) as count FROM incidents;

-- Check incident distribution by severity
SELECT 
    'Incidents by Severity' as metric,
    severity,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM incidents), 2) as percentage
FROM incidents 
GROUP BY severity 
ORDER BY 
    CASE severity 
        WHEN 'Critical' THEN 1 
        WHEN 'High' THEN 2 
        WHEN 'Medium' THEN 3 
        WHEN 'Low' THEN 4 
    END;

-- Check incident distribution by status
SELECT 
    'Incidents by Status' as metric,
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM incidents), 2) as percentage
FROM incidents 
GROUP BY status 
ORDER BY count DESC;

-- Check incident distribution by type
SELECT 
    'Incidents by Type' as metric,
    incident_type,
    COUNT(*) as count
FROM incidents 
GROUP BY incident_type 
ORDER BY count DESC;

-- Check incidents with related assets and risks
SELECT 
    'Asset/Risk Relationships' as metric,
    COUNT(CASE WHEN related_asset_id IS NOT NULL THEN 1 END) as with_assets,
    COUNT(CASE WHEN related_risk_id IS NOT NULL THEN 1 END) as with_risks,
    COUNT(CASE WHEN related_asset_id IS NOT NULL AND related_risk_id IS NOT NULL THEN 1 END) as with_both
FROM incidents;

-- Check recent incidents (last 30 days)
SELECT 
    'Recent Incidents' as metric,
    COUNT(*) as count
FROM incidents 
WHERE reported_date >= NOW() - INTERVAL '30 days';

-- Check incident assignment distribution
SELECT 
    'Top Assigned Personnel' as metric,
    assigned_to,
    COUNT(*) as incident_count
FROM incidents 
GROUP BY assigned_to 
ORDER BY incident_count DESC 
LIMIT 10;

-- Check incident reporting sources
SELECT 
    'Top Reporting Sources' as metric,
    reported_by,
    COUNT(*) as incident_count
FROM incidents 
GROUP BY reported_by 
ORDER BY incident_count DESC 
LIMIT 10;

-- Check data quality - ensure all required fields are populated
SELECT 
    'Data Quality Check' as metric,
    COUNT(CASE WHEN incident_id IS NULL OR incident_id = '' THEN 1 END) as missing_incident_id,
    COUNT(CASE WHEN incident_title IS NULL OR incident_title = '' THEN 1 END) as missing_title,
    COUNT(CASE WHEN incident_description IS NULL OR incident_description = '' THEN 1 END) as missing_description,
    COUNT(CASE WHEN reported_by IS NULL OR reported_by = '' THEN 1 END) as missing_reported_by,
    COUNT(CASE WHEN assigned_to IS NULL OR assigned_to = '' THEN 1 END) as missing_assigned_to;

-- Show sample of critical incidents
SELECT 
    'Sample Critical Incidents' as metric,
    incident_id,
    incident_title,
    severity,
    status,
    assigned_to
FROM incidents 
WHERE severity = 'Critical' 
ORDER BY reported_date DESC 
LIMIT 5;

-- Check time distribution of incidents
SELECT 
    'Incidents by Month' as metric,
    TO_CHAR(reported_date, 'YYYY-MM') as month,
    COUNT(*) as count
FROM incidents 
GROUP BY TO_CHAR(reported_date, 'YYYY-MM') 
ORDER BY month DESC;

-- Verify foreign key relationships
SELECT 
    'Foreign Key Validation' as metric,
    COUNT(CASE WHEN i.related_asset_id IS NOT NULL AND ia.id IS NULL THEN 1 END) as invalid_asset_refs,
    COUNT(CASE WHEN i.related_risk_id IS NOT NULL AND r.id IS NULL THEN 1 END) as invalid_risk_refs
FROM incidents i
LEFT JOIN information_assets ia ON i.related_asset_id = ia.id
LEFT JOIN risks r ON i.related_risk_id = r.id;
