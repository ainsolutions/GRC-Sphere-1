import { NextRequest, NextResponse } from 'next/server'
import { withContext } from '@/lib/HttpContext'

// GET /api/audit/universe - Get all audit universe entities
export const GET = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const entityType = searchParams.get('entityType') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''

    const offset = (page - 1) * limit

    let query = `
      SELECT 
        id, entity_id, entity_name, entity_type, entity_category,
        description, owner_department, owner_name, owner_email,
        risk_rating, last_audit_date, next_audit_due_date,
        audit_frequency, regulatory_requirements, business_criticality,
        materiality_score, inherent_risk_score, control_environment_score,
        status, tags, metadata, created_at, updated_at
      FROM audit_universe
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 0

    if (search) {
      paramCount++
      query += ` AND (entity_name ILIKE $${paramCount} OR description ILIKE $${paramCount} OR entity_id ILIKE $${paramCount})`
      params.push(`%${search}%`)
    }

    if (entityType) {
      paramCount++
      query += ` AND entity_type = $${paramCount}`
      params.push(entityType)
    }

    if (category) {
      paramCount++
      query += ` AND entity_category = $${paramCount}`
      params.push(category)
    }

    if (status) {
      paramCount++
      query += ` AND status = $${paramCount}`
      params.push(status)
    }

    query += ` ORDER BY entity_name LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`
    params.push(limit, offset)

    const result = await tenantDb.query(query, params)

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM audit_mgmt.audit_universe WHERE 1=1'
    const countParams: any[] = []
    let countParamCount = 0

    if (search) {
      countParamCount++
      countQuery += ` AND (entity_name ILIKE $${countParamCount} OR description ILIKE $${countParamCount} OR entity_id ILIKE $${countParamCount})`
      countParams.push(`%${search}%`)
    }

    if (entityType) {
      countParamCount++
      countQuery += ` AND entity_type = $${countParamCount}`
      countParams.push(entityType)
    }

    if (category) {
      countParamCount++
      countQuery += ` AND entity_category = $${countParamCount}`
      countParams.push(category)
    }

    if (status) {
      countParamCount++
      countQuery += ` AND status = $${countParamCount}`
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
    console.error('Error fetching audit universe:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit universe' },
      { status: 500 }
    )
  }
})

// POST /api/audit/universe - Create new audit universe entity
export const POST = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const body = await request.json()
    const {
      entity_id,
      entity_name,
      entity_type,
      entity_category,
      description,
      owner_department,
      owner_name,
      owner_email,
      risk_rating,
      last_audit_date,
      next_audit_due_date,
      audit_frequency,
      regulatory_requirements,
      business_criticality,
      materiality_score,
      inherent_risk_score,
      control_environment_score,
      status,
      tags,
      metadata
    } = body

    const query = `
      INSERT INTO audit_universe (
        entity_id, entity_name, entity_type, entity_category, description,
        owner_department, owner_name, owner_email, risk_rating,
        last_audit_date, next_audit_due_date, audit_frequency,
        regulatory_requirements, business_criticality, materiality_score,
        inherent_risk_score, control_environment_score, status, tags, metadata
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
      ) RETURNING *
    `

    const result = await tenantDb.query(query, [
      entity_id, entity_name, entity_type, entity_category, description,
      owner_department, owner_name, owner_email, risk_rating,
      last_audit_date, next_audit_due_date, audit_frequency,
      regulatory_requirements, business_criticality, materiality_score,
      inherent_risk_score, control_environment_score, status, tags, metadata
    ])

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating audit universe entity:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create audit universe entity' },
      { status: 500 }
    )
  }
})
