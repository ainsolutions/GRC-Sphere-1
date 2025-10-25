import { NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET = withContext(async ({ tenantDb }: HttpSessionContext, request) => {
  try {
    if (!tenantDb) {
      return NextResponse.json(
        { success: false, error: "Database not configured" },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const searchTerm = searchParams.get("q") || ""

    if (searchTerm.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    const frameworks = await tenantDb`
      SELECT 
        id,
        framework_name,
        version,
        description,
        effective_date,
        status,
        created_at
      FROM compliance_frameworks
      WHERE 
        framework_name ILIKE ${"%" + searchTerm + "%"}
        OR version ILIKE ${"%" + searchTerm + "%"}
        OR description ILIKE ${"%" + searchTerm + "%"}
      ORDER BY 
        CASE 
          WHEN framework_name ILIKE ${searchTerm + "%"} THEN 1
          WHEN framework_name ILIKE ${"%" + searchTerm + "%"} THEN 2
          ELSE 3
        END,
        framework_name ASC
      LIMIT 20
    `

    return NextResponse.json({
      success: true,
      data: Array.isArray(frameworks) ? frameworks : [frameworks],
    })
  } catch (error) {
    console.error("Error searching compliance frameworks:", error)
    return NextResponse.json(
      { success: false, error: "Failed to search frameworks" },
      { status: 500 }
    )
  }
})

