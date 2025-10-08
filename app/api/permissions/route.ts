import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { createPermission } from "@/lib/actions/permission-actions"

export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    const permissions = await tenantDb`
      SELECT p.*, 
             COUNT(DISTINCT rp.role_id) as role_count
      FROM permissions p
      LEFT JOIN role_permissions rp 
        ON p.id = rp.permission_id 
       AND rp.granted = TRUE
      GROUP BY p.id
      ORDER BY p.permission_type, p.name
    `

    return NextResponse.json({
      success: true,
      data: permissions,
    })
  } catch (error) {
    console.error("Failed to fetch permissions:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch permissions", data: [] },
      { status: 500 }
    )
  }
})

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const formData = await request.formData()
    const result = await createPermission(formData)

    if (result.success) {
      return NextResponse.json(result.data, { status: 201 })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Failed to create permission:", error)
    return NextResponse.json({ error: "Failed to create permission" }, { status: 500 })
  }
});
