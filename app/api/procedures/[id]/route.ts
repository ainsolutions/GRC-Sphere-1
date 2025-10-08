import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) =>{
  try {
    const procedure = await tenantDb`
      SELECT 
        pr.*,
        p.title as policy_title,
        p.policy_id as policy_code,
        pc.name as category_name,
        pc.color as category_color
      FROM procedures pr
      LEFT JOIN policies p ON pr.policy_id = p.id
      LEFT JOIN policy_categories pc ON p.category_id = pc.id
      WHERE pr.id = ${params.id}
    ` as Record<string, any>[]

    if (procedure.length === 0) {
      return NextResponse.json({ error: "Procedure not found" }, { status: 404 })
    }

    return NextResponse.json(procedure[0])
  } catch (error) {
    console.error("Error fetching procedure:", error)
    return NextResponse.json({ error: "Failed to fetch procedure" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const body = await request.json()
    const { title, description, steps, roles_responsibilities, status } = body

    const result = await tenantDb`
      UPDATE procedures 
      SET 
        title = ${title},
        description = ${description},
        steps = ${JSON.stringify(steps)},
        roles_responsibilities = ${JSON.stringify(roles_responsibilities)},
        status = ${status},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${params.id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Procedure not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating procedure:", error)
    return NextResponse.json({ error: "Failed to update procedure" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const result = await tenantDb`
      DELETE FROM procedures 
      WHERE id = ${params.id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Procedure not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Procedure deleted successfully" })
  } catch (error) {
    console.error("Error deleting procedure:", error)
    return NextResponse.json({ error: "Failed to delete procedure" }, { status: 500 })
  }
});
