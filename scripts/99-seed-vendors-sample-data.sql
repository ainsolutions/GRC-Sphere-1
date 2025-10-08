-- Insert sample vendor data for testing
INSERT INTO vendors (
    vendor_name, vendor_type, contact_person, contact_email, contact_phone,
    address, website, business_reg, certifications, contract_start_date,
    contract_end_date, contract_value, risk_rating, vendor_status, description
) VALUES 
-- Cloud Services Vendors
('Amazon Web Services', 'Cloud Provider', 'John Smith', 'john.smith@aws.amazon.com', '+1-206-266-1000',
 '410 Terry Ave N, Seattle, WA 98109', 'https://aws.amazon.com', 'AWS-001',
 ARRAY['SOC 2 Type II', 'ISO 27001', 'FedRAMP'], '2023-01-01', '2025-12-31',
 2500000.00, 'Low', 'Active', 'Leading cloud computing platform providing scalable infrastructure services'),

('Microsoft Corporation', 'Software Vendor', 'Sarah Johnson', 'sarah.johnson@microsoft.com', '+1-425-882-8080',
 'One Microsoft Way, Redmond, WA 98052', 'https://microsoft.com', 'MSFT-002',
 ARRAY['SOC 2 Type II', 'ISO 27001', 'HIPAA'], '2023-03-15', '2026-03-14',
 1800000.00, 'Low', 'Active', 'Enterprise software and cloud services provider'),

('Google Cloud Platform', 'Cloud Provider', 'Mike Chen', 'mike.chen@google.com', '+1-650-253-0000',
 '1600 Amphitheatre Pkwy, Mountain View, CA 94043', 'https://cloud.google.com', 'GCP-003',
 ARRAY['SOC 2 Type II', 'ISO 27001'], '2023-06-01', '2025-05-31',
 750000.00, 'Low', 'Active', 'Google cloud computing services and infrastructure'),

('Salesforce Inc', 'SaaS Provider', 'Lisa Wang', 'lisa.wang@salesforce.com', '+1-415-901-7000',
 'Salesforce Tower, San Francisco, CA 94105', 'https://salesforce.com', 'SF-021',
 ARRAY['SOC 2 Type II'], '2023-07-01', '2025-06-30',
 500000.00, 'Medium', 'Active', 'Customer relationship management and cloud applications'),

('Oracle Corporation', 'Database Vendor', 'David Brown', 'david.brown@oracle.com', '+1-650-506-7000',
 '500 Oracle Pkwy, Redwood City, CA 94065', 'https://oracle.com', 'ORCL-022',
 ARRAY['SOC 2 Type II'], '2023-08-01', '2025-07-31',
 600000.00, 'Medium', 'Active', 'Enterprise database and cloud infrastructure solutions'),

('IBM Corporation', 'Technology Vendor', 'Jennifer Davis', 'jennifer.davis@ibm.com', '+1-914-499-1900',
 '1 New Orchard Rd, Armonk, NY 10504', 'https://ibm.com', 'IBM-023',
 ARRAY['SOC 2 Type II'], '2023-09-01', '2025-08-31',
 700000.00, 'Medium', 'Active', 'Enterprise technology and consulting services'),

('Cisco Systems', 'Network Equipment', 'Robert Wilson', 'robert.wilson@cisco.com', '+1-408-526-4000',
 '170 W Tasman Dr, San Jose, CA 95134', 'https://cisco.com', 'CISCO-024',
 ARRAY['SOC 2 Type I'], '2023-10-01', '2025-09-30',
 800000.00, 'Low', 'Active', 'Networking hardware and telecommunications equipment'),

('VMware Inc', 'Virtualization', 'Amanda Taylor', 'amanda.taylor@vmware.com', '+1-650-427-5000',
 '3401 Hillview Ave, Palo Alto, CA 94304', 'https://vmware.com', 'VMW-025',
 ARRAY['SOC 2 Type II'], '2023-11-01', '2025-10-31',
 900000.00, 'Medium', 'Active', 'Virtualization and cloud computing software'),

('Dell Technologies', 'Hardware Vendor', 'Kevin Martinez', 'kevin.martinez@dell.com', '+1-512-338-4400',
 'One Dell Way, Round Rock, TX 78682', 'https://dell.com', 'DELL-026',
 ARRAY['SOC 2 Type I'], '2023-12-01', '2025-11-30',
 1000000.00, 'Low', 'Active', 'Computer hardware and enterprise solutions'),

('HP Enterprise', 'Hardware Vendor', 'Michelle Garcia', 'michelle.garcia@hpe.com', '+1-650-687-5817',
 '3000 Hanover St, Palo Alto, CA 94304', 'https://hpe.com', 'HPE-027',
 ARRAY['SOC 2 Type I'], '2024-01-01', '2026-01-31',
 1100000.00, 'Low', 'Active', 'Enterprise hardware and infrastructure solutions'),

-- Data Processing Vendors
('Snowflake Inc.', 'Data Processing', 'Emily Rodriguez', 'emily.rodriguez@snowflake.com', '+1-844-766-9355',
 '106 E 15th St, San Mateo, CA 94402', 'https://snowflake.com', 'SNOW-004',
 ARRAY['SOC 2 Type II', 'HIPAA', 'PCI DSS'], '2023-02-01', '2025-01-31',
 450000.00, 'Medium', 'Active', 'Data warehouse and analytics platform'),

('Databricks', 'Data Processing', 'David Park', 'david.park@databricks.com', '+1-866-330-0121',
 '160 Spear St, San Francisco, CA 94105', 'https://databricks.com', 'DB-005',
 ARRAY['SOC 2 Type II', 'ISO 27001'], '2023-04-01', '2025-03-31',
 320000.00, 'Medium', 'Active', 'Unified analytics platform for big data and ML'),

('DataBreach Analytics', 'Data Processing', 'Susan Miller', 'susan.miller@databreach.com', '+1-555-666-7777',
 '789 Risk Avenue, Las Vegas, NV 89101', 'https://databreach.com', 'DBA-019',
 ARRAY[], '2023-09-01', '2024-08-31',
 150000.00, 'Critical', 'Suspended', 'Vendor suspended due to security incident'),

('DataFlow Analytics', 'Analytics Provider', 'Emma Thompson', 'emma.thompson@dataflow.com', '+1-555-987-6543',
 '456 Analytics Ave, Boston, MA 02101', 'https://dataflow.com', 'DFA-028',
 ARRAY['SOC 2 Type II'], '2023-05-01', '2025-04-30',
 200000.00, 'Medium', 'Active', 'Business intelligence and data analytics platform'),

-- Telecommunications Vendors
('Verizon Business', 'Telecommunications', 'Lisa Thompson', 'lisa.thompson@verizon.com', '+1-800-922-0204',
 '1095 Avenue of the Americas, New York, NY 10036', 'https://verizon.com/business', 'VZ-006',
 ARRAY['SOC 2 Type I'], '2023-01-15', '2025-01-14',
 180000.00, 'Low', 'Active', 'Primary telecommunications and internet services'),

('AT&T Business', 'Telecommunications', 'Robert Wilson', 'robert.wilson@att.com', '+1-800-331-0500',
 '208 S Akard St, Dallas, TX 75202', 'https://business.att.com', 'ATT-007',
 ARRAY['SOC 2 Type I'], '2023-05-01', '2025-04-30',
 95000.00, 'Low', 'Active', 'Backup telecommunications services'),

-- Payment Processing Vendors
('Stripe Inc.', 'Payment Processing', 'Amanda Foster', 'amanda.foster@stripe.com', '+1-888-926-2289',
 '354 Oyster Point Blvd, South San Francisco, CA 94080', 'https://stripe.com', 'STRIPE-008',
 ARRAY['PCI DSS Level 1', 'SOC 2 Type II'], '2023-03-01', '2025-02-28',
 125000.00, 'High', 'Active', 'Primary payment processing platform'),

('PayPal Holdings', 'Payment Processing', 'James Martinez', 'james.martinez@paypal.com', '+1-888-221-1161',
 '2211 North First Street, San Jose, CA 95131', 'https://paypal.com', 'PP-009',
 ARRAY['PCI DSS Level 1', 'SOC 2 Type II'], '2023-07-01', '2025-06-30',
 85000.00, 'High', 'Active', 'Alternative payment processing solution'),

-- IT Support Vendors
('ServiceNow Inc.', 'IT Support', 'Jennifer Lee', 'jennifer.lee@servicenow.com', '+1-408-501-8550',
 '2225 Lawson Lane, Santa Clara, CA 95054', 'https://servicenow.com', 'NOW-010',
 ARRAY['SOC 2 Type II', 'ISO 27001'], '2023-01-01', '2024-12-31',
 275000.00, 'Medium', 'Active', 'IT service management platform'),

('Atlassian Corporation', 'IT Support', 'Kevin Brown', 'kevin.brown@atlassian.com', '+1-415-701-1111',
 '350 Bush Street, San Francisco, CA 94104', 'https://atlassian.com', 'ATLS-011',
 ARRAY['SOC 2 Type II'], '2023-02-15', '2025-02-14',
 65000.00, 'Low', 'Active', 'Project management and collaboration tools'),

('TechStart Solutions', 'IT Support', 'Alex Johnson', 'alex.johnson@techstart.com', '+1-555-123-4567',
 '123 Innovation Drive, Austin, TX 78701', 'https://techstart.com', 'TS-017',
 ARRAY['SOC 2 Type I'], '2023-08-01', '2024-07-31',
 75000.00, 'High', 'Under Review', 'New IT support vendor under evaluation'),

('Legacy Systems Inc', 'Legacy Support', 'Patricia Davis', 'patricia.davis@legacysys.com', '+1-555-369-1470',
 '369 Legacy Blvd, Detroit, MI 48201', 'https://legacysystems.com', 'LSI-029',
 ARRAY['SOC 2 Type II'], '2023-09-01', '2025-08-31',
 250000.00, 'High', 'Active', 'Maintenance and support for legacy enterprise systems'),

('TechSupport Plus', 'Support Services', 'Laura Wilson', 'laura.wilson@techsupport.com', '+1-555-789-0123',
 '987 Support Ave, Chicago, IL 60601', 'https://techsupportplus.com', 'TSP-030',
 ARRAY['SOC 2 Type II'], '2023-10-01', '2025-09-30',
 350000.00, 'Low', 'Active', '24/7 technical support and help desk services'),

-- Cybersecurity Vendors
('CrowdStrike Holdings', 'Cybersecurity', 'Rachel Green', 'rachel.green@crowdstrike.com', '+1-888-512-8906',
 '150 Mathilda Place, Sunnyvale, CA 94086', 'https://crowdstrike.com', 'CRWD-012',
 ARRAY['SOC 2 Type II', 'ISO 27001'], '2023-04-01', '2025-03-31',
 195000.00, 'Critical', 'Active', 'Endpoint detection and response platform'),

('Palo Alto Networks', 'Cybersecurity', 'Thomas Anderson', 'thomas.anderson@paloaltonetworks.com', '+1-408-753-4000',
 '3000 Tannery Way, Santa Clara, CA 95054', 'https://paloaltonetworks.com', 'PAN-013',
 ARRAY['SOC 2 Type II', 'Common Criteria'], '2023-06-01', '2025-05-31',
 340000.00, 'Critical', 'Active', 'Next-generation firewall and security platform'),

('Acme Security Solutions', 'Security Vendor', 'Tom Anderson', 'tom.anderson@acmesec.com', '+1-555-123-4567',
 '123 Security Blvd, Austin, TX 78701', 'https://acmesecurity.com', 'ACS-031',
 ARRAY['SOC 2 Type II'], '2023-01-01', '2024-12-31',
 150000.00, 'High', 'Active', 'Cybersecurity consulting and managed security services'),

('SecureNet Technologies', 'Network Security', 'Rachel Green', 'rachel.green@securenet.com', '+1-555-321-0987',
 '321 Firewall Rd, Phoenix, AZ 85001', 'https://securenet.com', 'SNT-032',
 ARRAY['SOC 2 Type II'], '2023-03-01', '2025-02-28',
 200000.00, 'High', 'Active', 'Network security appliances and monitoring solutions'),

-- Logistics Vendors
('FedEx Corporation', 'Logistics', 'Maria Garcia', 'maria.garcia@fedex.com', '+1-800-463-3339',
 '942 South Shady Grove Road, Memphis, TN 38120', 'https://fedex.com', 'FDX-014',
 ARRAY['ISO 9001'], '2023-01-01', '2024-12-31',
 450000.00, 'Low', 'Active', 'Primary shipping and logistics services'),

('UPS Inc.', 'Logistics', 'Christopher Davis', 'christopher.davis@ups.com', '+1-800-742-5877',
 '55 Glenlake Parkway NE, Atlanta, GA 30328', 'https://ups.com', 'UPS-015',
 ARRAY['ISO 9001'], '2023-03-01', '2025-02-28',
 320000.00, 'Low', 'Active', 'Secondary shipping services'),

('Global Backup Services', 'Backup Provider', 'Mark Johnson', 'mark.johnson@globalbackup.com', '+1-555-654-3210',
 '654 Backup Ln, Miami, FL 33101', 'https://globalbackup.com', 'GBS-033',
 ARRAY['SOC 2 Type II'], '2023-05-01', '2025-04-30',
 250000.00, 'Medium', 'Active', 'Enterprise data backup and disaster recovery services'),

-- Real Estate Vendors
('CBRE Group Inc.', 'Real Estate', 'Nicole White', 'nicole.white@cbre.com', '+1-213-613-3333',
 '200 Park Ave, New York, NY 10166', 'https://cbre.com', 'CBRE-016',
 ARRAY['ISO 9001'], '2023-01-01', '2025-12-31',
 850000.00, 'Low', 'Active', 'Commercial real estate services'),

-- Inactive Vendors
('Legacy Systems Corp', 'IT Support', 'Mark Thompson', 'mark.thompson@legacysys.com', '+1-555-987-6543',
 '456 Old Tech Blvd, Detroit, MI 48201', 'https://legacysys.com', 'LSC-018',
 ARRAY[], '2022-01-01', '2023-12-31',
 25000.00, 'Medium', 'Inactive', 'Legacy system maintenance - contract ended'),

('StartupTech Solutions', 'Emerging Vendor', 'Alex Kim', 'alex.kim@startuptech.com', '+1-555-258-1470',
 '258 Startup St, San Francisco, CA 94102', 'https://startuptech.com', 'STS-034',
 ARRAY['SOC 2 Type I'], '2023-06-01', '2025-05-31',
 100000.00, 'High', 'Under Review', 'Innovative technology solutions from emerging startup'),

-- Compliance Vendors
('Compliance Experts LLC', 'Compliance Consultant', 'Maria Gonzalez', 'maria.gonzalez@complianceexperts.com', '+1-555-741-9630',
 '741 Compliance Way, Washington, DC 20001', 'https://complianceexperts.com', 'CE-035',
 ARRAY['SOC 2 Type II'], '2023-07-01', '2025-06-30',
 120000.00, 'Low', 'Active', 'Regulatory compliance consulting and audit services');
