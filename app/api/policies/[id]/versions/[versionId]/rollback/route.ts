import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext";


export const POST = withContext(async({ tenantDb }, request, { params }: { params: { id: string; versionId: string } })  => {
  try {
    const result = await tenantDb`
      SELECT rollback_policy_version(${params.id}::INTEGER, ${params.versionId}::INTEGER) as success
    ` as Record<string, boolean>[]

    if (result[0].success) {
      return NextResponse.json({ message: "Policy rolled back successfully" })
    } else {
      return NextResponse.json({ error: "Failed to rollback policy" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error rolling back policy:", error)
    return NextResponse.json({ error: "Failed to rollback policy" }, { status: 500 })
  }
});
