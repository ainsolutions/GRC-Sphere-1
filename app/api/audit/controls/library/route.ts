import { NextRequest, NextResponse } from 'next/server'
import { withContext } from '@/lib/HttpContext'

// GET /api/audit/controls/library - Get all controls in the library
export const GET = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const family = searchParams.get('family') || ''
    const status = searchParams.get('status') || ''

    const offset = (page - 1) * limit

    let query = `
      SELECT 
        id, control_id, control_name, control_category, control_type, control_family,
        description, control_objective, control_activities, applicable_frameworks,
        regulatory_mappings, risk_categories, control_owner, control_owner_email,
        implementation_status, effectiveness_rating, last_review_date, next_review_date,
        testing_frequency, testing_method, control_design, control_operation,
        documentation_location, related_controls, tags, metadata, created_at, updated_at
      FROM control_library
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 0

    if (search) {
      paramCount++
      query += ` AND (control_name ILIKE $${paramCount} OR description ILIKE $${paramCount} OR control_id ILIKE $${paramCount})`
      params.push(`%${search}%`)
    }

    if (category) {
      paramCount++
      query += ` AND control_category = $${paramCount}`
      params.push(category)
    }

    if (family) {
      paramCount++
      query += ` AND control_family = $${paramCount}`
      params.push(family)
    }

    if (status) {
      paramCount++
      query += ` AND implementation_status = $${paramCount}`
      params.push(status)
    }

    query += ` ORDER BY control_name LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`
    params.push(limit, offset)

    const result = await tenantDb.query(query, params)

    // Get total count
    let countQuery = 'SELECT COUNT(*) FROM control_library WHERE 1=1'
    const countParams: any[] = []
    let countParamCount = 0

    if (search) {
      countParamCount++
      countQuery += ` AND (control_name ILIKE $${countParamCount} OR description ILIKE $${countParamCount} OR control_id ILIKE $${countParamCount})`
      countParams.push(`%${search}%`)
    }

    if (category) {
      countParamCount++
      countQuery += ` AND control_category = $${countParamCount}`
      countParams.push(category)
    }

    if (family) {
      countParamCount++
      countQuery += ` AND control_family = $${countParamCount}`
      countParams.push(family)
    }

    if (status) {
      countParamCount++
      countQuery += ` AND implementation_status = $${countParamCount}`
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
    console.error('Error fetching control library:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch control library' },
      { status: 500 }
    )
  }
})

// POST /api/audit/controls/library - Create new control
export const POST = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const body = await request.json()
    const {
      control_id,
      control_name,
      control_category,
      control_type,
      control_family,
      description,
      control_objective,
      control_activities,
      applicable_frameworks,
      regulatory_mappings,
      risk_categories,
      control_owner,
      control_owner_email,
      implementation_status,
      effectiveness_rating,
      last_review_date,
      next_review_date,
      testing_frequency,
      testing_method,
      control_design,
      control_operation,
      documentation_location,
      related_controls,
      tags,
      metadata
    } = body

    const query = `
        INSERT INTO control_library (
        control_id, control_name, control_category, control_type, control_family,
        description, control_objective, control_activities, applicable_frameworks,
        regulatory_mappings, risk_categories, control_owner, control_owner_email,
        implementation_status, effectiveness_rating, last_review_date, next_review_date,
        testing_frequency, testing_method, control_design, control_operation,
        documentation_location, related_controls, tags, metadata
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
      ) RETURNING *
    `

    const result = await tenantDb.query(query, [
      control_id, control_name, control_category, control_type, control_family,
      description, control_objective, control_activities, applicable_frameworks,
      regulatory_mappings, risk_categories, control_owner, control_owner_email,
      implementation_status, effectiveness_rating, last_review_date, next_review_date,
      testing_frequency, testing_method, control_design, control_operation,
      documentation_location, related_controls, tags, metadata
    ])

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating control:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create control' },
      { status: 500 }
    )
  }
})