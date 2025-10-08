-- Insert vendor types
INSERT INTO vendor_types (name, description, color, icon) VALUES
('Cloud Service Provider', 'Cloud infrastructure and SaaS providers', '#3B82F6', 'Cloud'),
('Financial Services', 'Banks, payment processors, and financial institutions', '#10B981', 'DollarSign'),
('Healthcare Provider', 'Healthcare organizations and medical service providers', '#EF4444', 'Heart'),
('IT Services', 'Technology consulting and managed services', '#8B5CF6', 'Monitor'),
('Legal Services', 'Law firms and legal service providers', '#F59E0B', 'Scale'),
('Marketing Agency', 'Digital marketing and advertising agencies', '#EC4899', 'Megaphone'),
('Logistics Provider', 'Shipping, warehousing, and supply chain services', '#06B6D4', 'Truck'),
('Manufacturing', 'Manufacturing and industrial companies', '#84CC16', 'Factory'),
('Consulting', 'Business and management consulting firms', '#6366F1', 'Users'),
('Software Vendor', 'Software development and licensing companies', '#14B8A6', 'Code')
ON CONFLICT (name) DO NOTHING;

-- Insert template categories for Cloud Service Provider
INSERT INTO vendor_type_template_categories (vendor_type_id, name, description, weight, is_mandatory, sort_order) VALUES
((SELECT id FROM vendor_types WHERE name = 'Cloud Service Provider'), 'Data Security', 'Data encryption, access controls, and data protection', 0.30, true, 1),
((SELECT id FROM vendor_types WHERE name = 'Cloud Service Provider'), 'Infrastructure Security', 'Network security, server hardening, and infrastructure controls', 0.25, true, 2),
((SELECT id FROM vendor_types WHERE name = 'Cloud Service Provider'), 'Compliance & Certifications', 'SOC 2, ISO 27001, and other compliance certifications', 0.20, true, 3),
((SELECT id FROM vendor_types WHERE name = 'Cloud Service Provider'), 'Business Continuity', 'Backup, disaster recovery, and service availability', 0.15, false, 4),
((SELECT id FROM vendor_types WHERE name = 'Cloud Service Provider'), 'Vendor Management', 'Sub-contractor management and supply chain security', 0.10, false, 5);

-- Insert risk templates for Cloud Service Provider
INSERT INTO vendor_type_risk_templates (vendor_type_id, category_id, risk_title, risk_description, default_likelihood, default_impact, default_risk_score, control_catalogue, control_reference, is_mandatory, weight, sort_order) VALUES
((SELECT id FROM vendor_types WHERE name = 'Cloud Service Provider'), 
 (SELECT id FROM vendor_type_template_categories WHERE name = 'Data Security' AND vendor_type_id = (SELECT id FROM vendor_types WHERE name = 'Cloud Service Provider')),
 'Data Encryption at Rest', 'Risk of unauthorized access to stored data due to inadequate encryption', 2, 4, 8, 'ISO27001', 'A.10.1.1', true, 1.00, 1),

((SELECT id FROM vendor_types WHERE name = 'Cloud Service Provider'), 
 (SELECT id FROM vendor_type_template_categories WHERE name = 'Data Security' AND vendor_type_id = (SELECT id FROM vendor_types WHERE name = 'Cloud Service Provider')),
 'Data Encryption in Transit', 'Risk of data interception during transmission', 2, 4, 8, 'ISO27001', 'A.13.1.1', true, 1.00, 2),

((SELECT id FROM vendor_types WHERE name = 'Cloud Service Provider'), 
 (SELECT id FROM vendor_type_template_categories WHERE name = 'Data Security' AND vendor_type_id = (SELECT id FROM vendor_types WHERE name = 'Cloud Service Provider')),
 'Access Control Management', 'Risk of unauthorized access due to weak access controls', 3, 4, 12, 'ISO27001', 'A.9.1.1', true, 1.00, 3);

-- Insert template categories for Financial Services
INSERT INTO vendor_type_template_categories (vendor_type_id, name, description, weight, is_mandatory, sort_order) VALUES
((SELECT id FROM vendor_types WHERE name = 'Financial Services'), 'PCI DSS Compliance', 'Payment card industry data security standards', 0.35, true, 1),
((SELECT id FROM vendor_types WHERE name = 'Financial Services'), 'SOX Compliance', 'Sarbanes-Oxley financial reporting controls', 0.25, true, 2),
((SELECT id FROM vendor_types WHERE name = 'Financial Services'), 'Anti-Money Laundering', 'AML and KYC compliance requirements', 0.20, true, 3),
((SELECT id FROM vendor_types WHERE name = 'Financial Services'), 'Data Privacy', 'Customer financial data protection', 0.15, false, 4),
((SELECT id FROM vendor_types WHERE name = 'Financial Services'), 'Operational Risk', 'Business continuity and operational resilience', 0.05, false, 5);

-- Insert risk templates for Financial Services
INSERT INTO vendor_type_risk_templates (vendor_type_id, category_id, risk_title, risk_description, default_likelihood, default_impact, default_risk_score, control_catalogue, control_reference, is_mandatory, weight, sort_order) VALUES
((SELECT id FROM vendor_types WHERE name = 'Financial Services'), 
 (SELECT id FROM vendor_type_template_categories WHERE name = 'PCI DSS Compliance' AND vendor_type_id = (SELECT id FROM vendor_types WHERE name = 'Financial Services')),
 'Cardholder Data Protection', 'Risk of payment card data exposure', 2, 5, 10, 'PCI_DSS', '3.4', true, 1.00, 1),

((SELECT id FROM vendor_types WHERE name = 'Financial Services'), 
 (SELECT id FROM vendor_type_template_categories WHERE name = 'SOX Compliance' AND vendor_type_id = (SELECT id FROM vendor_types WHERE name = 'Financial Services')),
 'Financial Reporting Controls', 'Risk of inaccurate financial reporting', 2, 4, 8, 'SOX', 'ITGC-01', true, 1.00, 2);

-- Insert template categories for Healthcare Provider
INSERT INTO vendor_type_template_categories (vendor_type_id, name, description, weight, is_mandatory, sort_order) VALUES
((SELECT id FROM vendor_types WHERE name = 'Healthcare Provider'), 'HIPAA Compliance', 'Health Insurance Portability and Accountability Act', 0.40, true, 1),
((SELECT id FROM vendor_types WHERE name = 'Healthcare Provider'), 'PHI Security', 'Protected Health Information security controls', 0.30, true, 2),
((SELECT id FROM vendor_types WHERE name = 'Healthcare Provider'), 'Medical Device Security', 'Security of connected medical devices', 0.20, false, 3),
((SELECT id FROM vendor_types WHERE name = 'Healthcare Provider'), 'Business Associate Agreement', 'HIPAA business associate requirements', 0.10, true, 4);

-- Insert risk templates for Healthcare Provider
INSERT INTO vendor_type_risk_templates (vendor_type_id, category_id, risk_title, risk_description, default_likelihood, default_impact, default_risk_score, control_catalogue, control_reference, is_mandatory, weight, sort_order) VALUES
((SELECT id FROM vendor_types WHERE name = 'Healthcare Provider'), 
 (SELECT id FROM vendor_type_template_categories WHERE name = 'HIPAA Compliance' AND vendor_type_id = (SELECT id FROM vendor_types WHERE name = 'Healthcare Provider')),
 'PHI Access Controls', 'Risk of unauthorized access to protected health information', 3, 5, 15, 'HIPAA', '164.312(a)(1)', true, 1.00, 1),

((SELECT id FROM vendor_types WHERE name = 'Healthcare Provider'), 
 (SELECT id FROM vendor_type_template_categories WHERE name = 'PHI Security' AND vendor_type_id = (SELECT id FROM vendor_types WHERE name = 'Healthcare Provider')),
 'PHI Encryption', 'Risk of PHI exposure due to inadequate encryption', 2, 5, 10, 'HIPAA', '164.312(a)(2)(iv)', true, 1.00, 2);

-- Insert template categories for IT Services
INSERT INTO vendor_type_template_categories (vendor_type_id, name, description, weight, is_mandatory, sort_order) VALUES
((SELECT id FROM vendor_types WHERE name = 'IT Services'), 'Information Security', 'General information security controls', 0.30, true, 1),
((SELECT id FROM vendor_types WHERE name = 'IT Services'), 'Access Management', 'User access and privilege management', 0.25, true, 2),
((SELECT id FROM vendor_types WHERE name = 'IT Services'), 'Change Management', 'IT change and configuration management', 0.20, false, 3),
((SELECT id FROM vendor_types WHERE name = 'IT Services'), 'Service Delivery', 'Service level agreements and delivery', 0.15, false, 4),
((SELECT id FROM vendor_types WHERE name = 'IT Services'), 'Incident Response', 'Security incident response capabilities', 0.10, false, 5);

-- Insert risk templates for IT Services
INSERT INTO vendor_type_risk_templates (vendor_type_id, category_id, risk_title, risk_description, default_likelihood, default_impact, default_risk_score, control_catalogue, control_reference, is_mandatory, weight, sort_order) VALUES
((SELECT id FROM vendor_types WHERE name = 'IT Services'), 
 (SELECT id FROM vendor_type_template_categories WHERE name = 'Information Security' AND vendor_type_id = (SELECT id FROM vendor_types WHERE name = 'IT Services')),
 'Security Policy Implementation', 'Risk of inadequate security policy implementation', 3, 3, 9, 'ISO27001', 'A.5.1.1', true, 1.00, 1),

((SELECT id FROM vendor_types WHERE name = 'IT Services'), 
 (SELECT id FROM vendor_type_template_categories WHERE name = 'Access Management' AND vendor_type_id = (SELECT id FROM vendor_types WHERE name = 'IT Services')),
 'Privileged Access Management', 'Risk of excessive or uncontrolled privileged access', 3, 4, 12, 'ISO27001', 'A.9.2.3', true, 1.00, 2);

-- Continue with other vendor types...
INSERT INTO vendor_type_template_categories (vendor_type_id, name, description, weight, is_mandatory, sort_order) VALUES
((SELECT id FROM vendor_types WHERE name = 'Software Vendor'), 'Software Security', 'Application security and secure development', 0.35, true, 1),
((SELECT id FROM vendor_types WHERE name = 'Software Vendor'), 'Vulnerability Management', 'Software vulnerability identification and patching', 0.25, true, 2),
((SELECT id FROM vendor_types WHERE name = 'Software Vendor'), 'License Compliance', 'Software licensing and intellectual property', 0.20, false, 3),
((SELECT id FROM vendor_types WHERE name = 'Software Vendor'), 'Support & Maintenance', 'Technical support and software maintenance', 0.20, false, 4);

INSERT INTO vendor_type_risk_templates (vendor_type_id, category_id, risk_title, risk_description, default_likelihood, default_impact, default_risk_score, control_catalogue, control_reference, is_mandatory, weight, sort_order) VALUES
((SELECT id FROM vendor_types WHERE name = 'Software Vendor'), 
 (SELECT id FROM vendor_type_template_categories WHERE name = 'Software Security' AND vendor_type_id = (SELECT id FROM vendor_types WHERE name = 'Software Vendor')),
 'Secure Development Lifecycle', 'Risk of security vulnerabilities in software development', 3, 4, 12, 'NIST', 'SA-15', true, 1.00, 1),

((SELECT id FROM vendor_types WHERE name = 'Software Vendor'), 
 (SELECT id FROM vendor_type_template_categories WHERE name = 'Vulnerability Management' AND vendor_type_id = (SELECT id FROM vendor_types WHERE name = 'Software Vendor')),
 'Vulnerability Disclosure Process', 'Risk of delayed vulnerability disclosure and patching', 2, 3, 6, 'NIST', 'SI-5', true, 1.00, 2);
