import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { getPermissionById, updatePermission, deletePermission } from "@/lib/actions/permission-actions"

export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number.parseInt(params.id)
    const result = await getPermissionById(id)

    if (result.success) {
      return NextResponse.json(result.data)
    } else {
      return NextResponse.json({ error: result.error }, { status: 404 })
    }
  } catch (error) {
    console.error("Failed to fetch permission:", error)
    return NextResponse.json({ error: "Failed to fetch permission" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number.parseInt(params.id)
    const formData = await request.formData()
    const result = await updatePermission(id, formData)

    if (result.success) {
      return NextResponse.json(result.data)
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Failed to update permission:", error)
    return NextResponse.json({ error: "Failed to update permission" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number.parseInt(params.id)
    const result = await deletePermission(id)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Failed to delete permission:", error)
    return NextResponse.json({ error: "Failed to delete permission" }, { status: 500 })
  }
});
