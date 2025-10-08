import { type NextRequest, NextResponse } from "next/server"
import { getDatabaseTableById, updateDatabaseTable, deleteDatabaseTable } from "@/lib/actions/database-table-actions"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"

export const GET = withContext(async (context: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number.parseInt(params.id)
    const result = await getDatabaseTableById(id)

    if (result.success) {
      return NextResponse.json(result.data)
    } else {
      return NextResponse.json({ error: result.error }, { status: 404 })
    }
  } catch (error) {
    console.error("Failed to fetch database table:", error)
    return NextResponse.json({ error: "Failed to fetch database table" }, { status: 500 })
  }
});

export const PUT = withContext(async (context: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number.parseInt(params.id)
    const formData = await request.formData()
    const result = await updateDatabaseTable(id, formData)

    if (result.success) {
      return NextResponse.json(result.data)
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Failed to update database table:", error)
    return NextResponse.json({ error: "Failed to update database table" }, { status: 500 })
  }
});

export const DELETE = withContext(async (context: HttpSessionContext, request, { params }: { params: { id: string } }) => {
  try {
    const id = Number.parseInt(params.id)
    const result = await deleteDatabaseTable(id)

    if (result.success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
  } catch (error) {
    console.error("Failed to delete database table:", error)
    return NextResponse.json({ error: "Failed to delete database table" }, { status: 500 })
  }
});
