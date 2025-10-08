import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const portfolioId = Number.parseInt(params.id)

    if (isNaN(portfolioId)) {
      return NextResponse.json({ error: "Invalid portfolio ID" }, { status: 400 })
    }

    // Get portfolio details
    const portfolio = await tenantDb`
      SELECT * FROM risk_portfolios 
      WHERE id = ${portfolioId}
    ` as Record<string, any>[]

    if (portfolio.length === 0) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    // Get portfolio items with risk details
    const items = await tenantDb`
      SELECT 
        pi.*,
        fr.title as risk_title,
        fr.annual_loss_expectancy
      FROM portfolio_items pi
      LEFT JOIN fair_risks fr ON pi.fair_risk_id = fr.id
      WHERE pi.portfolio_id = ${portfolioId}
      ORDER BY pi.created_at DESC
    `

    return NextResponse.json({
      portfolio: portfolio[0],
      items,
    })
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const portfolioId = Number.parseInt(params.id)
    const body = await request.json()

    if (isNaN(portfolioId)) {
      return NextResponse.json({ error: "Invalid portfolio ID" }, { status: 400 })
    }

    const {
      name,
      description,
      owner,
      business_unit,
      portfolio_type,
      risk_appetite,
      risk_tolerance,
      review_frequency,
      status,
      updated_by = "system",
    } = body

    const result = await tenantDb`
      UPDATE risk_portfolios 
      SET 
        name = ${name},
        description = ${description},
        owner = ${owner},
        business_unit = ${business_unit},
        portfolio_type = ${portfolio_type},
        risk_appetite = ${risk_appetite},
        risk_tolerance = ${risk_tolerance},
        review_frequency = ${review_frequency},
        status = ${status},
        updated_by = ${updated_by},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${portfolioId}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating portfolio:", error)
    return NextResponse.json({ error: "Failed to update portfolio" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const portfolioId = Number.parseInt(params.id)

    if (isNaN(portfolioId)) {
      return NextResponse.json({ error: "Invalid portfolio ID" }, { status: 400 })
    }

    // Delete related records first
    await tenantDb`DELETE FROM risk_correlations WHERE portfolio_id = ${portfolioId}`
    await tenantDb`DELETE FROM portfolio_items WHERE portfolio_id = ${portfolioId}`
    await tenantDb`DELETE FROM portfolio_aggregations WHERE portfolio_id = ${portfolioId}`

    // Delete the portfolio
    const result = await tenantDb`
      DELETE FROM risk_portfolios 
      WHERE id = ${portfolioId}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Portfolio deleted successfully" })
  } catch (error) {
    console.error("Error deleting portfolio:", error)
    return NextResponse.json({ error: "Failed to delete portfolio" }, { status: 500 })
  }
});
