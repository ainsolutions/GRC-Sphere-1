import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"
import { getPermissionUsage } from "@/lib/actions/permission-actions"

export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number.parseInt(params.id)
    const result = await getPermissionUsage(id)
    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Failed to fetch permission usage:", error)
    return NextResponse.json({ error: "Failed to fetch permission usage" }, { status: 500 })
  }
});
