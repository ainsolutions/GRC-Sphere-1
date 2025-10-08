import { NextResponse } from "next/server";
import { withContext, HttpSessionContext } from "@/lib/HttpContext";
import { getIncidents } from "@/lib/actions/incident-actions";

export const GET = withContext(async (ctx: HttpSessionContext) => {
  try {
    const data = await getIncidents(ctx); // ctx provides tenantDb
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Error fetching incidents:", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
});


export const POST = withContext(async ({ tenantDb }, request) => {
  try {
    const body = await request.json()
    const result = await tenantDb`
      INSERT INTO incidents (title, description, severity, status)
      VALUES (${body.title}, ${body.description}, ${body.severity}, ${body.status})
      RETURNING *
    ` as Record<string, any>[]
    return NextResponse.json({ success: true, data: result[0] })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
})