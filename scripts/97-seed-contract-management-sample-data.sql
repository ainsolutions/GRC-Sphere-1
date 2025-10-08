-- Insert sample contract data
INSERT INTO contracts (
    contract_name, vendor_id, vendor_name, contract_type, contract_status,
    start_date, end_date, renewal_date, contract_value, currency,
    payment_terms, billing_frequency, risk_rating, compliance_requirements,
    sla_requirements, contract_owner, business_unit, description, tags,
    is_critical, auto_renewal, renewal_notice_period, created_by
) VALUES 
(
    'AWS Cloud Services Agreement',
    1, 'Amazon Web Services', 'Service Agreement', 'Active',
    '2024-01-01', '2024-12-31', '2024-11-01', 120000.00, 'USD',
    'Monthly billing, Net 30 days', 'Monthly', 'High',
    ARRAY['SOC 2 Type II', 'ISO 27001', 'GDPR compliance required'],
    'Uptime SLA: 99.9%, Response time: 4 hours for critical issues',
    'John Smith', 'IT Operations', 
    'Comprehensive cloud infrastructure services including compute, storage, and networking',
    ARRAY['cloud', 'infrastructure', 'critical'],
    true, true, 60, 'admin'
),
(
    'Microsoft Office 365 License',
    2, 'Microsoft Corporation', 'Software License', 'Active',
    '2024-01-15', '2025-01-14', '2025-01-15', 45000.00, 'USD',
    'Annual payment, Net 15 days', 'Annually', 'Medium',
    ARRAY['Data residency requirements', 'HIPAA compliance'],
    'Service availability: 99.9%, Support response: 1 business day',
    'Sarah Johnson', 'IT Department',
    'Enterprise productivity suite with email, collaboration tools, and cloud storage',
    ARRAY['software', 'productivity', 'license'],
    false, true, 30, 'admin'
),
(
    'Cybersecurity Consulting Services',
    3, 'CyberSec Solutions', 'Consulting Agreement', 'Active',
    '2024-02-01', '2024-07-31', NULL, 75000.00, 'USD',
    'Monthly invoicing, Net 30 days', 'Monthly', 'Critical',
    ARRAY['Security clearance required', 'NDA in place'],
    'Deliverables within agreed timelines, Weekly status reports',
    'Mike Davis', 'Security Team',
    'Comprehensive security assessment and implementation of security controls',
    ARRAY['security', 'consulting', 'controls'],
    true, false, 45, 'admin'
),
(
    'Data Center Hosting Agreement',
    4, 'DataCenter Pro', 'Service Agreement', 'Active',
    '2024-01-01', '2026-12-31', '2026-11-01', 180000.00, 'USD',
    'Quarterly billing, Net 45 days', 'Quarterly', 'High',
    ARRAY['Physical security requirements', 'Environmental controls'],
    'Power uptime: 99.99%, Network uptime: 99.9%, 24/7 support',
    'Lisa Chen', 'Operations',
    'Colocation services with redundant power, cooling, and network connectivity',
    ARRAY['data center', 'hosting', 'colocation'],
    true, true, 60, 'admin'
),
(
    'Software Development Services',
    5, 'DevCorp Technologies', 'Service Agreement', 'Active',
    '2024-03-01', '2024-12-31', NULL, 95000.00, 'USD',
    'Bi-weekly invoicing, Net 30 days', 'Monthly', 'Medium',
    ARRAY['Intellectual property agreements', 'Code review requirements'],
    'Code delivery milestones, Quality assurance standards',
    'Emma Wilson', 'Development',
    'Custom software development for internal business applications',
    ARRAY['software', 'development', 'custom'],
    false, false, 30, 'admin'
),
(
    'Office Supplies Contract',
    4, 'Global Office Solutions', 'Supply Agreement', 'Active',
    '2024-01-15', '2024-12-31', '2024-11-15', 25000.00, 'USD',
    'Net 30 days', 'Quarterly', 'Low',
    ARRAY['Environmental Standards'],
    'Next day delivery for standard orders',
    'David Brown', 'Facilities',
    'Complete facilities management including maintenance and cleaning',
    ARRAY['facilities', 'maintenance', 'cleaning'],
    false, true, 45, 'admin'
),
(
    'Marketing Services Agreement',
    5, 'Creative Marketing Hub', 'Service Agreement', 'Active',
    '2024-04-01', '2025-03-31', '2025-02-01', 180000.00, 'USD',
    'Net 30 days', 'Monthly', 'Medium',
    ARRAY['Brand Guidelines', 'Content Standards'],
    'Monthly campaign reports, quarterly strategy reviews',
    'Robert Taylor', 'Legal Department',
    'General legal counsel and contract review services',
    ARRAY['legal', 'counsel', 'retainer'],
    true, true, 90, 'admin'
),
(
    'Telecommunications Services',
    8, 'ConnectTech Communications', 'Service Agreement', 'Active',
    '2024-01-15', '2025-01-14', '2024-12-15', 45000.00, 'USD',
    'Net 30 days', 'Monthly', 'High',
    ARRAY['Service Level Agreement', 'Data Security'],
    '99.5% uptime, 2-hour response for outages',
    'Jennifer Garcia', 'IT Operations',
    'Voice and data telecommunications services',
    ARRAY['telecom', 'voice', 'data'],
    true, true, 30, 'admin'
),
(
    'Training and Development Services',
    9, 'SkillBuilder Academy', 'Training Agreement', 'Active',
    '2024-03-15', '2024-09-15', NULL, 35000.00, 'USD',
    'Net 30 days', 'Quarterly', 'Low',
    ARRAY['Training Standards', 'Certification Requirements'],
    'Monthly progress reports, certification tracking',
    'Amanda Martinez', 'Human Resources',
    'Employee training and professional development programs',
    ARRAY['training', 'development', 'certification'],
    false, false, 30, 'admin'
),
(
    'Insurance Coverage Agreement',
    10, 'Reliable Insurance Group', 'Insurance Policy', 'Active',
    '2024-01-01', '2024-12-31', '2024-11-01', 85000.00, 'USD',
    'Annual premium', 'Annually', 'Critical',
    ARRAY['Regulatory Compliance', 'Coverage Standards'],
    '24/7 claims support, 48-hour claim processing',
    'Kevin Rodriguez', 'Risk Management',
    'Comprehensive business insurance coverage',
    ARRAY['insurance', 'coverage', 'risk'],
    true, true, 60, 'admin'
);

-- Insert sample contract amendments
INSERT INTO contract_amendments (
    contract_id, amendment_number, amendment_date, amendment_type,
    description, old_value, new_value, financial_impact,
    approval_status, approved_by, approved_date, created_by
) VALUES 
(1, 'AMD-001', '2024-06-15', 'Scope Change', 
 'Added additional storage capacity', '10TB storage', '20TB storage', 
 15000.00, 'Approved', 'John Smith', '2024-06-16', 'admin'),
(2, 'AMD-001', '2024-05-01', 'Price Adjustment', 
 'Annual price increase per contract terms', '$75,000', '$78,750', 
 3750.00, 'Approved', 'Sarah Johnson', '2024-05-02', 'admin'),
(3, 'AMD-001', '2024-07-01', 'Term Extension', 
 'Extended contract by 3 months', '2024-08-31', '2024-11-30', 
 30000.00, 'Approved', 'Mike Davis', '2024-07-02', 'admin');

-- Insert sample contract renewals
INSERT INTO contract_renewals (
    contract_id, renewal_date, new_end_date, renewal_value,
    renewal_terms, approval_status, approved_by, approved_date, created_by
) VALUES 
(4, '2024-12-31', '2025-12-31', 27500.00,
 'Renewed with 10% increase and improved delivery terms',
 'Approved', 'Lisa Chen', '2024-11-15', 'admin'),
(6, '2024-12-31', '2025-12-31', 66000.00,
 'Renewed with expanded scope and 10% rate increase',
 'Pending', NULL, NULL, 'admin');

-- Insert sample contract notifications
INSERT INTO contract_notifications (
    contract_id, notification_type, notification_date, message,
    is_sent, sent_date, recipient_email
) VALUES 
(1, 'Renewal Reminder', '2024-09-01', 
 'Contract renewal due in 60 days', true, '2024-09-01 09:00:00', 'john.smith@company.com'),
(2, 'Expiration Warning', '2025-01-15', 
 'Contract expires in 30 days', false, NULL, 'sarah.johnson@company.com'),
(3, 'Amendment Approved', '2024-07-02', 
 'Contract amendment AMD-001 has been approved', true, '2024-07-02 14:30:00', 'mike.davis@company.com');
