import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


interface RiskResult {
  id: string
  title: string
  description: string
  category: string
  source: string
  risk_level?: string
  status?: string
  table: string
}

export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "20"), 50) // Max 50 results

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        risks: [],
        message: "Query must be at least 2 characters long"
      })
    }

    const searchTerm = `%${query.toLowerCase()}%`
    const results: RiskResult[] = []

    // Search ISO27001 Risks
    try {
      const iso27001Results = await tenantDb`
        SELECT
          id::text as id,
          title,
          description,
          category,
          'iso27001' as source,
          risk_level,
          status,
          'iso27001_risks' as table_name
        FROM iso27001_risks
        WHERE LOWER(title) LIKE ${searchTerm}
        ORDER BY title
        LIMIT ${Math.ceil(limit / 5)}
      ` as Record<string, any>[]
      results.push(...iso27001Results.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description || "",
        category: row.category || "ISO27001",
        source: "ISO27001",
        risk_level: row.risk_level,
        status: row.status,
        table: row.table_name
      })))
    } catch (error) {
      console.warn("Error searching ISO27001 risks:", error)
    }

    // Search NIST CSF Risk Templates
    try {
      const nistResults = await tenantDb`
        SELECT
          id::text as id,
          template_name as title,
          risk_description as description,
          'NIST CSF' as category,
          'nist_csf' as source,
          risk_level,
          'active' as status,
          'nist_csf_risk_templates' as table_name
        FROM nist_csf_risk_templates
        WHERE LOWER(template_name) LIKE ${searchTerm} AND is_active = true
        ORDER BY template_name
        LIMIT ${Math.ceil(limit / 5)}
      ` as Record<string, any>[]
      results.push(...nistResults.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description || "",
        category: row.category,
        source: "NIST CSF",
        risk_level: row.risk_level,
        status: row.status,
        table: row.table_name
      })))
    } catch (error) {
      console.warn("Error searching NIST CSF risk templates:", error)
    }

    // Search FAIR Risks
    try {
      const fairResults = await tenantDb`
        SELECT
          id::text as id,
          risk_title as title,
          risk_description as description,
          'FAIR' as category,
          'fair' as source,
          NULL as risk_level,
          treatment_status as status,
          'fair_risks' as table_name
        FROM fair_risks
        WHERE LOWER(risk_title) LIKE ${searchTerm}
        ORDER BY risk_title
        LIMIT ${Math.ceil(limit / 5)}
      ` as Record<string, any>[]
      results.push(...fairResults.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description || "",
        category: row.category,
        source: "FAIR",
        risk_level: row.risk_level,
        status: row.status,
        table: row.table_name
      })))
    } catch (error) {
      console.warn("Error searching FAIR risks:", error)
    }

    // Search Technology Risks
    try {
      const techResults = await tenantDb`
        SELECT
          id::text as id,
          title,
          description,
          technology_category as category,
          'technology' as source,
          NULL as risk_level,
          status,
          'technology_risks' as table_name
        FROM technology_risks
        WHERE LOWER(title) LIKE ${searchTerm}
        ORDER BY title
        LIMIT ${Math.ceil(limit / 5)}
      ` as Record<string, any>[]
      results.push(...techResults.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description || "",
        category: row.category || "Technology",
        source: "Technology",
        risk_level: row.risk_level,
        status: row.status,
        table: row.table_name
      })))
    } catch (error) {
      console.warn("Error searching technology risks:", error)
    }

    // Search Sphere AI Risks
    try {
      const sphereResults = await tenantDb`
        SELECT
          id::text as id,
          title,
          description,
          category,
          'sphere_ai' as source,
          ai_risk_level as risk_level,
          status,
          'sphere_ai_risks' as table_name
        FROM sphere_ai_risks
        WHERE LOWER(title) LIKE ${searchTerm}
        ORDER BY title
        LIMIT ${Math.ceil(limit / 5)}
      ` as Record<string, any>[]
      results.push(...sphereResults.map((row: any) => ({
        id: row.id,
        title: row.title,
        description: row.description || "",
        category: row.category || "AI",
        source: "Sphere AI",
        risk_level: row.risk_level,
        status: row.status,
        table: row.table_name
      })))
    } catch (error) {
      console.warn("Error searching sphere AI risks:", error)
    }

    // Sort results by relevance (title match first, then alphabetical)
    results.sort((a, b) => {
      const aStartsWith = a.title.toLowerCase().startsWith(query.toLowerCase())
      const bStartsWith = b.title.toLowerCase().startsWith(query.toLowerCase())

      if (aStartsWith && !bStartsWith) return -1
      if (!aStartsWith && bStartsWith) return 1

      return a.title.localeCompare(b.title)
    })

    // Limit total results
    const limitedResults = results.slice(0, limit)

    return NextResponse.json({
      success: true,
      risks: limitedResults,
      total: limitedResults.length,
      query: query
    })

  } catch (error: any) {
    console.error("Error searching risks:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to search risks",
        details: error.message,
        risks: []
      },
      { status: 500 }
    )
  }
});
