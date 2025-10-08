import { NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext"


export const GET = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) =>{
  try {
    const procedures = await tenantDb`
      SELECT 
        pr.*,
        p.title as policy_title,
        p.policy_id as policy_code,
        pc.name as category_name,
        pc.color as category_color,
        COUNT(pe.id) as execution_count,
        COUNT(CASE WHEN pe.status = 'completed' THEN 1 END) as completed_executions,
        COUNT(CASE WHEN pe.status = 'in_progress' THEN 1 END) as active_executions,
        MAX(pe.started_at) as last_execution
      FROM procedures pr
      LEFT JOIN policies p ON pr.policy_id = p.id
      LEFT JOIN policy_categories pc ON p.category_id = pc.id
      LEFT JOIN procedure_executions pe ON pr.id = pe.procedure_id
      GROUP BY pr.id, p.title, p.policy_id, pc.name, pc.color
      ORDER BY pr.created_at DESC
    `

    return NextResponse.json(procedures)
  } catch (error) {
    console.error("Error fetching procedures:", error)
    return NextResponse.json({ error: "Failed to fetch procedures" }, { status: 500 })
  }
});

export const POST = withContext(async({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const { title, description, policy_id, steps, roles_responsibilities, status } = body

    // Generate procedure ID
    const procedureIdResult = await tenantDb`
      SELECT COALESCE(MAX(CAST(SUBSTRING(procedure_id FROM 5) AS INTEGER)), 0) + 1 as next_id
      FROM procedures 
      WHERE procedure_id LIKE 'PROC%'
    ` as Record<string, any>[]
    const nextId = procedureIdResult[0].next_id
    const procedureId = `PROC${String(nextId).padStart(3, "0")}`

    const result = await tenantDb`
      INSERT INTO procedures (
        procedure_id, title, description, policy_id, steps, roles_responsibilities, status, version
      ) VALUES (
        ${procedureId}, ${title}, ${description}, ${policy_id}, ${JSON.stringify(steps)}, 
        ${JSON.stringify(roles_responsibilities)}, ${status}, '1.0'
      ) RETURNING *
    ` as Record<string, any>[]

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating procedure:", error)
    return NextResponse.json({ error: "Failed to create procedure" }, { status: 500 })
  }
});
