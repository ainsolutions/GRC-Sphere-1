import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const portfolioId = Number.parseInt(params.id)

    if (isNaN(portfolioId)) {
      return NextResponse.json({ error: "Invalid portfolio ID" }, { status: 400 })
    }

    const correlations = await tenantDb`
      SELECT 
        rc.*,
        fr1.risk_title as risk_1_title,
        fr2.risk_title as risk_2_title
      FROM risk_correlations rc
      LEFT JOIN fair_risks fr1 ON rc.risk_1_id = fr1.risk_id AND rc.risk_1_type = 'fair'
      LEFT JOIN fair_risks fr2 ON rc.risk_2_id = fr2.risk_id AND rc.risk_2_type = 'fair'
      WHERE rc.portfolio_id = ${portfolioId}
      ORDER BY ABS(rc.correlation_coefficient) DESC
    `

    return NextResponse.json(correlations)
  } catch (error) {
    console.error("Error fetching correlations:", error)
    return NextResponse.json({ error: "Failed to fetch correlations" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const portfolioId = Number.parseInt(params.id)
    const body = await request.json()
    const {
      risk_1_id,
      risk_2_id,
      risk_1_type = "fair",
      risk_2_type = "fair",
      correlation_coefficient,
      correlation_type = "expert_judgment",
      confidence_level = 0.5,
      created_by = "system",
    } = body

    if (isNaN(portfolioId)) {
      return NextResponse.json({ error: "Invalid portfolio ID" }, { status: 400 })
    }

    if (!risk_1_id || !risk_2_id || correlation_coefficient === undefined) {
      return NextResponse.json({ error: "Risk IDs and correlation coefficient are required" }, { status: 400 })
    }

    if (correlation_coefficient < -1 || correlation_coefficient > 1) {
      return NextResponse.json({ error: "Correlation coefficient must be between -1 and 1" }, { status: 400 })
    }

    const result = await tenantDb`
      INSERT INTO risk_correlations (
        portfolio_id, risk_1_id, risk_2_id, risk_1_type, risk_2_type,
        correlation_coefficient, correlation_type, confidence_level, created_by
      ) VALUES (
        ${portfolioId}, ${risk_1_id}, ${risk_2_id}, ${risk_1_type}, ${risk_2_type},
        ${correlation_coefficient}, ${correlation_type}, ${confidence_level}, ${created_by}
      ) RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error adding correlation:", error)
    return NextResponse.json({ error: "Failed to add correlation" }, { status: 500 })
  }
});
