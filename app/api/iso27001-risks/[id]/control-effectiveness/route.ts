import { type NextRequest, NextResponse } from "next/server"
import { withContext } from "@/lib/HttpContext" 


export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    // pull the risk id from the dynamic segment in the URL
    const { pathname } = new URL(request.url);
    // pathname example: /api/iso27001-risks/123/control-effectiveness
    const parts = pathname.split("/");
    const riskId = Number(parts[parts.indexOf("iso27001-risks") + 1]);

    if (Number.isNaN(riskId)) {
      return NextResponse.json(
        { error: "Invalid risk id" },
        { status: 400 }
      );
    }

    // ✅ actual business logic from the action:
    const effectiveness = await tenantDb`
      SELECT 
        rc.id,
        rc.risk_id,
        rc.control_id as control_id,
        rc.effectiveness,
        rc.implementation_status,
        rc.created_at::text
      FROM iso27001_risk_controls rc
      JOIN iso27001_controls c ON rc.control_id = c.id
      WHERE rc.risk_id = ${riskId}
      ORDER BY c.control_id
    `;

    return NextResponse.json(effectiveness);
  } catch (error) {
    console.error("Error fetching control effectiveness:", error);
    return NextResponse.json(
      { error: "Failed to fetch control effectiveness" },
      { status: 500 }
    );
  }
});

export const PUT = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params
    const body = await request.json()

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid risk ID" }, { status: 400 })
    }

    const { control_id, effectiveness, implementation_status } = body

    if (!control_id || effectiveness === undefined) {
      return NextResponse.json({ error: "Missing required fields: control_id, effectiveness" }, { status: 400 })
    }

    // Upsert the control effectiveness record
    const result = await tenantDb`
      INSERT INTO iso27001_control_effectiveness (risk_id, control_id, effectiveness, implementation_status)
      VALUES (${Number(id)}, ${control_id}, ${effectiveness}, ${implementation_status || "Not Started"})
      ON CONFLICT (risk_id, control_id) 
      DO UPDATE SET 
        effectiveness = EXCLUDED.effectiveness,
        implementation_status = EXCLUDED.implementation_status,
        updated_at = CURRENT_TIMESTAMP
      RETURNING 
        control_id,
        effectiveness,
        implementation_status,
        created_at::text,
        updated_at::text
    ` as Record<string, any>[]

    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("Error updating control effectiveness:", error)
    return NextResponse.json(
      { error: "Failed to update control effectiveness", details: error.message },
      { status: 500 },
    )
  }
});

export const DELETE = withContext(async({ tenantDb }, request, { params }: { params: { id: string } }) => {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const control_id = searchParams.get("control_id")

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid risk ID" }, { status: 400 })
    }

    if (!control_id) {
      return NextResponse.json({ error: "Missing control_id parameter" }, { status: 400 })
    }

    const result = await tenantDb`
      DELETE FROM iso27001_control_effectiveness 
      WHERE risk_id = ${Number(id)} AND control_id = ${control_id}
      RETURNING *
    ` as Record<string, any>[]

    if (result.length === 0) {
      return NextResponse.json({ error: "Control effectiveness record not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Control effectiveness deleted successfully",
      data: result[0],
    })
  } catch (error: any) {
    console.error("Error deleting control effectiveness:", error)
    return NextResponse.json(
      { error: "Failed to delete control effectiveness", details: error.message },
      { status: 500 },
    )
  }
});
