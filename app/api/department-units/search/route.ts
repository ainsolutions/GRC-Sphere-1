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

    // Search department units (departments with unit names or sub-departments)
    const units = await tenantDb`
      SELECT 
        d.id,
        d.name,
        d.department_unit,
        d.description,
        d.organization_id,
        d.department_head,
        d.parent_department_id,
        parent.name as parent_department_name,
        d.cost_center,
        d.location,
        d.status,
        d.email,
        d.phone
      FROM departments d
      LEFT JOIN departments parent ON d.parent_department_id = parent.id
      WHERE 
        d.department_unit ILIKE ${query} OR
        d.name ILIKE ${query} OR
        d.description ILIKE ${query} OR
        d.department_head ILIKE ${query} OR
        d.location ILIKE ${query}
      ORDER BY 
        CASE
          WHEN d.department_unit ILIKE ${searchTerm + '%'} THEN 1
          WHEN d.name ILIKE ${searchTerm + '%'} THEN 2
          WHEN d.department_head ILIKE ${searchTerm + '%'} THEN 3
          ELSE 4
        END,
        d.department_unit ASC,
        d.name ASC
      LIMIT 20
    `

    return NextResponse.json({
      success: true,
      data: units,
      count: units.length
    })
  } catch (error) {
    console.error("Error searching department units:", error)
    return NextResponse.json(
      { success: false, error: "Failed to search department units", data: [] },
      { status: 500 }
    )
  }
})

