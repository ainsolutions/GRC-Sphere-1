-- Insert sample threat data
INSERT INTO threats (threat_id, name, description, category, source, threat_level, status, indicators_of_compromise, mitigation_strategies, threat_references) VALUES
('THR-001', 'Advanced Persistent Threat (APT)', 'Sophisticated, long-term cyberattack where attackers gain unauthorized access to networks and remain undetected for extended periods', 'malware', 'threat-intelligence', 'critical', 'active', 
 '["suspicious network traffic", "unusual login patterns", "lateral movement indicators"]'::jsonb,
 '["network segmentation", "endpoint detection", "user behavior analytics"]'::jsonb,
 '["MITRE ATT&CK Framework", "NIST Cybersecurity Framework"]'::jsonb),

('THR-002', 'Ransomware Attack', 'Malicious software that encrypts files and demands payment for decryption keys', 'ransomware', 'security-vendor', 'critical', 'active',
 '["file encryption patterns", "ransom notes", "suspicious executables"]'::jsonb,
 '["regular backups", "endpoint protection", "user training"]'::jsonb,
 '["FBI IC3 Ransomware Reports", "CISA Ransomware Guide"]'::jsonb),

('THR-003', 'Phishing Campaign', 'Fraudulent attempts to obtain sensitive information by disguising as trustworthy entities', 'phishing', 'internal', 'high', 'monitoring',
 '["suspicious email domains", "credential harvesting sites", "social engineering tactics"]'::jsonb,
 '["email filtering", "user awareness training", "multi-factor authentication"]'::jsonb,
 '["Anti-Phishing Working Group", "SANS Phishing Resources"]'::jsonb),

('THR-004', 'Insider Threat', 'Security risk posed by individuals within the organization who have authorized access', 'insider-threat', 'internal', 'high', 'monitoring',
 '["unusual data access patterns", "policy violations", "behavioral changes"]'::jsonb,
 '["access controls", "monitoring systems", "background checks"]'::jsonb,
 '["CERT Insider Threat Guide", "NIST SP 800-53"]'::jsonb),

('THR-005', 'DDoS Attack', 'Distributed Denial of Service attack aimed at making online services unavailable', 'ddos', 'external', 'medium', 'mitigated',
 '["traffic spikes", "service degradation", "botnet activity"]'::jsonb,
 '["DDoS protection services", "traffic filtering", "incident response plan"]'::jsonb,
 '["Cloudflare DDoS Reports", "Akamai State of the Internet"]'::jsonb),

('THR-006', 'DDoS Attack - Mirai Botnet', 'Distributed denial of service attacks using IoT devices infected with Mirai malware', 'ddos', 'threat-intelligence', 'medium', 'monitoring',
 '["198.51.100.0/24", "203.0.113.0/24", "Mirai variant signatures"]'::jsonb,
 '["DDoS protection service", "Rate limiting", "Traffic analysis"]'::jsonb,
 '["US-CERT Alert TA16-288A", "Krebs on Security Report"]'::jsonb),

('THR-007', 'Social Engineering - Business Email Compromise', 'Sophisticated social engineering attacks targeting finance departments', 'social-engineering', 'industry-report', 'high', 'active',
 '["CEO impersonation emails", "Urgent payment requests", "External email warnings bypassed"]'::jsonb,
 '["Email authentication", "Approval workflows", "Security awareness training"]'::jsonb,
 '["FBI IC3 Report", "ACFE Fraud Report"]'::jsonb),

('THR-008', 'Zero-Day Exploit - Microsoft Exchange', 'Zero-day vulnerabilities in Microsoft Exchange Server being actively exploited', 'malware', 'security-vendor', 'critical', 'mitigated',
 '["CVE-2021-26855", "CVE-2021-26857", "CVE-2021-26858", "CVE-2021-27065"]'::jsonb,
 '["Emergency patching", "Server isolation", "Threat hunting"]'::jsonb,
 '["Microsoft Security Response", "CISA Alert AA21-062A"]'::jsonb);
