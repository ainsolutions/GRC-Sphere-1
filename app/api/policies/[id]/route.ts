import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"

export const GET = withContext(async({ tenantDb }, request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    
    const policy = await tenantDb`
      SELECT 
        p.*,
        pc.name as category_name,
        pc.color as category_color
      FROM policies p
      LEFT JOIN policy_categories pc ON p.category_id = pc.id
      WHERE p.id = ${id}::INTEGER
    ` as Record<string, any>[]

    if (policy.length === 0) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 })
    }

    return NextResponse.json(policy[0])
  } catch (error) {
    console.error("Error fetching policy:", error)
    return NextResponse.json({ error: "Failed to fetch policy" }, { status: 500 })
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      title,
      description,
      content,
      category_id,
      status,
      effective_date,
      review_date,
      next_review_date,
      tags,
      updated_by = 1,
    } = body

    const result = await tenantDb`
      UPDATE policies SET
        title = ${title},
        description = ${description},
        content = ${content},
        category_id = ${category_id},
        status = ${status},
        effective_date = ${effective_date},
        review_date = ${review_date},
        next_review_date = ${next_review_date},
        tags = ${tags},
        updated_by = ${updated_by},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}::INTEGER
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 })
    }

    // Log activity
    await tenantDb`
      INSERT INTO policy_activities (policy_id, activity_type, description, user_id)
      VALUES (${id}::INTEGER, 'updated', 'Policy updated', ${updated_by})
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error updating policy:", error)
    return NextResponse.json({ error: "Failed to update policy" }, { status: 500 })
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await params
    
    const result = await tenantDb`
      DELETE FROM policies WHERE id = ${id}::INTEGER
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Policy not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Policy deleted successfully" })
  } catch (error) {
    console.error("Error deleting policy:", error)
    return NextResponse.json({ error: "Failed to delete policy" }, { status: 500 })
  }
});
