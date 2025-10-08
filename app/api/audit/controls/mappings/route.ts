import { NextRequest, NextResponse } from 'next/server'
import { withContext } from '@/lib/HttpContext'

// GET /api/audit/controls/mappings - Get risk-control mappings
export const GET = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const riskId = searchParams.get('riskId') || ''
    const controlId = searchParams.get('controlId') || ''
    const mappingType = searchParams.get('mappingType') || ''

    const offset = (page - 1) * limit

    let query = `
      SELECT 
        rcm.id, rcm.risk_id, rcm.control_id, rcm.mapping_type, rcm.effectiveness_rating,
        rcm.coverage_percentage, rcm.residual_risk_level, rcm.last_assessment_date,
        rcm.next_assessment_date, rcm.assessment_notes, rcm.created_at, rcm.updated_at,
        cl.control_name, cl.control_category, cl.control_family
      FROM risk_control_mappings_audit rcm
      LEFT JOIN control_library cl ON rcm.control_id = cl.control_id
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 0

    if (riskId) {
      paramCount++
      query += ` AND rcm.risk_id = $${paramCount}`
      params.push(riskId)
    }

    if (controlId) {
      paramCount++
      query += ` AND rcm.control_id = $${paramCount}`
      params.push(controlId)
    }

    if (mappingType) {
      paramCount++
      query += ` AND rcm.mapping_type = $${paramCount}`
      params.push(mappingType)
    }

    query += ` ORDER BY rcm.created_at DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`
    params.push(limit, offset)

    const result = await tenantDb.query(query, params)

    // Get total count
    let countQuery = `
      SELECT COUNT(*) FROM risk_control_mappings_audit rcm
      WHERE 1=1
    `
    const countParams: any[] = []
    let countParamCount = 0

    if (riskId) {
      countParamCount++
      countQuery += ` AND rcm.risk_id = $${countParamCount}`
      countParams.push(riskId)
    }

    if (controlId) {
      countParamCount++
      countQuery += ` AND rcm.control_id = $${countParamCount}`
      countParams.push(controlId)
    }

    if (mappingType) {
      countParamCount++
      countQuery += ` AND rcm.mapping_type = $${countParamCount}`
      countParams.push(mappingType)
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
    console.error('Error fetching risk-control mappings:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch risk-control mappings' },
      { status: 500 }
    )
  }
})

// POST /api/audit/controls/mappings - Create new risk-control mapping
export const POST = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const body = await request.json()
    const {
      risk_id,
      control_id,
      mapping_type,
      effectiveness_rating,
      coverage_percentage,
      residual_risk_level,
      last_assessment_date,
      next_assessment_date,
      assessment_notes
    } = body

    const query = `
      INSERT INTO risk_control_mappings_audit (
        risk_id, control_id, mapping_type, effectiveness_rating, coverage_percentage,
        residual_risk_level, last_assessment_date, next_assessment_date, assessment_notes
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      ) RETURNING *
    `

    const result = await tenantDb.query(query, [
      risk_id, control_id, mapping_type, effectiveness_rating, coverage_percentage,
      residual_risk_level, last_assessment_date, next_assessment_date, assessment_notes
    ])

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating risk-control mapping:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create risk-control mapping' },
      { status: 500 }
    )
  }
})