import { NextRequest, NextResponse } from 'next/server'
import { withContext } from '@/lib/HttpContext'

// GET /api/audit/reports - Get audit reports
export const GET = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const engagementId = searchParams.get('engagementId') || ''
    const reportType = searchParams.get('reportType') || ''
    const status = searchParams.get('status') || ''

    const offset = (page - 1) * limit

    let query = `
      SELECT 
        r.id, r.report_id, r.engagement_id, r.report_title, r.report_type,
        r.report_status, r.report_period_start, r.report_period_end, r.report_date,
        r.executive_summary, r.scope_and_objectives, r.methodology, r.key_findings,
        r.recommendations, r.management_response, r.overall_conclusion, r.risk_assessment,
        r.compliance_status, r.next_steps, r.distribution_list, r.confidentiality_level,
        r.version, r.previous_version_id, r.approval_status, r.approved_by, r.approval_date,
        r.issued_by, r.issued_date, r.created_at, r.updated_at,
        ae.engagement_name, ae.engagement_type
      FROM audit_reports r
      LEFT JOIN audit_engagements ae ON r.engagement_id = ae.engagement_id
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 0

    if (engagementId) {
      paramCount++
      query += ` AND r.engagement_id = $${paramCount}`
      params.push(engagementId)
    }

    if (reportType) {
      paramCount++
      query += ` AND r.report_type = $${paramCount}`
      params.push(reportType)
    }

    if (status) {
      paramCount++
      query += ` AND r.report_status = $${paramCount}`
      params.push(status)
    }

    query += ` ORDER BY r.report_date DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`
    params.push(limit, offset)

    const result = await tenantDb.query(query, params)

    // Get total count
    let countQuery = `
      SELECT COUNT(*) FROM audit_reports r
      WHERE 1=1
    `
    const countParams: any[] = []
    let countParamCount = 0

    if (engagementId) {
      countParamCount++
      countQuery += ` AND r.engagement_id = $${countParamCount}`
      countParams.push(engagementId)
    }

    if (reportType) {
      countParamCount++
      countQuery += ` AND r.report_type = $${countParamCount}`
      countParams.push(reportType)
    }

    if (status) {
      countParamCount++
      countQuery += ` AND r.report_status = $${countParamCount}`
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
    console.error('Error fetching audit reports:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch audit reports' },
      { status: 500 }
    )
  }
})

// POST /api/audit/reports - Create new audit report
export const POST = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const body = await request.json()
    const {
      report_id,
      engagement_id,
      report_title,
      report_type,
      report_period_start,
      report_period_end,
      executive_summary,
      scope_and_objectives,
      methodology,
      key_findings,
      recommendations,
      management_response,
      overall_conclusion,
      risk_assessment,
      compliance_status,
      next_steps,
      distribution_list,
      confidentiality_level
    } = body

    const query = `
        INSERT INTO audit_reports (
        report_id, engagement_id, report_title, report_type, report_period_start,
        report_period_end, executive_summary, scope_and_objectives, methodology,
        key_findings, recommendations, management_response, overall_conclusion,
        risk_assessment, compliance_status, next_steps, distribution_list, confidentiality_level
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
      ) RETURNING *
    `

    const result = await tenantDb.query(query, [
      report_id, engagement_id, report_title, report_type, report_period_start,
      report_period_end, executive_summary, scope_and_objectives, methodology,
      key_findings, recommendations, management_response, overall_conclusion,
      risk_assessment, compliance_status, next_steps, distribution_list, confidentiality_level
    ])

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error creating audit report:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create audit report' },
      { status: 500 }
    )
  }
})