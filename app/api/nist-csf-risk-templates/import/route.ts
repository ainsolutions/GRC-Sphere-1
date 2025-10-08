import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

interface ImportTemplateData {
  template_name: string
  risk_description: string
  function_code: string
  category_code?: string
  default_likelihood: number
  default_impact: number
  risk_level: string
  residual_likelihood?: number
  residual_impact?: number
  residual_risk_level?: string
  existing_controls?: string
  control_references?: string
  implementation_guidance?: string
  compliance_requirements?: string
  maturity_level?: number
  risk_treatment?: string
  threat_sources?: string
  vulnerabilities?: string
  asset_types?: string
  nist_references?: string
}

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { csvData } = body

    if (!csvData || !Array.isArray(csvData)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid CSV data format",
        },
        { status: 400 },
      )
    }

    const results = []
    const errors = []

    // Get functions and categories for mapping
    const functions = await tenantDb`SELECT id, function_code FROM nist_csf_functions` as Record<string, any>[]
    const categories = await tenantDb`SELECT id, category_code FROM nist_csf_categories` as Record<string, any>[]

    const functionMap = new Map(functions.map((f) => [f.function_code, f.id]))
    const categoryMap = new Map(categories.map((c) => [c.category_code, c.id]))

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i] as ImportTemplateData
      try {
        // Validate required fields
        if (
          !row.template_name ||
          !row.risk_description ||
          !row.function_code ||
          !row.default_likelihood ||
          !row.default_impact
        ) {
          errors.push(
            `Row ${i + 1}: Missing required fields (template_name, risk_description, function_code, default_likelihood, default_impact)`,
          )
          continue
        }

        // Map function code to ID
        const functionId = functionMap.get(row.function_code)
        if (!functionId) {
          errors.push(`Row ${i + 1}: Invalid function code '${row.function_code}'`)
          continue
        }

        // Map category code to ID (optional)
        let categoryId = null
        if (row.category_code) {
          categoryId = categoryMap.get(row.category_code)
          if (!categoryId) {
            errors.push(`Row ${i + 1}: Invalid category code '${row.category_code}'`)
            continue
          }
        }

        // Validate likelihood and impact values
        if (
          row.default_likelihood < 1 ||
          row.default_likelihood > 5 ||
          row.default_impact < 1 ||
          row.default_impact > 5
        ) {
          errors.push(`Row ${i + 1}: Likelihood and impact must be between 1 and 5`)
          continue
        }

        // Calculate risk level if not provided
        let riskLevel = row.risk_level
        if (!riskLevel) {
          const score = row.default_likelihood * row.default_impact
          if (score >= 20) riskLevel = "Critical"
          else if (score >= 15) riskLevel = "High"
          else if (score >= 8) riskLevel = "Medium"
          else riskLevel = "Low"
        }

        // Calculate residual risk level
        const residualLikelihood = row.residual_likelihood || row.default_likelihood
        const residualImpact = row.residual_impact || row.default_impact
        let residualRiskLevel = row.residual_risk_level
        if (!residualRiskLevel) {
          const residualScore = residualLikelihood * residualImpact
          if (residualScore >= 20) residualRiskLevel = "Critical"
          else if (residualScore >= 15) residualRiskLevel = "High"
          else if (residualScore >= 8) residualRiskLevel = "Medium"
          else residualRiskLevel = "Low"
        }

        // Generate template ID
        const templateCount = await tenantDb`SELECT COUNT(*) as count FROM nist_csf_risk_templates` as Record<string, any>[]
        const templateId = `NIST-TMPL-${String(Number(templateCount[0].count) + 1).padStart(4, "0")}`

        // Parse array fields
        const parseArrayField = (field: string | undefined) => {
          if (!field) return []
          return field
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item.length > 0)
        }

        const result = await tenantDb`
          INSERT INTO nist_csf_risk_templates (
            template_id,
            template_name,
            risk_description,
            function_id,
            category_id,
            default_likelihood,
            default_impact,
            risk_level,
            residual_likelihood,
            residual_impact,
            residual_risk_level,
            existing_controls,
            control_references,
            implementation_guidance,
            compliance_requirements,
            maturity_level,
            risk_treatment,
            threat_sources,
            vulnerabilities,
            asset_types,
            nist_references,
            is_active
          ) VALUES (
            ${templateId},
            ${row.template_name},
            ${row.risk_description},
            ${functionId},
            ${categoryId},
            ${row.default_likelihood},
            ${row.default_impact},
            ${riskLevel},
            ${residualLikelihood},
            ${residualImpact},
            ${residualRiskLevel},
            ${JSON.stringify(parseArrayField(row.existing_controls))},
            ${JSON.stringify([])}, -- Will be populated separately if needed
            ${row.implementation_guidance || ""},
            ${JSON.stringify([])}, -- Will be populated separately if needed
            ${row.maturity_level || 1},
            ${row.risk_treatment || "Mitigate"},
            ${JSON.stringify(parseArrayField(row.threat_sources))},
            ${JSON.stringify(parseArrayField(row.vulnerabilities))},
            ${JSON.stringify(parseArrayField(row.asset_types))},
            ${JSON.stringify(parseArrayField(row.nist_references))},
            true
          ) RETURNING *
        ` as Record<string, any>[]

        results.push(result[0])
      } catch (error) {
        console.error(`Error importing row ${i + 1}:`, error)
        errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    return NextResponse.json({
      success: true,
      imported: results.length,
      errors: errors,
      data: results,
    })
  } catch (error) {
    console.error("Failed to import NIST CSF risk templates:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to import risk templates",
        imported: 0,
        errors: [],
      },
      { status: 500 },
    )
  }
});
