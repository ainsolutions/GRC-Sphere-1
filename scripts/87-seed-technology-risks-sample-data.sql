-- Insert sample technology risks data
INSERT INTO technology_risks (
    risk_id,
    title,
    description,
    technology_category,
    technology_type,
    asset_id,
    risk_category,
    likelihood,
    impact,
    current_controls,
    recommended_controls,
    owner,
    status,
    due_date,
    residual_likelihood,
    residual_impact,
    control_assessment,
    risk_treatment,
    treatment_state,
    treatment_end_date,
    action_owner
) VALUES 
-- Infrastructure Risks
('TR-2024-00001', 'Server Hardware Failure', 'Critical server hardware components may fail causing system downtime and data loss', 'Infrastructure', 'Server', '1', 'Technology', 4, 5, 'Regular hardware monitoring, RAID configuration, backup power supply', 'Implement redundant server configuration, enhance monitoring alerts, establish hot standby systems', 'John Smith', 'in-progress', '2024-03-15', 2, 3, 'Current controls are adequate but need enhancement for high availability', 'mitigate', 'in-progress', '2024-04-30', 'Mike Johnson'),

('TR-2024-00002', 'Network Infrastructure Vulnerability', 'Network equipment lacks latest security patches and may be vulnerable to cyber attacks', 'Infrastructure', 'Network', '2', 'Technology', 3, 4, 'Basic firewall rules, network segmentation', 'Implement network access control, regular security patching, intrusion detection system', 'Sarah Davis', 'open', '2024-02-28', 2, 2, 'Network security controls need significant improvement', 'mitigate', 'planned', '2024-05-15', 'David Wilson'),

('TR-2024-00003', 'Database Performance Degradation', 'Database performance issues may impact application availability and user experience', 'Infrastructure', 'Database', '3', 'Technology', 3, 3, 'Database monitoring tools, regular maintenance schedules', 'Optimize database queries, implement caching mechanisms, upgrade hardware resources', 'Robert Brown', 'mitigated', '2024-01-20', 1, 2, 'Performance optimization completed successfully', 'mitigate', 'completed', '2024-02-15', 'Lisa Anderson'),

-- Application Risks
('TR-2024-00004', 'Web Application Security Vulnerabilities', 'Web applications may contain security vulnerabilities exposing sensitive data', 'Application', 'Web Application', '4', 'Technology', 4, 4, 'Basic input validation, SSL encryption', 'Implement comprehensive security testing, code review processes, web application firewall', 'Emily Wilson', 'in-progress', '2024-03-30', 2, 2, 'Security testing in progress, several vulnerabilities identified and being addressed', 'mitigate', 'in-progress', '2024-04-15', 'Tom Garcia'),

('TR-2024-00005', 'Legacy System Integration Issues', 'Legacy systems may not integrate properly with modern applications causing data inconsistencies', 'Application', 'Legacy System', '5', 'Technology', 3, 4, 'Manual data reconciliation processes, basic API connections', 'Develop robust integration middleware, implement data validation checks, plan system modernization', 'Michael Taylor', 'open', '2024-04-10', 3, 3, 'Integration challenges persist, modernization planning required', 'mitigate', 'planned', '2024-06-30', 'Jennifer Lee'),

-- Cloud & Virtualization Risks
('TR-2024-00006', 'Cloud Service Provider Outage', 'Dependency on single cloud provider may cause service disruption during outages', 'Cloud', 'Cloud Platform', '6', 'Technology', 2, 5, 'Service level agreements, basic backup procedures', 'Implement multi-cloud strategy, enhance disaster recovery procedures, establish alternative service providers', 'Christopher Martinez', 'open', '2024-03-20', 2, 4, 'Single point of failure identified, multi-cloud strategy needed', 'mitigate', 'planned', '2024-07-31', 'Amanda Rodriguez'),

('TR-2024-00007', 'Virtual Machine Resource Exhaustion', 'Virtual machines may exhaust available resources causing performance issues', 'Virtualization', 'Virtual Machine', '7', 'Technology', 3, 3, 'Resource monitoring tools, basic capacity planning', 'Implement dynamic resource allocation, enhance monitoring and alerting, establish resource governance policies', 'Daniel Anderson', 'mitigated', '2024-01-15', 1, 2, 'Resource management policies implemented successfully', 'mitigate', 'completed', '2024-02-28', 'Kevin Thompson'),

-- Security Technology Risks
('TR-2024-00008', 'Firewall Configuration Errors', 'Misconfigured firewall rules may allow unauthorized network access', 'Security', 'Firewall', '8', 'Technology', 4, 4, 'Regular rule reviews, change management process', 'Implement automated rule validation, enhance change approval process, conduct security audits', 'Jessica White', 'in-progress', '2024-02-15', 2, 2, 'Configuration review in progress, several issues identified', 'mitigate', 'in-progress', '2024-03-31', 'Ryan Clark'),

('TR-2024-00009', 'Antivirus System Gaps', 'Inadequate antivirus coverage may allow malware infections across the network', 'Security', 'Antivirus', '9', 'Technology', 3, 4, 'Endpoint antivirus software, basic signature updates', 'Deploy next-generation endpoint protection, implement behavioral analysis, enhance threat intelligence', 'Mark Lewis', 'open', '2024-03-05', 2, 3, 'Current antivirus solution needs modernization', 'mitigate', 'planned', '2024-05-30', 'Nicole Walker'),

-- Data & Storage Risks
('TR-2024-00010', 'Data Backup System Failure', 'Backup systems may fail resulting in potential data loss during disasters', 'Storage', 'Backup System', '10', 'Technology', 3, 5, 'Daily backup schedules, offsite storage', 'Implement backup verification procedures, establish multiple backup locations, test disaster recovery regularly', 'Steven Hall', 'in-progress', '2024-02-20', 2, 3, 'Backup testing revealed some gaps, improvements in progress', 'mitigate', 'in-progress', '2024-04-20', 'Rachel Young'),

-- Communication Technology Risks
('TR-2024-00011', 'Email System Downtime', 'Email system failures may disrupt business communications and productivity', 'Communication', 'Email System', '11', 'Technology', 2, 3, 'Redundant email servers, basic monitoring', 'Implement high availability email clustering, enhance monitoring and alerting, establish backup communication channels', 'Brian King', 'mitigated', '2024-01-10', 1, 2, 'Email system redundancy successfully implemented', 'mitigate', 'completed', '2024-02-10', 'Michelle Wright'),

-- Mobile Technology Risks
('TR-2024-00012', 'Mobile Device Security Risks', 'Unmanaged mobile devices may pose security risks to corporate data and systems', 'Mobile', 'Mobile Device', '12', 'Technology', 4, 3, 'Basic mobile device policies, password requirements', 'Implement mobile device management solution, enhance security policies, provide security training', 'Laura Lopez', 'open', '2024-03-25', 3, 2, 'Mobile security policies need enforcement and technical controls', 'mitigate', 'planned', '2024-06-15', 'Jason Hill'),

-- IoT Technology Risks
('TR-2024-00013', 'IoT Device Vulnerabilities', 'Internet of Things devices may contain security vulnerabilities and lack proper management', 'IoT', 'IoT Device', '13', 'Technology', 4, 3, 'Basic network segmentation, default password changes', 'Implement IoT device inventory and management, establish security standards, regular vulnerability assessments', 'Gregory Scott', 'open', '2024-04-05', 3, 2, 'IoT security framework needs development', 'mitigate', 'planned', '2024-08-31', 'Stephanie Green'),

-- Development Technology Risks
('TR-2024-00014', 'Software Development Security Gaps', 'Insecure coding practices may introduce vulnerabilities in custom applications', 'Development', 'Development Tools', '14', 'Technology', 3, 4, 'Code review guidelines, basic security training', 'Implement secure development lifecycle, automated security testing, enhanced developer training', 'Patrick Adams', 'in-progress', '2024-03-10', 2, 2, 'Secure development practices being implemented', 'mitigate', 'in-progress', '2024-05-31', 'Melissa Baker'),

-- Monitoring Technology Risks
('TR-2024-00015', 'System Monitoring Blind Spots', 'Inadequate system monitoring may delay detection of security incidents and performance issues', 'Monitoring', 'Monitoring System', '15', 'Technology', 3, 3, 'Basic system monitoring tools, manual log reviews', 'Implement comprehensive monitoring solution, automated alerting, security information and event management (SIEM)', 'Timothy Gonzalez', 'open', '2024-02-25', 2, 2, 'Monitoring capabilities need significant enhancement', 'mitigate', 'planned', '2024-07-15', 'Christina Nelson');

-- Verify the data was inserted
SELECT COUNT(*) as total_technology_risks FROM technology_risks;
SELECT technology_category, COUNT(*) as count FROM technology_risks GROUP BY technology_category ORDER BY count DESC;
SELECT status, COUNT(*) as count FROM technology_risks GROUP BY status;
