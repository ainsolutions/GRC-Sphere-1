import { type NextRequest, NextResponse } from "next/server"
import { createDatabaseTable } from "@/lib/actions/database-table-actions"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    const tables = await tenantDb`
      SELECT dt.*, 
             COUNT(DISTINCT tp.role_id) as role_count
      FROM database_tables dt
      LEFT JOIN table_permissions tp ON dt.id = tp.table_id
      GROUP BY dt.id
      ORDER BY dt.module, dt.display_name
    `

    return NextResponse.json({
      success: true,
      data: tables,
    })
  } catch (error) {
    console.error("Failed to fetch database tables:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch database tables", data: [] },
      { status: 500 }
    )
  }
});

export const POST = withContext(async (context: HttpSessionContext, request) => {
  try {
    const formData = await request.formData()
    const result = await createDatabaseTable(formData)

    if (result.success) {
      return NextResponse.json(result.data, { status: 201 })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Failed to create database table:", error)
    return NextResponse.json({ error: "Failed to create database table" }, { status: 500 })
  }
});
