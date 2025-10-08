import { NextRequest, NextResponse } from 'next/server'
import { withContext } from '@/lib/HttpContext'

// GET /api/audit/testing/evidence - Get control testing evidence
export const GET = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const resultId = searchParams.get('resultId') || ''
    const evidenceType = searchParams.get('evidenceType') || ''

    const offset = (page - 1) * limit

    let query = `
      SELECT 
        e.id, e.evidence_id, e.result_id, e.evidence_type, e.evidence_name,
        e.evidence_description, e.file_path, e.file_size, e.file_type,
        e.upload_date, e.uploaded_by, e.evidence_source, e.reliability_rating,
        e.relevance_rating, e.sufficiency_rating, e.confidentiality_level,
        e.retention_period, e.tags, e.metadata, e.created_at, e.updated_at,
        tr.test_date, tr.tested_by, tr.test_result
      FROM control_testing_evidence e
      LEFT JOIN control_testing_results tr ON e.result_id = tr.result_id
      WHERE 1=1
    `
    const params: any[] = []
    let paramCount = 0

    if (resultId) {
      paramCount++
      query += ` AND e.result_id = $${paramCount}`
      params.push(resultId)
    }

    if (evidenceType) {
      paramCount++
      query += ` AND e.evidence_type = $${paramCount}`
      params.push(evidenceType)
    }

    query += ` ORDER BY e.upload_date DESC LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`
    params.push(limit, offset)

    const result = await tenantDb.query(query, params)

    // Get total count
    let countQuery = `
      SELECT COUNT(*) FROM control_testing_evidence e
      WHERE 1=1
    `
    const countParams: any[] = []
    let countParamCount = 0

    if (resultId) {
      countParamCount++
      countQuery += ` AND e.result_id = $${countParamCount}`
      countParams.push(resultId)
    }

    if (evidenceType) {
      countParamCount++
      countQuery += ` AND e.evidence_type = $${countParamCount}`
      countParams.push(evidenceType)
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
    console.error('Error fetching control testing evidence:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch control testing evidence' },
      { status: 500 }
    )
  }
})

// POST /api/audit/testing/evidence - Upload new evidence
export const POST = withContext(async ({ tenantDb }, request: NextRequest) => {
  try {
    const body = await request.json()
    const {
      evidence_id,
      result_id,
      evidence_type,
      evidence_name,
      evidence_description,
      file_path,
      file_size,
      file_type,
      uploaded_by,
      evidence_source,
      reliability_rating,
      relevance_rating,
      sufficiency_rating,
      confidentiality_level,
      retention_period,
      tags,
      metadata
    } = body

    const query = `
        INSERT INTO control_testing_evidence (
        evidence_id, result_id, evidence_type, evidence_name, evidence_description,
        file_path, file_size, file_type, uploaded_by, evidence_source,
        reliability_rating, relevance_rating, sufficiency_rating, confidentiality_level,
        retention_period, tags, metadata
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      ) RETURNING *
    `

    const result = await tenantDb.query(query, [
      evidence_id, result_id, evidence_type, evidence_name, evidence_description,
      file_path, file_size, file_type, uploaded_by, evidence_source,
      reliability_rating, relevance_rating, sufficiency_rating, confidentiality_level,
      retention_period, tags, metadata
    ])

    return NextResponse.json({
      success: true,
      data: result.rows[0]
    })
  } catch (error) {
    console.error('Error uploading evidence:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload evidence' },
      { status: 500 }
    )
  }
})