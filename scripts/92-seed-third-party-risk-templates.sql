-- Seed third party risk assessment templates based on the provided template

INSERT INTO third_party_risk_templates (category_id, category_name, risk_id, risk_title, control_catalogue) VALUES
-- Information Security Governance
('1.0', 'Information Security Governance', '1.1', 'Vendor Information Security Risk', 'Does your organization maintain a security program?'),
('1.0', 'Information Security Governance', '1.2', 'Vendor Information Security Risk', 'Who is responsible for managing the security program?'),
('1.0', 'Information Security Governance', '1.3', 'Vendor Information Security Risk', 'Does your organization have a public information security policy?'),
('1.0', 'Information Security Governance', '1.4', 'Vendor Information Security Risk', 'What guidelines does your security program follow?'),

-- Data Security Controls
('2.0', 'Data Security Controls', '2.1', 'Vendor Data Center Security Risk', 'Do you work in a shared office space?'),
('2.0', 'Data Security Controls', '2.2', 'Vendor Data Center Security Risk', 'Is there a protocol in place for operations when your office is inaccessible?'),
('2.0', 'Data Security Controls', '2.3', 'Vendor Data Center Security Risk', 'Is there a policy in place for physical security requirements for your business?'),
('2.0', 'Data Security Controls', '2.4', 'Vendor Data Center Security Risk', 'What are the geographic locations of your data centers?'),

-- Web Application Security
('3.0', 'Web Application Security', '3.1', 'Vendor Web Application Security Risk', 'What is the name of your web application? What is its function?'),
('3.0', 'Web Application Security', '3.2', 'Vendor Web Application Security Risk', 'How do you report application security vulnerabilities?'),
('3.0', 'Web Application Security', '3.3', 'Vendor Web Application Security Risk', 'Does your web application have an SSL certificate?'),
('3.0', 'Web Application Security', '3.4', 'Vendor Web Application Security Risk', 'Does your application offer single sign-on (SSO)?'),
('3.0', 'Web Application Security', '3.5', 'Vendor Web Application Security Risk', 'Does the application can apply API rate limiting?'),
('3.0', 'Web Application Security', '3.6', 'Vendor Web Application Security Risk', 'Does the application can apply API session rate limiting?'),
('3.0', 'Web Application Security', '3.7', 'Vendor Web Application Security Risk', 'Does the application is protected by Web application firewall?'),

-- Infrastructure Protection
('4.0', 'Infrastructure Protection', '4.1', 'Vendor Infrastructure Risk', 'Do you use a VPN?'),
('4.0', 'Infrastructure Protection', '4.2', 'Vendor Infrastructure Risk', 'What is the process for backing up your data?'),
('4.0', 'Infrastructure Protection', '4.3', 'Vendor Infrastructure Risk', 'Do you keep a record of security events?'),
('4.0', 'Infrastructure Protection', '4.4', 'Vendor Infrastructure Risk', 'How do you protect company devices from malware?'),

-- Security Controls and Technology
('5.0', 'Security Controls and Technology', '5.1', 'Vendor Cyber Security Risk', 'Do you keep an inventory of authorized devices and software?'),
('5.0', 'Security Controls and Technology', '5.2', 'Vendor Cyber Security Risk', 'How do you monitor the security of your wireless networks?'),
('5.0', 'Security Controls and Technology', '5.3', 'Vendor Cyber Security Risk', 'How do you plan for and avert a cybersecurity incident?'),
('5.0', 'Security Controls and Technology', '5.4', 'Vendor Cyber Security Risk', 'In the event of an incident, how do you plan to communicate it to us?'),
('5.0', 'Security Controls and Technology', '5.5', 'Vendor Cyber Security Risk', 'In case of SaaS application, does the application monitoring done through SIEM?'),

-- Other Controls
('6.0', 'Other Controls', '6.1', 'Vendor Information Security Risk', 'How do you prioritize critical assets for your organization?'),
('6.0', 'Other Controls', '6.2', 'Vendor Information Security Risk', 'Do you outsource security functions to third-party providers?'),
('6.0', 'Other Controls', '6.3', 'Vendor Information Security Risk', 'How frequently are employees trained on policies in your organization?'),
('6.0', 'Other Controls', '6.4', 'Vendor Information Security Risk', 'When was the last time you had a risk assessment by a third party? Results?');
