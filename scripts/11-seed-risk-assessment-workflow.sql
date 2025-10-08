-- Insert default risk assessment templates
INSERT INTO risk_assessment_templates (template_name, methodology, description, default_steps, default_criteria, created_by) VALUES
('ISO 27001 Risk Assessment', 'ISO27001', 'Comprehensive risk assessment following ISO 27001 standards', 
 '[
   {"step": 1, "name": "Define Scope and Context", "description": "Establish the scope, boundaries, and context of the risk assessment"},
   {"step": 2, "name": "Risk Identification", "description": "Identify information security risks within the defined scope"},
   {"step": 3, "name": "Risk Analysis", "description": "Analyze identified risks to determine likelihood and impact"},
   {"step": 4, "name": "Risk Evaluation", "description": "Evaluate risks against established criteria and risk appetite"},
   {"step": 5, "name": "Risk Treatment", "description": "Develop and implement risk treatment plans"},
   {"step": 6, "name": "Review and Approval", "description": "Review assessment results and obtain management approval"}
 ]'::jsonb,
 '{
   "likelihood": [
     {"level": 1, "name": "Very Low", "description": "Rare occurrence (0-5%)", "color": "green"},
     {"level": 2, "name": "Low", "description": "Unlikely to occur (6-25%)", "color": "blue"},
     {"level": 3, "name": "Medium", "description": "Possible occurrence (26-50%)", "color": "yellow"},
     {"level": 4, "name": "High", "description": "Likely to occur (51-75%)", "color": "orange"},
     {"level": 5, "name": "Very High", "description": "Almost certain (76-100%)", "color": "red"}
   ],
   "impact": [
     {"level": 1, "name": "Negligible", "description": "Minimal impact on operations", "color": "green"},
     {"level": 2, "name": "Minor", "description": "Limited impact, easily managed", "color": "blue"},
     {"level": 3, "name": "Moderate", "description": "Noticeable impact requiring management attention", "color": "yellow"},
     {"level": 4, "name": "Major", "description": "Significant impact affecting business operations", "color": "orange"},
     {"level": 5, "name": "Catastrophic", "description": "Severe impact threatening business continuity", "color": "red"}
   ]
 }'::jsonb,
 'system'),

('NIST Cybersecurity Framework', 'NIST', 'Risk assessment based on NIST Cybersecurity Framework', 
 '[
   {"step": 1, "name": "Identify", "description": "Identify assets, threats, and vulnerabilities"},
   {"step": 2, "name": "Protect", "description": "Assess current protective measures"},
   {"step": 3, "name": "Detect", "description": "Evaluate detection capabilities"},
   {"step": 4, "name": "Respond", "description": "Review incident response procedures"},
   {"step": 5, "name": "Recover", "description": "Assess recovery and continuity plans"},
   {"step": 6, "name": "Risk Treatment", "description": "Develop comprehensive risk treatment strategy"}
 ]'::jsonb,
 '{
   "likelihood": [
     {"level": 1, "name": "Very Low", "description": "Highly unlikely", "color": "green"},
     {"level": 2, "name": "Low", "description": "Unlikely", "color": "blue"},
     {"level": 3, "name": "Medium", "description": "Possible", "color": "yellow"},
     {"level": 4, "name": "High", "description": "Likely", "color": "orange"},
     {"level": 5, "name": "Very High", "description": "Almost certain", "color": "red"}
   ],
   "impact": [
     {"level": 1, "name": "Very Low", "description": "Minimal business impact", "color": "green"},
     {"level": 2, "name": "Low", "description": "Minor business impact", "color": "blue"},
     {"level": 3, "name": "Medium", "description": "Moderate business impact", "color": "yellow"},
     {"level": 4, "name": "High", "description": "Major business impact", "color": "orange"},
     {"level": 5, "name": "Very High", "description": "Catastrophic business impact", "color": "red"}
   ]
 }'::jsonb,
 'system');

-- Insert sample risk categories if they don't exist
INSERT INTO risk_categories (category_name, description) VALUES
('Information Security', 'Risks related to confidentiality, integrity, and availability of information'),
('Operational', 'Risks arising from operational processes and procedures'),
('Technology', 'Risks related to technology infrastructure and systems'),
('Compliance', 'Risks related to regulatory and legal compliance'),
('Strategic', 'Risks that could impact strategic objectives'),
('Financial', 'Risks with direct financial implications'),
('Reputational', 'Risks that could damage organizational reputation'),
('Human Resources', 'Risks related to personnel and human capital')
ON CONFLICT DO NOTHING;
