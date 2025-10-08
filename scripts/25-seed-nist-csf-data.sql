-- Seed NIST Cybersecurity Framework 2.0 Data

-- Insert NIST CSF Functions
INSERT INTO nist_csf_functions (function_code, function_name, function_description, function_purpose) VALUES
('GV', 'Govern', 'The organization''s cybersecurity risk management strategy, expectations, and policy are established, communicated, and monitored.', 'Establish and monitor the organization''s cybersecurity governance, risk management strategy, expectations, and policy.'),
('ID', 'Identify', 'The organization''s current cybersecurity risks are understood.', 'Develop an organizational understanding to manage cybersecurity risk to systems, people, assets, data, and capabilities.'),
('PR', 'Protect', 'Safeguards for delivery of critical infrastructure services are implemented.', 'Develop and implement appropriate safeguards to ensure delivery of critical infrastructure services.'),
('DE', 'Detect', 'Activities are implemented to identify the occurrence of a cybersecurity event.', 'Develop and implement appropriate activities to identify the occurrence of a cybersecurity event.'),
('RS', 'Respond', 'Activities are implemented to take action regarding a detected cybersecurity incident.', 'Develop and implement appropriate activities to take action regarding a detected cybersecurity incident.'),
('RC', 'Recover', 'Activities are implemented to restore any capabilities or services that were impaired due to a cybersecurity incident.', 'Develop and implement appropriate activities to maintain plans for resilience and to restore any capabilities or services that were impaired due to a cybersecurity incident.');

-- Insert NIST CSF Implementation Tiers
INSERT INTO nist_csf_implementation_tiers (tier_level, tier_name, tier_description, characteristics) VALUES
(1, 'Partial', 'Organizational cybersecurity risk management practices are not formalized, and risk is managed in an ad hoc and sometimes reactive manner.', ARRAY['Ad hoc risk management', 'Limited awareness', 'Reactive approach']),
(2, 'Risk Informed', 'Risk management practices are approved by management but may not be established as organizational-wide policy.', ARRAY['Management approved practices', 'Risk-informed decisions', 'Some organizational awareness']),
(3, 'Repeatable', 'The organization''s risk management practices are formally approved and expressed as policy.', ARRAY['Formal policies', 'Regular updates', 'Consistent implementation']),
(4, 'Adaptive', 'The organization adapts its cybersecurity practices based on lessons learned and predictive indicators.', ARRAY['Continuous improvement', 'Predictive capabilities', 'Advanced threat intelligence']);

-- Insert NIST CSF Categories for GOVERN Function
INSERT INTO nist_csf_categories (category_code, category_name, category_description, function_id) VALUES
('GV.OC', 'Organizational Context', 'The circumstances that frame the organization''s risk management decisions are understood.', (SELECT id FROM nist_csf_functions WHERE function_code = 'GV')),
('GV.RM', 'Risk Management Strategy', 'The organization''s priorities, constraints, risk tolerances, and assumptions are established and used to support operational risk decisions.', (SELECT id FROM nist_csf_functions WHERE function_code = 'GV')),
('GV.RR', 'Roles, Responsibilities, and Authorities', 'Cybersecurity roles, responsibilities, and authorities to foster accountability, performance assessment, and continuous improvement are established and communicated.', (SELECT id FROM nist_csf_functions WHERE function_code = 'GV')),
('GV.PO', 'Policy', 'Organizational cybersecurity policy is established, communicated, and enforced.', (SELECT id FROM nist_csf_functions WHERE function_code = 'GV')),
('GV.OV', 'Oversight', 'Results of organization-wide cybersecurity risk management activities and performance are used to inform, improve, and adjust the risk management strategy.', (SELECT id FROM nist_csf_functions WHERE function_code = 'GV')),
('GV.SC', 'Supply Chain Risk Management', 'Supply chain risk management processes are identified, established, managed, monitored, and improved by organizational stakeholders.', (SELECT id FROM nist_csf_functions WHERE function_code = 'GV'));

-- Insert NIST CSF Categories for IDENTIFY Function
INSERT INTO nist_csf_categories (category_code, category_name, category_description, function_id) VALUES
('ID.AM', 'Asset Management', 'Assets (e.g., data, hardware, software, systems, facilities, services, people) that enable the organization to achieve business purposes are identified and managed consistent with their relative importance to organizational objectives and the organization''s risk strategy.', (SELECT id FROM nist_csf_functions WHERE function_code = 'ID')),
('ID.BE', 'Business Environment', 'The organization''s mission, objectives, stakeholders, and activities are understood and prioritized; this information is used to inform cybersecurity roles, responsibilities, and risk management decisions.', (SELECT id FROM nist_csf_functions WHERE function_code = 'ID')),
('ID.GV', 'Governance', 'The policies, procedures, and processes to manage and monitor the organization''s regulatory, legal, risk, environmental, and operational requirements are understood and inform the management of cybersecurity risk.', (SELECT id FROM nist_csf_functions WHERE function_code = 'ID')),
('ID.RA', 'Risk Assessment', 'The organization understands the cybersecurity risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals.', (SELECT id FROM nist_csf_functions WHERE function_code = 'ID')),
('ID.RM', 'Risk Management Strategy', 'The organization''s priorities, constraints, risk tolerances, and assumptions are established and used to support operational risk decisions.', (SELECT id FROM nist_csf_functions WHERE function_code = 'ID')),
('ID.SC', 'Supply Chain Risk Management', 'The organization''s priorities, constraints, risk tolerances, and assumptions are established and used to support supply chain risk management decisions.', (SELECT id FROM nist_csf_functions WHERE function_code = 'ID'));

-- Insert NIST CSF Categories for PROTECT Function
INSERT INTO nist_csf_categories (category_code, category_name, category_description, function_id) VALUES
('PR.AA', 'Identity Management, Authentication and Access Control', 'Access to physical and logical assets and associated facilities is limited to authorized users, processes, and devices, and is managed consistent with the assessed risk of unauthorized access to authorized activities and transactions.', (SELECT id FROM nist_csf_functions WHERE function_code = 'PR')),
('PR.AT', 'Awareness and Training', 'The organization''s personnel and partners are provided cybersecurity awareness education and are trained to perform their cybersecurity-related duties and responsibilities consistent with related policies, procedures, and agreements.', (SELECT id FROM nist_csf_functions WHERE function_code = 'PR')),
('PR.DS', 'Data Security', 'Information and records (data) are managed consistent with the organization''s risk strategy to protect the confidentiality, integrity, and availability of information.', (SELECT id FROM nist_csf_functions WHERE function_code = 'PR')),
('PR.IP', 'Information Protection Processes and Procedures', 'Security policies (that address purpose, scope, roles, responsibilities, management commitment, and coordination among organizational entities), processes, and procedures are maintained and used to manage protection of information systems and assets.', (SELECT id FROM nist_csf_functions WHERE function_code = 'PR')),
('PR.MA', 'Maintenance', 'Maintenance and repairs of industrial control and information system components are performed consistent with policies and procedures.', (SELECT id FROM nist_csf_functions WHERE function_code = 'PR')),
('PR.PT', 'Protective Technology', 'Technical security solutions are managed to ensure the security and resilience of systems and assets, consistent with related policies, procedures, and agreements.', (SELECT id FROM nist_csf_functions WHERE function_code = 'PR'));

-- Insert NIST CSF Categories for DETECT Function
INSERT INTO nist_csf_categories (category_code, category_name, category_description, function_id) VALUES
('DE.AE', 'Anomalies and Events', 'Anomalous activity is detected and the potential impact of events is understood.', (SELECT id FROM nist_csf_functions WHERE function_code = 'DE')),
('DE.CM', 'Security Continuous Monitoring', 'The information system and assets are monitored to identify cybersecurity events and verify the effectiveness of protective measures.', (SELECT id FROM nist_csf_functions WHERE function_code = 'DE')),
('DE.DP', 'Detection Processes', 'Detection processes and procedures are maintained and tested to ensure awareness of anomalous events.', (SELECT id FROM nist_csf_functions WHERE function_code = 'DE'));

-- Insert NIST CSF Categories for RESPOND Function
INSERT INTO nist_csf_categories (category_code, category_name, category_description, function_id) VALUES
('RS.RP', 'Response Planning', 'Response processes and procedures are executed and maintained, to ensure response to detected cybersecurity incidents.', (SELECT id FROM nist_csf_functions WHERE function_code = 'RS')),
('RS.CO', 'Communications', 'Response activities are coordinated with internal and external stakeholders (e.g. external support from law enforcement agencies).', (SELECT id FROM nist_csf_functions WHERE function_code = 'RS')),
('RS.AN', 'Analysis', 'Analysis is conducted to ensure effective response and support recovery activities.', (SELECT id FROM nist_csf_functions WHERE function_code = 'RS')),
('RS.MI', 'Mitigation', 'Activities are performed to prevent expansion of an event, mitigate its effects, and resolve the incident.', (SELECT id FROM nist_csf_functions WHERE function_code = 'RS')),
('RS.IM', 'Improvements', 'Organizational response activities are improved by incorporating lessons learned from current and previous detection/response activities.', (SELECT id FROM nist_csf_functions WHERE function_code = 'RS'));

-- Insert NIST CSF Categories for RECOVER Function
INSERT INTO nist_csf_categories (category_code, category_name, category_description, function_id) VALUES
('RC.RP', 'Recovery Planning', 'Recovery processes and procedures are executed and maintained to ensure restoration of systems or assets affected by cybersecurity incidents.', (SELECT id FROM nist_csf_functions WHERE function_code = 'RC')),
('RC.IM', 'Improvements', 'Recovery planning and processes are improved by incorporating lessons learned into future activities.', (SELECT id FROM nist_csf_functions WHERE function_code = 'RC')),
('RC.CO', 'Communications', 'Restoration activities are coordinated with internal and external parties (e.g. coordinating centers, Internet Service Providers, owners of attacking systems, victims, other CSIRTs, and vendors).', (SELECT id FROM nist_csf_functions WHERE function_code = 'RC'));

-- Insert Sample NIST CSF Subcategories (Key ones for demonstration)
INSERT INTO nist_csf_subcategories (subcategory_code, subcategory_name, subcategory_description, category_id, implementation_guidance, informative_references) VALUES
-- Govern Subcategories
('GV.OC-01', 'Organizational mission is understood and informs cybersecurity risk management', 'The organization''s mission, objectives, and activities are understood and prioritized; this information is used to inform cybersecurity roles, responsibilities, and risk management decisions.', (SELECT id FROM nist_csf_categories WHERE category_code = 'GV.OC'), 'Document organizational mission and objectives. Ensure cybersecurity strategy aligns with business objectives.', ARRAY['ISO/IEC 27001:2013 A.6.1.1', 'NIST SP 800-39']),
('GV.OC-02', 'Internal and external stakeholders are understood', 'Key stakeholders and their cybersecurity expectations are identified and documented.', (SELECT id FROM nist_csf_categories WHERE category_code = 'GV.OC'), 'Identify all internal and external stakeholders. Document their cybersecurity expectations and requirements.', ARRAY['ISO/IEC 27001:2013 A.6.1.1']),
('GV.RM-01', 'Risk management objectives are established', 'Risk management objectives that support the organizational mission are established.', (SELECT id FROM nist_csf_categories WHERE category_code = 'GV.RM'), 'Establish clear risk management objectives that align with organizational mission and business objectives.', ARRAY['NIST SP 800-39', 'ISO/IEC 27005:2018']),
('GV.RM-02', 'Risk appetite and risk tolerance are established', 'Risk appetite and risk tolerance statements are established, communicated, and maintained.', (SELECT id FROM nist_csf_categories WHERE category_code = 'GV.RM'), 'Define and document organizational risk appetite and tolerance levels. Communicate to all relevant stakeholders.', ARRAY['NIST SP 800-39', 'ISO/IEC 27005:2018']),

-- Identity Subcategories
('ID.AM-01', 'Physical devices and systems are inventoried', 'Physical devices and systems within the organization are inventoried.', (SELECT id FROM nist_csf_categories WHERE category_code = 'ID.AM'), 'Maintain an accurate inventory of all physical devices and systems. Include location, ownership, and criticality information.', ARRAY['ISO/IEC 27001:2013 A.8.1.1', 'NIST SP 800-53 CM-8']),
('ID.AM-02', 'Software platforms and applications are inventoried', 'Software platforms and applications within the organization are inventoried.', (SELECT id FROM nist_csf_categories WHERE category_code = 'ID.AM'), 'Maintain an accurate inventory of all software platforms and applications. Include version information and licensing details.', ARRAY['ISO/IEC 27001:2013 A.8.1.1', 'NIST SP 800-53 CM-8']),
('ID.AM-03', 'Organizational communication and data flows are mapped', 'Organizational communication and data flows are mapped.', (SELECT id FROM nist_csf_categories WHERE category_code = 'ID.AM'), 'Document all communication pathways and data flows within the organization and with external parties.', ARRAY['ISO/IEC 27001:2013 A.13.2.1', 'NIST SP 800-53 AC-4']),
('ID.BE-01', 'Organizational mission is understood and informs cybersecurity risk management', 'The organization''s role in the supply chain is identified and communicated.', (SELECT id FROM nist_csf_categories WHERE category_code = 'ID.BE'), 'Understand and document the organization''s role in relevant supply chains and critical infrastructure sectors.', ARRAY['NIST SP 800-161']),

-- Protect Subcategories
('PR.AA-01', 'Identities and credentials are issued, managed, verified, revoked, and audited', 'Identities and credentials are issued, managed, verified, revoked, and audited for authorized devices, users and processes.', (SELECT id FROM nist_csf_categories WHERE category_code = 'PR.AA'), 'Implement comprehensive identity and credential management processes including provisioning, verification, and deprovisioning.', ARRAY['ISO/IEC 27001:2013 A.9.2.1', 'NIST SP 800-53 IA-2']),
('PR.AA-02', 'Identity and credential management systems are protected', 'Identity and credential management systems are protected.', (SELECT id FROM nist_csf_categories WHERE category_code = 'PR.AA'), 'Implement security controls to protect identity and credential management systems from unauthorized access and tampering.', ARRAY['ISO/IEC 27001:2013 A.9.4.3', 'NIST SP 800-53 IA-5']),
('PR.AT-01', 'All users are informed and trained', 'All users are informed and trained on cybersecurity awareness and responsibilities.', (SELECT id FROM nist_csf_categories WHERE category_code = 'PR.AT'), 'Provide regular cybersecurity awareness training to all users. Include role-specific training for privileged users.', ARRAY['ISO/IEC 27001:2013 A.7.2.2', 'NIST SP 800-53 AT-2']),
('PR.DS-01', 'Data-at-rest is protected', 'Data-at-rest is protected.', (SELECT id FROM nist_csf_categories WHERE category_code = 'PR.DS'), 'Implement appropriate protection mechanisms for data at rest, including encryption where appropriate.', ARRAY['ISO/IEC 27001:2013 A.10.1.1', 'NIST SP 800-53 SC-28']),

-- Detect Subcategories
('DE.AE-01', 'A baseline of network operations and expected data flows is established and managed', 'A baseline of network operations and expected data flows for users and systems is established and managed.', (SELECT id FROM nist_csf_categories WHERE category_code = 'DE.AE'), 'Establish and maintain baselines for normal network operations and data flows to enable detection of anomalies.', ARRAY['ISO/IEC 27001:2013 A.12.4.1', 'NIST SP 800-53 SI-4']),
('DE.CM-01', 'The network is monitored to detect potential cybersecurity events', 'The network is monitored to detect potential cybersecurity events.', (SELECT id FROM nist_csf_categories WHERE category_code = 'DE.CM'), 'Implement continuous network monitoring capabilities to detect potential cybersecurity events and incidents.', ARRAY['ISO/IEC 27001:2013 A.12.4.1', 'NIST SP 800-53 SI-4']),

-- Respond Subcategories
('RS.RP-01', 'Response plan is executed during or after an incident', 'Response plan is executed during or after a cybersecurity incident.', (SELECT id FROM nist_csf_categories WHERE category_code = 'RS.RP'), 'Execute documented incident response procedures when cybersecurity incidents are detected.', ARRAY['ISO/IEC 27001:2013 A.16.1.5', 'NIST SP 800-53 IR-8']),
('RS.CO-01', 'Personnel know their roles and order of operations', 'Personnel know their roles and order of operations when a response is needed.', (SELECT id FROM nist_csf_categories WHERE category_code = 'RS.CO'), 'Ensure all personnel understand their roles and responsibilities during incident response activities.', ARRAY['ISO/IEC 27001:2013 A.16.1.1', 'NIST SP 800-53 IR-3']),

-- Recover Subcategories
('RC.RP-01', 'Recovery plan is executed during or after a cybersecurity incident', 'Recovery plan is executed during or after a cybersecurity incident.', (SELECT id FROM nist_csf_categories WHERE category_code = 'RC.RP'), 'Execute documented recovery procedures to restore normal operations after a cybersecurity incident.', ARRAY['ISO/IEC 27001:2013 A.17.1.2', 'NIST SP 800-53 CP-10']),
('RC.IM-01', 'Recovery plans incorporate lessons learned', 'Recovery plans incorporate lessons learned.', (SELECT id FROM nist_csf_categories WHERE category_code = 'RC.IM'), 'Update recovery plans based on lessons learned from actual incidents and recovery exercises.', ARRAY['ISO/IEC 27001:2013 A.17.1.3', 'NIST SP 800-53 CP-2']);
