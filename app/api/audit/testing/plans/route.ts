import { NextRequest, NextResponse } from 'next/server'
import { withContext } from '@/lib/HttpContext'

// GET /api/audit/testing/plans - Get control testing plans
export const GET = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const engagementId = searchParams.get('engagementId') || ''
    const status = searchParams.get('status') || ''

    const offset = (page - 1) * limit

    let query = `
      SELECT 
        tp.id, tp.plan_id, tp.engagement_id, tp.plan_name, tp.testing_period_start,
        tp.testing_period_end, tp.plan_status, tp.testing_objective, tp.sampling_methodology,
        tp.sample_size, tp.population_size, tp.confidence_level, tp.tolerable_error_rate,
        tp.expected_error_rate, tp.testing_approach, tp.deliverables, tp.approval_status,
        tp.approved_by, tp.approval_date, tp.created_at, tp.updated_at,
        ae.engagement_name, ae.engagement_type
      FROM control_testing_plans tp
      LEFT JOIN audit_engagements ae ON tp.engagement_id = ae.engagement_id
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 0

    if (engagementId) {
      paramCount++
      query += ` AND tp.engagement_id = $${paramCount}`
      params.push(engagementId)
    }

    if (status) {
      paramCount++
      query += ` AND tp.plan_status = $${paramCount}`
      params.push(status)
    }

    query += ` ORDER BY tp.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`
    params.push(limit, offset)

    const result = await tenantDb.query(query, params)

    // Get total count
    let countQuery = `
      SELECT COUNT(*) FROM control_testing_plans tp
      WHERE 1=1
    `
    const countParams: any[] = []
    let countParamCount = 0

    if (engagementId) {
      countParamCount++
      countQuery += ` AND tp.engagement_id = $${countParamCount}`
      countParams.push(engagementId)
    }

    if (status) {
      countParamCount++
      countQuery += ` AND tp.plan_status = $${countParamCount}`
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
    console.error('Error fetching control testing plans:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch control testing plans' },
      { status: 500 }
    )
  }
})

// POST /api/audit/testing/plans - Create new control testing plan
export const POST = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const body = await request.json()
    const {
      plan_id,
      engagement_id,
      plan_name,
      testing_period_start,
      testing_period_end,
      testing_objective,
      sampling_methodology,
      sample_size,
      population_size,
      confidence_level,
      tolerable_error_rate,
      expected_error_rate,
      testing_approach,
      deliverables
    } = body

    const query = `
        INSERT INTO control_testing_plans (
        plan_id, engagement_id, plan_name, testing_period_start, testing_period_end,
        testing_objective, sampling_methodology, sample_size, population_size,
        confidence_level, tolerable_error_rate, expected_error_rate, testing_approach, deliverables
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
      ) RETURNING *
    `

    const result = await tenantDb.query(query, [
      plan_id, engagement_id, plan_name, testing_period_start, testing_period_end,
      testing_objective, sampling_methodology, sample_size, population_size,
      confidence_level, tolerable_error_rate, expected_error_rate, testing_approach, deliverables
    ])

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating control testing plan:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create control testing plan' },
      { status: 500 }
    )
  }
})