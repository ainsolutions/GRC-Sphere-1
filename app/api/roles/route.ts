import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { getRoles, createRole } from "@/lib/actions/role-actions"
import { request } from "http"



export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    const roles = await tenantDb`
      SELECT r.*, 
             COUNT(DISTINCT ur.user_id) as user_count,
             COUNT(DISTINCT rp.id) as permission_count
      FROM roles r
      LEFT JOIN user_roles ur ON r.id = ur.role_id AND ur.is_active = TRUE
      LEFT JOIN role_permissions rp ON r.id = rp.role_id AND rp.granted = TRUE
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `

    return NextResponse.json({
      success: true,
      data: roles,
    })
  } catch (error) {
    console.error("Failed to fetch roles:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch roles", data: [] },
      { status: 500 }
    )
  }
})

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const formData = await request.formData()
    const result = await createRole(formData)

    if (result.success) {
      return NextResponse.json(result.data)
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Failed to create role:", error)
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 })
  }
});
