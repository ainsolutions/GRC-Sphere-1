import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request) => {
  try {
    const categories = await tenantDb`
      SELECT 
        pc.*,
        COUNT(p.id) as policy_count
      FROM policy_categories pc
      LEFT JOIN policies p ON pc.id = p.category_id
      GROUP BY pc.id
      ORDER BY pc.name
    `

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching policy categories:", error)
    return NextResponse.json({ error: "Failed to fetch policy categories" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { name, description, color } = body

    const result = await tenantDb`
      INSERT INTO policy_categories (name, description, color)
      VALUES (${name}, ${description}, ${color})
      RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating policy category:", error)
    return NextResponse.json({ error: "Failed to create policy category" }, { status: 500 })
  }
});
