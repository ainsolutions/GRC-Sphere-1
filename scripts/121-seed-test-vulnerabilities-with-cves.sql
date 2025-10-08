-- Insert test vulnerabilities with CVE IDs for EPSS testing
SET search_path TO org_mashreqbank;

INSERT INTO vulnerabilities (
    name,
    description,
    severity,
    cvss_score,
    category,
    cve_id,
    remediation_status,
    priority,
    created_at
) VALUES 
-- High-profile CVEs for testing EPSS integration
(
    'Apache Log4j Remote Code Execution',
    'Critical vulnerability in Apache Log4j2 that allows remote code execution via JNDI lookup',
    'Critical',
    10.0,
    'Code Execution',
    'CVE-2021-44228',
    'Open',
    1,
    NOW() - INTERVAL '3 days'
),
(
    'Spring Framework Remote Code Execution',
    'Spring4Shell - Remote Code Execution vulnerability in Spring Framework',
    'Critical',
    9.8,
    'Code Execution', 
    'CVE-2022-22965',
    'In Progress',
    1,
    NOW() - INTERVAL '5 days'
),
(
    'Microsoft Exchange Server SSRF',
    'Server-Side Request Forgery vulnerability in Microsoft Exchange Server',
    'High',
    8.8,
    'SSRF',
    'CVE-2021-26855',
    'Resolved',
    1,
    NOW() - INTERVAL '10 days'
),
(
    'VMware vCenter Server Authentication Bypass',
    'Authentication bypass vulnerability in VMware vCenter Server',
    'High',
    7.2,
    'Auth Bypass',
    'CVE-2021-21972',
    'Open',
    2,
    NOW() - INTERVAL '7 days'
),
(
    'Windows Print Spooler Privilege Escalation',
    'PrintNightmare - Local privilege escalation vulnerability in Windows Print Spooler',
    'High',
    7.8,
    'Priv Escalation',
    'CVE-2021-34527',
    'In Progress',
    2,
    NOW() - INTERVAL '2 days'
),
(
    'Apache HTTP Server Path Traversal',
    'Path traversal vulnerability in Apache HTTP Server',
    'Medium',
    5.9,
    'Path Traversal',
    'CVE-2021-40438',
    'Open',
    3,
    NOW() - INTERVAL '4 days'
),
(
    'Citrix Application Delivery Controller Code Injection',
    'Remote code injection vulnerability in Citrix ADC and Gateway',
    'Critical',
    9.8,
    'Code Injection',
    'CVE-2019-19781',
    'Resolved',
    1,
    NOW() - INTERVAL '15 days'
),
(
    'Sudo Heap Buffer Overflow',
    'Heap buffer overflow vulnerability in sudo',
    'High',
    7.8,
    'Buffer Overflow',
    'CVE-2021-3156',
    'Resolved',
    2,
    NOW() - INTERVAL '8 days'
);