import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { updateRole, deleteRole } from "@/lib/actions/role-actions"


export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number.parseInt(params.id)
    const formData = await request.formData()
    const result = await updateRole(id, formData)

    if (result.success) {
      return NextResponse.json(result.data)
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Failed to update role:", error)
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number.parseInt(params.id)
    const result = await deleteRole(id)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Failed to delete role:", error)
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 })
  }
});
