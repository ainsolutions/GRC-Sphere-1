-- Seed some sample test plans for existing controls
INSERT INTO control_test_plans (control_id, test_name, test_description, test_type, test_frequency, test_procedures, expected_evidence, test_criteria, assigned_tester, created_by) VALUES
(1, 'Access Control Policy Review', 'Annual review of access control policies and procedures', 'Manual', 'Annually', 
 '1. Review current access control policy document
  2. Verify policy covers all required areas
  3. Check for updates needed based on regulatory changes
  4. Validate approval and communication processes', 
 'Updated policy document, approval records, communication evidence', 
 'Policy is current, complete, and properly approved', 
 'Security Manager', 'system'),

(2, 'MFA Implementation Test', 'Quarterly testing of multi-factor authentication systems', 'Automated', 'Quarterly',
 '1. Test MFA enrollment process
  2. Verify MFA bypass procedures
  3. Test MFA recovery mechanisms
  4. Validate MFA reporting and monitoring',
 'Test results, screenshots, log files, monitoring reports',
 'All MFA functions work correctly, no bypass vulnerabilities',
 'IT Security Team', 'system'),

(3, 'Business Continuity Plan Test', 'Semi-annual testing of business continuity procedures', 'Walkthrough', 'Semi-Annually',
 '1. Conduct tabletop exercise
  2. Test communication procedures
  3. Verify backup systems functionality
  4. Review recovery time objectives',
 'Exercise documentation, communication logs, system test results',
 'All procedures execute within defined timeframes',
 'Risk Manager', 'system');

-- Insert some sample test executions
INSERT INTO control_test_executions (control_id, test_plan_id, test_date, tester_name, tester_email, test_result, effectiveness_rating, test_notes, evidence_collected, next_test_date) VALUES
(1, 1, '2024-01-15', 'John Smith', 'john.smith@company.com', 'Pass', 'Effective', 
 'Policy review completed successfully. Minor updates made to reflect new regulations.',
 'Updated policy v2.1, approval email from CISO, staff notification email',
 '2025-01-15'),

(2, 2, '2024-02-01', 'Jane Doe', 'jane.doe@company.com', 'Pass', 'Effective',
 'MFA testing completed. All systems functioning correctly.',
 'Test scripts output, monitoring dashboard screenshots',
 '2024-05-01'),

(3, 3, '2024-03-01', 'Mike Johnson', 'mike.johnson@company.com', 'Partial', 'Partially Effective',
 'Tabletop exercise revealed communication delays. Backup systems tested successfully.',
 'Exercise report, communication timeline, system test logs',
 '2024-09-01');

-- Update controls table with test information
UPDATE controls SET 
  last_test_date = '2024-01-15',
  last_test_result = 'Pass',
  test_status = 'Tested'
WHERE id = 1;

UPDATE controls SET 
  last_test_date = '2024-02-01',
  last_test_result = 'Pass',
  test_status = 'Tested'
WHERE id = 2;

UPDATE controls SET 
  last_test_date = '2024-03-01',
  last_test_result = 'Partial',
  test_status = 'Tested'
WHERE id = 3;

-- Insert some test issues for the partial test result
INSERT INTO control_test_issues (test_execution_id, issue_title, issue_description, severity, assigned_to, due_date, status) VALUES
(3, 'Communication Delays During Emergency', 
 'During the tabletop exercise, there were significant delays in notifying key stakeholders. The notification process took 45 minutes instead of the target 15 minutes.',
 'Medium', 'Risk Manager', '2024-04-01', 'Open');

-- Schedule some upcoming tests
INSERT INTO control_test_schedule (control_id, scheduled_date, test_type, assigned_tester, status) VALUES
(2, '2024-05-01', 'Automated', 'IT Security Team', 'Scheduled'),
(3, '2024-09-01', 'Walkthrough', 'Risk Manager', 'Scheduled'),
(1, '2025-01-15', 'Manual', 'Security Manager', 'Scheduled');
