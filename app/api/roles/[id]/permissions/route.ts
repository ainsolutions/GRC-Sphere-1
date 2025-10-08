import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { getRolePermissions, updateRolePermissions } from "@/lib/actions/role-actions"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const roleId = Number.parseInt(params.id)
    const result = await getRolePermissions(roleId)
    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Failed to fetch role permissions:", error)
    return NextResponse.json({ error: "Failed to fetch role permissions" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const roleId = Number.parseInt(params.id)
    const { permissions } = await request.json()
    const result = await updateRolePermissions(roleId, permissions)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Failed to update role permissions:", error)
    return NextResponse.json({ error: "Failed to update role permissions" }, { status: 500 })
  }
});
