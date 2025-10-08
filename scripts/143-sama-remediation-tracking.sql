-- SAMA Remediation Tracking
-- Create table for tracking remediation actions for SAMA compliance findings

CREATE TABLE IF NOT EXISTS sama_remediation (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER REFERENCES sama_assessments(id),
    finding_title VARCHAR(200) NOT NULL,
    finding_description TEXT,
    control_reference VARCHAR(50),
    risk_level VARCHAR(20) DEFAULT 'Medium', -- Critical, High, Medium, Low
    remediation_action TEXT NOT NULL,
    responsible_party VARCHAR(100),
    target_date DATE,
    status VARCHAR(50) DEFAULT 'Open', -- Open, In Progress, On Hold, Completed, Overdue
    progress_percentage INTEGER DEFAULT 0,
    evidence_provided TEXT,
    verification_status VARCHAR(50) DEFAULT 'Pending', -- Pending, Under Review, Verified, Rejected
    cost_estimate DECIMAL(15,2) DEFAULT 0,
    actual_completion_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample SAMA remediation items
INSERT INTO sama_remediation (
    assessment_id,
    finding_title,
    finding_description,
    control_reference,
    risk_level,
    remediation_action,
    responsible_party,
    target_date,
    status,
    progress_percentage,
    evidence_provided,
    verification_status,
    cost_estimate,
    notes
) VALUES 
(1, 'Payment System Transaction Monitoring Enhancement', 'Current transaction monitoring system lacks real-time fraud detection capabilities for high-value transactions', 'PS-02', 'High', 'Implement advanced transaction monitoring system with machine learning-based fraud detection for real-time analysis of payment transactions', 'Payment Systems Manager', '2024-10-31', 'In Progress', 60, 'RFP issued for advanced monitoring solution, vendor selection in progress', 'Under Review', 750000, 'Project on track, expecting vendor selection by end of month'),
(1, 'Third Party Cybersecurity Assessment Framework', 'Lack of comprehensive cybersecurity assessment framework for critical third-party service providers', 'TP-01', 'High', 'Develop and implement comprehensive third-party cybersecurity risk assessment framework with regular monitoring', 'Third Party Risk Manager', '2024-09-30', 'In Progress', 40, 'Framework document drafted, stakeholder review in progress', 'Pending', 150000, 'Need to finalize assessment criteria and monitoring procedures'),
(1, 'Data Loss Prevention Implementation', 'Insufficient data loss prevention controls for sensitive customer data', 'DM-02', 'Medium', 'Deploy enterprise-wide data loss prevention solution with endpoint and network monitoring', 'Information Security Manager', '2024-12-15', 'Open', 10, 'Initial requirements gathering completed', 'Pending', 300000, 'Waiting for budget approval to proceed with procurement'),
(1, 'Incident Response Plan Enhancement', 'Current incident response plan lacks specific procedures for cyber incidents affecting payment systems', 'IR-01', 'High', 'Update incident response plan to include specific procedures for payment system cyber incidents with SAMA notification requirements', 'CISO', '2024-08-31', 'In Progress', 80, 'Updated plan drafted and under legal review', 'Under Review', 50000, 'Plan includes new escalation procedures and communication templates'),
(1, 'Business Continuity Testing Program', 'Business continuity plans not tested regularly, last test conducted 18 months ago', 'BC-03', 'Medium', 'Establish quarterly business continuity testing program with documented results and improvement actions', 'Business Continuity Manager', '2024-11-30', 'Open', 20, 'Testing schedule drafted', 'Pending', 100000, 'Need to coordinate with operations teams for testing windows');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sama_remediation_assessment ON sama_remediation(assessment_id);
CREATE INDEX IF NOT EXISTS idx_sama_remediation_status ON sama_remediation(status);
CREATE INDEX IF NOT EXISTS idx_sama_remediation_risk_level ON sama_remediation(risk_level);
CREATE INDEX IF NOT EXISTS idx_sama_remediation_target_date ON sama_remediation(target_date);
CREATE INDEX IF NOT EXISTS idx_sama_remediation_responsible_party ON sama_remediation(responsible_party);
