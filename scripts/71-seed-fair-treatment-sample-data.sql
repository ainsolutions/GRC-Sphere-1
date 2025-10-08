-- Insert sample FAIR risk treatment plans
INSERT INTO fair_risk_treatment_plans (
    fair_risk_id, treatment_type, treatment_strategy, business_justification, 
    cost_estimate, expected_risk_reduction, approval_status, approved_by, approved_date
) 
SELECT 
    fr.id,
    CASE 
        WHEN fr.annual_loss_expectancy > fr.risk_tolerance * 2 THEN 'mitigate'
        WHEN fr.annual_loss_expectancy > fr.risk_tolerance THEN 'mitigate'
        WHEN fr.annual_loss_expectancy > fr.risk_tolerance * 0.5 THEN 'transfer'
        ELSE 'accept'
    END as treatment_type,
    CASE 
        WHEN fr.annual_loss_expectancy > fr.risk_tolerance * 2 THEN 'Implement comprehensive security controls to significantly reduce risk exposure'
        WHEN fr.annual_loss_expectancy > fr.risk_tolerance THEN 'Deploy targeted security measures to bring risk within acceptable limits'
        WHEN fr.annual_loss_expectancy > fr.risk_tolerance * 0.5 THEN 'Transfer risk through insurance or third-party services'
        ELSE 'Accept risk as it falls within organizational tolerance levels'
    END as treatment_strategy,
    CASE 
        WHEN fr.annual_loss_expectancy > fr.risk_tolerance * 2 THEN 'Critical risk requiring immediate mitigation to prevent significant business impact'
        WHEN fr.annual_loss_expectancy > fr.risk_tolerance THEN 'High risk that exceeds tolerance and requires active management'
        WHEN fr.annual_loss_expectancy > fr.risk_tolerance * 0.5 THEN 'Moderate risk suitable for transfer to specialized providers'
        ELSE 'Low risk that can be accepted with monitoring'
    END as business_justification,
    CASE 
        WHEN fr.annual_loss_expectancy > fr.risk_tolerance * 2 THEN fr.annual_loss_expectancy * 0.3
        WHEN fr.annual_loss_expectancy > fr.risk_tolerance THEN fr.annual_loss_expectancy * 0.2
        WHEN fr.annual_loss_expectancy > fr.risk_tolerance * 0.5 THEN fr.annual_loss_expectancy * 0.1
        ELSE fr.annual_loss_expectancy * 0.05
    END as cost_estimate,
    CASE 
        WHEN fr.annual_loss_expectancy > fr.risk_tolerance * 2 THEN 75
        WHEN fr.annual_loss_expectancy > fr.risk_tolerance THEN 60
        WHEN fr.annual_loss_expectancy > fr.risk_tolerance * 0.5 THEN 40
        ELSE 20
    END as expected_risk_reduction,
    'approved' as approval_status,
    'Risk Committee' as approved_by,
    CURRENT_TIMESTAMP - INTERVAL '30 days' as approved_date
FROM fair_risks fr
WHERE NOT EXISTS (
    SELECT 1 FROM fair_risk_treatment_plans ftp WHERE ftp.fair_risk_id = fr.id
);

-- Insert sample treatment controls
INSERT INTO fair_risk_treatment_controls (
    treatment_plan_id, control_id, control_title, control_description, control_type, 
    control_category, implementation_status, assigned_to, start_date, due_date, 
    progress_percentage, effectiveness_rating, cost_actual
)
SELECT 
    ftp.id as treatment_plan_id,
    'CTRL-' || LPAD((ROW_NUMBER() OVER (ORDER BY ftp.id))::text, 3, '0') as control_id,
    CASE (ROW_NUMBER() OVER (PARTITION BY ftp.id ORDER BY ftp.id)) % 6
        WHEN 1 THEN 'Multi-Factor Authentication Implementation'
        WHEN 2 THEN 'Endpoint Detection and Response Deployment'
        WHEN 3 THEN 'Security Awareness Training Program'
        WHEN 4 THEN 'Network Segmentation Controls'
        WHEN 5 THEN 'Backup and Recovery System Enhancement'
        ELSE 'Incident Response Plan Update'
    END as control_title,
    CASE (ROW_NUMBER() OVER (PARTITION BY ftp.id ORDER BY ftp.id)) % 6
        WHEN 1 THEN 'Deploy MFA across all critical systems and user accounts to prevent unauthorized access'
        WHEN 2 THEN 'Implement advanced EDR solution to detect and respond to sophisticated threats'
        WHEN 3 THEN 'Conduct comprehensive security training to reduce human error risks'
        WHEN 4 THEN 'Implement network segmentation to limit lateral movement of threats'
        WHEN 5 THEN 'Enhance backup systems to ensure rapid recovery from incidents'
        ELSE 'Update incident response procedures to address current threat landscape'
    END as control_description,
    CASE (ROW_NUMBER() OVER (PARTITION BY ftp.id ORDER BY ftp.id)) % 4
        WHEN 1 THEN 'preventive'
        WHEN 2 THEN 'detective'
        WHEN 3 THEN 'corrective'
        ELSE 'compensating'
    END as control_type,
    CASE (ROW_NUMBER() OVER (PARTITION BY ftp.id ORDER BY ftp.id)) % 6
        WHEN 1 THEN 'Access Control'
        WHEN 2 THEN 'Threat Detection'
        WHEN 3 THEN 'Security Awareness'
        WHEN 4 THEN 'Network Security'
        WHEN 5 THEN 'Business Continuity'
        ELSE 'Incident Management'
    END as control_category,
    CASE 
        WHEN RANDOM() < 0.3 THEN 'completed'
        WHEN RANDOM() < 0.6 THEN 'in_progress'
        WHEN RANDOM() < 0.8 THEN 'not_started'
        ELSE 'on_hold'
    END as implementation_status,
    CASE (ROW_NUMBER() OVER (ORDER BY ftp.id)) % 5
        WHEN 1 THEN 'John Smith - IT Security'
        WHEN 2 THEN 'Sarah Johnson - Infrastructure'
        WHEN 3 THEN 'Mike Davis - Compliance'
        WHEN 4 THEN 'Lisa Chen - Operations'
        ELSE 'David Wilson - Risk Management'
    END as assigned_to,
    CURRENT_DATE - INTERVAL '60 days' as start_date,
    CURRENT_DATE + INTERVAL '30 days' + (RANDOM() * INTERVAL '60 days') as due_date,
    CASE 
        WHEN RANDOM() < 0.3 THEN 100
        WHEN RANDOM() < 0.6 THEN FLOOR(RANDOM() * 80 + 20)
        ELSE FLOOR(RANDOM() * 50)
    END as progress_percentage,
    FLOOR(RANDOM() * 3 + 3) as effectiveness_rating,
    ftp.cost_estimate * (0.1 + RANDOM() * 0.3) as cost_actual
FROM fair_risk_treatment_plans ftp
CROSS JOIN generate_series(1, 3) as control_num;

-- Insert sample tracking records
INSERT INTO fair_risk_treatment_tracking (
    treatment_plan_id, control_id, field_changed, old_value, new_value, 
    changed_by, change_reason, changed_at
)
SELECT 
    ftc.treatment_plan_id,
    ftc.id as control_id,
    'implementation_status' as field_changed,
    'not_started' as old_value,
    'in_progress' as new_value,
    'System Admin' as changed_by,
    'Control implementation initiated' as change_reason,
    CURRENT_TIMESTAMP - INTERVAL '30 days' + (RANDOM() * INTERVAL '25 days')
FROM fair_risk_treatment_controls ftc
WHERE ftc.implementation_status IN ('in_progress', 'completed')
LIMIT 50;

-- Insert more tracking records for completed controls
INSERT INTO fair_risk_treatment_tracking (
    treatment_plan_id, control_id, field_changed, old_value, new_value, 
    changed_by, change_reason, changed_at
)
SELECT 
    ftc.treatment_plan_id,
    ftc.id as control_id,
    'implementation_status' as field_changed,
    'in_progress' as old_value,
    'completed' as new_value,
    'System Admin' as changed_by,
    'Control implementation completed and tested' as change_reason,
    CURRENT_TIMESTAMP - INTERVAL '15 days' + (RANDOM() * INTERVAL '10 days')
FROM fair_risk_treatment_controls ftc
WHERE ftc.implementation_status = 'completed'
LIMIT 25;

-- Update aging status for all controls
UPDATE fair_risk_treatment_controls SET updated_at = CURRENT_TIMESTAMP;
