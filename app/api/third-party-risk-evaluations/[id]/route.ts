import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    const result = await tenantDb`
      SELECT 
        e.*,
        v.vendor_name
      FROM third_party_risk_evaluations e
      LEFT JOIN vendors v ON e.vendor_id = v.id
      WHERE e.id = ${id}
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Risk evaluation not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: { evaluation: result[0] },
    })
  } catch (error) {
    console.error("Error fetching risk evaluation:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch risk evaluation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});

export const PUT = withContext(async({ tenantDb }, request, context) => {
  try {
    const { id } = context.params
    const body = await request.json()

    const {
      evaluation_name,
      evaluation_type,
      security_score,
      operational_score,
      financial_score,
      compliance_score,
      privacy_score,
      business_continuity_score,
      key_findings,
      recommendations,
      evaluator_name,
    } = body

    // Calculate overall risk score and level
    const scores = [
      Number(security_score) || 0,
      Number(operational_score) || 0,
      Number(financial_score) || 0,
      Number(compliance_score) || 0,
      Number(privacy_score) || 0,
      Number(business_continuity_score) || 0,
    ].filter((score) => score > 0)

    const overall_risk_score =
      scores.length > 0 ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0

    let overall_risk_level = "Low"
    if (overall_risk_score >= 80) {
      overall_risk_level = "Critical"
    } else if (overall_risk_score >= 60) {
      overall_risk_level = "High"
    } else if (overall_risk_score >= 40) {
      overall_risk_level = "Medium"
    }

    const result = await tenantDb`
      UPDATE third_party_risk_evaluations 
      SET 
        evaluation_name = ${evaluation_name},
        evaluation_type = ${evaluation_type},
        overall_risk_score = ${overall_risk_score},
        overall_risk_level = ${overall_risk_level},
        security_score = ${Number(security_score) || 0},
        operational_score = ${Number(operational_score) || 0},
        financial_score = ${Number(financial_score) || 0},
        compliance_score = ${Number(compliance_score) || 0},
        privacy_score = ${Number(privacy_score) || 0},
        business_continuity_score = ${Number(business_continuity_score) || 0},
        key_findings = ${key_findings || ""},
        recommendations = ${recommendations || ""},
        evaluator_name = ${evaluator_name || ""},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Risk evaluation not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      data: { evaluation: result[0] },
      message: "Risk evaluation updated successfully",
    })
  } catch (error) {
    console.error("Error updating risk evaluation:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update risk evaluation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    const result = await tenantDb`
      DELETE FROM third_party_risk_evaluations 
      WHERE id = ${id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Risk evaluation not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Risk evaluation deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting risk evaluation:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete risk evaluation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});
