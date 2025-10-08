import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const riskLevel = searchParams.get("riskLevel")
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    // Build WHERE conditions
    let whereClause = ""
    const conditions = []

    if (search) {
      conditions.push(`(
        e.evaluation_name ILIKE '%${search}%' OR 
        v.vendor_name ILIKE '%${search}%' OR
        e.evaluator_name ILIKE '%${search}%'
      )`)
    }

    if (riskLevel && riskLevel !== "all") {
      conditions.push(`e.overall_risk_level = '${riskLevel}'`)
    }

    if (status && status !== "all") {
      conditions.push(`e.evaluation_status = '${status}'`)
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(" AND ")}`
    }

    // Get total count
    const countResult = await tenantDb`
      SELECT COUNT(*) as total
      FROM third_party_risk_evaluations e
      LEFT JOIN vendors v ON e.vendor_id = v.id
      ${tenantDb.unsafe(whereClause)}
    ` as Record<string, any>[]
    const totalCount = Number.parseInt(countResult[0].total)

    // Get evaluations with vendor information
    const evaluations = await tenantDb`
      SELECT 
        e.id,
        e.evaluation_id,
        e.vendor_id,
        v.vendor_name,
        e.evaluation_name,
        e.evaluation_type,
        e.overall_risk_level,
        e.overall_risk_score,
        e.security_score,
        e.operational_score,
        e.financial_score,
        e.compliance_score,
        e.privacy_score,
        e.business_continuity_score,
        e.evaluation_date,
        e.next_review_date,
        e.evaluation_status,
        e.key_findings,
        e.recommendations,
        e.evaluator_name,
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
      data: {
        evaluations,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
        },
      },
    })
  } catch (error) {
    console.error("Error fetching third-party risk evaluations:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch third-party risk evaluations",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    console.log("Creating third-party risk evaluation with data:", body)

    const {
      vendor_id,
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

    // Validate required fields
    if (!evaluation_name || !vendor_id) {
      return NextResponse.json(
        {
          success: false,
          error: "Evaluation name and vendor are required",
        },
        { status: 400 },
      )
    }

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

    // Generate evaluation ID
    const evaluation_id = `TPRE-${Date.now()}`

    const result = await tenantDb`
      INSERT INTO third_party_risk_evaluations (
        evaluation_id,
        vendor_id,
        evaluation_name,
        evaluation_type,
        overall_risk_score,
        overall_risk_level,
        security_score,
        operational_score,
        financial_score,
        compliance_score,
        privacy_score,
        business_continuity_score,
        key_findings,
        recommendations,
        evaluator_name,
        evaluation_status
      ) VALUES (
        ${evaluation_id},
        ${vendor_id},
        ${evaluation_name},
        ${evaluation_type || "Comprehensive"},
        ${overall_risk_score},
        ${overall_risk_level},
        ${Number(security_score) || 0},
        ${Number(operational_score) || 0},
        ${Number(financial_score) || 0},
        ${Number(compliance_score) || 0},
        ${Number(privacy_score) || 0},
        ${Number(business_continuity_score) || 0},
        ${key_findings || ""},
        ${recommendations || ""},
        ${evaluator_name || "System Generated"},
        ${"Completed"}
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json({
      success: true,
      data: { evaluation: result[0] },
      message: "Third-party risk evaluation created successfully",
    })
  } catch (error) {
    console.error("Error creating third-party risk evaluation:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create third-party risk evaluation",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});
