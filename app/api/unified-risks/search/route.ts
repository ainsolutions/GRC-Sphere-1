import { NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET = withContext(async ({ tenantDb }: HttpSessionContext, request: NextRequest) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get("q")

    if (!searchTerm || searchTerm.trim().length < 2) {
      return NextResponse.json({
        success: true,
        data: []
      })
    }

    const query = `%${searchTerm}%`

    // Search ISO27001 risks
    const iso27001Risks = await tenantDb`
      SELECT 
        id::text,
        risk_id,
        title,
        description,
        risk_level,
        'ISO27001' as source,
        category,
        status,
        likelihood,
        impact
      FROM iso27001_risks
      WHERE 
        risk_id ILIKE ${query} OR
        title ILIKE ${query} OR
        description ILIKE ${query} OR
        category ILIKE ${query}
      ORDER BY 
        CASE
          WHEN risk_id ILIKE ${searchTerm + '%'} THEN 1
          WHEN title ILIKE ${searchTerm + '%'} THEN 2
          ELSE 3
        END
      LIMIT 10
    `

    // Search NIST CSF risk templates
    const nistCsfRisks = await tenantDb`
      SELECT 
        id::text,
        template_id as risk_id,
        template_name as title,
        risk_description as description,
        risk_level,
        'NIST_CSF' as source,
        NULL as category,
        CASE WHEN is_active THEN 'Active' ELSE 'Inactive' END as status,
        default_likelihood as likelihood,
        default_impact as impact
      FROM nist_csf_risk_templates
      WHERE 
        template_id ILIKE ${query} OR
        template_name ILIKE ${query} OR
        risk_description ILIKE ${query}
      ORDER BY 
        CASE
          WHEN template_id ILIKE ${searchTerm + '%'} THEN 1
          WHEN template_name ILIKE ${searchTerm + '%'} THEN 2
          ELSE 3
        END
      LIMIT 10
    `

    // Search FAIR risks
    const fairRisks = await tenantDb`
      SELECT 
        id::text,
        risk_id,
        risk_title as title,
        risk_description as description,
        CASE 
          WHEN annual_loss_expectancy >= risk_tolerance * 2 THEN 'Critical'
          WHEN annual_loss_expectancy >= risk_tolerance THEN 'High'
          WHEN annual_loss_expectancy >= risk_tolerance * 0.5 THEN 'Medium'
          ELSE 'Low'
        END as risk_level,
        'FAIR' as source,
        NULL as category,
        treatment_status as status,
        NULL as likelihood,
        NULL as impact
      FROM fair_risks
      WHERE 
        risk_id ILIKE ${query} OR
        risk_title ILIKE ${query} OR
        risk_description ILIKE ${query} OR
        threat_actor ILIKE ${query} OR
        asset_id ILIKE ${query}
      ORDER BY 
        CASE
          WHEN risk_id ILIKE ${searchTerm + '%'} THEN 1
          WHEN risk_title ILIKE ${searchTerm + '%'} THEN 2
          ELSE 3
        END
      LIMIT 10
    `

    // Combine all results
    const allRisks = [
      ...iso27001Risks,
      ...nistCsfRisks,
      ...fairRisks
    ]

    // Sort combined results by relevance
    const sortedRisks = allRisks.sort((a, b) => {
      const aStarts = a.risk_id.toLowerCase().startsWith(searchTerm.toLowerCase()) || 
                      a.title.toLowerCase().startsWith(searchTerm.toLowerCase())
      const bStarts = b.risk_id.toLowerCase().startsWith(searchTerm.toLowerCase()) || 
                      b.title.toLowerCase().startsWith(searchTerm.toLowerCase())
      
      if (aStarts && !bStarts) return -1
      if (!aStarts && bStarts) return 1
      return 0
    })

    // Limit total results to 20
    const limitedRisks = sortedRisks.slice(0, 20)

    return NextResponse.json({
      success: true,
      data: limitedRisks,
      count: limitedRisks.length
    })
  } catch (error) {
    console.error("Error searching risks:", error)
    return NextResponse.json(
      { success: false, error: "Failed to search risks", data: [] },
      { status: 500 }
    )
  }
})

