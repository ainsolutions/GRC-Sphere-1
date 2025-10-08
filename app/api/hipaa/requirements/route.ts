import { type NextRequest, NextResponse } from "next/server"
import { withContext, HttpSessionContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }: HttpSessionContext, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const priority = searchParams.get("priority")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const whereConditions = []

    if (category && category !== "all") {
      whereConditions.push(`category = '${category}'`)
    }
    if (priority && priority !== "all") {
      whereConditions.push(`priority = '${priority}'`)
    }
    if (status && status !== "all") {
      whereConditions.push(`status = '${status}'`)
    }
    if (search) {
      whereConditions.push(
        `(title ILIKE '%${search}%' OR description ILIKE '%${search}%' OR requirement_id ILIKE '%${search}%')`,
      )
    }

    let requirements
    if (whereConditions.length > 0) {
      const whereClause = whereConditions.join(" AND ")
      requirements = await tenantDb`
        SELECT * FROM hipaa_requirements 
        WHERE ${tenantDb.unsafe(whereClause)}
        ORDER BY category, requirement_id
      `
    } else {
      requirements = await tenantDb`
        SELECT * FROM hipaa_requirements 
        ORDER BY category, requirement_id
      `
    }

    return NextResponse.json(requirements)
  } catch (error) {
    console.error("Error fetching HIPAA requirements:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch HIPAA requirements",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
});

export const POST = withContext(async({ tenantDb }: HttpSessionContext, request) => {
  try {
    const body = await request.json()
    const { requirement_id, title, description, category, priority, status } = body

    const result = await tenantDb`
      INSERT INTO hipaa_requirements (requirement_id, title, description, category, priority, status)
      VALUES (${requirement_id}, ${title}, ${description}, ${category}, ${priority}, ${status})
      RETURNING *
    ` as Record <string, any>[]

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error creating HIPAA requirement:", error)
    return NextResponse.json({ error: "Failed to create HIPAA requirement" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }: HttpSessionContext, request) => {
  try {
    const body = await request.json()
    const { id, requirement_id, title, description, category, priority, status } = body

    const result = await tenantDb`
      UPDATE hipaa_requirements 
      SET requirement_id = ${requirement_id}, title = ${title}, description = ${description}, 
          category = ${category}, priority = ${priority}, status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    ` as Record <string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "HIPAA requirement not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating HIPAA requirement:", error)
    return NextResponse.json({ error: "Failed to update HIPAA requirement" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }: HttpSessionContext, request) => {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID parameter is required" }, { status: 400 })
    }

    const result = await tenantDb`
      DELETE FROM hipaa_requirements WHERE id = ${id} RETURNING *
    ` as Record <string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "HIPAA requirement not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "HIPAA requirement deleted successfully" })
  } catch (error) {
    console.error("Error deleting HIPAA requirement:", error)
    return NextResponse.json({ error: "Failed to delete HIPAA requirement" }, { status: 500 })
  }
});
