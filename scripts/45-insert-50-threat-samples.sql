-- Insert 50 comprehensive threat samples into the threats table
INSERT INTO threats (threat_id, name, description, category, source, threat_level, status, indicators_of_compromise, mitigation_strategies, threat_references) VALUES

-- Existing 8 records are already in the database, adding 42 more

('THR-009', 'SQL Injection Attack', 'Code injection technique used to attack data-driven applications by inserting malicious SQL statements', 'web-attack', 'security-vendor', 'high', 'active',
 '["unusual database queries", "error messages in logs", "unexpected data access patterns"]'::jsonb,
 '["input validation", "parameterized queries", "web application firewall"]'::jsonb,
 '["OWASP Top 10", "SANS SQL Injection Prevention"]'::jsonb),

('THR-010', 'Cross-Site Scripting (XSS)', 'Type of injection attack where malicious scripts are injected into trusted websites', 'web-attack', 'internal', 'medium', 'monitoring',
 '["malicious script execution", "session hijacking attempts", "cookie theft"]'::jsonb,
 '["input sanitization", "content security policy", "output encoding"]'::jsonb,
 '["OWASP XSS Prevention", "Mozilla CSP Guide"]'::jsonb),

('THR-011', 'Credential Stuffing', 'Automated injection of breached username/password pairs to fraudulently gain access', 'brute-force', 'threat-intelligence', 'high', 'active',
 '["multiple failed login attempts", "login from unusual locations", "bot-like behavior patterns"]'::jsonb,
 '["account lockout policies", "CAPTCHA implementation", "rate limiting"]'::jsonb,
 '["OWASP Credential Stuffing Guide", "Akamai Bot Management"]'::jsonb),

('THR-012', 'Man-in-the-Middle Attack', 'Eavesdropping attack where attacker secretly relays communication between two parties', 'network-attack', 'external', 'high', 'monitoring',
 '["certificate warnings", "unexpected SSL/TLS handshakes", "network traffic anomalies"]'::jsonb,
 '["certificate pinning", "HTTPS enforcement", "network monitoring"]'::jsonb,
 '["NIST Cryptographic Standards", "RFC 8446 TLS 1.3"]'::jsonb),

('THR-013', 'Supply Chain Attack', 'Targeting less-secure elements in the supply chain to compromise the main target', 'supply-chain', 'industry-report', 'critical', 'active',
 '["compromised third-party components", "unusual software behavior", "unauthorized code changes"]'::jsonb,
 '["vendor security assessments", "code signing verification", "dependency scanning"]'::jsonb,
 '["NIST Supply Chain Security", "CISA Supply Chain Guidance"]'::jsonb),

('THR-014', 'Zero-Day Vulnerability', 'Previously unknown software vulnerability that hackers can exploit', 'malware', 'security-vendor', 'critical', 'monitoring',
 '["unusual system behavior", "unexpected network connections", "unknown process execution"]'::jsonb,
 '["behavioral analysis", "sandboxing", "threat hunting"]'::jsonb,
 '["CVE Database", "Zero Day Initiative"]'::jsonb),

('THR-015', 'Cryptojacking', 'Unauthorized use of computing resources to mine cryptocurrency', 'malware', 'threat-intelligence', 'medium', 'active',
 '["high CPU usage", "slow system performance", "cryptocurrency mining scripts"]'::jsonb,
 '["endpoint protection", "network monitoring", "browser security extensions"]'::jsonb,
 '["Symantec Cryptojacking Report", "Malwarebytes Threat Report"]'::jsonb),

('THR-016', 'Business Logic Flaw', 'Vulnerability in application design that allows attackers to abuse legitimate functionality', 'web-attack', 'internal', 'medium', 'monitoring',
 '["unusual transaction patterns", "privilege escalation attempts", "workflow bypasses"]'::jsonb,
 '["secure code review", "business logic testing", "access controls"]'::jsonb,
 '["OWASP Business Logic Security", "SANS Secure Coding"]'::jsonb),

('THR-017', 'DNS Spoofing', 'Attack that corrupts DNS server cache with false information', 'network-attack', 'external', 'high', 'monitoring',
 '["DNS resolution anomalies", "traffic redirection", "certificate mismatches"]'::jsonb,
 '["DNS security extensions", "secure DNS resolvers", "network monitoring"]'::jsonb,
 '["RFC 4033 DNSSEC", "NIST DNS Security Guidelines"]'::jsonb),

('THR-018', 'Watering Hole Attack', 'Targeting websites frequently visited by specific groups to compromise their systems', 'web-attack', 'threat-intelligence', 'high', 'active',
 '["compromised legitimate websites", "drive-by downloads", "targeted malware delivery"]'::jsonb,
 '["web filtering", "endpoint protection", "user awareness training"]'::jsonb,
 '["FireEye Watering Hole Analysis", "Kaspersky APT Reports"]'::jsonb),

('THR-019', 'Fileless Malware', 'Malware that operates entirely in memory without writing files to disk', 'malware', 'security-vendor', 'high', 'active',
 '["memory-based attacks", "PowerShell abuse", "WMI exploitation"]'::jsonb,
 '["memory protection", "behavioral analysis", "script execution monitoring"]'::jsonb,
 '["MITRE ATT&CK T1055", "Carbon Black Fileless Report"]'::jsonb),

('THR-020', 'API Security Breach', 'Exploitation of vulnerabilities in application programming interfaces', 'web-attack', 'internal', 'high', 'monitoring',
 '["unusual API calls", "authentication bypasses", "data exfiltration via APIs"]'::jsonb,
 '["API gateway security", "rate limiting", "authentication tokens"]'::jsonb,
 '["OWASP API Security Top 10", "REST Security Guidelines"]'::jsonb),

('THR-021', 'Container Escape', 'Breaking out of container isolation to access the host system', 'container-security', 'security-vendor', 'high', 'monitoring',
 '["privilege escalation in containers", "host system access", "kernel exploits"]'::jsonb,
 '["container hardening", "runtime security", "least privilege principles"]'::jsonb,
 '["NIST Container Security", "CIS Docker Benchmarks"]'::jsonb),

('THR-022', 'Cloud Misconfiguration', 'Improperly configured cloud services leading to security vulnerabilities', 'cloud-security', 'internal', 'medium', 'active',
 '["publicly accessible storage", "overprivileged access", "unencrypted data"]'::jsonb,
 '["cloud security posture management", "configuration auditing", "access reviews"]'::jsonb,
 '["AWS Security Best Practices", "Azure Security Center"]'::jsonb),

('THR-023', 'IoT Device Compromise', 'Exploitation of vulnerabilities in Internet of Things devices', 'iot-security', 'threat-intelligence', 'medium', 'monitoring',
 '["unusual device behavior", "unauthorized network connections", "firmware modifications"]'::jsonb,
 '["device firmware updates", "network segmentation", "IoT security monitoring"]'::jsonb,
 '["NIST IoT Security", "IoT Security Foundation Guidelines"]'::jsonb),

('THR-024', 'Deepfake Attack', 'Use of AI-generated fake audio or video content for malicious purposes', 'social-engineering', 'industry-report', 'medium', 'emerging',
 '["synthetic media detection", "voice/video inconsistencies", "social engineering attempts"]'::jsonb,
 '["deepfake detection tools", "verification procedures", "awareness training"]'::jsonb,
 '["DARPA MediFor Program", "Partnership on AI Guidelines"]'::jsonb),

('THR-025', 'Quantum Computing Threat', 'Potential future threat to current cryptographic systems from quantum computers', 'cryptographic', 'research', 'low', 'emerging',
 '["cryptographic algorithm weaknesses", "quantum-resistant requirements", "migration planning needs"]'::jsonb,
 '["post-quantum cryptography", "crypto-agility", "quantum-safe algorithms"]'::jsonb,
 '["NIST Post-Quantum Cryptography", "NSA Quantum Security Guidelines"]'::jsonb),

('THR-026', 'Living Off the Land', 'Using legitimate system tools and processes for malicious purposes', 'malware', 'threat-intelligence', 'high', 'active',
 '["abuse of legitimate tools", "PowerShell/WMI misuse", "system administration tool abuse"]'::jsonb,
 '["application whitelisting", "behavioral monitoring", "privilege restrictions"]'::jsonb,
 '["MITRE ATT&CK Living Off the Land", "LOLBAS Project"]'::jsonb),

('THR-027', 'Shadow IT', 'Use of unauthorized IT systems, devices, software, or services', 'governance', 'internal', 'medium', 'active',
 '["unauthorized cloud services", "unapproved software installations", "data in unsanctioned systems"]'::jsonb,
 '["IT governance policies", "cloud access security brokers", "asset discovery tools"]'::jsonb,
 '["ISACA Shadow IT Guidelines", "Gartner CASB Research"]'::jsonb),

('THR-028', 'Typosquatting', 'Registering domains similar to legitimate ones to deceive users', 'phishing', 'external', 'medium', 'monitoring',
 '["suspicious domain registrations", "brand impersonation", "user misdirection"]'::jsonb,
 '["domain monitoring", "brand protection services", "user education"]'::jsonb,
 '["Anti-Cybersquatting Act", "WIPO Domain Name Guidelines"]'::jsonb),

('THR-029', 'Juice Jacking', 'Cyber attack using public USB charging stations to install malware or steal data', 'physical-security', 'security-vendor', 'low', 'monitoring',
 '["unauthorized data access via USB", "malware installation through charging ports", "device compromise"]'::jsonb,
 '["USB data blockers", "portable chargers", "USB port security policies"]'::jsonb,
 '["FBI Juice Jacking Warning", "FCC Consumer Alert"]'::jsonb),

('THR-030', 'Smishing', 'Phishing attacks conducted via SMS text messages', 'phishing', 'external', 'medium', 'active',
 '["suspicious text messages", "malicious links in SMS", "credential harvesting attempts"]'::jsonb,
 '["SMS filtering", "user awareness training", "mobile security solutions"]'::jsonb,
 '["FTC Smishing Guidelines", "CTIA Security Best Practices"]'::jsonb),

('THR-031', 'Vishing', 'Voice phishing attacks conducted over phone calls', 'social-engineering', 'external', 'medium', 'active',
 '["suspicious phone calls", "social engineering attempts", "voice impersonation"]'::jsonb,
 '["caller ID verification", "voice authentication", "employee training"]'::jsonb,
 '["FCC Robocall Guidelines", "AARP Fraud Prevention"]'::jsonb),

('THR-032', 'Rogue Access Point', 'Unauthorized wireless access point that appears to be legitimate', 'network-attack', 'external', 'medium', 'monitoring',
 '["unauthorized wireless networks", "evil twin access points", "network impersonation"]'::jsonb,
 '["wireless intrusion detection", "network monitoring", "secure WiFi policies"]'::jsonb,
 '["NIST Wireless Security Guidelines", "WiFi Alliance Security"]'::jsonb),

('THR-033', 'Bluetooth Attack', 'Exploitation of Bluetooth protocol vulnerabilities', 'wireless-attack', 'threat-intelligence', 'low', 'monitoring',
 '["unauthorized Bluetooth connections", "device pairing attempts", "data exfiltration via Bluetooth"]'::jsonb,
 '["Bluetooth security settings", "device pairing policies", "wireless monitoring"]'::jsonb,
 '["Bluetooth SIG Security Guidelines", "NIST Bluetooth Security"]'::jsonb),

('THR-034', 'USB Drop Attack', 'Physical attack using infected USB devices left for targets to find', 'physical-security', 'internal', 'medium', 'monitoring',
 '["unknown USB devices", "autorun malware", "physical security breaches"]'::jsonb,
 '["USB port controls", "endpoint protection", "security awareness training"]'::jsonb,
 '["SANS USB Security", "NIST Physical Security Guidelines"]'::jsonb),

('THR-035', 'Shoulder Surfing', 'Observing sensitive information by looking over someone shoulder', 'physical-security', 'internal', 'low', 'monitoring',
 '["visual information theft", "password observation", "screen viewing"]'::jsonb,
 '["privacy screens", "workspace design", "security awareness"]'::jsonb,
 '["Physical Security Best Practices", "Workplace Security Guidelines"]'::jsonb),

('THR-036', 'Dumpster Diving', 'Searching through trash to find sensitive information', 'physical-security', 'external', 'low', 'monitoring',
 '["improper document disposal", "sensitive information in trash", "physical reconnaissance"]'::jsonb,
 '["secure document destruction", "clean desk policies", "waste management procedures"]'::jsonb,
 '["Information Destruction Standards", "Privacy Protection Guidelines"]'::jsonb),

('THR-037', 'Tailgating', 'Following authorized personnel into restricted areas without proper authentication', 'physical-security', 'internal', 'medium', 'monitoring',
 '["unauthorized facility access", "security door breaches", "visitor policy violations"]'::jsonb,
 '["access control systems", "security guards", "employee training"]'::jsonb,
 '["Physical Access Control Standards", "Facility Security Guidelines"]'::jsonb),

('THR-038', 'Pretexting', 'Creating fabricated scenarios to engage victims and steal information', 'social-engineering', 'external', 'medium', 'active',
 '["impersonation attempts", "false identity claims", "information gathering calls"]'::jsonb,
 '["identity verification procedures", "employee training", "incident reporting"]'::jsonb,
 '["Social Engineering Defense", "Identity Verification Best Practices"]'::jsonb),

('THR-039', 'Baiting', 'Offering something enticing to spark curiosity and prompt victims to take action', 'social-engineering', 'external', 'medium', 'monitoring',
 '["suspicious offers", "too-good-to-be-true deals", "curiosity-driven attacks"]'::jsonb,
 '["security awareness training", "email filtering", "incident response procedures"]'::jsonb,
 '["Social Engineering Awareness", "Phishing Prevention Guidelines"]'::jsonb),

('THR-040', 'Quid Pro Quo', 'Offering a service or benefit in exchange for information or access', 'social-engineering', 'external', 'medium', 'monitoring',
 '["fake technical support", "service exchange offers", "information trading attempts"]'::jsonb,
 '["verification procedures", "employee training", "help desk security protocols"]'::jsonb,
 '["Help Desk Security Guidelines", "Social Engineering Prevention"]'::jsonb),

('THR-041', 'Scareware', 'Malware designed to frighten users into purchasing unnecessary software', 'malware', 'external', 'low', 'monitoring',
 '["fake security warnings", "pop-up advertisements", "unnecessary software purchases"]'::jsonb,
 '["ad blockers", "user education", "endpoint protection"]'::jsonb,
 '["FTC Scareware Warnings", "Consumer Protection Guidelines"]'::jsonb),

('THR-042', 'Rogueware', 'Fake antivirus software that claims to detect threats but actually installs malware', 'malware', 'external', 'medium', 'monitoring',
 '["fake antivirus alerts", "rogue security software", "system performance degradation"]'::jsonb,
 '["legitimate antivirus software", "software verification", "user training"]'::jsonb,
 '["Antivirus Testing Organizations", "Software Authenticity Guidelines"]'::jsonb),

('THR-043', 'Adware', 'Software that automatically displays or downloads advertising material', 'malware', 'external', 'low', 'monitoring',
 '["excessive advertisements", "browser redirects", "system slowdown"]'::jsonb,
 '["ad blockers", "browser security settings", "regular system scans"]'::jsonb,
 '["Browser Security Guidelines", "Adware Removal Tools"]'::jsonb),

('THR-044', 'Spyware', 'Software that secretly monitors and collects user information', 'malware', 'external', 'high', 'active',
 '["unauthorized data collection", "keylogging activity", "privacy violations"]'::jsonb,
 '["anti-spyware tools", "privacy settings", "regular security scans"]'::jsonb,
 '["Privacy Protection Standards", "Spyware Detection Guidelines"]'::jsonb),

('THR-045', 'Rootkit', 'Malware designed to maintain persistent access while hiding its presence', 'malware', 'threat-intelligence', 'high', 'active',
 '["hidden processes", "system file modifications", "kernel-level access"]'::jsonb,
 '["rootkit scanners", "system integrity monitoring", "behavioral analysis"]'::jsonb,
 '["Rootkit Detection Techniques", "System Security Monitoring"]'::jsonb),

('THR-046', 'Bootkit', 'Malware that infects the master boot record or boot sector', 'malware', 'security-vendor', 'high', 'monitoring',
 '["boot process anomalies", "system startup issues", "persistent infections"]'::jsonb,
 '["secure boot", "boot sector protection", "system recovery procedures"]'::jsonb,
 '["UEFI Security Guidelines", "Boot Security Standards"]'::jsonb),

('THR-047', 'Logic Bomb', 'Malicious code that executes when specific conditions are met', 'malware', 'internal', 'high', 'monitoring',
 '["time-based triggers", "condition-based execution", "delayed malicious activity"]'::jsonb,
 '["code review processes", "access controls", "system monitoring"]'::jsonb,
 '["Secure Coding Standards", "Insider Threat Detection"]'::jsonb),

('THR-048', 'Time Bomb', 'Malware programmed to execute at a specific date and time', 'malware', 'internal', 'medium', 'monitoring',
 '["scheduled malicious activity", "date-triggered events", "delayed system damage"]'::jsonb,
 '["system monitoring", "code analysis", "backup procedures"]'::jsonb,
 '["Malware Analysis Techniques", "System Recovery Planning"]'::jsonb),

('THR-049', 'Worm', 'Self-replicating malware that spreads across networks without user intervention', 'malware', 'threat-intelligence', 'high', 'active',
 '["network propagation", "self-replication", "bandwidth consumption"]'::jsonb,
 '["network segmentation", "patch management", "intrusion detection"]'::jsonb,
 '["Network Security Guidelines", "Worm Prevention Strategies"]'::jsonb),

('THR-050', 'Trojan Horse', 'Malware disguised as legitimate software to trick users into installing it', 'malware', 'external', 'high', 'active',
 '["disguised malicious software", "legitimate software impersonation", "unauthorized system access"]'::jsonb,
 '["software verification", "digital signatures", "endpoint protection"]'::jsonb,
 '["Software Authenticity Guidelines", "Trojan Detection Methods"]'::jsonb);
