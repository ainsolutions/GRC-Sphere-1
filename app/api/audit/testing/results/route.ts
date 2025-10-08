import { NextRequest, NextResponse } from 'next/server'
import { withContext } from '@/lib/HttpContext'

// GET /api/audit/testing/results - Get control testing results
export const GET = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const procedureId = searchParams.get('procedureId') || ''
    const result = searchParams.get('result') || ''

    const offset = (page - 1) * limit

    let query = `
      SELECT 
        tr.id, tr.result_id, tr.procedure_id, tr.test_date, tr.tested_by,
        tr.test_result, tr.exceptions_found, tr.exceptions_description, tr.root_cause_analysis,
        tr.management_response, tr.remediation_plan, tr.remediation_timeline, tr.follow_up_required,
        tr.follow_up_date, tr.testing_notes, tr.conclusion, tr.recommendations, tr.risk_implications,
        tr.created_at, tr.updated_at,
        tp.procedure_name, tp.control_id,
        cl.control_name, cl.control_category
      FROM control_testing_results tr
      LEFT JOIN control_testing_procedures tp ON tr.procedure_id = tp.procedure_id
      LEFT JOIN control_library cl ON tp.control_id = cl.control_id
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 0

    if (procedureId) {
      paramCount++
      query += ` AND tr.procedure_id = $${paramCount}`
      params.push(procedureId)
    }

    if (result) {
      paramCount++
      query += ` AND tr.test_result = $${paramCount}`
      params.push(result)
    }

    query += ` ORDER BY tr.test_date DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`
    params.push(limit, offset)

    const result_data = await tenantDb.query(query, params)

    // Get total count
    let countQuery = `
      SELECT COUNT(*) FROM control_testing_results tr
      WHERE 1=1
    `
    const countParams: any[] = []
    let countParamCount = 0

    if (procedureId) {
      countParamCount++
      countQuery += ` AND tr.procedure_id = $${countParamCount}`
      countParams.push(procedureId)
    }

    if (result) {
      countParamCount++
      countQuery += ` AND tr.test_result = $${countParamCount}`
      countParams.push(result)
    }

    const countResult = await tenantDb.query(countQuery, countParams)
    const total = parseInt(countResult.rows[0].count)

    return NextResponse.json({
      success: true,
      data: result_data.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching control testing results:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch control testing results' },
      { status: 500 }
    )
  }
})

// POST /api/audit/testing/results - Create new control testing result
export const POST = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const body = await request.json()
    const {
      result_id,
      procedure_id,
      test_date,
      tested_by,
      test_result,
      exceptions_found,
      exceptions_description,
      root_cause_analysis,
      management_response,
      remediation_plan,
      remediation_timeline,
      follow_up_required,
      follow_up_date,
      testing_notes,
      conclusion,
      recommendations,
      risk_implications
    } = body

    const query = `
          INSERT INTO control_testing_results (
        result_id, procedure_id, test_date, tested_by, test_result, exceptions_found,
        exceptions_description, root_cause_analysis, management_response, remediation_plan,
        remediation_timeline, follow_up_required, follow_up_date, testing_notes, conclusion,
        recommendations, risk_implications
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      ) RETURNING *
    `

    const result = await tenantDb.query(query, [
      result_id, procedure_id, test_date, tested_by, test_result, exceptions_found,
      exceptions_description, root_cause_analysis, management_response, remediation_plan,
      remediation_timeline, follow_up_required, follow_up_date, testing_notes, conclusion,
      recommendations, risk_implications
    ])

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating control testing result:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create control testing result' },
      { status: 500 }
    )
  }
})