import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "active"
    const portfolioType = searchParams.get("portfolio_type")
    const owner = searchParams.get("owner")
    const businessUnit = searchParams.get("business_unit")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    // Build the base query with proper WHERE conditions
    let baseQuery = `
      SELECT 
        rp.id,
        rp.portfolio_id,
        rp.name,
        rp.description,
        rp.owner,
        rp.business_unit,
        rp.portfolio_type,
        rp.risk_appetite,
        rp.risk_tolerance,
        rp.review_frequency,
        rp.status,
        rp.created_at,
        rp.updated_at,
        rp.created_by,
        rp.updated_by,
        rp.last_calculation,
        COUNT(DISTINCT pi.id) as item_count,
        COUNT(DISTINCT rc.id) as correlation_count,
        CASE 
          WHEN rp.last_calculation IS NOT NULL THEN 'calculated'
          WHEN COUNT(DISTINCT pi.id) > 0 THEN 'ready'
          ELSE 'empty'
        END as calculation_status
      FROM risk_portfolios rp
      LEFT JOIN portfolio_items pi ON rp.id = pi.portfolio_id
      LEFT JOIN risk_correlations rc ON rp.id = rc.portfolio_id
      WHERE 1=1
    `

    const conditions = []
    if (status !== "all") {
      conditions.push(`rp.status = '${status}'`)
    }
    if (portfolioType) {
      conditions.push(`rp.portfolio_type = '${portfolioType}'`)
    }
    if (owner) {
      conditions.push(`rp.owner ILIKE '%${owner}%'`)
    }
    if (businessUnit) {
      conditions.push(`rp.business_unit ILIKE '%${businessUnit}%'`)
    }

    if (conditions.length > 0) {
      baseQuery += ` AND ${conditions.join(" AND ")}`
    }

    baseQuery += `
      GROUP BY rp.id, rp.portfolio_id, rp.name, rp.description, rp.owner, rp.business_unit, 
               rp.portfolio_type, rp.risk_appetite, rp.risk_tolerance, rp.review_frequency, 
               rp.status, rp.created_at, rp.updated_at, rp.created_by, rp.updated_by, rp.last_calculation
      ORDER BY rp.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const portfolios = await tenantDb.unsafe(baseQuery)

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(DISTINCT rp.id) as total
      FROM risk_portfolios rp
      WHERE 1=1
    `

    if (conditions.length > 0) {
      countQuery += ` AND ${conditions.join(" AND ")}`
    }

    const countResult = await tenantDb`${tenantDb.unsafe(countQuery)}` as Record<string, any>[]
    const total = Number.parseInt(countResult[0]?.total || "0")

    return NextResponse.json({
      portfolios,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  } catch (error) {
    console.error("Error fetching portfolios:", error)
    return NextResponse.json({ error: "Failed to fetch portfolios" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      name,
      description,
      owner,
      business_unit,
      portfolio_type = "operational",
      risk_appetite = 0,
      risk_tolerance = 0,
      review_frequency = "quarterly",
      created_by = "system",
    } = body

    if (!name || !owner) {
      return NextResponse.json({ error: "Name and owner are required" }, { status: 400 })
    }

    // Generate portfolio ID
    const portfolioIdResult = await tenantDb`
      SELECT 'PORT-' || LPAD((COALESCE(MAX(CAST(SUBSTRING(portfolio_id FROM 6) AS INTEGER)), 0) + 1)::TEXT, 3, '0') as next_id
      FROM risk_portfolios 
      WHERE portfolio_id ~ '^PORT-[0-9]+$'
    ` as Record<string, any>[]
    const portfolioId = portfolioIdResult[0]?.next_id || "PORT-001"

    const result = await tenantDb`
      INSERT INTO risk_portfolios (
        portfolio_id, name, description, owner, business_unit, portfolio_type,
        risk_appetite, risk_tolerance, review_frequency, created_by, updated_by
      ) VALUES (
        ${portfolioId}, ${name}, ${description}, ${owner}, ${business_unit}, ${portfolio_type},
        ${risk_appetite}, ${risk_tolerance}, ${review_frequency}, ${created_by}, ${created_by}
      ) RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating portfolio:", error)
    return NextResponse.json({ error: "Failed to create portfolio" }, { status: 500 })
  }
});
