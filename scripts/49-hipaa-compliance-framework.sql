-- Create HIPAA compliance framework and requirements
INSERT INTO compliance_frameworks (framework_name, description, version, effective_date, status)
VALUES (
  'HIPAA',
  'Health Insurance Portability and Accountability Act - Security Rule and Privacy Rule requirements',
  '2013',
  '2013-03-26',
  'Active'
) ON CONFLICT (framework_name) DO NOTHING;

-- Create HIPAA requirements table
CREATE TABLE IF NOT EXISTS hipaa_requirements (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    requirement_id VARCHAR(20) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'Required',
    status VARCHAR(50) NOT NULL DEFAULT 'Not Started',
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert HIPAA requirements
INSERT INTO hipaa_requirements (category, requirement_id, title, description, priority, status) VALUES
-- Administrative Safeguards
('Administrative Safeguards', '164.308(a)(1)', 'Security Officer', 'Assign security responsibilities to an individual', 'Required', 'Not Started'),
('Administrative Safeguards', '164.308(a)(2)', 'Assigned Security Responsibilities', 'Identify the security officer and document security responsibilities', 'Required', 'Not Started'),
('Administrative Safeguards', '164.308(a)(3)', 'Workforce Training', 'Implement procedures for authorizing access to PHI', 'Required', 'Not Started'),
('Administrative Safeguards', '164.308(a)(4)', 'Information Access Management', 'Implement policies and procedures for authorizing access to PHI', 'Required', 'Not Started'),
('Administrative Safeguards', '164.308(a)(5)', 'Security Awareness and Training', 'Implement security awareness and training program', 'Required', 'Not Started'),
('Administrative Safeguards', '164.308(a)(6)', 'Security Incident Procedures', 'Implement procedures to address security incidents', 'Required', 'Not Started'),
('Administrative Safeguards', '164.308(a)(7)', 'Contingency Plan', 'Establish procedures for responding to emergencies', 'Required', 'Not Started'),
('Administrative Safeguards', '164.308(a)(8)', 'Evaluation', 'Perform periodic technical and non-technical evaluation', 'Required', 'Not Started'),

-- Physical Safeguards
('Physical Safeguards', '164.310(a)(1)', 'Facility Access Controls', 'Implement policies to limit physical access to facilities', 'Required', 'Not Started'),
('Physical Safeguards', '164.310(a)(2)', 'Workstation Use', 'Implement policies for workstation use and access to PHI', 'Required', 'Not Started'),
('Physical Safeguards', '164.310(a)(3)', 'Device and Media Controls', 'Implement policies for receipt and removal of hardware and media', 'Required', 'Not Started'),

-- Technical Safeguards
('Technical Safeguards', '164.312(a)(1)', 'Access Control', 'Implement technical policies to allow only authorized access to PHI', 'Required', 'Not Started'),
('Technical Safeguards', '164.312(a)(2)', 'Audit Controls', 'Implement hardware, software, and procedural mechanisms for audit logs', 'Required', 'Not Started'),
('Technical Safeguards', '164.312(a)(3)', 'Integrity', 'Implement policies to ensure PHI is not improperly altered or destroyed', 'Required', 'Not Started'),
('Technical Safeguards', '164.312(a)(4)', 'Person or Entity Authentication', 'Implement procedures to verify identity before access to PHI', 'Required', 'Not Started'),
('Technical Safeguards', '164.312(a)(5)', 'Transmission Security', 'Implement technical security measures for PHI transmission', 'Required', 'Not Started'),

-- Privacy Rule
('Privacy Rule', '164.502(a)', 'Uses and Disclosures', 'General rules for uses and disclosures of PHI', 'Required', 'Not Started'),
('Privacy Rule', '164.504(a)', 'Business Associate Contracts', 'Obtain satisfactory assurances from business associates', 'Required', 'Not Started'),
('Privacy Rule', '164.506(a)', 'Consent for Uses and Disclosures', 'Obtain consent for uses and disclosures for treatment, payment, operations', 'Required', 'Not Started'),
('Privacy Rule', '164.508(a)', 'Authorization Required', 'Obtain authorization for uses and disclosures not otherwise permitted', 'Required', 'Not Started'),
('Privacy Rule', '164.510(a)', 'Uses and Disclosures Requiring Opportunity', 'Provide opportunity to agree or object to certain disclosures', 'Required', 'Not Started'),
('Privacy Rule', '164.512(a)', 'Uses and Disclosures for Public Interest', 'Permitted uses and disclosures for public interest and benefit', 'Required', 'Not Started'),
('Privacy Rule', '164.514(a)', 'De-identification of PHI', 'Standards for de-identification of protected health information', 'Required', 'Not Started'),
('Privacy Rule', '164.520(a)', 'Notice of Privacy Practices', 'Provide notice of privacy practices to individuals', 'Required', 'Not Started'),
('Privacy Rule', '164.522(a)', 'Rights to Request Privacy Protection', 'Honor requests for restrictions on uses and disclosures', 'Required', 'Not Started'),
('Privacy Rule', '164.524(a)', 'Access of Individuals to PHI', 'Provide individuals access to their protected health information', 'Required', 'Not Started');
