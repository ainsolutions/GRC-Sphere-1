import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid evidence ID" }, { status: 400 })
    }

    const [evidence] = await tenantDb`
      SELECT file_data, file_name, file_type
      FROM iso27001_evidence 
      WHERE id = ${Number(id)}
    ` as Record<string, any>[]

    if (!evidence) {
      return NextResponse.json({ error: "Evidence not found" }, { status: 404 })
    }

    // Convert base64 back to buffer
    const buffer = Buffer.from(evidence.file_data, "base64")

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": evidence.file_type,
        "Content-Disposition": `attachment; filename="${evidence.file_name}"`,
      },
    })
  } catch (error: any) {
    console.error("Error downloading evidence:", error)
    return NextResponse.json({ error: "Failed to download evidence", details: error.message }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid evidence ID" }, { status: 400 })
    }

    const result = await tenantDb`
      DELETE FROM iso27001_evidence 
      WHERE id = ${Number(id)}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Evidence not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Evidence deleted successfully" })
  } catch (error: any) {
    console.error("Error deleting evidence:", error)
    return NextResponse.json({ error: "Failed to delete evidence", details: error.message }, { status: 500 })
  }
});
