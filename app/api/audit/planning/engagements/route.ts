import { NextRequest, NextResponse } from 'next/server'
import { withContext } from '@/lib/HttpContext'

// GET /api/audit/planning/engagements - Get all audit engagements
export const GET = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const planId = searchParams.get('planId') || ''
    const status = searchParams.get('status') || ''
    const year = searchParams.get('year') || ''

    const offset = (page - 1) * limit

    let query = `
      SELECT 
        e.id, e.engagement_id, e.annual_plan_id, e.entity_id, e.engagement_name,
        e.engagement_type, e.audit_scope, e.audit_objectives, e.risk_assessment,
        e.planned_start_date, e.planned_end_date, e.actual_start_date, e.actual_end_date,
        e.planned_hours, e.actual_hours, e.planned_budget, e.actual_budget,
        e.engagement_status, e.priority, e.complexity, e.team_lead, e.team_lead_email,
        e.audit_team, e.stakeholders, e.deliverables, e.methodology, e.tools_used,
        e.created_at, e.updated_at,
        au.entity_name as entity_name,
        ap.plan_name as plan_name
      FROM audit_engagements e
      LEFT JOIN audit_mgmt.audit_universe au ON e.entity_id = au.entity_id
      LEFT JOIN audit_mgmt.annual_audit_plans ap ON e.annual_plan_id = ap.id
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 0

    if (planId) {
      paramCount++
      query += ` AND e.annual_plan_id = $${paramCount}`
      params.push(parseInt(planId))
    }

    if (status) {
      paramCount++
      query += ` AND e.engagement_status = $${paramCount}`
      params.push(status)
    }

    if (year) {
      paramCount++
      query += ` AND EXTRACT(YEAR FROM e.planned_start_date) = $${paramCount}`
      params.push(parseInt(year))
    }

    query += ` ORDER BY e.planned_start_date DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`
    params.push(limit, offset)

    const result = await tenantDb.query(query, params)

    // Get total count
    let countQuery = `
      SELECT COUNT(*) FROM audit_engagements e
      WHERE 1=1
    `
    const countParams: any[] = []
    let countParamCount = 0

    if (planId) {
      countParamCount++
      countQuery += ` AND e.annual_plan_id = $${countParamCount}`
      countParams.push(parseInt(planId))
    }

    if (status) {
      countParamCount++
      countQuery += ` AND e.engagement_status = $${countParamCount}`
      countParams.push(status)
    }

    if (year) {
      countParamCount++
      countQuery += ` AND EXTRACT(YEAR FROM e.planned_start_date) = $${countParamCount}`
      countParams.push(parseInt(year))
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
    console.error('Error fetching audit engagements:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit engagements' },
      { status: 500 }
    )
  }
})

// POST /api/audit/planning/engagements - Create new audit engagement
export const POST = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const body = await request.json()
    const {
      engagement_id,
      annual_plan_id,
      entity_id,
      engagement_name,
      engagement_type,
      audit_scope,
      audit_objectives,
      risk_assessment,
      planned_start_date,
      planned_end_date,
      planned_hours,
      planned_budget,
      priority,
      complexity,
      team_lead,
      team_lead_email,
      audit_team,
      stakeholders,
      deliverables,
      methodology,
      tools_used
    } = body

    const query = `
        INSERT INTO audit_engagements (
        engagement_id, annual_plan_id, entity_id, engagement_name, engagement_type,
        audit_scope, audit_objectives, risk_assessment, planned_start_date,
        planned_end_date, planned_hours, planned_budget, priority, complexity,
        team_lead, team_lead_email, audit_team, stakeholders, deliverables,
        methodology, tools_used
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
      ) RETURNING *
    `

    const result = await tenantDb.query(query, [
      engagement_id, annual_plan_id, entity_id, engagement_name, engagement_type,
      audit_scope, audit_objectives, risk_assessment, planned_start_date,
      planned_end_date, planned_hours, planned_budget, priority, complexity,
      team_lead, team_lead_email, audit_team, stakeholders, deliverables,
      methodology, tools_used
    ])

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating audit engagement:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create audit engagement' },
      { status: 500 }
    )
  }
})