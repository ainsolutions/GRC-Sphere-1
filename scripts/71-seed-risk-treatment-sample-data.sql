-- Insert sample risk treatment plans
INSERT INTO risk_treatment_plans (
    fair_risk_id, plan_title, plan_description, treatment_type, priority,
    estimated_cost, estimated_effort_hours, expected_risk_reduction,
    plan_status, assigned_to, start_date, target_completion_date,
    approval_required, created_by
) VALUES 
-- Treatment plans for existing FAIR risks (assuming first 5 FAIR risks exist)
(1, 'Ransomware Protection Enhancement', 
 'Implement comprehensive ransomware protection including backup systems, endpoint detection, and user training',
 'mitigate', 'critical', 150000.00, 480, 75.00,
 'approved', 'john.doe@company.com', '2024-01-15', '2024-06-30',
 true, 'security.manager@company.com'),

(1, 'Cyber Insurance Coverage', 
 'Obtain comprehensive cyber liability insurance to transfer financial risk',
 'transfer', 'high', 25000.00, 40, 30.00,
 'in_progress', 'risk.manager@company.com', '2024-02-01', '2024-03-31',
 false, 'risk.manager@company.com'),

(2, 'Database Security Hardening', 
 'Implement database security controls including encryption, access controls, and monitoring',
 'mitigate', 'high', 75000.00, 320, 80.00,
 'in_progress', 'dba.team@company.com', '2024-01-20', '2024-05-15',
 true, 'security.manager@company.com'),

(3, 'Email Security Enhancement', 
 'Deploy advanced email security solutions including anti-phishing and sandboxing',
 'mitigate', 'medium', 45000.00, 160, 65.00,
 'approved', 'it.security@company.com', '2024-02-15', '2024-04-30',
 true, 'security.manager@company.com'),

(4, 'Network Segmentation Project', 
 'Implement network segmentation to limit lateral movement of threats',
 'mitigate', 'high', 120000.00, 600, 70.00,
 'draft', 'network.team@company.com', '2024-03-01', '2024-08-31',
 true, 'security.manager@company.com'),

(5, 'Third-Party Risk Assessment', 
 'Conduct comprehensive assessment of third-party vendor security posture',
 'mitigate', 'medium', 30000.00, 200, 50.00,
 'approved', 'vendor.management@company.com', '2024-02-01', '2024-05-31',
 false, 'risk.manager@company.com');

-- Insert sample risk treatment controls
INSERT INTO risk_treatment_controls (
    treatment_plan_id, control_title, control_description, control_type, control_category,
    implementation_status, effectiveness_rating, implementation_cost, maintenance_cost_annual,
    assigned_owner, technical_contact, implementation_date, testing_date, next_review_date,
    automation_level, compliance_frameworks, evidence_location, testing_procedure
) VALUES 
-- Controls for Ransomware Protection Enhancement (plan_id = 1)
(1, 'Immutable Backup System', 
 'Deploy immutable backup solution with air-gapped storage for critical data recovery',
 'preventive', 'Data Protection', 'implemented', 5, 50000.00, 12000.00,
 'backup.admin@company.com', 'storage.team@company.com', '2024-03-15', '2024-03-20', '2024-09-15',
 'fully_automated', ARRAY['ISO27001', 'NIST'], '/evidence/backup-config/', 'Monthly restore testing procedure'),

(1, 'Endpoint Detection and Response', 
 'Deploy EDR solution across all endpoints for advanced threat detection',
 'detective', 'Endpoint Security', 'operational', 4, 35000.00, 15000.00,
 'endpoint.security@company.com', 'security.ops@company.com', '2024-02-28', '2024-03-05', '2024-08-28',
 'fully_automated', ARRAY['NIST', 'CIS'], '/evidence/edr-deployment/', 'Weekly detection capability testing'),

(1, 'Security Awareness Training', 
 'Implement comprehensive security awareness training program focusing on ransomware',
 'preventive', 'Human Resources', 'in_progress', 3, 15000.00, 8000.00,
 'hr.training@company.com', 'security.awareness@company.com', '2024-04-01', '2024-04-15', '2024-10-01',
 'semi_automated', ARRAY['ISO27001'], '/evidence/training-records/', 'Quarterly phishing simulation testing'),

-- Controls for Database Security Hardening (plan_id = 3)
(3, 'Database Encryption at Rest', 
 'Implement transparent data encryption for all sensitive databases',
 'preventive', 'Data Protection', 'implemented', 5, 25000.00, 5000.00,
 'dba.senior@company.com', 'database.team@company.com', '2024-03-10', '2024-03-12', '2024-09-10',
 'fully_automated', ARRAY['PCI-DSS', 'HIPAA', 'ISO27001'], '/evidence/db-encryption/', 'Monthly encryption key rotation testing'),

(3, 'Database Access Control Matrix', 
 'Implement role-based access control with principle of least privilege',
 'preventive', 'Access Control', 'operational', 4, 10000.00, 3000.00,
 'dba.security@company.com', 'identity.team@company.com', '2024-02-15', '2024-02-20', '2024-08-15',
 'semi_automated', ARRAY['SOX', 'ISO27001'], '/evidence/db-access-matrix/', 'Quarterly access review procedure'),

(3, 'Database Activity Monitoring', 
 'Deploy real-time database activity monitoring and alerting',
 'detective', 'Monitoring', 'in_progress', 4, 40000.00, 18000.00,
 'security.monitoring@company.com', 'siem.team@company.com', '2024-04-01', '2024-04-10', '2024-10-01',
 'fully_automated', ARRAY['PCI-DSS', 'SOX'], '/evidence/db-monitoring/', 'Weekly alert testing and tuning'),

-- Controls for Email Security Enhancement (plan_id = 4)
(4, 'Advanced Threat Protection', 
 'Deploy ATP solution for email with sandboxing and URL rewriting',
 'preventive', 'Email Security', 'implemented', 4, 30000.00, 12000.00,
 'email.security@company.com', 'messaging.team@company.com', '2024-03-01', '2024-03-05', '2024-09-01',
 'fully_automated', ARRAY['NIST'], '/evidence/email-atp/', 'Monthly threat detection testing'),

(4, 'DMARC Implementation', 
 'Implement DMARC policy to prevent email spoofing and phishing',
 'preventive', 'Email Security', 'operational', 3, 5000.00, 2000.00,
 'dns.admin@company.com', 'email.security@company.com', '2024-02-20', '2024-02-25', '2024-08-20',
 'manual', ARRAY['NIST'], '/evidence/dmarc-policy/', 'Quarterly DMARC report analysis'),

-- Controls for Network Segmentation Project (plan_id = 5)
(5, 'Micro-segmentation Implementation', 
 'Implement micro-segmentation using software-defined networking',
 'preventive', 'Network Security', 'planned', 4, 80000.00, 20000.00,
 'network.architect@company.com', 'sdn.team@company.com', '2024-05-01', '2024-05-15', '2024-11-01',
 'fully_automated', ARRAY['NIST', 'ISO27001'], '/evidence/network-segmentation/', 'Monthly segmentation testing'),

(5, 'Network Access Control', 
 'Deploy NAC solution for device authentication and authorization',
 'preventive', 'Network Security', 'planned', 4, 40000.00, 15000.00,
 'network.security@company.com', 'nac.team@company.com', '2024-06-01', '2024-06-10', '2024-12-01',
 'fully_automated', ARRAY['ISO27001'], '/evidence/nac-deployment/', 'Weekly device compliance testing');

-- Insert sample tracking entries
INSERT INTO risk_treatment_tracking (
    treatment_plan_id, control_id, tracking_type, old_status, new_status,
    tracking_date, description, impact_assessment, action_required,
    responsible_party, due_date, created_by
) VALUES 
(1, NULL, 'milestone', NULL, NULL, '2024-01-15', 
 'Treatment plan approved and project kickoff completed', 
 'Positive - project can proceed as planned',
 'Begin implementation of backup system controls',
 'john.doe@company.com', '2024-02-01', 'security.manager@company.com'),

(1, 1, 'completion', 'in_progress', 'implemented', '2024-03-15',
 'Immutable backup system successfully deployed and tested',
 'Significant improvement in data recovery capabilities',
 'Schedule quarterly restore testing',
 'backup.admin@company.com', '2024-06-15', 'backup.admin@company.com'),

(1, 2, 'status_change', 'implemented', 'operational', '2024-03-05',
 'EDR solution moved to operational status after successful testing',
 'Enhanced threat detection capabilities now active',
 'Monitor detection rates and tune rules as needed',
 'endpoint.security@company.com', '2024-04-05', 'security.ops@company.com'),

(3, 4, 'issue', 'in_progress', 'in_progress', '2024-03-20',
 'Database encryption implementation delayed due to performance concerns',
 'Potential delay in overall project timeline',
 'Conduct performance testing and optimization',
 'dba.senior@company.com', '2024-04-01', 'dba.senior@company.com'),

(4, 6, 'review', 'operational', 'operational', '2024-03-25',
 'Quarterly review of ATP solution effectiveness completed',
 'Solution performing well with 95% threat detection rate',
 'Continue monitoring and update threat intelligence feeds',
 'email.security@company.com', '2024-06-25', 'security.manager@company.com'),

(2, NULL, 'status_change', 'approved', 'in_progress', '2024-02-01',
 'Cyber insurance procurement process initiated',
 'Risk transfer strategy implementation begun',
 'Complete insurance application and risk assessment',
 'risk.manager@company.com', '2024-03-15', 'risk.manager@company.com');
