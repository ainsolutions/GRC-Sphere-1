import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const portfolioId = Number.parseInt(params.id)

    if (isNaN(portfolioId)) {
      return NextResponse.json({ error: "Invalid portfolio ID" }, { status: 400 })
    }

    const items = await tenantDb`
      SELECT 
        pi.*,
        fr.risk_title,
        fr.annual_loss_expectancy,
        fr.risk_code
      FROM portfolio_items pi
      LEFT JOIN fair_risks fr ON pi.risk_id = fr.risk_id AND pi.risk_type = 'fair'
      WHERE pi.portfolio_id = ${portfolioId}
      ORDER BY pi.created_at DESC
    `

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching portfolio items:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio items" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const portfolioId = Number.parseInt(params.id)
    const body = await request.json()
    const { risk_id, risk_type = "fair", weight = 1.0, correlation_group } = body

    if (isNaN(portfolioId)) {
      return NextResponse.json({ error: "Invalid portfolio ID" }, { status: 400 })
    }

    if (!risk_id) {
      return NextResponse.json({ error: "Risk ID is required" }, { status: 400 })
    }

    const result = await tenantDb`
      INSERT INTO portfolio_items (
        portfolio_id, risk_id, risk_type, weight, correlation_group
      ) VALUES (
        ${portfolioId}, ${risk_id}, ${risk_type}, ${weight}, ${correlation_group}
      ) RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error adding portfolio item:", error)
    return NextResponse.json({ error: "Failed to add portfolio item" }, { status: 500 })
  }
});
