import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext( async ({ tenantDb },request) => {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit") || "10"
    const analysisType = searchParams.get("analysis_type")

    let query = tenantDb`
      SELECT id, analysis_type, analysis_content, created_at, updated_at
      FROM ai_analysis_results
    `

    if (analysisType) {
      query = tenantDb`
        SELECT id, analysis_type, analysis_content, created_at, updated_at
        FROM ai_analysis_results
        WHERE analysis_type = ${analysisType}
        ORDER BY created_at DESC
        LIMIT ${Number.parseInt(limit)}
      `
    } else {
      query = tenantDb`
        SELECT id, analysis_type, analysis_content, created_at, updated_at
        FROM ai_analysis_results
        ORDER BY created_at DESC
        LIMIT ${Number.parseInt(limit)}
      `
    }

    const results = await query

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error("Error fetching AI analysis results:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch AI analysis results",
      },
      { status: 500 },
    )
  }
});

export const POST = withContext( async({ tenantDb },request) => {
  try {
    const body = await request.json()
    const { analysis_type, analysis_content } = body

    if (!analysis_type || !analysis_content) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: analysis_type and analysis_content",
        },
        { status: 400 },
      )
    }

    const result = await tenantDb`
      INSERT INTO ai_analysis_results (analysis_type, analysis_content)
      VALUES (${analysis_type}, ${analysis_content})
      RETURNING id, analysis_type, analysis_content, created_at, updated_at
    `;
    const resultObj = result as Record<string, any>[];

    return NextResponse.json({
      success: true,
      data: resultObj[0],
    })
  } catch (error) {
    console.error("Error saving AI analysis result:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save AI analysis result",
      },
      { status: 500 },
    )
  }
});
