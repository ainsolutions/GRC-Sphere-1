import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext" 

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"
    const search = searchParams.get("search") || ""
    const functionId = searchParams.get("functionId")
    const riskLevel = searchParams.get("riskLevel")

    let templates

    // Build query based on filters
    if (search && functionId && riskLevel && riskLevel !== "all") {
      templates = await tenantDb`
        SELECT 
          t.*,
          f.function_code,
          f.function_name,
          c.category_code,
          c.category_name
        FROM nist_csf_risk_templates t
        LEFT JOIN nist_csf_functions f ON t.function_id = f.id
        LEFT JOIN nist_csf_categories c ON t.category_id = c.id
        WHERE (t.template_name ILIKE ${`%${search}%`} OR t.risk_description ILIKE ${`%${search}%`})
        AND t.function_id = ${functionId}
        AND t.risk_level = ${riskLevel}
        AND t.is_active = true
        ORDER BY t.created_at DESC
      ` as Record<string, any>[]
    } else if (search) {
      templates = await tenantDb`
        SELECT 
          t.*,
          f.function_code,
          f.function_name,
          c.category_code,
          c.category_name
        FROM nist_csf_risk_templates t
        LEFT JOIN nist_csf_functions f ON t.function_id = f.id
        LEFT JOIN nist_csf_categories c ON t.category_id = c.id
        WHERE (t.template_name ILIKE ${`%${search}%`} OR t.risk_description ILIKE ${`%${search}%`})
        AND t.is_active = true
        ORDER BY t.created_at DESC
      ` as Record<string, any>[]
    } else if (functionId) {
      templates = await tenantDb`
        SELECT 
          t.*,
          f.function_code,
          f.function_name,
          c.category_code,
          c.category_name
        FROM nist_csf_risk_templates t
        LEFT JOIN nist_csf_functions f ON t.function_id = f.id
        LEFT JOIN nist_csf_categories c ON t.category_id = c.id
        WHERE t.function_id = ${functionId}
        AND t.is_active = true
        ORDER BY t.created_at DESC
      ` as Record<string, any>[]
    } else if (riskLevel && riskLevel !== "all") {
      templates = await tenantDb`
        SELECT 
          t.*,
          f.function_code,
          f.function_name,
          c.category_code,
          c.category_name
        FROM nist_csf_risk_templates t
        LEFT JOIN nist_csf_functions f ON t.function_id = f.id
        LEFT JOIN nist_csf_categories c ON t.category_id = c.id
        WHERE t.risk_level = ${riskLevel}
        AND t.is_active = true
        ORDER BY t.created_at DESC
      ` as Record<string, any>[]
    } else {
      templates = await tenantDb`
        SELECT 
          t.*,
          f.function_code,
          f.function_name,
          c.category_code,
          c.category_name
        FROM nist_csf_risk_templates t
        LEFT JOIN nist_csf_functions f ON t.function_id = f.id
        LEFT JOIN nist_csf_categories c ON t.category_id = c.id
        WHERE t.is_active = true
        ORDER BY t.created_at DESC
      ` as Record<string, any>[]
    }

    if (format === "template") {
      // Return template with sample data
      const template = [
        {
          template_name: "Sample Risk Template",
          risk_description: "Detailed description of the cybersecurity risk scenario",
          function_code: "PR",
          category_code: "PR.AC",
          default_likelihood: 3,
          default_impact: 4,
          risk_level: "High",
          residual_likelihood: 2,
          residual_impact: 3,
          residual_risk_level: "Medium",
          existing_controls: "Multi-factor authentication, Access logging",
          implementation_guidance: "Implement additional security controls and monitoring",
          maturity_level: 2,
          risk_treatment: "Mitigate",
          threat_sources: "External hackers, Insider threats",
          vulnerabilities: "Weak authentication, Unpatched systems",
          asset_types: "Customer data, Financial systems",
          nist_references: "NIST SP 800-53 AC-2, NIST CSF PR.AC-1",
        },
      ]

      return NextResponse.json({
        success: true,
        data: template,
      })
    }

    // Convert array fields to comma-separated strings for CSV export
    const exportData = templates.map((template) => ({
      template_id: template.template_id,
      template_name: template.template_name,
      risk_description: template.risk_description,
      function_code: template.function_code,
      function_name: template.function_name,
      category_code: template.category_code || "",
      category_name: template.category_name || "",
      default_likelihood: template.default_likelihood,
      default_impact: template.default_impact,
      risk_level: template.risk_level,
      residual_likelihood: template.residual_likelihood || template.default_likelihood,
      residual_impact: template.residual_impact || template.default_impact,
      residual_risk_level: template.residual_risk_level || template.risk_level,
      existing_controls: Array.isArray(template.existing_controls) ? template.existing_controls.join(", ") : "",
      implementation_guidance: template.implementation_guidance || "",
      maturity_level: template.maturity_level || 1,
      risk_treatment: template.risk_treatment || "Mitigate",
      threat_sources: Array.isArray(template.threat_sources) ? template.threat_sources.join(", ") : "",
      vulnerabilities: Array.isArray(template.vulnerabilities) ? template.vulnerabilities.join(", ") : "",
      asset_types: Array.isArray(template.asset_types) ? template.asset_types.join(", ") : "",
      nist_references: Array.isArray(template.nist_references) ? template.nist_references.join(", ") : "",
      is_active: template.is_active,
      created_at: template.created_at,
      updated_at: template.updated_at,
    }))

    return NextResponse.json({
      success: true,
      data: exportData,
    })
  } catch (error) {
    console.error("Failed to export NIST CSF risk templates:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to export risk templates",
        data: [],
      },
      { status: 500 },
    )
  }
});
