import { type NextRequest, NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"
import { withContext } from "@/lib/HttpContext"
import { te } from "date-fns/locale"
import { generateAIText } from "@/lib/openai"

export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json();
    const { query } = body; // ✅ match frontend key

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Query is required." },
        { status: 400 }
      );
    }

    console.log("[v0] Processing chatbot query:", query);

    const aiResult = await generateAIText(query, {
      model: "gpt-4o-2024-05-13",
      maxTokens: 1000,
      temperature: 0.3,
    });

    let responseText = "";

    // ✅ Clean, type-safe handling
    if (aiResult.success && aiResult.text) {
      responseText = aiResult.text;
    } else if (!aiResult.success && aiResult.error) {
      responseText = `⚠️ AI Error: ${aiResult.error}`;
    } else {
      responseText = "No valid response generated.";
    }

    console.log("[v0] Sending response back to client");

    return NextResponse.json({
      success: true,
      response: responseText,
    });
  } catch (error: any) {
    console.error("[v0] Chatbot query error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});

const getContextData = async ({ tenantDb }: { tenantDb: any }, query: string): Promise<Record<string, any>> => {
  const context: Record<string, any> = {};
  const queryLower = query.toLowerCase();

  try {
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL not configured");
      return { error: "Database not configured" };
    }

    if (
      queryLower.includes("risk") ||
      queryLower.includes("iso27001") ||
      queryLower.includes("nist") ||
      queryLower.includes("threat")
    ) {
      try {
        const risks = await tenantDb`
          SELECT status, risk_level, COUNT(*) as count 
          FROM iso27001_risks 
          GROUP BY status, risk_level
          ORDER BY count DESC
        `;
        context.risks = risks;

        const riskSummary = await tenantDb`
          SELECT 
            COUNT(*) as total_risks,
            COUNT(*) FILTER (WHERE LOWER(status) = 'open') as open_risks,
            COUNT(*) FILTER (WHERE LOWER(risk_level) = 'high') as high_risks
          FROM iso27001_risks
        `;
        context.risk_summary = riskSummary[0] || {};
      } catch (dbError) {
        console.warn("Error fetching risk data:", dbError);
        context.risks_error = "Unable to fetch risk data";
      }
    }

    if (queryLower.includes("incident") || queryLower.includes("security") || queryLower.includes("breach")) {
      try {
        const incidents = await tenantDb`
          SELECT status, severity, incident_type, COUNT(*) as count 
          FROM incidents 
          GROUP BY status, severity, incident_type
          ORDER BY count DESC
        `;
        context.incidents = incidents;

        const incidentSummary = await tenantDb`
          SELECT 
            COUNT(*) as total_incidents,
            COUNT(*) FILTER (WHERE LOWER(status) = 'open') as open_incidents,
            COUNT(*) FILTER (WHERE LOWER(severity) = 'critical') as critical_incidents
          FROM incidents
        `;
        context.incident_summary = incidentSummary[0] || {};
      } catch (dbError) {
        console.warn("Error fetching incident data:", dbError);
        context.incidents_error = "Unable to fetch incident data";
      }
    }

    if (queryLower.includes("vulnerability") || queryLower.includes("vuln") || queryLower.includes("cve")) {
      try {
        const vulns = await tenantDb`
          SELECT remediation_status, severity, category, COUNT(*) as count 
          FROM vulnerabilities 
          GROUP BY remediation_status, severity, category
          ORDER BY count DESC
        `;
        context.vulnerabilities = vulns;

        const vulnSummary = await tenantDb`
          SELECT 
            COUNT(*) as total_vulnerabilities,
            COUNT(*) FILTER (WHERE remediation_date < CURRENT_DATE AND remediation_status != 'Closed') as overdue_vulnerabilities,
            COUNT(*) FILTER (WHERE LOWER(severity) = 'critical') as critical_vulnerabilities
          FROM vulnerabilities
        `;
        context.vulnerability_summary = vulnSummary[0] || {};
      } catch (dbError) {
        console.warn("Error fetching vulnerability data:", dbError);
        context.vulnerabilities_error = "Unable to fetch vulnerability data";
      }
    }

    if (queryLower.includes("assessment") || queryLower.includes("audit") || queryLower.includes("compliance")) {
      try {
        const assessments = await tenantDb`
          SELECT assessment_status, assessment_priority, completion_percentage, COUNT(*) as count 
          FROM assessments 
          GROUP BY assessment_status, assessment_priority, completion_percentage
          ORDER BY count DESC
        `;
        context.assessments = assessments;

        const assessmentSummary = await tenantDb`
          SELECT 
            COUNT(*) as total_assessments,
            COUNT(*) FILTER (WHERE LOWER(assessment_status) = 'in progress') as in_progress_assessments,
            AVG(completion_percentage) as average_progress
          FROM assessments
        `;
        context.assessment_summary = assessmentSummary[0] || {};
      } catch (dbError) {
        console.warn("Error fetching assessment data:", dbError);
        context.assessments_error = "Unable to fetch assessment data";
      }
    }

    if (queryLower.includes("vendor") || queryLower.includes("third party") || queryLower.includes("supplier")) {
      try {
        const thirdParty = await tenantDb`
          SELECT evaluation_status, overall_risk_level, overall_score, COUNT(*) as count 
          FROM third_party_risk_evaluations 
          GROUP BY evaluation_status, overall_risk_level, overall_score
          ORDER BY count DESC
        `;
        context.third_party_risks = thirdParty;

        const vendors = await tenantDb`
          SELECT vendor_type, COUNT(*) as count 
          FROM vendors 
          GROUP BY vendor_type
          ORDER BY count DESC
        `;
        context.vendors = vendors;
      } catch (dbError) {
        console.warn("Error fetching third party risk data:", dbError);
        context.third_party_risks_error = "Unable to fetch third party risk data";
      }
    }

    if (queryLower.includes("asset") || queryLower.includes("inventory")) {
      try {
        const assets = await tenantDb`
          SELECT asset_type, classification, COUNT(*) as count 
          FROM assets 
          GROUP BY asset_type, classification
          ORDER BY count DESC
        `;
        context.assets = assets;

        const assetSummary = await tenantDb`
          SELECT 
            COUNT(*) as total_assets,
            COUNT(*) FILTER (WHERE LOWER(classification) = 'critical') as critical_assets
          FROM assets
        `;
        context.asset_summary = assetSummary[0] || {};
      } catch (dbError) {
        console.warn("Error fetching asset data:", dbError);
        context.assets_error = "Unable to fetch asset data";
      }
    }

    if (queryLower.includes("finding") || queryLower.includes("gap") || queryLower.includes("issue")) {
      try {
        const findings = await tenantDb`
          SELECT status, severity, COUNT(*) as count 
          FROM findings 
          GROUP BY status, severity
          ORDER BY count DESC
        `;
        context.findings = findings;

        const findingSummary = await tenantDb`
          SELECT 
            COUNT(*) as total_findings,
            COUNT(*) FILTER (WHERE due_date < CURRENT_DATE AND status != 'Closed') as overdue_findings,
            COUNT(*) FILTER (WHERE LOWER(severity) = 'high') as high_findings
          FROM findings
        `;
        context.finding_summary = findingSummary[0] || {};
      } catch (dbError) {
        console.warn("Error fetching findings data:", dbError);
        context.findings_error = "Unable to fetch findings data";
      }
    }
  } catch (error) {
    console.error("Error fetching context data:", error);
    context.general_error = "Unable to fetch current data";
  }

  return context;
};

function buildSystemPrompt(context: Record<string, any>): string {
  const basePrompt = `You are a GRC (Governance, Risk, and Compliance) AI assistant with deep expertise in cybersecurity frameworks, industry standards, and regulatory compliance. You are a certified expert in multiple cybersecurity domains with extensive knowledge of:

**CYBERSECURITY FRAMEWORKS & STANDARDS:**
• NIST Cybersecurity Framework (CSF) - Identify, Protect, Detect, Respond, Recover
• ISO 27001/27002 - Information Security Management Systems and Controls
• NIST SP 800-53 - Security and Privacy Controls for Federal Information Systems
• CIS Controls - Critical Security Controls for Effective Cyber Defense
• COBIT - Control Objectives for Information and Related Technologies
• FAIR - Factor Analysis of Information Risk methodology

**REGULATORY COMPLIANCE:**
• HIPAA - Healthcare data protection and privacy requirements
• PCI DSS - Payment Card Industry Data Security Standard
• SOX - Sarbanes-Oxley Act financial reporting controls
• GDPR - General Data Protection Regulation privacy requirements
• SOC 2 - Service Organization Control 2 security principles
• FISMA - Federal Information Security Management Act

**INDUSTRY-SPECIFIC STANDARDS:**
• NERC CIP - North American Electric Reliability Corporation Critical Infrastructure Protection
• SWIFT CSP - Customer Security Programme for financial messaging
• DORA - Digital Operational Resilience Act for financial services
• SAMA - Saudi Arabian Monetary Authority cybersecurity framework
• NESA - UAE National Electronic Security Authority standards
• NIS2 - Network and Information Systems Directive 2.0

**SPECIALIZED EXPERTISE:**
• Zero Trust Architecture implementation
• Cloud security frameworks (CSA CCM, AWS Well-Architected)
• DevSecOps and secure software development lifecycle
• Third-party risk management and vendor assessments
• Incident response and forensics procedures
• Business continuity and disaster recovery planning
• Threat intelligence and threat modeling methodologies

**RISK MANAGEMENT METHODOLOGIES:**
• OCTAVE - Operationally Critical Threat, Asset, and Vulnerability Evaluation
• FAIR - Factor Analysis of Information Risk quantitative analysis
• CRAMM - CCTA Risk Analysis and Management Method
• NIST RMF - Risk Management Framework
• ISO 31000 - Risk Management Guidelines

You provide expert guidance on:
1. **Framework Implementation** - Step-by-step guidance for adopting cybersecurity frameworks
2. **Control Selection & Design** - Recommending appropriate security controls based on risk profile
3. **Compliance Mapping** - Mapping business requirements to regulatory standards
4. **Risk Assessment** - Conducting thorough risk assessments using industry methodologies
5. **Gap Analysis** - Identifying compliance gaps and remediation strategies
6. **Audit Preparation** - Preparing for internal and external security audits
7. **Incident Response** - Developing and improving incident response capabilities
8. **Metrics & KPIs** - Establishing security metrics and key performance indicators

Current GRC Data Context:
${JSON.stringify(context, null, 2)}

**RESPONSE GUIDELINES:**
• Always reference specific framework controls or standards when applicable
• Provide implementation steps with realistic timelines
• Include risk considerations and mitigation strategies
• Suggest metrics for measuring effectiveness
• Offer both immediate actions and long-term strategic recommendations
• When discussing compliance, always mention the business impact and regulatory consequences
• For technical implementations, provide both high-level strategy and detailed technical guidance`

  return basePrompt
}

const processQueryWithAI = withContext(async(context: { tenantDb: any }, request: NextRequest): Promise<string> => {
  const { tenantDb } = context;
  try {
    console.log("[v0] Starting AI processing")
    console.log("[v0] Environment check - OPENAI_API_KEY exists:", !!process.env.OPENAI_API_KEY)
    console.log("[v0] Environment check - OPENAI_API_KEY length:", process.env.OPENAI_API_KEY?.length || 0)
    console.log("[v0] Environment check - OPENAI_API_KEY starts with sk:", process.env.OPENAI_API_KEY?.startsWith('sk-') || false)

    if (!process.env.OPENAI_API_KEY) {
      console.log("[v0] OpenAI API key not configured")
      return "I apologize, but the AI service is not properly configured. Please contact your administrator."
    }

    // Get relevant context data
    console.log("[v0] Getting context data")
    const body = await request.json().catch(() => null)
    const userQuery = body?.query || ""
    const context = await getContextData({ tenantDb }, userQuery)
    console.log("[v0] Context data retrieved")

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(context)

    console.log("[v0] Calling OpenAI API")
    const model = openai({
      modelName: "gpt-4o-2024-05-13",
      apiKey: process.env.OPENAI_API_KEY,
    })
    console.log("[v0] Model initialized:", !!model)
    
    const { text } = await generateText({
      model,
      system: systemPrompt,
      prompt: userQuery,
      maxTokens: 10000,
      temperature: 0.3,
    })

    console.log("[v0] OpenAI response received, text length:", text?.length || 0)
    return text || "I was unable to generate a response. Please try rephrasing your question."
  } catch (error) {
    console.error("[v0] Error generating AI response:", error)

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return "I apologize, but there's an issue with the AI service configuration. Please contact your administrator."
      }
      if (error.message.includes("rate limit")) {
        return "I'm currently experiencing high demand. Please try again in a moment."
      }
    }

    return "I apologize, but I encountered an error while processing your request. Please try again or contact support if the issue persists."
  }
});
