import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      assessmentId,
      templateId,
      assessmentResult,
      assessmentRemarks,
      impactScore,
      likelihoodScore,
      riskTreatment,
      residualImpactScore,
      residualLikelihoodScore,
    } = body

    // Calculate risk levels
    const riskLevel = getRiskLevel(impactScore, likelihoodScore)
    const residualRiskLevel = getRiskLevel(residualImpactScore, residualLikelihoodScore)

    const [response] = await tenantDb`
      INSERT INTO third_party_risk_assessment_responses (
        assessment_id, template_id, assessment_result, assessment_remarks,
        impact_score, likelihood_score, risk_level, risk_treatment,
        residual_impact_score, residual_likelihood_score, residual_risk_level
      ) VALUES (
        ${assessmentId}, ${templateId}, ${assessmentResult}, ${assessmentRemarks},
        ${impactScore}, ${likelihoodScore}, ${riskLevel}, ${riskTreatment},
        ${residualImpactScore}, ${residualLikelihoodScore}, ${residualRiskLevel}
      )
      ON CONFLICT (assessment_id, template_id) 
      DO UPDATE SET
        assessment_result = EXCLUDED.assessment_result,
        assessment_remarks = EXCLUDED.assessment_remarks,
        impact_score = EXCLUDED.impact_score,
        likelihood_score = EXCLUDED.likelihood_score,
        risk_level = EXCLUDED.risk_level,
        risk_treatment = EXCLUDED.risk_treatment,
        residual_impact_score = EXCLUDED.residual_impact_score,
        residual_likelihood_score = EXCLUDED.residual_likelihood_score,
        residual_risk_level = EXCLUDED.residual_risk_level,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      response,
      message: "Response saved successfully",
      success: true,
    })
  } catch (error) {
    console.error("Third party risk assessment response POST error:", error)
    return NextResponse.json({ error: "Failed to save response", success: false }, { status: 500 })
  }
});

function getRiskLevel(impact: number, likelihood: number): string {
  const score = impact * likelihood
  if (score >= 20) return "Critical"
  if (score >= 15) return "High"
  if (score >= 10) return "Medium"
  if (score >= 5) return "Low"
  return "Very Low"
}
