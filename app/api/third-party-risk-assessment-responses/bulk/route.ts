import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const { assessmentId, responses } = await request.json()

    if (!assessmentId || !responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { success: false, error: "Assessment ID and responses array are required" },
        { status: 400 },
      )
    }

    // Start a transaction-like approach by processing all responses
    const results = []
    const errors = []

    for (const response of responses) {
      try {
        const {
          templateId,
          assessment_result,
          assessment_remarks,
          impact_score,
          likelihood_score,
          risk_level,
          risk_treatment,
          residual_impact_score,
          residual_likelihood_score,
          residual_risk_level,
        } = response

        // Check if response already exists
        const existingResponse = await tenantDb`
          SELECT id FROM third_party_risk_assessment_responses 
          WHERE assessment_id = ${assessmentId} AND template_id = ${templateId}
        ` as Record<string, any>[]

        if (existingResponse.length > 0) {
          // Update existing response
          await tenantDb`
            UPDATE third_party_risk_assessment_responses 
            SET 
              assessment_result = ${assessment_result || ""},
              assessment_remarks = ${assessment_remarks || ""},
              impact_score = ${impact_score || 0},
              likelihood_score = ${likelihood_score || 0},
              risk_level = ${risk_level || ""},
              risk_treatment = ${risk_treatment || ""},
              residual_impact_score = ${residual_impact_score || 0},
              residual_likelihood_score = ${residual_likelihood_score || 0},
              residual_risk_level = ${residual_risk_level || ""},
              updated_at = NOW()
            WHERE assessment_id = ${assessmentId} AND template_id = ${templateId}
          `
        } else {
          // Insert new response
          await tenantDb`
            INSERT INTO third_party_risk_assessment_responses (
              assessment_id, template_id, assessment_result, assessment_remarks,
              impact_score, likelihood_score, risk_level, risk_treatment,
              residual_impact_score, residual_likelihood_score, residual_risk_level,
              created_at, updated_at
            ) VALUES (
              ${assessmentId}, ${templateId}, ${assessment_result || ""}, ${assessment_remarks || ""},
              ${impact_score || 0}, ${likelihood_score || 0}, ${risk_level || ""}, ${risk_treatment || ""},
              ${residual_impact_score || 0}, ${residual_likelihood_score || 0}, ${residual_risk_level || ""},
              NOW(), NOW()
            )
          `
        }

        results.push({ templateId, success: true })
      } catch (error) {
        console.error(`Error processing response for template ${response.templateId}:`, error)
        errors.push({ templateId: response.templateId, error: (error instanceof Error) ? error.message : "Unknown error" })
      }
    }

    // Update assessment statistics
    try {
      await tenantDb`
        UPDATE third_party_risk_assessments 
        SET 
          total_responses = (
            SELECT COUNT(*) FROM third_party_risk_assessment_responses 
            WHERE assessment_id = ${assessmentId}
          ),
          effective_count = (
            SELECT COUNT(*) FROM third_party_risk_assessment_responses 
            WHERE assessment_id = ${assessmentId} AND assessment_result = 'Effective'
          ),
          partial_count = (
            SELECT COUNT(*) FROM third_party_risk_assessment_responses 
            WHERE assessment_id = ${assessmentId} AND assessment_result = 'Partial Effective'
          ),
          not_effective_count = (
            SELECT COUNT(*) FROM third_party_risk_assessment_responses 
            WHERE assessment_id = ${assessmentId} AND assessment_result = 'Not Effective'
          ),
          avg_risk_score = (
            SELECT COALESCE(AVG(impact_score * likelihood_score), 0) 
            FROM third_party_risk_assessment_responses 
            WHERE assessment_id = ${assessmentId} AND impact_score > 0 AND likelihood_score > 0
          ),
          updated_at = NOW()
        WHERE id = ${assessmentId}
      `
    } catch (error) {
      console.error("Error updating assessment statistics:", error)
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${results.length} responses successfully`,
      results,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error("Error in bulk save:", error)
    return NextResponse.json({ success: false, error: "Failed to save responses" }, { status: 500 })
  }
});
