-- Insert ISO 27001 Annex A controls
INSERT INTO iso27001_controls (control_id, control_name, control_description, category) VALUES
('A.5.1.1', 'Information Security Policies', 'A set of policies for information security shall be defined, approved by management, published and communicated to employees and relevant external parties.', 'Information Security Policies'),
('A.6.1.1', 'Information Security Roles and Responsibilities', 'All information security responsibilities shall be defined and allocated.', 'Organization of Information Security'),
('A.7.1.1', 'Screening', 'Background verification checks on all candidates for employment shall be carried out in accordance with relevant laws, regulations and ethics.', 'Human Resource Security'),
('A.8.1.1', 'Inventory of Assets', 'Assets associated with information and information processing facilities shall be identified and an inventory of these assets shall be drawn up and maintained.', 'Asset Management'),
('A.9.1.1', 'Access Control Policy', 'An access control policy shall be established, documented and reviewed based on business and information security requirements.', 'Access Control'),
('A.10.1.1', 'Policy on the Use of Cryptographic Controls', 'A policy on the use of cryptographic controls for protection of information shall be developed and implemented.', 'Cryptography'),
('A.11.1.1', 'Physical Security Perimeter', 'Physical security perimeters shall be defined and used to protect areas that contain either sensitive or critical information and information processing facilities.', 'Physical and Environmental Security'),
('A.12.1.1', 'Documented Operating Procedures', 'Operating procedures shall be documented and made available to all users who need them.', 'Operations Security'),
('A.13.1.1', 'Network Security Management', 'Networks shall be managed and controlled to protect information in systems and applications.', 'Communications Security'),
('A.14.1.1', 'Information Security Requirements Analysis and Specification', 'Information security requirements shall be included in the requirements for new information systems or enhancements to existing information systems.', 'System Acquisition, Development and Maintenance'),
('A.15.1.1', 'Information Security Policy for Supplier Relationships', 'Information security requirements for mitigating the risks associated with supplier access to the organization assets shall be agreed with the supplier and documented.', 'Supplier Relationships'),
('A.16.1.1', 'Responsibilities and Procedures', 'Management responsibilities and procedures shall be established to ensure a quick, effective and orderly response to information security incidents.', 'Information Security Incident Management'),
('A.17.1.1', 'Planning Information Security Continuity', 'The organization shall determine its requirements for information security and the continuity of information security management in adverse situations.', 'Information Security Aspects of Business Continuity Management'),
('A.18.1.1', 'Identification of Applicable Legislation and Contractual Requirements', 'All relevant legislative statutory, regulatory, contractual requirements and the organization approach to meet these requirements shall be explicitly identified, documented and kept up to date.', 'Compliance');

-- Insert sample ISO 27001 risks
INSERT INTO iso27001_risks (risk_id, title, description, category, likelihood, impact, owner, treatment_plan, residual_risk, next_review, controls, assets) VALUES
('ISO-001', 'Unauthorized Access to Customer Data', 'Risk of unauthorized personnel gaining access to sensitive customer information stored in databases and applications', 'Access Control', 3, 4, 'John Smith', 'Implement multi-factor authentication, regular access reviews, and privileged access management', 6, '2024-04-15', ARRAY['A.9.1.1', 'A.9.2.1', 'A.9.4.2'], ARRAY['Customer Database', 'CRM System']),
('ISO-002', 'Data Loss Due to System Failure', 'Risk of data loss due to hardware failures, software corruption, or inadequate backup procedures', 'System Reliability', 2, 4, 'Sarah Johnson', 'Implement automated backup systems, disaster recovery procedures, and regular backup testing', 4, '2024-04-10', ARRAY['A.12.3.1', 'A.17.1.2', 'A.17.1.3'], ARRAY['Production Servers', 'Database Systems']),
('ISO-003', 'Malware Infection', 'Risk of malware infection affecting system availability, data integrity, and confidentiality', 'Malware Protection', 3, 3, 'Mike Davis', 'Deploy advanced endpoint protection, email security, and security awareness training', 3, '2024-04-20', ARRAY['A.12.2.1', 'A.7.2.2', 'A.13.1.1'], ARRAY['Workstations', 'Email System']),
('ISO-004', 'Insider Threat', 'Risk of malicious or negligent actions by employees, contractors, or business partners', 'Human Resources', 2, 4, 'Lisa Chen', 'Implement background checks, access controls, monitoring, and security awareness training', 4, '2024-04-25', ARRAY['A.7.1.1', 'A.7.2.1', 'A.9.1.1'], ARRAY['All Systems', 'Sensitive Data']),
('ISO-005', 'Physical Security Breach', 'Risk of unauthorized physical access to facilities, equipment, and information', 'Physical Security', 2, 3, 'Tom Wilson', 'Implement access controls, surveillance systems, and security guards', 2, '2024-04-30', ARRAY['A.11.1.1', 'A.11.1.2', 'A.11.2.1'], ARRAY['Data Center', 'Office Facilities']),
('ISO-006', 'Third-Party Data Breach', 'Risk of data breach or security incident at third-party suppliers or partners', 'Supplier Management', 3, 4, 'Anna Rodriguez', 'Implement supplier security assessments, contracts with security requirements, and monitoring', 8, '2024-05-05', ARRAY['A.15.1.1', 'A.15.2.1', 'A.15.2.2'], ARRAY['Cloud Services', 'Vendor Systems']),
('ISO-007', 'Cryptographic Key Compromise', 'Risk of cryptographic keys being compromised, leading to unauthorized access to encrypted data', 'Cryptography', 2, 5, 'David Kim', 'Implement proper key management, regular key rotation, and hardware security modules', 5, '2024-05-10', ARRAY['A.10.1.1', 'A.10.1.2'], ARRAY['Encryption Systems', 'Secure Communications']),
('ISO-008', 'Business Continuity Failure', 'Risk of inability to maintain critical business operations during disruptions', 'Business Continuity', 2, 5, 'Emma Thompson', 'Develop and test business continuity plans, implement redundant systems, and establish alternate sites', 6, '2024-05-15', ARRAY['A.17.1.1', 'A.17.1.2', 'A.17.2.1'], ARRAY['Critical Systems', 'Business Processes']);

-- Insert risk-control mappings
INSERT INTO iso27001_risk_controls (risk_id, control_id, effectiveness, implementation_status) 
SELECT r.id, c.id, 'High', 'Implemented'
FROM iso27001_risks r, iso27001_controls c
WHERE r.risk_id = 'ISO-001' AND c.control_id IN ('A.9.1.1', 'A.9.2.1');

INSERT INTO iso27001_risk_controls (risk_id, control_id, effectiveness, implementation_status) 
SELECT r.id, c.id, 'Medium', 'In Progress'
FROM iso27001_risks r, iso27001_controls c
WHERE r.risk_id = 'ISO-002' AND c.control_id IN ('A.12.3.1', 'A.17.1.2');

INSERT INTO iso27001_risk_controls (risk_id, control_id, effectiveness, implementation_status) 
SELECT r.id, c.id, 'High', 'Implemented'
FROM iso27001_risks r, iso27001_controls c
WHERE r.risk_id = 'ISO-003' AND c.control_id IN ('A.12.2.1', 'A.13.1.1');
