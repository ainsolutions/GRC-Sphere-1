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

    // Search departments
    const departments = await tenantDb`
      SELECT 
        id,
        name,
        description,
        organization_id,
        department_head,
        cost_center,
        location,
        status,
        email,
        phone
      FROM departments
      WHERE 
        name ILIKE ${query} OR
        description ILIKE ${query} OR
        department_head ILIKE ${query} OR
        cost_center ILIKE ${query} OR
        location ILIKE ${query}
      ORDER BY 
        CASE
          WHEN name ILIKE ${searchTerm + '%'} THEN 1
          WHEN department_head ILIKE ${searchTerm + '%'} THEN 2
          ELSE 3
        END,
        name ASC
      LIMIT 20
    `

    return NextResponse.json({
      success: true,
      data: departments,
      count: departments.length
    })
  } catch (error) {
    console.error("Error searching departments:", error)
    return NextResponse.json(
      { success: false, error: "Failed to search departments", data: [] },
      { status: 500 }
    )
  }
})

