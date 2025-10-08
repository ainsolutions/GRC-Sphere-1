import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"



export const GET = withContext(async({ tenantDb }) => {
  try {
    const gapAnalyses = await tenantDb`
      SELECT 
        mga.*,
        COUNT(mgai.id) as total_gaps,
        COUNT(CASE WHEN mgai.severity = 'critical' THEN 1 END) as critical_gaps,
        COUNT(CASE WHEN mgai.severity = 'high' THEN 1 END) as high_gaps,
        COUNT(CASE WHEN mgai.severity = 'medium' THEN 1 END) as medium_gaps,
        COUNT(CASE WHEN mgai.severity = 'low' THEN 1 END) as low_gaps,
        SUM(mgai.estimated_cost) as total_estimated_cost,
        COUNT(CASE WHEN mgai.status = 'closed' THEN 1 END) as closed_gaps
      FROM mica_gap_analysis mga
      LEFT JOIN mica_gap_analysis_items mgai ON mga.id = mgai.gap_analysis_id
      GROUP BY mga.id
      ORDER BY mga.created_at DESC
    `

    return NextResponse.json(gapAnalyses)
  } catch (error) {
    console.error("Error fetching MICA gap analyses:", error)
    return NextResponse.json({ error: "Failed to fetch MICA gap analyses" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const {
      analysis_name,
      description,
      baseline_assessment_id,
      target_maturity_level,
      analysis_scope,
      analyst_name,
      analyst_email,
    } = body

    const result = await tenantDb`
      INSERT INTO mica_gap_analysis (
        analysis_name,
        description,
        baseline_assessment_id,
        target_maturity_level,
        analysis_scope,
        analyst_name,
        analyst_email,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${analysis_name},
        ${description},
        ${baseline_assessment_id},
        ${target_maturity_level},
        ${analysis_scope},
        ${analyst_name},
        ${analyst_email},
        'draft',
        NOW(),
        NOW()
      )
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating MICA gap analysis:", error)
    return NextResponse.json({ error: "Failed to create MICA gap analysis" }, { status: 500 })
  }
});
