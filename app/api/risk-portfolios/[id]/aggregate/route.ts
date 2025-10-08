import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const portfolioId = Number.parseInt(params.id)

    if (isNaN(portfolioId)) {
      return NextResponse.json({ error: "Invalid portfolio ID" }, { status: 400 })
    }

    // Get the latest aggregation results
    const aggregation = await tenantDb`
      SELECT * FROM portfolio_aggregation_results
      WHERE portfolio_id = ${portfolioId}
      ORDER BY calculation_date DESC
      LIMIT 1
    ` as Record<string, any>[]

    // Get risk contributions
    const contributions = await tenantDb`
      SELECT 
        rc.*,
        fr.risk_title
      FROM risk_contributions rc
      LEFT JOIN fair_risks fr ON rc.risk_id = fr.risk_id AND rc.risk_type = 'fair'
      WHERE rc.portfolio_id = ${portfolioId}
      ORDER BY rc.percentage_contribution DESC
    `

    return NextResponse.json({
      aggregation: aggregation[0] || null,
      contributions: contributions || [],
    })
  } catch (error) {
    console.error("Error fetching aggregation results:", error)
    return NextResponse.json({ error: "Failed to fetch aggregation results" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const portfolioId = Number.parseInt(params.id)
    const body = await request.json()
    const { simulation_runs = 10000, confidence_level = 0.95 } = body

    if (isNaN(portfolioId)) {
      return NextResponse.json({ error: "Invalid portfolio ID" }, { status: 400 })
    }

    // Get portfolio items with their ALE values
    const items = await tenantDb`
      SELECT 
        pi.*,
        fr.annual_loss_expectancy
      FROM portfolio_items pi
      LEFT JOIN fair_risks fr ON pi.risk_id = fr.risk_id AND pi.risk_type = 'fair'
      WHERE pi.portfolio_id = ${portfolioId}
      AND fr.annual_loss_expectancy IS NOT NULL
    ` as Record<string, any>[]

    if (items.length === 0) {
      return NextResponse.json({ error: "No risks with ALE values found in portfolio" }, { status: 400 })
    }

    // Simple aggregation calculation (in a real implementation, this would be Monte Carlo)
    const totalAle = items.reduce((sum, item) => sum + item.annual_loss_expectancy * item.weight, 0)
    const diversifiedAle = totalAle * 0.85 // Simple diversification benefit
    const correlationBenefit = totalAle - diversifiedAle
    const diversificationRatio = diversifiedAle / totalAle
    const var95 = diversifiedAle * 1.65 // Approximate VaR
    const var99 = diversifiedAle * 2.33
    const expectedShortfall = var95 * 1.2
    const concentrationIndex = items.reduce((sum, item) => {
      const weight = item.weight / items.length
      return sum + weight * weight
    }, 0)

    // Insert aggregation results
    const aggregationResult = await tenantDb`
      INSERT INTO portfolio_aggregation_results (
        portfolio_id, simulation_runs, confidence_interval,
        individual_ale_sum, diversified_ale, correlation_benefit,
        diversification_ratio, portfolio_var_95, portfolio_var_99,
        expected_shortfall_95, expected_shortfall_99, concentration_index,
        largest_risk_contribution, calculation_time_seconds
      ) VALUES (
        ${portfolioId}, ${simulation_runs}, ${confidence_level},
        ${totalAle}, ${diversifiedAle}, ${correlationBenefit},
        ${diversificationRatio}, ${var95}, ${var99},
        ${expectedShortfall}, ${expectedShortfall * 1.1}, ${concentrationIndex},
        ${0.3}, ${2.5}
      ) RETURNING *
    ` as Record<string, any>[]

    // Insert risk contributions
    const contributions = []
    for (const item of items) {
      const marginalContribution = item.annual_loss_expectancy * item.weight
      const percentageContribution = marginalContribution / totalAle

      const contributionResult = await tenantDb`
        INSERT INTO risk_contributions (
          aggregation_result_id, portfolio_id, risk_id, risk_type,
          marginal_contribution, component_contribution, percentage_contribution,
          standalone_ale, portfolio_ale
        ) VALUES (
          ${aggregationResult[0].id}, ${portfolioId}, ${item.risk_id}, ${item.risk_type},
          ${marginalContribution}, ${marginalContribution}, ${percentageContribution},
          ${item.annual_loss_expectancy}, ${diversifiedAle}
        ) RETURNING *
      ` as Record<string, any>[]
      contributions.push(contributionResult[0])
    }

    // Update portfolio last_calculation timestamp
    await tenantDb`
      UPDATE risk_portfolios 
      SET last_calculation = CURRENT_TIMESTAMP
      WHERE id = ${portfolioId}
    `

    return NextResponse.json({
      aggregation: aggregationResult[0],
      contributions,
    })
  } catch (error) {
    console.error("Error running aggregation:", error)
    return NextResponse.json({ error: "Failed to run aggregation" }, { status: 500 })
  }
});
