import { NextResponse } from "next/server";
import { withContext } from "@/lib/HttpContext";
import { AuditLogger, AUDIT_ACTIONS } from "@/lib/audit-logger";

export const GET = withContext(async ({ tenantDb }, request) => {
  try {
    debugger;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const offset = parseInt(searchParams.get("offset") || "0");
    const status = searchParams.get("status");

    let query;
    if (status) {
      query = tenantDb`
        SELECT i.*, ia.asset_name, r.title as risk_title
        FROM incidents i
        LEFT JOIN information_assets ia ON i.related_asset_id = ia.id
        LEFT JOIN iso27001_risks r ON i.related_risk_id = r.id
        WHERE i.status = ${status}
        ORDER BY i.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      query = tenantDb`
        SELECT i.*, ia.asset_name, r.title as risk_title
        FROM incidents i
        LEFT JOIN information_assets ia ON i.related_asset_id = ia.id
        LEFT JOIN iso27001_risks r ON i.related_risk_id = r.id
        ORDER BY i.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    const incidents = await query;
    return NextResponse.json({ success: true, data: incidents });
  } catch (error: any) {
    console.error("❌ GET /api/incidents error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to get incidents" },
      { status: 500 }
    );
  }
});

export const POST = withContext(async ({ tenantDb, userId }, request) => {
  try {
    debugger;
    const body = await request.json();
    console.log("POST /api/incidents body:", body);

    // Validate required fields
    if (!body.incident_title) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }

    const [newIncident] = await tenantDb`
      INSERT INTO incidents (
        incident_id,incident_title, incident_description, incident_type, severity, status,reported_by, reported_date, assigned_to, 
        detected_date, related_asset_id, related_risk_id
      ) VALUES (
        ${body.incident_id},${body.incident_title}, ${body.incident_description || null}, ${body.incident_type || null}, ${body.severity || "medium"},
        ${body.status || "open"}, ${body.reported_by || ""}, ${body.reported_date || null}, ${body.assigned_to || ""}, 
        ${body.detected_date || null}, ${body.related_asset_id || null}, 
        ${body.related_risk_id || null}
      )
      RETURNING *
    `;

    await AuditLogger.log({
      userId: userId,
      userEmail: "system@company.com",
      action: AUDIT_ACTIONS.CREATE,
      entityType: "INCIDENT",
      entityId: newIncident.id.toString(),
      newValues: body,
    }, tenantDb);

    return NextResponse.json({ success: true, data: newIncident });
  } catch (error: any) {
    console.error("❌ POST /api/incidents error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create incident" },
      { status: 500 }
    );
  }
});