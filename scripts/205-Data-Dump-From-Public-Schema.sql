-- --
-- -- PostgreSQL database dump
-- --

-- \restrict Fqd6CBSSqIjNe78Qug05JImd4VCDOVI2krfqWfIU978uXxGQy5bKN2EG5ZkCVfh

-- -- Dumped from database version 17.5 (1b53132)
-- -- Dumped by pg_dump version 17.6

-- -- Started on 2025-08-27 23:21:28

-- SET statement_timeout = 0;
-- SET lock_timeout = 0;
-- SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0;
-- SET client_encoding = 'UTF8';
-- SET standard_conforming_strings = on;
-- SELECT pg_catalog.set_config('search_path', '', false);
-- SET check_function_bodies = false;
-- SET xmloption = content;
-- SET client_min_messages = warning;
-- SET row_security = off;

-- --
-- -- TOC entry 6828 (class 0 OID 614401)
-- -- Dependencies: 484
-- -- Data for Name: ai_analysis_results; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.ai_analysis_results VALUES (1, 'risk_exposure', 'EXECUTIVE RISK EXPOSURE ANALYSIS

-- 1. CURRENT RISK POSTURE:
--    • Overall Risk Score: 7.2/10 (High)
--    • Critical Vulnerabilities: 23 identified
--    • Compliance Gaps: 12 HIPAA requirements
--    • Incident Response Readiness: 65%

-- 2. TOP STRATEGIC PRIORITIES:
--    • Implement Zero Trust Architecture (90 days)
--    • Complete HIPAA compliance remediation (120 days)
--    • Enhance incident response capabilities (60 days)
--    • Deploy advanced threat detection (45 days)

-- 3. RESOURCE ALLOCATION RECOMMENDATIONS:
--    • Cybersecurity: $450K additional budget required
--    • Compliance: 2 FTE compliance specialists
--    • Training: Organization-wide security awareness program
--    • Technology: SIEM/SOAR platform implementation

-- 4. QUARTERLY ROADMAP:
--    Q1: Critical vulnerability remediation, HIPAA gap closure
--    Q2: Zero Trust implementation phase 1, staff augmentation
--    Q3: Advanced monitoring deployment, process optimization
--    Q4: Maturity assessment, strategic planning for next year

-- 5. BOARD REPORTING SUMMARY:
--    Risk exposure remains elevated but manageable with proper investment.
--    Recommended immediate action on critical vulnerabilities and compliance gaps.
--    ROI expected within 18 months through reduced incident costs and regulatory penalties.', '2025-07-17 01:23:53.010605', '2025-07-17 01:23:53.010605');
-- INSERT INTO public.ai_analysis_results VALUES (2, 'threat_landscape', 'CYBERSECURITY THREAT LANDSCAPE ANALYSIS

-- 1. CURRENT THREAT ENVIRONMENT:
--    • Ransomware attacks increased 40% in healthcare sector
--    • Nation-state APT groups targeting healthcare data
--    • Supply chain attacks affecting 60% of organizations
--    • AI-powered social engineering campaigns emerging

-- 2. ORGANIZATION-SPECIFIC THREATS:
--    • Phishing campaigns targeting healthcare credentials
--    • Insider threat risk elevated due to remote work
--    • Third-party vendor security gaps identified
--    • Legacy system vulnerabilities in critical infrastructure

-- 3. DEFENSIVE STRATEGY RECOMMENDATIONS:
--    • Deploy advanced email security with AI detection
--    • Implement privileged access management (PAM)
--    • Establish threat hunting capabilities
--    • Enhance vendor risk management program

-- 4. THREAT INTELLIGENCE INTEGRATION:
--    • Subscribe to healthcare-specific threat feeds
--    • Implement automated threat indicator sharing
--    • Establish threat hunting team with external support
--    • Deploy deception technology for early detection

-- 5. INCIDENT RESPONSE ENHANCEMENTS:
--    • Update playbooks for ransomware scenarios
--    • Establish crisis communication protocols
--    • Implement automated containment procedures
--    • Conduct quarterly tabletop exercises', '2025-07-17 01:23:53.545063', '2025-07-17 01:23:53.545063');
-- INSERT INTO public.ai_analysis_results VALUES (3, 'vulnerability_remediation', 'VULNERABILITY REMEDIATION STRATEGY

-- 1. VULNERABILITY LANDSCAPE:
--    • Critical: 23 vulnerabilities requiring immediate attention
--    • High: 156 vulnerabilities (30-day remediation target)
--    • Medium: 342 vulnerabilities (90-day remediation target)
--    • Low: 1,247 vulnerabilities (ongoing maintenance)

-- 2. RISK-BASED PRIORITIZATION:
--    • Internet-facing systems: Immediate patching required
--    • Database servers: Critical patches within 72 hours
--    • Workstations: High-priority patches within 7 days
--    • Network infrastructure: Maintenance window scheduling

-- 3. REMEDIATION ROADMAP:
--    Week 1-2: Critical vulnerability emergency patching
--    Week 3-4: High-priority system updates and configuration
--    Month 2: Medium-priority vulnerability remediation
--    Month 3: Process optimization and automation deployment

-- 4. AUTOMATION RECOMMENDATIONS:
--    • Deploy vulnerability management platform
--    • Implement automated patch testing environment
--    • Establish configuration management system
--    • Create vulnerability scoring and prioritization engine

-- 5. RESOURCE REQUIREMENTS:
--    • Dedicated vulnerability management team (3 FTE)
--    • Patch management tools and infrastructure
--    • Testing environment for critical systems
--    • Emergency response procedures and escalation', '2025-07-17 01:23:53.829514', '2025-07-17 01:23:53.829514');
-- INSERT INTO public.ai_analysis_results VALUES (4, 'incident_patterns', 'INCIDENT PATTERN ANALYSIS

-- 1. INCIDENT TRENDS (LAST 12 MONTHS):
--    • Total incidents: 147 (22% increase from previous year)
--    • Security incidents: 89 (60% of total)
--    • Availability incidents: 34 (23% of total)
--    • Data incidents: 24 (16% of total)

-- 2. ROOT CAUSE ANALYSIS:
--    • Human error: 45% of incidents
--    • System failures: 28% of incidents
--    • External attacks: 18% of incidents
--    • Process failures: 9% of incidents

-- 3. RESPONSE EFFECTIVENESS:
--    • Mean Time to Detection (MTTD): 4.2 hours
--    • Mean Time to Response (MTTR): 2.8 hours
--    • Mean Time to Recovery: 8.6 hours
--    • Customer impact incidents: 23% of total

-- 4. IMPROVEMENT RECOMMENDATIONS:
--    • Implement automated incident detection
--    • Enhance staff training and awareness programs
--    • Deploy advanced monitoring and alerting
--    • Establish proactive threat hunting capabilities

-- 5. PROCESS OPTIMIZATION:
--    • Streamline incident classification procedures
--    • Implement automated escalation workflows
--    • Enhance post-incident review processes
--    • Develop predictive incident analytics', '2025-07-17 01:23:54.109015', '2025-07-17 01:23:54.109015');
-- INSERT INTO public.ai_analysis_results VALUES (5, 'compliance_remediation', 'HIPAA COMPLIANCE REMEDIATION ANALYSIS

-- 1. CURRENT COMPLIANCE STATUS:
--    • Overall HIPAA Compliance: 78% (Target: 95%+)
--    • Administrative Safeguards: 82% compliant
--    • Physical Safeguards: 85% compliant
--    • Technical Safeguards: 71% compliant

-- 2. CRITICAL GAPS IDENTIFIED:
--    • Access controls and user authentication
--    • Audit logging and monitoring systems
--    • Data encryption at rest and in transit
--    • Business associate agreements and oversight

-- 3. REMEDIATION PRIORITIES:
--    Phase 1 (30 days): Critical technical safeguards
--    Phase 2 (60 days): Administrative process improvements
--    Phase 3 (90 days): Physical security enhancements
--    Phase 4 (120 days): Ongoing monitoring and maintenance

-- 4. RESOURCE REQUIREMENTS:
--    • HIPAA compliance officer (1 FTE)
--    • Technical implementation team (2 FTE)
--    • Legal and privacy consultation
--    • Compliance monitoring tools and systems

-- 5. RISK MITIGATION:
--    • Potential penalties: $1.5M - $50M per violation
--    • Reputational damage and customer loss
--    • Operational disruption during remediation
--    • Ongoing compliance monitoring costs', '2025-07-17 01:23:54.550434', '2025-07-17 01:23:54.550434');
-- INSERT INTO public.ai_analysis_results VALUES (6, 'integrated_grc', 'INTEGRATED GRC ANALYSIS

-- 1. ORGANIZATIONAL RISK POSTURE:
--    • Governance Maturity: Level 3/5 (Defined)
--    • Risk Management: Level 2/5 (Repeatable)
--    • Compliance Status: Level 3/5 (Defined)
--    • Overall GRC Score: 2.7/5 (Developing)

-- 2. STRATEGIC ALIGNMENT:
--    • Business objectives alignment: 75%
--    • Risk appetite vs. actual risk: Misaligned
--    • Compliance integration: Partially integrated
--    • Technology enablement: 60% automated

-- 3. GOVERNANCE RECOMMENDATIONS:
--    • Establish enterprise risk committee
--    • Implement integrated GRC platform
--    • Define risk appetite statements
--    • Enhance board-level risk reporting

-- 4. INTEGRATION OPPORTUNITIES:
--    • Unified risk and compliance dashboard
--    • Automated control testing and monitoring
--    • Integrated incident and risk management
--    • Streamlined audit and assessment processes

-- 5. TRANSFORMATION ROADMAP:
--    Year 1: Foundation building and tool implementation
--    Year 2: Process integration and automation
--    Year 3: Advanced analytics and predictive capabilities
--    Ongoing: Continuous improvement and optimization', '2025-07-17 01:23:54.885327', '2025-07-17 01:23:54.885327');
-- INSERT INTO public.ai_analysis_results VALUES (7, 'risk_exposure', '
-- 🎯 EXECUTIVE RISK EXPOSURE ANALYSIS
-- Generated by AI GRC Engine v2.0

-- ═══════════════════════════════════════════════════════════════

-- 1. EXECUTIVE SUMMARY:
--    • Current organizational risk posture: MODERATE-HIGH
--    • Critical vulnerabilities identified: 23 high-priority items
--    • Recommended immediate actions: 8 strategic initiatives
--    • Estimated risk reduction potential: 67% within 6 months

-- 2. STRATEGIC RISK PRIORITIES:
--    ▶ Cybersecurity Infrastructure (Risk Score: 8.7/10)
--      - Legacy system vulnerabilities
--      - Insufficient endpoint protection
--      - Weak identity management controls
   
--    ▶ Regulatory Compliance Gaps (Risk Score: 7.9/10)
--      - HIPAA compliance deficiencies
--      - Data retention policy violations
--      - Audit trail inconsistencies
   
--    ▶ Third-Party Risk Exposure (Risk Score: 7.2/10)
--      - Vendor security assessments overdue
--      - Supply chain vulnerabilities
--      - Contract compliance monitoring gaps

-- 3. RESOURCE ALLOCATION RECOMMENDATIONS:
--    💰 Budget Priority 1: $2.3M - Cybersecurity modernization
--    💰 Budget Priority 2: $1.8M - Compliance automation platform
--    💰 Budget Priority 3: $950K - Third-party risk management tools

-- 4. QUARTERLY ROADMAP:
--    Q1: Infrastructure hardening and compliance framework
--    Q2: Vendor risk assessment and contract reviews
--    Q3: Security awareness training and policy updates
--    Q4: Continuous monitoring implementation

-- 5. BOARD REPORTING METRICS:
--    • Risk reduction percentage: Target 65%
--    • Compliance score improvement: Target 85%
--    • Incident response time: Target <2 hours
--    • Vendor risk coverage: Target 100%
-- ', '2025-07-17 01:35:13.290505', '2025-07-17 01:35:13.290505');
-- INSERT INTO public.ai_analysis_results VALUES (8, 'threat_landscape', '
-- 🛡️ CYBERSECURITY THREAT LANDSCAPE ANALYSIS
-- AI-Powered Threat Intelligence Report

-- ═══════════════════════════════════════════════════════════════

-- 1. CURRENT THREAT ENVIRONMENT:
--    • Threat level: ELEVATED (7.8/10)
--    • Active threat campaigns: 12 targeting healthcare sector
--    • Zero-day vulnerabilities: 3 affecting our technology stack
--    • Ransomware activity: 340% increase in healthcare attacks

-- 2. SECTOR-SPECIFIC THREATS:
--    🎯 Healthcare-Targeted Campaigns:
--      - Ransomware groups: LockBit, BlackCat, Royal
--      - Attack vectors: Phishing (67%), RDP exploitation (23%)
--      - Average ransom demand: $4.2M (up 89% YoY)
   
--    🎯 Supply Chain Attacks:
--      - Third-party software compromises
--      - Cloud service provider incidents
--      - Medical device vulnerabilities

-- 3. DEFENSIVE STRATEGY RECOMMENDATIONS:
--    ⚡ Immediate Actions (0-30 days):
--      - Deploy advanced email security
--      - Implement MFA across all systems
--      - Conduct emergency tabletop exercises
   
--    ⚡ Short-term Initiatives (1-3 months):
--      - Endpoint detection and response (EDR)
--      - Network segmentation implementation
--      - Threat hunting program establishment
   
--    ⚡ Long-term Strategy (3-12 months):
--      - Zero-trust architecture deployment
--      - AI-powered security operations center
--      - Continuous security validation

-- 4. THREAT INTELLIGENCE INTEGRATION:
--    • Real-time threat feeds: 15 premium sources
--    • Automated indicator processing: 50,000+ daily
--    • Threat hunting queries: 200+ custom rules
--    • Intelligence sharing: 8 industry partnerships

-- 5. INCIDENT RESPONSE READINESS:
--    • Response team availability: 24/7/365
--    • Mean time to detection: Target <15 minutes
--    • Mean time to containment: Target <1 hour
--    • Recovery time objective: Target <4 hours
-- ', '2025-07-17 01:35:13.599225', '2025-07-17 01:35:13.599225');
-- INSERT INTO public.ai_analysis_results VALUES (9, 'vulnerability_remediation', '
-- 🔧 VULNERABILITY REMEDIATION STRATEGY
-- AI-Driven Risk-Based Prioritization

-- ═══════════════════════════════════════════════════════════════

-- 1. VULNERABILITY LANDSCAPE OVERVIEW:
--    • Total vulnerabilities identified: 2,847
--    • Critical severity: 89 (3.1%)
--    • High severity: 342 (12.0%)
--    • Medium severity: 1,203 (42.3%)
--    • Low severity: 1,213 (42.6%)

-- 2. RISK-BASED PRIORITIZATION:
--    🚨 CRITICAL - Immediate Action Required (0-7 days):
--      - CVE-2024-0001: Remote code execution in web servers
--      - CVE-2024-0002: SQL injection in patient portal
--      - CVE-2024-0003: Privilege escalation in domain controllers
   
--    ⚠️ HIGH - Priority Remediation (7-30 days):
--      - Authentication bypass vulnerabilities: 23 instances
--      - Data exposure risks: 45 instances
--      - Service disruption potential: 67 instances

-- 3. AUTOMATED REMEDIATION RECOMMENDATIONS:
--    🤖 Patch Management Automation:
--      - Windows Update deployment: 89% automated
--      - Linux package management: 76% automated
--      - Third-party application updates: 45% automated
   
--    🤖 Configuration Management:
--      - Security baseline enforcement: 92% coverage
--      - Compliance drift detection: Real-time monitoring
--      - Automated remediation scripts: 156 available

-- 4. RESOURCE ALLOCATION:
--    👥 Team Assignments:
--      - Critical vulnerabilities: Senior security engineers (4 FTE)
--      - High vulnerabilities: Security analysts (6 FTE)
--      - Medium/Low: Automated tools + junior staff (2 FTE)
   
--    💰 Budget Requirements:
--      - Emergency patching: $125K
--      - Tool licensing: $89K annually
--      - Staff augmentation: $340K

-- 5. REMEDIATION TIMELINE:
--    Week 1-2: Critical vulnerability patching (100% completion)
--    Week 3-6: High-priority remediation (85% completion)
--    Month 2-3: Medium-priority addressing (70% completion)
--    Ongoing: Low-priority and maintenance (continuous)

-- 6. SUCCESS METRICS:
--    • Mean time to patch (critical): Target <24 hours
--    • Vulnerability aging: Target <30 days average
--    • Remediation rate: Target 95% within SLA
--    • False positive rate: Target <5%
-- ', '2025-07-17 01:35:13.927418', '2025-07-17 01:35:13.927418');
-- INSERT INTO public.ai_analysis_results VALUES (10, 'incident_patterns', '
-- 📊 INCIDENT PATTERN ANALYSIS
-- AI-Powered Trend Analysis & Response Optimization

-- ═══════════════════════════════════════════════════════════════

-- 1. INCIDENT TREND ANALYSIS:
--    • Total incidents (last 12 months): 1,247
--    • Average monthly incidents: 104
--    • Trend direction: 12% decrease (improvement)
--    • Seasonal patterns: 23% spike during flu season

-- 2. INCIDENT CATEGORIZATION:
--    🔐 Security Incidents (34%):
--      - Phishing attempts: 267 incidents
--      - Malware detections: 189 incidents
--      - Unauthorized access: 78 incidents
--      - Data breaches: 12 incidents
   
--    💻 System Incidents (28%):
--      - Server outages: 156 incidents
--      - Network disruptions: 134 incidents
--      - Application failures: 89 incidents
   
--    👤 Human Error (23%):
--      - Misconfiguration: 145 incidents
--      - Accidental data exposure: 67 incidents
--      - Process violations: 76 incidents

-- 3. RESPONSE EFFECTIVENESS METRICS:
--    ⏱️ Response Times:
--      - Mean time to detection: 18 minutes (Target: 15)
--      - Mean time to response: 47 minutes (Target: 30)
--      - Mean time to resolution: 4.2 hours (Target: 4)
   
--    📈 Resolution Rates:
--      - First-call resolution: 67% (Target: 75%)
--      - Escalation rate: 23% (Target: 20%)
--      - Customer satisfaction: 4.2/5 (Target: 4.5)

-- 4. PREDICTIVE ANALYTICS:
--    🔮 Incident Forecasting:
--      - Next month prediction: 98 incidents (±12)
--      - High-risk periods: End of quarter, system updates
--      - Resource planning: 15% staff increase recommended
   
--    🔮 Pattern Recognition:
--      - Recurring issues: 34% of incidents are repeats
--      - Root cause clusters: 8 primary categories identified
--      - Prevention opportunities: 67% preventable with automation

-- 5. IMPROVEMENT RECOMMENDATIONS:
--    ✅ Process Optimization:
--      - Automated triage implementation
--      - Self-service portal enhancement
--      - Knowledge base expansion (500+ articles)
   
--    ✅ Technology Enhancement:
--      - AI-powered incident classification
--      - Predictive alerting system
--      - Integrated communication platform
   
--    ✅ Training & Awareness:
--      - Monthly security awareness sessions
--      - Incident response simulation exercises
--      - Cross-team collaboration workshops

-- 6. COST IMPACT ANALYSIS:
--    💰 Incident Costs (Annual):
--      - Direct response costs: $2.3M
--      - Business disruption: $4.7M
--      - Regulatory fines: $340K
--      - Reputation impact: $1.2M (estimated)
   
--    💰 ROI of Improvements:
--      - Automation investment: $450K
--      - Expected savings: $1.8M annually
--      - Payback period: 3.2 months
-- ', '2025-07-17 01:35:14.2157', '2025-07-17 01:35:14.2157');
-- INSERT INTO public.ai_analysis_results VALUES (11, 'compliance_remediation', '
-- 📋 HIPAA COMPLIANCE REMEDIATION ANALYSIS
-- AI-Powered Regulatory Gap Assessment

-- ═══════════════════════════════════════════════════════════════

-- 1. COMPLIANCE POSTURE OVERVIEW:
--    • Overall HIPAA compliance score: 73% (Target: 95%)
--    • Critical gaps identified: 23 high-priority items
--    • Administrative safeguards: 78% compliant
--    • Physical safeguards: 85% compliant
--    • Technical safeguards: 67% compliant

-- 2. CRITICAL COMPLIANCE GAPS:
--    🚨 Administrative Safeguards:
--      - Security Officer designation incomplete
--      - Workforce training documentation gaps
--      - Business Associate Agreements outdated (34%)
--      - Incident response procedures insufficient
   
--    🚨 Physical Safeguards:
--      - Workstation access controls inadequate
--      - Media disposal procedures non-compliant
--      - Facility access logs incomplete
   
--    🚨 Technical Safeguards:
--      - Access control implementation gaps
--      - Audit log monitoring insufficient
--      - Data encryption not comprehensive
--      - Automatic logoff not configured

-- 3. REMEDIATION ROADMAP:
--    📅 Phase 1 (0-30 days) - Critical Items:
--      - Appoint qualified Security Officer
--      - Update all Business Associate Agreements
--      - Implement comprehensive audit logging
--      - Deploy data encryption across all systems
   
--    📅 Phase 2 (30-90 days) - High Priority:
--      - Conduct organization-wide HIPAA training
--      - Establish incident response procedures
--      - Implement access control matrix
--      - Deploy workstation security controls
   
--    📅 Phase 3 (90-180 days) - Systematic Improvements:
--      - Automate compliance monitoring
--      - Establish regular risk assessments
--      - Implement data loss prevention
--      - Create compliance dashboard

-- 4. RESOURCE REQUIREMENTS:
--    👥 Staffing Needs:
--      - HIPAA Compliance Officer: 1 FTE
--      - Privacy Analysts: 2 FTE
--      - Technical Implementation: 3 FTE
--      - Training Coordinators: 1 FTE
   
--    💰 Budget Allocation:
--      - Technology solutions: $890K
--      - Staff training: $125K
--      - External consulting: $200K
--      - Ongoing monitoring: $150K annually

-- 5. RISK MITIGATION:
--    ⚖️ Regulatory Risk Reduction:
--      - Potential fine exposure: $2.8M (current)
--      - Post-remediation exposure: $340K (88% reduction)
--      - Audit readiness score: Target 95%
   
--    ⚖️ Operational Risk Benefits:
--      - Data breach prevention: 78% risk reduction
--      - Process efficiency: 34% improvement
--      - Staff confidence: 67% increase

-- 6. MONITORING & MAINTENANCE:
--    📊 Continuous Compliance:
--      - Monthly compliance assessments
--      - Quarterly risk evaluations
--      - Annual third-party audits
--      - Real-time monitoring dashboard
   
--    📊 Key Performance Indicators:
--      - Compliance score: Target >95%
--      - Training completion: Target 100%
--      - Incident response time: Target <2 hours
--      - Audit findings: Target <5 per year

-- 7. SUCCESS METRICS:
--    • Compliance score improvement: 73% → 95%
--    • Risk assessment frequency: Quarterly
--    • Staff training completion: 100%
--    • Incident response capability: <2 hours
--    • Regulatory audit readiness: 95%
-- ', '2025-07-17 01:35:14.560948', '2025-07-17 01:35:14.560948');
-- INSERT INTO public.ai_analysis_results VALUES (12, 'integrated_grc', '
-- 🎯 INTEGRATED GRC ANALYSIS
-- Comprehensive Organizational Risk Posture Assessment

-- ═══════════════════════════════════════════════════════════════

-- 1. ORGANIZATIONAL RISK MATURITY:
--    • Overall GRC maturity level: 3.2/5 (Managed)
--    • Risk management: 3.4/5
--    • Governance framework: 3.1/5
--    • Compliance posture: 2.9/5
--    • Target maturity: 4.2/5 (Optimized)

-- 2. INTEGRATED RISK DASHBOARD:
--    📊 Risk Heat Map Analysis:
--      - Critical risks: 12 items requiring immediate attention
--      - High risks: 34 items with quarterly review
--      - Medium risks: 89 items with annual assessment
--      - Emerging risks: 23 items under monitoring
   
--    📊 Cross-Domain Risk Correlation:
--      - Cybersecurity ↔ Compliance: 78% correlation
--      - Operational ↔ Financial: 65% correlation
--      - Strategic ↔ Reputational: 82% correlation

-- 3. GOVERNANCE EFFECTIVENESS:
--    🏛️ Board Oversight:
--      - Risk committee meetings: Monthly (Target: Monthly)
--      - Risk reporting frequency: Quarterly (Target: Monthly)
--      - Board risk appetite: Clearly defined (67% coverage)
--      - Strategic alignment: 73% (Target: 90%)
   
--    🏛️ Management Structure:
--      - Three lines of defense: Partially implemented
--      - Risk ownership: 78% clearly assigned
--      - Escalation procedures: Well-defined
--      - Performance metrics: 23 KRIs tracked

-- 4. COMPLIANCE INTEGRATION:
--    📋 Multi-Framework Alignment:
--      - HIPAA compliance: 73% (Target: 95%)
--      - SOX compliance: 89% (Target: 95%)
--      - ISO 27001 readiness: 67% (Target: 85%)
--      - NIST CSF implementation: 71% (Target: 90%)
   
--    📋 Regulatory Change Management:
--      - Regulation monitoring: Automated (15 jurisdictions)
--      - Impact assessment: 48-hour turnaround
--      - Implementation tracking: 89% on-time
--      - Compliance testing: Quarterly cycle

-- 5. TECHNOLOGY INTEGRATION:
--    💻 GRC Platform Capabilities:
--      - Risk register automation: 78% complete
--      - Control testing workflow: 65% automated
--      - Compliance monitoring: Real-time (12 frameworks)
--      - Reporting automation: 89% of standard reports
   
--    💻 Data Analytics:
--      - Predictive risk modeling: 67% accuracy
--      - Trend analysis: 24-month historical data
--      - Correlation analysis: Cross-domain insights
--      - Executive dashboards: Real-time updates

-- 6. STRATEGIC RECOMMENDATIONS:
--    🎯 Short-term Priorities (0-6 months):
--      - Implement integrated GRC platform
--      - Establish risk appetite statements
--      - Automate compliance monitoring
--      - Enhance board reporting
   
--    🎯 Medium-term Initiatives (6-18 months):
--      - Deploy predictive analytics
--      - Integrate third-party risk management
--      - Implement continuous controls monitoring
--      - Establish risk culture program
   
--    🎯 Long-term Vision (18+ months):
--      - Achieve optimized maturity level
--      - Implement AI-driven risk insights
--      - Establish industry leadership position
--      - Create competitive advantage through GRC

-- 7. INVESTMENT PRIORITIES:
--    💰 Technology Investments:
--      - GRC platform: $1.2M (Year 1)
--      - Analytics tools: $450K
--      - Integration services: $300K
--      - Training & adoption: $200K
   
--    💰 Expected Returns:
--      - Operational efficiency: 34% improvement
--      - Risk reduction: 45% across all domains
--      - Compliance costs: 28% reduction
--      - Decision-making speed: 56% faster

-- 8. SUCCESS METRICS:
--    📈 Key Performance Indicators:
--      - GRC maturity score: 3.2 → 4.2
--      - Risk-adjusted ROI: 23% improvement
--      - Compliance efficiency: 34% cost reduction
--      - Stakeholder confidence: 67% increase
--      - Regulatory readiness: 95% target
   
--    📈 Continuous Improvement:
--      - Monthly performance reviews
--      - Quarterly maturity assessments
--      - Annual third-party validation
--      - Ongoing benchmarking studies
-- ', '2025-07-17 01:35:15.037053', '2025-07-17 01:35:15.037053');
-- INSERT INTO public.ai_analysis_results VALUES (13, 'risk_exposure', '🎯 EXECUTIVE RISK EXPOSURE ANALYSIS
-- Generated by AI GRC Engine v2.0

-- Current organizational risk posture: MODERATE-HIGH
-- Critical vulnerabilities identified: 23 high-priority items
-- Recommended immediate actions: 8 strategic initiatives
-- Estimated risk reduction potential: 67% within 6 months

-- STRATEGIC RISK PRIORITIES:
-- ▶ Cybersecurity Infrastructure (Risk Score: 8.7/10)
-- ▶ Regulatory Compliance Gaps (Risk Score: 7.9/10)
-- ▶ Third-Party Risk Exposure (Risk Score: 7.2/10)', '2025-07-17 01:37:56.680187', '2025-07-17 01:37:56.680187');
-- INSERT INTO public.ai_analysis_results VALUES (14, 'threat_landscape', '🛡️ CYBERSECURITY THREAT LANDSCAPE ANALYSIS
-- AI-Powered Threat Intelligence Report

-- Current threat level: ELEVATED (7.8/10)
-- Active threat campaigns: 12 targeting healthcare sector
-- Zero-day vulnerabilities: 3 affecting our technology stack
-- Ransomware activity: 340% increase in healthcare attacks

-- SECTOR-SPECIFIC THREATS:
-- 🎯 Healthcare-Targeted Campaigns
-- 🎯 Supply Chain Attacks
-- 🎯 Advanced Persistent Threats', '2025-07-17 01:37:56.680187', '2025-07-17 01:37:56.680187');
-- INSERT INTO public.ai_analysis_results VALUES (15, 'compliance_remediation', '📋 HIPAA COMPLIANCE REMEDIATION ANALYSIS
-- AI-Powered Regulatory Gap Assessment

-- Overall HIPAA compliance score: 73% (Target: 95%)
-- Critical gaps identified: 23 high-priority items
-- Administrative safeguards: 78% compliant
-- Physical safeguards: 85% compliant
-- Technical safeguards: 67% compliant

-- CRITICAL COMPLIANCE GAPS:
-- 🚨 Administrative Safeguards
-- 🚨 Physical Safeguards  
-- 🚨 Technical Safeguards', '2025-07-17 01:37:56.680187', '2025-07-17 01:37:56.680187');
-- INSERT INTO public.ai_analysis_results VALUES (16, 'risk_exposure', '
-- 🎯 EXECUTIVE RISK EXPOSURE ANALYSIS
-- Generated by AI GRC Engine v2.0

-- ═══════════════════════════════════════════════════════════════

-- 1. EXECUTIVE SUMMARY:
--    • Current organizational risk posture: MODERATE-HIGH
--    • Critical vulnerabilities identified: 23 high-priority items
--    • Recommended immediate actions: 8 strategic initiatives
--    • Estimated risk reduction potential: 67% within 6 months

-- 2. STRATEGIC RISK PRIORITIES:
--    ▶ Cybersecurity Infrastructure (Risk Score: 8.7/10)
--      - Legacy system vulnerabilities
--      - Insufficient endpoint protection
--      - Weak identity management controls
   
--    ▶ Regulatory Compliance Gaps (Risk Score: 7.9/10)
--      - HIPAA compliance deficiencies
--      - Data retention policy violations
--      - Audit trail inconsistencies
   
--    ▶ Third-Party Risk Exposure (Risk Score: 7.2/10)
--      - Vendor security assessments overdue
--      - Supply chain vulnerabilities
--      - Contract compliance monitoring gaps

-- 3. RESOURCE ALLOCATION RECOMMENDATIONS:
--    💰 Budget Priority 1: $2.3M - Cybersecurity modernization
--    💰 Budget Priority 2: $1.8M - Compliance automation platform
--    💰 Budget Priority 3: $950K - Third-party risk management tools

-- 4. QUARTERLY ROADMAP:
--    Q1: Infrastructure hardening and compliance framework
--    Q2: Vendor risk assessment and contract reviews
--    Q3: Security awareness training and policy updates
--    Q4: Continuous monitoring implementation

-- 5. BOARD REPORTING METRICS:
--    • Risk reduction percentage: Target 65%
--    • Compliance score improvement: Target 85%
--    • Incident response time: Target <2 hours
--    • Vendor risk coverage: Target 100%
-- ', '2025-07-17 01:52:54.367656', '2025-07-17 01:52:54.367656');
-- INSERT INTO public.ai_analysis_results VALUES (17, 'threat_landscape', '
-- 🛡️ CYBERSECURITY THREAT LANDSCAPE ANALYSIS
-- AI-Powered Threat Intelligence Report

-- ═══════════════════════════════════════════════════════════════

-- 1. CURRENT THREAT ENVIRONMENT:
--    • Threat level: ELEVATED (7.8/10)
--    • Active threat campaigns: 12 targeting healthcare sector
--    • Zero-day vulnerabilities: 3 affecting our technology stack
--    • Ransomware activity: 340% increase in healthcare attacks

-- 2. SECTOR-SPECIFIC THREATS:
--    🎯 Healthcare-Targeted Campaigns:
--      - Ransomware groups: LockBit, BlackCat, Royal
--      - Attack vectors: Phishing (67%), RDP exploitation (23%)
--      - Average ransom demand: $4.2M (up 89% YoY)
   
--    🎯 Supply Chain Attacks:
--      - Third-party software compromises
--      - Cloud service provider incidents
--      - Medical device vulnerabilities

-- 3. DEFENSIVE STRATEGY RECOMMENDATIONS:
--    ⚡ Immediate Actions (0-30 days):
--      - Deploy advanced email security
--      - Implement MFA across all systems
--      - Conduct emergency tabletop exercises
   
--    ⚡ Short-term Initiatives (1-3 months):
--      - Endpoint detection and response (EDR)
--      - Network segmentation implementation
--      - Threat hunting program establishment
   
--    ⚡ Long-term Strategy (3-12 months):
--      - Zero-trust architecture deployment
--      - AI-powered security operations center
--      - Continuous security validation

-- 4. THREAT INTELLIGENCE INTEGRATION:
--    • Real-time threat feeds: 15 premium sources
--    • Automated indicator processing: 50,000+ daily
--    • Threat hunting queries: 200+ custom rules
--    • Intelligence sharing: 8 industry partnerships

-- 5. INCIDENT RESPONSE READINESS:
--    • Response team availability: 24/7/365
--    • Mean time to detection: Target <15 minutes
--    • Mean time to containment: Target <1 hour
--    • Recovery time objective: Target <4 hours
-- ', '2025-07-17 01:52:54.643573', '2025-07-17 01:52:54.643573');
-- INSERT INTO public.ai_analysis_results VALUES (18, 'vulnerability_remediation', '
-- 🔧 VULNERABILITY REMEDIATION STRATEGY
-- AI-Driven Risk-Based Prioritization

-- ═══════════════════════════════════════════════════════════════

-- 1. VULNERABILITY LANDSCAPE OVERVIEW:
--    • Total vulnerabilities identified: 2,847
--    • Critical severity: 89 (3.1%)
--    • High severity: 342 (12.0%)
--    • Medium severity: 1,203 (42.3%)
--    • Low severity: 1,213 (42.6%)

-- 2. RISK-BASED PRIORITIZATION:
--    🚨 CRITICAL - Immediate Action Required (0-7 days):
--      - CVE-2024-0001: Remote code execution in web servers
--      - CVE-2024-0002: SQL injection in patient portal
--      - CVE-2024-0003: Privilege escalation in domain controllers
   
--    ⚠️ HIGH - Priority Remediation (7-30 days):
--      - Authentication bypass vulnerabilities: 23 instances
--      - Data exposure risks: 45 instances
--      - Service disruption potential: 67 instances

-- 3. AUTOMATED REMEDIATION RECOMMENDATIONS:
--    🤖 Patch Management Automation:
--      - Windows Update deployment: 89% automated
--      - Linux package management: 76% automated
--      - Third-party application updates: 45% automated
   
--    🤖 Configuration Management:
--      - Security baseline enforcement: 92% coverage
--      - Compliance drift detection: Real-time monitoring
--      - Automated remediation scripts: 156 available

-- 4. RESOURCE ALLOCATION:
--    👥 Team Assignments:
--      - Critical vulnerabilities: Senior security engineers (4 FTE)
--      - High vulnerabilities: Security analysts (6 FTE)
--      - Medium/Low: Automated tools + junior staff (2 FTE)
   
--    💰 Budget Requirements:
--      - Emergency patching: $125K
--      - Tool licensing: $89K annually
--      - Staff augmentation: $340K

-- 5. REMEDIATION TIMELINE:
--    Week 1-2: Critical vulnerability patching (100% completion)
--    Week 3-6: High-priority remediation (85% completion)
--    Month 2-3: Medium-priority addressing (70% completion)
--    Ongoing: Low-priority and maintenance (continuous)

-- 6. SUCCESS METRICS:
--    • Mean time to patch (critical): Target <24 hours
--    • Vulnerability aging: Target <30 days average
--    • Remediation rate: Target 95% within SLA
--    • False positive rate: Target <5%
-- ', '2025-07-17 01:52:54.952214', '2025-07-17 01:52:54.952214');
-- INSERT INTO public.ai_analysis_results VALUES (19, 'incident_patterns', '
-- 📊 INCIDENT PATTERN ANALYSIS
-- AI-Powered Trend Analysis & Response Optimization

-- ═══════════════════════════════════════════════════════════════

-- 1. INCIDENT TREND ANALYSIS:
--    • Total incidents (last 12 months): 1,247
--    • Average monthly incidents: 104
--    • Trend direction: 12% decrease (improvement)
--    • Seasonal patterns: 23% spike during flu season

-- 2. INCIDENT CATEGORIZATION:
--    🔐 Security Incidents (34%):
--      - Phishing attempts: 267 incidents
--      - Malware detections: 189 incidents
--      - Unauthorized access: 78 incidents
--      - Data breaches: 12 incidents
   
--    💻 System Incidents (28%):
--      - Server outages: 156 incidents
--      - Network disruptions: 134 incidents
--      - Application failures: 89 incidents
   
--    👤 Human Error (23%):
--      - Misconfiguration: 145 incidents
--      - Accidental data exposure: 67 incidents
--      - Process violations: 76 incidents

-- 3. RESPONSE EFFECTIVENESS METRICS:
--    ⏱️ Response Times:
--      - Mean time to detection: 18 minutes (Target: 15)
--      - Mean time to response: 47 minutes (Target: 30)
--      - Mean time to resolution: 4.2 hours (Target: 4)
   
--    📈 Resolution Rates:
--      - First-call resolution: 67% (Target: 75%)
--      - Escalation rate: 23% (Target: 20%)
--      - Customer satisfaction: 4.2/5 (Target: 4.5)

-- 4. PREDICTIVE ANALYTICS:
--    🔮 Incident Forecasting:
--      - Next month prediction: 98 incidents (±12)
--      - High-risk periods: End of quarter, system updates
--      - Resource planning: 15% staff increase recommended
   
--    🔮 Pattern Recognition:
--      - Recurring issues: 34% of incidents are repeats
--      - Root cause clusters: 8 primary categories identified
--      - Prevention opportunities: 67% preventable with automation

-- 5. IMPROVEMENT RECOMMENDATIONS:
--    ✅ Process Optimization:
--      - Automated triage implementation
--      - Self-service portal enhancement
--      - Knowledge base expansion (500+ articles)
   
--    ✅ Technology Enhancement:
--      - AI-powered incident classification
--      - Predictive alerting system
--      - Integrated communication platform
   
--    ✅ Training & Awareness:
--      - Monthly security awareness sessions
--      - Incident response simulation exercises
--      - Cross-team collaboration workshops

-- 6. COST IMPACT ANALYSIS:
--    💰 Incident Costs (Annual):
--      - Direct response costs: $2.3M
--      - Business disruption: $4.7M
--      - Regulatory fines: $340K
--      - Reputation impact: $1.2M (estimated)
   
--    💰 ROI of Improvements:
--      - Automation investment: $450K
--      - Expected savings: $1.8M annually
--      - Payback period: 3.2 months
-- ', '2025-07-17 01:52:55.223408', '2025-07-17 01:52:55.223408');
-- INSERT INTO public.ai_analysis_results VALUES (20, 'compliance_remediation', '
-- 📋 HIPAA COMPLIANCE REMEDIATION ANALYSIS
-- AI-Powered Regulatory Gap Assessment

-- ═══════════════════════════════════════════════════════════════

-- 1. COMPLIANCE POSTURE OVERVIEW:
--    • Overall HIPAA compliance score: 73% (Target: 95%)
--    • Critical gaps identified: 23 high-priority items
--    • Administrative safeguards: 78% compliant
--    • Physical safeguards: 85% compliant
--    • Technical safeguards: 67% compliant

-- 2. CRITICAL COMPLIANCE GAPS:
--    🚨 Administrative Safeguards:
--      - Security Officer designation incomplete
--      - Workforce training documentation gaps
--      - Business Associate Agreements outdated (34%)
--      - Incident response procedures insufficient
   
--    🚨 Physical Safeguards:
--      - Workstation access controls inadequate
--      - Media disposal procedures non-compliant
--      - Facility access logs incomplete
   
--    🚨 Technical Safeguards:
--      - Access control implementation gaps
--      - Audit log monitoring insufficient
--      - Data encryption not comprehensive
--      - Automatic logoff not configured

-- 3. REMEDIATION ROADMAP:
--    📅 Phase 1 (0-30 days) - Critical Items:
--      - Appoint qualified Security Officer
--      - Update all Business Associate Agreements
--      - Implement comprehensive audit logging
--      - Deploy data encryption across all systems
   
--    📅 Phase 2 (30-90 days) - High Priority:
--      - Conduct organization-wide HIPAA training
--      - Establish incident response procedures
--      - Implement access control matrix
--      - Deploy workstation security controls
   
--    📅 Phase 3 (90-180 days) - Systematic Improvements:
--      - Automate compliance monitoring
--      - Establish regular risk assessments
--      - Implement data loss prevention
--      - Create compliance dashboard

-- 4. RESOURCE REQUIREMENTS:
--    👥 Staffing Needs:
--      - HIPAA Compliance Officer: 1 FTE
--      - Privacy Analysts: 2 FTE
--      - Technical Implementation: 3 FTE
--      - Training Coordinators: 1 FTE
   
--    💰 Budget Allocation:
--      - Technology solutions: $890K
--      - Staff training: $125K
--      - External consulting: $200K
--      - Ongoing monitoring: $150K annually

-- 5. RISK MITIGATION:
--    ⚖️ Regulatory Risk Reduction:
--      - Potential fine exposure: $2.8M (current)
--      - Post-remediation exposure: $340K (88% reduction)
--      - Audit readiness score: Target 95%
   
--    ⚖️ Operational Risk Benefits:
--      - Data breach prevention: 78% risk reduction
--      - Process efficiency: 34% improvement
--      - Staff confidence: 67% increase

-- 6. MONITORING & MAINTENANCE:
--    📊 Continuous Compliance:
--      - Monthly compliance assessments
--      - Quarterly risk evaluations
--      - Annual third-party audits
--      - Real-time monitoring dashboard
   
--    📊 Key Performance Indicators:
--      - Compliance score: Target >95%
--      - Training completion: Target 100%
--      - Incident response time: Target <2 hours
--      - Audit findings: Target <5 per year

-- 7. SUCCESS METRICS:
--    • Compliance score improvement: 73% → 95%
--    • Risk assessment frequency: Quarterly
--    • Staff training completion: 100%
--    • Incident response capability: <2 hours
--    • Regulatory audit readiness: 95%
-- ', '2025-07-17 01:52:55.50579', '2025-07-17 01:52:55.50579');
-- INSERT INTO public.ai_analysis_results VALUES (21, 'integrated_grc', '
-- 🎯 INTEGRATED GRC ANALYSIS
-- Comprehensive Organizational Risk Posture Assessment

-- ═══════════════════════════════════════════════════════════════

-- 1. ORGANIZATIONAL RISK MATURITY:
--    • Overall GRC maturity level: 3.2/5 (Managed)
--    • Risk management: 3.4/5
--    • Governance framework: 3.1/5
--    • Compliance posture: 2.9/5
--    • Target maturity: 4.2/5 (Optimized)

-- 2. INTEGRATED RISK DASHBOARD:
--    📊 Risk Heat Map Analysis:
--      - Critical risks: 12 items requiring immediate attention
--      - High risks: 34 items with quarterly review
--      - Medium risks: 89 items with annual assessment
--      - Emerging risks: 23 items under monitoring
   
--    📊 Cross-Domain Risk Correlation:
--      - Cybersecurity ↔ Compliance: 78% correlation
--      - Operational ↔ Financial: 65% correlation
--      - Strategic ↔ Reputational: 82% correlation

-- 3. GOVERNANCE EFFECTIVENESS:
--    🏛️ Board Oversight:
--      - Risk committee meetings: Monthly (Target: Monthly)
--      - Risk reporting frequency: Quarterly (Target: Monthly)
--      - Board risk appetite: Clearly defined (67% coverage)
--      - Strategic alignment: 73% (Target: 90%)
   
--    🏛️ Management Structure:
--      - Three lines of defense: Partially implemented
--      - Risk ownership: 78% clearly assigned
--      - Escalation procedures: Well-defined
--      - Performance metrics: 23 KRIs tracked

-- 4. COMPLIANCE INTEGRATION:
--    📋 Multi-Framework Alignment:
--      - HIPAA compliance: 73% (Target: 95%)
--      - SOX compliance: 89% (Target: 95%)
--      - ISO 27001 readiness: 67% (Target: 85%)
--      - NIST CSF implementation: 71% (Target: 90%)
   
--    📋 Regulatory Change Management:
--      - Regulation monitoring: Automated (15 jurisdictions)
--      - Impact assessment: 48-hour turnaround
--      - Implementation tracking: 89% on-time
--      - Compliance testing: Quarterly cycle

-- 5. TECHNOLOGY INTEGRATION:
--    💻 GRC Platform Capabilities:
--      - Risk register automation: 78% complete
--      - Control testing workflow: 65% automated
--      - Compliance monitoring: Real-time (12 frameworks)
--      - Reporting automation: 89% of standard reports
   
--    💻 Data Analytics:
--      - Predictive risk modeling: 67% accuracy
--      - Trend analysis: 24-month historical data
--      - Correlation analysis: Cross-domain insights
--      - Executive dashboards: Real-time updates

-- 6. STRATEGIC RECOMMENDATIONS:
--    🎯 Short-term Priorities (0-6 months):
--      - Implement integrated GRC platform
--      - Establish risk appetite statements
--      - Automate compliance monitoring
--      - Enhance board reporting
   
--    🎯 Medium-term Initiatives (6-18 months):
--      - Deploy predictive analytics
--      - Integrate third-party risk management
--      - Implement continuous controls monitoring
--      - Establish risk culture program
   
--    🎯 Long-term Vision (18+ months):
--      - Achieve optimized maturity level
--      - Implement AI-driven risk insights
--      - Establish industry leadership position
--      - Create competitive advantage through GRC

-- 7. INVESTMENT PRIORITIES:
--    💰 Technology Investments:
--      - GRC platform: $1.2M (Year 1)
--      - Analytics tools: $450K
--      - Integration services: $300K
--      - Training & adoption: $200K
   
--    💰 Expected Returns:
--      - Operational efficiency: 34% improvement
--      - Risk reduction: 45% across all domains
--      - Compliance costs: 28% reduction
--      - Decision-making speed: 56% faster

-- 8. SUCCESS METRICS:
--    📈 Key Performance Indicators:
--      - GRC maturity score: 3.2 → 4.2
--      - Risk-adjusted ROI: 23% improvement
--      - Compliance efficiency: 34% cost reduction
--      - Stakeholder confidence: 67% increase
--      - Regulatory readiness: 95% target
   
--    📈 Continuous Improvement:
--      - Monthly performance reviews
--      - Quarterly maturity assessments
--      - Annual third-party validation
--      - Ongoing benchmarking studies
-- ', '2025-07-17 01:52:56.045962', '2025-07-17 01:52:56.045962');
-- INSERT INTO public.ai_analysis_results VALUES (22, 'risk_exposure', '
-- 🎯 EXECUTIVE RISK EXPOSURE ANALYSIS
-- Generated by AI GRC Engine v2.0

-- ═══════════════════════════════════════════════════════════════

-- 1. EXECUTIVE SUMMARY:
--    • Current organizational risk posture: MODERATE-HIGH
--    • Critical vulnerabilities identified: 23 high-priority items
--    • Recommended immediate actions: 8 strategic initiatives
--    • Estimated risk reduction potential: 67% within 6 months

-- 2. STRATEGIC RISK PRIORITIES:
--    ▶ Cybersecurity Infrastructure (Risk Score: 8.7/10)
--      - Legacy system vulnerabilities
--      - Insufficient endpoint protection
--      - Weak identity management controls
   
--    ▶ Regulatory Compliance Gaps (Risk Score: 7.9/10)
--      - HIPAA compliance deficiencies
--      - Data retention policy violations
--      - Audit trail inconsistencies
   
--    ▶ Third-Party Risk Exposure (Risk Score: 7.2/10)
--      - Vendor security assessments overdue
--      - Supply chain vulnerabilities
--      - Contract compliance monitoring gaps

-- 3. RESOURCE ALLOCATION RECOMMENDATIONS:
--    💰 Budget Priority 1: $2.3M - Cybersecurity modernization
--    💰 Budget Priority 2: $1.8M - Compliance automation platform
--    💰 Budget Priority 3: $950K - Third-party risk management tools

-- 4. QUARTERLY ROADMAP:
--    Q1: Infrastructure hardening and compliance framework
--    Q2: Vendor risk assessment and contract reviews
--    Q3: Security awareness training and policy updates
--    Q4: Continuous monitoring implementation

-- 5. BOARD REPORTING METRICS:
--    • Risk reduction percentage: Target 65%
--    • Compliance score improvement: Target 85%
--    • Incident response time: Target <2 hours
--    • Vendor risk coverage: Target 100%
-- ', '2025-07-17 10:26:40.062984', '2025-07-17 10:26:40.062984');
-- INSERT INTO public.ai_analysis_results VALUES (23, 'threat_landscape', '
-- 🛡️ CYBERSECURITY THREAT LANDSCAPE ANALYSIS
-- AI-Powered Threat Intelligence Report

-- ═══════════════════════════════════════════════════════════════

-- 1. CURRENT THREAT ENVIRONMENT:
--    • Threat level: ELEVATED (7.8/10)
--    • Active threat campaigns: 12 targeting healthcare sector
--    • Zero-day vulnerabilities: 3 affecting our technology stack
--    • Ransomware activity: 340% increase in healthcare attacks

-- 2. SECTOR-SPECIFIC THREATS:
--    🎯 Healthcare-Targeted Campaigns:
--      - Ransomware groups: LockBit, BlackCat, Royal
--      - Attack vectors: Phishing (67%), RDP exploitation (23%)
--      - Average ransom demand: $4.2M (up 89% YoY)
   
--    🎯 Supply Chain Attacks:
--      - Third-party software compromises
--      - Cloud service provider incidents
--      - Medical device vulnerabilities

-- 3. DEFENSIVE STRATEGY RECOMMENDATIONS:
--    ⚡ Immediate Actions (0-30 days):
--      - Deploy advanced email security
--      - Implement MFA across all systems
--      - Conduct emergency tabletop exercises
   
--    ⚡ Short-term Initiatives (1-3 months):
--      - Endpoint detection and response (EDR)
--      - Network segmentation implementation
--      - Threat hunting program establishment
   
--    ⚡ Long-term Strategy (3-12 months):
--      - Zero-trust architecture deployment
--      - AI-powered security operations center
--      - Continuous security validation

-- 4. THREAT INTELLIGENCE INTEGRATION:
--    • Real-time threat feeds: 15 premium sources
--    • Automated indicator processing: 50,000+ daily
--    • Threat hunting queries: 200+ custom rules
--    • Intelligence sharing: 8 industry partnerships

-- 5. INCIDENT RESPONSE READINESS:
--    • Response team availability: 24/7/365
--    • Mean time to detection: Target <15 minutes
--    • Mean time to containment: Target <1 hour
--    • Recovery time objective: Target <4 hours
-- ', '2025-07-17 10:26:40.08706', '2025-07-17 10:26:40.08706');
-- INSERT INTO public.ai_analysis_results VALUES (24, 'vulnerability_remediation', '
-- 🔧 VULNERABILITY REMEDIATION STRATEGY
-- AI-Driven Risk-Based Prioritization

-- ═══════════════════════════════════════════════════════════════

-- 1. VULNERABILITY LANDSCAPE OVERVIEW:
--    • Total vulnerabilities identified: 2,847
--    • Critical severity: 89 (3.1%)
--    • High severity: 342 (12.0%)
--    • Medium severity: 1,203 (42.3%)
--    • Low severity: 1,213 (42.6%)

-- 2. RISK-BASED PRIORITIZATION:
--    🚨 CRITICAL - Immediate Action Required (0-7 days):
--      - CVE-2024-0001: Remote code execution in web servers
--      - CVE-2024-0002: SQL injection in patient portal
--      - CVE-2024-0003: Privilege escalation in domain controllers
   
--    ⚠️ HIGH - Priority Remediation (7-30 days):
--      - Authentication bypass vulnerabilities: 23 instances
--      - Data exposure risks: 45 instances
--      - Service disruption potential: 67 instances

-- 3. AUTOMATED REMEDIATION RECOMMENDATIONS:
--    🤖 Patch Management Automation:
--      - Windows Update deployment: 89% automated
--      - Linux package management: 76% automated
--      - Third-party application updates: 45% automated
   
--    🤖 Configuration Management:
--      - Security baseline enforcement: 92% coverage
--      - Compliance drift detection: Real-time monitoring
--      - Automated remediation scripts: 156 available

-- 4. RESOURCE ALLOCATION:
--    👥 Team Assignments:
--      - Critical vulnerabilities: Senior security engineers (4 FTE)
--      - High vulnerabilities: Security analysts (6 FTE)
--      - Medium/Low: Automated tools + junior staff (2 FTE)
   
--    💰 Budget Requirements:
--      - Emergency patching: $125K
--      - Tool licensing: $89K annually
--      - Staff augmentation: $340K

-- 5. REMEDIATION TIMELINE:
--    Week 1-2: Critical vulnerability patching (100% completion)
--    Week 3-6: High-priority remediation (85% completion)
--    Month 2-3: Medium-priority addressing (70% completion)
--    Ongoing: Low-priority and maintenance (continuous)

-- 6. SUCCESS METRICS:
--    • Mean time to patch (critical): Target <24 hours
--    • Vulnerability aging: Target <30 days average
--    • Remediation rate: Target 95% within SLA
--    • False positive rate: Target <5%
-- ', '2025-07-17 10:26:40.096613', '2025-07-17 10:26:40.096613');
-- INSERT INTO public.ai_analysis_results VALUES (25, 'incident_patterns', '
-- 📊 INCIDENT PATTERN ANALYSIS
-- AI-Powered Trend Analysis & Response Optimization

-- ═══════════════════════════════════════════════════════════════

-- 1. INCIDENT TREND ANALYSIS:
--    • Total incidents (last 12 months): 1,247
--    • Average monthly incidents: 104
--    • Trend direction: 12% decrease (improvement)
--    • Seasonal patterns: 23% spike during flu season

-- 2. INCIDENT CATEGORIZATION:
--    🔐 Security Incidents (34%):
--      - Phishing attempts: 267 incidents
--      - Malware detections: 189 incidents
--      - Unauthorized access: 78 incidents
--      - Data breaches: 12 incidents
   
--    💻 System Incidents (28%):
--      - Server outages: 156 incidents
--      - Network disruptions: 134 incidents
--      - Application failures: 89 incidents
   
--    👤 Human Error (23%):
--      - Misconfiguration: 145 incidents
--      - Accidental data exposure: 67 incidents
--      - Process violations: 76 incidents

-- 3. RESPONSE EFFECTIVENESS METRICS:
--    ⏱️ Response Times:
--      - Mean time to detection: 18 minutes (Target: 15)
--      - Mean time to response: 47 minutes (Target: 30)
--      - Mean time to resolution: 4.2 hours (Target: 4)
   
--    📈 Resolution Rates:
--      - First-call resolution: 67% (Target: 75%)
--      - Escalation rate: 23% (Target: 20%)
--      - Customer satisfaction: 4.2/5 (Target: 4.5)

-- 4. PREDICTIVE ANALYTICS:
--    🔮 Incident Forecasting:
--      - Next month prediction: 98 incidents (±12)
--      - High-risk periods: End of quarter, system updates
--      - Resource planning: 15% staff increase recommended
   
--    🔮 Pattern Recognition:
--      - Recurring issues: 34% of incidents are repeats
--      - Root cause clusters: 8 primary categories identified
--      - Prevention opportunities: 67% preventable with automation

-- 5. IMPROVEMENT RECOMMENDATIONS:
--    ✅ Process Optimization:
--      - Automated triage implementation
--      - Self-service portal enhancement
--      - Knowledge base expansion (500+ articles)
   
--    ✅ Technology Enhancement:
--      - AI-powered incident classification
--      - Predictive alerting system
--      - Integrated communication platform
   
--    ✅ Training & Awareness:
--      - Monthly security awareness sessions
--      - Incident response simulation exercises
--      - Cross-team collaboration workshops

-- 6. COST IMPACT ANALYSIS:
--    💰 Incident Costs (Annual):
--      - Direct response costs: $2.3M
--      - Business disruption: $4.7M
--      - Regulatory fines: $340K
--      - Reputation impact: $1.2M (estimated)
   
--    💰 ROI of Improvements:
--      - Automation investment: $450K
--      - Expected savings: $1.8M annually
--      - Payback period: 3.2 months
-- ', '2025-07-17 10:26:40.105058', '2025-07-17 10:26:40.105058');
-- INSERT INTO public.ai_analysis_results VALUES (26, 'compliance_remediation', '
-- 📋 HIPAA COMPLIANCE REMEDIATION ANALYSIS
-- AI-Powered Regulatory Gap Assessment

-- ═══════════════════════════════════════════════════════════════

-- 1. COMPLIANCE POSTURE OVERVIEW:
--    • Overall HIPAA compliance score: 73% (Target: 95%)
--    • Critical gaps identified: 23 high-priority items
--    • Administrative safeguards: 78% compliant
--    • Physical safeguards: 85% compliant
--    • Technical safeguards: 67% compliant

-- 2. CRITICAL COMPLIANCE GAPS:
--    🚨 Administrative Safeguards:
--      - Security Officer designation incomplete
--      - Workforce training documentation gaps
--      - Business Associate Agreements outdated (34%)
--      - Incident response procedures insufficient
   
--    🚨 Physical Safeguards:
--      - Workstation access controls inadequate
--      - Media disposal procedures non-compliant
--      - Facility access logs incomplete
   
--    🚨 Technical Safeguards:
--      - Access control implementation gaps
--      - Audit log monitoring insufficient
--      - Data encryption not comprehensive
--      - Automatic logoff not configured

-- 3. REMEDIATION ROADMAP:
--    📅 Phase 1 (0-30 days) - Critical Items:
--      - Appoint qualified Security Officer
--      - Update all Business Associate Agreements
--      - Implement comprehensive audit logging
--      - Deploy data encryption across all systems
   
--    📅 Phase 2 (30-90 days) - High Priority:
--      - Conduct organization-wide HIPAA training
--      - Establish incident response procedures
--      - Implement access control matrix
--      - Deploy workstation security controls
   
--    📅 Phase 3 (90-180 days) - Systematic Improvements:
--      - Automate compliance monitoring
--      - Establish regular risk assessments
--      - Implement data loss prevention
--      - Create compliance dashboard

-- 4. RESOURCE REQUIREMENTS:
--    👥 Staffing Needs:
--      - HIPAA Compliance Officer: 1 FTE
--      - Privacy Analysts: 2 FTE
--      - Technical Implementation: 3 FTE
--      - Training Coordinators: 1 FTE
   
--    💰 Budget Allocation:
--      - Technology solutions: $890K
--      - Staff training: $125K
--      - External consulting: $200K
--      - Ongoing monitoring: $150K annually

-- 5. RISK MITIGATION:
--    ⚖️ Regulatory Risk Reduction:
--      - Potential fine exposure: $2.8M (current)
--      - Post-remediation exposure: $340K (88% reduction)
--      - Audit readiness score: Target 95%
   
--    ⚖️ Operational Risk Benefits:
--      - Data breach prevention: 78% risk reduction
--      - Process efficiency: 34% improvement
--      - Staff confidence: 67% increase

-- 6. MONITORING & MAINTENANCE:
--    📊 Continuous Compliance:
--      - Monthly compliance assessments
--      - Quarterly risk evaluations
--      - Annual third-party audits
--      - Real-time monitoring dashboard
   
--    📊 Key Performance Indicators:
--      - Compliance score: Target >95%
--      - Training completion: Target 100%
--      - Incident response time: Target <2 hours
--      - Audit findings: Target <5 per year

-- 7. SUCCESS METRICS:
--    • Compliance score improvement: 73% → 95%
--    • Risk assessment frequency: Quarterly
--    • Staff training completion: 100%
--    • Incident response capability: <2 hours
--    • Regulatory audit readiness: 95%
-- ', '2025-07-17 10:26:40.114676', '2025-07-17 10:26:40.114676');
-- INSERT INTO public.ai_analysis_results VALUES (27, 'integrated_grc', '
-- 🎯 INTEGRATED GRC ANALYSIS
-- Comprehensive Organizational Risk Posture Assessment

-- ═══════════════════════════════════════════════════════════════

-- 1. ORGANIZATIONAL RISK MATURITY:
--    • Overall GRC maturity level: 3.2/5 (Managed)
--    • Risk management: 3.4/5
--    • Governance framework: 3.1/5
--    • Compliance posture: 2.9/5
--    • Target maturity: 4.2/5 (Optimized)

-- 2. INTEGRATED RISK DASHBOARD:
--    📊 Risk Heat Map Analysis:
--      - Critical risks: 12 items requiring immediate attention
--      - High risks: 34 items with quarterly review
--      - Medium risks: 89 items with annual assessment
--      - Emerging risks: 23 items under monitoring
   
--    📊 Cross-Domain Risk Correlation:
--      - Cybersecurity ↔ Compliance: 78% correlation
--      - Operational ↔ Financial: 65% correlation
--      - Strategic ↔ Reputational: 82% correlation

-- 3. GOVERNANCE EFFECTIVENESS:
--    🏛️ Board Oversight:
--      - Risk committee meetings: Monthly (Target: Monthly)
--      - Risk reporting frequency: Quarterly (Target: Monthly)
--      - Board risk appetite: Clearly defined (67% coverage)
--      - Strategic alignment: 73% (Target: 90%)
   
--    🏛️ Management Structure:
--      - Three lines of defense: Partially implemented
--      - Risk ownership: 78% clearly assigned
--      - Escalation procedures: Well-defined
--      - Performance metrics: 23 KRIs tracked

-- 4. COMPLIANCE INTEGRATION:
--    📋 Multi-Framework Alignment:
--      - HIPAA compliance: 73% (Target: 95%)
--      - SOX compliance: 89% (Target: 95%)
--      - ISO 27001 readiness: 67% (Target: 85%)
--      - NIST CSF implementation: 71% (Target: 90%)
   
--    📋 Regulatory Change Management:
--      - Regulation monitoring: Automated (15 jurisdictions)
--      - Impact assessment: 48-hour turnaround
--      - Implementation tracking: 89% on-time
--      - Compliance testing: Quarterly cycle

-- 5. TECHNOLOGY INTEGRATION:
--    💻 GRC Platform Capabilities:
--      - Risk register automation: 78% complete
--      - Control testing workflow: 65% automated
--      - Compliance monitoring: Real-time (12 frameworks)
--      - Reporting automation: 89% of standard reports
   
--    💻 Data Analytics:
--      - Predictive risk modeling: 67% accuracy
--      - Trend analysis: 24-month historical data
--      - Correlation analysis: Cross-domain insights
--      - Executive dashboards: Real-time updates

-- 6. STRATEGIC RECOMMENDATIONS:
--    🎯 Short-term Priorities (0-6 months):
--      - Implement integrated GRC platform
--      - Establish risk appetite statements
--      - Automate compliance monitoring
--      - Enhance board reporting
   
--    🎯 Medium-term Initiatives (6-18 months):
--      - Deploy predictive analytics
--      - Integrate third-party risk management
--      - Implement continuous controls monitoring
--      - Establish risk culture program
   
--    🎯 Long-term Vision (18+ months):
--      - Achieve optimized maturity level
--      - Implement AI-driven risk insights
--      - Establish industry leadership position
--      - Create competitive advantage through GRC

-- 7. INVESTMENT PRIORITIES:
--    💰 Technology Investments:
--      - GRC platform: $1.2M (Year 1)
--      - Analytics tools: $450K
--      - Integration services: $300K
--      - Training & adoption: $200K
   
--    💰 Expected Returns:
--      - Operational efficiency: 34% improvement
--      - Risk reduction: 45% across all domains
--      - Compliance costs: 28% reduction
--      - Decision-making speed: 56% faster

-- 8. SUCCESS METRICS:
--    📈 Key Performance Indicators:
--      - GRC maturity score: 3.2 → 4.2
--      - Risk-adjusted ROI: 23% improvement
--      - Compliance efficiency: 34% cost reduction
--      - Stakeholder confidence: 67% increase
--      - Regulatory readiness: 95% target
   
--    📈 Continuous Improvement:
--      - Monthly performance reviews
--      - Quarterly maturity assessments
--      - Annual third-party validation
--      - Ongoing benchmarking studies
-- ', '2025-07-17 10:26:40.123509', '2025-07-17 10:26:40.123509');


-- --
-- -- TOC entry 6601 (class 0 OID 82045)
-- -- Dependencies: 255
-- -- Data for Name: assessment_action_plans; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6591 (class 0 OID 81943)
-- -- Dependencies: 245
-- -- Data for Name: assessment_assets; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6750 (class 0 OID 410014)
-- -- Dependencies: 405
-- -- Data for Name: assessment_attachments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6603 (class 0 OID 82067)
-- -- Dependencies: 257
-- -- Data for Name: assessment_comments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6853 (class 0 OID 778359)
-- -- Dependencies: 509
-- -- Data for Name: assessment_findings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.assessment_findings VALUES (1, 53, 'SSL not configured', 'SSL not configured', 'High', 'CIS', 'SSL not configured', 'Open', 'James', '2025-07-30', '2025-07-18 17:22:27.315428', '2025-07-18 17:22:27.315428', NULL, 1, 1, NULL, 'Medium', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
-- INSERT INTO public.assessment_findings VALUES (2, 53, 'API bot protection on on', 'API bot protection on on', 'Critical', 'CIS', 'API bot protection on on', 'Open', 'Paul', '2025-07-31', '2025-07-18 17:22:27.764271', '2025-07-18 17:22:27.764271', NULL, 1, 1, NULL, 'Medium', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);


-- --
-- -- TOC entry 6597 (class 0 OID 81995)
-- -- Dependencies: 251
-- -- Data for Name: assessment_impacts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6599 (class 0 OID 82013)
-- -- Dependencies: 253
-- -- Data for Name: assessment_risk_evaluations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6593 (class 0 OID 81964)
-- -- Dependencies: 247
-- -- Data for Name: assessment_threats; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6595 (class 0 OID 81980)
-- -- Dependencies: 249
-- -- Data for Name: assessment_vulnerabilities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6851 (class 0 OID 778265)
-- -- Dependencies: 507
-- -- Data for Name: assessments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.assessments VALUES (53, 'ASSESS-2024-001', 'Annual Security Assessment', 'Security', 'In Progress	', 'Comprehensive annual security assessment covering all critical systems', 1, 1, 1, '2025-07-18 17:11:26.164442', '2025-07-18 17:22:27.764271', 2, '2025-07-18', '2025-07-31', 'All production systems and applications'', ''NIST Cybersecurity Framework', NULL, 'Syed Naqvi', 'Draft');


-- --
-- -- TOC entry 6682 (class 0 OID 237569)
-- -- Dependencies: 336
-- -- Data for Name: assets; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.assets VALUES (7, 'Backup Storage', 'Hardware', 'Internal', 'IT Department', 'High', 3, 5, 4, 'Backup storage systems for critical data', 'Data Center B', '2025-07-10 18:13:17.958407', '2025-07-10 22:04:01.084516', 'AST-0000002', NULL, NULL);
-- INSERT INTO public.assets VALUES (3, 'Employee Workstations', 'Hardware', 'Internal', 'IT Department', 'Medium', 2, 3, 3, 'Standard employee desktop computers', 'Office Building', '2025-07-10 18:13:17.958407', '2025-07-10 22:04:01.074185', 'AST-0000001', NULL, NULL);
-- INSERT INTO public.assets VALUES (8, 'Public Website', 'Service', 'Public', 'Marketing Team', 'Medium', 1, 3, 4, 'Company public website and marketing materials', 'Cloud Service', '2025-07-10 18:13:17.958407', '2025-07-10 22:04:01.083648', 'AST-0000003', NULL, NULL);
-- INSERT INTO public.assets VALUES (12, 'Core Banking - T24', 'Software', 'Restricted', 'operations', 'Critical', 5, 5, 5, 'Core banking', 'UAE DC', '2025-07-12 13:43:07.143909', '2025-07-12 13:43:07.143909', 'AST-0000004', NULL, NULL);
-- INSERT INTO public.assets VALUES (14, 'cash management solution', 'Software', 'Restricted', 'Corporate banking', 'Critical', 5, 5, 5, 'cash management solution for corproate customers', 'Physical', '2025-07-13 12:10:15.427105', '2025-07-13 12:10:15.427105', 'AST-614847', NULL, NULL);
-- INSERT INTO public.assets VALUES (15, 'Oracle EBS', 'Software', 'Restricted', 'CFO', 'High', 5, 4, 3, 'Oracle EBS has all trial balance, accounts, etc', 'Oracle Cloud', '2025-07-13 23:59:26.162027', '2025-07-13 23:59:26.162027', 'AST-165525', NULL, NULL);


-- --
-- -- TOC entry 6757 (class 0 OID 450563)
-- -- Dependencies: 412
-- -- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.audit_logs VALUES (1, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-13 09:34:06.998448', NULL);
-- INSERT INTO public.audit_logs VALUES (2, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-13 09:34:17.74763', NULL);
-- INSERT INTO public.audit_logs VALUES (3, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-13 09:35:46.742047', NULL);
-- INSERT INTO public.audit_logs VALUES (4, 'system@company.com', 'CREATE', 'INCIDENT', '7', NULL, '{"status": "Open", "severity": "Critical", "risk_title": "DDOS Attack on Public Facing Assets", "assigned_to": "John", "incident_id": "INC-287031", "reported_by": "Paul", "detected_date": "2025-07-12T13:52", "incident_type": "Security Breach", "reported_date": "2025-07-13T09:51", "incident_title": "Clicked on a phishing email", "related_risk_id": 16, "related_asset_id": 4, "incident_description": "Clicked on a phishing email"}', NULL, NULL, NULL, true, NULL, NULL, '2025-07-13 09:52:23.812267', NULL);
-- INSERT INTO public.audit_logs VALUES (5, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-13 10:13:00.120391', NULL);
-- INSERT INTO public.audit_logs VALUES (6, 'chatbot@system.com', 'CREATE', 'INCIDENT', '13', NULL, '{"status": "Open", "severity": "High", "assigned_to": "IT", "reported_by": "Paul Hewman", "detected_date": "2025-07-13T11:01:00.019Z", "incident_type": "Other", "reported_date": "2025-07-13T11:01:00.020Z", "incident_title": "company confidential data", "incident_description": "i have sent the company data to wrong address"}', NULL, NULL, NULL, true, NULL, NULL, '2025-07-13 11:01:06.593681', NULL);
-- INSERT INTO public.audit_logs VALUES (7, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-13 11:01:51.78074', NULL);
-- INSERT INTO public.audit_logs VALUES (8, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-13 11:01:56.860813', NULL);
-- INSERT INTO public.audit_logs VALUES (9, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-13 11:53:41.440523', NULL);
-- INSERT INTO public.audit_logs VALUES (10, 'system@company.com', 'CREATE', 'RISK', '23', NULL, '{"asset_id": "14", "risk_owner": "Mark Lewman", "risk_title": "Exploitation of Unpatched Vulnerabilities", "category_id": null, "risk_status": "Open", "impact_score": 5, "threat_source": "External Hacker", "vulnerability": "unpatched software", "risk_tolerance": "Low", "risk_treatment": "Mitigate", "treatment_cost": 20000, "business_impact": "Exploitation of Unpatched Vulnerabilities", "identified_date": "2025-07-13", "likelihood_score": 4, "next_review_date": "2025-10-11", "review_frequency": "Quarterly", "risk_description": "Exploitation of Unpatched Vulnerabilities", "existing_controls": "Exploitation of Unpatched Vulnerabilities", "regulatory_impact": "Exploitation of Unpatched Vulnerabilities", "treatment_timeline": "3 months", "iso27002_control_id": 53, "risk_treatment_plan": "Exploitation of Unpatched Vulnerabilities", "financial_impact_max": 500000, "financial_impact_min": 200000, "control_effectiveness": "Partially Effective", "residual_impact_score": 5, "risk_appetite_threshold": 10, "residual_likelihood_score": 3}', NULL, NULL, NULL, true, NULL, NULL, '2025-07-13 13:39:43.611606', NULL);
-- INSERT INTO public.audit_logs VALUES (11, 'system@company.com', 'UPDATE', 'NIST_CSF_TEMPLATE', '5', '{"risk_level": "Critical", "template_name": "DDOS Attack on public facing assets"}', '{"risk_level": "Medium", "template_name": "DDOS Attack on public facing assets"}', NULL, NULL, NULL, true, NULL, NULL, '2025-07-13 14:14:54.82665', NULL);
-- INSERT INTO public.audit_logs VALUES (12, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-13 20:51:14.200874', NULL);
-- INSERT INTO public.audit_logs VALUES (13, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-13 22:41:27.785227', NULL);
-- INSERT INTO public.audit_logs VALUES (14, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-14 00:00:12.782503', NULL);
-- INSERT INTO public.audit_logs VALUES (15, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-14 00:03:44.625996', NULL);
-- INSERT INTO public.audit_logs VALUES (16, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-14 01:00:32.362048', NULL);
-- INSERT INTO public.audit_logs VALUES (17, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-14 01:03:19.468357', NULL);
-- INSERT INTO public.audit_logs VALUES (18, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-14 01:06:30.844287', NULL);
-- INSERT INTO public.audit_logs VALUES (19, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-14 10:52:51.38633', NULL);
-- INSERT INTO public.audit_logs VALUES (20, 'system@company.com', 'CREATE', 'ASSESSMENT', '2', NULL, '{"name": "Palo Alto Assessment", "type": "compliance", "status": "Planned", "assessor": "James Wilson", "end_date": "2025-07-18", "start_date": "2025-07-15", "description": "Palo Alto Assessment", "methodology": "iso27001", "overall_score": null, "findings_count": 0, "maturity_level": "Initial", "cybersecurity_assessment_id": "ASSESS-074832"}', NULL, NULL, NULL, true, NULL, '{"assessment_name": "Palo Alto Assessment", "cybersecurity_assessment_id": "ASSESS-074832"}', '2025-07-14 20:19:41.168505', NULL);
-- INSERT INTO public.audit_logs VALUES (21, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-14 21:25:05.568648', NULL);
-- INSERT INTO public.audit_logs VALUES (22, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-14 21:42:25.858398', NULL);
-- INSERT INTO public.audit_logs VALUES (23, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-14 22:33:56.74174', NULL);
-- INSERT INTO public.audit_logs VALUES (24, 'system@company.com', 'CREATE', 'ORGANIZATION', '9', NULL, '{"name": "Strop Bank", "email": "ciso@stropbank.com", "phone": "+971506583714", "status": "Active", "address": "123 Drive, Dubai", "website": "www.strop.com", "description": "Retail bank"}', NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 00:16:54.360364', NULL);
-- INSERT INTO public.audit_logs VALUES (25, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 12:45:08.480408', NULL);
-- INSERT INTO public.audit_logs VALUES (26, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 12:45:09.808818', NULL);
-- INSERT INTO public.audit_logs VALUES (27, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 12:45:09.816912', NULL);
-- INSERT INTO public.audit_logs VALUES (28, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 12:45:09.841373', NULL);
-- INSERT INTO public.audit_logs VALUES (29, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 12:45:09.860096', NULL);
-- INSERT INTO public.audit_logs VALUES (30, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 12:45:11.998098', NULL);
-- INSERT INTO public.audit_logs VALUES (31, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 12:45:13.175069', NULL);
-- INSERT INTO public.audit_logs VALUES (32, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 12:45:13.177187', NULL);
-- INSERT INTO public.audit_logs VALUES (33, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 12:45:13.17815', NULL);
-- INSERT INTO public.audit_logs VALUES (34, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 12:52:59.891381', NULL);
-- INSERT INTO public.audit_logs VALUES (35, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 13:00:35.825855', NULL);
-- INSERT INTO public.audit_logs VALUES (36, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 13:01:21.437843', NULL);
-- INSERT INTO public.audit_logs VALUES (37, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 15:15:12.555431', NULL);
-- INSERT INTO public.audit_logs VALUES (38, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 15:24:06.053703', NULL);
-- INSERT INTO public.audit_logs VALUES (39, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 15:27:27.17815', NULL);
-- INSERT INTO public.audit_logs VALUES (40, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 15:40:12.767508', NULL);
-- INSERT INTO public.audit_logs VALUES (41, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-15 15:40:50.839', NULL);
-- INSERT INTO public.audit_logs VALUES (42, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-16 06:06:26.273288', NULL);
-- INSERT INTO public.audit_logs VALUES (43, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-16 06:09:38.617709', NULL);
-- INSERT INTO public.audit_logs VALUES (44, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-16 12:27:01.67906', NULL);
-- INSERT INTO public.audit_logs VALUES (45, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-17 01:52:33.765913', NULL);
-- INSERT INTO public.audit_logs VALUES (46, 'system@company.com', 'CREATE', 'INCIDENT', '65', NULL, '{"status": "Open", "severity": "Critical", "assigned_to": "John", "incident_id": "INC-743361", "reported_by": "Paul", "detected_date": "2025-07-16T06:20", "incident_type": "Malware", "reported_date": "2025-07-17T02:19", "incident_title": "ITSEC systems were part of cyber attack", "related_risk_id": 23, "related_asset_id": null, "incident_description": "ITSEC systems were part of cyber attack"}', NULL, NULL, NULL, true, NULL, NULL, '2025-07-17 02:21:02.478449', NULL);
-- INSERT INTO public.audit_logs VALUES (47, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-17 10:18:48.218797', NULL);
-- INSERT INTO public.audit_logs VALUES (48, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-17 10:21:53.317079', NULL);
-- INSERT INTO public.audit_logs VALUES (49, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-17 13:01:30.669623', NULL);
-- INSERT INTO public.audit_logs VALUES (50, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-17 13:10:51.994037', NULL);
-- INSERT INTO public.audit_logs VALUES (51, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-17 16:36:16.285209', NULL);
-- INSERT INTO public.audit_logs VALUES (52, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-17 16:36:35.729725', NULL);
-- INSERT INTO public.audit_logs VALUES (53, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-17 20:21:26.506681', NULL);
-- INSERT INTO public.audit_logs VALUES (54, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-17 21:45:55.776154', NULL);
-- INSERT INTO public.audit_logs VALUES (55, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-17 21:46:00.579511', NULL);
-- INSERT INTO public.audit_logs VALUES (56, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-17 21:51:35.622736', NULL);
-- INSERT INTO public.audit_logs VALUES (57, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-17 22:05:44.160309', NULL);
-- INSERT INTO public.audit_logs VALUES (58, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-17 22:17:58.23178', NULL);
-- INSERT INTO public.audit_logs VALUES (59, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-17 22:57:14.181658', NULL);
-- INSERT INTO public.audit_logs VALUES (60, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-17 23:24:00.547765', NULL);
-- INSERT INTO public.audit_logs VALUES (61, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-18 00:21:25.298251', NULL);
-- INSERT INTO public.audit_logs VALUES (62, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-18 00:30:43.224342', NULL);
-- INSERT INTO public.audit_logs VALUES (63, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-18 00:48:19.679291', NULL);
-- INSERT INTO public.audit_logs VALUES (64, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-18 00:59:16.042113', NULL);
-- INSERT INTO public.audit_logs VALUES (65, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-18 09:51:06.783782', NULL);
-- INSERT INTO public.audit_logs VALUES (66, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-18 11:35:18.38926', NULL);
-- INSERT INTO public.audit_logs VALUES (67, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-18 13:50:28.173193', NULL);
-- INSERT INTO public.audit_logs VALUES (68, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-18 14:21:31.076161', NULL);
-- INSERT INTO public.audit_logs VALUES (69, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-18 14:33:43.499465', NULL);
-- INSERT INTO public.audit_logs VALUES (70, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-18 14:34:23.546079', NULL);
-- INSERT INTO public.audit_logs VALUES (71, 'system@company.com', 'CREATE', 'INCIDENT', '66', NULL, '{"status": "Open", "severity": "Critical", "assigned_to": "Security Team", "incident_id": "INC-001719", "reported_by": "Ahmed", "detected_date": "2025-07-18T21:34", "incident_type": "Phishing", "reported_date": "2025-07-18T17:33", "incident_title": "Clicked on a phishing email", "related_risk_id": 10, "related_asset_id": null, "incident_description": "Clicked on a phishing email, it took my to porn website"}', NULL, NULL, NULL, true, NULL, NULL, '2025-07-18 17:34:27.977445', NULL);
-- INSERT INTO public.audit_logs VALUES (72, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-18 17:37:27.824795', NULL);
-- INSERT INTO public.audit_logs VALUES (73, 'system@company.com', 'CREATE', 'USER', '1', NULL, '{"email": "syed@techcrop.com", "phone": "+971506583714", "status": "Active", "username": "syedaali", "job_title": "CISO", "last_name": "Naqvi", "first_name": "Syed", "department_id": 1, "organization_id": 1}', NULL, NULL, NULL, true, NULL, NULL, '2025-07-18 17:57:28.605446', NULL);
-- INSERT INTO public.audit_logs VALUES (74, 'system@company.com', 'CREATE', 'ORGANIZATION', '10', NULL, '{"name": "BZD Bank", "email": "admin@bzdbank.com", "phone": "+971544374848", "status": "Active", "address": "Mirdif Dubai\r\nVilla 05", "website": "www.bzd.com", "description": "retail banking"}', NULL, NULL, NULL, true, NULL, NULL, '2025-07-18 17:58:43.408133', NULL);
-- INSERT INTO public.audit_logs VALUES (75, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-18 17:59:04.89295', NULL);
-- INSERT INTO public.audit_logs VALUES (76, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-18 18:11:42.427542', NULL);
-- INSERT INTO public.audit_logs VALUES (77, 'system@company.com', 'UPDATE', 'ROLE_PAGE_ACCESS', '3', NULL, '{"updates": [{"pageId": 1, "hasAccess": true}, {"pageId": 2, "hasAccess": true}, {"pageId": 3, "hasAccess": false}, {"pageId": 4, "hasAccess": false}, {"pageId": 5, "hasAccess": false}, {"pageId": 6, "hasAccess": false}, {"pageId": 7, "hasAccess": false}, {"pageId": 8, "hasAccess": false}, {"pageId": 9, "hasAccess": true}, {"pageId": 10, "hasAccess": true}, {"pageId": 11, "hasAccess": true}, {"pageId": 12, "hasAccess": true}, {"pageId": 13, "hasAccess": false}, {"pageId": 14, "hasAccess": false}, {"pageId": 15, "hasAccess": false}, {"pageId": 16, "hasAccess": false}, {"pageId": 17, "hasAccess": false}, {"pageId": 18, "hasAccess": false}, {"pageId": 19, "hasAccess": false}]}', NULL, NULL, NULL, true, NULL, NULL, '2025-07-19 08:31:23.085807', NULL);
-- INSERT INTO public.audit_logs VALUES (78, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-19 08:32:46.842898', NULL);
-- INSERT INTO public.audit_logs VALUES (79, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-19 08:59:53.585999', NULL);
-- INSERT INTO public.audit_logs VALUES (80, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-19 10:19:21.720724', NULL);
-- INSERT INTO public.audit_logs VALUES (81, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-19 10:21:03.001849', NULL);
-- INSERT INTO public.audit_logs VALUES (82, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-19 10:45:12.625134', NULL);
-- INSERT INTO public.audit_logs VALUES (83, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-19 10:47:09.152132', NULL);
-- INSERT INTO public.audit_logs VALUES (84, 'system@company.com', 'READ', 'THREAT', 'all', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL, '2025-07-19 18:56:36.950996', NULL);
-- INSERT INTO public.audit_logs VALUES (85, 'system@company.com', 'UPDATE', 'INCIDENT', '66', NULL, '{"status": "Open", "due_date": "2025-07-25", "severity": "Critical", "assigned_to": "Security Team", "incident_id": "INC-001719", "reported_by": "Ahmed", "detected_date": "2025-07-18T17:34", "incident_type": "Phishing", "reported_date": "2025-07-18T13:33", "incident_title": "Clicked on a phishing email", "related_risk_id": 10, "related_asset_id": null, "incident_description": "Clicked on a phishing email, it took my to porn website"}', NULL, NULL, NULL, true, NULL, NULL, '2025-07-19 21:48:25.731505', NULL);
-- INSERT INTO public.audit_logs VALUES (86, 'system@company.com', 'UPDATE', 'INCIDENT', '9', NULL, '{"status": "In Progress", "due_date": "2024-01-20", "severity": "Critical", "assigned_to": "IT Manager", "incident_id": "INC-002", "reported_by": "Operations Team", "detected_date": "2024-01-14T10:15", "incident_type": "System Failure", "reported_date": "2024-01-14T10:20", "incident_title": "System Outage - Financial System", "related_risk_id": null, "related_asset_id": null, "incident_description": "Complete system failure affecting financial operations and customer transactions"}', NULL, NULL, NULL, true, NULL, NULL, '2025-07-19 21:49:30.457686', NULL);


-- --
-- -- TOC entry 6887 (class 0 OID 910663)
-- -- Dependencies: 604
-- -- Data for Name: auth_audit_log; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6585 (class 0 OID 24710)
-- -- Dependencies: 239
-- -- Data for Name: compliance_frameworks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.compliance_frameworks VALUES (1, 'ISO 27001', '2022', 'Information Security Management Systems', '2025-06-21 02:44:20.077751');
-- INSERT INTO public.compliance_frameworks VALUES (2, 'NIST Cybersecurity Framework', '1.1', 'Framework for Improving Critical Infrastructure Cybersecurity', '2025-06-21 02:44:20.077751');
-- INSERT INTO public.compliance_frameworks VALUES (3, 'SOC 2', 'Type II', 'Service Organization Control 2', '2025-06-21 02:44:20.077751');
-- INSERT INTO public.compliance_frameworks VALUES (4, 'GDPR', '2018', 'General Data Protection Regulation', '2025-06-21 02:44:20.077751');
-- INSERT INTO public.compliance_frameworks VALUES (5, 'PCI DSS', '4.0', 'Payment Card Industry Data Security Standard', '2025-06-21 02:44:20.077751');
-- INSERT INTO public.compliance_frameworks VALUES (18, 'ISO 27001', '2022', 'Information Security Management Systems', '2025-06-21 10:30:24.60449');
-- INSERT INTO public.compliance_frameworks VALUES (19, 'NIST Cybersecurity Framework', '1.1', 'Framework for Improving Critical Infrastructure Cybersecurity', '2025-06-21 10:30:24.60449');
-- INSERT INTO public.compliance_frameworks VALUES (20, 'SOC 2', 'Type II', 'Service Organization Control 2', '2025-06-21 10:30:24.60449');
-- INSERT INTO public.compliance_frameworks VALUES (21, 'GDPR', '2018', 'General Data Protection Regulation', '2025-06-21 10:30:24.60449');
-- INSERT INTO public.compliance_frameworks VALUES (22, 'PCI DSS', '4.0', 'Payment Card Industry Data Security Standard', '2025-06-21 10:30:24.60449');
-- INSERT INTO public.compliance_frameworks VALUES (23, 'HIPAA', '2013', 'Health Insurance Portability and Accountability Act', '2025-06-21 10:30:24.60449');
-- INSERT INTO public.compliance_frameworks VALUES (101, 'HIPAA', '2013', 'Health Insurance Portability and Accountability Act - Security and Privacy Rules', '2025-07-12 20:18:23.376232');


-- --
-- -- TOC entry 6587 (class 0 OID 24720)
-- -- Dependencies: 241
-- -- Data for Name: compliance_requirements; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6611 (class 0 OID 98308)
-- -- Dependencies: 265
-- -- Data for Name: comprehensive_risk_assessments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.comprehensive_risk_assessments VALUES (17, 'RISK-2024-001', 'Data Breach Risk', 'Risk of unauthorized access to customer personal data due to inadequate cybersecurity controls', 'Technology', 'John Smith', 'IT', 4, 5, 20, 2500000.00, 'Major', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'In Progress', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'system', '2025-06-22 12:29:10.911941', NULL, '2025-06-22 12:29:10.911941');
-- INSERT INTO public.comprehensive_risk_assessments VALUES (18, 'RISK-2024-002', 'Regulatory Compliance Risk', 'Risk of non-compliance with GDPR regulations leading to regulatory penalties', 'Compliance', 'Jane Doe', 'Legal', 3, 4, 12, 1000000.00, 'Moderate', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Completed', 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'system', '2025-06-22 12:29:10.911941', NULL, '2025-06-22 12:29:10.911941');
-- INSERT INTO public.comprehensive_risk_assessments VALUES (19, 'RISK-2024-003', 'Supply Chain Disruption', 'Risk of critical supplier failure impacting production and delivery schedules', 'Operational', 'Mike Johnson', 'Operations', 3, 3, 9, 800000.00, 'Moderate', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'In Progress', 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'system', '2025-06-22 12:29:10.911941', NULL, '2025-06-22 12:29:10.911941');
-- INSERT INTO public.comprehensive_risk_assessments VALUES (20, 'RISK-2024-004', 'Market Volatility Risk', 'Risk of significant market fluctuations affecting investment portfolio performance', 'Financial', 'Sarah Wilson', 'Finance', 4, 3, 12, 1500000.00, 'Minor', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Draft', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'system', '2025-06-22 12:29:10.911941', NULL, '2025-06-22 12:29:10.911941');
-- INSERT INTO public.comprehensive_risk_assessments VALUES (21, 'RISK-2024-005', 'Key Personnel Risk', 'Risk of losing critical staff members with specialized knowledge and skills', 'Strategic', 'David Brown', 'HR', 2, 4, 8, 500000.00, 'Major', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'In Progress', 4, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'system', '2025-06-22 12:29:10.911941', NULL, '2025-06-22 12:29:10.911941');


-- --
-- -- TOC entry 6653 (class 0 OID 131102)
-- -- Dependencies: 307
-- -- Data for Name: control_assessments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6651 (class 0 OID 131073)
-- -- Dependencies: 305
-- -- Data for Name: control_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.control_categories VALUES (1, 'A.5', 'Information Security Policies', 'Management direction and support for information security', '2025-06-22 14:36:00.901216');
-- INSERT INTO public.control_categories VALUES (2, 'A.6', 'Organization of Information Security', 'Internal organization and mobile devices/teleworking', '2025-06-22 14:36:00.901216');
-- INSERT INTO public.control_categories VALUES (3, 'A.7', 'Human Resource Security', 'Prior to employment, during employment, and termination', '2025-06-22 14:36:00.901216');
-- INSERT INTO public.control_categories VALUES (4, 'A.8', 'Asset Management', 'Responsibility for assets, information classification, media handling', '2025-06-22 14:36:00.901216');
-- INSERT INTO public.control_categories VALUES (5, 'A.9', 'Access Control', 'Business requirements, user access management, system responsibilities', '2025-06-22 14:36:00.901216');
-- INSERT INTO public.control_categories VALUES (6, 'A.10', 'Cryptography', 'Cryptographic controls', '2025-06-22 14:36:00.901216');
-- INSERT INTO public.control_categories VALUES (7, 'A.11', 'Physical and Environmental Security', 'Secure areas, equipment protection', '2025-06-22 14:36:00.901216');
-- INSERT INTO public.control_categories VALUES (8, 'A.12', 'Operations Security', 'Operational procedures, malware protection, backup, logging', '2025-06-22 14:36:00.901216');
-- INSERT INTO public.control_categories VALUES (9, 'A.13', 'Communications Security', 'Network security management, information transfer', '2025-06-22 14:36:00.901216');
-- INSERT INTO public.control_categories VALUES (10, 'A.14', 'System Acquisition, Development and Maintenance', 'Security requirements, security in development', '2025-06-22 14:36:00.901216');
-- INSERT INTO public.control_categories VALUES (11, 'A.15', 'Supplier Relationships', 'Information security in supplier relationships', '2025-06-22 14:36:00.901216');
-- INSERT INTO public.control_categories VALUES (12, 'A.16', 'Information Security Incident Management', 'Management of information security incidents', '2025-06-22 14:36:00.901216');
-- INSERT INTO public.control_categories VALUES (13, 'A.17', 'Information Security Aspects of Business Continuity Management', 'Information security continuity', '2025-06-22 14:36:00.901216');
-- INSERT INTO public.control_categories VALUES (14, 'A.18', 'Compliance', 'Compliance with legal requirements, information security reviews', '2025-06-22 14:36:00.901216');


-- --
-- -- TOC entry 6715 (class 0 OID 286775)
-- -- Dependencies: 369
-- -- Data for Name: control_test_evidence; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6711 (class 0 OID 286737)
-- -- Dependencies: 365
-- -- Data for Name: control_test_executions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.control_test_executions VALUES (1, 1, 1, '2024-01-15', 'John Smith', 'john.smith@company.com', 'Pass', 'Effective', 'Policy review completed successfully. Minor updates made to reflect new regulations.', 'Updated policy v2.1, approval email from CISO, staff notification email', NULL, NULL, '2025-01-15', '2025-07-11 12:17:29.182403', '2025-07-11 12:17:29.182403');
-- INSERT INTO public.control_test_executions VALUES (2, 2, 2, '2024-02-01', 'Jane Doe', 'jane.doe@company.com', 'Pass', 'Effective', 'MFA testing completed. All systems functioning correctly.', 'Test scripts output, monitoring dashboard screenshots', NULL, NULL, '2024-05-01', '2025-07-11 12:17:29.182403', '2025-07-11 12:17:29.182403');
-- INSERT INTO public.control_test_executions VALUES (3, 3, 3, '2024-03-01', 'Mike Johnson', 'mike.johnson@company.com', 'Partial', 'Partially Effective', 'Tabletop exercise revealed communication delays. Backup systems tested successfully.', 'Exercise report, communication timeline, system test logs', NULL, NULL, '2024-09-01', '2025-07-11 12:17:29.182403', '2025-07-11 12:17:29.182403');


-- --
-- -- TOC entry 6713 (class 0 OID 286758)
-- -- Dependencies: 367
-- -- Data for Name: control_test_issues; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.control_test_issues VALUES (1, 3, 'Communication Delays During Emergency', 'During the tabletop exercise, there were significant delays in notifying key stakeholders. The notification process took 45 minutes instead of the target 15 minutes.', 'Medium', 'Open', 'Risk Manager', '2024-04-01', NULL, NULL, '2025-07-11 12:17:29.182403', '2025-07-11 12:17:29.182403');


-- --
-- -- TOC entry 6709 (class 0 OID 286721)
-- -- Dependencies: 363
-- -- Data for Name: control_test_plans; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.control_test_plans VALUES (1, 1, 'Access Control Policy Review', 'Annual review of access control policies and procedures', 'Manual', 'Annually', '1. Review current access control policy document
--   2. Verify policy covers all required areas
--   3. Check for updates needed based on regulatory changes
--   4. Validate approval and communication processes', 'Updated policy document, approval records, communication evidence', 'Policy is current, complete, and properly approved', 'Security Manager', 'system', '2025-07-11 12:17:29.182403', '2025-07-11 12:17:29.182403');
-- INSERT INTO public.control_test_plans VALUES (2, 2, 'MFA Implementation Test', 'Quarterly testing of multi-factor authentication systems', 'Automated', 'Quarterly', '1. Test MFA enrollment process
--   2. Verify MFA bypass procedures
--   3. Test MFA recovery mechanisms
--   4. Validate MFA reporting and monitoring', 'Test results, screenshots, log files, monitoring reports', 'All MFA functions work correctly, no bypass vulnerabilities', 'IT Security Team', 'system', '2025-07-11 12:17:29.182403', '2025-07-11 12:17:29.182403');
-- INSERT INTO public.control_test_plans VALUES (3, 3, 'Business Continuity Plan Test', 'Semi-annual testing of business continuity procedures', 'Walkthrough', 'Semi-Annually', '1. Conduct tabletop exercise
--   2. Test communication procedures
--   3. Verify backup systems functionality
--   4. Review recovery time objectives', 'Exercise documentation, communication logs, system test results', 'All procedures execute within defined timeframes', 'Risk Manager', 'system', '2025-07-11 12:17:29.182403', '2025-07-11 12:17:29.182403');


-- --
-- -- TOC entry 6717 (class 0 OID 286790)
-- -- Dependencies: 371
-- -- Data for Name: control_test_schedule; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.control_test_schedule VALUES (1, 2, '2024-05-01', 'Automated', 'IT Security Team', 'Scheduled', false, NULL, '2025-07-11 12:17:29.182403', '2025-07-11 12:17:29.182403');
-- INSERT INTO public.control_test_schedule VALUES (2, 3, '2024-09-01', 'Walkthrough', 'Risk Manager', 'Scheduled', false, NULL, '2025-07-11 12:17:29.182403', '2025-07-11 12:17:29.182403');
-- INSERT INTO public.control_test_schedule VALUES (3, 1, '2025-01-15', 'Manual', 'Security Manager', 'Scheduled', false, NULL, '2025-07-11 12:17:29.182403', '2025-07-11 12:17:29.182403');


-- --
-- -- TOC entry 6657 (class 0 OID 131141)
-- -- Dependencies: 311
-- -- Data for Name: control_testing_schedule; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6579 (class 0 OID 24624)
-- -- Dependencies: 233
-- -- Data for Name: controls; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.controls VALUES (4, 'CR-001', 'Data Encryption', 'Encryption of data at rest and in transit', 'Technical', 'Cryptography', 'A.10.1.1', 'Implemented', 'Effective', 'IT Security', '2023-01-30', NULL, NULL, 'Quarterly', '2025-06-21 02:44:20.077751', '2025-06-21 02:44:20.077751', NULL, 'Not Tested', NULL);
-- INSERT INTO public.controls VALUES (1, 'AC-001', 'Access Control Policy', 'Formal access control policy and procedures', 'Administrative', 'Access Control', 'A.9.1.1', 'Implemented', 'Effective', 'CISO', '2023-01-15', '2024-01-15', NULL, 'Annual', '2025-06-21 02:44:20.077751', '2025-06-21 02:44:20.077751', 'Pass', 'Tested', NULL);
-- INSERT INTO public.controls VALUES (2, 'AC-002', 'Multi-Factor Authentication', 'MFA for all privileged accounts', 'Technical', 'Access Control', 'A.9.4.2', 'Implemented', 'Effective', 'IT Security', '2023-02-01', '2024-02-01', NULL, 'Quarterly', '2025-06-21 02:44:20.077751', '2025-06-21 02:44:20.077751', 'Pass', 'Tested', NULL);
-- INSERT INTO public.controls VALUES (3, 'BC-001', 'Business Continuity Plan', 'Comprehensive business continuity planning', 'Administrative', 'Business Continuity', 'A.17.1.1', 'Implemented', 'Partially Effective', 'Risk Manager', '2023-03-01', '2024-03-01', NULL, 'Semi-Annual', '2025-06-21 02:44:20.077751', '2025-06-21 02:44:20.077751', 'Partial', 'Tested', NULL);


-- --
-- -- TOC entry 6583 (class 0 OID 24681)
-- -- Dependencies: 237
-- -- Data for Name: cybersecurity_assessments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.cybersecurity_assessments VALUES (2, 'ASSESS-074832', 'Palo Alto Assessment', 'compliance', 'Palo Alto Assessment', 'iso27001', 'James Wilson', '2025-07-15', '2025-07-18', 'Planned', NULL, 'Initial', NULL, NULL, '2025-07-14 20:19:40.329528', '2025-07-14 20:19:40.329528', NULL, NULL, 0);


-- --
-- -- TOC entry 6871 (class 0 OID 802817)
-- -- Dependencies: 528
-- -- Data for Name: database_tables; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6766 (class 0 OID 516176)
-- -- Dependencies: 422
-- -- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.departments VALUES (1, 1, 'Information Security', 'null', 1, 'James Wilson', 100000.00, '9090', NULL, NULL, NULL, 'Active', '2025-07-18 16:56:21.947078', '2025-07-18 16:56:21.947078', NULL);


-- --
-- -- TOC entry 6788 (class 0 OID 532674)
-- -- Dependencies: 444
-- -- Data for Name: document_access_log; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6770 (class 0 OID 532481)
-- -- Dependencies: 426
-- -- Data for Name: document_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6780 (class 0 OID 532582)
-- -- Dependencies: 436
-- -- Data for Name: document_control_mappings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6784 (class 0 OID 532625)
-- -- Dependencies: 440
-- -- Data for Name: document_finding_mappings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6778 (class 0 OID 532559)
-- -- Dependencies: 434
-- -- Data for Name: document_relationships; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6786 (class 0 OID 532651)
-- -- Dependencies: 442
-- -- Data for Name: document_review_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6782 (class 0 OID 532607)
-- -- Dependencies: 438
-- -- Data for Name: document_risk_mappings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6794 (class 0 OID 540706)
-- -- Dependencies: 450
-- -- Data for Name: evidence; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.evidence VALUES (1, 'EVD-001', 'Security Awareness Training Records', 'Records of completed security awareness training sessions', 'Training Record', 'HR', 'security_training_2024.pdf', NULL, NULL, NULL, '2024-01-15', '2027-01-15', 'active', 'internal', NULL, '{training,security,awareness}', '{"participants": 150, "completion_rate": "98%"}', '2025-07-15 21:57:53.754713', '2025-07-15 21:57:53.754713', 'admin', 'admin');
-- INSERT INTO public.evidence VALUES (2, 'EVD-002', 'Penetration Test Report Q1 2024', 'External penetration testing report for Q1 2024', 'Assessment Report', 'Security', 'pentest_q1_2024.pdf', NULL, NULL, NULL, '2024-03-31', '2027-03-31', 'active', 'confidential', NULL, '{penetration-test,security,assessment}', '{"high": 4, "critical": 2, "findings": 12}', '2025-07-15 21:57:53.754713', '2025-07-15 21:57:53.754713', 'admin', 'admin');
-- INSERT INTO public.evidence VALUES (3, 'EVD-003', 'Data Processing Agreement - Vendor ABC', 'Signed data processing agreement with Vendor ABC', 'Contract', 'Legal', 'dpa_vendor_abc.pdf', NULL, NULL, NULL, '2024-02-01', '2027-02-01', 'active', 'confidential', NULL, '{dpa,vendor,privacy}', '{"vendor": "ABC Corp", "data_types": ["customer", "employee"]}', '2025-07-15 21:57:53.754713', '2025-07-15 21:57:53.754713', 'admin', 'admin');
-- INSERT INTO public.evidence VALUES (4, 'EVD-004', 'Backup Verification Log March 2024', 'Monthly backup verification and testing log', 'Log File', 'Operations', 'backup_verification_mar2024.log', NULL, NULL, NULL, '2024-03-31', '2025-03-31', 'active', 'internal', NULL, '{backup,verification,operations}', '{"success_rate": "100%", "tests_performed": 31}', '2025-07-15 21:57:53.754713', '2025-07-15 21:57:53.754713', 'admin', 'admin');
-- INSERT INTO public.evidence VALUES (5, 'EVD-005', 'ISO 27001 Certification', 'ISO 27001 certification document', 'Certificate', 'Compliance', 'iso27001_cert_2024.pdf', NULL, NULL, NULL, '2024-01-01', '2027-01-01', 'active', 'public', NULL, '{iso27001,certification,compliance}', '{"scope": "Information Security Management", "issuer": "BSI"}', '2025-07-15 21:57:53.754713', '2025-07-15 21:57:53.754713', 'admin', 'admin');
-- INSERT INTO public.evidence VALUES (6, 'EVD-006', 'Incident Response Exercise Report', 'Report from quarterly incident response tabletop exercise', 'Exercise Report', 'Security', 'ir_exercise_q1_2024.pdf', NULL, NULL, NULL, '2024-03-15', '2027-03-15', 'active', 'internal', NULL, '{incident-response,exercise,training}', '{"scenarios": 3, "improvements": 8, "participants": 25}', '2025-07-15 21:57:53.754713', '2025-07-15 21:57:53.754713', 'admin', 'admin');
-- INSERT INTO public.evidence VALUES (7, 'EVD-007', 'Access Review Results Q1 2024', 'Quarterly user access review results and remediation actions', 'Review Report', 'Security', 'access_review_q1_2024.xlsx', NULL, NULL, NULL, '2024-03-31', '2027-03-31', 'active', 'confidential', NULL, '{access-review,security,compliance}', '{"remediated": 12, "violations": 12, "accounts_reviewed": 500}', '2025-07-15 21:57:53.754713', '2025-07-15 21:57:53.754713', 'admin', 'admin');
-- INSERT INTO public.evidence VALUES (8, 'EVD-008', 'Vulnerability Scan Report March 2024', 'Monthly vulnerability scan report', 'Scan Report', 'Security', 'vuln_scan_mar2024.pdf', NULL, NULL, NULL, '2024-03-31', '2025-03-31', 'active', 'confidential', NULL, '{vulnerability,scan,security}', '{"high": 3, "medium": 15, "critical": 0, "vulnerabilities": 45}', '2025-07-15 21:57:53.754713', '2025-07-15 21:57:53.754713', 'admin', 'admin');


-- --
-- -- TOC entry 6776 (class 0 OID 532543)
-- -- Dependencies: 432
-- -- Data for Name: evidence_library; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6835 (class 0 OID 679959)
-- -- Dependencies: 491
-- -- Data for Name: fair_risk_treatment_controls; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6833 (class 0 OID 679937)
-- -- Dependencies: 489
-- -- Data for Name: fair_risk_treatment_plans; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.fair_risk_treatment_plans VALUES (1, 12, 'mitigate', 'Implement XDR replacing EDR', 'Reduce the risks', 30000.00, 10, 'pending', NULL, NULL, '2025-07-17 13:38:30.580688', '2025-07-17 13:38:30.580688', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
-- INSERT INTO public.fair_risk_treatment_plans VALUES (2, 3, 'mitigate', 'Implement a DLP and CDN', NULL, 25000.00, 70, 'pending', NULL, NULL, '2025-07-18 13:54:33.814763', '2025-07-18 13:54:33.814763', NULL, 'planning', 0, '2025-07-18', '2025-10-31', NULL, 'CISO', 'James', 'Current User', NULL, NULL, NULL, NULL, NULL);


-- --
-- -- TOC entry 6837 (class 0 OID 679984)
-- -- Dependencies: 493
-- -- Data for Name: fair_risk_treatment_tracking; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6830 (class 0 OID 638977)
-- -- Dependencies: 486
-- -- Data for Name: fair_risks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.fair_risks VALUES (1, 'FAIR-001', 'Ransomware Attack on Core Business Systems', 'Advanced ransomware targeting critical business systems with potential for complete operational shutdown and data encryption', 'SYS-001', 'Core Business Systems', 'organized-crime', 'Ransomware deployment and data encryption', 'Unpatched vulnerabilities in legacy systems, insufficient endpoint protection, and limited backup recovery capabilities', 'John Smith - CISO', 4, 5, 20.00, 'Critical', 2.80, 3.50, 9.80, 'High', 4, 4, 0.160000, 500000.00, 2000000.00, 1200000.00, 200000.00, 800000.00, 500000.00, 272000.00, 75.00, 'Implement advanced endpoint detection and response (EDR), establish comprehensive backup strategy, conduct regular vulnerability assessments, and implement network segmentation', 'in-progress', '2024-03-15', '2025-07-17 02:37:27.404087', '2025-07-17 02:37:27.404087', NULL, NULL, 0.00, 0.00, NULL, NULL);
-- INSERT INTO public.fair_risks VALUES (2, 'FAIR-002', 'Customer Data Breach via Targeted Phishing', 'Sophisticated spear-phishing campaign targeting employees with access to customer databases', 'DB-001', 'Customer Database', 'external-hacker', 'Spear-phishing leading to credential theft', 'Limited email security controls, insufficient user awareness training, and weak multi-factor authentication implementation', 'Sarah Johnson - Data Protection Officer', 4, 4, 16.00, 'High', 2.50, 2.80, 7.00, 'Medium', 3, 3, 0.090000, 250000.00, 1500000.00, 800000.00, 150000.00, 600000.00, 350000.00, 103500.00, 65.00, 'Deploy advanced email security gateway, implement mandatory MFA for all database access, conduct quarterly phishing simulation training', 'planned', '2024-02-28', '2025-07-17 02:37:27.404087', '2025-07-17 02:37:27.404087', NULL, NULL, 0.00, 0.00, NULL, NULL);
-- INSERT INTO public.fair_risks VALUES (3, 'FAIR-003', 'Malicious Insider Data Exfiltration', 'Privileged user with administrative access potentially exfiltrating sensitive intellectual property', 'IP-001', 'Intellectual Property Repository', 'insider-threat', 'Unauthorized data access and exfiltration', 'Excessive user privileges, limited data loss prevention controls, and insufficient user activity monitoring', 'Michael Chen - IT Security Manager', 3, 5, 15.00, 'High', 2.00, 3.20, 6.40, 'Medium', 2, 4, 0.080000, 300000.00, 2500000.00, 1500000.00, 500000.00, 1200000.00, 800000.00, 184000.00, 70.00, 'Implement privileged access management (PAM), deploy data loss prevention (DLP) solution, establish user behavior analytics', 'in-progress', '2024-04-10', '2025-07-17 02:37:27.404087', '2025-07-17 02:37:27.404087', NULL, NULL, 0.00, 0.00, NULL, NULL);
-- INSERT INTO public.fair_risks VALUES (4, 'FAIR-004', 'API Authentication Bypass Vulnerability', 'Critical vulnerability in customer-facing API allowing authentication bypass and unauthorized data access', 'API-001', 'Customer Portal API', 'external-hacker', 'API exploitation for data access', 'Weak API authentication mechanisms, insufficient input validation, and limited API monitoring', 'David Wilson - Application Security Lead', 3, 3, 9.00, 'Medium', 1.80, 2.10, 3.78, 'Low', 3, 2, 0.060000, 100000.00, 750000.00, 400000.00, 50000.00, 300000.00, 150000.00, 33000.00, 80.00, 'Implement OAuth 2.0 with proper token validation, deploy API gateway with rate limiting, conduct regular API security testing', 'completed', '2024-01-15', '2025-07-17 02:37:27.404087', '2025-07-17 02:37:27.404087', NULL, NULL, 0.00, 0.00, NULL, NULL);
-- INSERT INTO public.fair_risks VALUES (5, 'FAIR-005', 'Third-Party Software Supply Chain Compromise', 'Compromise of third-party software vendor leading to malicious code injection in business applications', 'APP-001', 'Business Applications', 'nation-state', 'Supply chain infiltration and malware deployment', 'Limited vendor security assessments, insufficient software integrity verification, and delayed security patching', 'Lisa Rodriguez - Vendor Risk Manager', 2, 4, 8.00, 'Medium', 1.50, 2.80, 4.20, 'Low', 2, 3, 0.060000, 200000.00, 1200000.00, 700000.00, 100000.00, 500000.00, 250000.00, 57000.00, 60.00, 'Establish comprehensive vendor security assessment program, implement software composition analysis, create incident response plan for supply chain events', 'planned', '2024-05-20', '2025-07-17 02:37:27.404087', '2025-07-17 02:37:27.404087', NULL, NULL, 0.00, 0.00, NULL, NULL);
-- INSERT INTO public.fair_risks VALUES (6, 'FAIR-006', 'Unauthorized Physical Access to Server Room', 'Potential unauthorized physical access to server room containing critical infrastructure', 'DC-001', 'Primary Data Center', 'insider-threat', 'Physical breach and system tampering', 'Aging physical access controls, limited surveillance coverage, and insufficient visitor management', 'Robert Kim - Facilities Manager', 2, 3, 6.00, 'Medium', 1.20, 1.80, 2.16, 'Low', 1, 2, 0.020000, 50000.00, 400000.00, 200000.00, 25000.00, 150000.00, 75000.00, 5500.00, 85.00, 'Upgrade physical access control systems, install comprehensive CCTV coverage, implement biometric authentication for critical areas', 'in-progress', '2024-03-30', '2025-07-17 02:37:27.404087', '2025-07-17 02:37:27.404087', NULL, NULL, 0.00, 0.00, NULL, NULL);
-- INSERT INTO public.fair_risks VALUES (7, 'FAIR-007', 'Mobile Device Data Leakage', 'Sensitive corporate data exposure through compromised or lost mobile devices', 'MOB-001', 'Corporate Mobile Devices', 'external-hacker', 'Mobile device compromise and data theft', 'Limited mobile device management, insufficient encryption, and weak remote wipe capabilities', 'Jennifer Park - Mobile Security Specialist', 2, 2, 4.00, 'Low', 1.00, 1.50, 1.50, 'Low', 2, 1, 0.020000, 25000.00, 200000.00, 100000.00, 15000.00, 100000.00, 50000.00, 3000.00, 90.00, 'Deploy comprehensive mobile device management (MDM) solution, enforce device encryption, implement remote wipe capabilities', 'completed', '2024-01-30', '2025-07-17 02:37:27.404087', '2025-07-17 02:37:27.404087', NULL, NULL, 0.00, 0.00, NULL, NULL);
-- INSERT INTO public.fair_risks VALUES (8, 'FAIR-008', 'Cloud Storage Misconfiguration Exposure', 'Misconfigured cloud storage buckets exposing sensitive customer and business data to public access', 'CLD-001', 'Cloud Storage Infrastructure', 'external-hacker', 'Exploitation of misconfigured cloud resources', 'Insufficient cloud security configuration management, limited access controls, and inadequate monitoring', 'Alex Thompson - Cloud Security Architect', 3, 3, 9.00, 'Medium', 1.80, 2.00, 3.60, 'Low', 3, 2, 0.060000, 150000.00, 900000.00, 500000.00, 75000.00, 400000.00, 200000.00, 42000.00, 75.00, 'Implement cloud security posture management (CSPM), establish infrastructure as code with security templates, conduct regular cloud configuration audits', 'planned', '2024-04-15', '2025-07-17 02:37:27.404087', '2025-07-17 02:37:27.404087', NULL, NULL, 0.00, 0.00, NULL, NULL);
-- INSERT INTO public.fair_risks VALUES (9, 'FAIR-009', 'SQL Injection in Customer Database', 'Critical SQL injection vulnerability in customer-facing web application allowing database access', 'WEB-001', 'Customer Web Application', 'external-hacker', 'SQL injection attack on database', 'Insufficient input validation, lack of parameterized queries, and elevated database privileges', 'Maria Garcia - Database Administrator', 4, 4, 16.00, 'High', 2.20, 2.50, 5.50, 'Medium', 4, 3, 0.120000, 200000.00, 1800000.00, 1000000.00, 100000.00, 700000.00, 400000.00, 168000.00, 70.00, 'Implement parameterized queries, deploy web application firewall (WAF), conduct regular penetration testing', 'in-progress', '2024-02-20', '2025-07-17 02:37:27.404087', '2025-07-17 02:37:27.404087', NULL, NULL, 0.00, 0.00, NULL, NULL);
-- INSERT INTO public.fair_risks VALUES (10, 'FAIR-010', 'Zero-Day Exploit in Network Infrastructure', 'Unknown zero-day vulnerability in critical network infrastructure components', 'NET-001', 'Core Network Infrastructure', 'nation-state', 'Zero-day exploit deployment', 'Unknown vulnerabilities in network equipment, limited threat intelligence, and insufficient network segmentation', 'Kevin Lee - Network Security Manager', 5, 5, 25.00, 'Critical', 3.50, 4.00, 14.00, 'High', 2, 5, 0.100000, 750000.00, 3000000.00, 2000000.00, 300000.00, 1500000.00, 900000.00, 290000.00, 60.00, 'Implement network segmentation, deploy advanced threat detection, establish threat intelligence program, create zero-day response procedures', 'planned', '2024-06-30', '2025-07-17 02:37:27.404087', '2025-07-17 02:37:27.404087', NULL, NULL, 0.00, 0.00, NULL, NULL);
-- INSERT INTO public.fair_risks VALUES (12, 'FAIR-000001', 'Ransomware Attack', 'Ransomware Attack', 'AST-614847', NULL, 'Ransomware Attack', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 3, NULL, 1000000.00, 2000000.00, 300000.00, 100000.00, 999993.00, 100000.00, 1187498.54, 3.00, 'Ransomware Attack', 'planned', '2025-09-30', '2025-07-17 13:01:02.555429', '2025-07-17 13:01:02.555429', '3', '3', 0.5, 1, 3, 50000);
-- INSERT INTO public.fair_risks VALUES (13, 'FAIR-000002', 'Personal Data Breach', 'Personal Data Breaches', 'AST-0000004', NULL, 'Ransomware Attack', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 4, NULL, 100000.00, 500000.00, 50000.00, 50000.00, 200000.00, 20000.00, 205597.22, 3.00, 'Implement the DLP solution, data encryption, data classification', 'planned', '2025-07-25', '2025-07-17 23:16:24.188461', '2025-07-17 23:16:24.188461', '4', '4', 0.55, 1, 2, 50000);


-- --
-- -- TOC entry 6800 (class 0 OID 548884)
-- -- Dependencies: 456
-- -- Data for Name: hipaa_assessment_requirements; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6826 (class 0 OID 598017)
-- -- Dependencies: 482
-- -- Data for Name: hipaa_assessment_results; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.hipaa_assessment_results VALUES (1, 1, 28, 'partially-compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, 'Update policies and procedures', 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (2, 1, 29, 'partially-compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'medium', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (3, 1, 30, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'medium', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (4, 1, 31, 'non-compliant', 'partially-implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'medium', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (5, 1, 32, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (6, 1, 33, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, 'Update policies and procedures', 'medium', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (7, 1, 34, 'non-compliant', 'partially-implemented', 'Documentation reviewed and validated during assessment', 'Minor documentation gaps identified', 'Update policies and procedures', 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (8, 1, 35, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', 'Minor documentation gaps identified', NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (9, 1, 36, 'partially-compliant', 'partially-implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (10, 1, 37, 'compliant', 'partially-implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'medium', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (11, 1, 38, 'partially-compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (12, 1, 39, 'partially-compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (13, 1, 40, 'partially-compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (14, 1, 41, 'partially-compliant', 'implemented', 'Documentation reviewed and validated during assessment', 'Minor documentation gaps identified', 'Update policies and procedures', 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (15, 1, 42, 'compliant', 'partially-implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'medium', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (16, 1, 43, 'non-compliant', 'implemented', 'Documentation reviewed and validated during assessment', 'Minor documentation gaps identified', NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (17, 1, 44, 'compliant', 'partially-implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'medium', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (18, 1, 45, 'partially-compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (19, 1, 46, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'medium', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (20, 1, 47, 'non-compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, 'Update policies and procedures', 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (21, 1, 48, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (22, 1, 49, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, 'Update policies and procedures', 'medium', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (23, 1, 50, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', 'Minor documentation gaps identified', NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (24, 1, 51, 'partially-compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (25, 1, 52, 'compliant', 'partially-implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (26, 1, 53, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (27, 1, 54, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, 'Update policies and procedures', 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (28, 1, 55, 'partially-compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (29, 1, 56, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, 'Update policies and procedures', 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (30, 1, 57, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, 'Update policies and procedures', 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (31, 1, 58, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', 'Minor documentation gaps identified', 'Update policies and procedures', 'medium', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (32, 1, 59, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (33, 1, 60, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, 'Update policies and procedures', 'medium', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (34, 1, 61, 'partially-compliant', 'partially-implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (35, 1, 62, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'medium', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (36, 1, 63, 'partially-compliant', 'partially-implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'medium', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (37, 1, 64, 'partially-compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (38, 1, 65, 'compliant', 'partially-implemented', 'Documentation reviewed and validated during assessment', NULL, 'Update policies and procedures', 'high', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (39, 1, 66, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (40, 1, 67, 'partially-compliant', 'implemented', 'Documentation reviewed and validated during assessment', 'Minor documentation gaps identified', 'Update policies and procedures', 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (41, 1, 68, 'compliant', 'partially-implemented', 'Documentation reviewed and validated during assessment', 'Minor documentation gaps identified', NULL, 'medium', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (42, 1, 69, 'compliant', 'implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (43, 1, 70, 'non-compliant', 'partially-implemented', 'Documentation reviewed and validated during assessment', NULL, NULL, 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (44, 1, 71, 'non-compliant', 'partially-implemented', 'Documentation reviewed and validated during assessment', 'Minor documentation gaps identified', 'Update policies and procedures', 'low', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (45, 1, 72, 'partially-compliant', 'partially-implemented', 'Documentation reviewed and validated during assessment', 'Minor documentation gaps identified', NULL, 'medium', 'Assessment completed as part of Q1 2024 review', NULL, NULL, '2024-07-15', 'IT Security Team', '2025-07-16 23:28:23.85349', '2025-07-16 23:28:23.85349', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (46, 2, 78, 'compliant', 'implemented', 'Privacy procedures and patient rights documentation reviewed', NULL, NULL, 'high', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (47, 2, 79, 'compliant', 'implemented', 'Privacy procedures and patient rights documentation reviewed', 'Patient notification procedures need enhancement', NULL, 'low', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (48, 2, 80, 'non-compliant', 'implemented', 'Privacy procedures and patient rights documentation reviewed', NULL, NULL, 'low', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (49, 2, 81, 'compliant', 'implemented', 'Privacy procedures and patient rights documentation reviewed', NULL, NULL, 'high', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (50, 2, 82, 'partially-compliant', 'partially-implemented', 'Privacy procedures and patient rights documentation reviewed', NULL, NULL, 'medium', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (51, 2, 83, 'compliant', 'partially-implemented', 'Privacy procedures and patient rights documentation reviewed', 'Patient notification procedures need enhancement', NULL, 'high', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (52, 2, 84, 'compliant', 'implemented', 'Privacy procedures and patient rights documentation reviewed', NULL, NULL, 'high', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (53, 2, 85, 'non-compliant', 'partially-implemented', 'Privacy procedures and patient rights documentation reviewed', 'Patient notification procedures need enhancement', NULL, 'medium', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (54, 2, 86, 'partially-compliant', 'implemented', 'Privacy procedures and patient rights documentation reviewed', NULL, 'Enhance patient rights documentation', 'medium', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (55, 2, 87, 'partially-compliant', 'implemented', 'Privacy procedures and patient rights documentation reviewed', 'Patient notification procedures need enhancement', NULL, 'low', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (56, 2, 88, 'partially-compliant', 'implemented', 'Privacy procedures and patient rights documentation reviewed', NULL, NULL, 'low', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (57, 2, 89, 'partially-compliant', 'implemented', 'Privacy procedures and patient rights documentation reviewed', NULL, NULL, 'low', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (58, 2, 90, 'compliant', 'partially-implemented', 'Privacy procedures and patient rights documentation reviewed', NULL, NULL, 'medium', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (59, 2, 91, 'compliant', 'implemented', 'Privacy procedures and patient rights documentation reviewed', 'Patient notification procedures need enhancement', NULL, 'medium', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (60, 2, 92, 'compliant', 'partially-implemented', 'Privacy procedures and patient rights documentation reviewed', NULL, NULL, 'medium', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (61, 2, 93, 'compliant', 'partially-implemented', 'Privacy procedures and patient rights documentation reviewed', NULL, NULL, 'low', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (62, 2, 94, 'partially-compliant', 'implemented', 'Privacy procedures and patient rights documentation reviewed', NULL, NULL, 'low', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (63, 2, 95, 'compliant', 'implemented', 'Privacy procedures and patient rights documentation reviewed', NULL, 'Enhance patient rights documentation', 'low', 'Privacy Rule assessment in progress', NULL, NULL, '2024-08-01', 'Privacy Officer', '2025-07-16 23:28:24.088375', '2025-07-16 23:28:24.088375', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (64, 5, 96, 'partially-compliant', 'implemented', 'Breach response procedures documented and tested', NULL, NULL, 'low', 'Excellent breach response procedures in place', NULL, NULL, '2024-07-20', 'Security Team', '2025-07-16 23:28:24.333463', '2025-07-16 23:28:24.333463', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (65, 5, 97, 'compliant', 'implemented', 'Breach response procedures documented and tested', NULL, NULL, 'low', 'Excellent breach response procedures in place', NULL, NULL, '2024-07-20', 'Security Team', '2025-07-16 23:28:24.333463', '2025-07-16 23:28:24.333463', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (66, 5, 98, 'compliant', 'implemented', 'Breach response procedures documented and tested', NULL, NULL, 'low', 'Excellent breach response procedures in place', NULL, NULL, '2024-07-20', 'Security Team', '2025-07-16 23:28:24.333463', '2025-07-16 23:28:24.333463', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (67, 5, 99, 'compliant', 'implemented', 'Breach response procedures documented and tested', NULL, NULL, 'low', 'Excellent breach response procedures in place', NULL, NULL, '2024-07-20', 'Security Team', '2025-07-16 23:28:24.333463', '2025-07-16 23:28:24.333463', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (68, 5, 100, 'compliant', 'implemented', 'Breach response procedures documented and tested', NULL, NULL, 'low', 'Excellent breach response procedures in place', NULL, NULL, '2024-07-20', 'Security Team', '2025-07-16 23:28:24.333463', '2025-07-16 23:28:24.333463', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (69, 5, 101, 'compliant', 'implemented', 'Breach response procedures documented and tested', NULL, NULL, 'low', 'Excellent breach response procedures in place', NULL, NULL, '2024-07-20', 'Security Team', '2025-07-16 23:28:24.333463', '2025-07-16 23:28:24.333463', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (70, 5, 102, 'compliant', 'implemented', 'Breach response procedures documented and tested', NULL, NULL, 'low', 'Excellent breach response procedures in place', NULL, NULL, '2024-07-20', 'Security Team', '2025-07-16 23:28:24.333463', '2025-07-16 23:28:24.333463', NULL, NULL);
-- INSERT INTO public.hipaa_assessment_results VALUES (71, 5, 103, 'compliant', 'implemented', 'Breach response procedures documented and tested', NULL, NULL, 'low', 'Excellent breach response procedures in place', NULL, NULL, '2024-07-20', 'Security Team', '2025-07-16 23:28:24.333463', '2025-07-16 23:28:24.333463', NULL, NULL);


-- --
-- -- TOC entry 6798 (class 0 OID 548865)
-- -- Dependencies: 454
-- -- Data for Name: hipaa_assessments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.hipaa_assessments VALUES (1, 'Annual Compliance Review', NULL, 'internal', NULL, NULL, NULL, '2025-07-16', NULL, NULL, 'Not Started', NULL, 'Medium', NULL, NULL, NULL, '2025-07-16 22:16:01.836422', '2025-07-16 22:16:01.836422', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
-- INSERT INTO public.hipaa_assessments VALUES (2, 'Q1 2024 HIPAA Security Rule Assessment', NULL, 'comprehensive', 'All electronic PHI systems and processes', NULL, NULL, '2024-01-15', 'Sarah Johnson', 'sarah.johnson@company.com', 'completed', 88, NULL, NULL, NULL, '2024-02-15', '2025-07-16 23:28:23.609152', '2025-07-16 23:28:23.609152', NULL, NULL, 45, 35, 6, 3, 1, 'IT Security Team', 'Information Technology', 'Comprehensive assessment of HIPAA Security Rule compliance for the first quarter of 2024');
-- INSERT INTO public.hipaa_assessments VALUES (3, 'Privacy Rule Compliance Review', NULL, 'focused', 'Patient data handling and privacy procedures', NULL, NULL, '2024-02-01', 'Michael Chen', 'michael.chen@company.com', 'in-progress', 72, NULL, NULL, NULL, '2024-02-28', '2025-07-16 23:28:23.609152', '2025-07-16 23:28:23.609152', NULL, NULL, 28, 18, 8, 2, 0, 'Privacy Officer', 'Compliance', 'Focused assessment on Privacy Rule requirements and patient rights');
-- INSERT INTO public.hipaa_assessments VALUES (4, 'Business Associate Agreement Review', NULL, 'focused', 'All business associate relationships and contracts', NULL, NULL, '2024-03-01', 'Lisa Rodriguez', 'lisa.rodriguez@company.com', 'planned', 0, NULL, NULL, NULL, '2024-03-31', '2025-07-16 23:28:23.609152', '2025-07-16 23:28:23.609152', NULL, NULL, 15, 0, 0, 0, 0, 'Legal Team', 'Legal & Compliance', 'Assessment of business associate agreements and third-party compliance');
-- INSERT INTO public.hipaa_assessments VALUES (5, 'Annual HIPAA Compliance Audit', NULL, 'comprehensive', 'Organization-wide HIPAA compliance assessment', NULL, NULL, '2024-04-01', 'David Park', 'david.park@company.com', 'planned', 0, NULL, NULL, NULL, '2024-05-31', '2025-07-16 23:28:23.609152', '2025-07-16 23:28:23.609152', NULL, NULL, 67, 0, 0, 0, 0, 'Audit Team', 'Internal Audit', 'Comprehensive annual assessment covering all HIPAA requirements');
-- INSERT INTO public.hipaa_assessments VALUES (6, 'Breach Response Procedures Assessment', NULL, 'focused', 'Incident response and breach notification processes', NULL, NULL, '2024-01-20', 'Jennifer Walsh', 'jennifer.walsh@company.com', 'completed', 91, NULL, NULL, NULL, '2024-02-10', '2025-07-16 23:28:23.609152', '2025-07-16 23:28:23.609152', NULL, NULL, 12, 11, 1, 0, 0, 'Security Team', 'Information Security', 'Evaluation of breach notification and response procedures');


-- --
-- -- TOC entry 6740 (class 0 OID 385041)
-- -- Dependencies: 395
-- -- Data for Name: hipaa_compliance_tests; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6738 (class 0 OID 385025)
-- -- Dependencies: 393
-- -- Data for Name: hipaa_controls; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.hipaa_controls VALUES (1, '164.308.a.1', 'Security Officer', 'Assign security responsibilities to an individual who is responsible for the development and implementation of the policies and procedures required by this subpart for the entity.', 'Security', '164.308(a)(1)', 'Required', 'Administrative Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (2, '164.308.a.2', 'Assigned Security Responsibilities', 'Identify the security officer who is responsible for the development and implementation of the policies and procedures required by this subpart for the entity.', 'Security', '164.308(a)(2)', 'Required', 'Administrative Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (3, '164.308.a.3', 'Workforce Training', 'Implement procedures to authorize access to electronic protected health information that is consistent with the applicable requirements of subpart E of this part.', 'Security', '164.308(a)(3)', 'Required', 'Administrative Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (4, '164.308.a.4', 'Information Access Management', 'Implement procedures for authorizing access to electronic protected health information that is consistent with the applicable requirements of subpart E of this part.', 'Security', '164.308(a)(4)', 'Required', 'Administrative Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (5, '164.308.a.5', 'Security Awareness and Training', 'Implement a security awareness and training program for all members of its workforce (including management).', 'Security', '164.308(a)(5)', 'Required', 'Administrative Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (6, '164.308.a.6', 'Security Incident Procedures', 'Implement procedures to address security incidents.', 'Security', '164.308(a)(6)', 'Required', 'Administrative Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (7, '164.308.a.7', 'Contingency Plan', 'Establish (and implement as needed) procedures for responding to an emergency or other occurrence (for example, fire, vandalism, system failure, and natural disaster) that damages systems that contain electronic protected health information.', 'Security', '164.308(a)(7)', 'Required', 'Administrative Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (8, '164.308.a.8', 'Evaluation', 'Perform a periodic technical and nontechnical evaluation, based initially upon the standards implemented under this rule and subsequently, in response to environmental or operational changes affecting the security of electronic protected health information, that establishes the extent to which an entity''s security policies and procedures meet the requirements of this subpart.', 'Security', '164.308(a)(8)', 'Required', 'Administrative Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (9, '164.310.a.1', 'Facility Access Controls', 'Implement procedures to limit physical access to its electronic information systems and the facility or facilities in which they are housed, while ensuring that properly authorized access is allowed.', 'Security', '164.310(a)(1)', 'Required', 'Physical Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (10, '164.310.a.2', 'Workstation Use', 'Implement procedures that specify the proper functions to be performed, the manner in which those functions are to be performed, and the physical attributes of the surroundings of a specific workstation or class of workstation that can access electronic protected health information.', 'Security', '164.310(a)(2)', 'Required', 'Physical Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (11, '164.310.d.1', 'Device and Media Controls', 'Implement procedures that govern the receipt and removal of hardware and electronic media that contain electronic protected health information into and out of a facility, and the movement of these items within the facility.', 'Security', '164.310(d)(1)', 'Required', 'Physical Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (12, '164.312.a.1', 'Access Control', 'Implement technical policies and procedures for electronic information systems that maintain electronic protected health information to allow access only to those persons or software programs that have been granted access rights as specified in § 164.308(a)(4).', 'Security', '164.312(a)(1)', 'Required', 'Technical Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (13, '164.312.b', 'Audit Controls', 'Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use electronic protected health information.', 'Security', '164.312(b)', 'Required', 'Technical Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (14, '164.312.c.1', 'Integrity', 'Implement electronic mechanisms to corroborate that electronic protected health information has not been altered or destroyed in an unauthorized manner.', 'Security', '164.312(c)(1)', 'Required', 'Technical Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (15, '164.312.d', 'Person or Entity Authentication', 'Implement procedures to verify that a person or entity seeking access to electronic protected health information is the one claimed.', 'Security', '164.312(d)', 'Required', 'Technical Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (16, '164.312.e.1', 'Transmission Security', 'Implement technical security measures to guard against unauthorized access to electronic protected health information that is being transmitted over an electronic communications network.', 'Security', '164.312(e)(1)', 'Required', 'Technical Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (17, '164.308.a.1.ii.A', 'Conduct Periodic Security Evaluations', 'Perform a periodic technical and nontechnical evaluation in response to environmental or operational changes affecting the security of ePHI.', 'Security', '164.308(a)(1)(ii)(A)', 'Addressable', 'Administrative Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (18, '164.308.a.1.ii.B', 'Assign Security Responsibilities', 'Assign security responsibilities to an individual.', 'Security', '164.308(a)(1)(ii)(B)', 'Addressable', 'Administrative Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (19, '164.308.a.3.ii.A', 'Authorization Procedures', 'Implement procedures for the authorization and/or supervision of workforce members who work with ePHI or in locations where it might be accessed.', 'Security', '164.308(a)(3)(ii)(A)', 'Addressable', 'Administrative Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (20, '164.308.a.3.ii.B', 'Workforce Clearance Procedures', 'Implement procedures to determine that the access of a workforce member to ePHI is appropriate.', 'Security', '164.308(a)(3)(ii)(B)', 'Addressable', 'Administrative Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (21, '164.308.a.3.ii.C', 'Termination Procedures', 'Implement procedures for terminating access to ePHI when the employment of a workforce member ends.', 'Security', '164.308(a)(3)(ii)(C)', 'Addressable', 'Administrative Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (22, '164.308.a.4.ii.A', 'Isolating Health Care Clearinghouse Functions', 'If a health care clearinghouse is part of a larger organization, the clearinghouse must implement policies and procedures that protect ePHI from unauthorized access by the larger organization.', 'Security', '164.308(a)(4)(ii)(A)', 'Addressable', 'Administrative Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (23, '164.308.a.4.ii.B', 'Access Authorization', 'Implement policies and procedures for granting access to ePHI through access to a workstation, transaction, program, process or other mechanism.', 'Security', '164.308(a)(4)(ii)(B)', 'Addressable', 'Administrative Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (24, '164.308.a.4.ii.C', 'Access Establishment and Modification', 'Implement policies and procedures that, based upon the entity''s access authorization policies, establish, document, review, and modify a user''s right of access to a workstation, transaction, program, or process.', 'Security', '164.308(a)(4)(ii)(C)', 'Addressable', 'Administrative Safeguards', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (25, '164.502.a', 'Uses and Disclosures - General Rules', 'A covered entity may not use or disclose protected health information, except as permitted or required by this subpart or by subpart C of part 160 of this subchapter.', 'Privacy', '164.502(a)', 'Required', 'Privacy Requirements', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (26, '164.506', 'Uses and Disclosures for Treatment, Payment, and Health Care Operations', 'A covered entity may use or disclose protected health information for its own treatment, payment, or health care operations.', 'Privacy', '164.506', 'Required', 'Privacy Requirements', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (27, '164.508', 'Uses and Disclosures for Which an Authorization is Required', 'A covered entity may not use or disclose protected health information without an authorization that is valid under this section, except as otherwise permitted or required by this subpart.', 'Privacy', '164.508', 'Required', 'Privacy Requirements', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (28, '164.510', 'Uses and Disclosures Requiring an Opportunity for the Individual to Agree or to Object', 'A covered entity may use or disclose protected health information, provided that the individual is informed in advance of the use or disclosure and has the opportunity to agree to or prohibit or restrict the use or disclosure.', 'Privacy', '164.510', 'Required', 'Privacy Requirements', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (29, '164.512', 'Uses and Disclosures for Which an Authorization or Opportunity to Agree or Object is Not Required', 'A covered entity may use or disclose protected health information without the written authorization of the individual, or the opportunity for the individual to agree or object.', 'Privacy', '164.512', 'Required', 'Privacy Requirements', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (30, '164.514', 'Other Requirements Relating to Uses and Disclosures of Protected Health Information', 'A covered entity may not use or disclose protected health information, except as permitted by this subpart.', 'Privacy', '164.514', 'Required', 'Privacy Requirements', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (31, '164.520', 'Notice of Privacy Practices for Protected Health Information', 'A covered entity must provide a notice of privacy practices to individuals.', 'Privacy', '164.520', 'Required', 'Privacy Requirements', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (32, '164.522', 'Rights to Request Privacy Protection for Protected Health Information', 'A covered entity must permit an individual to request that the covered entity restrict uses or disclosures of protected health information about the individual.', 'Privacy', '164.522', 'Required', 'Privacy Requirements', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (33, '164.524', 'Access of Individuals to Protected Health Information', 'An individual has a right of access to inspect and obtain a copy of protected health information about the individual.', 'Privacy', '164.524', 'Required', 'Privacy Requirements', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (34, '164.526', 'Amendment of Protected Health Information', 'An individual has the right to have a covered entity amend protected health information or a record about the individual in a designated record set.', 'Privacy', '164.526', 'Required', 'Privacy Requirements', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (35, '164.528', 'Accounting of Disclosures of Protected Health Information', 'An individual has a right to receive an accounting of disclosures of protected health information made by a covered entity.', 'Privacy', '164.528', 'Required', 'Privacy Requirements', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');
-- INSERT INTO public.hipaa_controls VALUES (36, '164.530', 'Administrative Requirements', 'A covered entity must designate a privacy officer who is responsible for the development and implementation of the policies and procedures of the entity.', 'Privacy', '164.530', 'Required', 'Privacy Requirements', 'Not Implemented', 'Non-Compliant', NULL, NULL, NULL, NULL, NULL, 'Medium', NULL, '2025-07-12 20:18:31.649586', '2025-07-12 20:18:31.649586');


-- --
-- -- TOC entry 6814 (class 0 OID 573499)
-- -- Dependencies: 470
-- -- Data for Name: hipaa_remediation_actions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6802 (class 0 OID 557057)
-- -- Dependencies: 458
-- -- Data for Name: hipaa_requirements; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.hipaa_requirements VALUES (28, 'Administrative Safeguards', '164.308(a)(1)(i)', 'Security Officer', 'Assign security responsibilities to an individual who is not the information system administrator and conduct an accurate and thorough assessment of the potential risks and vulnerabilities to the confidentiality, integrity, and availability of electronic protected health information held by the covered entity or business associate.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (29, 'Administrative Safeguards', '164.308(a)(1)(ii)(A)', 'Conduct Security Evaluation', 'Conduct an accurate and thorough assessment of the potential risks and vulnerabilities to the confidentiality, integrity, and availability of electronic protected health information held by the covered entity or business associate.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (30, 'Administrative Safeguards', '164.308(a)(1)(ii)(B)', 'Assigned Security Responsibilities', 'Assign security responsibilities to an individual who is not the information system administrator.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (31, 'Administrative Safeguards', '164.308(a)(2)', 'Assigned Security Responsibilities', 'Identify the security officer or security official who is responsible for the development and implementation of the policies and procedures required by this subpart for the entity.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (32, 'Administrative Safeguards', '164.308(a)(3)(i)', 'Workforce Training and Access Management', 'Implement policies and procedures to ensure that all members of its workforce have appropriate access to electronic protected health information, and prevent those workforce members who do not have access from obtaining access to electronic protected health information.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (33, 'Administrative Safeguards', '164.308(a)(3)(ii)(A)', 'Authorization Procedures', 'Implement procedures for the authorization and/or supervision of workforce members who work with electronic protected health information or in locations where it might be accessed.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (34, 'Administrative Safeguards', '164.308(a)(3)(ii)(B)', 'Workforce Clearance Procedure', 'Implement procedures to determine that the access of a workforce member to electronic protected health information is appropriate.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (35, 'Administrative Safeguards', '164.308(a)(3)(ii)(C)', 'Termination Procedures', 'Implement procedures for terminating access to electronic protected health information when the employment of, or other arrangement with, a workforce member ends or as required by determinations made as specified in paragraph (a)(3)(ii)(B) of this section.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (36, 'Administrative Safeguards', '164.308(a)(4)(i)', 'Information Access Management', 'Implement policies and procedures for authorizing access to electronic protected health information that are consistent with the applicable requirements of subpart E of this part.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (37, 'Administrative Safeguards', '164.308(a)(4)(ii)(A)', 'Isolating Health Care Clearinghouse Functions', 'If a health care clearinghouse is part of a larger organization, the clearinghouse must implement policies and procedures that protect the electronic protected health information of the clearinghouse from unauthorized access by the larger organization.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (38, 'Administrative Safeguards', '164.308(a)(4)(ii)(B)', 'Access Authorization', 'Implement policies and procedures for granting access to electronic protected health information, for example, through access to a workstation, transaction, program, process, or other mechanism.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (39, 'Administrative Safeguards', '164.308(a)(4)(ii)(C)', 'Access Establishment and Modification', 'Implement policies and procedures that, based upon the entity''s access authorization policies, establish, document, review, and modify a user''s right of access to a workstation, transaction, program, or process.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (40, 'Administrative Safeguards', '164.308(a)(5)(i)', 'Security Awareness and Training', 'Implement a security awareness and training program for all members of its workforce (including management).', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (41, 'Administrative Safeguards', '164.308(a)(5)(ii)(A)', 'Security Reminders', 'Conduct periodic security updates.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (42, 'Administrative Safeguards', '164.308(a)(5)(ii)(B)', 'Protection from Malicious Software', 'Implement procedures for guarding against, detecting, and reporting malicious software.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (43, 'Administrative Safeguards', '164.308(a)(5)(ii)(C)', 'Log-in Monitoring', 'Implement procedures for monitoring log-in attempts and reporting discrepancies.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (44, 'Administrative Safeguards', '164.308(a)(5)(ii)(D)', 'Password Management', 'Implement procedures for creating, changing, and safeguarding passwords.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (45, 'Administrative Safeguards', '164.308(a)(6)(i)', 'Security Incident Procedures', 'Implement policies and procedures to address security incidents.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (46, 'Administrative Safeguards', '164.308(a)(6)(ii)', 'Response and Reporting', 'Identify and respond to suspected or known security incidents; mitigate, to the extent practicable, harmful effects of security incidents that are known to the covered entity or business associate; and document security incidents and their outcomes.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (47, 'Administrative Safeguards', '164.308(a)(7)(i)', 'Contingency Plan', 'Establish (and implement as needed) policies and procedures for responding to an emergency or other occurrence (for example, fire, vandalism, system failure, and natural disaster) that damages systems that contain electronic protected health information.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (48, 'Administrative Safeguards', '164.308(a)(7)(ii)(A)', 'Data Backup Plan', 'Establish and implement procedures to create and maintain retrievable exact copies of electronic protected health information.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (49, 'Administrative Safeguards', '164.308(a)(7)(ii)(B)', 'Disaster Recovery Plan', 'Establish (and implement as needed) procedures to restore any loss of data.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (50, 'Administrative Safeguards', '164.308(a)(7)(ii)(C)', 'Emergency Mode Operation Plan', 'Establish (and implement as needed) procedures to enable continuation of critical business processes for protection of the security of electronic protected health information while operating in emergency mode.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (51, 'Administrative Safeguards', '164.308(a)(7)(ii)(D)', 'Testing and Revision Procedures', 'Implement procedures for periodic testing and revision of contingency plans.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (52, 'Administrative Safeguards', '164.308(a)(7)(ii)(E)', 'Applications and Data Criticality Analysis', 'Assess the relative criticality of specific applications and data in support of other contingency plan components.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (53, 'Administrative Safeguards', '164.308(a)(8)', 'Evaluation', 'Perform a periodic technical and nontechnical evaluation, based initially upon the standards implemented under this rule and, subsequently, in response to environmental or operational changes affecting the security of electronic protected health information, that establishes the extent to which an entity''s security policies and procedures meet the requirements of this subpart.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (54, 'Physical Safeguards', '164.310(a)(1)', 'Facility Access Controls', 'Implement policies and procedures to limit physical access to its electronic information systems and the facility or facilities in which they are housed, while ensuring that properly authorized access is allowed.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (55, 'Physical Safeguards', '164.310(a)(2)(i)', 'Contingency Operations', 'Establish (and implement as needed) procedures that allow facility access in support of restoration of lost data under the disaster recovery plan and emergency mode operations plan in the event of an emergency.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (56, 'Physical Safeguards', '164.310(a)(2)(ii)', 'Facility Security Plan', 'Implement policies and procedures to safeguard the facility and the equipment therein from unauthorized physical access, tampering, and theft.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (57, 'Physical Safeguards', '164.310(a)(2)(iii)', 'Access Control and Validation Procedures', 'Implement procedures to control and validate a person''s access to facilities based on their role or function, including visitor control, and control of access to software programs for testing and revision.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (58, 'Physical Safeguards', '164.310(a)(2)(iv)', 'Maintenance Records', 'Implement policies and procedures to document repairs and modifications to the physical components of a facility which are related to security (for example, hardware, walls, doors, and locks).', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (59, 'Physical Safeguards', '164.310(b)', 'Workstation Use', 'Implement policies and procedures that specify the proper functions to be performed, the manner in which those functions are to be performed, and the physical attributes of the surroundings of a specific workstation or class of workstation that can access electronic protected health information.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (60, 'Physical Safeguards', '164.310(c)', 'Workstation Security', 'Implement physical safeguards for all workstations that access electronic protected health information, to restrict access to authorized users.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (61, 'Physical Safeguards', '164.310(d)(1)', 'Device and Media Controls', 'Implement policies and procedures that govern the receipt and removal of hardware and electronic media that contain electronic protected health information into and out of a facility, and the movement of these items within the facility.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (62, 'Physical Safeguards', '164.310(d)(2)(i)', 'Disposal', 'Implement policies and procedures to address the final disposition of electronic protected health information, and/or the hardware or electronic media on which it is stored.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (63, 'Physical Safeguards', '164.310(d)(2)(ii)', 'Media Re-use', 'Implement procedures for removal of electronic protected health information from electronic media before the media are made available for re-use.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (64, 'Physical Safeguards', '164.310(d)(2)(iii)', 'Accountability', 'Maintain a record of the movements of hardware and electronic media and any person responsible therefore.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (65, 'Physical Safeguards', '164.310(d)(2)(iv)', 'Data Backup and Storage', 'Create a retrievable, exact copy of electronic protected health information, when needed, before movement of equipment.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (66, 'Technical Safeguards', '164.312(a)(1)', 'Access Control', 'Implement technical policies and procedures for electronic information systems that maintain electronic protected health information to allow access only to those persons or software programs that have been granted access rights as specified in § 164.308(a)(4).', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (67, 'Technical Safeguards', '164.312(a)(2)(i)', 'Unique User Identification', 'Assign a unique name and/or number for identifying and tracking user identity.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (68, 'Technical Safeguards', '164.312(a)(2)(ii)', 'Emergency Access Procedure', 'Establish (and implement as needed) procedures for obtaining necessary electronic protected health information during an emergency.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (69, 'Technical Safeguards', '164.312(a)(2)(iii)', 'Automatic Logoff', 'Implement electronic procedures that terminate an electronic session after a predetermined time of inactivity.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (70, 'Technical Safeguards', '164.312(a)(2)(iv)', 'Encryption and Decryption', 'Implement a mechanism to encrypt and decrypt electronic protected health information.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (71, 'Technical Safeguards', '164.312(b)', 'Audit Controls', 'Implement hardware, software, and/or procedural mechanisms that record and examine activity in information systems that contain or use electronic protected health information.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (72, 'Technical Safeguards', '164.312(c)(1)', 'Integrity', 'Implement policies and procedures to protect electronic protected health information from improper alteration or destruction.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (73, 'Technical Safeguards', '164.312(c)(2)', 'Mechanism to Authenticate Electronic Protected Health Information', 'Implement electronic mechanisms to corroborate that electronic protected health information has not been altered or destroyed in an unauthorized manner.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (74, 'Technical Safeguards', '164.312(d)', 'Person or Entity Authentication', 'Implement procedures to verify that a person or entity seeking access to electronic protected health information is the one claimed.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (75, 'Technical Safeguards', '164.312(e)(1)', 'Transmission Security', 'Implement technical security measures to guard against unauthorized access to electronic protected health information that is being transmitted over an electronic communications network.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (76, 'Technical Safeguards', '164.312(e)(2)(i)', 'Integrity Controls', 'Implement security measures to ensure that electronically transmitted electronic protected health information is not improperly modified without detection until disposed of.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (77, 'Technical Safeguards', '164.312(e)(2)(ii)', 'Encryption', 'Implement a mechanism to encrypt electronic protected health information whenever deemed appropriate.', 'Addressable', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (78, 'Privacy Rule', '164.502(a)', 'Uses and Disclosures of Protected Health Information', 'A covered entity or business associate may not use or disclose protected health information, except as permitted or required by this subpart or by subpart C of part 160 of this subchapter.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (79, 'Privacy Rule', '164.502(b)', 'Minimum Necessary', 'When using or disclosing protected health information or when requesting protected health information from another covered entity or business associate, a covered entity or business associate must make reasonable efforts to limit protected health information to the minimum necessary to accomplish the intended purpose of the use, disclosure, or request.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (80, 'Privacy Rule', '164.504(e)', 'Business Associate Contracts', 'A covered entity may disclose protected health information to a business associate and may allow a business associate to create, receive, maintain, or transmit protected health information on the covered entity''s behalf only if the covered entity obtains satisfactory assurance that the business associate will appropriately safeguard the information.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (81, 'Privacy Rule', '164.506', 'Uses and Disclosures to Carry Out Treatment, Payment, or Health Care Operations', 'A covered entity may use or disclose protected health information for its own treatment, payment, or health care operations.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (82, 'Privacy Rule', '164.508(a)', 'Uses and Disclosures for Which an Authorization is Required', 'Except as otherwise permitted or required by this subchapter, a covered entity may not use or disclose protected health information without an authorization that is valid under this section.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (83, 'Privacy Rule', '164.510(a)', 'Use and Disclosure of Protected Health Information for Facility Directories', 'A covered entity may use and disclose protected health information to maintain a directory of individuals in its facility.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (84, 'Privacy Rule', '164.512(a)', 'Uses and Disclosures Required by Law', 'A covered entity may use or disclose protected health information to the extent that such use or disclosure is required by law and the use or disclosure complies with and is limited to the relevant requirements of such law.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (85, 'Privacy Rule', '164.514(a)', 'De-identification of Protected Health Information', 'Health information that does not identify an individual and with respect to which there is no reasonable basis to believe that the information can be used to identify an individual is not individually identifiable health information.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (86, 'Privacy Rule', '164.520(a)', 'Notice of Privacy Practices for Protected Health Information', 'Except as provided by paragraph (a)(2) or (3) of this section, an individual has a right to adequate notice of the uses and disclosures of protected health information that may be made by the covered entity, and of the individual''s rights and the covered entity''s legal duties with respect to protected health information.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (87, 'Privacy Rule', '164.522(a)', 'Rights to Request Restrictions of Uses and Disclosures', 'An individual has the right to request that a covered entity restrict uses or disclosures of protected health information about the individual to carry out treatment, payment, or health care operations.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (88, 'Privacy Rule', '164.524(a)', 'Access of Individuals to Protected Health Information', 'An individual has a right of access to inspect and obtain a copy of protected health information about the individual in a designated record set, for as long as the protected health information is maintained in the designated record set.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (89, 'Privacy Rule', '164.526(a)', 'Amendment of Protected Health Information', 'An individual has the right to have a covered entity amend protected health information or a record about the individual in a designated record set for as long as the protected health information is maintained in the designated record set.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (90, 'Privacy Rule', '164.528(a)', 'Accounting of Disclosures of Protected Health Information', 'An individual has a right to receive an accounting of disclosures of protected health information made by a covered entity in the six years prior to the date on which the accounting is requested.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (91, 'Privacy Rule', '164.530(a)', 'Personnel Designations', 'A covered entity must designate a privacy official who is responsible for the development and implementation of the policies and procedures of the entity.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (92, 'Privacy Rule', '164.530(b)', 'Training', 'A covered entity must train all members of its workforce on the policies and procedures with respect to protected health information required by this subpart, as necessary and appropriate for the members of the workforce to carry out their function within the covered entity.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (93, 'Privacy Rule', '164.530(c)', 'Safeguards', 'A covered entity must have in place appropriate administrative, technical, and physical safeguards to protect the privacy of protected health information.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (94, 'Privacy Rule', '164.530(d)', 'Complaints to the Covered Entity', 'A covered entity must provide a process for individuals to make complaints concerning the covered entity''s policies and procedures required by this subpart or the covered entity''s compliance with such policies and procedures or the requirements of this subpart.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (95, 'Privacy Rule', '164.530(e)', 'Documentation', 'A covered entity must maintain the policies and procedures provided for in paragraph (i) of this section in written or electronic form; and if a communication is required by this subpart to be in writing, maintain such writing, or an electronic copy, as documentation.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (96, 'Breach Notification', '164.400', 'Applicability', 'Except as provided in § 164.402, the provisions of this subpart apply to covered entities and, with respect to breaches of unsecured protected health information at or by business associates, to business associates.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (97, 'Breach Notification', '164.402', 'Definitions', 'Breach means the acquisition, access, use, or disclosure of protected health information in a manner not permitted under subpart E of this part which compromises the security or privacy of the protected health information.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (98, 'Breach Notification', '164.404(a)', 'Notification to Individuals', 'A covered entity shall, following the discovery of a breach of unsecured protected health information, notify each individual whose unsecured protected health information has been, or is reasonably believed by the covered entity to have been, accessed, acquired, used, or disclosed as a result of such breach.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (99, 'Breach Notification', '164.406(a)', 'Notification to the Media', 'A covered entity that discovers a breach of unsecured protected health information shall notify prominent media outlets serving a State or jurisdiction, following the discovery of a breach described in § 164.404(a), if the unsecured protected health information of 500 or more individuals is, or is reasonably believed to have been, accessed, acquired, used, or disclosed during such breach.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (100, 'Breach Notification', '164.408(a)', 'Notification to the Secretary', 'A covered entity shall, following the discovery of a breach of unsecured protected health information, notify the Secretary.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (101, 'Breach Notification', '164.410(a)', 'Notification by a Business Associate', 'A business associate shall, following the discovery of a breach of unsecured protected health information, notify the covered entity of such breach.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (102, 'Breach Notification', '164.412', 'Law Enforcement Delay', 'If a law enforcement official states to a covered entity or business associate that a notification, notice, or posting required under this subpart would impede a criminal investigation or cause damage to national security, the covered entity or business associate shall delay such notification, notice, or posting for the time period specified by the official.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);
-- INSERT INTO public.hipaa_requirements VALUES (103, 'Breach Notification', '164.414', 'Administrative Requirements and Burden of Proof', 'A covered entity or business associate shall have the burden of demonstrating that all notifications were made as required by this subpart or that the use or disclosure did not constitute a breach, as defined in § 164.402.', 'Required', 'Not Started', '2025-07-16 23:15:29.074987', '2025-07-16 23:15:29.074987', NULL);


-- --
-- -- TOC entry 6753 (class 0 OID 410106)
-- -- Dependencies: 408
-- -- Data for Name: incident_actions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.incident_actions VALUES ('f9229498-61a5-4dfa-8cf2-cce04b52b312', '421fb0f0-6f35-471e-81a2-2b2ddf192b0a', 'immediate', 'Isolate affected systems and contain the breach', NULL, '2025-07-13 23:29:56.868652+00', NULL, 'completed', 'urgent', '2025-07-12 23:29:56.868652+00');
-- INSERT INTO public.incident_actions VALUES ('b3c89aba-d52a-4ead-a67a-9df40006fbc5', '421fb0f0-6f35-471e-81a2-2b2ddf192b0a', 'corrective', 'Reset all user passwords and implement MFA', NULL, '2025-07-15 23:29:56.868652+00', NULL, 'in_progress', 'high', '2025-07-12 23:29:56.868652+00');
-- INSERT INTO public.incident_actions VALUES ('44773ebe-97f6-46ab-bd8b-9124e7e30d75', '9b6edd97-991e-4877-a869-9f5a4d5b9d3c', 'immediate', 'Activate disaster recovery procedures', NULL, '2025-07-08 23:29:56.868652+00', NULL, 'completed', 'urgent', '2025-07-12 23:29:56.868652+00');
-- INSERT INTO public.incident_actions VALUES ('bcc5164d-b080-4921-a773-b60b68ae1761', '4d31ea0e-f5f5-462d-82bc-68a1f9712977', 'corrective', 'Update data processing procedures and staff training', NULL, '2025-07-22 23:29:56.868652+00', NULL, 'pending', 'medium', '2025-07-12 23:29:56.868652+00');


-- --
-- -- TOC entry 6755 (class 0 OID 410147)
-- -- Dependencies: 410
-- -- Data for Name: incident_attachments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6751 (class 0 OID 410048)
-- -- Dependencies: 406
-- -- Data for Name: incident_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.incident_categories VALUES ('7c9bee64-5744-4a66-b003-40ec1a68ccb5', 'Security Breach', 'Cybersecurity incidents and data breaches', '#dc2626', '2025-07-12 23:29:50.3901+00', '2025-07-12 23:29:50.3901+00');
-- INSERT INTO public.incident_categories VALUES ('b4e71eaf-3f28-41ba-97aa-9c0e59332390', 'System Outage', 'IT system failures and service disruptions', '#ea580c', '2025-07-12 23:29:50.3901+00', '2025-07-12 23:29:50.3901+00');
-- INSERT INTO public.incident_categories VALUES ('bf43ef19-91b8-46ac-9d5c-0d626afa601a', 'Data Loss', 'Data corruption, deletion, or unavailability', '#d97706', '2025-07-12 23:29:50.3901+00', '2025-07-12 23:29:50.3901+00');
-- INSERT INTO public.incident_categories VALUES ('cc12f910-f642-494c-8723-964a37b26d00', 'Compliance Violation', 'Regulatory or policy compliance failures', '#7c3aed', '2025-07-12 23:29:50.3901+00', '2025-07-12 23:29:50.3901+00');
-- INSERT INTO public.incident_categories VALUES ('5f9f01b9-a6c6-44a9-9c88-70ae46a94652', 'Operational Failure', 'Business process or operational breakdowns', '#0891b2', '2025-07-12 23:29:50.3901+00', '2025-07-12 23:29:50.3901+00');
-- INSERT INTO public.incident_categories VALUES ('fafe7efd-4943-41c3-9e5f-2ece3ca7571d', 'Financial Loss', 'Direct financial impact incidents', '#059669', '2025-07-12 23:29:50.3901+00', '2025-07-12 23:29:50.3901+00');
-- INSERT INTO public.incident_categories VALUES ('aa80e008-cb51-400d-974d-ede6888d62b8', 'Reputation Damage', 'Brand or reputation affecting incidents', '#be185d', '2025-07-12 23:29:50.3901+00', '2025-07-12 23:29:50.3901+00');
-- INSERT INTO public.incident_categories VALUES ('3411361f-07f3-461c-a7f5-4183db29edaa', 'Third Party', 'Vendor or supplier related incidents', '#4338ca', '2025-07-12 23:29:50.3901+00', '2025-07-12 23:29:50.3901+00');


-- --
-- -- TOC entry 6754 (class 0 OID 410127)
-- -- Dependencies: 409
-- -- Data for Name: incident_communications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.incident_communications VALUES ('97332f0f-4ac4-483e-8dee-7e6fb563dfc6', '421fb0f0-6f35-471e-81a2-2b2ddf192b0a', 'internal', 'Executive Team', 'Critical Security Incident - Immediate Action Required', 'A security breach has been detected in our customer database. Immediate containment measures are in progress.', '2025-07-12 23:29:56.868652+00', NULL, '2025-07-12 23:29:56.868652+00');
-- INSERT INTO public.incident_communications VALUES ('32f9d388-2d6f-4cca-9085-a1a9793cc649', '9b6edd97-991e-4877-a869-9f5a4d5b9d3c', 'external', 'Customers', 'Service Restoration Update', 'We are pleased to inform you that our banking services have been fully restored.', '2025-07-12 23:29:56.868652+00', NULL, '2025-07-12 23:29:56.868652+00');
-- INSERT INTO public.incident_communications VALUES ('9388fc09-93b0-4fb6-afe4-fd01c1cd5e36', '4d31ea0e-f5f5-462d-82bc-68a1f9712977', 'regulatory', 'Data Protection Authority', 'GDPR Compliance Incident Notification', 'We are reporting a compliance incident related to data processing procedures.', '2025-07-12 23:29:56.868652+00', NULL, '2025-07-12 23:29:56.868652+00');


-- --
-- -- TOC entry 6581 (class 0 OID 24657)
-- -- Dependencies: 235
-- -- Data for Name: incidents; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.incidents VALUES (65, 'INC-743361', 'ITSEC systems were part of cyber attack', 'ITSEC systems were part of cyber attack', 'Malware', 'Critical', 'Open', 'Paul', 'John', '2025-07-17 02:19:00', '2025-07-16 06:20:00', NULL, NULL, NULL, NULL, NULL, 23, '2025-07-17 02:21:02.401415', '2025-07-17 02:21:02.401415', NULL);
-- INSERT INTO public.incidents VALUES (66, 'INC-001719', 'Clicked on a phishing email', 'Clicked on a phishing email, it took my to porn website', 'Phishing', 'Critical', 'Open', 'Ahmed', 'Security Team', '2025-07-18 13:33:00', '2025-07-18 17:34:00', NULL, NULL, NULL, NULL, NULL, 10, '2025-07-18 17:34:27.286891', '2025-07-19 21:48:25.05216', '2025-07-25');
-- INSERT INTO public.incidents VALUES (9, 'INC-002', 'System Outage - Financial System', 'Complete system failure affecting financial operations and customer transactions', 'System Failure', 'Critical', 'In Progress', 'Operations Team', 'IT Manager', '2024-01-14 10:20:00', '2024-01-14 10:15:00', NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-13 10:29:58.694408', '2025-07-19 21:49:29.734984', '2024-01-20');
-- INSERT INTO public.incidents VALUES (7, 'INC-287031', 'Clicked on a phishing email', 'Clicked on a phishing email', 'Security Breach', 'Critical', 'Open', 'Paul', 'John', '2025-07-13 09:51:00', '2025-07-12 13:52:00', NULL, NULL, NULL, NULL, 4, 16, '2025-07-13 09:52:23.111374', '2025-07-13 09:52:23.111374', NULL);
-- INSERT INTO public.incidents VALUES (8, 'INC-001', 'Unauthorized Access Attempt', 'Multiple failed login attempts detected on admin account from suspicious IP addresses', 'Security Breach', 'High', 'Open', 'Security Team', 'CISO', '2024-01-15 10:30:00', '2024-01-15 10:15:00', NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-13 10:29:58.694408', '2025-07-13 10:29:58.694408', NULL);
-- INSERT INTO public.incidents VALUES (10, 'INC-003', 'Data Backup Failure', 'Scheduled backup process failed for critical systems, potential data loss risk', 'Data Loss', 'Medium', 'Resolved', 'IT Operations', 'Backup Administrator', '2024-01-13 02:00:00', '2024-01-13 02:00:00', NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-13 10:29:58.694408', '2025-07-13 10:29:58.694408', NULL);
-- INSERT INTO public.incidents VALUES (11, 'INC-004', 'Phishing Email Campaign', 'Multiple employees received suspicious emails attempting to steal credentials', 'Phishing', 'High', 'In Progress', 'Security Analyst', 'Security Manager', '2024-01-12 09:15:00', '2024-01-12 08:45:00', NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-13 10:29:58.694408', '2025-07-13 10:29:58.694408', NULL);
-- INSERT INTO public.incidents VALUES (12, 'INC-005', 'Malware Detection', 'Antivirus software detected and quarantined malware on employee workstation', 'Malware', 'Medium', 'Resolved', 'IT Support', 'Security Team', '2024-01-11 16:30:00', '2024-01-11 16:20:00', NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-13 10:29:58.694408', '2025-07-13 10:29:58.694408', NULL);
-- INSERT INTO public.incidents VALUES (13, 'INC-465365', 'company confidential data', 'i have sent the company data to wrong address', 'Other', 'High', 'Open', 'Paul Hewman', 'IT', '2025-07-13 11:01:00.02', '2025-07-13 11:01:00.019', NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-13 11:01:05.903296', '2025-07-13 11:01:05.903296', NULL);


-- --
-- -- TOC entry 6575 (class 0 OID 24577)
-- -- Dependencies: 229
-- -- Data for Name: information_assets; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.information_assets VALUES (2, 'Financial System', 'Application', 'Restricted', 'Jane Doe', 'Finance Team', 'Cloud Environment', 'Core financial management system', 'Critical', 'High', 'High', 'High', 10, 'Certified destruction', '2025-06-21 02:44:20.077751', '2025-06-21 02:44:20.077751', NULL, NULL, 'ASST - 0000001', true, NULL, NULL);
-- INSERT INTO public.information_assets VALUES (3, 'Employee Portal', 'Web Application', 'Internal', 'HR Manager', 'IT Department', 'Web Server IIS', 'Internal employee self-service portal', 'Medium', 'Medium', 'Medium', 'High', 5, 'Standard deletion', '2025-06-21 02:44:20.077751', '2025-07-10 16:51:42.36962', NULL, NULL, 'ASST - 0000002', true, NULL, NULL);
-- INSERT INTO public.information_assets VALUES (4, 'Backup Servers', 'Infrastructure', 'Confidential', 'IT Manager', 'IT Department', 'Secondary Data Center', 'Backup and disaster recovery systems', 'High', 'High', 'High', 'Critical', 3, 'Physical destruction', '2025-06-21 02:44:20.077751', '2025-06-21 02:44:20.077751', NULL, NULL, 'ASST - 0000003', true, NULL, NULL);
-- INSERT INTO public.information_assets VALUES (9, 'Mobile_app DB', 'Database', 'Restricted', 'Consumer Department', 'Digital Innovation', 'Dubai', 'DB for customer mobile app', 'Critical', 'High', 'High', 'High', 7, 'Degaussing', '2025-06-21 12:52:54.415501', '2025-07-10 16:51:13.007533', NULL, NULL, 'ASST - 0000004', true, NULL, NULL);
-- INSERT INTO public.information_assets VALUES (34, 'KONG API gateway', 'Service', 'Restricted', 'Technology', 'Digital Innovation', 'Cloud', 'API gateway', 'High', 'Critical', 'Critical', 'Critical', 5, 'Secure Delete', '2025-07-10 17:06:13.039325', '2025-07-10 17:06:13.039325', 1, 1, 'ASST - 0000005', true, NULL, NULL);


-- --
-- -- TOC entry 6635 (class 0 OID 122884)
-- -- Dependencies: 289
-- -- Data for Name: information_assets_detailed; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6849 (class 0 OID 761857)
-- -- Dependencies: 505
-- -- Data for Name: iso27001_control_effectiveness; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.iso27001_control_effectiveness VALUES (1, 1, 'A.9.1.1', 4, 'Implemented', '2025-07-18 13:40:50.484168', '2025-07-18 13:40:51.772843');
-- INSERT INTO public.iso27001_control_effectiveness VALUES (3, 1, 'A.9.2.1', 4, 'Implemented', '2025-07-18 13:49:32.288116', '2025-07-18 13:49:33.45072');
-- INSERT INTO public.iso27001_control_effectiveness VALUES (5, 1, 'A.9.4.2', 4, 'Implemented', '2025-07-18 13:49:36.152004', '2025-07-18 13:49:37.28036');
-- INSERT INTO public.iso27001_control_effectiveness VALUES (7, 1, 'A.12.4.1', 5, 'Implemented', '2025-07-18 13:49:42.57651', '2025-07-18 13:49:43.644456');
-- INSERT INTO public.iso27001_control_effectiveness VALUES (9, 15, 'A.9.2.3', 4, 'Implemented', '2025-07-18 18:06:43.240428', '2025-07-18 18:06:45.109613');
-- INSERT INTO public.iso27001_control_effectiveness VALUES (14, 15, 'A.9.2.5', 5, 'Implemented', '2025-07-18 18:07:16.306408', '2025-07-18 18:07:23.853239');
-- INSERT INTO public.iso27001_control_effectiveness VALUES (12, 15, 'A.9.2.4', 3, 'Partially Implemented', '2025-07-18 18:07:11.675192', '2025-07-18 18:07:25.639955');
-- INSERT INTO public.iso27001_control_effectiveness VALUES (18, 2, 'A.12.2.1', 2, 'In Progress', '2025-07-18 19:12:24.765338', '2025-07-18 19:13:13.170174');
-- INSERT INTO public.iso27001_control_effectiveness VALUES (19, 2, 'A.12.3.1', 2, 'In Progress', '2025-07-18 19:12:27.723949', '2025-07-18 19:13:21.911404');
-- INSERT INTO public.iso27001_control_effectiveness VALUES (21, 2, 'A.17.1.2', 2, 'In Progress', '2025-07-18 19:12:34.287763', '2025-07-18 19:13:26.202142');
-- INSERT INTO public.iso27001_control_effectiveness VALUES (20, 2, 'A.16.1.1', 2, 'In Progress', '2025-07-18 19:12:30.004348', '2025-07-18 19:13:28.635656');
-- INSERT INTO public.iso27001_control_effectiveness VALUES (29, 38, 'A.9.1.1', 4, 'Implemented', '2025-07-18 19:46:26.966261', '2025-07-18 19:46:26.966261');
-- INSERT INTO public.iso27001_control_effectiveness VALUES (30, 38, 'A.13.1.3', 3, 'Partially Implemented', '2025-07-18 19:46:30.238696', '2025-07-18 19:46:30.238696');
-- INSERT INTO public.iso27001_control_effectiveness VALUES (31, 38, 'A.9.4.1', 3, 'Partially Implemented', '2025-07-18 19:46:32.386736', '2025-07-18 19:46:32.386736');


-- --
-- -- TOC entry 6761 (class 0 OID 483376)
-- -- Dependencies: 416
-- -- Data for Name: iso27001_controls; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.iso27001_controls VALUES (1, 'A.5.1.1', 'Information Security Policies', 'A set of policies for information security shall be defined, approved by management, published and communicated to employees and relevant external parties.', 'Information Security Policies', '2025-07-13 21:30:54.138896');
-- INSERT INTO public.iso27001_controls VALUES (2, 'A.6.1.1', 'Information Security Roles and Responsibilities', 'All information security responsibilities shall be defined and allocated.', 'Organization of Information Security', '2025-07-13 21:30:54.138896');
-- INSERT INTO public.iso27001_controls VALUES (3, 'A.7.1.1', 'Screening', 'Background verification checks on all candidates for employment shall be carried out in accordance with relevant laws, regulations and ethics.', 'Human Resource Security', '2025-07-13 21:30:54.138896');
-- INSERT INTO public.iso27001_controls VALUES (4, 'A.8.1.1', 'Inventory of Assets', 'Assets associated with information and information processing facilities shall be identified and an inventory of these assets shall be drawn up and maintained.', 'Asset Management', '2025-07-13 21:30:54.138896');
-- INSERT INTO public.iso27001_controls VALUES (5, 'A.9.1.1', 'Access Control Policy', 'An access control policy shall be established, documented and reviewed based on business and information security requirements.', 'Access Control', '2025-07-13 21:30:54.138896');
-- INSERT INTO public.iso27001_controls VALUES (6, 'A.10.1.1', 'Policy on the Use of Cryptographic Controls', 'A policy on the use of cryptographic controls for protection of information shall be developed and implemented.', 'Cryptography', '2025-07-13 21:30:54.138896');
-- INSERT INTO public.iso27001_controls VALUES (7, 'A.11.1.1', 'Physical Security Perimeter', 'Physical security perimeters shall be defined and used to protect areas that contain either sensitive or critical information and information processing facilities.', 'Physical and Environmental Security', '2025-07-13 21:30:54.138896');
-- INSERT INTO public.iso27001_controls VALUES (8, 'A.12.1.1', 'Documented Operating Procedures', 'Operating procedures shall be documented and made available to all users who need them.', 'Operations Security', '2025-07-13 21:30:54.138896');
-- INSERT INTO public.iso27001_controls VALUES (9, 'A.13.1.1', 'Network Security Management', 'Networks shall be managed and controlled to protect information in systems and applications.', 'Communications Security', '2025-07-13 21:30:54.138896');
-- INSERT INTO public.iso27001_controls VALUES (10, 'A.14.1.1', 'Information Security Requirements Analysis and Specification', 'Information security requirements shall be included in the requirements for new information systems or enhancements to existing information systems.', 'System Acquisition, Development and Maintenance', '2025-07-13 21:30:54.138896');
-- INSERT INTO public.iso27001_controls VALUES (11, 'A.15.1.1', 'Information Security Policy for Supplier Relationships', 'Information security requirements for mitigating the risks associated with supplier access to the organization assets shall be agreed with the supplier and documented.', 'Supplier Relationships', '2025-07-13 21:30:54.138896');
-- INSERT INTO public.iso27001_controls VALUES (12, 'A.16.1.1', 'Responsibilities and Procedures', 'Management responsibilities and procedures shall be established to ensure a quick, effective and orderly response to information security incidents.', 'Information Security Incident Management', '2025-07-13 21:30:54.138896');
-- INSERT INTO public.iso27001_controls VALUES (13, 'A.17.1.1', 'Planning Information Security Continuity', 'The organization shall determine its requirements for information security and the continuity of information security management in adverse situations.', 'Information Security Aspects of Business Continuity Management', '2025-07-13 21:30:54.138896');
-- INSERT INTO public.iso27001_controls VALUES (14, 'A.18.1.1', 'Identification of Applicable Legislation and Contractual Requirements', 'All relevant legislative statutory, regulatory, contractual requirements and the organization approach to meet these requirements shall be explicitly identified, documented and kept up to date.', 'Compliance', '2025-07-13 21:30:54.138896');


-- --
-- -- TOC entry 6855 (class 0 OID 786433)
-- -- Dependencies: 512
-- -- Data for Name: iso27001_evidence; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6723 (class 0 OID 311297)
-- -- Dependencies: 377
-- -- Data for Name: iso27001_risk_assessments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6763 (class 0 OID 483388)
-- -- Dependencies: 418
-- -- Data for Name: iso27001_risk_controls; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6649 (class 0 OID 123013)
-- -- Dependencies: 303
-- -- Data for Name: iso27001_risk_metrics; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6647 (class 0 OID 122997)
-- -- Dependencies: 301
-- -- Data for Name: iso27001_risk_reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6643 (class 0 OID 122941)
-- -- Dependencies: 297
-- -- Data for Name: iso27001_risk_scenarios; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6645 (class 0 OID 122975)
-- -- Dependencies: 299
-- -- Data for Name: iso27001_risk_treatment_plans; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6759 (class 0 OID 483329)
-- -- Dependencies: 414
-- -- Data for Name: iso27001_risks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.iso27001_risks VALUES (2, 'ISO-002', 'Data Loss Due to Ransomware Attack', 'Risk of critical business data being encrypted or destroyed by ransomware, leading to operational disruption and potential data loss if backup systems are compromised.', 'Malware Protection', 3, 5, DEFAULT, DEFAULT, 'Open', 'Sarah Johnson - IT Director', 'Deploy advanced endpoint detection and response (EDR), implement immutable backup solutions, conduct regular backup testing, and establish incident response procedures for ransomware events.', 8, '2024-01-20', '2024-04-20', '{A.12.2.1,A.12.3.1,A.16.1.1,A.17.1.2}', '{"File Servers","Backup Systems",Workstations,"Production Databases"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 4, 'Anti-malware solutions are in place but need enhancement. Backup testing reveals some gaps in recovery procedures.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (3, 'ISO-003', 'Insider Threat from Privileged Users', 'Risk of malicious or negligent actions by employees with elevated system privileges, potentially leading to data theft, system sabotage, or unauthorized disclosure of sensitive information.', 'Human Resources', 3, 4, DEFAULT, DEFAULT, 'Open', 'Mike Davis - HR Director', 'Implement user behavior analytics, establish segregation of duties, conduct background checks for privileged positions, and deploy data loss prevention (DLP) solutions.', 6, '2024-01-25', '2024-04-25', '{A.7.1.1,A.7.2.1,A.9.2.3,A.12.4.1}', '{"All Systems","Sensitive Data Repositories","Administrative Interfaces"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 3, 'Background screening processes are adequate but monitoring of privileged user activities needs improvement.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (4, 'ISO-004', 'Cloud Service Provider Security Breach', 'Risk of security incident at third-party cloud service provider resulting in unauthorized access to organizational data stored in cloud environments.', 'Supplier Management', 3, 4, DEFAULT, DEFAULT, 'Open', 'Lisa Chen - Cloud Architect', 'Conduct thorough security assessments of cloud providers, implement cloud security posture management (CSPM), establish data encryption in transit and at rest, and develop cloud incident response procedures.', 6, '2024-02-01', '2024-05-01', '{A.15.1.1,A.15.2.1,A.10.1.1,A.13.2.1}', '{"Cloud Infrastructure","SaaS Applications","Cloud Storage"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 3, 'Cloud security controls are partially implemented. Need to enhance monitoring and incident response capabilities.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (5, 'ISO-005', 'Physical Security Breach at Data Center', 'Risk of unauthorized physical access to data center facilities, potentially leading to theft of equipment, data compromise, or service disruption.', 'Physical Security', 2, 4, DEFAULT, DEFAULT, 'Open', 'Tom Wilson - Facilities Manager', 'Upgrade physical access controls with biometric authentication, install comprehensive CCTV surveillance, deploy environmental monitoring systems, and establish 24/7 security presence.', 3, '2024-02-05', '2024-05-05', '{A.11.1.1,A.11.1.2,A.11.2.1,A.11.1.4}', '{"Data Center","Server Equipment","Network Infrastructure"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 3, 'Physical security measures are adequate but need enhancement in monitoring and access logging.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (6, 'ISO-006', 'Email Phishing and Social Engineering', 'Risk of employees falling victim to phishing attacks and social engineering tactics, potentially leading to credential compromise and unauthorized system access.', 'Human Resources', 4, 3, DEFAULT, DEFAULT, 'Open', 'Anna Rodriguez - Security Awareness Manager', 'Implement comprehensive security awareness training, deploy advanced email security solutions, conduct regular phishing simulations, and establish incident reporting procedures.', 6, '2024-02-10', '2024-05-10', '{A.7.2.2,A.13.2.3,A.16.1.2}', '{"Email System","User Workstations","Web Browsers"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 3, 2, 'Security awareness training is ongoing but phishing simulation results show room for improvement.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (7, 'ISO-007', 'Cryptographic Key Management Failure', 'Risk of cryptographic keys being compromised, improperly managed, or lost, leading to unauthorized decryption of sensitive data and potential compliance violations.', 'Cryptography', 2, 5, DEFAULT, DEFAULT, 'Open', 'David Kim - Cryptography Officer', 'Implement hardware security modules (HSM), establish key lifecycle management procedures, deploy automated key rotation, and conduct regular cryptographic audits.', 4, '2024-02-15', '2024-05-15', '{A.10.1.1,A.10.1.2}', '{"Encryption Systems","Certificate Authority","Secure Communications"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 4, 'Key management processes are documented but lack automation and comprehensive monitoring.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (8, 'ISO-008', 'Business Continuity Plan Failure', 'Risk of inability to maintain critical business operations during major disruptions such as natural disasters, cyber attacks, or infrastructure failures.', 'Business Continuity', 2, 5, DEFAULT, DEFAULT, 'Open', 'Emma Thompson - BCP Coordinator', 'Develop comprehensive business continuity plans, establish alternate processing sites, implement redundant systems, and conduct regular disaster recovery testing.', 4, '2024-02-20', '2024-05-20', '{A.17.1.1,A.17.1.2,A.17.2.1}', '{"Critical Systems","Business Processes","Communication Systems"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 4, 'Business continuity plans exist but need regular testing and updates to address current threat landscape.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (9, 'ISO-009', 'Software Vulnerability Exploitation', 'Risk of attackers exploiting known or zero-day vulnerabilities in operating systems, applications, and network devices to gain unauthorized access or disrupt services.', 'System Maintenance', 3, 4, DEFAULT, DEFAULT, 'Open', 'Robert Brown - System Administrator', 'Implement automated patch management, deploy vulnerability scanning tools, establish vulnerability assessment procedures, and maintain software inventory.', 6, '2024-02-25', '2024-05-25', '{A.12.6.1,A.14.2.3,A.12.5.1}', '{"Operating Systems",Applications,"Network Devices"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 3, 'Patch management processes are in place but need improvement in testing and deployment timelines.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (10, 'ISO-010', 'Network Segmentation Failure', 'Risk of lateral movement by attackers due to inadequate network segmentation, allowing compromise of critical systems from less secure network segments.', 'Network Security', 3, 4, DEFAULT, DEFAULT, 'Open', 'Jennifer Lee - Network Security Manager', 'Implement network micro-segmentation, deploy next-generation firewalls, establish network access control (NAC), and conduct regular network security assessments.', 6, '2024-03-01', '2024-06-01', '{A.13.1.1,A.13.1.3,A.9.1.2}', '{"Network Infrastructure",Firewalls,"Switches and Routers"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 3, 'Network segmentation is partially implemented but needs enhancement for critical system isolation.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (11, 'ISO-011', 'Mobile Device Security Compromise', 'Risk of sensitive corporate data being accessed or stolen through compromised mobile devices used by employees for business purposes.', 'Mobile Security', 3, 3, DEFAULT, DEFAULT, 'Open', 'Mark Taylor - Mobile Security Lead', 'Implement mobile device management (MDM), establish BYOD policies, deploy mobile application management (MAM), and conduct regular mobile security assessments.', 4, '2024-03-05', '2024-06-05', '{A.6.2.1,A.8.1.3,A.13.2.1}', '{"Mobile Devices","Mobile Applications","Corporate Email"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 2, 'MDM solution is deployed but policy enforcement and compliance monitoring need improvement.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (12, 'ISO-012', 'Database Injection Attack', 'Risk of SQL injection and other database attacks leading to unauthorized data access, data manipulation, or complete database compromise.', 'Application Security', 3, 4, DEFAULT, DEFAULT, 'Open', 'Patricia Garcia - Application Security Lead', 'Implement input validation and parameterized queries, deploy web application firewalls (WAF), conduct regular code reviews, and perform penetration testing.', 6, '2024-03-10', '2024-06-10', '{A.14.2.1,A.14.2.5,A.14.2.8}', '{"Web Applications",Databases,"API Endpoints"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 3, 'Application security controls are in development but need comprehensive implementation across all applications.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (13, 'ISO-013', 'Third-Party Vendor Data Breach', 'Risk of data breach occurring at third-party vendors who have access to organizational data, potentially exposing sensitive information.', 'Supplier Management', 3, 4, DEFAULT, DEFAULT, 'Open', 'Steven Martinez - Vendor Management', 'Conduct vendor security assessments, implement data processing agreements, establish vendor monitoring procedures, and develop incident response coordination with vendors.', 6, '2024-03-15', '2024-06-15', '{A.15.1.1,A.15.1.2,A.15.2.1}', '{"Vendor Systems","Shared Data","Integration Points"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 3, 'Vendor assessment processes are established but need enhancement in ongoing monitoring and compliance verification.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (14, 'ISO-014', 'Backup System Failure', 'Risk of backup systems failing during critical recovery operations, leading to permanent data loss and extended business disruption.', 'Data Protection', 2, 5, DEFAULT, DEFAULT, 'Open', 'Michelle White - Backup Administrator', 'Implement redundant backup systems, establish automated backup verification, conduct regular restore testing, and maintain offsite backup copies.', 4, '2024-03-20', '2024-06-20', '{A.12.3.1,A.17.1.2}', '{"Backup Systems","Storage Arrays","Archive Systems"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 4, 'Backup systems are operational but testing procedures need improvement to ensure reliable recovery.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (16, 'ISO-016', 'IoT Device Security Vulnerabilities', 'Risk of Internet of Things (IoT) devices being compromised and used as entry points for network attacks or data exfiltration.', 'IoT Security', 3, 3, DEFAULT, DEFAULT, 'Open', 'Amanda Davis - IoT Security Specialist', 'Implement IoT device inventory and management, establish network segmentation for IoT devices, deploy IoT security monitoring, and maintain device firmware updates.', 4, '2024-03-30', '2024-06-30', '{A.8.1.1,A.13.1.3,A.12.6.1}', '{"IoT Devices","Sensor Networks","Building Management Systems"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 2, 'IoT security framework is in development but device inventory and monitoring capabilities need enhancement.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (17, 'ISO-017', 'Remote Work Security Risks', 'Risk of security incidents arising from employees working remotely with inadequate security controls and potentially unsecured home networks.', 'Remote Access', 3, 3, DEFAULT, DEFAULT, 'Open', 'Brian Wilson - Remote Work Security', 'Implement secure VPN solutions, establish remote work security policies, deploy endpoint protection for remote devices, and provide security awareness training for remote workers.', 4, '2024-04-01', '2024-07-01', '{A.6.2.2,A.13.2.1,A.11.2.6}', '{"Remote Access Systems","VPN Infrastructure","Home Office Equipment"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 2, 'Remote work security measures are in place but need enhancement in monitoring and policy enforcement.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (18, 'ISO-018', 'API Security Vulnerabilities', 'Risk of application programming interfaces (APIs) being exploited to gain unauthorized access to systems and data through authentication bypass or injection attacks.', 'API Security', 3, 4, DEFAULT, DEFAULT, 'Open', 'Nicole Anderson - API Security Lead', 'Implement API gateway security, establish API authentication and authorization, deploy API monitoring and rate limiting, and conduct regular API security testing.', 6, '2024-04-05', '2024-07-05', '{A.14.1.3,A.9.4.1,A.13.1.1}', '{"API Endpoints","Web Services","Integration Platforms"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 3, 'API security controls are being implemented but need comprehensive coverage across all API endpoints.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (19, 'ISO-019', 'Data Classification and Handling Errors', 'Risk of sensitive data being mishandled, improperly classified, or inadequately protected due to lack of clear data governance policies and procedures.', 'Data Governance', 3, 3, DEFAULT, DEFAULT, 'Open', 'Kevin Thompson - Data Governance Officer', 'Implement data classification framework, establish data handling procedures, deploy data loss prevention (DLP) tools, and conduct data governance training.', 4, '2024-04-10', '2024-07-10', '{A.8.2.1,A.8.2.2,A.8.2.3}', '{"Data Repositories","Document Management Systems","Email Systems"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 2, 'Data classification policies exist but implementation and enforcement across all systems need improvement.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (20, 'ISO-020', 'Incident Response Plan Inadequacy', 'Risk of ineffective incident response due to outdated procedures, insufficient resources, or lack of coordination during security incidents.', 'Incident Management', 2, 4, DEFAULT, DEFAULT, 'Open', 'Rachel Green - Incident Response Manager', 'Update incident response procedures, establish incident response team training, implement incident management tools, and conduct regular tabletop exercises.', 3, '2024-04-15', '2024-07-15', '{A.16.1.1,A.16.1.4,A.16.1.5}', '{"Incident Response Systems","Communication Tools","Forensic Equipment"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 3, 'Incident response procedures are documented but need regular testing and updates to address current threat landscape.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (21, 'ISO-021', 'Supply Chain Security Compromise', 'Risk of security vulnerabilities being introduced through compromised software or hardware components in the supply chain.', 'Supply Chain', 3, 4, DEFAULT, DEFAULT, 'Open', 'Daniel Rodriguez - Supply Chain Security', 'Implement supply chain risk assessments, establish vendor security requirements, deploy software composition analysis, and maintain supplier security monitoring.', 6, '2024-04-20', '2024-07-20', '{A.15.1.3,A.14.2.7,A.15.2.1}', '{"Software Components","Hardware Suppliers","Third-Party Libraries"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 3, 'Supply chain security assessments are conducted but need enhancement in continuous monitoring and risk evaluation.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (22, 'ISO-022', 'Compliance Violation Penalties', 'Risk of regulatory penalties and legal consequences due to non-compliance with data protection regulations such as GDPR, HIPAA, or industry standards.', 'Compliance', 2, 4, DEFAULT, DEFAULT, 'Open', 'Laura Martinez - Compliance Officer', 'Implement compliance monitoring tools, establish regulatory change management, conduct regular compliance audits, and maintain compliance documentation.', 3, '2024-04-25', '2024-07-25', '{A.18.1.1,A.18.2.1,A.18.2.2}', '{"Compliance Systems","Audit Logs","Documentation Repositories"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 3, 'Compliance monitoring is in place but needs automation and real-time alerting for potential violations.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (23, 'ISO-023', 'Password Security Weaknesses', 'Risk of unauthorized access due to weak password policies, password reuse, or compromised credentials being used across multiple systems.', 'Authentication', 3, 3, DEFAULT, DEFAULT, 'Open', 'Gregory Lee - Authentication Manager', 'Implement strong password policies, deploy password managers, establish multi-factor authentication, and conduct regular password security assessments.', 4, '2024-04-30', '2024-07-30', '{A.9.4.3,A.9.2.4,A.9.4.2}', '{"Authentication Systems","User Accounts","Password Databases"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 2, 'Password policies are established but enforcement and user compliance need improvement.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (24, 'ISO-024', 'Social Media Security Risks', 'Risk of sensitive information disclosure or social engineering attacks through inappropriate use of social media platforms by employees.', 'Social Media', 2, 3, DEFAULT, DEFAULT, 'Open', 'Stephanie Clark - Social Media Security', 'Establish social media usage policies, implement social media monitoring, conduct employee training on social media risks, and deploy social media security tools.', 2, '2024-05-05', '2024-08-05', '{A.7.2.2,A.8.1.3,A.13.2.1}', '{"Social Media Accounts","Employee Devices","Corporate Communications"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 2, 'Social media policies are in place but monitoring and enforcement capabilities need development.', 'Accept');
-- INSERT INTO public.iso27001_risks VALUES (25, 'ISO-025', 'Wireless Network Security Gaps', 'Risk of unauthorized access to corporate networks through insecure wireless access points or rogue wireless devices.', 'Wireless Security', 3, 3, DEFAULT, DEFAULT, 'Open', 'Timothy Brown - Wireless Security Lead', 'Implement enterprise wireless security, deploy wireless intrusion detection, establish guest network isolation, and conduct regular wireless security assessments.', 4, '2024-05-10', '2024-08-10', '{A.13.1.1,A.11.2.3,A.9.1.2}', '{"Wireless Access Points","Wireless Controllers","Mobile Devices"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 2, 'Wireless security controls are implemented but need enhancement in monitoring and rogue device detection.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (26, 'ISO-026', 'Email Security Threats', 'Risk of malware delivery, data exfiltration, or credential theft through email-based attacks including spam, phishing, and business email compromise.', 'Email Security', 4, 3, DEFAULT, DEFAULT, 'Open', 'Vanessa White - Email Security Manager', 'Deploy advanced email security solutions, implement email encryption, establish email retention policies, and conduct email security awareness training.', 6, '2024-05-15', '2024-08-15', '{A.13.2.3,A.10.1.1,A.7.2.2}', '{"Email Servers","Email Clients","Email Gateways"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 3, 2, 'Email security solutions are deployed but need enhancement in advanced threat detection and user training.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (27, 'ISO-027', 'Database Access Control Failures', 'Risk of unauthorized database access due to inadequate access controls, excessive privileges, or compromised database credentials.', 'Database Security', 3, 4, DEFAULT, DEFAULT, 'Open', 'Harold Johnson - Database Administrator', 'Implement database access controls, establish database activity monitoring, deploy database encryption, and conduct regular database security audits.', 6, '2024-05-20', '2024-08-20', '{A.9.4.1,A.12.4.1,A.10.1.1}', '{"Production Databases","Database Servers","Database Management Tools"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 3, 'Database security controls are partially implemented but need comprehensive access monitoring and audit capabilities.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (28, 'ISO-028', 'Change Management Security Risks', 'Risk of security vulnerabilities being introduced through inadequate change management processes for systems, applications, and configurations.', 'Change Management', 2, 3, DEFAULT, DEFAULT, 'Open', 'Olivia Davis - Change Management Lead', 'Implement secure change management procedures, establish change approval workflows, deploy configuration management tools, and conduct security reviews for all changes.', 2, '2024-05-25', '2024-08-25', '{A.12.1.2,A.14.2.2,A.12.1.4}', '{"Production Systems","Configuration Management","Deployment Tools"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 2, 'Change management processes are documented but need enhancement in security review and approval procedures.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (29, 'ISO-029', 'Virtualization Security Vulnerabilities', 'Risk of security breaches in virtualized environments due to hypervisor vulnerabilities, VM escape attacks, or inadequate virtual network security.', 'Virtualization', 3, 4, DEFAULT, DEFAULT, 'Open', 'Peter Wilson - Virtualization Security', 'Implement hypervisor security hardening, establish virtual network segmentation, deploy VM security monitoring, and maintain virtualization security patches.', 6, '2024-05-30', '2024-08-30', '{A.13.1.3,A.12.6.1,A.11.2.1}', '{Hypervisors,"Virtual Machines","Virtual Networks"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 3, 'Virtualization security controls are in place but need enhancement in monitoring and threat detection.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (30, 'ISO-030', 'Log Management and Monitoring Gaps', 'Risk of security incidents going undetected due to inadequate log collection, analysis, or retention across critical systems and applications.', 'Logging and Monitoring', 3, 3, DEFAULT, DEFAULT, 'Open', 'Samantha Martinez - Security Monitoring Lead', 'Implement centralized log management, establish security information and event management (SIEM), deploy automated log analysis, and maintain log retention policies.', 4, '2024-06-01', '2024-09-01', '{A.12.4.1,A.12.4.2,A.12.4.3}', '{"Log Management Systems","SIEM Platform","Network Devices"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 2, 'Log management infrastructure is deployed but needs enhancement in automated analysis and alerting capabilities.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (31, 'ISO-031', 'Container Security Vulnerabilities', 'Risk of security breaches in containerized applications due to vulnerable container images, misconfigurations, or inadequate runtime security.', 'Container Security', 3, 3, DEFAULT, DEFAULT, 'Open', 'Jonathan Lee - Container Security Specialist', 'Implement container image scanning, establish container security policies, deploy runtime protection, and maintain container security monitoring.', 4, '2024-06-05', '2024-09-05', '{A.14.2.1,A.12.6.1,A.13.1.3}', '{"Container Images","Container Runtime","Orchestration Platform"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 2, 'Container security framework is in development but needs comprehensive implementation across all containerized applications.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (32, 'ISO-032', 'DevOps Security Integration Gaps', 'Risk of security vulnerabilities being introduced through inadequate security integration in DevOps processes and CI/CD pipelines.', 'DevSecOps', 3, 3, DEFAULT, DEFAULT, 'Open', 'Ashley Thompson - DevSecOps Lead', 'Implement security in CI/CD pipelines, establish secure coding practices, deploy automated security testing, and conduct DevSecOps training.', 4, '2024-06-10', '2024-09-10', '{A.14.2.1,A.14.2.8,A.14.2.9}', '{"CI/CD Pipelines","Source Code Repositories","Deployment Tools"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 2, 'DevSecOps practices are being implemented but need enhancement in automated security testing and policy enforcement.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (33, 'ISO-033', 'Artificial Intelligence Security Risks', 'Risk of AI and machine learning systems being compromised, manipulated, or used maliciously, potentially leading to incorrect decisions or data breaches.', 'AI Security', 2, 4, DEFAULT, DEFAULT, 'Open', 'Marcus Rodriguez - AI Security Researcher', 'Implement AI security frameworks, establish model validation procedures, deploy AI monitoring tools, and conduct AI security assessments.', 3, '2024-06-15', '2024-09-15', '{A.14.2.5,A.12.4.1,A.8.2.1}', '{"AI Models","Machine Learning Platforms","Training Data"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 3, 'AI security controls are in early development but need comprehensive framework implementation.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (34, 'ISO-034', 'Quantum Computing Threat to Cryptography', 'Risk of current cryptographic systems becoming vulnerable to quantum computing attacks, potentially compromising encrypted data and communications.', 'Quantum Security', 1, 5, DEFAULT, DEFAULT, 'Open', 'Dr. Elizabeth Chen - Quantum Security Advisor', 'Research post-quantum cryptography, establish quantum-resistant algorithms, plan cryptographic migration strategy, and monitor quantum computing developments.', 4, '2024-06-20', '2024-09-20', '{A.10.1.1,A.10.1.2}', '{"Encryption Systems","Digital Certificates","Secure Communications"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 4, 'Quantum threat assessment is ongoing but post-quantum cryptography implementation planning is needed.', 'Accept');
-- INSERT INTO public.iso27001_risks VALUES (35, 'ISO-035', 'Biometric Authentication Vulnerabilities', 'Risk of biometric authentication systems being spoofed, compromised, or failing, potentially allowing unauthorized access to secure systems.', 'Biometric Security', 2, 3, DEFAULT, DEFAULT, 'Open', 'Ryan Garcia - Biometric Systems Manager', 'Implement multi-modal biometric systems, establish liveness detection, deploy biometric template protection, and conduct biometric security testing.', 2, '2024-06-25', '2024-09-25', '{A.9.4.2,A.11.1.2,A.9.2.1}', '{"Biometric Scanners","Authentication Systems","Access Control Systems"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 2, 'Biometric authentication is deployed but needs enhancement in anti-spoofing and template security.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (36, 'ISO-036', 'Blockchain Security Vulnerabilities', 'Risk of security vulnerabilities in blockchain implementations, smart contracts, or cryptocurrency systems leading to financial loss or data compromise.', 'Blockchain Security', 2, 4, DEFAULT, DEFAULT, 'Open', 'Natalie Wilson - Blockchain Security Analyst', 'Implement blockchain security audits, establish smart contract testing, deploy blockchain monitoring, and maintain cryptocurrency security controls.', 3, '2024-06-30', '2024-09-30', '{A.14.2.8,A.10.1.1,A.15.1.1}', '{"Blockchain Networks","Smart Contracts","Cryptocurrency Wallets"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 3, 'Blockchain security framework is in development but needs comprehensive security audit and monitoring capabilities.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (37, 'ISO-037', 'Edge Computing Security Risks', 'Risk of security vulnerabilities in edge computing infrastructure due to distributed architecture, limited security controls, and remote management challenges.', 'Edge Security', 3, 3, DEFAULT, DEFAULT, 'Open', 'Carlos Martinez - Edge Computing Security', 'Implement edge security frameworks, establish remote device management, deploy edge monitoring solutions, and maintain edge device security updates.', 4, '2024-07-05', '2024-10-05', '{A.11.2.6,A.13.1.3,A.12.6.1}', '{"Edge Devices","Edge Networks","Remote Sensors"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 2, 'Edge computing security controls are being developed but need comprehensive implementation across distributed infrastructure.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (39, 'ISO-039', 'Privacy Engineering Compliance Gaps', 'Risk of privacy violations due to inadequate privacy-by-design implementation in systems and processes, leading to regulatory penalties and reputation damage.', 'Privacy Engineering', 2, 4, DEFAULT, DEFAULT, 'Open', 'Isabella Rodriguez - Privacy Engineer', 'Implement privacy-by-design principles, establish data minimization practices, deploy privacy impact assessments, and maintain privacy compliance monitoring.', 3, '2024-07-15', '2024-10-15', '{A.18.1.4,A.8.2.1,A.18.1.1}', '{"Data Processing Systems","Customer Data","Privacy Management Tools"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 3, 'Privacy engineering practices are being developed but need systematic implementation across all data processing activities.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (40, 'ISO-040', 'Threat Intelligence Integration Gaps', 'Risk of security incidents due to inadequate threat intelligence integration, resulting in delayed threat detection and response.', 'Threat Intelligence', 3, 3, DEFAULT, DEFAULT, 'Open', 'Alexander Brown - Threat Intelligence Analyst', 'Implement threat intelligence platforms, establish threat hunting capabilities, deploy automated threat feeds, and conduct threat intelligence training.', 4, '2024-07-20', '2024-10-20', '{A.12.6.1,A.16.1.4,A.12.4.1}', '{"Threat Intelligence Platforms","Security Tools","Incident Response Systems"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 2, 'Threat intelligence capabilities are being developed but need enhancement in automation and integration with security tools.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (41, 'ISO-041', 'Security Orchestration Automation Failures', 'Risk of delayed incident response and inefficient security operations due to lack of security orchestration and automated response capabilities.', 'Security Automation', 2, 3, DEFAULT, DEFAULT, 'Open', 'Melissa Davis - Security Automation Lead', 'Implement security orchestration platforms, establish automated response playbooks, deploy security automation tools, and conduct automation testing.', 2, '2024-07-25', '2024-10-25', '{A.16.1.5,A.12.1.1,A.16.1.4}', '{"Security Orchestration Platform","Incident Response Tools","Security Analytics"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 2, 'Security automation framework is in development but needs comprehensive playbook development and testing.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (42, 'ISO-042', 'Digital Forensics Capability Gaps', 'Risk of inadequate incident investigation and evidence collection due to insufficient digital forensics capabilities and procedures.', 'Digital Forensics', 2, 3, DEFAULT, DEFAULT, 'Open', 'Christopher Wilson - Digital Forensics Specialist', 'Establish digital forensics procedures, implement forensics tools and capabilities, conduct forensics training, and maintain evidence handling protocols.', 2, '2024-07-30', '2024-10-30', '{A.16.1.7,A.16.1.6,A.12.4.2}', '{"Forensics Tools","Evidence Storage","Investigation Systems"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 2, 'Digital forensics capabilities are basic but need enhancement in tools, training, and procedures.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (43, 'ISO-043', 'Security Metrics and KPI Gaps', 'Risk of ineffective security program management due to lack of comprehensive security metrics, KPIs, and performance measurement.', 'Security Metrics', 2, 2, DEFAULT, DEFAULT, 'Open', 'Jennifer Martinez - Security Metrics Analyst', 'Implement security metrics framework, establish KPI dashboards, deploy security measurement tools, and conduct regular security performance reviews.', 1, '2024-08-01', '2024-11-01', '{A.18.2.1,A.5.1.2,A.12.1.1}', '{"Security Dashboards","Metrics Tools","Reporting Systems"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 1, 'Security metrics program is in early development but needs comprehensive framework and automation.', 'Accept');
-- INSERT INTO public.iso27001_risks VALUES (44, 'ISO-044', 'Third-Party Risk Assessment Gaps', 'Risk of security incidents from third-party vendors due to inadequate risk assessment and ongoing monitoring of vendor security posture.', 'Third-Party Risk', 3, 4, DEFAULT, DEFAULT, 'Open', 'Robert Lee - Third-Party Risk Manager', 'Implement vendor risk assessment framework, establish continuous vendor monitoring, deploy third-party risk management tools, and maintain vendor security scorecards.', 6, '2024-08-05', '2024-11-05', '{A.15.1.1,A.15.2.1,A.15.2.2}', '{"Vendor Management Systems","Risk Assessment Tools","Vendor Portals"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 3, 'Third-party risk assessment processes are established but need enhancement in continuous monitoring and automation.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (45, 'ISO-045', 'Security Training and Awareness Gaps', 'Risk of security incidents due to inadequate security awareness training and lack of security culture among employees and contractors.', 'Security Training', 3, 3, DEFAULT, DEFAULT, 'Open', 'Amanda Thompson - Security Training Manager', 'Implement comprehensive security training programs, establish role-based training, deploy security awareness platforms, and conduct regular training effectiveness assessments.', 4, '2024-08-10', '2024-11-10', '{A.7.2.2,A.7.2.1,A.16.1.2}', '{"Training Platforms","E-Learning Systems","Assessment Tools"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 2, 2, 'Security training programs are in place but need enhancement in personalization and effectiveness measurement.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (46, 'ISO-046', 'Regulatory Change Management Risks', 'Risk of non-compliance due to failure to identify, assess, and implement changes required by new or updated regulations and standards.', 'Regulatory Management', 2, 4, DEFAULT, DEFAULT, 'Open', 'Victoria Garcia - Regulatory Affairs Manager', 'Implement regulatory change monitoring, establish compliance impact assessments, deploy regulatory management tools, and maintain regulatory change procedures.', 3, '2024-08-15', '2024-11-15', '{A.18.1.1,A.18.2.2,A.5.1.2}', '{"Compliance Management Systems","Regulatory Databases","Change Management Tools"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 3, 'Regulatory change management processes are documented but need automation and proactive monitoring capabilities.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (47, 'ISO-047', 'Security Architecture Review Gaps', 'Risk of security vulnerabilities due to inadequate security architecture reviews for new systems, applications, and infrastructure changes.', 'Security Architecture', 2, 3, DEFAULT, DEFAULT, 'Open', 'Thomas Rodriguez - Security Architect', 'Implement security architecture review processes, establish security design standards, deploy architecture assessment tools, and conduct regular architecture security audits.', 2, '2024-08-20', '2024-11-20', '{A.14.1.1,A.14.2.5,A.13.1.1}', '{"Architecture Documentation","Design Tools","Review Systems"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 2, 'Security architecture review processes are established but need enhancement in automation and comprehensive coverage.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (48, 'ISO-048', 'Crisis Communication Plan Inadequacy', 'Risk of reputational damage and stakeholder confusion during security incidents due to inadequate crisis communication plans and procedures.', 'Crisis Communication', 2, 3, DEFAULT, DEFAULT, 'Open', 'Sarah Wilson - Crisis Communication Lead', 'Develop crisis communication plans, establish stakeholder notification procedures, implement communication tools, and conduct crisis communication training.', 2, '2024-08-25', '2024-11-25', '{A.16.1.2,A.6.1.4,A.7.2.2}', '{"Communication Systems","Notification Tools","Media Relations"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 2, 'Crisis communication plans exist but need regular testing and updates for current threat landscape.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (49, 'ISO-049', 'Security Budget and Resource Allocation Risks', 'Risk of inadequate security posture due to insufficient budget allocation and resource planning for security initiatives and operations.', 'Security Governance', 2, 4, DEFAULT, DEFAULT, 'Open', 'Michael Brown - Security Finance Manager', 'Implement security budget planning, establish ROI metrics for security investments, deploy resource allocation tools, and conduct regular security investment reviews.', 3, '2024-08-30', '2024-11-30', '{A.6.1.1,A.5.1.1,A.18.2.1}', '{"Budget Management Systems","Resource Planning Tools","Investment Tracking"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 3, 'Security budget planning processes are in place but need enhancement in ROI measurement and strategic alignment.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (50, 'ISO-050', 'Emerging Technology Security Assessment Gaps', 'Risk of security vulnerabilities in emerging technologies due to lack of security assessment frameworks and expertise for new technology adoption.', 'Emerging Technology', 2, 3, DEFAULT, DEFAULT, 'Open', 'Dr. Lisa Martinez - Emerging Technology Security', 'Establish emerging technology assessment framework, implement security research capabilities, deploy technology evaluation tools, and maintain emerging threat monitoring.', 2, '2024-09-01', '2024-12-01', '{A.14.1.1,A.12.6.1,A.15.1.3}', '{"Research Labs","Evaluation Platforms","Technology Assessments"}', '2025-07-17 01:51:55.764134', '2025-07-17 01:51:55.764134', 1, 2, 'Emerging technology security assessment capabilities are in development but need comprehensive framework and expertise.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (1, 'ISO-001', 'Unauthorized Access to Customer Database', 'Risk of unauthorized personnel gaining access to sensitive customer information stored in the primary customer database through weak authentication mechanisms or privilege escalation attacks.', 'Access Control', 4, 5, DEFAULT, DEFAULT, 'Mitigated', 'John Smith - CISO', 'Implement multi-factor authentication for all database access, conduct quarterly access reviews, deploy privileged access management solution, and establish real-time monitoring for suspicious database activities.', 6, '2024-01-15', '2024-04-15', '{A.9.1.1,A.9.2.1,A.9.4.2,A.12.4.1}', '{"Customer Database","CRM System","Authentication Server"}', '2025-07-17 01:51:55.764134', '2025-07-18 13:49:47.907495', 2, 3, 'Current access controls are partially effective but lack comprehensive monitoring. MFA implementation is 60% complete across critical systems.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (15, 'ISO-015', 'Privileged Account Compromise', 'Risk of administrative and service accounts being compromised, providing attackers with elevated access to critical systems and sensitive data.', 'Access Control', 4, 4, DEFAULT, DEFAULT, 'Mitigated', 'Christopher Johnson - Identity Management', 'Implement privileged access management (PAM), establish just-in-time access, deploy session monitoring, and conduct regular privileged account audits.', 8, '2024-03-25', '2024-06-25', '{A.9.2.3,A.9.2.4,A.9.2.5}', '{"Administrative Systems","Service Accounts","Domain Controllers"}', '2025-07-17 01:51:55.764134', '2025-07-18 18:07:39.315853', 2, 4, 'Privileged account management is partially implemented but needs comprehensive monitoring and access controls.', 'Mitigate');
-- INSERT INTO public.iso27001_risks VALUES (38, 'ISO-038', 'Zero Trust Architecture Implementation Gaps', 'Risk of security breaches due to incomplete implementation of zero trust security principles, allowing lateral movement and privilege escalation.', 'Zero Trust', 3, 4, DEFAULT, DEFAULT, 'Open', 'Diana Lee - Zero Trust Architect', 'Implement zero trust network architecture, establish identity verification, deploy micro-segmentation, and conduct zero trust maturity assessments.', 6, '2024-07-10', '2024-10-10', '{A.9.1.1,A.13.1.3,A.9.4.1}', '{"Network Infrastructure","Identity Systems","Access Control Systems"}', '2025-07-17 01:51:55.764134', '2025-07-18 19:46:11.90887', 2, 3, 'Zero trust implementation is in progress but needs comprehensive coverage across all network segments and applications.', 'Mitigate');


-- --
-- -- TOC entry 6721 (class 0 OID 303195)
-- -- Dependencies: 375
-- -- Data for Name: iso27001_sub_controls; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6637 (class 0 OID 122900)
-- -- Dependencies: 291
-- -- Data for Name: iso27001_threat_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.iso27001_threat_categories VALUES (1, 'HUMAN-INT', 'Human - Intentional', 'Deliberate human actions with malicious intent', 'A.7, A.8, A.9', true);
-- INSERT INTO public.iso27001_threat_categories VALUES (2, 'HUMAN-ACC', 'Human - Accidental', 'Unintentional human errors and mistakes', 'A.7, A.12', true);
-- INSERT INTO public.iso27001_threat_categories VALUES (3, 'TECHNICAL', 'Technical Failures', 'Hardware, software, and system failures', 'A.12, A.17', true);
-- INSERT INTO public.iso27001_threat_categories VALUES (4, 'PHYSICAL', 'Physical and Environmental', 'Physical security and environmental threats', 'A.11', true);
-- INSERT INTO public.iso27001_threat_categories VALUES (5, 'ORGANIZATIONAL', 'Organizational', 'Process and organizational structure threats', 'A.5, A.6', true);


-- --
-- -- TOC entry 6639 (class 0 OID 122912)
-- -- Dependencies: 293
-- -- Data for Name: iso27001_threats; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.iso27001_threats VALUES (1, 'T-001', 'Unauthorized Access', 'Unauthorized individuals gaining access to systems or data', 1, 'Human', 'Intentional', 'A.9.1', true);
-- INSERT INTO public.iso27001_threats VALUES (2, 'T-002', 'Data Theft', 'Intentional theft of sensitive information', 1, 'Human', 'Intentional', 'A.8.2', true);
-- INSERT INTO public.iso27001_threats VALUES (3, 'T-003', 'Malware Attack', 'Deployment of malicious software', 1, 'Human', 'Intentional', 'A.12.2', true);
-- INSERT INTO public.iso27001_threats VALUES (4, 'T-004', 'Social Engineering', 'Manipulation of individuals to divulge information', 1, 'Human', 'Intentional', 'A.7.2', true);
-- INSERT INTO public.iso27001_threats VALUES (5, 'T-005', 'Insider Threat', 'Malicious actions by authorized personnel', 1, 'Human', 'Intentional', 'A.7.1', true);
-- INSERT INTO public.iso27001_threats VALUES (6, 'T-006', 'Denial of Service', 'Intentional disruption of service availability', 1, 'Human', 'Intentional', 'A.12.3', true);
-- INSERT INTO public.iso27001_threats VALUES (7, 'T-007', 'Data Manipulation', 'Unauthorized modification of data', 1, 'Human', 'Intentional', 'A.8.2', true);
-- INSERT INTO public.iso27001_threats VALUES (8, 'T-008', 'Privilege Escalation', 'Unauthorized elevation of access rights', 1, 'Human', 'Intentional', 'A.9.2', true);
-- INSERT INTO public.iso27001_threats VALUES (9, 'T-101', 'Human Error', 'Unintentional mistakes by users or administrators', 2, 'Human', 'Accidental', 'A.7.2', true);
-- INSERT INTO public.iso27001_threats VALUES (10, 'T-102', 'Accidental Deletion', 'Unintentional deletion of data or systems', 2, 'Human', 'Accidental', 'A.12.3', true);
-- INSERT INTO public.iso27001_threats VALUES (11, 'T-103', 'Misconfiguration', 'Incorrect system or security configuration', 2, 'Human', 'Accidental', 'A.12.6', true);
-- INSERT INTO public.iso27001_threats VALUES (12, 'T-104', 'Data Loss', 'Accidental loss of information', 2, 'Human', 'Accidental', 'A.8.2', true);
-- INSERT INTO public.iso27001_threats VALUES (13, 'T-201', 'Hardware Failure', 'Failure of physical computing components', 3, 'Technical', 'Accidental', 'A.11.2', true);
-- INSERT INTO public.iso27001_threats VALUES (14, 'T-202', 'Software Failure', 'Application or system software malfunction', 3, 'Technical', 'Accidental', 'A.12.1', true);
-- INSERT INTO public.iso27001_threats VALUES (15, 'T-203', 'Network Failure', 'Communication network disruption', 3, 'Technical', 'Accidental', 'A.13.1', true);
-- INSERT INTO public.iso27001_threats VALUES (16, 'T-204', 'Database Corruption', 'Corruption of database integrity', 3, 'Technical', 'Accidental', 'A.12.3', true);
-- INSERT INTO public.iso27001_threats VALUES (17, 'T-205', 'System Overload', 'System capacity exceeded', 3, 'Technical', 'Accidental', 'A.12.1', true);
-- INSERT INTO public.iso27001_threats VALUES (18, 'T-301', 'Fire', 'Fire damage to facilities or equipment', 4, 'Environmental', 'Natural', 'A.11.1', true);
-- INSERT INTO public.iso27001_threats VALUES (19, 'T-302', 'Flood', 'Water damage from flooding', 4, 'Environmental', 'Natural', 'A.11.1', true);
-- INSERT INTO public.iso27001_threats VALUES (20, 'T-303', 'Power Outage', 'Loss of electrical power supply', 4, 'Environmental', 'Accidental', 'A.11.2', true);
-- INSERT INTO public.iso27001_threats VALUES (21, 'T-304', 'Physical Theft', 'Theft of physical assets', 4, 'Human', 'Intentional', 'A.11.2', true);
-- INSERT INTO public.iso27001_threats VALUES (22, 'T-305', 'Unauthorized Physical Access', 'Unauthorized entry to facilities', 4, 'Human', 'Intentional', 'A.11.1', true);
-- INSERT INTO public.iso27001_threats VALUES (23, 'T-401', 'Process Failure', 'Breakdown of business processes', 5, 'Organizational', 'Accidental', 'A.5.1', true);
-- INSERT INTO public.iso27001_threats VALUES (24, 'T-402', 'Supplier Failure', 'Third-party service provider failure', 5, 'Organizational', 'Accidental', 'A.15.1', true);
-- INSERT INTO public.iso27001_threats VALUES (25, 'T-403', 'Regulatory Non-compliance', 'Failure to meet regulatory requirements', 5, 'Organizational', 'Accidental', 'A.18.1', true);


-- --
-- -- TOC entry 6841 (class 0 OID 688166)
-- -- Dependencies: 497
-- -- Data for Name: iso27001_treatment_controls; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6839 (class 0 OID 688129)
-- -- Dependencies: 495
-- -- Data for Name: iso27001_treatment_plans; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6843 (class 0 OID 688197)
-- -- Dependencies: 499
-- -- Data for Name: iso27001_treatment_tracking; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6857 (class 0 OID 786449)
-- -- Dependencies: 514
-- -- Data for Name: iso27001_validation_rules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.iso27001_validation_rules VALUES (1, 'Default Evidence Requirements', 'Default validation rules for ISO 27001 risk status changes', true, true, true, 'System', '2025-07-18 19:43:44.285242', '2025-07-18 19:43:44.285242', NULL);


-- --
-- -- TOC entry 6641 (class 0 OID 122929)
-- -- Dependencies: 295
-- -- Data for Name: iso27001_vulnerabilities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.iso27001_vulnerabilities VALUES (1, 'V-001', 'Unpatched Software', 'Software with known security vulnerabilities not updated', 'Technical', 'High', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (2, 'V-002', 'Weak Authentication', 'Insufficient authentication mechanisms', 'Technical', 'High', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (3, 'V-003', 'Inadequate Access Controls', 'Insufficient access control implementation', 'Technical', 'Medium', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (4, 'V-004', 'Unencrypted Data', 'Sensitive data stored or transmitted without encryption', 'Technical', 'High', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (5, 'V-005', 'Default Configurations', 'Systems using default security configurations', 'Technical', 'Medium', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (6, 'V-006', 'Insufficient Logging', 'Inadequate security event logging and monitoring', 'Technical', 'Medium', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (7, 'V-007', 'Network Segmentation Issues', 'Poor network isolation and segmentation', 'Technical', 'Medium', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (8, 'V-008', 'Backup Vulnerabilities', 'Inadequate backup security or testing', 'Technical', 'Medium', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (9, 'V-101', 'Inadequate Physical Security', 'Insufficient physical access controls', 'Physical', 'Medium', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (10, 'V-102', 'Environmental Controls', 'Lack of environmental monitoring and controls', 'Physical', 'Low', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (11, 'V-103', 'Unsecured Equipment', 'Equipment not properly secured', 'Physical', 'Medium', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (12, 'V-201', 'Lack of Security Awareness', 'Insufficient security training and awareness', 'Human', 'High', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (13, 'V-202', 'Inadequate Background Checks', 'Insufficient personnel screening', 'Human', 'Medium', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (14, 'V-203', 'Poor Password Practices', 'Weak password policies and practices', 'Human', 'High', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (15, 'V-301', 'Inadequate Policies', 'Missing or outdated security policies', 'Organizational', 'Medium', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (16, 'V-302', 'Insufficient Risk Management', 'Inadequate risk management processes', 'Organizational', 'High', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (17, 'V-303', 'Poor Incident Response', 'Inadequate incident response capabilities', 'Organizational', 'Medium', NULL, true);
-- INSERT INTO public.iso27001_vulnerabilities VALUES (18, 'V-304', 'Vendor Management Issues', 'Insufficient third-party risk management', 'Organizational', 'Medium', NULL, true);


-- --
-- -- TOC entry 6659 (class 0 OID 147457)
-- -- Dependencies: 313
-- -- Data for Name: iso27002_control_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.iso27002_control_categories VALUES (1, 'A.5', 'Information Security Policies', 'Management direction and support for information security in accordance with business requirements and relevant laws and regulations', true, '2025-06-23 16:49:30.377801', 'Organizational');
-- INSERT INTO public.iso27002_control_categories VALUES (2, 'A.6', 'Organization of Information Security', 'Organization and management framework for initiating and controlling the implementation and operation of information security within the organization', true, '2025-06-23 16:49:30.377801', 'Organizational');
-- INSERT INTO public.iso27002_control_categories VALUES (3, 'A.7', 'Human Resource Security', 'Ensuring that employees and contractors understand their responsibilities and are suitable for the roles for which they are considered', true, '2025-06-23 16:49:30.377801', 'Organizational');
-- INSERT INTO public.iso27002_control_categories VALUES (4, 'A.8', 'Asset Management', 'Achieving and maintaining appropriate protection of organizational assets', true, '2025-06-23 16:49:30.377801', 'Organizational');
-- INSERT INTO public.iso27002_control_categories VALUES (5, 'A.9', 'Access Control', 'Limiting access to information and information processing facilities', true, '2025-06-23 16:49:30.377801', 'Technical');
-- INSERT INTO public.iso27002_control_categories VALUES (6, 'A.10', 'Cryptography', 'Ensuring proper and effective use of cryptography to protect the confidentiality, authenticity and/or integrity of information', true, '2025-06-23 16:49:30.377801', 'Technical');
-- INSERT INTO public.iso27002_control_categories VALUES (7, 'A.11', 'Physical and Environmental Security', 'Preventing unauthorized physical access, damage and interference to the organization''s information and information processing facilities', true, '2025-06-23 16:49:30.377801', 'Physical');
-- INSERT INTO public.iso27002_control_categories VALUES (8, 'A.12', 'Operations Security', 'Ensuring correct and secure operations of information processing facilities', true, '2025-06-23 16:49:30.377801', 'Physical');
-- INSERT INTO public.iso27002_control_categories VALUES (9, 'A.13', 'Communications Security', 'Ensuring the protection of information in networks and its supporting information processing facilities', true, '2025-06-23 16:49:30.377801', 'Technical');
-- INSERT INTO public.iso27002_control_categories VALUES (10, 'A.14', 'System Acquisition, Development and Maintenance', 'Ensuring that information security is an integral part of information systems across the entire lifecycle', true, '2025-06-23 16:49:30.377801', 'Technical');
-- INSERT INTO public.iso27002_control_categories VALUES (11, 'A.15', 'Supplier Relationships', 'Ensuring protection of the organization''s assets that is accessible by suppliers', true, '2025-06-23 16:49:30.377801', 'Organizational');
-- INSERT INTO public.iso27002_control_categories VALUES (12, 'A.16', 'Information Security Incident Management', 'Ensuring a consistent and effective approach to the management of information security incidents', true, '2025-06-23 16:49:30.377801', 'Organizational');
-- INSERT INTO public.iso27002_control_categories VALUES (13, 'A.17', 'Information Security Aspects of Business Continuity Management', 'Information security continuity shall be embedded in the organization''s business continuity management systems', true, '2025-06-23 16:49:30.377801', 'Organizational');
-- INSERT INTO public.iso27002_control_categories VALUES (14, 'A.18', 'Compliance', 'Avoiding breaches of legal, statutory, regulatory or contractual obligations related to information security and of security requirements', true, '2025-06-23 16:49:30.377801', 'Organizational');


-- --
-- -- TOC entry 6661 (class 0 OID 147470)
-- -- Dependencies: 315
-- -- Data for Name: iso27002_controls; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.iso27002_controls VALUES (1, 'A.5.1', 'Management direction for information security', 'Management shall provide direction and support for information security in accordance with business requirements and relevant laws and regulations.', 'Top management should demonstrate leadership and commitment with respect to information security by establishing information security policies and ensuring that the information security roles and responsibilities are assigned and communicated.', 1, NULL, 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (2, 'A.5.1.1', 'Information security policy', 'An information security policy shall be defined, approved by management, published and communicated to employees and relevant external parties.', 'The information security policy should provide management direction and support for information security in accordance with business requirements and relevant laws and regulations.', 1, 'A.5.1', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (3, 'A.5.1.2', 'Review of the information security policy', 'The information security policy shall be reviewed at planned intervals or if significant changes occur to ensure its continuing suitability, adequacy and effectiveness.', 'The review should take into account feedback from interested parties, changes in the organization, changes in the threat landscape, and lessons learned from security incidents.', 1, 'A.5.1', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (4, 'A.6.1', 'Internal organization', 'A management framework shall be established to initiate and control the implementation and operation of information security within the organization.', 'Management should establish an appropriate organizational structure for information security, including the assignment of information security responsibilities.', 2, NULL, 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (5, 'A.6.1.1', 'Information security roles and responsibilities', 'All information security responsibilities shall be defined and allocated.', 'Information security roles and responsibilities should be defined and allocated according to the organization needs. These responsibilities should be supplemented, where necessary, with more detailed guidance for specific sites and information processing facilities.', 2, 'A.6.1', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (6, 'A.6.1.2', 'Segregation of duties', 'Conflicting duties and areas of responsibility shall be segregated to reduce opportunities for unauthorized or unintentional modification or misuse of the organization''s assets.', 'Care should be taken that no single person can access, modify or use assets without authorization or detection. The initiation of an event should be separated from its authorization.', 2, 'A.6.1', 'Organizational', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (7, 'A.6.1.3', 'Contact with authorities', 'Appropriate contacts with relevant authorities shall be maintained.', 'Organizations should establish procedures for contacting relevant authorities (e.g., law enforcement, fire department, internet service providers) when security incidents occur.', 2, 'A.6.1', 'Organizational', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (8, 'A.6.1.4', 'Contact with special interest groups', 'Appropriate contacts with special interest groups or other specialist security forums and professional associations shall be maintained.', 'Membership of special interest groups or forums should be considered to keep up to date with best practices and to receive early warning of attacks and vulnerabilities.', 2, 'A.6.1', 'Organizational', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (9, 'A.6.1.5', 'Information security in project management', 'Information security shall be addressed in project management, regardless of the type of the project.', 'Project management methodology should include information security considerations to ensure that information security is built into information systems.', 2, 'A.6.1', 'Organizational', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (10, 'A.6.2', 'Mobile devices and teleworking', 'A policy and supporting security measures shall be adopted to manage the risks introduced by using mobile devices and teleworking.', 'Organizations should consider the risks of working with mobile devices in unprotected environments and take appropriate measures.', 2, NULL, 'Organizational', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (11, 'A.6.2.1', 'Mobile device policy', 'A policy and supporting security measures shall be adopted to manage the risks introduced by using mobile devices.', 'The policy should consider the risks of working with mobile devices, particularly in unprotected environments, and apply appropriate safeguards.', 2, 'A.6.2', 'Organizational', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (12, 'A.6.2.2', 'Teleworking', 'A policy and supporting security measures shall be implemented to protect information accessed, processed or stored at teleworking sites.', 'Teleworking activities should be authorized and controlled by management, and appropriate security measures should be implemented.', 2, 'A.6.2', 'Organizational', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (13, 'A.7.1', 'Prior to employment', 'Security responsibilities and duties shall be addressed prior to employment.', 'Background verification checks on all candidates for employment should be carried out in accordance with relevant laws, regulations and ethics.', 3, NULL, 'Organizational', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (14, 'A.7.1.1', 'Screening', 'Background verification checks on all candidates for employment shall be carried out in accordance with relevant laws, regulations and ethics and shall be proportional to the business requirements, the classification of the information to be accessed and the perceived risks.', 'Screening should include character references, confirmation of claimed academic and professional qualifications, and independent identity checks.', 3, 'A.7.1', 'Organizational', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (15, 'A.7.1.2', 'Terms and conditions of employment', 'The contractual agreements with employees and contractors shall state their and the organization''s responsibilities for information security.', 'Terms and conditions of employment should include the employee''s information security responsibilities and the organization''s responsibilities.', 3, 'A.7.1', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (16, 'A.7.2', 'During employment', 'Management shall ensure that employees and contractors are aware of and fulfill their information security responsibilities.', 'All employees should receive appropriate awareness education and training and regular updates in organizational policies and procedures.', 3, NULL, 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (17, 'A.7.2.1', 'Management responsibilities', 'Management shall require all employees and contractors to apply information security in accordance with the established policies and procedures of the organization.', 'Management should ensure that employees and contractors understand their information security responsibilities before granting access to sensitive information or systems.', 3, 'A.7.2', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (18, 'A.7.2.2', 'Information security awareness, education and training', 'All employees of the organization and, where relevant, contractors shall receive appropriate awareness education and training and regular updates in organizational policies and procedures, as relevant for their job function.', 'Information security education and training programs should be designed to help personnel understand information security policies and procedures and their role in protecting organizational information.', 3, 'A.7.2', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (19, 'A.7.2.3', 'Disciplinary process', 'There shall be a formal and communicated disciplinary process in place to take action against employees who have committed an information security breach.', 'The disciplinary process should be fair and appropriate, and should be communicated to all employees.', 3, 'A.7.2', 'Organizational', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (20, 'A.7.3', 'Termination and change of employment', 'Information security responsibilities and duties that remain valid after termination or change of employment shall be defined, communicated to the employee or contractor and enforced.', 'Procedures should be in place to ensure the orderly termination of employment and the return of all organizational assets.', 3, NULL, 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (21, 'A.7.3.1', 'Termination or change of employment responsibilities', 'Information security responsibilities and duties that remain valid after termination or change of employment shall be defined, communicated to the employee or contractor and enforced.', 'Responsibilities for performing employment termination or change of employment should be clearly defined and assigned.', 3, 'A.7.3', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (22, 'A.8.1', 'Responsibility for assets', 'Assets associated with information and information processing facilities shall be identified and an inventory of these assets shall be drawn up and maintained.', 'All assets should be accounted for and have a nominated owner who is responsible for their appropriate protection.', 4, NULL, 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (23, 'A.8.1.1', 'Inventory of assets', 'Assets associated with information and information processing facilities shall be identified and an inventory of these assets shall be drawn up and maintained.', 'The organization should identify all assets and document their importance. The inventory should be kept up to date.', 4, 'A.8.1', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (24, 'A.8.1.2', 'Ownership of assets', 'Assets maintained in the inventory shall be owned.', 'All assets should have an owner who is accountable for their appropriate protection throughout their lifecycle.', 4, 'A.8.1', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (25, 'A.8.1.3', 'Acceptable use of assets', 'Rules for the acceptable use of information and of assets associated with information and information processing facilities shall be identified, documented and implemented.', 'Rules should cover the acceptable use of email, internet, mobile devices, and other assets.', 4, 'A.8.1', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (26, 'A.8.1.4', 'Return of assets', 'All employees and external party users shall return all of the organizational assets in their possession upon termination of their employment, contract or agreement.', 'Procedures should ensure that assets are returned in a timely manner and that any organizational information is removed from personal devices.', 4, 'A.8.1', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (27, 'A.8.2', 'Information classification', 'Information shall be classified in terms of legal requirements, value, criticality and sensitivity to unauthorized disclosure or modification.', 'Information should be classified to indicate the need, priorities and expected degree of protection when handling the information.', 4, NULL, 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (28, 'A.8.2.1', 'Classification of information', 'Information shall be classified in terms of legal requirements, value, criticality and sensitivity to unauthorized disclosure or modification.', 'Classification should take account of the business value of the information, legal requirements, and sensitivity.', 4, 'A.8.2', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (29, 'A.8.2.2', 'Labelling of information', 'An appropriate set of procedures for information labelling shall be developed and implemented in accordance with the information classification scheme adopted by the organization.', 'Information should be labeled according to the classification scheme to ensure appropriate handling.', 4, 'A.8.2', 'Organizational', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (30, 'A.8.2.3', 'Handling of assets', 'Procedures for handling assets shall be developed and implemented in accordance with the information classification scheme adopted by the organization.', 'Handling procedures should address storage, transmission, and disposal of information according to its classification.', 4, 'A.8.2', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (31, 'A.8.3', 'Media handling', 'Media shall be handled securely in accordance with the requirements of the information classification scheme adopted by the organization.', 'Procedures should be established for the secure handling of removable media to prevent unauthorized disclosure, modification, removal or destruction of assets.', 4, NULL, 'Technical', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (32, 'A.8.3.1', 'Management of removable media', 'Procedures shall be implemented for the management of removable media in accordance with the classification scheme adopted by the organization.', 'Removable media should be handled securely according to the classification of the information stored on them.', 4, 'A.8.3', 'Technical', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (33, 'A.8.3.2', 'Disposal of media', 'Media shall be disposed of securely when no longer required, using formal procedures.', 'Formal procedures should be in place for the secure disposal of media to prevent unauthorized disclosure of information.', 4, 'A.8.3', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (34, 'A.8.3.3', 'Physical media transfer', 'Media containing information shall be protected against unauthorized access, misuse or corruption during transportation.', 'Media should be protected during transportation through the use of secure packaging and trusted delivery methods.', 4, 'A.8.3', 'Physical', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (35, 'A.9.1', 'Business requirements of access control', 'Access control policy shall be established, documented and reviewed based on business and information security requirements.', 'Access to information and information processing facilities should be controlled based on business and security requirements.', 5, NULL, 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (36, 'A.9.1.1', 'Access control policy', 'An access control policy shall be established, documented and reviewed based on business and information security requirements.', 'The access control policy should be based on the principle of least privilege and need-to-know basis.', 5, 'A.9.1', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (37, 'A.9.1.2', 'Access to networks and network services', 'Access to networks and network services shall be controlled.', 'A policy should be formulated concerning the use of networks and network services, covering authorized networks and network services.', 5, 'A.9.1', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (38, 'A.9.2', 'User access management', 'A formal user access provisioning process shall be implemented to assign or revoke access rights for all user types to all systems and services.', 'User access should be managed through a formal process covering the full access lifecycle.', 5, NULL, 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (39, 'A.9.2.1', 'User registration and de-registration', 'A formal user registration and de-registration process shall be implemented to enable assignment of access rights.', 'User registration should include verification of identity and authorization for access.', 5, 'A.9.2', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (62, 'A.11.2', 'Equipment', 'Equipment shall be protected against loss, damage, theft or compromise of assets and interruption to the organization''s operations.', 'Equipment should be physically protected from security threats and environmental hazards.', 7, NULL, 'Physical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (40, 'A.9.2.2', 'User access provisioning', 'A formal user access provisioning process shall be implemented to assign or revoke access rights for all user types to all systems and services.', 'Access provisioning should be based on approved access requests and should follow the principle of least privilege.', 5, 'A.9.2', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (41, 'A.9.2.3', 'Management of privileged access rights', 'The allocation and use of privileged access rights shall be restricted and controlled.', 'Privileged access should be allocated on a need-to-use basis and on an event-by-event basis.', 5, 'A.9.2', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (42, 'A.9.2.4', 'Management of secret authentication information of users', 'The allocation of secret authentication information shall be controlled through a formal management process.', 'Users should be required to follow good security practices in the selection and use of passwords.', 5, 'A.9.2', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (43, 'A.9.2.5', 'Review of user access rights', 'Asset owners shall review users'' access rights at regular intervals.', 'Access rights should be reviewed regularly to ensure they remain appropriate for the user''s role and responsibilities.', 5, 'A.9.2', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (44, 'A.9.2.6', 'Removal or adjustment of access rights', 'The access rights of all employees and external party users to information and information processing facilities shall be removed upon termination of their employment, contract or agreement, or adjusted upon change.', 'Access rights should be removed or adjusted promptly when employment or contracts are terminated or changed.', 5, 'A.9.2', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (45, 'A.9.3', 'User responsibilities', 'Users shall be made aware of their responsibilities for maintaining effective access controls.', 'Users should be educated about their responsibilities for maintaining effective access controls, particularly regarding the use of passwords and equipment.', 5, NULL, 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (46, 'A.9.3.1', 'Use of secret authentication information', 'Users shall be required to follow the organization''s practices in the use of secret authentication information.', 'Users should be educated about the proper use of authentication information and should follow organizational practices.', 5, 'A.9.3', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (47, 'A.9.4', 'System and application access control', 'Access to systems and applications shall be controlled in accordance with the access control policy.', 'Logical access to software and information should be controlled by secure logon procedures and a suitable user identification and authentication system.', 5, NULL, 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (48, 'A.9.4.1', 'Information access restriction', 'Access to information and application system functions shall be restricted in accordance with the access control policy.', 'Access should be controlled by means of a secure logon process and appropriate user identification and authentication.', 5, 'A.9.4', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (49, 'A.9.4.2', 'Secure log-on procedures', 'Where required by the access control policy, access to systems and applications shall be controlled by a secure log-on procedure.', 'The logon procedure should be designed to minimize the opportunity for unauthorized access.', 5, 'A.9.4', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (50, 'A.9.4.3', 'Password management system', 'Password management systems shall be interactive and shall ensure quality passwords.', 'Password management systems should enforce the use of quality passwords and provide facilities for users to maintain their own passwords.', 5, 'A.9.4', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (51, 'A.9.4.4', 'Use of privileged utility programs', 'The use of utility programs that might be capable of overriding system and application controls shall be restricted and tightly controlled.', 'Utility programs should be restricted to authorized users and their use should be logged and monitored.', 5, 'A.9.4', 'Technical', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (52, 'A.9.4.5', 'Access control to program source code', 'Access to program source code shall be restricted.', 'Source code should be protected from unauthorized access and modification through appropriate access controls.', 5, 'A.9.4', 'Technical', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (53, 'A.10.1', 'Cryptographic controls', 'Policy on the use of cryptographic controls for protection of information shall be developed and implemented.', 'A policy should be developed on the use of cryptographic controls including key management.', 6, NULL, 'Technical', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (54, 'A.10.1.1', 'Policy on the use of cryptographic controls', 'A policy on the use of cryptographic controls for protection of information shall be developed and implemented.', 'The policy should include the approach to key management and the standards to be adopted for effective implementation.', 6, 'A.10.1', 'Technical', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (55, 'A.10.1.2', 'Key management', 'A policy on the use, protection and lifetime of cryptographic keys shall be developed and implemented through their whole lifecycle.', 'Key management should address the generation, storage, archiving, retrieval, distribution, retirement and destruction of cryptographic keys.', 6, 'A.10.1', 'Technical', 'Advanced', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (56, 'A.11.1', 'Secure areas', 'Physical security perimeters shall be defined and used to protect areas that contain either sensitive or critical information and information processing facilities.', 'Physical security should be designed and applied for offices, rooms and facilities containing information processing systems.', 7, NULL, 'Physical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (57, 'A.11.1.1', 'Physical security perimeter', 'Physical security perimeters shall be defined and used to protect areas that contain either sensitive or critical information and information processing facilities.', 'Security perimeters should be clearly defined and the location of all access points should be controlled.', 7, 'A.11.1', 'Physical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (58, 'A.11.1.2', 'Physical entry controls', 'Secure areas shall be protected by appropriate entry controls to ensure that only authorized personnel are allowed access.', 'Entry to secure areas should be controlled and restricted to authorized personnel only.', 7, 'A.11.1', 'Physical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (59, 'A.11.1.3', 'Protection against environmental threats', 'Physical protection against natural disasters, malicious attack or accidents shall be designed and applied.', 'Protection should be designed and applied against fire, flood, earthquake, explosion, civil unrest and other forms of natural or man-made disaster.', 7, 'A.11.1', 'Physical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (60, 'A.11.1.4', 'Working in secure areas', 'Procedures for working in secure areas shall be designed and implemented.', 'Additional controls and guidelines for working in secure areas should be implemented to enhance the security provided by the physical security perimeter and physical entry controls.', 7, 'A.11.1', 'Physical', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (61, 'A.11.1.5', 'Delivery and loading areas', 'Access points such as delivery and loading areas and other points where unauthorized persons could enter the premises shall be controlled and, if possible, isolated from information processing facilities to avoid unauthorized access.', 'Delivery and loading areas should be controlled and isolated from information processing facilities.', 7, 'A.11.1', 'Physical', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (63, 'A.11.2.1', 'Equipment siting and protection', 'Equipment shall be sited and protected to reduce the risks from environmental threats and hazards, and opportunities for unauthorized access.', 'Equipment should be positioned to minimize unnecessary access to work areas and protected from environmental hazards.', 7, 'A.11.2', 'Physical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (64, 'A.11.2.2', 'Supporting utilities', 'Equipment shall be protected from power failures and other disruptions caused by failures in supporting utilities.', 'Equipment should be protected from power failures through the use of multiple power feeds, uninterruptible power supplies, backup generators, etc.', 7, 'A.11.2', 'Physical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (65, 'A.11.2.3', 'Cabling security', 'Power and telecommunications cabling carrying data or supporting information services shall be protected from interception, interference or damage.', 'Cables should be protected from unauthorized access, damage and interference.', 7, 'A.11.2', 'Physical', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (66, 'A.11.2.4', 'Equipment maintenance', 'Equipment shall be correctly maintained to ensure its continued availability and integrity.', 'Equipment should be maintained according to supplier''s recommended service intervals and specifications.', 7, 'A.11.2', 'Physical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (67, 'A.11.2.5', 'Removal of assets', 'Equipment, information or software shall not be taken off-site without prior authorization.', 'Procedures should be implemented for the secure removal of equipment, information or software from the site.', 7, 'A.11.2', 'Physical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (68, 'A.11.2.6', 'Security of equipment and assets off-premises', 'Security shall be applied to off-site assets taking into account the different risks of working outside the organization''s premises.', 'Off-site equipment should be subject to the same security controls as on-site equipment, taking into account the different risks.', 7, 'A.11.2', 'Physical', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (69, 'A.11.2.7', 'Secure disposal or reuse of equipment', 'All items of equipment containing storage media shall be verified to ensure that any sensitive data and licensed software has been removed or securely overwritten prior to disposal or reuse.', 'Storage devices should be checked to ensure that any sensitive data and licensed software has been removed or securely overwritten.', 7, 'A.11.2', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (70, 'A.11.2.8', 'Unattended user equipment', 'Users shall ensure that unattended equipment has appropriate protection.', 'Users should be made aware of the security risks of leaving equipment unattended and should apply appropriate protection.', 7, 'A.11.2', 'Physical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (71, 'A.11.2.9', 'Clear desk and clear screen policy', 'A clear desk policy for papers and removable storage media and a clear screen policy for information processing facilities shall be adopted.', 'Desks should be clear of papers and removable storage media, and screens should be cleared or locked when unattended.', 7, 'A.11.2', 'Physical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (72, 'A.12.1', 'Operational procedures and responsibilities', 'Operating procedures shall be documented and made available to all users who need them.', 'Operating procedures should be documented to ensure the correct and secure operation of information processing facilities.', 8, NULL, 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (73, 'A.12.1.1', 'Documented operating procedures', 'Operating procedures shall be documented and made available to all users who need them.', 'Operating procedures should include instructions for system startup and shutdown, backup procedures, equipment handling, etc.', 8, 'A.12.1', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (74, 'A.12.1.2', 'Change management', 'Changes to the organization, business processes, information processing facilities and systems that affect information security shall be controlled.', 'Changes should be controlled through formal change management procedures.', 8, 'A.12.1', 'Organizational', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (75, 'A.12.1.3', 'Capacity management', 'The use of resources shall be monitored, tuned and projections made of future capacity requirements to ensure the required system performance.', 'Capacity management should ensure that adequate processing power and storage are available.', 8, 'A.12.1', 'Technical', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (76, 'A.12.1.4', 'Separation of development, testing and operational environments', 'Development, testing, and operational environments shall be separated to reduce the risks of unauthorized access or changes to the operational environment.', 'Separation should be maintained to prevent unauthorized access and changes to operational systems.', 8, 'A.12.1', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (77, 'A.12.2', 'Protection from malware', 'Detection, prevention and recovery controls to protect against malware shall be implemented, combined with appropriate user awareness.', 'Protection against malware should be based on malware detection and repair software, security awareness and appropriate system access and change management controls.', 8, NULL, 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (78, 'A.12.2.1', 'Controls against malware', 'Detection, prevention and recovery controls to protect against malware shall be implemented, combined with appropriate user awareness.', 'Anti-malware controls should be implemented and supported by appropriate user awareness.', 8, 'A.12.2', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (79, 'A.12.3', 'Backup', 'Backup copies of information, software and system images shall be taken and tested regularly in accordance with an agreed backup policy.', 'Adequate backup facilities should be provided to ensure that all essential business information and software can be recovered following a disaster or media failure.', 8, NULL, 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (80, 'A.12.3.1', 'Information backup', 'Backup copies of information, software and system images shall be taken and tested regularly in accordance with an agreed backup policy.', 'Backup procedures should be established and backup copies should be tested regularly to ensure they can be relied upon for use in an emergency.', 8, 'A.12.3', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (81, 'A.12.4', 'Logging and monitoring', 'Logging facilities and log information shall be produced, stored, protected and analysed.', 'Event logs should be produced to assist in future investigations and access control monitoring.', 8, NULL, 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (82, 'A.12.4.1', 'Event logging', 'Event logs recording user activities, exceptions, faults and information security events shall be produced, kept and regularly reviewed.', 'Event logs should include user IDs, dates and times of key events, device identity or location, and records of successful and rejected system access attempts.', 8, 'A.12.4', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (83, 'A.12.4.2', 'Protection of log information', 'Logging facilities and log information shall be protected against tampering and unauthorized access.', 'Log information should be protected against unauthorized changes and operational problems.', 8, 'A.12.4', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (84, 'A.12.4.3', 'Administrator and operator logs', 'System administrator and system operator activities shall be logged and the logs protected and regularly reviewed.', 'System administrator and operator activities should be logged to provide an audit trail of all system administration activities.', 8, 'A.12.4', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (85, 'A.12.4.4', 'Clock synchronisation', 'The clocks of all relevant information processing systems within an organization or security domain shall be synchronised to a single reference time source.', 'Accurate time stamps are important for forensic analysis and should be synchronized across all systems.', 8, 'A.12.4', 'Technical', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (86, 'A.12.5', 'Control of operational software', 'Procedures shall be implemented to control the installation of software on operational systems.', 'Software installation should be controlled to prevent the introduction of unauthorized software that could compromise system security.', 8, NULL, 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (87, 'A.12.5.1', 'Installation of software on operational systems', 'Procedures shall be implemented to control the installation of software on operational systems.', 'Only authorized software should be installed on operational systems, and installation should follow established procedures.', 8, 'A.12.5', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (88, 'A.12.6', 'Technical vulnerability management', 'Information about technical vulnerabilities of information systems being used shall be obtained in a timely fashion, the organization''s exposure to such vulnerabilities evaluated and appropriate measures taken to address the associated risk.', 'Technical vulnerabilities should be identified and managed through a systematic approach.', 8, NULL, 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (89, 'A.12.6.1', 'Management of technical vulnerabilities', 'Information about technical vulnerabilities of information systems being used shall be obtained in a timely fashion, the organization''s exposure to such vulnerabilities evaluated and appropriate measures taken to address the associated risk.', 'Organizations should establish a process for identifying, evaluating and managing technical vulnerabilities.', 8, 'A.12.6', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (90, 'A.12.6.2', 'Restrictions on software installation', 'Rules governing the installation of software by users shall be established and implemented.', 'Users should not be permitted to install software without appropriate authorization and procedures.', 8, 'A.12.6', 'Technical', 'Standard', true, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (91, 'A.12.7', 'Information systems audit considerations', 'Audit requirements and activities involving verification of operational systems shall be carefully planned and agreed to minimise disruptions to business processes.', 'Audit activities should be planned and controlled to minimize the risk of disruption to business operations.', 8, NULL, 'Organizational', 'Standard', false, true, '2025-06-23 16:49:30.377801');
-- INSERT INTO public.iso27002_controls VALUES (92, 'A.12.7.1', 'Information systems audit controls', 'Audit requirements and activities involving verification of operational systems shall be carefully planned and agreed to minimise disruptions to business processes.', 'Audit controls should be carefully planned and implemented to minimize business disruption.', 8, 'A.12.7', 'Organizational', 'Standard', false, true, '2025-06-23 16:49:30.377801');


-- --
-- -- TOC entry 6889 (class 0 OID 925715)
-- -- Dependencies: 606
-- -- Data for Name: login_attempts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6607 (class 0 OID 90143)
-- -- Dependencies: 261
-- -- Data for Name: mitigation_actions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6808 (class 0 OID 565321)
-- -- Dependencies: 464
-- -- Data for Name: nesa_uae_assessment_results; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nesa_uae_assessment_results VALUES (1, 1, 1, 'Implemented', 'Intermediate', 'Cybersecurity strategy document approved by board in January 2024', 'Strategy needs annual review cycle', 'Establish annual strategy review process', '2024-12-31', 'CISO', '2025-07-16 13:12:35.399081', '2025-07-16 13:12:35.399081');
-- INSERT INTO public.nesa_uae_assessment_results VALUES (2, 1, 2, 'Implemented', 'Basic', 'Comprehensive cybersecurity policy framework in place', 'Policies need regular updates', 'Implement quarterly policy review cycle', '2024-09-30', 'Security Team', '2025-07-16 13:12:35.399081', '2025-07-16 13:12:35.399081');
-- INSERT INTO public.nesa_uae_assessment_results VALUES (3, 1, 3, 'Partially Implemented', 'Basic', 'Risk assessment conducted annually', 'No continuous risk monitoring', 'Implement continuous risk monitoring tools', '2024-11-30', 'Risk Manager', '2025-07-16 13:12:35.399081', '2025-07-16 13:12:35.399081');
-- INSERT INTO public.nesa_uae_assessment_results VALUES (4, 1, 4, 'Implemented', 'Intermediate', 'Roles and responsibilities documented in security charter', 'Some roles need clarification', 'Update role definitions and responsibilities', '2024-10-15', 'HR Manager', '2025-07-16 13:12:35.399081', '2025-07-16 13:12:35.399081');
-- INSERT INTO public.nesa_uae_assessment_results VALUES (5, 1, 5, 'Partially Implemented', 'Basic', 'Quarterly board reports on cybersecurity', 'Board needs more detailed technical briefings', 'Enhance board reporting with technical metrics', '2024-08-31', 'CISO', '2025-07-16 13:12:35.399081', '2025-07-16 13:12:35.399081');


-- --
-- -- TOC entry 6804 (class 0 OID 565269)
-- -- Dependencies: 460
-- -- Data for Name: nesa_uae_assessments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nesa_uae_assessments VALUES (1, 'Annual NESA UAE Cybersecurity Assessment 2024', 1, 'Annual', 'Comprehensive assessment of all critical infrastructure systems including network infrastructure, data centers, and operational technology systems', 'Banking and Finance', 'Third-Party Assessment', '2025-07-16', 'Ahmed Al-Mansouri', 'UAE Cybersecurity Consulting LLC', 'In Progress', 'Intermediate', 78, 'Medium', 'Assessment identified 12 findings across multiple domains. Most critical findings relate to incident response capabilities and business continuity planning. Physical security controls are well implemented.', 'Prioritize implementation of comprehensive incident response procedures. Enhance business continuity testing frequency. Implement additional network segmentation controls.', '2025-02-01', 'Under Review', '2025-07-16 13:12:35.163873', '2025-07-16 13:12:35.163873');


-- --
-- -- TOC entry 6824 (class 0 OID 589861)
-- -- Dependencies: 480
-- -- Data for Name: nesa_uae_gap_analysis; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6847 (class 0 OID 753668)
-- -- Dependencies: 503
-- -- Data for Name: nesa_uae_remediation_actions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nesa_uae_remediation_actions VALUES (1, 1, NULL, 'NESA-2025-005', 'Weak Password Policy', 'Weak Password Policy', 'Medium', 'Technical', 'Weak Password Policy', 'Medium', 'Open', 'Short-term', 'Security Team', 'IT', 'James', '2025-07-25', NULL, 1, NULL, 1.00, NULL, false, 0, '2025-07-18', NULL, 'Weak Password Policy', NULL, NULL, 'Medium', 'Low', 'Weak Password Policy', false, NULL, NULL, NULL, '', NULL, NULL, NULL, NULL, 'Current User', '2025-07-18 12:30:45.818997', NULL, '2025-07-18 12:30:45.818997');


-- --
-- -- TOC entry 6812 (class 0 OID 565399)
-- -- Dependencies: 468
-- -- Data for Name: nesa_uae_remediation_dependencies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nesa_uae_remediation_dependencies VALUES (1, 2, 4, 'Requires', 'Continuous risk monitoring requires complete asset inventory to effectively monitor all critical infrastructure components', '2025-07-16 13:13:49.80902');
-- INSERT INTO public.nesa_uae_remediation_dependencies VALUES (2, 1, 3, 'Related', 'Board reporting enhancements should align with updated cybersecurity strategy objectives and metrics', '2025-07-16 13:13:49.80902');


-- --
-- -- TOC entry 6810 (class 0 OID 565384)
-- -- Dependencies: 466
-- -- Data for Name: nesa_uae_remediation_updates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nesa_uae_remediation_updates VALUES (1, 1, 'Progress Update', 'Strategy document draft completed and sent for initial review. Incorporated NESA control requirements and aligned with business objectives.', 'Open', 'In Progress', 0, 25, 'Ahmed Al-Rashid', '2025-07-16 13:13:49.517689', NULL);
-- INSERT INTO public.nesa_uae_remediation_updates VALUES (2, 4, 'Progress Update', 'Asset discovery phase completed for data center infrastructure. Identified 847 assets including servers, network devices, and security appliances. Moving to classification phase.', 'Open', 'In Progress', 30, 60, 'Khalid Al-Mansouri', '2025-07-16 13:13:49.517689', NULL);
-- INSERT INTO public.nesa_uae_remediation_updates VALUES (3, 4, 'Status Change', 'Asset management tool procurement approved. Beginning implementation phase with vendor support.', 'In Progress', 'In Progress', 60, 60, 'Michael Chen', '2025-07-16 13:13:49.517689', NULL);
-- INSERT INTO public.nesa_uae_remediation_updates VALUES (4, 20, 'Status Change', 'Remediation action created', NULL, 'Open', NULL, 0, 'Current User', '2025-07-18 12:11:21.607591', NULL);
-- INSERT INTO public.nesa_uae_remediation_updates VALUES (5, 1, 'Status Change', 'Remediation action created', NULL, 'Open', NULL, 0, 'Current User', '2025-07-18 12:30:46.142644', NULL);


-- --
-- -- TOC entry 6806 (class 0 OID 565307)
-- -- Dependencies: 462
-- -- Data for Name: nesa_uae_requirements; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nesa_uae_requirements VALUES (1, 'Cybersecurity Governance', 'CG-01', 'Cybersecurity Strategy', 'Establish and maintain a comprehensive cybersecurity strategy aligned with business objectives', 'Mandatory', 'Basic', 'Not Implemented', 'Develop a documented cybersecurity strategy that addresses risk management, governance structure, and strategic objectives', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (2, 'Cybersecurity Governance', 'CG-02', 'Cybersecurity Policy', 'Implement cybersecurity policies and procedures', 'Mandatory', 'Basic', 'Not Implemented', 'Create comprehensive cybersecurity policies covering all aspects of information security', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (3, 'Cybersecurity Governance', 'CG-03', 'Risk Management Framework', 'Establish risk management processes and procedures', 'Mandatory', 'Intermediate', 'Not Implemented', 'Implement a formal risk management framework with regular risk assessments', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (4, 'Cybersecurity Governance', 'CG-04', 'Roles and Responsibilities', 'Define cybersecurity roles and responsibilities', 'Mandatory', 'Basic', 'Not Implemented', 'Clearly define roles and responsibilities for cybersecurity across the organization', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (5, 'Cybersecurity Governance', 'CG-05', 'Board Oversight', 'Ensure board-level oversight of cybersecurity', 'Mandatory', 'Advanced', 'Not Implemented', 'Establish board-level cybersecurity oversight and reporting mechanisms', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (6, 'Asset Management', 'AM-01', 'Asset Inventory', 'Maintain comprehensive inventory of all assets', 'Mandatory', 'Basic', 'Not Implemented', 'Create and maintain an accurate inventory of all IT and OT assets', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (7, 'Asset Management', 'AM-02', 'Asset Classification', 'Classify assets based on criticality and sensitivity', 'Mandatory', 'Intermediate', 'Not Implemented', 'Implement asset classification scheme based on business impact and data sensitivity', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (8, 'Asset Management', 'AM-03', 'Asset Ownership', 'Assign ownership and responsibility for assets', 'Mandatory', 'Basic', 'Not Implemented', 'Assign clear ownership and accountability for all assets', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (9, 'Asset Management', 'AM-04', 'Asset Handling', 'Implement secure asset handling procedures', 'Mandatory', 'Intermediate', 'Not Implemented', 'Establish procedures for secure handling, storage, and disposal of assets', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (10, 'Asset Management', 'AM-05', 'Media Handling', 'Secure handling of removable media', 'Mandatory', 'Basic', 'Not Implemented', 'Implement controls for secure handling and disposal of removable media', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (11, 'Human Resources Security', 'HR-01', 'Security Screening', 'Conduct security screening for personnel', 'Mandatory', 'Basic', 'Not Implemented', 'Implement background checks and security clearance processes', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (12, 'Human Resources Security', 'HR-02', 'Security Training', 'Provide cybersecurity awareness training', 'Mandatory', 'Basic', 'Not Implemented', 'Conduct regular cybersecurity awareness training for all personnel', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (13, 'Human Resources Security', 'HR-03', 'Terms of Employment', 'Include security responsibilities in employment terms', 'Mandatory', 'Basic', 'Not Implemented', 'Include cybersecurity responsibilities in employment contracts', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (14, 'Human Resources Security', 'HR-04', 'Disciplinary Process', 'Establish disciplinary process for security violations', 'Mandatory', 'Intermediate', 'Not Implemented', 'Implement formal disciplinary procedures for security policy violations', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (15, 'Human Resources Security', 'HR-05', 'Termination Procedures', 'Secure termination and change of employment procedures', 'Mandatory', 'Basic', 'Not Implemented', 'Establish procedures for secure termination and role changes', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (16, 'Physical and Environmental Security', 'PE-01', 'Physical Security Perimeter', 'Establish physical security perimeters', 'Mandatory', 'Basic', 'Not Implemented', 'Implement physical barriers and access controls around facilities', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (17, 'Physical and Environmental Security', 'PE-02', 'Physical Entry Controls', 'Control physical access to facilities', 'Mandatory', 'Basic', 'Not Implemented', 'Implement access control systems for physical entry to facilities', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (18, 'Physical and Environmental Security', 'PE-03', 'Protection Against Environmental Threats', 'Protect against environmental threats', 'Mandatory', 'Intermediate', 'Not Implemented', 'Implement controls to protect against fire, flood, earthquake, and other environmental threats', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (19, 'Physical and Environmental Security', 'PE-04', 'Equipment Protection', 'Protect equipment from physical and environmental threats', 'Mandatory', 'Basic', 'Not Implemented', 'Implement physical protection measures for critical equipment', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (20, 'Physical and Environmental Security', 'PE-05', 'Secure Disposal', 'Secure disposal or reuse of equipment', 'Mandatory', 'Basic', 'Not Implemented', 'Implement secure procedures for equipment disposal and sanitization', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (21, 'Communications and Operations Management', 'CO-01', 'Operational Procedures', 'Document and implement operational procedures', 'Mandatory', 'Basic', 'Not Implemented', 'Establish documented operational procedures and responsibilities', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (22, 'Communications and Operations Management', 'CO-02', 'Change Management', 'Implement change management procedures', 'Mandatory', 'Intermediate', 'Not Implemented', 'Establish formal change management processes for systems and operations', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (23, 'Communications and Operations Management', 'CO-03', 'Capacity Management', 'Monitor and manage system capacity', 'Mandatory', 'Intermediate', 'Not Implemented', 'Implement capacity monitoring and management procedures', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (24, 'Communications and Operations Management', 'CO-04', 'System Acceptance', 'Establish system acceptance criteria', 'Mandatory', 'Advanced', 'Not Implemented', 'Define acceptance criteria and testing procedures for new systems', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (25, 'Communications and Operations Management', 'CO-05', 'Protection Against Malicious Code', 'Implement malware protection', 'Mandatory', 'Basic', 'Not Implemented', 'Deploy and maintain anti-malware solutions across all systems', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (26, 'Access Control', 'AC-01', 'Access Control Policy', 'Establish access control policy and procedures', 'Mandatory', 'Basic', 'Not Implemented', 'Develop comprehensive access control policies and procedures', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (27, 'Access Control', 'AC-02', 'User Access Management', 'Manage user access rights', 'Mandatory', 'Basic', 'Not Implemented', 'Implement user access management processes including provisioning and deprovisioning', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (28, 'Access Control', 'AC-03', 'User Responsibilities', 'Define user responsibilities for access control', 'Mandatory', 'Basic', 'Not Implemented', 'Establish user responsibilities and acceptable use policies', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (29, 'Access Control', 'AC-04', 'Network Access Control', 'Control network access', 'Mandatory', 'Intermediate', 'Not Implemented', 'Implement network access controls and segmentation', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (30, 'Access Control', 'AC-05', 'Operating System Access Control', 'Control access to operating systems', 'Mandatory', 'Intermediate', 'Not Implemented', 'Implement operating system access controls and authentication', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (31, 'Systems Development and Maintenance', 'SD-01', 'Security Requirements', 'Include security requirements in systems development', 'Mandatory', 'Intermediate', 'Not Implemented', 'Integrate security requirements into system development lifecycle', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (32, 'Systems Development and Maintenance', 'SD-02', 'Security in Development Process', 'Implement security in development processes', 'Mandatory', 'Advanced', 'Not Implemented', 'Embed security practices throughout the development process', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (33, 'Systems Development and Maintenance', 'SD-03', 'Technical Vulnerability Management', 'Manage technical vulnerabilities', 'Mandatory', 'Intermediate', 'Not Implemented', 'Implement vulnerability management processes and procedures', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (34, 'Systems Development and Maintenance', 'SD-04', 'Restrictions on Software Installation', 'Control software installation', 'Mandatory', 'Basic', 'Not Implemented', 'Implement controls to restrict unauthorized software installation', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (35, 'Systems Development and Maintenance', 'SD-05', 'System Security Testing', 'Conduct security testing of systems', 'Mandatory', 'Advanced', 'Not Implemented', 'Perform regular security testing and penetration testing', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (36, 'Incident Management', 'IM-01', 'Incident Response Planning', 'Establish incident response procedures', 'Mandatory', 'Basic', 'Not Implemented', 'Develop and maintain incident response plans and procedures', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (37, 'Incident Management', 'IM-02', 'Reporting Security Events', 'Report security events and weaknesses', 'Mandatory', 'Basic', 'Not Implemented', 'Establish procedures for reporting security incidents and events', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (38, 'Incident Management', 'IM-03', 'Incident Response Team', 'Establish incident response team', 'Mandatory', 'Intermediate', 'Not Implemented', 'Form and train incident response team with defined roles and responsibilities', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (39, 'Incident Management', 'IM-04', 'Evidence Collection', 'Collect and preserve evidence', 'Mandatory', 'Advanced', 'Not Implemented', 'Implement procedures for evidence collection and forensic analysis', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (40, 'Incident Management', 'IM-05', 'Learning from Incidents', 'Learn from security incidents', 'Mandatory', 'Intermediate', 'Not Implemented', 'Establish processes to learn from incidents and improve security posture', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (41, 'Business Continuity Management', 'BC-01', 'Business Continuity Planning', 'Develop business continuity plans', 'Mandatory', 'Intermediate', 'Not Implemented', 'Develop comprehensive business continuity and disaster recovery plans', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (42, 'Business Continuity Management', 'BC-02', 'Business Impact Analysis', 'Conduct business impact analysis', 'Mandatory', 'Intermediate', 'Not Implemented', 'Perform regular business impact analysis to identify critical processes', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (43, 'Business Continuity Management', 'BC-03', 'Recovery Planning', 'Develop recovery procedures', 'Mandatory', 'Advanced', 'Not Implemented', 'Establish detailed recovery procedures and alternative processing facilities', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (44, 'Business Continuity Management', 'BC-04', 'Business Continuity Testing', 'Test business continuity plans', 'Mandatory', 'Advanced', 'Not Implemented', 'Regularly test and update business continuity plans', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (45, 'Business Continuity Management', 'BC-05', 'Backup and Recovery', 'Implement backup and recovery procedures', 'Mandatory', 'Basic', 'Not Implemented', 'Establish regular backup procedures and test recovery capabilities', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (46, 'Compliance', 'CM-01', 'Legal and Regulatory Requirements', 'Comply with legal and regulatory requirements', 'Mandatory', 'Basic', 'Not Implemented', 'Identify and comply with applicable legal and regulatory requirements', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (47, 'Compliance', 'CM-02', 'Data Protection and Privacy', 'Protect personal and sensitive data', 'Mandatory', 'Intermediate', 'Not Implemented', 'Implement data protection and privacy controls', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (48, 'Compliance', 'CM-03', 'Cryptographic Controls', 'Implement cryptographic controls', 'Mandatory', 'Advanced', 'Not Implemented', 'Use appropriate cryptographic controls to protect sensitive information', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (49, 'Compliance', 'CM-04', 'System Audit Controls', 'Implement audit controls and monitoring', 'Mandatory', 'Intermediate', 'Not Implemented', 'Establish audit trails and monitoring capabilities', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');
-- INSERT INTO public.nesa_uae_requirements VALUES (50, 'Compliance', 'CM-05', 'Information Systems Audit', 'Conduct regular system audits', 'Mandatory', 'Advanced', 'Not Implemented', 'Perform regular audits of information systems and security controls', '2025-07-16 13:12:06.549472', '2025-07-16 13:12:06.549472');


-- --
-- -- TOC entry 6818 (class 0 OID 581662)
-- -- Dependencies: 474
-- -- Data for Name: nesa_uae_self_assessment_audit_log; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nesa_uae_self_assessment_audit_log VALUES (1, 1, 'ALL', 'INITIALIZE', 'controls_initialized', '', '45 controls initialized', 'Ahmed Al-Mansouri', 'Initial control assessment setup for banking sector assessment', '2025-07-16 17:15:32.484284');
-- INSERT INTO public.nesa_uae_self_assessment_audit_log VALUES (2, 1, 'CG-01', 'UPDATE', 'current_maturity_level', 'Intermediate', 'Advanced', 'Ahmed Al-Mansouri', 'Updated based on recent governance framework enhancements', '2025-07-16 17:15:32.484284');
-- INSERT INTO public.nesa_uae_self_assessment_audit_log VALUES (3, 1, 'AM-01', 'UPDATE', 'implementation_status', 'Not Implemented', 'Partially Implemented', 'Sarah Al-Mahmoud', 'Asset inventory system partially deployed', '2025-07-16 17:15:32.484284');
-- INSERT INTO public.nesa_uae_self_assessment_audit_log VALUES (4, 1, 'AM-01', 'UPDATE', 'action_owner', 'Unassigned', 'Sarah Al-Mahmoud', 'Ahmed Al-Mansouri', 'Assigned asset management lead as action owner', '2025-07-16 17:15:32.484284');
-- INSERT INTO public.nesa_uae_self_assessment_audit_log VALUES (5, 1, 'HR-01', 'UPDATE', 'priority', 'Medium', 'High', 'Ahmed Al-Mansouri', 'Elevated priority due to recent insider threat incidents in sector', '2025-07-16 17:15:32.484284');
-- INSERT INTO public.nesa_uae_self_assessment_audit_log VALUES (6, 1, 'CO-01', 'UPDATE', 'estimated_cost', '100000', '150000', 'Amira Al-Zahra', 'Updated cost estimate based on detailed technical requirements', '2025-07-16 17:15:32.484284');
-- INSERT INTO public.nesa_uae_self_assessment_audit_log VALUES (7, 2, 'ALL', 'INITIALIZE', 'controls_initialized', '', '50 controls initialized', 'Fatima Al-Zahra', 'Initial control assessment setup for telecommunications assessment', '2025-07-16 17:15:32.484284');
-- INSERT INTO public.nesa_uae_self_assessment_audit_log VALUES (8, 3, 'ALL', 'INITIALIZE', 'controls_initialized', '', '42 controls initialized', 'Mohammed Al-Rashid', 'Initial control assessment setup for energy sector assessment', '2025-07-16 17:15:32.484284');
-- INSERT INTO public.nesa_uae_self_assessment_audit_log VALUES (9, 3, 'ALL', 'COMPLETE', 'assessment_status', 'In Progress', 'Completed', 'Mohammed Al-Rashid', 'Assessment completed with all controls evaluated', '2025-07-16 17:15:32.484284');


-- --
-- -- TOC entry 6820 (class 0 OID 581680)
-- -- Dependencies: 476
-- -- Data for Name: nesa_uae_self_assessment_controls; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nesa_uae_self_assessment_controls VALUES (1, 1, 1, 'CG-01', 'Cybersecurity Governance Framework', 'Cybersecurity Governance', 'Advanced', 'Advanced', 'Implemented', 'Comprehensive cybersecurity governance framework with board oversight, CISO reporting structure, and regular risk assessments. Policies and procedures are documented and regularly updated.', 'Maintain current advanced governance framework with continuous improvement and regular reviews.', 'Ahmed Al-Mansouri', 'ahmed.almansouri@bank.ae', '2024-12-31', 'Cybersecurity policy documents, board meeting minutes, CISO reports, risk assessment reports, governance framework documentation.', 'Minor gaps in third-party risk management integration and emerging technology governance.', 'Enhance third-party risk management integration and develop governance for emerging technologies like AI and cloud services.', 'Strong governance is critical for regulatory compliance and risk management in banking sector.', 25000.00, 120, 'Medium', 95, '2024-01-15 00:00:00', NULL, 'Ahmed Al-Mansouri', 'Excellent governance framework in place with minor enhancements needed.', 'Pending', NULL, NULL, 'Ahmed Al-Mansouri', 'System', '2025-07-16 17:15:32.239214', '2025-07-16 17:15:32.239214');
-- INSERT INTO public.nesa_uae_self_assessment_controls VALUES (2, 1, 5, 'AM-01', 'Asset Inventory and Classification', 'Asset Management', 'Intermediate', 'Advanced', 'Partially Implemented', 'Asset inventory system in place for IT assets with basic classification. Manual processes for some asset types and limited integration with security tools.', 'Implement comprehensive automated asset discovery and classification system with integration to security tools and real-time monitoring.', 'Sarah Al-Mahmoud', 'sarah.almahmoud@bank.ae', '2024-06-30', 'Asset inventory reports, classification procedures, asset management system screenshots.', 'Incomplete asset discovery for cloud and mobile assets, limited automated classification, weak integration with security tools.', 'Deploy automated asset discovery tools, implement comprehensive classification schema, integrate with SIEM and vulnerability management systems.', 'Complete asset visibility is essential for effective security monitoring and compliance in banking environment.', 75000.00, 320, 'High', 65, '2024-01-20 00:00:00', NULL, 'Sarah Al-Mahmoud', 'Good foundation but needs significant enhancement for comprehensive coverage.', 'Pending', NULL, NULL, 'Ahmed Al-Mansouri', 'System', '2025-07-16 17:15:32.239214', '2025-07-16 17:15:32.239214');
-- INSERT INTO public.nesa_uae_self_assessment_controls VALUES (3, 1, 10, 'HR-01', 'Personnel Security Screening', 'Human Resources Security', 'Basic', 'Intermediate', 'Partially Implemented', 'Basic background checks for employees with limited ongoing monitoring. Security awareness training provided annually.', 'Implement comprehensive personnel security program with enhanced screening, continuous monitoring, and regular security awareness training.', 'Khalid Al-Nasser', 'khalid.alnasser@bank.ae', '2024-08-31', 'HR screening procedures, training records, background check reports.', 'Limited depth of background checks, no continuous monitoring, infrequent security awareness training, weak insider threat detection.', 'Enhance background screening procedures, implement continuous monitoring program, increase security awareness training frequency, deploy insider threat detection tools.', 'Personnel security is critical in banking sector due to access to sensitive financial data and systems.', 45000.00, 200, 'High', 40, '2024-01-25 00:00:00', NULL, 'Khalid Al-Nasser', 'Significant improvements needed in personnel security program.', 'Pending', NULL, NULL, 'Ahmed Al-Mansouri', 'System', '2025-07-16 17:15:32.239214', '2025-07-16 17:15:32.239214');
-- INSERT INTO public.nesa_uae_self_assessment_controls VALUES (4, 1, 15, 'PE-01', 'Physical Security Controls', 'Physical and Environmental Security', 'Intermediate', 'Advanced', 'Implemented', 'Physical security controls include access cards, CCTV monitoring, security guards, and environmental monitoring for data centers.', 'Enhance physical security with biometric access controls, advanced surveillance analytics, and improved environmental monitoring.', 'Omar Al-Hashimi', 'omar.alhashimi@bank.ae', '2024-09-30', 'Physical security assessment reports, CCTV footage samples, access control logs, environmental monitoring reports.', 'Limited biometric controls, basic surveillance analytics, some gaps in environmental monitoring coverage.', 'Implement biometric access controls for critical areas, deploy advanced video analytics, enhance environmental monitoring coverage.', 'Physical security is fundamental for protecting critical banking infrastructure and meeting regulatory requirements.', 60000.00, 180, 'Medium', 75, '2024-02-01 00:00:00', NULL, 'Omar Al-Hashimi', 'Good physical security foundation with opportunities for enhancement.', 'Pending', NULL, NULL, 'Ahmed Al-Mansouri', 'System', '2025-07-16 17:15:32.239214', '2025-07-16 17:15:32.239214');
-- INSERT INTO public.nesa_uae_self_assessment_controls VALUES (5, 1, 20, 'CO-01', 'Network Security Management', 'Communications and Operations Management', 'Basic', 'Advanced', 'Not Implemented', 'Basic firewall configuration with limited network segmentation. Minimal network monitoring and intrusion detection capabilities.', 'Implement comprehensive network security architecture with advanced firewalls, network segmentation, IDS/IPS, and continuous monitoring.', 'Amira Al-Zahra', 'amira.alzahra@bank.ae', '2024-07-31', 'Network diagrams, firewall configurations, basic monitoring reports.', 'Inadequate network segmentation, limited intrusion detection, weak network monitoring, insufficient encryption in transit.', 'Deploy next-generation firewalls, implement micro-segmentation, establish comprehensive network monitoring, implement end-to-end encryption.', 'Network security is critical for protecting banking transactions and customer data from cyber threats.', 150000.00, 480, 'High', 25, '2024-02-05 00:00:00', NULL, 'Amira Al-Zahra', 'Significant network security improvements required to meet NESA standards.', 'Pending', NULL, NULL, 'Ahmed Al-Mansouri', 'System', '2025-07-16 17:15:32.239214', '2025-07-16 17:15:32.239214');


-- --
-- -- TOC entry 6816 (class 0 OID 581633)
-- -- Dependencies: 472
-- -- Data for Name: nesa_uae_self_assessments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nesa_uae_self_assessments VALUES (1, 'Banking Sector NESA UAE Compliance Assessment 2024', 1, 'Comprehensive assessment of cybersecurity controls for critical banking infrastructure including core banking systems, payment processing, and customer data management systems.', '2024-01-01', '2024-03-31', 'Ahmed Al-Mansouri', 'Chief Information Security Officer', 'ahmed.almansouri@bank.ae', 'In Progress', 2.80, 60.00, 5, 2, 2, 1, 0, 3, 0, 0, 'The organization demonstrates a moderate level of cybersecurity maturity with strong governance frameworks but gaps in technical implementation and incident response capabilities.', 'Key findings include: 1) Strong cybersecurity governance and policy framework, 2) Adequate access control mechanisms, 3) Gaps in incident response procedures, 4) Limited security awareness training, 5) Insufficient backup and recovery testing.', 'Priority recommendations: 1) Enhance incident response capabilities, 2) Implement comprehensive security awareness program, 3) Strengthen backup and recovery procedures, 4) Improve vulnerability management processes, 5) Establish continuous monitoring capabilities.', '2024-12-31', 'Ahmed Al-Mansouri', 'System', '2025-07-16 17:14:53.118844', '2025-07-16 17:14:53.118844');
-- INSERT INTO public.nesa_uae_self_assessments VALUES (2, 'Telecommunications Infrastructure NESA Assessment', 1, 'Assessment covering telecommunications network infrastructure, data centers, and customer service systems for NESA UAE compliance.', '2024-02-01', '2024-04-30', 'Fatima Al-Zahra', 'Security Compliance Manager', 'fatima.alzahra@telecom.ae', 'Draft', 0.00, 0.00, 0, 0, 0, 0, 0, 0, 0, 0, 'Initial assessment reveals significant gaps in cybersecurity implementation across telecommunications infrastructure with particular weaknesses in network security and data protection.', 'Critical findings: 1) Inadequate network segmentation, 2) Weak encryption implementation, 3) Limited security monitoring, 4) Insufficient access controls for privileged users, 5) Lack of comprehensive incident response plan.', 'Immediate actions required: 1) Implement network segmentation, 2) Deploy comprehensive encryption, 3) Establish 24/7 security operations center, 4) Strengthen privileged access management, 5) Develop and test incident response procedures.', '2025-01-31', 'Fatima Al-Zahra', 'System', '2025-07-16 17:14:53.118844', '2025-07-16 17:14:53.118844');
-- INSERT INTO public.nesa_uae_self_assessments VALUES (3, 'Energy Sector Cybersecurity Self-Assessment', 1, 'NESA UAE compliance assessment for critical energy infrastructure including power generation, transmission, and distribution systems.', '2024-03-01', '2024-05-31', 'Mohammed Al-Rashid', 'Cybersecurity Director', 'mohammed.alrashid@energy.ae', 'Completed', 0.00, 0.00, 0, 0, 0, 0, 0, 0, 0, 0, 'The energy organization demonstrates advanced cybersecurity maturity with robust operational technology security and strong incident response capabilities.', 'Strengths identified: 1) Comprehensive OT/IT security integration, 2) Advanced threat detection capabilities, 3) Regular security assessments, 4) Strong vendor management, 5) Effective business continuity planning.', 'Enhancement opportunities: 1) Expand security awareness training, 2) Implement advanced threat hunting, 3) Strengthen supply chain security, 4) Enhance cloud security controls, 5) Improve security metrics and reporting.', '2025-02-28', 'Mohammed Al-Rashid', 'System', '2025-07-16 17:14:53.118844', '2025-07-16 17:14:53.118844');


-- --
-- -- TOC entry 6822 (class 0 OID 589855)
-- -- Dependencies: 478
-- -- Data for Name: nesa_uae_sub_controls; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6665 (class 0 OID 163855)
-- -- Dependencies: 319
-- -- Data for Name: nist_csf_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nist_csf_categories VALUES (1, 'GV.OC', 'Organizational Context', 'The circumstances that frame the organization''s risk decisions are understood.', 1, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (2, 'GV.RM', 'Risk Management Strategy', 'The organization''s priorities, constraints, risk tolerances, and assumptions are established and used to support operational risk decisions.', 1, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (3, 'GV.RR', 'Roles, Responsibilities, and Authorities', 'Cybersecurity roles, responsibilities, and authorities to foster accountability, performance assessment, and continuous improvement are established and communicated.', 1, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (4, 'GV.PO', 'Policy', 'Organizational cybersecurity policy is established and communicated.', 1, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (5, 'GV.OV', 'Oversight', 'Results of organization cybersecurity risk management activities are used to inform, improve, and adjust the risk management strategy.', 1, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (6, 'GV.SC', 'Supply Chain Risk Management', 'Supply chain risk management processes are identified, established, assessed, managed, and agreed upon by organizational stakeholders.', 1, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (7, 'ID.AM', 'Asset Management', 'Assets (e.g., data, hardware, software, systems, facilities, services, people) that enable the organization to achieve business purposes are identified and managed consistent with their relative importance to organizational objectives and the organization''s risk strategy.', 2, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (8, 'ID.BE', 'Business Environment', 'The organization''s mission, objectives, stakeholders, and activities are understood and prioritized; this information is used to inform cybersecurity roles, responsibilities, and risk management decisions.', 2, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (9, 'ID.GV', 'Governance', 'The policies, procedures, and processes to manage and monitor the organization''s regulatory, legal, risk, environmental, and operational requirements are understood and inform the management of cybersecurity risk.', 2, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (10, 'ID.RA', 'Risk Assessment', 'The organization understands the cybersecurity risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals.', 2, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (11, 'ID.RM', 'Risk Management Strategy', 'The organization''s priorities, constraints, risk tolerances, and assumptions are established and used to support operational risk decisions.', 2, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (12, 'ID.SC', 'Supply Chain Risk Management', 'The organization''s priorities, constraints, risk tolerances, and assumptions are established and used to support risk decisions associated with managing supply chain risk.', 2, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (13, 'PR.AC', 'Identity Management, Authentication and Access Control', 'Access to physical and logical assets and associated facilities is limited to authorized users, processes, and devices, and is managed consistent with the assessed risk of unauthorized access to authorized activities and transactions.', 3, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (14, 'PR.AT', 'Awareness and Training', 'The organization''s personnel and partners are provided cybersecurity awareness education and are trained to perform their cybersecurity-related duties and responsibilities consistent with related policies, procedures, and agreements.', 3, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (15, 'PR.DS', 'Data Security', 'Information and records (data) are managed consistent with the organization''s risk strategy to protect the confidentiality, integrity, and availability of information.', 3, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (16, 'PR.IP', 'Information Protection Processes and Procedures', 'Security policies (that address purpose, scope, roles, responsibilities, management commitment, and coordination among organizational entities), processes, and procedures are maintained and used to manage protection of information systems and assets.', 3, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (17, 'PR.MA', 'Maintenance', 'Maintenance and repairs of industrial control and information system components are performed consistent with policies and procedures.', 3, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (18, 'PR.PT', 'Protective Technology', 'Technical security solutions are managed to ensure the security and resilience of systems and assets, consistent with related policies, procedures, and agreements.', 3, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (19, 'DE.AE', 'Anomalies and Events', 'Anomalous activity is detected and the potential impact of events is understood.', 4, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (20, 'DE.CM', 'Security Continuous Monitoring', 'The information system and assets are monitored to identify cybersecurity events and verify the effectiveness of protective measures.', 4, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (21, 'DE.DP', 'Detection Processes', 'Detection processes and procedures are maintained and tested to ensure awareness of anomalous events.', 4, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (22, 'RS.RP', 'Response Planning', 'Response processes and procedures are executed and maintained, to ensure response to detected cybersecurity incidents.', 5, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (23, 'RS.CO', 'Communications', 'Response activities are coordinated with internal and external stakeholders (e.g. external support from law enforcement agencies).', 5, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (24, 'RS.AN', 'Analysis', 'Analysis is conducted to ensure effective response and support recovery activities.', 5, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (25, 'RS.MI', 'Mitigation', 'Activities are performed to prevent expansion of an event, mitigate its effects, and resolve the incident.', 5, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (26, 'RS.IM', 'Improvements', 'Response activities are improved by incorporating lessons learned from current and previous detection/response activities.', 5, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (27, 'RC.RP', 'Recovery Planning', 'Recovery processes and procedures are executed and maintained to ensure restoration of systems or assets affected by cybersecurity incidents.', 6, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (28, 'RC.IM', 'Improvements', 'Recovery planning and processes are improved by incorporating lessons learned into future activities.', 6, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_categories VALUES (29, 'RC.CO', 'Communications', 'Restoration activities are coordinated with internal and external parties (e.g. coordinating centers, Internet Service Providers, owners of attacking systems, victims, other CSIRTs, and vendors).', 6, true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');


-- --
-- -- TOC entry 6663 (class 0 OID 163841)
-- -- Dependencies: 317
-- -- Data for Name: nist_csf_functions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nist_csf_functions VALUES (1, 'GV', 'Govern', 'The organization''s cybersecurity risk management strategy, expectations, and policy are established, communicated, and monitored.', 'Establish and monitor the organization''s cybersecurity risk management strategy, expectations, and policy.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_functions VALUES (2, 'ID', 'Identify', 'The organization''s current cybersecurity risks are understood.', 'Develop an organizational understanding to manage cybersecurity risk to systems, people, assets, data, and capabilities.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_functions VALUES (3, 'PR', 'Protect', 'Safeguards for delivery of critical infrastructure services are implemented.', 'Develop and implement appropriate safeguards to ensure delivery of critical infrastructure services.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_functions VALUES (4, 'DE', 'Detect', 'Activities are implemented to identify the occurrence of a cybersecurity event.', 'Develop and implement appropriate activities to identify the occurrence of a cybersecurity event.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_functions VALUES (5, 'RS', 'Respond', 'Activities are implemented to take action regarding a detected cybersecurity incident.', 'Develop and implement appropriate activities to take action regarding a detected cybersecurity incident.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_functions VALUES (6, 'RC', 'Recover', 'Activities are implemented to restore any capabilities or services that were impaired due to a cybersecurity incident.', 'Develop and implement appropriate activities to maintain plans for resilience and to restore any capabilities or services that were impaired due to a cybersecurity incident.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973');


-- --
-- -- TOC entry 6673 (class 0 OID 163951)
-- -- Dependencies: 327
-- -- Data for Name: nist_csf_implementation_tiers; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nist_csf_implementation_tiers VALUES (1, 1, 'Partial', 'Organizational cybersecurity risk management practices are not formalized, and risk is managed in an ad hoc and sometimes reactive manner.', '["Ad hoc risk management", "Limited awareness", "Reactive approach", "Informal processes"]', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_implementation_tiers VALUES (2, 2, 'Risk Informed', 'Risk management practices are approved by management but may not be established as organizational-wide policy.', '["Management approved practices", "Risk-informed decisions", "Some formal processes", "Irregular implementation"]', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_implementation_tiers VALUES (3, 3, 'Repeatable', 'The organization''s risk management practices are formally approved and expressed as policy.', '["Formal policies", "Regular updates", "Consistent implementation", "Defined roles and responsibilities"]', '2025-06-23 21:36:54.768973');
-- INSERT INTO public.nist_csf_implementation_tiers VALUES (4, 4, 'Adaptive', 'The organization adapts its cybersecurity practices based on lessons learned and predictive indicators.', '["Continuous improvement", "Predictive capabilities", "Adaptive practices", "Advanced threat intelligence"]', '2025-06-23 21:36:54.768973');


-- --
-- -- TOC entry 6845 (class 0 OID 696321)
-- -- Dependencies: 501
-- -- Data for Name: nist_csf_mitigation_plans; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nist_csf_mitigation_plans VALUES (31, 'NIST-MIT-0001', 'NGFW Implementation', NULL, 'NGFW Implementation', 'Planning', 0, 'IT', NULL, 20000.00, 'Medium', 'High', '2025-07-17 21:38:22.556766', '2025-07-17 21:38:22.556766', NULL, 'NGFW Implementation', '', 30.000000, NULL, '2025-09-30', NULL);


-- --
-- -- TOC entry 6675 (class 0 OID 163965)
-- -- Dependencies: 329
-- -- Data for Name: nist_csf_organizational_profiles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6677 (class 0 OID 163978)
-- -- Dependencies: 331
-- -- Data for Name: nist_csf_risk_scenarios; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nist_csf_risk_scenarios VALUES (1, 1, 'Phishing attack', 'Ranswaomre attack on critical infrastructureRanswaomre attack on critical infrastructure', 'external hacker', 'Critical infrastructure hit by ransomware', '[]', 3, 4, 12, 'Ranswaomre attack on critical infrastructure', '2025-06-23 22:21:59.322689');
-- INSERT INTO public.nist_csf_risk_scenarios VALUES (3, 3, 'Phishing attack', 'Unauthorized acccess to the system', 'disgruntled employee', 'Email Phishing', '[]', 3, 4, 12, 'Unauthorized acccess to the system', '2025-07-12 14:37:57.692116');


-- --
-- -- TOC entry 6669 (class 0 OID 163893)
-- -- Dependencies: 323
-- -- Data for Name: nist_csf_risk_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nist_csf_risk_templates VALUES (1, 'NIST-TMPL-0001', 'Ranswaomre attack on critical infrastructure', 'Ranswaomre attack on critical infrastructure', 3, 16, 5, 'Critical', true, '2025-06-23 22:21:59.005716', '2025-06-23 22:21:59.005716', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (3, 'NIST-TMPL-0002', 'Unauthorized acccess to the system', 'Unauthorized acccess to the system', 3, 13, 4, 'High', true, '2025-07-12 14:37:56.748721', '2025-07-12 14:37:56.748721', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (5, 'NIST-TMPL-0004', 'DDOS Attack on public facing assets', 'DDOS Attack on public facing assets', 3, 18, 3, 'Medium', true, '2025-07-13 08:46:15.398208', '2025-07-13 14:14:54.780031', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (6, 'NIST-GV-001', 'Inadequate Cybersecurity Governance Structure', 'Risk of insufficient cybersecurity governance leading to poor risk management decisions and inadequate oversight of cybersecurity activities.', 1, 1, 4, 'High', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (7, 'NIST-GV-002', 'Inadequate Risk Management Strategy', 'Risk of operating without a comprehensive cybersecurity risk management strategy aligned with business objectives.', 1, 2, 4, 'High', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (8, 'NIST-GV-003', 'Unclear Cybersecurity Roles and Responsibilities', 'Risk of cybersecurity incidents due to unclear or undefined roles and responsibilities across the organization.', 1, 3, 3, 'Medium', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (9, 'NIST-GV-004', 'Inadequate Supply Chain Risk Management', 'Risk of cybersecurity incidents originating from third-party suppliers and vendors in the supply chain.', 1, 6, 4, 'High', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (10, 'NIST-ID-001', 'Incomplete Asset Inventory Management', 'Risk of security incidents due to unknown or unmanaged assets within the organization.', 2, 7, 3, 'High', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (11, 'NIST-ID-002', 'Inadequate Risk Assessment Processes', 'Risk of unidentified or poorly assessed cybersecurity risks affecting organizational operations.', 2, 10, 4, 'High', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (12, 'NIST-ID-003', 'Poor Understanding of Business Environment', 'Risk of cybersecurity measures not aligning with business objectives and operational requirements.', 2, 8, 3, 'Medium', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (13, 'NIST-PR-001', 'Weak Identity and Access Management', 'Risk of unauthorized access to systems and data due to inadequate identity and access controls.', 3, NULL, 4, 'High', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (14, 'NIST-PR-002', 'Insufficient Data Protection', 'Risk of data breaches and unauthorized disclosure due to inadequate data protection measures.', 3, 15, 5, 'High', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (15, 'NIST-PR-003', 'Inadequate Security Awareness Training', 'Risk of security incidents due to lack of cybersecurity awareness and training among personnel.', 3, 14, 3, 'High', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (16, 'NIST-PR-004', 'Insufficient Protective Technology', 'Risk of system compromises due to inadequate technical security controls and protective technologies.', 3, 18, 4, 'High', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (17, 'NIST-DE-001', 'Inadequate Anomaly Detection', 'Risk of undetected cybersecurity incidents due to insufficient anomaly detection capabilities.', 4, 19, 4, 'High', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (18, 'NIST-DE-002', 'Insufficient Security Monitoring', 'Risk of delayed incident detection due to inadequate continuous security monitoring capabilities.', 4, 20, 4, 'High', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (19, 'NIST-DE-003', 'Weak Detection Processes', 'Risk of missed security incidents due to inadequate detection processes and procedures.', 4, 21, 3, 'Medium', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (20, 'NIST-RS-001', 'Inadequate Incident Response Planning', 'Risk of ineffective incident response due to poor planning and preparation.', 5, 22, 4, 'High', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (21, 'NIST-RS-002', 'Poor Incident Response Communications', 'Risk of ineffective incident response due to inadequate communication during incidents.', 5, 23, 3, 'Medium', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (22, 'NIST-RS-003', 'Insufficient Incident Analysis', 'Risk of recurring incidents due to inadequate analysis and understanding of security events.', 5, 24, 3, 'Medium', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (23, 'NIST-RC-001', 'Inadequate Recovery Planning', 'Risk of prolonged service disruption due to insufficient recovery planning and preparation.', 6, 27, 4, 'High', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);
-- INSERT INTO public.nist_csf_risk_templates VALUES (24, 'NIST-RC-002', 'Poor Recovery Communications', 'Risk of ineffective recovery due to inadequate communication during recovery operations.', 6, 29, 3, 'Medium', true, '2025-07-15 01:48:56.627008', '2025-07-15 01:48:56.627008', NULL, '[]', '[]', '[]', '[]', NULL, NULL);


-- --
-- -- TOC entry 6667 (class 0 OID 163874)
-- -- Dependencies: 321
-- -- Data for Name: nist_csf_subcategories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nist_csf_subcategories VALUES (1, 'GV.OC-01', 'Organizational mission is understood and informs cybersecurity risk management', 'The organization''s mission, objectives, and activities are understood and prioritized; this information is used to inform cybersecurity roles, responsibilities, and risk management decisions.', 1, 'Document organizational mission, objectives, and how cybersecurity supports business goals.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973', NULL);
-- INSERT INTO public.nist_csf_subcategories VALUES (2, 'GV.OC-02', 'Internal and external stakeholders are understood', 'Key stakeholders, their expectations, and their influence on cybersecurity risk management are identified and understood.', 1, 'Maintain stakeholder register with cybersecurity interests and requirements.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973', NULL);
-- INSERT INTO public.nist_csf_subcategories VALUES (3, 'GV.OC-03', 'Legal, regulatory, and contractual requirements are understood', 'Legal, regulatory, and contractual requirements regarding cybersecurity are understood and managed.', 1, 'Maintain compliance register and map requirements to controls.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973', NULL);
-- INSERT INTO public.nist_csf_subcategories VALUES (4, 'ID.AM-01', 'Physical devices and systems are inventoried', 'Physical devices and systems within the organization are inventoried.', 7, 'Maintain comprehensive inventory of all physical devices and systems.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973', NULL);
-- INSERT INTO public.nist_csf_subcategories VALUES (5, 'ID.AM-02', 'Software platforms and applications are inventoried', 'Software platforms and applications within the organization are inventoried.', 7, 'Maintain software inventory including versions, licenses, and criticality.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973', NULL);
-- INSERT INTO public.nist_csf_subcategories VALUES (6, 'ID.AM-03', 'Organizational communication and data flows are mapped', 'Organizational communication and data flows are mapped.', 7, 'Document data flows, communication paths, and dependencies.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973', NULL);
-- INSERT INTO public.nist_csf_subcategories VALUES (7, 'ID.AM-04', 'External information systems are catalogued', 'External information systems are catalogued.', 7, 'Maintain inventory of external systems and their access requirements.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973', NULL);
-- INSERT INTO public.nist_csf_subcategories VALUES (8, 'ID.AM-05', 'Resources are prioritized based on classification and business functions', 'Resources (e.g., hardware, devices, data, time, software, and services) are prioritized based on their classification, criticality, and business value.', 7, 'Implement asset classification scheme and prioritization matrix.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973', NULL);
-- INSERT INTO public.nist_csf_subcategories VALUES (9, 'PR.AC-01', 'Identities and credentials are issued, managed, verified, revoked, and audited', 'Identities and credentials are issued, managed, verified, revoked, and audited for authorized devices, users and processes.', 13, 'Implement identity lifecycle management processes and regular access reviews.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973', NULL);
-- INSERT INTO public.nist_csf_subcategories VALUES (10, 'PR.AC-02', 'Physical access to assets is managed and protected', 'Physical access to assets is managed and protected.', 13, 'Implement physical access controls, monitoring, and visitor management.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973', NULL);
-- INSERT INTO public.nist_csf_subcategories VALUES (11, 'PR.AC-03', 'Remote access is managed', 'Remote access is managed.', 13, 'Implement secure remote access solutions with appropriate authentication and monitoring.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973', NULL);
-- INSERT INTO public.nist_csf_subcategories VALUES (12, 'PR.AC-04', 'Access permissions and authorizations are managed', 'Access permissions and authorizations are managed, incorporating the principles of least privilege and separation of duties.', 13, 'Implement role-based access control with regular permission reviews.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973', NULL);
-- INSERT INTO public.nist_csf_subcategories VALUES (13, 'DE.AE-01', 'A baseline of network operations and expected data flows is established and managed', 'A baseline of network operations and expected data flows for users and systems is established and managed.', NULL, 'Establish network baselines and monitor for deviations.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973', NULL);
-- INSERT INTO public.nist_csf_subcategories VALUES (14, 'DE.CM-01', 'The network is monitored to detect potential cybersecurity events', 'The network is monitored to detect potential cybersecurity events.', NULL, 'Implement network monitoring tools and establish monitoring procedures.', true, '2025-06-23 21:36:54.768973', '2025-06-23 21:36:54.768973', NULL);
-- INSERT INTO public.nist_csf_subcategories VALUES (70, 'DE.AE-04', 'Impact of events is determined', 'Impact of events is determined.', 19, 'Implement processes to assess and determine the impact of detected security events.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.16.1.4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (28, 'GV.OC-01', 'Organizational mission is understood and informs cybersecurity risk management', 'The organization''s mission, objectives, and activities are understood and prioritized; this information is used to inform cybersecurity roles, responsibilities, and risk management decisions.', 1, 'Document organizational mission and objectives. Ensure cybersecurity strategy aligns with business objectives.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.6.1.1","NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (29, 'GV.OC-02', 'Internal and external stakeholders are understood', 'Key stakeholders and their cybersecurity expectations are identified and documented.', 1, 'Identify all internal and external stakeholders. Document their cybersecurity expectations and requirements.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.6.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (30, 'GV.OC-03', 'Legal, regulatory, and contractual requirements are understood', 'Legal, regulatory, and contractual requirements regarding cybersecurity are understood and managed.', 1, 'Maintain a register of applicable legal, regulatory, and contractual requirements.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.18.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (31, 'GV.OC-04', 'Critical technology and systems are understood', 'Critical technology and the technology environment in which the organization operates are understood.', 1, 'Identify and document critical technology systems and their dependencies.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"NIST SP 800-160"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (32, 'GV.OC-05', 'Outcomes of cybersecurity risk management activities are understood', 'Outcomes of cybersecurity risk management activities and their use in making risk decisions are understood.', 1, 'Document and communicate outcomes of risk management activities to decision makers.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (33, 'GV.RM-01', 'Risk management objectives are established', 'Risk management objectives that support the organizational mission are established.', 2, 'Establish clear risk management objectives that align with organizational mission and business objectives.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"NIST SP 800-39","ISO/IEC 27005:2018"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (34, 'GV.RM-02', 'Risk appetite and risk tolerance are established', 'Risk appetite and risk tolerance statements are established, communicated, and maintained.', 2, 'Define and document organizational risk appetite and tolerance levels. Communicate to all relevant stakeholders.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"NIST SP 800-39","ISO/IEC 27005:2018"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (35, 'GV.RM-03', 'Risk management roles and responsibilities are established', 'Risk management roles and responsibilities are established and communicated.', 2, 'Define and document roles and responsibilities for risk management activities.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (36, 'GV.RM-04', 'Strategic direction that describes appropriate risk response is established', 'Strategic direction that describes appropriate risk response is established and communicated.', 2, 'Establish strategic direction for risk response activities and communicate to stakeholders.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (37, 'GV.RM-05', 'Lines of communication across the organization are established', 'Lines of communication across the organization are established for cybersecurity risks, including escalation pathways.', 2, 'Establish clear communication channels and escalation procedures for cybersecurity risks.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (38, 'GV.RM-06', 'A standardized method for calculating, documenting, categorizing, and prioritizing risks is established', 'A standardized method for calculating, documenting, categorizing, and prioritizing risks is established.', 2, 'Implement standardized risk assessment methodology and documentation procedures.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"NIST SP 800-30","ISO/IEC 27005:2018"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (39, 'GV.RM-07', 'Strategic opportunities (i.e., positive risks) are characterized and are included in organizational cybersecurity risk discussions', 'Strategic opportunities (i.e., positive risks) are characterized and are included in organizational cybersecurity risk discussions.', 2, 'Include consideration of positive risks and opportunities in risk management processes.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (40, 'ID.AM-01', 'Physical devices and systems are inventoried', 'Physical devices and systems within the organization are inventoried.', 7, 'Maintain an accurate inventory of all physical devices and systems. Include location, ownership, and criticality information.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.8.1.1","NIST SP 800-53 CM-8"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (41, 'ID.AM-02', 'Software platforms and applications are inventoried', 'Software platforms and applications within the organization are inventoried.', 7, 'Maintain an accurate inventory of all software platforms and applications. Include version information and licensing details.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.8.1.1","NIST SP 800-53 CM-8"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (42, 'ID.AM-03', 'Organizational communication and data flows are mapped', 'Organizational communication and data flows are mapped.', 7, 'Document all communication pathways and data flows within the organization and with external parties.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.13.2.1","NIST SP 800-53 AC-4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (43, 'ID.AM-04', 'External information systems are catalogued', 'External information systems are catalogued.', 7, 'Maintain inventory of external systems and services that process organizational data.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.15.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (44, 'ID.AM-05', 'Resources are prioritized based on classification and business functions', 'Resources (e.g., hardware, devices, data, time, software, and services) are prioritized based on their classification, criticality, and business value.', 7, 'Implement asset classification scheme and prioritization matrix based on business value and criticality.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.8.2.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (45, 'ID.AM-06', 'Cybersecurity roles and responsibilities are established', 'Cybersecurity roles and responsibilities for the entire workforce and third-party stakeholders are established.', 7, 'Define and document cybersecurity roles and responsibilities for all personnel and third parties.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.6.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (46, 'ID.AM-07', 'Inventories of data and corresponding metadata are maintained', 'Inventories of data and corresponding metadata for designated data types are maintained.', 7, 'Maintain comprehensive data inventory including metadata, classification, and handling requirements.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.8.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (47, 'ID.AM-08', 'Systems, hardware, software, services, and applications are managed throughout their life cycles', 'Systems, hardware, software, services, and applications are managed throughout their life cycles.', 7, 'Implement lifecycle management processes for all technology assets.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.8.1.4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (48, 'PR.AA-01', 'Identities and credentials are issued, managed, verified, revoked, and audited', 'Identities and credentials are issued, managed, verified, revoked, and audited for authorized devices, users and processes.', NULL, 'Implement comprehensive identity and credential management processes including provisioning, verification, and deprovisioning.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.9.2.1","NIST SP 800-53 IA-2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (49, 'PR.AA-02', 'Identity and credential management systems are protected', 'Identity and credential management systems are protected.', NULL, 'Implement security controls to protect identity and credential management systems from unauthorized access and tampering.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.9.4.3","NIST SP 800-53 IA-5"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (50, 'PR.AA-03', 'Users, devices, and other assets are authenticated', 'Users, devices, and other assets are authenticated (e.g., single-factor, multi-factor) commensurate with the risk of the transaction.', NULL, 'Implement risk-based authentication mechanisms appropriate to the sensitivity of systems and data.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.9.4.2","NIST SP 800-53 IA-2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (51, 'PR.AA-04', 'Identity assertions are protected, conveyed, and verified', 'Identity assertions are protected, conveyed, and verified.', NULL, 'Implement secure mechanisms for protecting and verifying identity assertions.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"NIST SP 800-63"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (52, 'PR.AA-05', 'Access permissions, entitlements, and authorizations are defined in a policy', 'Access permissions, entitlements, and authorizations are defined in a policy, managed, enforced, and reviewed, and incorporate the principles of least privilege and separation of duties.', NULL, 'Implement access control policies based on least privilege and separation of duties principles.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.9.1.2","NIST SP 800-53 AC-2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (53, 'PR.AA-06', 'Physical access to assets is managed, monitored, and enforced', 'Physical access to assets is managed, monitored, and enforced.', NULL, 'Implement physical access controls including monitoring and enforcement mechanisms.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.11.1.1","NIST SP 800-53 PE-2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (54, 'PR.AT-01', 'All users are informed and trained', 'All users are informed and trained on cybersecurity awareness and responsibilities.', 14, 'Provide regular cybersecurity awareness training to all users. Include role-specific training for privileged users.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.7.2.2","NIST SP 800-53 AT-2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (55, 'PR.AT-02', 'Privileged users understand roles and responsibilities', 'Privileged users understand their roles and responsibilities.', 14, 'Provide specialized training for privileged users on their enhanced responsibilities and security requirements.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.7.2.2","NIST SP 800-53 AT-3"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (56, 'PR.AT-03', 'Third-party stakeholders understand applicable roles and responsibilities', 'Third-party stakeholders (e.g., suppliers, customers, partners) understand their applicable roles and responsibilities.', 14, 'Ensure third-party stakeholders understand their cybersecurity roles and responsibilities.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.7.2.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (57, 'PR.AT-04', 'Senior executives understand roles and responsibilities', 'Senior executives understand their roles and responsibilities.', 14, 'Provide cybersecurity awareness training specifically tailored for senior executives.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.7.2.2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (58, 'PR.AT-05', 'Physical and cybersecurity personnel understand roles and responsibilities', 'Physical and cybersecurity personnel understand their roles and responsibilities.', 14, 'Ensure security personnel receive appropriate training on their specific roles and responsibilities.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.7.2.2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (59, 'PR.DS-01', 'Data-at-rest is protected', 'Data-at-rest is protected.', 15, 'Implement appropriate protection mechanisms for data at rest, including encryption where appropriate.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.10.1.1","NIST SP 800-53 SC-28"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (60, 'PR.DS-02', 'Data-in-transit is protected', 'Data-in-transit is protected.', 15, 'Implement appropriate protection mechanisms for data in transit, including encryption and secure protocols.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.13.2.1","NIST SP 800-53 SC-8"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (61, 'PR.DS-03', 'Systems/assets are formally managed throughout removal, transfers, and disposition', 'Systems/assets are formally managed throughout removal, transfers, and disposition.', 15, 'Implement formal procedures for secure disposal and transfer of systems and assets.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.8.3.2","NIST SP 800-53 MP-6"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (62, 'PR.DS-04', 'Adequate capacity to ensure availability is maintained', 'Adequate capacity to ensure availability is maintained.', 15, 'Monitor and maintain adequate system capacity to ensure availability of critical services.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.12.1.3"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (63, 'PR.DS-05', 'Protections against data leaks are implemented', 'Protections against data leaks are implemented.', 15, 'Implement data loss prevention controls and monitoring mechanisms.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.13.2.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (64, 'PR.DS-06', 'Integrity checking mechanisms are used to verify software, firmware, and information integrity', 'Integrity checking mechanisms are used to verify software, firmware, and information integrity.', 15, 'Implement integrity verification mechanisms for software, firmware, and critical data.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.12.2.1","NIST SP 800-53 SI-7"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (65, 'PR.DS-07', 'The development and testing environment(s) are separate from the production environment', 'The development and testing environment(s) are separate from the production environment.', 15, 'Maintain separation between development, testing, and production environments.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.12.1.4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (66, 'PR.DS-08', 'Integrity checking mechanisms are used to verify hardware integrity', 'Integrity checking mechanisms are used to verify hardware integrity.', 15, 'Implement mechanisms to verify the integrity of hardware components.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"NIST SP 800-53 SI-7"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (67, 'DE.AE-01', 'A baseline of network operations and expected data flows is established and managed', 'A baseline of network operations and expected data flows for users and systems is established and managed.', 19, 'Establish and maintain baselines for normal network operations and data flows to enable detection of anomalies.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.12.4.1","NIST SP 800-53 SI-4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (68, 'DE.AE-02', 'Detected events are analyzed to understand attack targets and methods', 'Detected events are analyzed to understand attack targets and methods.', 19, 'Implement event analysis capabilities to understand attack patterns and methods.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.16.1.4","NIST SP 800-53 IR-4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (69, 'DE.AE-03', 'Event data are collected and correlated from multiple sources and sensors', 'Event data are collected and correlated from multiple sources and sensors.', 19, 'Implement centralized logging and event correlation capabilities.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.12.4.1","NIST SP 800-53 AU-6"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (71, 'DE.AE-05', 'Incident alert thresholds are established', 'Incident alert thresholds are established.', 19, 'Define and implement appropriate thresholds for security incident alerts.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"NIST SP 800-53 IR-4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (72, 'DE.CM-01', 'The network is monitored to detect potential cybersecurity events', 'The network is monitored to detect potential cybersecurity events.', 20, 'Implement continuous network monitoring capabilities to detect potential cybersecurity events and incidents.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.12.4.1","NIST SP 800-53 SI-4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (73, 'DE.CM-02', 'The physical environment is monitored to detect potential cybersecurity events', 'The physical environment is monitored to detect potential cybersecurity events.', 20, 'Implement physical monitoring capabilities to detect unauthorized access and security events.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.11.1.2","NIST SP 800-53 PE-6"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (74, 'DE.CM-03', 'Personnel activity is monitored to detect potential cybersecurity events', 'Personnel activity is monitored to detect potential cybersecurity events.', 20, 'Implement user activity monitoring to detect potential insider threats and unauthorized activities.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.12.4.1","NIST SP 800-53 AU-2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (75, 'DE.CM-04', 'Malicious code is detected', 'Malicious code is detected.', 20, 'Implement malware detection and prevention capabilities across all systems.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.12.2.1","NIST SP 800-53 SI-3"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (76, 'DE.CM-05', 'Unauthorized mobile code is detected', 'Unauthorized mobile code is detected.', 20, 'Implement controls to detect and prevent unauthorized mobile code execution.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"NIST SP 800-53 SI-4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (77, 'DE.CM-06', 'External service provider activity is monitored to detect potential cybersecurity events', 'External service provider activity is monitored to detect potential cybersecurity events.', 20, 'Monitor external service provider activities for potential security events and policy violations.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.15.2.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (78, 'DE.CM-07', 'Monitoring for unauthorized personnel, connections, devices, and software is performed', 'Monitoring for unauthorized personnel, connections, devices, and software is performed.', 20, 'Implement comprehensive monitoring for unauthorized access, devices, and software.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.12.4.1","NIST SP 800-53 SI-4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (79, 'DE.CM-08', 'Vulnerability scans are performed', 'Vulnerability scans are performed.', 20, 'Conduct regular vulnerability assessments and scans of systems and applications.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.12.6.1","NIST SP 800-53 RA-5"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (80, 'RS.RP-01', 'Response plan is executed during or after an incident', 'Response plan is executed during or after a cybersecurity incident.', 22, 'Execute documented incident response procedures when cybersecurity incidents are detected.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.16.1.5","NIST SP 800-53 IR-8"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (81, 'RS.CO-01', 'Personnel know their roles and order of operations', 'Personnel know their roles and order of operations when a response is needed.', 23, 'Ensure all personnel understand their roles and responsibilities during incident response activities.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.16.1.1","NIST SP 800-53 IR-3"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (82, 'RS.CO-02', 'Incidents are reported consistent with established criteria', 'Incidents are reported consistent with established criteria.', 23, 'Implement consistent incident reporting procedures and criteria.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.16.1.2","NIST SP 800-53 IR-6"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (83, 'RS.CO-03', 'Information is shared consistent with response plans', 'Information is shared consistent with response plans.', 23, 'Share incident information according to established response plans and procedures.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.16.1.2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (84, 'RS.CO-04', 'Coordination with stakeholders occurs consistent with response plans', 'Coordination with stakeholders occurs consistent with response plans.', 23, 'Coordinate incident response activities with internal and external stakeholders.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.16.1.2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (85, 'RS.CO-05', 'Voluntary information sharing occurs with external stakeholders', 'Voluntary information sharing occurs with external stakeholders to achieve broader cybersecurity situational awareness.', 23, 'Participate in information sharing initiatives to improve overall cybersecurity posture.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"NIST SP 800-150"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (86, 'RC.RP-01', 'Recovery plan is executed during or after a cybersecurity incident', 'Recovery plan is executed during or after a cybersecurity incident.', 27, 'Execute documented recovery procedures to restore normal operations after a cybersecurity incident.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.17.1.2","NIST SP 800-53 CP-10"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (87, 'RC.IM-01', 'Recovery plans incorporate lessons learned', 'Recovery plans incorporate lessons learned.', 28, 'Update recovery plans based on lessons learned from actual incidents and recovery exercises.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.17.1.3","NIST SP 800-53 CP-2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (88, 'RC.IM-02', 'Recovery strategies are updated', 'Recovery strategies are updated.', 28, 'Regularly review and update recovery strategies based on changing business requirements and threat landscape.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.17.1.2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (89, 'RC.CO-01', 'Public relations are managed', 'Public relations are managed.', 29, 'Manage public communications and relations during and after cybersecurity incidents.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.16.1.2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (90, 'RC.CO-02', 'Reputation is repaired after an incident', 'Reputation is repaired after an incident.', 29, 'Implement strategies to repair organizational reputation following cybersecurity incidents.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.16.1.2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (91, 'RC.CO-03', 'Recovery activities are communicated to internal and external stakeholders', 'Recovery activities are communicated to internal and external stakeholders as well as executive and management teams.', 29, 'Communicate recovery progress and activities to all relevant stakeholders.', true, '2025-06-23 22:02:10.405091', '2025-06-23 22:02:10.405091', '{"ISO/IEC 27001:2013 A.16.1.2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (92, 'GV.OC-03', 'Legal, regulatory, and contractual requirements are understood', 'Legal, regulatory, and contractual requirements regarding cybersecurity are understood and managed', 1, 'Maintain a register of applicable legal, regulatory, and contractual requirements.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.18.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (93, 'GV.OC-04', 'Critical technology and systems are understood', 'Critical technology and the technology environment in which the organization operates are understood', 1, 'Identify and document critical technology systems and their dependencies.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-160"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (94, 'GV.OC-05', 'Outcomes of cybersecurity risk management activities are understood', 'Outcomes of cybersecurity risk management activities and their use in making risk decisions are understood', 1, 'Document and communicate outcomes of risk management activities to decision makers.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (95, 'GV.RM-03', 'Risk management roles and responsibilities are established', 'Risk management roles and responsibilities are established and communicated', 2, 'Define and document roles and responsibilities for risk management activities.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (96, 'GV.RM-04', 'Strategic direction that describes appropriate risk response is established', 'Strategic direction that describes appropriate risk response is established and communicated', 2, 'Establish strategic direction for risk response activities and communicate to stakeholders.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (97, 'GV.RM-05', 'Lines of communication across the organization are established', 'Lines of communication across the organization are established for cybersecurity risks, including escalation pathways', 2, 'Establish clear communication channels and escalation procedures for cybersecurity risks.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (98, 'GV.RM-06', 'A standardized method for calculating, documenting, categorizing, and prioritizing risks is established', 'A standardized method for calculating, documenting, categorizing, and prioritizing risks is established', 2, 'Implement standardized risk assessment methodology and documentation procedures.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-30","ISO/IEC 27005:2018"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (99, 'GV.RM-07', 'Strategic opportunities are characterized and included in organizational cybersecurity risk discussions', 'Strategic opportunities (positive risks) are characterized and included in organizational cybersecurity risk discussions', 2, 'Include consideration of positive risks and opportunities in risk management processes.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (100, 'GV.RR-01', 'Organizational leadership is responsible and accountable for cybersecurity risk', 'Organizational leadership is responsible and accountable for cybersecurity risk and fosters a culture that is risk-aware, ethical, and continually improving', 3, 'Establish clear leadership accountability for cybersecurity risk management.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (101, 'GV.RR-02', 'Roles, responsibilities, and authorities related to cybersecurity risk management are established', 'Roles, responsibilities, and authorities related to cybersecurity risk management are established, communicated, understood, and enforced', 3, 'Define and communicate cybersecurity roles and responsibilities throughout the organization.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.6.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (102, 'GV.RR-03', 'Adequate resources are allocated commensurate with the cybersecurity risk strategy', 'Adequate resources are allocated commensurate with the cybersecurity risk strategy, roles, responsibilities, and policies', 3, 'Ensure adequate resource allocation for cybersecurity risk management activities.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (103, 'GV.RR-04', 'Cybersecurity is included in human resources practices', 'Cybersecurity is included in human resources practices (e.g., deprovisioning, personnel screening)', 3, 'Integrate cybersecurity considerations into HR processes and procedures.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.7.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (104, 'GV.PO-01', 'Policy for managing cybersecurity risks is established and communicated', 'Policy for managing cybersecurity risks is established, communicated, and enforced', 4, 'Develop and maintain comprehensive cybersecurity policies.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.5.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (105, 'GV.PO-02', 'Policy for managing cybersecurity risks is reviewed and updated', 'Policy for managing cybersecurity risks is reviewed, updated, communicated, and enforced', 4, 'Regularly review and update cybersecurity policies to reflect current threats and business needs.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.5.1.2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (106, 'GV.OV-01', 'Cybersecurity risk management strategy outcomes are reviewed', 'Cybersecurity risk management strategy outcomes are reviewed to inform and adjust strategy and direction', 5, 'Regularly review and assess the effectiveness of cybersecurity risk management strategies.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (107, 'GV.OV-02', 'The cybersecurity risk management strategy is reviewed and adjusted', 'The cybersecurity risk management strategy is reviewed and adjusted to ensure coverage of organizational requirements and risks', 5, 'Continuously improve cybersecurity risk management strategy based on performance metrics.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (108, 'GV.OV-03', 'Organizational cybersecurity risk management performance is evaluated', 'Organizational cybersecurity risk management performance is evaluated and reviewed for adjustments needed', 5, 'Implement metrics and KPIs to measure cybersecurity risk management performance.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-55"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (109, 'GV.SC-01', 'A cybersecurity supply chain risk management strategy is established', 'A cybersecurity supply chain risk management strategy is established', 6, 'Develop comprehensive supply chain cybersecurity risk management strategy.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-161"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (110, 'GV.SC-02', 'Cybersecurity roles and responsibilities for suppliers are established', 'Cybersecurity roles and responsibilities for suppliers, customers, and partners are established, communicated, and coordinated', 6, 'Define cybersecurity expectations and requirements for supply chain partners.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.15.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (111, 'ID.AM-04', 'External information systems are catalogued', 'External information systems are catalogued', 7, 'Maintain inventory of external systems and services that process organizational data.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.15.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (112, 'ID.AM-05', 'Resources are prioritized based on classification and business functions', 'Resources are prioritized based on their classification, criticality, and business value', 7, 'Implement asset classification scheme and prioritization matrix based on business value.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.8.2.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (113, 'ID.AM-06', 'Cybersecurity roles and responsibilities are established', 'Cybersecurity roles and responsibilities for the entire workforce and third-party stakeholders are established', 7, 'Define and document cybersecurity roles and responsibilities for all personnel.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.6.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (114, 'ID.AM-07', 'Inventories of data and corresponding metadata are maintained', 'Inventories of data and corresponding metadata for designated data types are maintained', 7, 'Maintain comprehensive data inventory including metadata and classification.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.8.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (115, 'ID.AM-08', 'Systems, hardware, software, services, and applications are managed throughout their life cycles', 'Systems, hardware, software, services, and applications are managed throughout their life cycles', 7, 'Implement lifecycle management processes for all technology assets.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.8.1.4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (116, 'ID.BE-01', 'The organization''s role in the supply chain is identified and communicated', 'The organization''s role in the supply chain is identified and communicated', 8, 'Understand and document the organization''s position and dependencies in supply chains.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-161"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (117, 'ID.BE-02', 'The organization''s place in critical infrastructure and its industry sector is identified', 'The organization''s place in critical infrastructure and its industry sector is identified and communicated', 8, 'Identify critical infrastructure dependencies and sector-specific requirements.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (170, 'RS.AN-03', 'Forensics are performed', 'Forensics are performed', 24, 'Implement digital forensics capabilities for incident investigation.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.16.1.7"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (118, 'ID.BE-03', 'Priorities for organizational mission, objectives, and activities are established', 'Priorities for organizational mission, objectives, and activities are established and communicated', 8, 'Establish clear priorities that align cybersecurity activities with business objectives.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (119, 'ID.BE-04', 'Dependencies and critical functions for delivery of critical services are established', 'Dependencies and critical functions for delivery of critical services are established', 8, 'Identify and document critical business functions and their dependencies.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.17.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (120, 'ID.BE-05', 'Resilience requirements to support delivery of critical services are established', 'Resilience requirements to support delivery of critical services are established for all operating states', 8, 'Define resilience requirements for maintaining critical business operations.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27031:2011"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (121, 'ID.GV-01', 'Organizational cybersecurity policy is established and communicated', 'Organizational cybersecurity policy is established and communicated', 9, 'Develop and communicate comprehensive cybersecurity governance policies.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.5.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (122, 'ID.GV-02', 'Cybersecurity roles and responsibilities are coordinated and aligned', 'Cybersecurity roles and responsibilities are coordinated and aligned with internal roles and external partners', 9, 'Ensure coordination of cybersecurity roles across internal and external stakeholders.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.6.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (123, 'ID.GV-03', 'Legal and regulatory requirements regarding cybersecurity are understood', 'Legal and regulatory requirements regarding cybersecurity, including privacy and civil liberties obligations, are understood and managed', 9, 'Maintain awareness of applicable legal and regulatory cybersecurity requirements.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.18.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (124, 'ID.GV-04', 'Governance and risk management processes address cybersecurity risks', 'Governance and risk management processes address cybersecurity risks', 9, 'Integrate cybersecurity risk considerations into governance and risk management processes.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (125, 'ID.RA-01', 'Asset vulnerabilities are identified and documented', 'Asset vulnerabilities are identified and documented', 10, 'Conduct regular vulnerability assessments and maintain vulnerability documentation.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.12.6.1","NIST SP 800-53 RA-5"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (126, 'ID.RA-02', 'Cyber threat intelligence is received from information sharing forums and sources', 'Cyber threat intelligence is received from information sharing forums and sources', 10, 'Establish threat intelligence feeds and participate in information sharing communities.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-150"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (127, 'ID.RA-03', 'Threats, both internal and external, are identified and documented', 'Threats, both internal and external, are identified and documented', 10, 'Maintain comprehensive threat identification and documentation processes.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-30"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (128, 'ID.RA-04', 'Potential business impacts and likelihoods are identified', 'Potential business impacts and likelihoods are identified', 10, 'Assess potential business impacts and likelihood of cybersecurity events.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-30"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (129, 'ID.RA-05', 'Threats, vulnerabilities, likelihoods, and impacts are used to determine risk', 'Threats, vulnerabilities, likelihoods, and impacts are used to determine risk', 10, 'Implement comprehensive risk assessment methodology combining all risk factors.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-30","ISO/IEC 27005:2018"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (130, 'ID.RA-06', 'Risk responses are identified and prioritized', 'Risk responses are identified and prioritized', 10, 'Develop and prioritize risk treatment options based on risk assessment results.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-39"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (131, 'ID.RA-07', 'Risk responses are chosen, implemented, monitored, and reviewed', 'Risk responses are chosen, implemented, monitored, and reviewed', 10, 'Implement risk treatment decisions and monitor their effectiveness.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27005:2018"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (132, 'ID.RA-08', 'Processes for receiving, analyzing, and responding to vulnerability disclosures are established', 'Processes for receiving, analyzing, and responding to vulnerability disclosures are established', 10, 'Establish vulnerability disclosure and response processes.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 29147:2018"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (133, 'ID.RA-09', 'The authenticity and integrity of hardware and software are assessed', 'The authenticity and integrity of hardware and software are assessed prior to acquisition and use', 10, 'Implement supply chain security assessments for hardware and software.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-161"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (134, 'ID.RA-10', 'Critical suppliers are assessed prior to acquisition', 'Critical suppliers are assessed prior to acquisition', 10, 'Conduct cybersecurity assessments of critical suppliers and vendors.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.15.2.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (135, 'PR.AA-03', 'Users, devices, and other assets are authenticated', 'Users, devices, and other assets are authenticated commensurate with the risk of the transaction', NULL, 'Implement risk-based authentication mechanisms.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.9.4.2","NIST SP 800-53 IA-2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (136, 'PR.AA-04', 'Identity assertions are protected, conveyed, and verified', 'Identity assertions are protected, conveyed, and verified', NULL, 'Implement secure mechanisms for protecting and verifying identity assertions.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-63"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (137, 'PR.AA-05', 'Access permissions, entitlements, and authorizations are defined in a policy', 'Access permissions and authorizations are defined in a policy, managed, enforced, and reviewed, incorporating principles of least privilege and separation of duties', NULL, 'Implement access control policies based on least privilege principles.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.9.1.2","NIST SP 800-53 AC-2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (138, 'PR.AA-06', 'Physical access to assets is managed, monitored, and enforced', 'Physical access to assets is managed, monitored, and enforced', NULL, 'Implement comprehensive physical access controls.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.11.1.1","NIST SP 800-53 PE-2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (139, 'PR.AT-02', 'Privileged users understand roles and responsibilities', 'Privileged users understand their roles and responsibilities', 14, 'Provide specialized training for privileged users.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.7.2.2","NIST SP 800-53 AT-3"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (140, 'PR.AT-03', 'Third-party stakeholders understand applicable roles and responsibilities', 'Third-party stakeholders understand their applicable roles and responsibilities', 14, 'Ensure third-party stakeholders understand their cybersecurity responsibilities.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.7.2.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (141, 'PR.AT-04', 'Senior executives understand roles and responsibilities', 'Senior executives understand their roles and responsibilities', 14, 'Provide cybersecurity awareness training for senior executives.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.7.2.2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (142, 'PR.AT-05', 'Physical and cybersecurity personnel understand roles and responsibilities', 'Physical and cybersecurity personnel understand their roles and responsibilities', 14, 'Ensure security personnel receive appropriate role-specific training.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.7.2.2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (143, 'PR.DS-03', 'Systems/assets are formally managed throughout removal, transfers, and disposition', 'Systems and assets are formally managed throughout removal, transfers, and disposition', 15, 'Implement formal procedures for secure disposal and transfer of systems.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.8.3.2","NIST SP 800-53 MP-6"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (144, 'PR.DS-04', 'Adequate capacity to ensure availability is maintained', 'Adequate capacity to ensure availability is maintained', 15, 'Monitor and maintain adequate system capacity for availability.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.12.1.3"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (145, 'PR.DS-05', 'Protections against data leaks are implemented', 'Protections against data leaks are implemented', 15, 'Implement data loss prevention controls and monitoring.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.13.2.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (146, 'PR.DS-06', 'Integrity checking mechanisms are used to verify software, firmware, and information integrity', 'Integrity checking mechanisms are used to verify software, firmware, and information integrity', 15, 'Implement integrity verification mechanisms for critical systems and data.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.12.2.1","NIST SP 800-53 SI-7"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (147, 'PR.DS-07', 'The development and testing environment(s) are separate from the production environment', 'The development and testing environments are separate from the production environment', 15, 'Maintain separation between development, testing, and production environments.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.12.1.4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (148, 'PR.DS-08', 'Integrity checking mechanisms are used to verify hardware integrity', 'Integrity checking mechanisms are used to verify hardware integrity', 15, 'Implement mechanisms to verify hardware component integrity.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-53 SI-7"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (149, 'DE.AE-02', 'Detected events are analyzed to understand attack targets and methods', 'Detected events are analyzed to understand attack targets and methods', 19, 'Implement event analysis capabilities to understand attack patterns.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.16.1.4","NIST SP 800-53 IR-4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (150, 'DE.AE-03', 'Event data are collected and correlated from multiple sources and sensors', 'Event data are collected and correlated from multiple sources and sensors', 19, 'Implement centralized logging and event correlation capabilities.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.12.4.1","NIST SP 800-53 AU-6"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (151, 'DE.AE-04', 'Impact of events is determined', 'Impact of events is determined', 19, 'Implement processes to assess the impact of detected security events.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.16.1.4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (152, 'DE.AE-05', 'Incident alert thresholds are established', 'Incident alert thresholds are established', 19, 'Define and implement appropriate thresholds for security incident alerts.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-53 IR-4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (153, 'DE.CM-02', 'The physical environment is monitored to detect potential cybersecurity events', 'The physical environment is monitored to detect potential cybersecurity events', 20, 'Implement physical monitoring capabilities for security events.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.11.1.2","NIST SP 800-53 PE-6"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (154, 'DE.CM-03', 'Personnel activity is monitored to detect potential cybersecurity events', 'Personnel activity is monitored to detect potential cybersecurity events', 20, 'Implement user activity monitoring for insider threat detection.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.12.4.1","NIST SP 800-53 AU-2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (155, 'DE.CM-05', 'Unauthorized mobile code is detected', 'Unauthorized mobile code is detected', 20, 'Implement controls to detect unauthorized mobile code execution.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-53 SI-4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (156, 'DE.CM-06', 'External service provider activity is monitored to detect potential cybersecurity events', 'External service provider activity is monitored to detect potential cybersecurity events', 20, 'Monitor external service provider activities for security events.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.15.2.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (157, 'DE.CM-07', 'Monitoring for unauthorized personnel, connections, devices, and software is performed', 'Monitoring for unauthorized personnel, connections, devices, and software is performed', 20, 'Implement comprehensive monitoring for unauthorized access and devices.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.12.4.1","NIST SP 800-53 SI-4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (158, 'DE.CM-08', 'Vulnerability scans are performed', 'Vulnerability scans are performed', 20, 'Conduct regular vulnerability assessments and scans.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.12.6.1","NIST SP 800-53 RA-5"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (159, 'DE.DP-01', 'Roles and responsibilities for detection are well defined', 'Roles and responsibilities for detection are well defined to ensure accountability', 21, 'Define clear roles and responsibilities for cybersecurity detection activities.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.6.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (160, 'DE.DP-02', 'Detection activities comply with applicable requirements', 'Detection activities comply with all applicable requirements', 21, 'Ensure detection processes comply with legal and regulatory requirements.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.18.1.4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (161, 'DE.DP-03', 'Detection processes are tested', 'Detection processes are tested', 21, 'Regularly test and validate detection capabilities and processes.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.17.1.3"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (162, 'DE.DP-04', 'Event detection information is communicated', 'Event detection information is communicated', 21, 'Establish communication procedures for detection events and alerts.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.16.1.2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (163, 'DE.DP-05', 'Detection processes are continuously improved', 'Detection processes are continuously improved', 21, 'Implement continuous improvement processes for detection capabilities.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.10.1.1"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (164, 'RS.CO-02', 'Incidents are reported consistent with established criteria', 'Incidents are reported consistent with established criteria', 23, 'Implement consistent incident reporting procedures and criteria.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.16.1.2","NIST SP 800-53 IR-6"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (165, 'RS.CO-03', 'Information is shared consistent with response plans', 'Information is shared consistent with response plans', 23, 'Share incident information according to established response plans.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.16.1.2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (166, 'RS.CO-04', 'Coordination with stakeholders occurs consistent with response plans', 'Coordination with stakeholders occurs consistent with response plans', 23, 'Coordinate incident response activities with internal and external stakeholders.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.16.1.2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (167, 'RS.CO-05', 'Voluntary information sharing occurs with external stakeholders', 'Voluntary information sharing occurs with external stakeholders to achieve broader cybersecurity situational awareness', 23, 'Participate in information sharing initiatives for improved cybersecurity.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-150"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (168, 'RS.AN-01', 'Notifications from detection systems are investigated', 'Notifications from detection systems are investigated', 24, 'Establish procedures for investigating security alerts and notifications.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.16.1.4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (169, 'RS.AN-02', 'The impact of the incident is understood', 'The impact of the incident is understood', 24, 'Implement impact assessment procedures for security incidents.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.16.1.4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (171, 'RS.AN-04', 'Incidents are categorized consistent with response plans', 'Incidents are categorized consistent with response plans', 24, 'Implement incident categorization procedures aligned with response plans.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-53 IR-4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (172, 'RS.AN-05', 'Processes are established to receive, analyze and respond to vulnerabilities disclosed to the organization from internal and external sources', 'Processes are established to receive, analyze and respond to vulnerabilities disclosed to the organization', 24, 'Establish vulnerability disclosure and response processes.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 29147:2018"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (173, 'RS.MI-01', 'Incidents are contained', 'Incidents are contained', 25, 'Implement incident containment procedures to prevent spread of damage.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.16.1.5"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (174, 'RS.MI-02', 'Incidents are eradicated', 'Incidents are eradicated', 25, 'Implement procedures to eliminate threats and vulnerabilities from affected systems.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-53 IR-4"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (175, 'RS.MI-03', 'Newly identified vulnerabilities are mitigated or documented as accepted risks', 'Newly identified vulnerabilities are mitigated or documented as accepted risks', 25, 'Implement vulnerability remediation and risk acceptance procedures.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27005:2018"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (176, 'RS.IM-01', 'Response plans incorporate lessons learned', 'Response plans incorporate lessons learned', 26, 'Update response plans based on lessons learned from actual incidents.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.16.1.6"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (177, 'RS.IM-02', 'Response strategies are updated', 'Response strategies are updated', 26, 'Regularly review and update incident response strategies.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"NIST SP 800-53 IR-8"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (178, 'RC.IM-02', 'Recovery strategies are updated', 'Recovery strategies are updated', 28, 'Regularly review and update recovery strategies based on lessons learned.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.17.1.2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (179, 'RC.CO-02', 'Reputation is repaired after an incident', 'Reputation is repaired after an incident', 29, 'Implement strategies to repair organizational reputation following incidents.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.16.1.2"}');
-- INSERT INTO public.nist_csf_subcategories VALUES (180, 'RC.CO-03', 'Recovery activities are communicated to internal and external stakeholders', 'Recovery activities are communicated to internal and external stakeholders as well as executive and management teams', 29, 'Communicate recovery progress to all relevant stakeholders.', true, '2025-06-23 22:22:17.103109', '2025-06-23 22:22:17.103109', '{"ISO/IEC 27001:2013 A.16.1.2"}');


-- --
-- -- TOC entry 6671 (class 0 OID 163924)
-- -- Dependencies: 325
-- -- Data for Name: nist_csf_template_controls; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nist_csf_template_controls VALUES (2, 3, 11, 2, 3, 3, false, 'Unauthorized acccess to the system', '2025-07-12 14:37:57.15599');


-- --
-- -- TOC entry 6733 (class 0 OID 344156)
-- -- Dependencies: 388
-- -- Data for Name: nist_references; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.nist_references VALUES (1, 'NIST-CSF-ID', 'NIST CSF', 'Identify Function', 'Develop an organizational understanding to manage cybersecurity risk to systems, people, assets, data, and capabilities', '2.0', 'Identify', 'ID', 'Establish governance, risk management, and asset management processes', '["NIST-CSF-PR", "NIST-CSF-DE"]', '["SOX", "HIPAA", "PCI-DSS"]', 2, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (2, 'NIST-CSF-PR', 'NIST CSF', 'Protect Function', 'Develop and implement appropriate safeguards to ensure delivery of critical services', '2.0', 'Protect', 'PR', 'Implement access controls, awareness training, data security, and protective technology', '["NIST-CSF-ID", "NIST-CSF-DE"]', '["SOX", "HIPAA", "PCI-DSS"]', 3, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (3, 'NIST-CSF-DE', 'NIST CSF', 'Detect Function', 'Develop and implement appropriate activities to identify the occurrence of a cybersecurity event', '2.0', 'Detect', 'DE', 'Implement continuous monitoring, detection processes, and anomaly detection', '["NIST-CSF-PR", "NIST-CSF-RS"]', '["SOX", "HIPAA", "PCI-DSS"]', 2, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (4, 'NIST-CSF-RS', 'NIST CSF', 'Respond Function', 'Develop and implement appropriate activities to take action regarding a detected cybersecurity incident', '2.0', 'Respond', 'RS', 'Establish response planning, communications, analysis, mitigation, and improvements', '["NIST-CSF-DE", "NIST-CSF-RC"]', '["SOX", "HIPAA", "PCI-DSS"]', 2, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (5, 'NIST-CSF-RC', 'NIST CSF', 'Recover Function', 'Develop and implement appropriate activities to maintain plans for resilience and to restore any capabilities or services that were impaired due to a cybersecurity incident', '2.0', 'Recover', 'RC', 'Implement recovery planning, improvements, and communications', '["NIST-CSF-RS"]', '["SOX", "HIPAA", "PCI-DSS"]', 2, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (6, 'NIST-CSF-GV', 'NIST CSF', 'Govern Function', 'The organization''s cybersecurity risk management strategy, expectations, and policy are established, communicated, and monitored', '2.0', 'Govern', 'GV', 'Establish organizational context, risk management strategy, roles and responsibilities, policy, oversight, and cybersecurity supply chain risk management', '["NIST-CSF-ID"]', '["SOX", "HIPAA", "PCI-DSS"]', 3, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (7, 'NIST-CSF-ID.AM', 'NIST CSF', 'Asset Management', 'The data, personnel, devices, systems, and facilities that enable the organization to achieve business purposes are identified and managed consistent with their relative importance to organizational objectives and the organization''s risk strategy', '2.0', 'Identify', 'ID.AM', 'Maintain inventories of physical devices, software platforms, applications, and organizational communication flows', '["NIST-CSF-ID.RA", "NIST-CSF-PR.AC"]', '["SOX", "HIPAA", "PCI-DSS"]', 3, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (8, 'NIST-CSF-ID.BE', 'NIST CSF', 'Business Environment', 'The organization''s mission, objectives, stakeholders, and activities are understood and prioritized', '2.0', 'Identify', 'ID.BE', 'Document organizational mission, objectives, and activities', '["NIST-CSF-ID.GV", "NIST-CSF-ID.RA"]', '["SOX", "HIPAA"]', 2, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (9, 'NIST-CSF-ID.GV', 'NIST CSF', 'Governance', 'The policies, procedures, and processes to manage and monitor the organization''s regulatory, legal, risk, environmental, and operational requirements are understood and inform the management of cybersecurity risk', '2.0', 'Identify', 'ID.GV', 'Establish cybersecurity governance and risk management policies', '["NIST-CSF-GV.OC", "NIST-CSF-ID.RM"]', '["SOX", "HIPAA", "PCI-DSS"]', 4, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (10, 'NIST-CSF-ID.RA', 'NIST CSF', 'Risk Assessment', 'The organization understands the cybersecurity risk to organizational operations, organizational assets, and individuals', '2.0', 'Identify', 'ID.RA', 'Conduct regular risk assessments and vulnerability assessments', '["NIST-CSF-ID.AM", "NIST-CSF-ID.RM"]', '["SOX", "HIPAA", "PCI-DSS"]', 3, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (11, 'NIST-CSF-ID.RM', 'NIST CSF', 'Risk Management Strategy', 'The organization''s priorities, constraints, risk tolerances, and assumptions are established and used to support operational risk decisions', '2.0', 'Identify', 'ID.RM', 'Develop and maintain risk management strategy and risk tolerance statements', '["NIST-CSF-ID.GV", "NIST-CSF-ID.RA"]', '["SOX", "HIPAA"]', 3, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (12, 'NIST-CSF-ID.SC', 'NIST CSF', 'Supply Chain Risk Management', 'The organization''s priorities, constraints, risk tolerances, and assumptions are established and used to support risk decisions associated with managing supply chain risk', '2.0', 'Identify', 'ID.SC', 'Implement supply chain risk management processes', '["NIST-CSF-ID.AM", "NIST-CSF-PR.DS"]', '["SOX", "PCI-DSS"]', 2, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (13, 'NIST-800-53-AC-1', 'NIST SP 800-53', 'Access Control Policy and Procedures', 'Develop, document, and disseminate access control policy and procedures', 'Rev 5', 'Access Control', 'AC-1', 'Establish formal access control policy addressing purpose, scope, roles, responsibilities, and compliance', '["NIST-800-53-AC-2", "NIST-800-53-AC-3"]', '["FISMA", "FedRAMP"]', 4, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (14, 'NIST-800-53-AC-2', 'NIST SP 800-53', 'Account Management', 'Manage information system accounts including establishment, activation, modification, review, and removal', 'Rev 5', 'Access Control', 'AC-2', 'Implement automated account management processes and regular account reviews', '["NIST-800-53-AC-1", "NIST-800-53-AC-3"]', '["FISMA", "FedRAMP"]', 3, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (15, 'NIST-800-53-AC-3', 'NIST SP 800-53', 'Access Enforcement', 'Enforce approved authorizations for logical access to information and system resources', 'Rev 5', 'Access Control', 'AC-3', 'Implement role-based access control and principle of least privilege', '["NIST-800-53-AC-2", "NIST-800-53-AC-4"]', '["FISMA", "FedRAMP"]', 4, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (16, 'NIST-800-53-AU-1', 'NIST SP 800-53', 'Audit and Accountability Policy and Procedures', 'Develop, document, and disseminate audit and accountability policy and procedures', 'Rev 5', 'Audit and Accountability', 'AU-1', 'Establish comprehensive audit policy covering events, retention, and review procedures', '["NIST-800-53-AU-2", "NIST-800-53-AU-3"]', '["FISMA", "FedRAMP"]', 3, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (17, 'NIST-800-53-AU-2', 'NIST SP 800-53', 'Event Logging', 'Identify the types of events that the system is capable of logging and coordinate the event logging function with other organizational entities', 'Rev 5', 'Audit and Accountability', 'AU-2', 'Define auditable events and implement comprehensive logging', '["NIST-800-53-AU-1", "NIST-800-53-AU-3"]', '["FISMA", "FedRAMP"]', 3, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (18, 'NIST-800-53-CA-1', 'NIST SP 800-53', 'Assessment, Authorization, and Monitoring Policy and Procedures', 'Develop, document, and disseminate assessment, authorization, and monitoring policy and procedures', 'Rev 5', 'Assessment, Authorization, and Monitoring', 'CA-1', 'Establish security assessment and authorization policies and procedures', '["NIST-800-53-CA-2", "NIST-800-53-CA-3"]', '["FISMA", "FedRAMP"]', 3, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (19, 'NIST-800-53-IA-1', 'NIST SP 800-53', 'Identification and Authentication Policy and Procedures', 'Develop, document, and disseminate identification and authentication policy and procedures', 'Rev 5', 'Identification and Authentication', 'IA-1', 'Establish identity management and authentication policies', '["NIST-800-53-IA-2", "NIST-800-53-IA-3"]', '["FISMA", "FedRAMP"]', 3, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (20, 'NIST-800-53-IA-2', 'NIST SP 800-53', 'Identification and Authentication (Organizational Users)', 'Uniquely identify and authenticate organizational users and associate that unique identification with processes acting on behalf of those users', 'Rev 5', 'Identification and Authentication', 'IA-2', 'Implement multi-factor authentication for organizational users', '["NIST-800-53-IA-1", "NIST-800-53-IA-3"]', '["FISMA", "FedRAMP"]', 4, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (21, 'NIST-800-171-3.1.1', 'NIST SP 800-171', 'Access Control - Authorized Access', 'Limit information system access to authorized users, processes acting on behalf of authorized users, or devices', 'Rev 2', 'Access Control', '3.1.1', 'Implement access control mechanisms to prevent unauthorized access to CUI', '["NIST-800-171-3.1.2", "NIST-800-171-3.5.1"]', '["DFARS", "CMMC"]', 3, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (22, 'NIST-800-171-3.1.2', 'NIST SP 800-171', 'Access Control - Transaction Types', 'Limit information system access to the types of transactions and functions that authorized users are permitted to execute', 'Rev 2', 'Access Control', '3.1.2', 'Implement role-based access controls and function-based restrictions', '["NIST-800-171-3.1.1", "NIST-800-171-3.1.3"]', '["DFARS", "CMMC"]', 3, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (23, 'NIST-800-171-3.3.1', 'NIST SP 800-171', 'Audit and Accountability - Audit Events', 'Create and retain information system audit logs and records to the extent needed to enable the monitoring, analysis, investigation, and reporting of unlawful or unauthorized information system activity', 'Rev 2', 'Audit and Accountability', '3.3.1', 'Implement comprehensive audit logging for CUI systems', '["NIST-800-171-3.3.2", "NIST-800-171-3.3.3"]', '["DFARS", "CMMC"]', 3, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (24, 'NIST-800-171-3.5.1', 'NIST SP 800-171', 'Identification and Authentication - User Identification', 'Identify information system users, processes acting on behalf of users, or devices', 'Rev 2', 'Identification and Authentication', '3.5.1', 'Implement unique user identification for all CUI system users', '["NIST-800-171-3.5.2", "NIST-800-171-3.1.1"]', '["DFARS", "CMMC"]', 3, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (25, 'NIST-800-171-3.5.2', 'NIST SP 800-171', 'Identification and Authentication - User Authentication', 'Authenticate (or verify) the identities of those users, processes, or devices, as a prerequisite to allowing access to organizational information systems', 'Rev 2', 'Identification and Authentication', '3.5.2', 'Implement strong authentication mechanisms for CUI access', '["NIST-800-171-3.5.1", "NIST-800-171-3.5.3"]', '["DFARS", "CMMC"]', 4, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (26, 'NIST-PF-ID-P', 'NIST Privacy Framework', 'Identify-P Function', 'Develop the organizational understanding to manage privacy risk for individuals arising from data processing', '1.0', 'Identify-P', 'ID-P', 'Establish governance, risk management, and data processing inventory', '["NIST-PF-CT-P", "NIST-PF-GV-P"]', '["GDPR", "CCPA", "HIPAA"]', 2, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (27, 'NIST-PF-GV-P', 'NIST Privacy Framework', 'Govern-P Function', 'Develop and implement the organizational governance structure to enable an ongoing understanding of the organization''s risk management priorities that are informed by privacy risk', '1.0', 'Govern-P', 'GV-P', 'Establish privacy governance, policies, and risk management strategy', '["NIST-PF-ID-P", "NIST-PF-CT-P"]', '["GDPR", "CCPA", "HIPAA"]', 3, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (28, 'NIST-PF-CT-P', 'NIST Privacy Framework', 'Control-P Function', 'Develop and implement appropriate data processing safeguards', '1.0', 'Control-P', 'CT-P', 'Implement data processing controls, data quality, and disassociation techniques', '["NIST-PF-ID-P", "NIST-PF-CM-P"]', '["GDPR", "CCPA", "HIPAA"]', 2, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (29, 'NIST-PF-CM-P', 'NIST Privacy Framework', 'Communicate-P Function', 'Develop and implement appropriate activities to enable organizations and individuals to have a reliable understanding about how personal data are processed and associated privacy risks', '1.0', 'Communicate-P', 'CM-P', 'Establish privacy notices, consent management, and stakeholder engagement', '["NIST-PF-CT-P"]', '["GDPR", "CCPA", "HIPAA"]', 2, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (30, 'NIST-AI-RMF-GOVERN', 'NIST AI RMF', 'Govern Function', 'The organization has implemented a governance structure and processes for the oversight, accountability, and responsibility for AI risks and benefits', '1.0', 'Govern', 'GOVERN', 'Establish AI governance, policies, and risk management processes', '["NIST-AI-RMF-MAP", "NIST-AI-RMF-MEASURE"]', '["AI Act", "Algorithmic Accountability"]', 2, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (31, 'NIST-AI-RMF-MAP', 'NIST AI RMF', 'Map Function', 'The context in which the AI system operates is understood, and risks are identified', '1.0', 'Map', 'MAP', 'Identify AI system context, stakeholders, and potential risks and benefits', '["NIST-AI-RMF-GOVERN", "NIST-AI-RMF-MEASURE"]', '["AI Act", "Algorithmic Accountability"]', 2, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (32, 'NIST-AI-RMF-MEASURE', 'NIST AI RMF', 'Measure Function', 'Identified risks are analyzed, understood, and documented', '1.0', 'Measure', 'MEASURE', 'Implement AI risk measurement, monitoring, and assessment processes', '["NIST-AI-RMF-MAP", "NIST-AI-RMF-MANAGE"]', '["AI Act", "Algorithmic Accountability"]', 2, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');
-- INSERT INTO public.nist_references VALUES (33, 'NIST-AI-RMF-MANAGE', 'NIST AI RMF', 'Manage Function', 'Identified risks are prioritized and managed according to organizational risk tolerance', '1.0', 'Manage', 'MANAGE', 'Implement AI risk treatment, monitoring, and continuous improvement', '["NIST-AI-RMF-MEASURE"]', '["AI Act", "Algorithmic Accountability"]', 2, true, '2025-07-12 15:06:36.033944+00', '2025-07-12 15:06:36.033944+00');


-- --
-- -- TOC entry 6883 (class 0 OID 860195)
-- -- Dependencies: 540
-- -- Data for Name: organization_sla_config; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.organization_sla_config VALUES (1, 2, 1, true, '2025-07-20 19:42:35.928247', 'system');
-- INSERT INTO public.organization_sla_config VALUES (2, 1, 1, true, '2025-07-20 19:42:35.928247', 'system');
-- INSERT INTO public.organization_sla_config VALUES (3, 9, 1, true, '2025-07-20 19:42:35.928247', 'system');
-- INSERT INTO public.organization_sla_config VALUES (4, 10, 1, true, '2025-07-20 19:42:35.928247', 'system');


-- --
-- -- TOC entry 6589 (class 0 OID 49153)
-- -- Dependencies: 243
-- -- Data for Name: organizations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.organizations OVERRIDING SYSTEM VALUE VALUES (2, 'ABC Bank', 'ABC Bank is tier 2 bank', 'Mirdif Dubai
-- Villa 05', '0506583714', 'admin@abcbank.com', 'www.abcbank.com', 'Active', '2025-06-21 11:49:13.370314', '2025-06-21 11:49:13.370314', 1, 'org_abc_bank', true);
-- INSERT INTO public.organizations OVERRIDING SYSTEM VALUE VALUES (1, 'TechCorp Solutions', 'Leading technology solutions provider', '123 Tech Street, Silicon Valley, CA 94000', '+1-555-0123', 'info@techcorp.com', 'https://www.techcorp.com', 'Active', '2025-06-21 11:40:22.18927', '2025-06-21 13:08:07.485939', 2, 'org_techcorp_solutions', true);
-- INSERT INTO public.organizations OVERRIDING SYSTEM VALUE VALUES (9, 'Strop Bank', 'Retail bank', '123 Drive, Dubai', '+971506583714', 'ciso@stropbank.com', 'www.strop.com', 'Active', '2025-07-15 00:16:54.317033', '2025-07-15 00:16:54.317033', 3, 'org_strop_bank', true);
-- INSERT INTO public.organizations OVERRIDING SYSTEM VALUE VALUES (10, 'BZD Bank', 'retail banking', 'Mirdif Dubai
-- Villa 05', '+971544374848', 'admin@bzdbank.com', 'www.bzd.com', 'Active', '2025-07-18 17:58:43.374795', '2025-07-18 17:58:43.374795', 5, 'org_bzd_bank', true);
-- INSERT INTO public.organizations OVERRIDING SYSTEM VALUE VALUES (11, 'AI Solutions Inc', NULL, NULL, NULL, NULL, NULL, 'Active', '2025-07-22 11:21:45.977948', '2025-07-22 11:21:45.977948', 6, 'public', true);
-- INSERT INTO public.organizations OVERRIDING SYSTEM VALUE VALUES (14, 'Company One Ltd', NULL, NULL, NULL, NULL, NULL, 'Active', '2025-07-22 11:57:54.853942', '2025-07-22 11:57:54.853942', 9, 'org_company1', true);
-- INSERT INTO public.organizations OVERRIDING SYSTEM VALUE VALUES (15, 'Company Two Corp', NULL, NULL, NULL, NULL, NULL, 'Active', '2025-07-22 11:57:54.853942', '2025-07-22 11:57:54.853942', 10, 'org_company2', true);
-- INSERT INTO public.organizations OVERRIDING SYSTEM VALUE VALUES (16, 'Tech Solutions Inc', NULL, NULL, NULL, NULL, NULL, 'Active', '2025-07-22 11:57:54.853942', '2025-07-22 11:57:54.853942', 11, 'org_techsolutions', true);
-- INSERT INTO public.organizations OVERRIDING SYSTEM VALUE VALUES (17, 'Tech Solutions Inc', NULL, NULL, NULL, NULL, NULL, 'Active', '2025-07-22 16:28:23.969053', '2025-07-22 16:28:23.969053', 12, 'tech_solutions', true);
-- INSERT INTO public.organizations OVERRIDING SYSTEM VALUE VALUES (18, 'Healthcare Corp', NULL, NULL, NULL, NULL, NULL, 'Active', '2025-07-22 16:28:23.969053', '2025-07-22 16:28:23.969053', 13, 'healthcare_corp', true);
-- INSERT INTO public.organizations OVERRIDING SYSTEM VALUE VALUES (19, 'Financial Services Ltd', NULL, NULL, NULL, NULL, NULL, 'Active', '2025-07-22 16:28:23.969053', '2025-07-22 16:28:23.969053', 14, 'financial_services', true);


-- --
-- -- TOC entry 6861 (class 0 OID 794639)
-- -- Dependencies: 518
-- -- Data for Name: pages; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.pages VALUES (1, 'Dashboard', '/', 'Main dashboard and analytics', 'Dashboard', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (2, 'Risk Management - ISO 27001', '/risks/iso27001', 'ISO 27001 risk management', 'Risk Management', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (3, 'Risk Management - NIST CSF', '/risks/nist-csf', 'NIST Cybersecurity Framework', 'Risk Management', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (4, 'Risk Management - FAIR', '/risks/fair', 'FAIR risk analysis', 'Risk Management', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (5, 'Risk Management - Threats', '/risks/threats', 'Threat management', 'Risk Management', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (6, 'Risk Management - Threat Assessments', '/risks/threat-assessments', 'Threat assessments', 'Risk Management', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (7, 'Compliance', '/compliance', 'Compliance management and tracking', 'Compliance', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (8, 'Assets', '/assets', 'Asset inventory and management', 'Asset Management', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (9, 'Vulnerabilities', '/vulnerabilities', 'Vulnerability management', 'Security', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (10, 'Assessments', '/assessments', 'Security assessments', 'Assessment', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (11, 'Findings', '/findings', 'Assessment findings management', 'Assessment', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (12, 'Incidents', '/incidents', 'Incident management', 'Security', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (13, 'Audit', '/audit', 'Audit logs and tracking', 'Audit', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (14, 'Third Party Risk', '/third-party-risk', 'Third party risk management', 'Risk Management', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (15, 'AI Analysis', '/ai-analysis', 'AI-powered analysis and insights', 'Analytics', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (16, 'Analytics', '/analytics', 'Business intelligence and reporting', 'Analytics', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (17, 'Organizations', '/organizations', 'Organization management', 'Administration', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (18, 'Users', '/users', 'User management', 'Administration', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');
-- INSERT INTO public.pages VALUES (19, 'Settings', '/settings', 'System settings and configuration', 'Administration', '2025-07-18 21:22:42.145482', true, '2025-07-18 21:40:12.86331');


-- --
-- -- TOC entry 6874 (class 0 OID 811034)
-- -- Dependencies: 531
-- -- Data for Name: parent_departments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.parent_departments VALUES (2, 'Innovation');
-- INSERT INTO public.parent_departments VALUES (1, 'Information Technology');
-- INSERT INTO public.parent_departments VALUES (3, 'Information Security');


-- --
-- -- TOC entry 6865 (class 0 OID 794763)
-- -- Dependencies: 522
-- -- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.permissions VALUES (7, 'view', 'View/Read access to resources', 'read', true, '2025-07-18 21:45:26.313595', '2025-07-18 21:45:26.313595');
-- INSERT INTO public.permissions VALUES (8, 'create', 'Create new resources', 'write', true, '2025-07-18 21:45:26.313595', '2025-07-18 21:45:26.313595');
-- INSERT INTO public.permissions VALUES (9, 'edit', 'Edit/Update existing resources', 'write', true, '2025-07-18 21:45:26.313595', '2025-07-18 21:45:26.313595');
-- INSERT INTO public.permissions VALUES (10, 'delete', 'Delete resources', 'delete', true, '2025-07-18 21:45:26.313595', '2025-07-18 21:45:26.313595');
-- INSERT INTO public.permissions VALUES (11, 'export', 'Export data', 'export', true, '2025-07-18 21:45:26.313595', '2025-07-18 21:45:26.313595');
-- INSERT INTO public.permissions VALUES (12, 'admin', 'Full administrative access', 'admin', true, '2025-07-18 21:45:26.313595', '2025-07-18 21:45:26.313595');


-- --
-- -- TOC entry 6707 (class 0 OID 278722)
-- -- Dependencies: 361
-- -- Data for Name: phishing_simulation_results; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6705 (class 0 OID 278706)
-- -- Dependencies: 359
-- -- Data for Name: phishing_simulations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.phishing_simulations VALUES (1, 'Q1 2024 Phishing Test', 'Quarterly phishing simulation to test employee awareness', 'email', NULL, '2025-07-17 00:00:00', '2025-07-31 00:00:00', 'draft', 0.00, 0.00, 0, 0, 0, 1, '2025-07-10 23:08:54.505786');


-- --
-- -- TOC entry 6573 (class 0 OID 16480)
-- -- Dependencies: 227
-- -- Data for Name: playing_with_neon; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.playing_with_neon VALUES (1, 'c4ca4238a0', 0.2606507);
-- INSERT INTO public.playing_with_neon VALUES (2, 'c81e728d9d', 0.57498676);
-- INSERT INTO public.playing_with_neon VALUES (3, 'eccbc87e4b', 0.78409034);
-- INSERT INTO public.playing_with_neon VALUES (4, 'a87ff679a2', 0.10530971);
-- INSERT INTO public.playing_with_neon VALUES (5, 'e4da3b7fbb', 0.9773649);
-- INSERT INTO public.playing_with_neon VALUES (6, '1679091c5a', 0.38971254);
-- INSERT INTO public.playing_with_neon VALUES (7, '8f14e45fce', 0.6668908);
-- INSERT INTO public.playing_with_neon VALUES (8, 'c9f0f895fb', 0.57040656);
-- INSERT INTO public.playing_with_neon VALUES (9, '45c48cce2e', 0.5592517);
-- INSERT INTO public.playing_with_neon VALUES (10, 'd3d9446802', 0.1541998);


-- --
-- -- TOC entry 6790 (class 0 OID 540673)
-- -- Dependencies: 446
-- -- Data for Name: policies; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.policies VALUES (1, 'POL-001', 'Information Security Policy', 'Comprehensive information security policy covering all aspects of data protection and security controls', 'Security', NULL, NULL, 'approved', 'critical', '2024-01-01', '2024-01-01', '2025-01-01', '2.1', 'This policy establishes the framework for information security management...', '{security,data-protection,access-control}', '{ISO27001,SOC2}', '2025-07-15 21:57:53.754713', '2025-07-15 21:57:53.754713', 'admin', 'admin');
-- INSERT INTO public.policies VALUES (2, 'POL-002', 'Data Privacy Policy', 'Policy governing the collection, processing, and protection of personal data', 'Privacy', NULL, NULL, 'approved', 'critical', '2024-01-15', '2024-01-15', '2025-01-15', '1.3', 'This policy defines how personal data is handled in compliance with privacy regulations...', '{privacy,gdpr,personal-data}', '{GDPR,CCPA}', '2025-07-15 21:57:53.754713', '2025-07-15 21:57:53.754713', 'admin', 'admin');
-- INSERT INTO public.policies VALUES (3, 'POL-003', 'Access Control Policy', 'Policy defining user access rights and authentication requirements', 'Security', NULL, NULL, 'approved', 'high', '2024-02-01', '2024-02-01', '2025-02-01', '1.5', 'This policy establishes standards for user access management and authentication...', '{access-control,authentication,authorization}', '{ISO27001,NIST}', '2025-07-15 21:57:53.754713', '2025-07-15 21:57:53.754713', 'admin', 'admin');
-- INSERT INTO public.policies VALUES (4, 'POL-004', 'Incident Response Policy', 'Policy for handling and responding to security incidents', 'Security', NULL, NULL, 'approved', 'high', '2024-02-15', '2024-02-15', '2025-02-15', '1.2', 'This policy defines the procedures for incident detection, response, and recovery...', '{incident-response,security,emergency}', '{ISO27001,NIST}', '2025-07-15 21:57:53.754713', '2025-07-15 21:57:53.754713', 'admin', 'admin');
-- INSERT INTO public.policies VALUES (5, 'POL-005', 'Business Continuity Policy', 'Policy ensuring business operations continuity during disruptions', 'Operations', NULL, NULL, 'review', 'high', '2024-03-01', '2024-03-01', '2025-03-01', '1.0', 'This policy outlines the framework for maintaining business operations during disruptions...', '{business-continuity,disaster-recovery,operations}', '{ISO22301}', '2025-07-15 21:57:53.754713', '2025-07-15 21:57:53.754713', 'admin', 'admin');
-- INSERT INTO public.policies VALUES (6, 'POL-006', 'Vendor Management Policy', 'Policy for managing third-party vendors and suppliers', 'Procurement', NULL, NULL, 'draft', 'medium', NULL, NULL, '2024-12-01', '0.9', 'This policy establishes requirements for vendor selection, management, and monitoring...', '{vendor-management,third-party,procurement}', '{SOC2}', '2025-07-15 21:57:53.754713', '2025-07-15 21:57:53.754713', 'admin', 'admin');
-- INSERT INTO public.policies VALUES (7, 'POL-007', 'Data Retention Policy', 'Policy defining data retention and disposal requirements', 'Data Management', NULL, NULL, 'approved', 'medium', '2024-01-01', '2024-01-01', '2025-01-01', '1.1', 'This policy establishes requirements for data retention, archival, and secure disposal...', '{data-retention,data-disposal,records-management}', '{GDPR,SOX}', '2025-07-15 21:57:53.754713', '2025-07-15 21:57:53.754713', 'admin', 'admin');
-- INSERT INTO public.policies VALUES (8, 'POL-008', 'Remote Work Policy', 'Policy governing remote work arrangements and security requirements', 'HR', NULL, NULL, 'approved', 'medium', '2024-01-01', '2024-01-01', '2024-12-01', '2.0', 'This policy defines the requirements and guidelines for remote work arrangements...', '{remote-work,security,hr}', '{ISO27001}', '2025-07-15 21:57:53.754713', '2025-07-15 21:57:53.754713', 'admin', 'admin');


-- --
-- -- TOC entry 6774 (class 0 OID 532520)
-- -- Dependencies: 430
-- -- Data for Name: policy_document_versions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6772 (class 0 OID 532496)
-- -- Dependencies: 428
-- -- Data for Name: policy_documents; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6796 (class 0 OID 540723)
-- -- Dependencies: 452
-- -- Data for Name: policy_evidence_links; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.policy_evidence_links VALUES (1, 1, 1, 'supports', '2025-07-15 21:57:53.754713', 'admin');
-- INSERT INTO public.policy_evidence_links VALUES (2, 1, 2, 'validates', '2025-07-15 21:57:53.754713', 'admin');
-- INSERT INTO public.policy_evidence_links VALUES (3, 1, 5, 'demonstrates', '2025-07-15 21:57:53.754713', 'admin');
-- INSERT INTO public.policy_evidence_links VALUES (4, 2, 3, 'implements', '2025-07-15 21:57:53.754713', 'admin');
-- INSERT INTO public.policy_evidence_links VALUES (5, 3, 7, 'validates', '2025-07-15 21:57:53.754713', 'admin');
-- INSERT INTO public.policy_evidence_links VALUES (6, 4, 6, 'validates', '2025-07-15 21:57:53.754713', 'admin');
-- INSERT INTO public.policy_evidence_links VALUES (7, 1, 8, 'supports', '2025-07-15 21:57:53.754713', 'admin');
-- INSERT INTO public.policy_evidence_links VALUES (8, 5, 4, 'supports', '2025-07-15 21:57:53.754713', 'admin');


-- --
-- -- TOC entry 6792 (class 0 OID 540691)
-- -- Dependencies: 448
-- -- Data for Name: policy_versions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6699 (class 0 OID 278645)
-- -- Dependencies: 353
-- -- Data for Name: quiz_attempts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6693 (class 0 OID 278582)
-- -- Dependencies: 347
-- -- Data for Name: quiz_questions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.quiz_questions VALUES (1, 3, 'What does CIA stand for in cybersecurity?', 'multiple_choice', '["Central Intelligence Agency", "Confidentiality, Integrity, Availability", "Cyber Intelligence Analysis", "Computer Information Access"]', 'Confidentiality, Integrity, Availability', 'CIA in cybersecurity refers to the three pillars: Confidentiality, Integrity, and Availability of information.', 2, 1, true, '2025-07-10 23:08:54.505786');
-- INSERT INTO public.quiz_questions VALUES (2, 3, 'Malware is software designed to harm computer systems.', 'true_false', '["True", "False"]', 'True', 'Malware (malicious software) is indeed designed to damage, disrupt, or gain unauthorized access to computer systems.', 1, 2, true, '2025-07-10 23:08:54.505786');
-- INSERT INTO public.quiz_questions VALUES (3, 3, 'Which of the following is NOT a type of malware?', 'multiple_choice', '["Virus", "Trojan", "Firewall", "Ransomware"]', 'Firewall', 'A firewall is a security tool that protects against threats, not a type of malware.', 2, 3, true, '2025-07-10 23:08:54.505786');
-- INSERT INTO public.quiz_questions VALUES (4, 6, 'What should you do if you receive a suspicious email?', 'multiple_choice', '["Click the link to verify", "Reply asking for verification", "Report it to IT security", "Forward it to colleagues"]', 'Report it to IT security', 'Always report suspicious emails to your IT security team rather than interacting with them.', 2, 1, true, '2025-07-10 23:08:54.505786');
-- INSERT INTO public.quiz_questions VALUES (5, 6, 'Phishing attacks only come through email.', 'true_false', '["True", "False"]', 'False', 'Phishing can occur through email, SMS, phone calls, social media, and other communication channels.', 1, 2, true, '2025-07-10 23:08:54.505786');


-- --
-- -- TOC entry 6719 (class 0 OID 294913)
-- -- Dependencies: 373
-- -- Data for Name: report_downloads; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6655 (class 0 OID 131126)
-- -- Dependencies: 309
-- -- Data for Name: residual_risk_calculations; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6727 (class 0 OID 311338)
-- -- Dependencies: 381
-- -- Data for Name: risk_action_plans; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6625 (class 0 OID 114734)
-- -- Dependencies: 279
-- -- Data for Name: risk_assessment_context; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.risk_assessment_context VALUES (1, 1, '', '', '', '', '', '', '', '2025-06-22 13:17:12.159671');
-- INSERT INTO public.risk_assessment_context VALUES (2, 2, 'ISMS Security implementation', 'ISMS Security implementation', '', 'ISMS Security implementation', 'ISMS Security implementation', '', '', '2025-06-22 21:53:01.039325');


-- --
-- -- TOC entry 6725 (class 0 OID 311320)
-- -- Dependencies: 379
-- -- Data for Name: risk_assessment_controls; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6627 (class 0 OID 114749)
-- -- Dependencies: 281
-- -- Data for Name: risk_assessment_criteria; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.risk_assessment_criteria VALUES (1, 1, '[{"name": "Very Low", "color": "green", "level": 1, "description": "Rare occurrence (0-5%)"}, {"name": "Low", "color": "blue", "level": 2, "description": "Unlikely to occur (6-25%)"}, {"name": "Medium", "color": "yellow", "level": 3, "description": "Possible occurrence (26-50%)"}, {"name": "High", "color": "orange", "level": 4, "description": "Likely to occur (51-75%)"}, {"name": "Very High", "color": "red", "level": 5, "description": "Almost certain (76-100%)"}]', '[{"name": "Negligible", "color": "green", "level": 1, "description": "Minimal impact on operations"}, {"name": "Minor", "color": "blue", "level": 2, "description": "Limited impact, easily managed"}, {"name": "Moderate", "color": "yellow", "level": 3, "description": "Noticeable impact requiring management attention"}, {"name": "Major", "color": "orange", "level": 4, "description": "Significant impact affecting business operations"}, {"name": "Catastrophic", "color": "red", "level": 5, "description": "Severe impact threatening business continuity"}]', '[{"color": "green", "level": "Very Low", "score": 1, "impact": 1, "likelihood": 1}, {"color": "green", "level": "Very Low", "score": 2, "impact": 2, "likelihood": 1}, {"color": "green", "level": "Very Low", "score": 3, "impact": 3, "likelihood": 1}, {"color": "green", "level": "Very Low", "score": 4, "impact": 4, "likelihood": 1}, {"color": "blue", "level": "Low", "score": 5, "impact": 5, "likelihood": 1}, {"color": "green", "level": "Very Low", "score": 2, "impact": 1, "likelihood": 2}, {"color": "green", "level": "Very Low", "score": 4, "impact": 2, "likelihood": 2}, {"color": "blue", "level": "Low", "score": 6, "impact": 3, "likelihood": 2}, {"color": "blue", "level": "Low", "score": 8, "impact": 4, "likelihood": 2}, {"color": "yellow", "level": "Medium", "score": 10, "impact": 5, "likelihood": 2}, {"color": "green", "level": "Very Low", "score": 3, "impact": 1, "likelihood": 3}, {"color": "blue", "level": "Low", "score": 6, "impact": 2, "likelihood": 3}, {"color": "blue", "level": "Low", "score": 9, "impact": 3, "likelihood": 3}, {"color": "yellow", "level": "Medium", "score": 12, "impact": 4, "likelihood": 3}, {"color": "orange", "level": "High", "score": 15, "impact": 5, "likelihood": 3}, {"color": "green", "level": "Very Low", "score": 4, "impact": 1, "likelihood": 4}, {"color": "blue", "level": "Low", "score": 8, "impact": 2, "likelihood": 4}, {"color": "yellow", "level": "Medium", "score": 12, "impact": 3, "likelihood": 4}, {"color": "orange", "level": "High", "score": 16, "impact": 4, "likelihood": 4}, {"color": "red", "level": "Critical", "score": 20, "impact": 5, "likelihood": 4}, {"color": "blue", "level": "Low", "score": 5, "impact": 1, "likelihood": 5}, {"color": "yellow", "level": "Medium", "score": 10, "impact": 2, "likelihood": 5}, {"color": "orange", "level": "High", "score": 15, "impact": 3, "likelihood": 5}, {"color": "red", "level": "Critical", "score": 20, "impact": 4, "likelihood": 5}, {"color": "red", "level": "Critical", "score": 25, "impact": 5, "likelihood": 5}]', '', '', '2025-06-22 13:17:12.848516');
-- INSERT INTO public.risk_assessment_criteria VALUES (2, 2, '[{"name": "Very Low", "color": "green", "level": 1, "description": "Rare occurrence (0-5%)"}, {"name": "Low", "color": "blue", "level": 2, "description": "Unlikely to occur (6-25%)"}, {"name": "Medium", "color": "yellow", "level": 3, "description": "Possible occurrence (26-50%)"}, {"name": "High", "color": "orange", "level": 4, "description": "Likely to occur (51-75%)"}, {"name": "Very High", "color": "red", "level": 5, "description": "Almost certain (76-100%)"}]', '[{"name": "Negligible", "color": "green", "level": 1, "description": "Minimal impact on operations"}, {"name": "Minor", "color": "blue", "level": 2, "description": "Limited impact, easily managed"}, {"name": "Moderate", "color": "yellow", "level": 3, "description": "Noticeable impact requiring management attention"}, {"name": "Major", "color": "orange", "level": 4, "description": "Significant impact affecting business operations"}, {"name": "Catastrophic", "color": "red", "level": 5, "description": "Severe impact threatening business continuity"}]', '[{"color": "green", "level": "Very Low", "score": 1, "impact": 1, "likelihood": 1}, {"color": "green", "level": "Very Low", "score": 2, "impact": 2, "likelihood": 1}, {"color": "green", "level": "Very Low", "score": 3, "impact": 3, "likelihood": 1}, {"color": "green", "level": "Very Low", "score": 4, "impact": 4, "likelihood": 1}, {"color": "blue", "level": "Low", "score": 5, "impact": 5, "likelihood": 1}, {"color": "green", "level": "Very Low", "score": 2, "impact": 1, "likelihood": 2}, {"color": "green", "level": "Very Low", "score": 4, "impact": 2, "likelihood": 2}, {"color": "blue", "level": "Low", "score": 6, "impact": 3, "likelihood": 2}, {"color": "blue", "level": "Low", "score": 8, "impact": 4, "likelihood": 2}, {"color": "yellow", "level": "Medium", "score": 10, "impact": 5, "likelihood": 2}, {"color": "green", "level": "Very Low", "score": 3, "impact": 1, "likelihood": 3}, {"color": "blue", "level": "Low", "score": 6, "impact": 2, "likelihood": 3}, {"color": "blue", "level": "Low", "score": 9, "impact": 3, "likelihood": 3}, {"color": "yellow", "level": "Medium", "score": 12, "impact": 4, "likelihood": 3}, {"color": "orange", "level": "High", "score": 15, "impact": 5, "likelihood": 3}, {"color": "green", "level": "Very Low", "score": 4, "impact": 1, "likelihood": 4}, {"color": "blue", "level": "Low", "score": 8, "impact": 2, "likelihood": 4}, {"color": "yellow", "level": "Medium", "score": 12, "impact": 3, "likelihood": 4}, {"color": "orange", "level": "High", "score": 16, "impact": 4, "likelihood": 4}, {"color": "red", "level": "Critical", "score": 20, "impact": 5, "likelihood": 4}, {"color": "blue", "level": "Low", "score": 5, "impact": 1, "likelihood": 5}, {"color": "yellow", "level": "Medium", "score": 10, "impact": 2, "likelihood": 5}, {"color": "orange", "level": "High", "score": 15, "impact": 3, "likelihood": 5}, {"color": "red", "level": "Critical", "score": 20, "impact": 4, "likelihood": 5}, {"color": "red", "level": "Critical", "score": 25, "impact": 5, "likelihood": 5}]', '', '', '2025-06-22 21:53:01.675761');


-- --
-- -- TOC entry 6615 (class 0 OID 98385)
-- -- Dependencies: 269
-- -- Data for Name: risk_assessment_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6631 (class 0 OID 114784)
-- -- Dependencies: 285
-- -- Data for Name: risk_assessment_reviews; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6623 (class 0 OID 114719)
-- -- Dependencies: 277
-- -- Data for Name: risk_assessment_scope; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.risk_assessment_scope VALUES (1, 1, 'System', 'knmk', '', '', '', 'High', '2025-06-22 13:17:11.614033');


-- --
-- -- TOC entry 6621 (class 0 OID 114703)
-- -- Dependencies: 275
-- -- Data for Name: risk_assessment_steps; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.risk_assessment_steps VALUES (1, 1, 1, 'Define Scope and Context', 'Establish the scope, boundaries, and context of the risk assessment', 'Pending', NULL, NULL, NULL, NULL, '2025-06-22 13:17:09.287449');
-- INSERT INTO public.risk_assessment_steps VALUES (2, 1, 2, 'Risk Identification', 'Identify information security risks within the defined scope', 'Pending', NULL, NULL, NULL, NULL, '2025-06-22 13:17:09.69417');
-- INSERT INTO public.risk_assessment_steps VALUES (3, 1, 3, 'Risk Analysis', 'Analyze identified risks to determine likelihood and impact', 'Pending', NULL, NULL, NULL, NULL, '2025-06-22 13:17:09.986724');
-- INSERT INTO public.risk_assessment_steps VALUES (4, 1, 4, 'Risk Evaluation', 'Evaluate risks against established criteria and risk appetite', 'Pending', NULL, NULL, NULL, NULL, '2025-06-22 13:17:10.273665');
-- INSERT INTO public.risk_assessment_steps VALUES (5, 1, 5, 'Risk Treatment', 'Develop and implement risk treatment plans', 'Pending', NULL, NULL, NULL, NULL, '2025-06-22 13:17:10.581714');
-- INSERT INTO public.risk_assessment_steps VALUES (6, 1, 6, 'Review and Approval', 'Review assessment results and obtain management approval', 'Pending', NULL, NULL, NULL, NULL, '2025-06-22 13:17:10.875211');
-- INSERT INTO public.risk_assessment_steps VALUES (7, 2, 1, 'Define Scope and Context', 'Establish the scope, boundaries, and context of the risk assessment', 'Pending', NULL, NULL, NULL, NULL, '2025-06-22 21:52:58.507757');
-- INSERT INTO public.risk_assessment_steps VALUES (8, 2, 2, 'Risk Identification', 'Identify information security risks within the defined scope', 'Pending', NULL, NULL, NULL, NULL, '2025-06-22 21:52:58.880183');
-- INSERT INTO public.risk_assessment_steps VALUES (9, 2, 3, 'Risk Analysis', 'Analyze identified risks to determine likelihood and impact', 'Pending', NULL, NULL, NULL, NULL, '2025-06-22 21:52:59.150891');
-- INSERT INTO public.risk_assessment_steps VALUES (10, 2, 4, 'Risk Evaluation', 'Evaluate risks against established criteria and risk appetite', 'Pending', NULL, NULL, NULL, NULL, '2025-06-22 21:52:59.484918');
-- INSERT INTO public.risk_assessment_steps VALUES (11, 2, 5, 'Risk Treatment', 'Develop and implement risk treatment plans', 'Pending', NULL, NULL, NULL, NULL, '2025-06-22 21:52:59.805986');
-- INSERT INTO public.risk_assessment_steps VALUES (12, 2, 6, 'Review and Approval', 'Review assessment results and obtain management approval', 'Pending', NULL, NULL, NULL, NULL, '2025-06-22 21:53:00.152871');


-- --
-- -- TOC entry 6633 (class 0 OID 114799)
-- -- Dependencies: 287
-- -- Data for Name: risk_assessment_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.risk_assessment_templates VALUES (1, 'ISO 27001 Risk Assessment', 'ISO27001', 'Comprehensive risk assessment following ISO 27001 standards', '[{"name": "Define Scope and Context", "step": 1, "description": "Establish the scope, boundaries, and context of the risk assessment"}, {"name": "Risk Identification", "step": 2, "description": "Identify information security risks within the defined scope"}, {"name": "Risk Analysis", "step": 3, "description": "Analyze identified risks to determine likelihood and impact"}, {"name": "Risk Evaluation", "step": 4, "description": "Evaluate risks against established criteria and risk appetite"}, {"name": "Risk Treatment", "step": 5, "description": "Develop and implement risk treatment plans"}, {"name": "Review and Approval", "step": 6, "description": "Review assessment results and obtain management approval"}]', '{"impact": [{"name": "Negligible", "color": "green", "level": 1, "description": "Minimal impact on operations"}, {"name": "Minor", "color": "blue", "level": 2, "description": "Limited impact, easily managed"}, {"name": "Moderate", "color": "yellow", "level": 3, "description": "Noticeable impact requiring management attention"}, {"name": "Major", "color": "orange", "level": 4, "description": "Significant impact affecting business operations"}, {"name": "Catastrophic", "color": "red", "level": 5, "description": "Severe impact threatening business continuity"}], "likelihood": [{"name": "Very Low", "color": "green", "level": 1, "description": "Rare occurrence (0-5%)"}, {"name": "Low", "color": "blue", "level": 2, "description": "Unlikely to occur (6-25%)"}, {"name": "Medium", "color": "yellow", "level": 3, "description": "Possible occurrence (26-50%)"}, {"name": "High", "color": "orange", "level": 4, "description": "Likely to occur (51-75%)"}, {"name": "Very High", "color": "red", "level": 5, "description": "Almost certain (76-100%)"}]}', true, 'system', '2025-06-22 13:15:11.917928');
-- INSERT INTO public.risk_assessment_templates VALUES (2, 'NIST Cybersecurity Framework', 'NIST', 'Risk assessment based on NIST Cybersecurity Framework', '[{"name": "Identify", "step": 1, "description": "Identify assets, threats, and vulnerabilities"}, {"name": "Protect", "step": 2, "description": "Assess current protective measures"}, {"name": "Detect", "step": 3, "description": "Evaluate detection capabilities"}, {"name": "Respond", "step": 4, "description": "Review incident response procedures"}, {"name": "Recover", "step": 5, "description": "Assess recovery and continuity plans"}, {"name": "Risk Treatment", "step": 6, "description": "Develop comprehensive risk treatment strategy"}]', '{"impact": [{"name": "Very Low", "color": "green", "level": 1, "description": "Minimal business impact"}, {"name": "Low", "color": "blue", "level": 2, "description": "Minor business impact"}, {"name": "Medium", "color": "yellow", "level": 3, "description": "Moderate business impact"}, {"name": "High", "color": "orange", "level": 4, "description": "Major business impact"}, {"name": "Very High", "color": "red", "level": 5, "description": "Catastrophic business impact"}], "likelihood": [{"name": "Very Low", "color": "green", "level": 1, "description": "Highly unlikely"}, {"name": "Low", "color": "blue", "level": 2, "description": "Unlikely"}, {"name": "Medium", "color": "yellow", "level": 3, "description": "Possible"}, {"name": "High", "color": "orange", "level": 4, "description": "Likely"}, {"name": "Very High", "color": "red", "level": 5, "description": "Almost certain"}]}', true, 'system', '2025-06-22 13:15:11.917928');
-- INSERT INTO public.risk_assessment_templates VALUES (3, 'ISO 27001 Risk Assessment', 'ISO27001', 'Comprehensive risk assessment following ISO 27001 standards', '[{"name": "Define Scope and Context", "step": 1, "description": "Establish the scope, boundaries, and context of the risk assessment"}, {"name": "Risk Identification", "step": 2, "description": "Identify information security risks within the defined scope"}, {"name": "Risk Analysis", "step": 3, "description": "Analyze identified risks to determine likelihood and impact"}, {"name": "Risk Evaluation", "step": 4, "description": "Evaluate risks against established criteria and risk appetite"}, {"name": "Risk Treatment", "step": 5, "description": "Develop and implement risk treatment plans"}, {"name": "Review and Approval", "step": 6, "description": "Review assessment results and obtain management approval"}]', '{"impact": [{"name": "Negligible", "color": "green", "level": 1, "description": "Minimal impact on operations"}, {"name": "Minor", "color": "blue", "level": 2, "description": "Limited impact, easily managed"}, {"name": "Moderate", "color": "yellow", "level": 3, "description": "Noticeable impact requiring management attention"}, {"name": "Major", "color": "orange", "level": 4, "description": "Significant impact affecting business operations"}, {"name": "Catastrophic", "color": "red", "level": 5, "description": "Severe impact threatening business continuity"}], "likelihood": [{"name": "Very Low", "color": "green", "level": 1, "description": "Rare occurrence (0-5%)"}, {"name": "Low", "color": "blue", "level": 2, "description": "Unlikely to occur (6-25%)"}, {"name": "Medium", "color": "yellow", "level": 3, "description": "Possible occurrence (26-50%)"}, {"name": "High", "color": "orange", "level": 4, "description": "Likely to occur (51-75%)"}, {"name": "Very High", "color": "red", "level": 5, "description": "Almost certain (76-100%)"}]}', true, 'system', '2025-06-22 13:33:33.918351');
-- INSERT INTO public.risk_assessment_templates VALUES (4, 'NIST Cybersecurity Framework', 'NIST', 'Risk assessment based on NIST Cybersecurity Framework', '[{"name": "Identify", "step": 1, "description": "Identify assets, threats, and vulnerabilities"}, {"name": "Protect", "step": 2, "description": "Assess current protective measures"}, {"name": "Detect", "step": 3, "description": "Evaluate detection capabilities"}, {"name": "Respond", "step": 4, "description": "Review incident response procedures"}, {"name": "Recover", "step": 5, "description": "Assess recovery and continuity plans"}, {"name": "Risk Treatment", "step": 6, "description": "Develop comprehensive risk treatment strategy"}]', '{"impact": [{"name": "Very Low", "color": "green", "level": 1, "description": "Minimal business impact"}, {"name": "Low", "color": "blue", "level": 2, "description": "Minor business impact"}, {"name": "Medium", "color": "yellow", "level": 3, "description": "Moderate business impact"}, {"name": "High", "color": "orange", "level": 4, "description": "Major business impact"}, {"name": "Very High", "color": "red", "level": 5, "description": "Catastrophic business impact"}], "likelihood": [{"name": "Very Low", "color": "green", "level": 1, "description": "Highly unlikely"}, {"name": "Low", "color": "blue", "level": 2, "description": "Unlikely"}, {"name": "Medium", "color": "yellow", "level": 3, "description": "Possible"}, {"name": "High", "color": "orange", "level": 4, "description": "Likely"}, {"name": "Very High", "color": "red", "level": 5, "description": "Almost certain"}]}', true, 'system', '2025-06-22 13:33:33.918351');


-- --
-- -- TOC entry 6619 (class 0 OID 114689)
-- -- Dependencies: 273
-- -- Data for Name: risk_assessment_workflows; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.risk_assessment_workflows VALUES (1, 'WF-1750598228126', 'pop', 'popo', 'ISO27001', 'mkmkmklmlkmk', 'Annual', 'Draft', 'current_user', 'kol', '2025-06-23', '2025-07-12', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-22 13:17:08.572344', '2025-06-22 13:17:08.572344');
-- INSERT INTO public.risk_assessment_workflows VALUES (2, 'WF-1750629177496', 'Wokirl', '', 'ISO27001', 'ewfklnewklflkewnklfnew', 'Initial', 'Draft', 'current_user', 'syed@abc.com', '2025-06-24', '2025-11-30', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-06-22 21:52:57.889162', '2025-06-22 21:52:57.889162');


-- --
-- -- TOC entry 6746 (class 0 OID 409914)
-- -- Dependencies: 401
-- -- Data for Name: risk_assessments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6729 (class 0 OID 327716)
-- -- Dependencies: 384
-- -- Data for Name: risk_asset_relationships; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6744 (class 0 OID 409888)
-- -- Dependencies: 399
-- -- Data for Name: risk_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.risk_categories VALUES ('0d590e62-5d87-4a7e-8c76-41faf1834f82', 'Operational', 'Risks related to day-to-day business operations', '#ef4444', '2025-07-12 23:26:45.136074+00', '2025-07-13 02:50:14.244237+00', 1);
-- INSERT INTO public.risk_categories VALUES ('5e19eb52-e7c3-41e0-995f-b422c6e61a5f', 'Strategic', 'Risks affecting long-term business strategy', '#10b981', '2025-07-12 23:26:45.136074+00', '2025-07-13 02:50:14.255732+00', 4);
-- INSERT INTO public.risk_categories VALUES ('88cdce52-369e-46ae-a3b8-79ac2b243900', 'Reputational', 'Risks to brand and organizational reputation', '#f97316', '2025-07-12 23:26:45.136074+00', '2025-07-13 02:50:14.264444+00', 7);
-- INSERT INTO public.risk_categories VALUES ('275d2a02-c9aa-4ac7-88c7-754e4826a139', 'Technology', 'IT infrastructure and cybersecurity risks', '#06b6d4', '2025-07-12 23:26:45.136074+00', '2025-07-13 02:50:14.263836+00', 2);
-- INSERT INTO public.risk_categories VALUES ('83a0de52-9d17-4ce2-8bf1-1d067b67348e', 'Human Resources', 'People and workforce related risks', '#ec4899', '2025-07-12 23:26:45.136074+00', '2025-07-13 02:50:14.26299+00', 6);
-- INSERT INTO public.risk_categories VALUES ('6bd72a0f-d057-4468-a301-15fdf9b72db0', 'Compliance', 'Regulatory and legal compliance risks', '#8b5cf6', '2025-07-12 23:26:45.136074+00', '2025-07-13 02:50:14.261768+00', 5);
-- INSERT INTO public.risk_categories VALUES ('3bf0571f-5a96-49af-a832-5fa9eecf7d76', 'Environmental', 'Environmental and sustainability risks', '#84cc16', '2025-07-12 23:26:45.136074+00', '2025-07-13 02:50:14.267767+00', 3);
-- INSERT INTO public.risk_categories VALUES ('d1d0b866-03c4-4256-934a-27f4ca9b27f6', 'Information Security', 'Risks affecting financial performance and stability', '#f59e0b', '2025-07-12 23:26:45.136074+00', '2025-07-13 02:55:21.670199+00', 8);


-- --
-- -- TOC entry 6735 (class 0 OID 360465)
-- -- Dependencies: 390
-- -- Data for Name: risk_control_mappings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6748 (class 0 OID 409972)
-- -- Dependencies: 403
-- -- Data for Name: risk_controls; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6747 (class 0 OID 409955)
-- -- Dependencies: 402
-- -- Data for Name: risk_factors; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6745 (class 0 OID 409901)
-- -- Dependencies: 400
-- -- Data for Name: risk_frameworks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.risk_frameworks VALUES ('fc0ad503-24b7-486d-8b0c-7381717b3666', 'ISO 31000', 'International standard for risk management', '2018', true, '2025-07-12 23:26:45.136074+00', '2025-07-12 23:26:45.136074+00');
-- INSERT INTO public.risk_frameworks VALUES ('590ec2b6-4425-4f72-9d6c-0a1cf7b0b71a', 'COSO ERM', 'Committee of Sponsoring Organizations Enterprise Risk Management', '2017', true, '2025-07-12 23:26:45.136074+00', '2025-07-12 23:26:45.136074+00');
-- INSERT INTO public.risk_frameworks VALUES ('5c37f0e0-9194-488b-8ae1-9bfb8f9e05e0', 'NIST RMF', 'National Institute of Standards and Technology Risk Management Framework', '2.0', true, '2025-07-12 23:26:45.136074+00', '2025-07-12 23:26:45.136074+00');
-- INSERT INTO public.risk_frameworks VALUES ('b1c0a426-e6ae-4532-a64a-a318c8e2d372', 'FAIR', 'Factor Analysis of Information Risk', '2.0', true, '2025-07-12 23:26:45.136074+00', '2025-07-12 23:26:45.136074+00');
-- INSERT INTO public.risk_frameworks VALUES ('a8cd6e39-7312-4818-b659-a8026a04455a', 'Custom Framework', 'Organization-specific risk assessment framework', '1.0', true, '2025-07-12 23:26:45.136074+00', '2025-07-12 23:26:45.136074+00');


-- --
-- -- TOC entry 6752 (class 0 OID 410061)
-- -- Dependencies: 407
-- -- Data for Name: risk_incidents; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.risk_incidents VALUES ('421fb0f0-6f35-471e-81a2-2b2ddf192b0a', 'INC-2024-001', 'Data Breach in Customer Database', 'Unauthorized access to customer personal information database detected through security monitoring.', NULL, '7c9bee64-5744-4a66-b003-40ec1a68ccb5', 'critical', 'investigating', 'urgent', 'high', 'medium', '2025-07-10 23:29:56.868652+00', '2025-07-11 23:29:56.868652+00', NULL, NULL, 'IT Security', 'Technology', 25000.00, 0.00, '2025-07-19 23:29:56.868652+00', NULL, 'Weak password policy and lack of multi-factor authentication', 'Outdated security patches, insufficient access controls', NULL, NULL, '2025-07-12 23:29:56.868652+00', '2025-07-12 23:29:56.868652+00');
-- INSERT INTO public.risk_incidents VALUES ('9b6edd97-991e-4877-a869-9f5a4d5b9d3c', 'INC-2024-002', 'System Outage - Core Banking Platform', 'Critical system failure affecting customer transactions and online banking services.', NULL, 'b4e71eaf-3f28-41ba-97aa-9c0e59332390', 'high', 'resolved', 'high', 'critical', 'low', '2025-07-07 23:29:56.868652+00', '2025-07-07 23:29:56.868652+00', NULL, NULL, 'IT Operations', 'Technology', 150000.00, 0.00, '2025-07-10 23:29:56.868652+00', NULL, 'Hardware failure in primary data center', 'Insufficient redundancy, delayed failover procedures', NULL, NULL, '2025-07-12 23:29:56.868652+00', '2025-07-12 23:29:56.868652+00');
-- INSERT INTO public.risk_incidents VALUES ('4d31ea0e-f5f5-462d-82bc-68a1f9712977', 'INC-2024-003', 'Compliance Violation - GDPR Data Processing', 'Improper data processing procedures identified during internal audit.', NULL, 'cc12f910-f642-494c-8723-964a37b26d00', 'medium', 'open', 'medium', 'medium', 'high', '2025-07-09 23:29:56.868652+00', '2025-07-10 23:29:56.868652+00', NULL, NULL, 'Legal & Compliance', 'Corporate', 5000.00, 0.00, '2025-07-26 23:29:56.868652+00', NULL, 'Lack of proper consent management procedures', 'Insufficient staff training, unclear data processing policies', NULL, NULL, '2025-07-12 23:29:56.868652+00', '2025-07-12 23:29:56.868652+00');
-- INSERT INTO public.risk_incidents VALUES ('f5456aaa-9f25-4e5e-b331-4c782387d3ea', 'INC-2024-004', 'Third Party Vendor Security Incident', 'Security breach at key vendor affecting shared data and services.', NULL, '3411361f-07f3-461c-a7f5-4183db29edaa', 'high', 'investigating', 'high', 'high', 'medium', '2025-07-11 23:29:56.868652+00', '2025-07-12 17:29:56.868652+00', NULL, NULL, 'Procurement', 'Operations', 75000.00, 0.00, '2025-07-22 23:29:56.868652+00', NULL, 'Vendor security controls insufficient', 'Inadequate vendor risk assessment, poor contract terms', NULL, NULL, '2025-07-12 23:29:56.868652+00', '2025-07-12 23:29:56.868652+00');
-- INSERT INTO public.risk_incidents VALUES ('de70b264-ef7f-476e-984f-27976da158de', 'INC-2024-005', 'Financial Reporting Error', 'Material error discovered in quarterly financial statements.', NULL, 'fafe7efd-4943-41c3-9e5f-2ece3ca7571d', 'medium', 'closed', 'medium', 'medium', 'low', '2025-07-02 23:29:56.868652+00', '2025-07-04 23:29:56.868652+00', NULL, NULL, 'Finance', 'Corporate', 10000.00, 0.00, '2025-07-09 23:29:56.868652+00', NULL, 'Manual calculation error in consolidation process', 'Lack of automated controls, insufficient review procedures', NULL, NULL, '2025-07-12 23:29:56.868652+00', '2025-07-12 23:29:56.868652+00');


-- --
-- -- TOC entry 6617 (class 0 OID 98400)
-- -- Dependencies: 271
-- -- Data for Name: risk_key_indicators; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6749 (class 0 OID 409993)
-- -- Dependencies: 404
-- -- Data for Name: risk_mitigation_plans; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6613 (class 0 OID 98360)
-- -- Dependencies: 267
-- -- Data for Name: risk_treatment_actions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6609 (class 0 OID 90163)
-- -- Dependencies: 263
-- -- Data for Name: risk_treatment_history; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6605 (class 0 OID 90116)
-- -- Dependencies: 259
-- -- Data for Name: risk_treatment_plans; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6577 (class 0 OID 24598)
-- -- Dependencies: 231
-- -- Data for Name: risks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.risks VALUES (9, 'RISK-0008', 'DDOS Attack', 'DDOS Attack', 'Internal security assessment', 'unpatched software', 4, 4, 16, 'Abrar mir', 'Open', '2025-07-12', NULL, '2025-09-30', '2025-07-12 17:27:39.044833', '2025-07-12 17:27:39.044833', 'DDOS Attack', NULL, 4, 3, 12, 'Mitigate', 'DDOS Attack', 'Quarterly', 'Not Tested', 10, 'DDOS Attack', 'DDOS Attack', 1000.00, 2000.00, 100.00, '3 months', 'Medium', NULL, NULL, '{}');
-- INSERT INTO public.risks VALUES (10, 'RISK-0013', 'Cyber Attack on crticial infrastructure', 'Cyber Attack on crticial infrastructure', 'Internal security assessment', 'unpatched software', 5, 5, 25, 'Asif', 'Open', '2025-07-12', NULL, '2025-09-30', '2025-07-12 18:52:29.809226', '2025-07-12 18:52:29.809226', 'Cyber Attack on crticial infrastructure', 6, 4, 5, 20, 'Mitigate', 'Cyber Attack on crticial infrastructure', 'Quarterly', 'Not Tested', 30, 'Cyber Attack on crticial infrastructure', 'Cyber Attack on crticial infrastructure', 100000.00, 200000.00, 10000.00, '3 months', 'Medium', NULL, NULL, '{6}');
-- INSERT INTO public.risks VALUES (16, 'RISK-0033', 'DDOS Attack on Public Facing Assets', 'DDOS Attack on Public Facing Assets', 'Internal security assessment', 'unpatched software', 4, 5, 20, 'COO', 'Open', '2025-07-13', NULL, '2025-09-30', '2025-07-13 08:53:54.168236', '2025-07-13 08:53:54.168236', 'DDOS Attack on Public Facing Assets', 47, 3, 5, 15, 'Mitigate', 'DDOS Attack on Public Facing Assets', 'Quarterly', 'Not Tested', 10, 'DDOS Attack on Public Facing Assets', 'DDOS Attack on Public Facing Assets', 200000.00, 400000.00, 15000.00, '3 months', 'Medium', '12', NULL, '{47}');
-- INSERT INTO public.risks VALUES (22, 'RISK-0041', 'Supply Chain Attack ', 'Supply Chain Attack ', 'Internal security assessment', 'unpatched software', 4, 4, 16, 'CISO', 'Open', '2025-07-13', NULL, '2025-09-30', '2025-07-13 09:09:30.984107', '2025-07-13 09:09:30.984107', 'Supply Chain Attack ', 2, 3, 4, 12, 'Mitigate', 'Supply Chain Attack ', 'Quarterly', 'Not Tested', 5, 'Supply Chain Attack ', 'Supply Chain Attack ', 100000.00, 200000.00, 9999.97, '3 months', 'Medium', '3', NULL, '{2}');
-- INSERT INTO public.risks VALUES (23, 'RISK-0044', 'Exploitation of Unpatched Vulnerabilities', 'Exploitation of Unpatched Vulnerabilities', 'External Hacker', 'unpatched software', 4, 5, 20, 'Mark Lewman', 'Open', '2025-07-13', NULL, '2025-10-11', '2025-07-13 13:39:43.018031', '2025-07-13 13:39:43.018031', 'Exploitation of Unpatched Vulnerabilities', 53, 3, 5, 15, 'Mitigate', 'Exploitation of Unpatched Vulnerabilities', 'Quarterly', 'Partially Effective', 10, 'Exploitation of Unpatched Vulnerabilities', 'Exploitation of Unpatched Vulnerabilities', 200000.00, 500000.00, 20000.00, '3 months', 'Low', '14', NULL, '{53}');


-- --
-- -- TOC entry 6873 (class 0 OID 811009)
-- -- Dependencies: 530
-- -- Data for Name: role_page_access; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.role_page_access VALUES (1, 3, 1, true, '2025-07-19 08:31:20.877098', '2025-07-19 08:31:20.877098');
-- INSERT INTO public.role_page_access VALUES (2, 3, 2, true, '2025-07-19 08:31:21.168136', '2025-07-19 08:31:21.168136');
-- INSERT INTO public.role_page_access VALUES (3, 3, 9, true, '2025-07-19 08:31:21.444407', '2025-07-19 08:31:21.444407');
-- INSERT INTO public.role_page_access VALUES (4, 3, 10, true, '2025-07-19 08:31:21.789052', '2025-07-19 08:31:21.789052');
-- INSERT INTO public.role_page_access VALUES (5, 3, 11, true, '2025-07-19 08:31:22.159683', '2025-07-19 08:31:22.159683');
-- INSERT INTO public.role_page_access VALUES (6, 3, 12, true, '2025-07-19 08:31:22.41507', '2025-07-19 08:31:22.41507');


-- --
-- -- TOC entry 6867 (class 0 OID 794783)
-- -- Dependencies: 524
-- -- Data for Name: role_permissions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6743 (class 0 OID 409789)
-- -- Dependencies: 398
-- -- Data for Name: role_permissions_audit; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6859 (class 0 OID 794625)
-- -- Dependencies: 516
-- -- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.roles VALUES (1, 'Super Admin', 'Full system access with all permissions', true, '2025-07-18 21:20:26.14898', '2025-07-18 21:20:26.14898');
-- INSERT INTO public.roles VALUES (2, 'GRC Manager', 'Governance, Risk, and Compliance management access', true, '2025-07-18 21:20:26.14898', '2025-07-18 21:20:26.14898');
-- INSERT INTO public.roles VALUES (3, 'Risk Analyst', 'Risk assessment and analysis access', true, '2025-07-18 21:20:26.14898', '2025-07-18 21:20:26.14898');
-- INSERT INTO public.roles VALUES (4, 'Compliance Officer', 'Compliance monitoring and reporting access', true, '2025-07-18 21:20:26.14898', '2025-07-18 21:20:26.14898');
-- INSERT INTO public.roles VALUES (5, 'Auditor', 'Audit and review access (read-only)', true, '2025-07-18 21:20:26.14898', '2025-07-18 21:20:26.14898');
-- INSERT INTO public.roles VALUES (6, 'Asset Manager', 'Asset management and inventory access', true, '2025-07-18 21:20:26.14898', '2025-07-18 21:20:26.14898');
-- INSERT INTO public.roles VALUES (7, 'Security Analyst', 'Security incident and vulnerability management', true, '2025-07-18 21:20:26.14898', '2025-07-18 21:20:26.14898');
-- INSERT INTO public.roles VALUES (8, 'Department Manager', 'Department-level access to assigned resources', true, '2025-07-18 21:20:26.14898', '2025-07-18 21:20:26.14898');
-- INSERT INTO public.roles VALUES (9, 'User', 'Basic user access with limited permissions', true, '2025-07-18 21:20:26.14898', '2025-07-18 21:20:26.14898');


-- --
-- -- TOC entry 6703 (class 0 OID 278690)
-- -- Dependencies: 357
-- -- Data for Name: security_awareness_metrics; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.security_awareness_metrics VALUES (1, '2025-07-10', 100, 85, 45, 82.50, 75.00, 0, 0, '2025-07-10 23:08:54.505786');


-- --
-- -- TOC entry 6902 (class 0 OID 1007616)
-- -- Dependencies: 639
-- -- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.sessions VALUES ('1e9e5e60-76ce-41fd-8bbb-30aab29aeeb7', 2, 'f46a6fbffe951e62b303821c38c41f0d6a94c562e2fdc78fb8b88f0ca13021fa', '2025-08-27 16:50:49.21815', '2025-08-28 16:50:49.21815');
-- INSERT INTO public.sessions VALUES ('be53a140-00b2-4743-90fa-63a4023f7da3', 2, 'ccc5444a3da764546a0c49077a56116e51f991fd7dbfe3d1131e003d44340b9d', '2025-08-27 16:51:11.465714', '2025-08-28 16:51:11.465714');
-- INSERT INTO public.sessions VALUES ('24af7aa2-42f0-4265-bccb-adb56761a4c3', 2, 'ee3c5be3c1bf9622429fe629d2bc80724ddea687ca2ada27cd1b1aa7bf3d2845', '2025-08-27 17:00:36.650291', '2025-08-28 17:00:36.650291');


-- --
-- -- TOC entry 6885 (class 0 OID 860216)
-- -- Dependencies: 542
-- -- Data for Name: sla_exceptions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6877 (class 0 OID 851968)
-- -- Dependencies: 534
-- -- Data for Name: sla_notification_log; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6881 (class 0 OID 860176)
-- -- Dependencies: 538
-- -- Data for Name: sla_rules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.sla_rules VALUES (1, 1, 'Critical', 1, 7, 5, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (2, 1, 'High', 2, 14, 10, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (3, 1, 'Medium', 3, 30, 21, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (4, 1, 'Low', 5, 60, 45, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (5, 1, 'Informational', 7, 90, 75, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (6, 2, 'Critical', 1, 3, 2, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (7, 2, 'High', 1, 7, 5, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (8, 2, 'Medium', 2, 14, 10, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (9, 2, 'Low', 3, 30, 21, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (10, 2, 'Informational', 5, 60, 45, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (11, 3, 'Critical', 2, 14, 10, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (12, 3, 'High', 3, 21, 15, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (13, 3, 'Medium', 5, 45, 30, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (14, 3, 'Low', 7, 90, 60, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (15, 3, 'Informational', 10, 120, 90, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (16, 4, 'Critical', 1, 5, 3, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (17, 4, 'High', 1, 10, 7, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (18, 4, 'Medium', 2, 21, 14, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (19, 4, 'Low', 3, 45, 30, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');
-- INSERT INTO public.sla_rules VALUES (20, 4, 'Informational', 5, 90, 60, '2025-07-20 19:42:35.588337', '2025-07-20 19:42:35.588337');


-- --
-- -- TOC entry 6879 (class 0 OID 860161)
-- -- Dependencies: 536
-- -- Data for Name: sla_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.sla_templates VALUES (1, 'Standard Enterprise', 'Standard enterprise SLA configuration with balanced timelines', true, '2025-07-20 19:42:19.623739', '2025-07-20 19:42:19.623739', 'system', true);
-- INSERT INTO public.sla_templates VALUES (2, 'Accelerated Response', 'Accelerated response times for high-priority organizations', false, '2025-07-20 19:42:19.623739', '2025-07-20 19:42:19.623739', 'system', true);
-- INSERT INTO public.sla_templates VALUES (3, 'Extended Timeline', 'Extended timelines for organizations with limited resources', false, '2025-07-20 19:42:19.623739', '2025-07-20 19:42:19.623739', 'system', true);
-- INSERT INTO public.sla_templates VALUES (4, 'Regulatory Compliance', 'Strict timelines for regulatory compliance requirements', false, '2025-07-20 19:42:19.623739', '2025-07-20 19:42:19.623739', 'system', true);


-- --
-- -- TOC entry 6863 (class 0 OID 794727)
-- -- Dependencies: 520
-- -- Data for Name: table_permissions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.table_permissions VALUES (1, 1, 1, true, true, true, true, true, 'all', '2025-07-18 21:27:28.579158');
-- INSERT INTO public.table_permissions VALUES (2, 1, 2, true, true, true, true, true, 'all', '2025-07-18 21:27:28.579158');
-- INSERT INTO public.table_permissions VALUES (3, 1, 3, true, true, true, true, true, 'all', '2025-07-18 21:27:28.579158');
-- INSERT INTO public.table_permissions VALUES (4, 1, 4, true, true, true, true, true, 'all', '2025-07-18 21:27:28.579158');
-- INSERT INTO public.table_permissions VALUES (5, 1, 5, true, true, true, true, true, 'all', '2025-07-18 21:27:28.579158');
-- INSERT INTO public.table_permissions VALUES (6, 1, 6, true, true, true, true, true, 'all', '2025-07-18 21:27:28.579158');
-- INSERT INTO public.table_permissions VALUES (7, 1, 7, true, true, true, true, true, 'all', '2025-07-18 21:27:28.579158');
-- INSERT INTO public.table_permissions VALUES (8, 1, 8, true, true, true, true, true, 'all', '2025-07-18 21:27:28.579158');
-- INSERT INTO public.table_permissions VALUES (9, 1, 9, true, true, true, true, true, 'all', '2025-07-18 21:27:28.579158');
-- INSERT INTO public.table_permissions VALUES (10, 1, 10, true, true, true, true, true, 'all', '2025-07-18 21:27:28.579158');
-- INSERT INTO public.table_permissions VALUES (11, 1, 11, true, true, true, true, true, 'all', '2025-07-18 21:27:28.579158');
-- INSERT INTO public.table_permissions VALUES (12, 1, 12, true, true, true, true, true, 'all', '2025-07-18 21:27:28.579158');
-- INSERT INTO public.table_permissions VALUES (13, 1, 13, true, true, true, true, true, 'all', '2025-07-18 21:27:28.579158');
-- INSERT INTO public.table_permissions VALUES (14, 1, 14, true, true, true, true, true, 'all', '2025-07-18 21:27:28.579158');
-- INSERT INTO public.table_permissions VALUES (15, 1, 15, true, true, true, true, true, 'all', '2025-07-18 21:27:28.579158');


-- --
-- -- TOC entry 6876 (class 0 OID 835585)
-- -- Dependencies: 533
-- -- Data for Name: tat_settings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.tat_settings VALUES (1, 'Critical', 10, 'Critical findings require immediate attention and must be resolved within 10 days', true, '2025-07-19 21:31:44.964494', '2025-07-19 21:31:44.964494', NULL, NULL);
-- INSERT INTO public.tat_settings VALUES (2, 'High', 15, 'High severity findings must be addressed within 15 days', true, '2025-07-19 21:31:44.964494', '2025-07-19 21:31:44.964494', NULL, NULL);
-- INSERT INTO public.tat_settings VALUES (3, 'Medium', 30, 'Medium severity findings should be resolved within 30 days', true, '2025-07-19 21:31:44.964494', '2025-07-19 21:31:44.964494', NULL, NULL);
-- INSERT INTO public.tat_settings VALUES (4, 'Low', 60, 'Low severity findings can be addressed within 60 days', true, '2025-07-19 21:31:44.964494', '2025-07-19 21:31:44.964494', NULL, NULL);
-- INSERT INTO public.tat_settings VALUES (5, 'Informational', 90, 'Informational findings are for awareness and can be addressed within 90 days', true, '2025-07-19 21:31:44.964494', '2025-07-19 21:31:44.964494', NULL, NULL);


-- --
-- -- TOC entry 6893 (class 0 OID 966657)
-- -- Dependencies: 630
-- -- Data for Name: technology_risks; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.technology_risks VALUES (15, 'TR-000016', 'Outdated Server Operating System', 'Critical servers running on unsupported Windows Server 2012 with known security vulnerabilities', 'Infrastructure', 'Server', 'Technology', 4, 4, DEFAULT, DEFAULT, 'Basic firewall protection, antivirus software', 'Immediate OS upgrade to supported version, implement patch management system', 'Current controls provide minimal protection against modern threats', 'mitigate', 'planned', NULL, 'John Smith', 'IT Operations Team', 'open', NULL, 2, 3, DEFAULT, '2025-07-22 21:04:35.219666', '2025-07-22 21:04:35.219666', '1');
-- INSERT INTO public.technology_risks VALUES (17, 'TR-000018', 'Unencrypted Database Communications', 'Database connections not using TLS encryption, exposing sensitive data in transit', 'Database', 'Database Server', 'Technology', 3, 5, DEFAULT, DEFAULT, 'Network segmentation, access controls', 'Enable TLS encryption for all database connections, implement certificate management', 'Network controls reduce exposure but encryption is essential', 'mitigate', 'in-progress', NULL, 'Sarah Johnson', 'Database Administrator', 'in-progress', NULL, 1, 2, DEFAULT, '2025-07-22 21:04:35.219666', '2025-07-22 21:04:35.219666', '2');
-- INSERT INTO public.technology_risks VALUES (19, 'TR-000020', 'Legacy Application Security Gaps', 'Custom web application built on outdated framework with multiple security vulnerabilities', 'Software', 'Application', 'Technology', 5, 4, DEFAULT, DEFAULT, 'Web application firewall, input validation', 'Application security assessment, code review, framework upgrade', 'WAF provides some protection but application needs comprehensive security review', 'mitigate', 'planned', NULL, 'Mike Davis', 'Development Team', 'open', NULL, 3, 2, DEFAULT, '2025-07-22 21:04:35.219666', '2025-07-22 21:04:35.219666', '3');
-- INSERT INTO public.technology_risks VALUES (21, 'TR-000022', 'Inadequate Backup System', 'Current backup solution lacks encryption and offsite storage capabilities', 'Infrastructure', 'Backup System', 'Technology', 2, 4, DEFAULT, DEFAULT, 'Daily backups to local storage', 'Implement encrypted backups with offsite replication, test restore procedures', 'Local backups provide basic protection but lack comprehensive disaster recovery', 'mitigate', 'planned', NULL, 'Lisa Chen', 'IT Operations Team', 'open', NULL, 1, 2, DEFAULT, '2025-07-22 21:04:35.219666', '2025-07-22 21:04:35.219666', NULL);
-- INSERT INTO public.technology_risks VALUES (23, 'TR-000024', 'Unsecured IoT Devices', 'Industrial IoT sensors deployed without proper security configuration', 'IoT Devices', 'IoT Devices', 'Technology', 4, 3, DEFAULT, DEFAULT, 'Network isolation, basic monitoring', 'Device security hardening, regular firmware updates, enhanced monitoring', 'Network isolation reduces risk but devices need individual security measures', 'mitigate', 'planned', NULL, 'Robert Wilson', 'Facilities Manager', 'open', NULL, 2, 2, DEFAULT, '2025-07-22 21:04:35.219666', '2025-07-22 21:04:35.219666', '4');


-- --
-- -- TOC entry 6899 (class 0 OID 983064)
-- -- Dependencies: 636
-- -- Data for Name: third_party_risk_assessment_responses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6897 (class 0 OID 983052)
-- -- Dependencies: 634
-- -- Data for Name: third_party_risk_assessments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6895 (class 0 OID 983041)
-- -- Dependencies: 632
-- -- Data for Name: third_party_risk_templates; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.third_party_risk_templates VALUES (1, '1.0', 'Information Security Governance', '1.1', 'Vendor Information Security Risk', 'Does your organization maintain a security program?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (2, '1.0', 'Information Security Governance', '1.2', 'Vendor Information Security Risk', 'Who is responsible for managing the security program?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (3, '1.0', 'Information Security Governance', '1.3', 'Vendor Information Security Risk', 'Does your organization have a public information security policy?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (4, '1.0', 'Information Security Governance', '1.4', 'Vendor Information Security Risk', 'What guidelines does your security program follow?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (5, '2.0', 'Data Security Controls', '2.1', 'Vendor Data Center Security Risk', 'Do you work in a shared office space?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (6, '2.0', 'Data Security Controls', '2.2', 'Vendor Data Center Security Risk', 'Is there a protocol in place for operations when your office is inaccessible?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (7, '2.0', 'Data Security Controls', '2.3', 'Vendor Data Center Security Risk', 'Is there a policy in place for physical security requirements for your business?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (8, '2.0', 'Data Security Controls', '2.4', 'Vendor Data Center Security Risk', 'What are the geographic locations of your data centers?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (9, '3.0', 'Web Application Security', '3.1', 'Vendor Web Application Security Risk', 'What is the name of your web application? What is its function?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (10, '3.0', 'Web Application Security', '3.2', 'Vendor Web Application Security Risk', 'How do you report application security vulnerabilities?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (11, '3.0', 'Web Application Security', '3.3', 'Vendor Web Application Security Risk', 'Does your web application have an SSL certificate?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (12, '3.0', 'Web Application Security', '3.4', 'Vendor Web Application Security Risk', 'Does your application offer single sign-on (SSO)?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (13, '3.0', 'Web Application Security', '3.5', 'Vendor Web Application Security Risk', 'Does the application can apply API rate limiting?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (14, '3.0', 'Web Application Security', '3.6', 'Vendor Web Application Security Risk', 'Does the application can apply API session rate limiting?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (15, '3.0', 'Web Application Security', '3.7', 'Vendor Web Application Security Risk', 'Does the application is protected by Web application firewall?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (16, '4.0', 'Infrastructure Protection', '4.1', 'Vendor Infrastructure Risk', 'Do you use a VPN?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (17, '4.0', 'Infrastructure Protection', '4.2', 'Vendor Infrastructure Risk', 'What is the process for backing up your data?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (18, '4.0', 'Infrastructure Protection', '4.3', 'Vendor Infrastructure Risk', 'Do you keep a record of security events?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (19, '4.0', 'Infrastructure Protection', '4.4', 'Vendor Infrastructure Risk', 'How do you protect company devices from malware?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (20, '5.0', 'Security Controls and Technology', '5.1', 'Vendor Cyber Security Risk', 'Do you keep an inventory of authorized devices and software?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (21, '5.0', 'Security Controls and Technology', '5.2', 'Vendor Cyber Security Risk', 'How do you monitor the security of your wireless networks?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (22, '5.0', 'Security Controls and Technology', '5.3', 'Vendor Cyber Security Risk', 'How do you plan for and avert a cybersecurity incident?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (23, '5.0', 'Security Controls and Technology', '5.4', 'Vendor Cyber Security Risk', 'In the event of an incident, how do you plan to communicate it to us?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (24, '5.0', 'Security Controls and Technology', '5.5', 'Vendor Cyber Security Risk', 'In case of SaaS application, does the application monitoring done through SIEM?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (25, '6.0', 'Other Controls', '6.1', 'Vendor Information Security Risk', 'How do you prioritize critical assets for your organization?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (26, '6.0', 'Other Controls', '6.2', 'Vendor Information Security Risk', 'Do you outsource security functions to third-party providers?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (27, '6.0', 'Other Controls', '6.3', 'Vendor Information Security Risk', 'How frequently are employees trained on policies in your organization?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');
-- INSERT INTO public.third_party_risk_templates VALUES (28, '6.0', 'Other Controls', '6.4', 'Vendor Information Security Risk', 'When was the last time you had a risk assessment by a third party? Results?', '2025-07-22 22:15:23.879163', '2025-07-22 22:15:23.879163');


-- --
-- -- TOC entry 6680 (class 0 OID 213089)
-- -- Dependencies: 334
-- -- Data for Name: threat_assessments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6678 (class 0 OID 196608)
-- -- Dependencies: 332
-- -- Data for Name: threats; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.threats VALUES ('THR-001', 'Advanced Persistent Threat - APT29', 'State-sponsored threat group targeting government and enterprise networks', 'malware', 'threat-intelligence', 'critical', 'active', '["cozy-bear.com", "192.168.1.100", "md5:a1b2c3d4e5f6"]', '["Network segmentation", "Enhanced monitoring", "User training"]', '["https://attack.mitre.org/groups/G0016/", "CISA Alert AA21-116A"]', '2025-07-09 19:53:53.715668', '2025-07-09 19:53:53.715668', NULL);
-- INSERT INTO public.threats VALUES ('THR-002', 'Ransomware Campaign - Conti', 'Ransomware-as-a-Service operation targeting healthcare and critical infrastructure', 'ransomware', 'incident-response', 'critical', 'monitoring', '["conti-leak.org", "sha256:abc123def456", "185.220.101.182"]', '["Backup verification", "Endpoint protection", "Email filtering"]', '["https://www.cisa.gov/conti-ransomware", "FBI Flash Alert"]', '2025-07-09 19:53:53.715668', '2025-07-09 19:53:53.715668', NULL);
-- INSERT INTO public.threats VALUES ('THR-003', 'Phishing Campaign - COVID-19 Themed', 'Large-scale phishing campaign using COVID-19 themes to steal credentials', 'phishing', 'security-vendor', 'high', 'mitigated', '["covid-relief.net", "corona-update.com", "vaccine-info.org"]', '["Email security training", "URL filtering", "Multi-factor authentication"]', '["Proofpoint Threat Report", "Microsoft Security Intelligence"]', '2025-07-09 19:53:53.715668', '2025-07-09 19:53:53.715668', NULL);
-- INSERT INTO public.threats VALUES ('THR-004', 'Supply Chain Compromise - SolarWinds', 'Supply chain attack affecting multiple government and private sector organizations', 'supply-chain', 'government', 'critical', 'resolved', '["avsvmcloud.com", "freescanonline.com", "deftsecurity.com"]', '["Software integrity verification", "Network monitoring", "Vendor assessment"]', '["CISA Emergency Directive 21-01", "FireEye Red Team Tools"]', '2025-07-09 19:53:53.715668', '2025-07-09 19:53:53.715668', NULL);
-- INSERT INTO public.threats VALUES ('THR-005', 'Insider Threat - Data Exfiltration', 'Potential insider threat involving unauthorized data access and exfiltration', 'insider-threat', 'internal', 'high', 'active', '["Unusual file access patterns", "Off-hours activity", "Large data transfers"]', '["Access controls review", "User behavior monitoring", "Data loss prevention"]', '["Internal Security Policy", "HR Guidelines"]', '2025-07-09 19:53:53.715668', '2025-07-09 19:53:53.715668', NULL);
-- INSERT INTO public.threats VALUES ('THR-006', 'DDoS Attack - Mirai Botnet', 'Distributed denial of service attacks using IoT devices infected with Mirai malware', 'ddos', 'threat-intelligence', 'medium', 'monitoring', '["198.51.100.0/24", "203.0.113.0/24", "Mirai variant signatures"]', '["DDoS protection service", "Rate limiting", "Traffic analysis"]', '["US-CERT Alert TA16-288A", "Krebs on Security Report"]', '2025-07-09 19:53:53.715668', '2025-07-09 19:53:53.715668', NULL);
-- INSERT INTO public.threats VALUES ('THR-007', 'Social Engineering - Business Email Compromise', 'Sophisticated social engineering attacks targeting finance departments', 'social-engineering', 'industry-report', 'high', 'active', '["CEO impersonation emails", "Urgent payment requests", "External email warnings bypassed"]', '["Email authentication", "Approval workflows", "Security awareness training"]', '["FBI IC3 Report", "ACFE Fraud Report"]', '2025-07-09 19:53:53.715668', '2025-07-09 19:53:53.715668', NULL);
-- INSERT INTO public.threats VALUES ('THR-008', 'Zero-Day Exploit - Microsoft Exchange', 'Zero-day vulnerabilities in Microsoft Exchange Server being actively exploited', 'malware', 'security-vendor', 'critical', 'mitigated', '["CVE-2021-26855", "CVE-2021-26857", "CVE-2021-26858", "CVE-2021-27065"]', '["Emergency patching", "Server isolation", "Threat hunting"]', '["Microsoft Security Response", "CISA Alert AA21-062A"]', '2025-07-09 19:53:53.715668', '2025-07-09 19:53:53.715668', NULL);
-- INSERT INTO public.threats VALUES ('THR-010', 'Supply Chain', 'System gets compromised through third party connections.', 'supply-chain', 'security-vendor', 'high', 'monitoring', '[]', '[]', '[]', '2025-07-09 20:02:51.259184', '2025-07-09 20:02:51.259184', NULL);


-- --
-- -- TOC entry 6701 (class 0 OID 278671)
-- -- Dependencies: 355
-- -- Data for Name: training_assignments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.training_assignments VALUES (1, 1, NULL, NULL, NULL, 1, 'all', '2025-08-09 00:00:00', 'high', false, 0, 'Mandatory cybersecurity training for all employees', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_assignments VALUES (2, 2, NULL, NULL, NULL, 1, 'all', '2025-08-24 00:00:00', 'high', false, 0, 'Phishing awareness training - required for all staff', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_assignments VALUES (3, 4, NULL, NULL, NULL, 1, 'all', '2025-09-08 00:00:00', 'medium', false, 0, 'Password security training for all users', '2025-07-10 23:08:54.505786');


-- --
-- -- TOC entry 6687 (class 0 OID 278529)
-- -- Dependencies: 341
-- -- Data for Name: training_categories; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.training_categories VALUES (1, 'Cybersecurity Fundamentals', 'Basic cybersecurity concepts and best practices', 'Shield', '#3B82F6', true, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_categories VALUES (2, 'Phishing & Social Engineering', 'Identifying and preventing phishing attacks', 'AlertTriangle', '#EF4444', true, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_categories VALUES (3, 'Data Protection & Privacy', 'Data handling, privacy laws, and protection measures', 'Lock', '#10B981', true, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_categories VALUES (4, 'Password Security', 'Password best practices and multi-factor authentication', 'Key', '#F59E0B', true, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_categories VALUES (5, 'Incident Response', 'How to respond to security incidents', 'Zap', '#8B5CF6', true, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_categories VALUES (6, 'Compliance & Regulations', 'Understanding regulatory requirements', 'BookOpen', '#6366F1', true, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_categories VALUES (7, 'Remote Work Security', 'Security practices for remote and hybrid work', 'Wifi', '#EC4899', true, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_categories VALUES (8, 'Mobile Device Security', 'Securing mobile devices and applications', 'Smartphone', '#14B8A6', true, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');


-- --
-- -- TOC entry 6689 (class 0 OID 278541)
-- -- Dependencies: 343
-- -- Data for Name: training_courses; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.training_courses VALUES (1, 'Introduction to Cybersecurity', 'Learn the fundamentals of cybersecurity and why it matters to your organization', 1, NULL, 45, 'beginner', true, true, 80, NULL, NULL, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_courses VALUES (2, 'Recognizing Phishing Attacks', 'Identify common phishing techniques and learn how to protect yourself', 2, NULL, 30, 'beginner', true, true, 85, NULL, NULL, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_courses VALUES (3, 'Data Classification and Handling', 'Understand how to properly classify and handle sensitive data', 3, NULL, 40, 'intermediate', true, true, 80, NULL, NULL, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_courses VALUES (4, 'Strong Password Practices', 'Create and manage strong passwords and enable multi-factor authentication', 4, NULL, 25, 'beginner', true, true, 80, NULL, NULL, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_courses VALUES (5, 'Incident Reporting Procedures', 'Learn when and how to report security incidents', 5, NULL, 35, 'beginner', true, true, 75, NULL, NULL, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_courses VALUES (6, 'GDPR Compliance Essentials', 'Understanding GDPR requirements and your responsibilities', 6, NULL, 60, 'intermediate', false, true, 85, NULL, NULL, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_courses VALUES (7, 'Secure Remote Work', 'Best practices for working securely from home or remote locations', 7, NULL, 50, 'beginner', true, true, 80, NULL, NULL, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_courses VALUES (8, 'Mobile Security Best Practices', 'Securing your mobile devices and protecting company data', 8, NULL, 35, 'beginner', false, true, 80, NULL, NULL, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_courses VALUES (9, 'Advanced Threat Detection', 'Identifying sophisticated cyber threats and attack vectors', 1, NULL, 75, 'advanced', false, true, 90, NULL, NULL, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_courses VALUES (10, 'Social Engineering Awareness', 'Understanding psychological manipulation techniques used by attackers', 2, NULL, 45, 'intermediate', true, true, 85, NULL, NULL, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');


-- --
-- -- TOC entry 6691 (class 0 OID 278562)
-- -- Dependencies: 345
-- -- Data for Name: training_modules; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.training_modules VALUES (1, 1, 'What is Cybersecurity?', 'Introduction to cybersecurity concepts and terminology', NULL, 1, 10, 'lesson', true, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_modules VALUES (2, 1, 'Common Cyber Threats', 'Overview of malware, ransomware, and other threats', NULL, 2, 15, 'lesson', true, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_modules VALUES (3, 1, 'Cybersecurity Knowledge Check', 'Test your understanding of basic cybersecurity concepts', NULL, 3, 10, 'quiz', true, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_modules VALUES (4, 1, 'Your Role in Cybersecurity', 'Understanding your responsibilities in protecting the organization', NULL, 4, 10, 'lesson', true, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_modules VALUES (5, 2, 'What is Phishing?', 'Understanding phishing attacks and their impact', NULL, 1, 8, 'lesson', true, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_modules VALUES (6, 2, 'Common Phishing Techniques', 'Email, SMS, and voice phishing methods', NULL, 2, 12, 'lesson', true, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');
-- INSERT INTO public.training_modules VALUES (7, 2, 'Phishing Identification Quiz', 'Practice identifying phishing attempts', NULL, 3, 10, 'quiz', true, '2025-07-10 23:08:54.505786', '2025-07-10 23:08:54.505786');


-- --
-- -- TOC entry 6742 (class 0 OID 409775)
-- -- Dependencies: 397
-- -- Data for Name: user_activity_logs; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6697 (class 0 OID 278622)
-- -- Dependencies: 351
-- -- Data for Name: user_module_progress; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6741 (class 0 OID 409718)
-- -- Dependencies: 396
-- -- Data for Name: user_permissions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6869 (class 0 OID 794811)
-- -- Dependencies: 526
-- -- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6891 (class 0 OID 958465)
-- -- Dependencies: 628
-- -- Data for Name: user_sessions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6695 (class 0 OID 278601)
-- -- Dependencies: 349
-- -- Data for Name: user_training_enrollments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.user_training_enrollments VALUES (1, 1, 1, '2025-07-10 23:08:54.505786', '2025-08-09 00:00:00', 'completed', 100, 0, 0, 3, NULL, NULL, false, NULL, 1, NULL);
-- INSERT INTO public.user_training_enrollments VALUES (2, 1, 2, '2025-07-10 23:08:54.505786', '2025-08-24 00:00:00', 'in_progress', 60, 0, 0, 3, NULL, NULL, false, NULL, 1, NULL);
-- INSERT INTO public.user_training_enrollments VALUES (3, 2, 1, '2025-07-10 23:08:54.505786', '2025-08-09 00:00:00', 'in_progress', 75, 0, 0, 3, NULL, NULL, false, NULL, 1, NULL);
-- INSERT INTO public.user_training_enrollments VALUES (4, 2, 2, '2025-07-10 23:08:54.505786', '2025-08-24 00:00:00', 'enrolled', 0, 0, 0, 3, NULL, NULL, false, NULL, 1, NULL);
-- INSERT INTO public.user_training_enrollments VALUES (5, 3, 1, '2025-07-10 23:08:54.505786', '2025-08-09 00:00:00', 'enrolled', 0, 0, 0, 3, NULL, NULL, false, NULL, 1, NULL);


-- --
-- -- TOC entry 6768 (class 0 OID 516199)
-- -- Dependencies: 424
-- -- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.users VALUES (13, 11, NULL, 'adminadmin@ainsolutions.com', NULL, 'Super', 'Admin', NULL, NULL, NULL, NULL, 'Active', NULL, '$2a$12$PEnxaVnrPhVT/TDR7Ztq9OSXybrlzqzqojMHzmC6aFEMiXJsJB.IW', '2025-07-22 11:57:53.853213', '2025-07-22 11:57:53.853213', NULL, 0, NULL, true, false, 'super_admin', 0, NULL);
-- INSERT INTO public.users VALUES (1, 1, 1, 'syedaali', 'syed@techcrop.com', 'Syed', 'Naqvi', '+971506583714', 'CISO', NULL, NULL, 'Active', NULL, 'password123', '2025-07-18 17:57:28.570714', '2025-07-18 17:57:28.570714', 1, 0, NULL, true, false, NULL, 0, NULL);
-- INSERT INTO public.users VALUES (3, 1, NULL, 'john.doe', 'john.doe@company1.com', 'John', 'Doe', NULL, NULL, NULL, NULL, 'Active', NULL, 'password123', '2025-07-22 10:26:12.93106', '2025-07-22 10:26:12.93106', NULL, 0, NULL, true, true, NULL, 0, NULL);
-- INSERT INTO public.users VALUES (4, 2, NULL, 'jane.smith', 'jane.smith@company2.com', 'Jane', 'Smith', NULL, NULL, NULL, NULL, 'Active', NULL, 'password123', '2025-07-22 10:26:12.93106', '2025-07-22 10:26:12.93106', NULL, 0, NULL, true, true, NULL, 0, NULL);
-- INSERT INTO public.users VALUES (5, 2, NULL, 'bob.wilson', 'bob.wilson@company2.com', 'Bob', 'Wilson', NULL, NULL, NULL, NULL, 'Active', NULL, 'password123', '2025-07-22 10:26:12.93106', '2025-07-22 10:26:12.93106', NULL, 0, NULL, true, true, NULL, 0, NULL);
-- INSERT INTO public.users VALUES (2, 1, NULL, 'admin', 'admin@company1.com', 'Admin', 'User', NULL, NULL, NULL, NULL, 'Active', NULL, '$2b$10$A99SGGs4SAhtVkkxduWBJ.tvOQuTB58Wy7BWPz5pMH2Mb8JtO1WhO', '2025-07-22 10:26:12.93106', '2025-07-22 10:26:12.93106', NULL, 0, NULL, true, true, NULL, 0, NULL);


-- --
-- -- TOC entry 6685 (class 0 OID 262157)
-- -- Dependencies: 339
-- -- Data for Name: userss; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 6901 (class 0 OID 991233)
-- -- Dependencies: 638
-- -- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.vendors VALUES (1, 'CloudTech Solutions', 'Cloud Service Provider', 'John Smith', 'john.smith@cloudtech.com', '+1-555-0101', '123 Tech Street, San Francisco, CA 94105', 'https://www.cloudtech.com', 'CT-2021-001', 'TAX-CT-001', '2024-01-01', '2025-12-31', 250000.00, 'Medium', 'Active', 'Primary cloud infrastructure provider for hosting and data storage services', '2025-07-22 22:36:30.582373', '2025-07-22 22:36:30.582373', NULL);
-- INSERT INTO public.vendors VALUES (2, 'SecureGuard Cybersecurity', 'Security Service Provider', 'Sarah Johnson', 'sarah.johnson@secureguard.com', '+1-555-0102', '456 Security Blvd, Austin, TX 78701', 'https://www.secureguard.com', 'SG-2021-002', 'TAX-SG-002', '2024-03-01', '2026-02-28', 180000.00, 'Low', 'Active', 'Cybersecurity monitoring and incident response services', '2025-07-22 22:36:30.582373', '2025-07-22 22:36:30.582373', NULL);
-- INSERT INTO public.vendors VALUES (3, 'DataFlow Analytics', 'Software Provider', 'Michael Chen', 'michael.chen@dataflow.com', '+1-555-0103', '789 Analytics Ave, Seattle, WA 98101', 'https://www.dataflow.com', 'DF-2021-003', 'TAX-DF-003', '2024-02-15', '2025-02-14', 95000.00, 'Medium', 'Active', 'Business intelligence and data analytics platform', '2025-07-22 22:36:30.582373', '2025-07-22 22:36:30.582373', NULL);
-- INSERT INTO public.vendors VALUES (4, 'GlobalComm Networks', 'Telecommunications Provider', 'Lisa Rodriguez', 'lisa.rodriguez@globalcomm.com', '+1-555-0104', '321 Network Drive, Chicago, IL 60601', 'https://www.globalcomm.com', 'GC-2021-004', 'TAX-GC-004', '2023-12-01', '2024-11-30', 320000.00, 'High', 'Under Review', 'Telecommunications and network infrastructure services', '2025-07-22 22:36:30.582373', '2025-07-22 22:36:30.582373', NULL);
-- INSERT INTO public.vendors VALUES (5, 'OfficeSupply Pro', 'Office Supplies Provider', 'David Wilson', 'david.wilson@officesupply.com', '+1-555-0105', '654 Supply Street, Denver, CO 80202', 'https://www.officesupply.com', 'OS-2021-005', 'TAX-OS-005', '2024-01-01', '2024-12-31', 45000.00, 'Low', 'Active', 'Office supplies and equipment procurement', '2025-07-22 22:36:30.582373', '2025-07-22 22:36:30.582373', NULL);
-- INSERT INTO public.vendors VALUES (6, 'LegalAdvice Partners', 'Legal Service Provider', 'Jennifer Brown', 'jennifer.brown@legaladvice.com', '+1-555-0106', '987 Law Plaza, New York, NY 10001', 'https://www.legaladvice.com', 'LA-2021-006', 'TAX-LA-006', '2024-04-01', '2025-03-31', 120000.00, 'Medium', 'Active', 'Legal consultation and compliance advisory services', '2025-07-22 22:36:30.582373', '2025-07-22 22:36:30.582373', NULL);
-- INSERT INTO public.vendors VALUES (7, 'TechMaintenance Corp', 'IT Support Provider', 'Robert Taylor', 'robert.taylor@techmaintenance.com', '+1-555-0107', '147 Support Lane, Boston, MA 02101', 'https://www.techmaintenance.com', 'TM-2021-007', 'TAX-TM-007', '2024-01-15', '2025-01-14', 85000.00, 'Medium', 'Active', 'IT equipment maintenance and technical support services', '2025-07-22 22:36:30.582373', '2025-07-22 22:36:30.582373', NULL);
-- INSERT INTO public.vendors VALUES (8, 'CloudBackup Solutions', 'Backup Service Provider', 'Amanda Davis', 'amanda.davis@cloudbackup.com', '+1-555-0108', '258 Backup Blvd, Phoenix, AZ 85001', 'https://www.cloudbackup.com', 'CB-2021-008', 'TAX-CB-008', '2024-02-01', '2025-01-31', 65000.00, 'Low', 'Active', 'Data backup and disaster recovery services', '2025-07-22 22:36:30.582373', '2025-07-22 22:36:30.582373', NULL);
-- INSERT INTO public.vendors VALUES (9, 'Marketing Dynamics', 'Marketing Service Provider', 'Christopher Lee', 'christopher.lee@marketingdynamics.com', '+1-555-0109', '369 Marketing Way, Miami, FL 33101', 'https://www.marketingdynamics.com', 'MD-2021-009', 'TAX-MD-009', '2024-03-15', '2024-12-31', 75000.00, 'Low', 'Active', 'Digital marketing and brand management services', '2025-07-22 22:36:30.582373', '2025-07-22 22:36:30.582373', NULL);
-- INSERT INTO public.vendors VALUES (10, 'FinanceFlow Systems', 'Financial Software Provider', 'Michelle Garcia', 'michelle.garcia@financeflow.com', '+1-555-0110', '741 Finance Street, Atlanta, GA 30301', 'https://www.financeflow.com', 'FF-2021-010', 'TAX-FF-010', '2024-01-01', '2026-12-31', 200000.00, 'High', 'Active', 'Financial management and accounting software platform', '2025-07-22 22:36:30.582373', '2025-07-22 22:36:30.582373', NULL);
-- INSERT INTO public.vendors VALUES (11, 'CloudTech Solutions', 'Cloud Service Provider', 'John Smith', 'john.smith@cloudtech.com', '+1-555-0101', '123 Tech Street, San Francisco, CA 94105', 'https://www.cloudtech.com', 'CT-2021-001', 'TAX-CT-001', '2024-01-01', '2025-12-31', 250000.00, 'Medium', 'Active', 'Primary cloud infrastructure provider for hosting and data storage services', '2025-07-22 22:36:32.524302', '2025-07-22 22:36:32.524302', NULL);
-- INSERT INTO public.vendors VALUES (12, 'SecureGuard Cybersecurity', 'Security Service Provider', 'Sarah Johnson', 'sarah.johnson@secureguard.com', '+1-555-0102', '456 Security Blvd, Austin, TX 78701', 'https://www.secureguard.com', 'SG-2021-002', 'TAX-SG-002', '2024-03-01', '2026-02-28', 180000.00, 'Low', 'Active', 'Cybersecurity monitoring and incident response services', '2025-07-22 22:36:32.524302', '2025-07-22 22:36:32.524302', NULL);
-- INSERT INTO public.vendors VALUES (13, 'DataFlow Analytics', 'Software Provider', 'Michael Chen', 'michael.chen@dataflow.com', '+1-555-0103', '789 Analytics Ave, Seattle, WA 98101', 'https://www.dataflow.com', 'DF-2021-003', 'TAX-DF-003', '2024-02-15', '2025-02-14', 95000.00, 'Medium', 'Active', 'Business intelligence and data analytics platform', '2025-07-22 22:36:32.524302', '2025-07-22 22:36:32.524302', NULL);
-- INSERT INTO public.vendors VALUES (14, 'GlobalComm Networks', 'Telecommunications Provider', 'Lisa Rodriguez', 'lisa.rodriguez@globalcomm.com', '+1-555-0104', '321 Network Drive, Chicago, IL 60601', 'https://www.globalcomm.com', 'GC-2021-004', 'TAX-GC-004', '2023-12-01', '2024-11-30', 320000.00, 'High', 'Under Review', 'Telecommunications and network infrastructure services', '2025-07-22 22:36:32.524302', '2025-07-22 22:36:32.524302', NULL);
-- INSERT INTO public.vendors VALUES (15, 'OfficeSupply Pro', 'Office Supplies Provider', 'David Wilson', 'david.wilson@officesupply.com', '+1-555-0105', '654 Supply Street, Denver, CO 80202', 'https://www.officesupply.com', 'OS-2021-005', 'TAX-OS-005', '2024-01-01', '2024-12-31', 45000.00, 'Low', 'Active', 'Office supplies and equipment procurement', '2025-07-22 22:36:32.524302', '2025-07-22 22:36:32.524302', NULL);
-- INSERT INTO public.vendors VALUES (16, 'LegalAdvice Partners', 'Legal Service Provider', 'Jennifer Brown', 'jennifer.brown@legaladvice.com', '+1-555-0106', '987 Law Plaza, New York, NY 10001', 'https://www.legaladvice.com', 'LA-2021-006', 'TAX-LA-006', '2024-04-01', '2025-03-31', 120000.00, 'Medium', 'Active', 'Legal consultation and compliance advisory services', '2025-07-22 22:36:32.524302', '2025-07-22 22:36:32.524302', NULL);
-- INSERT INTO public.vendors VALUES (17, 'TechMaintenance Corp', 'IT Support Provider', 'Robert Taylor', 'robert.taylor@techmaintenance.com', '+1-555-0107', '147 Support Lane, Boston, MA 02101', 'https://www.techmaintenance.com', 'TM-2021-007', 'TAX-TM-007', '2024-01-15', '2025-01-14', 85000.00, 'Medium', 'Active', 'IT equipment maintenance and technical support services', '2025-07-22 22:36:32.524302', '2025-07-22 22:36:32.524302', NULL);
-- INSERT INTO public.vendors VALUES (18, 'CloudBackup Solutions', 'Backup Service Provider', 'Amanda Davis', 'amanda.davis@cloudbackup.com', '+1-555-0108', '258 Backup Blvd, Phoenix, AZ 85001', 'https://www.cloudbackup.com', 'CB-2021-008', 'TAX-CB-008', '2024-02-01', '2025-01-31', 65000.00, 'Low', 'Active', 'Data backup and disaster recovery services', '2025-07-22 22:36:32.524302', '2025-07-22 22:36:32.524302', NULL);
-- INSERT INTO public.vendors VALUES (19, 'Marketing Dynamics', 'Marketing Service Provider', 'Christopher Lee', 'christopher.lee@marketingdynamics.com', '+1-555-0109', '369 Marketing Way, Miami, FL 33101', 'https://www.marketingdynamics.com', 'MD-2021-009', 'TAX-MD-009', '2024-03-15', '2024-12-31', 75000.00, 'Low', 'Active', 'Digital marketing and brand management services', '2025-07-22 22:36:32.524302', '2025-07-22 22:36:32.524302', NULL);
-- INSERT INTO public.vendors VALUES (20, 'FinanceFlow Systems', 'Financial Software Provider', 'Michelle Garcia', 'michelle.garcia@financeflow.com', '+1-555-0110', '741 Finance Street, Atlanta, GA 30301', 'https://www.financeflow.com', 'FF-2021-010', 'TAX-FF-010', '2024-01-01', '2026-12-31', 200000.00, 'High', 'Active', 'Financial management and accounting software platform', '2025-07-22 22:36:32.524302', '2025-07-22 22:36:32.524302', NULL);


-- --
-- -- TOC entry 6731 (class 0 OID 344116)
-- -- Dependencies: 386
-- -- Data for Name: vulnerabilities; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --

-- INSERT INTO public.vulnerabilities VALUES (2, 'Remote Code Execution in File Upload', 'Unrestricted file upload allowing remote code execution on the server', 'Critical', 9.9, 'Code Execution', '["Web Server", "File System"]', 'In Progress', '2025-07-12 14:50:03.934361', '2025-07-10 00:00:00', NULL, 1, '["CWE-434", "OWASP-A04"]', '["rce", "file-upload", "web-security"]', '2025-07-07 14:50:03.934361', '2025-07-14 10:32:24.325987', NULL, NULL, NULL, NULL, '2025-07-14', NULL, 7, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (5, 'Insecure Direct Object Reference', 'IDOR vulnerability allowing users to access unauthorized resources by manipulating object references', 'High', 6.5, 'Access Control', '["API Endpoints", "User Data"]', 'In Progress', '2025-07-12 14:50:03.934361', '2025-07-01 00:00:00', NULL, 2, '["CWE-639", "OWASP-A01"]', '["idor", "access-control", "api-security"]', '2025-07-05 14:50:03.934361', '2025-07-14 10:32:24.351727', NULL, NULL, NULL, NULL, '2025-07-19', NULL, 14, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (8, 'Unencrypted Data Transmission', 'Sensitive data transmitted over unencrypted HTTP connections', 'Medium', 5.9, 'Cryptography', '["Network Communication", "Data Transmission"]', 'In Progress', '2025-07-12 14:50:03.934361', '2025-07-12 00:00:00', NULL, 3, '["CWE-319", "OWASP-A02"]', '["encryption", "data-transmission"]', '2025-07-04 14:50:03.934361', '2025-07-14 10:32:24.353683', NULL, NULL, NULL, NULL, '2025-08-03', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (4, 'Cross-Site Scripting (XSS) in Comments', 'Stored XSS vulnerability in comment system allowing malicious script execution', 'High', 7.2, 'Cross-Site Scripting', '["Web Application", "Comment System"]', 'Resolved', '2025-07-12 14:50:03.934361', '2025-07-17 00:00:00', NULL, 2, '["CWE-79", "OWASP-A03"]', '["xss", "stored-xss", "web-security"]', '2025-07-02 14:50:03.934361', '2025-07-14 10:41:41.946784', NULL, NULL, NULL, NULL, '2025-07-04', NULL, 14, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (3, 'Privilege Escalation in Admin Panel', 'Vertical privilege escalation vulnerability allowing regular users to gain administrative access', 'Critical', 8.8, 'Access Control', '["Admin Panel", "User Management System"]', 'Open', '2025-07-12 14:50:03.934361', '2025-07-11 00:00:00', NULL, 1, '["CWE-269", "OWASP-A01"]', '["privilege-escalation", "access-control"]', '2025-07-11 14:50:03.934361', '2025-07-14 10:41:41.946396', NULL, NULL, NULL, NULL, '2025-07-02', NULL, 7, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (1, 'SQL Injection in User Authentication', 'Critical SQL injection vulnerability in user authentication module allowing unauthorized access to sensitive data', 'Critical', 9.8, 'Injection', '["Web Application", "Database Server", "Authentication System"]', 'Open', '2025-07-12 14:50:03.934361', '2025-07-07 05:03:03', NULL, 1, '["CWE-89", "OWASP-A03"]', '["sql-injection", "authentication", "web-security"]', '2025-07-10 14:50:03.934361', '2025-07-14 10:41:41.945763', NULL, NULL, NULL, NULL, '2025-07-01', NULL, 7, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (6, 'Weak Password Policy', 'Insufficient password complexity requirements allowing weak passwords', 'High', 6.1, 'Authentication', '["Authentication System", "User Accounts"]', 'Open', '2025-07-12 14:50:03.934361', '2025-07-04 00:00:00', NULL, 2, '["CWE-521", "OWASP-A07"]', '["password-policy", "authentication"]', '2025-07-09 14:50:03.934361', '2025-07-14 10:41:41.958029', NULL, NULL, NULL, NULL, '2025-07-07', NULL, 14, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (7, 'Missing Security Headers', 'Web application missing critical security headers (CSP, HSTS, X-Frame-Options)', 'Medium', 5.3, 'Configuration', '["Web Server", "HTTP Headers"]', 'Open', '2025-07-12 14:50:03.934361', '2025-07-07 00:00:00', NULL, 3, '["OWASP-A05"]', '["security-headers", "configuration"]', '2025-07-06 14:50:03.934361', '2025-07-14 10:41:41.957817', NULL, NULL, NULL, NULL, '2025-06-30', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (13, 'Buffer Overflow in Legacy System', 'Stack-based buffer overflow in legacy C application', 'High', 7.8, 'Memory Corruption', '["Legacy Application", "Memory Management"]', 'Open', '2025-07-12 14:50:03.934361', '2025-07-30 00:00:00', NULL, 2, '["CWE-121"]', '["buffer-overflow", "memory-corruption", "legacy"]', '2025-07-06 14:50:03.934361', '2025-07-14 10:32:24.329557', NULL, NULL, NULL, NULL, '2025-07-20', NULL, 14, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (15, 'Insecure Cryptographic Storage', 'Sensitive data stored using weak encryption algorithms', 'Medium', 5.7, 'Cryptography', '["Database", "Encryption"]', 'Open', '2025-07-12 14:50:03.934361', '2025-07-10 00:00:00', NULL, 3, '["CWE-327", "OWASP-A02"]', '["weak-encryption", "cryptography", "data-storage"]', '2025-07-01 14:50:03.934361', '2025-07-14 10:32:24.32964', NULL, NULL, NULL, NULL, '2025-07-31', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (14, 'XML External Entity (XXE) Injection', 'XXE vulnerability in XML parser allowing file disclosure and SSRF', 'High', 7.5, 'Injection', '["XML Parser", "File System"]', 'Resolved', '2025-07-12 14:50:03.934361', '2025-07-14 00:00:00', NULL, 2, '["CWE-611", "OWASP-A03"]', '["xxe", "xml-injection", "ssrf"]', '2025-06-22 14:50:03.934361', '2025-07-14 10:32:24.334615', NULL, NULL, NULL, NULL, '2025-07-06', NULL, 14, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (12, 'Outdated Software Components', 'Application uses outdated third-party components with known vulnerabilities', 'Low', 4.0, 'Component Security', '["Third-party Libraries", "Dependencies"]', 'In Progress', '2025-07-12 14:50:03.934361', '2025-07-25 00:00:00', NULL, 4, '["OWASP-A06"]', '["outdated-components", "dependencies"]', '2025-06-27 14:50:03.934361', '2025-07-14 10:32:24.335154', NULL, NULL, NULL, NULL, '2025-08-26', NULL, 60, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (11, 'Missing Rate Limiting', 'API endpoints lack proper rate limiting controls', 'Low', 3.1, 'Rate Limiting', '["API Endpoints", "Rate Limiting"]', 'Open', '2025-07-12 14:50:03.934361', '2025-07-05 00:00:00', NULL, 4, '["CWE-770", "OWASP-A04"]', '["rate-limiting", "api-security"]', '2025-07-03 14:50:03.934361', '2025-07-14 10:32:24.334905', NULL, NULL, NULL, NULL, '2025-09-01', NULL, 60, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (9, 'Session Fixation Vulnerability', 'Application vulnerable to session fixation attacks', 'Medium', 5.4, 'Session Management', '["Session Management", "Authentication"]', 'Open', '2025-07-12 14:50:03.934361', '2025-07-13 00:00:00', NULL, 3, '["CWE-384", "OWASP-A07"]', '["session-fixation", "session-management"]', '2025-07-08 14:50:03.934361', '2025-07-14 10:32:24.352962', NULL, NULL, NULL, NULL, '2025-08-07', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (10, 'Information Disclosure in Error Messages', 'Detailed error messages revealing sensitive system information', 'Low', 3.7, 'Information Disclosure', '["Error Handling", "System Information"]', 'Accepted Risk', '2025-07-12 14:50:03.934361', '2025-07-01 00:00:00', NULL, 4, '["CWE-209", "OWASP-A09"]', '["information-disclosure", "error-handling"]', '2025-06-30 14:50:03.934361', '2025-07-14 10:32:24.353909', NULL, NULL, NULL, NULL, '2025-08-29', NULL, 60, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (16, 'Cross-Site Request Forgery (CSRF)', 'CSRF vulnerability in state-changing operations', 'Medium', 4.3, 'Cross-Site Request Forgery', '["Web Application", "State Management"]', 'In Progress', '2025-07-12 14:50:03.934361', '2025-07-03 00:00:00', NULL, 3, '["CWE-352", "OWASP-A01"]', '["csrf", "web-security"]', '2025-07-07 14:50:03.934361', '2025-07-14 10:32:24.353326', NULL, NULL, NULL, NULL, '2025-08-06', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (17, 'SQL Injection in User Authentication', 'Critical SQL injection vulnerability in user authentication module allowing unauthorized access to sensitive data', 'Critical', 9.8, 'Injection', '["Web Application", "Database Server", "Authentication System"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 1, '["CWE-89", "OWASP-A03"]', '["sql-injection", "authentication", "web-security"]', '2025-07-12 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-08-11', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (18, 'Remote Code Execution in File Upload', 'Unrestricted file upload allowing remote code execution on the server', 'Critical', 9.9, 'Code Execution', '["Web Server", "File System"]', 'In Progress', '2025-07-14 22:01:10.772823', NULL, NULL, 1, '["CWE-434", "OWASP-A04"]', '["rce", "file-upload", "web-security"]', '2025-07-09 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-08-08', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (19, 'Privilege Escalation in Admin Panel', 'Vertical privilege escalation vulnerability allowing regular users to gain administrative access', 'Critical', 8.8, 'Access Control', '["Admin Panel", "User Management System"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 1, '["CWE-269", "OWASP-A01"]', '["privilege-escalation", "access-control"]', '2025-07-13 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-08-12', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (20, 'Unpatched Operating System Vulnerabilities', 'Critical security patches missing from production servers', 'Critical', 9.1, 'System', '["Windows Server 2019", "Ubuntu 20.04", "CentOS 8"]', 'In Progress', '2025-07-14 22:01:10.772823', NULL, NULL, 1, '["CVE-2023-1234", "CVE-2023-5678"]', '["unpatched-software", "system-vulnerability", "os"]', '2025-06-29 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-29', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (21, 'Buffer Overflow in Network Service', 'Stack-based buffer overflow in custom network service allowing remote code execution', 'Critical', 9.3, 'Memory Corruption', '["Network Service", "TCP Port 8080"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 1, '["CWE-121", "CVE-2023-6789"]', '["buffer-overflow", "network-service", "rce"]', '2025-07-11 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-08-10', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (22, 'Default IoT Device Credentials', 'IoT devices deployed with default administrative credentials', 'Critical', 9.0, 'Authentication', '["IP Cameras", "Smart Thermostats", "Access Control Systems"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 1, '["CWE-521", "CVE-2023-7890"]', '["default-credentials", "iot-vulnerability", "authentication"]', '2025-07-07 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-08-06', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (23, 'Insecure Deserialization', 'Unsafe deserialization of user-controlled data leading to remote code execution', 'Critical', 9.5, 'Deserialization', '["Java Application Server", "API Gateway"]', 'In Progress', '2025-07-14 22:01:10.772823', NULL, NULL, 1, '["CWE-502", "OWASP-A08"]', '["deserialization", "java", "rce"]', '2025-07-10 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-08-09', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (24, 'Hardcoded Database Credentials', 'Database connection strings with hardcoded credentials in source code', 'Critical', 8.9, 'Cryptography', '["Source Code", "Database Connections"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 1, '["CWE-798"]', '["hardcoded-credentials", "database", "source-code"]', '2025-07-08 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-08-07', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (25, 'Unauthenticated API Endpoints', 'Critical API endpoints accessible without authentication', 'Critical', 9.2, 'Authentication', '["REST API", "Admin Functions"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 1, '["CWE-306", "OWASP-A07"]', '["unauthenticated-api", "access-control"]', '2025-07-06 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-08-05', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (26, 'Weak Encryption Implementation', 'Use of deprecated MD5 hashing for password storage', 'Critical', 8.7, 'Cryptography', '["User Authentication", "Password Storage"]', 'In Progress', '2025-07-14 22:01:10.772823', NULL, NULL, 1, '["CWE-327", "OWASP-A02"]', '["weak-encryption", "password-hashing", "md5"]', '2025-07-04 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-08-03', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (27, 'Cross-Site Scripting in Search Function', 'Reflected XSS vulnerability in search functionality', 'High', 7.2, 'Cross-Site Scripting', '["Web Application", "Search Module"]', 'Resolved', '2025-07-14 22:01:10.772823', NULL, NULL, 2, '["CWE-79", "OWASP-A03"]', '["xss", "reflected-xss", "search"]', '2025-07-02 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-08-01', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (28, 'Insecure Direct Object Reference', 'Users can access other users data by manipulating object IDs', 'High', 6.5, 'Access Control', '["User Profile API", "Document Access"]', 'In Progress', '2025-07-14 22:01:10.772823', NULL, NULL, 2, '["CWE-639", "OWASP-A01"]', '["idor", "access-control", "api"]', '2025-07-05 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-08-04', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (29, 'Weak Password Policy', 'Password policy allows weak passwords (minimum 6 characters)', 'High', 6.1, 'Authentication', '["User Registration", "Password Reset"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 2, '["CWE-521"]', '["password-policy", "weak-passwords"]', '2025-06-30 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-30', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (30, 'Unencrypted Network Communications', 'Sensitive data transmitted over HTTP instead of HTTPS', 'High', 7.4, 'Network', '["Web Application", "API Communications"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 2, '["CWE-319"]', '["unencrypted-communications", "http", "data-transmission"]', '2025-07-03 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-08-02', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (31, 'Open Database Port', 'Database server accessible directly from the internet', 'High', 8.1, 'Network', '["MySQL Database", "Port 3306"]', 'In Progress', '2025-07-14 22:01:10.772823', NULL, NULL, 2, '["CWE-200"]', '["open-ports", "database-exposure", "network"]', '2025-07-09 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-08-08', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (32, 'Insecure File Permissions', 'Configuration files readable by all users', 'High', 7.0, 'Configuration', '["Configuration Files", "Application Secrets"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 2, '["CWE-732"]', '["file-permissions", "configuration", "secrets"]', '2025-07-01 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-31', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (33, 'XML External Entity Injection', 'XXE vulnerability in XML processing allowing file disclosure', 'High', 7.5, 'Injection', '["XML Parser", "Document Upload"]', 'Resolved', '2025-07-14 22:01:10.772823', NULL, NULL, 2, '["CWE-611", "OWASP-A03"]', '["xxe", "xml-injection", "file-disclosure"]', '2025-06-24 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-24', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (34, 'Insufficient Session Timeout', 'User sessions remain active for extended periods without activity', 'High', 6.8, 'Session Management', '["Web Application", "User Sessions"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 2, '["CWE-613"]', '["session-timeout", "session-management"]', '2025-06-28 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-28', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (35, 'Insecure Cloud Storage Configuration', 'S3 bucket configured with public read access', 'High', 8.6, 'Cloud', '["AWS S3 Bucket", "Document Storage"]', 'Resolved', '2025-07-14 22:01:10.772823', NULL, NULL, 2, '["CWE-200"]', '["cloud-storage", "s3-bucket", "public-access"]', '2025-06-26 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-26', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (36, 'Vulnerable Third-Party Library', 'Outdated JavaScript library with known security vulnerabilities', 'High', 7.6, 'Component Security', '["Frontend Application", "jQuery 1.8.3"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 2, '["CVE-2023-0123", "OWASP-A06"]', '["third-party-library", "javascript", "outdated-components"]', '2025-06-27 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-27', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (37, 'Missing Multi-Factor Authentication', 'Administrative accounts lack multi-factor authentication', 'High', 7.3, 'Authentication', '["Admin Panel", "Privileged Accounts"]', 'In Progress', '2025-07-14 22:01:10.772823', NULL, NULL, 2, '["CWE-308"]', '["mfa", "multi-factor-authentication", "admin-accounts"]', '2025-06-25 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-25', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (38, 'Insecure API Rate Limiting', 'API endpoints vulnerable to brute force attacks due to missing rate limiting', 'High', 6.9, 'Rate Limiting', '["Login API", "Password Reset API"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 2, '["CWE-770"]', '["rate-limiting", "brute-force", "api-security"]', '2025-06-23 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-23', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (39, 'Container Security Misconfiguration', 'Docker containers running with root privileges', 'High', 7.1, 'Container', '["Docker Containers", "Production Environment"]', 'In Progress', '2025-07-14 22:01:10.772823', NULL, NULL, 2, '["CWE-250"]', '["container-security", "docker", "root-privileges"]', '2025-06-22 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-22', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (40, 'Insecure Mobile App Data Storage', 'Sensitive data stored in plain text on mobile devices', 'High', 7.2, 'Mobile', '["iOS Application", "Android Application"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 2, '["CWE-312"]', '["mobile-security", "data-storage", "plain-text"]', '2025-06-21 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-21', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (41, 'Firmware Vulnerability in Network Equipment', 'Unpatched firmware in network switches and routers', 'High', 8.2, 'Network', '["Cisco Switches", "Network Infrastructure"]', 'In Progress', '2025-07-14 22:01:10.772823', NULL, NULL, 2, '["CVE-2023-8901"]', '["firmware-vulnerability", "network-equipment", "cisco"]', '2025-06-20 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-20', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (42, 'Missing Security Headers', 'Web application missing critical security headers', 'Medium', 5.3, 'Configuration', '["Web Server", "HTTP Response Headers"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 3, '["OWASP-A05"]', '["security-headers", "csp", "hsts"]', '2025-06-19 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-19', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (43, 'Verbose Error Messages', 'Application reveals sensitive information in error messages', 'Medium', 4.7, 'Information Disclosure', '["Web Application", "Error Handling"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 3, '["CWE-209"]', '["information-disclosure", "error-messages"]', '2025-06-18 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-18', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (44, 'Session Fixation Vulnerability', 'Application vulnerable to session fixation attacks', 'Medium', 5.4, 'Session Management', '["Login Process", "Session Handling"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 3, '["CWE-384"]', '["session-fixation", "session-management"]', '2025-06-17 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-17', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (45, 'Cross-Site Request Forgery', 'State-changing operations lack CSRF protection', 'Medium', 4.3, 'Cross-Site Request Forgery', '["Web Forms", "State-Changing Operations"]', 'In Progress', '2025-07-14 22:01:10.772823', NULL, NULL, 3, '["CWE-352", "OWASP-A01"]', '["csrf", "web-security", "forms"]', '2025-06-16 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-16', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (46, 'Weak SSL/TLS Configuration', 'Server supports weak SSL/TLS protocols and cipher suites', 'Medium', 5.9, 'Cryptography', '["Web Server", "SSL/TLS Configuration"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 3, '["CWE-326"]', '["ssl-tls", "weak-ciphers", "protocol-downgrade"]', '2025-06-15 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-15', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (47, 'Insufficient Input Validation', 'User input not properly validated leading to potential injection attacks', 'Medium', 5.1, 'Input Validation', '["Contact Form", "Search Function"]', 'In Progress', '2025-07-14 22:01:10.772823', NULL, NULL, 3, '["CWE-20"]', '["input-validation", "injection-prevention"]', '2025-06-14 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-14', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (48, 'Insecure Cookie Configuration', 'Session cookies lack secure and httpOnly flags', 'Medium', 4.8, 'Session Management', '["Web Application", "Cookie Handling"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 3, '["CWE-614"]', '["cookie-security", "session-cookies"]', '2025-06-13 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-13', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (49, 'Directory Traversal Vulnerability', 'File access functionality vulnerable to path traversal attacks', 'Medium', 5.7, 'Path Traversal', '["File Download", "Document Access"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 3, '["CWE-22"]', '["directory-traversal", "path-traversal", "file-access"]', '2025-06-12 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-12', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (50, 'Weak Random Number Generation', 'Application uses predictable random number generation for security tokens', 'Medium', 5.0, 'Cryptography', '["Password Reset Tokens", "Session IDs"]', 'In Progress', '2025-07-14 22:01:10.772823', NULL, NULL, 3, '["CWE-338"]', '["weak-random", "token-generation", "predictable"]', '2025-06-11 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-11', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (51, 'Insufficient Logging and Monitoring', 'Security events not properly logged or monitored', 'Medium', 4.5, 'Monitoring', '["Application Logs", "Security Events"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 3, '["CWE-778", "OWASP-A09"]', '["logging", "monitoring", "security-events"]', '2025-06-10 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-10', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (52, 'Outdated Content Management System', 'WordPress installation running outdated version with known vulnerabilities', 'Medium', 6.2, 'Component Security', '["WordPress CMS", "Website"]', 'In Progress', '2025-07-14 22:01:10.772823', NULL, NULL, 3, '["CVE-2023-2468"]', '["cms", "wordpress", "outdated-software"]', '2025-06-09 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-09', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (53, 'Insecure Backup Storage', 'Database backups stored without encryption', 'Medium', 5.6, 'Data Protection', '["Database Backups", "File Server"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 3, '["CWE-312"]', '["backup-security", "encryption", "data-protection"]', '2025-06-08 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-08', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (54, 'Missing Content Security Policy', 'Web application lacks Content Security Policy headers', 'Medium', 4.2, 'Configuration', '["Web Application", "Browser Security"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 3, '["CWE-693"]', '["csp", "content-security-policy", "xss-prevention"]', '2025-06-07 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-07', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (55, 'Weak Database Permissions', 'Database user accounts have excessive privileges', 'Medium', 5.8, 'Access Control', '["Database Server", "User Permissions"]', 'In Progress', '2025-07-14 22:01:10.772823', NULL, NULL, 3, '["CWE-250"]', '["database-permissions", "least-privilege"]', '2025-06-06 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-06', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (56, 'Insecure File Upload Validation', 'File upload functionality lacks proper file type validation', 'Medium', 5.5, 'Input Validation', '["File Upload", "Document Management"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 3, '["CWE-434"]', '["file-upload", "validation", "file-type-check"]', '2025-06-05 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-05', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (57, 'Information Disclosure in Comments', 'HTML comments contain sensitive development information', 'Low', 3.7, 'Information Disclosure', '["Web Pages", "HTML Source"]', 'Accepted Risk', '2025-07-14 22:01:10.772823', NULL, NULL, 4, '["CWE-200"]', '["information-disclosure", "html-comments"]', '2025-06-04 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-04', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (58, 'Missing Rate Limiting on Contact Form', 'Contact form lacks rate limiting allowing spam submissions', 'Low', 3.1, 'Rate Limiting', '["Contact Form", "Email System"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 4, '["CWE-770"]', '["rate-limiting", "spam-prevention", "contact-form"]', '2025-06-03 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-03', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (59, 'Outdated jQuery Version', 'Website uses outdated jQuery version with minor security issues', 'Low', 4.0, 'Component Security', '["Frontend", "JavaScript Libraries"]', 'In Progress', '2025-07-14 22:01:10.772823', NULL, NULL, 4, '["CVE-2023-1357"]', '["jquery", "outdated-library", "frontend"]', '2025-06-02 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-02', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (60, 'Weak Password Complexity Indicator', 'Password strength indicator provides misleading feedback', 'Low', 2.8, 'User Interface', '["Registration Form", "Password Field"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 4, '["CWE-521"]', '["password-indicator", "user-experience"]', '2025-06-01 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-07-01', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (61, 'Missing Autocomplete Attributes', 'Form fields lack proper autocomplete attributes', 'Low', 2.5, 'Configuration', '["Login Form", "Registration Form"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 4, '["CWE-200"]', '["autocomplete", "form-security", "privacy"]', '2025-05-31 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-06-30', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (62, 'Verbose Server Banner', 'Web server reveals detailed version information', 'Low', 3.3, 'Information Disclosure', '["Web Server", "HTTP Headers"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 4, '["CWE-200"]', '["server-banner", "information-disclosure", "fingerprinting"]', '2025-05-30 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-06-29', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (63, 'Missing Referrer Policy', 'Web pages lack referrer policy headers', 'Low', 2.9, 'Configuration', '["Web Application", "Privacy Headers"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 4, '["CWE-200"]', '["referrer-policy", "privacy", "information-leakage"]', '2025-05-29 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-06-28', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (64, 'Insecure Development Practices', 'Debug mode enabled in production environment', 'Low', 3.5, 'Configuration', '["Application Configuration", "Debug Settings"]', 'In Progress', '2025-07-14 22:01:10.772823', NULL, NULL, 4, '["CWE-489"]', '["debug-mode", "production-configuration"]', '2025-05-28 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-06-27', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (65, 'Missing Favicon Security', 'Favicon requests reveal information about internal structure', 'Low', 2.1, 'Information Disclosure', '["Web Server", "Static Files"]', 'Accepted Risk', '2025-07-14 22:01:10.772823', NULL, NULL, 4, '["CWE-200"]', '["favicon", "information-disclosure", "reconnaissance"]', '2025-05-27 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-06-26', NULL, 30, NULL, NULL);
-- INSERT INTO public.vulnerabilities VALUES (66, 'Weak Email Validation', 'Email validation allows potentially malicious email formats', 'Low', 3.0, 'Input Validation', '["Registration Form", "Contact Form"]', 'Open', '2025-07-14 22:01:10.772823', NULL, NULL, 4, '["CWE-20"]', '["email-validation", "input-validation", "format-validation"]', '2025-05-26 22:01:10.772823', '2025-07-14 22:01:10.772823', NULL, NULL, NULL, NULL, '2025-06-25', NULL, 30, NULL, NULL);


-- --
-- -- TOC entry 6629 (class 0 OID 114764)
-- -- Dependencies: 283
-- -- Data for Name: workflow_risk_assessments; Type: TABLE DATA; Schema: public; Owner: neondb_owner
-- --



-- --
-- -- TOC entry 7143 (class 0 OID 0)
-- -- Dependencies: 483
-- -- Name: ai_analysis_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.ai_analysis_results_id_seq', 27, true);


-- --
-- -- TOC entry 7144 (class 0 OID 0)
-- -- Dependencies: 254
-- -- Name: assessment_action_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.assessment_action_plans_id_seq', 1, false);


-- --
-- -- TOC entry 7145 (class 0 OID 0)
-- -- Dependencies: 244
-- -- Name: assessment_assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.assessment_assets_id_seq', 12, true);


-- --
-- -- TOC entry 7146 (class 0 OID 0)
-- -- Dependencies: 256
-- -- Name: assessment_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.assessment_comments_id_seq', 1, false);


-- --
-- -- TOC entry 7147 (class 0 OID 0)
-- -- Dependencies: 508
-- -- Name: assessment_findings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.assessment_findings_id_seq', 2, true);


-- --
-- -- TOC entry 7148 (class 0 OID 0)
-- -- Dependencies: 250
-- -- Name: assessment_impacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.assessment_impacts_id_seq', 1, false);


-- --
-- -- TOC entry 7149 (class 0 OID 0)
-- -- Dependencies: 252
-- -- Name: assessment_risk_evaluations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.assessment_risk_evaluations_id_seq', 1, false);


-- --
-- -- TOC entry 7150 (class 0 OID 0)
-- -- Dependencies: 246
-- -- Name: assessment_threats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.assessment_threats_id_seq', 1, false);


-- --
-- -- TOC entry 7151 (class 0 OID 0)
-- -- Dependencies: 248
-- -- Name: assessment_vulnerabilities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.assessment_vulnerabilities_id_seq', 1, false);


-- --
-- -- TOC entry 7152 (class 0 OID 0)
-- -- Dependencies: 506
-- -- Name: assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.assessments_id_seq', 53, true);


-- --
-- -- TOC entry 7153 (class 0 OID 0)
-- -- Dependencies: 337
-- -- Name: asset_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.asset_id_seq', 1, false);


-- --
-- -- TOC entry 7154 (class 0 OID 0)
-- -- Dependencies: 335
-- -- Name: assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.assets_id_seq', 15, true);


-- --
-- -- TOC entry 7155 (class 0 OID 0)
-- -- Dependencies: 411
-- -- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.audit_logs_id_seq', 86, true);


-- --
-- -- TOC entry 7156 (class 0 OID 0)
-- -- Dependencies: 603
-- -- Name: auth_audit_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.auth_audit_log_id_seq', 1, false);


-- --
-- -- TOC entry 7157 (class 0 OID 0)
-- -- Dependencies: 238
-- -- Name: compliance_frameworks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.compliance_frameworks_id_seq', 101, true);


-- --
-- -- TOC entry 7158 (class 0 OID 0)
-- -- Dependencies: 240
-- -- Name: compliance_requirements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.compliance_requirements_id_seq', 1, false);


-- --
-- -- TOC entry 7159 (class 0 OID 0)
-- -- Dependencies: 264
-- -- Name: comprehensive_risk_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.comprehensive_risk_assessments_id_seq', 21, true);


-- --
-- -- TOC entry 7160 (class 0 OID 0)
-- -- Dependencies: 306
-- -- Name: control_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.control_assessments_id_seq', 1, false);


-- --
-- -- TOC entry 7161 (class 0 OID 0)
-- -- Dependencies: 304
-- -- Name: control_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.control_categories_id_seq', 14, true);


-- --
-- -- TOC entry 7162 (class 0 OID 0)
-- -- Dependencies: 368
-- -- Name: control_test_evidence_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.control_test_evidence_id_seq', 1, false);


-- --
-- -- TOC entry 7163 (class 0 OID 0)
-- -- Dependencies: 364
-- -- Name: control_test_executions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.control_test_executions_id_seq', 3, true);


-- --
-- -- TOC entry 7164 (class 0 OID 0)
-- -- Dependencies: 366
-- -- Name: control_test_issues_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.control_test_issues_id_seq', 1, true);


-- --
-- -- TOC entry 7165 (class 0 OID 0)
-- -- Dependencies: 362
-- -- Name: control_test_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.control_test_plans_id_seq', 3, true);


-- --
-- -- TOC entry 7166 (class 0 OID 0)
-- -- Dependencies: 370
-- -- Name: control_test_schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.control_test_schedule_id_seq', 3, true);


-- --
-- -- TOC entry 7167 (class 0 OID 0)
-- -- Dependencies: 310
-- -- Name: control_testing_schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.control_testing_schedule_id_seq', 1, false);


-- --
-- -- TOC entry 7168 (class 0 OID 0)
-- -- Dependencies: 232
-- -- Name: controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.controls_id_seq', 11, true);


-- --
-- -- TOC entry 7169 (class 0 OID 0)
-- -- Dependencies: 236
-- -- Name: cybersecurity_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.cybersecurity_assessments_id_seq', 2, true);


-- --
-- -- TOC entry 7170 (class 0 OID 0)
-- -- Dependencies: 527
-- -- Name: database_tables_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.database_tables_id_seq', 1, false);


-- --
-- -- TOC entry 7171 (class 0 OID 0)
-- -- Dependencies: 421
-- -- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.departments_id_seq', 1, true);


-- --
-- -- TOC entry 7172 (class 0 OID 0)
-- -- Dependencies: 443
-- -- Name: document_access_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.document_access_log_id_seq', 1, false);


-- --
-- -- TOC entry 7173 (class 0 OID 0)
-- -- Dependencies: 425
-- -- Name: document_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.document_categories_id_seq', 8, true);


-- --
-- -- TOC entry 7174 (class 0 OID 0)
-- -- Dependencies: 435
-- -- Name: document_control_mappings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.document_control_mappings_id_seq', 4, true);


-- --
-- -- TOC entry 7175 (class 0 OID 0)
-- -- Dependencies: 439
-- -- Name: document_finding_mappings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.document_finding_mappings_id_seq', 3, true);


-- --
-- -- TOC entry 7176 (class 0 OID 0)
-- -- Dependencies: 433
-- -- Name: document_relationships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.document_relationships_id_seq', 5, true);


-- --
-- -- TOC entry 7177 (class 0 OID 0)
-- -- Dependencies: 441
-- -- Name: document_review_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.document_review_history_id_seq', 1, false);


-- --
-- -- TOC entry 7178 (class 0 OID 0)
-- -- Dependencies: 437
-- -- Name: document_risk_mappings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.document_risk_mappings_id_seq', 1, false);


-- --
-- -- TOC entry 7179 (class 0 OID 0)
-- -- Dependencies: 449
-- -- Name: evidence_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.evidence_id_seq', 8, true);


-- --
-- -- TOC entry 7180 (class 0 OID 0)
-- -- Dependencies: 431
-- -- Name: evidence_library_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.evidence_library_id_seq', 5, true);


-- --
-- -- TOC entry 7181 (class 0 OID 0)
-- -- Dependencies: 487
-- -- Name: fair_risk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.fair_risk_id_seq', 2, true);


-- --
-- -- TOC entry 7182 (class 0 OID 0)
-- -- Dependencies: 490
-- -- Name: fair_risk_treatment_controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.fair_risk_treatment_controls_id_seq', 1, false);


-- --
-- -- TOC entry 7183 (class 0 OID 0)
-- -- Dependencies: 488
-- -- Name: fair_risk_treatment_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.fair_risk_treatment_plans_id_seq', 2, true);


-- --
-- -- TOC entry 7184 (class 0 OID 0)
-- -- Dependencies: 492
-- -- Name: fair_risk_treatment_tracking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.fair_risk_treatment_tracking_id_seq', 1, false);


-- --
-- -- TOC entry 7185 (class 0 OID 0)
-- -- Dependencies: 485
-- -- Name: fair_risks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.fair_risks_id_seq', 15, true);


-- --
-- -- TOC entry 7186 (class 0 OID 0)
-- -- Dependencies: 455
-- -- Name: hipaa_assessment_requirements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.hipaa_assessment_requirements_id_seq', 1, false);


-- --
-- -- TOC entry 7187 (class 0 OID 0)
-- -- Dependencies: 481
-- -- Name: hipaa_assessment_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.hipaa_assessment_results_id_seq', 71, true);


-- --
-- -- TOC entry 7188 (class 0 OID 0)
-- -- Dependencies: 453
-- -- Name: hipaa_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.hipaa_assessments_id_seq', 6, true);


-- --
-- -- TOC entry 7189 (class 0 OID 0)
-- -- Dependencies: 394
-- -- Name: hipaa_compliance_tests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.hipaa_compliance_tests_id_seq', 1, false);


-- --
-- -- TOC entry 7190 (class 0 OID 0)
-- -- Dependencies: 392
-- -- Name: hipaa_controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.hipaa_controls_id_seq', 36, true);


-- --
-- -- TOC entry 7191 (class 0 OID 0)
-- -- Dependencies: 469
-- -- Name: hipaa_remediation_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.hipaa_remediation_actions_id_seq', 15, true);


-- --
-- -- TOC entry 7192 (class 0 OID 0)
-- -- Dependencies: 457
-- -- Name: hipaa_requirements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.hipaa_requirements_id_seq', 103, true);


-- --
-- -- TOC entry 7193 (class 0 OID 0)
-- -- Dependencies: 234
-- -- Name: incidents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.incidents_id_seq', 66, true);


-- --
-- -- TOC entry 7194 (class 0 OID 0)
-- -- Dependencies: 288
-- -- Name: information_assets_detailed_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.information_assets_detailed_id_seq', 1, false);


-- --
-- -- TOC entry 7195 (class 0 OID 0)
-- -- Dependencies: 228
-- -- Name: information_assets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.information_assets_id_seq', 34, true);


-- --
-- -- TOC entry 7196 (class 0 OID 0)
-- -- Dependencies: 504
-- -- Name: iso27001_control_effectiveness_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_control_effectiveness_id_seq', 31, true);


-- --
-- -- TOC entry 7197 (class 0 OID 0)
-- -- Dependencies: 415
-- -- Name: iso27001_controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_controls_id_seq', 14, true);


-- --
-- -- TOC entry 7198 (class 0 OID 0)
-- -- Dependencies: 511
-- -- Name: iso27001_evidence_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_evidence_id_seq', 1, false);


-- --
-- -- TOC entry 7199 (class 0 OID 0)
-- -- Dependencies: 376
-- -- Name: iso27001_risk_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_risk_assessments_id_seq', 11, true);


-- --
-- -- TOC entry 7200 (class 0 OID 0)
-- -- Dependencies: 417
-- -- Name: iso27001_risk_controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_risk_controls_id_seq', 1, false);


-- --
-- -- TOC entry 7201 (class 0 OID 0)
-- -- Dependencies: 302
-- -- Name: iso27001_risk_metrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_risk_metrics_id_seq', 1, false);


-- --
-- -- TOC entry 7202 (class 0 OID 0)
-- -- Dependencies: 300
-- -- Name: iso27001_risk_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_risk_reviews_id_seq', 1, false);


-- --
-- -- TOC entry 7203 (class 0 OID 0)
-- -- Dependencies: 296
-- -- Name: iso27001_risk_scenarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_risk_scenarios_id_seq', 1, false);


-- --
-- -- TOC entry 7204 (class 0 OID 0)
-- -- Dependencies: 298
-- -- Name: iso27001_risk_treatment_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_risk_treatment_plans_id_seq', 1, false);


-- --
-- -- TOC entry 7205 (class 0 OID 0)
-- -- Dependencies: 413
-- -- Name: iso27001_risks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_risks_id_seq', 50, true);


-- --
-- -- TOC entry 7206 (class 0 OID 0)
-- -- Dependencies: 374
-- -- Name: iso27001_sub_controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_sub_controls_id_seq', 1, false);


-- --
-- -- TOC entry 7207 (class 0 OID 0)
-- -- Dependencies: 290
-- -- Name: iso27001_threat_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_threat_categories_id_seq', 5, true);


-- --
-- -- TOC entry 7208 (class 0 OID 0)
-- -- Dependencies: 292
-- -- Name: iso27001_threats_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_threats_id_seq', 25, true);


-- --
-- -- TOC entry 7209 (class 0 OID 0)
-- -- Dependencies: 496
-- -- Name: iso27001_treatment_controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_treatment_controls_id_seq', 1, false);


-- --
-- -- TOC entry 7210 (class 0 OID 0)
-- -- Dependencies: 494
-- -- Name: iso27001_treatment_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_treatment_plans_id_seq', 1, true);


-- --
-- -- TOC entry 7211 (class 0 OID 0)
-- -- Dependencies: 498
-- -- Name: iso27001_treatment_tracking_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_treatment_tracking_id_seq', 1, false);


-- --
-- -- TOC entry 7212 (class 0 OID 0)
-- -- Dependencies: 513
-- -- Name: iso27001_validation_rules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_validation_rules_id_seq', 1, true);


-- --
-- -- TOC entry 7213 (class 0 OID 0)
-- -- Dependencies: 294
-- -- Name: iso27001_vulnerabilities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27001_vulnerabilities_id_seq', 18, true);


-- --
-- -- TOC entry 7214 (class 0 OID 0)
-- -- Dependencies: 312
-- -- Name: iso27002_control_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27002_control_categories_id_seq', 38, true);


-- --
-- -- TOC entry 7215 (class 0 OID 0)
-- -- Dependencies: 314
-- -- Name: iso27002_controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.iso27002_controls_id_seq', 120, true);


-- --
-- -- TOC entry 7216 (class 0 OID 0)
-- -- Dependencies: 605
-- -- Name: login_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.login_attempts_id_seq', 1, false);


-- --
-- -- TOC entry 7217 (class 0 OID 0)
-- -- Dependencies: 260
-- -- Name: mitigation_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.mitigation_actions_id_seq', 1, true);


-- --
-- -- TOC entry 7218 (class 0 OID 0)
-- -- Dependencies: 463
-- -- Name: nesa_uae_assessment_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nesa_uae_assessment_results_id_seq', 5, true);


-- --
-- -- TOC entry 7219 (class 0 OID 0)
-- -- Dependencies: 459
-- -- Name: nesa_uae_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nesa_uae_assessments_id_seq', 1, true);


-- --
-- -- TOC entry 7220 (class 0 OID 0)
-- -- Dependencies: 479
-- -- Name: nesa_uae_gap_analysis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nesa_uae_gap_analysis_id_seq', 1, false);


-- --
-- -- TOC entry 7221 (class 0 OID 0)
-- -- Dependencies: 502
-- -- Name: nesa_uae_remediation_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nesa_uae_remediation_actions_id_seq', 1, true);


-- --
-- -- TOC entry 7222 (class 0 OID 0)
-- -- Dependencies: 467
-- -- Name: nesa_uae_remediation_dependencies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nesa_uae_remediation_dependencies_id_seq', 2, true);


-- --
-- -- TOC entry 7223 (class 0 OID 0)
-- -- Dependencies: 465
-- -- Name: nesa_uae_remediation_updates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nesa_uae_remediation_updates_id_seq', 5, true);


-- --
-- -- TOC entry 7224 (class 0 OID 0)
-- -- Dependencies: 461
-- -- Name: nesa_uae_requirements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nesa_uae_requirements_id_seq', 50, true);


-- --
-- -- TOC entry 7225 (class 0 OID 0)
-- -- Dependencies: 473
-- -- Name: nesa_uae_self_assessment_audit_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nesa_uae_self_assessment_audit_log_id_seq', 9, true);


-- --
-- -- TOC entry 7226 (class 0 OID 0)
-- -- Dependencies: 475
-- -- Name: nesa_uae_self_assessment_controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nesa_uae_self_assessment_controls_id_seq', 5, true);


-- --
-- -- TOC entry 7227 (class 0 OID 0)
-- -- Dependencies: 471
-- -- Name: nesa_uae_self_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nesa_uae_self_assessments_id_seq', 3, true);


-- --
-- -- TOC entry 7228 (class 0 OID 0)
-- -- Dependencies: 477
-- -- Name: nesa_uae_sub_controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nesa_uae_sub_controls_id_seq', 1, false);


-- --
-- -- TOC entry 7229 (class 0 OID 0)
-- -- Dependencies: 318
-- -- Name: nist_csf_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nist_csf_categories_id_seq', 29, true);


-- --
-- -- TOC entry 7230 (class 0 OID 0)
-- -- Dependencies: 316
-- -- Name: nist_csf_functions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nist_csf_functions_id_seq', 6, true);


-- --
-- -- TOC entry 7231 (class 0 OID 0)
-- -- Dependencies: 326
-- -- Name: nist_csf_implementation_tiers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nist_csf_implementation_tiers_id_seq', 4, true);


-- --
-- -- TOC entry 7232 (class 0 OID 0)
-- -- Dependencies: 500
-- -- Name: nist_csf_mitigation_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nist_csf_mitigation_plans_id_seq', 31, true);


-- --
-- -- TOC entry 7233 (class 0 OID 0)
-- -- Dependencies: 328
-- -- Name: nist_csf_organizational_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nist_csf_organizational_profiles_id_seq', 1, false);


-- --
-- -- TOC entry 7234 (class 0 OID 0)
-- -- Dependencies: 330
-- -- Name: nist_csf_risk_scenarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nist_csf_risk_scenarios_id_seq', 4, true);


-- --
-- -- TOC entry 7235 (class 0 OID 0)
-- -- Dependencies: 322
-- -- Name: nist_csf_risk_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nist_csf_risk_templates_id_seq', 24, true);


-- --
-- -- TOC entry 7236 (class 0 OID 0)
-- -- Dependencies: 320
-- -- Name: nist_csf_subcategories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nist_csf_subcategories_id_seq', 180, true);


-- --
-- -- TOC entry 7237 (class 0 OID 0)
-- -- Dependencies: 324
-- -- Name: nist_csf_template_controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nist_csf_template_controls_id_seq', 2, true);


-- --
-- -- TOC entry 7238 (class 0 OID 0)
-- -- Dependencies: 387
-- -- Name: nist_references_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.nist_references_id_seq', 33, true);


-- --
-- -- TOC entry 7239 (class 0 OID 0)
-- -- Dependencies: 539
-- -- Name: organization_sla_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.organization_sla_config_id_seq', 4, true);


-- --
-- -- TOC entry 7240 (class 0 OID 0)
-- -- Dependencies: 242
-- -- Name: organizations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.organizations_id_seq', 19, true);


-- --
-- -- TOC entry 7241 (class 0 OID 0)
-- -- Dependencies: 420
-- -- Name: organizations_organization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.organizations_organization_id_seq', 14, true);


-- --
-- -- TOC entry 7242 (class 0 OID 0)
-- -- Dependencies: 517
-- -- Name: pages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.pages_id_seq', 1, true);


-- --
-- -- TOC entry 7243 (class 0 OID 0)
-- -- Dependencies: 521
-- -- Name: permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.permissions_id_seq', 12, true);


-- --
-- -- TOC entry 7244 (class 0 OID 0)
-- -- Dependencies: 360
-- -- Name: phishing_simulation_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.phishing_simulation_results_id_seq', 1, false);


-- --
-- -- TOC entry 7245 (class 0 OID 0)
-- -- Dependencies: 358
-- -- Name: phishing_simulations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.phishing_simulations_id_seq', 1, true);


-- --
-- -- TOC entry 7246 (class 0 OID 0)
-- -- Dependencies: 226
-- -- Name: playing_with_neon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.playing_with_neon_id_seq', 10, true);


-- --
-- -- TOC entry 7247 (class 0 OID 0)
-- -- Dependencies: 445
-- -- Name: policies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.policies_id_seq', 8, true);


-- --
-- -- TOC entry 7248 (class 0 OID 0)
-- -- Dependencies: 429
-- -- Name: policy_document_versions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.policy_document_versions_id_seq', 8, true);


-- --
-- -- TOC entry 7249 (class 0 OID 0)
-- -- Dependencies: 427
-- -- Name: policy_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.policy_documents_id_seq', 8, true);


-- --
-- -- TOC entry 7250 (class 0 OID 0)
-- -- Dependencies: 451
-- -- Name: policy_evidence_links_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.policy_evidence_links_id_seq', 8, true);


-- --
-- -- TOC entry 7251 (class 0 OID 0)
-- -- Dependencies: 447
-- -- Name: policy_versions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.policy_versions_id_seq', 1, false);


-- --
-- -- TOC entry 7252 (class 0 OID 0)
-- -- Dependencies: 352
-- -- Name: quiz_attempts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.quiz_attempts_id_seq', 1, false);


-- --
-- -- TOC entry 7253 (class 0 OID 0)
-- -- Dependencies: 346
-- -- Name: quiz_questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.quiz_questions_id_seq', 5, true);


-- --
-- -- TOC entry 7254 (class 0 OID 0)
-- -- Dependencies: 372
-- -- Name: report_downloads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.report_downloads_id_seq', 1, false);


-- --
-- -- TOC entry 7255 (class 0 OID 0)
-- -- Dependencies: 308
-- -- Name: residual_risk_calculations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.residual_risk_calculations_id_seq', 1, false);


-- --
-- -- TOC entry 7256 (class 0 OID 0)
-- -- Dependencies: 380
-- -- Name: risk_action_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_action_plans_id_seq', 1, false);


-- --
-- -- TOC entry 7257 (class 0 OID 0)
-- -- Dependencies: 278
-- -- Name: risk_assessment_context_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_assessment_context_id_seq', 2, true);


-- --
-- -- TOC entry 7258 (class 0 OID 0)
-- -- Dependencies: 378
-- -- Name: risk_assessment_controls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_assessment_controls_id_seq', 1, false);


-- --
-- -- TOC entry 7259 (class 0 OID 0)
-- -- Dependencies: 280
-- -- Name: risk_assessment_criteria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_assessment_criteria_id_seq', 2, true);


-- --
-- -- TOC entry 7260 (class 0 OID 0)
-- -- Dependencies: 268
-- -- Name: risk_assessment_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_assessment_history_id_seq', 1, false);


-- --
-- -- TOC entry 7261 (class 0 OID 0)
-- -- Dependencies: 284
-- -- Name: risk_assessment_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_assessment_reviews_id_seq', 1, false);


-- --
-- -- TOC entry 7262 (class 0 OID 0)
-- -- Dependencies: 276
-- -- Name: risk_assessment_scope_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_assessment_scope_id_seq', 1, true);


-- --
-- -- TOC entry 7263 (class 0 OID 0)
-- -- Dependencies: 274
-- -- Name: risk_assessment_steps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_assessment_steps_id_seq', 12, true);


-- --
-- -- TOC entry 7264 (class 0 OID 0)
-- -- Dependencies: 286
-- -- Name: risk_assessment_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_assessment_templates_id_seq', 4, true);


-- --
-- -- TOC entry 7265 (class 0 OID 0)
-- -- Dependencies: 272
-- -- Name: risk_assessment_workflows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_assessment_workflows_id_seq', 2, true);


-- --
-- -- TOC entry 7266 (class 0 OID 0)
-- -- Dependencies: 383
-- -- Name: risk_asset_relationships_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_asset_relationships_id_seq', 1, false);


-- --
-- -- TOC entry 7267 (class 0 OID 0)
-- -- Dependencies: 389
-- -- Name: risk_control_mappings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_control_mappings_id_seq', 1, false);


-- --
-- -- TOC entry 7268 (class 0 OID 0)
-- -- Dependencies: 391
-- -- Name: risk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_id_seq', 47, true);


-- --
-- -- TOC entry 7269 (class 0 OID 0)
-- -- Dependencies: 270
-- -- Name: risk_key_indicators_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_key_indicators_id_seq', 7, true);


-- --
-- -- TOC entry 7270 (class 0 OID 0)
-- -- Dependencies: 266
-- -- Name: risk_treatment_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_treatment_actions_id_seq', 7, true);


-- --
-- -- TOC entry 7271 (class 0 OID 0)
-- -- Dependencies: 262
-- -- Name: risk_treatment_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_treatment_history_id_seq', 1, false);


-- --
-- -- TOC entry 7272 (class 0 OID 0)
-- -- Dependencies: 258
-- -- Name: risk_treatment_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risk_treatment_plans_id_seq', 1, true);


-- --
-- -- TOC entry 7273 (class 0 OID 0)
-- -- Dependencies: 230
-- -- Name: risks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.risks_id_seq', 23, true);


-- --
-- -- TOC entry 7274 (class 0 OID 0)
-- -- Dependencies: 529
-- -- Name: role_page_access_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.role_page_access_id_seq', 6, true);


-- --
-- -- TOC entry 7275 (class 0 OID 0)
-- -- Dependencies: 523
-- -- Name: role_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.role_permissions_id_seq', 1, false);


-- --
-- -- TOC entry 7276 (class 0 OID 0)
-- -- Dependencies: 515
-- -- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.roles_id_seq', 3, true);


-- --
-- -- TOC entry 7277 (class 0 OID 0)
-- -- Dependencies: 356
-- -- Name: security_awareness_metrics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.security_awareness_metrics_id_seq', 1, true);


-- --
-- -- TOC entry 7278 (class 0 OID 0)
-- -- Dependencies: 541
-- -- Name: sla_exceptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.sla_exceptions_id_seq', 1, false);


-- --
-- -- TOC entry 7279 (class 0 OID 0)
-- -- Dependencies: 537
-- -- Name: sla_rules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.sla_rules_id_seq', 20, true);


-- --
-- -- TOC entry 7280 (class 0 OID 0)
-- -- Dependencies: 535
-- -- Name: sla_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.sla_templates_id_seq', 12, true);


-- --
-- -- TOC entry 7281 (class 0 OID 0)
-- -- Dependencies: 519
-- -- Name: table_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.table_permissions_id_seq', 15, true);


-- --
-- -- TOC entry 7282 (class 0 OID 0)
-- -- Dependencies: 532
-- -- Name: tat_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.tat_settings_id_seq', 5, true);


-- --
-- -- TOC entry 7283 (class 0 OID 0)
-- -- Dependencies: 629
-- -- Name: technology_risks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.technology_risks_id_seq', 24, true);


-- --
-- -- TOC entry 7284 (class 0 OID 0)
-- -- Dependencies: 635
-- -- Name: third_party_risk_assessment_responses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.third_party_risk_assessment_responses_id_seq', 1, false);


-- --
-- -- TOC entry 7285 (class 0 OID 0)
-- -- Dependencies: 633
-- -- Name: third_party_risk_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.third_party_risk_assessments_id_seq', 1, false);


-- --
-- -- TOC entry 7286 (class 0 OID 0)
-- -- Dependencies: 631
-- -- Name: third_party_risk_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.third_party_risk_templates_id_seq', 28, true);


-- --
-- -- TOC entry 7287 (class 0 OID 0)
-- -- Dependencies: 333
-- -- Name: threat_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.threat_assessments_id_seq', 6, true);


-- --
-- -- TOC entry 7288 (class 0 OID 0)
-- -- Dependencies: 354
-- -- Name: training_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.training_assignments_id_seq', 3, true);


-- --
-- -- TOC entry 7289 (class 0 OID 0)
-- -- Dependencies: 340
-- -- Name: training_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.training_categories_id_seq', 8, true);


-- --
-- -- TOC entry 7290 (class 0 OID 0)
-- -- Dependencies: 342
-- -- Name: training_courses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.training_courses_id_seq', 10, true);


-- --
-- -- TOC entry 7291 (class 0 OID 0)
-- -- Dependencies: 344
-- -- Name: training_modules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.training_modules_id_seq', 7, true);


-- --
-- -- TOC entry 7292 (class 0 OID 0)
-- -- Dependencies: 350
-- -- Name: user_module_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.user_module_progress_id_seq', 1, false);


-- --
-- -- TOC entry 7293 (class 0 OID 0)
-- -- Dependencies: 525
-- -- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.user_roles_id_seq', 1, false);


-- --
-- -- TOC entry 7294 (class 0 OID 0)
-- -- Dependencies: 627
-- -- Name: user_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.user_sessions_id_seq', 1, false);


-- --
-- -- TOC entry 7295 (class 0 OID 0)
-- -- Dependencies: 348
-- -- Name: user_training_enrollments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.user_training_enrollments_id_seq', 5, true);


-- --
-- -- TOC entry 7296 (class 0 OID 0)
-- -- Dependencies: 423
-- -- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.users_id_seq', 13, true);


-- --
-- -- TOC entry 7297 (class 0 OID 0)
-- -- Dependencies: 338
-- -- Name: userss_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.userss_id_seq', 1, false);


-- --
-- -- TOC entry 7298 (class 0 OID 0)
-- -- Dependencies: 637
-- -- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.vendors_id_seq', 20, true);


-- --
-- -- TOC entry 7299 (class 0 OID 0)
-- -- Dependencies: 385
-- -- Name: vulnerabilities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.vulnerabilities_id_seq', 66, true);


-- --
-- -- TOC entry 7300 (class 0 OID 0)
-- -- Dependencies: 282
-- -- Name: workflow_risk_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
-- --

-- SELECT pg_catalog.setval('public.workflow_risk_assessments_id_seq', 1, false);


-- -- Completed on 2025-08-27 23:25:34

-- --
-- -- PostgreSQL database dump complete
-- --

-- \unrestrict Fqd6CBSSqIjNe78Qug05JImd4VCDOVI2krfqWfIU978uXxGQy5bKN2EG5ZkCVfh

