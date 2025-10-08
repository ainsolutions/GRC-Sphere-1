import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


function normalizeScore(score: number | null | undefined): number {
  if (!score) return 3 // default midpoint
  const scaled = Math.round(score / 2)   // 9 → 5, 8 → 4, etc.
  return Math.min(Math.max(scaled, 1), 5)
}

function mapAssessmentResult(response: string | null | undefined): string {
  if (!response) return "Not Effective"
  if (response.includes("Fully")) return "Effective"
  if (response.includes("Partially")) return "Partial Effective"
  return "Not Effective"
}



export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const assessment_status = searchParams.get("assessment_status")
    const risk_level = searchParams.get("risk_level")
    const vendor_id = searchParams.get("vendor_id")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = (page - 1) * limit

    // Build WHERE conditions
    let whereClause = ""
    const conditions = []

    if (search) {
      conditions.push(`(
        e.evaluation_name ILIKE '%${search}%' OR 
        v.vendor_name ILIKE '%${search}%' OR
        e.scope ILIKE '%${search}%'
      )`)
    }

    if (assessment_status && assessment_status !== "All Statuses") {
      conditions.push(`e.evaluation_status = '${assessment_status}'`)
    }

    if (risk_level && risk_level !== "All Risk Levels") {
      conditions.push(`e.overall_risk_level = '${risk_level}'`)
    }

    if (vendor_id) {
      conditions.push(`e.vendor_id = ${vendor_id}`)
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(" AND ")}`
    }

    const countResult = await tenantDb`
      SELECT COUNT(*) as total
      FROM third_party_risk_evaluations e
      LEFT JOIN vendors v ON e.vendor_id = v.id
      ${tenantDb.unsafe(whereClause)}
    ` as Record<string, any>[]
    const totalCount = Number.parseInt(countResult[0].total)

    // Get evaluations with vendor information
    const assessments = await tenantDb`
      SELECT 
        e.id,
        e.evaluation_name as assessment_name,
        e.vendor_id,
        v.vendor_name,
        e.evaluation_type as assessment_type,
        e.evaluation_status as assessment_status,
        e.overall_risk_level as overall_risk_score,
        e.security_score as data_security_score,
        e.operational_score as operational_risk_score,
        e.financial_score as financial_stability_score,
        e.compliance_score,
        e.evaluation_date as assessment_date,
        e.next_review_date,
        e.evaluator_name as assessor_name,
        e.scope as description,
        e.created_at,
        e.updated_at
      FROM third_party_risk_evaluations e
      LEFT JOIN vendors v ON e.vendor_id = v.id
      ${tenantDb.unsafe(whereClause)}
      ORDER BY e.evaluation_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    return NextResponse.json({
      success: true,
      assessments,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching third-party risk assessments:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch third-party risk assessments",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    console.log("Creating third-party risk assessment with data:", body)

    const {
      assessment_name,
      vendor_id,
      vendor_name,
      contract_id,
      assessor_name,
      assessor_email,
      assessment_date,
      questionnaire_responses,
      gap_analysis,
      remediation_plan,
    } = body

    // Validate required fields
    if (!assessment_name || !vendor_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Assessment name and vendor are required",
        },
        { status: 400 },
      )
    }

    // Validate vendor exists
    const vendorExists = await tenantDb`
      SELECT id, vendor_name FROM vendors WHERE id = ${vendor_id}
    ` as Record<string, any>[]

    if (vendorExists.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Vendor not found",
        },
        { status: 400 },
      )
    }

    let overall_risk_level = "Low"
    let security_score = 0
    let operational_score = 0
    let financial_score = 0
    let compliance_score = 0

    if (questionnaire_responses && Array.isArray(questionnaire_responses)) {
      const responses = questionnaire_responses
      const totalQuestions = responses.length
      let totalRiskScore = 0

      // Calculate category scores
      const securityQuestions = responses.filter((r) => r.category === "Security & Data Protection")
      const operationalQuestions = responses.filter((r) => r.category === "Operational Risk")
      const financialQuestions = responses.filter((r) => r.category === "Financial Stability")
      const complianceQuestions = responses.filter((r) => r.category === "Compliance & Regulatory")

      security_score =
        securityQuestions.length > 0
          ? Math.round(securityQuestions.reduce((sum, q) => sum + (q.risk_score || 0), 0) / securityQuestions.length)
          : 0

      operational_score =
        operationalQuestions.length > 0
          ? Math.round(
              operationalQuestions.reduce((sum, q) => sum + (q.risk_score || 0), 0) / operationalQuestions.length,
            )
          : 0

      financial_score =
        financialQuestions.length > 0
          ? Math.round(financialQuestions.reduce((sum, q) => sum + (q.risk_score || 0), 0) / financialQuestions.length)
          : 0

      compliance_score =
        complianceQuestions.length > 0
          ? Math.round(
              complianceQuestions.reduce((sum, q) => sum + (q.risk_score || 0), 0) / complianceQuestions.length,
            )
          : 0

      // Calculate overall risk score
      totalRiskScore = responses.reduce((sum, response) => sum + (response.risk_score || 0), 0)
      const averageRiskScore = totalQuestions > 0 ? totalRiskScore / totalQuestions : 0

      if (averageRiskScore >= 4) {
        overall_risk_level = "Critical"
      } else if (averageRiskScore >= 3) {
        overall_risk_level = "High"
      } else if (averageRiskScore >= 2) {
        overall_risk_level = "Medium"
      } else {
        overall_risk_level = "Low"
      }
    }

    // Generate evaluation ID
    const evaluation_id = `TPRE-${Date.now()}`

    const result = await tenantDb`
      INSERT INTO third_party_risk_evaluations (
        evaluation_id,
        evaluation_name, 
        vendor_id, 
        contract_id,
        evaluation_type,
        evaluation_status, 
        overall_risk_level,
        security_score, 
        operational_score, 
        financial_score, 
        compliance_score,
        evaluation_date, 
        evaluator_name,
        evaluator_email,
        scope,
        methodology,
        recommendations
      ) VALUES (
        ${evaluation_id},
        ${assessment_name}, 
        ${vendor_id}, 
        ${contract_id || null},
        ${"Comprehensive"},
        ${"Completed"}, 
        ${overall_risk_level},
        ${security_score}, 
        ${operational_score}, 
        ${financial_score}, 
        ${compliance_score},
        ${assessment_date || new Date().toISOString().split("T")[0]}, 
        ${assessor_name || "System Generated"},
        ${assessor_email || null},
        ${`Risk assessment for ${vendorExists[0].vendor_name}`},
        ${"Questionnaire-based assessment"},
        ${JSON.stringify(remediation_plan || {})}
      )
      RETURNING *
    ` as Record<string, any>[]

    // Store questionnaire responses in separate table
      if (questionnaire_responses && Array.isArray(questionnaire_responses)) {
        for (const response of questionnaire_responses) {
  const impact_score = normalizeScore(response.risk_score)
  const likelihood_score = normalizeScore(response.likelihood_score || 3)
  const residual_impact_score = normalizeScore(response.residual_impact_score || 3)
  const residual_likelihood_score = normalizeScore(response.residual_likelihood_score || 3)
  const assessment_result = mapAssessmentResult(response.response)

  await tenantDb`
    INSERT INTO third_party_risk_assessment_responses (
      assessment_id,
      template_id,
      question_code,
      assessment_result,
      assessment_remarks,
      impact_score,
      likelihood_score,
      risk_level,
      risk_treatment,
      residual_impact_score,
      residual_likelihood_score,
      residual_risk_level
    ) VALUES (
      ${result[0].id},
      ${null},
      ${response.question_id},
      ${assessment_result},
      ${response.notes || ""},
      ${impact_score},
      ${likelihood_score},
      ${response.risk_level || "Low"},
      ${response.remediation_plan || ""},
      ${residual_impact_score},
      ${residual_likelihood_score},
      ${response.remediation_priority || "Medium"}
    )
  `
}

      }

    // Store gap analysis if provided
    if (gap_analysis && Array.isArray(gap_analysis)) {
      for (const gap of gap_analysis) {
        await tenantDb`
          INSERT INTO third_party_gap_analysis (
            evaluation_id,
            vendor_id,
            gap_id,
            gap_title,
            gap_description,
            gap_severity,
            current_state,
            target_state,
            remediation_strategy,
            priority_ranking,
            estimated_cost,
            target_completion_date,
            responsible_party,
            remediation_status
          ) VALUES (
            ${result[0].id},
            ${vendor_id},
            ${gap.gap_id || `GAP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`},
            ${gap.title || gap.gap_title},
            ${gap.description || gap.gap_description},
            ${gap.severity || gap.gap_severity || "Medium"},
            ${gap.current_state || "Not Implemented"},
            ${gap.target_state || "Fully Implemented"},
            ${gap.remediation_strategy || gap.recommended_actions},
            ${gap.priority_ranking || 3},
            ${gap.estimated_cost || 0},
            ${gap.target_completion_date || null},
            ${gap.responsible_party || "Vendor"},
            ${gap.remediation_status || "Identified"}
          )
        `
      }
    }

    return NextResponse.json({
      success: true,
      assessment: result[0],
      message: "Third-party risk assessment created successfully",
    })
  } catch (error) {
    console.error("Error creating third-party risk assessment:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create third-party risk assessment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});
