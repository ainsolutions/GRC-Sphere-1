-- MAS Gap Analysis Table

CREATE TABLE IF NOT EXISTS mas_gap_analysis (
    id SERIAL PRIMARY KEY,
    domain VARCHAR(100) NOT NULL,
    requirement_id VARCHAR(20) NOT NULL,
    requirement_title VARCHAR(500) NOT NULL,
    current_state TEXT NOT NULL,
    target_state TEXT NOT NULL,
    gap_description TEXT NOT NULL,
    business_impact TEXT NOT NULL,
    priority_score INTEGER NOT NULL CHECK (priority_score >= 1 AND priority_score <= 10),
    implementation_effort VARCHAR(100) NOT NULL,
    estimated_cost DECIMAL(12,2) DEFAULT 0.00,
    estimated_timeline VARCHAR(100) NOT NULL,
    responsible_party VARCHAR(100) NOT NULL,
    mitigation_strategy TEXT NOT NULL,
    risk_if_not_addressed TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'Identified' CHECK (status IN ('Identified', 'Under Review', 'Approved for Remediation', 'In Progress', 'Completed', 'Deferred')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample MAS gap analysis data
INSERT INTO mas_gap_analysis (
    domain, requirement_id, requirement_title, current_state, target_state, gap_description,
    business_impact, priority_score, implementation_effort, estimated_cost, estimated_timeline,
    responsible_party, mitigation_strategy, risk_if_not_addressed, status
) VALUES
('Cyber Hygiene', 'CH-2.2', 'Privileged Access Management', 'Basic privileged access controls with manual processes', 'Automated PAM solution with session recording and approval workflows', 'Lack of comprehensive privileged access management solution with automated controls', 'High - Potential for unauthorized privileged access and insider threats', 9, 'High - 6-12 months', 150000.00, '8-10 months', 'IT Security Team', 'Implement enterprise PAM solution with phased rollout starting with most critical systems', 'Increased risk of privileged account compromise and regulatory non-compliance', 'Approved for Remediation'),

('Data Governance', 'DG-1.2', 'Data Classification', 'Manual data classification for some systems only', 'Automated data classification across all systems with policy enforcement', 'Inconsistent data classification and lack of automated discovery and labeling', 'High - Risk of data breaches and regulatory violations', 8, 'Medium - 1-6 months', 80000.00, '4-6 months', 'Data Governance Team', 'Deploy data classification tools and establish governance processes with training', 'Data protection failures and potential regulatory penalties', 'In Progress'),

('Business Continuity Management', 'BCM-2.2', 'Testing and Exercises', 'Annual BCP testing for some critical functions', 'Quarterly testing of all critical functions with lessons learned integration', 'Insufficient frequency and scope of business continuity testing', 'Medium - Potential service disruptions during actual incidents', 7, 'Low - Less than 1 month', 25000.00, '2-3 months', 'Risk Management Team', 'Establish quarterly testing schedule and improve test scenarios', 'Inadequate preparedness for business disruptions', 'Under Review'),

('Cloud Computing', 'CC-2.2', 'Cloud Security Controls', 'Basic cloud security controls with limited monitoring', 'Comprehensive cloud security posture management with continuous monitoring', 'Gaps in cloud security monitoring and configuration management', 'High - Cloud security incidents and data exposure risks', 8, 'Medium - 1-6 months', 120000.00, '5-7 months', 'Cloud Security Team', 'Implement CSPM tools and enhance cloud security monitoring capabilities', 'Cloud security breaches and compliance violations', 'Identified'),

('Third Party Risk Management', 'TPRM-2.2', 'Ongoing Monitoring', 'Annual vendor assessments with limited continuous monitoring', 'Continuous third-party risk monitoring with real-time alerts', 'Lack of continuous monitoring of third-party risk posture changes', 'Medium - Undetected third-party security incidents', 6, 'Medium - 1-6 months', 75000.00, '3-5 months', 'Vendor Management Team', 'Implement third-party risk monitoring platform with automated assessments', 'Delayed detection of third-party security issues', 'Identified'),

('Access Management', 'AM-2.2', 'Segregation of Duties', 'Manual SoD controls with periodic reviews', 'Automated SoD controls with real-time conflict detection', 'Insufficient automation in segregation of duties enforcement', 'Medium - Risk of fraud and unauthorized transactions', 7, 'High - 6-12 months', 200000.00, '9-12 months', 'Identity Team', 'Implement automated SoD controls in core banking and financial systems', 'Increased fraud risk and regulatory compliance issues', 'Under Review'),

('Technology Risk Management', 'TRM-1.2', 'Technology Risk Appetite and Tolerance', 'Informal risk appetite statements', 'Quantified technology risk appetite with clear tolerance levels and metrics', 'Lack of quantified technology risk appetite and tolerance framework', 'High - Inconsistent risk decision making across the organization', 9, 'Low - Less than 1 month', 50000.00, '2-3 months', 'Risk Management Team', 'Develop quantified risk appetite statements with board approval and regular monitoring', 'Poor risk decision making and potential regulatory criticism', 'Approved for Remediation'),

('Incident Management', 'IM-2.2', 'Incident Reporting', 'Manual incident reporting with delays in regulatory notifications', 'Automated incident reporting with real-time regulatory notification capabilities', 'Delays in incident reporting to MAS and other regulators', 'High - Regulatory penalties for late incident reporting', 8
