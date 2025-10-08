-- Insert sample procedure executions
INSERT INTO procedure_executions (execution_id, procedure_id, executed_by, status, started_at, completed_at, duration_minutes, steps_completed, notes) VALUES
('EXEC001', 
(SELECT id FROM procedures WHERE procedure_id = 'PROC001'), 
1, 'completed', 
'2024-01-15 09:00:00', 
'2024-01-15 09:45:00', 
45,
'[
  {"id": 1, "title": "Receive access request", "completed": true, "timestamp": "2024-01-15T09:05:00Z"},
  {"id": 2, "title": "Verify business justification", "completed": true, "timestamp": "2024-01-15T09:15:00Z"},
  {"id": 3, "title": "Check existing access", "completed": true, "timestamp": "2024-01-15T09:25:00Z"},
  {"id": 4, "title": "Provision access", "completed": true, "timestamp": "2024-01-15T09:35:00Z"},
  {"id": 5, "title": "Document access", "completed": true, "timestamp": "2024-01-15T09:40:00Z"},
  {"id": 6, "title": "Notify stakeholders", "completed": true, "timestamp": "2024-01-15T09:45:00Z"}
]'::jsonb,
'Standard user access provisioning for new employee John Smith'),

('EXEC002',
(SELECT id FROM procedures WHERE procedure_id = 'PROC002'),
1, 'in_progress',
'2024-01-20 14:30:00',
NULL,
NULL,
'[
  {"id": 1, "title": "Incident detection", "completed": true, "timestamp": "2024-01-20T14:30:00Z"},
  {"id": 2, "title": "Initial assessment", "completed": true, "timestamp": "2024-01-20T14:35:00Z"},
  {"id": 3, "title": "Activate response team", "completed": true, "timestamp": "2024-01-20T14:40:00Z"},
  {"id": 4, "title": "Contain incident", "completed": false},
  {"id": 5, "title": "Investigate and analyze", "completed": false},
  {"id": 6, "title": "Eradicate threat", "completed": false},
  {"id": 7, "title": "Recover systems", "completed": false},
  {"id": 8, "title": "Document lessons learned", "completed": false}
]'::jsonb,
'Responding to suspicious network activity detected by SIEM'),

('EXEC003',
(SELECT id FROM procedures WHERE procedure_id = 'PROC001'),
1, 'completed',
'2024-01-18 11:00:00',
'2024-01-18 11:30:00',
30,
'[
  {"id": 1, "title": "Receive access request", "completed": true, "timestamp": "2024-01-18T11:00:00Z"},
  {"id": 2, "title": "Verify business justification", "completed": true, "timestamp": "2024-01-18T11:10:00Z"},
  {"id": 3, "title": "Check existing access", "completed": true, "timestamp": "2024-01-18T11:15:00Z"},
  {"id": 4, "title": "Provision access", "completed": true, "timestamp": "2024-01-18T11:20:00Z"},
  {"id": 5, "title": "Document access", "completed": true, "timestamp": "2024-01-18T11:25:00Z"},
  {"id": 6, "title": "Notify stakeholders", "completed": true, "timestamp": "2024-01-18T11:30:00Z"}
]'::jsonb,
'Access provisioning for contractor Sarah Johnson'),

('EXEC004',
(SELECT id FROM procedures WHERE procedure_id = 'PROC003'),
1, 'failed',
'2024-01-22 16:00:00',
'2024-01-22 18:30:00',
150,
'[
  {"id": 1, "title": "Breach identification", "completed": true, "timestamp": "2024-01-22T16:00:00Z"},
  {"id": 2, "title": "Immediate containment", "completed": true, "timestamp": "2024-01-22T16:15:00Z"},
  {"id": 3, "title": "Impact assessment", "completed": true, "timestamp": "2024-01-22T17:00:00Z"},
  {"id": 4, "title": "Legal notification", "completed": false, "error": "Legal team unavailable"},
  {"id": 5, "title": "Regulatory notification", "completed": false},
  {"id": 6, "title": "Affected party notification", "completed": false},
  {"id": 7, "title": "Remediation", "completed": false}
]'::jsonb,
'Data breach response - failed due to legal team unavailability'),

('EXEC005',
(SELECT id FROM procedures WHERE procedure_id = 'PROC001'),
1, 'cancelled',
'2024-01-25 10:00:00',
'2024-01-25 10:15:00',
15,
'[
  {"id": 1, "title": "Receive access request", "completed": true, "timestamp": "2024-01-25T10:00:00Z"},
  {"id": 2, "title": "Verify business justification", "completed": false, "error": "Request cancelled by manager"},
  {"id": 3, "title": "Check existing access", "completed": false},
  {"id": 4, "title": "Provision access", "completed": false},
  {"id": 5, "title": "Document access", "completed": false},
  {"id": 6, "title": "Notify stakeholders", "completed": false}
]'::jsonb,
'Access request cancelled due to role change')
ON CONFLICT (execution_id) DO NOTHING;
