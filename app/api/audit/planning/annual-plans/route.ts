import { NextRequest, NextResponse } from 'next/server'
import { withContext } from '@/lib/HttpContext'

// GET /api/audit/planning/annual-plans - Get all annual audit plans
export const GET = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const year = searchParams.get('year') || ''
    const status = searchParams.get('status') || ''

    const offset = (page - 1) * limit

    let query = `
      SELECT 
        id, plan_year, plan_name, plan_status, plan_description,
        total_budget, allocated_budget, total_hours, allocated_hours,
        risk_focus_areas, regulatory_priorities, strategic_objectives,
        approval_status, approved_by, approval_date, created_at, updated_at
      FROM annual_audit_plans
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 0

    if (year) {
      paramCount++
      query += ` AND plan_year = $${paramCount}`
      params.push(parseInt(year))
    }

    if (status) {
      paramCount++
      query += ` AND plan_status = $${paramCount}`
      params.push(status)
    }

    query += ` ORDER BY plan_year DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`
    params.push(limit, offset)

    const result = await tenantDb.query(query, params)

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM annual_audit_plans WHERE 1=1'
    const countParams: any[] = []
    let countParamCount = 0

    if (year) {
      countParamCount++
      countQuery += ` AND plan_year = $${countParamCount}`
      countParams.push(parseInt(year))
    }

    if (status) {
      countParamCount++
      countQuery += ` AND plan_status = $${countParamCount}`
      countParams.push(status)
    }

    const countResult = await tenantDb.query(countQuery, countParams)
    const total = parseInt(countResult.rows[0].count)

    return NextResponse.json({
      success: true,
      data: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching annual audit plans:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch annual audit plans' },
      { status: 500 }
    )
  }
})

// POST /api/audit/planning/annual-plans - Create new annual audit plan
export const POST = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const body = await request.json()
    const {
      plan_year,
      plan_name,
      plan_description,
      total_budget,
      total_hours,
      risk_focus_areas,
      regulatory_priorities,
      strategic_objectives
    } = body

    const query = `
      INSERT INTO annual_audit_plans (
        plan_year, plan_name, plan_description, total_budget, total_hours,
        risk_focus_areas, regulatory_priorities, strategic_objectives
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      ) RETURNING *
    `

    const result = await tenantDb.query(query, [
      plan_year, plan_name, plan_description, total_budget, total_hours,
      risk_focus_areas, regulatory_priorities, strategic_objectives
    ])

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating annual audit plan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create annual audit plan' },
      { status: 500 }
    )
  }
})
