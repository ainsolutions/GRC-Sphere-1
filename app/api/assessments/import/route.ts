import { withContext } from "@/lib/HttpContext"
import { type NextRequest, NextResponse } from "next/server"

export const POST = withContext( async ( { tenantDb } , request ) => {
  try {
    const { assessments } = await request.json()

    if (!assessments || !Array.isArray(assessments)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 })
    }

    const results = {
      imported: 0,
      errors: [] as string[],
    }

    for (let i = 0; i < assessments.length; i++) {
      const assessment = assessments[i]

      try {
        // Validate required fields
        if (!assessment.assessment_name || !assessment.assessment_type || !assessment.assigned_assessor) {
          results.errors.push(`Row ${i + 1}: Missing required fields (name, type, or assessor)`)
          continue
        }

        // Generate assessment ID if not provided
        const assessmentId = assessment.assessment_id || `ASS-${Date.now()}-${i}`

        await tenantDb `
          INSERT INTO assessments (
            assessment_id,
            assessment_name,
            assessment_type,
            assessment_scope,
            assessment_status,
            start_date,
            end_date,
            assigned_assessor,
            assessment_methodology,
            compliance_framework,
            assessment_priority,
            completion_percentage,
            findings_count,
            high_risk_findings,
            medium_risk_findings,
            low_risk_findings
          ) VALUES (
            ${assessmentId},
            ${assessment.assessment_name},
            ${assessment.assessment_type},
            ${assessment.assessment_scope || ""},
            ${assessment.assessment_status || "Planning"},
            ${assessment.start_date || null},
            ${assessment.end_date || null},
            ${assessment.assigned_assessor},
            ${assessment.assessment_methodology || ""},
            ${assessment.compliance_framework || ""},
            ${assessment.assessment_priority || "Medium"},
            ${assessment.completion_percentage || 0},
            ${assessment.findings_count || 0},
            ${assessment.high_risk_findings || 0},
            ${assessment.medium_risk_findings || 0},
            ${assessment.low_risk_findings || 0}
          )
        `

        results.imported++
      } catch (error) {
        console.error(`Error importing assessment ${i + 1}:`, error)
        results.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error importing assessments:", error)
    return NextResponse.json({ error: "Failed to import assessments" }, { status: 500 })
  }
});
